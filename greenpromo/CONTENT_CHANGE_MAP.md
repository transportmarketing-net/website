# GreenPromo Content Change Map
## Converting from ST.RIVE (Staffing Agency) to Promotional Products

---

## META TAGS & SCHEMA

### Title Tag
**Lines:** 7
**Current:** `ST.RIVE — Hotel & Business Staffing Agency | Athens, Greece`
**Should Be:** `GreenPromo — Promotional Products & Corporate Gifts | Athens, Greece`

### Meta Description
**Lines:** 8
**Current:** `ST.RIVE — Professional hotel and business staffing in Athens. Housekeeping, F&B, reception staff, international recruitment from 19+ countries, workforce management and legal compliance across Greece.`
**Should Be:** `GreenPromo — Custom promotional products, branded merchandise, and corporate gifts. T-shirts, bags, caps, drinkware. B2B solutions for businesses, events, and brand campaigns across Greece.`

### OG Title
**Lines:** 11
**Current:** `ST.RIVE — Hotel & Business Staffing Agency in Athens`
**Should Be:** `GreenPromo — Custom Promotional Products & Corporate Gifts`

### OG Description
**Lines:** 12
**Current:** `Professional staffing solutions for hotels and businesses across Greece. International recruitment, workforce management, and full legal compliance.`
**Should Be:** `Custom branded merchandise for businesses and events. T-shirts, hoodies, bags, caps, bottles. Professional design and bulk production. Fast turnaround.`

### OG Site Name
**Lines:** 16
**Current:** `Strive Workforce`
**Should Be:** `GreenPromo`

### OG Image
**Lines:** 17
**Current:** `images/panel-04-hotel-staffing.jpg`
**Should Be:** `images/greenpromo-hero-banner.jpg` (shows promotional products display/showcase)

### Twitter Title
**Lines:** 24
**Current:** `ST.RIVE — Hotel & Business Staffing Agency`
**Should Be:** `GreenPromo — Promotional Products & Corporate Gifts`

### Twitter Description
**Lines:** 25
**Current:** `Professional staffing solutions for hotels and businesses across Greece. International recruitment, workforce management, and full legal compliance.`
**Should Be:** `Custom promotional products, branded merchandise, corporate gifts. Quality printing & embroidery. Bulk orders. Fast delivery across Greece.`

### Canonical URL
**Lines:** 29-32
**Current:** `https://striveworkforce.gr/`
**Should Be:** `https://greenpromo.gr/` (or appropriate domain)

### JSON-LD: WebSite Schema
**Lines:** 48-62
**Current Schema:** SearchAction targeting striveworkforce.gr
**Should Be:** Change to greenpromo.gr with product/promotional products focus

### JSON-LD: EmploymentAgency Schema
**Lines:** 64-156 (ENTIRE SECTION REPLACE)
**Current:** @type: "EmploymentAgency"
**Should Be:** @type: "LocalBusiness" or "Store" with focus on promotional products
- **name:** "GreenPromo" (instead of "ST.RIVE")
- **description:** Promotional products company offering customized merchandise
- **logo:** images/greenpromo-logo.png
- **knowsAbout:** Replace with product categories:
  - "promotional products", "corporate gifts", "branded merchandise", "t-shirt printing", "custom apparel", "branded caps", "promotional bags", "drinkware", "business gifts", "event merchandise", "bulk printing", "logo embroidery", "screen printing"
- **areaServed:** Keep Greece focus but change from employment to product delivery areas
- **priceRange:** "€€" to "€€€" (product pricing model)
- **contactPoint:** Update phone/email but keep structure similar

---

## GLOBAL HEADER & NAVIGATION

### Logo Alt Text
**Line:** 162
**Current:** `Strive Workforce - ST.RIVE`
**Should Be:** `GreenPromo - Promotional Products`

### Navigation: "About Us" Link
**Line:** 169
**Current:** `/about`
**Should Be:** `/about` (keep route, update content on destination page)

### Navigation: Individuals Dropdown
**Lines:** 171-179 (ENTIRE SECTION REPLACE)
**Current Services:**
- Cleaning & Domestic Support
- Nannies & Childcare
- Elderly Care
- Pet Care

