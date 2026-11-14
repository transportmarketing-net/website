(function () {
  'use strict';
  var form = document.getElementById('quote-request-form');
  if (!form) return;
  var button = form.querySelector('button[type="submit"]');
  var label = form.querySelector('[data-submit-label]');
  var spinner = form.querySelector('.rs-quote__spinner');
  var feedback = form.querySelector('[data-quote-error]');
  var success = document.querySelector('[data-quote-success]');
  var requestId;
  var service = new URLSearchParams(location.search).get('service');
  if (service) form.elements.service.value = service.slice(0, 120);
  var source = new URL(location.href);
  try {
    var referrer = new URL(document.referrer);
    if (referrer.origin === location.origin) source = referrer;
  } catch (e) { /* A direct visit has no referrer. */ }
  source.search = '';
  source.hash = '';
  button.disabled = false;

  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    var bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    var hex = Array.from(bytes, function (n) { return n.toString(16).padStart(2, '0'); }).join('');
    return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20);
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (form.getAttribute('aria-busy') === 'true') return;
    feedback.hidden = true;
    form.querySelectorAll('[data-field-error]').forEach(function (error) { error.hidden = true; error.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(function (input) { input.removeAttribute('aria-invalid'); });
    form.setAttribute('aria-busy', 'true');
    button.disabled = true;
    label.textContent = 'Αποστολή...';
    spinner.removeAttribute('hidden');
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 15000);
    try {
      requestId = requestId || uuid();
      var endpoint = form.dataset.quoteEndpoint;
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        endpoint = 'http://' + location.hostname + ':8046/api/public/quote-requests';
      }
      var data = { request_id: requestId, source_url: source.href };
      ['name', 'phone', 'email', 'service', 'message', 'company_website'].forEach(function (name) { data[name] = form.elements[name].value.trim(); });
      var response = await fetch(endpoint, {
        method: 'POST', credentials: 'omit', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      var result = await response.json().catch(function () { return {}; });
      if (response.ok && result.ok === true) {
        form.hidden = true;
        success.hidden = false;
        success.focus();
        return;
      }
      if (response.status === 422) {
        Object.keys(result.errors || {}).forEach(function (name) {
          var input = form.elements.namedItem(name);
          var error = Array.from(form.querySelectorAll('[data-field-error]')).find(function (element) { return element.dataset.fieldError === name; });
          if (input && error) {
            input.setAttribute('aria-invalid', 'true');
            error.textContent = result.errors[name][0];
            error.hidden = false;
          }
        });
        feedback.textContent = 'Ελέγξτε τα στοιχεία σας και δοκιμάστε ξανά.';
      } else if (response.status === 429) {
        feedback.textContent = 'Έγιναν αρκετές προσπάθειες. Δοκιμάστε αργότερα ή επικοινωνήστε τηλεφωνικά.';
      } else {
        feedback.textContent = 'Δεν επιβεβαιώθηκε η αποθήκευση. Δοκιμάστε ξανά ή καλέστε στο +30 698 944 2438.';
      }
      feedback.hidden = false;
      var invalid = form.querySelector('[aria-invalid="true"]');
      (invalid || feedback).focus();
    } catch (error) {
      feedback.textContent = 'Δεν επιβεβαιώθηκε η αποθήκευση. Ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά ή καλέστε στο +30 698 944 2438.';
      feedback.hidden = false;
      feedback.focus();
    } finally {
      clearTimeout(timer);
      form.removeAttribute('aria-busy');
      spinner.setAttribute('hidden', '');
      button.disabled = false;
      label.textContent = 'Αποστολή αιτήματος';
    }
  });
})();
