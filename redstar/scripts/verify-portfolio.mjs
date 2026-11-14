// Real-browser regression for project ordering, screenshots, links and navigation.
// Run against a local preview; outbound project links are intercepted.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.argv[2] || 'http://127.0.0.1:8045/redstar/').replace(/\/?$/, '/');
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Use a local preview for the interaction regression.');
const expected = [
  ['hotelsystem-cloud-pms', 'https://hotelssystem.net/'],
  ['greenpromo-leaflet-distribution', 'https://greenpromo.transportmarketing.net/'],
  ['blueline-saas-platforms', 'https://blueline.transportmarketing.net/'],
  ['imatzoukas-plastic-surgery', 'https://imatzoukas.on-forge.com/'],
  ['universe-deree-campus-platform', 'https://universe-deree-live-3b97bb.on-forge.com/'],
  ['sass-academic-support-platform', 'https://sass.acg.edu/'],
  ['strive-hotel-staffing-website', 'https://striveworkforce.gr/'],
  ['cyclebox-indoor-cycling', 'https://alexkourtis98.github.io/vlachostax/cyclebox/'],
  ['pilates-box-athens', 'https://alexkourtis98.github.io/vlachostax/pilatebox/'],
  ['vlachostax-accounting', 'https://alexkourtis98.github.io/vlachostax/vlachos/'],
  ['management-services-buildings', 'https://alexkourtis98.github.io/vlachostax/management-building/'],
  ['fortistis-electronics-eshop', 'https://fortistis.store/el/power-banks'],
];
const projects = JSON.parse(fs.readFileSync(path.join(root, 'sitepad-data/portfolio-projects.json')));
assert.equal(projects.length, 25);
assert.equal(new Set(projects.map(p => p.slug)).size, 25);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'sitepad-data/portfolio-captures.json')));
for (const [index, [slug, liveUrl]] of expected.entries()) {
  const project = projects.find(p => p.slug === slug);
  assert.equal(project.featuredOrder, index + 1);
  assert.equal(project.liveUrl, liveUrl);
  assert.equal(manifest[slug].images.length, 2);
  for (const image of manifest[slug].images) {
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, image.file))).digest('hex'), image.sha256);
  }
}

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-dev-shm-usage', '--disable-features=BackForwardCache'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
await context.addInitScript(() => localStorage.setItem('redstar-consent-v1', 'rejected'));
await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.fulfill({ status: 200, body: '' }));
const report = { projects: projects.length, captures: expected.length, layouts: 0, loadedCardImages: 0, textStates: 0, interceptedLiveLinks: 0, filters: {}, pageErrors: [] };
const widths = [280, 320, 414, 768, 1440];

async function checkTextStates(card) {
  for (const action of ['.portfolio-card__main', '.portfolio-card__live']) {
    const link = card.locator(action);
    for (const state of ['default', 'hover', 'focus']) {
      if (state === 'hover') await link.hover();
      if (state === 'focus') await link.focus();
      const readings = await card.evaluate((card, action) => {
        const transparent = color => !color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
        const luminance = color => {
          const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
            value /= 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
          });
          return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        };
        const selector = action === '.portfolio-card__live' ? action : '[class$="__meta"], [class$="__title"], [class$="__copy"], .case-card__excerpt, .portfolio-card__detail';
        return [...card.querySelectorAll(selector)].map(element => {
          const style = getComputedStyle(element);
          let ancestor = element;
          while (ancestor && transparent(getComputedStyle(ancestor).backgroundColor)) ancestor = ancestor.parentElement;
          const foreground = luminance(style.color);
          const background = luminance(getComputedStyle(ancestor).backgroundColor);
          const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
          const size = parseFloat(style.fontSize);
          const required = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700) ? 3 : 4.5;
          return { text: element.textContent.trim().slice(0, 45), ratio, required };
        });
      }, action);
      for (const reading of readings) {
        assert(reading.ratio >= reading.required, `${state} contrast: ${JSON.stringify(reading)}`);
        report.textStates++;
      }
    }
  }
}
async function checkLayouts(page, route) {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(overflow <= 1, `${route}@${width}: document overflow ${overflow}`);
    report.layouts++;
  }
}