**Should Be:** Retail/Direct Customer Products
- Custom T-Shirts & Apparel
- Branded Caps & Hats
- Promotional Bags
- Drinkware & Accessories
- Bulk Order Discounts

**New Routes:** `/products/t-shirts`, `/products/caps`, `/products/bags`, `/products/drinkware`, `/bulk-orders`

### Navigation: Businesses Dropdown
**Lines:** 181-190 (ENTIRE SECTION REPLACE)
**Current Services:**
- Hotel Staffing
- Business Staffing
- Factory Staffing
- International Staff Recruitment
- Recruitment & Executive Search

**Should Be:** B2B & Corporate Solutions
- Corporate Gift Programs
- Event Merchandise
- Brand Campaigns
- Uniform & Team Apparel
- Wholesale Solutions
- Custom Design Services

**New Routes:** `/solutions/corporate-gifts`, `/solutions/events`, `/solutions/campaigns`, `/solutions/uniforms`, `/solutions/wholesale`, `/design-services`

### Navigation: "Specialties" Link
**Line:** 192
**Current:** `/staff-specialties`
**Should Be:** `/product-categories` or `/design-options`

---

## SPLIT-SCREEN HERO SECTION

### H1 (SR-Only)
**Line:** 205
**Current:** `Strive Workforce (ST.RIVE) — Staffing Services in Alimos, Athens`
**Should Be:** `GreenPromo — Promotional Products & Corporate Gifts in Athens`

### B2B Section Background Images
**Lines:** 209-323 (ENTIRE SLIDESHOW REPLACE)
All current images are staffing-focused (factory workers, agriculture, hotel staff).
**Should Be:** Promotional products images:
- Branded t-shirt displays with logos
- Cap/hat product shots
- Bags and tote bags (branded)
- Drinkware with company logos
- Event merchandise displays
- Corporate gift boxes
- Printing/embroidery process photos
- Before/after branding examples
- Bulk product warehouse shots
- Team wearing branded apparel

### B2B Section: Heading & Subtitle
**Lines:** 326-327
**Current:**
- Heading: `Businesses`
- Subtitle: `Complete staffing solutions`

**Should Be:**
- Heading: `For Businesses`
- Subtitle: `Custom promotional products & corporate gifts`

### B2B Section: Service Links
**Lines:** 329-344
**Current Services:**
1. Hotel Staffing
2. Business Staffing
3. Factory Staffing
4. International Staff Recruitment
5. Recruitment & Executive Search

**Should Be:**
1. Corporate Gift Programs
2. Event Merchandise
3. Brand Campaigns
4. Uniform & Team Apparel
5. Wholesale Solutions

### B2B CTA Button
**Lines:** 345
**Current:** `Request a Quote` with data-service="hotels-catering"
**Should Be:** `Browse Solutions` or `Get Corporate Quote` with data-category="b2b"

---

## B2C SECTION (BECOMES RETAIL/DIRECT CUSTOMER)

### B2C Section: Heading & Subtitle
**Lines:** 409-410
**Current:**
- Heading: `Individuals`
- Subtitle: `Reliable staff for your home`

**Should Be:**
- Heading: `For You`
- Subtitle: `Personalized promotional products`

### B2C Background Images
**Lines:** 351-406 (ENTIRE SLIDESHOW REPLACE)
Current images are domestic/personal care focused.
**Should Be:** Consumer product images:
- Custom t-shirt designs with personal designs
- Personalized caps and hats
- Custom tote bags
- Water bottles/mugs with names/designs
- Gift-wrapped promotional items
- Apparel flat-lays with various colors
- Customization/design mockups
- Gift packaging examples

### B2C Service Links
**Lines:** 412-424
**Current Services:**
1. Cleaning & Domestic Support
2. Nannies & Childcare
3. Elderly Care
4. Pet Care

**Should Be:**
1. Custom Apparel
2. Branded Accessories
3. Drinkware & Mugs
4. Gift Ideas

### B2C CTA Button
**Line:** 425
**Current:** `Request a Quote` with data-service="professional-cleaning"
**Should Be:** `Shop Products` or `Start Customizing`

