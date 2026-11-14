import { readFileSync } from 'node:fs';

function details() {
  return JSON.parse(readFileSync(new URL('../sitepad-data/payment-details.json', import.meta.url), 'utf8'));
}

function escape(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function paymentMethods(prefix = '') {
  const account = details();
  const mark = brand => `<li class="rs-payments__mark">${brand.logo
    ? `<img src="${prefix}assets/images/payments/${encodeURIComponent(brand.logo)}" alt="${escape(brand.name)}" width="120" height="80" loading="lazy">`
    : `<span>${escape(brand.name)}</span>`}</li>`;
  return `<section class="rs-payments" id="payment-methods" aria-labelledby="payment-methods-heading">
    <div class="rs-payments__inner">
      <div class="rs-payments__copy">
        <p class="rs-payments__eyebrow">Τρόποι πληρωμής</p>
        <h2 id="payment-methods-heading">Κάρτα ή τραπεζική μεταφορά.</h2>
        <p>Εξοφλήστε μέσω προσωπικού συνδέσμου πληρωμής ή με κατάθεση στην ${escape(account.bank)}.</p>
        <a href="${prefix}contact/index.html#payment-details">Στοιχεία τραπεζικής μεταφοράς <span aria-hidden="true">→</span></a>
      </div>
      <div class="rs-payments__options">
        <div><h3>Πληρωμές μέσω</h3><ul class="rs-payments__marks" role="list">${account.gateways.map(mark).join('')}</ul></div>
        <div><h3>Πληρωμές με κάρτα</h3><ul class="rs-payments__marks" role="list">${account.cards.map(mark).join('')}</ul></div>
        <p class="rs-payments__note">Οι διαθέσιμες επιλογές εμφανίζονται στον σύνδεσμο πληρωμής σας.</p>
      </div>
    </div>
  </section>`;
}

export function bankTransferSection() {
  const account = details();
  const iban = account.iban.replace(/\s/g, '').toUpperCase();
  if (!/^GR\d{25}$/.test(iban)) throw new Error('Invalid Greek IBAN format');
  const digits = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, c => String(c.charCodeAt(0) - 55));
  if (BigInt(digits) % 97n !== 1n) throw new Error('Invalid IBAN checksum');
  const bank = String(account.bank).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const formatted = iban.match(/.{1,4}/g).join(' ');
  return `${paymentMethods('../')}
    <section class="rs-section" id="payment-details" aria-labelledby="payment-heading">
      <div class="rs-shell">
        <div class="contact-option contact-main bank-transfer">
          <p class="rs-eyebrow rs-eyebrow--dark">Τρόποι πληρωμής</p>
          <h2 id="payment-heading">Τραπεζική κατάθεση</h2>
          <p>Μπορείτε να εξοφλήσετε την προσφορά ή το παραστατικό σας με τραπεζική μεταφορά.</p>
          <div><strong>Τράπεζα</strong><span>${bank}</span></div>
          <div><strong>IBAN</strong><span class="bank-transfer__iban" dir="ltr" id="bank-iban">${formatted}</span></div>
          <div><button class="rs-button rs-button--outline" type="button" data-copy-iban="${iban}">Αντιγραφή IBAN</button></div>
          <p class="bank-transfer__status" data-copy-status role="status" aria-live="polite"></p>
          <p>Στην αιτιολογία αναφέρετε τον αριθμό προσφοράς ή παραστατικού.</p>
        </div>
      </div>
    </section>`;
}
