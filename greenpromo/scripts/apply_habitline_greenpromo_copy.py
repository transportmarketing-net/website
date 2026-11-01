from __future__ import annotations

import re
from pathlib import Path


INDEX = Path("/tmp/habitline/habitline/index.html")


def normalized(value: str) -> str:
    return " ".join(value.split())


def replace_text_nodes(html: str, start: str, end: str, mapping: dict[str, str]) -> str:
    start_at = html.index(start)
    end_at = html.index(end, start_at)
    region = html[start_at:end_at]
    seen: set[str] = set()

    def transform(match: re.Match[str]) -> str:
        value = match.group(1)
        key = normalized(value)
        if key not in mapping:
            return value
        seen.add(key)
        leading = re.match(r"\s*", value).group(0)
        trailing = re.search(r"\s*$", value).group(0)
        return f"{leading}{mapping[key]}{trailing}"

    region = re.sub(r"(?<=>)([^<>]*?)(?=<)", transform, region)
    missing = sorted(set(mapping) - seen)
    if missing:
        print(f"Note: {start} did not contain {len(missing)} optional text keys")
    return html[:start_at] + region + html[end_at:]


def replace_region(html: str, start: str, end: str, old: str, new: str, count: int = -1) -> str:
    start_at = html.index(start)
    end_at = html.index(end, start_at)
    region = html[start_at:end_at]
    if old not in region:
        print(f"Note: optional region fragment not found: {old[:70]!r}")
        return html
    region = region.replace(old, new, count)
    return html[:start_at] + region + html[end_at:]


html = INDEX.read_text(encoding="utf-8")

# Navigation labels and destinations. Classes, wrappers, menu behaviour and order stay intact.
html = html.replace('href="#usecase" class="flex items-center justify-center text-sm font-medium hover:bg-default-200 hover:text-default-800 rounded-2xl transition-all py-4 px-7">Πακέτα</a>', 'href="#usecase" class="flex items-center justify-center text-sm font-medium hover:bg-default-200 hover:text-default-800 rounded-2xl transition-all py-4 px-7">Πώς λειτουργεί</a>')
html = html.replace('href="#metrics" class="flex items-center justify-center text-sm font-medium hover:bg-default-200 hover:text-default-800 rounded-2xl transition-all py-4 px-7">Κάλυψη</a>', 'href="#metrics" class="flex items-center justify-center text-sm font-medium hover:bg-default-200 hover:text-default-800 rounded-2xl transition-all py-4 px-7">Πακέτα</a>')
html = html.replace('href="#smart-assist" class="flex items-center justify-center text-sm font-medium hover:bg-default-200 hover:text-default-800 rounded-2xl transition-all py-4 px-7">Φωτογραφική Απόδειξη</a>', 'href="#coverage" class="flex items-center justify-center text-sm font-medium hover:bg-default-200 hover:text-default-800 rounded-2xl transition-all py-4 px-7">Περιοχές κάλυψης</a>')
html = html.replace('<section class="relative lg:pb-46 md:pb-25 pb-20 overflow-hidden">', '<section class="relative lg:pb-46 md:pb-25 pb-20 overflow-hidden" id="coverage">', 1)

html = replace_text_nodes(html, "<header>", "</header>", {
    "Pages": "Ζητήστε προσφορά",
    "Home": "Αρχική",
    "About": "Σχετικά",
    "Pricing": "Πακέτα",
    "Contact": "Επικοινωνία",
    "Waitlist": "Δωρεάν προσφορά",
    "Download": "Υπηρεσίες",
    "FAQs": "Συχνές ερωτήσεις",
    "Privacy Policy": "Πολιτική απορρήτου",
    "Features": "Υπηρεσίες",
    "Usecase": "Πώς λειτουργεί",
    "Metrics": "Πακέτα",
})
html = replace_region(html, "<header>", "</header>", 'href="index.html" class="group flex items-center p-1.5', 'href="#features" class="group flex items-center p-1.5', 1)
html = replace_region(html, "<header>", "</header>", 'href="about.html" class="group flex items-center p-1.5', 'href="#usecase" class="group flex items-center p-1.5', 1)
html = replace_region(html, "<header>", "</header>", 'href="https://unifato.comservices.html"', 'href="#metrics"', 1)
html = replace_region(html, "<header>", "</header>", 'href="contact.html" class="group flex items-center p-1.5', 'href="#coverage" class="group flex items-center p-1.5', 1)