---

## COVERAGE OVERVIEW: BUSINESS SECTION

### Section Heading
**Lines:** 430-435
**Current Title:** `Business staffing across Greece`
**Current Text:** `Solutions for hotels, businesses, and industry—from local and seasonal staffing to international recruitment and executive search.`

**Should Be:**
**Title:** `Corporate Solutions Across Greece`
**Text:** `Custom promotional products and corporate gifts for businesses of all sizes—from startup gifts to major brand campaigns.`

### Service Grid Items (6 services)
**Lines:** 439-468
**Current Services:**
1. Hotel Staffing
2. Business Staffing
3. Factory Staffing
4. International Staff Recruitment
5. Agriculture Staffing
6. Recruitment & Executive Search

**Should Be:**
1. Corporate Gift Programs
2. Event Merchandise
3. Brand Campaigns
4. Uniform & Team Apparel
5. Wholesale Solutions
6. Custom Design Services

**Updated Routes:**
- `/solutions/corporate-gifts`
- `/solutions/events`
- `/solutions/campaigns`
- `/solutions/uniforms`
- `/solutions/wholesale`
- `/design-services`

### Coverage Footer Text
**Line:** 472
**Current:** `11+ locations: Athens, Thessaloniki, Crete, the islands, and projects throughout Greece.`
**Should Be:** `Nationwide delivery across Greece. Fast production turnaround. Design and customization available.`

### Coverage Footer: Primary CTA
**Lines:** 474-476
**Current:** `Request a staffing proposal`
**Should Be:** `Get a Product Quote` or `Start Your Order`

### Coverage Footer: Secondary Links
**Lines:** 477-484
**Current:**
- `Staff specialties`
- `View all staffing locations`

**Should Be:**
- `Design Gallery` or `Portfolio`
- `Product Categories` or `Shop All Products`

---

## COVERAGE OVERVIEW: HOME SECTION (BECOMES RETAIL CATEGORIES)

### Section Title
**Lines:** 493-494
**Current Title:** `Home services near you`
**Current Subtitle:** `Domestic help, cleaning, and care from trusted professionals.`

**Should Be:**
**Title:** `Popular Products`
**Subtitle:** `Explore our most popular promotional products and categories.`

### Region Tags (Replace with Product Categories)
**Lines:** 499-526
**Current:** Geographic regions with service counts
- Northern Suburbs (12)
- Southern Suburbs (10)
- Western Athens (5)
- Central & Piraeus (4)
- East Attica (2)
- Thessaloniki (6)
- 17+ Cities

**Should Be:** Product Categories
- Custom T-Shirts & Tops
- Caps & Hats
- Bags & Totes
- Drinkware & Mugs
- Corporate Gifts
- Event Merchandise
- Embroidery & Printing

**New Routes:**
- `/products/t-shirts`
- `/products/caps`
- `/products/bags`
- `/products/drinkware`
- `/products/gifts`
- `/products/events`
- `/services/printing-embroidery`

### Region Count Summary
**Line:** 527
**Current:** `39 areas covered across Greece`
**Should Be:** `100+ products available` or `7+ main categories`

### Home Link
**Line:** 529
**Current:** `View areas & services`
**Should Be:** `Browse All Products` or `View Catalog`

---

## FOOTER

### Footer Column 1: "Staffing Solutions"
**Lines:** 541-548
**Current Heading:** `Staffing Solutions`
**Current Links:**
- Hotel Staffing
- Business Staffing
- Factory Staffing
- International Recruitment
- Executive Search

**Should Be:**
**Heading:** `Corporate Solutions`
**Links:**
- Corporate Gifts
- Event Merchandise
- Brand Campaigns
- Uniforms & Apparel
- Wholesale Orders

### Footer Column 2: "Home Services"
**Lines:** 550-557
**Current Heading:** `Home Services`
**Current Links:**
- Cleaning & Domestic Support
- Nannies & Childcare
- Elderly Care
- Pet Care

**Should Be:**
**Heading:** `Shop Products`
**Links:**
- Custom T-Shirts
- Caps & Hats
- Bags & Accessories
- Drinkware
- View All Products

