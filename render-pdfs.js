const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const CARDS = [
    'card-dark-minimal.html',
    'card-transit-map.html',
    'card-gradient.html',
    'card-blueline.html',
    'card-redstar.html',
    'card-greenpromo.html',
];

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const outDir = path.join(__dirname, 'passes');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    for (const file of CARDS) {
        const page = await browser.newPage();
        await page.setViewport({ width: 680, height: 920, deviceScaleFactor: 2 });

        const filePath = path.join(__dirname, file);
        await page.goto('file://' + filePath, { waitUntil: 'networkidle0', timeout: 15000 });

        const pdfName = file.replace('.html', '.pdf');
        const pdfPath = path.join(outDir, pdfName);

        await page.pdf({
            path: pdfPath,
            width: '340px',
            height: '460px',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });

        console.log(`PDF: ${pdfPath}`);
        await page.close();
    }

    await browser.close();
    console.log('\nDone! All PDFs generated.');
})();
