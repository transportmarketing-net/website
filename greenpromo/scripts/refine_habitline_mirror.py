#!/usr/bin/env python3
"""Polish the local Habitline-to-GreenPromo mirror without changing its stack."""

from pathlib import Path
from bs4 import BeautifulSoup, Comment
import html
import re

ROOT = Path("/tmp/habitline/habitline")
CUSTOM_CSS = "assets/greenpromo-mirror.css"

FAQS = [
    ("Ποιο πακέτο ταιριάζει στην καμπάνια μου;", "Το Custom καλύπτει μικρές ή δοκιμαστικές διανομές. Το Starter είναι για μία γειτονιά, το Standard για 2–3 ζώνες με GPS και το Pro για μεγάλες καμπάνιες πολλαπλών περιοχών. Αν δεν είστε βέβαιοι, στείλτε μας ποσότητα και περιοχές και θα σας προτείνουμε την κατάλληλη επιλογή."),
    ("Πώς λειτουργεί η φωτογραφική απόδειξη;", "Κατά την εκτέλεση συλλέγονται φωτογραφίες από τα σημεία διανομής. Ανάλογα με το πακέτο, συνοδεύονται από χρονοσφραγίδα, GPS διαδρομή και οργανωμένη PDF αναφορά."),
    ("Σε πόσες ημέρες ολοκληρώνεται η διανομή;", "Τα Starter και Standard προβλέπουν συνήθως ολοκλήρωση σε 5 εργάσιμες ημέρες από την παραλαβή του υλικού και την οριστικοποίηση των ζωνών. Για express ή μεγάλες καμπάνιες επιβεβαιώνουμε ειδικό χρονοδιάγραμμα στην προσφορά."),
    ("Μπορώ να επιλέξω συγκεκριμένες γειτονιές;", "Ναι. Η κάλυψη μπορεί να οργανωθεί ανά δήμο, ταχυδρομικό κώδικα ή συγκεκριμένη γειτονιά. Για καμπάνιες πολλαπλών ζωνών προτείνουμε σειρά εκτέλεσης και τρόπο παρακολούθησης."),
    ("Παρέχετε παρακολούθηση GPS και χάρτη διαδρομών;", "Ναι, στο Standard και σε προσαρμοσμένες ή Pro καμπάνιες όπου έχει συμφωνηθεί. Το ακριβές επίπεδο τεκμηρίωσης αναγράφεται καθαρά στην προσφορά σας."),
    ("Αναλαμβάνετε και σχεδιασμό ή εκτύπωση;", "Ναι. Μπορούμε να αναλάβουμε γραφιστική προσαρμογή, εκτύπωση και διανομή ως μία ενιαία υπηρεσία. Η τιμή εξαρτάται από διαστάσεις, χαρτί, χρώματα και ποσότητα."),
    ("Πώς γίνεται η πληρωμή;", "Ο τρόπος και τα στάδια πληρωμής αναφέρονται στην τελική προσφορά πριν ξεκινήσει η καμπάνια. Δεν υπάρχουν χρεώσεις που δεν έχουν προηγουμένως συμφωνηθεί."),
    ("Πότε θα λάβω απάντηση στο αίτημά μου;", "Απαντάμε συνήθως εντός 24 ωρών τις εργάσιμες ημέρες. Για ταχύτερη συνεννόηση μπορείτε να στείλετε το αίτημα μέσω WhatsApp."),
]

SERVICES = [
    ("01", "Πόρτα-Πόρτα", "Τοποθέτηση φυλλαδίων σε γραμματοκιβώτια πολυκατοικιών και μονοκατοικιών, οργανωμένη ανά ζώνη.", "images/greenpromo/landscape-door.webp"),
    ("02", "Χέρι-με-Χέρι", "Άμεση παράδοση σε περαστικούς, σε σημεία υψηλής κίνησης και ώρες που ταιριάζουν στο κοινό σας.", "images/greenpromo/landscape-hand.webp"),
    ("03", "Διανομή σε Επιχειρήσεις", "Επιλεκτική τοποθέτηση υλικού σε καταστήματα και επαγγελματικούς χώρους ανά κλάδο ή περιοχή.", "images/greenpromo/landscape-business.webp"),
    ("04", "Στοχευμένες Ζώνες", "Σχεδιασμός κάλυψης ανά δήμο, ταχυδρομικό κώδικα ή γειτονιά, χωρίς σπατάλη υλικού.", "images/greenpromo/landscape-report.webp"),
    ("05", "Σχεδιασμός & Εκτύπωση", "Από το δημιουργικό και την εκτύπωση έως τη διανομή, με μία οργανωμένη ροή εργασίας.", "images/greenpromo/reporting.webp"),
]