### Footer Column 3: "Company"
**Lines:** 559-567
**Current:** Keep structure, update destination pages
- About Us (update page content)
- Blog (update to product blog/inspiration)
- Contact
- Privacy Policy
- Terms of Service

### Footer Column 4: "Contact"
**Lines:** 569-574
**Current:**
- Phone: 210 988 0047
- Mobile: 698 688 7733
- Email: info@striveworkforce.gr
- Location: Alimos, Athens

**Should Be:**
- Phone: [Updated GreenPromo number]
- Mobile: [Updated mobile]
- Email: [greenpromo email]
- Location: [GreenPromo location]

### Footer Copyright
**Line:** 578
**Current:** `© 2024 ST.RIVE Workforce. All rights reserved.`
**Should Be:** `© 2024 GreenPromo. All rights reserved.`

### Footer Social Links
**Lines:** 580-582
**Current:** Facebook, Instagram, LinkedIn (ST.RIVE branded)
**Should Be:** Update to GreenPromo social accounts
- Facebook
- Instagram
- Pinterest (new - for product inspiration)

---

## MODALS

### About Modal (ID: "about")

#### Modal Heading
**Line:** 592
**Current:** `ST.RIVE`
**Should Be:** `GreenPromo`

#### Modal Main Text
**Lines:** 593-594
**Current:** `ST.RIVE is a modern staffing and human resource management company, offering comprehensive solutions for businesses and individuals across Greece.`
**Should Be:** `GreenPromo is a leading promotional products company, offering custom branded merchandise and corporate gifts for businesses and events across Greece.`

#### What Sets Us Apart (Lines 598-605)
**Current:**
- Immediate response to staffing needs
- Staffing from Greece and abroad
- Structured HR process
- The right person in the right position
- Complete management
- Consistent support

**Should Be:**
- High-quality custom printing & embroidery
- Fast production & delivery
- Affordable bulk pricing
- Professional design assistance
- Wide product selection
- Dedicated customer support

#### Our Services Section (Lines 610-619)
**Current:**
- Hotel staffing (seasonal & permanent)
- Business staffing with full legal compliance
- International worker recruitment from 19+ countries
- Executive search & selection
- In-home elderly care (24/7)
- Nannies & babysitting
- Cleaning & domestic support (hourly, live-in)
- Pet care

**Should Be:**
- Custom t-shirts and apparel printing
- Branded caps, hats, and headwear
- Promotional bags and totes
- Drinkware and mugs
- Corporate gift programs
- Event merchandise and special projects
- Bulk orders and wholesale solutions
- Design and consultation services

### B2C Modal (ID: "b2c") - NOW PRODUCT SHOWCASE

#### Modal Heading
**Lines:** 649
**Current:** `Services for Individuals`
**Should Be:** `Shop Our Products`

#### Modal Subtitle
**Line:** 650
**Current:** `Reliable, insured staff for every need of your family`
**Should Be:** `Quality promotional products for personal use and small events`

---

#### Subheading 1: "Domestic Helper" → "Custom Apparel"
**Lines:** 653-668
**Current Content:** Live-in/live-out domestic helper services
**Should Be:** Custom t-shirts, hoodies, polo shirts with:
- Design customization options
- Color and size variety
- Quick turnaround
- Quality fabric options
- Individual and small batch orders

**Product Links:** `/products/t-shirts`, `/products/apparel`

#### Subheading 2: "In-Home Elderly Care" → "Branded Accessories"
**Lines:** 672-688
**Current Content:** Elderly care services
**Should Be:** Promotional accessories:
- Caps and hats
- Scarves and beanies
- Backpacks and bags
- Wristbands
- Keychains

**Tags:** Should include "Affordable", "Bulk Discounts", "Customizable"
**Link:** `/products/accessories`

#### Subheading 3: "Nannies & Babysitting" → "Drinkware & Mugs"
**Lines:** 692-707
**Current Content:** Childcare services
**Should Be:** Drinkware products:
- Coffee mugs
- Water bottles
- Travel cups
- Tumblers
- Custom designs and full-color printing

**Features List:**
- Stainless steel options
- Insulated varieties
- Color options
- Dishwasher safe
- Gift-ready packaging

