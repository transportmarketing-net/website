const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const STYLES = ['redstar', 'greenpromo', 'blueline', 'gradient', 'dark-minimal', 'transit-map'];
const BANNER_TYPES = [
    { name: 'cover-banner.html', output: 'cover-bg.jpg', width: 2480, height: 3508 },
    { name: 'section-break-banner.html', output: 'section-break-new.jpeg', width: 900, height: 1600 },
    { name: 'outro-banner.html', output: 'outro-bg.jpg', width: 2480, height: 3508 },
];

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (const style of STYLES) {
        const styleOutDir = path.join(__dirname, 'output', style);
        if (!fs.existsSync(styleOutDir)) fs.mkdirSync(styleOutDir, { recursive: true });

        console.log(`\n=== Rendering ${style} banners ===`);

        for (const banner of BANNER_TYPES) {
            const page = await browser.newPage();
            await page.setViewport({ width: banner.width, height: banner.height, deviceScaleFactor: 1 });

            const filePath = path.join(__dirname, 'banners', style, banner.name);
            await page.goto('file://' + filePath, { waitUntil: 'networkidle0', timeout: 15000 });

            const outputPath = path.join(styleOutDir, banner.output);

            // Screenshot as JPG/JPEG
            await page.screenshot({
                path: outputPath,
                type: banner.output.endsWith('.jpeg') ? 'jpeg' : 'jpeg',
                quality: 90,
                fullPage: false,
            });

            const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
            console.log(`  ✓ ${style}/${banner.output} (${fileSizeKB} KB)`);
            await page.close();
        }
    }

    await browser.close();
    console.log('\n✅ All banner variants rendered to output/');
})();