html = replace_text_nodes(html, "<!-- hero-section -->", "<!-- about-section -->", {
    "Δωρεάν προσφορά εντός 24 ωρών": "Δωρεάν προσφορά εντός μίας εργάσιμης",
    "Διανομή Φυλλαδίων": "Η διανομή σας.",
    "με Φωτογραφική Απόδειξη": "Τεκμηριωμένη.",
    "Επαγγελματική διανομή στην Αθήνα με GPS tracking και πλήρη τεκμηρίωση. Από €5/ώρα.": "Φυλλάδια σε σπίτια, περαστικούς και επιχειρήσεις στην Αθήνα — με φωτογραφική απόδειξη, GPS όπου προβλέπεται και καθαρή αναφορά.",
    "Δωρεάν Προσφορά": "Ζητήστε δωρεάν προσφορά",
    "Δείτε Παράδειγμα": "Δείτε πώς τεκμηριώνεται",
})

html = replace_text_nodes(html, "<!-- about-section -->", "<!-- feature-section -->", {
    "Αξιόπιστη διανομή": "Η σωστή μέθοδος",
    "φυλλαδίων με πλήρη": "για κάθε σημείο επαφής.",
    "φωτογραφική τεκμηρίωση, GPS tracking,": "Από μία τοπική γειτονιά μέχρι καμπάνια πολλαπλών ζωνών,",
    "και διαφανείς αναφορές για κάθε καμπάνια.": "σχεδιάζουμε τη διανομή γύρω από το κοινό και τον στόχο σας.",
    "Χρησιμοποιείται από επιχειρήσεις σε όλη την Αττική.": "Από μία τοπική γειτονιά μέχρι καμπάνια πολλαπλών ζωνών, σχεδιάζουμε τη διανομή γύρω από το κοινό και τον στόχο σας.",
    "#Εστιατόρια": "#Πόρτα-Πόρτα",
    "#Γυμναστήρια": "#Χέρι-με-Χέρι",
    "#Retail": "#Επιχειρήσεις",
    "#Κομμωτήρια": "#ΣτοχευμένεςΖώνες",
    "Phone off by 10:30": "Πόρτα-Πόρτα",
    "Morning walk": "Χέρι-με-Χέρι",
    "Focus session": "Διανομή σε Επιχειρήσεις",
    "Stretch for 5 minutes": "Στοχευμένες Ζώνες",
    "Clean workspace": "Σχεδιασμός & Εκτύπωση",
    "Meditate": "Φωτογραφική απόδειξη",
    "Track water": "Παρακολούθηση GPS",
    "Write journal": "PDF αναφορά",
    "4.7 rating": "Απάντηση 24h",
    "(based on 125 reviews)": "με σαφή προσφορά",
    "Stay consistent with a system that fits into real life. Simple cards, clear routines, and gentle nudges help you build progress that lasts.": "Το έντυπο φτάνει εκεί που έχει νόημα. Κοινό, περιοχή, χρόνος και τεκμηρίωση συμφωνούνται πριν ξεκινήσει η ομάδα.",
    "Download for iPhone": "Καλέστε μας",
    "Get it on Android": "WhatsApp",
})