PACKAGES = [
    ("Custom", "€5", "/ώρα", "Για μικρούς όγκους, δοκιμαστικές διανομές ή ειδικές ανάγκες.", ["Ιδανικό για 100–500 φυλλάδια", "Χωρίς ελάχιστο όγκο", "Φωτογραφική απόδειξη", "Αναφορά ποσοτήτων"]),
    ("Starter", "€89", "", "Μικρή τοπική καμπάνια με σαφή κάλυψη μίας ζώνης.", ["Έως 2.000 φυλλάδια", "Κάλυψη 1 ζώνης", "Φωτογραφίες με χρονοσφραγίδα", "PDF αναφορά διανομής"]),
    ("Standard", "€199", "", "Η ολοκληρωμένη επιλογή για πολλαπλές γειτονιές και παρακολούθηση GPS.", ["Έως 5.000 φυλλάδια", "Κάλυψη 2–3 ζωνών", "Φωτογραφική απόδειξη + GPS", "Χάρτης διαδρομών και PDF"]),
    ("Pro", "€399", "", "Για μεγάλη καμπάνια πολλαπλών ζωνών με συνεχή συντονισμό.", ["10.000+ φυλλάδια", "Κάλυψη πολλαπλών ζωνών", "Πλήρης χάρτης θερμότητας κάλυψης", "Αποκλειστικός συντονιστής"]),
]


def nav(active=""):
    items = [
        ("services", "download.html", "Υπηρεσίες"),
        ("process", "index.html#usecase", "Πώς λειτουργεί"),
        ("pricing", "pricing.html", "Πακέτα"),
        ("coverage", "index.html#coverage", "Περιοχές κάλυψης"),
    ]
    links = "".join(
        f'<a href="{href}" class="{"is-active" if key == active else ""}">{label}</a>'
        for key, href, label in items
    )
    return f'''
    <header class="gp-header">
      <div class="container gp-nav-shell">
        <a class="gp-brand" href="index.html"><img src="images/greenpromo/logo-black.png" alt="GreenPromo"></a>
        <nav class="gp-nav-links" aria-label="Κύρια πλοήγηση">{links}</nav>
        <div class="gp-nav-actions">
          <a class="gp-icon-link" href="tel:+302103007716" aria-label="Καλέστε τη GreenPromo"><img src="images/greenpromo/phone.svg" alt=""></a>
          <a class="gp-icon-link" href="https://wa.me/306989442438" target="_blank" rel="noopener" aria-label="GreenPromo στο WhatsApp"><img src="images/greenpromo/whatsapp.svg" alt=""></a>
          <a class="gp-nav-quote" href="waitlist.html">Ζητήστε προσφορά</a>
        </div>
        <details class="gp-mobile-nav">
          <summary aria-label="Άνοιγμα μενού">Μενού</summary>
          <div>{links}<a href="waitlist.html">Ζητήστε προσφορά</a><a href="contact.html">Επικοινωνία</a></div>
        </details>
      </div>
    </header>'''


