import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { publicTools } from "../app/lib/tools.ts";
import { getToolGuidanceDetails } from "../app/lib/tool-guidance.ts";
import { toolPath } from "../app/lib/site.ts";
import { essentialToolSlugs, guidedLegacyToolSlugs } from "../app/lib/essential-tool-slugs.ts";
import { expansionToolSlugs } from "../app/lib/expansion-tools.ts";
import { discoveryToolSlugs } from "../app/lib/discovery-tool-slugs.ts";
import { productivityToolSlugs } from "../app/lib/productivity-tool-slugs.ts";
import { demandToolSlugs } from "../app/lib/demand-tool-slugs.ts";
import { precisionToolSlugs } from "../app/lib/precision-tools.ts";
import { frontierToolSlugs } from "../app/lib/frontier-tools.ts";
import { stageTwoToolSlugs } from "../app/lib/stage-two-tools.ts";
import { advancedWorkbenchSlugs } from "../app/components/AdvancedWorkbenches.tsx";
import { growthWorkbenchSlugs } from "../app/components/GrowthWorkbenches.tsx";
import { newWorkbenchSlugs } from "../app/components/NewToolWorkbenches.tsx";
import { specializedSlugs } from "../app/components/SpecializedWorkbench.tsx";
import { precisionDemos, runPrecisionTool } from "../app/components/PrecisionWorkbenches.tsx";
import { frontierDemos, runFrontierTool } from "../app/components/FrontierWorkbenches.tsx";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["tr", "en", "de", "zh"];
const reportUrl = new URL("../docs/ADSENSE-QUALITY-PROGRAM-STAGE-1.md", import.meta.url);
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';

const [adsTxt, layout, workbenchSource] = await Promise.all([
  readFile(join(root, "public", "ads.txt"), "utf8"),
  readFile(join(root, "app", "layout.tsx"), "utf8"),
  readFile(join(root, "app", "components", "ToolWorkbench.tsx"), "utf8"),
]);
assert.equal(adsTxt, expectedAds, "protected ads.txt seller record changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense Auto Ads script changed");

