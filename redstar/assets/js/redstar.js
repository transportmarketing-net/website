(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const solutionsTrigger = document.querySelector('[data-solutions-trigger]');
  const solutionsMenu = document.querySelector('[data-solutions-menu]');

  const closeSolutions = (restoreFocus = false) => {
    if (!solutionsTrigger || !solutionsMenu) return;
    solutionsTrigger.setAttribute('aria-expanded', 'false');
    solutionsMenu.classList.remove('is-open');
    solutionsMenu.hidden = true;
    if (restoreFocus) solutionsTrigger.focus();
  };

  const openSolutions = () => {
    if (!solutionsTrigger || !solutionsMenu) return;
    solutionsTrigger.setAttribute('aria-expanded', 'true');
    solutionsMenu.hidden = false;
    solutionsMenu.classList.add('is-open');
  };

  solutionsTrigger?.addEventListener('click', () => {
    if (solutionsTrigger.getAttribute('aria-expanded') === 'true') closeSolutions();
    else openSolutions();
  });

  solutionsTrigger?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    openSolutions();
    solutionsMenu?.querySelector('a')?.focus();
  });

  document.addEventListener('click', (event) => {
    if (!solutionsMenu || solutionsMenu.hidden) return;
    if (!solutionsMenu.contains(event.target) && !solutionsTrigger?.contains(event.target)) closeSolutions();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && solutionsMenu && !solutionsMenu.hidden) closeSolutions(true);
  });

  const drawer = document.querySelector('[data-mobile-drawer]');
  const drawerOpen = document.querySelector('[data-menu-open]');
  const drawerClose = document.querySelector('[data-menu-close]');
  const drawerScrim = document.querySelector('[data-menu-scrim]');
  let lastFocused = null;

  const focusableInDrawer = () => drawer
    ? [...drawer.querySelectorAll('a[href], button:not([disabled])')]
    : [];

  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.hidden = true;
    drawerOpen?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    lastFocused?.focus();
  };

  const openDrawer = () => {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.hidden = false;
    drawer.classList.add('is-open');
    drawerOpen?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    requestAnimationFrame(() => drawerClose?.focus());
  };

  drawerOpen?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerScrim?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeDrawer));

  drawer?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDrawer();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = focusableInDrawer();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('[data-project-category]')];
  const filterStatus = document.querySelector('[data-filter-status]');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      let visible = 0;
      projectCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.projectCategory === filter;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (filterStatus) filterStatus.textContent = `${visible} έργα εμφανίζονται.`;
    });
  });

  const consent = document.querySelector('[data-consent]');
  const consentKey = 'redstar-consent-v1';

  const readConsent = () => {
    try { return window.localStorage.getItem(consentKey); } catch { return null; }
  };

  const writeConsent = (value) => {
    try { window.localStorage.setItem(consentKey, value); } catch { /* Storage may be unavailable. */ }
  };

  const startAnalytics = () => {
    if (window.redstarAnalyticsStarted) return;
    window.redstarAnalyticsStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-212798DHFW', { anonymize_ip: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-212798DHFW';
    document.head.appendChild(script);
  };

  const storedConsent = readConsent();
  if (storedConsent === 'accepted') startAnalytics();
  else if (!storedConsent && consent) {
    consent.hidden = false;
    consent.classList.add('is-visible');
  }

  consent?.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
    writeConsent('accepted');
    consent.classList.remove('is-visible');
    consent.hidden = true;
    startAnalytics();
  });

  consent?.querySelector('[data-consent-reject]')?.addEventListener('click', () => {
    writeConsent('rejected');
    consent.classList.remove('is-visible');
    consent.hidden = true;
  });

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