def footer():
    return '''
    <footer class="gp-footer">
      <div class="container gp-footer-grid">
        <div class="gp-footer-lead">
          <img src="images/greenpromo/logo-black.png" alt="GreenPromo">
          <h2>Επαγγελματική διανομή φυλλαδίων στην Αθήνα και την Αττική, με φωτογραφική απόδειξη και σαφή αναφορά.</h2>
          <div class="gp-footer-contact"><a href="tel:+302103007716">+30 210 300 7716</a><a href="mailto:info@greenpromo.marketing">info@greenpromo.marketing</a></div>
          <a class="gp-button gp-button-dark" href="waitlist.html">Ζητήστε δωρεάν προσφορά</a>
        </div>
        <div><h3>Πλοήγηση</h3><a href="download.html">Υπηρεσίες</a><a href="pricing.html">Πακέτα</a><a href="about.html">Σχετικά</a><a href="faqs.html">Συχνές ερωτήσεις</a><a href="contact.html">Επικοινωνία</a></div>
        <div><h3>Πληροφορίες</h3><a href="privacy-policy.html">Πολιτική απορρήτου</a><span>Αθήνα · Αττική · Πειραιάς</span><a href="https://www.facebook.com/GreenPromo.gr/" target="_blank" rel="noopener">Facebook ↗</a><a href="https://www.instagram.com/greenpromo.gr/" target="_blank" rel="noopener">Instagram ↗</a><a href="https://www.linkedin.com/company/greenpromo/" target="_blank" rel="noopener">LinkedIn ↗</a></div>
      </div>
      <div class="container gp-footer-bottom"><span>© 2026 GreenPromo. Με επιφύλαξη παντός δικαιώματος.</span><span>Αθήνα · Αττική · Πειραιάς</span></div>
    </footer>'''


def head(title, description):
    return f'''<!doctype html>
<html lang="el">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(description, quote=True)}">
  <meta name="author" content="GreenPromo">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://greenpromo.gr/">
  <link rel="shortcut icon" href="images/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">
  <script type="module" crossorigin src="assets/app.js"></script>
  <link rel="stylesheet" crossorigin href="assets/app.css">
  <link rel="stylesheet" href="{CUSTOM_CSS}">
</head>'''


def page(title, description, body_class, content, active=""):
    return f'''{head(title, description)}
<body class="gp-site gp-inner {body_class}">
{nav(active)}
<main>{content}</main>
{footer()}
</body>
</html>
'''


def button(label, href="waitlist.html", secondary=False):
    cls = "gp-button gp-button-light" if secondary else "gp-button gp-button-dark"
    return f'<a class="{cls}" href="{href}">{label}</a>'


def eyebrow(text):
    return f'<span class="gp-eyebrow">{text}</span>'


def faq_markup(items=FAQS):
    out = []
    for i, (q, a) in enumerate(items):
        out.append(f'''<details class="gp-faq-item" {'open' if i == 0 else ''}>
          <summary><span>{q}</span><b aria-hidden="true">+</b></summary><p>{a}</p>
        </details>''')
    return "".join(out)


def package_cards():
    cards = []
    for i, (name, price, unit, desc, features) in enumerate(PACKAGES):
        popular = '<span class="gp-popular">Πιο δημοφιλές</span>' if name == "Standard" else ""
        lis = "".join(f"<li>{item}</li>" for item in features)
        cards.append(f'''<article class="gp-package-card gp-package-{name.lower()}">{popular}<p class="gp-card-kicker">{name}</p><div class="gp-price">{price}<small>{unit}</small></div><p>{desc}</p><ul>{lis}</ul>{button('Επιλέξτε ' + name)}</article>''')
    return "".join(cards)