function sourceSet(name) {
  const block = workbenchSource.match(new RegExp(`export const ${name} = new Set\\(\\[([\\s\\S]*?)\\]\\);`))?.[1] ?? "";
  const slugs = [...block.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
  assert.ok(slugs.length, `${name}: source manifest could not be read`);
  assert.equal(new Set(slugs).size, slugs.length, `${name}: duplicate source entries`);
  return new Set(slugs);
}

const converterSlugs = sourceSet("converterSlugs");
const legacyGenericToolSlugs = sourceSet("legacyGenericToolSlugs");
assert.match(workbenchSource, /const family = getToolRuntimeFamily\(slug\)/, "workbench dispatch must use the central runtime resolver");
assert.match(workbenchSource, /if \(family === "generic"\) return <GenericToolWorkbench/, "generic workbench must be explicitly allowlisted");
assert.match(workbenchSource, /data-runtime-family="unsupported"/, "unknown runtimes must fail closed with visible guidance");

const familySets = [
  ["stageTwo", stageTwoToolSlugs],
  ["frontier", frontierToolSlugs], ["precision", precisionToolSlugs], ["essential", new Set([...essentialToolSlugs, ...guidedLegacyToolSlugs])],
  ["expansion", expansionToolSlugs], ["discovery", discoveryToolSlugs], ["productivity", new Set(productivityToolSlugs)], ["demand", demandToolSlugs],
  ["growth", growthWorkbenchSlugs], ["converter", converterSlugs], ["new", newWorkbenchSlugs], ["specialized", specializedSlugs],
  ["advanced", advancedWorkbenchSlugs], ["generic", legacyGenericToolSlugs],
];
const familyFor = (slug) => familySets.find(([, slugs]) => slugs.has(slug))?.[0] ?? "unsupported";
const familyCounts = new Map(familySets.map(([family]) => [family, 0]));

assert.equal(publicTools.length, 327, "canonical catalog must retain 327 public tools");
for (const tool of publicTools) {
  const family = familyFor(tool.slug);
  assert.notEqual(family, "unsupported", `${tool.slug}: no implemented runtime family`);
  familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
  const guidance = getToolGuidanceDetails(tool);
  for (const locale of locales) {
    assert.ok(tool.title[locale].trim().length >= 4, `${tool.slug}/${locale}: missing title`);
    assert.ok(tool.short[locale].trim().length >= (locale === "zh" ? 12 : 24), `${tool.slug}/${locale}: shallow summary`);
    assert.ok(tool.description[locale].trim().length >= (locale === "zh" ? 28 : 80), `${tool.slug}/${locale}: shallow description`);
    assert.equal(tool.steps[locale].length, 3, `${tool.slug}/${locale}: HowTo contract must have three steps`);
    assert.ok(tool.useCases[locale].length >= 3, `${tool.slug}/${locale}: three specific use cases required`);
    for (const [field, value] of Object.entries({ input: guidance.input[locale], method: guidance.method[locale], output: guidance.output[locale], verification: guidance.verification[locale], boundary: guidance.boundary[locale] })) {
      assert.ok(value.trim().length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}: shallow ${field} contract`);
    }
  }
}
assert.equal([...familyCounts.values()].reduce((sum, count) => sum + count, 0), publicTools.length, "runtime family counts do not cover the catalog exactly once");

const ignored = new Set(["the", "and", "for", "with", "from", "into", "tool", "checker", "analyzer", "builder", "generator", "prompt"]);
const tokens = (text) => new Set(text.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter((token) => token.length > 2 && !ignored.has(token)));
const similarity = (left, right) => {
  const a = tokens(`${left.title.en} ${left.short.en}`), b = tokens(`${right.title.en} ${right.short.en}`);
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / new Set([...a, ...b]).size;
};
const nearDuplicates = [];
for (let leftIndex = 0; leftIndex < publicTools.length; leftIndex += 1) for (let rightIndex = leftIndex + 1; rightIndex < publicTools.length; rightIndex += 1) {
  const left = publicTools[leftIndex], right = publicTools[rightIndex];
  if (left.category !== right.category) continue;
  const score = similarity(left, right);
  if (score >= 0.68) nearDuplicates.push([left.slug, right.slug, score]);
}
assert.deepEqual(nearDuplicates, [], `near-duplicate tool intents remain: ${nearDuplicates.map(([a, b, score]) => `${a}/${b} (${score.toFixed(2)})`).join(", ")}`);

const coverageDemo = precisionDemos["few-shot-kapsama-analizoru"];
const balanceDemo = frontierDemos["prompt-ornek-denge-analizoru"];
const coverageResult = runPrecisionTool("few-shot-kapsama-analizoru", coverageDemo.input, "", "default", "en");
const balanceResult = await runFrontierTool("prompt-ornek-denge-analizoru", balanceDemo.input, "", "default", "en");
assert.match(coverageResult.output, /Conflicting labels for the same input:/, "dataset coverage tool must detect label collisions");
assert.match(balanceResult.output, /\| case type \| count \| status \|/i, "scenario balance tool must audit explicit scenario types");
assert.match(balanceResult.output, /Expected-output shapes:/, "scenario balance tool must inspect output-format consistency");
assert.notEqual(coverageResult.output, balanceResult.output, "differentiated prompt tools must not produce the same report");
await assert.rejects(() => runFrontierTool("prompt-ornek-denge-analizoru", "positive|only two fields", "", "default", "en"), /must use class\|case type\|example input\|expected output/);

let localizedPages = 0;
for (const tool of publicTools) for (const locale of locales) {
  const relative = toolPath(locale, tool.slug).replace(/^\//, "");
  const html = await readFile(join(root, "out", relative, "index.html"), "utf8");
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `${tool.slug}/${locale}: canonical page must remain indexable`);
  assert.match(html, /data-tool-quality-contract="catalog-v2"/, `${tool.slug}/${locale}: missing quality contract marker`);
  assert.match(html, new RegExp(`data-tool-slug="${tool.slug}"`), `${tool.slug}/${locale}: wrong quality contract identity`);
  assert.match(html, /"@type":"WebApplication"/, `${tool.slug}/${locale}: WebApplication schema missing`);
  assert.match(html, /"@type":"HowTo"/, `${tool.slug}/${locale}: HowTo schema missing`);
  assert.match(html, /"@type":"FAQPage"/, `${tool.slug}/${locale}: FAQ schema missing`);
  localizedPages += 1;
}
assert.equal(localizedPages, 1308, "all canonical tool pages must remain public and quality-marked in four locales");

const familyTable = [...familyCounts].map(([family, count]) => `| ${family} | ${count} |`).join("\n");
const report = `# AdSense quality program — Stage 1

Generated: 2026-08-11

## Scope and decision boundary

This stage repairs repository-verifiable tool quality, routing, differentiation, and discoverability risks. It does not invent the private AdSense rejection message and does not promise approval; Google alone makes the account decision. The exact rejection wording remains owner-supplied evidence in \`docs/ADSENSE-REJECTION-EVIDENCE.md\`.

## Protected advertising identity

| Check | Verified value |
| --- | --- |
| Seller record | \`google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\` |
| ads.txt SHA-256 | \`${expectedAdsHash.toUpperCase()}\` |
| Auto Ads publisher | \`ca-pub-4158794981134847\` |
| Script loading | asynchronous, \`afterInteractive\` |

Both protected files are read-only inputs to this gate. Any byte-level seller-record change or exact script change fails the audit.

## Catalog quality evidence

| Measure | Result |
| --- | ---: |
| Canonical tools retained | ${publicTools.length} |
| Localized canonical pages retained and indexable | ${localizedPages} |
| Languages per tool | ${locales.length} |
| Tool-specific input/method/output/verification/boundary contracts | ${publicTools.length * locales.length} |
| Unmapped runtime families | 0 |
| Generic fallthrough for unknown tools | 0 — fail-closed |
| Same-category intent pairs above 0.68 similarity | ${nearDuplicates.length} |

## Runtime family register

| Family | Canonical tools |
| --- | ---: |
${familyTable}

## Repairs completed

- Runtime routing now has one explicit resolver. Only the 22 allowlisted legacy tools may use the generic processor; an unknown slug produces a localized visible error instead of plausible but unrelated output.
- All 327 tools are assigned to a real workbench family, and all 1,308 localized tool pages expose the \`catalog-v2\` quality contract while remaining indexable.
- The two closest prompt-tool intents were separated without deleting or hiding either page. Few-shot Dataset Coverage now audits input/output pairs, duplicate inputs, label distribution, and conflicting labels. Prompt Scenario Balance now requires a four-field test-pack contract and audits normal, boundary, negative, and adversarial coverage plus expected-output shapes.
- The new intent-similarity gate prevents a future catalog change from silently reintroducing near-duplicate same-category tools.

## Stage result

Repository-verifiable Stage 1 checks: **PASS**. AdSense account decision: **NOT GUARANTEED / GOOGLE REVIEW REQUIRED**.
`;

if (process.argv.includes("--write")) {
  await writeFile(reportUrl, report, "utf8");
  console.log("Generated AdSense quality-program Stage 1 report.");
} else {
  assert.equal(await readFile(reportUrl, "utf8"), report, "Stage 1 quality-program report is stale; run pnpm quality1:generate");
  console.log(`AdSense quality program Stage 1: PASS (${publicTools.length} tools, ${localizedPages} localized pages)`);
}
