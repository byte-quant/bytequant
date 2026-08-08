# AdSense rejection evidence record

This file separates owner-only account evidence from repository-verifiable facts. It prevents ByteQuant from guessing a rejection reason or claiming that approval is guaranteed.

## Owner evidence required before AdSense resubmission

Copy the exact text shown in AdSense → Sites → ByteQuant → policy/status details. Do not paraphrase it and do not include account email, payment data, identity documents, or screenshots containing private identifiers.

- Decision date: **not supplied**
- Exact reason heading: **not supplied**
- Exact explanatory text: **not supplied**
- Affected URL example, if Google provides one: **not supplied**
- Whether Google requests a review after changes: **not supplied**

## Repository facts verified across Stages 1–4

- 309 canonical tools remain public and indexable in Turkish, English, German, and Simplified Chinese.
- The production export contains 1,236 canonical localized tool pages with WebApplication, HowTo, and FAQ structured data.
- 110 high-risk tools complete 440 executable localized demo runs with unique, measurable output.
- ByteQuant does not publish manual imitation ad boxes; the owner-provided Auto Ads tag remains in place.
- `public/ads.txt` and the publisher identity are protected by exact-content and SHA-256 audit gates.
- All canonical URLs are checked for indexability, self-canonical metadata, reciprocal four-language hreflang links, `x-default`, useful titles and descriptions, visible HowTo/FAQ content, and parseable JSON-LD.
- Organization/WebSite identity schema is limited to the four home pages and four About pages instead of being repeated on every tool and article URL.
- The final release gate checks crawl files, RSS feeds, PWA assets, security contact metadata, cache policy, compressed asset budgets, licenses, and the production export before deployment.

## Triage mapping after the exact reason is supplied

| Account wording | Evidence to inspect | Planned stage |
| --- | --- | --- |
| Low value / little or no original content | Tool-specific methods, examples, acceptance criteria, editorial depth, repeated copy | Repository evidence: Stages 1–4; compare with the exact account notice |
| Navigation / user experience | Tool input UX, mobile layouts, Agent, Workstation, Community, Updates | Repository evidence: Stages 2–4; verify representative live journeys |
| Policy / privacy / consent | Privacy disclosures, CMP configuration, ad separation, prohibited content | Repository evidence: Stage 4; owner must also verify AdSense account/CMP configuration |
| Site unavailable / code missing | Live reachability, HTTPS, Auto Ads tag, ads.txt, deployment history | Repository evidence: Stages 1 and 4; verify the deployed origin immediately before resubmission |
| Unsupported language / localization | Language routing, hreflang, localized content and UI | Repository evidence: Stages 1–4; compare with Search Console indexing data |

The repository cannot infer the rejection reason from a generic rejection notice. The exact account wording and any affected URL examples remain owner-supplied evidence. An audit pass is evidence of implementation quality, not a guarantee of acceptance. Google retains the final review decision.
