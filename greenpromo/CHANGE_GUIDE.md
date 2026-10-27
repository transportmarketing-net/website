# Homepage Migration Guide: Staffing → Promotional Products
## GreenPromo - transportmarketing.net/greenpromo

**Objective:** Transition homepage messaging from recruitment/staffing services to promotional product distribution (leaflets, flyers, branded merchandise).

**Timeline:** Sequential steps, testable at each checkpoint.

---

## PHASE 1: METADATA & SEO (Step 1-3)

### Step 1: Update Meta Tags & Page Title
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`

Replace all instances:
```
staffing → promotional products / promotional product distribution
recruitment → leaflet distribution / product promotion
employees → leaflets / promotional materials
temporary workers → distribution partners
employment → promotional campaigns
```

**Line 9** - Title:
```html
OLD: <title>GreenPromo | Διανομή Φυλλαδίων Αθήνα & Αττική</title>
NEW: <title>GreenPromo | Διανομή Προωθητικών Προϊόντων Αθήνα & Αττική</title>
```

**Line 10** - Description:
```html
OLD: <meta name="description" content="Επαγγελματική διανομή φυλλαδίων στην Αθήνα & ευρύτερη Αττική. Πόρτα-πόρτα, χέρι-με-χέρι, γραμματοκιβώτια. Φωτογραφική τεκμηρίωση & GPS tracking.">
NEW: <meta name="description" content="Επαγγελματική διανομή προωθητικών προϊόντων: φυλλάδια, δείγματα, δώρα. Αθήνα & ευρύτερη Αττική. Πόρτα-πόρτα, χέρι-με-χέρι, γραμματοκιβώτια. Φωτογραφική τεκμηρίωση & GPS tracking.">
```

**Line 11** - Keywords:
```html
OLD: <meta name="keywords" content="διανομή φυλλαδίων, Αθήνα, Αττική, πόρτα-πόρτα, χέρι-με-χέρι, field marketing, leaflet distribution">
NEW: <meta name="keywords" content="διανομή προϊόντων, δείγματα, προωθητικά δώρα, Αθήνα, Αττική, πόρτα-πόρτα, field marketing, promotional distribution">
```

**Line 22-23** - Open Graph:
```html
OLD: <meta property="og:title" content="GreenPromo | Διανομή Φυλλαδίων Αθήνα & Αττική">
     <meta property="og:description" content="Αξιόπιστη διανομή φυλλαδίων σε όλη την Αττική. Φωτογραφική τεκμηρίωση. Δωρεάν προσφορά σε 24 ώρες.">
NEW: <meta property="og:title" content="GreenPromo | Διανομή Προωθητικών Προϊόντων Αθήνα & Αττική">
     <meta property="og:description" content="Διανομή προωθητικών προϊόντων & δειγμάτων σε όλη την Αττική. Φωτογραφική τεκμηρίωση & GPS tracking. Δωρεάν προσφορά σε 24 ώρες.">
```

### Step 2: Update JSON-LD Schema
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Lines 31-55**

Replace the LocalBusiness description:
```json
OLD: "description": "Αξιόπιστη διανομή φυλλαδίων και προωθητικές ενέργειες σε όλη την Αττική.",
NEW: "description": "Επαγγελματική διανομή προωθητικών προϊόντων, δειγμάτων και εντύπων σε όλη την Αττική. GPS tracked, φωτογραφικά τεκμηριωμένη.",
```

### Step 3: Update Service Category
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Lines 31-55** - JSON-LD

Change `@type` if needed (optional):
```json
Current: "LocalBusiness"
Alternative: "LocalBusiness" with "areaServed": "Athens, Attica" (keep as is, this is fine)
```

---

## PHASE 2: HERO SECTION (Step 4-6)

### Step 4: Update Hero Title & Subtitle
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Find:** `.hero-title` and `.hero-subtitle` classes in HTML (around lines 1200+)

Search for hero section:
```bash
grep -n "hero-title\|hero-subtitle" index.html
```

Expected current text (search for):
- "Κάντε την διαφορά με προσωπική διανομή"
- "Εξειδικευμένη διανομή προϊόντων σε Αθήνα & Αττική"

Replace with:
```html
<h1 class="hero-title">Προωθήστε τα προϊόντα σας αποτελεσματικά</h1>
<p class="hero-subtitle">Επαγγελματική διανομή προωθητικών προϊόντων & δειγμάτων πόρτα-πόρτα. Με GPS tracking & φωτογραφική απόδειξη παράδοσης.</p>
```

### Step 5: Update Hero Label/Badge
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Find:** `.hero-label` element

Current text (likely): "Διανομή Φυλλαδίων"

Replace with:
```html
<span class="hero-label">Προωθητικές Ενέργειες</span>
```

### Step 6: Update Hero Features (3-column feature cards)
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Find:** `.hero-features` section (around lines 1250-1330)

Current features to replace:

| Current (Staffing) | New (Promotional Products) |
|---|---|
| Φωτογραφική Απόδειξη | Ασφαλής Διανομή |
| GPS Tracking | Φωτογραφική Απόδειξη |
| Αναφορές Παράδοσης | GPS Tracked Route |

**Replace text in h3 tags within `.hero-features`:**
```html
OLD: <h3>Φωτογραφική Απόδειξη</h3>
     <p>Κάθε παραλαβή τεκμηριώνεται φωτογραφικά για απόλυτη διαφάνεια.</p>
