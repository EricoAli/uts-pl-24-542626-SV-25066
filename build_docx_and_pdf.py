import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._element.get_or_add_tcPr().append(shading_elm)

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
    tcPr = cell._element.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    borders = {'top': top, 'bottom': bottom, 'left': left, 'right': right}
    for border_name, border_style in borders.items():
        if border_style:
            b_elm = parse_xml(f'<w:{border_name} {nsdecls("w")} w:val="{border_style.get("val", "single")}" w:sz="{border_style.get("sz", "4")}" w:space="0" w:color="{border_style.get("color", "auto")}"/>')
            tcBorders.append(b_elm)
        else:
            b_elm = parse_xml(f'<w:{border_name} {nsdecls("w")} w:val="none"/>')
            tcBorders.append(b_elm)
    tcPr.append(tcBorders)

def add_heading_1(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)
    return h

def add_heading_2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(10)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(30, 41, 59)
    return h

def add_paragraph(doc, text, bold_prefix=None, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Times New Roman'
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(15, 23, 42)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)
    run.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_callout(doc, text, title=None):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.5)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, 'F1F5F9')
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    set_cell_borders(cell, left={'val': 'single', 'sz': '24', 'color': '2563EB'})
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    if title:
        r_title = p.add_run(f"📌 {title}\n")
        r_title.font.name = 'Times New Roman'
        r_title.font.size = Pt(10.5)
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(30, 58, 138)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(10)
    run.font.color.rgb = RGBColor(51, 65, 85)
    
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(4)

def add_image_with_caption(doc, img_path, caption):
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(3)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(6.3))

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(10)
    p_cap.paragraph_format.keep_with_next = False
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True
    r_cap.font.color.rgb = RGBColor(71, 85, 105)

