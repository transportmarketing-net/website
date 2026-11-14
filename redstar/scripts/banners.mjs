import { readFileSync } from 'node:fs';

const booking = 'https://calendar.app.google/BivggDamyF6eLgFb6';
const whatsapp = 'https://wa.me/306989442438';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function enquiryBanner(prefix = '', service = '') {
  const quote = `${prefix}contact/index.html${service ? '?service=' + encodeURIComponent(service) : ''}#quote-request`;
  return `<section class="rs-banner rs-banner--enquiry" id="enquiry-banner" aria-labelledby="enquiry-heading">
    <div class="rs-banner__inner">
      <div class="rs-banner__copy">
        <p class="rs-banner__eyebrow">Το επόμενο βήμα</p>
        <h2 id="enquiry-heading">Ας συζητήσουμε το έργο σας.</h2>
        <p>Πείτε μου τι χρειάζεται η επιχείρησή σας. Θα συζητήσουμε τις προτεραιότητες και τα επόμενα βήματα.</p>
      </div>
      <div class="rs-banner__contact">
        <div class="rs-banner__actions">
          <a class="rs-banner__button" href="${booking}" target="_blank" rel="noopener">Κλείστε μια κλήση <span aria-hidden="true">↗</span></a>
          <a class="rs-banner__button rs-banner__button--secondary" href="${quote}">Ζητήστε προσφορά</a>
        </div>
        <a class="rs-banner__whatsapp" href="${whatsapp}" target="_blank" rel="noopener">Μιλήστε μου στο WhatsApp <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>`;
}

export function featuredProjectBanner(prefix = '') {
  const projects = JSON.parse(readFileSync(new URL('../sitepad-data/portfolio-projects.json', import.meta.url), 'utf8'));
  const project = projects.find(project => project.slug === 'helppoint-volunteer-platform');
  if (!project) throw new Error('HelpPoint project missing');
  return `<section class="rs-banner rs-banner--project" id="featured-project" aria-labelledby="featured-heading">
    <div class="rs-banner__inner">
      <div class="rs-banner__copy">
        <p class="rs-banner__eyebrow">Επιλεγμένο έργο</p>
        <h2 id="featured-heading">${esc(project.title)}</h2>
        <p>${esc(project.summary)}</p>
        <ul class="rs-banner__capabilities" aria-label="Λειτουργίες"><li>Εθελοντές</li><li>Δράσεις</li><li>Βάρδιες</li></ul>
        <div><a class="rs-banner__button" href="${prefix}portfolio/${project.slug}/index.html">Δείτε το έργο <span aria-hidden="true">→</span></a></div>
      </div>
      <div class="rs-banner__preview"><img src="${prefix}${project.image}" alt="${esc(project.imageAlt || project.title)}" width="${project.imageWidth || 1440}" height="${project.imageHeight || 900}" loading="lazy" decoding="async"></div>
    </div>
  </section>`;
}

export function quoteRequestForm(serviceLabels = []) {
  const field = (name, label, type, autocomplete, extra = '') => `<div class="rs-quote__field"><label for="quote-${name}">${label}</label><input id="quote-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" aria-describedby="quote-${name}-error" ${extra}><span class="rs-quote__error" id="quote-${name}-error" data-field-error="${name}" hidden></span></div>`;
  return `<section class="rs-quote" id="quote-request" aria-labelledby="quote-heading">
    <div class="rs-quote__inner">
      <div class="rs-banner__copy">
        <p class="rs-banner__eyebrow">Ζητήστε προσφορά</p>
        <h2 id="quote-heading">Πείτε μου τι έχετε στο μυαλό σας.</h2>
        <p>Αφήστε τα στοιχεία σας και λίγα λόγια για το έργο. Θα επικοινωνήσω μαζί σας για να δούμε τι χρειάζεται.</p>
        <p>Τα πεδία με * είναι απαραίτητα.</p>
      </div>
      <div class="rs-quote__panel">
        <form id="quote-request-form" data-quote-endpoint="https://manage.redstar.transportmarketing.net/api/public/quote-requests" method="post">
          <div class="rs-quote__grid">
            ${field('name', 'Όνομα *', 'text', 'name', 'required maxlength="255"')}
            ${field('phone', 'Τηλέφωνο *', 'tel', 'tel', 'required maxlength="40"')}
            ${field('email', 'Email (προαιρετικό)', 'email', 'email', 'maxlength="255"')}
            ${field('service', 'Υπηρεσία (προαιρετικό)', 'text', 'off', 'maxlength="120" list="quote-services"')}
          </div>
          <datalist id="quote-services">${serviceLabels.map(label => `<option value="${esc(label)}"></option>`).join('')}</datalist>
          <div class="rs-quote__field"><label for="quote-message">Λίγα λόγια για το έργο (προαιρετικό)</label><textarea id="quote-message" name="message" rows="5" maxlength="5000" aria-describedby="quote-message-error"></textarea><span class="rs-quote__error" id="quote-message-error" data-field-error="message" hidden></span></div>
          <div class="rs-quote__trap" aria-hidden="true"><label for="quote-company-website">Αφήστε το κενό</label><input id="quote-company-website" name="company_website" tabindex="-1" autocomplete="off"></div>
          <p class="rs-quote__privacy">Τα στοιχεία σας χρησιμοποιούνται για να απαντήσω στο αίτημά σας. <a href="../privacy/index.html">Πολιτική απορρήτου</a></p>
          <div class="rs-quote__feedback rs-quote__error" data-quote-error role="alert" tabindex="-1" hidden></div>
          <button class="rs-banner__button" type="submit" disabled><svg class="rs-quote__spinner" viewBox="0 0 24 24" aria-hidden="true" hidden><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="42 15"/></svg><span data-submit-label>Αποστολή αιτήματος</span></button>
          <noscript><p>Για τη φόρμα απαιτείται JavaScript. Καλέστε στο <a href="tel:+306989442438">+30 698 944 2438</a> ή στείλτε <a href="${whatsapp}">μήνυμα στο WhatsApp</a>.</p></noscript>
        </form>
        <div class="rs-quote__success" data-quote-success role="status" tabindex="-1" hidden><h3>Το αίτημά σας αποθηκεύτηκε.</h3><p>Θα επικοινωνήσω μαζί σας για τα επόμενα βήματα.</p></div>
      </div>
    </div>
  </section>`;
}

export function refreshHomepageBanners(html) {
  if (!html.includes('href="assets/css/banners.css"')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="assets/css/banners.css">\n</head>');
  }
  html = html.replace(/\/\* QUOTE MODAL \*\/[\s\S]*?@media \(max-width: 500px\) \{ \.rs-quote-panel[^\n]*\}\s*\n/, '');
  html = html.replace(/<!-- QUOTE MODAL -->[\s\S]*?<\/script>\s*/, '');
  const featurePattern = /<section class="rs-banner rs-banner--project"[\s\S]*?<\/section>/;
  if (featurePattern.test(html)) html = html.replace(featurePattern, featuredProjectBanner());
  else {
    const marker = '<!-- redstar-portfolio:end -->';
    if (!html.includes(marker)) throw new Error('Homepage portfolio boundary missing');
    html = html.replace(marker, marker + '\n' + featuredProjectBanner());
  }
  const enquiryPattern = /<section class="rs-banner rs-banner--enquiry"[\s\S]*?<\/section>/;
  if (enquiryPattern.test(html)) html = html.replace(enquiryPattern, enquiryBanner());
  else html = html.replace('<section class="rs-payments" id="payment-methods"', enquiryBanner() + '\n<section class="rs-payments" id="payment-methods"');
  return html;
}