try {
  for (const route of ['', 'portfolio/']) {
    const page = await context.newPage();
    page.on('pageerror', error => report.pageErrors.push(error.message));
    assert.equal((await page.goto(base + route)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator('[data-project]');
    assert.equal(await cards.count(), 25);
    assert.deepEqual((await cards.evaluateAll(nodes => nodes.map(n => n.dataset.project))).slice(0, 12), expected.map(([slug]) => slug));
    assert.equal(await page.locator('a a').count(), 0);
    for (const [slug, liveUrl] of expected) {
      const card = page.locator(`[data-project="${slug}"]`);
      assert.equal(await card.locator('.portfolio-card__live').getAttribute('href'), liveUrl);
      assert.equal(await card.locator('.portfolio-card__live').getAttribute('target'), '_blank');
      assert((await card.locator('.portfolio-card__main').getAttribute('href')).endsWith(slug + '/index.html'));
      assert.match(await card.locator('img').getAttribute('srcset'), /720w, .*1440w$/);
    }
    await checkLayouts(page, route || 'home');
    for (const image of await cards.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => new Promise((resolve, reject) => {
        if (image.complete) return image.naturalWidth > 0 ? resolve() : reject(new Error(image.src));
        image.onload = resolve;
        image.onerror = () => reject(new Error(image.src));
      }));
      report.loadedCardImages++;
    }
    if (!route) {
      const track = page.locator('[data-portfolio-track]');
      await track.evaluate(element => { element.scrollLeft = 0; });
      await page.waitForFunction(() => document.querySelector('[data-portfolio-prev]').disabled);
      await page.locator('[data-portfolio-next]').click();
      assert(await track.evaluate(element => element.scrollLeft > 0));
      await page.locator('[data-project="fortistis-electronics-eshop"]').scrollIntoViewIfNeeded();
      assert(await track.evaluate(element => element.scrollLeft > element.clientWidth));
      await track.evaluate(element => { element.scrollLeft = element.scrollWidth; });
      await page.waitForFunction(() => document.querySelector('[data-portfolio-next]').disabled);
      await page.locator('[data-portfolio-prev]').click();
      assert(await track.evaluate(element => element.scrollLeft < element.scrollWidth - element.clientWidth));
      await cards.first().scrollIntoViewIfNeeded();
    } else {
      for (const [filter, count] of [['commerce', 3], ['platforms', 6], ['websites', 16], ['all', 25]]) {
        await page.locator(`[data-filter="${filter}"]`).click();
        assert.equal(await page.locator('.case-card:visible').count(), count);
        assert.equal(await page.locator(`[data-filter="${filter}"]`).getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('[data-filter][aria-pressed="true"]').count(), 1);
        report.filters[filter] = count;
      }
    }
    await cards.first().locator('.portfolio-card__main').focus();
    await checkTextStates(cards.first());
    await cards.first().locator('.portfolio-card__main').focus();
    await page.keyboard.press('Tab');
    assert(await cards.first().locator('.portfolio-card__live').evaluate(element => element === document.activeElement));
    const liveUrl = expected[0][1];
    await context.route(liveUrl, route => route.fulfill({ status: 200, body: '<title>Intercepted live link</title>' }));
    const [popup] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('Enter')]);
    await popup.waitForLoadState();
    assert.equal(popup.url(), liveUrl);
    await popup.close();
    await context.unroute(liveUrl);
    report.interceptedLiveLinks++;
    if (process.argv.includes('--screenshots')) {
      if (!route) { await page.locator('[data-portfolio-track]').evaluate(element => { element.scrollLeft = 0; }); await page.locator('#portfolio').scrollIntoViewIfNeeded(); }
      else await page.locator('.portfolio-grid').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(process.env.TMPDIR || '/tmp', `redstar-featured-${route ? 'portfolio' : 'home'}.png`), animations: 'disabled' });
    }
    await page.close();
  }
  for (const [slug, liveUrl] of expected) {
    const page = await context.newPage();
    page.on('pageerror', error => report.pageErrors.push(error.message));
    const route = `portfolio/${slug}/`;
    assert.equal((await page.goto(base + route)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.portfolio-detail__live').getAttribute('href'), liveUrl);
    assert(await page.locator('.case-hero-img img').evaluate(image => image.complete && image.naturalWidth > 0));
    await checkLayouts(page, route);
    await page.close();
  }
  assert.deepEqual(report.pageErrors, []);
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
