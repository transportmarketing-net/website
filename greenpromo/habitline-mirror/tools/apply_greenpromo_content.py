#!/usr/bin/env python3
"""Apply GreenPromo copy and media without changing Habitline's DOM or CSS."""

from __future__ import annotations

import ast
import re
from pathlib import Path


MIRROR_ROOT = Path(__file__).resolve().parents[1]
SITE = MIRROR_ROOT / "site"
LEGACY_HOME_COPY = MIRROR_ROOT.parent / "scripts" / "apply_habitline_greenpromo_copy.py"
PAGES = (
    "index.html",
    "about.html",
    "pricing.html",
    "faqs.html",
    "contact.html",
    "waitlist.html",
    "download.html",
    "privacy-policy.html",
)


META = {
    "index.html": (
        "GreenPromo — Διανομή Φυλλαδίων με Τεκμηρίωση | Αθήνα",
        "Επαγγελματική διανομή φυλλαδίων στην Αθήνα και την Αττική με φωτογραφική απόδειξη, GPS όπου προβλέπεται και σαφή αναφορά.",
    ),
    "about.html": (
        "Σχετικά με τη GreenPromo | Διανομή Φυλλαδίων Αθήνα",
        "Η GreenPromo οργανώνει στοχευμένες διανομές φυλλαδίων στην Αθήνα και την Αττική με σαφή σχεδιασμό και τεκμηρίωση.",
    ),
    "pricing.html": (
        "Πακέτα Διανομής Φυλλαδίων | GreenPromo",
        "Επιλέξτε πακέτο διανομής φυλλαδίων για μία ή περισσότερες ζώνες στην Αθήνα και την Αττική.",
    ),
    "faqs.html": (
        "Συχνές Ερωτήσεις | GreenPromo",
        "Απαντήσεις για πακέτα, περιοχές, χρονοδιάγραμμα, φωτογραφική απόδειξη, GPS και αναφορές διανομής.",
    ),
    "contact.html": (
        "Επικοινωνία | GreenPromo",
        "Επικοινωνήστε με τη GreenPromo για δωρεάν προσφορά διανομής φυλλαδίων στην Αθήνα και την Αττική.",
    ),
    "waitlist.html": (
        "Δωρεάν Προσφορά | GreenPromo",
        "Στείλτε ποσότητα, περιοχές και χρονοδιάγραμμα για δωρεάν προσφορά διανομής φυλλαδίων.",
    ),
    "download.html": (
        "Υπηρεσίες Διανομής | GreenPromo",
        "Πόρτα-πόρτα, χέρι-με-χέρι, διανομή σε επιχειρήσεις, στοχευμένες ζώνες και τεκμηρίωση.",
    ),
    "privacy-policy.html": (
        "Πολιτική Απορρήτου | GreenPromo",
        "Πολιτική απορρήτου και προστασίας προσωπικών δεδομένων της GreenPromo.",
    ),
}


COMMON_TEXT = {
    "Features": "Υπηρεσίες",
    "Usecase": "Πώς λειτουργεί",
    "Metrics": "Πακέτα",
    "Smart Assist": "Τεκμηρίωση",
    "Pages": "Σελίδες",
    "Home": "Αρχική",
    "About": "Σχετικά",
    "Pricing": "Πακέτα",
    "Contact": "Επικοινωνία",
    "Waitlist": "Δωρεάν προσφορά",
    "Download": "Υπηρεσίες",
    "FAQs": "Συχνές ερωτήσεις",
    "Privacy Policy": "Πολιτική απορρήτου",
    "Build better habits with less effort": "Έτοιμοι να χαρτογραφήσουμε την καμπάνια σας;",
    "Track what matters, stay organized, and improve at your own pace.": "Στείλτε ποσότητα, περιοχές και χρονοδιάγραμμα. Θα απαντήσουμε με σαφή πρόταση.",
    "Download for iPhone": "Καλέστε μας",
    "Get it on Android": "WhatsApp",
    "Scan the QR code to download the app": "Αθήνα · Αττική · Πειραιάς",
    "Stay on top of your habits": "Επαγγελματική διανομή φυλλαδίων",
    "No spam. Just simple advice for staying consistent.": "+30 210 300 7716 · info@greenpromo.marketing",
    "Subscribe": "Ζητήστε προσφορά",
    "Pages links": "Πλοήγηση",
    "Other links": "Στοιχεία επικοινωνίας",
    "Develop by": "© 2026 GreenPromo.",
    "Unifato": "Αθήνα · Αττική · Πειραιάς",
    "Common Questions": "Συχνές ερωτήσεις",
    "Frequently Asked Questions": "Συχνές ερωτήσεις",
    "Frequently asked questions": "Ό,τι χρειάζεται να γνωρίζετε πριν ξεκινήσουμε.",
    "Get started": "Ζητήστε προσφορά",
    "Contact us": "Επικοινωνήστε μαζί μας",
    "Enter your email": "Το email σας",
    "(Trusted by 1582+ users)": "6 βασικές ζώνες κάλυψης",
}


