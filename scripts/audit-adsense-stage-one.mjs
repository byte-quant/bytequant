import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { publicTools } from "../app/lib/tools.ts";
import { toolPath } from "../app/lib/site.ts";
import { precisionToolSlugs } from "../app/lib/precision-tools.ts";
import { frontierToolSlugs } from "../app/lib/frontier-tools.ts";
import { localizePrecisionError, precisionDemos, runPrecisionTool } from "../app/components/PrecisionWorkbenches.tsx";
import { frontierDemos, localizeFrontierError, runFrontierTool } from "../app/components/FrontierWorkbenches.tsx";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["tr", "en", "de", "zh"];
const reportUrl = new URL("../docs/ADSENSE-STAGE-1-QUALITY-REPORT.md", import.meta.url);
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';

const [adsTxt, layout] = await Promise.all([
  readFile(join(root, "public", "ads.txt"), "utf8"),
  readFile(join(root, "app", "layout.tsx"), "utf8"),
]);
assert.equal(adsTxt, expectedAds, "protected ads.txt seller record changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense Auto Ads script changed");

assert.equal(publicTools.length, 309, "canonical public tool count changed");
assert.equal(new Set(publicTools.map((tool) => tool.slug)).size, 309, "canonical slugs must be unique");

for (const locale of locales) {
  assert.equal(new Set(publicTools.map((tool) => tool.title[locale].trim().toLocaleLowerCase(locale))).size, 309, `${locale} titles must be unique`);
  assert.equal(new Set(publicTools.map((tool) => tool.short[locale].trim().toLocaleLowerCase(locale))).size, 309, `${locale} summaries must be unique`);
  assert.equal(new Set(publicTools.map((tool) => tool.description[locale].trim().toLocaleLowerCase(locale))).size, 309, `${locale} descriptions must be unique`);
}

const runtimeSlugs = new Set([...precisionToolSlugs, ...frontierToolSlugs]);
assert.equal(runtimeSlugs.size, 110, "deep runtime audit must cover 110 tools");
const runtimeOutputs = new Map();
let runtimeRuns = 0;

for (const slug of precisionToolSlugs) {
  const demo = precisionDemos[slug];
  assert.ok(demo?.input.trim(), `${slug}: missing precision demo`);
  for (const locale of locales) {
    const result = runPrecisionTool(slug, demo.input, demo.secondary ?? "", demo.mode ?? "default", locale);
    assert.ok(result.output.trim().length >= 1, `${slug}/${locale}: empty demo output`);
    assert.ok((result.metrics?.length ?? 0) >= 1, `${slug}/${locale}: output has no measurable result`);
    assert.notEqual(result.output.trim(), demo.input.trim(), `${slug}/${locale}: processor only echoed its input`);
    runtimeRuns += 1;
    if (locale === "en") runtimeOutputs.set(result.output, [...(runtimeOutputs.get(result.output) ?? []), slug]);
  }
}

for (const slug of frontierToolSlugs) {
  const demo = frontierDemos[slug];
  assert.ok(demo?.input.trim(), `${slug}: missing frontier demo`);
  for (const locale of locales) {
    const result = await runFrontierTool(slug, demo.input, demo.secondary ?? "", demo.mode ?? "default", locale);
    assert.ok(result.output.trim().length >= 1, `${slug}/${locale}: empty demo output`);
    assert.ok((result.metrics?.length ?? 0) >= 1, `${slug}/${locale}: output has no measurable result`);
    assert.notEqual(result.output.trim(), demo.input.trim(), `${slug}/${locale}: processor only echoed its input`);
    runtimeRuns += 1;
    if (locale === "en") runtimeOutputs.set(result.output, [...(runtimeOutputs.get(result.output) ?? []), slug]);
  }
}

assert.equal(runtimeRuns, 440, "deep runtime matrix must run 110 tools in four locales");
assert.deepEqual([...runtimeOutputs.values()].filter((slugs) => slugs.length > 1), [], "different tools produced the same English demo output");
for (const locale of locales) {
  assert.ok(localizePrecisionError(new Error("Invalid JSON"), locale).length >= 24, `${locale}: precision error guidance is shallow`);
  assert.ok(localizeFrontierError(new Error("Invalid JSON"), locale).length >= 24, `${locale}: frontier error guidance is shallow`);
}

