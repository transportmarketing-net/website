import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const results = {};
for (const [name, viewport] of Object.entries({
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
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto("http://127.0.0.1:9000/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  const metrics = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const images = [...document.images];
    return {
      title: document.title,
      language: document.documentElement.lang,
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      sections: document.querySelectorAll("section").length,
      images: images.length,
      deferredImages: images.filter((image) => !image.complete).map((image) => image.src),
      brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      greenPromoImages: images.filter((image) => image.src.includes("/images/greenpromo/")).length,
      remainingHabitCopy: /\b(habit|routine|streak|download for iphone|get it on android)\b/i.test(bodyText),
      hasHeroCopy: bodyText.includes("Η διανομή σας.") && bodyText.includes("Τεκμηριωμένη."),
      hasFooterCopy: bodyText.includes("© 2026 GreenPromo"),
    };
  });
  await page.screenshot({ path: `/tmp/greenpromo-mirror-${name}-full.png`, fullPage: true });
  results[name] = { ...metrics, consoleErrors, failedResponses };
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