**Link:** `/products/drinkware`

#### Subheading 4: "Cleaning & Domestic Support" → "Corporate Gifts"
**Lines:** 711-726
**Current Content:** Cleaning services
**Should Be:** Corporate gift solutions:
- Company branded gifts
- Client appreciation packages
- Employee recognition gifts
- Executive gifts
- Gift sets and combos

**Options:**
- Pre-packaged sets
- Custom combinations
- Bulk corporate orders
- Branded packaging
- Custom greeting cards

**Link:** `/solutions/corporate-gifts`

#### Subheading 5: "Pet Care" → "Gift Ideas & Bundles"
**Lines:** 730-742
**Current Content:** Pet care services
**Should Be:** Pre-made gift bundles and ideas:
- Starter promotional bundles
- Gift combos
- Seasonal collections
- Event packages
- Wholesale bundles

**Link:** `/products/gift-bundles`

#### Modal CTA Button
**Line:** 745
**Current:** `Request Information`
**Should Be:** `Start Shopping` or `Explore Products`

---

### B2B Modal (ID: "b2b") - CORPORATE/BUSINESS SOLUTIONS

#### Modal Heading
**Lines:** 759
**Current:** `Staffing Solutions for Hotels & Businesses`
**Should Be:** `Promotional Products for Businesses`

#### Modal Subtitle
**Line:** 760
**Current:** `Complete workforce management without administrative burden`
**Should Be:** `Custom branding solutions for corporate programs and events`

#### Modal Intro Text
**Line:** 762
**Current:** `ST.RIVE specializes in providing comprehensive workforce solutions for hotels, businesses, and industrial facilities. We handle every step, from sourcing and evaluating staff to full legal compliance.`
**Should Be:** `GreenPromo specializes in custom promotional products and branded merchandise for corporate programs. We handle design, production, and delivery—from small orders to large-scale campaigns.`

---

#### Subheading 1: "Hotel Staffing" → "Corporate Gift Programs"
**Lines:** 764-779
**Current Content:** Hotel staffing services
**Should Be:** Corporate gift programs:
- Branded merchandise for employees
- Client appreciation gifts
- Executive gifts
- Onboarding gifts
- Seasonal corporate gifts

**Features:**
- Custom company branding
- Bulk production
- Professional packaging
- Fast turnaround
- Volume discounts

**Service Options:**
- Complete program design
- Multi-product bundles
- Personalization options
- Recipient management
- Delivery coordination

**Link:** `/solutions/corporate-gifts`

#### Subheading 2: "Factory & Construction Staffing" → "Event Merchandise"
**Lines:** 783-797
**Current Content:** Industrial and construction staffing
**Should Be:** Event merchandise solutions:
- Conference merchandise
- Festival and concert branded items
- Sports event apparel
- Trade show giveaways
- Charity event merchandise
- Sponsorship activation products

**Options:**
- Custom event designs
- Limited edition items
- Quick production turnaround
- Bulk pricing
- On-site delivery

**Link:** `/solutions/events`

#### Subheading 3: "Agriculture Staffing" → "Brand Campaigns"
**Lines:** 801-815
**Current Content:** Agricultural workforce
**Should Be:** Brand campaign solutions:
- Product launch merchandise
- Marketing campaign items
- Social media giveaway products
- Influencer collaboration items
- Customer loyalty programs
- Brand activation campaigns

**Campaign Services:**
- Strategic merchandise selection
- Design coordination
- Distribution support
- Campaign tracking
- ROI measurement

**Link:** `/solutions/campaigns`

#### Subheading 4: "Business Staffing" → "Uniform & Team Apparel"
**Lines:** 819-834
**Current Content:** Business staffing services
**Should Be:** Uniform and team apparel:
- Company uniforms
- Team polo shirts
- Team jackets and outerwear
- Safety apparel with branding
- Staff identification wear
- Team building merchandise

**Options:**
- Bulk uniform orders
- Size management
- Color customization
- Logo placement options
- Durability for commercial use
- Size runs and restocking

**Link:** `/solutions/uniforms`

