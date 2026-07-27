const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 680, height: 920, deviceScaleFactor: 2 });

    const filePath = path.join(__dirname, 'card-transit-map.html');
    await page.goto('file://' + filePath, { waitUntil: 'networkidle0', timeout: 15000 });

    // PNG
    const cardEl = await page.$('.card');
    const pngPath = path.join(__dirname, 'passes', 'tm-transit-map.png');
    await cardEl.screenshot({ path: pngPath, type: 'png' });
    console.log('PNG: ' + pngPath);

    // PDF
    const pdfPath = path.join(__dirname, 'passes', 'card-transit-map.pdf');
    await page.pdf({
        path: pdfPath,
        width: '340px',
        height: '460px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    console.log('PDF: ' + pdfPath);

    await browser.close();
    console.log('Done.');
})();