FAQ_TEXT = {
    "How many habits can I track?": "Ποιο πακέτο ταιριάζει στην καμπάνια μου;",
    "You can track unlimited habits, giving you complete freedom to create and organize.": "Το κατάλληλο πακέτο εξαρτάται από την ποσότητα, τις περιοχές, τη μέθοδο και το επίπεδο τεκμηρίωσης.",
    "Do reminders work across all devices?": "Πώς λειτουργεί η φωτογραφική απόδειξη;",
    "Yes. Your reminders sync automatically and trigger on any device where Habitline is installed.": "Συλλέγονται φωτογραφίες από χαρακτηριστικά σημεία της διανομής και οργανώνονται στην τελική αναφορά.",
    "What happens if I miss a day?": "Σε πόσες ημέρες ολοκληρώνεται η διανομή;",
    "If you miss a day, nothing drastic happens your progress is still saved, and you can pick up right where you left off.": "Το χρονοδιάγραμμα συμφωνείται πριν την έναρξη και εξαρτάται από ποσότητα, μέθοδο και αριθμό ζωνών.",
    "Can I create routines for different times of day?": "Μπορώ να επιλέξω συγκεκριμένες γειτονιές;",
    "Yes, you can create routines for different times of the day. Organize your habits into morning, afternoon, or evening blocks.": "Ναι. Η κάλυψη οργανώνεται ανά δήμο, ταχυδρομικό κώδικα ή συγκεκριμένη γειτονιά.",
    "Yes, you can create routines for different times of the day. Organize your habits into morning.": "Ναι. Η κάλυψη οργανώνεται ανά δήμο, ταχυδρομικό κώδικα ή συγκεκριμένη γειτονιά.",
    "Yes, you can organize habits into morning, afternoon, and evening routines for better daily structure.": "Ναι. Η κάλυψη οργανώνεται ανά δήμο, ταχυδρομικό κώδικα ή συγκεκριμένη γειτονιά.",
    "Is Habitline free to use?": "Παρέχετε GPS και χάρτη διαδρομών;",
    "Yes, Habitline offers a free plan with essential features so you can start building habits without any cost.": "Η αρχική προσφορά είναι δωρεάν. GPS και χάρτης διαδρομών περιλαμβάνονται όπου αναγράφεται στο συμφωνημένο πακέτο.",
    "Habitline is free to use with essential features available at no cost. You can track habits, create routines..": "Η προσφορά είναι δωρεάν και περιγράφει καθαρά ποσότητα, ζώνες, χρονοδιάγραμμα και τεκμηρίωση.",
    "Habitline is free to use with essential features available at no cost. You can track habits, create routines.": "Η προσφορά είναι δωρεάν και περιγράφει καθαρά ποσότητα, ζώνες, χρονοδιάγραμμα και τεκμηρίωση.",
    "Habitline is free to use with essential features available at no cost. You can track habits, create routines, and set basic reminders.": "Η προσφορά είναι δωρεάν και περιγράφει καθαρά ποσότητα, ζώνες, χρονοδιάγραμμα και τεκμηρίωση.",
    "Are there analytics or progress insights": "Τι περιλαμβάνει η τελική αναφορά;",
    "Yes, Habitline provides clear insights to help you understand patterns and improve consistency.": "Η αναφορά συγκεντρώνει συμφωνημένες ποσότητες, ζώνες, φωτογραφίες και στοιχεία GPS όπου προβλέπονται.",
    "Do you offer customer support?": "Μπορώ να αλλάξω τη ζώνη πριν ξεκινήσετε;",
    "Yes, support is available, with priority assistance for Pro and Premium users.": "Ναι, αρκεί η αλλαγή να επιβεβαιωθεί πριν ξεκινήσει η ομάδα πεδίου.",
    "Is there a free plan?": "Η προσφορά είναι δωρεάν;",
    "What’s included in the Pro plan?": "Τι περιλαμβάνει το Pro πακέτο;",
    "The Pro plan includes advanced insights, focus tools, custom reminders, and detailed progress reports.": "Το Pro καλύπτει πολλαπλές ζώνες, συνεχή συντονισμό και το συμφωνημένο πλήρες επίπεδο τεκμηρίωσης.",
    "How does yearly billing work?": "Πώς υπολογίζεται η τελική τιμή;",
    "Yearly billing offers the same features as monthly plans at a discounted price, helping you save more over time.": "Η τιμή εξαρτάται από ποσότητα, μέθοδο, ζώνες, χρονοδιάγραμμα και επίπεδο τεκμηρίωσης.",
    "Is my payment information secure?": "Πότε επιβεβαιώνεται η καμπάνια;",
    "Absolutely. All payments are processed through secure, encrypted payment gateways.": "Η καμπάνια ξεκινά μόνο αφού επιβεβαιωθούν γραπτώς η προσφορά, οι ζώνες και το χρονοδιάγραμμα.",
}


