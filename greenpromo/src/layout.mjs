import { NAV_ITEMS, SITE } from "./site-data.mjs";

const iconPaths = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  camera: '<path d="M14.5 4 16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1.5-2z"/><circle cx="12" cy="12" r="3"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h3a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3"/>',
  report: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
};

export function icon(name, className = "icon") {
  return `<svg class="${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name] ?? iconPaths.arrow}</svg>`;
}

function schema(pageUrl) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.baseUrl}#business`,
    name: SITE.name,
    url: SITE.baseUrl,
    image: `${SITE.baseUrl}images/generated/greenpromo-door-to-door.webp`,
    email: SITE.email,
    telephone: SITE.phoneHref,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Αθήνα",
      addressRegion: "Αττική",
      addressCountry: "GR",
    },
    areaServed: ["Αθήνα", "Αττική", "Πειραιάς"],
    sameAs: Object.values(SITE.social),
    mainEntityOfPage: pageUrl,
  });
}

function head({ title, description, path, image = "images/generated/greenpromo-door-to-door.webp" }) {
  const canonical = new URL(path, SITE.baseUrl).href;
  const socialImage = new URL(image, SITE.baseUrl).href;
  return `<!doctype html>
<html lang="el">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#171512">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="images/favicon-32x32.png" sizes="32x32">
  <link rel="apple-touch-icon" href="images/apple-touch-icon.png">
  <meta property="og:locale" content="el_GR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="GreenPromo">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:alt" content="GreenPromo — επαγγελματική διανομή φυλλαδίων στην Αθήνα">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${socialImage}">
  <link rel="stylesheet" href="assets/site.css">
  <script type="application/ld+json">${schema(canonical)}</script>
</head>`;
}

function header(active) {
  const items = NAV_ITEMS.map((item) => {
    const current = active === item.key ? ' aria-current="page" class="nav-link is-active"' : ' class="nav-link"';
    return `<a href="${item.href}"${current}>${item.label}</a>`;
  }).join("");
  return `<body>
  <a class="skip-link" href="#main">Μετάβαση στο περιεχόμενο</a>
  <header class="site-header" data-header>
    <div class="header-shell">
      <a class="brand" href="index.html" aria-label="GreenPromo — Αρχική">
        <img src="images/logo-black.png" alt="" width="922" height="202">
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-menu-toggle>
        <span class="sr-only">Άνοιγμα μενού</span>
        <span></span><span></span><span></span>
      </button>
      <nav class="primary-nav" id="primary-nav" aria-label="Κύρια πλοήγηση" data-nav>
        <div class="nav-links">${items}</div>
        <a class="button button-dark nav-cta" href="quote.html">Ζητήστε προσφορά ${icon("arrow", "button-icon")}</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="shell footer-main">
      <div class="footer-intro">
        <a class="footer-brand" href="index.html" aria-label="GreenPromo — Αρχική">
          <img src="images/logo-white.png" alt="" width="922" height="202">
        </a>
        <p>Επαγγελματική διανομή φυλλαδίων στην Αθήνα και την Αττική, με φωτογραφική απόδειξη και σαφή αναφορά.</p>
        <a class="footer-contact" href="tel:${SITE.phoneHref}">${icon("phone")} ${SITE.phoneDisplay}</a>
        <a class="footer-contact" href="mailto:${SITE.email}">${icon("mail")} ${SITE.email}</a>
      </div>
      <div class="footer-column">
        <h2>Πλοήγηση</h2>
        <a href="services.html">Υπηρεσίες</a>
        <a href="packages.html">Πακέτα</a>
        <a href="about.html">Σχετικά</a>
        <a href="faqs.html">Συχνές ερωτήσεις</a>
      </div>
      <div class="footer-column">
        <h2>Επικοινωνία</h2>
        <a href="quote.html">Δωρεάν προσφορά</a>
        <a href="contact.html">Στοιχεία επικοινωνίας</a>
        <a href="privacy-policy.html">Πολιτική απορρήτου</a>
        <span>${SITE.location}</span>
      </div>
      <div class="footer-column">
        <h2>Κοινωνικά δίκτυα</h2>
        <a href="${SITE.social.facebook}" target="_blank" rel="noopener noreferrer">Facebook ↗</a>
        <a href="${SITE.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        <a href="${SITE.social.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a href="${SITE.social.pinterest}" target="_blank" rel="noopener noreferrer">Pinterest ↗</a>
      </div>
    </div>
    <div class="shell footer-bottom">
      <p>© <span data-year></span> GreenPromo. Με επιφύλαξη παντός δικαιώματος.</p>
      <p>Αθήνα · Αττική · Πειραιάς</p>
    </div>
  </footer>
  <script src="assets/site.js" defer></script>
</body>
</html>`;
}

export function renderPage({ title, description, path, active, body, image }) {
  return `${head({ title, description, path, image })}
${header(active)}
<main id="main">${body}</main>
${footer()}`;
}

export function pageHero({ eyebrow, title, text, aside = "", className = "" }) {
  return `<section class="page-hero ${className}">
    <div class="shell page-hero-grid">
      <div class="page-hero-copy reveal">
        <p class="eyebrow light">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="page-lead">${text}</p>
      </div>
      ${aside}
    </div>
  </section>`;
}

export function ctaBand({ title = "Έτοιμοι να χαρτογραφήσουμε την καμπάνια σας;", text = "Στείλτε ποσότητα, περιοχές και χρονοδιάγραμμα. Θα απαντήσουμε με σαφή πρόταση εντός 24 ωρών." } = {}) {
  return `<section class="cta-band section-pad">
    <div class="shell cta-panel reveal">
      <div>
        <p class="eyebrow light">Επόμενο βήμα</p>
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
      <div class="cta-actions">
        <a class="button button-light" href="quote.html">Ζητήστε προσφορά ${icon("arrow", "button-icon")}</a>
        <a class="text-link light" href="https://wa.me/${SITE.whatsappHref}" target="_blank" rel="noopener noreferrer">WhatsApp ${SITE.whatsappDisplay} ↗</a>
      </div>
    </div>
  </section>`;
}
