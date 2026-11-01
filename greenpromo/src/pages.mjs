import { ctaBand, icon, pageHero, renderPage } from "./layout.mjs";
import { COVERAGE_AREAS, FAQS, PACKAGES, PROCESS_STEPS, SECTORS, SERVICES, SITE } from "./site-data.mjs";

const renderServiceCards = (limit = SERVICES.length) => SERVICES.slice(0, limit).map((service) => `
  <article class="service-card reveal">
    <div class="service-card-top">
      <span>${service.number}</span>
      <span class="service-arrow">↗</span>
    </div>
    <h3>${service.title}</h3>
    <p>${service.short}</p>
    <a class="card-link" href="services.html#${service.slug}">Δείτε λεπτομέρειες <span aria-hidden="true">→</span></a>
  </article>`).join("");

const renderPackages = (compact = false) => PACKAGES.map((plan) => `
  <article class="price-card ${plan.popular ? "is-popular" : ""} reveal">
${plan.popular ? '    <p class="popular-label">Πιο δημοφιλές</p>\n' : ""}    <div class="price-heading">
      <h3>${plan.name}</h3>
      <p class="price"><span>${plan.price}</span>${plan.unit}</p>
    </div>
    <p class="price-description">${plan.description}</p>
    <ul class="check-list">
      ${plan.features.slice(0, compact ? 4 : plan.features.length).map((feature) => `<li>${icon("check")}<span>${feature}</span></li>`).join("")}
    </ul>
    <a class="button ${plan.popular ? "button-accent" : "button-outline"}" href="quote.html?package=${plan.slug}">Επιλέξτε ${plan.name} ${icon("arrow", "button-icon")}</a>
  </article>`).join("");

const renderFaqs = (limit = FAQS.length) => FAQS.slice(0, limit).map((faq, index) => `
  <details class="faq-item reveal" ${index === 0 ? "open" : ""}>
    <summary><span>${faq.question}</span><span class="faq-symbol" aria-hidden="true"></span></summary>
    <div class="faq-answer"><p>${faq.answer}</p></div>
  </details>`).join("");