PAGE_TEXT = {
    "about.html": {
        "About the App": "Σχετικά με τη GreenPromo",
        "A simpler way to build habits": "Διανομή με σχέδιο.",
        "Download the app": "Ζητήστε προσφορά",
        "You?": "Εσείς;",
        "Trusted by worldwide": "Επιχειρήσεις σε όλη την Αττική",
        "Trusted worldwide": "Αθήνα & Αττική",
        "Most habit tools focus on streaks, pressure, and unrealistic expectations. Our mission is to create a system that works with real human behavior.": "Η αποτελεσματική διανομή δεν βασίζεται σε υποσχέσεις. Βασίζεται σε σωστή ζώνη, καθαρό χρονοδιάγραμμα και τεκμηρίωση από το πεδίο.",
        "Your habits shift as your day shifts, and the app supports those changes instead of punishing them. We focus on small wins, gentle nudges, and simple structure so people can stay consistent even when life gets messy.": "Σχεδιάζουμε κάθε καμπάνια γύρω από το κοινό, την περιοχή και την ποσότητα, ώστε η ομάδα να γνωρίζει ακριβώς τι πρέπει να εκτελέσει.",
        "Keep it simple": "Σαφής σχεδιασμός",
        "A clear list, helpful reminders, and easy tracking.": "Ποσότητα, ζώνες και μέθοδος συμφωνούνται πριν την έναρξη.",
        "Adapt to real life": "Προσαρμογή στην περιοχή",
        "Adapts to your changing day so routines stay realistic.": "Η διαδρομή προσαρμόζεται στη μορφολογία και την κίνηση κάθε ζώνης.",
        "Focus on small wins": "Έλεγχος εκτέλεσης",
        "Focuses on small, doable actions that build real habits.": "Η πρόοδος καταγράφεται με το συμφωνημένο επίπεδο τεκμηρίωσης.",
        "Support, not pressure": "Καθαρή αναφορά",
        "Encourages consistency with gentle, supportive nudges.": "Παραδίδουμε συγκεντρωμένη εικόνα της ολοκληρωμένης καμπάνιας.",
        "Why Habitline Exists": "Γιατί GreenPromo",
        "Building habits shouldn’t feel overwhelming": "Η διανομή δεν πρέπει να λειτουργεί στα τυφλά.",
        "Most tools expect perfect streaks, fixed schedules, and unlimited motivation. But real life isn’t that consistent. Days get busy. Plans shift. People forget.": "Η πραγματική εργασία πεδίου έχει δρόμους, ώρες αιχμής και διαφορετικούς τύπους κτιρίων. Γι’ αυτό κάθε καμπάνια χρειάζεται συγκεκριμένο πλάνο.",
        "Real life is unpredictable": "Οι ζώνες έχουν ιδιαιτερότητες",
        "Progress shouldn’t feel overwhelming": "Η πρόοδος πρέπει να είναι ορατή",
        "Motivation isn’t enough": "Η συμφωνία πρέπει να είναι σαφής",
        "Open the features": "Δείτε τις υπηρεσίες",
        "Habitline in numbers": "Η υπηρεσία σε αριθμούς",
        "Real habits, real": "Πραγματική εργασία,",
        "consistency": "καθαρή τεκμηρίωση",
        "Average monthly consistency": "Απάντηση σε εργάσιμη",
        "Users stay on track most of the month.": "Λαμβάνετε σαφή πρώτη πρόταση για την καμπάνια.",
        "Sessions completed on average": "Μέθοδοι διανομής",
        "Regular habits are completed each month.": "Επιλέγεται η κατάλληλη μέθοδος ανά κοινό και περιοχή.",
        "Countries with active Habitline users": "Βασικές περιοχές κάλυψης",
        "People are using Habitline around the world.": "Η διαθεσιμότητα επιβεβαιώνεται στην προσφορά.",
        "check-ins logged last month": "συμφωνία πριν από κάθε έναρξη",
        "Our Team": "Η διαδικασία",
        "The people who": "Τα βήματα που",
        "drive the work": "οργανώνουν την καμπάνια",
        "Riya Patel": "Στόχος καμπάνιας",
        "Lead Designer": "Κοινό, ποσότητα και επιθυμητό αποτέλεσμα",
        "Ethan Walker": "Χαρτογράφηση ζώνης",
        "Creative Director": "Δήμος, γειτονιά ή ταχυδρομικός κώδικας",
        "Logan Reed": "Πλάνο εκτέλεσης",
        "Frontend Engineer": "Μέθοδος, διαδρομή και χρονοδιάγραμμα",
        "Harper Collins": "Ομάδα πεδίου",
        "Content & Brand Specialist": "Εκτέλεση της συμφωνημένης διανομής",
        "Noah Brooks": "Τεκμηρίωση",
        "Project Lead": "Φωτογραφίες και GPS όπου προβλέπεται",
        "Sophie Carter": "Τελική αναφορά",
        "Product Strategist": "Συγκεντρωμένη εικόνα της καμπάνιας",
        "Be part of shaping systems that keep teams aligned and productive.": "Θέλετε να σχεδιάσουμε την επόμενη καμπάνια σας;",
    },
    "pricing.html": {
        "Pricing plan": "Πακέτα διανομής",
        "Clear Plans for everyone": "Καθαρές επιλογές για κάθε κλίμακα.",
        "Monthly": "Κανονική",
        "Yearly": "Ενισχυμένη",
        "Free": "Custom",
        "Build habits effortlessly and stay consistent every day.": "Για μικρούς όγκους, δοκιμαστικές διανομές ή ειδικές ανάγκες.",
        "Unlimited habit tracking": "Αφετηρία από €5/ώρα",
        "Daily reminders": "Επιλογή κατάλληλης μεθόδου",
        "Basic streaks & progress": "Αναφορά ποσοτήτων",
        "Morning and evening routines": "Συμφωνημένη ζώνη κάλυψης",
        "Simple progress view": "Αναφορά ολοκλήρωσης",
        "Pro plan": "Standard",
        "Stay consistent with smarter tools that help you track progress.": "Για 2–3 ζώνες με ενισχυμένη παρακολούθηση της διανομής.",
        "Advanced habit insights": "Έως 5.000 φυλλάδια",
        "Weekly progress reports": "Κάλυψη 2–3 ζωνών",
        "Focus & time blocks": "GPS όπου προβλέπεται",
        "Custom reminders": "Χάρτης διαδρομών και αναφορά",
        "Premium plan": "Pro",
        "Transform habits long-term with personalized insights.": "Για μεγάλες καμπάνιες πολλαπλών ζωνών και συνεχή συντονισμό.",
        "Personalized habit insights": "10.000+ φυλλάδια",
        "Unlimited routines & stacks": "Πολλαπλές ζώνες κάλυψης",
        "Priority support": "Αποκλειστικός συντονιστής",
        "Early access to new features": "Πλήρης συμφωνημένη τεκμηρίωση",
        "Features": "Χαρακτηριστικά",
        "Free plan": "Custom",
        "$0": "από €5/ώρα",
        "$20/month": "€199",
        "$150/month": "€399",
        "Habit tracking": "Σχεδιασμός ζώνης",
        "Daily reminders": "Φωτογραφική απόδειξη",
        "Focus & time blocks": "GPS παρακολούθηση",
        "Custom reminders": "PDF αναφορά",
        "Priority support": "Αποκλειστικός συντονιστής",
    },
    "faqs.html": {},
    "contact.html": {
        "Contact Us": "Επικοινωνία",
        "We're here to help": "Ας σχεδιάσουμε την καμπάνια σας.",
        "If you have questions, feedback, or need support, reach out, and we’ll get back to you as soon as we can.": "Στείλτε ποσότητα, περιοχές και επιθυμητό χρονοδιάγραμμα. Θα απαντήσουμε με σαφή πρόταση.",
        "Your name*": "Ονοματεπώνυμο*",
        "Subject": "Θέμα",
        "Email address*": "Διεύθυνση email*",
        "Message": "Μήνυμα",
        "Send message": "Αποστολή αιτήματος",
        "Reach us directly": "Επικοινωνήστε απευθείας",
        "Support Email": "Τηλέφωνο",
        "support@habitline.app": "+30 210 300 7716",
        "Business / Partnerships": "Email",
        "hello@habitline.app": "info@greenpromo.marketing",
    },
    "waitlist.html": {
        "Join the Habitline waitlist": "Ζητήστε δωρεάν προσφορά",
        "We’re getting ready to launch a cleaner, calmer habit app built around real life.": "Στείλτε το email σας μαζί με ποσότητα και περιοχές. Θα επικοινωνήσουμε για να οργανώσουμε την καμπάνια.",
        "Join the waitlist": "Αποστολή αιτήματος",
    },
    "download.html": {
        "Start building better habits today": "Η σωστή μέθοδος για κάθε σημείο επαφής.",
        "Download Habitline to build routines that adjust to your day. Track habits get smart suggestions that help you stay consistent without pressure.": "Πόρτα-πόρτα, χέρι-με-χέρι, επιχειρήσεις και στοχευμένες ζώνες, με το επίπεδο τεκμηρίωσης που συμφωνείται πριν την έναρξη.",
        "Countries using Habitline": "Βασικές περιοχές κάλυψης",
        "Sessions completed per user": "Μέθοδοι διανομής",
        "Scan here": "Στείλτε στοιχεία",
        "to download": "για δωρεάν προσφορά",
        "32": "6",
        "46": "5",
    },
    "privacy-policy.html": {
        "Last updated: 10 Jan 2026": "Τελευταία ενημέρωση: 1 Νοεμβρίου 2026",
        "Collecting Personal Information": "Συλλογή προσωπικών δεδομένων",
        "Habitline collects limited personal information to provide a smooth, personalized habit-tracking experience. This includes details you share when creating an account and data generated while using the app. We collect only what is necessary to improve functionality, insights, and overall usability.": "Συλλέγουμε μόνο τα στοιχεία που είναι αναγκαία για να απαντήσουμε στο αίτημά σας, να προετοιμάσουμε προσφορά και να εκτελέσουμε τη συμφωνημένη καμπάνια.",
        "Account details such as name and email address": "Ονοματεπώνυμο, email και τηλέφωνο επικοινωνίας",
        "Habits, routines, streaks, and completion activity": "Ποσότητα, περιοχές και επιθυμητό χρονοδιάγραμμα",
        "App usage data to improve performance and features": "Στοιχεία που είναι απαραίτητα για την παροχή της υπηρεσίας",
        "Device and technical information for stability and security": "Βασικά τεχνικά δεδομένα για ασφάλεια και λειτουργία",
        "We use this information solely to operate and enhance Habitline. Your data is never collected for unnecessary or unrelated purposes.": "Χρησιμοποιούμε τα δεδομένα μόνο για επικοινωνία, προσφορά, συντονισμό, τιμολόγηση και νόμιμες υποχρεώσεις.",
        "Sharing Personal Information": "Κοινοποίηση προσωπικών δεδομένων",
        "Data is shared strictly when necessary to operate the platform responsibly and securely—such as with trusted service providers who help with hosting, analytics, or customer support. These partners are required to follow strict confidentiality and security standards. We may also disclose information when required by law or to protect the safety, rights, and integrity of our users and the Habitline platform. Outside of these limited and essential situations, your personal data remains private and fully under your control.": "Δεδομένα κοινοποιούνται μόνο σε παρόχους που είναι απαραίτητοι για φιλοξενία, επικοινωνία, εκτύπωση ή εκτέλεση της υπηρεσίας, καθώς και όταν απαιτείται από τον νόμο.",
        "Habitline respects your privacy and does not sell or misuse your personal data. Information is shared only when required to operate the service responsibly and securely.": "Η GreenPromo δεν πωλεί προσωπικά δεδομένα και τα χρησιμοποιεί μόνο για τους σκοπούς που περιγράφονται στην παρούσα πολιτική.",
        "With trusted service providers for hosting, analytics, and customer support": "Με αναγκαίους παρόχους φιλοξενίας, επικοινωνίας και υποστήριξης",
        "To comply with legal requirements or lawful requests": "Για συμμόρφωση με νόμιμες υποχρεώσεις",
        "To protect the rights, safety, or security of users and the platform": "Για προστασία δικαιωμάτων, ασφάλειας και ακεραιότητας",
        "During business operations such as service improvements or maintenance": "Για την εκτέλεση και υποστήριξη της συμφωνημένης υπηρεσίας",
        "All shared data is handled securely and only for purposes aligned with Habitline’s core services. We continuously review our practices to ensure your information remains protected and confidential.": "Τα δεδομένα διατηρούνται μόνο όσο απαιτείται και προστατεύονται σύμφωνα με την ισχύουσα νομοθεσία και τον GDPR.",
    },
}


