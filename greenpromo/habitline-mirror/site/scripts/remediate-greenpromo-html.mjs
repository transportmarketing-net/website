import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pages = [
  'index.html',
  'about.html',
  'pricing.html',
  'faqs.html',
  'contact.html',
  'waitlist.html',
  'download.html',
  'privacy-policy.html',
];

const replaceAll = (value, from, to) => value.split(from).join(to);

function commonPageFixes(html) {
  html = replaceAll(
    html,
    'href="https://www.apple.com/in/app-store/" target="_blank" aria-label="App Store"',
    'href="tel:+302103007716" aria-label="Καλέστε τη GreenPromo"',
  );
  html = replaceAll(
    html,
    'href="https://play.google.com/store/games?device=windows" target="_blank" aria-label="App Store"',
    'href="https://wa.me/306989442438" target="_blank" rel="noopener" aria-label="WhatsApp GreenPromo"',
  );
  html = replaceAll(html, 'images/icons/app-store.svg', 'images/greenpromo/phone.svg');
  html = replaceAll(html, 'images/icons/play-store.svg', 'images/greenpromo/whatsapp.svg');
  html = replaceAll(html, 'https://unifato.comservices.html', 'download.html');
  html = replaceAll(
    html,
    'Develop by <a href="https://unifato.com/" class="text-default-900 font-medium hover:underline">Unifato</a>',
    'GreenPromo · Αθήνα &amp; Αττική',
  );
  return html;
}

