// Shared restored sections for the static pages and the site generator.
const organizations = [
  ['Deree', 'https://sass.acg.edu/', 'deree', 'Deree, The American University of Greece', 'Ανάπτυξη web πλατφόρμας'],
  ['Μπορούμε', 'https://www.boroume.gr/', 'boroume', 'Μπορούμε', 'Εθελοντισμός, διάσωση τροφίμων'],
  ['Σχεδία', 'https://shedia-scheduler-xxrl6bxv.on-forge.com/', 'shedia', 'Σχεδία', 'Ανάπτυξη web εφαρμογής'],
  ['EAPN Greece', 'https://www.eapn.gr/', 'eapn', 'Ελληνικό Δίκτυο για την Καταπολέμηση της Φτώχειας', 'Ψηφιακή υποστήριξη, περιεχόμενο'],
  ['ΣΕΔΔ', 'http://seddevia.gr/', 'sedd', 'Σωματείο Εθελοντών Διασωστών Δασοπυροσβεστών Β.Κ. Εύβοιας', 'Ανάπτυξη ιστοσελίδας'],
];

export function supportedOrganizations(prefix = '') {
  return `<section class="section supported-organizations" aria-labelledby="supported-title">
  <div class="container">
    <div class="section-heading"><div><p class="eyebrow">Κοινωνική συνεισφορά</p><h2 id="supported-title">Οργανισμοί που υποστήριξα</h2></div><p>Με τεχνική υποστήριξη, ανάπτυξη εφαρμογών και εθελοντική προσφορά.</p></div>
    <div class="organization-list">${organizations.map(([name, url, logo, alt, role]) => `
      <a class="organization" href="${url}" target="_blank" rel="noopener"><span class="organization__logo"><img src="${prefix}sitepad-data/uploads/2026/05/logo-${logo}.png" alt="${alt}" width="180" height="96" loading="lazy"></span><strong>${name}</strong><span>${role}</span></a>`).join('')}
    </div>
  </div>
</section>`;
}

export function socialContribution() {
  return `<div class="social-contribution"><h3>Κοινωνική συνεισφορά</h3><p>Φτιάχνω εργαλεία και ιστοσελίδες δωρεάν για τη <a href="https://shedia.gr/" target="_blank" rel="noopener">Σχεδία</a> και το <a href="https://www.boroume.gr/" target="_blank" rel="noopener">Μπορούμε</a>. Η δουλειά αυτή δεν χρεώνεται.</p></div>`;
}

export function homeHero() {
  return `<section class="hero hero--studio">
  <div class="hero__media"><img src="sitepad-data/uploads/2026/05/redstar-space-crimson-nebula.jpg" alt="" width="1920" height="1080" fetchpriority="high"></div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="hero__eyebrow">Αλέξανδρος Κούρτης / Μηχανικός λογισμικού / Αθήνα</p>
      <h1>Εφαρμογές, ιστοσελίδες<br>&amp; e-shop.</h1>
      <p class="hero__lead">Φτιάχνω ιστοσελίδες, e-shop και εφαρμογές για μικρές επιχειρήσεις. Μιλάς απευθείας με τον μηχανικό που γράφει τον κώδικα, χωρίς μεσάζοντα.</p>
      <div class="hero__actions"><a class="button" href="portfolio/index.html">Δες τα έργα <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></a><a class="hero__contact" href="contact/index.html">Στείλε μήνυμα</a></div>
      <div class="hero__channels" aria-label="Άμεση επικοινωνία"><a href="https://wa.me/306989442438" target="_blank" rel="noopener">WhatsApp</a><a href="https://t.me/+306989442438" target="_blank" rel="noopener">Telegram</a><a href="tel:+306989442438">+30 698 944 2438</a></div>
    </div>
    <div class="browser-stage" aria-label="Δείγματα έργων">
      <figure class="browser-card"><div class="browser-card__bar"><span></span><span></span><span></span></div><picture><source srcset="sitepad-data/uploads/2026/05/optimized/project-helppoint.webp" type="image/webp"><img src="sitepad-data/uploads/2026/05/project-helppoint.png" alt="HelpPoint volunteer platform" width="1440" height="900" loading="lazy" decoding="async"></picture><figcaption class="browser-card__caption">HelpPoint</figcaption></figure>
      <figure class="browser-card"><div class="browser-card__bar"><span></span><span></span><span></span></div><picture><source srcset="sitepad-data/uploads/2026/05/optimized/project-ellinity.webp" type="image/webp"><img src="sitepad-data/uploads/2026/05/project-ellinity.png" alt="Ellinity tour operator SaaS" width="1440" height="900" loading="lazy" decoding="async"></picture><figcaption class="browser-card__caption">Ellinity</figcaption></figure>
      <figure class="browser-card"><div class="browser-card__bar"><span></span><span></span><span></span></div><picture><source srcset="sitepad-data/uploads/2026/05/optimized/project-pediatric.webp" type="image/webp"><img src="sitepad-data/uploads/2026/05/project-pediatric.png" alt="Η ιστοσελίδα της Δρ. Δόξας Κοτζιά" width="1440" height="900" decoding="async"></picture><figcaption class="browser-card__caption">Δρ. Δόξα Κοτζιά</figcaption></figure>
    </div>
  </div>
  <div class="hero__comet" aria-hidden="true"><img src="assets/images/redstar-comet.svg" alt="" width="1440" height="220"></div>
</section>`;
}
