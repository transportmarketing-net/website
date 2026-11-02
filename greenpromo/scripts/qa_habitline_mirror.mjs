import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const results = {};
for (const [name, viewport] of Object.entries({
  phone320: { width: 320, height: 800 },
  mobile: { width: 390, height: 844 },
  tablet768: { width: 768, height: 1024 },
  tablet935: { width: 935, height: 836 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
  wide1787: { width: 1787, height: 800 },
  wide1920: { width: 1920, height: 1080 },
})) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
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
      bodyWidth: document.body.scrollWidth,
      overflowPx: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
      documentHeight: document.documentElement.scrollHeight,
      horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > window.innerWidth + 2,
      overflowElements: [...document.querySelectorAll("body *")].filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return style.position !== "fixed" && (rect.right > window.innerWidth + 2 || rect.left < -2);
      }).slice(0, 12).map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}.${[...element.classList].slice(0, 4).join(".")}`,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        };
      }),
      sections: document.querySelectorAll("section").length,
      images: images.length,
      deferredImages: images.filter((image) => !image.complete).map((image) => image.src),
      brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      greenPromoImages: images.filter((image) => image.src.includes("/images/greenpromo/")).length,
      remainingHabitCopy: /\b(habit|routine|streak|download for iphone|get it on android)\b/i.test(bodyText),
      hasHeroCopy: bodyText.includes("Η διανομή σας.") && bodyText.includes("Τεκμηριωμένη."),
      hasFooterCopy: bodyText.includes("© 2026 GreenPromo"),
      heroImage: document.querySelector(".gp-hero > img")?.getAttribute("src"),
      stylesheetLoaded: [...document.styleSheets].some((sheet) => sheet.href?.includes("greenpromo-remediation.css")),
    };
  });
  const anchorOffsets = {};
  for (const id of ["features", "usecase", "metrics", "smart-assist"]) {
    await page.evaluate((anchor) => {
      location.hash = anchor;
      document.getElementById(anchor)?.scrollIntoView({ block: "start" });
    }, id);
    await page.waitForTimeout(100);
    anchorOffsets[id] = await page.evaluate((anchor) => ({
      top: Math.round(document.getElementById(anchor)?.getBoundingClientRect().top || 0),
      navBottom: Math.round(document.querySelector(".nav-sticky")?.getBoundingClientRect().bottom || 0),
    }), id);
  }
  await page.evaluate(() => { location.hash = ""; window.scrollTo(0, 0); });
  await page.screenshot({ path: `/tmp/greenpromo-mirror-${name}-full.png`, fullPage: true });
  if (["mobile", "tablet935", "desktop", "wide1787"].includes(name)) {
    for (const [label, selector] of [
      ["hero", ".gp-hero"],
      ["intro", ".gp-intro"],
      ["features", "#features"],
      ["documentation", "#smart-assist"],
    ]) {
      await page.locator(selector).screenshot({ path: `/tmp/greenpromo-mirror-${name}-${label}.png` });
    }
  }
  results[name] = { ...metrics, anchorOffsets, consoleErrors, failedResponses };
  await page.close();
}

await browser.close();

const failures = Object.entries(results).filter(([, result]) => (
  result.overflowPx > 2 ||
  result.brokenImages.length > 0 ||
  result.consoleErrors.length > 0 ||
  result.failedResponses.length > 0 ||
  !result.stylesheetLoaded ||
  result.heroImage !== "images/greenpromo/hero-background-v2.webp" ||
  Object.values(result.anchorOffsets).some(({ top, navBottom }) => top < navBottom)
));

console.log(JSON.stringify(results, null, 2));
if (failures.length) process.exitCode = 1;
