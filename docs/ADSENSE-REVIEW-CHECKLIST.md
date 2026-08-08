# ByteQuant AdSense review checklist

Last verified: 2026-08-08

This document separates repository checks from account-side controls. Passing the repository checks improves readiness but cannot guarantee Google approval.

## Locked publisher identity

- [x] Auto Ads script loads once with publisher `ca-pub-4158794981134847`.
- [x] `public/ads.txt` contains `google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0`.
- [x] Automated audits fail if either value changes.
- [x] No manual ad placeholders compete with Auto Ads.

## Publisher-content quality

- [x] All 309 distinct public tools remain indexable and are included in the sitemap.
- [x] Twelve legacy alias URLs preserve old links, point to the canonical tool, and remain `noindex` to prevent duplicate indexing.
- [x] Every tool page discloses its method, acceptance check, limitations, local-processing behavior, and publication status.
- [x] Community and official-source update landing pages are indexable editorial entry points; their dynamic surfaces remain listed for account-level Auto Ads exclusion.
- [x] About, contact, privacy, cookies, terms, FAQ, guides, and editorial ownership remain visible in navigation and the sitemap.
- [x] No placeholder, “under construction”, scraped article body, or ad-click encouragement is published.

## Required AdSense account actions

- [ ] In **Privacy & messaging**, publish a Google-certified IAB TCF CMP for the EEA, UK, and Switzerland. The ByteQuant local-preferences dialog is not advertising consent.
- [ ] In **Ads → By site → ByteQuant → Excluded areas/pages**, exclude `/topluluk/`, `/en/community/`, `/de/community/`, `/zh/community/`, `/guncel/`, `/en/updates/`, `/de/updates/`, `/zh/updates/`, and `/workspace/` from Auto Ads.
- [ ] Inspect the Auto Ads preview at desktop and mobile widths; block placements that obscure navigation, tool inputs, result controls, legal notices, or download buttons.
- [ ] Check **Policy center** and the rejection email for the exact reason before requesting another review.
- [ ] Confirm the live `/ads.txt` response and site ownership inside AdSense.

## Release gate

Run `pnpm run lint`, `pnpm run test`, `pnpm run build`, `pnpm run audit:static`, `pnpm run audit:adsense`, `pnpm run audit:content`, `pnpm run audit:licenses`, and `pnpm run build:sites`. A release is not ready if any command fails.

Official references:

- https://support.google.com/adsense/answer/7299563
- https://support.google.com/publisherpolicies/answer/11112688
- https://support.google.com/publisherpolicies/answer/11190248
- https://support.google.com/adsense/answer/13554116
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
