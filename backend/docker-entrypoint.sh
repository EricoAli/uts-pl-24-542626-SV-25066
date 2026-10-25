#!/bin/sh
set -e

echo "=========================================================="
echo " Starting Laravel POS Backend (FrankenPHP Application Server)"
echo "=========================================================="

# Tunggu database siap jika DB_HOST dikonfigurasi
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database connection at $DB_HOST:${DB_PORT:-3306}..."
    until php -r "
        try {
            \$host = getenv('DB_HOST');
            \$port = getenv('DB_PORT') ?: '3306';
            \$db   = getenv('DB_DATABASE');
            \$user = getenv('DB_USERNAME');
            \$pass = getenv('DB_PASSWORD');
            new PDO(\"mysql:host=\$host;port=\$port;dbname=\$db\", \$user, \$pass);
            exit(0);
        } catch (\Throwable \$e) {
            exit(1);
        }
    " > /dev/null 2>&1; do
        echo "Database is not ready yet. Retrying in 2 seconds..."
        sleep 2
    done
    echo "Database is ready and connected!"
fi

# Jalankan migrasi dan seeding database
echo "Running database migrations..."
php artisan migrate --force

echo "Running database seeder..."
php artisan db:seed --force

# Pastikan direktori storage dan cache memiliki permission yang sesuai
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R 777 storage bootstrap/cache

echo "Starting FrankenPHP server listening on :8000..."
exec frankenphp php-server --root /app/public --listen :8000 --access-log
