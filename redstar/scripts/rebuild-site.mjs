/**
 * RedStar site builder - Oct 20 visual language
 * Generates all pages using .rs-* class naming, --rs-* variables,
 * warm crimson palette, Inter+Manrope fonts, 8px radius, sticky white header.
 *
 * Content data pulled from 960f966 rebuild + portfolio JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import { bankTransferSection, paymentMethods } from './payment-details.mjs';
import { enquiryBanner, quoteRequestForm, refreshHomepageBanners } from './banners.mjs';

const root = process.cwd();
// Refresh only the payment-brand slot in the manually maintained homepage.
const homepagePath = path.join(root, 'index.html');
if (fs.existsSync(homepagePath)) {
  const homepage = fs.readFileSync(homepagePath, 'utf8');
  const updated = refreshHomepageBanners(homepage.replace(/<section class="rs-payments" id="payment-methods"[\s\S]*?<\/section>/, paymentMethods()));
  if (updated !== homepage) fs.writeFileSync(homepagePath, updated);
}
const projects = JSON.parse(fs.readFileSync(path.join(root, 'sitepad-data/portfolio-projects.json'), 'utf8'));
const canonicalRoot = 'https://transportmarketing.net/redstar';
const bookingUrl = 'https://calendar.app.google/BivggDamyF6eLgFb6';
const nebula = 'sitepad-data/uploads/2026/05/redstar-space-crimson-nebula.jpg';

/* ── SVG icons (inline, no emoji) ── */
const checkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const arrowSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const externalSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"><path d="M14 5h5v5M19 5l-9 9M19 13v6H5V5h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ── Helpers ── */
function write(relativePath, content) {
  const output = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const normalized = content.replaceAll('\u2014', '-').replaceAll('\u2013', '-');
  fs.writeFileSync(output, normalized.trimStart());
}

