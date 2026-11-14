// Start serve-local.sh and the CRM's scripts/serve-quotes-local.sh first.
// Browser requests use the isolated local SQLite preview and fake mail transport.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:8045';
const base = origin + '/redstar/';
const log = fs.readFileSync('/tmp/redstar-quote-preview.log', 'utf8');
const database = log.match(/Isolated quote preview database: (.+)/)?.[1];
assert(database?.startsWith('/tmp/redstar-quotes-'), 'Use the isolated CRM preview launcher.');
// Reset only the disposable preview's rate-limit cache between browser runs.
execFileSync('python3', ['-c', "import sqlite3,sys;c=sqlite3.connect(sys.argv[1]);c.execute('delete from cache');c.execute('delete from cache_locks');c.commit()", database]);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-dev-shm-usage', '--disable-features=BackForwardCache'] });
const context = await browser.newContext();
// Keep the repeated functional/navigation sweep light on shared local hardware.
// Real-image visual captures are a separate, optional run.
const screenshots = process.argv.includes('--screenshots');
if (!screenshots) await context.route('**/*', route => route.request().resourceType() === 'image' ? route.abort() : route.continue());
await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.fulfill({ status: 200, body: '' }));
const errors = [];
let page;
async function visit(route, width = 1440) {
  if (page) await page.close();
  page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(base + route);
}
const report = { layouts: 0, banners: 0, formStates: [], errors };

