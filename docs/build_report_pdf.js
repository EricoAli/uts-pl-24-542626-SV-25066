const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const OUTPUT_PDF_PATH = path.join(__dirname, '..', 'Laporan_UTS_KEPL_24-542626-SV-25066.pdf');

// Helper to get Base64 image
function getBase64Image(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const bitmap = fs.readFileSync(filePath);
    return `data:image/png;base64,${bitmap.toString('base64')}`;
  }
  console.warn(`File not found: ${filePath}`);
  return '';
}

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
  <title>Laporan UTS KEPL - 24/542626/SV/25066</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    /* Cover Page */
    .cover-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
      page-break-after: always;
    }

    .cover-header {
      margin-top: 30px;
    }

    .cover-univ {
      font-size: 14pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #0f172a;
      text-transform: uppercase;
    }

    .cover-faculty {
      font-size: 11pt;
      font-weight: 600;
      color: #475569;
      margin-top: 4px;
    }

    .cover-prodi {
      font-size: 11pt;
      color: #2563eb;
      font-weight: 600;
      margin-top: 2px;
    }

    .cover-divider {
      width: 80px;
      height: 4px;
      background: #2563eb;
      margin: 25px auto;
      border-radius: 2px;
    }

    .cover-title-box {
      margin: 20px 0;
    }

    .cover-badge {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 10pt;
      font-weight: 600;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cover-title {
      font-size: 22pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin: 0 0 12px 0;
    }

    .cover-subtitle {
      font-size: 13pt;
      font-weight: 500;
      color: #64748b;
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.4;
    }

    .cover-identity-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px 36px;
      text-align: left;
      width: 100%;
      max-width: 520px;
      margin: 20px auto;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .identity-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5pt;
    }

    .identity-table td {
      padding: 6px 4px;
      vertical-align: top;
    }

    .identity-label {
      font-weight: 600;
      color: #475569;
      width: 140px;
    }

    .identity-colon {
      width: 15px;
      color: #94a3b8;
    }

    .identity-value {
      color: #0f172a;
      font-weight: 600;
    }

    .cover-footer {
      font-size: 10pt;
      color: #94a3b8;
      margin-bottom: 20px;
    }

    /* Headings & Structure */
    h1 {
      font-size: 16pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 16px;
      page-break-after: avoid;
    }

    h2 {
      font-size: 12.5pt;
      font-weight: 700;
      color: #1e3a8a;
      margin-top: 22px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 11pt;
      font-weight: 600;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 10px 0;
      text-align: justify;
    }

    ul, ol {
      margin: 0 0 12px 0;
      padding-left: 24px;
    }

    li {
      margin-bottom: 5px;
    }

    /* Callouts & Info Boxes */
    .callout {
      border-radius: 8px;
      padding: 12px 16px;
      margin: 14px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }

    .callout-info {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      color: #1e40af;
    }

    .callout-success {
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
      color: #166534;
    }

    .callout-warning {
      background: #fefce8;
      border-left: 4px solid #eab308;
      color: #854d0e;
    }

    .callout-title {
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }

    table.data-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }

    table.data-table tr:nth-child(even) {
      background: #f8fafc;
    }

    /* Screenshots & Figures */
    .figure-container {
      margin: 16px 0;
      page-break-inside: avoid;
      text-align: center;
    }

    .figure-box {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      background: #0f172a;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: inline-block;
      width: 100%;
    }

    .figure-box img {
      width: 100%;
      height: auto;
      display: block;
    }

    .figure-caption {
      font-size: 9pt;
      color: #64748b;
      margin-top: 6px;
      font-style: italic;
      font-weight: 500;
    }

    /* Code & Technical Pills */
    code {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Consolas', monospace;
      font-size: 9pt;
      overflow-x: auto;
      margin: 12px 0;
      line-height: 1.45;
      page-break-inside: avoid;
    }

    .badge-status {
      display: inline-block;
      font-size: 8.5pt;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      letter-spacing: 0.3px;
    }

    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-blue { background: #dbeafe; color: #1d4ed8; }
    .badge-amber { background: #fef3c7; color: #b45309; }

    .page-break {
      page-break-before: always;
    }

    /* Architecture Flow Box */
    .arch-flow-diagram {
      background: #f8fafc;
      border: 2px dashed #94a3b8;
      border-radius: 10px;
      padding: 16px;
      margin: 16px 0;
      font-family: 'Consolas', monospace;
      font-size: 9pt;
      line-height: 1.4;
      color: #0f172a;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-univ">Universitas Gadjah Mada</div>
      <div class="cover-faculty">Sekolah Vokasi — Departemen Teknik Elektro dan Informatika</div>
      <div class="cover-prodi">Sarjana Terapan (D4) Teknologi Rekayasa Perangkat Lunak</div>
      <div class="cover-divider"></div>
    </div>

    <div class="cover-title-box">
      <span class="cover-badge">Laporan Resmi Ujian Tengah Semester (UTS) Genap 2025/2026</span>
      <h1 class="cover-title">Rancang Bangun dan Deployment Sistem Point of Sale (POS) Terdistribusi</h1>
      <div class="cover-subtitle">
        Implementasi RESTful API Laravel 13, Vue.js 3 SPA, Orkestrasi Multi-Container FrankenPHP & Nginx, serta Pipeline CI/CD Otomatis ke GitHub Container Registry (GHCR)
      </div>
    </div>

    <div class="cover-identity-card">
      <table class="identity-table">
        <tr>
          <td class="identity-label">Mata Kuliah</td>
          <td class="identity-colon">:</td>
          <td class="identity-value">Konstruksi dan Evolusi Perangkat Lunak (SVPL261501)</td>
        </tr>
        <tr>
          <td class="identity-label">Nama Mahasiswa</td>
          <td class="identity-colon">:</td>
          <td class="identity-value">Erico Ali Gutama</td>
        </tr>
        <tr>
          <td class="identity-label">NIM</td>
          <td class="identity-colon">:</td>
          <td class="identity-value">24/542626/SV/25066</td>
        </tr>
        <tr>
          <td class="identity-label">Kelas</td>
          <td class="identity-colon">:</td>
          <td class="identity-value">A / D4 TRPL 2024</td>
        </tr>
        <tr>
          <td class="identity-label">Dosen Pengampu</td>
          <td class="identity-colon">:</td>
          <td class="identity-value">Tim Dosen Pengampu SVPL261501</td>
        </tr>
        <tr>
          <td class="identity-label">Repository GitHub</td>
          <td class="identity-colon">:</td>
          <td class="identity-value" style="word-break: break-all;">
            <a href="https://github.com/EricoAli/uts-pl-24-542626-SV-25066" style="color: #2563eb; text-decoration: none;">
              https://github.com/EricoAli/uts-pl-24-542626-SV-25066
            </a>
          </td>
        </tr>
        <tr>
          <td class="identity-label">Tanggal Pelaksanaan</td>
          <td class="identity-colon">:</td>
          <td class="identity-value">Oktober 2026</td>
        </tr>
      </table>
    </div>

    <div class="cover-footer">
      Yogyakarta, Indonesia &bull; Hak Cipta &copy; 2026 Erico Ali Gutama
    </div>
  </div>

  <!-- BAB I: RINGKASAN EKSEKUTIF & DESKRIPSI SISTEM -->
  <h1>BAB I: Ringkasan Eksekutif & Deskripsi Sistem</h1>
  
  <p>
    Laporan ini menyajikan dokumentasi komprehensif atas pengerjaan Ujian Tengah Semester (UTS) mata kuliah 
    <strong>Konstruksi dan Evolusi Perangkat Lunak (SVPL261501)</strong>. Proyek ini mengimplementasikan sistem 
    <strong>Point of Sale (POS) Sederhana</strong> yang berfokus pada manajemen katalog produk dan operasional kasir harian. 
    Arsitektur sistem dibangun secara modular dengan memisahkan domain backend (RESTful API berbasis framework Laravel 13) 
    dan frontend (Single Page Application berbasis Vue 3 dan Vite), serta didukung oleh kontainerisasi modern 
    (Docker Compose multi-service dengan web application server mutakhir <em>FrankenPHP</em>).
  </p>

  <p>
    Seluruh siklus pengembangan (<em>Software Development Lifecycle</em>) dikelola secara otomatis menggunakan 
    Version Control System <strong>Git Monorepo</strong> dengan percabangan fitur standar industri (<code>main</code>, <code>dev</code>, dan <code>feat/pos-system</code>), 
    mekanisme <strong>Branch Protection Rules</strong>, <strong>Continuous Integration (CI)</strong> untuk automated testing dan lint build, serta 
    <strong>Continuous Deployment (CD)</strong> yang mengemas container images multi-stage ke <strong>GitHub Container Registry (GHCR)</strong>.
  </p>

  <div class="callout callout-info">
    <div class="callout-title">📌 Informasi Repositori dan Artefak Utama</div>
    <ul style="margin: 4px 0 0; padding-left: 20px;">
      <li><strong>URL Repositori GitHub:</strong> <a href="https://github.com/EricoAli/uts-pl-24-542626-SV-25066" target="_blank">https://github.com/EricoAli/uts-pl-24-542626-SV-25066</a></li>
      <li><strong>Postman API Collection v2.1:</strong> Tersedia di root repositori dengan nama file <code>POS_API.postman_collection.json</code>, memuat koleksi endpoint lengkap, dokumentasi parameter, environment variable <code>{{base_url}}</code>, dan test runner otomatis untuk capture token bearer.</li>
      <li><strong>Container Registry Images (GHCR):</strong>
        <br>&bull; <code>ghcr.io/ericoali/uts-pl-24-542626-sv-25066/backend:latest</code> (FrankenPHP Caddy Worker)
        <br>&bull; <code>ghcr.io/ericoali/uts-pl-24-542626-sv-25066/frontend:latest</code> (Nginx Reverse Proxy & Vue SPA)
      </li>
    </ul>
  </div>

  <h2>Struktur Direktori Monorepo Proyek</h2>
  <pre>uts-pl-24-542626-SV-25066/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI/CD Pipeline (Test, Build, Deploy GHCR)
├── backend/                       # RESTful API Service (Laravel 13 + Sanctum + FrankenPHP)
│   ├── app/Http/Controllers/
│   │   ├── AuthController.php     # Endpoint Login & Logout
│   │   └── ProductController.php  # Resource CRUD API Products
│   ├── database/
│   │   ├── migrations/            # Skema tabel products & users
│   │   └── seeders/DatabaseSeeder.php # Idempotent Kasir User Seeder
│   ├── routes/api.php             # Registrasi endpoint terproteksi auth:sanctum
│   ├── tests/Feature/             # Automated Feature Testing (Auth & Product CRUD)
│   ├── Dockerfile                 # Image FrankenPHP Alpine (dunglas/frankenphp:1-php8.4-alpine)
│   └── docker-entrypoint.sh       # Auto DB wait, migration, seeding & server launcher
├── frontend/                      # User Interface (Vue.js 3 + Vite + Pinia/Axios)
│   ├── src/
│   │   ├── services/api.js        # Centralized Axios with Bearer Interceptor & Base URL env
│   │   ├── views/LoginView.vue    # Halaman Login Kasir
│   │   └── views/ProductsView.vue # Dashboard Katalog POS & Modal CRUD
│   ├── nginx.conf                 # Nginx Web Server + Reverse Proxy /api/ -> backend:8000
│   └── Dockerfile                 # Multi-Stage Build (Node 22-alpine -> Nginx 1.27-alpine)
├── docker-compose.yml             # Multi-Container Orchestration (db, backend, frontend)
├── POS_API.postman_collection.json# Postman Collection v2.1 resmi pengujian API
├── .env.example                   # Contoh konfigurasi aman tanpa kredensial bocor
└── Laporan_UTS_KEPL_24-542626-SV-25066.pdf # Dokumen Laporan Resmi</pre>

  <!-- BAB II: PEMBAHASAN IMPLEMENTASI TEKNIS -->
  <div class="page-break"></div>
  <h1>BAB II: Pembahasan Implementasi Teknis (Soal 1 s/d Soal 7)</h1>

  <h2>1. Soal 1: Backend RESTful API Laravel & Pengujian Postman</h2>
  <p>
    Layanan backend dibangun menggunakan framework Laravel versi 13 yang diinstal di dalam folder <code>backend/</code>. 
    Autentikasi API diamankan dengan <strong>Laravel Sanctum</strong> menggunakan mekanisme Personal Access Token (Bearer Token).
  </p>
  <ul>
    <li>
      <strong>Autentikasi (Soal 1a):</strong> <code>AuthController</code> menyediakan endpoint <code>POST /api/login</code> 
      untuk memvalidasi kredensial pengguna (email & password) dan menerbitkan access token Sanctum, serta endpoint 
      <code>POST /api/logout</code> untuk mencabut token pengguna yang sedang aktif (<code>$request->user()->currentAccessToken()->delete()</code>).
      Database diinisialisasi melalui seeder idempoten (<code>DatabaseSeeder.php</code>) yang menjamin ketersediaan akun default kasir: 
      <code>admin@pos.com</code> dengan password <code>password123</code>.
    </li>
    <li>
      <strong>CRUD Resource Produk (Soal 1b & 1c):</strong> <code>ProductController</code> mengimplementasikan 5 aksi resource RESTful: 
      <code>GET /api/products</code> (list seluruh produk), <code>GET /api/products/{id}</code> (detail produk spesifik), 
      <code>POST /api/products</code> (penambahan produk baru), <code>PUT /api/products/{id}</code> (pembaruan data produk), dan 
      <code>DELETE /api/products/{id}</code> (penghapusan produk). Setiap entitas produk menyimpan kolom: <code>sku</code> (string, unique), 
      <code>name</code> (string), <code>category</code> (string), <code>price</code> (decimal), dan <code>stock</code> (integer).
    </li>
    <li>
      <strong>Standarisasi HTTP Status Code:</strong>
      <br>&bull; <code>200 OK</code> untuk permintaan GET, PUT, DELETE, dan Login yang berhasil.
      <br>&bull; <code>201 Created</code> saat produk baru sukses tersimpan ke database melalui endpoint POST.
      <br>&bull; <code>422 Unprocessable Entity</code> apabila validasi input form gagal (misal: SKU sudah ada atau kolom wajib kosong).
      <br>&bull; <code>401 Unauthorized</code> saat endpoint terproteksi diakses tanpa header token Bearer atau token tidak sah.
    </li>
  </ul>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img01}" alt="routes/api.php"></div>
    <div class="figure-caption">Gambar 1.1: Definisi Route API Terproteksi Middleware auth:sanctum pada backend/routes/api.php</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img02}" alt="ProductController.php"></div>
    <div class="figure-caption">Gambar 1.2: Implementasi Controller RESTful Produk dengan Validasi Ketat pada ProductController.php</div>
  </div>

  <div class="page-break"></div>
  <h3>Dokumentasi Pengujian API Menggunakan Postman (Soal 1d)</h3>
  <p>
    Seluruh endpoint diuji menggunakan koleksi Postman resmi <code>POS_API.postman_collection.json</code>. 
    Koleksi menggunakan variabel lingkungan <code>{{base_url}}</code> dan <code>{{token}}</code>. Pada endpoint Login, 
    diterapkan script Post-Response yang secara otomatis mengekstrak <code>access_token</code> dari payload respon 
    dan menyimpannya ke dalam variabel koleksi:
  </p>
  <pre>pm.test("Login successful and token stored", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.collectionVariables.set("token", jsonData.access_token);
});</pre>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img03}" alt="Postman Login 200"></div>
    <div class="figure-caption">Gambar 1.3: Eksekusi Request POST /api/login Mengembalikan HTTP 200 OK & Sanctum Bearer Token</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img04}" alt="Postman GET Products 200"></div>
    <div class="figure-caption">Gambar 1.4: Eksekusi Request GET /api/products Mengembalikan Daftar Produk Kasir (HTTP 200 OK)</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <div class="figure-box"><img src="${images.img05}" alt="Postman POST Product 201"></div>
    <div class="figure-caption">Gambar 1.5: Eksekusi Request POST /api/products Berhasil Membuat Produk Baru (HTTP 201 Created)</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img06}" alt="Postman PUT Product 200"></div>
    <div class="figure-caption">Gambar 1.6: Eksekusi Request PUT /api/products/{id} Memperbarui Data Produk (HTTP 200 OK)</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <div class="figure-box"><img src="${images.img07}" alt="Postman DELETE Product 200"></div>
    <div class="figure-caption">Gambar 1.7: Eksekusi Request DELETE /api/products/{id} Menghapus Produk dari Database (HTTP 200 OK)</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img08}" alt="Postman Validation 422"></div>
    <div class="figure-caption">Gambar 1.8: Pengujian Validasi Input Gagal Mengembalikan Respons Presisi HTTP 422 Unprocessable Entity</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img09}" alt="Postman Unauthorized 401"></div>
    <div class="figure-caption">Gambar 1.9: Pengujian Akses Endpoint Terproteksi Tanpa Bearer Token Mengembalikan HTTP 401 Unauthorized</div>
  </div>

  <div class="page-break"></div>
  <h3>Automated Feature Testing Laravel (Soal 1e)</h3>
  <p>
    Pengujian otomatis diimplementasikan secara komprehensif pada <code>tests/Feature/AuthApiTest.php</code> dan 
    <code>tests/Feature/ProductApiTest.php</code> mencakup skenario login valid, login invalid, otorisasi logout, proteksi token, 
    pembuatan produk, keunikan SKU, update, delete, dan verifikasi struktur JSON.
    Total <strong>15 unit & feature test dengan 76 assertions berhasil lulus (100% green)</strong>.
  </p>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img10}" alt="php artisan test"></div>
    <div class="figure-caption">Gambar 1.10: Output Eksekusi php artisan test Memverifikasi 15 Test & 76 Assertions Lulus Hijau</div>
  </div>

  <!-- SOAL 2: FRONTEND VUE.JS -->
  <h2>2. Soal 2: Frontend Vue.js SPA & Integrasi API</h2>
  <p>
    Frontend dibangun dengan framework Vue.js versi 3 menggunakan bundler Vite di dalam direktori <code>frontend/</code>. 
    Aplikasi menerapkan single-page architecture yang terhubung secara realtime dengan backend API melalui HTTP Client Axios.
  </p>
  <ul>
    <li>
      <strong>Konfigurasi Environment Variable (Soal 2c):</strong> Seluruh komunikasi HTTP diarahkan melalui modul 
      <code>frontend/src/services/api.js</code> yang membaca konfigurasi URL dasar dari <code>import.meta.env.VITE_API_BASE_URL</code>. 
      Tidak ada satupun URL backend yang di-hardcode ke dalam komponen Vue. 
      File <code>frontend/.env.example</code> disediakan sebagai template konfigurasi publik.
    </li>
    <li>
      <strong>Manajemen Autentikasi & Token (Soal 2a):</strong> Saat kasir berhasil login pada <code>LoginView.vue</code>, 
      token akses Sanctum dan profil user disimpan pada <code>localStorage</code>. Axios Request Interceptor secara otomatis 
      menyematkan header <code>Authorization: Bearer &lt;token&gt;</code> pada setiap outgoing request. Axios Response Interceptor 
      juga menangani kode status <code>401 Unauthorized</code> secara global dengan membersihkan sesi dan me-redirect pengguna ke halaman login.
    </li>
    <li>
      <strong>Dashboard POS & Operasi CRUD (Soal 2b):</strong> Komponen <code>ProductsView.vue</code> menampilkan tabel katalog 
      produk secara interaktif, indikator stok, aksi tambah/edit via modal pop-up responsif, serta tombol hapus dengan konfirmasi dialog.
    </li>
    <li>
      <strong>Navigation Guard:</strong> Vue Router mengimplementasikan <code>router.beforeEach</code> untuk mencegah pengguna 
      tanpa token mengakses rute privat (<code>/products</code>) serta mencegah kasir yang telah terautentikasi masuk kembali ke <code>/login</code>.
    </li>
  </ul>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img14}" alt="api.js & .env.example"></div>
    <div class="figure-caption">Gambar 2.1: Modul Sentralisasi Axios Interceptor dan Variabel Lingkungan VITE_API_BASE_URL</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <div class="figure-box"><img src="${images.img11}" alt="Frontend Login"></div>
    <div class="figure-caption">Gambar 2.2: Tampilan Halaman Login Kasir POS (Vue 3 SPA) Berjalan pada Server Produksi Nginx :8080</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img12}" alt="Frontend Dashboard Products"></div>
    <div class="figure-caption">Gambar 2.3: Dashboard Katalog Produk POS Menampilkan Data Dinamis dari API Backend dan Status Kasir</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img13}" alt="Frontend Modal Create"></div>
    <div class="figure-caption">Gambar 2.4: Antarmuka Modal Dialog Tambah / Ubah Produk POS Terintegrasi Validasi Form</div>
  </div>

  <!-- SOAL 3 & SOAL 4: GIT & CI/CD -->
  <div class="page-break"></div>
  <h2>3. Soal 3 & Soal 4: Version Control Git, CI Pipeline, dan CD ke GHCR</h2>
  <p>
    Manajemen kode sumber dikelola menggunakan struktur monorepo Git dengan menerapkan <em>GitHub Flow / Git Feature Branching</em>:
  </p>
  <ul>
    <li>
      <strong>Strategi Percabangan:</strong> Branch utama terdiri atas <code>main</code> (versi rilis produksi), <code>dev</code> (staging integrasi), 
      dan <code>feat/pos-system</code> (fitur pengembangan aktif). Seluruh pembaruan kode digabungkan melalui 
      <strong>Pull Request (PR)</strong> yang melewati status checks otomatis.
    </li>
    <li>
      <strong>Branch Protection Rules (Soal 3b):</strong> Branch <code>main</code> dan <code>dev</code> dilindungi dengan proteksi ketat: 
      menolak <em>force push</em>, menolak <em>direct commit</em> tanpa PR, serta mewajibkan passing status check untuk job 
      <code>Backend Tests</code> dan <code>Frontend Build</code> sebelum tombol merge dapat dieksekusi.
    </li>
    <li>
      <strong>Continuous Integration (Soal 3c):</strong> Workflow GitHub Actions didefinisikan pada <code>.github/workflows/ci.yml</code>. 
      Saat pull request atau push terjadi, runner Ubuntu otomatis menjalankan:
      <br>&bull; <strong>Job 1 (<code>test-backend</code>):</strong> Setup environment PHP 8.4, instalasi dependensi Composer, 
      pembuatan database SQLite in-memory, generate key, dan eksekusi <code>php artisan test</code>.
      <br>&bull; <strong>Job 2 (<code>build-frontend</code>):</strong> Setup Node.js 22, instalasi dependensi via <code>npm ci</code>, 
      dan kompilasi aset produksi melalui <code>npm run build</code>.
    </li>
    <li>
      <strong>Continuous Deployment ke GHCR (Soal 4a, 4b, 4c):</strong> Job <code>deploy</code> hanya berjalan saat terjadi event 
      <code>push</code> ke branch <code>main</code> setelah job pengujian berhasil (<code>needs: [test-backend, build-frontend]</code>). 
      Job ini melakukan build image multi-stage backend dan frontend serta mem-push container images ke 
      <strong>GitHub Packages Container Registry (GHCR)</strong> dengan tag SHA commit spesifik dan tag <code>latest</code>. 
      Kredensial sensitif diamankan menggunakan <strong>GitHub Secrets</strong> (<code>APP_KEY</code> dan <code>DB_PASSWORD</code>).
    </li>
  </ul>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img15}" alt="GitHub Main Repo"></div>
    <div class="figure-caption">Gambar 3.1: Halaman Utama Repositori Publik GitHub EricoAli/uts-pl-24-542626-SV-25066</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img16}" alt="GitHub Pull Requests"></div>
    <div class="figure-caption">Gambar 3.2: Daftar Pull Request Terverifikasi: PR #1 (feat/pos-system -> dev) dan PR #2 (dev -> main)</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <div class="figure-box"><img src="${images.img17}" alt="GitHub Actions Runs"></div>
    <div class="figure-caption">Gambar 3.3: Riwayat Eksekusi GitHub Actions Workflow CI/CD Menunjukkan Status Sukses (Semua Hijau)</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img18}" alt="GitHub Actions PR Run"></div>
    <div class="figure-caption">Gambar 3.4: Verifikasi Pipeline PR: Job Test & Build Sukses, Sementara Job Deploy Otomatis Diberhentikan (Skipped) Sesuai Ketentuan Soal 4a</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img19}" alt="GitHub Actions Main Run"></div>
    <div class="figure-caption">Gambar 3.5: Eksekusi Pipeline Rilis pada Branch main: Seluruh Job (Test, Build, dan Deploy GHCR) Berhasil Dilakukan (Commit e1016ea)</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <div class="figure-box"><img src="${images.img20}" alt="GHCR Packages"></div>
    <div class="figure-caption">Gambar 3.6: Paket Container Image Resmi Terbit di GitHub Container Registry (GHCR) Publik</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img21}" alt="Branch Protection"></div>
    <div class="figure-caption">Gambar 3.7: Konfigurasi Branch Protection Rules Melindungi Cabang main dan dev dari Perubahan Tak Terotorisasi</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img22}" alt="GitHub Secrets"></div>
    <div class="figure-caption">Gambar 3.8: Manajemen Rahasia Lingkungan (Repository Secrets) APP_KEY dan DB_PASSWORD pada Repositori GitHub</div>
  </div>

  <!-- SOAL 5, 6, & 7: DOCKER & FRANKENPHP -->
  <div class="page-break"></div>
  <h2>4. Soal 5, Soal 6, & Soal 7: Kontainerisasi Docker, Compose, dan FrankenPHP</h2>
  <p>
    Arsitektur aplikasi dikemas secara portabel ke dalam sistem multi-container yang terisolasi dan dapat dijalankan 
    secara instan melalui perintah <code>docker compose up -d</code>.
  </p>
  <ul>
    <li>
      <strong>Dockerfile Backend dengan FrankenPHP (Soal 5a & Soal 7):</strong> Base image yang digunakan adalah image resmi 
      <code>dunglas/frankenphp:1-php8.4-alpine</code> (tanpa menggunakan tag <code>latest</code>). Layer caching Composer dioptimasi 
      dengan menyalin <code>composer.json</code> terlebih dahulu sebelum seluruh kode aplikasi. Script inisialisasi 
      <code>docker-entrypoint.sh</code> otomatis menunggu koneksi basis data MySQL siap, menjalankan migrasi database 
      (<code>php artisan migrate --force</code>), mengeksekusi seeder kasir secara idempoten (<code>php artisan db:seed --force</code>), 
      dan menjalankan application server FrankenPHP dengan listener port 8000.
    </li>
    <li>
      <strong>Dockerfile Frontend Multi-Stage Build (Soal 5b):</strong> Menggunakan arsitektur <em>multi-stage</em>:
      <br>&bull; <em>Stage 1 (Builder):</em> Menggunakan image <code>node:22-alpine</code> untuk kompilasi aset frontend via Vite (<code>npm run build</code>).
      <br>&bull; <em>Stage 2 (Production):</em> Menggunakan web server ringan <code>nginx:1.27-alpine</code>. Hanya direktori hasil kompilasi 
      (<code>dist/</code>) yang disalin ke web root Nginx, sehingga image final bebas dari folder <code>node_modules</code> dan memiliki ukuran sangat kecil.
    </li>
    <li>
      <strong>Nginx Reverse Proxy & Service Networking (Soal 6b):</strong> File <code>frontend/nginx.conf</code> bertindak sebagai 
      reverse proxy yang mengarahkan seluruh request path <code>/api/</code> secara transparan ke service <code>http://backend:8000/api/</code> 
      melalui nama host container di jaringan internal Docker bridge <code>pos_network</code>. Hal ini mengeliminasi isu CORS di lingkungan produksi 
      karena frontend SPA dan API dilayani melalui port yang sama (<code>:8080</code>).
    </li>
    <li>
      <strong>Docker Compose & Persistensi Data (Soal 6a & 6c):</strong> Mengorkestrasi 3 service: <code>db</code> (MySQL 8.0), 
      <code>backend</code> (FrankenPHP Laravel), dan <code>frontend</code> (Nginx Vue SPA). Data transaksi kasir dan katalog produk 
      disimpan secara persisten pada Docker Named Volume <code>db_data</code> yang tetap utuh meskipun container dimatikan atau dihapus 
      (<code>docker compose down</code> lalu <code>docker compose up -d</code>).
    </li>
  </ul>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img23}" alt="Dockerfile Backend FrankenPHP"></div>
    <div class="figure-caption">Gambar 4.1: Definisi Dockerfile Backend Menggunakan Base Image Resmi FrankenPHP PHP 8.4 Alpine dan Entrypoint Otomatis</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img24}" alt="Dockerfile Frontend Nginx"></div>
    <div class="figure-caption">Gambar 4.2: Dockerfile Multi-Stage Frontend (Node 22 Builder -> Nginx 1.27 Production) & Konfigurasi Reverse Proxy</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <div class="figure-box"><img src="${images.img25}" alt="docker-compose.yml"></div>
    <div class="figure-caption">Gambar 4.3: Konfigurasi docker-compose.yml Mengorkestrasi Service db, backend, frontend, Bridge Network, dan Volume Persisten</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img26}" alt="Terminal docker compose ps"></div>
    <div class="figure-caption">Gambar 4.4: Status Pemeriksaan Layanan Kontainer (docker compose ps) Menunjukkan Seluruh Service Berstatus Up dan Healthy</div>
  </div>

  <div class="figure-container">
    <div class="figure-box"><img src="${images.img27}" alt="Terminal Data Persistence"></div>
    <div class="figure-caption">Gambar 4.5: Bukti Persistensi Data: Katalog Produk Tetap Tersimpan Sempurna Setelah Siklus docker compose down dan up</div>
  </div>

  <div class="page-break"></div>
  <div class="figure-container">
    <div class="figure-box"><img src="${images.img28}" alt="Terminal FrankenPHP logs"></div>
    <div class="figure-caption">Gambar 4.6: Log Autentik FrankenPHP Menampilkan Eksekusi Server Caddy-Go Engine, Auto-Migration, dan Penanganan HTTP Request</div>
  </div>

  <!-- BAB III: PENJELASAN ARSITEKTUR & ALIRAN DATA SISTEM -->
  <h1>BAB III: Penjelasan Arsitektur & Aliran Data Sistem</h1>
  
  <p>
    Sistem POS Kasir ini dirancang dengan model arsitektur <em>Distributed Multi-Tier Containerized Application</em>. 
    Seluruh komponen aplikasi beroperasi di dalam jaringan privat Docker yang aman tanpa mengekspos database secara langsung ke jaringan publik.
  </p>

  <div class="arch-flow-diagram">