HOME_RAW_TEXT = {
    "New": "24h",
    "A calmer way to build habits": "Δωρεάν προσφορά εντός μίας εργάσιμης",
    "Build habits that": "Η διανομή σας.",
    "actually stick": "Τεκμηριωμένη.",
    "You see the right habits at the right time, so your day never feels crowded.": "Φυλλάδια σε σπίτια, περαστικούς και επιχειρήσεις στην Αθήνα — με φωτογραφική απόδειξη, GPS όπου προβλέπεται και καθαρή αναφορά.",
    "Start Tracking Free": "Ζητήστε δωρεάν προσφορά",
    "Watch Demo": "Δείτε πώς τεκμηριώνεται",
    "Build steady daily": "Η σωστή μέθοδος",
    "habits with a layout": "για κάθε σημείο επαφής.",
    "that keeps your mornings, evenings,": "Από μία τοπική γειτονιά μέχρι καμπάνια πολλαπλών ζωνών,",
    "and focus hours simple to follow.": "σχεδιάζουμε τη διανομή γύρω από το κοινό και τον στόχο σας.",
    "Used by people to improve their routines.": "Σχεδιασμός, εκτέλεση και τεκμηρίωση σε μία καθαρή ροή.",
    "#Founders": "#Πόρτα-Πόρτα",
    "#Students": "#Χέρι-με-Χέρι",
    "#BusyParents": "#Επιχειρήσεις",
    "#RemoteTeams": "#ΣτοχευμένεςΖώνες",
    "(Trusted by 1582+ users)": "6 βασικές ζώνες κάλυψης",
}


