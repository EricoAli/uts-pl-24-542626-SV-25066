import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm, inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# ----------------------------------------------------------------------
# NUMBERED CANVAS FOR HEADER & FOOTER
# ----------------------------------------------------------------------
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page

        self.saveState()
        self.setFont("Times-Roman", 9)
        self.setFillColor(colors.HexColor("#475569"))

        # Header
        header_text = "Laporan Praktikum Pertemuan 10 - KEPL | Erico Ali Gutama (24/542626/SV/25066)"
        self.drawString(2.0 * cm, 28.3 * cm, header_text)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(2.0 * cm, 28.1 * cm, 19.0 * cm, 28.1 * cm)

        # Footer
        footer_left = "Program Studi D-IV Rekayasa Perangkat Lunak - SV UGM"
        footer_right = f"Halaman {self._pageNumber} dari {page_count}"
        self.line(2.0 * cm, 1.8 * cm, 19.0 * cm, 1.8 * cm)
        self.drawString(2.0 * cm, 1.4 * cm, footer_left)
        self.drawRightString(19.0 * cm, 1.4 * cm, footer_right)

        self.restoreState()

# ----------------------------------------------------------------------
# BUILD PDF FUNCTION
# ----------------------------------------------------------------------
def generate_pdf(output_pdf_path):
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        leftMargin=2.0 * cm,
        rightMargin=2.0 * cm,
        topMargin=2.2 * cm,
        bottomMargin=2.2 * cm
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=15,
        leading=20,
        alignment=1, # Center
        textColor=colors.HexColor('#1E3A8A'),
        spaceAfter=15
    )

    cover_meta_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=12,
        leading=16,
        alignment=1,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=12.5,
        leading=16,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Heading2'],
        fontName='Times-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyJustified',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10,
        leading=13.5,
        alignment=4, # Justify
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1E293B')
    )

    caption_style = ParagraphStyle(
        'Caption',
        parent=styles['Normal'],
        fontName='Times-Italic',
        fontSize=8.5,
        leading=11,
        alignment=1, # Center
        textColor=colors.HexColor('#475569'),
        spaceAfter=10,
        keepWithNext=False
    )

    story = []

    # -------------------------------------------------------------
    # COVER PAGE
    # -------------------------------------------------------------
    story.append(Spacer(1, 15 * mm))
    story.append(Paragraph("LAPORAN PRAKTIKUM PERTEMUAN 10<br/>KONSTRUKSI DAN EVOLUSI PERANGKAT LUNAK", cover_meta_style))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("LOGGING TERSTRUKTUR, ENDPOINT /HEALTH, DAN<br/>HEALTHCHECK REAKTIF DUA ARAH PADA DOCKER COMPOSE", title_style))
    story.append(Spacer(1, 10 * mm))

    # UGM Logo
    if os.path.exists('ugm_logo.png'):
        story.append(Image('ugm_logo.png', width=5.2 * cm, height=5.4 * cm))
    story.append(Spacer(1, 15 * mm))

    # Identitas Mahasiswa Table
    ident_data = [
        [Paragraph("<b>Nama</b>", body_style), Paragraph(":", body_style), Paragraph("Erico Ali Gutama", body_style)],
        [Paragraph("<b>NIM</b>", body_style), Paragraph(":", body_style), Paragraph("24/542626/SV/25066", body_style)],
        [Paragraph("<b>Kelas</b>", body_style), Paragraph(":", body_style), Paragraph("B1", body_style)],
        [Paragraph("<b>Dosen Pengampu</b>", body_style), Paragraph(":", body_style), Paragraph("Galih Malela Damaraji", body_style)],
    ]
    t_ident = Table(ident_data, colWidths=[4.2 * cm, 0.4 * cm, 8.5 * cm])
    t_ident.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_ident)

    story.append(Spacer(1, 25 * mm))
    story.append(Paragraph(
        "<b>PROGRAM STUDI D-IV TEKNOLOGI REKAYASA PERANGKAT LUNAK<br/>"
        "DEPARTEMEN TEKNIK ELEKTRO DAN INFORMATIKA<br/>"
        "SEKOLAH VOKASI<br/>"
        "UNIVERSITAS GADJAH MADA<br/>"
        "YOGYAKARTA<br/>2026</b>",
        cover_meta_style
    ))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # BAB I: PENGALIHAN LOG LARAVEL KE STDOUT (SOAL 1)
    # -------------------------------------------------------------
    story.append(Paragraph("BAB I. PENGALIHAN LOG LARAVEL KE STDOUT (SOAL 1)", h1_style))
    story.append(Paragraph(
        "<b>1.1 Prinsip Desain Log sebagai Event Streams (12-Factor App):</b><br/>"
        "Dalam rekayasa sistem terdistribusi modern dan ekosistem kontainer, prinsip <i>The Twelve-Factor App</i> butir XI (<i>Logs as Event Streams</i>) menyatakan bahwa aplikasi tidak boleh membebankan dirinya dengan urusan pengelolaan atau penyimpanan berkas log pada sistem berkas lokal. Kontainer bersifat sementara (<i>ephemeral</i>), sehingga penulisan berkas log lokal di dalam kontainer akan menyulitkan agregasi log terpusat dan berisiko memenuhi kapasitas penyimpanan kontainer secara liar. Oleh karena itu, seluruh luaran log dialihkan secara langsung ke standar output (<code>stdout</code>), di mana runtime kontainer (Docker Engine) dapat menangkap, merotasi, dan menyalurkannya ke agregator log.",
        body_style
    ))

    story.append(Paragraph(
        "<b>1.2 Implementasi Konfigurasi pada Repositori:</b><br/>"
        "Pengalihan ini direalisasikan melalui beberapa berkas konfigurasi:<br/>"
        "• <b>backend/config/logging.php</b>: Menambahkan channel <code>stdout</code> dengan driver <code>monolog</code> dan <code>StreamHandler</code> yang diarahkan langsung ke <code>php://stdout</code>, serta menetapkan default channel aplikasi menggunakan <code>env('LOG_CHANNEL', 'stdout')</code>.<br/>"
        "• <b>.env dan .env.example (Root & Backend)</b>: Mendefinisikan variabel <code>LOG_CHANNEL=stdout</code> dan <code>LOG_LEVEL=debug</code>.<br/>"
        "• <b>docker-compose.yml</b>: Menetapkan variabel lingkungan <code>LOG_CHANNEL: ${LOG_CHANNEL:-stdout}</code> pada service <code>backend</code>.<br/>"
        "• <b>backend/docker-entrypoint.sh</b>: Menjalankan server FrankenPHP dengan opsi <code>--access-log</code>, sehingga log aplikasi dan log akses HTTP disalurkan secara simultan ke <code>stdout</code> kontainer.",
        body_style
    ))

    if os.path.exists('docs/ss_p10_1_stdout_logging.png'):
        story.append(Image('docs/ss_p10_1_stdout_logging.png', width=17.0 * cm, height=6.2 * cm))
        story.append(Paragraph("Gambar 1.1: Pembuktian Log Mengalir ke STDOUT via docker compose logs dan Berkas Lokal Tidak Ditulisi", caption_style))

    story.append(Paragraph(
        "<b>1.3 Bukti Hasil Pengujian:</b><br/>"
        "Sebagaimana ditunjukkan pada Gambar 1.1, seluruh peristiwa aplikasi (seperti pembuatan produk dan kegagalan healthcheck) tertangkap secara real-time pada perintah <code>docker compose logs backend</code>. Di samping itu, inspeksi berkas di dalam kontainer melalui perintah <code>docker compose exec backend ls -la storage/logs</code> membuktikan bahwa berkas <code>laravel.log</code> tidak menerima penulisan log baru (timestamp lama tidak berubah), membuktikan bahwa seluruh log dialihkan 100% ke <code>stdout</code>.",
        body_style
    ))

    # -------------------------------------------------------------
    # BAB II: LOG TERSTRUKTUR DAN BERKONTEKS (SOAL 2)
    # -------------------------------------------------------------
    story.append(Paragraph("BAB II. LOG TERSTRUKTUR DAN BERKONTEKS PADA ALUR PENTING (SOAL 2)", h1_style))
    story.append(Paragraph(
        "<b>2.1 Standar Konteks dan Kepatuhan Keamanan Data (Zero-Credential):</b><br/>"
        "Logging terstruktur mencatat data dalam format JSON berpasangan kunci-nilai sehingga mempermudah audit jejak digital dan indexing otomatis. Sesuai kriteria evaluasi, setiap log wajib menyertakan konteks tiga dimensi: <b>Siapa</b> (<code>actor</code>, <code>ip_address</code>), <b>Sedang mengerjakan apa</b> (<code>action</code>, <code>resource</code>), dan <b>Sebabnya</b> (<code>reason</code>). Sistem menerapkan kepatuhan privasi ketat: tidak pernah mencatat password, token, atau data pribadi (PII).",
        body_style
    ))

    # Tabel Alasan Pemilihan Alur
    flow_table_data = [
        [
            Paragraph("<b>Alur Penting</b>", body_style),
            Paragraph("<b>Level</b>", body_style),
            Paragraph("<b>Konteks Log Terstruktur</b>", body_style),
            Paragraph("<b>Alasan Singkat Pemilihan Alur</b>", body_style)
        ],
        [
            Paragraph("<b>Alur 1: Simpan Data Produk Baru</b><br/>(ProductController::store)", body_style),
            Paragraph("<font color='#10B981'><b>INFO</b></font>", body_style),
            Paragraph("• actor: User ID (1)<br/>• action: store_product<br/>• resource: products (ID: 3)<br/>• product_sku: PRD-EXP-001<br/>• reason: Valid payload", body_style),
            Paragraph("Merupakan transaksi bisnis inti (core domain) POS. Wajib dicatat untuk kebutuhan audit trail pencatatan inventaris, akuntabilitas admin/kasir, dan verifikasi konsistensi stok.", body_style)
        ],
        [
            Paragraph("<b>Alur 2: Validasi Gagal</b><br/>(ProductController::store)", body_style),
            Paragraph("<font color='#F59E0B'><b>WARNING</b></font>", body_style),
            Paragraph("• actor: User ID / Guest<br/>• action: store_product_validation<br/>• failed_fields: [sku, price]<br/>• reason: Schema failure", body_style),
            Paragraph("Penting untuk mendeteksi anomali masukan klien, bug format frontend, atau upaya probing/payload injection sebelum beban mencapai lapisan transaksi database.", body_style)
        ],
        [
            Paragraph("<b>Alur 3: Gagal Koneksi Basis Data</b><br/>(HealthController & Global)", body_style),
            Paragraph("<font color='#EF4444'><b>ERROR</b></font>", body_style),
            Paragraph("• actor: system_healthcheck<br/>• action: database_connectivity_check<br/>• target: database<br/>• reason: PDO Connection refusal", body_style),
            Paragraph("Kegagalan dependensi kritis infrastruktur (critical failure). Jika database padam, sistem POS lumpuh total. Log ERROR memicu alerting darurat bagi tim DevOps.", body_style)
        ],
    ]

    t_flow = Table(flow_table_data, colWidths=[4.2 * cm, 1.8 * cm, 5.0 * cm, 6.0 * cm])
    t_flow.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    for r in range(4):
        p = flow_table_data[r][1]
        p.alignment = 1 # Center level
    story.append(t_flow)
    story.append(Spacer(1, 4 * mm))

    if os.path.exists('docs/ss_p10_2_structured_logs.png'):
        story.append(Image('docs/ss_p10_2_structured_logs.png', width=17.0 * cm, height=8.2 * cm))
        story.append(Paragraph("Gambar 2.1: Cuplikan Tiga Log Terstruktur pada STDOUT dengan Konteks Lengkap (INFO, WARNING, ERROR)", caption_style))

    # -------------------------------------------------------------
    # BAB III: ENDPOINT /HEALTH DEEP INSPECTION (SOAL 3)
    # -------------------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("BAB III. ENDPOINT /HEALTH DENGAN DEEP INSPECTION BASIS DATA & CACHE (SOAL 3)", h1_style))
    story.append(Paragraph(
        "<b>3.1 Desain dan Mekanisme Pengecekan Nyata (Active Probing):</b><br/>"
        "Endpoint kesehatan <code>/health</code> yang handal tidak boleh sekadar mengembalikan respons teks statis (seperti teks 'OK' atau status bawaan Laravel /up) tanpa memvalidasi keterhubungan riil subsistem dependensi. Pada tugas ini, dibangun controller <code>HealthController</code> yang secara aktif mengeksekusi dua uji kesiapan subsistem vital:<br/>"
        "1. <b>Basis Data (MySQL 8.0)</b>: Menguji instansiasi PDO aktif ke peladen MySQL dan mengeksekusi kueri ringan <code>SELECT 1</code>. Jika berhasil, status dicatat 'healthy' disertai waktu latensi kueri dalam milidetik (ms). Jika koneksi gagal, ditangkap exception-nya, dicatat ke log error terstruktur, dan status subsistem basis data berubah menjadi 'unhealthy' disertai pesan kegagalannya.<br/>"
        "2. <b>Subsistem Cache</b>: Menguji kemampuan pembacaan dan penulisan pada driver cache aktif (dikonfigurasikan menggunakan store <code>file</code>). Controller menulis kunci uji acak (<code>_healthcheck_probe_*</code>), membaca nilainya kembali untuk memastikan kecocokan, dan menghapusnya. Latensi operasi diukur dan dilaporkan.",
        body_style
    ))

    story.append(Paragraph(
        "<b>3.2 Logika Penentuan Status HTTP dan Bukti Balasan:</b><br/>"
        "Jika kedua subsistem sehat, endpoint mengembalikan HTTP Status <b>200 OK</b> dengan status induk 'healthy'. Namun jika salah satu atau kedua subsistem gagal, endpoint secara tepat mengembalikan HTTP Status <b>503 Service Unavailable</b> dan merinci secara spesifik bagian mana yang bermasalah pada objek JSON 'services'.",
        body_style
    ))

    # Table of Health JSON Responses
    health_box_data = [
        [
            Paragraph("<b>Isi Balasan /health Saat Kondisi SEHAT (HTTP 200 OK)</b>", body_style),
            Paragraph("<b>Isi Balasan /health Saat Kondisi SAKIT (HTTP 503 Service Unavailable)</b>", body_style)
        ],
        [
            Paragraph(
                "<font face='Courier' size='7.5'>"
                "HTTP/1.1 200 OK<br/>"
                "Content-Type: application/json<br/><br/>"
                "{\n"
                '  "status": "healthy",<br/>'
                '  "timestamp": "2026-11-07T06:06:47+00:00",<br/>'
                '  "services": {<br/>'
                '    "database": {<br/>'
                '      "status": "healthy",<br/>'
                '      "connection": "mysql",<br/>'
                '      "latency_ms": 4.25<br/>'
                '    },<br/>'
                '    "cache": {<br/>'
                '      "status": "healthy",<br/>'
                '      "driver": "file",<br/>'
                '      "latency_ms": 1.4<br/>'
                '    }<br/>'
                '  }<br/>'
                "}"
                "</font>",
                body_style
            ),
            Paragraph(
                "<font face='Courier' size='7.5'>"
                "HTTP/1.1 503 Service Unavailable<br/>"
                "Content-Type: application/json<br/><br/>"
                "{\n"
                '  "status": "unhealthy",<br/>'
                '  "timestamp": "2026-11-07T06:07:30+00:00",<br/>'
                '  "services": {<br/>'
                '    "database": {<br/>'
                '      "status": "unhealthy",<br/>'
                '      "connection": "mysql",<br/>'
                '      "error": "SQLSTATE[HY000] [2002] Name does not resolve"<br/>'
                '    },<br/>'
                '    "cache": {<br/>'
                '      "status": "healthy",<br/>'
                '      "driver": "file",<br/>'
                '      "latency_ms": 3.4<br/>'
                '    }<br/>'
                '  }<br/>'
                "}"
                "</font>",
                body_style
            )
        ]
    ]

    t_health = Table(health_box_data, colWidths=[8.5 * cm, 8.5 * cm])
    t_health.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_health)
    story.append(Spacer(1, 4 * mm))

    # -------------------------------------------------------------
    # BAB IV: DUAL-WAY HEALTHCHECK (SOAL 4 & 5)
    # -------------------------------------------------------------
    story.append(Paragraph("BAB IV. KONFIGURASI HEALTHCHECK DAN PENGUJIAN DUA ARAH (SOAL 4 & 5)", h1_style))
    story.append(Paragraph(
        "<b>4.1 Konfigurasi Healthcheck pada compose.yaml:</b><br/>"
        "Healthcheck pada service backend dikonfigurasikan lengkap dengan seluruh parameter wajib:<br/>"
        "• <code>test: ['CMD-SHELL', 'curl -f http://localhost:8000/health || exit 1']</code> (flag -f memicu exit code 22 saat HTTP 503).<br/>"
        "• <code>interval: 5s</code> (pemeriksaan berkala setiap 5 detik).<br/>"
        "• <code>timeout: 3s</code> (batas toleransi respons maksimal 3 detik).<br/>"
        "• <code>retries: 3</code> (kontainer berstatus unhealthy setelah 3 kegagalan berturut-turut).<br/>"
        "• <code>start_period: 10s</code> (waktu pemanasan awal saat inisialisasi boot kontainer).",
        body_style
    ))

    story.append(Paragraph("<b>4.2 Pembuktian Tahap 1: Kondisi Normal Sehat (Healthy)</b>", h2_style))
    if os.path.exists('docs/ss_p10_3_health_healthy.png'):
        story.append(Image('docs/ss_p10_3_health_healthy.png', width=17.0 * cm, height=5.5 * cm))
        story.append(Paragraph("Gambar 4.1: Status Kontainer Saat Sehat (healthy) dan Balasan HTTP 200 dari /health", caption_style))

    story.append(Paragraph("<b>4.3 Pembuktian Tahap 2: Simulasi Kerusakan DB (Transisi ke Unhealthy)</b>", h2_style))
    story.append(Paragraph(
        "Layanan basis data dimatikan secara sengaja menggunakan perintah <code>docker compose stop db</code>. Probing cURL berikutnya mendeteksi bahwa MySQL tidak dapat dihubungi. Setelah batas retries terpenuhi, status kolom STATUS pada <code>docker compose ps</code> berubah secara reaktif menjadi <b>(unhealthy)</b>. Bersamaan dengan itu, log backend langsung mencatat structured error dan cURL /health membalas HTTP 503.",
        body_style
    ))
    if os.path.exists('docs/ss_p10_4_health_unhealthy.png'):
        story.append(Image('docs/ss_p10_4_health_unhealthy.png', width=17.0 * cm, height=6.2 * cm))
        story.append(Paragraph("Gambar 4.2: Pembuktian Status Unhealthy, Balasan 503, dan Pencatatan Log Error saat Database Mati", caption_style))

    story.append(Paragraph("<b>4.4 Pembuktian Tahap 3: Pemulihan Layanan DB (Transisi Kembali ke Healthy)</b>", h2_style))
    story.append(Paragraph(
        "Layanan basis data dihidupkan kembali dengan perintah <code>docker compose start db</code>. Begitu MySQL siap dan lulus pemeriksaan ping, probing berkala dari backend ke <code>/health</code> kembali sukses (HTTP 200). Status kontainer pada <code>docker compose ps</code> secara otomatis pulih kembali menjadi <b>(healthy)</b>.",
        body_style
    ))
    if os.path.exists('docs/ss_p10_5_health_recovery.png'):
        story.append(Image('docs/ss_p10_5_health_recovery.png', width=17.0 * cm, height=5.8 * cm))
        story.append(Paragraph("Gambar 4.3: Pembuktian Healthcheck Bekerja Dua Arah (Pemulihan Reaktif ke Status Healthy)", caption_style))

    # -------------------------------------------------------------
    # BAB V: PEMBATASAN UKURAN LOG CONTAINER (SOAL 6)
    # -------------------------------------------------------------
    story.append(Paragraph("BAB V. PEMBATASAN UKURAN LOG CONTAINER (SOAL 6)", h1_style))
    story.append(Paragraph(
        "<b>5.1 Analisis Risiko Log Flooding dan Konfigurasi Rotasi:</b><br/>"
        "Tanpa pembatasan log, berkas json-file pada host dapat membengkak tanpa batas dan menghabiskan ruang disk peladen (disk exhaustion). Untuk memitigasinya, pada <code>docker-compose.yml</code> dipasang konfigurasi rotasi log menggunakan extension block <code>x-logging</code>:<br/>"
        "• <code>driver: 'json-file'</code><br/>"
        "• <code>options.max-size: '10m'</code> (berkas log dirotasi saat mencapai ukuran 10 Megabytes).<br/>"
        "• <code>options.max-file: '3'</code> (maksimal menyimpan 3 berkas arsip rotasi, berkas tertua otomatis dihapus).",
        body_style
    ))

    if os.path.exists('docs/ss_p10_6_log_limits.png'):
        story.append(Image('docs/ss_p10_6_log_limits.png', width=17.0 * cm, height=4.2 * cm))
        story.append(Paragraph("Gambar 5.1: Verifikasi Pembatasan Ukuran Log (max-size: 10m & max-file: 3) via docker inspect", caption_style))

    story.append(Paragraph(
        "Berdasarkan verifikasi runtime menggunakan <code>docker inspect --format='{{json .HostConfig.LogConfig}}'</code>, terbukti bahwa ketiga layanan kontainer (<code>pos_backend</code>, <code>pos_db</code>, dan <code>pos_frontend</code>) telah menerapkan batas <code>max-size: 10m</code> dan <code>max-file: 3</code> dengan sempurna.",
        body_style
    ))

    # -------------------------------------------------------------
    # BAB VI: KESIMPULAN & TAUTAN REPOSITORI
    # -------------------------------------------------------------
    story.append(Paragraph("BAB VI. KESIMPULAN DAN TAUTAN REPOSITORI", h1_style))
    story.append(Paragraph(
        "<b>6.1 Ringkasan Capaian Penugasan:</b><br/>"
        "Seluruh kriteria penilaian penugasan Pertemuan 10 telah diselesaikan dan dibuktikan secara empiris:<br/>"
        "1. <b>Log STDOUT (25 Poin)</b>: Log Laravel dialihkan penuh ke stdout (php://stdout), terbukti lewat docker compose logs, dan berkas di storage/logs tidak ditulisi.<br/>"
        "2. <b>Log Terstruktur & Berkonteks (25 Poin)</b>: Tiga log pada alur simpan data (INFO), validasi gagal (WARNING), dan DB error (ERROR) memuat konteks lengkap (actor, action, reason) tanpa membocorkan kredensial atau PII.<br/>"
        "3. <b>Endpoint /health Aktif (25 Poin)</b>: Memeriksa koneksi database nyata dan cache, membalas 200 saat sehat dan 503 saat sakit dengan rincian komponen yang gagal.<br/>"
        "4. <b>Healthcheck Dua Arah (25 Poin)</b>: Konfigurasi lengkap di compose.yaml, terbukti status berubah jadi unhealthy saat DB mati dan kembali healthy saat DB dihidupkan.<br/>"
        "5. <b>Pembatasan Ukuran Log (15 Poin)</b>: Dibatasi dengan max-size: 10m dan max-file: 3 pada compose.yaml dan diverifikasi via docker inspect.<br/>"
        "6. <b>Kerapian Laporan (10 Poin)</b>: Laporan PDF disusun secara komprehensif, terstruktur rapi, dan memuat seluruh artefak visual pengujian.",
        body_style
    ))

    repo_box_data = [
        [
            Paragraph("<b>TAUTAN REPOSITORI GITHUB (KODE & COMPOSE SUDAH TER-COMMIT)</b>", body_style)
        ],
        [
            Paragraph(
                "• <b>Tautan Repositori</b>: <font color='#2563EB'><u>https://github.com/EricoAli/uts-pl-24-542626-SV-25066</u></font><br/>"
                "• <b>Cabang (Branch)</b>: <code>feat/pos-system</code><br/>"
                "• <b>Mahasiswa</b>: Erico Ali Gutama (NIM: 24/542626/SV/25066)<br/>"
                "• <b>Commit Log</b>: Perubahan konfigurasi logging STDOUT, HealthController, ProductController structured logs, dan docker-compose.yml healthcheck.",
                body_style
            )
        ]
    ]

    t_repo = Table(repo_box_data, colWidths=[17.0 * cm])
    t_repo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94A3B8')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_repo)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Successfully generated at: {output_pdf_path}")

if __name__ == '__main__':
    target_pdf = "P10_24-542626-SV-25066_Erico Ali Gutama.pdf"
    generate_pdf(target_pdf)
    
    # Also generate variant names for convenience
    import shutil
    shutil.copyfile(target_pdf, "P10_24-542626-SV-25066.pdf")
    shutil.copyfile(target_pdf, "P10_542626_Erico Ali Gutama.pdf")
    print("Copies generated for all filename conventions.")
