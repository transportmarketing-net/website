import { chromium } from "playwright";
import fs from "node:fs/promises";

const pages = [
  "index.html",
  "about.html",
  "pricing.html",
  "faqs.html",
  "contact.html",
  "waitlist.html",
  "download.html",
  "privacy-policy.html",
];

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

await fs.mkdir("/tmp/greenpromo-page-audit", { recursive: true });
const report = {};

for (const file of pages) {
  report[file] = {};
  for (const [mode, viewport] of Object.entries({
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844 },
  })) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    const failedResponses = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`http://127.0.0.1:9000/${file}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const metrics = await page.evaluate(() => {
      const text = document.body.innerText;
      const images = [...document.images];
      return {
        title: document.title,
        bodyPreview: text.replace(/\s+/g, " ").slice(0, 500),
        documentHeight: document.documentElement.scrollHeight,
        documentWidth: document.documentElement.scrollWidth,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        sections: document.querySelectorAll("section").length,
        images: images.length,
        brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
        residualSaasCopy: /\b(habit|routine|streak|app store|android|iphone|download the app|saas|mobile app)\b/i.test(text),
        englishWordCount: (text.match(/\b[A-Za-z]{4,}\b/g) || []).length,
      };
    });
    const stem = file.replace(".html", "");
    await page.screenshot({ path: `/tmp/greenpromo-page-audit/${stem}-${mode}-top.png` });
    await page.screenshot({ path: `/tmp/greenpromo-page-audit/${stem}-${mode}-full.png`, fullPage: true });
    report[file][mode] = { ...metrics, consoleErrors, failedResponses };
    await page.close();
  }
}

await browser.close();
await fs.writeFile("/tmp/greenpromo-page-audit/report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