NEW: <h3>100% Ασφαλής Διανομή</h3>
     <p>Κάθε δέμα παραλαβή τεκμηριώνεται με φωτογραφία & υπογραφή παραλήπτη.</p>

OLD: <h3>GPS Tracking</h3>
     <p>Real-time παρακολούθηση του διανομέα κατά τη διάρκεια της διανομής.</p>
NEW: <h3>Real-Time GPS Tracking</h3>
     <p>Παρακολουθήστε κάθε βήμα της διανομής σας σε real-time χάρτη.</p>

OLD: <h3>Αναφορές Παράδοσης</h3>
     <p>Αναλυτικές ημερήσιες αναφορές για κάθε διανομή.</p>
NEW: <h3>Λεπτομερείς Αναφορές</h3>
     <p>Ημερήσιες αναφορές διανομής με φωτογραφίες, χρόνου & τοποθεσίας.</p>
```

---

## PHASE 3: SERVICES SECTION (Step 7-9)

### Step 7: Update "Σημεία Διανομής" Title
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Line ~1326**

Current: `<h2 class="section-title centered">Σημεία Διανομής Φυλλαδίων</h2>`

Replace with:
```html
<h2 class="section-title centered">Τύποι Προϊόντων που Διανέμουμε</h2>
```

### Step 8: Update Service Cards (6 cards in services-grid)
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Lines ~1329-1370**

Current cards: Γραμματοκιβώτια, Μονοκατοικίες, Πολυκατοικίες, Επιχειρήσεις, Πόρτα-Πόρτα, Σταθερά Σημεία

Replace with product types:
```html
Card 1:
OLD: <h3>Γραμματοκιβώτια</h3>
NEW: <h3>Φυλλάδια & Εντύπα</h3>

Card 2:
OLD: <h3>Μονοκατοικίες</h3>
NEW: <h3>Δείγματα Προϊόντων</h3>

Card 3:
OLD: <h3>Πολυκατοικίες</h3>
NEW: <h3>Δώρα & Gadgets</h3>

Card 4:
OLD: <h3>Επιχειρήσεις</h3>
NEW: <h3>Καταλόγοι & Βιβλία</h3>

Card 5:
OLD: <h3>Πόρτα-Πόρτα</h3>
NEW: <h3>Branded Merchandise</h3>

Card 6:
OLD: <h3>Σταθερά Σημεία</h3>
NEW: <h3>Ειδικές Συσκευασίες</h3>
```

**SVG Icons** - Keep existing SVG icons; they're generic enough (📦 for packaging is appropriate).

### Step 9: Update Process Section Title
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Line ~1380**

Current: `<h2 class="section-title centered">4 Βήματα. Απλά & Γρήγορα.</h2>`

This can remain, but optionally update to:
```html
<h2 class="section-title centered">Πώς Λειτουργεί η Διανομή. 4 Βήματα.</h2>
```

---

## PHASE 4: PACKAGES & PRICING (Step 10-12)

### Step 10: Update Package Names
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Lines ~1430-1475**

Current packages: Custom, Starter, Standard, Pro

Keep names, update descriptions. Find each `.package-card`:

```html
Package 1 (Custom):
Keep title: <h3>Custom</h3>
Update description: "Εξατομικευμένο πακέτο διανομής ανάλογα με τις ανάγκες σας"

