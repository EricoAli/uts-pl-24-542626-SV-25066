# Aplikasi POS Sederhana (Manajemen Produk Kasir)

Repositori Fullstack Aplikasi POS Sederhana yang terdiri dari:
- **Backend**: RESTful API menggunakan Laravel dan Laravel Sanctum, dijalankan dengan server aplikasi modern **FrankenPHP** (di dalam subfolder `backend/`).
- **Frontend**: Single Page Application (SPA) berbasis Vue 3 dan Vite, disajikan dengan **Nginx Reverse Proxy** (di dalam subfolder `frontend/`).
- **Database**: **MySQL 8.0** dengan persistensi data via Docker named volume.
- **Orkestrasi**: **Docker Compose** multi-container dengan konfigurasi environment terpusat.
- **Postman Collection**: Postman Collection v2.1 siap pakai (`POS_API.postman_collection.json`).

---

## 📁 Struktur Monorepo

```text
├── backend/                       # Backend Laravel RESTful API
│   ├── app/
│   │   ├── Http/Controllers/     # AuthController & ProductController
│   │   └── Models/               # User & Product models
│   ├── database/
│   │   ├── migrations/           # Migrasi users, tokens, & products
│   │   └── seeders/              # DatabaseSeeder (default admin user)
│   ├── routes/api.php            # Endpoint API terproteksi Sanctum
│   ├── tests/Feature/            # Feature Tests (AuthApiTest & ProductApiTest)
│   ├── Dockerfile                # Multi-stage/Optimized FrankenPHP 1 (PHP 8.4 Alpine)
│   ├── docker-entrypoint.sh      # DB wait, auto migrate, idempotent seed, & FrankenPHP server
│   └── .dockerignore
├── frontend/                      # Frontend Vue 3 + Vite
│   ├── src/
│   │   ├── services/api.js       # Instance Axios terpusat & Interceptors
│   │   ├── router/index.js       # Vue Router & Navigation Guard
│   │   ├── views/
│   │   │   ├── LoginView.vue     # Halaman Login
│   │   │   └── ProductsView.vue  # POS Dashboard & CRUD Produk
│   ├── Dockerfile                # Multi-stage (Node 22 builder -> Nginx 1.27 production)
│   ├── nginx.conf                # Nginx SPA fallback + reverse proxy /api/ -> backend:8000
│   ├── .dockerignore
│   ├── .env                      # VITE_API_BASE_URL
│   └── .env.example
├── docker-compose.yml             # Orkestrasi 3 service (db, backend, frontend)
├── .env                           # Environment root (db credentials, APP_KEY, ports)
├── .env.example                   # Template environment root
├── .gitignore                     # Gitignore monorepo (.env diabaikan, .env.example dicommit)
├── POS_API.postman_collection.json # Postman Collection v2.1
└── README.md
```

---

## 🐳 Panduan Menjalankan Menggunakan Docker Compose (Soal 5, 6, & 7)

### 1. Persiapan Environment
Salin template environment di root repository:
```bash
cp .env.example .env
```

### 2. Jalankan Seluruh Layanan
Build dan jalankan seluruh container (MySQL 8.0, Backend FrankenPHP, dan Frontend Nginx):
```bash
docker compose up -d --build
```

Periksa status container:
```bash
docker compose ps
```
Hasil: ketiga container (`pos_db`, `pos_backend`, `pos_frontend`) akan berstatus **Up (healthy)**.

### 3. Akses Aplikasi
- **Frontend Web POS**: Buka browser di `http://localhost:8080`
- **Kredensial Default**:
  - Email: `admin@pos.com`
  - Password: `password123`
- Seluruh permintaan API di frontend diarahkan ke `/api/*` yang di-reverse proxy oleh Nginx ke `backend:8000/api/*` di jaringan internal Docker.

### 4. Uji Persistensi Data (Soal 6d)
Hentikan dan hapus container:
```bash
docker compose down
```
Jalankan kembali container:
```bash
docker compose up -d
```
Data produk yang telah diinput di database MySQL tetap aman dan persisten karena tersimpan di named volume `db_data`.

### 5. Memeriksa Log FrankenPHP (Soal 7)
Tampilkan log request backend untuk membuktikan aplikasi dijalankan oleh FrankenPHP:
```bash
docker compose logs backend
```

---

## 🧪 Menjalankan Automated Feature Testing (Backend Lokal)

```bash
cd backend
php artisan test
```
Seluruh 15 test berstatus **PASS (hijau)** menguji autentikasi Sanctum, proteksi endpoint, dan seluruh fungsi CRUD produk.

---

## 📮 Penggunaan Postman Collection (Soal 1d)

File collection berada di root repositori: [`POS_API.postman_collection.json`](file:///d:/5/01%20Konstruksi%20dan%20Evolusi%20Perangkat%20Lunak/uts-pl-24-542626-SV-25066/POS_API.postman_collection.json).

1. Buka aplikasi **Postman** dan import file `POS_API.postman_collection.json`.
2. Variabel default:
   - `{{base_url}}`: `http://127.0.0.1:8000/api` (atau `http://localhost:8080/api` jika menguji via Docker).
3. Jalankan request **Login (Success - 200)**; token Sanctum otomatis tersimpan ke variabel `{{token}}` untuk request selanjutnya.