def build_document():
    doc = docx.Document()

    # Set page margins to standard 2.54 cm (1 inch)
    section = doc.sections[0]
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

    # -------------------------------------------------------------
    # COVER PAGE
    # -------------------------------------------------------------
    p_cov_top = doc.add_paragraph()
    p_cov_top.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov_top.paragraph_format.space_after = Pt(2)
    r1 = p_cov_top.add_run("LAPORAN PRAKTIKUM PERTEMUAN 10\n")
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(14)
    r1.font.bold = True
    r2 = p_cov_top.add_run("KONSTRUKSI DAN EVOLUSI PERANGKAT LUNAK\n\n")
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(13)
    r2.font.bold = True

    r3 = p_cov_top.add_run("LOGGING TERSTRUKTUR, ENDPOINT /HEALTH, DAN\nHEALTHCHECK REAKTIF DUA ARAH PADA DOCKER COMPOSE\n")
    r3.font.name = 'Times New Roman'
    r3.font.size = Pt(15)
    r3.font.bold = True
    r3.font.color.rgb = RGBColor(30, 58, 138)

    # UGM Logo
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(16)
    p_logo.paragraph_format.space_after = Pt(20)
    if os.path.exists('ugm_logo.png'):
        p_logo.add_run().add_picture('ugm_logo.png', width=Inches(2.1))

    p_disusun = doc.add_paragraph()
    p_disusun.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_disusun.paragraph_format.space_after = Pt(6)
    r_disusun = p_disusun.add_run("Disusun oleh:")
    r_disusun.font.name = 'Times New Roman'
    r_disusun.font.size = Pt(11)
    r_disusun.font.italic = True

    # Student Info Table
    tbl_ident = doc.add_table(rows=4, cols=3)
    tbl_ident.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_ident.autofit = False
    col_widths = [Inches(1.8), Inches(0.2), Inches(3.2)]
    
    ident_data = [
        ("Nama", ":", "Erico Ali Gutama"),
        ("NIM", ":", "24/542626/SV/25066"),
        ("Kelas", ":", "B1"),
        ("Dosen Pengampu", ":", "Galih Malela Damaraji")
    ]

    for row_idx, row in enumerate(tbl_ident.rows):
        for col_idx, cell in enumerate(row.cells):
            cell.width = col_widths[col_idx]
            set_cell_borders(cell)
            set_cell_margins(cell, top=40, bottom=40, left=60, right=60)
            p_cell = cell.paragraphs[0]
            p_cell.paragraph_format.space_after = Pt(0)
            r_c = p_cell.add_run(ident_data[row_idx][col_idx])
            r_c.font.name = 'Times New Roman'
            r_c.font.size = Pt(11)
            if col_idx == 0:
                r_c.font.bold = True

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(36)
    p_inst.paragraph_format.space_after = Pt(0)
    p_inst.paragraph_format.line_spacing = 1.15
    r_inst = p_inst.add_run(
        "PROGRAM STUDI D-IV TEKNOLOGI REKAYASA PERANGKAT LUNAK\n"
        "DEPARTEMEN TEKNIK ELEKTRO DAN INFORMATIKA\n"
        "SEKOLAH VOKASI\n"
        "UNIVERSITAS GADJAH MADA\n"
        "YOGYAKARTA\n"
        "2026"
    )
    r_inst.font.name = 'Times New Roman'
    r_inst.font.size = Pt(11)
    r_inst.font.bold = True

    doc.add_page_break()

    # -------------------------------------------------------------
    # BAB I: PENGALIHAN LOG LARAVEL KE STDOUT (SOAL 1)
    # -------------------------------------------------------------
    add_heading_1(doc, "BAB I. PENGALIHAN LOG LARAVEL KE STDOUT (SOAL 1)")
    
    add_paragraph(doc, 
        "Dalam metodologi pengembangan aplikasi modern berbasis kontainer (sebagaimana dirumuskan dalam prinsip The Twelve-Factor App butir XI: Logs as Event Streams), aplikasi tidak boleh membebankan dirinya untuk mengelola, merotasi, atau menyimpan berkas log ke dalam sistem berkas (filesystem) lokal kontainer. Hal ini dikarenakan kontainer bersifat efemeral (sementara), sehingga penulisan berkas log lokal di dalam kontainer akan menyulitkan agregasi log, memakan kapasitas disk kontainer secara tidak terkontrol, serta mempersulit observabilitas sistem secara real-time.",
        bold_prefix="1.1 Prinsip Desain Log sebagai Aliran Peristiwa (Event Streams): "
    )

    add_paragraph(doc,
        "Untuk memenuhi kebutuhan tersebut, konfigurasi logging aplikasi Laravel dialihkan secara penuh dari channel stack/single (yang secara default menulis ke storage/logs/laravel.log) menuju aliran standar output (php://stdout). Perubahan ini diimplementasikan melalui beberapa berkas utama:",
        bold_prefix="1.2 Modifikasi Konfigurasi Backend: "
    )

    add_paragraph(doc,
        "Menambahkan channel stdout pada daftar channels dengan StreamHandler yang mengarah ke 'php://stdout', serta menetapkan channel default aplikasi melalui env('LOG_CHANNEL', 'stdout').",
        bold_prefix="• backend/config/logging.php: "
    )

    add_paragraph(doc,
        "Mendefinisikan LOG_CHANNEL=stdout dan LOG_LEVEL=debug agar seluruh tingkatan pesan aplikasi disalurkan langsung ke standar output proses.",
        bold_prefix="• .env dan .env.example (Root & Backend): "
    )

    add_paragraph(doc,
        "Meneruskan variabel lingkungan LOG_CHANNEL: ${LOG_CHANNEL:-stdout} dan LOG_LEVEL: ${LOG_LEVEL:-debug} ke dalam service pos_backend, serta mengaktifkan flag --access-log pada FrankenPHP server sehingga log aplikasi dan log akses HTTP disatukan ke aliran stdout proses utama kontainer.",
        bold_prefix="• docker-compose.yml: "
    )

    add_callout(doc,
        "Konfigurasi Saluran Log STDOUT di config/logging.php:\n"
        "'stdout' => [\n"
        "    'driver' => 'monolog',\n"
        "    'level' => env('LOG_LEVEL', 'debug'),\n"
        "    'handler' => StreamHandler::class,\n"
        "    'handler_with' => [\n"
        "        'stream' => 'php://stdout',\n"
        "    ],\n"
        "    'formatter' => env('LOG_STDOUT_FORMATTER'),\n"
        "    'processors' => [PsrLogMessageProcessor::class],\n"
        "],",
        title="Snippet Konfigurasi Monolog STDOUT"
    )

    add_image_with_caption(doc,
        'docs/ss_p10_1_stdout_logging.png',
        'Gambar 1.1: Pembuktian Log Laravel Mengalir ke STDOUT via docker compose logs dan Berkas Lokal Tidak Ditulisi'
    )

    add_paragraph(doc,
        "Berdasarkan Gambar 1.1, terbukti bahwa ketika aplikasi menangani permintaan HTTP maupun proses internal, log langsung tertangkap di docker compose logs backend. Pada pengujian verifikasi berkas di dalam kontainer melalui perintah 'docker compose exec backend ls -la storage/logs', berkas laravel.log menunjukkan timestamp lama tanpa ada pembaruan ukuran (tidak ada penulisan log ke disk kontainer), membuktikan keberhasilan pengalihan ke stdout 100%.",
        bold_prefix="1.3 Bukti dan Analisis Output: "
    )

    # -------------------------------------------------------------
    # BAB II: TIGA LOG TERSTRUKTUR DAN BERKONTEKS (SOAL 2)
    # -------------------------------------------------------------
    add_heading_1(doc, "BAB II. LOG TERSTRUKTUR DAN BERKONTEKS PADA ALUR PENTING (SOAL 2)")

    add_paragraph(doc,
        "Logging terstruktur (Structured Logging) adalah praktik mencatat peristiwa perangkat lunak menggunakan format terstandarisasi (misalnya pasangan kunci-nilai JSON) sehingga data dapat di-parse, difilter, dan dianalisis secara otomatis oleh sistem log aggregation (seperti Elasticsearch, Loki, atau Datadog). Setiap rekaman log wajib memuat konteks holistik: Siapa pelakunya (Who/Actor), Sedang mengerjakan apa (What/Action), dan Mengapa peristiwa tersebut terjadi (Why/Reason), dengan tingkat keparahan (Log Level) yang tepat.",
        bold_prefix="2.1 Definisi dan Standar Konteks Log: "
    )

    add_paragraph(doc,
        "Sesuai regulasi privasi data (seperti GDPR dan UU PDP) serta instruksi penugasan, sistem mengadopsi prinsip zero-credential logging. Tidak ada kata sandi (password), plain-text token, alamat email, atau informasi identitas pribadi (Personally Identifiable Information / PII) yang dicatat ke dalam log. Pelaku dicatat berdasarkan ID entitas numerik (mis. user_id: 1) atau label generik (guest / system_healthcheck), dan alamat IP dicatat untuk keperluan audit jejak digital yang aman.",
        bold_prefix="2.2 Kepatuhan Keamanan Data dan Privasi (Security Compliance): "
    )

    add_heading_2(doc, "2.3 Analisis dan Alasan Pemilihan Tiap Alur yang Diberi Log")

    # Table of Flows
    tbl_flow = doc.add_table(rows=4, cols=4)
    tbl_flow.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_flow.autofit = False
    flow_widths = [Inches(1.2), Inches(0.9), Inches(1.8), Inches(2.6)]

    headers = ["Alur Penting", "Tingkat", "Konteks Utama", "Alasan Pemilihan Alur"]
    for idx, name in enumerate(headers):
        cell = tbl_flow.cell(0, idx)
        cell.width = flow_widths[idx]
        set_cell_background(cell, '1E3A8A')
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(name)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(10)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)

    flow_rows = [
        (
            "Alur 1: Simpan Data Produk Baru (ProductController::store)",
            "INFO",
            "actor: User ID\naction: store_product\nresource_id: ID Produk\nreason: Valid payload submission",
            "Transaksi bisnis inti (core domain) pada sistem POS. Wajib dicatat untuk kebutuhan audit trail pencatatan inventaris baru, pelacakan siapa kasir/admin yang mendaftarkan barang, serta verifikasi konsistensi stok barang."
        ),
        (
            "Alur 2: Validasi Input Gagal (ProductController::store)",
            "WARNING",
            "actor: User ID / Guest\naction: store_product_validation\nfailed_fields: [sku, price, ...]\nreason: Schema failure",
            "Mendeteksi adanya kesalahan masukan dari pengguna, kesalahan format integrasi antarmuka (frontend bug), atau indikasi upaya probing/injeksi data tidak wajar sebelum beban mencapai lapisan transaksi basis data."
        ),
        (
            "Alur 3: Gagal Koneksi Basis Data (HealthController & Global)",
            "ERROR",
            "actor: system_healthcheck\naction: database_connectivity_check\ntarget: database\nreason: PDO Connection refusal",
            "Kegagalan dependensi kritis infrastruktur (critical service failure). Jika basis data padam, sistem POS tidak dapat beroperasi sama sekali. Log level ERROR memicu pemberitahuan darurat (alerting) kepada DevOps/SRE."
        )
    ]

    for row_idx, r_data in enumerate(flow_rows, start=1):
        bg = 'FFFFFF' if row_idx % 2 != 0 else 'F8FAFC'
        for col_idx, text in enumerate(r_data):
            cell = tbl_flow.cell(row_idx, col_idx)
            cell.width = flow_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            set_cell_borders(cell, top={'val': 'single', 'sz': '4', 'color': 'CBD5E1'}, bottom={'val': 'single', 'sz': '4', 'color': 'CBD5E1'})
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(9.5)
            if col_idx == 1:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                run.font.bold = True
                if text == 'INFO':
                    run.font.color.rgb = RGBColor(16, 185, 129)
                elif text == 'WARNING':
                    run.font.color.rgb = RGBColor(245, 158, 11)
                elif text == 'ERROR':
                    run.font.color.rgb = RGBColor(239, 68, 68)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(6)

    add_image_with_caption(doc,
        'docs/ss_p10_2_structured_logs.png',
        'Gambar 2.1: Bukti Log Terstruktur pada Alur Simpan Data (INFO), Validasi Gagal (WARNING), dan DB Failure (ERROR)'
    )

    add_paragraph(doc,
        "Selain ketiga alur utama di atas, sistem juga mengimplementasikan log warning tambahan pada AuthController saat percobaan login gagal dengan kredensial tidak valid (tanpa pernah mencatat password), serta pencatatan error saat subsistem cache mengalami kegagalan. Struktur log yang rapi dan seragam ini menjamin visibilitas operasional sistem secara komprehensif.",
        bold_prefix="2.4 Alur Tambahan dan Kepatuhan: "
    )

    # -------------------------------------------------------------
    # BAB III: ENDPOINT /HEALTH DEEP INSPECTION (SOAL 3)
    # -------------------------------------------------------------
    add_heading_1(doc, "BAB III. ENDPOINT /HEALTH DENGAN DEEP INSPECTION BASIS DATA & CACHE (SOAL 3)")

    add_paragraph(doc,
        "Endpoint kesehatan (/health) yang handal tidak boleh sekadar mengembalikan respons teks statis (seperti teks 'OK' atau status bawaan Laravel /up) tanpa memvalidasi keterhubungan riil subsistem dependensi. Pada tugas ini, dibangun controller HealthController yang secara aktif mengeksekusi dua uji kesiapan subsistem vital:",
        bold_prefix="3.1 Mekanisme Uji Aktif (Active Probing): "
    )

    add_paragraph(doc,
        "Menguji instansiasi PDO aktif ke peladen MySQL dan mengeksekusi kueri ringan 'SELECT 1'. Jika berhasil, status dicatat 'healthy' disertai waktu latensi kueri dalam milidetik (ms). Jika koneksi gagal, ditangkap exception-nya, dicatat ke log error terstruktur, dan status subsistem basis data berubah menjadi 'unhealthy' disertai pesan kegagalannya.",
        bold_prefix="1. Pengecekan Basis Data (MySQL 8.0): "
    )

    add_paragraph(doc,
        "Menguji kemampuan pembacaan dan penulisan pada driver cache aktif (dikonfigurasikan menggunakan store 'file'). Controller menulis kunci uji acak (_healthcheck_probe_*), membaca nilainya kembali untuk memastikan kecocokan, dan menghapusnya. Latensi operasi diukur dan dilaporkan.",
        bold_prefix="2. Pengecekan Subsistem Cache: "
    )

    add_paragraph(doc,
        "Jika kedua subsistem sehat, endpoint mengembalikan HTTP Status 200 OK dengan status induk 'healthy'. Namun jika salah satu atau kedua subsistem gagal, endpoint secara tepat mengembalikan HTTP Status 503 Service Unavailable dan merinci secara spesifik bagian mana yang bermasalah pada objek JSON 'services'.",
        bold_prefix="3.2 Logika Penentuan Status HTTP: "
    )

    add_callout(doc,
        "GET /health\n"
        "Status HTTP: 200 OK\n"
        "{\n"
        '  "status": "healthy",\n'
        '  "timestamp": "2026-11-07T06:06:47+00:00",\n'
        '  "services": {\n'
        '    "database": {\n'
        '      "status": "healthy",\n'
        '      "connection": "mysql",\n'
        '      "latency_ms": 4.25\n'
        '    },\n'
        '    "cache": {\n'
        '      "status": "healthy",\n'
        '      "driver": "file",\n'
        '      "latency_ms": 1.4\n'
        '    }\n'
        '  }\n'
        "}",
        title="Contoh Isi Balasan /health Saat Kondisi SEHAT (HTTP 200)"
    )

    add_callout(doc,
        "GET /health\n"
        "Status HTTP: 503 Service Unavailable\n"
        "{\n"
        '  "status": "unhealthy",\n'
        '  "timestamp": "2026-11-07T06:07:30+00:00",\n'
        '  "services": {\n'
        '    "database": {\n'
        '      "status": "unhealthy",\n'
        '      "connection": "mysql",\n'
        '      "error": "SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo for db failed: Name does not resolve"\n'
        '    },\n'
        '    "cache": {\n'
        '      "status": "healthy",\n'
        '      "driver": "file",\n'
        '      "latency_ms": 3.4\n'
        '    }\n'
        '  }\n'
        "}",
        title="Contoh Isi Balasan /health Saat Kondisi SAKIT (HTTP 503)"
    )

    # -------------------------------------------------------------
    # BAB IV: DOCKER COMPOSE HEALTHCHECK & PENGUJIAN DUA ARAH (SOAL 4 & 5)
    # -------------------------------------------------------------
    add_heading_1(doc, "BAB IV. KONFIGURASI HEALTHCHECK DAN PENGUJIAN DUA ARAH (SOAL 4 & 5)")

    add_paragraph(doc,
        "Pada docker-compose.yml, blok healthcheck pada service backend dikonfigurasikan secara spesifik untuk memanggil endpoint /health menggunakan cURL di dalam kontainer:",
        bold_prefix="4.1 Konfigurasi Healthcheck pada Compose: "
    )

    add_callout(doc,
        "healthcheck:\n"
        '  test: ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]\n'
        "  interval: 5s\n"
        "  timeout: 3s\n"
        "  retries: 3\n"
        "  start_period: 10s",
        title="Parameter Healthcheck pos_backend"
    )

    add_paragraph(doc,
        "Penjelasan parameter:\n"
        "• test: Memanggil endpoint /health. Flag -f (fail silently) memastikan cURL menghasilkan exit code bukan nol ketika menerima kode respons HTTP 503 atau kegagalan koneksi, sehingga Docker mendeteksinya sebagai probe failure.\n"
        "• interval: 5s: Pemeriksaan dilakukan setiap 5 detik agar deteksi perubahan status berlangsung responsif.\n"
        "• timeout: 3s: Batas maksimal toleransi balasan pemeriksaan adalah 3 detik.\n"
        "• retries: 3: Membutuhkan 3 kegagalan berturut-turut sebelum kontainer dinyatakan unhealthy.\n"
        "• start_period: 10s: Waktu inisialisasi awal kontainer sebelum kegagalan probe dihitung terhadap kuota retries.",
        bold_prefix="• Penjelasan Parameter: "
    )

    add_heading_2(doc, "4.2 Pembuktian Tahap 1: Kondisi Normal Sehat (Healthy)")
    add_paragraph(doc,
        "Saat seluruh service dijalankan melalui 'docker compose up -d', layanan pos_db siap dan lulus uji mysqladmin ping, kemudian disusul oleh pos_backend yang memeriksa basis data dan cache. Kolom STATUS pada docker compose ps secara konsisten menampilkan status (healthy).",
        bold_prefix="Kondisi Awal: "
    )
    add_image_with_caption(doc,
        'docs/ss_p10_3_health_healthy.png',
        'Gambar 4.1: Status Kontainer Saat Sehat (healthy) dan Balasan HTTP 200 dari /health'
    )

    add_heading_2(doc, "4.3 Pembuktian Tahap 2: Simulasi Kegagalan Basis Data (Transisi ke Unhealthy)")
    add_paragraph(doc,
        "Layanan basis data dimatikan secara sengaja menggunakan perintah 'docker compose stop db'. Sesaat setelah kontainer basis data berhenti, pemeriksaan berkala backend ke /health gagal karena host 'db' tidak dapat dihubungi. Setelah 3 kali kegagalan berturut-turut (retries), status kontainer pos_backend pada docker compose ps berubah menjadi (unhealthy). Bersamaan dengan itu, log backend langsung mencatat structured error yang memaparkan alasan kegagalan, dan cURL ke /health menghasilkan HTTP 503.",
        bold_prefix="Simulasi Kerusakan: "
    )
    add_image_with_caption(doc,
        'docs/ss_p10_4_health_unhealthy.png',
        'Gambar 4.2: Pembuktian Transisi ke Status Unhealthy, Balasan 503, dan Pencatatan Sebab Kerusakan pada Log'
    )

    add_heading_2(doc, "4.4 Pembuktian Tahap 3: Pemulihan Layanan Basis Data (Transisi Kembali ke Healthy)")
    add_paragraph(doc,
        "Layanan basis data dihidupkan kembali melalui perintah 'docker compose start db'. Setelah MySQL pulih dan sehat, pemeriksaan berkala berikutnya dari pos_backend berhasil menyambung kembali ke basis data dan cache. Docker Compose secara otomatis memperbarui kolom STATUS kontainer pos_backend kembali menjadi (healthy).",
        bold_prefix="Pemulihan Otomatis: "
    )
    add_image_with_caption(doc,
        'docs/ss_p10_5_health_recovery.png',
        'Gambar 4.3: Pembuktian Healthcheck Bekerja Dua Arah (Status Pulih Menjadi Healthy)'
    )

    # -------------------------------------------------------------
    # BAB V: PEMBATASAN UKURAN LOG CONTAINER (SOAL 6)
    # -------------------------------------------------------------
    add_heading_1(doc, "BAB V. PEMBATASAN UKURAN LOG CONTAINER (SOAL 6)")

    add_paragraph(doc,
        "Secara default, Docker menggunakan logging driver json-file tanpa batas ukuran berkas, yang berisiko menghabiskan ruang penyimpanan fisik peladen (disk space exhaustion) akibat log flooding atau operasi jangka panjang. Untuk mencegah hal tersebut, diterapkan konfigurasi rotasi log pada compose.yaml menggunakan extension block x-logging:",
        bold_prefix="5.1 Konfigurasi Log Rotation pada Docker Compose: "
    )

    add_callout(doc,
        "x-logging: &default-logging\n"
        '  driver: "json-file"\n'
        "  options:\n"
        '    max-size: "10m"\n'
        '    max-file: "3"\n\n'
        "services:\n"
        "  db: { logging: *default-logging, ... }\n"
        "  backend: { logging: *default-logging, ... }\n"
        "  frontend: { logging: *default-logging, ... }",
        title="Konfigurasi Logging max-size dan max-file"
    )

    add_paragraph(doc,
        "Konfigurasi di atas membatasi ukuran satu berkas log maksimal 10 Megabytes (max-size: 10m) dengan jumlah arsip maksimal sebanyak 3 berkas (max-file: 3). Ketika batas 10 MB terlampaui, Docker akan mengarsipkan berkas dan menghapus berkas tertua secara otomatis (FIFO).",
        bold_prefix="5.2 Mekanisme Kerja: "
    )

    add_image_with_caption(doc,
        'docs/ss_p10_6_log_limits.png',
        'Gambar 5.1: Verifikasi Pembatasan Ukuran Log (max-size: 10m & max-file: 3) via docker inspect'
    )

    add_paragraph(doc,
        "Berdasarkan inspeksi langsung ke runtime Docker daemon menggunakan 'docker inspect --format='{{json .HostConfig.LogConfig}}'', terbukti bahwa seluruh layanan kontainer (pos_backend, pos_db, dan pos_frontend) telah menerapkan pengaturan pembatasan log tersebut secara presisi.",
        bold_prefix="5.3 Hasil Verifikasi Inspeksi: "
    )

    # -------------------------------------------------------------
    # BAB VI: KESIMPULAN & TAUTAN REPOSITORI
    # -------------------------------------------------------------
    add_heading_1(doc, "BAB VI. KESIMPULAN DAN TAUTAN REPOSITORI")

    add_paragraph(doc,
        "Seluruh kebutuhan penugasan Pertemuan 10 Konstruksi dan Evolusi Perangkat Lunak telah berhasil diimplementasikan, diuji, dan diverifikasi secara menyeluruh:",
        bold_prefix="6.1 Ringkasan Capaian Penugasan: "
    )

    add_paragraph(doc, "Log Laravel dialihkan penuh ke stdout (php://stdout), diverifikasi via docker compose logs, dan berkas storage/logs/laravel.log terbukti tidak ditulisi.", bold_prefix="1. Pengalihan Log ke STDOUT: ")
    add_paragraph(doc, "Minimal tiga log berkonteks lengkap (actor, action, reason) telah aktif pada alur simpan data (INFO), validasi gagal (WARNING), dan kegagalan database (ERROR) dengan kepatuhan zero-credential/zero-PII.", bold_prefix="2. Logging Terstruktur Berkonteks: ")
    add_paragraph(doc, "Endpoint /health secara aktif menguji keterhubungan basis data dan subsistem cache secara nyata, menghasilkan status 200 OK saat sehat dan 503 Service Unavailable saat sakit dengan rincian komponen bermasalah.", bold_prefix="3. Deep Health Check Endpoint: ")
    add_paragraph(doc, "Healthcheck compose.yaml terkonfigurasi lengkap dengan interval, timeout, retries, dan start_period. Terbukti bekerja dua arah (healthy -> unhealthy -> healthy) saat simulasi pematian layanan basis data.", bold_prefix="4. Healthcheck Dua Arah: ")
    add_paragraph(doc, "Seluruh layanan kontainer dibatasi konsumsi lognya menggunakan driver json-file dengan batas max-size: 10m dan max-file: 3.", bold_prefix="5. Pembatasan Ukuran Log: ")

    add_callout(doc,
        "Repositori GitHub: https://github.com/EricoAli/uts-pl-24-542626-SV-25066\n"
        "Cabang (Branch): feat/pos-system\n"
        "Mahasiswa: Erico Ali Gutama (NIM: 24/542626/SV/25066)",
        title="Tautan Repositori Proyek"
    )

    doc_filename = 'Laporan_P10_KEPL_24-542626-SV-25066.docx'
    doc.save(doc_filename)
    print(f"Document successfully created: {doc_filename}")
    return doc_filename

if __name__ == '__main__':
    build_document()