Package 2 (Starter):
Keep title: <h3>Starter</h3>
Update description: "Ιδανικό για νέες καμπάνιες διανομής. Έως 5,000 φυλλάδια/προϊόντα."

Package 3 (Standard):
Keep title: <h3>Standard</h3>
Update description: "Δημοφιλέστερη επιλογή. 5,000-15,000 φυλλάδια/δείγματα με πλήρη τεκμηρίωση."

Package 4 (Pro):
Keep title: <h3>Pro</h3>
Update description: "Μεγάλης κλίμακας διανομές. 15,000+ προϊόντα, εξεζητημένη στόχευση, dedicated account manager."
```

### Step 11: Update Industries Section
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Lines 1493-1530**

Section title (line 1493):
```html
Current: <h2 class="section-title centered">Κλάδοι που Εξυπηρετούμε</h2>
Keep as is: Still relevant
```

**Update client-card items** (8 cards with emoji + text):

Replace with product-focused industries:
```html
Card 1 (OLD: 🛒 Σούπερ Μάρκετ...):
NEW: <h4>F&B & Εστιατόρια</h4>
(νέα δείγματα κρασιών, μενού, προσφορές)

Card 2 (OLD: 🍽️ Εστιατόρια):
NEW: <h4>Καλλυντικά & Περιποίηση</h4>
(δείγματα προϊόντων, κουπόνια εκπτώσεων)

Card 3 (OLD: 💇 Κομμωτήρια):
NEW: <h4>Ρούχα & Αξεσουάρ</h4>
(προϊόντα σεζόν, νέες συλλογές)

Card 4 (OLD: 💪 Γυμναστήρια):
NEW: <h4>Τεχνολογία & Gadgets</h4>
(δείγματα νέων συσκευών, φυλλάδια)

Card 5 (OLD: 💊 Φαρμακεία):
NEW: <h4>Αθλητική & Fitness</h4>
(δείγματα συμπληρωμάτων, διατροφικά)

Card 6 (OLD: 🏠 Κτηματομεσιτικά):
NEW: <h4>Λιανικό Εμπόριο</h4>
(ειδικές προσφορές, προϊόντα καταστήματος)

Card 7 (OLD: 📚 Φροντιστήρια):
NEW: <h4>Οικιακά & Έπιπλα</h4>
(νέα σχέδια, κατάλογοι σειράς)

Card 8 (OLD: ☕ Καφετέριες):
NEW: <h4>Υγεία & Wellness</h4>
(βιολογικά προϊόντα, δείγματα φυσικής κοσμετικής)
```

---

## PHASE 5: FAQ UPDATES (Step 13-14)

### Step 12: Update FAQ Intro Text
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Lines 1537-1540**

Current:
```html
<h2 class="section-title centered">Συχνές Ερωτήσεις</h2>
<p class="section-subtitle centered">Ό,τι χρειάζεται να ξέρετε πριν ξεκινήσετε.</p>
```

Keep titles as is. Update subtitle to promotional focus:
```html
<p class="section-subtitle centered">Ό,τι χρειάζεται να ξέρετε για την διανομή των προϊόντων σας.</p>
```

### Step 13: Update FAQ Questions & Answers
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`

Search for `<details>` or `.faq-item` elements (typically after line 1540).

Update Q&A topics to reflect promotional products:

```
OLD Q: "Πώς γίνεται η επιλογή των υποψηφίων;"
NEW Q: "Τι είδους προϊόντα μπορώ να διανείμω;"
NEW A: "Διανέμουμε όλα τα είδη προϊόντων: φυλλάδια, δείγματα, δώρα, branded merchandise, κατάλογοι, κάρτες..."

OLD Q: "Ποια είναι η διάρκεια της συνεργασίας;"
NEW Q: "Πόσο καιρό διαρκεί μια διανομή;"
NEW A: "Ανάλογα το μέγεθος: 1,000-5,000 δείγματα: 3-5 ημέρες. 5,000-15,000: 1-2 εβδομάδες. 15,000+: συμφωνία case-by-case."

OLD Q: "Πόσο κοστίζει;"
NEW Q: "Ποια είναι η τιμολόγηση;"
NEW A: "Εξαρτάται από το μέγεθος διανομής, τον τύπο προϊόντος & την γεωγραφική κάλυψη. Δωρεάν προσφορά σε 24 ώρες."
```

---

## PHASE 6: IMAGES & ASSETS (Step 14-17)

