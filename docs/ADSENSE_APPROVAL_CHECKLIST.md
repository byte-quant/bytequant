# ByteQuant AdSense approval checklist

Last verified: 2026-08-09
Scope: four-language static site, 309 canonical tools, localized guides, legal/trust pages, Local Agent, Workstation, Community, and the finite Updates feed.

This checklist documents readiness; it is not a promise of approval. Google alone evaluates the account, site, traffic, live consent message, and policy status.

## Repository and live-site checks — PASS

- [x] The owner-supplied Auto Ads tag uses publisher `ca-pub-4158794981134847` once per page.
- [x] `/ads.txt` contains `google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0`.
- [x] Automated checks fail if the publisher identity or seller record changes.
- [x] The site contains no manual empty ad boxes or controls that imitate advertisements.
- [x] All 309 distinct tools remain indexable; 12 legacy aliases preserve old links and are excluded only to prevent duplicate indexing.
- [x] Every canonical tool has a working interface, example, error state, method, acceptance check, limits, FAQ, HowTo data, and an editorial guide route.
- [x] About, Contact, Privacy, Cookies, Terms, FAQ, Guides, and Publishing & Trust Standards are localized and reachable from the footer.
- [x] Publishing standards disclose ownership, production method, corrections, advertising independence, privacy boundaries, source selection, copyright, and AI assistance.
- [x] No placeholder, “under construction”, scraped article body, paid-ranking claim, or ad-click encouragement is published.
- [x] Community and third-party-source update surfaces contain no manual ad placement and remain listed for account-level Auto Ads exclusion.
- [x] Canonical, hreflang, sitemap, robots, JSON-LD, internal links, licenses, accessibility, and static output are release-gated.
- [x] The final release gate verifies every sitemap URL resolves to an indexable canonical page with `x-default`, a description, and valid JSON-LD.
- [x] The CI workflow runs content-value, editorial-depth, publisher-trust, tool-inventory, and final release-readiness audits before deployment.
- [x] Home HTML, referenced JavaScript, and CSS have compressed-size budgets to catch material performance regressions before deployment.
- [x] Stage 4 validates all 1,624 canonical URLs for unique localized metadata, exact canonical ownership, one main landmark and H1, self-referencing and reciprocal hreflang, x-default, page-visible FAQ/HowTo data, valid JSON-LD, and crawlable output.
- [x] Global Organization and WebSite identity markup is restricted to the four home and four About pages; each remaining canonical URL retains only schema that describes its visible page content.
- [x] The deployable hosting policy aligns CSP, HSTS, COOP, CORP, Permissions Policy, framing, MIME, origin isolation, service-worker revalidation, and immutable fingerprinted-asset caching.
- [x] `/.well-known/security.txt` publishes a canonical, expiring security contact record without adding a new indexable marketing page.

## 9 August 2026 official-policy cross-check

- Google’s current AdSense readiness guidance requires a live, crawler-accessible HTTPS site with enough unique content, useful navigation, and no policy violations. Repository audits verify the parts observable in source and generated HTML; the AdSense account remains the authority for review state.
- Google’s publisher guidance forbids ads that obscure content or sit so close to navigation, download, chat, or other action controls that accidental interaction becomes likely. Auto Ads preview and page exclusions therefore remain mandatory owner checks.
- Google Search requires each localized page to list itself and its alternates with return links. Stage 4 verifies these relationships across the full sitemap instead of checking only representative pages.
- Google’s structured-data policy requires markup to describe visible, relevant content and does not promise rich results. Stage 4 checks visible FAQ and HowTo correspondence and avoids invented reviews or ratings.
- Core Web Vitals remain field metrics evaluated at the 75th percentile. The good thresholds remain LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1; repository byte budgets cannot replace real-user data.

## Required AdSense account actions — OWNER