try {
  await visit('');
  assert.equal(await page.locator('#featured-project').count(), 1);
  assert.equal(await page.locator('#enquiry-banner').count(), 1);
  assert.equal(await page.locator('#payment-methods').count(), 1);
  assert.equal(await page.locator('#rsQuoteOverlay').count(), 0);
  await page.locator('[data-consent-reject]').click();
  for (const [index, expected] of [[0, 'https://calendar.app.google/'], [2, 'https://wa.me/']]) {
    await context.route(expected + '**', route => route.fulfill({ status: 200, body: 'External contact link intercepted locally.' }));
    const [popup] = await Promise.all([context.waitForEvent('page'), page.locator('#enquiry-banner a').nth(index).click()]);
    await popup.waitForLoadState();
    assert(popup.url().startsWith(expected));
    await popup.close();
  }
  await page.locator('#featured-project a').click();
  await page.waitForURL('**/portfolio/helppoint-volunteer-platform/index.html');
  for (const route of ['', 'contact/', 'services/custom-web-apps/']) {
    for (const width of [280, 320, 414, 768, 1440]) {
      await visit(route, width);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert(overflow <= 1, `${route}@${width}: overflow ${overflow}`);
      report.layouts++;
    }
  }
  for (const route of ['services/', 'portfolio/', 'about/', 'blog/', 'blog/helppoint-volunteer-platform/']) {
    await visit(route);
    const banner = page.locator('#enquiry-banner');
    assert.equal(await banner.count(), 1);
    assert.match(await banner.locator('a').nth(0).getAttribute('href'), /^https:\/\/calendar\.app\.google\//);
    assert.match(await banner.locator('a').nth(1).getAttribute('href'), /contact\/index\.html.*#quote-request$/);
    assert.equal(await banner.locator('a').nth(2).getAttribute('href'), 'https://wa.me/306989442438');
    report.banners++;
  }
  await visit('services/custom-web-apps/');
  await page.locator('#enquiry-banner .rs-banner__button--secondary').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/contact/index.html?service=*#quote-request');
  assert((await page.locator('#quote-service').inputValue()).length > 0);
  await page.locator('#quote-name').fill('Local browser enquiry');
  await page.locator('#quote-phone').fill('+30 690 000 0000');
  await page.locator('#quote-email').fill('browser@example.test');
  await page.locator('#quote-message').fill('Local verification, no actual email delivery.');
  let mode = 'validation';
  let serverGate;
  let releaseServer;
  const payloads = [];
  await page.route('**/api/public/quote-requests', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    payloads.push(route.request().postDataJSON());
    const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin };
    if (mode === 'validation') return route.fulfill({ status: 422, headers, body: JSON.stringify({ errors: { phone: ['Ελέγξτε το τηλέφωνό σας.'] } }) });
    if (mode === 'server') {
      await serverGate;
      return route.fulfill({ status: 500, headers, body: '{}' });
    }
    if (mode === 'throttle') return route.fulfill({ status: 429, headers, body: '{}' });
    if (mode === 'network') return route.abort('failed');
    if (mode === 'lost-response') { await route.fetch(); return route.abort('failed'); }
    return route.continue();
  });
  const submit = page.locator('#quote-request-form button[type="submit"]');
  const error = page.locator('[data-quote-error]');
  await submit.click();
  await page.locator('#quote-phone[aria-invalid="true"]').waitFor();
  assert.equal(await page.locator('#quote-name').inputValue(), 'Local browser enquiry');
  assert.equal(await page.locator('#quote-phone').evaluate(el => el === document.activeElement), true);
  report.formStates.push('validation');
  await page.locator('.rs-quote__panel').screenshot({ path: '/tmp/redstar-quote-error.png' });
  mode = 'server';
  serverGate = new Promise(resolve => { releaseServer = resolve; });
  await submit.click();
  await page.waitForFunction(() => document.querySelector('#quote-request-form').getAttribute('aria-busy') === 'true');
  assert.equal(await submit.isDisabled(), true);
  assert.equal(await page.locator('.rs-quote__spinner').isVisible(), true);
  await page.locator('.rs-quote__panel').screenshot({ path: '/tmp/redstar-quote-loading.png' });
  releaseServer();
  await page.waitForFunction(() => !document.querySelector('#quote-request-form').hasAttribute('aria-busy'));
  assert.equal(await error.isVisible(), true);
  report.formStates.push('loading', 'server failure');
  mode = 'throttle'; await submit.click();
  await page.getByRole('alert').filter({ hasText: 'αρκετές προσπάθειες' }).waitFor();
  report.formStates.push('throttled');
  mode = 'network'; await submit.click();
  await page.getByRole('alert').filter({ hasText: 'σύνδεσή' }).waitFor();
  report.formStates.push('network failure');
  mode = 'lost-response'; await submit.click();
  await page.waitForFunction(() => !document.querySelector('#quote-request-form').hasAttribute('aria-busy'));
  assert.equal(await page.locator('[data-quote-success]').isVisible(), false);
  mode = 'success'; await submit.focus(); await page.keyboard.press('Enter');
  await page.locator('[data-quote-success]:not([hidden])').waitFor();
  assert.equal(new Set(payloads.map(payload => payload.request_id)).size, 1);
  assert.equal(await page.locator('[data-quote-success]').evaluate(el => el === document.activeElement), true);
  assert.equal(await page.locator('#quote-request-form').isVisible(), false);
  await page.locator('.rs-quote__panel').screenshot({ path: '/tmp/redstar-quote-success.png' });
  report.formStates.push('saved', 'retry idempotency', 'success focus');
  const counts = JSON.parse(execFileSync('python3', ['-c', `import sqlite3,json,sys
c=sqlite3.connect(sys.argv[1]);leads=c.execute('select id from clients where public_inquiry_id=?',(sys.argv[2],)).fetchall()
notifications=[json.loads(row[0]) for row in c.execute('select data from notifications')]
count=sum(any(action.get('url','').rstrip('/').endswith('/clients/'+str(leads[0][0])) for action in item.get('actions',[])) for item in notifications) if leads else 0
print(json.dumps({'leads':len(leads),'notifications':count}))`, database, payloads[0].request_id], { encoding: 'utf8' }));
  assert.equal(counts.leads, 1);
  assert.equal(counts.notifications, 1);
  report.saved = counts;
  if (screenshots) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base);
    await page.locator('#featured-project').screenshot({ path: '/tmp/redstar-banner-project.png' });
    await page.locator('#enquiry-banner').screenshot({ path: '/tmp/redstar-banner-enquiry.png' });
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.locator('#enquiry-banner').screenshot({ path: '/tmp/redstar-banner-mobile.png' });
    await page.goto(base + 'contact/#quote-request');
    await page.locator('#quote-request').screenshot({ path: '/tmp/redstar-quote-mobile.png' });
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync('/tmp/redstar-banner-verification.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
