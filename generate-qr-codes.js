const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const brands = [
    { name: 'redstar', url: 'https://redstar.transportmarketing.net' },
    { name: 'greenpromo', url: 'https://greenpromo.transportmarketing.net' },
    { name: 'blueline', url: 'https://blueline.transportmarketing.net' },
    { name: 'amberlane', url: 'https://amberlane.transportmarketing.net' },
    { name: 'gradient', url: 'https://transportmarketing.net' },
    { name: 'dark-minimal', url: 'https://transportmarketing.net' },
    { name: 'transit-map', url: 'https://transportmarketing.net' },
];

(async () => {
    console.log('Generating QR codes...\n');

    for (const brand of brands) {
        const qrPath = path.join(__dirname, 'banners', brand.name, 'qr-code.png');

        // Generate QR code with high error correction and white background
        await QRCode.toFile(qrPath, brand.url, {
            errorCorrectionLevel: 'H',
            type: 'png',
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        console.log(`✓ ${brand.name}: ${brand.url}`);
    }

    console.log('\n✅ All QR codes generated!');
})();