def build_about():
    content = f'''
    <section class="gp-page-hero gp-page-hero-split"><div><div>{eyebrow('Σχετικά με τη GreenPromo')}<h1>Διανομή με σχέδιο, εκτέλεση και τεκμηρίωση.</h1><p>Ξεκινάμε από το κοινό σας και συμφωνούμε ποσότητα, ζώνες, χρόνο και επίπεδο τεκμηρίωσης πριν βγει η ομάδα στο πεδίο.</p>{button('Ζητήστε προσφορά')}</div><img src="images/greenpromo/door-to-door.webp" alt="Διανομή φυλλαδίων σε κατοικίες στην Αθήνα"></div></section>
    <section class="gp-section"><div class="container gp-intro-grid"><div>{eyebrow('Η προσέγγισή μας')}<h2>Η διανομή δεν πρέπει να βασίζεται μόνο στην εμπιστοσύνη.</h2></div><div><p>Η GreenPromo οργανώνει κάθε καμπάνια γύρω από μια σαφή συμφωνία: πού διανέμεται το υλικό, ποια μέθοδος χρησιμοποιείται και τι στοιχεία θα παραδοθούν στο τέλος.</p><p>Έτσι η επιχείρησή σας γνωρίζει τι έγινε στο πεδίο και μπορεί να αξιολογήσει την επόμενη κίνηση με πραγματικά δεδομένα.</p></div></div></section>
    <section class="gp-section gp-section-soft"><div class="container"><div class="gp-section-heading">{eyebrow('Τέσσερις αρχές')}<h2>Καθαρή διαδικασία, από την προσφορά έως την αναφορά.</h2></div><div class="gp-value-grid"><article><b>01</b><h3>Σαφής συμφωνία</h3><p>Ποσότητα, ζώνες, μέθοδος και χρονοδιάγραμμα καταγράφονται πριν την έναρξη.</p></article><article><b>02</b><h3>Στοχευμένες ζώνες</h3><p>Η κάλυψη οργανώνεται ανά δήμο, ταχυδρομικό κώδικα ή γειτονιά.</p></article><article><b>03</b><h3>Εκτέλεση στο πεδίο</h3><p>Η ομάδα ακολουθεί το συμφωνημένο πλάνο και καταγράφει την πρόοδο.</p></article><article><b>04</b><h3>Τεκμηρίωση</h3><p>Φωτογραφίες, GPS όπου προβλέπεται και PDF αναφορά κλείνουν την καμπάνια.</p></article></div></div></section>
    <section class="gp-section"><div class="container gp-stat-strip"><div><strong>24h</strong><span>Απάντηση σε εργάσιμη</span></div><div><strong>5</strong><span>Μέθοδοι διανομής</span></div><div><strong>6</strong><span>Βασικές περιοχές</span></div><div><strong>100%</strong><span>Συμφωνία πριν την έναρξη</span></div></div></section>
    <section class="gp-section"><div class="container gp-media-grid"><img src="images/greenpromo/reporting.webp" alt="Αναφορά διανομής με χάρτη και φωτογραφίες"><div>{eyebrow('Αποτέλεσμα')}<h2>Μία καμπάνια που μπορείτε να παρακολουθήσετε και να εξηγήσετε.</h2><p>Η τεκμηρίωση οργανώνει ποσότητες, ζώνες και υλικό πεδίου σε μία καθαρή εικόνα.</p>{button('Δείτε τις υπηρεσίες', 'download.html')}</div></div></section>'''
    return page("Σχετικά με τη GreenPromo | Διανομή φυλλαδίων Αθήνα", "Η GreenPromo οργανώνει στοχευμένες διανομές φυλλαδίων στην Αθήνα και την Αττική, με φωτογραφική απόδειξη, GPS και σαφή αναφορά.", "gp-about-page", content)


def build_pricing():
    content = f'''
    <section class="gp-page-hero gp-page-hero-center"><div class="container">{eyebrow('Πακέτα διανομής')}<h1>Τιμολόγηση που διαβάζεται χωρίς υποσημειώσεις.</h1><p>Τέσσερις αφετηρίες για διαφορετική κλίμακα. Η τελική προσφορά επιβεβαιώνει ζώνες, μέθοδο και χρονοδιάγραμμα.</p></div></section>
    <section class="gp-section gp-pricing-section"><div class="container gp-package-grid">{package_cards()}</div><p class="container gp-pricing-note">Οι ποσότητες και οι περιοχές επιβεβαιώνονται στην τελική προσφορά. Ειδικές καμπάνιες τιμολογούνται ξεχωριστά.</p></section>
    <section class="gp-section gp-section-dark"><div class="container gp-compare"><div>{eyebrow('Σύγκριση')}<h2>Επιλέξτε με βάση την κάλυψη και την τεκμηρίωση.</h2><p>Αν δεν γνωρίζετε ποιο πακέτο ταιριάζει, στείλτε ποσότητα και περιοχές. Θα σας προτείνουμε την οικονομικότερη επιλογή που καλύπτει τον στόχο.</p>{button('Ζητήστε πρόταση', 'waitlist.html', True)}</div><ul><li><b>Custom</b><span>Μικροί όγκοι ή δοκιμή</span></li><li><b>Starter</b><span>Μία τοπική ζώνη</span></li><li><b>Standard</b><span>2–3 ζώνες με GPS</span></li><li><b>Pro</b><span>Πολλαπλές ζώνες και συντονισμός</span></li></ul></div></section>
    <section class="gp-section"><div class="container gp-faq-layout"><div>{eyebrow('Συχνές ερωτήσεις')}<h2>Πριν επιλέξετε πακέτο.</h2><p>Οι τελικές λεπτομέρειες επιβεβαιώνονται γραπτώς πριν ξεκινήσει η διανομή.</p></div><div>{faq_markup(FAQS[:4])}</div></div></section>'''
    return page("Πακέτα διανομής | GreenPromo", "Πακέτα διανομής φυλλαδίων στην Αθήνα από €5/ώρα, με φωτογραφική απόδειξη, GPS και PDF αναφορά.", "gp-pricing-page", content, "pricing")


