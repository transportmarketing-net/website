# RedStar website, session state

Updated 13 November 2026.

## Project and local preview

- Location: `/home/alexandroskourtis/work/transportmarketing.net/redstar`.
- Git root: parent `transportmarketing.net`, branch `main`. At session start,
  Git reported the checkout 56 commits behind its locally recorded upstream.
  No fetch, pull, commit, push or deployment was performed.
- Static HTML/CSS/JavaScript marketing website, originally mirrored from SitePad.
  No npm build or database is needed to serve it.
- The CRM mentioned in some conversations is a separate Laravel project at
  `/home/alexandroskourtis/work/redstar`. Do not confuse the two directories.
- Start with `./serve-local.sh`, open `http://localhost:8045/redstar/`.
  An optional first argument changes the port. The server binds to loopback.
- `scripts/serve-local.py` serves from the monorepo root so `/redstar/` paths work.
  It assigns correct MIME types to mirrored filenames containing literal
  `?ver=...` suffixes. Apache `.htaccess` redirects are not emulated.

## Sources and generation

- `index.html`: manually maintained legacy homepage with inline styles/scripts.
  The generator refreshes its named payment, enquiry and featured-project sections,
  preserving the rest.
- `assets/css/redstar.css`, `assets/js/redstar.js`: shared inner-page styling
  and interactions. The homepage also uses the shared consent logic.
- `scripts/rebuild-site.mjs`: generates service pages, portfolio, blog, about,
  contact, 404, sitemap and Apache configuration. Run from this directory.
- `sitepad-data/portfolio-projects.json`: portfolio content.
- `blog/*/index.html`: article sources and generated article pages. The builder
  discovers article directories, extracts their content and rebuilds the index.
- `terms/`, `privacy/`, `cookies/`, and their equivalents under `en/`:
  maintained HTML pages, excluded from generator overwrites.
- `tokens/consent.json`: consent banner tokens. Build with
  `node scripts/build_tokens.mjs --in tokens/consent.json --out assets/css/consent-tokens.css`.
  `assets/css/consent.css` consumes the generated variables on both page types.

## Recovered Claude conversation

Read local Claude JSONL transcripts for this exact project and distinguished
website tasks from later CRM conversations recorded in the same history folder.
Relevant website sessions:

- `f1dc48b5-a0ae-4d4c-8c53-97f55c78cc75`: marketplace/profile work, request to
  document profiles, local preview, then removal of homepage pricing on 8 November.
- `b5fd6993-002a-4a56-993f-ea03d4cc64b8`: six Greek/English legal pages added
  on 8 November. Left English banner translation and homepage analytics consent
  as explicit follow-ups.

Conversation records are under
`~/.claude/projects/-home-alexandroskourtis-work-transportmarketing-net-redstar/`.
They may contain sensitive data; avoid dumping raw transcripts or credentials.

## Completed in this continuation

- Preserved the removed homepage pricing section and existing local changes.
- Removed unconditional homepage GA4 loading. Analytics now starts only after
  acceptance, using the same consent choice across the homepage and inner pages.
- Translated the cookie banners on all three English legal pages.
- Fixed CSS overriding the banner's `hidden` attribute after dismissal.
- Handled blocked localStorage and invalid saved choices without breaking scripts
  or enabling analytics automatically.
- Added shared responsive consent styling, with room above the homepage mobile
  booking bar, and a local browser regression check.
- Fixed homepage jQuery loading order and the preview server's asset MIME types.
- Protected all six manually updated legal pages from obsolete generator content.
- Added English legal pages to the sitemap and generator route list.
- Repaired 50 article links that incorrectly targeted `/article-slug` at the
  domain root. Known article links now resolve under `/redstar/blog/`; the
  generator applies the same correction on future rebuilds.
- Wrapped Greek/English cookie-policy tables in keyboard-accessible scroll
  regions to keep narrow layouts within the viewport.
- Added the user-supplied Eurobank IBAN `GR8202600450000960201687094` to Contact
  under `#payment-details`, with exact-value copying, copy feedback and manual
  fallback when clipboard access is unavailable. Format/checksum validation
  passed; this does not verify account ownership or business-account status.
  Source: `sitepad-data/payment-details.json`; template:
  `scripts/payment-details.mjs`, included by the site generator. The homepage
  footer links to these details. No bank transaction was initiated.
- Read the separate CRM's payment code: Stripe Checkout handles one-off and
  subscription payments; Viva Smart Checkout handles one-off payment orders.
  PayPal in the payment-method enum is only a recording category, not evidence
  of an integrated PayPal checkout. Merchant-enabled wallets/IRIS were not verified
  and are not displayed as accepted methods.