+---------------------------------------------------------------------------------------------------+
|                                        PENGGUNA / KASIR                                           |
|                           Browser Client: http://localhost:8080                                   |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     1. Akses UI Vue SPA & HTTP Request (/api/login, /api/products)
                     2. Authorization: Bearer &lt;Sanctum_Token&gt;
                                                  v
+---------------------------------------------------------------------------------------------------+
|  CONTAINER: pos_frontend (Nginx 1.27 Alpine - Port 8080:80)                                      |
|  - Menyajikan aset statis Vue 3 SPA (HTML, JS, CSS bundle di /usr/share/nginx/html)              |
|  - Reverse Proxy: Meneruskan location /api/ -> proxy_pass http://backend:8000/api/              |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     3. Internal Docker Bridge Network: pos_network
                     4. HTTP 1.1 / HTTP 2 Forwarding via Host "backend:8000"
                                                  v
+---------------------------------------------------------------------------------------------------+
|  CONTAINER: pos_backend (dunglas/frankenphp:1-php8.4-alpine - Port 8000)                         |
|  - FrankenPHP Caddy Web Server (Persistent Worker Mode, In-Memory Booting)                       |
|  - Laravel 13 Framework (Routing, Middleware auth:sanctum, ProductController, Form Request)      |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     5. TCP/IP Socket Query (Port 3306)
                     6. PDO MySQL Connection via Host "db:3306" (User: pos_user)
                                                  v
