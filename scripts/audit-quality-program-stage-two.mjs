import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { publicTools } from "../app/lib/tools.ts";
import { stageTwoTools, stageTwoToolSlugs } from "../app/lib/stage-two-tools.ts";
import { stageTwoDemos, runStageTwoTool } from "../app/components/StageTwoWorkbenches.tsx";
import { stageTwoPosts, stageTwoLocalizedGuides } from "../app/lib/stage-two-guides.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const locales = ["tr", "en", "de", "zh"];
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';
const [adsTxt, layout, llms] = await Promise.all([readFile(join(root, "public/ads.txt"), "utf8"), readFile(join(root, "app/layout.tsx"), "utf8"), readFile(join(root, "public/llms.txt"), "utf8")]);
assert.equal(adsTxt, expectedAds, "protected ads.txt changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense script changed");
assert.equal(publicTools.length, 327);
assert.equal(stageTwoTools.length, 8);
assert.equal(stageTwoToolSlugs.size, 8);
assert.equal(stageTwoPosts.length, 4);
assert.equal(stageTwoLocalizedGuides.length, 4);
assert.equal((llms.match(/^- \[/gm) ?? []).length, 327);

let runs = 0;
for (const slug of stageTwoToolSlugs) {
  const demo = stageTwoDemos[slug]; assert.ok(demo?.input);
  for (const locale of locales) {
    const result = runStageTwoTool(slug, demo.input, demo.secondary ?? "", locale);
    assert.ok(result.output.length > 30);
    assert.ok(result.metrics.length >= 2);
    assert.ok(result.warning.length > 10);
    runs += 1;
  }
}

const report = `# AdSense quality program — Stage 2 content and utility report

Generated: 2026-08-11

## Verified scope

| Check | Result |
| --- | ---: |
| Canonical public tools | ${publicTools.length} |
| New purpose-specific tools | ${stageTwoTools.length} |
| New localized tool pages | ${stageTwoTools.length * 4} |
| New deep guides | ${stageTwoPosts.length} × 4 languages |
| Deterministic demo runs | ${runs} |
| Protected ads.txt SHA-256 | ${expectedAdsHash} |

## Quality decisions

- The package adds distinct contract, data-quality, accessibility, cache-safety, and scenario-calculation tasks rather than aliases of existing formatters.
- Every new tool has its own processor, safe synthetic demo, error boundary, metrics, visible limitation, standardized copy/download controls, and on-device completion notice.
- Four editorial guides connect the tools to verification, migration, accessibility, privacy, and decision-owner workflows. They do not claim that automated output proves compliance, security, accessibility, ranking, or financial suitability.
- Every canonical tool remains public and indexable. The sitemap and structured-data routes derive from the canonical catalog, so all ${publicTools.length * 4} localized tool URLs stay synchronized.
- The protected AdSense publisher identity and seller record remain byte-for-byte unchanged.

This report is engineering evidence, not a promise of AdSense approval or search ranking.
`;
if (process.argv.includes("--write")) await writeFile(join(root, "docs/ADSENSE-QUALITY-PROGRAM-STAGE-2.md"), report, "utf8");
else assert.equal(await readFile(join(root, "docs/ADSENSE-QUALITY-PROGRAM-STAGE-2.md"), "utf8"), report);
console.log(`Stage 2 quality audit: PASS (${runs} localized demo runs)`);
