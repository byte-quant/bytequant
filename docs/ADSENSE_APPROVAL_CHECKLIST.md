# ByteQuant AdSense approval checklist

Last verified: 2026-08-08
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

## Required AdSense account actions — OWNER

- [ ] Read the rejection email and **Policy center** entry; record the exact reason before requesting another review.
- [ ] Confirm `bytequant.org` shows the expected ownership/readiness state in **AdSense → Sites**.
- [ ] In **Privacy & messaging**, publish a Google-certified CMP using the current IAB TCF requirement for the EEA, UK, and Switzerland.
- [ ] Test accept, reject, withdraw, and regional behavior on the live domain. ByteQuant’s local-personalization dialog is not advertising consent.
- [ ] In **Ads → By site → ByteQuant**, exclude Local Agent, Workstation, Community, P2P, and Updates routes from Auto Ads.
- [ ] Review Auto Ads previews at 320, 375, 768, 1024, and 1440 CSS pixels. Block any placement that covers navigation, inputs, results, notices, or downloads.
- [ ] Check the Ad Experience Report, accidental-click distance, content-to-ad balance, Core Web Vitals, crawler access, and `/ads.txt` before resubmission.
- [ ] Request review only after every account-side item above is complete.

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

`pnpm audit:licenses`

`pnpm build:sites`

## Primary references

- https://support.google.com/publisherpolicies/answer/10502938
- https://support.google.com/adsense/answer/81904
- https://support.google.com/publisherpolicies/answer/10437795
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://policies.google.com/technologies/partner-sites