function esc(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function cleanText(value = '') {
  return String(value).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

function normalizeEntities(value = '') {
  let n = String(value);
  for (let i = 0; i < 4; i++) {
    const next = n.replace(/&amp;(amp|quot|#39|nbsp|lt|gt);/gi, '&$1;');
    if (next === n) break;
    n = next;
  }
  return n;
}

/* ── Template: <head> ── */
function head({ title, description, route = '/', prefix = '', robots = 'index, follow, max-image-preview:large', type = 'website' }) {
  const canonical = `${canonicalRoot}${route === '/' ? '/' : route}`;
  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="${prefix}sitepad-data/brand/favicons/favicon.svg">
  <meta name="theme-color" content="#2b0a0f">
  <meta property="og:locale" content="el_GR">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="RedStar Digital Agency">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${canonicalRoot}/${nebula}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&subset=greek">
  <link rel="stylesheet" href="${prefix}assets/css/redstar.css">
  <script src="${prefix}assets/js/redstar.js" defer></script>
  ${route === '/contact/' ? `<script src="${prefix}assets/js/quote-request.js" defer></script>` : ''}
</head>`;
}

/* ── Template: header ── */
function rsHeader(prefix = '', active = '') {
  const cur = (key) => active === key ? ' class="is-active"' : '';
  return `<body>
  <a class="skip-link" href="#main-content">Μεταβαση στο περιεχομενο</a>
  <header class="rs-header">
    <a class="rs-logo" href="${prefix}index.html" aria-label="RedStar, αρχικη">
      <img src="${prefix}sitepad-data/brand/logos/logo-full-color-light-bg.svg" alt="RedStar Digital Agency">
    </a>
    <nav class="rs-nav" aria-label="Κύρια πλοήγηση">
      <a href="${prefix}services/index.html"${cur('services')}>Υπηρεσίες</a>
      <a href="${prefix}portfolio/index.html"${cur('portfolio')}>Portfolio</a>
      <a href="${prefix}about/index.html"${cur('about')}>Σχετικά</a>
      <a href="${prefix}contact/index.html"${cur('contact')}>Επικοινωνία</a>
      <a href="${prefix}blog/index.html"${cur('blog')}>Blog</a>
    </nav>
    <button class="rs-hamburger" type="button" aria-label="Ανοιγμα μενου" aria-expanded="false">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
  </header>
  <div class="rs-drawer" role="dialog" aria-modal="true" aria-label="Μενου">
    <button class="rs-drawer__scrim" type="button" aria-label="Κλεισιμο μενου"></button>
    <div class="rs-drawer__panel">
      <div class="rs-drawer__top">
        <a class="rs-logo" href="${prefix}index.html"><img src="${prefix}sitepad-data/brand/logos/logo-full-color-light-bg.svg" alt="RedStar" style="width:150px"></a>
        <button class="rs-drawer__close" type="button" aria-label="Κλεισιμο μενου">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>
      <nav class="rs-drawer__nav">
        <a href="${prefix}services/index.html">Υπηρεσίες</a>
        <a href="${prefix}portfolio/index.html">Portfolio</a>
        <a href="${prefix}about/index.html">Σχετικά</a>
        <a href="${prefix}contact/index.html">Επικοινωνία</a>
        <a href="${prefix}blog/index.html">Blog</a>
      </nav>
      <div class="rs-drawer__footer">
        <a class="rs-button" href="${bookingUrl}" target="_blank" rel="noopener">Κλεισε κληση ${externalSvg}</a>
      </div>
    </div>
  </div>`;
}

/* ── Template: hero ── */
function rsHero({ eyebrow, title, lead, prefix = '', short = false }) {
  return `
  <section class="rs-hero${short ? ' rs-hero--short' : ''}">
    <div class="rs-shell">
      ${eyebrow ? `<p class="rs-eyebrow">${eyebrow}</p>` : ''}
      <h1>${title}</h1>
      ${lead ? `<p class="rs-lead">${lead}</p>` : ''}
    </div>
  </section>`;
}

/* ── Template: footer ── */
function rsFooter(prefix = '') {
  return `
  <footer class="rs-footer">
    <div class="rs-footer__intro">
      <a class="rs-logo" href="${prefix}index.html"><img src="${prefix}sitepad-data/brand/logos/logo-full-color-dark-bg.svg" alt="RedStar" style="width:160px"></a>
      <p>Ιστοσελιδες και εργαλεια για επιχειρησεις που θελουν καθαρη δουλεια και αμεση συνεργασια.</p>
    </div>
    <nav>
      <h3>Υπηρεσιες</h3>
      <a href="${prefix}services/website-development/index.html">Ιστοσελιδες</a>
      <a href="${prefix}services/eshop-development/index.html">E-Shop</a>
      <a href="${prefix}services/custom-web-apps/index.html">Εφαρμογες</a>
      <a href="${prefix}services/index.html">Ολες οι υπηρεσιες</a>
    </nav>
    <nav>
      <h3>RedStar</h3>
      <a href="${prefix}portfolio/index.html">Εργα</a>
      <a href="${prefix}about/index.html">Σχετικα</a>
      <a href="${prefix}blog/index.html">Blog</a>
      <a href="${prefix}contact/index.html">Επικοινωνια</a>
    </nav>
    <address>
      <h3>Στοιχεια</h3>
      <strong>Alexandros Kourtis</strong>
      <span>Ξενοκλεους 25, Αθηνα</span>
      <a href="mailto:akourtisdev@gmail.com">akourtisdev@gmail.com</a>
      <a href="tel:+306989442438">+30 698 944 2438</a>
      <span>ΑΦΜ: 153468535</span>
    </address>
    <div class="rs-footer__bottom">
      <span>&copy; <span data-year>2026</span> RedStar.</span>
      <div class="rs-footer__legal">
        <a href="${prefix}privacy/index.html">Απορρητο</a>
        <a href="${prefix}terms/index.html">Οροι</a>
        <a href="${prefix}cookies/index.html">Cookies</a>
      </div>
    </div>
  </footer>
  <div class="cookie-consent" hidden>
    <p>Χρησιμοποιουμε προαιρετικα στατιστικα για να βλεπουμε τι βοηθα. Δεν ξεκινουν χωρις επιλογη.</p>
    <div class="cookie-consent__actions">
      <button class="rs-button" type="button" data-consent-accept>Αποδοχη</button>
      <button class="rs-button rs-button--outline" type="button" data-consent-reject>Μονο απαραιτητα</button>
    </div>
  </div>
</body>
</html>`;
}

/* ── Template: CTA banner ── */
function ctaBanner(prefix = '', service = '') {
  return enquiryBanner(prefix, service);
}

/* ── Template: outcome list ── */
function outcomeList(items) {
  return `<ul class="outcome-list">${items.map(item => `<li>${checkSvg}<span>${esc(item)}</span></li>`).join('')}</ul>`;
}

/* ── Assemble page ── */
function page({ title, description, route, prefix = '', active = '', body, robots, type }) {
  return `${head({ title, description, route, prefix, robots, type })}
${rsHeader(prefix, active)}
  <main id="main-content">${body}
  </main>
${rsFooter(prefix)}`;
}


/* ═══════════════════════════════════════════
   SERVICE DATA (10 services)
   ═══════════════════════════════════════════ */

const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));

const services = [
  {
    slug: 'website-development', meta: 'Web Development', label: 'Κατασκευη Ιστοσελιδων',
    desc: 'Custom websites με responsive σχεδιασμο, SEO, admin panel και ταχυτητα. Απευθειας απο τον developer.',
    tags: ['Responsive', 'SEO', 'Admin Panel'],
    full: true,
    heroTitle: 'Ξεκαθαρη παρουσια.',
    heroLead: 'Το μηνυμα σου, χωρις θορυβο.',
    seoTitle: 'Ιστοσελιδες | RedStar',
    seoDesc: 'Σχεδιασμος και κατασκευη ιστοσελιδων που εξηγουν τι κανεις, χτιζουν εμπιστοσυνη και οδηγουν σε επικοινωνια.',
    bands: [['Σαφες μηνυμα', 'Ο επισκεπτης καταλαβαινει αμεσως τι προσφερεις.'], ['Γρηγορη εμπειρια', 'Σωστη εικονα σε κινητο και υπολογιστη.'], ['Ευκολη συνεχεια', 'Αλλαγες περιεχομενου χωρις ταλαιπωρια.']],
    problems: [['Πρωτη εντυπωση', 'Η εικονα σου πρεπει να ταιριαζει με την ποιοτητα της δουλειας σου.'], ['Καθαρη διαδρομη', 'Ο επισκεπτης βρισκει γρηγορα αυτο που χρειαζεται και κανει το επομενο βημα.'], ['Σωστη βαση', 'Η δομη βοηθα ανθρωπους και μηχανες αναζητησης να καταλαβουν το περιεχομενο.']],
    deliverables: [['Σχεδιασμος', 'Μια οπτικη κατευθυνση προσαρμοσμενη στη δικη σου επιχειρηση.'], ['Περιεχομενο', 'Συντομα, καθαρα μηνυματα χωρις περιττες παραγραφους.'], ['Καθε οθονη', 'Σταθερη εμπειρια σε κινητο και υπολογιστη.'], ['Παραδοση', 'Δημοσιευση, βασικες οδηγιες και υποστηριξη.']],
    faqs: [['Ποσο χρονο χρειαζεται;', 'Μια μικρη επαγγελματικη ιστοσελιδα συνηθως ολοκληρωνεται σε 1 εως 3 εβδομαδες, οταν το περιεχομενο ειναι διαθεσιμο.'], ['Θα μπορω να αλλαζω κειμενα;', 'Ναι. Συμφωνουμε απο πριν τι θελεις να διαχειριζεσαι και σου δειχνω τον πιο απλο τροπο.'], ['Γραφετε και τα κειμενα;', 'Μπορω να οργανωσω και να βελτιωσω το υλικο σου ωστε να γινει συντομο και ξεκαθαρο.'], ['Τι χρειαζεστε για να ξεκινησουμε;', 'Μια συντομη συζητηση, το υπαρχον υλικο σου και εναν ανθρωπο για γρηγορες αποφασεις.']],
    price: 'Απο \u20ac300', timeframe: 'Συνηθως 1-3 εβδομαδες',
    project: bySlug['kotzia-pediatric-pulmonology-platform'],
    caseCopy: 'Μια καθαρη ιατρικη παρουσια που οδηγει γρηγορα στη σωστη πληροφορια.',
    caseOutcomes: ['Σαφης παρουσιαση υπηρεσιων.', 'Ευκολη επικοινωνια και ραντεβου.']
  },
  {
    slug: 'eshop-development', meta: 'E-Commerce', label: 'Κατασκευη E-Shop',
    desc: 'Ηλεκτρονικα καταστηματα με product catalog, checkout, πληρωμες και order management.',
    tags: ['WooCommerce', 'Laravel', 'Stripe'],
    full: true,
    heroTitle: 'Πωλησεις χωρις τριβη.',
    heroLead: 'Απλη αγορα. Ευκολη διαχειριση.',
    seoTitle: 'E-Shop | RedStar',
    seoDesc: 'E-shop με καθαρο καταλογο, ευκολη αγορα και διαχειριση που δεν σου τρωει τη μερα.',
    bands: [['Ευκολη αναζητηση', 'Προιοντα και κατηγοριες με λογικη.'], ['Καθαρη αγορα', 'Λιγοτερα βηματα μεχρι την πληρωμη.'], ['Ελεγχος', 'Παραγγελιες και προιοντα σε ενα σημειο.']],
    problems: [['Καταλογος που βγαζει νοημα', 'Οργανωνουμε τα προιοντα οπως ψαχνει ο πελατης, οχι οπως ειναι στο αρχειο σου.'], ['Αγορα χωρις αγχος', 'Η τιμη, η διαθεσιμοτητα, η αποστολη και η πληρωμη ειναι ξεκαθαρες.'], ['Καθημερινη διαχειριση', 'Το e-shop πρεπει να σε βοηθα να δουλευεις, οχι να δημιουργει αλλη μια αγγαρεια.']],
    deliverables: [['Καταλογος', 'Κατηγοριες, φιλτρα και σελιδες προιοντων.'], ['Αγορα', 'Καλαθι και τροποι πληρωμης.'], ['Παραγγελιες', 'Καθαρη εικονα για την καθημερινη διαχειριση.'], ['Παραδοση', 'Ελεγχοι, δημοσιευση και εκπαιδευση.']],
    faqs: [['Ποσα προιοντα μπορουν να μπουν;', 'Οσα χρειαζονται. Το σημαντικο ειναι να υπαρχει σωστο αρχειο και καθαρη κατηγοριοποιηση.'], ['Συνδεεται με πληρωμες και μεταφορικες;', 'Ναι, αναλογα με τους παροχους που χρησιμοποιεις και τις διαθεσιμες συνδεσεις τους.'], ['Μπορει να συνδεθει με το προγραμμα μου;', 'Το εξεταζουμε πριν την προσφορα. Αν υπαρχει ασφαλης τροπος συνδεσης, συμφωνειται απο την αρχη.'], ['Τι γινεται μετα την παραδοση;', 'Παραμενω διαθεσιμος για υποστηριξη, διορθωσεις και επομενες βελτιωσεις.']],
    price: 'Απο \u20ac500', timeframe: 'Συνηθως 2-5 εβδομαδες',
    project: bySlug['toner-ink-eshop'],
    caseCopy: 'Ενας μεγαλος καταλογος οργανωμενος για γρηγορη αναζητηση και ευκολη αγορα.',
    caseOutcomes: ['Καθαροτερη διαδρομη αγορας.', 'Απλουστερη καθημερινη διαχειριση.']
  },
  {
    slug: 'custom-web-apps', meta: 'Custom Development', label: 'Custom Web Εφαρμογες',
    desc: 'CRM, booking systems, dashboards, internal tools. Εφαρμογες που δεν αγοραζονται ετοιμες.',
    tags: ['CRM', 'Booking', 'APIs'],
    full: true,
    heroTitle: 'Λιγοτερη χειροκινητη δουλεια.',
    heroLead: 'Μια ροη. Μια εικονα.',
    seoTitle: 'Εφαρμογες | RedStar',
    seoDesc: 'Εφαρμογες για διαδικασιες που σημερα μοιραζονται σε Excel, email και χειροκινητες υπενθυμισεις.',
    bands: [['Μια εικονα', 'Τα σωστα δεδομενα στο σωστο σημειο.'], ['Λιγοτερη επαναληψη', 'Αυτοματοποιουμε ο,τι δεν χρειαζεται κριση.'], ['Χωρος να μεγαλωσει', 'Το εργαλειο ακολουθει την επιχειρηση.']],
    problems: [['Βλεπουμε τη δουλεια οπως γινεται', 'Χαρτογραφουμε τα πραγματικα βηματα, τις εξαιρεσεις και τους ανθρωπους που εμπλεκονται.'], ['Ξεκιναμε απο τον πυρηνα', 'Φτιαχνουμε πρωτα τη μικροτερη εκδοση που λυνει το βασικο προβλημα.'], ['Βελτιωνουμε με χρηση', 'Οι επομενες αποφασεις βασιζονται σε πραγματικη καθημερινη χρηση, οχι σε υποθεσεις.']],
    deliverables: [['Χαρτογραφηση', 'Ρολοι, ροες, δεδομενα και προτεραιοτητες.'], ['Πρωτη εικονα', 'Μια απτη εκδοχη για ελεγχο πριν τη μεγαλη επενδυση.'], ['Εργαλειο σε χρηση', 'Το βασικο συστημα ετοιμο για πραγματικους χρηστες.'], ['Συνεχεια', 'Υποστηριξη, μετρηση και επομενες βελτιωσεις.']],
    faqs: [['Πως υπολογιζεται το κοστος;', 'Μετα απο συντομη χαρτογραφηση των ροων και των κρισιμων λειτουργιων. Ετσι η προσφορα βασιζεται σε πραγματικες αναγκες.'], ['Πρεπει να φτιαξουμε τα παντα απο την αρχη;', 'Οχι. Συνηθως ξεκιναμε απο τον πυρηνα και προσθετουμε μονο ο,τι αποδεικνυεται χρησιμο.'], ['Μπορει να συνδεθει με τα υπαρχοντα εργαλεια;', 'Συχνα ναι. Ελεγχουμε καθε συνδεση για ασφαλεια, σταθεροτητα και πραγματικη αξια.'], ['Ποιος εχει τον ελεγχο των δεδομενων;', 'Η προσβαση, τα αντιγραφα και η κυριοτητα συμφωνουνται καθαρα πριν ξεκινησει η υλοποιηση.']],
    price: 'Μετα τη χαρτογραφηση', timeframe: 'Σε μικρες λειτουργικες εκδοσεις',
    project: bySlug['ellinity-tour-saas'],
    caseCopy: 'Προσφορες και περιηγησεις οργανωμενες σε ενα εργαλειο για ταχυτερη καθημερινη δουλεια.',
    caseOutcomes: ['Ταχυτερη παραγωγη προσφορων.', 'Μια κοινη βαση για ολη την ομαδα.']
  },
  { slug: 'saas-development', meta: 'SaaS', label: 'SaaS Development', desc: 'Multi-tenant πλατφορμες, subscriptions, APIs, user management. Απο MVP σε production.', tags: ['Multi-Tenant', 'Subscriptions', 'API'] },
  { slug: 'laravel-development', meta: 'Laravel', label: 'Laravel Development', desc: '15+ Laravel projects σε production. Custom εφαρμογες, APIs, admin panels, deployment.', tags: ['Laravel', 'PHP', 'Forge'] },
  { slug: 'wordpress', meta: 'WordPress', label: 'WordPress Development', desc: 'Custom themes, WooCommerce, plugins. WordPress σωστα, χωρις bloat.', tags: ['Custom Theme', 'WooCommerce', 'SEO'] },
  { slug: 'branding-design', meta: 'Branding', label: 'Branding & Σχεδιασμος', desc: 'Logo, χρωματικη παλετα, typography, brand guidelines. Ταυτοτητα που δουλευει παντου.', tags: ['Logo', 'Guidelines', 'Identity'] },
  { slug: 'seo', meta: 'SEO', label: 'SEO Υπηρεσιες', desc: 'Technical SEO, on-page optimization, schema markup, Google Search Console. Αποτελεσματα με δεδομενα.', tags: ['Technical SEO', 'Schema', 'GSC'] },
  { slug: 'hosting-support', meta: 'Hosting', label: 'Hosting & Υποστηριξη', desc: 'Φιλοξενια, backups, ασφαλεια, ταχυτητα και τεχνικη υποστηριξη μετα την παραδοση.', tags: ['Forge', 'SSL', 'Backups'] },
  { slug: 'consulting', meta: 'Consulting', label: 'Ψηφιακη Συμβουλευτικη', desc: 'Αξιολογηση υπαρχοντος site, σχεδιασμος στρατηγικης, τεχνικος ελεγχος και προτασεις βελτιωσης.', tags: ['Audit', 'Strategy', 'Roadmap'] }
];


/* ═══════════════════════════════════════════
   BUILD: Services index
   ═══════════════════════════════════════════ */

const servicesCards = services.map(s => `
        <a class="service-card" href="${s.slug}/index.html">
          <div class="service-card__body">
            <span class="service-card__meta">${s.meta}</span>
            <span class="service-card__title">${s.label}</span>
            <p class="service-card__desc">${s.desc}</p>
          </div>
          <div class="service-card__tags">${s.tags.map(t => `<span>${t}</span>`).join('')}</div>
        </a>`).join('');

const servicesBody = `
    ${rsHero({ eyebrow: 'RedStar Digital Agency', title: 'Υπηρεσιες Web Development', lead: 'Ιστοσελιδες, e-shop, custom εφαρμογες, SaaS πλατφορμες, branding και SEO. Καθε project χτιζεται custom, απευθειας απο τον developer.', prefix: '../' }).trimStart()}
    <div class="rs-shell">
      <div class="services-grid">${servicesCards}
      </div>
    </div>
    ${ctaBanner('../')}`;

write('services/index.html', page({
  title: 'Υπηρεσιες Web Development | RedStar Digital Agency',
  description: 'Κατασκευη ιστοσελιδων, e-shop, custom εφαρμογες, SaaS, Laravel, WordPress, branding και SEO στην Αθηνα.',
  route: '/services/', prefix: '../', active: 'services', body: servicesBody
}));
console.log('  services/index.html');


/* ═══════════════════════════════════════════
   BUILD: Service sub-pages
   ═══════════════════════════════════════════ */

for (const s of services) {
  const prefix = '../../';
  const route = `/services/${s.slug}/`;
  let body;

  if (s.full) {
    // Full service page with outcomes, deliverables, FAQ, case study
    body = `
    ${rsHero({ eyebrow: s.meta, title: s.heroTitle, lead: s.heroLead, prefix, short: false }).trimStart()}
    <div class="outcome-band">${s.bands.map(([t, d]) => `<div class="outcome-band__item"><strong>${t}</strong><span>${d}</span></div>`).join('')}</div>
    <section class="rs-section">
      <div class="rs-shell">
        <p class="rs-eyebrow rs-eyebrow--dark">Το ζητουμενο</p>
        <h2 class="mb-24">Η λυση πρεπει να βγαζει νοημα στην πραξη.</h2>
        <div class="problem-grid">${s.problems.map(([t, d]) => `<div class="problem-block"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
      </div>
    </section>
    <section class="rs-section--soft">
      <div class="rs-shell">
        <p class="rs-eyebrow rs-eyebrow--dark">Τι παραδιδεται</p>
        <h2 class="mb-24">Ξερεις τι παιρνεις.</h2>
        <div class="deliverables-grid">${s.deliverables.map(([t, d]) => `<div class="deliverable-card"><strong>${t}</strong><p>${d}</p></div>`).join('')}</div>
      </div>
    </section>
    ${s.project ? `<section class="rs-section">
      <div class="rs-shell">
        <div class="case-feature">
          <div class="case-feature__img"><img src="${prefix}${s.project.image}" alt="${esc(s.project.title)}" loading="lazy"></div>
          <div class="case-feature__body">
            <p class="rs-eyebrow rs-eyebrow--dark">Σχετικο εργο</p>
            <h2>${esc(s.project.title)}</h2>
            <p style="color:var(--rs-muted)">${esc(s.caseCopy)}</p>
            ${outcomeList(s.caseOutcomes)}
            <a class="rs-button rs-button--outline" href="${prefix}portfolio/${s.project.slug}/index.html">Δες το εργο ${arrowSvg}</a>
          </div>
        </div>
      </div>
    </section>` : ''}
    <section class="rs-section--soft">
      <div class="rs-shell">
        <p class="rs-eyebrow rs-eyebrow--dark">Συνεργασια</p>
        <h2>${s.price}</h2>
        <p style="color:var(--rs-muted);margin:8px 0 32px">${s.timeframe}. Η ακριβης προταση ερχεται αφου ξεκαθαρισουμε το πραγματικο ζητουμενο.</p>
        <div class="process-steps">
          <div class="process-step"><h3>Συντομη κληση</h3><p>Μιλαμε για το προβλημα και τον στοχο, χωρις πωληση με το ζορι.</p></div>
          <div class="process-step"><h3>Προταση</h3><p>Παιρνεις συγκεκριμενα βηματα, κοστος και τροπο συνεργασιας.</p></div>
          <div class="process-step"><h3>Υλοποιηση</h3><p>Βλεπεις τη δουλεια σε εξελιξη και αποφασιζουμε γρηγορα.</p></div>
        </div>
      </div>
    </section>
    <section class="rs-section">
      <div class="rs-shell">
        <p class="rs-eyebrow rs-eyebrow--dark">Συχνες ερωτησεις</p>
        <h2 class="mb-24">Πριν ξεκινησουμε.</h2>
        <div class="faq-list">${s.faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
      </div>
    </section>
    ${ctaBanner(prefix, s.label)}`;
  } else {
    // Simple service page: hero + description + CTA
    body = `
    ${rsHero({ eyebrow: s.meta, title: s.label, lead: s.desc, prefix, short: false }).trimStart()}
    <section class="rs-section">
      <div class="rs-shell" style="max-width:760px">
        <h2 class="mb-16">Πως δουλευουμε</h2>
        <p style="color:var(--rs-muted);margin:0 0 32px">${s.desc} Καθε συνεργασια ξεκινα απο μια συντομη συζητηση για να κατανοησουμε τις πραγματικες αναγκες.</p>
        <a class="rs-button" href="${bookingUrl}" target="_blank" rel="noopener">Κλειστε ραντεβου ${externalSvg}</a>
      </div>
    </section>
    ${ctaBanner(prefix, s.label)}`;
  }

  write(`services/${s.slug}/index.html`, page({
    title: s.full ? s.seoTitle : `${s.label} | RedStar`,
    description: s.full ? s.seoDesc : s.desc,
    route, prefix, active: 'services', body
  }));
  console.log(`  services/${s.slug}/index.html`);
}


/* ═══════════════════════════════════════════
   BUILD: Portfolio index
   ═══════════════════════════════════════════ */

function categoryFor(project) {
  const v = `${project.category} ${project.title}`.toLowerCase();
  if (v.includes('shop') || v.includes('retail')) return 'commerce';
  if (v.includes('platform') || v.includes('saas')) return 'platforms';
  return 'websites';
}
function displayCategory(project) {
  const c = categoryFor(project);
  if (c === 'commerce') return 'E-shop';
  if (c === 'platforms') return 'Εφαρμογη';
  return 'Ιστοσελιδα';
}

const portfolioCards = projects.map(p => `
        <a class="case-card" href="${p.slug}/index.html" data-category="${categoryFor(p)}">
          <div class="case-card__img"><img src="../${p.image}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" width="720" height="450"></div>
          <div class="case-card__body">
            <span class="case-card__meta">${displayCategory(p)}</span>
            <h2 class="case-card__title">${esc(p.title)}</h2>
            <p class="case-card__excerpt">${esc(p.outcomes?.[0] || p.excerpt)}</p>
          </div>
        </a>`).join('');

const portfolioBody = `
    ${rsHero({ eyebrow: 'RedStar Portfolio', title: 'Εργα που δουλευουν.', lead: 'Πραγματικες λυσεις για πραγματικες επιχειρησεις.', prefix: '../' }).trimStart()}
    <section class="rs-section">
      <div class="rs-shell">
        <div class="portfolio-filters" aria-label="Φιλτρα εργων">
          <button class="is-active" type="button" data-filter="all">Ολα</button>
          <button type="button" data-filter="websites">Ιστοσελιδες</button>
          <button type="button" data-filter="commerce">E-shop</button>
          <button type="button" data-filter="platforms">Εφαρμογες</button>
        </div>
        <div class="portfolio-grid">${portfolioCards}
        </div>
      </div>
    </section>
    ${ctaBanner('../')}`;

write('portfolio/index.html', page({
  title: 'Εργα | RedStar', description: 'Επιλεγμενες ιστοσελιδες, e-shop και εφαρμογες της RedStar για επιχειρησεις και οργανισμους.',
  route: '/portfolio/', prefix: '../', active: 'portfolio', body: portfolioBody
}));
console.log('  portfolio/index.html');


/* ═══════════════════════════════════════════
   BUILD: Portfolio case study pages
   ═══════════════════════════════════════════ */

for (const p of projects) {
  const prefix = '../../';
  const route = `/portfolio/${p.slug}/`;
  const body = `
    ${rsHero({ eyebrow: displayCategory(p), title: esc(p.title), lead: esc(p.outcomes?.[0] || p.excerpt), prefix, short: true }).trimStart()}
    <section class="rs-section">
      <div class="rs-shell">
        <div class="case-hero-img"><img src="${prefix}${p.image}" alt="${esc(p.imageAlt || p.title)}" width="1440" height="900"></div>
        <div class="case-meta">
          <div class="case-sidebar">
            <dl>
              <dt>Κατηγορια</dt><dd>${esc(p.category)}</dd>
              ${p.liveUrl ? `<dt>Live</dt><dd><a href="${esc(p.liveUrl)}" target="_blank" rel="noopener">${esc(p.title)} ${externalSvg}</a></dd>` : ''}
              ${p.stack ? `<dt>Stack</dt><dd>${p.stack.join(', ')}</dd>` : ''}
            </dl>
          </div>
          <div class="case-body">
            <section><h2>Η αναγκη</h2><p>${esc(p.challenge || p.excerpt)}</p></section>
            <section><h2>Η προσεγγιση</h2><p>${esc(Array.isArray(p.solution) ? p.solution.join(' ') : (p.solution || p.summary))}</p></section>
            <section><h2>Τι αλλαξε</h2>${outcomeList(p.outcomes || [])}</section>
          </div>
        </div>
      </div>
    </section>
    ${ctaBanner(prefix)}`;

  write(`portfolio/${p.slug}/index.html`, page({
    title: p.metaTitle || `${p.title} | RedStar`,
    description: p.metaDescription || p.excerpt,
    route, prefix, active: 'portfolio', body, type: 'article'
  }));
}
console.log(`  portfolio/ (${projects.length} case studies)`);


/* ═══════════════════════════════════════════
   BUILD: Blog
   ═══════════════════════════════════════════ */

const blogEntries = [];
const blogDir = path.join(root, 'blog');
const blogSlugs = fs.readdirSync(blogDir).filter(f => {
  try { return fs.statSync(path.join(blogDir, f)).isDirectory(); } catch { return false; }
}).sort();

for (const slug of blogSlugs) {
  const file = path.join(blogDir, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, 'utf8');

  // Extract title
  const titleMatch = original.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!titleMatch) continue;
  const title = cleanText(titleMatch[1]).replace(/\s*\|\s*RedStar\s*$/i, '');

  // Extract description
  const descMatch = original.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const description = descMatch ? cleanText(descMatch[1]) : title;

  // Extract date
  const dateMatch = original.match(/article:published_time"?\s+content="(\d{4}-\d{2}-\d{2})"/i);
  const date = dateMatch?.[1] || '';

  // Extract article content - try multiple patterns
  let content = '';
  const contentMatch = original.match(/<div class="article-content">([\s\S]*?)<\/div>\s*<aside/i)
    || original.match(/<div class="article-content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i)
    || original.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (contentMatch) {
    content = normalizeEntities(contentMatch[1].replace(/<p class="article-meta">[\s\S]*?<\/p>/i, '').trim());
  }
  // Autopilot sometimes emits /article-slug links at the domain root.
  // Resolve known articles relative to /redstar/blog/, retaining query/fragment.
  content = content.replace(/href=(["'])\/([^"'?#]+)([?#][^"']*)?\1/g, (link, quote, target, suffix = '') => {
    let destination = target.replace(/\/$/, '');
    const currentSlug = destination.replace(/-2026$/, '');
    if (blogSlugs.includes(currentSlug)) destination = currentSlug;
    return blogSlugs.includes(destination) ? `href=${quote}../${destination}/${suffix}${quote}` : link;
  });

  blogEntries.push({ slug, title, description, date, content });

  // Re-wrap article in Oct 20 template
  const articleBody = `
    ${rsHero({ title: esc(title), lead: esc(description), prefix: '../../', short: true }).trimStart()}
    <section class="rs-section">
      <div class="rs-shell">
        <div class="article-layout">
          <div class="article-content">${content ? content.replace(/<table>/g, '<table tabindex="0" aria-label="Συγκριτικός πίνακας">') : '<p>Περιεχομενο υπο κατασκευη.</p>'}</div>
          <aside class="article-sidebar" aria-label="Στοιχεια αρθρου">
            <div class="article-sidebar__panel"><strong>Συντακτης</strong><span>Αλεξανδρος Κουρτης</span></div>
            ${date ? `<div class="article-sidebar__panel"><strong>Ημερομηνια</strong><span>${date}</span></div>` : ''}
            <div class="article-sidebar__panel"><a href="../index.html">Ολα τα αρθρα</a></div>
          </aside>
        </div>
      </div>
    </section>
    ${ctaBanner('../../')}`;

  write(`blog/${slug}/index.html`, page({
    title: `${title} | RedStar`, description,
    route: `/blog/${slug}/`, prefix: '../../', active: 'blog', body: articleBody, type: 'article'
  }));
}

// Sort entries by date descending
blogEntries.sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title, 'el'));

const blogCards = blogEntries.map(e => `
        <a class="blog-card" href="${e.slug}/index.html">
          ${e.date ? `<span class="blog-card__meta">${e.date}</span>` : ''}
          <h2 class="blog-card__title">${esc(e.title)}</h2>
          <p class="blog-card__desc">${esc(e.description)}</p>
        </a>`).join('');

const blogBody = `
    ${rsHero({ eyebrow: 'RedStar Blog', title: 'Χρησιμες σημειωσεις.', lead: 'Πρακτικα. Συντομα. Χωρις fluff.', prefix: '../' }).trimStart()}
    <section class="rs-section">
      <div class="rs-shell">
        <div class="blog-grid">${blogCards}
        </div>
      </div>
    </section>
    ${ctaBanner('../')}`;

write('blog/index.html', page({
  title: 'Blog | RedStar', description: 'Πρακτικες σημειωσεις για ιστοσελιδες, e-shop, αυτοματισμους και ψηφιακες αποφασεις επιχειρησεων.',
  route: '/blog/', prefix: '../', active: 'blog', body: blogBody
}));
console.log(`  blog/index.html (${blogEntries.length} articles)`);


/* ═══════════════════════════════════════════
   BUILD: About
   ═══════════════════════════════════════════ */

const aboutBody = `
    ${rsHero({ eyebrow: 'Σχετικα με τη RedStar', title: 'Αμεση συνεργασια.', lead: 'Μικρο studio. Καθαρη ευθυνη.', prefix: '../' }).trimStart()}
    <section class="rs-section">
      <div class="rs-shell">
        <div class="about-grid">
          <div class="about-portrait">
            <picture>
              <source srcset="../sitepad-data/uploads/2026/05/optimized/alexandros-kourtis.webp" type="image/webp">
              <img src="../sitepad-data/uploads/2026/05/alexandros-kourtis.png" alt="Ο Αλεξανδρος Κουρτης, ιδρυτης της RedStar" width="1000" height="1250" loading="lazy">
            </picture>
          </div>
          <div class="about-body">
            <p class="rs-eyebrow rs-eyebrow--dark">Αλεξανδρος Κουρτης</p>
            <h2>Η αποφαση μενει κοντα στην υλοποιηση.</h2>
            <p>Δεν μεσολαβει τριτο ατομο αναμεσα σε εσενα και τη δουλεια. Ακουω το προβλημα, σχεδιαζω τη λυση και αναλαμβανω την κατασκευη. Οταν χρειαζεται ειδικη συνεργασια, το γνωριζεις απο την αρχη.</p>
            <p>Με ενδιαφερει το εργο να ειναι χρησιμο, ευκολο να συντηρηθει και αρκετα απλο ωστε να το καταλαβαινει η ομαδα σου.</p>
            <a class="rs-button" href="${bookingUrl}" target="_blank" rel="noopener">Κλεισε κληση ${externalSvg}</a>
          </div>
        </div>
      </div>
    </section>
    <section class="rs-section--soft">
      <div class="rs-shell">
        <div class="values-grid">
          <div class="value-card"><p class="rs-eyebrow rs-eyebrow--dark">01</p><h3>Ειλικρινεια</h3><p>Αν κατι δεν αξιζει το κοστος, θα το πω.</p></div>
          <div class="value-card"><p class="rs-eyebrow rs-eyebrow--dark">02</p><h3>Σαφηνεια</h3><p>Βηματα, κοστος και ευθυνη χωρις ψιλα γραμματα.</p></div>
          <div class="value-card"><p class="rs-eyebrow rs-eyebrow--dark">03</p><h3>Φροντιδα</h3><p>Η ποιοτητα φαινεται και στις μικρες λεπτομερειες.</p></div>
        </div>
      </div>
    </section>
    ${ctaBanner('../')}`;

write('about/index.html', page({
  title: 'Σχετικα | RedStar', description: 'Γνωρισε τον Αλεξανδρο Κουρτη και τον αμεσο, expert-led τροπο συνεργασιας της RedStar.',
  route: '/about/', prefix: '../', active: 'about', body: aboutBody
}));
console.log('  about/index.html');


/* ═══════════════════════════════════════════
   BUILD: Contact
   ═══════════════════════════════════════════ */

const contactBody = `
    ${rsHero({ title: 'Ας το λυσουμε.', lead: 'Πες μου τι σε δυσκολευει.', prefix: '../', short: true }).trimStart()}
    <section class="rs-section">
      <div class="rs-shell">
        <div class="contact-grid">
          <div class="contact-main">
            <p class="rs-eyebrow rs-eyebrow--dark">Το πιο γρηγορο επομενο βημα</p>
            <h2>Κλείστε μια κλήση.</h2>
            <p>Θα δουμε το προβλημα, τις βασικες προτεραιοτητες και αν εχει νοημα να δουλεψουμε μαζι.</p>
            <a class="rs-button" href="${bookingUrl}" target="_blank" rel="noopener">Δες διαθεσιμες ωρες ${externalSvg}</a>
          </div>
          <div>
            <p class="rs-eyebrow rs-eyebrow--dark">Η επικοινωνησε αμεσα</p>
            <div class="contact-options">
              <div class="contact-option"><strong>Email</strong><a href="mailto:redstar@transportmarketing.net">redstar@transportmarketing.net</a></div>
              <div class="contact-option"><strong>Τηλεφωνο</strong><a href="tel:+306989442438">+30 698 944 2438</a></div>
              <div class="contact-option"><strong>WhatsApp</strong><a href="https://wa.me/306989442438" target="_blank" rel="noopener">Ανοιγμα συνομιλιας</a></div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

write('contact/index.html', page({
  title: 'Επικοινωνια | RedStar', description: 'Κλεισε μια συντομη κληση με τη RedStar η επικοινωνησε αμεσα για το επομενο ψηφιακο εργο σου.',
  route: '/contact/', prefix: '../', active: 'contact', body: contactBody + quoteRequestForm(services.map(service => service.label)) + bankTransferSection()
}));
console.log('  contact/index.html');


/* ═══════════════════════════════════════════
   BUILD: Legal pages
   ═══════════════════════════════════════════ */

// The six Greek/English legal pages are maintained directly in their HTML files.
// Keep their reviewed content, translations and hreflang links on rebuild.


/* ═══════════════════════════════════════════
   BUILD: 404
   ═══════════════════════════════════════════ */

const notFoundBody = `
    <div class="not-found">
      <p class="rs-eyebrow rs-eyebrow--dark">404</p>
      <h1>Αυτη η σελιδα δεν υπαρχει.</h1>
      <p>Μπορεις να επιστρεψεις στην αρχικη η να δεις τα εργα.</p>
      <div>
        <a class="rs-button" href="index.html">Αρχικη</a>
        <a class="rs-button rs-button--outline" href="portfolio/index.html">Εργα</a>
      </div>
    </div>`;

write('404.html', page({
  title: 'Η σελιδα δεν βρεθηκε | RedStar', description: 'Η σελιδα που ζητησες δεν υπαρχει.',
  route: '/404.html', body: notFoundBody, robots: 'noindex, follow'
}));
console.log('  404.html');


/* ═══════════════════════════════════════════
   BUILD: Sitemap
   ═══════════════════════════════════════════ */

const sitemapRoutes = [
  '/',
  '/services/',
  ...services.map(s => `/services/${s.slug}/`),
  '/portfolio/',
  ...projects.map(p => `/portfolio/${p.slug}/`),
  '/about/',
  '/contact/',
  '/blog/',
  ...blogEntries.map(e => `/blog/${e.slug}/`),
  '/privacy/',
  '/terms/',
  '/cookies/',
  '/en/privacy/',
  '/en/terms/',
  '/en/cookies/'
];

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map(r => `  <url><loc>${canonicalRoot}${r}</loc></url>`).join('\n')}
</urlset>
`);
console.log('  sitemap.xml');


/* ═══════════════════════════════════════════
   BUILD: .htaccess
   ═══════════════════════════════════════════ */

write('.htaccess', `RewriteEngine On

# Directory index
DirectoryIndex index.html

# Clean URLs: /services/website-development/ -> /services/website-development/index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.+?)/?$ $1/index.html [L]

# 301 redirects for old year-slug blog URLs
RewriteRule ^blog/gimati-mme-xanoun-pelates-xoris-istoselida-2026/?$ /redstar/blog/gimati-mme-xanoun-pelates-xoris-istoselida/ [R=301,L]
RewriteRule ^blog/custom-web-efarmogi-aftomatopoiisi-epixeiriseon-2026/?$ /redstar/blog/custom-web-efarmogi-aftomatopoiisi-epixeiriseon/ [R=301,L]
RewriteRule ^blog/custom-efarmogi-vs-saas-ellinikes-epixeiriseis-2026/?$ /redstar/blog/custom-efarmogi-vs-saas-ellinikes-epixeiriseis/ [R=301,L]
RewriteRule ^blog/apo-excel-se-custom-platforma-odigos-mme-ellada-2026/?$ /redstar/blog/apo-excel-se-custom-platforma-odigos-mme-ellada/ [R=301,L]
RewriteRule ^blog/custom-staffing-platform-antikatastasi-ergaleion-meiwsi-chronou-2026/?$ /redstar/blog/custom-staffing-platform-antikatastasi-ergaleion-meiwsi-chronou/ [R=301,L]

# Custom 404
ErrorDocument 404 /redstar/404.html
`);
console.log('  .htaccess');

console.log('\nDone. All pages generated with Oct 20 visual language.');