html = replace_text_nodes(html, "<!-- feature-section -->", "<!-- tabs-section -->", {
    "Habits with structure": "Υπηρεσίες",
    "A layout that keeps your day clear.": "Η σωστή μέθοδος για κάθε σημείο επαφής.",
    "GreenPromo brings clarity to your routines with clean cards, realistic progress tracking, and guidance that adapts to your day.": "Από μία τοπική γειτονιά μέχρι καμπάνια πολλαπλών ζωνών, σχεδιάζουμε τη διανομή γύρω από το κοινό και τον στόχο σας.",
    "Flexible Streak Rules": "Πόρτα-Πόρτα",
    "Traditional habit trackers are too rigid. Miss one day and your 50-day streak is gone forever.": "Τοποθέτηση φυλλαδίων σε γραμματοκιβώτια πολυκατοικιών και μονοκατοικιών, οργανωμένη ανά ζώνη.",
    "Travel Mode Active": "Αθήνα & Αττική",
    "Sick Day Allowance": "Οργάνωση ανά ζώνη",
    "Weekend Flexibility": "Φωτογραφική απόδειξη",
    "Morning walk": "Κέντρο Αθήνας",
    "Focus session": "Βόρεια Προάστια",
    "Meditate": "Νότια Προάστια",
    "Track water": "Πειραιάς",
    "Smart Daily Planner": "Χέρι-με-Χέρι",
    "A simple view that shows only the habits that match your current time of day.": "Άμεση παράδοση σε περαστικούς, σε σημεία υψηλής κίνησης και ώρες που ταιριάζουν στο κοινό σας.",
    "Good Morning!": "Πλάνο καμπάνιας",
    "Tuesday, 25 Nov": "Συμφωνημένο πριν την έναρξη",
    "15%": "24h",
    "Completion": "Απάντηση",
    "Morning walk": "Μας λέτε τον στόχο",
    "15 minutes": "Ποσότητα, περιοχή, κοινό",
    "Drink 3 glasses of water": "Σχεδιάζουμε τη ζώνη",
    "Before 11:00 AM": "Μέθοδος, διαδρομή, πακέτο",
    "Read 10 pages": "Εκτελούμε τη διανομή",
    "Evening focus block": "Καταγραφή της προόδου",
    "Stretch routine": "Παραδίδουμε τεκμηρίωση",
    "5 minutes": "Φωτογραφίες, GPS, PDF",
    "Routine Stacks": "Διανομή σε Επιχειρήσεις",
    "Group habits into simple blocks so your day feels organized instead of scattered.": "Επιλεκτική τοποθέτηση υλικού σε καταστήματα και επαγγελματικούς χώρους ανά κλάδο ή περιοχή.",
    "Start your routine now": "Ζητήστε προσφορά",
    "*Simple blocks help you stay on track without thinking.": "*Κλάδος, περιοχή και σημεία συμφωνούνται πριν από τη διανομή.",
    "Weekly Reflection": "Στοχευμένες Ζώνες",
    "A clear div of your week that highlights what improved and what needs adjusting.": "Σχεδιασμός κάλυψης ανά δήμο, ταχυδρομικό κώδικα ή γειτονιά, χωρίς σπατάλη υλικού.",
    "Your Week At A Glance": "Περιοχές κάλυψης",
    "Workout": "Αθήνα",
    "Meditation": "Αττική",
    "Reading": "Πειραιάς",
    "Streaks": "Ζώνες",
    "Completed": "κάλυψης",
    "3 streaks improved": "6 βασικές περιοχές",
    "focused sessions": "μέθοδοι διανομής",
    "Total time: 4h 20m": "Πλήρης συμφωνία πριν την έναρξη",
    "Gentle Reminders": "Σχεδιασμός & Εκτύπωση",
    "Short, calm nudges that help you stay consistent without pushing too hard.": "Από το δημιουργικό και την εκτύπωση έως τη διανομή, με μία οργανωμένη ροή εργασίας.",
})

html = replace_text_nodes(html, "<!-- tabs-section -->", "<!-- metrics-section -->", {
    "Fits every lifestyle": "Πώς λειτουργεί",
    "Adapted for the way": "Από τις απαιτήσεις στην αναφορά,",
    "you live and work": "σε τέσσερα καθαρά βήματα.",
    "Professionals": "01 · Στόχος",
    "Students": "02 · Ζώνη",
    "Remote Workers": "03 · Διανομή",
    "Busy Parents": "04 · Αναφορά",
    "For people balancing classes, projects, and long study sessions.": "Ποσότητα, περιοχή, κοινό και επιθυμητό χρονοδιάγραμμα.",
    "Study sessions logged each week": "Μας λέτε τον στόχο",
    "For people juggling work, family routines, and personal goals.": "Προτείνουμε μέθοδο, διαδρομή και πακέτο χωρίς κρυφές χρεώσεις.",
    "Routines completed weekly": "Σχεδιάζουμε τη ζώνη",
    "Focus blocks, breaks, and shutdown routines help keep momentum.": "Η ομάδα ακολουθεί το συμφωνημένο πλάνο και καταγράφει την πρόοδο.",
    "Sessions completed monthly": "Εκτελούμε τη διανομή",
    "For anyone handling long workdays, shifting priorities, and tight deadlines.": "Λαμβάνετε φωτογραφίες, GPS στοιχεία όπου προβλέπονται και PDF αναφορά.",
    "Weekly consistency": "Παραδίδουμε τεκμηρίωση",
    "14": "01",
    "12": "02",
    "40": "03",
    "87%": "04",
    "And for every kind of daily rhythm": "Κάθε απόφαση συμφωνείται πριν ξεκινήσει η ομάδα.",
    "#fitness enthusiasts": "#ποσότητα",
    "#creatives": "#περιοχή",
    "#entrepreneurs": "#κοινό",
    "#freelancers": "#χρονοδιάγραμμα",
    "#new habit builders": "#τεκμηρίωση",
    "#deep-work lovers": "#σαφήςπροσφορά",
})

