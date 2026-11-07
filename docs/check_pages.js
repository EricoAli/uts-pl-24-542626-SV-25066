const puppeteer = require('./node_modules/puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(`
    <style>
      @page { size: A4; margin: 25mm; }
      body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; }
      .cover {
        height: 240mm;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        page-break-after: always;
      }
    </style>
    <div class="cover">
      <div>TOP</div>
      <div>LOGO</div>
      <div>AUTHOR</div>
      <div>FOOTER</div>
    </div>
    <div>Page 2 content</div>
  `);
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '25mm', bottom: '25mm', left: '25mm', right: '25mm' }
  });
  const matches = pdfBuffer.toString('latin1').match(/\/Type\s*\/Page\b/g);
  console.log('PDF page count with 240mm cover:', matches ? matches.length : 'unknown');
  await browser.close();
})();
