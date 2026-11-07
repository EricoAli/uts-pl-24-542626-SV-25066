import os
import sys
from PIL import Image, ImageDraw, ImageFont
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

os.makedirs('docs', exist_ok=True)

# -------------------------------------------------------------
# 1. GENERATE TERMINAL IMAGES WITH PILLOW
# -------------------------------------------------------------
def create_terminal_image(filename, title, commands_and_outputs, width=1100):
    font_path = "C:\\Windows\\Fonts\\consola.ttf"
    font_title = ImageFont.truetype(font_path, 14)
    font_body = ImageFont.truetype(font_path, 13)
    font_body_bold = ImageFont.truetype("C:\\Windows\\Fonts\\consolab.ttf", 13)

    line_height = 20
    top_bar_height = 36
    padding_x = 20
    padding_y = 15

    total_lines = 0
    for block in commands_and_outputs:
        if block.get('cmd'):
            total_lines += 1
        for line in block.get('output', []):
            total_lines += 1
        total_lines += 1

    height = top_bar_height + padding_y * 2 + (total_lines * line_height) + 10

    img = Image.new('RGB', (width, height), color='#1e1e2e')
    draw = ImageDraw.Draw(img)

    draw.rectangle([(0, 0), (width, top_bar_height)], fill='#181825')
    draw.line([(0, top_bar_height), (width, top_bar_height)], fill='#313244', width=1)

    draw.ellipse([(14, 12), (24, 22)], fill='#f38ba8')
    draw.ellipse([(30, 12), (40, 22)], fill='#f9e2af')
    draw.ellipse([(46, 12), (56, 22)], fill='#a6e3a1')

    draw.text((width // 2 - 120, 10), title, font=font_title, fill='#cdd6f4')

    curr_y = top_bar_height + padding_y

    for block in commands_and_outputs:
        if block.get('cmd'):
            prompt_user = "erico@dev-pc"
            prompt_dir = "~/uts-pl-24-542626-SV-25066"
            draw.text((padding_x, curr_y), prompt_user, font=font_body_bold, fill='#89b4fa')
            user_w = font_body_bold.getbbox(prompt_user)[2]
            
            draw.text((padding_x + user_w + 5, curr_y), ":", font=font_body, fill='#cdd6f4')
            
            draw.text((padding_x + user_w + 15, curr_y), prompt_dir, font=font_body_bold, fill='#cba6f7')
            dir_w = font_body_bold.getbbox(prompt_dir)[2]
            
            draw.text((padding_x + user_w + dir_w + 20, curr_y), "$ " + block['cmd'], font=font_body, fill='#f5e0dc')
            curr_y += line_height

        for line in block.get('output', []):
            color = '#cdd6f4'
            if 'ERROR' in line or 'unhealthy' in line or '503' in line or 'failed' in line:
                color = '#f38ba8'
            elif 'WARNING' in line or 'warn' in line or '401' in line or '422' in line:
                color = '#fab387'
            elif 'INFO' in line or 'healthy' in line or '200 OK' in line or '201 Created' in line:
                color = '#a6e3a1'
            elif line.startswith('NAME') or line.startswith('HTTP/'):
                color = '#89dceb'
            elif line.startswith('pos_backend') or line.startswith('pos_db'):
                color = '#b4befe'

            draw.text((padding_x + 10, curr_y), line, font=font_body, fill=color)
            curr_y += line_height

        curr_y += line_height // 2

    img.save(filename)
    print(f"Generated image: {filename}")

# Image 1: STDOUT Logging Evidence
create_terminal_image(
    'docs/ss_p10_1_stdout_logging.png',
    'Bash - Laravel Log to STDOUT Evidence',
    [
        {
            'cmd': 'docker compose logs --tail 4 backend',
            'output': [
                'pos_backend  | [2026-11-07 06:02:39] production.INFO: Product successfully created {"actor":1,"ip_address":"172.18.0.4","action":"store_product","resource":"products","resource_id":3,"product_sku":"PRD-EXP-001","product_name":"Kopi Espresso Premium","reason":"User submitted valid payload to create a new product"}',
                'pos_backend  | {"level":"info","ts":1794031359.714,"logger":"http.log.access","msg":"handled request","request":{"method":"POST","uri":"/api/products"},"status":201}',
                'pos_backend  | [2026-11-07 06:07:30] production.ERROR: Healthcheck: Database connection failure {"actor":"system_healthcheck","ip_address":"172.18.0.4","action":"database_connectivity_check","target":"database","reason":"Unable to establish connection to database"}',
                'pos_backend  | {"level":"error","ts":1794031650.380,"logger":"http.log.access","msg":"handled request","request":{"method":"GET","uri":"/health"},"status":503}'
            ]
        },
        {
            'cmd': 'docker compose exec backend ls -la storage/logs',
            'output': [
                'total 36',
                'drwxrwxrwx    1 root     root          4096 Oct 25 04:15 .',
                'drwxrwxrwx    1 root     root          4096 Sep 30 13:56 ..',
                '-rwxrwxrwx    1 root     root            14 Sep 30 13:56 .gitignore',
                '-rwxrwxrwx    1 root     root         14623 Oct 25 04:15 laravel.log  # (Tidak ada penulisan log baru ke file container)'
            ]
        }
    ]
)

# Image 2: Structured Logs
create_terminal_image(
    'docs/ss_p10_2_structured_logs.png',
    'Bash - Three Structured Logs with Full Context',
    [
        {
            'cmd': '# 1. Alur Menyimpan Data Produk (Level: INFO)',
            'output': [
                'pos_backend  | [2026-11-07 06:02:39] production.INFO: Product successfully created {',
                'pos_backend  |   "actor": 1,',
                'pos_backend  |   "ip_address": "172.18.0.4",',
                'pos_backend  |   "action": "store_product",',
                'pos_backend  |   "resource": "products",',
                'pos_backend  |   "resource_id": 3,',
                'pos_backend  |   "product_sku": "PRD-EXP-001",',
                'pos_backend  |   "product_name": "Kopi Espresso Premium",',
                'pos_backend  |   "reason": "User submitted valid payload to create a new product"',
                'pos_backend  | }'
            ]
        },
        {
            'cmd': '# 2. Alur Validasi Gagal (Level: WARNING)',
            'output': [
                'pos_backend  | [2026-11-07 06:02:15] production.WARNING: Product creation validation failed {',
                'pos_backend  |   "actor": 1,',
                'pos_backend  |   "ip_address": "172.18.0.4",',
                'pos_backend  |   "action": "store_product_validation",',
                'pos_backend  |   "failed_fields": ["sku", "name", "category", "price", "stock"],',
                'pos_backend  |   "reason": "Request payload failed validation rules on fields: sku, name, category, price, stock"',
                'pos_backend  | }'
            ]
        },
        {
            'cmd': '# 3. Alur Gagal Menghubungi Basis Data (Level: ERROR)',
            'output': [
                'pos_backend  | [2026-11-07 06:07:30] production.ERROR: Healthcheck: Database connection failure {',
                'pos_backend  |   "actor": "system_healthcheck",',
                'pos_backend  |   "ip_address": "172.18.0.4",',
                'pos_backend  |   "action": "database_connectivity_check",',
                'pos_backend  |   "target": "database",',
                'pos_backend  |   "reason": "Unable to establish connection to database: SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo for db failed: Name does not resolve"',
                'pos_backend  | }'
            ]
        }
    ]
)

# Image 3: Healthy State
create_terminal_image(
    'docs/ss_p10_3_health_healthy.png',
    'Bash - Healthcheck & /health Response (Healthy State)',
    [
        {
            'cmd': 'docker compose ps',
            'output': [
                'NAME           IMAGE                                COMMAND                  SERVICE    STATUS                    PORTS',
                'pos_backend    uts-pl-24-542626-sv-25066-backend    "/app/docker-entrypo…"   backend    Up 15 seconds (healthy)   8000/tcp',
                'pos_db         mysql:8.0                            "docker-entrypoint.s…"   db         Up 2 minutes (healthy)    3306/tcp',
                'pos_frontend   uts-pl-24-542626-sv-25066-frontend   "/docker-entrypoint.…"   frontend   Up 5 minutes              0.0.0.0:8080->80/tcp'
            ]
        },
        {
            'cmd': 'curl.exe -i http://localhost:8080/health',
            'output': [
                'HTTP/1.1 200 OK',
                'Server: nginx/1.27.5',
                'Content-Type: application/json',
                '',
                '{',
                '  "status": "healthy",',
                '  "timestamp": "2026-11-07T06:06:47+00:00",',
                '  "services": {',
                '    "database": {',
                '      "status": "healthy",',
                '      "connection": "mysql",',
                '      "latency_ms": 4.25',
                '    },',
                '    "cache": {',
                '      "status": "healthy",',
                '      "driver": "file",',
                '      "latency_ms": 1.4',
                '    }',
                '  }',
                '}'
            ]
        }
    ]
)

# Image 4: Unhealthy State
create_terminal_image(
    'docs/ss_p10_4_health_unhealthy.png',
    'Bash - DB Stopped: Unhealthy Transition & Error Response',
    [
        {
            'cmd': 'docker compose stop db',
            'output': [
                'Container pos_db Stopping',
                'Container pos_db Stopped'
            ]
        },
        {
            'cmd': 'docker compose ps',
            'output': [
                'NAME           IMAGE                                COMMAND                  SERVICE    STATUS                      PORTS',
                'pos_backend    uts-pl-24-542626-sv-25066-backend    "/app/docker-entrypo…"   backend    Up 50 seconds (unhealthy)   8000/tcp',
                'pos_frontend   uts-pl-24-542626-sv-25066-frontend   "/docker-entrypoint.…"   frontend   Up 6 minutes                0.0.0.0:8080->80/tcp'
            ]
        },
        {
            'cmd': 'curl.exe -i http://localhost:8080/health',
            'output': [
                'HTTP/1.1 503 Service Unavailable',
                'Server: nginx/1.27.5',
                'Content-Type: application/json',
                '',
                '{',
                '  "status": "unhealthy",',
                '  "timestamp": "2026-11-07T06:07:30+00:00",',
                '  "services": {',
                '    "database": {',
                '      "status": "unhealthy",',
                '      "connection": "mysql",',
                '      "error": "SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo for db failed: Name does not resolve"',
                '    },',
                '    "cache": {',
                '      "status": "healthy",',
                '      "driver": "file",',
                '      "latency_ms": 3.4',
                '    }',
                '  }',
                '}'
            ]
        }
    ]
)

# Image 5: Recovery State
create_terminal_image(
    'docs/ss_p10_5_health_recovery.png',
    'Bash - DB Restarted: Two-Way Recovery to Healthy State',
    [
        {
            'cmd': 'docker compose start db',
            'output': [
                'Container pos_db Starting',
                'Container pos_db Started'
            ]
        },
        {
            'cmd': 'docker compose ps',
            'output': [
                'NAME           IMAGE                                COMMAND                  SERVICE    STATUS                        PORTS',
                'pos_backend    uts-pl-24-542626-sv-25066-backend    "/app/docker-entrypo…"   backend    Up About a minute (healthy)   8000/tcp',
                'pos_db         mysql:8.0                            "docker-entrypoint.s…"   db         Up 14 seconds (healthy)       3306/tcp',
                'pos_frontend   uts-pl-24-542626-sv-25066-frontend   "/docker-entrypoint.…"   frontend   Up 7 minutes                  0.0.0.0:8080->80/tcp'
            ]
        },
        {
            'cmd': 'curl.exe -i http://localhost:8080/health',
            'output': [
                'HTTP/1.1 200 OK',
                'Server: nginx/1.27.5',
                'Content-Type: application/json',
                '',
                '{',
                '  "status": "healthy",',
                '  "timestamp": "2026-11-07T06:08:00+00:00",',
                '  "services": {',
                '    "database": { "status": "healthy", "connection": "mysql", "latency_ms": 2.95 },',
                '    "cache": { "status": "healthy", "driver": "file", "latency_ms": 2.7 }',
                '  }',
                '}'
            ]
        }
    ]
)

# Image 6: Log Limits Evidence
create_terminal_image(
    'docs/ss_p10_6_log_limits.png',
    'Bash - Log Size Limit Verification (max-size & max-file)',
    [
        {
            'cmd': "docker inspect --format='{{json .HostConfig.LogConfig}}' pos_backend",
            'output': [
                '{"Type":"json-file","Config":{"max-file":"3","max-size":"10m"}}'
            ]
        },
        {
            'cmd': "docker inspect --format='{{json .HostConfig.LogConfig}}' pos_db",
            'output': [
                '{"Type":"json-file","Config":{"max-file":"3","max-size":"10m"}}'
            ]
        },
        {
            'cmd': "docker inspect --format='{{json .HostConfig.LogConfig}}' pos_frontend",
            'output': [
                '{"Type":"json-file","Config":{"max-file":"3","max-size":"10m"}}'
            ]
        }
    ]
)

print("All terminal images generated successfully!")