html = replace_text_nodes(html, "<!-- metrics-section -->", "<!-- stats-section -->", {
    "What users are achieving with GreenPromo": "Τιμολόγηση που διαβάζεται χωρίς υποσημειώσεις.",
    "You?": "4 επιλογές",
    "Trusted worldwide": "Σαφής συμφωνία πριν την έναρξη",
    "Maya": "Custom",
    "— Student": "€5/ώρα",
    "Completed 21-day streak using GreenPromo": "Για μικρούς όγκους, δοκιμαστικές διανομές ή ειδικές ανάγκες.",
    "Daniel Gray": "Starter",
    "— Founder": "€89",
    "87%": "€89",
    "Improved weekly consistency": "Μικρή τοπική καμπάνια με σαφή κάλυψη μίας ζώνης.",
    "Aaron Lee -": "Standard",
    "Remote Engineer": "€199",
    "Stopped breaking habits on weekends after switching to GreenPromo": "Η ολοκληρωμένη επιλογή για πολλαπλές γειτονιές και παρακολούθηση GPS.",
    "Priya": "Pro",
    "— Busy Parent": "€399",
    "Logged 40 focus sessions this month with Routine Stacks": "Για μεγάλη καμπάνια πολλαπλών ζωνών με συνεχή συντονισμό.",
    "Leo": "Φωτογραφική απόδειξη",
    "— Creative Professional": "σε κάθε πακέτο",
    "10 days": "GPS",
    "Hit hydration goals": "στα Standard και Pro",
    "Ravi": "PDF αναφορά",
    "— Software Developer": "μετά τη διανομή",
    "Finally keeps his day organized with routine-based habit groups": "Ποσότητες, ζώνες και υλικό τεκμηρίωσης σε μία καθαρή αναφορά.",
})

html = replace_text_nodes(html, "<!-- stats-section -->", "<!-- smart-assist-section -->", {
    "Real habits, real numbers": "Περιοχές κάλυψης",
    "How people stay": "Αθήνα, Αττική και Πειραιάς",
    "consistent over time": "— ανά ζώνη.",
    "62,000": "6",
    "Check-ins logged last month": "βασικές περιοχές κάλυψης",
    "87": "24",
    "%": "h",
    "Faster AI execution": "Απάντηση εντός μίας εργάσιμης",
    "46": "5",
    "Sessions completed on average": "Μέθοδοι διανομής",
    "32": "100",
    "Countries with active GreenPromo users": "Σαφής συμφωνία πριν την έναρξη",
})
html = replace_region(html, "<!-- stats-section -->", "<!-- smart-assist-section -->", '<span class="text-3xl md:text-5xl lg:text-6xl font-medium text-primary-3">+</span>', '<span class="text-3xl md:text-5xl lg:text-6xl font-medium text-primary-3">%</span>')

html = replace_text_nodes(html, "<!-- smart-assist-section -->", "<!-- testimonials-section -->", {
    "Smarter habits, less thinking": "Τεκμηρίωση",
    "AI suggestions that": "Δεν χρειάζεται να μαντεύετε",
    "adjust to your day": "τι έγινε στο πεδίο.",
    "GreenPromo learns your patterns and offers small, useful suggestions that help you stay consistent without guessing what to do next.": "Η αναφορά οργανώνει τα στοιχεία της καμπάνιας σε μία καθαρή εικόνα. Το ακριβές επίπεδο τεκμηρίωσης εξαρτάται από το πακέτο που επιλέγετε.",
    "See how suggestions work": "Δείτε την τεκμηρίωση",
    "Reminder Timing": "Φωτογραφίες",
    "Suggests the best time to remind you.": "Οπτική απόδειξη από χαρακτηριστικά σημεία διανομής.",
    "Habit Priorities": "Διαδρομές GPS",
    "Reorders habits on busy days.": "Καταγραφή της κάλυψης στα Standard, Pro και σε ειδικές καμπάνιες.",
    "Routine Insights": "PDF αναφορά",
    "Highlights what’s working and what’s slipping.": "Συνοπτική παράδοση ποσοτήτων, ζωνών και υλικού τεκμηρίωσης.",
    "Recovery suggestion": "Απάντηση 24h",
    "Helps you recover when you miss a day.": "Απαντάμε με σαφή προσφορά εντός μίας εργάσιμης.",
})

