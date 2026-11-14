/* RedStar - Mobile menu, cookie consent, portfolio filters, year update */
(function () {
  'use strict';

  /* ── Mobile drawer ── */
  var hamburger = document.querySelector('.rs-hamburger');
  var drawer = document.querySelector('.rs-drawer');
  if (hamburger && drawer) {
    var panel = drawer.querySelector('.rs-drawer__panel');
    var scrim = drawer.querySelector('.rs-drawer__scrim');
    var closeBtn = drawer.querySelector('.rs-drawer__close');

    function openDrawer() {
      drawer.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }
    function closeDrawer() {
      drawer.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
    hamburger.addEventListener('click', openDrawer);
    if (scrim) scrim.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ── Cookie consent ── */
  var CONSENT_KEY = 'redstar-consent-v1';
  var consent = document.querySelector('.cookie-consent');
  var savedConsent;
  try { savedConsent = localStorage.getItem(CONSENT_KEY); } catch (e) { /* Storage may be blocked. */ }
  if (consent && savedConsent !== 'accepted' && savedConsent !== 'rejected') {
    consent.hidden = false;
    var acceptBtn = consent.querySelector('[data-consent-accept]');
    var rejectBtn = consent.querySelector('[data-consent-reject]');
    function dismiss(value) {
      try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* Keep this visit usable. */ }
      consent.hidden = true;
      if (value === 'accepted') loadAnalytics();
    }
    if (acceptBtn) acceptBtn.addEventListener('click', function () { dismiss('accepted'); });
    if (rejectBtn) rejectBtn.addEventListener('click', function () { dismiss('rejected'); });
  } else if (savedConsent === 'accepted') {
    loadAnalytics();
  }

  function loadAnalytics() {
    if (document.querySelector('script[src*="googletagmanager"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-212798DHFW';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-212798DHFW');
  }

  /* ── Portfolio filters ── */
  var filterBtns = document.querySelectorAll('.portfolio-filters button');
  if (filterBtns.length) {
    var cards = document.querySelectorAll('.case-card[data-category]');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Bank details ── */
  document.querySelectorAll('[data-copy-iban]').forEach(function (button) {
    button.addEventListener('click', async function () {
      var status = button.closest('.bank-transfer').querySelector('[data-copy-status]');
      button.setAttribute('aria-busy', 'true');
      button.textContent = 'Αντιγραφή...';
      try {
        await navigator.clipboard.writeText(button.getAttribute('data-copy-iban'));
        button.textContent = 'Αντιγράφηκε';
        status.textContent = 'Το IBAN αντιγράφηκε.';
      } catch (e) {
        button.textContent = 'Αντιγραφή IBAN';
        status.textContent = 'Δεν έγινε αντιγραφή. Επιλέξτε το IBAN και αντιγράψτε το χειροκίνητα.';
      } finally {
        button.removeAttribute('aria-busy');
      }
    });
  });

  /* ── Year update ── */
  var yearEls = document.querySelectorAll('[data-year]');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) { el.textContent = year; });

})();