def build_faqs():
    content = f'''
    <section class="gp-page-hero gp-page-hero-center"><div class="container">{eyebrow('Συχνές ερωτήσεις')}<h1>Ό,τι χρειάζεται να γνωρίζετε πριν ξεκινήσουμε.</h1><p>Συγκεντρώσαμε τις απαντήσεις για πακέτα, περιοχές, χρονοδιάγραμμα και τεκμηρίωση.</p></div></section>
    <section class="gp-section"><div class="container gp-faq-layout"><aside><h2>Δεν βρήκατε την απάντηση;</h2><p>Στείλτε μας ποσότητα και περιοχές. Απαντάμε συνήθως εντός μίας εργάσιμης.</p>{button('Επικοινωνήστε μαζί μας', 'contact.html')}</aside><div>{faq_markup()}</div></div></section>'''
    return page("Συχνές ερωτήσεις | GreenPromo", "Απαντήσεις για διανομή φυλλαδίων, φωτογραφική απόδειξη, GPS, περιοχές κάλυψης και πακέτα GreenPromo.", "gp-faq-page", content)


def build_contact():
    content = f'''
    <section class="gp-page-hero gp-page-hero-split"><div><div>{eyebrow('Επικοινωνία')}<h1>Ας σχεδιάσουμε την καμπάνια σας.</h1><p>Στείλτε ποσότητα, περιοχές και επιθυμητό χρονοδιάγραμμα. Θα απαντήσουμε με σαφή πρόταση εντός 24 ωρών.</p><div class="gp-contact-lines"><a href="tel:+302103007716">+30 210 300 7716</a><a href="mailto:info@greenpromo.marketing">info@greenpromo.marketing</a><a href="https://wa.me/306989442438">WhatsApp +30 698 944 2438 ↗</a></div></div><img src="images/greenpromo/business-distribution.webp" alt="Διανομή ενημερωτικού υλικού σε επιχείρηση"></div></section>
    <section class="gp-section"><div class="container gp-contact-grid"><div><h2>Πείτε μας τι χρειάζεστε.</h2><p>Όσο περισσότερα στοιχεία δώσετε, τόσο ακριβέστερη θα είναι η πρώτη πρόταση.</p></div><form class="gp-form" action="mailto:info@greenpromo.marketing" method="post" enctype="text/plain"><label>Ονοματεπώνυμο<input name="name" autocomplete="name" required></label><label>Email<input type="email" name="email" autocomplete="email" required></label><label>Τηλέφωνο<input type="tel" name="phone" autocomplete="tel" required></label><label>Υπηρεσία<select name="service"><option>Πόρτα-Πόρτα</option><option>Χέρι-με-Χέρι</option><option>Διανομή σε Επιχειρήσεις</option><option>Στοχευμένες Ζώνες</option><option>Σχεδιασμός & Εκτύπωση</option></select></label><label class="gp-wide">Μήνυμα<textarea name="message" placeholder="Ποσότητα, περιοχές, χρονοδιάγραμμα"></textarea></label><button class="gp-button gp-button-dark gp-wide" type="submit">Αποστολή αιτήματος</button></form></div></section>'''
    return page("Επικοινωνία | GreenPromo", "Επικοινωνήστε με τη GreenPromo για δωρεάν προσφορά διανομής φυλλαδίων στην Αθήνα και την Αττική.", "gp-contact-page", content)