html = replace_text_nodes(html, "<!-- testimonials-section -->", "<!-- feedback-section -->", {
    "A closer look": "Περιοχές κάλυψης",
    "How people use": "Αθήνα, Αττική και Πειραιάς",
    "GreenPromo every day": "— ανά ζώνη.",
    "4.5/5.0": "6 ζώνες",
    "(Trusted by 50+ περιοχές κάλυψης)": "Η διαθεσιμότητα επιβεβαιώνεται στην προσφορά",
    "Marcus Reed": "Κέντρο Αθήνας",
    "Fitness Instructor": "Πόρτα-Πόρτα & χέρι-με-χέρι",
    "Aisha Khan": "Βόρεια Προάστια",
    "Digital Marketer": "Ζώνες ανά δήμο και γειτονιά",
    "Daniel": "Νότια Προάστια",
    "Remote Engineer": "Στοχευμένη κάλυψη",
    "Olivia Park": "Δυτικά Προάστια",
    "Project Manager": "Πολλαπλές ζώνες",
    "Ryan Cooper": "Πειραιάς",
    "Software Developer": "Καμπάνιες ανά περιοχή",
    "Play": "Δείτε",
})

html = replace_text_nodes(html, "<!-- feedback-section -->", "<!-- faq-section -->", {
    "GreenPromo made my mornings feel manageable again.": "Καμπάνιες για τοπικές επιχειρήσεις και οργανωμένα δίκτυα.",
    "The weekly insights are what sold me. They show exactly where I fall off and help me adjust without feeling guilty or overwhelmed.": "Στοχευμένη διανομή για εστίαση και delivery, γύρω από τις περιοχές που εξυπηρετείτε.",
    "I actually stick to my routines now. Small steps finally add up": "Παρουσία σε σημεία υψηλής κίνησης για γυμναστήρια και επιχειρήσεις ευεξίας.",
    "I used to ignore reminders from other apps, but these feel calm and well-timed. It’s like the app knows when I’m actually able to do something.": "Κάλυψη γειτονιών και επιχειρήσεων για λιανική και e-commerce.",
    "Focus blocks changed the way I work. I get more done in two hours now than what used to take half a day.": "Διανομή γύρω από σχολές, φροντιστήρια και εκπαιδευτικά κέντρα.",
    "The gentle reminders help me stay consistent without feeling pressured.": "Τοπικές καμπάνιες για ακίνητα και επαγγελματικές υπηρεσίες.",
    "It’s the first habit app that doesn’t overwhelm me.": "Προώθηση για εκδηλώσεις, εγκαίνια και εποχικές ενέργειες.",
    "GreenPromo keeps me grounded. Even on hectic days.": "Το έντυπο φτάνει εκεί που έχει νόημα, χωρίς σπατάλη υλικού.",
    "I’ve finally stopped procrastinating. GreenPromo helped me break my goals into steps I can manage. I complete tasks in half the time I used to.": "Σχεδιασμός, εκτύπωση και διανομή σε μία οργανωμένη ροή εργασίας.",
    "Maya Zong": "Εστίαση & delivery",
    "Student": "Τοπική στόχευση",
    "Aaron Chope": "Γυμναστήρια & ευεξία",
    "Product Designer": "Σημεία υψηλής κίνησης",
    "Hannah Kang": "Λιανική & e-commerce",
    "Nurse": "Περιοχές αγοραστικού ενδιαφέροντος",
    "Daniel": "Εκπαίδευση",
    "Remote Engineer": "Σχολές & εκπαιδευτικά κέντρα",
    "Riya Patel": "Ακίνητα & υπηρεσίες",
    "Marketing Associate": "Στοχευμένες γειτονιές",
    "Sofia": "Εκδηλώσεις & εγκαίνια",
    "Fitness Enthusiast": "Άμεση προώθηση",
    "Arjun Mehta": "Πόρτα-Πόρτα",
    "Software Developer": "Οργανωμένη κάλυψη",
    "Meera Shah": "Σχεδιασμός & Εκτύπωση",
    "Content Writer": "Ενιαία υπηρεσία",
})