IMAGE_MAP = {
    "images/logo.svg": "images/greenpromo/logo-black.png",
    "images/hero-image.jpg": "images/greenpromo/hero-background-v2.webp",
    "images/workspace/dashboard-01.svg": "images/greenpromo/hero-handout-v2.webp",
    "images/workspace/dashboard-03.svg": "images/greenpromo/reporting-dashboard-v2.png",
    "images/workspace/dashboard-02.svg": "images/greenpromo/hero-business-v2.webp",
    "images/about/about-01.webp": "images/greenpromo/landscape-door-v2.webp",
    "images/about/about-02.webp": "images/greenpromo/landscape-handout-v2.webp",
    "images/about/about-03.webp": "images/greenpromo/landscape-report-v2.webp",
    "images/about/about-04.webp": "images/greenpromo/landscape-business-v2.webp",
    "images/gallery/marquee-image-01.webp": "images/greenpromo/square-door-v2.webp",
    "images/gallery/marquee-image-02.webp": "images/greenpromo/square-handout-v2.webp",
    "images/gallery/marquee-image-03.webp": "images/greenpromo/square-business-v2.webp",
    "images/gallery/marquee-image-04.webp": "images/greenpromo/square-report-v2.webp",
    "images/gallery/marquee-image-05.webp": "images/greenpromo/square-mailboxes-v2.webp",
    "images/gallery/marquee-image-06.webp": "images/greenpromo/square-customer-v2.webp",
    "images/gallery/marquee-image-07.webp": "images/greenpromo/square-print-v2.webp",
    "images/gallery/marquee-image-08.webp": "images/greenpromo/square-athens-v2.webp",
    "images/event/phone-image.png": "images/greenpromo/reporting-dashboard-v2.png",
    "images/workspace/dashboard-09.png": "images/greenpromo/landscape-door-v2.webp",
    "images/workspace/dashboard-12.svg": "images/greenpromo/reporting-dashboard-v2.png",
    "images/workspace/dashboard-11.svg": "images/greenpromo/square-business-v2.webp",
    "images/workspace/dashboard-13.svg": "images/greenpromo/landscape-report-v2.webp",
    "images/gallery/step-image-01.webp": "images/greenpromo/landscape-door-v2.webp",
    "images/gallery/step-image-02.webp": "images/greenpromo/landscape-handout-v2.webp",
    "images/gallery/step-image-03.webp": "images/greenpromo/landscape-business-v2.webp",
    "images/gallery/step-image-04.webp": "images/greenpromo/landscape-report-v2.webp",
    "images/about/social-image-01.webp": "images/greenpromo/portrait-door-v2.webp",
    "images/about/social-image-02.webp": "images/greenpromo/portrait-handout-v2.webp",
    "images/about/social-image-03.webp": "images/greenpromo/portrait-business-v2.webp",
    "images/about/social-image-04.webp": "images/greenpromo/portrait-athens-v2.webp",
    "images/about/social-image-05.webp": "images/greenpromo/portrait-print-v2.webp",
    "images/about/social-image-06.webp": "images/greenpromo/portrait-owner-v2.webp",
    "images/workspace/dashboard-07.png": "images/greenpromo/reporting-dashboard-v2.png",
    "images/workspace/dashboard-06.svg": "images/greenpromo/reporting-kit-v2.webp",
    "images/workspace/dashboard-05.svg": "images/greenpromo/landscape-door-v2.webp",
    "images/workspace/dashboard-04.svg": "images/greenpromo/landscape-business-v2.webp",
    "images/workspace/mobile-image.png": "images/greenpromo/reporting-dashboard-v2.png",
    "images/team/avatar-01.webp": "images/greenpromo/square-door-v2.webp",
    "images/team/avatar-02.webp": "images/greenpromo/square-handout-v2.webp",
    "images/team/avatar-03.webp": "images/greenpromo/square-report-v2.webp",
    "images/team/avatar-04.webp": "images/greenpromo/square-business-v2.webp",
    "images/team/avatar-05.webp": "images/greenpromo/square-print-v2.webp",
    "images/team/avatar-06.webp": "images/greenpromo/square-athens-v2.webp",
    "images/team/avatar-07.webp": "images/greenpromo/square-report-v2.webp",
    "images/team/avatar-08.webp": "images/greenpromo/square-business-v2.webp",
    "images/team/avatar-09.webp": "images/greenpromo/square-door-v2.webp",
    "images/about/about-image.webp": "images/greenpromo/about-hero-v2.webp",
    "images/about/about-image-01.webp": "images/greenpromo/about-athens-v2.webp",
    "images/about/about-image-02.webp": "images/greenpromo/about-print-v2.webp",
    "images/locations/glob-image.png": "images/greenpromo/reporting-kit-v2.webp",
    "images/workspace/phone-image.png": "images/greenpromo/reporting-dashboard-v2.png",
    "images/locations/contact-image.webp": "images/greenpromo/about-athens-v2.webp",
    "images/locations/feature-01.webp": "images/greenpromo/square-door-v2.webp",
    "images/locations/feature-02.webp": "images/greenpromo/square-handout-v2.webp",
    "images/locations/feature-03.webp": "images/greenpromo/square-business-v2.webp",
    "images/workspace/hero-glob.jpg": "images/greenpromo/hero-background-v2.webp",
    "images/workspace/suggestion-image.webp": "images/greenpromo/reporting-kit-v2.webp",
    "images/workspace/decoration.webp": "images/greenpromo/about-print-v2.webp",
    "https://unifato.com/images/workspace/cloud-04.webp": "images/locations/cloud-04.webp",
    "https://unifato.com/images/workspace/cloud-01.webp": "images/locations/cloud-01.webp",
    "images/icons/app-store.svg": "images/greenpromo/phone.svg",
    "images/icons/app-store-light.svg": "images/greenpromo/phone.svg",
    "images/icons/play-store.svg": "images/greenpromo/whatsapp.svg",
    "images/icons/app-storebox.svg": "images/greenpromo/phone.svg",
    "images/icons/google-playbox.svg": "images/greenpromo/whatsapp.svg",
    "images/icons/icon-39.svg": "images/greenpromo/square-report-v2.webp",
    "videos/hero-glob.mp4": "videos/greenpromo/coverage-map.mp4",
    "videos/story-slider-01.mp4": "videos/greenpromo/coverage-center.mp4",
    "videos/story-slider-02.mp4": "videos/greenpromo/coverage-north.mp4",
    "videos/story-slider-03.mp4": "videos/greenpromo/coverage-south.mp4",
    "videos/story-slider-04.mp4": "videos/greenpromo/coverage-west.mp4",
    "videos/story-slider-05.mp4": "videos/greenpromo/coverage-piraeus.mp4",
    "images/events/story-slider-01_poster.webp": "images/greenpromo/landscape-athens-v2.webp",
    "images/events/story-slider-02_poster.webp": "images/greenpromo/landscape-door-v2.webp",
    "images/events/story-slider-03_poster.webp": "images/greenpromo/landscape-handout-v2.webp",
    "images/events/story-slider-04_poster.webp": "images/greenpromo/landscape-business-v2.webp",
    "images/events/story-slider-05_poster.webp": "images/greenpromo/landscape-report-v2.webp",
    "https://cdn.prod.website-files.com/692fd4f000a6f446ca91cb33/693bfbeaa0a9ea44852138b3_team-image-02.webp": "images/greenpromo/portrait-handout-v2.webp",
    "https://cdn.prod.website-files.com/692fd4f000a6f446ca91cb33/693bfbeb774ae48530ed4c5e_team-image-03.webp": "images/greenpromo/portrait-business-v2.webp",
    "https://cdn.prod.website-files.com/692fd4f000a6f446ca91cb33/693bfbeb2350fda6bb729017_team-image-04.webp": "images/greenpromo/portrait-athens-v2.webp",
    "https://cdn.prod.website-files.com/692fd4f000a6f446ca91cb33/693bfbec7839cc0d1b9aed75_team-image-05.webp": "images/greenpromo/portrait-print-v2.webp",
    "https://cdn.prod.website-files.com/692fd4f000a6f446ca91cb33/693bfbedfb99dbe8b71eca8e_team-image-06.webp": "images/greenpromo/portrait-owner-v2.webp",
}