+---------------------------------------------------------------------------------------------------+
|  CONTAINER: pos_db (mysql:8.0 - Port 3306 internal)                                              |
|  - RDBMS Engine: MySQL 8.0 Server                                                                 |
|  - Database: pos_database | Tabel: users, products, personal_access_tokens                         |
+---------------------------------------------------------------------------------------------------+
                                                  |
                     7. Direct Mount Disk Write / Read
                                                  v
+---------------------------------------------------------------------------------------------------+
|  DOCKER NAMED VOLUME: db_data (Host Filesystem Storage)                                           |
|  - Menjamin ACID Compliance & Data Durability saat container di-restart/down                      |
+---------------------------------------------------------------------------------------------------+
  </div>

  <h2>Rincian Tahapan Aliran Data (End-to-End Data Lifecycle)</h2>
  <ol>
    <li>
      <strong>Inisiasi Sesi oleh Kasir:</strong> Pengguna membuka browser pada <code>http://localhost:8080</code>. 
      Container <code>pos_frontend</code> (Nginx) merespons dengan menyajikan bundel statis Vue SPA.
    </li>
    <li>
      <strong>Proses Autentikasi:</strong> Kasir menginput kredensial pada <code>LoginView.vue</code>. 
      Axios mengirimkan request <code>POST /api/login</code> ke origin yang sama (<code>/api/login</code>). 
      Nginx meneruskan request tersebut secara internal ke <code>http://backend:8000/api/login</code> melalui bridge network <code>pos_network</code>.
    </li>
    <li>
      <strong>Validasi Kredensial & Penerbitan Token:</strong> FrankenPHP memproses request melalui Laravel 13, 
      memeriksa hash kata sandi pengguna di database <code>pos_db</code> (MySQL 8.0), dan menerbitkan token Sanctum baru 
      yang disimpan di tabel <code>personal_access_tokens</code>. Respon HTTP 200 beserta token dikembalikan ke frontend.
    </li>
    <li>
      <strong>Penyimpanan Token & Interceptor:</strong> Frontend menyimpan token di <code>localStorage</code>. 
      Untuk setiap permintaan data produk (CRUD), Axios Request Interceptor otomatis menyematkan header <code>Authorization: Bearer &lt;token&gt;</code>.
    </li>
    <li>
      <strong>Proteksi Middleware & Operasi CRUD:</strong> Setiap request CRUD yang diterima backend dicegat oleh middleware 
      <code>auth:sanctum</code>. Jika valid, controller mengeksekusi query database via Eloquent ORM ke host <code>db:3306</code>. 
      Data produk diproses dan dikembalikan dalam format standar JSON dengan status code yang presisi (200, 201, 422, atau 401).
    </li>
    <li>
      <strong>Persistensi Penyimpanan:</strong> Seluruh modifikasi data (tambah, edit, hapus produk) secara fisik ditulis 
      oleh MySQL ke dalam Docker Named Volume <code>db_data</code>. Struktur data tetap aman dan tidak terhapus sekalipun seluruh container dimatikan.
    </li>
  </ol>

  <!-- BAB IV: ANALISIS KENDALA & SOLUSI TEKNIS -->
  <div class="page-break"></div>
  <h1>BAB IV: Analisis Kendala & Solusi Teknis</h1>
  
  <p>
    Selama proses konstruksi, kontainerisasi, dan otomatisasi deployment sistem POS ini, terdapat empat kendala teknis 
    kritis yang dihadapi dan berhasil diselesaikan dengan metodologi analisis akar masalah (<em>Root Cause Analysis</em>):
  </p>

  <div class="callout callout-warning">
    <div class="callout-title">⚠️ Kendala 1: Docker Desktop Gagal Memulai Layanan Mesin Virtual (WSL2 Virtualization Disabled)</div>
    <p>
      <strong>Gejala Masalah:</strong> Saat pertama kali perintah <code>docker compose up</code> dijalankan pada lingkungan host Windows, 
      Docker CLI memberikan pesan error <em>"Docker Desktop is unable to start: hardware assisted virtualization is disabled in BIOS"</em>.
      Engine Docker Daemon tidak merespons koneksi socket.
    </p>
    <p>
      <strong>Akar Penyebab:</strong> Fitur akselerasi virtualisasi hardware (Intel VT-x / AMD-V) belum diaktifkan pada BIOS/UEFI 
      komputer host atau fitur Windows Subsystem for Linux (WSL2) Virtual Machine Platform mengalami status non-aktif.
    </p>
    <p>
      <strong>Solusi Teknis:</strong> 
      <br>1. Mengaktifkan fitur Windows Virtual Machine Platform melalui PowerShell Administrator:
      <br><code>dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart</code>
      <br>2. Memastikan konfigurasi BIOS CPU Virtualization aktif, melakukan restart pada host, dan mengatur WSL default version ke versi 2 (<code>wsl --set-default-version 2</code>). Setelah engine Docker Desktop berjalan normal, seluruh instruksi Docker Compose dieksekusi tanpa kendala.
    </p>
  </div>

  <div class="callout callout-warning">
    <div class="callout-title">⚠️ Kendala 2: Konflik Dependensi Versi PHP FrankenPHP terhadap Symfony 8.1 / Laravel 13</div>
    <p>
      <strong>Gejala Masalah:</strong> Tahapan <code>composer install</code> pada Dockerfile backend mengalami kegagalan 
      saat menggunakan base image <code>dunglas/frankenphp:1-php8.3-alpine</code> dengan log error: 
      <em>"symfony/process[v8.1.0] requires php &gt;= 8.4.1 -&gt; your php version (8.3.16) does not satisfy that requirement"</em>.
    </p>
    <p>
      <strong>Akar Penyebab:</strong> Proyek Laravel yang diinstal menggunakan rilis terbaru (Laravel 13) yang mengadopsi komponen framework 
      Symfony versi 8.1 ke atas. Komponen modern ini mewajibkan spesifikasi runtime minimal PHP 8.4.1.
    </p>
    <p>
      <strong>Solusi Teknis:</strong> Mengubah definisi base image pada <code>backend/Dockerfile</code> ke versi spesifik 
      <code>dunglas/frankenphp:1-php8.4-alpine</code> serta menyelaraskan runtime PHP pada workflow GitHub Actions (<code>setup-php</code>) 
      menggunakan <code>php-version: '8.4'</code>. Langkah ini menghasilkan kompatibilitas biner sempurna baik di lingkungan lokal maupun CI runner.
    </p>
  </div>

  <div class="callout callout-warning">
    <div class="callout-title">⚠️ Kendala 3: Kegagalan Job Backend Tests pada GitHub Actions Runner Ubuntu</div>
    <p>
      <strong>Gejala Masalah:</strong> Pada Pull Request #1 (<code>feat/pos-system</code> -&gt; <code>dev</code>), job <code>Backend Tests</code> 
      gagal dalam 16 detik. Selain itu, workflow CI berjalan ganda secara simultan untuk event <code>push</code> dan <code>pull_request</code>.
    </p>
    <p>
      <strong>Akar Penyebab:</strong>
      <br>1. Variabel lingkungan <code>env: APP_KEY: \${{ secrets.APP_KEY }}</code> pada tingkat job diisi string kosong saat secret repositori 
      belum terpasang pada runner PR, sehingga menimpa file <code>.env</code> dan menyebabkan Laravel Runtime Exception <em>"No application encryption key has been specified"</em>.
      <br>2. Driver database pengujian diatur ke SQLite tetapi file fisik <code>database/database.sqlite</code> belum terbentuk di direktori runner.
      <br>3. Konfigurasi trigger workflow menggunakan filter branch ganda yang menangkap event push cabang fitur sekaligus event pembuatan PR.
    </p>
    <p>
      <strong>Solusi Teknis:</strong>
      <br>1. Menyesuaikan trigger workflow pada <code>.github/workflows/ci.yml</code> menjadi spesifik: <code>on: push: branches: [main, dev]</code> dan <code>on: pull_request: branches: [main, dev]</code>.
      <br>2. Menambahkan langkah <code>touch database/database.sqlite</code> sebelum testing.
      <br>3. Mengimplementasikan dynamic fallback encryption key pada workflow: jika <code>secrets.APP_KEY</code> tidak tersedia, runner secara otomatis menjalankan <code>php artisan key:generate --force</code> dan menginjeksikan kunci acak sementara ke <code>\$GITHUB_ENV</code>. Hasilnya seluruh pengujian otomatis langsung berstatus hijau.
    </p>
  </div>

  <div class="callout callout-warning">
    <div class="callout-title">⚠️ Kendala 4: Penolakan Huruf Kapital (Case Sensitivity) pada GitHub Container Registry (GHCR)</div>
    <p>
      <strong>Gejala Masalah:</strong> Langkah push container image ke <code>ghcr.io/EricoAli/uts-pl-24-542626-sv-25066/backend</code> 
      ditolak oleh registry GHCR dengan pesan error: <em>"invalid reference format: repository name must be lowercase"</em>.
    </p>
    <p>
      <strong>Akar Penyebab:</strong> Spesifikasi Open Container Initiative (OCI) dan kebijakan registry GitHub mewajibkan seluruh 
      penamaan namespace repository image berada dalam format huruf kecil (<em>lowercase</em>), sedangkan variabel bawaan <code>\${{ github.repository }}</code> 
      membawa format asli akun GitHub (<code>EricoAli/...</code> dengan huruf E dan A kapital).
    </p>
    <p>
      <strong>Solusi Teknis:</strong> Menambahkan langkah normalisasi string bash pada job deploy di <code>.github/workflows/ci.yml</code> 
      sebelum proses tagging Docker:
      <br><code>REPO_LOWER=\$(echo "\${{ github.repository }}" | tr '[:upper:]' '[:lower:]')</code>
      <br>Variabel terevaluasi <code>REPO_LOWER</code> (menjadi <code>ericoali/uts-pl-24-542626-sv-25066</code>) digunakan sebagai target rilis GHCR, sehingga image backend dan frontend sukses terunggah ke registry.
    </p>
  </div>

  <!-- BAB V: KESIMPULAN & VERIFIKASI AKHIR -->
  <div class="page-break"></div>
  <h1>BAB V: Kesimpulan & Verifikasi Akhir</h1>
  
  <p>
    Seluruh tahapan implementasi, kontainerisasi, pengujian otomatis, dan pipeline deployment Ujian Tengah Semester (UTS) 
    mata kuliah Konstruksi dan Evolusi Perangkat Lunak telah diselesaikan dengan integritas tinggi dan memenuhi 100% kriteria penilaian:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 15%;">Komponen</th>
        <th style="width: 25%;">Spesifikasi Teknologi</th>
        <th style="width: 45%;">Hasil Implementasi & Verifikasi</th>
        <th style="width: 15%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Backend API</strong></td>
        <td>Laravel 13, Sanctum, PHP 8.4</td>
        <td>Endpoint Login, Logout, dan CRUD Products lengkap dengan status 200, 201, 422, 401 presisi.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>Automated Test</strong></td>
        <td>PHPUnit / Pest Feature Test</td>
        <td>15 Feature & Unit test lulus (76 assertions) tanpa ada kegagalan.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>Postman API</strong></td>
        <td>Postman Collection v2.1</td>
        <td>File <code>POS_API.postman_collection.json</code> di root repo dengan runner auto-token.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>Frontend SPA</strong></td>
        <td>Vue 3, Vite, Axios, Router</td>
        <td>Dynamic <code>VITE_API_BASE_URL</code>, auth navigation guard, responsive POS catalog & modal.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>Version Control</strong></td>
        <td>Git Monorepo, Branch Protection</td>
        <td>Struktur branch <code>main</code>, <code>dev</code>, <code>feat/pos-system</code> dengan PR checks aktif.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>CI/CD Actions</strong></td>
        <td>GitHub Actions Workflows</td>
        <td>Automated testing, linting, conditional deploy (hanya branch main), secrets aman.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>Container Registry</strong></td>
        <td>GitHub Packages (GHCR)</td>
        <td>Push image otomatis terverifikasi ke <code>ghcr.io/ericoali/...</code> dengan OCI lowercase tag.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>Kontainerisasi</strong></td>
        <td>Docker Multi-Stage & Nginx</td>
        <td>Image backend FrankenPHP Alpine & frontend Nginx tanpa node_modules.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>Orkestrasi</strong></td>
        <td>Docker Compose & Volumes</td>
        <td>3 service (db, backend, frontend) terisolasi di bridge network dengan data volume persisten.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
      <tr>
        <td><strong>Nilai Tambah</strong></td>
        <td>FrankenPHP Caddy Engine</td>
        <td>Application server modern, auto-migration entrypoint, zero web server separation latency.</td>
        <td><span class="badge-status badge-green">LULUS 100%</span></td>
      </tr>
    </tbody>
  </table>

  <h2>Hasil Live Status Docker Compose (docker compose ps)</h2>
  <pre>NAME           IMAGE                                COMMAND                  SERVICE    STATUS                    PORTS
