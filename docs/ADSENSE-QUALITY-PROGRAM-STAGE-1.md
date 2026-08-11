# AdSense quality program — Stage 1

Generated: 2026-08-11

## Scope and decision boundary

This stage repairs repository-verifiable tool quality, routing, differentiation, and discoverability risks. It does not invent the private AdSense rejection message and does not promise approval; Google alone makes the account decision. The exact rejection wording remains owner-supplied evidence in `docs/ADSENSE-REJECTION-EVIDENCE.md`.

## Protected advertising identity

| Check | Verified value |
| --- | --- |
| Seller record | `google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0` |
| ads.txt SHA-256 | `615D7AEA69AFEECC9D6CBDBD5692DB5329EAD488C685CFD6E73F5A67F5EEBC61` |
| Auto Ads publisher | `ca-pub-4158794981134847` |
| Script loading | asynchronous, `afterInteractive` |

Both protected files are read-only inputs to this gate. Any byte-level seller-record change or exact script change fails the audit.

## Catalog quality evidence

| Measure | Result |
| --- | ---: |
| Canonical tools retained | 317 |
| Localized canonical pages retained and indexable | 1268 |
| Languages per tool | 4 |
| Tool-specific input/method/output/verification/boundary contracts | 1268 |
| Unmapped runtime families | 0 |
| Generic fallthrough for unknown tools | 0 — fail-closed |
| Same-category intent pairs above 0.68 similarity | 0 |

## Runtime family register

| Family | Canonical tools |
| --- | ---: |
| stageTwo | 8 |
| frontier | 75 |
| precision | 35 |
| essential | 19 |
| expansion | 55 |
| discovery | 10 |
| productivity | 26 |
| demand | 27 |
| growth | 9 |
| converter | 5 |
| new | 4 |
| specialized | 7 |
| advanced | 15 |
| generic | 22 |

## Repairs completed

- Runtime routing now has one explicit resolver. Only the 22 allowlisted legacy tools may use the generic processor; an unknown slug produces a localized visible error instead of plausible but unrelated output.
- All 317 tools are assigned to a real workbench family, and all 1,268 localized tool pages expose the `catalog-v2` quality contract while remaining indexable.
- The two closest prompt-tool intents were separated without deleting or hiding either page. Few-shot Dataset Coverage now audits input/output pairs, duplicate inputs, label distribution, and conflicting labels. Prompt Scenario Balance now requires a four-field test-pack contract and audits normal, boundary, negative, and adversarial coverage plus expected-output shapes.
- The new intent-similarity gate prevents a future catalog change from silently reintroducing near-duplicate same-category tools.

## Stage result

Repository-verifiable Stage 1 checks: **PASS**. AdSense account decision: **NOT GUARANTEED / GOOGLE REVIEW REQUIRED**.
