const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const OUTPUT_PDF_PATH = path.join(__dirname, '..', 'Laporan_UTS_KEPL_24-542626-SV-25066.pdf');

// Helper to get Base64 image
function getBase64Image(filename, customPath = null) {
  const filePath = customPath || path.join(SCREENSHOTS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const bitmap = fs.readFileSync(filePath);
    return `data:image/png;base64,${bitmap.toString('base64')}`;
  }
  console.warn(`File not found: ${filePath}`);
  return '';
}

// UGM Logo base64
const ugmLogoBase64 = getBase64Image('ugm_logo.png', path.join(__dirname, 'ugm_logo.png'));

// Prepare image data URIs
const images = {
  img01: getBase64Image('01_routes_api.png'),
  img02: getBase64Image('02_product_controller.png'),
  img03: getBase64Image('03_postman_login_200.png'),
  img04: getBase64Image('04_postman_products_get_200.png'),
  img05: getBase64Image('05_postman_products_post_201.png'),
  img06: getBase64Image('06_postman_products_put_200.png'),
  img07: getBase64Image('07_postman_products_delete_200.png'),
  img08: getBase64Image('08_postman_validation_422.png'),
  img09: getBase64Image('09_postman_unauthorized_401.png'),
  img10: getBase64Image('10_terminal_php_artisan_test.png'),
  img11: getBase64Image('11_frontend_login.png'),
  img12: getBase64Image('12_frontend_dashboard_products.png'),
  img13: getBase64Image('13_frontend_modal_create_edit.png'),
  img14: getBase64Image('14_frontend_api_service_env.png'),
  img15: getBase64Image('15_github_repo_main.png'),
  img16: getBase64Image('16_github_pull_requests.png'),
  img17: getBase64Image('17_github_actions_list.png'),
  img18: getBase64Image('18_github_actions_pr_skipped.png'),
  img19: getBase64Image('19_github_actions_main_success.png'),
  img20: getBase64Image('20_github_packages_ghcr.png'),
  img21: getBase64Image('21_github_branch_protection.png'),
  img22: getBase64Image('22_github_secrets.png'),
  img23: getBase64Image('23_dockerfile_backend_frankenphp.png'),
  img24: getBase64Image('24_dockerfile_frontend_nginx.png'),
  img25: getBase64Image('25_docker_compose_yml.png'),
  img26: getBase64Image('26_terminal_docker_compose_ps.png'),
  img27: getBase64Image('27_terminal_data_persistence.png'),
  img28: getBase64Image('28_terminal_frankenphp_logs.png')
};