ALT_BY_FILE = {
    "logo-black.png": "GreenPromo",
    "hero-background-v2.webp": "Διανομή φυλλαδίων πόρτα-πόρτα στην Αθήνα",
    "hero-handout-v2.webp": "Χέρι-με-χέρι διανομή φυλλαδίων",
    "hero-business-v2.webp": "Διανομή ενημερωτικού υλικού σε επιχείρηση",
    "reporting-dashboard-v2.png": "Αναφορά διανομής με χάρτη και φωτογραφίες πεδίου",
    "reporting-kit-v2.webp": "Υλικό τεκμηρίωσης καμπάνιας διανομής",
    "landscape-door-v2.webp": "Διανομή φυλλαδίων σε κατοικίες",
    "landscape-handout-v2.webp": "Χέρι-με-χέρι διανομή σε σημείο υψηλής κίνησης",
    "landscape-business-v2.webp": "Στοχευμένη διανομή σε επιχειρήσεις",
    "landscape-report-v2.webp": "Φωτογραφική τεκμηρίωση και αναφορά διανομής",
    "about-hero-v2.webp": "Οργάνωση επαγγελματικής διανομής φυλλαδίων",
    "about-athens-v2.webp": "Περιοχές κάλυψης στην Αθήνα και την Αττική",
    "about-print-v2.webp": "Σχεδιασμός και εκτύπωση ενημερωτικού υλικού",
    "phone.svg": "Τηλέφωνο GreenPromo",
    "whatsapp.svg": "WhatsApp GreenPromo",
}


