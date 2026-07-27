const puppeteer = require('puppeteer');
const path = require('path');

const WEBSITES = [
    { url: 'https://lumencia.gr', name: 'project-lumencia' },
    { url: 'https://extratzis.gr', name: 'project-extratzis' },
    { url: 'https://akeraio.com', name: 'project-akeraio' },
];

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const outDir = path.join(__dirname, 'redstar/sitepad-data/uploads/2026/05');

    for (const site of WEBSITES) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

        try {
            await page.goto(site.url, { waitUntil: 'networkidle0', timeout: 15000 });

            const pngPath = path.join(outDir, site.name + '.png');
            await page.screenshot({ path: pngPath, type: 'png', fullPage: false });

            console.log(`✓ Captured: ${site.name}.png`);
        } catch (err) {
            console.error(`✗ Failed to capture ${site.url}:`, err.message);
        }

        await page.close();
    }

    await browser.close();
    console.log('\nDone! Website previews captured.');
})();