function generateHtml() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Laporan UTS KEPL - Erico Ali Gutama - 24/542626/SV/25066</title>
  <style>
    @page {
      size: A4;
      margin: 25mm 25mm 25mm 25mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 1.35;
      color: #000000;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    /* COVER PAGE SESUAI FORMAT LAPORAN UTS.docx */
    .cover-container {
      height: 242mm;
      max-height: 242mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      page-break-after: always;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    .cover-header {
      width: 100%;
    }

    .cover-main-title {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 4pt 0;
      line-height: 1.3;
    }

    .cover-sub-title {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 6pt 0;
      line-height: 1.3;
    }

    .cover-project-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 10pt auto 0 auto;
      max-width: 620px;
      line-height: 1.3;
    }

    .cover-logo-box {
      margin: 25px auto;
    }

    .cover-logo-box img {
      width: 190px;
      height: auto;
      display: block;
      margin: 0 auto;
    }

    .cover-author-box {
      width: 100%;
      max-width: 440px;
      margin: 15px auto;
      text-align: left;
    }

    .disusun-oleh {
      font-size: 12pt;
      margin: 0 0 6pt 0;
    }

    .author-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12pt;
    }

    .author-table td {
      padding: 2pt 4pt;
      vertical-align: top;
    }

    .author-label {
      width: 130px;
    }

    .author-colon {
      width: 15px;
    }

    .author-val-bold {
      font-weight: bold;
    }

    .cover-footer {
      width: 100%;
      text-align: center;
    }

    .cover-instansi {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 3pt 0;
      line-height: 1.25;
    }

    /* KONTEN UTAMA (HASIL DAN PEMBAHASAN) */
    .doc-header {
      text-align: center;
      margin-bottom: 20pt;
    }

    .doc-main-heading {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 4pt 0;
    }

    .doc-sub-heading {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 14pt 0;
    }

    .section-title {
      font-size: 13pt;
      font-weight: bold;
      margin-top: 20pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }

    .subsection-title {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 14pt;
      margin-bottom: 6pt;
      page-break-after: avoid;
    }

    p {
      text-align: justify;
      margin: 0 0 8pt 0;
      text-indent: 0;
    }

    ul, ol {
      margin: 0 0 8pt 0;
      padding-left: 28px;
    }

    li {
      margin-bottom: 4pt;
      text-align: justify;
    }

    /* Gambar & Keterangan (Gambar X. ...) */
    .figure-container {
      text-align: center;
      margin: 12pt 0 16pt 0;
      page-break-inside: avoid;
    }

    .figure-img {
      max-width: 95%;
      height: auto;
      border: 1px solid #71717a;
      display: block;
      margin: 0 auto;
    }

    .figure-caption {
      font-size: 10.5pt;
      margin-top: 6pt;
      text-align: center;
      font-style: italic;
      color: #000000;
    }

    /* Kode & Terminal */
    pre {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9.5pt;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 8pt 12pt;
      margin: 8pt 0 12pt 0;
      line-height: 1.4;
      overflow-x: auto;
      page-break-inside: avoid;
    }

    code {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 10pt;
      background: #f1f5f9;
      padding: 1px 4px;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
    }

    /* Tabel Standar */
    table.academic-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0 16pt 0;
      font-size: 10.5pt;
      page-break-inside: avoid;
    }

    table.academic-table th, table.academic-table td {
      border: 1px solid #000000;
      padding: 5pt 7pt;
      text-align: left;
    }

    table.academic-table th {
      background: #e2e8f0;
      font-weight: bold;
    }

    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- COVER PAGE SESUAI FORMAT LAPORAN UTS.docx -->
  <!-- ========================================== -->
  <div class="cover-container">
    <div class="cover-header">
      <div class="cover-main-title">LAPORAN UJIAN TENGAH SEMESTER</div>
      <div class="cover-sub-title">KONSTRUKSI DAN EVOLUSI PERANGKAT LUNAK</div>
      <div class="cover-project-title">
        RANCANG BANGUN DAN DEPLOYMENT SISTEM POINT OF SALE (POS) DENGAN LARAVEL SANCTUM, VUE.JS, FRANKENPHP, DOCKER COMPOSE, DAN PIPELINE CI/CD GHCR
      </div>
    </div>

    <div class="cover-logo-box">
      <img src="${ugmLogoBase64}" alt="Logo Universitas Gadjah Mada">
    </div>

    <div class="cover-author-box">
      <p class="disusun-oleh">Disusun oleh:</p>
      <table class="author-table">
        <tr>
          <td class="author-label">Nama</td>
          <td class="author-colon">:</td>
          <td class="author-val-bold">Erico Ali Gutama</td>
        </tr>
        <tr>
          <td class="author-label">NIM</td>
          <td class="author-colon">:</td>
          <td class="author-val-bold">24/542626/SV/25066</td>
        </tr>
        <tr>
          <td class="author-label">Kelas</td>
          <td class="author-colon">:</td>
          <td>B1</td>
        </tr>
        <tr>
          <td class="author-label">Dosen Pengampu</td>
          <td class="author-colon">:</td>
          <td>Galih Malela Damaraji</td>
        </tr>
      </table>
    </div>

    <div class="cover-footer">
      <div class="cover-instansi">PROGRAM STUDI D-IV TEKNOLOGI REKAYASA PERANGKAT LUNAK</div>
      <div class="cover-instansi">DEPARTEMEN TEKNIK ELEKTRO DAN INFORMATIKA</div>
      <div class="cover-instansi">SEKOLAH VOKASI</div>
      <div class="cover-instansi">UNIVERSITAS GADJAH MADA</div>
      <div class="cover-instansi">YOGYAKARTA</div>
      <div class="cover-instansi">2026</div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- ISI KONTEN LAPORAN: HASIL DAN PEMBAHASAN   -->
  <!-- ========================================== -->
  <div class="doc-header">
    <div class="doc-main-heading">UJIAN TENGAH SEMESTER</div>
    <div class="doc-sub-heading">RANCANG BANGUN SISTEM POINT OF SALE (POS) TERDISTRIBUSI</div>
    <div style="font-size: 13pt; font-weight: bold; margin-top: 10pt;">Hasil dan Pembahasan</div>
  </div>

  <p>
    Pelaksanaan Ujian Tengah Semester (UTS) mata kuliah Konstruksi dan Evolusi Perangkat Lunak ini bertujuan untuk menguji 
    kemampuan mahasiswa dalam merancang, membangun, mengontainerisasi, serta mengotomatisasi pengujian dan deployment 
    sebuah aplikasi web terdistribusi skala penuh. Tema aplikasi yang dikembangkan adalah <strong>Aplikasi POS Sederhana (Manajemen Produk Kasir)</strong>. 
    Seluruh kode sumber dikelola menggunakan struktur monorepo Git publik pada repositori 
    <strong>https://github.com/EricoAli/uts-pl-24-542626-SV-25066</strong>. Repositori tersebut mengintegrasikan backend RESTful API 
    berbasis Laravel 13 dan Laravel Sanctum pada subfolder <code>backend/</code>, antarmuka Single Page Application (SPA) berbasis 
    Vue.js 3 dan Vite pada subfolder <code>frontend/</code>, pengujian otomatis melalui GitHub Actions Workflow, serta orkestrasi 
    tiga layanan kontainer (database MySQL, backend FrankenPHP, dan frontend Nginx) menggunakan Docker Compose.
  </p>

  <!-- SEKSI 1: BACKEND LARAVEL & POSTMAN -->
  <div class="section-title">1. Inisialisasi dan Pengembangan Backend RESTful API Laravel (Soal 1)</div>
  <p>
    Tahap pertama pembangunan sistem adalah menginisialisasi kerangka kerja backend menggunakan Laravel versi 13 di dalam 
    direktori <code>backend/</code>. Untuk mengamankan endpoint API, dipasang paket resmi <strong>Laravel Sanctum</strong> 
    melalui perintah <code>php artisan install:api</code> yang menyediakan token berbasis Bearer Personal Access Token.
  </p>

  <div class="subsection-title">A. Autentikasi dan Seeder Kasir Idempoten (Soal 1a)</div>
  <p>
    Autentikasi dikendalikan oleh <code>AuthController</code> (berkas <code>backend/app/Http/Controllers/AuthController.php</code>) 
    yang menyediakan dua fungsi utama:
  </p>
  <ul>
    <li>
      <code>POST /api/login</code>: Menerima masukan <code>email</code> dan <code>password</code>, memvalidasi keberadaan data pengguna, 
      memverifikasi hash kata sandi, dan menerbitkan access token Sanctum baru (<code>$user->createToken('auth-token')->plainTextToken</code>). 
      Endpoint mengembalikan respons JSON berupa pesan sukses, access token, tipe token, dan objek data pengguna.
    </li>
    <li>
      <code>POST /api/logout</code>: Menghapus token aktif pengguna yang sedang login melalui perintah 
      <code>$request->user()->currentAccessToken()->delete()</code> sehingga token tersebut langsung menjadi tidak valid.
    </li>
  </ul>
  <p>
    Untuk keperluan pengujian lokal dan pengoperasian perdana, dibuat berkas <code>backend/database/seeders/DatabaseSeeder.php</code> 
    yang secara idempoten (menggunakan <code>User::firstOrCreate</code>) mendaftarkan satu akun kasir default dengan email 
    <code>admin@pos.com</code> dan kata sandi <code>password123</code>. Sifat idempoten ini krusial agar seeder dapat dieksekusi 
    berulang kali pada container entrypoint tanpa menimbulkan galat duplikasi data.
  </p>

  <div class="subsection-title">B. Resource CRUD Katalog Produk Kasir (Soal 1b & 1c)</div>
  <p>
    Pengelolaan katalog produk diimplementasikan melalui model <code>Product</code>, migrasi skema tabel <code>products</code>, 
    dan <code>ProductController</code> yang didaftarkan sebagai <code>apiResource</code> pada <code>backend/routes/api.php</code>. 
    Seluruh endpoint selain <code>/api/login</code> dilindungi menggunakan middleware <code>auth:sanctum</code>. 
    Setiap entitas produk menyimpan atribut: <code>sku</code> (string, unique), <code>name</code> (string), <code>category</code> (string), 
    <code>price</code> (decimal), dan <code>stock</code> (integer).
  </p>
  <p>
    Implementasi controller memenuhi lima aksi RESTful standar dengan kode status HTTP yang sangat presisi:
  </p>
  <ul>
    <li><code>GET /api/products</code>: Menampilkan seluruh katalog produk kasir (HTTP <code>200 OK</code>).</li>
    <li><code>GET /api/products/{id}</code>: Menampilkan rincian produk tunggal berdasarkan ID (HTTP <code>200 OK</code> jika ditemukan, HTTP <code>404 Not Found</code> jika ID tidak valid).</li>
    <li><code>POST /api/products</code>: Menambahkan produk baru ke database dengan validasi ketat (HTTP <code>201 Created</code> saat sukses).</li>
    <li><code>PUT/PATCH /api/products/{id}</code>: Memperbarui data produk yang telah ada (HTTP <code>200 OK</code>).</li>
    <li><code>DELETE /api/products/{id}</code>: Menghapus produk dari database (HTTP <code>200 OK</code>).</li>
    <li>HTTP <code>422 Unprocessable Entity</code>: Dikembalikan secara otomatis apabila validasi form gagal (misal: format harga negatif, SKU duplikat, atau kolom wajib kosong).</li>
    <li>HTTP <code>401 Unauthorized</code>: Dikembalikan apabila endpoint diakses tanpa menyertakan Bearer token atau token telah dicabut.</li>
  </ul>

  <div class="figure-container">
    <img src="${images.img01}" alt="routes/api.php" class="figure-img">
    <div class="figure-caption">Gambar 1. Konfigurasi rute API terproteksi middleware auth:sanctum pada berkas backend/routes/api.php.</div>
  </div>

  <div class="figure-container">
    <img src="${images.img02}" alt="ProductController.php" class="figure-img">
    <div class="figure-caption">Gambar 2. Implementasi aksi RESTful CRUD dan validasi data pada ProductController.php.</div>
  </div>

  <div class="page-break"></div>
  <div class="subsection-title">C. Koleksi Pengujian Postman v2.1 (Soal 1d)</div>
  <p>
    Seluruh endpoint RESTful API didokumentasikan dan diuji menggunakan berkas Postman Collection v2.1 resmi bernama 
    <code>POS_API.postman_collection.json</code> yang diletakkan di root repositori. Koleksi ini memanfaatkan variabel 
    lingkungan koleksi <code>{{base_url}}</code> (default <code>http://127.0.0.1:8000/api</code>) dan <code>{{token}}</code>. 
    Pada permintaan Login, disematkan skrip otomatisasi Post-Response:
  </p>
  <pre>pm.test("Login successful and token stored", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.collectionVariables.set("token", jsonData.access_token);
});</pre>
  <p>
    Skrip ini memastikan bahwa setelah permintaan login berhasil, token akses langsung tersimpan ke variabel <code>{{token}}</code> 
    dan diinjeksikan secara otomatis ke header permintaan selanjutnya (<code>Authorization: Bearer {{token}}</code>). 
    Gambar 3 hingga Gambar 9 mendokumentasikan hasil pengujian Postman terhadap server lokal.
  </p>

  <div class="figure-container">
    <img src="${images.img03}" alt="Postman Login 200" class="figure-img">
    <div class="figure-caption">Gambar 3. Eksekusi pengujian POST /api/login pada Postman mengembalikan HTTP 200 OK dan Bearer token.</div>
  </div>

  <div class="figure-container">
    <img src="${images.img04}" alt="Postman GET Products 200" class="figure-img">
    <div class="figure-caption">Gambar 4. Eksekusi pengujian GET /api/products menampilkan seluruh katalog produk kasir (HTTP 200 OK).</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <img src="${images.img05}" alt="Postman POST Product 201" class="figure-img">
    <div class="figure-caption">Gambar 5. Eksekusi pengujian POST /api/products berhasil membuat produk baru dengan respons HTTP 201 Created.</div>
  </div>

  <div class="figure-container">
    <img src="${images.img06}" alt="Postman PUT Product 200" class="figure-img">
    <div class="figure-caption">Gambar 6. Eksekusi pengujian PUT /api/products/{id} berhasil memperbarui data produk (HTTP 200 OK).</div>
  </div>

  <div class="figure-container">
    <img src="${images.img07}" alt="Postman DELETE Product 200" class="figure-img">
    <div class="figure-caption">Gambar 7. Eksekusi pengujian DELETE /api/products/{id} berhasil menghapus produk dari database (HTTP 200 OK).</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <img src="${images.img08}" alt="Postman Validation 422" class="figure-img">
    <div class="figure-caption">Gambar 8. Pengujian kasus validasi gagal (SKU duplikat dan harga negatif) mengembalikan respons HTTP 422 Unprocessable Entity.</div>
  </div>

  <div class="figure-container">
    <img src="${images.img09}" alt="Postman Unauthorized 401" class="figure-img">
    <div class="figure-caption">Gambar 9. Pengujian akses rute produk tanpa menyertakan Bearer token mengembalikan respons HTTP 401 Unauthorized.</div>
  </div>

  <div class="subsection-title">D. Pengujian Fungsional Otomatis (Automated Feature Testing) (Soal 1e)</div>
  <p>
    Untuk menjamin kualitas dan regresi kode, dibangun rangkaian pengujian otomatis pada berkas 
    <code>backend/tests/Feature/AuthApiTest.php</code> dan <code>backend/tests/Feature/ProductApiTest.php</code>. 
    Test suite mencakup pengujian autentikasi (login sukses, login gagal, validasi kredensial kosong, logout pengguna sah, 
    dan penolakan logout tanpa token) serta pengujian operasional CRUD (penolakan akses tanpa token, pembuatan produk 201, 
    validasi gagal 422, pemanggilan list produk 200, pembacaan detail produk, respons 404 ID tidak ditemukan, 
    pembaruan data produk 200, dan penghapusan produk 200).
  </p>
  <p>
    Pengujian dieksekusi secara lokal menggunakan konsol PHPUnit melalui perintah <code>php artisan test</code>. 
    Berdasarkan eksekusi pada Gambar 10, total <strong>15 test suite dengan 76 assertions berhasil lulus secara sempurna (100% green)</strong> 
    dalam durasi 2.73 detik.
  </p>

  <div class="figure-container">
    <img src="${images.img10}" alt="php artisan test" class="figure-img">
    <div class="figure-caption">Gambar 10. Hasil eksekusi pengujian otomatis lokal (php artisan test) dengan status 15 passed (76 assertions).</div>
  </div>

  <!-- SEKSI 2: FRONTEND VUE.JS -->
  <div class="page-break"></div>
  <div class="section-title">2. Pengembangan Frontend Vue.js 3 SPA dan Integrasi API Terpusat (Soal 2)</div>
  <p>
    Lapisan antarmuka pengguna dibangun menggunakan kerangka kerja Vue.js versi 3 dengan bundler Vite di dalam direktori <code>frontend/</code>. 
    Aplikasi menerapkan arsitektur Single Page Application (SPA) yang responsif dan interaktif.
  </p>

  <div class="subsection-title">A. Konfigurasi Variabel Lingkungan Dinamis (Soal 2c)</div>
  <p>
    Sesuai prinsip Twelve-Factor App, alamat URL backend tidak boleh ditulis mati (hardcoded) di dalam komponen Vue. 
    Oleh karena itu, dibuat instance Axios terpusat pada berkas <code>frontend/src/services/api.js</code> yang membaca konfigurasi 
    URL dari variabel lingkungan:
  </p>
  <pre>const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});</pre>
  <p>
    Berkas sampel <code>frontend/.env.example</code> disediakan sebagai template konfigurasi publik dengan nilai 
    <code>VITE_API_BASE_URL=http://127.0.0.1:8000/api</code>, sedangkan file <code>.env</code> lokal diabaikan oleh Git via <code>.gitignore</code>.
  </p>

  <div class="subsection-title">B. Sentralisasi HTTP Client Axios dan Interceptors (Soal 2a)</div>
  <p>
    Modul <code>api.js</code> dikonfigurasi dengan dua lapis pencegat (interceptor):
  </p>
  <ul>
    <li>
      <strong>Request Interceptor:</strong> Secara otomatis membaca token dari <code>localStorage.getItem('token')</code> 
      dan menyematkannya pada header permintaan keluar: <code>config.headers.Authorization = 'Bearer ' + token</code>.
    </li>
    <li>
      <strong>Response Interceptor:</strong> Menangani respons kesalahan secara global. Apabila server mengembalikan status 
      <code>401 Unauthorized</code> (misal: masa berlaku token berakhir), interceptor secara otomatis menghapus token dari 
      <code>localStorage</code> dan mengalihkan pengguna kembali ke rute <code>/login</code>.
    </li>
  </ul>

  <div class="figure-container">
    <img src="${images.img14}" alt="api.js & .env.example" class="figure-img">
    <div class="figure-caption">Gambar 11. Implementasi modul sentralisasi Axios dengan Bearer interceptor dan berkas .env.example.</div>
  </div>

  <div class="page-break"></div>
  <div class="subsection-title">C. Antarmuka Login, Dashboard Produk, dan Modal CRUD (Soal 2a & 2b)</div>
  <p>
    Antarmuka aplikasi terdiri dari dua tampilan utama yang didukung oleh Vue Router (<code>frontend/src/router/index.js</code>):
  </p>
  <ul>
    <li>
      <strong>Halaman Login (<code>LoginView.vue</code>):</strong> Menyediakan form masukan email dan kata sandi. 
      Saat formulir disubmit, Axios mengirim request ke <code>/api/login</code>. Token akses dan objek profil kasir disimpan di 
      <code>localStorage</code>, lalu router mengarahkan tampilan ke <code>/products</code>.
    </li>
    <li>
      <strong>Dashboard Katalog Produk (<code>ProductsView.vue</code>):</strong> Menampilkan ringkasan katalog produk kasir dalam bentuk tabel, 
      indikator stok dan harga dengan format mata uang Rupiah, pencarian reaktif, tombol pembaruan data, tombol hapus produk, 
      serta tombol pemicu modal pop-up tambah produk.
    </li>
    <li>
      <strong>Modal Tambah dan Edit Produk:</strong> Form interaktif untuk membuat atau memperbarui produk. 
      Validasi form terintegrasi langsung dengan pesan kesalahan dari backend (HTTP 422).
    </li>
    <li>
      <strong>Navigation Guard:</strong> Fungsi <code>router.beforeEach</code> memvalidasi keberadaan token di <code>localStorage</code>. 
      Rute <code>/products</code> hanya dapat diakses oleh kasir yang telah terotentikasi, sedangkan kasir yang sudah login 
      akan otomatis dialihkan keluar dari halaman login.
    </li>
  </ul>

  <div class="figure-container">
    <img src="${images.img11}" alt="Frontend Login" class="figure-img">
    <div class="figure-caption">Gambar 12. Antarmuka halaman login kasir POS berjalan pada peramban web (Vue 3 SPA).</div>
  </div>

  <div class="figure-container">
    <img src="${images.img12}" alt="Frontend Dashboard Products" class="figure-img">
    <div class="figure-caption">Gambar 13. Antarmuka dashboard katalog produk POS menampilkan daftar produk dinamis dari backend API.</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <img src="${images.img13}" alt="Frontend Modal Create" class="figure-img">
    <div class="figure-caption">Gambar 14. Antarmuka modal dialog interaktif untuk penambahan dan pengubahan data produk kasir.</div>
  </div>

  <!-- SEKSI 3: MANAJEMEN GIT & BRANCHING -->
  <div class="section-title">3. Manajemen Repositori Git Monorepo, Alur Percabangan, dan Branch Protection (Soal 3)</div>
  <p>
    Manajemen kode sumber dikelola secara terpusat menggunakan model monorepo pada Git. Struktur ini menampung 
    seluruh kode backend, frontend, konfigurasi Docker, dan berkas workflow CI/CD dalam satu repositori yang kohesif.
  </p>

  <div class="subsection-title">A. Alur Percabangan Git Flow (Soal 3a)</div>
  <p>
    Strategi percabangan dirancang dengan menerapkan tiga tingkatan cabang:
  </p>
  <ul>
    <li><code>main</code>: Cabang rilis produksi utama. Seluruh kode pada cabang ini dijamin stabil dan siap disebarkan ke registry container.</li>
    <li><code>dev</code>: Cabang staging integrasi. Tempat penggabungan fitur-fitur baru sebelum dirilis ke cabang produksi.</li>
    <li><code>feat/pos-system</code>: Cabang pengembangan fitur aktif di mana seluruh implementasi teknis dikerjakan secara bertahap.</li>
  </ul>

  <div class="subsection-title">B. Peninjauan dan Penggabungan Pull Request (PR)</div>
  <p>
    Proses penggabungan kode dilakukan secara formal melalui mekanisme <strong>Pull Request (PR)</strong> pada GitHub:
  </p>
  <ul>
    <li><strong>Pull Request #1:</strong> Menggabungkan cabang fitur <code>feat/pos-system</code> ke cabang integrasi <code>dev</code> setelah seluruh pemeriksaan status check CI berhasil.</li>
    <li><strong>Pull Request #2:</strong> Menggabungkan cabang integrasi <code>dev</code> ke cabang produksi utama <code>main</code> sebagai rilis resmi sistem POS.</li>
  </ul>

  <div class="subsection-title">C. Penerapan Aturan Proteksi Cabang (Branch Protection Rules) (Soal 3b)</div>
  <p>
    Untuk menjaga integritas kode dan mencegah kesalahan manusiawi, kedua cabang penting (<code>main</code> dan <code>dev</code>) 
    diberikan perlindungan ketat melalui menu <em>Settings &gt; Branches</em> di GitHub. Aturan yang diaktifkan meliputi:
    (1) Melarang direct commit tanpa melalui Pull Request, (2) Mewajibkan status checks kelulusan pipeline CI 
    (job <code>Backend Tests</code> dan <code>Frontend Build</code>) sebelum opsi merge dapat ditekan, dan (3) Menonaktifkan opsi <em>force push</em> 
    serta penghapusan cabang secara tidak sengaja.
  </p>

  <div class="figure-container">
    <img src="${images.img15}" alt="GitHub Main Repo" class="figure-img">
    <div class="figure-caption">Gambar 15. Halaman utama repositori monorepo publik GitHub EricoAli/uts-pl-24-542626-SV-25066.</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <img src="${images.img16}" alt="GitHub Pull Requests" class="figure-img">
    <div class="figure-caption">Gambar 16. Daftar Pull Request resmi yang berhasil digabungkan (PR #1 ke dev dan PR #2 ke main).</div>
  </div>

  <div class="figure-container">
    <img src="${images.img21}" alt="Branch Protection" class="figure-img">
    <div class="figure-caption">Gambar 17. Konfigurasi Branch Protection Rules pada cabang main dan dev dengan persyaratan wajib status check CI.</div>
  </div>

  <!-- SEKSI 4: CI/CD KE GHCR -->
  <div class="section-title">4. Otomasi Continuous Integration (CI) dan Continuous Deployment (CD) ke GHCR (Soal 4)</div>
  <p>
    Otomasi siklus pengembangan diwujudkan melalui berkas konfigurasi GitHub Actions Workflow pada direktori 
    <code>.github/workflows/ci.yml</code>. Pipeline dikonfigurasi dengan pemicu (trigger) pada event <code>push</code> 
    ke cabang <code>main</code> dan <code>dev</code>, serta event <code>pull_request</code> ke cabang <code>main</code> dan <code>dev</code>.
  </p>

  <div class="subsection-title">A. Konfigurasi Job Continuous Integration (Soal 3c)</div>
  <p>
    Pipeline CI menjalankan dua job pengujian dan validasi secara paralel pada pelari virtual Ubuntu (<code>ubuntu-latest</code>):
  </p>
  <ul>
    <li>
      <strong>Job <code>test-backend</code>:</strong> Berjalan di direktori <code>./backend</code>. Langkah-langkahnya meliputi: 
      (1) Checkout repository via <code>actions/checkout@v4</code>, (2) Setup lingkungan runtime PHP 8.4 via <code>shivammathur/setup-php@v2</code> 
      beserta ekstensi sqlite, mbstring, dom, dan curl, (3) Pembuatan berkas database fisik SQLite via <code>touch database/database.sqlite</code>, 
      (4) Instalasi dependensi Composer melalui <code>composer install --no-interaction --prefer-dist</code>, 
      (5) Dynamic fallback generation untuk application encryption key agar pengujian berjalan aman tanpa membocorkan rahasia, 
      dan (6) Eksekusi pengujian otomatis penuh menggunakan <code>php artisan test</code>.
    </li>
    <li>
      <strong>Job <code>build-frontend</code>:</strong> Berjalan di direktori <code>./frontend</code>. Langkah-langkahnya meliputi: 
      (1) Setup runtime Node.js 22 via <code>actions/setup-node@v4</code>, (2) Instalasi paket dependensi secara bersih melalui 
      <code>npm ci</code>, dan (3) Kompilasi bundel aset produksi menggunakan <code>npm run build</code> guna memverifikasi sintaksis 
      dan ketiadaan galat build pada kode Vue SPA.
    </li>
  </ul>

  <div class="page-break"></div>
  <div class="subsection-title">B. Konfigurasi Job Continuous Deployment (CD) ke GHCR (Soal 4a & 4c)</div>
  <p>
    Tahap deployment diimplementasikan melalui job <code>deploy</code> yang memiliki klausul dependensi 
    <code>needs: [test-backend, build-frontend]</code>. Sesuai instruksi penugasan Soal 4a, job deployment diberikan klausul pembatasan cabang:
  </p>
  <pre>if: github.event_name == 'push' && github.ref == 'refs/heads/main'</pre>
  <p>
    Klausul ini menjamin bahwa job deployment hanya akan dieksekusi saat kode berhasil digabungkan dan didorong ke cabang <code>main</code>. 
    Pada event Pull Request maupun push ke cabang <code>dev</code>, job ini secara otomatis diabaikan (berstatus <em>Skipped</em>). 
    Ketika aktif, job deploy mengeksekusi autentikasi ke <strong>GitHub Packages Container Registry (GHCR)</strong> 
    menggunakan token bawaan <code>GITHUB_TOKEN</code>, mengompilasi image multi-stage untuk backend dan frontend, 
    serta mem-push container images ke registry publik dengan tag commit SHA spesifik dan tag <code>latest</code>:
  </p>
  <ul>
    <li><code>ghcr.io/ericoali/uts-pl-24-542626-sv-25066/backend:latest</code></li>
    <li><code>ghcr.io/ericoali/uts-pl-24-542626-sv-25066/frontend:latest</code></li>
  </ul>

  <div class="subsection-title">C. Keamanan Repositori dan GitHub Secrets (Soal 4b)</div>
  <p>
    Untuk mencegah kebocoran informasi kredensial ke riwayat commit publik, berkas <code>.env.example</code> di root dan 
    <code>backend/.env.example</code> dipastikan tidak memuat kunci rahasia (<code>APP_KEY=</code> dan <code>DB_PASSWORD=</code> dibiarkan kosong). 
    Nilai rahasia sebenarnya disimpan secara terenkripsi pada panel <strong>GitHub Repository Secrets</strong> 
    (<code>APP_KEY</code> dan <code>DB_PASSWORD</code>) yang hanya dapat diakses saat workflow CI/CD dieksekusi.
  </p>

  <div class="figure-container">
    <img src="${images.img18}" alt="GitHub Actions PR Run" class="figure-img">
    <div class="figure-caption">Gambar 18. Verifikasi pipeline pada Pull Request: Job test dan build sukses, sedangkan job deploy otomatis dilewati (skipped).</div>
  </div>

  <div class="figure-container">
    <img src="${images.img19}" alt="GitHub Actions Main Run" class="figure-img">
    <div class="figure-caption">Gambar 19. Eksekusi rilis penuh pada cabang main: Seluruh tahapan test, build, dan deploy ke GHCR berhasil diselesaikan.</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <img src="${images.img20}" alt="GHCR Packages" class="figure-img">
    <div class="figure-caption">Gambar 20. Paket container image resmi terpublikasi pada GitHub Container Registry (GHCR) publik.</div>
  </div>

  <div class="figure-container">
    <img src="${images.img22}" alt="GitHub Secrets" class="figure-img">
    <div class="figure-caption">Gambar 21. Pengelolaan kredensial terenkripsi APP_KEY dan DB_PASSWORD pada menu Actions secrets and variables di GitHub.</div>
  </div>

  <!-- SEKSI 5: DOCKERFILE MULTI-STAGE -->
  <div class="section-title">5. Kontainerisasi Multi-Stage Dockerfile Backend dan Frontend (Soal 5)</div>
  <p>
    Seluruh komponen aplikasi dikemas secara portabel ke dalam format image OCI/Docker standar menggunakan berkas Dockerfile 
    yang dioptimasi untuk efisiensi ukuran dan kecepatan booting.
  </p>

  <div class="subsection-title">A. Backend Dockerfile dengan FrankenPHP (Soal 5a & Soal 7)</div>
  <p>
    Berkas <code>backend/Dockerfile</code> menggunakan base image resmi <code>dunglas/frankenphp:1-php8.4-alpine</code> (tanpa menggunakan tag <code>latest</code>). 
    Pemasangan ekstensi PHP (<code>pdo_mysql</code>, <code>zip</code>, <code>opcache</code>, <code>pcntl</code>) dilakukan melalui utilitas <code>install-php-extensions</code>. 
    Untuk mengoptimalkan mekanisme layer caching Docker, berkas <code>composer.json</code> dan <code>composer.lock</code> disalin terlebih dahulu 
    sebelum instruksi <code>composer install --no-dev --no-scripts --no-autoloader --prefer-dist</code> dijalankan. 
    Setelah itu, seluruh kode aplikasi disalin dan diakhiri dengan <code>composer dump-autoload --optimize</code>.
  </p>
  <p>
    Kontainer dikendalikan oleh skrip entrypoint mandiri <code>backend/docker-entrypoint.sh</code>. Skrip ini secara otomatis: 
    (1) Melakukan polling koneksi TCP ke layanan basis data <code>db:3306</code> hingga database benar-benar siap menerima kueri, 
    (2) Menjalankan migrasi tabel melalui <code>php artisan migrate --force</code>, (3) Menjalankan seeder akun kasir melalui 
    <code>php artisan db:seed --force</code>, dan (4) Menjalankan application server FrankenPHP pada mode listener port 8000:
  </p>
  <pre>exec frankenphp php-server --root /app/public --listen :8000</pre>

  <div class="subsection-title">B. Frontend Dockerfile Multi-Stage Build & Nginx Reverse Proxy (Soal 5b & 6b)</div>
  <p>
    Berkas <code>frontend/Dockerfile</code> menerapkan teknik <em>multi-stage build</em> untuk memisahkan lingkungan kompilasi dengan lingkungan produksi:
  </p>
  <ul>
    <li>
      <strong>Stage 1 (Builder):</strong> Menggunakan image <code>node:22-alpine</code>. Seluruh berkas dependensi <code>package.json</code> 
      disalin, pustaka diinstal via <code>npm ci</code>, dan aset dikompilasi ke direktori <code>dist/</code> menggunakan <code>npm run build</code>.
    </li>
    <li>
      <strong>Stage 2 (Production):</strong> Menggunakan image server web ringan <code>nginx:1.27-alpine</code>. 
      Hanya folder hasil kompilasi <code>dist/</code> yang disalin ke web root <code>/usr/share/nginx/html</code>. 
      Folder <code>node_modules</code> sama sekali tidak terbawa ke dalam image akhir, menghasilkan container yang sangat ramping dan aman.
    </li>
  </ul>
  <p>
    Berkas konfigurasi <code>frontend/nginx.conf</code> dikonfigurasi sebagai static web server sekaligus reverse proxy. 
    Seluruh permintaan dengan awalan URI <code>/api/</code> secara transparan diteruskan ke kontainer backend:
  </p>
  <pre>location /api/ {
    proxy_pass http://backend:8000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}</pre>
  <p>
    Konfigurasi ini memenuhi ketentuan Soal 6b, di mana frontend dapat berkomunikasi dengan backend melalui nama host service 
    di jaringan internal Docker tanpa mengekspos port backend secara langsung ke pengguna dan mengeliminasi masalah CORS.
  </p>

  <div class="figure-container">
    <img src="${images.img23}" alt="Dockerfile Backend FrankenPHP" class="figure-img">
    <div class="figure-caption">Gambar 22. Definisi berkas backend/Dockerfile berbasis FrankenPHP Alpine dan skrip otomatisasi docker-entrypoint.sh.</div>
  </div>

  <div class="figure-container">
    <img src="${images.img24}" alt="Dockerfile Frontend Nginx" class="figure-img">
    <div class="figure-caption">Gambar 23. Berkas frontend/Dockerfile multi-stage dan konfigurasi Nginx reverse proxy menuju backend:8000.</div>
  </div>

  <!-- SEKSI 6: DOCKER COMPOSE & PERSISTENSI -->
  <div class="page-break"></div>
  <div class="section-title">6. Orkestrasi Multi-Container Docker Compose, Service Networking, dan Persistensi Data (Soal 6 & Soal 7)</div>
  <p>
    Orkestrasi seluruh layanan aplikasi didefinisikan secara deklaratif di dalam berkas <code>docker-compose.yml</code> di root repositori. 
    Seluruh arsitektur dapat dijalankan secara instan hanya dengan mengeksekusi satu perintah: <code>docker compose up -d</code>.
  </p>

  <div class="subsection-title">A. Orkestrasi Tiga Layanan Kontainer (Soal 6a)</div>
  <p>
    Docker Compose mengelola tiga service terkoordinasi:
  </p>
  <ul>
    <li><code>db</code>: Layanan basis data relasional menggunakan image resmi <code>mysql:8.0</code> dengan konfigurasi variabel lingkungan untuk database <code>pos_database</code> dan kredensial pengguna <code>pos_user</code>. Dilengkapi pemeriksaan kesehatan (<em>healthcheck</em>) berkala menggunakan perintah <code>mysqladmin ping</code>.</li>
    <li><code>backend</code>: Layanan RESTful API Laravel berbasis FrankenPHP yang memiliki dependensi <code>depends_on</code> pada layanan <code>db</code> dengan kondisi <code>service_healthy</code>.</li>
    <li><code>frontend</code>: Layanan antarmuka pengguna Nginx Vue SPA yang memetakan port host <code>8080:80</code> dan memiliki dependensi <code>depends_on</code> pada layanan <code>backend</code>.</li>
  </ul>

  <div class="subsection-title">B. Isolasi Jaringan dan Persistensi Data (Soal 6b & 6c)</div>
  <p>
    Ketiga layanan terhubung di dalam jaringan internal bersama berjenis bridge bernama <code>pos_network</code>. 
    Port database MySQL (<code>3306</code>) dan port FrankenPHP (<code>8000</code>) tidak diekspos keluar ke host, 
    sehingga hanya port <code>8080</code> milik Nginx yang terbuka bagi pengguna publik. Hal ini secara signifikan meningkatkan postur keamanan sistem.
  </p>
  <p>
    Untuk menjamin persistensi data (Soal 6c), direktori penyimpanan data MySQL (<code>/var/lib/mysql</code>) dipetakan ke 
    <strong>Docker Named Volume</strong> bernama <code>db_data</code>. Ketahanan data telah dibuktikan melalui pengujian siklus penghancuran kontainer: 
    seluruh container dan jaringan dimatikan melalui <code>docker compose down</code>, lalu dihidupkan kembali via <code>docker compose up -d</code>. 
    Hasil pengujian membuktikan seluruh katalog produk dan akun kasir tetap tersimpan utuh tanpa ada data yang hilang (Gambar 26).
  </p>

  <div class="subsection-title">C. Nilai Tambah Application Server Modern FrankenPHP (Soal 7)</div>
  <p>
    Penggunaan <strong>FrankenPHP</strong> memberikan keunggulan performa yang signifikan dibandingkan arsitektur tradisional PHP-FPM + Nginx. 
    FrankenPHP mengintegrasikan engine server web Caddy (berbasis bahasa Go tingkat tinggi) langsung dengan runtime PHP melalui pustaka C SAPI. 
    Dengan demikian, komunikasi antara server web dan script PHP berlangsung di dalam satu ruang memori terpadu tanpa overhead koneksi FastCGI socket. 
    FrankenPHP juga mendukung protokol modern HTTP/2, HTTP/3, pembaruan sertifikat TLS otomatis, dan kemampuan eksekusi worker persistent in-memory 
    yang melipatgandakan throughput konkurensi permintaan kasir.
  </p>

  <div class="figure-container">
    <img src="${images.img25}" alt="docker-compose.yml" class="figure-img">
    <div class="figure-caption">Gambar 24. Konfigurasi berkas docker-compose.yml mengorkestrasi service db, backend, frontend, volume, dan network.</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <img src="${images.img26}" alt="Terminal docker compose ps" class="figure-img">
    <div class="figure-caption">Gambar 25. Status live layanan kontainer (docker compose ps) menunjukkan seluruh kontainer berstatus Up dan Healthy.</div>
  </div>

  <div class="figure-container">
    <img src="${images.img27}" alt="Terminal Data Persistence" class="figure-img">
    <div class="figure-caption">Gambar 26. Verifikasi persistensi data: Katalog produk tetap tersimpan utuh setelah siklus docker compose down dan up.</div>
  </div>

  <div class="figure-container">
    <img src="${images.img28}" alt="Terminal FrankenPHP logs" class="figure-img">
    <div class="figure-caption">Gambar 27. Log konsol FrankenPHP mendokumentasikan inisialisasi Caddy server, auto-migration, dan penanganan HTTP request.</div>
  </div>

  <!-- SEKSI 7: ANALISIS ARSITEKTUR & ALIRAN DATA -->
  <div class="page-break"></div>
  <div class="section-title">7. Analisis Arsitektur Sistem dan Aliran Data End-to-End</div>
  <p>
    Secara keseluruhan, arsitektur aplikasi POS ini mengadopsi pola <em>Multi-Tier Micro-Service Architecture</em> 
    yang membagi tanggung jawab komputasi secara jelas. Aliran data dari saat pengguna membuka peramban hingga data tersimpan 
    ke penyimpanan persisten dijelaskan melalui tahapan sekuensial berikut:
  </p>
  <pre>+-----------------------------------------------------------------------------------------------+
|                                      PENGGUNA / KASIR                                         |
|                          Peramban Web: http://localhost:8080                                  |
+-----------------------------------------------------------------------------------------------+
                                               |
             1. Akses Halaman Web SPA & Permintaan API (/api/login, /api/products)
             2. Header: Authorization Bearer &lt;Token_Sanctum&gt;
                                               v
+-----------------------------------------------------------------------------------------------+
|  KONTAINER FRONTEND: pos_frontend (Nginx 1.27 Alpine - Port 8080:80)                          |
|  - Menyajikan bundel statis Vue 3 SPA (HTML, JS, CSS)                                         |
|  - Reverse Proxy: Meneruskan permintaan URI /api/ menuju proxy_pass http://backend:8000/api/ |
+-----------------------------------------------------------------------------------------------+
                                               |
             3. Komunikasi Internal Docker Bridge Network: pos_network
             4. Forwarding HTTP/1.1 via Hostname internal "backend:8000"
                                               v
+-----------------------------------------------------------------------------------------------+
|  KONTAINER BACKEND: pos_backend (FrankenPHP 1.0 - PHP 8.4 Alpine - Port 8000)                 |
|  - Server Web Caddy Go Engine + Worker PHP Terpadu                                            |
|  - Laravel 13 Routing, Middleware auth:sanctum, ProductController, dan Eloquent ORM           |
+-----------------------------------------------------------------------------------------------+
                                               |
             5. Koneksi TCP Socket Database PDO MySQL (Port 3306)
             6. Hostname internal "db:3306" (User: pos_user, Database: pos_database)
                                               v
+-----------------------------------------------------------------------------------------------+
|  KONTAINER BASIS DATA: pos_db (MySQL 8.0 - Port 3306 Internal)                                |
|  - RDBMS Engine: Eksekusi transaksi atomik tabel users, products, dan personal_access_tokens   |
+-----------------------------------------------------------------------------------------------+
                                               |
             7. Penulisan Blok Data Fisik ke Filesystem Host
                                               v
+-----------------------------------------------------------------------------------------------+
|  DOCKER NAMED VOLUME: db_data (/var/lib/mysql)                                                |
|  - Menjamin daya tahan data (ACID durability) saat kontainer dimatikan/diperbarui             |
+-----------------------------------------------------------------------------------------------+
  </pre>

  <!-- SEKSI 8: ANALISIS KENDALA & SOLUSI TEKNIS -->
  <div class="section-title">8. Analisis Kendala/Kegagalan yang Dialami dan Solusi Penanganannya</div>
  <p>
    Selama proses konstruksi perangkat lunak, konfigurasi pipeline otomasi, dan orkestrasi kontainer, terdapat empat kendala 
    dan kegagalan teknis nyata yang dialami serta berhasil diatasi secara sistematis:
  </p>

  <div class="subsection-title">A. Kendala 1: Docker Desktop Gagal Start Akibat Virtualisasi WSL2 Non-Aktif pada Host Windows</div>
  <p>
    <strong>Deskripsi Masalah:</strong> Saat pertama kali perintah kontainerisasi <code>docker compose up</code> dijalankan pada 
    lingkungan host Windows, Docker Daemon menolak berjalan dan menampilkan dialog galat: 
    <em>"Docker Desktop is unable to start: hardware assisted virtualization is disabled in BIOS"</em>.
  </p>
  <p>
    <strong>Akar Masalah:</strong> Fitur akselerasi virtualisasi perangkat keras (Intel VT-x / AMD-V) pada tingkat BIOS/UEFI 
    atau fitur platform mesin virtual Windows Subsystem for Linux (WSL2) belum diaktifkan secara sempurna di sistem operasi.
  </p>
  <p>
    <strong>Solusi dan Penanganan:</strong> 
    (1) Mengaktifkan fitur Windows Virtual Machine Platform melalui konsol PowerShell Administrator menggunakan perintah: 
    <code>dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart</code>, 
    (2) Memastikan opsi CPU Virtualization aktif di BIOS, dan (3) Memperbarui kernel WSL2 ke versi terbaru serta menetapkan 
    versi default ke versi 2 (<code>wsl --set-default-version 2</code>). Setelah engine Docker Desktop berhasil dijalankan, seluruh 
    kontainer Docker Compose dapat dibangun dan beroperasi normal.
  </p>

  <div class="page-break"></div>
  <div class="subsection-title">B. Kendala 2: Ketidakcocokan Versi PHP FrankenPHP terhadap Dependensi Symfony 8.1 / Laravel 13</div>
  <p>
    <strong>Deskripsi Masalah:</strong> Tahapan <code>composer install</code> pada <code>backend/Dockerfile</code> mengalami kegagalan fatal 
    saat awalnya dikonfigurasikan menggunakan base image <code>dunglas/frankenphp:1-php8.3-alpine</code>. Proses build berhenti dengan pesan galat: 
    <em>"symfony/process[v8.1.0] requires php &gt;= 8.4.1 -&gt; your php version (8.3.16) does not satisfy that requirement"</em>.
  </p>
  <p>
    <strong>Akar Masalah:</strong> Rilis Laravel versi terbaru (Laravel 13) yang diinisialisasi mengadopsi komponen-komponen inti 
    Symfony versi 8.1 ke atas. Komponen ini memiliki batasan dependensi biner yang mewajibkan lingkungan runtime PHP minimal versi 8.4.1.
  </p>
  <p>
    <strong>Solusi dan Penanganan:</strong> Mengganti deklarasi base image pada <code>backend/Dockerfile</code> ke versi spesifik 
    <code>dunglas/frankenphp:1-php8.4-alpine</code> serta menyelaraskan runtime PHP pada workflow GitHub Actions (<code>setup-php</code>) 
    menggunakan opsi <code>php-version: '8.4'</code>. Langkah ini menyelesaikan seluruh konflik dependensi Composer dan memastikan konsistensi 
    runtime antara lingkungan lokal, runner CI, dan image kontainer.
  </p>

  <div class="subsection-title">C. Kendala 3: Kegagalan Job Backend Tests pada Runner Ubuntu GitHub Actions</div>
  <p>
    <strong>Deskripsi Masalah:</strong> Pada Pull Request #1 (<code>feat/pos-system</code> ke <code>dev</code>), job <code>Backend Tests</code> 
    di GitHub Actions mengalami kegagalan (<em>Failing after 16s</em>). Selain itu, workflow CI terpicu dobel secara simultan 
    untuk event <code>push</code> dan <code>pull_request</code>.
  </p>
  <p>
    <strong>Akar Masalah:</strong> 
    (1) Pada tingkat job, deklarasi <code>env: APP_KEY: \${{ secrets.APP_KEY }}</code> menimpa variabel lingkungan dengan string kosong 
    karena secret repositori belum terinjeksi pada runner PR, memicu galat runtime Laravel <em>"No application encryption key has been specified"</em>. 
    (2) Runner Ubuntu belum memiliki berkas fisik <code>database/database.sqlite</code> untuk driver SQLite pengujian. 
    (3) Filter cabang pada trigger workflow menangkap push cabang fitur sekaligus pembuatan PR.
  </p>
  <p>
    <strong>Solusi dan Penanganan:</strong> 
    (1) Mengatur filter trigger pada <code>ci.yml</code> secara presisi: <code>on: push: branches: [main, dev]</code> dan <code>on: pull_request: branches: [main, dev]</code>, 
    (2) Menambahkan instruksi <code>touch database/database.sqlite</code> sebelum testing, dan 
    (3) Mengimplementasikan fallback dinamis pada skrip runner: jika <code>secrets.APP_KEY</code> kosong, runner menjalankan 
    <code>php artisan key:generate --force</code> dan mengekspor nilainya ke <code>\$GITHUB_ENV</code>. Setelah commit perbaikan didorong, 
    seluruh job pengujian pada PR langsung berhasil (hijau).
  </p>

  <div class="subsection-title">D. Kendala 4: Penolakan Huruf Kapital (Case Sensitivity) pada GitHub Container Registry (GHCR)</div>
  <p>
    <strong>Deskripsi Masalah:</strong> Proses build and push image Docker ke registry GHCR pada cabang <code>main</code> ditolak dengan pesan: 
    <em>"invalid reference format: repository name must be lowercase"</em>.
  </p>
  <p>
    <strong>Akar Masalah:</strong> Spesifikasi Open Container Initiative (OCI) dan kebijakan registry GitHub mewajibkan seluruh penamaan 
    namespace image berupa huruf kecil (lowercase). Variabel konteks <code>\${{ github.repository }}</code> secara default membawa nama akun asli 
    dengan huruf kapital (<code>EricoAli/...</code>).
  </p>
  <p>
    <strong>Solusi dan Penanganan:</strong> Menambahkan langkah normalisasi teks pada berkas workflow <code>ci.yml</code> sebelum perintah docker build: 
    <code>REPO_LOWER=\$(echo "\${{ github.repository }}" | tr '[:upper:]' '[:lower:]')</code>. Nilai <code>REPO_LOWER</code> yang telah dinormalisasi 
    (<code>ericoali/uts-pl-24-542626-sv-25066</code>) digunakan untuk tagging dan push, sehingga kedua image sukses dipublikasikan ke GHCR.
  </p>

  <!-- SEKSI 9: KESIMPULAN RECAP -->
  <div class="page-break"></div>
  <div class="section-title">9. Kesimpulan</div>
  <p>
    Berdasarkan seluruh rangkaian perancangan, implementasi kode, pengujian otomatis, kontainerisasi, dan otomatisasi deployment 
    yang telah dilaksanakan pada proyek Ujian Tengah Semester (UTS) ini, dapat ditarik beberapa poin kesimpulan utama:
  </p>
  <ol>
    <li>
      <strong>Keberhasilan Pembangunan Backend RESTful API:</strong> Layanan backend berhasil dibangun menggunakan Laravel 13 
      dan diamankan dengan Laravel Sanctum. Seluruh endpoint autentikasi (login, logout) dan resource CRUD katalog produk kasir 
      bekerja secara presisi dengan standarisasi kode status HTTP (200, 201, 422, dan 401). Dokumentasi dan pengujian API 
      terbukti lengkap melalui berkas <code>POS_API.postman_collection.json</code> serta 15 automated feature tests (76 assertions) 
      yang lulus 100%.
    </li>
    <li>
      <strong>Keberhasilan Pembangunan Frontend Single Page Application:</strong> Antarmuka kasir Vue 3 SPA berhasil diintegrasikan 
      dengan backend menggunakan Axios terpusat yang membaca variabel lingkungan <code>VITE_API_BASE_URL</code> secara dinamis. 
      Penerapan Axios request/response interceptor dan Vue navigation guard secara efektif mengamankan navigasi pengguna serta 
      menjamin token Bearer tersemat secara konsisten.
    </li>
    <li>
      <strong>Efektivitas Tata Kelola Repositori dan Alur Percabangan Git:</strong> Penerapan struktur monorepo dengan alur 
      percabangan <code>main</code>, <code>dev</code>, dan <code>feat/pos-system</code> yang dikombinasikan dengan 
      <em>Branch Protection Rules</em> berhasil mencegah terjadinya regresi kode, membatasi modifikasi tak terotorisasi, 
      serta memastikan bahwa setiap perubahan wajib diverifikasi oleh status checks pipeline CI sebelum digabungkan.
    </li>
    <li>
      <strong>Otomasi Penuh Pipeline CI/CD dan Penerbitan GHCR:</strong> Workflow GitHub Actions berhasil mengorkestrasi pengujian 
      otomatis backend dan kompilasi build frontend pada setiap Pull Request. Mekanisme conditional deployment berhasil membatasi 
      publikasi image hanya pada cabang <code>main</code>, sehingga paket kontainer backend dan frontend berhasil terbit secara aman 
      pada GitHub Packages Container Registry (GHCR) dengan kredensial terlindungi oleh GitHub Secrets.
    </li>
    <li>
      <strong>Portabilitas dan Keandalan Multi-Container dengan FrankenPHP:</strong> Arsitektur kontainerisasi multi-stage Dockerfile 
      menghasilkan image yang ramping tanpa menyisakan pustaka pengembangan. Penggunaan application server modern FrankenPHP (Caddy Go engine) 
      terbukti memberikan efisiensi tinggi tanpa pemisahan proses FastCGI. Orkestrasi Docker Compose berhasil menghubungkan ketiga layanan 
      (MySQL, backend FrankenPHP, dan frontend Nginx) dalam bridge network internal yang terisolasi, serta menjamin keutuhan data 
      secara persisten melalui Docker Named Volume.
    </li>
  </ol>

  <!-- SEKSI 10: DAFTAR PUSTAKA -->
  <div class="section-title">10. Daftar Pustaka</div>
  <ol>
    <li>Dunglas, K. (2024). <em>FrankenPHP: The modern PHP app server, written in Go</em>. Les-Tilleuls.coop. https://frankenphp.dev/docs/</li>
    <li>Docker Inc. (2024). <em>Docker Compose Documentation: Multi-container orchestration</em>. Docker Docs. https://docs.docker.com/compose/</li>
    <li>GitHub. (2024). <em>GitHub Actions Documentation: Continuous Integration and Deployment Workflows</em>. GitHub Docs. https://docs.github.com/en/actions</li>
    <li>GitHub. (2024). <em>Working with the Container registry (GHCR)</em>. GitHub Packages Documentation. https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry</li>
    <li>Otwell, T. (2024). <em>Laravel 13 Documentation: Authentication, Testing, and Sanctum API Tokens</em>. Laravel LLC. https://laravel.com/docs</li>
    <li>Vue.js Core Team. (2024). <em>Vue.js 3: The Progressive JavaScript Framework Documentation</em>. Vue.js. https://vuejs.org/guide/</li>
    <li>Humble, J., &amp; Farley, D. (2010). <em>Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation</em>. Addison-Wesley Professional.</li>
  </ol>

</body>
</html>`;
}

async function renderPdf() {
  console.log('Generating HTML report matching FORMAT LAPORAN UTS.docx...');
  const htmlContent = generateHtml();
  const htmlPath = path.join(__dirname, 'report_docx_format.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`Saved report_docx_format.html (${(fs.statSync(htmlPath).size / 1024).toFixed(2)} KB)`);

  console.log('Launching Puppeteer Chrome to render PDF...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('Printing to PDF with formal academic page settings...');
  await page.pdf({
    path: OUTPUT_PDF_PATH,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size: 10pt; font-family: 'Times New Roman', serif; width: 100%; text-align: right; padding-right: 25mm; color: #333333;">
        <span class="pageNumber"></span>
      </div>
    `,
    margin: {
      top: '25mm',
      bottom: '25mm',
      left: '25mm',
      right: '25mm'
    }
  });

  await browser.close();
  const stats = fs.statSync(OUTPUT_PDF_PATH);
  console.log(`SUCCESS! Rendered PDF at: ${OUTPUT_PDF_PATH} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

renderPdf().catch(err => {
  console.error('Fatal PDF rendering error:', err);
  process.exit(1);
});