def normalized(value: str) -> str:
    return " ".join(value.split())


def replace_text_nodes(html: str, mapping: dict[str, str], start: str | None = None, end: str | None = None) -> str:
    start_at = html.index(start) if start else 0
    end_at = html.index(end, start_at) if end else len(html)
    region = html[start_at:end_at]

    def transform(match: re.Match[str]) -> str:
        value = match.group(1)
        key = normalized(value)
        if key not in mapping:
            return value
        leading = re.match(r"\s*", value).group(0)
        trailing = re.search(r"\s*$", value).group(0)
        return f"{leading}{mapping[key]}{trailing}"

    region = re.sub(r"(?<=>)([^<>]*?)(?=<)", transform, region)
    return html[:start_at] + region + html[end_at:]


def legacy_home_scopes() -> list[tuple[int, str, str, dict[str, str]]]:
    tree = ast.parse(LEGACY_HOME_COPY.read_text(encoding="utf-8"))
    scopes: list[tuple[int, str, str, dict[str, str]]] = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call) or not isinstance(node.func, ast.Name):
            continue
        if node.func.id != "replace_text_nodes" or len(node.args) < 4:
            continue
        try:
            start = ast.literal_eval(node.args[1])
            end = ast.literal_eval(node.args[2])
            mapping = ast.literal_eval(node.args[3])
        except (ValueError, TypeError):
            continue
        scopes.append((node.lineno, start, end, mapping))
    return sorted(scopes)


def update_metadata(html: str, title: str, description: str) -> str:
    html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1, flags=re.S)
    html = re.sub(r'(<meta name="title" content=")[^"]*(")', rf"\g<1>{title}\g<2>", html, count=1)
    html = re.sub(r'(<meta name="description" content=")[^"]*(")', rf"\g<1>{description}\g<2>", html, count=1)
    html = re.sub(r'(<meta name="keywords" content=")[^"]*(")', r"\g<1>διανομή φυλλαδίων, Αθήνα, Αττική, πόρτα πόρτα, χέρι με χέρι, GPS, φωτογραφική απόδειξη\g<2>", html, count=1)
    html = html.replace('<meta name="author" content="Unifato">', '<meta name="author" content="GreenPromo">')
    html = html.replace('<html lang="en">', '<html lang="el">')
    html = html.replace('<base href="/habitline/">', '<base href="/">')
    return html