#### Subheading 5: "International Staff Recruitment" → "Wholesale Solutions"
**Lines:** 838-852
**Current Content:** International recruitment
**Should Be:** Wholesale and reseller solutions:
- Wholesale pricing for retailers
- Drop-shipping options
- Reseller programs
- White-label customization
- Bulk inventory management
- Volume-based pricing tiers

**Wholesale Features:**
- Dedicated account manager
- Custom wholesale pricing
- Flexible order minimums
- Marketing support
- Regular new products
- Priority production slots

**Link:** `/solutions/wholesale`

#### Subheading 6: "Recruitment & Executive Search" → "Custom Design Services"
**Lines:** 856-870
**Current Content:** Executive search and recruitment
**Should Be:** Professional design and consultation:
- In-house design team
- Custom artwork creation
- Brand guideline application
- Product mockups
- Concept development
- Revision support

**Design Services:**
- Logo placement consultation
- Color matching
- Multi-product design coordination
- Digital proofs before production
- File format management
- Brand consistency

**Link:** `/services/design`

#### Modal CTA Button
**Line:** 873
**Current:** `Request Information`
**Should Be:** `Get Corporate Quote` or `Start Your Project`

---

### Contact Modal (ID: "contact") - KEEP STRUCTURE, UPDATE CONTENT

#### Modal Heading
**Lines:** 887
**Current:** `Get in Touch`
**Should Be:** `Contact GreenPromo` (or keep same)

#### Modal Text
**Line:** 888
**Current:** `Free estimate for every service. Contact us to find the right staff for you.`
**Should Be:** `Free quote for custom promotional products. Contact us to start your project.`

#### Contact Information
**Lines:** 891-907
**Current Contacts:**
- Landline: 210 988 0047
- Mobile: 698 688 7733
- Email: info@striveworkforce.gr
- WhatsApp: 698 688 7733

**Should Be:**
- Update phone numbers to GreenPromo contacts
- Update email to GreenPromo email
- Update WhatsApp number
- Keep same contact structure

---

### Request Modal (ID: "request") - MAJOR OVERHAUL

#### Modal Heading
**Lines:** 916
**Current:** `Request a Quote`
**Should Be:** `Get a Product Quote` or `Create Your Order`

#### Modal Text
**Lines:** 917
**Current:** `Fill in the form and we will contact you within 24 hours.`
**Should Be:** `Tell us about your project and we'll provide a custom quote within 24 hours.`

#### Inquiry Type Toggle Section
**Lines:** 924-933 (RESTRUCTURE)**
**Current Options:**
- "I Need Staff" (Employer)
- "I'm Looking for Work" (Worker)

**Should Be:**
- "For Business" (B2B Corporate/Event)
- "For Personal Use" (B2C Retail)

**Label Changes:**
- "I Need Staff" → "Custom Corporate Order"
- "I'm Looking for Work" → "Personal/Small Order"

---

#### Employer Fields Section
**Lines:** 935-977
**Current Services Dropdown (Lines 938-950):**
- Hotel Staffing
- Business Staffing
- Factory Staffing
- International Staffing
- Recruitment & Executive Search
- Domestic Helper
- Professional Cleaning
- Nannies & Childcare
- Elderly Care
- Pet Care

**Should Be:** Product Categories
- Corporate Gift Program
- Event Merchandise
- Brand Campaign
- Uniform & Team Apparel
- Wholesale/Reseller
- Custom Apparel (T-Shirts, Hoodies, Polo)
- Accessories (Caps, Bags, etc)
- Drinkware & Mugs
- Personal/Custom Products
- Design Services

**Employment Type Dropdown (Lines 956-963):**
**Current Options:**
- Live-in
- Full-time (Live-out)
- Part-time
- Hourly
- One-time

**Should Be:** Order Type
- One-time Order
- Recurring Shipments
- Bulk/Volume Order
- Reseller/Wholesale
- Design Only

**Urgency Dropdown (Lines 967-974):**
**Current Options:**
- Immediately
- Within a week
- Within a month
- Within 3 months
- Just exploring

**Should Be:** Timeline
- ASAP (Rush Production)
- 1-2 weeks
- 2-4 weeks
- 4-8 weeks
- Just exploring/Planning