def build_quote():
    content = f'''
    <section class="gp-page-hero gp-page-hero-center"><div class="container">{eyebrow('Δωρεάν προσφορά')}<h1>Χαρτογραφήστε την επόμενη καμπάνια σας.</h1><p>Στείλτε ποσότητα, περιοχές και χρονοδιάγραμμα. Θα απαντήσουμε με σαφή πρόταση εντός 24 ωρών.</p></div></section>
    <section class="gp-section"><div class="container gp-quote-layout"><div class="gp-quote-aside"><img src="images/greenpromo/phone-reporting.webp" alt="Χάρτης διαδρομών και αναφορά διανομής"><div><h2>Τι θα λάβετε</h2><ul><li>Πρόταση κατάλληλης μεθόδου</li><li>Σαφείς ζώνες κάλυψης</li><li>Χρονοδιάγραμμα εκτέλεσης</li><li>Συμφωνημένο επίπεδο τεκμηρίωσης</li></ul></div></div><form class="gp-form gp-quote-form" action="mailto:info@greenpromo.marketing" method="post" enctype="text/plain"><label>Ονοματεπώνυμο*<input name="name" autocomplete="name" required></label><label>Τηλέφωνο*<input type="tel" name="phone" autocomplete="tel" required></label><label>Email*<input type="email" name="email" autocomplete="email" required></label><label>Υπηρεσία*<select name="service" required><option value="">Επιλέξτε</option><option>Πόρτα-Πόρτα</option><option>Χέρι-με-Χέρι</option><option>Διανομή σε Επιχειρήσεις</option><option>Στοχευμένες Ζώνες</option><option>Σχεδιασμός & Εκτύπωση</option></select></label><label>Περιοχές κάλυψης<input name="zones" placeholder="π.χ. Χαλάνδρι, Μαρούσι"></label><label>Ποσότητα<select name="quantity"><option>Κάτω από 1.000</option><option>1.000–2.000</option><option>2.000–5.000</option><option>5.000–10.000</option><option>10.000+</option></select></label><label>Χρονοδιάγραμμα<select name="timeline"><option>Express</option><option>Εντός 1 εβδομάδας</option><option>Εντός 2 εβδομάδων</option><option>Ευέλικτο</option></select></label><label class="gp-wide">Μήνυμα<textarea name="message" placeholder="Περιγράψτε τον στόχο της καμπάνιας"></textarea></label><label class="gp-check gp-wide"><input type="checkbox" required> Συμφωνώ με την <a href="privacy-policy.html">πολιτική απορρήτου</a>.</label><button class="gp-button gp-button-dark gp-wide" type="submit">Λήψη δωρεάν προσφοράς</button></form></div></section>'''
    return page("Δωρεάν προσφορά | GreenPromo", "Ζητήστε δωρεάν προσφορά για διανομή φυλλαδίων στην Αθήνα και την Αττική. Απάντηση εντός 24 ωρών.", "gp-quote-page", content)


def build_services():
    cards = "".join(f'''<article class="gp-service-detail"><img src="{img}" alt="{title}"><div><span>{num}</span><h2>{title}</h2><p>{desc}</p><ul><li>Σαφής ζώνη και χρονοδιάγραμμα</li><li>Φωτογραφική τεκμηρίωση</li><li>Αναφορά ολοκλήρωσης</li></ul>{button('Ζητήστε προσφορά')}</div></article>''' for num, title, desc, img in SERVICES)
    content = f'''
    <section class="gp-page-hero gp-page-hero-center"><div class="container">{eyebrow('Υπηρεσίες διανομής')}<h1>Η σωστή μέθοδος για κάθε σημείο επαφής.</h1><p>Από μία τοπική γειτονιά μέχρι καμπάνια πολλαπλών ζωνών, σχεδιάζουμε τη διανομή γύρω από το κοινό και τον στόχο σας.</p></div></section>
    <section class="gp-section"><div class="container gp-service-stack">{cards}</div></section>'''
    return page("Υπηρεσίες διανομής | GreenPromo", "Πόρτα-πόρτα, χέρι-με-χέρι, διανομή σε επιχειρήσεις, στοχευμένες ζώνες, σχεδιασμός και εκτύπωση.", "gp-services-page", content, "services")


