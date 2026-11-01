import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pages, redirects } from "../src/pages.mjs";
import { SITE } from "../src/site-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

for (const [filename, html] of Object.entries(pages)) {
  await writeFile(resolve(root, filename), html, "utf8");
}

for (const [filename, target] of Object.entries(redirects)) {
  const targetUrl = new URL(target, SITE.baseUrl).href;
  const html = `<!doctype html><html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${targetUrl}"><meta name="robots" content="noindex, follow"><title>Μεταφορά… | GreenPromo</title></head><body><p>Η σελίδα μεταφέρθηκε. <a href="${target}">Συνέχεια</a>.</p></body></html>`;
  await writeFile(resolve(root, filename), html, "utf8");
}

const sitemapEntries = ["", "services.html", "packages.html", "about.html", "quote.html", "contact.html", "faqs.html", "privacy-policy.html"];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map((path) => `  <url><loc>${new URL(path, SITE.baseUrl).href}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(resolve(root, "sitemap.xml"), sitemap, "utf8");
await writeFile(resolve(root, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", SITE.baseUrl).href}\n`, "utf8");

await mkdir(resolve(root, "dist"), { recursive: true });
console.log(`Built ${Object.keys(pages).length} pages, ${Object.keys(redirects).length} redirects, sitemap.xml and robots.txt.`);