- [ ] Read the rejection email and **Policy center** entry; record the exact reason before requesting another review.
- [ ] Confirm `bytequant.org` shows the expected ownership/readiness state in **AdSense → Sites**.
- [ ] In **Privacy & messaging**, publish a Google-certified CMP using the current IAB TCF requirement for the EEA, UK, and Switzerland.
- [ ] Test accept, reject, withdraw, and regional behavior on the live domain. ByteQuant’s local-personalization dialog is not advertising consent.
- [ ] In **Ads → By site → ByteQuant**, exclude Local Agent, Workstation, Community, P2P, and Updates routes from Auto Ads.
- [ ] Review Auto Ads previews at 320, 375, 768, 1024, and 1440 CSS pixels. Block any placement that covers navigation, inputs, results, notices, or downloads.
- [ ] Check the Ad Experience Report, accidental-click distance, content-to-ad balance, Core Web Vitals, crawler access, and `/ads.txt` before resubmission.
- [ ] In Search Console, inspect the live homepage, one representative tool, one guide, and one Publishing Standards page; request indexing only if Google reports the selected canonical correctly.
- [ ] Record field Core Web Vitals at the 75th percentile. Target LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 on both mobile and desktop.
- [ ] Request review only after every account-side item above is complete.

## Resubmission evidence packet

Prepare this packet before clicking **Request review**. It makes the decision reproducible and prevents a second submission based only on visual impressions.

- The exact rejection reason copied from the AdSense email or Policy center, with the date and the remediation mapped to it.
- Screenshots showing the live Google-certified consent message in accept, reject, and withdrawal states for an EEA/UK/Switzerland test region.
- Auto Ads preview screenshots at 320, 375, 768, 1024, and 1440 CSS pixels, plus the account-level exclusions listed below.
- Live URLs and Search Console inspection results for the homepage, a tool, a guide, and a Publishing Standards page.
- A live `/ads.txt` response containing the expected seller record and a page-source check showing the expected publisher tag.
- The successful GitHub Actions run that executed every repository audit, together with the final release-readiness audit output.
- Field Core Web Vitals evidence when enough traffic exists. Laboratory measurements are useful for diagnosis but do not replace field data.
- A manual navigation pass confirming that legal/trust pages, contact and corrections, examples, tool limitations, and source links are readable without interacting with an advertisement.

Repository checks establish technical readiness only. They cannot see the AdSense Policy center, consent configuration, Auto Ads preview, Search Console selection, traffic quality, or Google's final review decision.

## Hosting security-header boundary

The live GitHub Pages response supplies HTTPS and HSTS but does not apply repository-specific `_headers` rules. ByteQuant therefore also publishes an enforcing CSP meta policy and a referrer-policy meta fallback in the document head. Response-only protections such as `frame-ancestors`, `X-Content-Type-Options`, COOP, and Permissions Policy require a hosting edge that supports custom response headers; the checked-in `_headers` file and worker policy are ready for such a deployment. Revalidate AdSense, PWA, WebRTC, and all four locales before moving the public custom domain. This infrastructure limitation is not represented as an AdSense approval failure, but it must not be described as a live response-header pass.

## Recommended Auto Ads page exclusions

`/ajan/`, `/en/agent/`, `/de/agent/`, `/zh/agent/`

`/is-istasyonu/`, `/en/workstation/`, `/de/workstation/`, `/zh/workstation/`

`/topluluk/`, `/en/community/`, `/de/community/`, `/zh/community/`

`/guncel/`, `/en/updates/`, `/de/updates/`, `/zh/updates/`

Also exclude any transient workspace or peer-connection URL shown in the account preview.

## Release commands

`pnpm lint`

`pnpm test`

`pnpm build`

`pnpm audit:static`

`pnpm audit:adsense`

`pnpm audit:content`

`pnpm audit:editorial`

`pnpm audit:trust`

`pnpm audit:inventory`

`pnpm audit:stage4`

`pnpm audit:release`

`pnpm audit:licenses`

`pnpm build:sites`

## Primary references

- https://support.google.com/publisherpolicies/answer/10502938
- https://support.google.com/adsense/answer/81904
- https://support.google.com/publisherpolicies/answer/10437795
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://policies.google.com/technologies/partner-sites
