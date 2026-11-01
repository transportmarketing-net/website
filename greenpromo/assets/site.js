(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.querySelector(".sr-only").textContent = "Άνοιγμα μενού";
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.querySelector(".sr-only").textContent = open ? "Άνοιγμα μενού" : "Κλείσιμο μενού";
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  if (header) {
    let scrolled = false;
    const updateHeader = () => {
      const next = window.scrollY > 120;
      if (next !== scrolled) {
        scrolled = next;
        header.classList.toggle("is-scrolled", scrolled);
      }
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    reveals.forEach((element) => observer.observe(element));
  }

  const form = document.querySelector("[data-quote-form]");
  if (!form) return;

  const serviceSelect = form.elements.service;
  const params = new URLSearchParams(window.location.search);
  const preselected = params.get("package") || params.get("service");
  if (preselected && [...serviceSelect.options].some((option) => option.value === preselected)) {
    serviceSelect.value = preselected;
  }

  const value = (name) => String(form.elements[name]?.value || "").trim();
  const buildMessage = () => [
    "Αίτημα προσφοράς GreenPromo",
    "",
    `Όνομα: ${value("name")}`,
    `Τηλέφωνο: ${value("phone")}`,
    `Email: ${value("email") || "—"}`,
    `Πακέτο / υπηρεσία: ${serviceSelect.options[serviceSelect.selectedIndex]?.text || "—"}`,
    `Ποσότητα: ${value("quantity") || "—"}`,
    `Περιοχές: ${value("zones") || "—"}`,
    `Χρονοδιάγραμμα: ${value("timeline") || "—"}`,
    `Σημειώσεις: ${value("message") || "—"}`,
  ].join("\n");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Συμπληρώστε τα υποχρεωτικά πεδία πριν συνεχίσετε.";
      return;
    }

    const message = buildMessage();
    const channel = event.submitter?.dataset.channel || "whatsapp";
    if (channel === "email") {
      const subject = encodeURIComponent(`Αίτημα προσφοράς — ${value("name")}`);
      window.location.href = `mailto:info@greenpromo.marketing?subject=${subject}&body=${encodeURIComponent(message)}`;
      status.textContent = "Άνοιξε η εφαρμογή email. Ελέγξτε το μήνυμα και ολοκληρώστε την αποστολή εκεί.";
      return;
    }

    const whatsappUrl = `https://wa.me/306989442438?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    status.textContent = "Άνοιξε το WhatsApp. Ελέγξτε το μήνυμα και ολοκληρώστε την αποστολή εκεί.";
  });
})();
