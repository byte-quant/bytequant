# AdSense remediation — Stage 4 final acceptance report

Generated: 2026-08-09

## Final repository gate

| Measure | Verified |
| --- | ---: |
| Canonical indexable URLs | 1692 |
| Reciprocal hreflang links checked | 13788 |
| Valid JSON-LD blocks | 1700 |
| Visible FAQ schema entries | 5202 |
| Visible HowTo schema steps | 3836 |
| Canonical tools represented in llms.txt | 317 |
| Duplicate localized titles | 0 |
| Duplicate localized descriptions | 0 |

## Performance budgets (gzip)

The audit measures the current production export on every run. The report records stable acceptance thresholds so an allowlisted RSS refresh cannot make the checked-in evidence stale while the build remains within budget.

| Surface | Acceptance threshold |
| --- | ---: |
| Home HTML | <= 150,000 bytes |
| Representative tool HTML | <= 135,000 bytes |
| Initial home JavaScript | <= 390,000 bytes |
| Initial home CSS | <= 100,000 bytes |

## Applied final repairs

- Organization and WebSite identity markup is limited to the four home and four About pages instead of being repeated across the full catalog. Page-specific schema remains on every canonical URL.
- Hreflang clusters are checked for self references, x-default, and reciprocal return links across the complete sitemap.
- Security policy sources now agree on HSTS, COOP, CORP, permissions, content-type, framing, origin isolation, and cross-domain policy headers.
- The service-worker cache rule now targets the real /sw.js path. Fingerprinted assets receive immutable cache policy while HTML remains revalidated.
- A standards-based /.well-known/security.txt publishes the security contact, canonical record, languages, expiry, and policy location.
- The Pages artifact explicitly includes audited hidden paths, so /.well-known/security.txt and .nojekyll reach the deployed origin.
- Auto Ads remains a single owner-supplied bootstrap with no manual slots. The protected seller record and publisher identity are unchanged.

## Decision boundary

Repository acceptance: **PASS**. This is not an AdSense approval guarantee. Google-certified CMP publication, Policy Center status, Auto Ads preview/exclusions, Search Console canonical selection, traffic quality, and field Core Web Vitals remain account-side or real-user checks.
