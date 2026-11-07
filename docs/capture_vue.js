const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Visit Login
  await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/screenshots/11_frontend_login.png' });
  console.log('11_frontend_login.png captured');

  // 2. Click button to login with the real pre-filled credentials
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));
  console.log('Current URL after login:', page.url());
  await page.screenshot({ path: 'docs/screenshots/12_frontend_dashboard_products.png' });
  console.log('12_frontend_dashboard_products.png captured');

  // 3. Click "+ Tambah Produk" button in dashboard controls
  const addBtn = await page.$('.btn-primary');
  if (addBtn) {
    await addBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'docs/screenshots/13_frontend_modal_create_edit.png' });
    console.log('13_frontend_modal_create_edit.png captured');
  }

  await browser.close();
  console.log('Finished Vue capture!');
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
