// Local browser regression check. Analytics requests are intercepted, never sent.
// Start the site first, then: node scripts/verify-consent.mjs [base-url]
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = (process.argv[2] || 'http://127.0.0.1:8045/redstar/').replace(/\/?$/, '/');
const key = 'redstar-consent-v1';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let checks = 0;

async function visit(route, stored, blocked = false) {
  const context = await browser.newContext();
  const analytics = [];
  await context.route(/googletagmanager\.com|google-analytics\.com/, route => {
    analytics.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  });
  if (blocked) {
    await context.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
      Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
    });
  } else if (stored !== undefined) {
    await context.addInitScript(({ key, stored }) => localStorage.setItem(key, stored), { key, stored });
  }
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + route, { waitUntil: 'load' });
  return { context, page, analytics, errors };
}

try {
  for (const route of ['', 'terms/', 'privacy/', 'cookies/', 'en/terms/', 'en/privacy/', 'en/cookies/']) {
    const { context, page, analytics, errors } = await visit(route);
    const banner = page.locator('.cookie-consent');
    assert.equal(await banner.isVisible(), true, route + ': banner appears');
    assert.equal(analytics.length, 0, route + ': no analytics before consent');
    if (route.startsWith('en/')) {
      assert.equal(await page.locator('[data-consent-accept]').innerText(), 'Accept');
      assert.equal(await page.locator('[data-consent-reject]').innerText(), 'Necessary only');
    }
    await page.locator('[data-consent-reject]').click();
    assert.equal(await banner.isVisible(), false, route + ': rejecting hides banner');
    assert.equal(await page.evaluate(key => localStorage.getItem(key), key), 'rejected');
    await page.reload({ waitUntil: 'load' });
    assert.equal(await banner.isVisible(), false, route + ': rejection persists');
    assert.equal(analytics.length, 0, route + ': rejection blocks analytics');
    assert.deepEqual(errors, [], route + ': no JS errors');
    await context.close();
    checks++;
  }

  const accepted = await visit('');
  await accepted.page.locator('[data-consent-accept]').focus();
  await accepted.page.keyboard.press('Enter');
  await accepted.page.waitForFunction(() => !!document.querySelector('script[src*="googletagmanager"]'));
  assert.equal(await accepted.page.locator('.cookie-consent').isVisible(), false);
  assert.equal(await accepted.page.locator('script[src*="googletagmanager"]').count(), 1);
  await accepted.page.goto(base + 'en/privacy/', { waitUntil: 'load' });
  assert.equal(await accepted.page.locator('.cookie-consent').isVisible(), false);
  assert.equal(await accepted.page.locator('script[src*="googletagmanager"]').count(), 1);
  assert.deepEqual(accepted.errors, []);
  await accepted.context.close();
  checks++;

  for (const stored of ['accepted', 'rejected', 'invalid']) {
    const { context, page, errors } = await visit('', stored);
    assert.equal(await page.locator('.cookie-consent').isVisible(), stored === 'invalid');
    assert.equal(await page.locator('script[src*="googletagmanager"]').count(), stored === 'accepted' ? 1 : 0);
    assert.deepEqual(errors, []);
    await context.close();
    checks++;
  }

  for (const choice of ['accept', 'reject']) {
    const { context, page, errors } = await visit('', undefined, true);
    await page.locator(`[data-consent-${choice}]`).click();
    assert.equal(await page.locator('.cookie-consent').isVisible(), false);
    assert.equal(await page.locator('script[src*="googletagmanager"]').count(), choice === 'accept' ? 1 : 0);
    assert.deepEqual(errors, []);
    await context.close();
    checks++;
  }
  console.log(`Consent: ${checks}/${checks} scenarios passed (all analytics intercepted).`);
} finally {
  await browser.close();
}