html = replace_text_nodes(html, "<!-- faq-section -->", "<!-- download-section -->", {
    "Common Questions": "Συχνές ερωτήσεις",
    "Frequently asked questions": "Ό,τι χρειάζεται να ξέρετε πριν ξεκινήσουμε.",
    "Can't find your answer?": "Χρειάζεστε περισσότερες πληροφορίες;",
    "Contact us": "Επικοινωνήστε μαζί μας",
    "How many habits can I track?": "Ποιο πακέτο ταιριάζει στην καμπάνια μου;",
    "You can track unlimited habits, giving you complete freedom to create and organize.": "Το Custom καλύπτει μικρές ή δοκιμαστικές διανομές. Το Starter είναι για μία γειτονιά, το Standard για 2–3 ζώνες με GPS και το Pro για μεγάλες καμπάνιες πολλαπλών περιοχών. Αν δεν είστε βέβαιοι, στείλτε μας ποσότητα και περιοχές και θα σας προτείνουμε την κατάλληλη επιλογή.",
    "Do reminders work across all devices?": "Πώς λειτουργεί η φωτογραφική απόδειξη;",
    "Yes. Your reminders sync automatically and trigger on any device where GreenPromo is installed.": "Κατά την εκτέλεση συλλέγονται φωτογραφίες από τα σημεία διανομής. Ανάλογα με το πακέτο, συνοδεύονται από χρονοσφραγίδα, GPS διαδρομή και οργανωμένη PDF αναφορά.",
    "What happens if I miss a day?": "Σε πόσες ημέρες ολοκληρώνεται η διανομή;",
    "If you miss a day, nothing drastic happens your progress is still saved, and you can pick up right where you left off.": "Τα Starter και Standard προβλέπουν συνήθως ολοκλήρωση σε 5 εργάσιμες ημέρες. Για express ή μεγάλες καμπάνιες επιβεβαιώνουμε ειδικό χρονοδιάγραμμα στην προσφορά.",
    "Can I create routines for different times of day?": "Μπορώ να επιλέξω συγκεκριμένες γειτονιές;",
    "Yes, you can create routines for different times of the day. Organize your habits into morning, afternoon, or evening blocks.": "Ναι. Η κάλυψη μπορεί να οργανωθεί ανά δήμο, ταχυδρομικό κώδικα ή συγκεκριμένη γειτονιά. Για καμπάνιες πολλαπλών ζωνών προτείνουμε σειρά εκτέλεσης και τρόπο παρακολούθησης.",
    "Is GreenPromo free to use?": "Παρέχετε παρακολούθηση GPS και χάρτη διαδρομών;",
    "GreenPromo is free to use with essential features available at no cost. You can track habits, create routines, and set basic reminders.": "Ναι, στο Standard και σε προσαρμοσμένες ή Pro καμπάνιες όπου έχει συμφωνηθεί. Το ακριβές επίπεδο τεκμηρίωσης αναγράφεται καθαρά στην προσφορά σας.",
})

html = replace_text_nodes(html, "<!-- download-section -->", "<footer", {
    "Build better habits with less effort": "Έτοιμοι να χαρτογραφήσουμε την καμπάνια σας;",
    "Track what matters, stay organized, and improve at your own pace.": "Στείλτε ποσότητα, περιοχές και χρονοδιάγραμμα. Θα απαντήσουμε με σαφή πρόταση εντός 24 ωρών.",
    "Download for iPhone": "Ζητήστε προσφορά",
    "Get it on Android": "WhatsApp +30 698 944 2438",
    "Scan the QR code to download the app": "Αθήνα · Αττική · Πειραιάς",
})

html = replace_text_nodes(html, "<footer", "<!-- Swiper JS -->", {
    "Stay on top of your habits": "Επαγγελματική διανομή φυλλαδίων στην Αθήνα και την Αττική, με φωτογραφική απόδειξη και σαφή αναφορά.",
    "No spam. Just simple advice for staying consistent.": "+30 210 300 7716 · info@greenpromo.marketing",
    "Subscribe": "Ζητήστε προσφορά",
    "Pages links": "Πλοήγηση",
    "Home": "Υπηρεσίες",
    "About": "Σχετικά",
    "Pricing": "Πακέτα",
    "Contact": "Επικοινωνία",
    "Waitlist": "Δωρεάν προσφορά",
    "Other links": "Στοιχεία επικοινωνίας",
    "Download": "+30 210 300 7716",
    "FAQs": "info@greenpromo.marketing",
    "Privacy Policy": "Πολιτική απορρήτου",
    "Develop by": "© 2026 GreenPromo. Με επιφύλαξη παντός δικαιώματος.",
    "Unifato": "Αθήνα · Αττική · Πειραιάς",
})