### Step 14: Assess Current Images
**Directory:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/images/`

Current images are named for staffing context:
- `factory-staffing-*.jpg/webp`
- `hotel-staffing-*.jpg/webp`
- `business-staffing-*.jpg/webp`
- `general-*.jpg/webp`

**ACTION:** Replace with promotional product images:
- Product samples/unboxing
- Leaflet distribution in action
- Close-ups of branded merchandise
- Packaging & branded boxes
- Team distributing at locations

**KEEP:** `general-*.jpg` files are safe (generic business photos).

### Step 15: Replace Key Hero Background
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Find:** `.hero` background CSS (around line 215)

Current:
```css
background:
    linear-gradient(135deg, rgba(8, 26, 14, 0.82) 0%, rgba(10, 46, 20, 0.6) 40%, rgba(30, 126, 52, 0.25) 100%),
    url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80') center/cover no-repeat;
```

Replace Unsplash image with local/new image:
```css
background:
    linear-gradient(135deg, rgba(8, 26, 14, 0.82) 0%, rgba(10, 46, 20, 0.6) 40%, rgba(30, 126, 52, 0.25) 100%),
    url('/images/promotional-products-hero.jpg') center/cover no-repeat;
```

**New image needed:** Promotional products/leaflets being distributed, or branded merchandise display.

### Step 16: Update Feature Icons/Visuals
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`

