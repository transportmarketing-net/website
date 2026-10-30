import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const projects = JSON.parse(fs.readFileSync(path.join(root, 'sitepad-data/portfolio-projects.json'), 'utf8'));
const canonicalRoot = 'https://transportmarketing.net/redstar';
const bookingUrl = 'https://calendar.app.google/BivggDamyF6eLgFb6';
const nebula = 'sitepad-data/uploads/2026/05/redstar-space-crimson-nebula.jpg';

const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const external = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9M19 13v6H5V5h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function write(relativePath, content) {
  const output = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const normalized = content.replaceAll('—', '-').replaceAll('–', '-').replace(/[\u{1F4CC}\u{1F511}]/gu, '');
  fs.writeFileSync(output, normalized.trimStart());
}

function escapeText(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function cleanText(value = '') {
  return value
    .replace(/<[^>]*>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&nbsp;', ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function head({ title, description, route = '/', prefix = '', robots = 'index, follow, max-image-preview:large', type = 'website' }) {
  const canonical = `${canonicalRoot}${route === '/' ? '/' : route}`;
  return `<!doctype html>
<html lang="el">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeText(title)}</title>
  <meta name="description" content="${escapeText(description)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="${prefix}sitepad-data/brand/favicons/favicon.svg">
  <meta name="theme-color" content="#2b0a0f">
  <meta property="og:locale" content="el_GR">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="RedStar Digital Agency">
  <meta property="og:title" content="${escapeText(title)}">
  <meta property="og:description" content="${escapeText(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${canonicalRoot}/${nebula}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap&amp;subset=greek">
  <link rel="stylesheet" href="${prefix}assets/css/redstar.css">
  <script src="${prefix}assets/js/redstar.js" defer></script>
</head>`;
}

function header(prefix = '', active = '') {
  const current = (key) => active === key ? ' aria-current="page"' : '';
  return `<body>
  <a class="skip-link" href="#main-content">Μετάβαση στο περιεχόμενο</a>
  <header class="site-header">
    <div class="container site-header__bar">
      <a class="brand" href="${prefix}index.html" aria-label="RedStar, αρχική">
        <img src="${prefix}sitepad-data/brand/logos/logo-full-color-dark-bg.svg" alt="RedStar Digital Agency" width="220" height="70">
      </a>
      <nav class="desktop-nav" aria-label="Κύρια πλοήγηση">
        <a class="nav-link" href="${prefix}services/website-development/index.html"${current('website-development')}>Ιστοσελίδες</a>
        <a class="nav-link" href="${prefix}services/eshop-development/index.html"${current('eshop-development')}>E-shop</a>
        <a class="nav-link" href="${prefix}services/custom-web-apps/index.html"${current('custom-web-apps')}>Εφαρμογές</a>
        <a class="nav-link" href="${prefix}portfolio/index.html"${current('portfolio')}>Έργα</a>
        <a class="nav-link" href="${prefix}about/index.html"${current('about')}>Σχετικά</a>
        <a class="nav-link" href="${prefix}blog/index.html"${current('blog')}>Σημειώσεις</a>
      </nav>
      <div class="header-actions">
        <a class="button" href="${bookingUrl}" target="_blank" rel="noopener">Κλείσε κλήση ${external}</a>
        <button class="menu-toggle" type="button" aria-label="Άνοιγμα μενού" aria-expanded="false" aria-controls="mobile-menu" data-menu-open><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      </div>
    </div>
  </header>
  <div class="mobile-drawer" id="mobile-menu" data-mobile-drawer hidden>
    <button class="mobile-drawer__scrim" type="button" aria-label="Κλείσιμο μενού" data-menu-scrim></button>
    <div class="mobile-drawer__panel" role="dialog" aria-modal="true" aria-label="Μενού">
      <div class="mobile-drawer__top">
        <a class="brand" href="${prefix}index.html"><img src="${prefix}sitepad-data/brand/logos/logo-full-color-dark-bg.svg" alt="RedStar Digital Agency" width="220" height="70"></a>
        <button class="mobile-drawer__close" type="button" aria-label="Κλείσιμο μενού" data-menu-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
      </div>
      <nav class="mobile-nav" aria-label="Πλοήγηση κινητού">
        <div class="mobile-nav__group"><span class="mobile-nav__group-title">Λύσεις</span><a href="${prefix}services/website-development/index.html">Ιστοσελίδες</a><a href="${prefix}services/eshop-development/index.html">E-shop</a><a href="${prefix}services/custom-web-apps/index.html">Εφαρμογές</a></div>
        <a href="${prefix}portfolio/index.html">Έργα</a><a href="${prefix}about/index.html">Σχετικά</a><a href="${prefix}blog/index.html">Σημειώσεις</a><a href="${prefix}contact/index.html">Επικοινωνία</a>
      </nav>
      <div class="mobile-drawer__footer"><a class="button" href="${bookingUrl}" target="_blank" rel="noopener">Κλείσε κλήση ${external}</a></div>
    </div>
  </div>`;
}

function footer(prefix = '') {
  return `<footer class="site-footer">
    <div class="container">
      <div class="site-footer__top">
        <div class="site-footer__intro"><a class="brand" href="${prefix}index.html"><img src="${prefix}sitepad-data/brand/logos/logo-full-color-dark-bg.svg" alt="RedStar Digital Agency" width="220" height="70"></a><p>Ιστοσελίδες και εργαλεία για επιχειρήσεις που θέλουν καθαρή δουλειά και άμεση συνεργασία.</p></div>
        <nav aria-label="Λύσεις"><h2>Λύσεις</h2><a href="${prefix}services/website-development/index.html">Ιστοσελίδες</a><a href="${prefix}services/eshop-development/index.html">E-shop</a><a href="${prefix}services/custom-web-apps/index.html">Εφαρμογές</a></nav>
        <nav aria-label="RedStar"><h2>RedStar</h2><a href="${prefix}portfolio/index.html">Έργα</a><a href="${prefix}about/index.html">Σχετικά</a><a href="${prefix}blog/index.html">Σημειώσεις</a><a href="${prefix}contact/index.html">Επικοινωνία</a></nav>
      </div>
      <div class="site-footer__bottom"><span>© <span data-year>2026</span> RedStar.</span><div class="site-footer__legal"><a href="${prefix}privacy/index.html">Απόρρητο</a><a href="${prefix}terms/index.html">Όροι</a><a href="${prefix}cookies/index.html">Cookies</a></div></div>
    </div>
  </footer>
  <aside class="consent" data-consent hidden aria-label="Ρυθμίσεις cookies"><p>Χρησιμοποιούμε προαιρετικά στατιστικά για να βλέπουμε τι βοηθά. Δεν ξεκινούν χωρίς επιλογή.</p><div class="consent__actions"><button class="button" type="button" data-consent-accept>Αποδοχή</button><button class="button button--glass" type="button" data-consent-reject>Μόνο απαραίτητα</button></div></aside>
</body>
</html>`;
}

function page({ title, description, route, prefix = '', active = '', body, robots, type }) {
  return `${head({ title, description, route, prefix, robots, type })}
${header(prefix, active)}
<main id="main-content">${body}</main>
${footer(prefix)}`;
}

function projectImage(project, prefix = '', priority = false, alt = project.imageAlt || project.title) {
  const base = path.basename(project.image, path.extname(project.image));
  return `<picture><source srcset="${prefix}sitepad-data/uploads/2026/05/optimized/${base}.webp" type="image/webp"><img src="${prefix}${project.image}" alt="${escapeText(alt)}" width="1440" height="900" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

function browserCard(project, prefix = '', caption = true) {
  return `<figure class="browser-card"><div class="browser-card__bar"><span></span><span></span><span></span></div>${projectImage(project, prefix)}${caption ? `<figcaption class="browser-card__caption">${escapeText(project.title)}</figcaption>` : ''}</figure>`;
}

function plainProjectText(value = '') {
  return String(value)
    .replace(/Το portfolio/gi, 'Η παρουσίαση έργων')
    .replace(/agency έργων/gi, 'έργων')
    .replace(/\bpublic\b/gi, 'δημόσια')
    .replace(/\bpremium\b/gi, 'απαιτητικό')
    .replace(/\bagency\b/gi, 'δημιουργικής ομάδας')
    .replace(/\bportfolio\b/gi, 'παρουσίαση έργων')
    .replace(/\bSaaS\b/gi, 'εργαλείο')
    .replace(/\bLaravel\b/gi, 'σύστημα')
    .replace(/\bWordPress\b/gi, 'σύστημα διαχείρισης')
    .replace(/\bWooCommerce\b/gi, 'ηλεκτρονικό κατάστημα')
    .replace(/\bAI\b/g, 'έξυπνη βοήθεια')
    .replace(/\btemplates?\b/gi, 'πρότυπα')
    .replace(/\boperators?\b/gi, 'ομάδες')
    .replace(/\boutput\b/gi, 'αποτέλεσμα')
    .replace(/\bplatform\b/gi, 'εργαλείο')
    .replace(/\bwebsite\b/gi, 'ιστοσελίδα')
    .replace(/\bB2B\b/g, 'εταιρικούς')
    .replace(/\bproperty\b/gi, 'ακίνητο')
    .replace(/\btutoring\b/gi, 'μαθημάτων');
}

function outcomes(items) {
  return `<ul class="outcome-list">${items.map((item) => `<li>${check}<span>${escapeText(plainProjectText(item))}</span></li>`).join('')}</ul>`;
}

function finalCta() {
  return `<section class="final-cta"><div class="container final-cta__inner"><div><p class="eyebrow">Έχεις κάτι συγκεκριμένο στο μυαλό;</p><h2>Ας δούμε αν ταιριάζουμε.</h2><p>Σε 30 λεπτά ξεκαθαρίζουμε ανάγκη, κόστος και επόμενο βήμα.</p></div><a class="button" href="${bookingUrl}" target="_blank" rel="noopener">Κλείσε κλήση ${external}</a></div></section>`;
}

const bySlug = Object.fromEntries(projects.map((project) => [project.slug, project]));
const homeProjects = [bySlug['helppoint-volunteer-platform'], bySlug['ellinity-tour-saas'], bySlug['toner-ink-eshop']];

const homeBody = `
<section class="hero">
  <div class="hero__media"><img src="${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div>
  <div class="container hero__grid">
    <div class="hero__copy"><h1>Καθαρά εργαλεία. Καλύτερη δουλειά.</h1><p class="hero__lead">Ιστοσελίδες, e-shop και εφαρμογές. Από έναν άνθρωπο.</p><div class="hero__actions"><a class="button" href="${bookingUrl}" target="_blank" rel="noopener">Κλείσε κλήση ${external}</a><a class="button button--glass" href="portfolio/index.html">Δες τα έργα</a></div></div>
    <div class="browser-stage" aria-label="Επιλεγμένα έργα">${homeProjects.map((project) => browserCard(project)).join('')}</div>
  </div>
</section>
<div class="proof-band"><div class="container proof-band__inner"><div class="proof-item"><strong>15 έργα</strong><span>σε πραγματικές επιχειρήσεις</span></div><div class="proof-item"><strong>Άμεση επαφή</strong><span>με τον δημιουργό</span></div><div class="proof-item"><strong>Καθαρή συμφωνία</strong><span>πριν ξεκινήσουμε</span></div><div class="proof-item"><strong>Υποστήριξη</strong><span>και μετά την παράδοση</span></div></div></div>
<section class="section" id="solutions"><div class="container"><div class="section-heading"><div><p class="eyebrow">Τρεις καθαρές λύσεις</p><h2>Ό,τι χρειάζεται. Τίποτα παραπάνω.</h2></div><p>Ξεκινάμε από το αποτέλεσμα που θέλεις, όχι από μια λίστα τεχνολογιών.</p></div><div class="solutions-layout"><a class="solution-card solution-card--lead" href="services/custom-web-apps/index.html"><span class="solution-card__index">01 / Εφαρμογές</span><h3>Η δουλειά σου, χωρίς τα χειροκίνητα βήματα.</h3><p>Ένα εργαλείο κομμένο στη διαδικασία σου, για λιγότερα λάθη και καλύτερη εικόνα.</p><span class="solution-card__arrow">${arrow}</span></a><div class="solutions-stack"><a class="solution-card" href="services/website-development/index.html"><span class="solution-card__index">02 / Ιστοσελίδες</span><h3>Μια παρουσία που σε εκπροσωπεί.</h3><p>Καθαρό μήνυμα, γρήγορη εμπειρία, εύκολη επικοινωνία.</p><span class="solution-card__arrow">${arrow}</span></a><a class="solution-card" href="services/eshop-development/index.html"><span class="solution-card__index">03 / E-shop</span><h3>Αγορά χωρίς τριβή.</h3><p>Τα προϊόντα σου οργανωμένα και η διαχείριση απλή.</p><span class="solution-card__arrow">${arrow}</span></a></div></div></div></section>
<section class="section section--soft"><div class="container"><div class="work-feature"><a class="work-feature__media" href="portfolio/helppoint-volunteer-platform/index.html">${projectImage(bySlug['helppoint-volunteer-platform'])}</a><div class="work-feature__copy"><p class="eyebrow">Επιλεγμένο έργο</p><h2>HelpPoint</h2><p>Ένα ενιαίο σημείο για οργανισμούς, δράσεις, βάρδιες και εθελοντές.</p>${outcomes(bySlug['helppoint-volunteer-platform'].outcomes)}<a class="text-link" href="portfolio/helppoint-volunteer-platform/index.html">Δες το έργο ${arrow}</a></div></div><div class="project-rail">${[bySlug['toner-ink-eshop'], bySlug['kotzia-pediatric-pulmonology-platform'], bySlug['ellinity-tour-saas']].map((project) => `<a class="project-link" href="portfolio/${project.slug}/index.html"><span>${displayCategory(project)}</span><strong>${escapeText(project.title)}</strong></a>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Πώς δουλεύουμε</p><h2>Από την ιδέα σε κάτι που χρησιμοποιείται.</h2></div><p>Μικρά, καθαρά βήματα. Συχνή επικοινωνία. Καμία έκπληξη στο τέλος.</p></div><div class="process-list"><article class="process-step"><h3>Ξεκαθαρίζουμε</h3><p>Συμφωνούμε τι λύνουμε, για ποιον και τι σημαίνει επιτυχία.</p></article><article class="process-step"><h3>Χτίζουμε</h3><p>Βλέπεις νωρίς την κατεύθυνση και δίνεις σχόλια όσο υπάρχει χρόνος να μετρήσουν.</p></article><article class="process-step"><h3>Παραδίδουμε</h3><p>Το έργο δημοσιεύεται, με οδηγίες και ξεκάθαρη συνέχεια υποστήριξης.</p></article></div></div></section>
<section class="section section--soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Ενδεικτική επένδυση</p><h2>Μια πρώτη εικόνα, πριν μιλήσουμε.</h2></div><p>Η τελική τιμή εξαρτάται από το περιεχόμενο, τις ροές και τις συνδέσεις που χρειάζονται.</p></div><div class="pricing-grid"><article class="price-card"><span class="price-card__label">Ιστοσελίδα</span><h3>Καθαρή αρχή</h3><p>Για μια επαγγελματική παρουσία ή σελίδα καμπάνιας.</p><div class="price-card__price">€300-500</div><ul><li>Σωστή εικόνα σε κάθε οθόνη</li><li>Βασική δομή αναζήτησης</li><li>2 γύροι αλλαγών</li></ul><a class="text-link" href="services/website-development/index.html">Περισσότερα ${arrow}</a></article><article class="price-card price-card--featured"><span class="price-card__label">E-shop</span><h3>Έτοιμο για πωλήσεις</h3><p>Για προϊόντα, πληρωμές και παραγγελίες.</p><div class="price-card__price">€500-1.000</div><ul><li>Κατάλογος προϊόντων</li><li>Καλάθι και πληρωμές</li><li>Βασική εκπαίδευση</li></ul><a class="button" href="services/eshop-development/index.html">Περισσότερα ${arrow}</a></article><article class="price-card"><span class="price-card__label">Εφαρμογή</span><h3>Στα μέτρα σου</h3><p>Για διαδικασίες που δεν χωρούν σε έτοιμο εργαλείο.</p><div class="price-card__price">Με προσφορά</div><ul><li>Χαρτογράφηση ροών</li><li>Σχεδιασμός και υλοποίηση</li><li>Συνεχής υποστήριξη</li></ul><a class="text-link" href="services/custom-web-apps/index.html">Περισσότερα ${arrow}</a></article></div></div></section>
<section class="section"><div class="container about-split"><div class="about-portrait"><picture><source srcset="sitepad-data/uploads/2026/05/optimized/alexandros-kourtis.webp" type="image/webp"><img src="sitepad-data/uploads/2026/05/alexandros-kourtis.png" alt="Ο Αλέξανδρος Κούρτης, ιδρυτής της RedStar" width="1000" height="1250" loading="lazy"></picture></div><div class="about-copy"><p class="eyebrow">Πίσω από τη RedStar</p><h2>Ένας συνεργάτης. Καμία χαμένη πληροφορία.</h2><p>Είμαι ο Αλέξανδρος. Αναλαμβάνω προσωπικά τη στρατηγική, τον σχεδιασμό και την υλοποίηση. Έτσι η απόφαση μένει κοντά στη δουλειά.</p><div class="principle-list"><div><strong>Ευθύτητα</strong><span>Σου λέω τι αξίζει και τι όχι.</span></div><div><strong>Ιδιοκτησία</strong><span>Το έργο δεν περνά από χέρια.</span></div><div><strong>Συνέχεια</strong><span>Δεν εξαφανίζομαι μετά την παράδοση.</span></div></div><a class="text-link" href="about/index.html">Γνώρισέ με ${arrow}</a></div></div></section>
${finalCta()}`;

write('index.html', page({ title: 'RedStar | Ιστοσελίδες, E-shop και Εφαρμογές', description: 'Καθαρές ψηφιακές λύσεις για ελληνικές επιχειρήσεις, με άμεση συνεργασία από τη στρατηγική έως την υλοποίηση.', route: '/', body: homeBody }));

const servicePages = [
  {
    slug: 'website-development', label: 'Ιστοσελίδες', title: 'Ξεκάθαρη παρουσία.', description: 'Σχεδιασμός και κατασκευή ιστοσελίδων που εξηγούν τι κάνεις, χτίζουν εμπιστοσύνη και οδηγούν σε επικοινωνία.', lead: 'Το μήνυμά σου, χωρίς θόρυβο.', project: bySlug['kotzia-pediatric-pulmonology-platform'], caseCopy: 'Μια καθαρή ιατρική παρουσία που οδηγεί γρήγορα στη σωστή πληροφορία.', caseOutcomes: ['Σαφής παρουσίαση υπηρεσιών.', 'Εύκολη επικοινωνία και ραντεβού.'], price: 'Από €300', timeframe: 'Συνήθως 1-3 εβδομάδες', outcome: 'Καθαρό μήνυμα και περισσότερες σωστές επαφές', bands: [['Σαφές μήνυμα','Ο επισκέπτης καταλαβαίνει αμέσως τι προσφέρεις.'],['Γρήγορη εμπειρία','Σωστή εικόνα σε κινητό και υπολογιστή.'],['Εύκολη συνέχεια','Αλλαγές περιεχομένου χωρίς ταλαιπωρία.']], problems: [['Πρώτη εντύπωση','Η εικόνα σου πρέπει να ταιριάζει με την ποιότητα της δουλειάς σου.'],['Καθαρή διαδρομή','Ο επισκέπτης βρίσκει γρήγορα αυτό που χρειάζεται και κάνει το επόμενο βήμα.'],['Σωστή βάση','Η δομή βοηθά ανθρώπους και μηχανές αναζήτησης να καταλάβουν το περιεχόμενο.']], deliverables: [['Σχεδιασμός','Μια οπτική κατεύθυνση προσαρμοσμένη στη δική σου επιχείρηση.'],['Περιεχόμενο','Σύντομα, καθαρά μηνύματα χωρίς περιττές παραγράφους.'],['Κάθε οθόνη','Σταθερή εμπειρία σε κινητό και υπολογιστή.'],['Παράδοση','Δημοσίευση, βασικές οδηγίες και υποστήριξη.']], faqs: [['Πόσο χρόνο χρειάζεται;','Μια μικρή επαγγελματική ιστοσελίδα συνήθως ολοκληρώνεται σε 1 έως 3 εβδομάδες, όταν το περιεχόμενο είναι διαθέσιμο.'],['Θα μπορώ να αλλάζω κείμενα;','Ναι. Συμφωνούμε από πριν τι θέλεις να διαχειρίζεσαι και σου δείχνω τον πιο απλό τρόπο.'],['Γράφετε και τα κείμενα;','Μπορώ να οργανώσω και να βελτιώσω το υλικό σου ώστε να γίνει σύντομο και ξεκάθαρο.'],['Τι χρειάζεστε για να ξεκινήσουμε;','Μια σύντομη συζήτηση, το υπάρχον υλικό σου και έναν άνθρωπο για γρήγορες αποφάσεις.']]
  },
  {
    slug: 'eshop-development', label: 'E-shop', title: 'Πωλήσεις χωρίς τριβή.', description: 'E-shop με καθαρό κατάλογο, εύκολη αγορά και διαχείριση που δεν σου τρώει τη μέρα.', lead: 'Απλή αγορά. Εύκολη διαχείριση.', project: bySlug['toner-ink-eshop'], caseCopy: 'Ένας μεγάλος κατάλογος οργανωμένος για γρήγορη αναζήτηση και εύκολη αγορά.', caseOutcomes: ['Καθαρότερη διαδρομή αγοράς.', 'Απλούστερη καθημερινή διαχείριση.'], price: 'Από €500', timeframe: 'Συνήθως 2-5 εβδομάδες', outcome: 'Πιο απλή αγορά και καλύτερη διαχείριση', bands: [['Εύκολη αναζήτηση','Προϊόντα και κατηγορίες με λογική.'],['Καθαρή αγορά','Λιγότερα βήματα μέχρι την πληρωμή.'],['Έλεγχος','Παραγγελίες και προϊόντα σε ένα σημείο.']], problems: [['Κατάλογος που βγάζει νόημα','Οργανώνουμε τα προϊόντα όπως ψάχνει ο πελάτης, όχι όπως είναι στο αρχείο σου.'],['Αγορά χωρίς άγχος','Η τιμή, η διαθεσιμότητα, η αποστολή και η πληρωμή είναι ξεκάθαρες.'],['Καθημερινή διαχείριση','Το e-shop πρέπει να σε βοηθά να δουλεύεις, όχι να δημιουργεί άλλη μία αγγαρεία.']], deliverables: [['Κατάλογος','Κατηγορίες, φίλτρα και σελίδες προϊόντων.'],['Αγορά','Καλάθι και τρόποι πληρωμής.'],['Παραγγελίες','Καθαρή εικόνα για την καθημερινή διαχείριση.'],['Παράδοση','Έλεγχοι, δημοσίευση και εκπαίδευση.']], faqs: [['Πόσα προϊόντα μπορούν να μπουν;','Όσα χρειάζονται. Το σημαντικό είναι να υπάρχει σωστό αρχείο και καθαρή κατηγοριοποίηση.'],['Συνδέεται με πληρωμές και μεταφορικές;','Ναι, ανάλογα με τους παρόχους που χρησιμοποιείς και τις διαθέσιμες συνδέσεις τους.'],['Μπορεί να συνδεθεί με το πρόγραμμά μου;','Το εξετάζουμε πριν την προσφορά. Αν υπάρχει ασφαλής τρόπος σύνδεσης, συμφωνείται από την αρχή.'],['Τι γίνεται μετά την παράδοση;','Παραμένω διαθέσιμος για υποστήριξη, διορθώσεις και επόμενες βελτιώσεις.']]
  },
  {
    slug: 'custom-web-apps', label: 'Εφαρμογές', title: 'Λιγότερη χειροκίνητη δουλειά.', description: 'Εφαρμογές για διαδικασίες που σήμερα μοιράζονται σε Excel, email και χειροκίνητες υπενθυμίσεις.', lead: 'Μία ροή. Μία εικόνα.', project: bySlug['ellinity-tour-saas'], caseCopy: 'Προσφορές και περιηγήσεις οργανωμένες σε ένα εργαλείο για ταχύτερη καθημερινή δουλειά.', caseOutcomes: ['Ταχύτερη παραγωγή προσφορών.', 'Μία κοινή βάση για όλη την ομάδα.'], price: 'Μετά τη χαρτογράφηση', timeframe: 'Σε μικρές λειτουργικές εκδόσεις', outcome: 'Μία κοινή εικόνα για την ομάδα', bands: [['Μία εικόνα','Τα σωστά δεδομένα στο σωστό σημείο.'],['Λιγότερη επανάληψη','Αυτοματοποιούμε ό,τι δεν χρειάζεται κρίση.'],['Χώρος να μεγαλώσει','Το εργαλείο ακολουθεί την επιχείρηση.']], problems: [['Βλέπουμε τη δουλειά όπως γίνεται','Χαρτογραφούμε τα πραγματικά βήματα, τις εξαιρέσεις και τους ανθρώπους που εμπλέκονται.'],['Ξεκινάμε από τον πυρήνα','Φτιάχνουμε πρώτα τη μικρότερη έκδοση που λύνει το βασικό πρόβλημα.'],['Βελτιώνουμε με χρήση','Οι επόμενες αποφάσεις βασίζονται σε πραγματική καθημερινή χρήση, όχι σε υποθέσεις.']], deliverables: [['Χαρτογράφηση','Ρόλοι, ροές, δεδομένα και προτεραιότητες.'],['Πρώτη εικόνα','Μια απτή εκδοχή για έλεγχο πριν τη μεγάλη επένδυση.'],['Εργαλείο σε χρήση','Το βασικό σύστημα έτοιμο για πραγματικούς χρήστες.'],['Συνέχεια','Υποστήριξη, μέτρηση και επόμενες βελτιώσεις.']], faqs: [['Πώς υπολογίζεται το κόστος;','Μετά από σύντομη χαρτογράφηση των ροών και των κρίσιμων λειτουργιών. Έτσι η προσφορά βασίζεται σε πραγματικές ανάγκες.'],['Πρέπει να φτιάξουμε τα πάντα από την αρχή;','Όχι. Συνήθως ξεκινάμε από τον πυρήνα και προσθέτουμε μόνο ό,τι αποδεικνύεται χρήσιμο.'],['Μπορεί να συνδεθεί με τα υπάρχοντα εργαλεία;','Συχνά ναι. Ελέγχουμε κάθε σύνδεση για ασφάλεια, σταθερότητα και πραγματική αξία.'],['Ποιος έχει τον έλεγχο των δεδομένων;','Η πρόσβαση, τα αντίγραφα και η κυριότητα συμφωνούνται καθαρά πριν ξεκινήσει η υλοποίηση.']]
  }
];

for (const service of servicePages) {
  const prefix = '../../';
  const route = `/services/${service.slug}/`;
  const body = `
  <section class="page-hero"><div class="page-hero__media"><img src="${prefix}${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div><div class="container page-hero__grid"><div><h1>${service.title}</h1><p class="page-hero__lead">${service.lead}</p><div class="page-hero__actions"><a class="button" href="${bookingUrl}" target="_blank" rel="noopener">Κλείσε κλήση ${external}</a><a class="button button--glass" href="${prefix}portfolio/index.html">Δες έργα</a></div></div><div class="page-hero__visual">${browserCard(service.project, prefix, false)}</div></div></section>
  <div class="outcome-band"><div class="container outcome-band__inner">${service.bands.map(([title, text]) => `<div class="outcome-band__item"><strong>${title}</strong><span>${text}</span></div>`).join('')}</div></div>
  <section class="section"><div class="container story-split"><div class="story-split__sticky"><p class="eyebrow">Το ζητούμενο</p><h2>Η λύση πρέπει να βγάζει νόημα στην πράξη.</h2></div><div class="story-split__body">${service.problems.map(([title, text]) => `<article class="story-block"><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></div></section>
  <section class="section section--soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Τι παραδίδεται</p><h2>Ξέρεις τι παίρνεις.</h2></div><p>Κάθε στοιχείο συνδέεται με μια πραγματική ανάγκη της επιχείρησης.</p></div><div class="deliverables">${service.deliverables.map(([title, text]) => `<article class="deliverable"><strong>${title}</strong><p>${text}</p></article>`).join('')}</div></div></section>
  <section class="section section--dark"><div class="container case-feature"><a class="case-feature__media" href="${prefix}portfolio/${service.project.slug}/index.html">${projectImage(service.project, prefix)}</a><div class="case-feature__copy"><p class="eyebrow">Σχετικό έργο</p><h2>${escapeText(service.project.title)}</h2><p>${escapeText(service.caseCopy)}</p>${outcomes(service.caseOutcomes)}<a class="button button--glass" href="${prefix}portfolio/${service.project.slug}/index.html">Δες το έργο ${arrow}</a></div></div></section>
  <section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Συνεργασία</p><h2>${service.price}</h2></div><p>${service.timeframe}. Η ακριβής πρόταση έρχεται αφού ξεκαθαρίσουμε το πραγματικό ζητούμενο.</p></div><div class="process-list"><article class="process-step"><h3>Σύντομη κλήση</h3><p>Μιλάμε για το πρόβλημα και τον στόχο, χωρίς πώληση με το ζόρι.</p></article><article class="process-step"><h3>Πρόταση</h3><p>Παίρνεις συγκεκριμένα βήματα, κόστος και τρόπο συνεργασίας.</p></article><article class="process-step"><h3>Υλοποίηση</h3><p>Βλέπεις τη δουλειά σε εξέλιξη και αποφασίζουμε γρήγορα.</p></article></div></div></section>
  <section class="section section--soft"><div class="container"><div class="section-heading section-heading--stack"><p class="eyebrow">Συχνές ερωτήσεις</p><h2>Πριν ξεκινήσουμε.</h2></div><div class="faq-list">${service.faqs.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></div></section>
  ${finalCta()}`;
  write(`services/${service.slug}/index.html`, page({ title: `${service.label} | RedStar`, description: service.description, route, prefix, active: service.slug, body }));
}

function categoryFor(project) {
  const value = `${project.category} ${project.title}`.toLowerCase();
  if (value.includes('shop') || value.includes('retail')) return 'commerce';
  if (value.includes('platform') || value.includes('saas')) return 'platforms';
  return 'websites';
}

function displayCategory(project) {
  const category = categoryFor(project);
  if (category === 'commerce') return 'E-shop';
  if (category === 'platforms') return 'Εφαρμογή';
  return 'Ιστοσελίδα';
}

const portfolioCards = projects.map((project) => `<a class="project-card" href="${project.slug}/index.html" data-project-category="${categoryFor(project)}"><div class="project-card__media">${projectImage(project, '../')}</div><span class="project-card__meta">${displayCategory(project)}</span><h2>${escapeText(project.title)}</h2><p>${escapeText(plainProjectText(project.outcomes?.[0] || project.excerpt))}</p></a>`).join('');
const portfolioBody = `<section class="article-hero"><div class="article-hero__media"><img src="../${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div><div class="container"><h1>Έργα που δουλεύουν.</h1><p>Πραγματικές λύσεις.</p></div></section><section class="section"><div class="container"><div class="filter-bar" aria-label="Φίλτρα έργων"><button class="filter-button" type="button" data-filter="all" aria-pressed="true">Όλα</button><button class="filter-button" type="button" data-filter="websites" aria-pressed="false">Ιστοσελίδες</button><button class="filter-button" type="button" data-filter="commerce" aria-pressed="false">E-shop</button><button class="filter-button" type="button" data-filter="platforms" aria-pressed="false">Εφαρμογές</button></div><p class="sr-only" aria-live="polite" data-filter-status>${projects.length} έργα εμφανίζονται.</p><div class="portfolio-grid">${portfolioCards}</div></div></section>${finalCta()}`;
write('portfolio/index.html', page({ title: 'Έργα | RedStar', description: 'Επιλεγμένες ιστοσελίδες, e-shop και εφαρμογές της RedStar για επιχειρήσεις και οργανισμούς.', route: '/portfolio/', prefix: '../', active: 'portfolio', body: portfolioBody }));

for (const project of projects) {
  const prefix = '../../';
  const route = `/portfolio/${project.slug}/`;
  const body = `<article><section class="article-hero"><div class="article-hero__media"><img src="${prefix}${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div><div class="container"><h1>${escapeText(project.title)}</h1><p>${escapeText(plainProjectText(project.outcomes?.[0] || project.excerpt))}</p></div></section><div class="container case-study-layout"><figure class="case-study-hero-image">${projectImage(project, prefix, true)}</figure><div class="case-study-grid"><div><p class="eyebrow">Το έργο</p><h2>${escapeText(plainProjectText(project.articleTitle || project.title))}</h2>${project.liveUrl ? `<a class="text-link" href="${escapeText(project.liveUrl)}" target="_blank" rel="noopener">Επίσκεψη στο έργο ${external}</a>` : ''}</div><div><section class="case-study-section"><h2>Η ανάγκη</h2><p>${escapeText(plainProjectText(project.challenge || project.excerpt))}</p></section><section class="case-study-section"><h2>Η προσέγγιση</h2><p>${escapeText(plainProjectText(project.solution || project.summary))}</p></section><section class="case-study-section"><h2>Τι άλλαξε</h2>${outcomes(project.outcomes || [])}</section></div></div></div></article>${finalCta()}`;
  write(`portfolio/${project.slug}/index.html`, page({ title: project.metaTitle || `${project.title} | RedStar`, description: project.metaDescription || project.excerpt, route, prefix, active: 'portfolio', body, type: 'article' }));
}

const aboutBody = `<section class="page-hero"><div class="page-hero__media"><img src="../${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div><div class="container page-hero__grid"><div><h1>Άμεση συνεργασία.</h1><p class="page-hero__lead">Μικρό studio. Καθαρή ευθύνη.</p><div class="page-hero__actions"><a class="button" href="${bookingUrl}" target="_blank" rel="noopener">Κλείσε κλήση ${external}</a></div></div><div class="about-portrait"><picture><source srcset="../sitepad-data/uploads/2026/05/optimized/alexandros-kourtis.webp" type="image/webp"><img src="../sitepad-data/uploads/2026/05/alexandros-kourtis.png" alt="Ο Αλέξανδρος Κούρτης" width="1000" height="1250"></picture></div></div></section><section class="section"><div class="container about-split"><div><p class="eyebrow">Αλέξανδρος Κούρτης</p><h2>Η απόφαση μένει κοντά στην υλοποίηση.</h2></div><div class="about-copy"><p>Δεν μεσολαβεί τρίτο άτομο ανάμεσα σε εσένα και τη δουλειά. Ακούω το πρόβλημα, σχεδιάζω τη λύση και αναλαμβάνω την κατασκευή. Όταν χρειάζεται ειδική συνεργασία, το γνωρίζεις από την αρχή.</p><p>Με ενδιαφέρει το έργο να είναι χρήσιμο, εύκολο να συντηρηθεί και αρκετά απλό ώστε να το καταλαβαίνει η ομάδα σου.</p></div></div></section><section class="section section--soft"><div class="container"><div class="value-index"><article><p class="eyebrow">01</p><h2>Ειλικρίνεια</h2><p>Αν κάτι δεν αξίζει το κόστος, θα το πω.</p></article><article><p class="eyebrow">02</p><h2>Σαφήνεια</h2><p>Βήματα, κόστος και ευθύνη χωρίς ψιλά γράμματα.</p></article><article><p class="eyebrow">03</p><h2>Φροντίδα</h2><p>Η ποιότητα φαίνεται και στις μικρές λεπτομέρειες.</p></article></div></div></section>${finalCta()}`;
write('about/index.html', page({ title: 'Σχετικά | RedStar', description: 'Γνώρισε τον Αλέξανδρο Κούρτη και τον άμεσο, expert-led τρόπο συνεργασίας της RedStar.', route: '/about/', prefix: '../', active: 'about', body: aboutBody }));

const contactBody = `<section class="article-hero"><div class="article-hero__media"><img src="../${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div><div class="container"><h1>Ας το λύσουμε.</h1><p>Πες μου τι σε δυσκολεύει.</p></div></section><section class="section"><div class="container contact-layout"><div class="contact-main"><p class="eyebrow">Το πιο γρήγορο επόμενο βήμα</p><h2>Κλείσε μια κλήση 30 λεπτών.</h2><p>Θα δούμε το πρόβλημα, τις βασικές προτεραιότητες και αν έχει νόημα να δουλέψουμε μαζί.</p><a class="button" href="${bookingUrl}" target="_blank" rel="noopener">Δες διαθέσιμες ώρες ${external}</a></div><div><p class="eyebrow">Ή επικοινώνησε άμεσα</p><div class="contact-options"><div class="contact-option"><strong>Email</strong><a href="mailto:redstar@transportmarketing.net">redstar@transportmarketing.net</a></div><div class="contact-option"><strong>Τηλέφωνο</strong><a href="tel:+306989442438">+30 698 944 2438</a></div><div class="contact-option"><strong>WhatsApp</strong><a href="https://wa.me/306989442438" target="_blank" rel="noopener">Άνοιγμα συνομιλίας</a></div></div></div></div></section>`;
write('contact/index.html', page({ title: 'Επικοινωνία | RedStar', description: 'Κλείσε μια σύντομη κλήση με τη RedStar ή επικοινώνησε άμεσα για το επόμενο ψηφιακό έργο σου.', route: '/contact/', prefix: '../', body: contactBody }));

const legalPages = [
  {
    slug: 'privacy', title: 'Απόρρητο', description: 'Πώς η RedStar συλλέγει, χρησιμοποιεί και προστατεύει προσωπικά δεδομένα.', lead: 'Τι κρατάμε. Γιατί. Για πόσο.', content: `
      <p>Τελευταία ενημέρωση: Οκτώβριος 2026</p>
      <h2>Ποιος είναι υπεύθυνος</h2><p>Υπεύθυνος επεξεργασίας είναι η RedStar, Ξενοκλέους 25, Αθήνα. Επικοινωνία: <a href="mailto:redstar@transportmarketing.net">redstar@transportmarketing.net</a> ή +30 698 944 2438.</p>
      <h2>Τι δεδομένα μπορεί να λάβουμε</h2><ul><li>Στοιχεία που στέλνεις με email, τηλέφωνο ή WhatsApp.</li><li>Στοιχεία που δίνεις όταν κλείνεις κλήση στην εξωτερική υπηρεσία Google Calendar.</li><li>Τεχνικά αρχεία του server, όπως διεύθυνση IP, ώρα πρόσβασης και browser.</li><li>Ανώνυμα ή ψευδωνυμοποιημένα στατιστικά μέσω Google Analytics, μόνο αφού επιλέξεις Αποδοχή.</li></ul>
      <h2>Γιατί τα χρησιμοποιούμε</h2><p>Για να απαντήσουμε στο αίτημά σου, να οργανώσουμε πιθανή ή ενεργή συνεργασία, να προστατεύσουμε τον ιστότοπο και, με συγκατάθεση, να καταλάβουμε ποιες σελίδες είναι χρήσιμες.</p>
      <h2>Νομική βάση</h2><p>Η επεξεργασία βασίζεται στη συγκατάθεση, σε βήματα πριν από σύμβαση ή στην εκτέλεσή της, σε νόμιμες υποχρεώσεις και στο έννομο συμφέρον για ασφάλεια του ιστότοπου.</p>
      <h2>Ποιος μπορεί να τα λάβει</h2><p>Πάροχοι φιλοξενίας, Google όταν χρησιμοποιείς το ημερολόγιο ή αποδέχεσαι analytics, επαγγελματικοί σύμβουλοι και δημόσιες αρχές όταν απαιτείται από τον νόμο. Δεν πουλάμε προσωπικά δεδομένα.</p>
      <h2>Χρόνος διατήρησης</h2><p>Αιτήματα επικοινωνίας διατηρούνται έως 12 μήνες, εκτός αν προκύψει συνεργασία ή νομική υποχρέωση. Οικονομικά στοιχεία τηρούνται όσο απαιτεί η νομοθεσία. Τα στατιστικά ακολουθούν τις ρυθμίσεις διατήρησης του Google Analytics.</p>
      <h2>Τα δικαιώματά σου</h2><p>Μπορείς να ζητήσεις πρόσβαση, διόρθωση, διαγραφή, περιορισμό, φορητότητα ή εναντίωση. Μπορείς επίσης να ανακαλέσεις συγκατάθεση. Στείλε email στο <a href="mailto:redstar@transportmarketing.net">redstar@transportmarketing.net</a>. Έχεις δικαίωμα καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα.</p>
      <h2>Cookies</h2><p>Οι λεπτομέρειες για την αποθήκευση προτίμησης και τα προαιρετικά στατιστικά βρίσκονται στην <a href="../cookies/index.html">Πολιτική Cookies</a>.</p>`
  },
  {
    slug: 'terms', title: 'Όροι', description: 'Οι βασικοί όροι χρήσης του ιστοτόπου της RedStar.', lead: 'Απλοί όροι χρήσης.', content: `
      <p>Τελευταία ενημέρωση: Οκτώβριος 2026</p>
      <h2>Χρήση του ιστοτόπου</h2><p>Ο ιστότοπος παρουσιάζει τη RedStar, τις υπηρεσίες, τα έργα και τρόπους επικοινωνίας. Με τη χρήση του συμφωνείς να ενεργείς νόμιμα και να μην επιχειρείς μη εξουσιοδοτημένη πρόσβαση, παρεμβολή ή κακόβουλη χρήση.</p>
      <h2>Υπηρεσίες</h2><p>Οι πληροφορίες και οι ενδεικτικές τιμές του ιστοτόπου δεν αποτελούν δεσμευτική προσφορά. Κάθε συνεργασία ορίζεται με ξεχωριστή γραπτή πρόταση ή συμφωνία που περιγράφει scope, κόστος και όρους.</p>
      <h2>Πνευματική ιδιοκτησία</h2><p>Κείμενα, σχέδια, λογότυπα και πρωτότυπο υλικό ανήκουν στη RedStar ή στους αντίστοιχους δικαιούχους. Δεν επιτρέπεται αναπαραγωγή ή εμπορική χρήση χωρίς άδεια.</p>
      <h2>Έργα τρίτων</h2><p>Ορισμένες εικόνες και εμπορικά σήματα στο portfolio ανήκουν στους πελάτες ή στους δικαιούχους τους και εμφανίζονται για παρουσίαση της συνεργασίας.</p>
      <h2>Εξωτερικοί σύνδεσμοι</h2><p>Ο ιστότοπος συνδέεται με υπηρεσίες τρίτων. Η διαθεσιμότητα, το περιεχόμενο και οι πολιτικές τους δεν ελέγχονται από τη RedStar.</p>
      <h2>Διαθεσιμότητα και ευθύνη</h2><p>Καταβάλλεται εύλογη προσπάθεια για σωστή και ενημερωμένη πληροφορία, χωρίς εγγύηση αδιάλειπτης λειτουργίας ή απόλυτης πληρότητας. Στον βαθμό που επιτρέπει ο νόμος, η RedStar δεν ευθύνεται για έμμεση ζημία από τη χρήση του ιστοτόπου.</p>
      <h2>Αλλαγές και δίκαιο</h2><p>Οι όροι μπορεί να ενημερώνονται. Ισχύει το ελληνικό δίκαιο και αρμόδια είναι τα δικαστήρια της Αθήνας.</p>
      <h2>Επικοινωνία</h2><p>Για ερώτηση σχετικά με τους όρους, στείλε email στο <a href="mailto:redstar@transportmarketing.net">redstar@transportmarketing.net</a>.</p>`
  },
  {
    slug: 'cookies', title: 'Cookies', description: 'Ποια αποθήκευση χρησιμοποιεί ο ιστότοπος RedStar και πώς ελέγχεις την επιλογή σου.', lead: 'Απαραίτητα μόνο. Analytics με επιλογή.', content: `
      <p>Τελευταία ενημέρωση: Οκτώβριος 2026</p>
      <h2>Τι χρησιμοποιεί ο ιστότοπος</h2><p>Η βασική λειτουργία του ιστοτόπου δεν απαιτεί διαφημιστικά cookies. Αποθηκεύουμε τοπικά στον browser την επιλογή σου για τα στατιστικά, ώστε να μην εμφανίζεται ξανά το ίδιο μήνυμα.</p>
      <h2>Απαραίτητη αποθήκευση</h2><p>Η τιμή <strong>redstar-consent-v1</strong> αποθηκεύεται στο localStorage του browser. Περιέχει μόνο αν επέλεξες Αποδοχή ή Μόνο απαραίτητα. Δεν αναγνωρίζει την ταυτότητά σου.</p>
      <h2>Προαιρετικά στατιστικά</h2><p>Αν επιλέξεις Αποδοχή, φορτώνεται το Google Analytics. Μπορεί να δημιουργήσει cookies όπως <strong>_ga</strong> και <strong>_ga_*</strong> για μέτρηση επισκέψεων και χρήσης σελίδων. Δεν φορτώνεται πριν από συγκατάθεση.</p>
      <h2>Τρίτες υπηρεσίες</h2><p>Η κράτηση κλήσης ανοίγει το Google Calendar σε νέα σελίδα. Η Google εφαρμόζει τη δική της πολιτική απορρήτου και cookies. Οι γραμματοσειρές του ιστοτόπου παρέχονται επίσης από τη Google.</p>
      <h2>Αλλαγή επιλογής</h2><p>Μπορείς να διαγράψεις τα δεδομένα ιστοτόπου από τις ρυθμίσεις του browser. Στην επόμενη επίσκεψη θα εμφανιστεί ξανά η επιλογή. Μπορείς επίσης να μπλοκάρεις ή να διαγράψεις cookies από τις ρυθμίσεις απορρήτου του browser.</p>
      <h2>Επικοινωνία</h2><p>Για ερώτηση σχετικά με cookies ή προσωπικά δεδομένα, στείλε email στο <a href="mailto:redstar@transportmarketing.net">redstar@transportmarketing.net</a>.</p>`
  }
];

for (const legal of legalPages) {
  const body = `<section class="article-hero"><div class="article-hero__media"><img src="../${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div><div class="container"><h1>${legal.title}.</h1><p>${legal.lead}</p></div></section><article class="container legal-content">${legal.content}</article>`;
  write(`${legal.slug}/index.html`, page({ title: `${legal.title} | RedStar`, description: legal.description, route: `/${legal.slug}/`, prefix: '../', body }));
}

const featuredBlog = new Set([
  'apo-excel-se-custom-platforma-odigos-mme-ellada',
  'automatismoi-epikoinonias-pelaton-custom-systimata',
  'custom-efarmogi-vs-saas-ellinikes-epixeiriseis-2026',
  'custom-web-efarmogi-aftomatopoiisi-epixeirimatikon-diadikasion'
]);

const curatedArticles = {
  'apo-excel-se-custom-platforma-odigos-mme-ellada': {
    date: '2026-10-12',
    title: 'Πότε το Excel παύει να είναι αρκετό',
    description: 'Πέντε καθαρά σημάδια ότι η καθημερινή λειτουργία χρειάζεται ένα κοινό εργαλείο και όχι ακόμη ένα φύλλο εργασίας.',
    body: `<h2>Το Excel δεν είναι το πρόβλημα</h2><p>Για μια μικρή ομάδα είναι γρήγορο, γνώριμο και ευέλικτο. Το πρόβλημα ξεκινά όταν το ίδιο αρχείο προσπαθεί να γίνει πελατολόγιο, αποθήκη, ημερολόγιο, αναφορά και λίστα εργασιών μαζί.</p><p>Τότε η ομάδα δεν δουλεύει πάνω στην πληροφορία. Δουλεύει για να τη διατηρεί συγχρονισμένη.</p><h2>Πέντε σημάδια ότι έφτασες στο όριο</h2><ul><li>Υπάρχουν πολλές εκδόσεις του ίδιου αρχείου.</li><li>Μόνο ένας άνθρωπος ξέρει πώς λειτουργούν οι τύποι και οι στήλες.</li><li>Τα ίδια στοιχεία γράφονται ξανά σε email, τιμολόγηση ή άλλο σύστημα.</li><li>Ένα λάθος αντιγραφής μπορεί να επηρεάσει πελάτη ή παραγγελία.</li><li>Η διοίκηση δεν έχει καθαρή εικόνα χωρίς χειροκίνητη αναφορά.</li></ul><h2>Τι αλλάζει με ένα κοινό εργαλείο</h2><p>Όλοι βλέπουν την ίδια πληροφορία, με τα δικαιώματα που χρειάζονται. Οι επαναλαμβανόμενες κινήσεις μπορούν να γίνονται αυτόματα. Οι αποφάσεις βασίζονται σε τρέχοντα δεδομένα, όχι σε αρχείο που ενημερώθηκε την προηγούμενη εβδομάδα.</p><h2>Μην ξεκινήσεις από τις λειτουργίες</h2><p>Ξεκίνα από μία δύσκολη ροή: από πού έρχεται η πληροφορία, ποιος την αγγίζει και πού χάνεται χρόνος. Η πρώτη έκδοση πρέπει να λύνει αυτό. Όχι να αντιγράφει κάθε στήλη που υπάρχει σήμερα.</p><h2>Η σωστή ερώτηση</h2><p>Δεν είναι «χρειαζόμαστε εφαρμογή;». Είναι «πόσο μας κοστίζει σήμερα η διπλή καταχώρηση, η αναζήτηση και το λάθος;». Αν η απάντηση είναι σαφής, μπορεί να γίνει και η επόμενη απόφαση.</p>`
  },
  'automatismoi-epikoinonias-pelaton-custom-systimata': {
    date: '2026-10-12',
    title: 'Αυτοματισμοί επικοινωνίας που δεν ακούγονται ρομποτικοί',
    description: 'Πού βοηθά πραγματικά η αυτοματοποίηση στην επικοινωνία πελατών και πού χρειάζεται να παραμένει άνθρωπος.',
    body: `<h2>Η ταχύτητα δεν αρκεί</h2><p>Ένα άμεσο μήνυμα μπορεί να είναι χρήσιμο. Μπορεί επίσης να είναι άσχετο, ψυχρό ή ενοχλητικό. Η καλή αυτοματοποίηση δεν στέλνει περισσότερα. Στέλνει το σωστό μήνυμα όταν υπάρχει πραγματικός λόγος.</p><h2>Καλά σημεία για αυτοματοποίηση</h2><ul><li>Επιβεβαίωση ότι ένα αίτημα παραλήφθηκε.</li><li>Υπενθύμιση πριν από ραντεβού ή λήξη.</li><li>Ενημέρωση για την πορεία μιας παραγγελίας.</li><li>Εσωτερική ειδοποίηση όταν ένα αίτημα μένει χωρίς απάντηση.</li></ul><h2>Τι δεν πρέπει να αυτοματοποιείται εύκολα</h2><p>Παράπονα, ευαίσθητες αποφάσεις και συζητήσεις που χρειάζονται κρίση πρέπει να φτάνουν γρήγορα σε άνθρωπο. Η αυτοματοποίηση μπορεί να οργανώσει τη διαδρομή. Δεν χρειάζεται να προσποιείται ότι καταλαβαίνει κάθε περίπτωση.</p><h2>Ο πιο απλός κανόνας</h2><p>Κάθε μήνυμα πρέπει να απαντά σε τρεις ερωτήσεις: γιατί το λαμβάνει ο πελάτης, τι χρειάζεται να γνωρίζει και ποιο είναι το επόμενο βήμα. Αν δεν υπάρχει καθαρή απάντηση, το μήνυμα μάλλον δεν χρειάζεται να σταλεί.</p><h2>Ξεκίνα από ένα σημείο τριβής</h2><p>Διάλεξε μια επαναλαμβανόμενη καθυστέρηση που βλέπει και ο πελάτης. Διόρθωσέ την, μέτρησε το αποτέλεσμα και μετά προχώρησε στην επόμενη. Έτσι η αυτοματοποίηση μένει χρήσιμη και δεν γίνεται θόρυβος.</p>`
  },
  'custom-efarmogi-vs-saas-ellinikes-epixeiriseis-2026': {
    date: '2026-10-12',
    title: 'Έτοιμο εργαλείο ή εφαρμογή στα μέτρα σου;',
    description: 'Ένας πρακτικός τρόπος να αποφασίσεις χωρίς να ξεκινήσεις από τεχνολογία, μόδα ή υποσχέσεις.',
    body: `<h2>Ξεκίνα από τη διαδικασία, όχι από το προϊόν</h2><p>Ένα έτοιμο εργαλείο είναι συχνά η σωστή αρχή. Στήνεται γρήγορα, έχει προβλέψιμο κόστος και καλύπτει κοινές ανάγκες. Δεν υπάρχει λόγος να ξαναφτιάξεις κάτι που ήδη λειτουργεί καλά.</p><h2>Πότε το έτοιμο εργαλείο ταιριάζει</h2><ul><li>Η διαδικασία σου είναι συνηθισμένη και δεν αποτελεί ανταγωνιστικό πλεονέκτημα.</li><li>Η ομάδα χρειάζεται λύση άμεσα.</li><li>Οι βασικές συνδέσεις με τα άλλα εργαλεία σου υπάρχουν ήδη.</li><li>Το κόστος παραμένει λογικό καθώς αυξάνονται οι χρήστες.</li></ul><h2>Πότε αρχίζει να σε περιορίζει</h2><p>Το κόστος δεν είναι μόνο η συνδρομή. Είναι και η διπλή καταχώρηση, οι παρακάμψεις, τα αρχεία που εξάγονται για να διορθωθούν και ο χρόνος εκπαίδευσης σε μια ροή που δεν ταιριάζει στην επιχείρηση.</p><p>Αν τρία εργαλεία και δύο χειροκίνητα βήματα χρειάζονται για μία δουλειά, αξίζει να χαρτογραφηθεί μια διαφορετική λύση.</p><h2>Μην αποφασίσεις με υποθετικούς αριθμούς</h2><p>Κατέγραψε για δύο εβδομάδες πόσο χρόνο παίρνει η σημερινή ροή, πόσα λάθη εμφανίζονται και ποια σημεία επαναλαμβάνονται. Με αυτά τα δεδομένα μπορείς να συγκρίνεις επιλογές χωρίς αυθαίρετες υποσχέσεις απόδοσης.</p><h2>Η απόφαση μπορεί να είναι υβριδική</h2><p>Συχνά η καλύτερη λύση κρατά ένα καλό έτοιμο εργαλείο και προσθέτει ένα μικρό σύστημα που ενώνει τα κενά. Το ζητούμενο δεν είναι να είναι όλα custom. Είναι να δουλεύουν μαζί χωρίς να κουράζουν την ομάδα.</p>`
  },
  'custom-web-efarmogi-aftomatopoiisi-epixeirimatikon-diadikasion': {
    date: '2026-09-18',
    title: 'Πριν αυτοματοποιήσεις μια διαδικασία, καθάρισέ την',
    description: 'Η αυτοματοποίηση δεν διορθώνει μια μπερδεμένη ροή. Πώς να βρεις το σωστό πρώτο βήμα.',
    body: `<h2>Η ταχύτητα μεγαλώνει και τα λάθη</h2><p>Αν μια διαδικασία έχει διπλές εγκρίσεις, ασάφεια και περιττές μεταφορές δεδομένων, η αυτοματοποίηση μπορεί απλώς να κάνει το μπέρδεμα πιο γρήγορο.</p><h2>Γράψε τι συμβαίνει σήμερα</h2><p>Όχι τι θα έπρεπε να συμβαίνει. Κατέγραψε ποιος ξεκινά τη δουλειά, ποια πληροφορία χρειάζεται, πού περιμένει και πότε θεωρείται ολοκληρωμένη. Οι εξαιρέσεις είναι συνήθως πιο σημαντικές από τον ιδανικό κανόνα.</p><h2>Χώρισε τις κινήσεις σε τρεις ομάδες</h2><ul><li>Αποφάσεις που χρειάζονται άνθρωπο.</li><li>Επαναλήψεις που μπορούν να γίνουν αυτόματα.</li><li>Βήματα που μπορούν απλώς να αφαιρεθούν.</li></ul><p>Η τρίτη ομάδα έχει συχνά τη μεγαλύτερη αξία. Δεν χρειάζεται να αυτοματοποιήσεις κάτι που δεν χρειάζεται να υπάρχει.</p><h2>Διάλεξε ένα μετρήσιμο αποτέλεσμα</h2><p>Λιγότερος χρόνος για καταχώρηση, λιγότερα χαμένα αιτήματα ή πιο γρήγορη απάντηση. Ένα πρώτο έργο με έναν σαφή δείκτη είναι ευκολότερο να ελεγχθεί και να βελτιωθεί.</p><h2>Χτίσε μικρή πρώτη έκδοση</h2><p>Η ομάδα πρέπει να χρησιμοποιήσει το εργαλείο πριν αποφασίσει τι λείπει. Μια περιορισμένη έκδοση αποκαλύπτει την πραγματική συμπεριφορά και μειώνει το κόστος λανθασμένων υποθέσεων.</p>`
  }
};

const blogEntries = [];
const blogSlugs = fs.readdirSync(path.join(root, 'blog')).sort();
for (const slug of blogSlugs) {
  const file = path.join(root, 'blog', slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, 'utf8');
  const titleMatch = original.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const descriptionMatch = original.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const dateMatch = original.match(/article:published_time"?\s+content="(\d{4}-\d{2}-\d{2})"/i);
  const contentMatch = original.match(/<div class="article-content">([\s\S]*?)<\/div>\s*<aside/i);
  if (!titleMatch || !contentMatch) continue;
  const curated = curatedArticles[slug];
  const title = curated?.title || cleanText(titleMatch[1]);
  const description = curated?.description || (descriptionMatch ? cleanText(descriptionMatch[1]) : title);
  const date = curated?.date || dateMatch?.[1] || '';
  const indexed = true;
  let content = curated?.body || contentMatch[1].replace(/<p class="article-meta">[\s\S]*?<\/p>/i, '').trim();
  content = content.replace(/href="\/([^"#?]+)\/?"/g, (full, linkedSlug) => blogSlugs.includes(linkedSlug) ? `href="../${linkedSlug}/index.html"` : full);
  blogEntries.push({ slug, title, description, date, indexed });
  const articleBody = `<article><section class="article-hero"><div class="article-hero__media"><img src="../../${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div><div class="container"><h1>${escapeText(title)}</h1><p>${escapeText(description)}</p></div></section><div class="container article-layout"><div class="article-content">${content}</div><aside class="article-aside" aria-label="Στοιχεία άρθρου"><div class="article-aside__panel"><strong>Συντάκτης</strong><span>Αλέξανδρος Κούρτης</span></div>${date ? `<div class="article-aside__panel"><strong>Ημερομηνία</strong><span>${new Intl.DateTimeFormat('el-GR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00Z`))}</span></div>` : ''}<div class="article-aside__panel"><a href="../index.html">Όλες οι σημειώσεις</a></div></aside></div></article>${finalCta()}`;
  write(`blog/${slug}/index.html`, page({ title: `${title} | RedStar`, description, route: `/blog/${slug}/`, prefix: '../../', active: 'blog', body: articleBody, robots: indexed ? undefined : 'noindex, follow', type: 'article' }));
}

const visibleBlogEntries = blogEntries.sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title, 'el'));
const featuredBlogEntries = visibleBlogEntries.filter((entry) => featuredBlog.has(entry.slug));
const archiveBlogEntries = visibleBlogEntries.filter((entry) => !featuredBlog.has(entry.slug));
const blogBody = `<section class="article-hero"><div class="article-hero__media"><img src="../${nebula}" alt="" width="1920" height="1080" fetchpriority="high"></div><div class="container"><h1>Χρήσιμες σημειώσεις.</h1><p>Πρακτικά. Σύντομα.</p></div></section><section class="section"><div class="container"><div class="blog-list">${featuredBlogEntries.map((entry) => `<a class="blog-card" href="${entry.slug}/index.html"><span class="blog-card__meta">${new Intl.DateTimeFormat('el-GR', { month: 'short', year: 'numeric' }).format(new Date(`${entry.date}T12:00:00Z`))}</span><div><h2>${escapeText(entry.title)}</h2><p>${escapeText(entry.description)}</p></div>${external}</a>`).join('')}</div></div></section><section class="section section--soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Αρχείο</p><h2>Όλες οι σημειώσεις.</h2></div><p>${archiveBlogEntries.length} ακόμη άρθρα, χωρίς περιττές περιγραφές.</p></div><div class="blog-archive">${archiveBlogEntries.map((entry) => `<a class="blog-archive__item" href="${entry.slug}/index.html"><h3>${escapeText(entry.title)}</h3>${arrow}</a>`).join('')}</div></div></section>${finalCta()}`;
write('blog/index.html', page({ title: 'Σημειώσεις | RedStar', description: 'Πρακτικές σημειώσεις για ιστοσελίδες, e-shop, αυτοματισμούς και ψηφιακές αποφάσεις επιχειρήσεων.', route: '/blog/', prefix: '../', active: 'blog', body: blogBody }));

const notFoundBody = `<section class="article-hero"><div class="article-hero__media"><img src="${nebula}" alt="" width="1920" height="1080"></div><div class="container"><p class="eyebrow">404</p><h1>Αυτή η σελίδα δεν υπάρχει.</h1><p>Μπορείς να επιστρέψεις στην αρχική ή να δεις τα έργα.</p><div class="hero__actions"><a class="button" href="index.html">Αρχική</a><a class="button button--glass" href="portfolio/index.html">Έργα</a></div></div></section>`;
write('404.html', page({ title: 'Η σελίδα δεν βρέθηκε | RedStar', description: 'Η σελίδα που ζήτησες δεν υπάρχει.', route: '/404.html', body: notFoundBody, robots: 'noindex, follow' }));

const sitemapRoutes = [
  '/', '/services/website-development/', '/services/eshop-development/', '/services/custom-web-apps/',
  '/portfolio/', ...projects.map((project) => `/portfolio/${project.slug}/`), '/about/', '/contact/', '/blog/',
  ...visibleBlogEntries.map((entry) => `/blog/${entry.slug}/`), '/privacy/', '/terms/', '/cookies/'
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url><loc>${canonicalRoot}${route}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`Generated homepage, ${servicePages.length} outcome pages, ${projects.length} case studies and ${blogEntries.length} article shells.`);
