# AdSense closure plan — Stage 2 report

Generated: 2026-08-09

## Scope closed

Stage 2 closes the browser-product experience: installability, Local Agent handoff, Workstation navigation, Community consent boundaries, official-source Updates, and responsive access to primary actions. It does not claim or guarantee AdSense approval; Google alone reviews and decides the application.

## Protected advertising identity

| Check | Verified value |
| --- | --- |
| Seller record | `google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0` |
| ads.txt SHA-256 | `615D7AEA69AFEECC9D6CBDBD5692DB5329EAD488C685CFD6E73F5A67F5EEBC61` |
| Auto Ads publisher | `ca-pub-4158794981134847` |

The audit fails immediately if any protected value changes.

## Measured evidence

| Measure | Result |
| --- | ---: |
| Indexable localized product surfaces inspected | 20 |
| Official-source update records checked for navigation boilerplate | 72 |
| PWA install calls presented in the homepage install card | 1 |
| Local Agent handoff paths verified | 2 |
| Workstation navigation primitives verified | 4 |
| Desktop/mobile live browser surfaces exercised | 5 |

## Product repairs

- The PWA card no longer repeats the same manual-install action three times. Native install and browser-guide modes now use distinct, honest labels; the compact header control follows the same state.
- The install guide associates its description with the dialog, moves focus to a close control, restores focus, and supports Escape dismissal.
- Local Agent was exercised with a synthetic bill-splitting request: it selected the correct tool, extracted subtotal/tip/people fields, and exposed both prepared-tool and Workstation handoffs.
- Workstation easy/advanced modes, starter templates, canvas controls, node ports, inspector, undo/redo surface, and run-in-tool links were exercised without changing tool cores.
- Community keeps relay access opt-in, states the relay/IP boundary before connection, exposes read-only sample content while disconnected, and leaves local/P2P areas separate.
- Updates now reject feed navigation boilerplate both during sync and at render time. Sharing and Community quoting use the same sanitized summary.
- GitHub health text no longer pretends that a hard-coded calendar date is live; it accurately states that verification runs on each main-branch update.

## Browser acceptance evidence

- Desktop: homepage, Local Agent, Workstation, Community, and Updates were opened in the in-app browser.
- Mobile 390×844: header menu, Agent prepared-input actions, Workstation canvas navigation, Community connection/profile controls, and Updates summary/share controls remained reachable.
- No relay connection, public post, or other external side effect was created during QA.

## Gate result

Stage 2 repository, static-export, and browser-product checks: **PASS**. Account-side Policy Center wording remains owner evidence and cannot be inferred from code.
