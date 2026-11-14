// Capture public project pages without signing in or submitting site forms.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'sitepad-data/portfolio-projects.json')))
  .filter(p => process.argv[2] ? process.argv.slice(2).includes(p.slug) : p.featuredOrder);
if (!projects.length) throw new Error('No matching project to capture');
const output = path.join(root, 'assets/images/portfolio');
const originals = path.join(os.homedir(), '.cache/redstar-portfolio-captures');
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(originals, { recursive: true });
const manifestPath = path.join(root, 'sitepad-data/portfolio-captures.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath)) : {};
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-dev-shm-usage'] });
let next = 0;
const errors = [];
async function capture() {
  while (next < projects.length) {
    const project = projects[next++];
    const viewport = project.captureViewport || { width: 1440, height: 900 };
    const context = await browser.newContext({ viewport, colorScheme: 'light', reducedMotion: 'reduce', deviceScaleFactor: 1 });
    await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.fulfill({ status: 200, body: '' }));
    const page = await context.newPage();
    try {
      const url = new URL(project.captureUrl || project.liveUrl);
      if (project.slug === 'fortistis-electronics-eshop') url.searchParams.set('theme', 'light');
      const response = await page.goto(url.href, { waitUntil: 'load', timeout: 45000 });
      if (response.status() !== 200) throw new Error(`HTTP ${response.status()}`);
      await page.evaluate(() => document.fonts.ready);
      const dismiss = page.getByRole('button', { name: /^(Got it|Μόνο απαραίτητα|Μονο απαραιτητα|Απόρριψη|Reject|Reject All|Necessary only|Continue without analytics)$/i });
      for (const button of await dismiss.all()) if (await button.isVisible()) await button.click();
      let captureTarget = page;
      if (project.captureSectionHeading) {
        const section = page.getByRole('heading', { name: project.captureSectionHeading, exact: true }).locator('xpath=ancestor::section[1]');
        await section.scrollIntoViewIfNeeded();
        captureTarget = project.captureSectionViewport ? page : section;
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      } else if (project.captureMapCenter) {
        await page.getByRole('button', { name: project.captureMapCenter, exact: true }).click();
        await page.waitForFunction(() => document.querySelectorAll('.leaflet-tile-loaded').length > 0 && document.querySelectorAll('.leaflet-marker-icon').length > 0);
        await page.waitForLoadState('networkidle', { timeout: 15000 });
      } else if (project.slug === 'universe-deree-campus-platform') {
        const section = page.getByRole('heading', { name: 'One place for your campus community.', exact: true }).locator('xpath=ancestor::section[1]');
        await section.evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 110));
      } else if (project.slug === 'fortistis-electronics-eshop') {
        await page.locator('.card').first().evaluate(element => window.scrollTo(0, Math.max(0, element.getBoundingClientRect().top + window.scrollY - 150)));
      }
      await page.waitForFunction(() => [...document.images].filter(image => {
        const r = image.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0;
      }).every(image => image.complete && image.naturalWidth > 0), null, { timeout: 20000 });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const png = path.join(originals, `${project.slug}.png`);
      await captureTarget.screenshot({ path: png, animations: 'disabled' });
      const dimensions = JSON.parse(execFileSync('python3', ['-c', 'from PIL import Image; import sys,json; im=Image.open(sys.argv[1]).convert("RGB"); [im.resize((w,round(im.height*w/im.width)),Image.Resampling.LANCZOS).save(sys.argv[2]+f"-{w}.webp",quality=82,method=6) for w in (720,1440)]; print(json.dumps({"width":im.width,"height":im.height}))', png, path.join(output, project.slug)], { encoding: 'utf8' }));
      manifest[project.slug] = {
        sourceUrl: page.url(), capturedAt: new Date().toISOString(), viewport,
        screenshotSize: dimensions,
        view: project.captureView || (project.slug === 'universe-deree-campus-platform' ? 'Campus community section, public session' : project.slug === 'fortistis-electronics-eshop' ? 'Power Banks product grid, light theme' : 'Public homepage'),
        images: [720, 1440].map(width => {
          const file = `assets/images/portfolio/${project.slug}-${width}.webp`;
          const bytes = fs.readFileSync(path.join(root, file));
          return { file, width, height: Math.round(width * dimensions.height / dimensions.width), bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
        }),
      };
      console.log(`Captured ${project.title}`);
    } catch (error) {
      errors.push(`${project.title}: ${error.message.split('\n')[0]}`);
    } finally { await context.close(); }
  }
}
try { await Promise.all([capture(), capture(), capture()]); }
finally { await browser.close(); fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n'); }
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Captured ${projects.length} public projects. Originals: ${originals}`);
