const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const CARDS = [
    { file: 'card-dark-minimal.html', name: 'tm-dark-minimal' },
    { file: 'card-transit-map.html', name: 'tm-transit-map' },
    { file: 'card-gradient.html', name: 'tm-gradient' },
    { file: 'card-blueline.html', name: 'blueline' },
    { file: 'card-redstar.html', name: 'redstar' },
    { file: 'card-greenpromo.html', name: 'greenpromo' },
];

const PASS_META = {
    'tm-dark-minimal': {
        desc: 'Transport Marketing',
        label: 'Director',
        bg: '10,10,10', fg: '255,255,255', lb: '150,150,150',
        org: 'Transport Marketing', header: 'TM',
    },
    'tm-transit-map': {
        desc: 'Transport Marketing',
        label: 'Director',
        bg: '10,10,10', fg: '255,255,255', lb: '150,150,150',
        org: 'Transport Marketing', header: 'TM',
    },
    'tm-gradient': {
        desc: 'Transport Marketing',
        label: 'Director',
        bg: '10,10,10', fg: '255,255,255', lb: '150,150,150',
        org: 'Transport Marketing', header: 'TM',
    },
    'blueline': {
        desc: 'BlueLine — SaaS & Systems',
        label: 'Director',
        bg: '13,27,48', fg: '255,255,255', lb: '66,133,244',
        org: 'BlueLine', header: 'BL',
    },
    'redstar': {
        desc: 'RedStar — Digital Agency',
        label: 'Director',
        bg: '20,20,20', fg: '255,255,255', lb: '234,67,53',
        org: 'RedStar', header: 'RS',
    },
    'greenpromo': {
        desc: 'GreenPromo — Events & Activations',
        label: 'Director',
        bg: '12,26,16', fg: '255,255,255', lb: '52,168,83',
        org: 'GreenPromo', header: 'GP',
    },
};

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const outDir = path.join(__dirname, 'passes');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    for (const card of CARDS) {
        const page = await browser.newPage();
        await page.setViewport({ width: 680, height: 920, deviceScaleFactor: 2 });

        const filePath = path.join(__dirname, card.file);
        await page.goto('file://' + filePath, { waitUntil: 'networkidle0', timeout: 15000 });

        // Screenshot just the card element
        const cardEl = await page.$('.card');
        const pngPath = path.join(outDir, card.name + '.png');

        if (cardEl) {
            await cardEl.screenshot({ path: pngPath, type: 'png' });
        } else {
            await page.screenshot({ path: pngPath, type: 'png' });
        }

        console.log(`Rendered: ${pngPath}`);

        // Build .pkpass directory structure (unsigned)
        const passDir = path.join(outDir, card.name + '.pass');
        if (!fs.existsSync(passDir)) fs.mkdirSync(passDir, { recursive: true });

        const meta = PASS_META[card.name];

        // pass.json
        const passJson = {
            formatVersion: 1,
            passTypeIdentifier: 'pass.net.transportmarketing.card',
            serialNumber: crypto.randomUUID(),
            teamIdentifier: 'TEAM_ID_HERE',
            organizationName: meta.org,
            description: meta.desc,
            backgroundColor: `rgb(${meta.bg})`,
            foregroundColor: `rgb(${meta.fg})`,
            labelColor: `rgb(${meta.lb})`,
            generic: {
                primaryFields: [
                    { key: 'name', label: meta.header, value: 'Alexandros Kourtis' }
                ],
                secondaryFields: [
                    { key: 'title', label: 'Title', value: 'Director' },
                    { key: 'company', label: 'Company', value: meta.org }
                ],
                auxiliaryFields: [
                    { key: 'phone', label: 'Phone', value: '+30 698 944 2438' },
                    { key: 'email', label: 'Email', value: 'director@transportmarketing.net' }
                ],
                backFields: [
                    { key: 'website', label: 'Website', value: 'https://transportmarketing.net' },
                    { key: 'tagline', label: 'Tagline', value: 'Three brands · One vision' }
                ]
            },
            barcode: {
                message: 'https://transportmarketing.net',
                format: 'PKBarcodeFormatQR',
                messageEncoding: 'iso-8859-1'
            },
            barcodes: [{
                message: 'https://transportmarketing.net',
                format: 'PKBarcodeFormatQR',
                messageEncoding: 'iso-8859-1'
            }]
        };

        fs.writeFileSync(
            path.join(passDir, 'pass.json'),
            JSON.stringify(passJson, null, 2)
        );

        // Copy the rendered PNG as thumbnail and strip images
        fs.copyFileSync(pngPath, path.join(passDir, 'thumbnail@2x.png'));
        fs.copyFileSync(pngPath, path.join(passDir, 'strip@2x.png'));

        // Create a simple 1x version (just copy, real production would resize)
        fs.copyFileSync(pngPath, path.join(passDir, 'thumbnail.png'));
        fs.copyFileSync(pngPath, path.join(passDir, 'strip.png'));

        // Generate manifest.json (SHA1 hashes of all files)
        const manifest = {};
        const files = fs.readdirSync(passDir).filter(f => f !== 'manifest.json' && f !== 'signature');
        for (const f of files) {
            const data = fs.readFileSync(path.join(passDir, f));
            manifest[f] = crypto.createHash('sha1').update(data).digest('hex');
        }
        fs.writeFileSync(
            path.join(passDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );

        console.log(`Pass structure: ${passDir}/`);
        await page.close();
    }

    await browser.close();
    console.log('\nDone! All cards rendered and pass structures created.');
    console.log('\nTo create signed .pkpass files, use one of:');
    console.log('  1. Upload PNGs + pass.json to passkit.com (free tier)');
    console.log('  2. Use Pass2U app on iPhone with the PNG images');
    console.log('  3. Sign with Apple Developer cert: signpass -p <folder>');
})();
