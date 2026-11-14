// Refresh only approved banner/form slots; preserve existing page content.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { refreshHomepageBanners } from './banners.mjs';
import { paymentMethods } from './payment-details.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'redstar-banner-build-'));
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const full = path.join(directory, entry.name);
  return entry.isDirectory() ? files(full) : full.endsWith('.html') ? [full] : [];
});
const pattern = /<section class="(?:cta-banner|rs-banner rs-banner--enquiry)"[\s\S]*?<\/section>/;
try {
  fs.cpSync(path.join(root, 'blog'), path.join(temporary, 'blog'), { recursive: true });
  fs.mkdirSync(path.join(temporary, 'sitepad-data'));
  fs.copyFileSync(path.join(root, 'sitepad-data/portfolio-projects.json'), path.join(temporary, 'sitepad-data/portfolio-projects.json'));
  execFileSync(process.execPath, [path.join(root, 'scripts/rebuild-site.mjs')], { cwd: temporary, stdio: 'pipe' });
  let changed = 0;
  for (const generated of files(temporary)) {
    const relative = path.relative(temporary, generated);
    const real = path.join(root, relative);
    if (!fs.existsSync(real)) continue;
    const source = fs.readFileSync(real, 'utf8');
    let html = source;
    const built = fs.readFileSync(generated, 'utf8');
    const banner = built.match(pattern);
    if (banner) {
      if (!pattern.test(html)) throw new Error(`Existing enquiry banner missing: ${relative}`);
      html = html.replace(pattern, banner[0]);
    }
    if (relative === 'contact/index.html') {
      const form = built.match(/<section class="rs-quote"[\s\S]*?<\/section>/)[0];
      if (html.includes('id="quote-request"')) html = html.replace(/<section class="rs-quote"[\s\S]*?<\/section>/, form);
      else html = html.replace('<section class="rs-payments"', form + '\n<section class="rs-payments"');
      if (!html.includes('assets/js/quote-request.js')) html = html.replace('</head>', '<script src="../assets/js/quote-request.js" defer></script>\n</head>');
      html = html.replace('<h2>Κλεισε μια κληση 30 λεπτων.</h2>', '<h2>Κλείστε μια κλήση.</h2>');
      html = html.replace(/<section class="rs-payments"[\s\S]*?<\/section>/, paymentMethods('../'));
    }
    if (html !== source) { fs.writeFileSync(real, html); changed++; }
  }
  const home = path.join(root, 'index.html');
  const current = fs.readFileSync(home, 'utf8');
  const refreshed = refreshHomepageBanners(current.replace(/<section class="rs-payments"[\s\S]*?<\/section>/, paymentMethods()));
  if (current !== refreshed) { fs.writeFileSync(home, refreshed); changed++; }
  console.log(`Refreshed banner/form slots in ${changed} pages. Other content preserved.`);
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