def build_privacy():
    content = f'''
    <section class="gp-page-hero gp-page-hero-center"><div class="container">{eyebrow('Νομικά')}<h1>Πολιτική απορρήτου</h1><p>Τελευταία ενημέρωση: 31 Οκτωβρίου 2026</p></div></section>
    <section class="gp-section"><article class="container gp-legal"><h2>Συλλογή προσωπικών δεδομένων</h2><p>Συλλέγουμε μόνο τα στοιχεία που είναι αναγκαία για να απαντήσουμε στο αίτημά σας, να προετοιμάσουμε προσφορά και να εκτελέσουμε τη συμφωνημένη καμπάνια. Αυτά μπορεί να περιλαμβάνουν ονοματεπώνυμο, email, τηλέφωνο, στοιχεία επιχείρησης, περιοχές, ποσότητες και χρονοδιάγραμμα.</p><h2>Σκοπός επεξεργασίας</h2><p>Χρησιμοποιούμε τα δεδομένα για επικοινωνία, προετοιμασία προσφοράς, συντονισμό της υπηρεσίας, τιμολόγηση και συμμόρφωση με νόμιμες υποχρεώσεις. Δεν πωλούμε προσωπικά δεδομένα.</p><h2>Κοινοποίηση και επεξεργασία</h2><p>Δεδομένα μπορούν να κοινοποιηθούν μόνο σε παρόχους που είναι απαραίτητοι για τη φιλοξενία, τη λειτουργία των φορμών, την εκτύπωση ή την εκτέλεση της υπηρεσίας, με κατάλληλες δεσμεύσεις εμπιστευτικότητας.</p><h2>Χρόνος διατήρησης</h2><p>Διατηρούμε τα στοιχεία μόνο όσο απαιτείται για τους παραπάνω σκοπούς και τις νόμιμες φορολογικές ή λογιστικές υποχρεώσεις.</p><h2>Τα δικαιώματά σας</h2><p>Σύμφωνα με τον GDPR, μπορείτε να ζητήσετε πρόσβαση, διόρθωση, περιορισμό ή διαγραφή των δεδομένων σας, όπου αυτό επιτρέπεται. Για οποιοδήποτε αίτημα επικοινωνήστε στο <a href="mailto:info@greenpromo.marketing">info@greenpromo.marketing</a>.</p><h2>Cookies και τεχνικά δεδομένα</h2><p>Ο ιστότοπος μπορεί να καταγράφει βασικά τεχνικά δεδομένα χρήσης και cookies που είναι απαραίτητα για τη λειτουργία ή, μετά από συγκατάθεση, για ανάλυση επισκεψιμότητας.</p><h2>Επικοινωνία</h2><p>GreenPromo, Αθήνα & Αττική · <a href="tel:+302103007716">+30 210 300 7716</a> · <a href="mailto:info@greenpromo.marketing">info@greenpromo.marketing</a>.</p></article></section>'''
    return page("Πολιτική απορρήτου | GreenPromo", "Πολιτική απορρήτου και προστασίας προσωπικών δεδομένων της GreenPromo σύμφωνα με τον GDPR.", "gp-privacy-page", content)


def replace_fragment(soup, tag_name, markup):
    current = soup.find(tag_name)
    replacement = BeautifulSoup(markup, "html.parser").find(tag_name)
    if current and replacement:
        current.replace_with(replacement)


