# ByteQuant

[![Website](https://img.shields.io/badge/website-bytequant.org-08747c)](https://bytequant.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Build and deploy](https://github.com/byte-quant/bytequant/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/byte-quant/bytequant/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-MIT-3657ff)](LICENSE)

ByteQuant is a privacy-first, installable web application containing 309 distinct browser-native tools plus twelve backward-compatible canonical aliases. It supports Turkish, English, German, and Simplified Chinese, produces a fully static Next.js export, and is designed for GitHub Pages.

**Live site:** [bytequant.org](https://bytequant.org)

## Product at a glance

- 309 distinct working tools across ten typed categories, with twelve established duplicate URLs preserved as `noindex, follow` canonical aliases so bookmarks and inbound links keep working
- Four localized home pages, tool catalogues, tool pages, legal/trust pages, FAQs, publishing standards, metadata, hreflang declarations, and JSON-LD
- 96 long-form editorial guides in Turkish and English, including 68 editorially localized German and Simplified Chinese workflow editions
- Installable Progressive Web App with same-origin application-shell caching and an explicit no-input-caching boundary
- Explainable Local Agent 4.2 with follow-up intent detection, contextual replies, visible specialist checks, outcome framing, multilingual semantic search, 20-turn same-tab context, low-confidence clarification, spoken responses, user-approved local execution, visible mini-flow diagrams, alternatives, plan self-review, and one-click Workstation handoff
- Lazy-loaded visual Workstation across all 309 distinct tools, with nineteen starter flows, a focus view, complex-flow navigator and health cues, Agent plan import, 40-step undo/redo, zoom/pan/minimap navigation, explicit tool handoff, encrypted IndexedDB projects, compressed recipe URLs, and manual WebRTC DataChannel rooms
- On-device PDF/image operations, Web Crypto utilities, bounded Worker-based scans, and no remote AI or malware-scanning API
- Related tools, smart next-tool handoff, before/after review, batch mode for common text/data tasks, consent-gated favorites and usage shortcuts, command palette, responsive layouts, and accessible operation-state UI
- Account-free Nostr community with device-encrypted identity, configurable public relays, global posts, replies, reactions, reposts, saves, profiles, source quotes, author-controlled edit/delete requests, local moderation controls, and a separate manually verified session-only P2P chat
- A finite updates feed generated at build time from allowlisted official NASA, NIST, CISA, GOV.UK, NSF, NIH, ESA, NCSC, and NOAA feeds; short attributed feed descriptions are shown with source links, reading state, and a one-click Community quote flow
- Static sitemap, robots directives, llms.txt, four-language metadata, RSS feeds, security policy, and GitHub Pages deployment

## Privacy and security model

Core tool operations run in the active browser tab. Tool input is not sent to a ByteQuant application server and is not persisted in localStorage.

The installable app's service worker caches only same-origin static resources and previously visited GET pages. It does **not** cache form input, selected files, passwords, generated output, POST data, or cross-origin resources.

Storage outside explicitly saved Workstation projects is limited to:

- bq-consent-v1: consent choice with a 180-day lifetime
- bq-theme: the user-selected theme
- bq-tool-usage-v1: optional, consent-gated tool slug/count/last-use data—never tool content
- bq-tool-favorites-v1: optional, consent-gated pinned tool IDs—never tool content
- bytequant:news-favorites:v1: update-card IDs explicitly saved on the current device—never article content
- bytequant:news-reviewed:v1: update-card IDs marked as reviewed on the current device
- bytequant:community-feed:v3 and bytequant:community-profile:v2: tab-scoped social-board state in sessionStorage; private posts are excluded from public links and exports

Workstation projects are opt-in and stay in the browser's `bytequant-workspaces` IndexedDB database. Project documents are encrypted with AES-GCM-256 and a non-extractable device key stored in the same database. This reduces exposure at rest but does not protect a compromised device, malicious extension, or hostile same-origin script. Tab handoffs use bounded sessionStorage records. Recipe URLs omit output and omit input by default.

Peer collaboration and session chat use only WebRTC DataChannel with manual offer/answer exchange and an empty ICE-server list. ByteQuant operates no signaling, STUN, TURN, account, presence, or message-storage service. Single-use codes expire after ten minutes. Live sharing and chat start paused and stay locked until both people compare the same DTLS-derived safety code through another trusted channel. The code is not real-world identity verification; connection codes can expose network candidates, NAT or firewall policy can prevent a connection, and chat history disappears when the session closes.

File, code, and URL security tools are deliberately framed as **heuristic pre-scans**:

- files are sampled but never executed or uploaded;
- code is scanned in a time-bounded Web Worker but is never executed;
- URLs are parsed as text without DNS, HTTP, reputation, or certificate requests.

These tools are not antivirus, a complete SAST platform, identity verification, legal compliance, or proof of safety. See [SECURITY.md](SECURITY.md) for reporting and trust boundaries.

## Architecture

~~~text
Next.js App Router (static export)
├─ Locale routes: tr / en / de / zh
├─ Shared typed tool catalogue and localized metadata
├─ Local Agent orchestration
│  ├─ multilingual semantic scorer + versioned plan recipes
│  ├─ tab-scoped session bridge across all 309 distinct tools
│  └─ no remote model, remote speech fallback, or hidden chain-of-thought
├─ Visual Workstation (route-level lazy bundle)
│  ├─ native HTML/SVG nodes + explicit tool bridge
│  ├─ AES-GCM encrypted IndexedDB projects
│  ├─ gzip/Base64url recipes in a Web Worker
│  └─ manual WebRTC DataChannel rooms; no signaling/STUN/TURN
├─ Source-transparent updates
│  ├─ build-time allowlisted official-source feed sync with validation, deduplication, date sorting, and spam rejection
│  └─ finite cards + local reading state + reuse-aware official-feed summaries
├─ Client-side workbenches
│  ├─ Web APIs / Web Crypto / Canvas
│  ├─ bounded Web Workers
│  └─ dynamically loaded pdf-lib / qrcode where needed
├─ PWA manifest + same-origin service worker
└─ sitemap / robots / llms.txt / RSS / JSON-LD
~~~

No secret belongs in the client bundle. Source code is intentionally maintainable rather than obfuscated; obfuscation does not protect browser-side credentials and makes security review harder. Production source maps are disabled. Canonical metadata, a build signature, and an official-domain guard preserve attribution and block interactive use on unauthorized hosts, but no client-side mechanism can make delivered JavaScript impossible to inspect.

## Repository identity

ByteQuant is an open-source, privacy-first browser workbench: 309 distinct local tools, an explainable workflow Agent, an encrypted visual Workstation, four-language guides, and a source-transparent updates desk. The repository intentionally avoids remote inference, hidden telemetry, fake community metrics, and server-side processing of tool input.

Recommended GitHub About description: `Privacy-first browser workbench with 309 distinct local tools, an explainable Agent, encrypted visual workflows, and four-language guides.`

Recommended topics: `privacy-tools`, `browser-tools`, `nextjs`, `typescript`, `pwa`, `local-first`, `web-crypto`, `developer-tools`, `workflow-automation`, `i18n`, `static-site`, `open-source`.

The build badge above maps directly to the pinned, least-privilege Pages workflow in `.github/workflows/deploy.yml`. A passing badge means lint, license audit, production build, application tests, static-output audit, and AdSense-surface audit all completed before deployment.

## Local development

Requirements:

- Node.js 22.13 or later
- pnpm 11

~~~bash
pnpm install
pnpm dev
~~~

Run the complete quality gate:

~~~bash
pnpm lint
pnpm audit:licenses
pnpm build
pnpm test
pnpm audit:static
pnpm audit:adsense
pnpm audit:content
pnpm audit:editorial
pnpm audit:trust
pnpm audit:inventory
pnpm build:sites
~~~

The deployable static site is written to out/.

## Repository map

| Area | Location |
| --- | --- |
| Tool catalogue and localized SEO copy | app/lib/tools.ts, app/lib/tool-locales.ts |
| Calculation, AI, document, and security workbenches | app/components/AdvancedWorkbenches.tsx |
| High-demand data, SEO, text, calculation, crypto, and RAG workbenches | app/components/DemandWorkbenches.tsx |
| Research, planning, privacy, finance, and supply-chain expansion | app/lib/expansion-tools.ts, app/components/ExpansionWorkbenches.tsx |
| Existing client-side tool engine | app/components/ToolWorkbench.tsx |
| Local semantic planner and error translator | app/lib/agent-core.ts |
| Agent interface and tool bridge | app/components/AgenticAssistant.tsx, app/components/AgentToolBridge.tsx |
| Visual Workstation, storage, recipes, and P2P | app/components/WorkstationClient.tsx, app/lib/workspace-storage.ts, app/lib/workspace-recipe.ts, app/lib/workspace-p2p.ts |
| Locale and hreflang routing | app/lib/site.ts |
| Legal, trust, and publishing standards | app/lib/info.ts, app/lib/localized-info.ts, app/lib/publishing-standards.ts |
| Editorial guides | app/lib/posts.ts |
| Official-source update feed | scripts/sync-news.mjs, app/lib/generated-news.ts, app/components/NewsPage.tsx |
| Design system | app/globals.css |
| PWA | app/manifest.ts, app/components/PwaInstall.tsx, public/sw.js |
| Output verification | tests/site.test.mjs |

## GitHub Pages deployment

1. Push the intended commit to main.
2. Open **Settings → Pages** and select **GitHub Actions** as the source.
3. The workflow in .github/workflows/deploy.yml installs dependencies, runs the build and tests, and publishes out/.
4. public/CNAME targets bytequant.org; verify DNS and enforce HTTPS in repository settings.

## Dependency and advertising policy

Runtime libraries must be open source, free to use commercially, pinned, and documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The current direct runtime dependencies use permissive licenses.

The site includes the Google AdSense site tag and matching `ads.txt` record for the owner-provided publisher ID `ca-pub-4158794981134847`. Advertising remains separated from tool controls and no tool input is intentionally exposed to advertising code. Release checks verify that the exact ID is consistent across the tag, meta field, seller record, placement inventory, and CSP allowlist; account ownership and site readiness are confirmed only inside AdSense.

Account-side release gates still matter:

1. publish a Google-certified CMP integrated with the current IAB TCF requirement for EEA, UK, and Swiss traffic;
2. exclude Local Agent, Workstation, Community, and other private/interaction-heavy routes from Auto ads;
3. review real creatives at mobile and desktop breakpoints, then monitor Core Web Vitals and the Policy Center;
4. keep privacy/storage disclosures synchronized with every advertising change.

The audited placement inventory and external activation gates are documented in [docs/ADSENSE_APPROVAL_CHECKLIST.md](docs/ADSENSE_APPROVAL_CHECKLIST.md).

SEO, AEO, GEO, and AdSense readiness are quality practices—not ranking, citation, indexing, or approval guarantees.

## Contributing and contact

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [COMMUNITY_GUIDELINES.md](COMMUNITY_GUIDELINES.md) before proposing changes. Security findings should follow [SECURITY.md](SECURITY.md), not a public issue.

- Email: bytequant@yahoo.com
- X: [@byte_quant](https://x.com/byte_quant)
- Instagram: [@byte.quant](https://www.instagram.com/byte.quant)
