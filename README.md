# ByteQuant

[![Website](https://img.shields.io/badge/website-bytequant.org-08747c)](https://bytequant.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-3657ff)](LICENSE)

ByteQuant is a privacy-first, installable web application containing 89 browser-native tools. It supports Turkish, English, German, and Simplified Chinese, produces a fully static Next.js export, and is designed for GitHub Pages.

**Live site:** [bytequant.org](https://bytequant.org)

## Product at a glance

- 89 working tools across Prompt, Text & NLP, Data & Developer, Converters, Privacy & Security, Calculations, Everyday Tools, AI Tools, and Code & File Security
- Four localized home pages, tool catalogues, tool pages, legal/trust pages, FAQs, metadata, hreflang declarations, and JSON-LD
- 42 long-form editorial guides in Turkish and English, including 14 editorially localized German and Simplified Chinese workflow editions
- Installable Progressive Web App with same-origin application-shell caching and an explicit no-input-caching boundary
- Explainable Local Agent with multilingual semantic search, short same-tab conversation memory, spoken responses, user-approved plans, visible mini-flow diagrams, alternatives, and one-click Workstation handoff
- Lazy-loaded visual Workstation across all 89 tools, with full-catalog filters, five starter flows, Agent plan import, 40-step undo/redo, zoom/pan/minimap navigation, explicit tool handoff, encrypted IndexedDB projects, compressed recipe URLs, and manual WebRTC DataChannel rooms
- On-device PDF/image operations, Web Crypto utilities, bounded Worker-based scans, and no remote AI or malware-scanning API
- Related tools, smart next-tool handoff, before/after review, batch mode for common text/data tasks, consent-gated favorites and usage shortcuts, command palette, responsive layouts, and accessible operation-state UI
- API-less community draft pre-check and GitHub Discussions publishing flow; optional GitHub activity is fetched only after the user clicks
- Static sitemap, robots directives, llms.txt, RSS feeds, security policy, and GitHub Pages deployment

## Privacy and security model

Core tool operations run in the active browser tab. Tool input is not sent to a ByteQuant application server and is not persisted in localStorage.

The installable app's service worker caches only same-origin static resources and previously visited GET pages. It does **not** cache form input, selected files, passwords, generated output, POST data, or cross-origin resources.

Storage outside explicitly saved Workstation projects is limited to:

- bq-consent-v1: consent choice with a 180-day lifetime
- bq-theme: the user-selected theme
- bq-tool-usage-v1: optional, consent-gated tool slug/count/last-use data—never tool content
- bq-tool-favorites-v1: optional, consent-gated pinned tool IDs—never tool content

Workstation projects are opt-in and stay in the browser's `bytequant-workspaces` IndexedDB database. Project documents are encrypted with AES-GCM-256 and a non-extractable device key stored in the same database. This reduces exposure at rest but does not protect a compromised device, malicious extension, or hostile same-origin script. Tab handoffs use bounded sessionStorage records. Recipe URLs omit output and omit input by default.

Peer collaboration uses only WebRTC DataChannel with manual offer/answer exchange and an empty ICE-server list. ByteQuant operates no signaling, STUN, or TURN service. Single-use codes expire after ten minutes. Live sharing starts paused and stays locked until both people compare the same DTLS-derived safety code through another trusted channel. The code is not real-world identity verification; connection codes can expose network candidates, and NAT or firewall policy can still prevent a connection.

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
│  ├─ tab-scoped session bridge across all 89 tools
│  └─ no remote model, remote speech fallback, or hidden chain-of-thought
├─ Visual Workstation (route-level lazy bundle)
│  ├─ native HTML/SVG nodes + explicit tool bridge
│  ├─ AES-GCM encrypted IndexedDB projects
│  ├─ gzip/Base64url recipes in a Web Worker
│  └─ manual WebRTC DataChannel rooms; no signaling/STUN/TURN
├─ Client-side workbenches
│  ├─ Web APIs / Web Crypto / Canvas
│  ├─ bounded Web Workers
│  └─ dynamically loaded pdf-lib / qrcode where needed
├─ PWA manifest + same-origin service worker
└─ sitemap / robots / llms.txt / RSS / JSON-LD
~~~

No secret belongs in the client bundle. Source code is intentionally maintainable rather than obfuscated; obfuscation does not protect browser-side credentials and makes security review harder. Production source maps are disabled. Canonical metadata, a build signature, and an official-domain guard preserve attribution and block interactive use on unauthorized hosts, but no client-side mechanism can make delivered JavaScript impossible to inspect.

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
pnpm build
pnpm test
~~~

The deployable static site is written to out/.

## Repository map

| Area | Location |
| --- | --- |
| Tool catalogue and localized SEO copy | app/lib/tools.ts, app/lib/tool-locales.ts |
| Calculation, AI, document, and security workbenches | app/components/AdvancedWorkbenches.tsx |
| High-demand data, SEO, text, calculation, crypto, and RAG workbenches | app/components/DemandWorkbenches.tsx |
| Existing client-side tool engine | app/components/ToolWorkbench.tsx |
| Local semantic planner and error translator | app/lib/agent-core.ts |
| Agent interface and tool bridge | app/components/AgenticAssistant.tsx, app/components/AgentToolBridge.tsx |
| Visual Workstation, storage, recipes, and P2P | app/components/WorkstationClient.tsx, app/lib/workspace-storage.ts, app/lib/workspace-recipe.ts, app/lib/workspace-p2p.ts |
| Locale and hreflang routing | app/lib/site.ts |
| Legal and trust content | app/lib/info.ts, app/lib/localized-info.ts |
| Editorial guides | app/lib/posts.ts |
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

The site contains reserved advertising layout areas but no active AdSense publisher ID, advertising script, analytics SDK, or tracking cookie. Before any advertising activation:

1. configure a valid region-aware consent platform;
2. update privacy and storage disclosures before loading the vendor;
3. keep all tool input isolated from advertising code;
4. rerun mobile, accessibility, performance, policy, and consent checks.

SEO, AEO, GEO, and AdSense readiness are quality practices—not ranking, citation, indexing, or approval guarantees.

## Contributing and contact

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [COMMUNITY_GUIDELINES.md](COMMUNITY_GUIDELINES.md) before proposing changes. Security findings should follow [SECURITY.md](SECURITY.md), not a public issue.

- Email: bytequant@yahoo.com
- X: [@byte_quant](https://x.com/byte_quant)
- Instagram: [@byte.quant](https://www.instagram.com/byte.quant)