---

#### Worker Fields Section (Becomes Personal Shopper Section)
**Lines:** 979-1031 (RESTRUCTURE)**
**Current Label:** `Services of Interest`
**Should Be:** `Products of Interest`

**Current Checkboxes:**
- Hotel Staffing
- Business Staffing
- Factory Staffing
- International Recruitment
- Executive Search
- Domestic Helper
- Cleaning
- Childcare
- Elderly Care
- Pet Care

**Should Be:** Product Categories
- Custom T-Shirts & Apparel
- Caps & Hats
- Bags & Totes
- Drinkware & Mugs
- Corporate Gifts
- Event Merchandise
- Accessories
- Gift Bundles

**Work Type Dropdown (Line 998-1005):**
**Current:** Live-in, Full-time, Part-time, Hourly
**Should Be:** Product Type or Quantity
- Single Item
- Small Batch (5-25)
- Medium Order (25-100)
- Large/Bulk (100+)

**Experience Dropdown (Lines 1008-1017):**
**Current:** None, <1 year, 1-3 years, etc.
**Should Be:** Delete this field or change to Budget
- Under €100
- €100-500
- €500-2000
- €2000+
- Call for quote

**Availability Dropdown (Lines 1020-1028):**
**Current:** Immediately, 1-week, 1-month, 3-months, Flexible
**Should Be:** Delivery Timeline
- Express/ASAP
- 1-2 weeks
- 2-4 weeks
- 4-8 weeks
- Flexible

---

#### Standard Form Fields (Keep same structure)
**Lines:** 1033-1051
- Name
- Email
- Phone
- Notes

**Notes placeholder:** Change from `Describe your needs...` to `Describe your project, product preferences, quantities, and any special requirements...`

#### Form Submit Button
**Lines:** 1067-1073
**Current Text Options:**
- "Submit Inquiry" (Employer)
- "Submit Application" (Worker)

**Should Be:**
- "Submit Quote Request" (B2B)
- "Submit Order" (B2C)

---

## ACCESSIBILITY IMPROVEMENTS NEEDED

### Aria Labels
**Line:** 204
**Current:** `aria-label="Staffing Services"`
**Should Be:** `aria-label="Promotional Products Services"`

---

## SCRIPT REFERENCES

**Line:** 1078
- Keep: `<script src="js/script.js"></script>`
- Update: JavaScript should handle new form logic for products vs staffing

---

## SUMMARY OF MAJOR CHANGES

### Hero Section Slideshow Images
- **Replace ~20 images** from staffing/workers to product photography
- Include: t-shirts, caps, bags, drinkware, packaging, printing process, bulk displays

### Navigation Structure
- **Individuals** → Personal/Retail Products
- **Businesses** → Corporate Solutions
- **Specialties** → Product Categories or Design Options

### Services Grid (6 items each)
- **B2B:** Replace staffing services with corporate gift, event, campaign, uniform, wholesale, design
- **B2C:** Replace domestic services with apparel, accessories, drinkware, gifts, bundles

### Modals Content
- **About:** Change to company overview for promotional products business
- **B2C/Retail:** Product showcase with categories
- **B2B/Corporate:** Corporate solutions (gifts, events, campaigns, uniforms, wholesale)
- **Request Form:** Complete restructure for product orders vs staffing

### Footer
- **Column 1:** Corporate Solutions instead of Staffing
- **Column 2:** Product categories instead of Home Services
- **Contact:** Update phone, email, location

### Overall Tone
- Replace employment/staffing language with product/merchandise language
- Focus on design, customization, bulk production, fast delivery
- Emphasize corporate and event solutions for B2B
- Emphasize personalization and affordability for B2C

---

## ESTIMATED WORK BREAKDOWN

- **Meta tags & schema:** 15 minutes
- **Navigation updates:** 10 minutes
- **Hero imagery replacement:** 2-3 hours (if images available)
- **Copy updates:** 1-2 hours
- **Modal restructuring:** 2-3 hours
- **Form logic updates:** 1-2 hours
- **Testing & refinement:** 1 hour

**Total Estimated Time:** 8-12 hours (excluding new photography/imagery creation)