- Added `#payment-methods` to the homepage/footer area and Contact: Stripe artwork,
  a Viva.com text label, and Visa/Mastercard logos alongside the Eurobank transfer
  link. Local brand files and source hashes are in `assets/images/payments/`.
  `sitepad-data/payment-details.json` supplies the gateways/card brands;
  `scripts/payment-details.mjs` renders the section. Token source:
  `tokens/payments.json`; build with `node scripts/build_tokens.mjs --in
  tokens/payments.json --out assets/css/payment-tokens.css`.

## Marketplace/profile inventory

Historical account information recovered from the 8 November conversation and
global project notes, not reverified against live services in this session:

| Service | Account/page | Recorded state |
| --- | --- | --- |
| Facebook | `facebook.com/redstardigital` | Page configured; posts pending |
| Partnely | `partnely.com/en/account/profile` | Profile submitted; review pending |
| Freelancer.com | `@akourtis98` | Profile updated; portfolio items pending |
| Upwork | `@alexandroskourtis` | Profile/tax setup discussed; current status unverified |
| Fiverr | `@akourtisdev` | Client account configured; seller gigs not created |
| CanHelp | `canhelp.gr/en/profile` | Account created; configuration pending |

`FIVERR_DEVELOPER_SETUP_GUIDE.md` contains the earlier gig setup draft. Do not
treat historical rates, tax advice or platform requirements as current facts.

## Verification and limits

All checks used local hardware; analytics requests were intercepted in browser
tests, with no analytics events sent. No hosted CI was started.

- Consent browser regression: 13/13 scenarios passed, including first visit,
  rejection and persistence on seven pages, keyboard acceptance, cross-page
  persistence, existing/invalid choices, and blocked storage.
- Browser smoke: 13 representative routes returned HTTP 200 with no JavaScript
  page errors after correcting the homepage scripts.
- All 88 HTML pages returned HTTP 200; static href/src targets had zero missing
  local files after article-link repairs.
- Consent-only state contrast: 9/9 element states passed the local gate across
  default, hover and focus. English Terms and Cookies each returned zero axe
  violations. These limited checks do not establish whole-site accessibility.
- Mobile menu interaction: opening changed state, Escape closed it and restored
  focus to the menu button on English Terms.
- Responsive browser sweep: all 21 combinations of the homepage/six legal pages
  at 280/320/414px passed document-overflow, banner-overflow and button-boundary
  checks after the table fix. Fresh screenshots of the homepage and English
  banner were inspected in `/tmp/redstar-resume-mobile.png` and
  `/tmp/redstar-resume-english.png`.
- Isolated generator rebuild: homepage and six legal files remained byte-identical;
  English sitemap routes and corrected article links survived generation.
- New consent tokens validated; consent stylesheet passed the hardcode linter.
- The bundled generic `accuracy_report.mjs` reported **7/37**. It targets absent
  `examples/`, `evals/` and template fixtures from the copied design kit, and also
  reports existing theme-reference issues. This is not a passing website gate.
- Whole-page state-contrast tooling reports six findings on English Terms:
  the textless menu scrim and the language link over a hero background image.
  Its solid-background calculation does not sample that image. Do not report a
  whole-site accessibility pass from the individual checks.
- The earlier homepage quote stub has now been removed. The Contact form saves
  enquiries through the CRM API described below.
- Legal text retains its existing draft/review notices; no new legal assessment
  or live platform research was undertaken here.
- Eurobank addition: exact clipboard value and denied-permission fallback checked
  in local Chrome; Contact passed overflow checks at 280/320/414px and axe reported
  zero violations. An isolated rebuild retained the account. Consent regression
  still passed 13/13. The generic design-kit gate was rerun and remains 7/37.
- Payment-strip checks: all three local logo images loaded; bank-details navigation
  was clicked successfully. Homepage/Contact each passed 280/320/414px overflow
  checks, the strip's link passed 3/3 default/hover/focus contrast states, and
  Contact returned zero axe violations. Desktop/mobile screenshots were inspected.
  The isolated rebuild retained the strip and account without changing the rest
  of the homepage. The generic kit gate was attempted again, then interrupted
  after repeated missing-example fixture failures/timeouts; its last completed
  result remains the earlier 7/37, not a current passing gate.

## Implemented banner and quote-request plan

The user approved website banners with all three contact choices. Implemented:

- HelpPoint feature immediately after the homepage portfolio, using its existing
  screenshot and recorded project summary, without invented metrics.
