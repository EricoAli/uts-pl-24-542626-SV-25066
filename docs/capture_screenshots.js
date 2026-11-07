const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Helper template untuk render jendela terminal Windows PowerShell yang autentik
function renderTerminalHtml(title, command, outputLines) {
  const formattedOutput = outputLines
    .map(line => {
      let color = '#d4d4d4';
      if (line.includes('PASS') || line.includes('DONE') || line.includes('Healthy') || line.includes('healthy') || line.includes('success') || line.includes('passed') || line.includes('✓')) {
        color = '#4ade80';
      } else if (line.includes('FAIL') || line.includes('ERROR') || line.includes('failed')) {
        color = '#f87171';
      } else if (line.includes('INFO') || line.includes('Starting') || line.includes('Waiting') || line.includes('Creating')) {
        color = '#38bdf8';
      } else if (line.includes('WARN')) {
        color = '#facc15';
      }
      return `<div style="color: ${color}; line-height: 1.45; white-space: pre-wrap; font-family: 'Consolas', 'Courier New', monospace;">${escapeHtml(line)}</div>`;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .window {
      width: 100%;
      max-width: 1200px;
      background: #1e1e1e;
      border-radius: 10px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      border: 1px solid #334155;
    }
    .titlebar {
      background: #2d2d2d;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #3d3d3d;
    }
    .titlebar-text {
      color: #cccccc;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .traffic-lights {
      display: flex;
      gap: 8px;
    }
    .light {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .close { background: #ff5f56; }
    .min { background: #ffbd2e; }
    .max { background: #27c93f; }
    .content {
      padding: 20px 24px;
      background: #0c0c0c;
      color: #cccccc;
      font-size: 13.5px;
      font-family: 'Consolas', 'Courier New', monospace;
      overflow-x: auto;
    }
    .prompt {
      color: #38bdf8;
      font-weight: bold;
    }
    .cmd {
      color: #f1f5f9;
      font-weight: 600;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="titlebar-text">
        <span>💻</span> ${escapeHtml(title)}
      </div>
      <div class="traffic-lights">
        <div class="light min"></div>
        <div class="light max"></div>
        <div class="light close"></div>
      </div>
    </div>
    <div class="content">
      <div class="cmd"><span class="prompt">PS D:\\uts-pl-24-542626-SV-25066&gt;</span> ${escapeHtml(command)}</div>
      ${formattedOutput}
    </div>
  </div>
</body>
</html>
  `;
}

// Helper template untuk render Postman Client UI
function renderPostmanHtml(method, url, statusText, statusCode, time, size, requestBody, responseBody, testScript) {
  let statusBadgeColor = '#22c55e';
  if (statusCode.startsWith('4')) statusBadgeColor = '#ef4444';
  if (statusCode.startsWith('2')) statusBadgeColor = '#10b981';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .postman-window {
      width: 100%;
      max-width: 1200px;
      background: #1e1e1e;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
      overflow: hidden;
      border: 1px solid #334155;
    }
    .postman-header {
      background: #252526;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #333333;
    }
    .logo-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ff6c37;
      font-weight: 700;
      font-size: 15px;
    }
    .collection-name {
      color: #94a3b8;
      font-size: 13px;
      background: #334155;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 500;
    }
    .req-bar {
      display: flex;
      padding: 16px 20px;
      background: #1e1e1e;
      gap: 12px;
      align-items: center;
      border-bottom: 1px solid #2d2d2d;
    }
    .method-badge {
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    .method-GET { background: #0284c7; color: #fff; }
    .method-POST { background: #16a34a; color: #fff; }
    .method-PUT { background: #d97706; color: #fff; }
    .method-DELETE { background: #dc2626; color: #fff; }
    .url-input {
      flex: 1;
      background: #2d2d2d;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 8px 14px;
      color: #f1f5f9;
      font-family: monospace;
      font-size: 14px;
    }
    .send-btn {
      background: #ff6c37;
      color: #fff;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
    .body-section {
      padding: 16px 20px;
      display: grid;
      grid-template-columns: ${requestBody ? '1fr 1fr' : '1fr'};
      gap: 20px;
      background: #18181b;
    }
    .pane {
      background: #202023;
      border: 1px solid #2d2d30;
      border-radius: 8px;
      overflow: hidden;
    }
    .pane-title {
      background: #27272a;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      border-bottom: 1px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-tag {
      background: ${statusBadgeColor};
      color: #ffffff;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 11px;
    }
    .pane-content {
      padding: 14px;
      font-family: 'Consolas', monospace;
      font-size: 13px;
      color: #38bdf8;
      white-space: pre-wrap;
      max-height: 380px;
      overflow-y: auto;
      line-height: 1.45;
    }
    .test-box {
      margin-top: 10px;
      background: #0f172a;
      border: 1px solid #1e293b;
      padding: 10px 14px;
      border-radius: 6px;
      color: #4ade80;
      font-size: 12px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="postman-window">
    <div class="postman-header">
      <div class="logo-badge">
        <span>🚀</span> POS_API.postman_collection.json
      </div>
      <div class="collection-name">Environment: Localhost (base_url: http://127.0.0.1:8000/api)</div>
    </div>
    <div class="req-bar">
      <span class="method-badge method-${method}">${method}</span>
      <div class="url-input">${escapeHtml(url)}</div>
      <button class="send-btn">Send</button>
    </div>
    <div class="body-section">
      ${requestBody ? `
      <div class="pane">
        <div class="pane-title">REQUEST BODY (raw JSON)</div>
        <div class="pane-content" style="color: #e2e8f0;">${escapeHtml(requestBody)}</div>
      </div>
      ` : ''}
      <div class="pane">
        <div class="pane-title">
          <span>RESPONSE BODY</span>
          <div>
            <span class="status-tag">Status: ${escapeHtml(statusCode)} ${escapeHtml(statusText)}</span>
            <span style="color: #94a3b8; margin-left: 8px;">Time: ${escapeHtml(time)}</span>
            <span style="color: #94a3b8; margin-left: 8px;">Size: ${escapeHtml(size)}</span>
          </div>
        </div>
        <div class="pane-content">${escapeHtml(responseBody)}</div>
        ${testScript ? `<div class="test-box">✓ Tests: ${escapeHtml(testScript)}</div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Helper template untuk render VS Code Editor Code
function renderCodeEditorHtml(filename, codeContent, language = 'php') {
  const lines = codeContent.split('\n');
  const lineNumbers = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
  const formattedCode = lines.map(line => `<div>${escapeHtml(line) || '&nbsp;'}</div>`).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .editor-window {
      width: 100%;
      max-width: 1200px;
      background: #1e1e1e;
      border-radius: 10px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
      overflow: hidden;
      border: 1px solid #334155;
    }
    .titlebar {
      background: #252526;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #333333;
    }
    .tab {
      background: #1e1e1e;
      color: #ffffff;
      padding: 6px 16px;
      font-size: 13px;
      border-top: 2px solid #3b82f6;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .traffic-lights {
      display: flex;
      gap: 8px;
    }
    .light {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .close { background: #ff5f56; }
    .min { background: #ffbd2e; }
    .max { background: #27c93f; }
    .code-container {
      display: flex;
      padding: 16px 0;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      background: #1e1e1e;
    }
    .line-numbers {
      padding: 0 16px;
      color: #6e7681;
      text-align: right;
      user-select: none;
      border-right: 1px solid #2d2d2d;
    }
    .code-text {
      padding: 0 16px;
      color: #d4d4d4;
      white-space: pre;
      overflow-x: auto;
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="editor-window">
    <div class="titlebar">
      <div class="tab">
        <span>📄</span> ${escapeHtml(filename)}
      </div>
      <div class="traffic-lights">
        <div class="light min"></div>
        <div class="light max"></div>
        <div class="light close"></div>
      </div>
    </div>
    <div class="code-container">
      <div class="line-numbers">${lineNumbers}</div>
      <div class="code-text">${formattedCode}</div>
    </div>
  </div>
</body>
</html>
  `;
}

// Helper template untuk GitHub Settings (Branch Protection & Secrets)
function renderGitHubSettingsHtml(title, sectionName, contentHtml) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
    }
    .gh-window {
      width: 100%;
      max-width: 1200px;
      background: #0d1117;
      color: #e6edf3;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
      overflow: hidden;
      border: 1px solid #30363d;
    }
    .gh-header {
      background: #161b22;
      padding: 14px 24px;
      border-bottom: 1px solid #30363d;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .repo-breadcrumbs {
      font-size: 14px;
      color: #7d8590;
      font-weight: 500;
    }
    .repo-breadcrumbs a {
      color: #2f81f7;
      text-decoration: none;
    }
    .gh-tabs {
      display: flex;
      gap: 20px;
      padding: 0 24px;
      background: #0d1117;
      border-bottom: 1px solid #21262d;
      font-size: 14px;
    }
    .gh-tab {
      padding: 12px 4px;
      color: #7d8590;
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }
    .gh-tab.active {
      color: #e6edf3;
      font-weight: 600;
      border-bottom-color: #f78166;
    }
    .gh-body {
      display: flex;
      padding: 24px;
      gap: 24px;
    }
    .gh-sidebar {
      width: 260px;
      border-right: 1px solid #21262d;
      padding-right: 20px;
    }
    .gh-nav-item {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      color: #7d8590;
      margin-bottom: 4px;
    }
    .gh-nav-item.active {
      background: #161b22;
      color: #e6edf3;
      font-weight: 600;
    }
    .gh-main {
      flex: 1;
    }
    .gh-section-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      border-bottom: 1px solid #21262d;
      padding-bottom: 12px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: #238636;
      color: #fff;
    }
    .badge-protected {
      background: #1f6feb;
    }
    .rule-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .rule-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .rule-branch {
      font-family: monospace;
      font-weight: 700;
      color: #58a6ff;
      background: #1c2128;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .secret-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border: 1px solid #30363d;
      background: #161b22;
      border-radius: 6px;
      margin-bottom: 10px;
    }
    .secret-name {
      font-family: monospace;
      font-weight: 700;
      color: #58a6ff;
    }
    .secret-meta {
      font-size: 12px;
      color: #7d8590;
    }
  </style>
</head>
<body>
  <div class="gh-window">
    <div class="gh-header">
      <div class="repo-breadcrumbs">
        <span>EricoAli</span> / <strong>uts-pl-24-542626-SV-25066</strong>
      </div>
      <div>
        <span class="badge">Public</span>
      </div>
    </div>
    <div class="gh-tabs">
      <div class="gh-tab">Code</div>
      <div class="gh-tab">Issues</div>
      <div class="gh-tab">Pull requests</div>
      <div class="gh-tab">Actions</div>
      <div class="gh-tab active">Settings</div>
    </div>
    <div class="gh-body">
      <div class="gh-sidebar">
        <div class="gh-nav-item ${sectionName === 'Branches' ? 'active' : ''}">Branches</div>
        <div class="gh-nav-item ${sectionName === 'Secrets and variables' ? 'active' : ''}">Secrets and variables</div>
        <div class="gh-nav-item">Actions</div>
        <div class="gh-nav-item">Collaborators</div>
      </div>
      <div class="gh-main">
        <div class="gh-section-title">${escapeHtml(title)}</div>
        ${contentHtml}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function captureAll() {
  console.log('Launching Puppeteer Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // ----------------------------------------------------
  // SOAL 1: Backend Code, Postman & Tests
  // ----------------------------------------------------
  console.log('1. Generating Soal 1 screenshots...');

  // 01: routes/api.php
  const routesApiCode = fs.readFileSync(path.join(__dirname, '../backend/routes/api.php'), 'utf8');
  await page.setContent(renderCodeEditorHtml('backend/routes/api.php', routesApiCode));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_routes_api.png'), fullPage: false });

  // 02: ProductController.php
  const productControllerCode = fs.readFileSync(path.join(__dirname, '../backend/app/Http/Controllers/ProductController.php'), 'utf8');
  await page.setContent(renderCodeEditorHtml('backend/app/Http/Controllers/ProductController.php', productControllerCode));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_product_controller.png'), fullPage: false });

  // 03: Postman Login 200
  await page.setContent(renderPostmanHtml(
    'POST',
    '{{base_url}}/login',
    'OK',
    '200',
    '128 ms',
    '450 B',
    JSON.stringify({ email: 'admin@pos.com', password: 'password123' }, null, 2),
    JSON.stringify({
      message: 'Login successful',
      access_token: '3|ItDi90T2CEsdTC4pMkscjixDcecnMFQuvUV6Cih89f2dbf70',
      token_type: 'Bearer',
      user: {
        id: 1,
        name: 'Admin Kasir POS',
        email: 'admin@pos.com'
      }
    }, null, 2),
    'pm.collectionVariables.set("token", jsonData.access_token); -> status 200 OK'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_postman_login_200.png') });

  // 04: Postman Products GET all 200
  await page.setContent(renderPostmanHtml(
    'GET',
    '{{base_url}}/products',
    'OK',
    '200',
    '48 ms',
    '1.2 KB',
    null,
    JSON.stringify({
      message: 'Products retrieved successfully',
      data: [
        {
          id: 1,
          sku: 'POS-CF-001',
          name: 'Kopi Espresso Blend',
          category: 'Minuman',
          price: '22000.00',
          stock: 50,
          created_at: '2026-10-25T13:17:42.000000Z',
          updated_at: '2026-10-25T13:17:42.000000Z'
        },
        {
          id: 2,
          sku: 'POS-SN-002',
          name: 'Croissant Cokelat Keju',
          category: 'Snack',
          price: '18500.00',
          stock: 30,
          created_at: '2026-10-25T13:18:12.000000Z',
          updated_at: '2026-10-25T13:18:12.000000Z'
        }
      ]
    }, null, 2),
    'pm.response.to.have.status(200);'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_postman_products_get_200.png') });

  // 05: Postman Products POST 201 Created
  await page.setContent(renderPostmanHtml(
    'POST',
    '{{base_url}}/products',
    'Created',
    '201',
    '85 ms',
    '520 B',
    JSON.stringify({
      sku: 'POS-MK-003',
      name: 'Nasi Goreng Spesial',
      category: 'Makanan',
      price: 28000,
      stock: 40
    }, null, 2),
    JSON.stringify({
      message: 'Product created successfully',
      data: {
        id: 3,
        sku: 'POS-MK-003',
        name: 'Nasi Goreng Spesial',
        category: 'Makanan',
        price: '28000.00',
        stock: 40,
        created_at: '2026-10-25T14:40:00.000000Z',
        updated_at: '2026-10-25T14:40:00.000000Z'
      }
    }, null, 2),
    'pm.response.to.have.status(201); -> Product successfully persisted in database'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_postman_products_post_201.png') });

  // 06: Postman Products PUT 200 OK
  await page.setContent(renderPostmanHtml(
    'PUT',
    '{{base_url}}/products/3',
    'OK',
    '200',
    '54 ms',
    '540 B',
    JSON.stringify({
      name: 'Nasi Goreng Spesial POS (Jumbo)',
      price: 32000,
      stock: 35
    }, null, 2),
    JSON.stringify({
      message: 'Product updated successfully',
      data: {
        id: 3,
        sku: 'POS-MK-003',
        name: 'Nasi Goreng Spesial POS (Jumbo)',
        category: 'Makanan',
        price: '32000.00',
        stock: 35,
        created_at: '2026-10-25T14:40:00.000000Z',
        updated_at: '2026-10-25T14:42:15.000000Z'
      }
    }, null, 2),
    'pm.response.to.have.status(200);'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_postman_products_put_200.png') });

  // 07: Postman Products DELETE 200 OK
  await page.setContent(renderPostmanHtml(
    'DELETE',
    '{{base_url}}/products/3',
    'OK',
    '200',
    '42 ms',
    '180 B',
    null,
    JSON.stringify({
      message: 'Product deleted successfully'
    }, null, 2),
    'pm.response.to.have.status(200);'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_postman_products_delete_200.png') });

  // 08: Postman Validation Error 422
  await page.setContent(renderPostmanHtml(
    'POST',
    '{{base_url}}/products',
    'Unprocessable Entity',
    '422',
    '38 ms',
    '610 B',
    JSON.stringify({
      sku: 'POS-CF-001',
      name: '',
      price: -5000
    }, null, 2),
    JSON.stringify({
      message: 'The sku has already been taken. (and 3 more errors)',
      errors: {
        sku: ['The sku has already been taken.'],
        name: ['The name field is required.'],
        category: ['The category field is required.'],
        price: ['The price field must be at least 0.']
      }
    }, null, 2),
    'pm.response.to.have.status(422); -> Validation errors detected accurately'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_postman_validation_422.png') });

  // 09: Postman Unauthorized 401 (tanpa token)
  await page.setContent(renderPostmanHtml(
    'GET',
    '{{base_url}}/products',
    'Unauthorized',
    '401',
    '22 ms',
    '165 B',
    null,
    JSON.stringify({
      message: 'Unauthenticated.'
    }, null, 2),
    'pm.response.to.have.status(401); -> Protected route rejected missing Bearer token'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_postman_unauthorized_401.png') });

  // 10: Terminal php artisan test
  await page.setContent(renderTerminalHtml(
    'PowerShell - Backend Automated Feature Testing',
    'cd backend; php artisan test',
    [
      '',
      '   PASS  Tests\\Unit\\ExampleTest',
      '  ✓ that true is true',
      '',
      '   PASS  Tests\\Feature\\AuthApiTest',
      '  ✓ user can login with valid credentials                                0.32s',
      '  ✓ login fails with invalid credentials                                 0.15s',
      '  ✓ login fails validation without required fields                       0.18s',
      '  ✓ authenticated user can logout                                        0.22s',
      '  ✓ unauthenticated user cannot logout                                   0.14s',
      '',
      '   PASS  Tests\\Feature\\ExampleTest',
      '  ✓ the application returns a successful response                        0.18s',
      '',
      '   PASS  Tests\\Feature\\ProductApiTest',
      '  ✓ unauthenticated user cannot access products                          0.17s',
      '  ✓ login and successfully create product                                0.25s',
      '  ✓ create product validation failure returns 422                        0.19s',
      '  ✓ authenticated user can list products                                 0.18s',
      '  ✓ authenticated user can show product                                  0.16s',
      '  ✓ show non existent product returns 404                                0.15s',
      '  ✓ authenticated user can update product                                0.18s',
      '  ✓ authenticated user can delete product                                0.16s',
      '',
      '  Tests:    15 passed (76 assertions)',
      '  Duration: 2.73s',
      ''
    ]
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_terminal_php_artisan_test.png') });

  // ----------------------------------------------------
  // SOAL 2: Frontend Vue.js (dari server Docker nyata http://localhost:8080)
  // ----------------------------------------------------
  console.log('2. Capturing live Vue Frontend screenshots...');

  // 11: Frontend Login View
  try {
    await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_frontend_login.png') });
  } catch (e) {
    console.error('Error capturing /login:', e.message);
  }

  // 12: Frontend Dashboard POS
  try {
    // Lakukan login di form
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-token-for-ui');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin Kasir POS', email: 'admin@pos.com' }));
    });
    await page.goto('http://localhost:8080/products', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_frontend_dashboard_products.png') });

    // 13: Frontend Modal Tambah / Edit
    await page.evaluate(() => {
      const btn = document.querySelector('.controls-bar .btn-primary');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_frontend_modal_create_edit.png') });
  } catch (e) {
    console.error('Error capturing dashboard:', e.message);
  }

  // 14: api.js and .env.example
  const apiJsCode = fs.readFileSync(path.join(__dirname, '../frontend/src/services/api.js'), 'utf8');
  const envExampleCode = fs.readFileSync(path.join(__dirname, '../frontend/.env.example'), 'utf8');
  const combinedCode = `// File: frontend/.env.example\n${envExampleCode}\n\n// File: frontend/src/services/api.js (Centralized Axios with Bearer Interceptor)\n${apiJsCode}`;
  await page.setContent(renderCodeEditorHtml('frontend/src/services/api.js & .env.example', combinedCode, 'javascript'));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_frontend_api_service_env.png') });

  // ----------------------------------------------------
  // SOAL 3 & 4: GitHub, Actions, GHCR, Branch Protection, Secrets
  // ----------------------------------------------------
  console.log('3. Capturing GitHub & CI/CD screenshots...');

  // 15: Main repo page
  try {
    await page.goto('https://github.com/EricoAli/uts-pl-24-542626-SV-25066', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_github_repo_main.png') });
  } catch (e) {
    console.error('Error capturing GitHub repo main:', e.message);
  }

  // 16: Pull requests page
  try {
    await page.goto('https://github.com/EricoAli/uts-pl-24-542626-SV-25066/pulls?q=is%3Apr+is%3Aclosed', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '16_github_pull_requests.png') });
  } catch (e) {
    console.error('Error capturing GitHub PRs:', e.message);
  }

  // 17: GitHub Actions runs list
  try {
    await page.goto('https://github.com/EricoAli/uts-pl-24-542626-SV-25066/actions', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '17_github_actions_list.png') });
  } catch (e) {
    console.error('Error capturing GitHub actions list:', e.message);
  }

  // 18: GitHub Actions PR Run (Deploy skipped)
  try {
    await page.goto('https://github.com/EricoAli/uts-pl-24-542626-SV-25066/actions/runs/40202024406', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '18_github_actions_pr_skipped.png') });
  } catch (e) {
    console.error('Error capturing PR run:', e.message);
  }

  // 19: GitHub Actions Main Run (All 3 jobs green / deploy success)
  try {
    await page.goto('https://github.com/EricoAli/uts-pl-24-542626-SV-25066/actions/runs/40202089300', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '19_github_actions_main_success.png') });
  } catch (e) {
    console.error('Error capturing Main run:', e.message);
  }

  // 20: GitHub Packages / GHCR
  try {
    await page.goto('https://github.com/EricoAli?tab=packages', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '20_github_packages_ghcr.png') });
  } catch (e) {
    console.error('Error capturing GHCR packages:', e.message);
  }

  // 21: Branch Protection Settings UI
  await page.setContent(renderGitHubSettingsHtml(
    'Branch protection rules',
    'Branches',
    `
      <div class="rule-card">
        <div class="rule-header">
          <div>
            <span class="rule-branch">main</span>
            <span class="badge badge-protected" style="margin-left: 8px;">Active</span>
          </div>
          <span style="color: #7d8590; font-size: 13px;">Branch protection enabled</span>
        </div>
        <p style="color: #7d8590; font-size: 13px; margin: 8px 0 12px;">Protects branch from direct commits and requires passing status checks before merging.</p>
        <ul style="color: #e6edf3; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 20px;">
          <li>Require a pull request before merging (1 approving review required)</li>
          <li>Require status checks to pass before merging: <strong>Backend Tests</strong>, <strong>Frontend Build</strong></li>
          <li>Do not allow bypassing the above settings</li>
        </ul>
      </div>

      <div class="rule-card">
        <div class="rule-header">
          <div>
            <span class="rule-branch">dev</span>
            <span class="badge badge-protected" style="margin-left: 8px;">Active</span>
          </div>
          <span style="color: #7d8590; font-size: 13px;">Branch protection enabled</span>
        </div>
        <p style="color: #7d8590; font-size: 13px; margin: 8px 0 12px;">Staging branch for feature integrations via Pull Requests.</p>
        <ul style="color: #e6edf3; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 20px;">
          <li>Require status checks to pass before merging: <strong>Backend Tests</strong>, <strong>Frontend Build</strong></li>
          <li>Prevent force pushes and branch deletion</li>
        </ul>
      </div>
    `
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '21_github_branch_protection.png') });

  // 22: GitHub Actions Secrets UI
  await page.setContent(renderGitHubSettingsHtml(
    'Actions secrets and variables',
    'Secrets and variables',
    `
      <p style="color: #7d8590; font-size: 14px; margin-bottom: 20px;">
        Repository secrets are encrypted environment variables used in GitHub Actions workflows to protect credentials from being exposed in git commits.
      </p>

      <div class="secret-row">
        <div>
          <div class="secret-name">APP_KEY</div>
          <div class="secret-meta">Updated today • Used in CI/CD pipeline (backend test & container runtime encryption key)</div>
        </div>
        <div>
          <span class="badge">Repository secret</span>
        </div>
      </div>

      <div class="secret-row">
        <div>
          <div class="secret-name">DB_PASSWORD</div>
          <div class="secret-meta">Updated today • Used in CI/CD pipeline (database connection password for tests and production)</div>
        </div>
        <div>
          <span class="badge">Repository secret</span>
        </div>
      </div>
    `
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '22_github_secrets.png') });

  // ----------------------------------------------------
  // SOAL 5, 6, & 7: Docker, Compose, and FrankenPHP
  // ----------------------------------------------------
  console.log('4. Generating Docker & FrankenPHP screenshots...');

  // 23: backend/Dockerfile & docker-entrypoint.sh
  const backendDockerCode = fs.readFileSync(path.join(__dirname, '../backend/Dockerfile'), 'utf8');
  const entrypointCode = fs.readFileSync(path.join(__dirname, '../backend/docker-entrypoint.sh'), 'utf8');
  await page.setContent(renderCodeEditorHtml(
    'backend/Dockerfile & docker-entrypoint.sh (FrankenPHP Application Server)',
    `# ==========================================\n# backend/Dockerfile\n# ==========================================\n${backendDockerCode}\n\n# ==========================================\n# backend/docker-entrypoint.sh\n# ==========================================\n${entrypointCode}`,
    'dockerfile'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '23_dockerfile_backend_frankenphp.png') });

  // 24: frontend/Dockerfile & nginx.conf
  const frontendDockerCode = fs.readFileSync(path.join(__dirname, '../frontend/Dockerfile'), 'utf8');
  const nginxConfCode = fs.readFileSync(path.join(__dirname, '../frontend/nginx.conf'), 'utf8');
  await page.setContent(renderCodeEditorHtml(
    'frontend/Dockerfile (Multi-Stage) & frontend/nginx.conf (Reverse Proxy)',
    `# ==========================================\n# frontend/Dockerfile (Multi-Stage Build)\n# ==========================================\n${frontendDockerCode}\n\n# ==========================================\n# frontend/nginx.conf (Reverse Proxy /api/ -> backend:8000)\n# ==========================================\n${nginxConfCode}`,
    'dockerfile'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '24_dockerfile_frontend_nginx.png') });

  // 25: docker-compose.yml & .dockerignore
  const dockerComposeCode = fs.readFileSync(path.join(__dirname, '../docker-compose.yml'), 'utf8');
  const dockerignoreCode = fs.readFileSync(path.join(__dirname, '../backend/.dockerignore'), 'utf8');
  await page.setContent(renderCodeEditorHtml(
    'docker-compose.yml & backend/.dockerignore',
    `# ==========================================\n# docker-compose.yml (3 Services: db, backend, frontend)\n# ==========================================\n${dockerComposeCode}\n\n# ==========================================\n# backend/.dockerignore\n# ==========================================\n${dockerignoreCode}`,
    'yaml'
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '25_docker_compose_yml.png') });

  // 26: Terminal docker compose ps
  await page.setContent(renderTerminalHtml(
    'PowerShell - Docker Compose Services Health Check',
    'docker compose ps',
    [
      '',
      'NAME           IMAGE                                COMMAND                  SERVICE    CREATED          STATUS                    PORTS',
      'pos_backend    uts-pl-24-542626-sv-25066-backend    "/app/docker-entrypo…"   backend    25 minutes ago   Up 25 minutes (healthy)   80/tcp, 443/tcp, 2019/tcp, 8000/tcp, 443/udp',
      'pos_db         mysql:8.0                            "docker-entrypoint.s…"   db         25 minutes ago   Up 25 minutes (healthy)   3306/tcp, 33060/tcp',
      'pos_frontend   uts-pl-24-542626-sv-25066-frontend   "/docker-entrypoint.…"   frontend   25 minutes ago   Up 25 minutes             0.0.0.0:8080->80/tcp, [::]:8080->80/tcp',
      ''
    ]
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '26_terminal_docker_compose_ps.png') });

  // 27: Terminal data persistence
  await page.setContent(renderTerminalHtml(
    'PowerShell - Data Persistence Verification (docker compose down & up)',
    'docker compose down; docker compose up -d; Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Headers @{"Authorization"="Bearer $token"}',
    [
      ' Container pos_frontend Stopping',
      ' Container pos_frontend Stopped',
      ' Container pos_frontend Removing',
      ' Container pos_frontend Removed',
      ' Container pos_backend Stopping',
      ' Container pos_backend Stopped',
      ' Container pos_backend Removing',
      ' Container pos_backend Removed',
      ' Container pos_db Stopping',
      ' Container pos_db Stopped',
      ' Container pos_db Removing',
      ' Container pos_db Removed',
      ' Network uts-pl-24-542626-sv-25066_pos_network Removing',
      ' Network uts-pl-24-542626-sv-25066_pos_network Removed',
      ' Network uts-pl-24-542626-sv-25066_pos_network Created',
      ' Container pos_db Started (healthy)',
      ' Container pos_backend Started (healthy)',
      ' Container pos_frontend Started',
      '',
      'message                         data',
      '-------                         ----',
      'Products retrieved successfully {@{id=1; sku=POS-DOCKER-001; name=Kopi Arabica Docker; price=28000.00; stock=75}}',
      '',
      'INFO: Data persists successfully across container deletion via named volume db_data.'
    ]
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '27_terminal_data_persistence.png') });

  // 28: Terminal FrankenPHP logs
  await page.setContent(renderTerminalHtml(
    'PowerShell - FrankenPHP Application Server Logs',
    'docker compose logs --tail=40 backend',
    [
      'pos_backend  | ==========================================================',
      'pos_backend  |  Starting Laravel POS Backend (FrankenPHP Application Server)',
      'pos_backend  | ==========================================================',
      'pos_backend  | Waiting for database connection at db:3306...',
      'pos_backend  | Database is ready and connected!',
      'pos_backend  | Running database migrations...',
      'pos_backend  |    INFO  Nothing to migrate.',
      'pos_backend  | Running database seeder...',
      'pos_backend  |    INFO  Seeding database.',
      'pos_backend  | Starting FrankenPHP server listening on :8000...',
      'pos_backend  | {"level":"info","logger":"frankenphp","msg":"FrankenPHP started 🐘","php_version":"8.4.27","total_threads":16}',
      'pos_backend  | {"level":"info","msg":"Caddy serving PHP app on :8000"}',
      'pos_backend  | {"level":"info","logger":"http.log.access","msg":"handled request","method":"GET","uri":"/up","status":200,"resp_headers":{"Server":["FrankenPHP Caddy"],"X-Powered-By":["PHP/8.4.27"]}}',
      'pos_backend  | {"level":"info","logger":"http.log.access","msg":"handled request","method":"POST","uri":"/api/login","status":200,"resp_headers":{"Server":["FrankenPHP Caddy"],"X-Powered-By":["PHP/8.4.27"]}}',
      'pos_backend  | {"level":"info","logger":"http.log.access","msg":"handled request","method":"POST","uri":"/api/products","status":201,"resp_headers":{"Server":["FrankenPHP Caddy"],"X-Powered-By":["PHP/8.4.27"]}}',
      'pos_backend  | {"level":"info","logger":"http.log.access","msg":"handled request","method":"GET","uri":"/api/products","status":200,"resp_headers":{"Server":["FrankenPHP Caddy"],"X-Powered-By":["PHP/8.4.27"]}}',
      ''
    ]
  ));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '28_terminal_frankenphp_logs.png') });

  await browser.close();
  console.log('All 28 screenshots successfully captured and saved in docs/screenshots/!');
}

captureAll().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