const home = renderPage({
  title: "GreenPromo — Διανομή Φυλλαδίων με Φωτογραφική Απόδειξη | Αθήνα",
  description: "Επαγγελματική διανομή φυλλαδίων στην Αθήνα και την Αττική με φωτογραφική απόδειξη, GPS tracking και PDF αναφορά. Δωρεάν προσφορά εντός 24 ωρών.",
  path: "",
  active: "home",
  body: `
  <section class="home-hero">
    <div class="hero-media" role="img" aria-label="Επαγγελματίας διανέμει φυλλάδια σε γραμματοκιβώτια πολυκατοικίας στην Αθήνα"></div>
    <div class="hero-overlay"></div>
    <div class="shell hero-content">
      <div class="hero-copy reveal">
        <p class="hero-badge"><span>24h</span> Δωρεάν προσφορά εντός μίας εργάσιμης</p>
        <h1>Η διανομή σας.<br><em>Τεκμηριωμένη.</em></h1>
        <p>Φυλλάδια σε σπίτια, περαστικούς και επιχειρήσεις στην Αθήνα — με φωτογραφική απόδειξη, GPS όπου προβλέπεται και καθαρή αναφορά.</p>
        <div class="hero-actions">
          <a class="button button-light" href="quote.html">Ζητήστε δωρεάν προσφορά ${icon("arrow", "button-icon")}</a>
          <a class="play-link" href="#proof"><span class="play-dot">${icon("camera")}</span> Δείτε πώς τεκμηριώνεται</a>
        </div>
      </div>
      <aside class="hero-facts reveal" aria-label="Κύρια πλεονεκτήματα">
        <div><strong>€5</strong><span>από / ώρα</span></div>
        <div><strong>5</strong><span>μέθοδοι διανομής</span></div>
        <div><strong>100%</strong><span>σαφής συμφωνία πριν την έναρξη</span></div>
      </aside>
    </div>
    <a class="hero-scroll" href="#services" aria-label="Μετάβαση στις υπηρεσίες"><span></span> Κύλιση</a>
  </section>

  <section class="trust-strip" aria-label="Εγγυήσεις υπηρεσίας">
    <div class="shell trust-grid">
      <div>${icon("camera")}<span><strong>Φωτογραφική απόδειξη</strong> από το πεδίο</span></div>
      <div>${icon("route")}<span><strong>Παρακολούθηση GPS</strong> στα επιλεγμένα πακέτα</span></div>
      <div>${icon("report")}<span><strong>PDF αναφορά</strong> με ζώνες κάλυψης</span></div>
      <div>${icon("message")}<span><strong>Απάντηση 24h</strong> με σαφή προσφορά</span></div>
    </div>
  </section>

  <section class="section-pad" id="services">
    <div class="shell">
      <div class="section-heading split-heading reveal">
        <div>
          <p class="eyebrow">Υπηρεσίες</p>
          <h2>Η σωστή μέθοδος για κάθε σημείο επαφής.</h2>
        </div>
        <p>Από μία τοπική γειτονιά μέχρι καμπάνια πολλαπλών ζωνών, σχεδιάζουμε τη διανομή γύρω από το κοινό και τον στόχο σας.</p>
      </div>
      <div class="service-grid">${renderServiceCards()}</div>
    </div>
  </section>

  <section class="image-story section-pad-tight">
    <div class="shell story-grid">
      <figure class="story-image reveal">
        <img src="images/generated/greenpromo-hand-to-hand.webp" alt="Προωθήτρια παραδίδει φυλλάδιο σε περαστικό στην Αθήνα" width="1448" height="1086" loading="lazy">
        <figcaption>Χέρι-με-χέρι · Σημεία υψηλής κίνησης</figcaption>
      </figure>
      <div class="story-copy reveal">
        <p class="eyebrow">Στοχευμένη παρουσία</p>
        <h2>Το έντυπο φτάνει εκεί που έχει νόημα.</h2>
        <p>Δεν ξεκινάμε από έναν γενικό χάρτη. Ξεκινάμε από το κοινό σας: πού κινείται, πότε είναι διαθέσιμο και ποια μέθοδος δημιουργεί την κατάλληλη επαφή.</p>
        <a class="text-link" href="services.html">Όλες οι υπηρεσίες ${icon("arrow", "button-icon")}</a>
      </div>
    </div>
  </section>

  <section class="process-section section-pad" id="process">
    <div class="shell">
      <div class="section-heading split-heading reveal">
        <div><p class="eyebrow light">Πώς λειτουργεί</p><h2>Από τις απαιτήσεις στην αναφορά, σε τέσσερα καθαρά βήματα.</h2></div>
        <p>Κάθε απόφαση — ποσότητα, ζώνη, χρόνος και τεκμηρίωση — συμφωνείται πριν ξεκινήσει η ομάδα.</p>
      </div>
      <div class="process-grid">
        ${PROCESS_STEPS.map((step) => `<article class="process-step reveal"><span>${step.number}</span><h3>${step.title}</h3><p>${step.text}</p></article>`).join("")}
      </div>
    </div>
  </section>

  <section class="proof-section section-pad" id="proof">
    <div class="shell proof-grid">
      <div class="proof-copy reveal">
        <p class="eyebrow">Τεκμηρίωση</p>
        <h2>Δεν χρειάζεται να μαντεύετε τι έγινε στο πεδίο.</h2>
        <p>Η αναφορά οργανώνει τα στοιχεία της καμπάνιας σε μία καθαρή εικόνα. Το ακριβές επίπεδο τεκμηρίωσης εξαρτάται από το πακέτο που επιλέγετε.</p>
        <ul class="feature-list">
          <li><span>01</span><div><strong>Φωτογραφίες</strong><p>Οπτική απόδειξη από χαρακτηριστικά σημεία διανομής.</p></div></li>
          <li><span>02</span><div><strong>Διαδρομές GPS</strong><p>Καταγραφή της κάλυψης στα Standard, Pro και σε ειδικές καμπάνιες.</p></div></li>
          <li><span>03</span><div><strong>PDF αναφορά</strong><p>Συνοπτική παράδοση ποσοτήτων, ζωνών και υλικού τεκμηρίωσης.</p></div></li>
        </ul>
      </div>
      <figure class="proof-image reveal">
        <img src="images/generated/greenpromo-reporting.webp" alt="Χάρτης διαδρομών, φωτογραφίες πεδίου και αναφορά διανομής" width="1536" height="1024" loading="lazy">
        <figcaption><span>Αναφορά / 01</span><strong>Όλη η καμπάνια σε μία αναφορά</strong></figcaption>
      </figure>
    </div>
  </section>

  <section class="coverage-section section-pad" id="coverage">
    <div class="shell coverage-grid">
      <div class="coverage-copy reveal">
        <p class="eyebrow light">Περιοχές κάλυψης</p>
        <h2>Αθήνα, Αττική και Πειραιάς — ανά ζώνη.</h2>
        <p>Ορίζουμε μαζί την ακριβή περιοχή. Για ειδικές τοποθεσίες ή καμπάνιες εκτός Αττικής, η διαθεσιμότητα επιβεβαιώνεται στην προσφορά.</p>
        <a class="button button-light" href="quote.html">Ελέγξτε την περιοχή σας ${icon("arrow", "button-icon")}</a>
      </div>
      <div class="coverage-list reveal">
        ${COVERAGE_AREAS.map((area, index) => `<div><span>0${index + 1}</span><strong>${area}</strong></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section-pad" id="packages">
    <div class="shell">
      <div class="section-heading split-heading reveal">
        <div><p class="eyebrow">Πακέτα</p><h2>Τιμολόγηση που διαβάζεται χωρίς υποσημειώσεις.</h2></div>
        <p>Τέσσερις αφετηρίες για διαφορετική κλίμακα. Η τελική προσφορά επιβεβαιώνει ζώνες, μέθοδο και χρονοδιάγραμμα.</p>
      </div>
      <div class="pricing-grid">${renderPackages(true)}</div>
      <div class="section-foot reveal"><a class="text-link" href="packages.html">Συγκρίνετε όλα τα πακέτα ${icon("arrow", "button-icon")}</a></div>
    </div>
  </section>

  <section class="sector-section section-pad-tight">
    <div class="shell sector-shell reveal">
      <p class="eyebrow">Για ποιους</p>
      <h2>Καμπάνιες για τοπικές επιχειρήσεις και οργανωμένα δίκτυα.</h2>
      <div class="sector-grid">${SECTORS.map((sector) => `<span>${sector}</span>`).join("")}</div>
    </div>
  </section>

  <section class="section-pad faq-preview">
    <div class="shell faq-layout">
      <div class="faq-intro reveal"><p class="eyebrow">Συχνές ερωτήσεις</p><h2>Ό,τι χρειάζεται να ξέρετε πριν ξεκινήσουμε.</h2><a class="text-link" href="faqs.html">Δείτε όλες τις απαντήσεις ${icon("arrow", "button-icon")}</a></div>
      <div class="faq-list">${renderFaqs(4)}</div>
    </div>
  </section>
  ${ctaBand()}`,
});

const services = renderPage({
  title: "Υπηρεσίες Διανομής Φυλλαδίων | GreenPromo Αθήνα",
  description: "Πόρτα-πόρτα, χέρι-με-χέρι, διανομή σε επιχειρήσεις, στοχευμένες ζώνες, σχεδιασμός και εκτύπωση φυλλαδίων στην Αθήνα και την Αττική.",
  path: "services.html",
  active: "services",
  body: `
    ${pageHero({
      eyebrow: "Υπηρεσίες διανομής",
      title: "Πέντε τρόποι να φτάσει το μήνυμά σας στο σωστό σημείο.",
      text: "Επιλέγουμε μέθοδο με βάση το κοινό, την περιοχή και τον στόχο — και την τεκμηριώνουμε με τον τρόπο που συμφωνήθηκε.",
      aside: `<div class="page-hero-note reveal"><span>01—05</span><p>Κατοικίες<br>Περαστικοί<br>Επιχειρήσεις<br>Ζώνες<br>Εκτύπωση</p></div>`,
    })}
    <section class="services-detail section-pad">
      <div class="shell">
        ${SERVICES.map((service, index) => `<article class="service-detail ${index % 2 ? "is-reversed" : ""}" id="${service.slug}">
          <figure class="service-detail-image reveal"><img src="${service.image}" alt="${service.alt}" width="1448" height="1086" loading="${index ? "lazy" : "eager"}"><span>${service.number}</span></figure>
          <div class="service-detail-copy reveal"><p class="eyebrow">Υπηρεσία ${service.number}</p><h2>${service.title}</h2><p>${service.description}</p><ul class="check-list">${service.bullets.map((bullet) => `<li>${icon("check")}<span>${bullet}</span></li>`).join("")}</ul><a class="button button-dark" href="quote.html?service=${service.slug}">Ζητήστε προσφορά ${icon("arrow", "button-icon")}</a></div>
        </article>`).join("")}
      </div>
    </section>
    ${ctaBand({ title: "Ποια μέθοδος ταιριάζει στη δική σας καμπάνια;", text: "Πείτε μας κοινό, ποσότητα και περιοχή. Θα συνδυάσουμε υπηρεσίες όπου χρειάζεται και θα σας στείλουμε μία σαφή πρόταση." })}`,
});

const packages = renderPage({
  title: "Πακέτα & Τιμές Διανομής Φυλλαδίων | GreenPromo",
  description: "Πακέτα διανομής από €5/ώρα: Custom, Starter €89, Standard €199 και Pro €399, με φωτογραφική απόδειξη, GPS και PDF αναφορές.",
  path: "packages.html",
  active: "packages",
  body: `
    ${pageHero({
      eyebrow: "Πακέτα & τιμές",
      title: "Ξέρετε τι περιλαμβάνεται πριν ξεκινήσει η διανομή.",
      text: "Οι τιμές είναι αφετηρίες για συγκεκριμένη κλίμακα. Η τελική προσφορά αποτυπώνει ποσότητα, ζώνες, μέθοδο και χρόνο εκτέλεσης.",
      aside: `<div class="price-orbit reveal"><span>Από</span><strong>€5</strong><small>/ώρα</small></div>`,
    })}
    <section class="section-pad pricing-page">
      <div class="shell"><div class="pricing-grid">${renderPackages(false)}</div>
      <p class="pricing-note reveal"><strong>Σημείωση:</strong> Οι αναγραφόμενες τιμές αφορούν τα χαρακτηριστικά κάθε πακέτου. Τυχόν εκτύπωση, ειδική στόχευση, express εκτέλεση ή περιοχές εκτός της συμφωνημένης κάλυψης κοστολογούνται στην προσφορά.</p></div>
    </section>
    <section class="comparison-section section-pad-tight">
      <div class="shell comparison-shell reveal">
        <div><p class="eyebrow light">Δεν είστε βέβαιοι;</p><h2>Στείλτε μας μόνο τρία στοιχεία.</h2></div>
        <ol><li><span>1</span>Πόσα φυλλάδια έχετε</li><li><span>2</span>Ποιες περιοχές θέλετε</li><li><span>3</span>Πότε θέλετε να ξεκινήσει</li></ol>
        <a class="button button-light" href="quote.html">Λάβετε πρόταση πακέτου ${icon("arrow", "button-icon")}</a>
      </div>
    </section>
    ${ctaBand({ title: "Χρειάζεστε ειδικό συνδυασμό;", text: "Μπορούμε να συνδυάσουμε πόρτα-πόρτα, χέρι-με-χέρι, επιχειρήσεις και εκτύπωση σε προσαρμοσμένη προσφορά." })}`,
});

const about = renderPage({
  title: "Σχετικά με τη GreenPromo | Διανομή Φυλλαδίων Αθήνα",
  description: "Γνωρίστε τον τρόπο εργασίας της GreenPromo: σαφής σχεδιασμός ζωνών, επαγγελματική εκτέλεση και τεκμηριωμένες αναφορές διανομής στην Αθήνα.",
  path: "about.html",
  active: "about",
  body: `
    ${pageHero({
      eyebrow: "Σχετικά με τη GreenPromo",
      title: "Η αξιοπιστία της διανομής φαίνεται στην τεκμηρίωση.",
      text: "Οργανώνουμε καμπάνιες έντυπης προώθησης με καθαρές απαιτήσεις, συγκεκριμένες ζώνες και αναφορά που σας δείχνει τι εκτελέστηκε.",
      aside: `<figure class="page-hero-photo reveal"><img src="images/generated/greenpromo-door-to-door.webp" alt="Διανομή φυλλαδίων σε πολυκατοικία της Αθήνας" width="1672" height="941"></figure>`,
      className: "about-hero",
    })}
    <section class="manifesto section-pad">
      <div class="shell manifesto-grid">
        <p class="manifesto-index reveal">01 / Η προσέγγισή μας</p>
        <div class="manifesto-copy reveal"><h2>Το «μοιράσαμε» δεν είναι αρκετό.</h2><p>Μία καμπάνια αξίζει όταν έχει σαφή στόχο, οργανωμένη εκτέλεση και στοιχεία που μπορούν να ελεγχθούν. Για αυτό ξεκινάμε με τον χάρτη και τελειώνουμε με την αναφορά.</p></div>
      </div>
    </section>
    <section class="values-section section-pad-tight">
      <div class="shell values-grid">
        <article class="reveal"><span>01</span><h3>Διαφάνεια</h3><p>Πακέτο, ζώνες, χρόνος και παραδοτέα συμφωνούνται πριν την έναρξη.</p></article>
        <article class="reveal"><span>02</span><h3>Στόχευση</h3><p>Η μέθοδος διανομής επιλέγεται γύρω από το κοινό και όχι από συνήθεια.</p></article>
        <article class="reveal"><span>03</span><h3>Τεκμηρίωση</h3><p>Φωτογραφίες, διαδρομές και αναφορές παραδίδονται ανάλογα με το πακέτο.</p></article>
      </div>
    </section>
    <section class="about-story section-pad">
      <div class="shell story-grid">
        <figure class="story-image reveal"><img src="images/generated/greenpromo-business-distribution.webp" alt="Τοποθέτηση φυλλαδίων σε τοπική επιχείρηση" width="1448" height="1086" loading="lazy"><figcaption>Τοπική αγορά · Επιλεκτική τοποθέτηση</figcaption></figure>
        <div class="story-copy reveal"><p class="eyebrow">Από μικρή σε μεγάλη κλίμακα</p><h2>Η ίδια προσοχή, είτε είναι 300 είτε 10.000+ έντυπα.</h2><p>Η κλίμακα αλλάζει τον συντονισμό, όχι την ανάγκη για σαφή συμφωνία. Γι’ αυτό τα πακέτα λειτουργούν ως καθαρές αφετηρίες και κάθε ειδική απαίτηση καταγράφεται πριν ξεκινήσουμε.</p><a class="text-link" href="packages.html">Δείτε τα πακέτα ${icon("arrow", "button-icon")}</a></div>
      </div>
    </section>
    ${ctaBand({ title: "Ας σχεδιάσουμε μία καμπάνια που μπορείτε να παρακολουθήσετε.", text: "Στείλτε μας τα βασικά στοιχεία και θα επιστρέψουμε με μέθοδο, ζώνες, χρόνο και κόστος." })}`,
});

function quoteForm() {
  return `<form class="quote-form" data-quote-form novalidate>
    <div class="form-grid">
      <div class="field"><label for="name">Όνομα <span>*</span></label><input id="name" name="name" type="text" autocomplete="name" minlength="2" required placeholder="Το όνομά σας"></div>
      <div class="field"><label for="phone">Τηλέφωνο <span>*</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" minlength="8" required placeholder="69XXXXXXXX"></div>
      <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" placeholder="name@example.com"></div>
      <div class="field"><label for="service">Πακέτο / υπηρεσία <span>*</span></label><select id="service" name="service" required><option value="">Επιλέξτε…</option>${PACKAGES.map((plan) => `<option value="${plan.slug}">${plan.name} — ${plan.price}${plan.unit}</option>`).join("")}<option value="door-to-door">Πόρτα-Πόρτα</option><option value="hand-to-hand">Χέρι-με-Χέρι</option><option value="business-distribution">Διανομή σε Επιχειρήσεις</option><option value="targeted-zones">Στοχευμένες Ζώνες</option><option value="design-print">Σχεδιασμός & Εκτύπωση</option></select></div>
      <div class="field"><label for="quantity">Ποσότητα</label><select id="quantity" name="quantity"><option value="">Δεν γνωρίζω ακόμη</option><option>100–500</option><option>500–2.000</option><option>2.000–5.000</option><option>5.000–10.000</option><option>10.000+</option></select></div>
      <div class="field"><label for="timeline">Χρονοδιάγραμμα</label><select id="timeline" name="timeline"><option value="">Επιλέξτε…</option><option>Express</option><option>Εντός 1 εβδομάδας</option><option>Εντός 2 εβδομάδων</option><option>Ευέλικτο</option></select></div>
      <div class="field field-full"><label for="zones">Περιοχές / ζώνες</label><input id="zones" name="zones" type="text" placeholder="π.χ. Παγκράτι, Καισαριανή, Βύρωνας"></div>
      <div class="field field-full"><label for="message">Σημειώσεις</label><textarea id="message" name="message" rows="5" maxlength="1000" placeholder="Πείτε μας τι θέλετε να πετύχετε ή οποιαδήποτε ειδική απαίτηση."></textarea></div>
    </div>
    <label class="consent"><input type="checkbox" name="consent" required><span>Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου αποκλειστικά για την απάντηση στο αίτημα, σύμφωνα με την <a href="privacy-policy.html">πολιτική απορρήτου</a>. *</span></label>
    <p class="form-hint">Δεν γίνεται αυτόματη αποστολή σε διακομιστή. Το κουμπί ανοίγει το WhatsApp ή το email σας με το αίτημα προσυμπληρωμένο.</p>
    <div class="form-actions">
      <button class="button button-accent" type="submit" data-channel="whatsapp">Αποστολή με WhatsApp ${icon("message", "button-icon")}</button>
      <button class="button button-outline" type="submit" data-channel="email">Αποστολή με email ${icon("mail", "button-icon")}</button>
    </div>
    <p class="form-status" role="status" aria-live="polite" data-form-status></p>
  </form>`;
}

const quote = renderPage({
  title: "Δωρεάν Προσφορά Διανομής Φυλλαδίων | GreenPromo",
  description: "Ζητήστε δωρεάν προσφορά διανομής φυλλαδίων στην Αθήνα. Στείλτε ποσότητα, περιοχές, υπηρεσία και χρονοδιάγραμμα μέσω WhatsApp ή email.",
  path: "quote.html",
  active: "quote",
  body: `
    ${pageHero({
      eyebrow: "Δωρεάν προσφορά",
      title: "Πείτε μας πού θέλετε να φτάσει η καμπάνια.",
      text: "Συμπληρώστε όσα γνωρίζετε. Θα ανοίξει το WhatsApp ή το email σας με όλα τα στοιχεία έτοιμα για αποστολή.",
      aside: `<div class="page-hero-note reveal"><span>Απάντηση</span><p><strong>εντός 24 ωρών</strong><br>τις εργάσιμες ημέρες</p></div>`,
    })}
    <section class="quote-section section-pad">
      <div class="shell quote-layout">
        <aside class="quote-sidebar reveal">
          <p class="eyebrow">Τι θα βοηθήσει</p><h2>Τρία στοιχεία αρκούν για να ξεκινήσουμε.</h2>
          <ol><li><span>01</span>Ποσότητα φυλλαδίων</li><li><span>02</span>Περιοχές ή κοινό</li><li><span>03</span>Επιθυμητή ημερομηνία</li></ol>
          <div class="direct-contact"><p>Θέλετε άμεση επικοινωνία;</p><a href="tel:${SITE.phoneHref}">${icon("phone")} ${SITE.phoneDisplay}</a><a href="https://wa.me/${SITE.whatsappHref}" target="_blank" rel="noopener noreferrer">${icon("message")} ${SITE.whatsappDisplay}</a></div>
        </aside>
        <div class="form-card reveal"><div class="form-card-head"><p>Αίτημα προσφοράς</p><span>* Υποχρεωτικά πεδία</span></div>${quoteForm()}</div>
      </div>
    </section>`,
});

const contact = renderPage({
  title: "Επικοινωνία | GreenPromo Αθήνα",
  description: "Επικοινωνήστε με τη GreenPromo για διανομή φυλλαδίων στην Αθήνα και την Αττική: τηλέφωνο, WhatsApp ή email. Απάντηση εντός 24 ωρών.",
  path: "contact.html",
  active: "contact",
  body: `
    ${pageHero({
      eyebrow: "Επικοινωνία",
      title: "Μιλήστε απευθείας με τη GreenPromo.",
      text: "Για προσφορά, στείλτε ποσότητα και περιοχές. Για μία γρήγορη ερώτηση, καλέστε ή γράψτε μας στο WhatsApp.",
      aside: `<div class="contact-clock reveal"><span>Δευ—Παρ</span><strong>Απάντηση 24h</strong><small>Αθήνα / Europe-Athens</small></div>`,
    })}
    <section class="contact-section section-pad">
      <div class="shell contact-grid">
        <a class="contact-card reveal" href="tel:${SITE.phoneHref}">${icon("phone", "contact-icon")}<span>Τηλέφωνο</span><strong>${SITE.phoneDisplay}</strong><small>Καλέστε για άμεση συνεννόηση</small><b>↗</b></a>
        <a class="contact-card reveal" href="https://wa.me/${SITE.whatsappHref}" target="_blank" rel="noopener noreferrer">${icon("message", "contact-icon")}<span>WhatsApp</span><strong>${SITE.whatsappDisplay}</strong><small>Στείλτε ποσότητα και περιοχές</small><b>↗</b></a>
        <a class="contact-card reveal" href="mailto:${SITE.email}">${icon("mail", "contact-icon")}<span>Email</span><strong>${SITE.email}</strong><small>Για απαιτήσεις και αρχεία καμπάνιας</small><b>↗</b></a>
        <div class="contact-card reveal">${icon("pin", "contact-icon")}<span>Περιοχή εξυπηρέτησης</span><strong>${SITE.location}</strong><small>Ειδικές καμπάνιες κατόπιν συνεννόησης</small></div>
      </div>
    </section>
    <section class="contact-next section-pad-tight"><div class="shell comparison-shell reveal"><div><p class="eyebrow light">Έχετε έτοιμες τις απαιτήσεις;</p><h2>Μετατρέψτε τες σε προσυμπληρωμένο αίτημα.</h2></div><p>Η φόρμα προσφοράς οργανώνει όλα τα στοιχεία και ανοίγει το κανάλι που προτιμάτε.</p><a class="button button-light" href="quote.html">Άνοιγμα φόρμας ${icon("arrow", "button-icon")}</a></div></section>`,
});

const faqs = renderPage({
  title: "Συχνές Ερωτήσεις για Διανομή Φυλλαδίων | GreenPromo",
  description: "Απαντήσεις για πακέτα, φωτογραφική απόδειξη, GPS tracking, χρόνους διανομής, ζώνες κάλυψης, εκτύπωση και πληρωμή.",
  path: "faqs.html",
  active: "faqs",
  body: `
    ${pageHero({
      eyebrow: "Συχνές ερωτήσεις",
      title: "Καθαρές απαντήσεις πριν ξεκινήσει η καμπάνια.",
      text: "Αν η δική σας περίπτωση δεν καλύπτεται εδώ, στείλτε μας ένα σύντομο μήνυμα και θα σας απαντήσουμε συγκεκριμένα.",
      aside: `<div class="page-hero-note reveal"><span>${String(FAQS.length).padStart(2, "0")}</span><p>απαντήσεις για<br>τιμή, χρόνο και<br>τεκμηρίωση</p></div>`,
    })}
    <section class="section-pad faq-page"><div class="shell faq-layout"><aside class="faq-intro reveal"><p class="eyebrow">Χρειάζεστε κάτι ακόμη;</p><h2>Η προσφορά αποτυπώνει τις λεπτομέρειες της δικής σας περίπτωσης.</h2><a class="button button-dark" href="quote.html">Ζητήστε προσφορά ${icon("arrow", "button-icon")}</a></aside><div class="faq-list">${renderFaqs()}</div></div></section>
    ${ctaBand({ title: "Δεν βρήκατε την απάντηση που χρειάζεστε;", text: "Στείλτε την ερώτηση μαζί με τις περιοχές και την ποσότητα. Θα απαντήσουμε με συγκεκριμένη πρόταση." })}`,
});

const privacy = renderPage({
  title: "Πολιτική Απορρήτου | GreenPromo",
  description: "Πολιτική απορρήτου της GreenPromo για τα στοιχεία που αποστέλλετε μέσω email, τηλεφώνου ή WhatsApp για αίτημα προσφοράς.",
  path: "privacy-policy.html",
  active: "privacy",
  body: `
    ${pageHero({
      eyebrow: "Νομικά",
      title: "Πολιτική απορρήτου.",
      text: "Πώς χρησιμοποιούνται τα στοιχεία που μας στέλνετε για επικοινωνία ή αίτημα προσφοράς.",
      aside: `<div class="page-hero-note reveal"><span>Ενημέρωση</span><p>31 Οκτωβρίου 2026</p></div>`,
    })}
    <section class="legal-section section-pad"><div class="shell legal-layout">
      <aside class="legal-nav reveal"><p>Περιεχόμενα</p><a href="#controller">Υπεύθυνος επεξεργασίας</a><a href="#data">Δεδομένα</a><a href="#purpose">Σκοπός</a><a href="#retention">Διατήρηση</a><a href="#rights">Δικαιώματα</a><a href="#third-parties">Τρίτες υπηρεσίες</a></aside>
      <article class="legal-copy reveal">
        <section id="controller"><h2>1. Υπεύθυνος επεξεργασίας</h2><p>Υπεύθυνος για τα προσωπικά δεδομένα που περιγράφονται στην παρούσα πολιτική είναι η GreenPromo, με περιοχή δραστηριότητας την Αθήνα και την Αττική. Επικοινωνία: <a href="mailto:${SITE.email}">${SITE.email}</a> και <a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a>.</p></section>
        <section id="data"><h2>2. Ποια δεδομένα λαμβάνουμε</h2><p>Όταν ζητάτε προσφορά μπορεί να μας στείλετε όνομα, τηλέφωνο, email, περιοχές ενδιαφέροντος, ποσότητα φυλλαδίων, χρονοδιάγραμμα και σημειώσεις για την καμπάνια. Η φόρμα του ιστότοπου δεν αποθηκεύει τα δεδομένα σε δικό μας server· ανοίγει το WhatsApp ή την εφαρμογή email της συσκευής σας με προσυμπληρωμένο μήνυμα.</p></section>
        <section id="purpose"><h2>3. Γιατί τα χρησιμοποιούμε</h2><p>Χρησιμοποιούμε τα στοιχεία αποκλειστικά για να απαντήσουμε στο αίτημά σας, να προετοιμάσουμε προσφορά, να συντονίσουμε μία συμφωνημένη υπηρεσία και να τηρήσουμε τις νόμιμες υποχρεώσεις μας. Η νομική βάση είναι η λήψη μέτρων κατόπιν αιτήματός σας πριν από σύμβαση, η εκτέλεση σύμβασης και, όπου απαιτείται, η συγκατάθεσή σας.</p></section>
        <section id="retention"><h2>4. Χρόνος διατήρησης</h2><p>Διατηρούμε τα στοιχεία για όσο απαιτείται για την επικοινωνία και την παροχή της υπηρεσίας, καθώς και για όσο επιβάλλεται από φορολογικές ή άλλες νόμιμες υποχρεώσεις. Αιτήματα που δεν οδηγούν σε συνεργασία διαγράφονται ή ανωνυμοποιούνται όταν δεν υπάρχει πλέον εύλογη επιχειρηματική ή νομική ανάγκη.</p></section>
        <section id="rights"><h2>5. Τα δικαιώματά σας</h2><p>Μπορείτε να ζητήσετε πρόσβαση, διόρθωση, διαγραφή, περιορισμό ή φορητότητα των δεδομένων σας και να εναντιωθείτε στην επεξεργασία όπου προβλέπεται. Μπορείτε επίσης να ανακαλέσετε συγκατάθεση χωρίς να επηρεάζεται η νομιμότητα προηγούμενης επεξεργασίας. Στείλτε το αίτημα στο <a href="mailto:${SITE.email}">${SITE.email}</a>. Έχετε δικαίωμα καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα.</p></section>
        <section id="third-parties"><h2>6. WhatsApp, email και εξωτερικοί σύνδεσμοι</h2><p>Όταν επιλέγετε WhatsApp ή email, η αποστολή ολοκληρώνεται στην αντίστοιχη εξωτερική υπηρεσία και ισχύουν οι δικοί της όροι και πολιτικές. Ο ιστότοπος περιλαμβάνει επίσης συνδέσμους προς κοινωνικά δίκτυα. Δεν φορτώνουμε ενσωματωμένο περιεχόμενο κοινωνικών δικτύων ούτε εργαλεία παρακολούθησης στην τρέχουσα έκδοση του ιστότοπου.</p></section>
        <section><h2>7. Ασφάλεια και αλλαγές</h2><p>Λαμβάνουμε εύλογα οργανωτικά και τεχνικά μέτρα για την προστασία των στοιχείων που λαμβάνουμε. Η πολιτική μπορεί να ενημερώνεται όταν αλλάζει ο τρόπος λειτουργίας του ιστότοπου ή η σχετική νομοθεσία. Η ημερομηνία της τελευταίας ενημέρωσης εμφανίζεται στην αρχή της σελίδας.</p></section>
      </article>
    </div></section>`,
});

export const pages = {
  "index.html": home,
  "services.html": services,
  "packages.html": packages,
  "about.html": about,
  "quote.html": quote,
  "contact.html": contact,
  "faqs.html": faqs,
  "privacy-policy.html": privacy,
};

export const redirects = {
  "index2.html": "index.html",
  "download.html": "services.html",
  "pricing.html": "packages.html",
  "waitlist.html": "quote.html",
};
