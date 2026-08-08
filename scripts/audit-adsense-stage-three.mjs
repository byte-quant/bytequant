import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { publicTools } from "../app/lib/tools.ts";
import { toolPath } from "../app/lib/site.ts";
import { frontierToolSlugs } from "../app/lib/frontier-tools.ts";
import { precisionToolSlugs } from "../app/lib/precision-tools.ts";
import { frontierDemos, frontierGuidedInputKind, localizeFrontierError, runFrontierTool } from "../app/components/FrontierWorkbenches.tsx";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reportUrl = new URL("../docs/ADSENSE-STAGE-3-USABILITY-REPORT.md", import.meta.url);
const locales = ["tr", "en", "de", "zh"];
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';

const [adsTxt, layout, frontierSource, genericSource, css] = await Promise.all([
  readFile(join(root, "public", "ads.txt"), "utf8"),
  readFile(join(root, "app", "layout.tsx"), "utf8"),
  readFile(join(root, "app", "components", "FrontierWorkbenches.tsx"), "utf8"),
  readFile(join(root, "app", "components", "ToolWorkbench.tsx"), "utf8"),
  readFile(join(root, "app", "globals.css"), "utf8"),
]);
assert.equal(adsTxt, expectedAds, "protected ads.txt seller record changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense Auto Ads script changed");

assert.match(frontierSource, /function GuidedFrontierInput/);
assert.match(frontierSource, /data-guided-input=/);
assert.match(frontierSource, /aria-errormessage=/);
assert.match(frontierSource, /data-agent-input data-agent-key="input"/);
assert.match(frontierSource, /data-workbench-quality="stage-3"/);
assert.match(genericSource, /data-workbench-quality="stage-3"/);
assert.match(genericSource, /data-agent-input data-agent-key="secondary"/);
assert.match(genericSource, /workbench-trust-card/);
for (const selector of [".frontier-input-switch", ".frontier-guided-fields", ".frontier-row-editor", ".frontier-editable-row", ".frontier-add-row"]) assert.ok(css.includes(selector), `missing ${selector} styles`);

const guidedCounts = { "key-value": 0, rows: 0, raw: 0 };
let demoRuns = 0;
for (const slug of frontierToolSlugs) {
  guidedCounts[frontierGuidedInputKind(slug)] += 1;
  const demo = frontierDemos[slug];
  assert.ok(demo?.input.trim(), `${slug}: missing demo`);
  for (const locale of locales) {
    const result = await runFrontierTool(slug, demo.input, demo.secondary ?? "", demo.mode ?? "default", locale);
    assert.ok(result.output.trim(), `${slug}/${locale}: empty output`);
    assert.ok(result.metrics?.length, `${slug}/${locale}: missing metrics`);
    demoRuns += 1;
  }
}
assert.deepEqual(guidedCounts, { "key-value": 20, rows: 12, raw: 43 });
for (const locale of locales) {
  assert.ok(localizeFrontierError(new Error("Expected key=value: broken"), locale).length >= 24);
  assert.ok(localizeFrontierError(new Error("Invalid JSON"), locale).length >= 24);
}

let localizedPages = 0;
for (const tool of publicTools) {
  for (const locale of locales) {
    const relative = toolPath(locale, tool.slug).replace(/^\//, "");
    const html = await readFile(join(root, "out", relative, "index.html"), "utf8");
    assert.match(html, /data-stage-three-ready="true"/, `${tool.slug}/${locale}: Stage 3 product marker missing`);
    assert.match(html, /data-input-profile=/, `${tool.slug}/${locale}: input profile missing`);
    assert.match(html, /Örnek veri yükle|Load example|Beispiel laden|加载示例/, `${tool.slug}/${locale}: demo action missing`);
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `${tool.slug}/${locale}: canonical tool hidden`);
    localizedPages += 1;
  }
}
assert.equal(localizedPages, 1236);

const report = `# AdSense remediation — Stage 3 usability report

Generated: 2026-08-09

## Scope

Stage 3 improves the product itself: input methods, error recovery, result state, mobile layout, and on-device confirmation. Canonical tools remain public and indexable; no tool was removed or hidden.

## Protected advertising identity

| Check | Result |
| --- | --- |
| Seller record | \`google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\` |
| ads.txt SHA-256 | \`${expectedAdsHash.toUpperCase()}\` |
| Auto Ads publisher | \`ca-pub-4158794981134847\` |

## Product evidence

| Measure | Verified |
| --- | ---: |
| Canonical tools | ${publicTools.length} |
| Localized canonical pages carrying the Stage 3 contract | ${localizedPages} |
| Deep-runtime workbenches retained | ${precisionToolSlugs.size + frontierToolSlugs.size} |
| Four-locale frontier demo runs | ${demoRuns} |
| key=value tools upgraded to guided fields | ${guidedCounts["key-value"]} |
| delimiter-row tools upgraded to an editable row interface | ${guidedCounts.rows} |
| frontier tools keeping appropriate raw text/JSON/CSV entry | ${guidedCounts.raw} |

## Repairs

- Structured settings no longer require visitors to author \`key=value\` syntax. A guided form creates the compatible text contract while retaining an explicit raw mode for advanced users.
- Record-oriented tools such as shift coverage, package price comparison, cookie inventory, risk records, scheduling, and evidence review now expose labeled editable rows, add/remove controls, responsive mobile stacking, and localized labels.
- The Local Agent contract remains attached to the underlying input and run controls, so guided editing does not break automation or same-tab handoff.
- Generic and frontier workbenches expose visible ready/processing/completed/error states, disabled output actions while busy, field-linked error recovery, and an on-device completion card.
- Wide structured results remain semantic, keyboard-focusable tables. Mobile editors stack fields and keep every remove/run/copy control reachable.

## Gate result

Repository-verifiable Stage 3 checks: **PASS**. This report demonstrates product and content quality controls; it does not guarantee AdSense approval, which remains Google's decision.
`;

if (process.argv.includes("--write")) {
  await writeFile(reportUrl, report, "utf8");
  console.log("Generated Stage 3 AdSense usability report.");
} else {
  assert.equal(await readFile(reportUrl, "utf8"), report, "Stage 3 report is stale; run pnpm stage3:generate");
  console.log(`AdSense Stage 3 audit: PASS (${localizedPages} localized pages, ${demoRuns} frontier runs)`);
}