# Functional links, without changing any wrapper or interaction structure.
html = html.replace('href="https://unifato.com/contact"', 'href="waitlist.html"')
html = html.replace('href="https://www.youtube.com/embed/elgqxmdVms8?si=yYfzbunShGP15tde"', 'href="#smart-assist"')
html = html.replace(' data-toggle="video"', '')
html = html.replace('href="https://www.apple.com/in/app-store/" target="_blank" aria-label="App Store"', 'href="tel:+302103007716" aria-label="Καλέστε τη GreenPromo"')
html = html.replace('href="https://play.google.com/store/games?device=windows" target="_blank" aria-label="App Store"', 'href="https://wa.me/306989442438" target="_blank" rel="noopener" aria-label="GreenPromo στο WhatsApp"')
html = replace_region(html, "<!-- download-section -->", "<footer", 'href="#"', 'href="waitlist.html"', 1)
html = replace_region(html, "<!-- download-section -->", "<footer", 'href="#"', 'href="https://wa.me/306989442438" target="_blank" rel="noopener"', 1)
html = replace_region(html, "<!-- faq-section -->", "<!-- download-section -->", 'href="#"', 'href="contact.html"', 1)
html = replace_region(html, "<footer", "<!-- Swiper JS -->", 'placeholder="Enter your email"', 'placeholder="Το email σας"')
html = replace_region(html, "<footer", "<!-- Swiper JS -->", '<form class="flex flex-col lg:items-center items-start gap-4 lg:flex-row">', '<form action="contact.html" class="flex flex-col lg:items-center items-start gap-4 lg:flex-row">')
html = replace_region(html, "<footer", "<!-- Swiper JS -->", 'href="download.html"', 'href="tel:+302103007716"', 1)
html = replace_region(html, "<footer", "<!-- Swiper JS -->", 'href="faqs.html"', 'href="mailto:info@greenpromo.marketing"', 1)
html = replace_region(html, "<footer", "<!-- Swiper JS -->", 'href="https://unifato.com/"', 'href="index.html"', 1)

socials = [
    "https://www.instagram.com/greenpromo.gr/",
    "https://www.pinterest.com/greenpromo/",
    "https://www.linkedin.com/company/greenpromo/",
    "https://www.facebook.com/GreenPromo.gr/",
]
footer_start = html.index("<footer")
footer_end = html.index("<!-- Swiper JS -->", footer_start)
footer = html[footer_start:footer_end]
for url in socials:
    footer = footer.replace('href="#" target="_blank"', f'href="{url}" target="_blank" rel="noopener"', 1)
html = html[:footer_start] + footer + html[footer_end:]

# Production GreenPromo imagery fitted into the original image/video slots.
asset_map = {
    "images/logo.svg": "images/greenpromo/logo-black.png",
    "images/hero-image.jpg": "images/greenpromo/landscape-door.webp",
    "images/workspace/dashboard-01.svg": "images/greenpromo/hero-hand-to-hand.webp",
    "images/workspace/dashboard-03.svg": "images/greenpromo/hero-reporting.webp",
    "images/workspace/dashboard-02.svg": "images/greenpromo/hero-business.webp",
    "images/about/about-01.webp": "images/greenpromo/square-door.webp",
    "images/about/about-02.webp": "images/greenpromo/square-hand.webp",
    "images/about/about-03.webp": "images/greenpromo/square-report.webp",
    "images/about/about-04.webp": "images/greenpromo/square-business.webp",
    "images/gallery/marquee-image-01.webp": "images/greenpromo/square-door.webp",
    "images/gallery/marquee-image-02.webp": "images/greenpromo/square-hand.webp",
    "images/gallery/marquee-image-03.webp": "images/greenpromo/square-business.webp",
    "images/gallery/marquee-image-04.webp": "images/greenpromo/square-report.webp",
    "images/gallery/marquee-image-05.webp": "images/greenpromo/square-door.webp",
    "images/gallery/marquee-image-06.webp": "images/greenpromo/square-hand.webp",
    "images/gallery/marquee-image-07.webp": "images/greenpromo/square-business.webp",
    "images/gallery/marquee-image-08.webp": "images/greenpromo/square-report.webp",
    "images/event/phone-image.png": "images/greenpromo/phone-reporting.webp",
    "images/workspace/dashboard-09.png": "images/greenpromo/landscape-door.webp",
    "images/workspace/dashboard-12.svg": "images/greenpromo/phone-reporting.webp",
    "images/workspace/dashboard-11.svg": "images/greenpromo/square-business.webp",
    "images/workspace/dashboard-13.svg": "images/greenpromo/landscape-report.webp",
    "images/gallery/step-image-01.webp": "images/greenpromo/landscape-door.webp",
    "images/gallery/step-image-02.webp": "images/greenpromo/landscape-hand.webp",
    "images/gallery/step-image-03.webp": "images/greenpromo/landscape-business.webp",
    "images/gallery/step-image-04.webp": "images/greenpromo/landscape-report.webp",
    "images/about/social-image-01.webp": "images/greenpromo/door-to-door.webp",
    "images/about/social-image-02.webp": "images/greenpromo/hand-to-hand.webp",
    "images/about/social-image-03.webp": "images/greenpromo/business-distribution.webp",
    "images/about/social-image-04.webp": "images/greenpromo/reporting.webp",
    "images/about/social-image-05.webp": "images/greenpromo/door-to-door.webp",
    "images/about/social-image-06.webp": "images/greenpromo/reporting.webp",
    "images/workspace/dashboard-07.png": "images/greenpromo/phone-reporting.webp",
    "images/workspace/dashboard-06.svg": "images/greenpromo/landscape-report.webp",
    "images/workspace/dashboard-05.svg": "images/greenpromo/landscape-door.webp",
    "images/workspace/dashboard-04.svg": "images/greenpromo/landscape-business.webp",
    "images/workspace/mobile-image.png": "images/greenpromo/phone-reporting.webp",
    "images/team/avatar-01.webp": "images/greenpromo/square-door.webp",
    "images/team/avatar-02.webp": "images/greenpromo/square-hand.webp",
    "images/team/avatar-03.webp": "images/greenpromo/square-report.webp",
    "images/team/avatar-04.webp": "images/greenpromo/square-business.webp",
    "images/team/avatar-05.webp": "images/greenpromo/square-door.webp",
    "images/team/avatar-06.webp": "images/greenpromo/square-hand.webp",
    "images/team/avatar-07.webp": "images/greenpromo/square-report.webp",
    "images/team/avatar-08.webp": "images/greenpromo/square-business.webp",
    "images/team/avatar-09.webp": "images/greenpromo/square-door.webp",
    "videos/hero-glob.mp4": "videos/greenpromo/coverage-map.mp4",
    "videos/story-slider-01.mp4": "videos/greenpromo/coverage-center.mp4",
    "videos/story-slider-02.mp4": "videos/greenpromo/coverage-north.mp4",
    "videos/story-slider-03.mp4": "videos/greenpromo/coverage-south.mp4",
    "videos/story-slider-04.mp4": "videos/greenpromo/coverage-west.mp4",
    "videos/story-slider-05.mp4": "videos/greenpromo/coverage-piraeus.mp4",
    "images/icons/app-store.svg": "images/greenpromo/phone.svg",
    "images/icons/app-store-light.svg": "images/greenpromo/phone.svg",
    "images/icons/play-store.svg": "images/greenpromo/whatsapp.svg",
    "images/icons/icon-39.svg": "images/greenpromo/square-report.webp",
}
for old, new in asset_map.items():
    html = html.replace(old, new)

