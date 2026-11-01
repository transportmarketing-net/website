import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.SITE_URL || "http://127.0.0.1:8129/";
const pages = [
  "index.html",
  "services.html",
  "packages.html",
  "about.html",
  "quote.html",
  "contact.html",
  "faqs.html",
  "privacy-policy.html",
  "index2.html",
  "download.html",
  "pricing.html",
  "waitlist.html",
];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 320, height: 800 },
];
const outputDir = "/tmp/greenpromo-qa";
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/google-chrome" });
const failures = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  for (const path of pages) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("requestfailed", (request) => {
      const url = request.url();
      if (url.startsWith(base)) errors.push(`requestfailed: ${url}`);
    });

    const response = await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += Math.max(420, window.innerHeight * 0.7)) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(120);
    const diagnostics = await page.evaluate(() => ({
      title: document.title,
      h1Count: document.querySelectorAll("h1").length,
      imageFailures: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
      overflowElements: [...document.querySelectorAll("body *")].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > window.innerWidth + 2 || rect.left < -2;
      }).slice(0, 10).map((element) => `${element.tagName.toLowerCase()}.${element.className}`),
      lang: document.documentElement.lang,
    }));

    if (!response?.ok()) errors.push(`status: ${response?.status()}`);
    if (!["index2.html", "download.html", "pricing.html", "waitlist.html"].includes(path) && diagnostics.h1Count !== 1) errors.push(`h1 count: ${diagnostics.h1Count}`);
    if (!diagnostics.title) errors.push("missing title");
    if (diagnostics.lang !== "el") errors.push(`lang: ${diagnostics.lang || "missing"}`);
    if (diagnostics.imageFailures.length) errors.push(`broken images: ${diagnostics.imageFailures.join(", ")}`);
    if (diagnostics.overflow > 2) errors.push(`horizontal overflow: ${diagnostics.overflow}px (${diagnostics.overflowElements.join(", ")})`);

    if (errors.length) failures.push({ viewport: viewport.name, path, errors });

    const shouldScreenshot = (path === "index.html" && ["desktop", "mobile"].includes(viewport.name)) ||
      (viewport.name === "desktop" && ["services.html", "packages.html", "quote.html"].includes(path));
    if (shouldScreenshot) {
      await page.screenshot({ path: `${outputDir}/${path.replace(".html", "")}-${viewport.name}.png`, fullPage: true });
    }
    await page.close();
  }

  if (viewport.name === "mobile") {
    const menuPage = await context.newPage();
    await menuPage.goto(new URL("index.html", base).href, { waitUntil: "networkidle" });
    await menuPage.locator("[data-menu-toggle]").click();
    const menuOpen = await menuPage.locator("[data-menu-toggle]").getAttribute("aria-expanded");
    if (menuOpen !== "true") failures.push({ viewport: "mobile", path: "index.html", errors: ["mobile menu did not open"] });
    await menuPage.screenshot({ path: `${outputDir}/mobile-menu.png` });
    await menuPage.close();
  }

  await context.close();
}

const formContext = await browser.newContext({ viewport: { width: 1200, height: 900 } });
const formPage = await formContext.newPage();
await formPage.addInitScript(() => {
  window.open = (url) => {
    window.__openedUrl = url;
    return null;
  };
});
await formPage.goto(new URL("quote.html?package=standard", base).href, { waitUntil: "networkidle" });
await formPage.fill("#name", "Δοκιμή GreenPromo");
await formPage.fill("#phone", "6900000000");
await formPage.fill("#zones", "Παγκράτι");
await formPage.selectOption("#quantity", { label: "2.000–5.000" });
await formPage.check('input[name="consent"]');
await formPage.click('[data-channel="whatsapp"]');
const openedUrl = await formPage.evaluate(() => window.__openedUrl || "");
if (!openedUrl.startsWith("https://wa.me/306989442438?text=") || !openedUrl.includes("standard") && !decodeURIComponent(openedUrl).includes("Standard")) {
  failures.push({ viewport: "desktop", path: "quote.html", errors: [`WhatsApp form URL invalid: ${openedUrl}`] });
}
await formContext.close();

await browser.close();

if (failures.length) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exitCode = 1;
} else {
  console.log(`QA passed for ${pages.length} routes at ${viewports.length} viewports. Screenshots: ${outputDir}`);
}
