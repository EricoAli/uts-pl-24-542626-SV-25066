const puppeteer = require('./node_modules/puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1130 });
  await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/docs/report_docx_format.html', { waitUntil: 'networkidle0' });

  // Screenshot cover
  await page.screenshot({ path: 'docs/preview_cover.png', clip: { x: 0, y: 0, width: 800, height: 1130 } });
  console.log('preview_cover.png captured');

  await browser.close();
})();