alt_by_source = {
    "logo-black.png": "GreenPromo",
    "landscape-door.webp": "Διανομή φυλλαδίων πόρτα-πόρτα στην Αθήνα",
    "hero-hand-to-hand.webp": "Προωθήτρια παραδίδει φυλλάδιο σε περαστικό στην Αθήνα",
    "hero-reporting.webp": "Αναφορά καμπάνιας με χάρτη διαδρομών και φωτογραφίες πεδίου",
    "hero-business.webp": "Τοποθέτηση ενημερωτικού υλικού σε επιχείρηση",
    "square-door.webp": "Διανομή φυλλαδίων σε κατοικίες",
    "square-hand.webp": "Χέρι-με-χέρι διανομή σε σημείο υψηλής κίνησης",
    "square-report.webp": "Φωτογραφική τεκμηρίωση και PDF αναφορά διανομής",
    "square-business.webp": "Διανομή ενημερωτικού υλικού σε επιχείρηση",
    "phone-reporting.webp": "Χάρτης διαδρομών, φωτογραφίες πεδίου και αναφορά διανομής",
    "landscape-hand.webp": "Χέρι-με-χέρι διανομή φυλλαδίων στην Αθήνα",
    "landscape-business.webp": "Στοχευμένη διανομή φυλλαδίων σε επιχειρήσεις",
    "landscape-report.webp": "Αναφορά διανομής με ζώνες κάλυψης και φωτογραφίες",
}

def update_alt(match: re.Match[str]) -> str:
    tag = match.group(0)
    src_match = re.search(r'src="([^"]+)"', tag)
    if not src_match or "/greenpromo/" not in src_match.group(1):
        return tag
    filename = src_match.group(1).rsplit("/", 1)[-1]
    alt = alt_by_source.get(filename, "")
    if re.search(r'alt="[^"]*"', tag):
        return re.sub(r'alt="[^"]*"', f'alt="{alt}"', tag, count=1)
    return tag[:-1] + f' alt="{alt}">' if tag.endswith(">") else tag

html = re.sub(r"<img\b[^>]*>", update_alt, html)

INDEX.write_text(html, encoding="utf-8")
print(f"Updated {INDEX}")