In hero-features section, the SVG icons can remain (they're generic), OR replace with product-themed emojis/icons:
- 📦 (box) for safe delivery
- 📸 (camera) for photo proof
- 🗺️ (map) for GPS tracking

### Step 17: Archive Old Images
**Action:**
```bash
mkdir /home/alexandroskourtis/work/transportmarketing.net/greenpromo/images/archive-staffing
mv /home/alexandroskourtis/work/transportmarketing.net/greenpromo/images/*-staffing-*.* /home/alexandroskourtis/work/transportmarketing.net/greenpromo/images/archive-staffing/
```

---

## PHASE 7: CONTACT & CTA (Step 18-19)

### Step 18: Update Contact Section Copy
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`
**Lines ~1610-1625**

Current:
```html
<h2>Ζητήστε δωρεάν προσφορά</h2>
<p>Επικοινωνήστε με εμάς για να μάθετε πώς μπορούμε να σας βοηθήσουμε.</p>
```

Update to promotional products context:
```html
<h2>Ετοιμάστε τη Διανομή σας Σήμερα</h2>
<p>Δωρεάν προσφορά για όλα τα επίπεδα διανομής. Απάντηση σε 24 ώρες.</p>
```

### Step 19: Update CTA Button Text
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html`

Find `.nav-cta` and submit buttons throughout page:

Replace:
```html
OLD: "Επικοινωνία" or "Ενδιαφέρεσαι;"
NEW: "Δωρεάν Προσφορά" or "Ζητήστε Τιμή"
```

---

## PHASE 8: CSS REFINEMENTS (Step 20)

### Step 20: Check CSS Color Consistency
**File:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/css/style.css`

Colors are already green-branded (GreenPromo). Verify:
- Primary green (#34a853) fits promotional/eco-friendly messaging ✓
- Text colors readable ✓
- Buttons have proper hover states ✓

**NO CHANGES NEEDED** unless rebranding desired.

---

## TESTING CHECKLIST

### Pre-Deployment Testing (Local)

- [ ] **Meta Tags:** Open in browser → View Source → Verify updated title/description
- [ ] **SEO Keywords:** Check page title includes "προϊόντων" not staffing terms
- [ ] **Hero Section:**
  - [ ] Title reads "Προωθήστε τα προϊόντα σας"
  - [ ] Badge shows "Προωθητικές Ενέργειες"
  - [ ] Features mention GPS, photos, reports
- [ ] **Services Cards:** Display 6 product types (Φυλλάδια, Δείγματα, Δώρα, Καταλόγοι, Branded, Συσκευασίες)
- [ ] **Industries Section:** Shows F&B, Cosmetics, Clothing, Tech, Sports, Retail, Furniture, Health
- [ ] **FAQ:** Updated with product-focused questions
- [ ] **Form/CTA:** Button text reads "Δωρεάν Προσφορά" or "Ζητήστε Τιμή"
- [ ] **Images:** No staffing-related photos visible (or replaced with product images)
- [ ] **Mobile Responsive:** Hamburger menu works, content stacks properly at 768px breakpoint

### Accessibility

- [ ] **Alt Text:** All images have descriptive alt text (if applicable)
- [ ] **Color Contrast:** Text readable on all backgrounds
- [ ] **Keyboard Navigation:** Tab through form fields
- [ ] **Links:** No broken internal links (#services, #packages, #contact)

### Performance

- [ ] **Page Load:** Test with Chrome DevTools → Lighthouse (target: 80+)
- [ ] **Images:** Use `.webp` format where available (already in place)
- [ ] **Fonts:** Google Fonts load correctly

### Content Accuracy

- [ ] **Phone Number:** Correct (+302103007716)
- [ ] **Email:** Correct (info@greenpromo.marketing)
- [ ] **Opening Hours:** Still 09:00-18:00 M-F (verify in JSON-LD)
- [ ] **Service Area:** Attica/Athens coverage stated correctly
- [ ] **No Staffing Terminology:** Search page for "recruitment", "employees", "staffing" → should return 0 results

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (desktop)
- [ ] Mobile Safari (iPhone)
- [ ] Chrome Mobile (Android)

---

## DEPLOYMENT STEPS

1. **Backup Current Version:**
   ```bash
   cp /home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html /home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html.backup-staffing
   ```

2. **Make Edits (Follow phases 1-7 above)** using Edit tool.

3. **Test Locally:**
   ```bash
   # Open in browser or use Python simple server
   cd /home/alexandroskourtis/work/transportmarketing.net/greenpromo
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

4. **Validate HTML:**
   ```bash
   # Check for syntax errors (optional)
   grep -E "(TODO|FIXME|XXX|TEMP)" index.html
   ```

5. **Commit to Git:**
   ```bash
   git add index.html
   git commit -m "refactor(homepage): migrate from staffing to promotional products messaging"
   ```

6. **Push to Staging/Production:**
   ```bash
   git push origin main
   ```

7. **Clear Cache (if applicable):**
   - Cloudflare: Purge cache
   - Browser: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

---

## ROLLBACK PLAN

If issues arise:

```bash
# Restore backup
cp /home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html.backup-staffing /home/alexandroskourtis/work/transportmarketing.net/greenpromo/index.html

# Commit rollback
git add index.html
git commit -m "revert(homepage): rollback to staffing messaging"
git push origin main
```

---

## IMAGE REPLACEMENT SPECIFICATION

### Hero Background Image
- **Dimensions:** 1600x900px (minimum)
- **Format:** JPG (Unsplash) or locally hosted
- **Content:** Promotional products being distributed, leaflets, branded merchandise
- **Location to update:** Line 215 in style block

### Section Images (services/features)
- **Use existing `general-*.jpg` files** or commission new:
  - Product packaging/unboxing
  - Delivery in action
  - Branded merchandise examples
  - Team distributing leaflets/samples

### Logo
- **Keep:** Current green logo (brand continuity)
- **Location:** `/home/alexandroskourtis/work/transportmarketing.net/greenpromo/images/`

---

## NOTES FOR FUTURE UPDATES

- **Services Page** (`/services/`): May need similar updates if staffing-focused. Check `/greenpromo.transportmarketing.net/greenpromo.transportmarketing.net/services/index.html`
- **Blog/Articles:** If any blog posts reference staffing, create new posts on promotional product strategies
- **Email Templates:** Update any auto-responders/email confirmations sent to new leads
- **Google My Business:** Update business category & description
- **Social Media:** Align bio/posts with promotional products messaging

---

## QUICK REFERENCE: SEARCH & REPLACE PATTERNS

Use in editor (Find & Replace):

| Search | Replace | Scope |
|--------|---------|-------|
| `Διανομή Φυλλαδίων` | `Διανομή Προϊόντων` | Title/Meta |
| `φυλλάδια` | `προϊόντα & φυλλάδια` | Content |
| `recruitment\|staffing\|employees` | `promotional products\|distribution` | All |
| `προσωπική διανομή` | `αποτελεσματική προώθηση` | Hero |
| `Κλάδοι που Εξυπηρετούμε` | Keep as is | Industries |

---

## ESTIMATED TIME

- **Metadata & SEO:** 15 min
- **Hero Section:** 20 min
- **Services & Features:** 25 min
- **Industries & FAQ:** 20 min
- **Images:** 30 min (depends on availability)
- **Testing:** 30 min
- **Total:** ~2-2.5 hours

---

**Created:** 2026-10-27 | **Version:** 1.0
