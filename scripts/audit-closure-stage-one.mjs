import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getToolGuidanceDetails } from "../app/lib/tool-guidance.ts";
import { toolPath } from "../app/lib/site.ts";
import { publicTools } from "../app/lib/tools.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["tr", "en", "de", "zh"];
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';
const reportUrl = new URL("../docs/ADSENSE-CLOSURE-STAGE-1-REPORT.md", import.meta.url);

const [adsTxt, layout, workbench] = await Promise.all([
  readFile(join(root, "public", "ads.txt"), "utf8"),
  readFile(join(root, "app", "layout.tsx"), "utf8"),
  readFile(join(root, "app", "components", "ToolWorkbench.tsx"), "utf8"),
]);
assert.equal(adsTxt, expectedAds, "protected ads.txt seller record changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense Auto Ads script changed");

assert.equal(publicTools.length, 309, "canonical tool count changed");
const slugBlock = workbench.match(/export const legacyGenericToolSlugs = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
const sampleBlock = workbench.match(/export const legacyGenericSamples:[\s\S]*?= \{([\s\S]*?)\n\};\n\nfunction secondarySample/)?.[1] ?? "";
const legacyGenericToolSlugs = [...slugBlock.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
const sampleRows = sampleBlock.split("\n").filter((line) => /^  "[a-z0-9-]+": \{ tr:/.test(line));
assert.equal(new Set(legacyGenericToolSlugs).size, 22, "legacy generic workbench count changed");
assert.equal(sampleRows.length, 20, "the two no-input generators intentionally need no demo text");
for (const row of sampleRows) for (const locale of locales) assert.match(row, new RegExp(`(?:^|[, {])${locale}: \\"`), `${locale} native demo missing`);
const localizedDemoContracts = sampleRows.length * locales.length;

let acceptanceContracts = 0;
for (const tool of publicTools) {
  const details = getToolGuidanceDetails(tool);
  for (const locale of locales) {
    for (const field of ["input", "verification", "boundary"]) {
      assert.ok(details[field][locale].length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}: shallow ${field}`);
    }
    acceptanceContracts += 1;
  }
}

let generatedPages = 0;
for (const tool of publicTools) {
  for (const locale of locales) {
    const relative = toolPath(locale, tool.slug).replace(/^\//, "");
    const html = await readFile(join(root, "out", relative, "index.html"), "utf8");
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `${tool.slug}/${locale}: canonical page is noindex`);
    assert.match(html, /data-tool-acceptance="three-scenario"/, `${tool.slug}/${locale}: acceptance gate missing`);
    assert.match(html, /data-editorial-depth="applied"/, `${tool.slug}/${locale}: quality passport missing`);
    assert.match(html, /"@type":"WebApplication"/, `${tool.slug}/${locale}: WebApplication schema missing`);
    assert.match(html, /"@type":"HowTo"/, `${tool.slug}/${locale}: HowTo schema missing`);
    assert.match(html, /"@type":"FAQPage"/, `${tool.slug}/${locale}: FAQ schema missing`);
    generatedPages += 1;
  }
}
assert.equal(generatedPages, 1236, "all four-locale canonical tool pages must pass");

const report = `# AdSense closure plan — Stage 1 report

Generated: 2026-08-09

## Scope closed

This gate closes repository-verifiable omissions carried over from the earlier five-stage and four-stage remediation plans. It does not claim or guarantee AdSense approval; Google alone reviews and decides the application.

## Protected advertising identity

| Check | Verified value |
| --- | --- |
| Seller record | \`google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\` |
| ads.txt SHA-256 | \`${expectedAdsHash.toUpperCase()}\` |
| Auto Ads publisher | \`ca-pub-4158794981134847\` |

The gate fails immediately if any protected value changes.

## Measured evidence

| Measure | Result |
| --- | ---: |
| Canonical public tools | ${publicTools.length} |
| Indexable four-locale tool pages inspected | ${generatedPages} |
| Tool-specific three-scenario acceptance contracts | ${acceptanceContracts} |
| Legacy input-driven tools with native TR/EN/DE/ZH demos | ${sampleRows.length} |
| No-input cryptographic generators | ${legacyGenericToolSlugs.length - sampleRows.length} |
| Localized legacy demo contracts | ${localizedDemoContracts} |
| Pages with WebApplication + HowTo + FAQ schema | ${generatedPages} |

## Product repairs

- The 20 input-driven original workbenches now load native Turkish, English, German, and Chinese examples instead of falling back to English for German and Chinese; the two no-input cryptographic generators retain direct controls.
- Prompt, persona, similarity, word-count, JSON/CSV, Regex, Base64, URL, JWT, Cron, masking, password, UUID, and SHA-256 result labels, recovery guidance, and limitations are localized at runtime.
- Every canonical tool page exposes a normal-input, malformed-input, and boundary/real-use acceptance contract.
- The generic legal/medical/financial warning was replaced by the relevant tool or tool-category boundary, with dedicated JWT, Cron, Regex, and KVKK masking limits, so utilities no longer present unrelated boilerplate.
- No canonical tool was removed or blanket-noindexed.

## Gate result

Stage 1 repository and static-export checks: **PASS**. Account-side Policy Center wording remains owner evidence and should not be inferred from code.
`;

if (process.argv.includes("--write")) {
  await writeFile(reportUrl, report, "utf8");
  console.log("Generated closure Stage 1 report.");
} else {
  assert.equal(await readFile(reportUrl, "utf8"), report, "closure Stage 1 report is stale; run pnpm closure1:generate");
  console.log(`Closure Stage 1 audit: PASS (${generatedPages} pages, ${acceptanceContracts} acceptance contracts)`);
}