- A shared enquiry banner on the homepage and existing inner-page banner slots:
  calendar booking is primary, a quote request is secondary, WhatsApp is a text link.
- The payment strip remains on the homepage and Contact, with the existing card
  artwork, provider labels and Eurobank details.
- An inline Contact form at `#quote-request`, with required name/phone and optional
  email, service and project description. Service links prefill the service; native
  labels, field errors, loading, failure, retry and saved states are implemented.
- Removed the homepage's unused quote modal, its CSS and fake-success handler.

`scripts/banners.mjs` is the shared renderer; `assets/css/banners.css` consumes
`tokens/banners.json` through generated `assets/css/banner-tokens.css`. Rebuild
tokens with `node scripts/build_tokens.mjs --in tokens/banners.json --out
assets/css/banner-tokens.css`. Use `node scripts/refresh-banners.mjs` for targeted
slot refreshes. The full site builder also includes the components.

### Quote API and safe local preview

The separate CRM now implements `POST /api/public/quote-requests`. It creates a
website-sourced lead without overwriting existing customers; a unique submission
UUID prevents duplicate records/notifications on retries. Database notifications
are committed with the lead, and an admin email is queued after saving. Queue
failure retains the enquiry. Input validation, a honeypot, exact-origin CORS and
five requests per IP/hour protect the public endpoint; no frontend secrets are used.

The new API needs two additive migrations: a nullable unique client submission ID
and the previously missing notifications table. Filament's notification bell is
enabled. The existing CRM database was not migrated or seeded during verification.

Start the website with `./serve-local.sh`. Start the safe API separately:

```sh
cd /home/alexandroskourtis/work/redstar
./scripts/serve-quotes-local.sh > /tmp/redstar-quote-preview.log 2>&1
```

The API runs at loopback port 8046 with a fresh `/tmp/redstar-quotes-*` SQLite
database, fake array mail transport and a synthetic preview admin. The browser
uses this API automatically on localhost/127.0.0.1; production uses the CRM domain.
The API and migrations must be deployed before publishing the static form in a
separately authorized release. No production deployment, real mail or hosted CI
was performed. Backend details are in the CRM's `docs/public-quote-requests.md`.

### Current validation, distinct from historical checks above

- CRM: **157 tests passed, 412 assertions**; Pint passed. Three stale baseline
  test assumptions were corrected for the admin redirect, Viva verification route
  and isolated demo environment. Provider production settings were not changed.
- Browser flow: 15 normal-width layouts, five inner-page banners, field validation,
  loading, server failure, throttling, network failure, real local persistence and
  idempotent retry. The booking and WhatsApp popups were intercepted locally;
  quote navigation/submission also worked by keyboard. No real outbound messages.
- Homepage and Contact also passed 280/320/414px checks at a 1.25x root font.
  Contact's axe scan reported zero violations. Consent regression passed 13/13.
- Scoped component harness: 39 element states passed in default/hover/focus,
  repeated with the dark attribute; target-size and reduced-motion checks passed.
  Real-image desktop/mobile screenshots and form error/loading/saved states were
  inspected. Functional sweeps suppress image loading, disable browser back/forward
  caching and use fresh pages. Earlier runs hit the shared `/tmp` quota (including
  screenshot write error EDQUOT); the final run passed with browser temporary files
  on the existing home drive, without changing quotas or deleting other work:
  `TMPDIR=/home/alexandroskourtis/.cache/redstar-browser-checks node scripts/verify-banners.mjs`.
- All 88 HTML pages returned HTTP 200 with no missing local href/src targets.
- Targeted refresh is idempotent. Full isolated rebuild retained the form, service
  context and bank details. The homepage matched the pre-change snapshot plus
  only approved slots/removal, and all six maintained legal files stayed byte-identical.
- The generic copied design-kit gate now **fails fast** on missing fixture paths,
  rather than timing out or accidentally auditing a blank page. Its completed
  current result is **6/37**, with missing examples/evals/templates and existing
  theme-reference issues. This is not a passing website-quality score.
- Heuristic taste tools flagged uniform 8px radii in the isolated harness; that
  existing brand choice was retained. No numerical aesthetic quality is claimed.


## Authorized release, 14 November 2026

User requested push and deployment of the pending website work and its quote API
prerequisite. Reconciled in an isolated checkout on top of upstream 387f915,
retaining all upstream-only routes and assets. The original dirty checkout was
preserved. The published homepage is the locally maintained homepage described
above. Upstream-only service pages retain their supporting upstream CSS/JS under
separate filenames. Three newer articles were normalized through the builder;
the merged blog index and sitemap retain their routes. Repaired ten broken links
from those articles and made article comparison tables scroll at narrow widths.