let indexedPages = 0;
for (const tool of publicTools) {
  for (const locale of locales) {
    const relative = toolPath(locale, tool.slug).replace(/^\//, "");
    const html = await readFile(join(root, "out", relative, "index.html"), "utf8");
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `${locale}/${tool.slug}: canonical tool is hidden from indexing`);
    assert.match(html, /data-editorial-depth="applied"/, `${locale}/${tool.slug}: missing editorial quality passport`);
    assert.match(html, /"@type":"WebApplication"/, `${locale}/${tool.slug}: missing WebApplication schema`);
    assert.match(html, /"@type":"HowTo"/, `${locale}/${tool.slug}: missing HowTo schema`);
    assert.match(html, /"@type":"FAQPage"/, `${locale}/${tool.slug}: missing FAQ schema`);
    assert.match(html, new RegExp(`<html[^>]+lang="${locale === "zh" ? "zh-CN" : locale}`), `${locale}/${tool.slug}: wrong document language`);
    indexedPages += 1;
  }
}
assert.equal(indexedPages, 1236, "all 309 canonical tools must remain indexable in four languages");

const repeatedUseCaseSets = new Map();
const repeatedStepSets = new Map();
for (const tool of publicTools) {
  const useCaseKey = JSON.stringify(tool.useCases.en);
  const stepKey = JSON.stringify(tool.steps.en);
  repeatedUseCaseSets.set(useCaseKey, [...(repeatedUseCaseSets.get(useCaseKey) ?? []), tool.slug]);
  repeatedStepSets.set(stepKey, [...(repeatedStepSets.get(stepKey) ?? []), tool.slug]);
}
const repeatedUseCaseTools = [...repeatedUseCaseSets.values()].filter((slugs) => slugs.length > 1).reduce((sum, slugs) => sum + slugs.length, 0);
const repeatedStepTools = [...repeatedStepSets.values()].filter((slugs) => slugs.length > 1).reduce((sum, slugs) => sum + slugs.length, 0);

const report = `# AdSense remediation — Stage 1 quality report

Generated: 2026-08-09

## Decision boundary

This report does not invent an AdSense rejection reason. The exact Policy Center message is account-only evidence and must be copied verbatim into \`docs/ADSENSE-REJECTION-EVIDENCE.md\` by the site owner. Stage 1 therefore verifies every condition that can be proven from the repository and production export, while leaving account-side evidence explicitly unresolved.

## Protected advertising identity

| Check | Result |
| --- | --- |
| Seller record | \`google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\` |
| ads.txt SHA-256 | \`${expectedAdsHash.toUpperCase()}\` |
| Auto Ads publisher | \`ca-pub-4158794981134847\` |
| Script strategy | asynchronous, \`afterInteractive\` |

The audit fails immediately if the seller record, hash, publisher ID, or exact Auto Ads script changes.

## Evidence matrix

| Measure | Verified |
| --- | ---: |
| Canonical public tools | ${publicTools.length} |
| Canonical localized tool pages kept indexable | ${indexedPages} |
| Unique localized titles, summaries, and descriptions | ${publicTools.length} × 4 |
| High-risk tools with executable demos | ${runtimeSlugs.size} |
| Successful four-locale runtime demo runs | ${runtimeRuns} |
| Duplicate high-risk demo outputs | 0 |
| Tool pages with WebApplication + HowTo + FAQ structured data | ${indexedPages} |

## Repairs completed in Stage 1

- INI ↔ JSON and Properties ↔ JSON now publish measurable key/section/character results instead of an unmeasured text block.
- All 35 precision workbenches now explain the expected input structure beside the field, show a localized example signature, expose a visible ready/processing/completed/error state, and publish a Local Agent input/run contract.
- Precision errors now return actionable, fully localized JSON, table, numeric, date, key-value, or generic recovery guidance without mixing raw English into German, Chinese, or Turkish UI.
- All 309 canonical tools remain publicly indexable in four languages; Stage 1 introduces no blanket noindex or tool removal.

## Measured Stage 2 editorial backlog

Stage 1 deliberately records rather than conceals template repetition. ${repeatedUseCaseTools} tools currently share at least one identical English use-case set and ${repeatedStepTools} tools share at least one identical English three-step set. Their titles, summaries, descriptions, runnable processors, outputs, and canonical pages are distinct, but Stage 2 must replace repeated instructional copy with tool-specific input, method, acceptance, failure, and verification guidance.

## Gate result

Repository-verifiable Stage 1 checks: **PASS**. Account-side rejection wording: **OWNER EVIDENCE REQUIRED**. Passing this gate is not a promise of AdSense approval; Google alone decides approval after reviewing the live site and account.
`;

if (process.argv.includes("--write")) {
  await writeFile(reportUrl, report, "utf8");
  console.log("Generated Stage 1 AdSense quality report.");
} else {
  assert.equal(await readFile(reportUrl, "utf8"), report, "Stage 1 report is stale; run pnpm stage1:generate");
  console.log(`AdSense Stage 1 audit: PASS (${indexedPages} localized pages, ${runtimeRuns} runtime runs)`);
}
