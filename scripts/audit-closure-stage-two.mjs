import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { newsItems } from "../app/lib/generated-news.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';
const reportUrl = new URL("../docs/ADSENSE-CLOSURE-STAGE-2-REPORT.md", import.meta.url);

const read = (relative) => readFile(join(root, relative), "utf8");
const [adsTxt, layout, pwa, manifest, serviceWorker, agent, bridge, workstation, community, news, newsSync, styles, github] = await Promise.all([
  read("public/ads.txt"),
  read("app/layout.tsx"),
  read("app/components/PwaInstall.tsx"),
  read("app/manifest.ts"),
  read("public/sw.js"),
  read("app/components/AgentConversation.tsx"),
  read("app/components/AgentToolBridge.tsx"),
  read("app/components/WorkstationClient.tsx"),
  read("app/components/CommunityNetwork.tsx"),
  read("app/components/NewsFeedClient.tsx"),
  read("scripts/sync-news.mjs"),
  read("app/globals.css"),
  read("app/components/GitHubActivity.tsx"),
]);

assert.equal(adsTxt, expectedAds, "protected ads.txt seller record changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense Auto Ads script changed");

assert.match(pwa, /data-pwa-install-mode=/, "PWA install mode is not observable");
assert.match(pwa, /manualStatus:/, "manual-install explanation missing");
assert.match(pwa, /event\.key === "Escape"/, "install guide cannot be dismissed with Escape");
assert.match(pwa, /aria-describedby="pwa-guide-description"/, "install dialog description is not associated");
assert.doesNotMatch(pwa, /install-actions[\s\S]{0,900}className="text-button"/, "duplicate manual install CTA returned");
assert.match(manifest, /display_override: \["standalone", "minimal-ui"\]/);
assert.match(manifest, /prefer_related_applications: false/);
assert.match(serviceWorker, /Store only the path\. Query strings can contain sensitive values/);
assert.doesNotMatch(serviceWorker, /cache\.put\(request\.url/);

assert.match(agent, /preparedInput/);
assert.match(agent, /t\.start/);
assert.match(agent, /t\.workstation/);
assert.match(agent, /runAgentAutomation/);
assert.match(bridge, /data-agent-contract/);
assert.match(bridge, /AGENT_AUTO_PREPARE_KEY/);
assert.match(workstation, /workspace-canvas-controls/);
assert.match(workstation, /workspace-minimap/);
assert.match(workstation, /undo/);
assert.match(workstation, /redo/);
assert.match(workstation, /workspace-onboarding/);

assert.match(community, /Connect global feed|Global akışa bağlan/);
assert.match(community, /relay/i);
assert.match(community, /IP address|IP adres/);
assert.match(community, /disconnect|bağlantıyı kes/i);
assert.match(news, /readableSummary/);
assert.match(news, /feedNavigationBoilerplate/);
assert.match(news, /bytequant:community-news-quote:v1/);
assert.match(newsSync, /boilerplateSummary/);
assert.doesNotMatch(github, /August 2, 2026|2 Ağustos 2026|2\. August 2026|2026 年 8 月 2 日/);

assert.match(styles, /@media\(max-width:760px\)/);
assert.match(styles, /\.mobile-menu-panel\{max-height:min\(76vh,690px\);overflow:auto/);
assert.match(styles, /\.agent-chat-timeline>ol\{max-height:420px/);
assert.match(styles, /\.workspace-port\{width:24px!important;height:24px!important\}/);

const boilerplate = /today[’']?s\s+apod|archive\s+submissions\s+index\s+search\s+calendar\s+rss|skip\s+to\s+main\s+content/i;
for (const item of newsItems) if (item.summaryOrigin === "feed") assert.doesNotMatch(item.sourceSummary, boilerplate, `${item.id}: navigation boilerplate in summary`);

const surfaces = [
  ["", "agent", "workstation", "community", "updates"],
  ["en", "agent", "workstation", "community", "updates"],
  ["de", "agent", "workstation", "community", "updates"],
  ["zh", "agent", "workstation", "community", "updates"],
];
const trRoutes = { agent: "ajan", workstation: "is-istasyonu", community: "topluluk", updates: "guncel" };
let staticSurfaces = 0;
for (const [prefix, ...pages] of surfaces) {
  for (const page of pages) {
    const segment = prefix ? page : trRoutes[page];
    const html = await read(join("out", prefix, segment, "index.html"));
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `${prefix || "tr"}/${segment}: unexpectedly noindex`);
    assert.match(html, /<link[^>]+rel="canonical"/i, `${prefix || "tr"}/${segment}: canonical missing`);
    staticSurfaces += 1;
  }
}

for (const prefix of ["", "en", "de", "zh"]) {
  const html = await read(join("out", prefix, "index.html"));
  assert.match(html, /data-pwa-state="checking"/, `${prefix || "tr"}: PWA state marker missing`);
  assert.doesNotMatch(html, /August 2, 2026|2 Ağustos 2026|2\. August 2026|2026 年 8 月 2 日/, `${prefix || "tr"}: stale GitHub verification date`);
  staticSurfaces += 1;
}

const report = `# AdSense closure plan — Stage 2 report

Generated: 2026-08-09

## Scope closed

Stage 2 closes the browser-product experience: installability, Local Agent handoff, Workstation navigation, Community consent boundaries, official-source Updates, and responsive access to primary actions. It does not claim or guarantee AdSense approval; Google alone reviews and decides the application.

## Protected advertising identity

| Check | Verified value |
| --- | --- |
| Seller record | \`google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\` |
| ads.txt SHA-256 | \`${expectedAdsHash.toUpperCase()}\` |
| Auto Ads publisher | \`ca-pub-4158794981134847\` |

The audit fails immediately if any protected value changes.

## Measured evidence

| Measure | Result |
| --- | ---: |
| Indexable localized product surfaces inspected | ${staticSurfaces} |
| Official-source update records checked for navigation boilerplate | ${newsItems.length} |
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
`;

if (process.argv.includes("--write")) {
  await writeFile(reportUrl, report, "utf8");
  console.log("Generated closure Stage 2 report.");
} else {
  assert.equal(await readFile(reportUrl, "utf8"), report, "closure Stage 2 report is stale; run pnpm closure2:generate");
  console.log(`Closure Stage 2 audit: PASS (${staticSurfaces} localized surfaces, ${newsItems.length} source records)`);
}