CRM commits 22efdab and 351cebe deployed through the existing Forge hook. The
initial deployment stopped because notifications already existed; the follow-up
migration validates/reuses that table and preserves notifications on rollback.
The old release stayed active until the successful replacement. Both additive
migrations are now recorded and redstar-queue is running. Live OPTIONS returned
204 with the expected exact origin; an empty JSON POST returned 422 without
creating an enquiry or sending mail. Full persistence and mail queue behavior
were verified only with isolated local data/fake delivery.

Current local checks: 158 CRM tests, 415 assertions; Pint passed. Consent 13/13;
quote regression passed 15 layouts, five banners, error/loading/saved/retry states,
with one isolated lead and notification. All 98 merged HTML pages returned 200
and local href/src validation found no missing files. The generic copied-kit
accuracy report returned 5/37, including absent fixture/template paths and
existing theme-reference/instruction-surface issues; it is not a passing site
quality score. No full-site accessibility or aesthetic pass is claimed.

The Pages workflow now requires [self-hosted, linux, x64, redstar-local], matching
the standing free-local-hardware policy. This release uses an ephemeral runner
on the existing workstation, without hosted runner jobs or billing changes.
Future deployments need a runner with that label online. Public artifacts exclude
internal scripts, Markdown documents, dependencies, source mirrors and Git data.
Release checkout: /home/alexandroskourtis/.cache/redstar-release-20261114.

Final artifact verification also passed for all 98 pages after adding canonical
JavaScript filenames for four mirrored files with literal ?ver suffixes. Those
old names were excluded by the Pages extension allowlist; the first publish was
cancelled before deployment and replaced with the corrected artifact. Final
browser layout smoke passed 32 desktop/mobile combinations. The article table
fix is retained by the generator.


## Featured project expansion, 14 November 2026

Implemented the approved twelve-project feature plan in this release checkout;
the original dirty worktree remains intact. Added ten records, updated the existing
SASS/ST.RIVE records, and retained all other projects: 25 total. The homepage and
portfolio share the order HotelSystem, GreenPromo, BlueLine, Dr. Matzoukas,
Universe, SASS, ST.RIVE, Cycle Box, Pilates Box, VlachosTax, Management Services
Buildings, Fortistis, followed by the thirteen other projects. HotelSystem links
to the requested hotelssystem.net domain, including its double s.

Captured twelve live public sites with local Playwright/Chrome, without account
sessions or form submissions. Universe matches the supplied campus-community
section; Fortistis uses the public ?theme=light option and product grid. The
other ten captures show their homepages; the SASS welcome page is public. ST.RIVE's
optional analytics banner was dismissed using its native continue-without-analytics
control. Original 1440x900 PNGs live in ~/.cache/redstar-portfolio-captures; 24 WebP
variants at 720/1440px total roughly 1 MB. Provenance, viewport, timestamp and
SHA-256 values are in sitepad-data/portfolio-captures.json.

The shared scripts/portfolio.mjs renderer gives cards separate project-detail and
live-site links without nested anchors. The new tokenized stylesheet is scoped
to portfolio cards; the homepage stylesheet link sits inside its existing marked
portfolio boundary. Filter buttons now expose aria-pressed. All 25 detail pages
use the canonical portfolio routes; no new blog copies were generated.

The builder's --portfolio-only mode preserves unrelated pages and merges new
sitemap URLs without dropping upstream routes. The full builder uses the same
renderer and also retains existing sitemap routes. Tested repeat generation of
all 25 details plus homepage/index/sitemap: byte-identical. The six legal pages
and homepage outside the portfolio boundary match their previous committed bytes.

Current local verification: 70 layouts at 280/320/414/768/1440px across the homepage,
portfolio and twelve featured details; 50 card images loaded; 30 text states
(default/hover/focus); carousel arrows and traversal; keyboard navigation and
intercepted live-tab opening; filters with 16 websites, 3 e-shops and 6 applications.
No JavaScript page errors. Scoped axe scans of the homepage portfolio and listing
grid found zero violations. Consent passed 13/13. All 108 HTML pages returned 200
and had no missing local href/src targets. New tokens validated, new CSS passed
the hardcode check, and generated text passed git diff --check. The copied generic
accuracy report remains 5/37 on missing kit fixtures and existing issues; this is
not a whole-site accessibility/quality pass. Real desktop views, all twelve source
captures and the updated ST.RIVE capture were inspected.

Release continues to use only the existing local ephemeral runner with label
redstar-local; no hosted runner or billing changes are authorized. No backend or
database changes belong to this portfolio release.