def polish_home():
    path = ROOT / "index.html"
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    if not soup.head.find("link", href=CUSTOM_CSS):
        soup.head.append(BeautifulSoup(f'<link rel="stylesheet" href="{CUSTOM_CSS}">', "html.parser"))
    soup.body["class"] = ["gp-site", "gp-home"]
    replace_fragment(soup, "header", nav())
    replace_fragment(soup, "footer", footer())

    class_map = {
        "hero-section": "gp-hero",
        "about-section": "gp-about",
        "feature-section": "gp-features",
        "tabs-section": "gp-process",
        "metrics-section": "gp-pricing",
        "stats-section": "gp-coverage",
        "smart-assist-section": "gp-proof",
        "testimonials-section": "gp-areas",
        "feedback-section": "gp-audiences",
        "faq-section": "gp-faq",
        "download-section": "gp-cta",
    }
    for comment in soup.find_all(string=lambda s: isinstance(s, Comment)):
        key = str(comment).strip()
        if key in class_map:
            section = comment.find_next("section")
            if section:
                section["class"] = list(section.get("class", [])) + [class_map[key]]

    hero = soup.select_one("section.gp-hero")
    if hero:
        collage = hero.find("div", class_=lambda c: c and "max-w-5xl" in c and "items-start" in c)
        if collage:
            collage["class"] = list(collage.get("class", [])) + ["gp-hero-collage"]

    # Make the image system varied instead of repeating one visual everywhere.
    areas = soup.select_one("section.gp-areas")
    if areas:
        replacements = ["images/greenpromo/landscape-door.webp", "images/greenpromo/landscape-hand.webp", "images/greenpromo/landscape-business.webp", "images/greenpromo/landscape-report.webp"]
        for img, src in zip(areas.find_all("img"), replacements * 4):
            if "icon" not in img.get("src", ""):
                img["src"] = src

    html_text = str(soup)
    replacements = {
        "Ζώνες κάλυψης\n                                    </p>\n                                    <p class=\"lg:text-5xl md:text-4xl text-3xl font-medium text-white\">12": "Ζώνες κάλυψης\n                                    </p>\n                                    <p class=\"lg:text-5xl md:text-4xl text-3xl font-medium text-white\">6",
        "μέθοδοι διανομής\n                                    </p>\n                                    <p class=\"lg:text-5xl md:text-4xl text-3xl font-medium text-white\">7": "μέθοδοι διανομής\n                                    </p>\n                                    <p class=\"lg:text-5xl md:text-4xl text-3xl font-medium text-white\">5",
        "Ιδανικό για 100–500 φυλλάδια · Χωρίς ελάχιστο όγκο · Φωτογραφική απόδειξη · Αναφορά ποσοτήτων": "100–500 φυλλάδια · Χωρίς ελάχιστο όγκο · Φωτογραφική απόδειξη.",
        "Έως 2.000 φυλλάδια · Κάλυψη 1 ζώνης · Φωτογραφίες με χρονοσφραγίδα · PDF αναφορά διανομής": "Έως 2.000 φυλλάδια · 1 ζώνη · Φωτογραφίες με χρονοσφραγίδα · PDF.",
        "Έως 5.000 φυλλάδια · Κάλυψη 2–3 ζωνών · Φωτογραφική απόδειξη + GPS · Χάρτης διαδρομών και PDF": "Έως 5.000 φυλλάδια · 2–3 ζώνες · GPS και χάρτης διαδρομών.",
        "10.000+ φυλλάδια · Κάλυψη πολλαπλών ζωνών · Πλήρης χάρτης θερμότητας κάλυψης · Αποκλειστικός συντονιστής": "10.000+ φυλλάδια · Πολλαπλές ζώνες · Αποκλειστικός συντονιστής.",
    }
    for old, new in replacements.items():
        html_text = html_text.replace(old, new)
    path.write_text("<!doctype html>\n" + re.sub(r"^<!DOCTYPE[^>]*>\s*", "", html_text, flags=re.I), encoding="utf-8")


def main():
    polish_home()
    pages = {
        "about.html": build_about(),
        "pricing.html": build_pricing(),
        "faqs.html": build_faqs(),
        "contact.html": build_contact(),
        "waitlist.html": build_quote(),
        "download.html": build_services(),
        "privacy-policy.html": build_privacy(),
    }
    for filename, markup in pages.items():
        (ROOT / filename).write_text(markup, encoding="utf-8")
    print(f"Refined {len(pages) + 1} GreenPromo pages in {ROOT}")


if __name__ == "__main__":
    main()