function remediateIndex(html) {
  const direct = new Map([
    ['images/greenpromo/hero-background.webp', 'images/greenpromo/hero-background-v2.webp'],
    ['images/greenpromo/hero-hand-to-hand.webp', 'images/greenpromo/hero-handout-v2.webp'],
    ['images/greenpromo/hero-reporting.webp', 'images/greenpromo/reporting-dashboard-v2.png'],
    ['images/greenpromo/hero-business.webp', 'images/greenpromo/hero-business-v2.webp'],
    ['images/greenpromo/square-door.webp', 'images/greenpromo/square-door-v2.webp'],
    ['images/greenpromo/square-hand.webp', 'images/greenpromo/square-handout-v2.webp'],
    ['images/greenpromo/square-business.webp', 'images/greenpromo/square-business-v2.webp'],
    ['images/greenpromo/square-report.webp', 'images/greenpromo/square-report-v2.webp'],
    ['images/greenpromo/phone-reporting.webp', 'images/greenpromo/reporting-dashboard-v2.png'],
    ['images/greenpromo/landscape-door.webp', 'images/greenpromo/landscape-door-v2.webp'],
    ['images/greenpromo/landscape-hand.webp', 'images/greenpromo/landscape-handout-v2.webp'],
    ['images/greenpromo/landscape-business.webp', 'images/greenpromo/landscape-business-v2.webp'],
    ['images/greenpromo/landscape-report.webp', 'images/greenpromo/landscape-report-v2.webp'],
    ['images/greenpromo/door-to-door.webp', 'images/greenpromo/portrait-door-v2.webp'],
    ['images/greenpromo/hand-to-hand.webp', 'images/greenpromo/portrait-handout-v2.webp'],
    ['images/greenpromo/business-distribution.webp', 'images/greenpromo/portrait-business-v2.webp'],
    ['images/greenpromo/reporting.webp', 'images/greenpromo/portrait-print-v2.webp'],
  ]);
  for (const [from, to] of direct) html = replaceAll(html, from, to);

  html = replaceAll(html, 'object-coverr', 'object-cover');
  html = replaceAll(html, 'alt="Διανομή φυλλαδίων πόρτα-πόρτα στην Αθήνα"', 'alt="Ενδεικτική εικόνα οργανωμένης διανομής φυλλαδίων"');
  html = replaceAll(html, 'alt="Προωθήτρια παραδίδει φυλλάδιο σε περαστικό στην Αθήνα"', 'alt="Ενδεικτική εικόνα χέρι-με-χέρι διανομής φυλλαδίων"');
  html = replaceAll(html, '>12</span>', '>6</span>');
  html = replaceAll(html, '>7</span>', '>5</span>');

  // Each process tab gets an image composed specifically for its step.
  html = html.replace(
    /(<div id="tabs-2"[\s\S]*?<img src=")images\/greenpromo\/landscape-handout-v2\.webp/,
    '$1images/greenpromo/landscape-athens-v2.webp',
  );
  html = html.replace(
    /(<div id="tabs-3"[\s\S]*?<img src=")images\/greenpromo\/landscape-business-v2\.webp/,
    '$1images/greenpromo/landscape-handout-v2.webp',
  );
  html = html.replace(
    /(<h3[^>]*>\s*Σχεδιασμός &amp; Εκτύπωση[\s\S]*?<img src=")images\/greenpromo\/landscape-report-v2\.webp/,
    '$1images/greenpromo/landscape-print-v2.webp',
  );

  // Give the animated image wall and feedback cards visual variety without altering their DOM.
  const variety = [
    'square-door-v2.webp',
    'square-handout-v2.webp',
    'square-business-v2.webp',
    'square-print-v2.webp',
    'square-athens-v2.webp',
    'square-report-v2.webp',
    'square-customer-v2.webp',
    'square-production-v2.webp',
    'square-mailboxes-v2.webp',
  ];
  let varietyIndex = 0;
  html = html.replace(
    /images\/greenpromo\/square-(?:door|handout|business|report)-v2\.webp/g,
    () => `images/greenpromo/${variety[varietyIndex++ % variety.length]}`,
  );

  // Coverage thumbnails should match the corresponding moving scene.
  const coverageStart = html.indexOf('id="coverage"');
  const coverageEnd = html.indexOf('id="smart-assist"');
  if (coverageStart !== -1 && coverageEnd !== -1) {
    const before = html.slice(0, coverageStart);
    let coverage = html.slice(coverageStart, coverageEnd);
    const coverageImages = [
      'square-athens-v2.webp',
      'square-handout-v2.webp',
      'square-business-v2.webp',
      'square-door-v2.webp',
      'square-print-v2.webp',
    ];
    let i = 0;
    coverage = coverage.replace(
      /images\/greenpromo\/square-[a-z-]+-v2\.webp/g,
      () => `images/greenpromo/${coverageImages[i++ % coverageImages.length]}`,
    );
    html = before + coverage + html.slice(coverageEnd);
  }

  return html;
}

function remediateAbout(html) {
  const replacements = new Map([
    ['https://unifato.com/images/workspace/cloud-04.webp', 'images/locations/cloud-04.webp'],
    ['https://unifato.com/images/workspace/cloud-01.webp', 'images/locations/cloud-01.webp'],
    ['images/about/about-image.webp', 'images/greenpromo/about-hero-v2.webp'],
    ['images/about/about-image-01.webp', 'images/greenpromo/about-athens-v2.webp'],
    ['images/event/phone-image.png', 'images/greenpromo/reporting-dashboard-v2.png'],
    ['images/about/about-image-02.webp', 'images/greenpromo/about-print-v2.webp'],
    ['images/workspace/mobile-image.png', 'images/greenpromo/reporting-dashboard-v2.png'],
    ['images/team/avatar-01.webp', 'images/greenpromo/square-business-v2.webp'],
    ['images/team/avatar-02.webp', 'images/greenpromo/square-handout-v2.webp'],
    ['images/team/avatar-03.webp', 'images/greenpromo/square-print-v2.webp'],
    ['images/team/team-image-01.webp', 'images/greenpromo/portrait-business-v2.webp'],
  ]);
  for (const [from, to] of replacements) html = replaceAll(html, from, to);

  const remoteTeam = /https:\/\/cdn\.prod\.website-files\.com\/[^"\s]+team-image-0([2-6])\.webp/g;
  const teamSources = [
    'portrait-handout-v2.webp',
    'portrait-owner-v2.webp',
    'portrait-print-v2.webp',
    'portrait-athens-v2.webp',
    'portrait-door-v2.webp',
  ];
  html = html.replace(remoteTeam, (_match, number) => `images/greenpromo/${teamSources[Number(number) - 2]}`);

  // Repurpose existing dashboard slots with field/report imagery while preserving their wrappers.
  html = replaceAll(html, 'images/workspace/dashboard-06.svg', 'images/greenpromo/landscape-report-v2.webp');
  html = replaceAll(html, 'images/workspace/dashboard-05.svg', 'images/greenpromo/landscape-athens-v2.webp');
  html = replaceAll(html, 'images/workspace/dashboard-04.svg', 'images/greenpromo/landscape-handout-v2.webp');
  html = replaceAll(html, 'images/workspace/dashboard-01.svg', 'images/greenpromo/square-production-v2.webp');

  // High-impact copy that was still inherited from the app template.
  const copy = new Map([
    ['About the App', 'Σχετικά με τη GreenPromo'],
    ['A simpler way to build habits', 'Οργανωμένη διανομή, με καθαρή τεκμηρίωση'],
    ['Download the app', 'Ζητήστε προσφορά'],
    ['Trusted by worldwide', 'Για επιχειρήσεις σε όλη την Αττική'],
    ['Trusted worldwide', 'Υπηρεσίες για κάθε τύπο καμπάνιας'],
    ['Build better habits with less effort', 'Σχεδιάζουμε τη διανομή γύρω από τον στόχο σας'],
    ['Track what matters, stay organized, and improve at your own pace.', 'Ποσότητα, ζώνες, μέθοδος και τεκμηρίωση συμφωνούνται πριν ξεκινήσει η ομάδα.'],
    ['Download for iPhone', 'Καλέστε μας'],
    ['Get it on Android', 'WhatsApp'],
    ['Scan the QR code to download the app', 'Η καμπάνια σας, οργανωμένη από την αρχή έως την αναφορά'],
    ['Our Team', 'Η ομάδα πεδίου'],
    ['The people who', 'Οι άνθρωποι που'],
    ['drive the work', 'οργανώνουν τη διανομή'],
  ]);
  for (const [from, to] of copy) html = replaceAll(html, from, to);

  return html;
}

function remediateDownload(html) {
  html = replaceAll(html, 'images/workspace/decoration.webp', 'images/greenpromo/reporting-kit-v2.webp');
  html = replaceAll(html, 'images/workspace/phone-image.png', 'images/greenpromo/reporting-dashboard-v2.png');
  html = replaceAll(html, 'images/icons/app-storebox.svg', 'images/greenpromo/phone.svg');
  html = replaceAll(html, 'images/icons/google-playbox.svg', 'images/greenpromo/whatsapp.svg');
  html = replaceAll(html, 'images/icons/icon-39.svg', 'images/greenpromo/square-report-v2.webp');
  html = replaceAll(html, 'Start building better habits today', 'Όλες οι υπηρεσίες διανομής, σε μία οργανωμένη ροή');
  html = replaceAll(html, 'Download GreenPromo to build routines that adjust to your day. Track habits get smart suggestions that help you stay consistent without pressure.', 'Πόρτα-πόρτα, χέρι-με-χέρι, επιχειρήσεις, στοχευμένες ζώνες, σχεδιασμός και εκτύπωση — με σαφή συμφωνία πριν από την έναρξη.');
  html = replaceAll(html, 'Countries using GreenPromo', 'βασικές περιοχές κάλυψης');
  html = replaceAll(html, 'Sessions completed per user', 'μέθοδοι διανομής');
  html = replaceAll(html, '>32<', '>6<');
  html = replaceAll(html, '>46<', '>5<');
  html = replaceAll(html, 'Scan here <br> to download', 'Στείλτε μας <br> τις ανάγκες σας');
  return html;
}

function remediateContact(html) {
  html = replaceAll(html, 'images/workspace/phone-image.png', 'images/greenpromo/reporting-dashboard-v2.png');
  html = replaceAll(html, 'alt="Dashboard Image"', 'alt="Ενδεικτικό dashboard αναφοράς διανομής"');
  return html;
}

for (const page of pages) {
  const file = path.join(root, page);
  let html = fs.readFileSync(file, 'utf8');
  html = commonPageFixes(html);
  if (page === 'index.html') html = remediateIndex(html);
  if (page === 'about.html') html = remediateAbout(html);
  if (page === 'download.html') html = remediateDownload(html);
  if (page === 'contact.html') html = remediateContact(html);
  fs.writeFileSync(file, html);
  console.log(`Remediated ${page}`);
}