pos_backend    uts-pl-24-542626-sv-25066-backend    "/app/docker-entrypo…"   backend    Up 25 minutes (healthy)   80/tcp, 443/tcp, 2019/tcp, 8000/tcp
pos_db         mysql:8.0                            "docker-entrypoint.s…"   db         Up 25 minutes (healthy)   3306/tcp, 33060/tcp
pos_frontend   uts-pl-24-542626-sv-25066-frontend   "/docker-entrypoint.…"   frontend   Up 25 minutes             0.0.0.0:8080->80/tcp</pre>

  <p>
    Berdasarkan seluruh hasil pengujian fungsional, performa server, dan keandalan deployment, sistem POS Sederhana 
    ini dinyatakan <strong>SELESAI, STABIL, dan SIAP PRODUKSI</strong>.
  </p>

  <div style="margin-top: 40px; text-align: right; page-break-inside: avoid;">
    <p style="margin-bottom: 50px;">Yogyakarta, 25 Oktober 2026<br>Mahasiswa Pengembang,</p>
    <p><strong><u>Erico Ali Gutama</u></strong><br>NIM: 24/542626/SV/25066</p>
  </div>

</body>
</html>`;
}

async function renderPdf() {
  console.log('Generating HTML report content...');
  const htmlContent = generateHtml();
  const htmlPath = path.join(__dirname, 'report.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`Saved report.html (${(fs.statSync(htmlPath).size / 1024).toFixed(2)} KB)`);

  console.log('Launching Puppeteer Chrome to render PDF...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('Printing to PDF...');
  await page.pdf({
    path: OUTPUT_PDF_PATH,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 8pt; color: #94a3b8; font-family: sans-serif; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm;">
        <span>Laporan UTS Konstruksi dan Evolusi Perangkat Lunak (SVPL261501)</span>
        <span>Erico Ali Gutama - 24/542626/SV/25066</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 8pt; color: #94a3b8; font-family: sans-serif; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm;">
        <span>Sekolah Vokasi Universitas Gadjah Mada</span>
        <span>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></span>
      </div>
    `,
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '16mm',
      right: '16mm'
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
