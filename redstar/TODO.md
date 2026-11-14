# RedStar continuation

Updated 13 November 2026. Read `CONTEXT.md` for recovered history and local checks.

## Finished

- [x] Recover the relevant Claude website conversation and distinguish the CRM.
- [x] Serve the website locally at `http://localhost:8045/redstar/`.
- [x] Keep homepage pricing removed.
- [x] Finish homepage analytics consent and English cookie banner follow-ups.
- [x] Keep rejected/dismissed banners hidden and handle blocked storage.
- [x] Protect the six bilingual legal pages from generator overwrites.
- [x] Include English legal pages in the sitemap.
- [x] Repair the 50 broken internal article links and preserve fixes on rebuild.
- [x] Fix narrow cookie-policy table layouts; check 21 mobile page/width combinations.
- [x] Add the supplied Eurobank account to Contact, with IBAN copying and a homepage footer link.
- [x] Add a visible payment strip: Stripe, Viva.com, Visa and Mastercard; retain it on rebuild.
- [x] Implement payment, HelpPoint feature and enquiry banners with booking, quote and WhatsApp actions.
- [x] Replace the homepage fake-success modal with the working Contact quote form and CRM intake API.
- [x] Add duplicate protection, spam controls, admin notifications and queued mail; verify using fake delivery.
- [x] Record historical marketplace/profile inventory locally.

## Remaining work requiring its own scope

- Before adding Apple Pay, Google Pay, PayPal or IRIS acceptance logos, verify
  their availability on the actual merchant accounts. The current strip shows
  the integrated gateways, common card brands and the supplied Eurobank details.
- A separately authorized release must deploy the CRM quote API and additive
  migrations before the website form, with the correct origins and queue worker.
  The current preview uses a disposable local database and fake mail only.
- CanHelp profile configuration, Freelancer portfolio items, Fiverr seller gigs,
  and Facebook posts were pending in historical notes. Current statuses unverified.
- Before publishing legal drafts, complete the review already requested in their
  existing notices. The current session changed consent behavior, not legal copy.
- Resolve the generic design-kit gate's missing fixtures/theme-reference issues
  if that kit is to remain the project's full validation system.
- Review upstream changes in an isolated checkout before reconciling this dirty
  monorepo. Do not pull over the existing local website work.
- Audit automatic workflow triggers and use free local checks before any future
  authorized push/deployment. No production changes were made here.


## Release update, 14 November 2026

- [x] Reconcile upstream in an isolated checkout, preserving the original files.
- [x] Deploy the CRM quote API and additive migrations before publishing the form.
- [x] Confirm production CORS, validation and the running queue worker without a real enquiry.
- [x] Replace hosted Pages runner targeting with the required local runner label.
- [x] Run current local regression and merged-page/link verification.
- Future pushes require an online local runner labelled `redstar-local`.
- Generic kit fixture/theme issues and existing legal review notices remain as above.


## Featured portfolio, 14 November 2026

- [x] Add ten projects and refresh SASS/ST.RIVE, twelve featured and 25 total.
- [x] Capture all twelve public sites, matching the supplied Universe/Fortistis views.
- [x] Add responsive WebP images, provenance, detail pages and direct live links.
- [x] Share homepage/listing generation and retain upstream sitemap routes.
- [x] Verify 70 layouts, images, keyboard/live links, filters, contrast and consent locally.
- [x] Preserve the six legal pages and homepage outside the portfolio section.
- Publish through the established local runner and verify the exact live artifact.
