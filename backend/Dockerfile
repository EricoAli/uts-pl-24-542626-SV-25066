# ==========================================
# Backend Dockerfile with FrankenPHP
# Base image resmi dengan versi spesifik (Alpine)
# ==========================================
FROM dunglas/frankenphp:1-php8.4-alpine

# Set working directory
WORKDIR /app

# Install dependensi sistem dan ekstensi PHP yang dibutuhkan
RUN install-php-extensions \
    pdo_mysql \
    zip \
    opcache \
    bcmath

# Salin Composer binary dari image resmi Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Optimasi Layer Caching: salin manifest composer terlebih dahulu
COPY composer.json composer.lock ./

# Install dependensi aplikasi tanpa skrip dan tanpa autoloader dev
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Salin seluruh kode aplikasi (mengikuti aturan .dockerignore)
COPY . .

# Generate autoloader teroptimasi untuk production
RUN composer dump-autoload --optimize

# Beri izin eksekusi pada entrypoint script dan persiapkan direktori storage
RUN chmod +x /app/docker-entrypoint.sh \
    && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Port default yang dilayani oleh FrankenPHP
EXPOSE 8000

# Entrypoint script untuk migrasi otomatis, seeder, dan server startup
ENTRYPOINT ["/app/docker-entrypoint.sh"]
