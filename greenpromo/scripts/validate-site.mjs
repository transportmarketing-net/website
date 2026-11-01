import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html", "services.html", "packages.html", "about.html", "quote.html", "contact.html", "faqs.html", "privacy-policy.html"];
const errors = [];
const forbidden = /habitline|unifato|greenpromo\.gr|G-6Q4WB74HM3|mobile app|app store|play store|\$\d+/i;

for (const filename of pages) {
  const html = await readFile(resolve(root, filename), "utf8");
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) errors.push(`${filename}: expected one h1, found ${h1Count}`);
  if (!/<html lang="el">/.test(html)) errors.push(`${filename}: missing Greek language declaration`);
  if (!/<link rel="canonical" href="https:\/\/transportmarketing\.net\/greenpromo\//.test(html)) errors.push(`${filename}: invalid canonical URL`);
  if (!/<a class="skip-link" href="#main">/.test(html) || !/<main id="main">/.test(html)) errors.push(`${filename}: missing skip navigation or main landmark`);
  if (forbidden.test(html)) errors.push(`${filename}: contains a forbidden legacy term`);

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(match[0])) errors.push(`${filename}: image without alt attribute`);
    const src = match[0].match(/\ssrc="([^"]+)"/)?.[1];
    if (src && !src.startsWith("http")) {
      try { await access(resolve(root, src)); } catch { errors.push(`${filename}: missing image ${src}`); }
    }
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|#)/.test(href)) continue;
    const [target] = href.split(/[?#]/);
    if (!target) continue;
    try { await access(resolve(root, target)); } catch { errors.push(`${filename}: missing link target ${target}`); }
  }

  for (const input of html.matchAll(/<(?:input|select|textarea)\b[^>]*\sid="([^"]+)"[^>]*>/g)) {
    if (!new RegExp(`<label[^>]*for="${input[1]}"`).test(html)) errors.push(`${filename}: field #${input[1]} has no explicit label`);
  }

  for (const button of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const visibleText = button[2].replace(/<[^>]+>/g, "").trim();
    if (!visibleText && !/aria-label="[^"]+"/.test(button[1])) errors.push(`${filename}: button without accessible name`);
  }

  for (const external of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)) {
    if (!/rel="[^"]*noopener/.test(external[1])) errors.push(`${filename}: target=_blank link without noopener`);
  }
}

const contactCorpus = await Promise.all(pages.map((filename) => readFile(resolve(root, filename), "utf8")));
const joined = contactCorpus.join("\n");
for (const required of ["+302103007716", "306989442438", "info@greenpromo.marketing"]) {
  if (!joined.includes(required)) errors.push(`missing required contact value: ${required}`);
}

for (const filename of ["index2.html", "download.html", "pricing.html", "waitlist.html"]) {
  const html = await readFile(resolve(root, filename), "utf8");
  if (!/http-equiv="refresh"/.test(html) || !/noindex, follow/.test(html)) errors.push(`${filename}: incomplete redirect stub`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Static validation passed for ${pages.length} canonical pages and 4 redirects.`);
}
