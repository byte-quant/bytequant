# AdSense remediation — Stage 1 quality report

Generated: 2026-08-09

## Decision boundary

This report does not invent an AdSense rejection reason. The exact Policy Center message is account-only evidence and must be copied verbatim into `docs/ADSENSE-REJECTION-EVIDENCE.md` by the site owner. Stage 1 therefore verifies every condition that can be proven from the repository and production export, while leaving account-side evidence explicitly unresolved.

## Protected advertising identity

| Check | Result |
| --- | --- |
| Seller record | `google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0` |
| ads.txt SHA-256 | `615D7AEA69AFEECC9D6CBDBD5692DB5329EAD488C685CFD6E73F5A67F5EEBC61` |
| Auto Ads publisher | `ca-pub-4158794981134847` |
| Script strategy | asynchronous, `afterInteractive` |

The audit fails immediately if the seller record, hash, publisher ID, or exact Auto Ads script changes.

## Evidence matrix

| Measure | Verified |
| --- | ---: |
| Canonical public tools | 327 |
| Canonical localized tool pages kept indexable | 1308 |
| Unique localized titles, summaries, and descriptions | 327 × 4 |
| High-risk tools with executable demos | 110 |
| Successful four-locale runtime demo runs | 440 |
| Duplicate high-risk demo outputs | 0 |
| Tool pages with WebApplication + HowTo + FAQ structured data | 1308 |

## Repairs completed in Stage 1

- INI ↔ JSON and Properties ↔ JSON now publish measurable key/section/character results instead of an unmeasured text block.
- All 35 precision workbenches now explain the expected input structure beside the field, show a localized example signature, expose a visible ready/processing/completed/error state, and publish a Local Agent input/run contract.
- Precision errors now return actionable, fully localized JSON, table, numeric, date, key-value, or generic recovery guidance without mixing raw English into German, Chinese, or Turkish UI.
- All 327 canonical tools remain publicly indexable in four languages; Stage 1 introduces no blanket noindex or tool removal.

## Measured Stage 2 editorial backlog

Stage 2 follow-through is present: no canonical tools share an identical English use-case set or three-step set. The separate Stage 2 gate verifies all four locales and visible intent-specific page content.

## Gate result

Repository-verifiable Stage 1 checks: **PASS**. Account-side rejection wording: **OWNER EVIDENCE REQUIRED**. Passing this gate is not a promise of AdSense approval; Google alone decides approval after reviewing the live site and account.