def update_links_and_forms(html: str) -> str:
    replacements = {
        "https://unifato.com/habitline/services.html": "index.html#features",
        "https://unifato.com/contact": "waitlist.html",
        "https://www.youtube.com/embed/elgqxmdVms8?si=yYfzbunShGP15tde": "videos/greenpromo/coverage-map.mp4",
        "https://www.apple.com/in/app-store/": "tel:+302103007716",
        "https://play.google.com/store/games?device=windows": "https://wa.me/306989442438",
        "mailto:support@habitline.app": "tel:+302103007716",
        "mailto:hello@habitline.app": "mailto:info@greenpromo.marketing",
    }
    for old, new in replacements.items():
        html = html.replace(old, new)

    html = html.replace('placeholder="Dennis Barrett"', 'placeholder="Ονοματεπώνυμο"')
    html = html.replace('placeholder="Topic of your request"', 'placeholder="Ποσότητα και περιοχές"')
    html = html.replace('placeholder="dannis@example.com"', 'placeholder="name@example.com"')
    html = html.replace('placeholder="Write your message"', 'placeholder="Περιγράψτε την καμπάνια σας"')
    html = html.replace('placeholder="Enter your email"', 'placeholder="Το email σας"')
    html = html.replace('aria-label="App Store"', 'aria-label="Επικοινωνία GreenPromo"')
    html = html.replace(
        '<form id="contact-form" class=',
        '<form id="contact-form" action="mailto:info@greenpromo.marketing" method="post" enctype="text/plain" class=',
    )
    html = html.replace(
        '<form class="flex flex-col lg:items-center items-start justify-center md:gap-4 gap-2.5 md:flex-row">',
        '<form action="mailto:info@greenpromo.marketing" method="post" enctype="text/plain" class="flex flex-col lg:items-center items-start justify-center md:gap-4 gap-2.5 md:flex-row">',
    )
    html = html.replace(
        '<form class="flex flex-col lg:items-center items-start gap-4 lg:flex-row">',
        '<form action="contact.html" class="flex flex-col lg:items-center items-start gap-4 lg:flex-row">',
    )

    socials = (
        "https://www.instagram.com/greenpromo.gr/",
        "https://www.pinterest.com/greenpromo/",
        "https://www.linkedin.com/company/greenpromo/",
        "https://www.facebook.com/GreenPromo.gr/",
    )
    if "<footer" in html:
        footer_start = html.index("<footer")
        footer = html[footer_start:]
        for url in socials:
            footer = footer.replace('href="#" target="_blank"', f'href="{url}" target="_blank"', 1)
        html = html[:footer_start] + footer
    return html


def update_images(html: str) -> str:
    def update_source(match: re.Match[str]) -> str:
        prefix, value, suffix = match.groups()
        replacement = IMAGE_MAP.get(value, IMAGE_MAP.get(value.lstrip("/"), value))
        return f"{prefix}{replacement}{suffix}"

    # Restrict media substitutions to content-bearing attributes. In particular,
    # never rewrite Tailwind classes containing background-image URLs.
    html = re.sub(r'(\b(?:src|poster)=")([^"]+)(")', update_source, html)

    def update_alt(match: re.Match[str]) -> str:
        tag = match.group(0)
        src_match = re.search(r'src="([^"]+)"', tag)
        if not src_match or "/greenpromo/" not in src_match.group(1):
            return tag
        filename = src_match.group(1).rsplit("/", 1)[-1]
        alt = ALT_BY_FILE.get(filename, "GreenPromo — διανομή φυλλαδίων")
        if re.search(r'alt="[^"]*"', tag):
            return re.sub(r'alt="[^"]*"', f'alt="{alt}"', tag, count=1)
        return tag

    return re.sub(r"<img\b[^>]*>", update_alt, html)


def update_pricing_values(html: str) -> str:
    html = html.replace('"min": 50,\n                                    "max": 20', '"min": 249,\n                                    "max": 199')
    html = html.replace('"min": 299,\n                                    "max": 150', '"min": 599,\n                                    "max": 399')
    html = replace_text_nodes(html, {"$": "€", "19": "199", "150": "399", "/per month": "ανά καμπάνια"})
    return html


def convert_page(filename: str) -> None:
    path = SITE / filename
    html = path.read_text(encoding="utf-8")
    html = update_metadata(html, *META[filename])

    if filename == "index.html":
        html = replace_text_nodes(html, HOME_RAW_TEXT, "<!-- hero-section -->", "<!-- feature-section -->")
        for _, start, end, mapping in legacy_home_scopes():
            if start in html and end in html:
                html = replace_text_nodes(html, mapping, start, end)

    html = replace_text_nodes(html, COMMON_TEXT)
    html = replace_text_nodes(html, FAQ_TEXT)
    html = replace_text_nodes(html, PAGE_TEXT.get(filename, {}))
    html = html.replace("Habitline", "GreenPromo")
    if filename == "index.html":
        # A few legacy source strings contain the brand name and become eligible
        # only after the brand substitution above.
        for _, start, end, mapping in legacy_home_scopes():
            if start in html and end in html:
                html = replace_text_nodes(html, mapping, start, end)
    html = update_links_and_forms(html)
    html = update_images(html)
    if filename == "pricing.html":
        html = update_pricing_values(html)
    path.write_text(html, encoding="utf-8")


def main() -> None:
    for filename in PAGES:
        convert_page(filename)
        print(f"converted {filename}")


if __name__ == "__main__":
    main()
