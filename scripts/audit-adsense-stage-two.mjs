import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { publicTools } from "../app/lib/tools.ts";
import { getToolGuidanceDetails } from "../app/lib/tool-guidance.ts";
import { posts } from "../app/lib/posts.ts";
import { localizedGuides } from "../app/lib/localized-guides.ts";
import { toolPath } from "../app/lib/site.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reportUrl = new URL("../docs/ADSENSE-STAGE-2-CONTENT-REPORT.md", import.meta.url);
const locales = ["tr", "en", "de", "zh"];
const expectedAds = "google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\n";
const expectedAdsHash = "615d7aea69afeecc9d6cbdbd5692db5329ead488c685cfd6e73f5a67f5eebc61";
const expectedScript = '<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />';

const [adsTxt, layout] = await Promise.all([readFile(join(root, "public", "ads.txt"), "utf8"), readFile(join(root, "app", "layout.tsx"), "utf8")]);
assert.equal(adsTxt, expectedAds, "protected ads.txt seller record changed");
assert.equal(createHash("sha256").update(adsTxt).digest("hex"), expectedAdsHash, "protected ads.txt hash changed");
assert.ok(layout.includes(expectedScript), "protected AdSense Auto Ads script changed");

assert.equal(publicTools.length, 309, "Stage 2 expects 309 canonical tools");
const guidanceProfiles = new Map();
for (const locale of locales) {
  assert.equal(new Set(publicTools.map((tool) => JSON.stringify(tool.useCases[locale]))).size, publicTools.length, `${locale}: use-case sets must be tool-specific`);
  assert.equal(new Set(publicTools.map((tool) => JSON.stringify(tool.steps[locale]))).size, publicTools.length, `${locale}: HowTo steps must be tool-specific`);
}

for (const tool of publicTools) {
  const details = getToolGuidanceDetails(tool);
  for (const locale of locales) {
    const minimum = locale === "zh" ? 18 : 45;
    assert.equal(tool.useCases[locale].length, 3, `${tool.slug}/${locale}: needs three use cases`);
    assert.equal(tool.steps[locale].length, 3, `${tool.slug}/${locale}: needs three HowTo steps`);
    assert.ok(tool.useCases[locale].every((item) => item.length >= minimum), `${tool.slug}/${locale}: shallow use case`);
    assert.ok(tool.steps[locale].every((item) => item.length >= minimum), `${tool.slug}/${locale}: shallow HowTo step`);
    for (const field of ["input", "method", "output", "verification", "boundary"]) assert.ok(details[field][locale].length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}: shallow ${field} guidance`);
  }
  const profileKey = JSON.stringify(details.input);
  guidanceProfiles.set(profileKey, (guidanceProfiles.get(profileKey) ?? 0) + 1);
}

const allGuides = posts.length + localizedGuides.length;
assert.ok(posts.length >= 80, "TR/EN editorial library unexpectedly small");
assert.ok(localizedGuides.length >= 20, "DE/ZH editorial library unexpectedly small");
assert.equal(new Set(posts.map((post) => post.slug)).size, posts.length, "TR/EN guide slugs must be unique");
assert.equal(new Set(localizedGuides.map((guide) => guide.slug)).size, localizedGuides.length, "DE/ZH guide slugs must be unique");
for (const post of posts) {
  assert.ok(post.relatedTools.length >= 1, `${post.slug}: missing related tool workflow`);
  for (const locale of ["tr", "en"]) {
    assert.ok(post.sections[locale].length >= 3, `${post.slug}/${locale}: fewer than three sections`);
    assert.ok(post.sections[locale].reduce((sum, section) => sum + section.paragraphs.length, 0) >= 6, `${post.slug}/${locale}: fewer than six explanatory paragraphs`);
  }
}
for (const guide of localizedGuides) {
  assert.ok(guide.relatedTools.length >= 1, `${guide.slug}: missing related tool workflow`);
  for (const locale of ["de", "zh"]) {
    assert.ok(guide.copy[locale].sections.length >= 3, `${guide.slug}/${locale}: fewer than three sections`);
    assert.ok(guide.copy[locale].sections.reduce((sum, section) => sum + section.paragraphs.length, 0) >= 6, `${guide.slug}/${locale}: fewer than six explanatory paragraphs`);
  }
}

let localizedPages = 0;
for (const tool of publicTools) {
  for (const locale of locales) {
    const relative = toolPath(locale, tool.slug).replace(/^\//, "");
    const html = await readFile(join(root, "out", relative, "index.html"), "utf8");
    assert.match(html, /data-tool-intent="specific"/, `${tool.slug}/${locale}: missing specific intent panel`);
    assert.match(html, /data-guide-links="editorial"/, `${tool.slug}/${locale}: missing guide workflow`);
    assert.match(html, /"@type":"HowTo"/, `${tool.slug}/${locale}: missing HowTo schema`);
    assert.match(html, /"@type":"FAQPage"/, `${tool.slug}/${locale}: missing FAQ schema`);
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `${tool.slug}/${locale}: canonical tool hidden from indexing`);
    localizedPages += 1;
  }
}

const profileCounts = [...guidanceProfiles.values()].sort((a, b) => b - a);
const report = `# AdSense remediation — Stage 2 content report

Generated: 2026-08-09

## Scope

Stage 2 replaces repeated instructional copy with intent-aware guidance. It does not hide, remove, or noindex canonical tools. Each tool now describes its expected input, local method, output contract, verification test, limitation, suitable scenarios, and three-step acceptance path in Turkish, English, German, and Simplified Chinese.

## Protected advertising identity

| Check | Result |
| --- | --- |
| Seller record | \`google.com, pub-4158794981134847, DIRECT, f08c47fec0942fa0\` |
| ads.txt SHA-256 | \`${expectedAdsHash.toUpperCase()}\` |
| Auto Ads publisher | \`ca-pub-4158794981134847\` |

## Evidence

| Measure | Verified |
| --- | ---: |
| Canonical tools | ${publicTools.length} |
| Localized canonical pages | ${localizedPages} |
| Unique use-case sets in every locale | ${publicTools.length} × 4 |
| Unique HowTo step sets in every locale | ${publicTools.length} × 4 |
| Intent-aware input/method/output/verification profiles | ${guidanceProfiles.size} |
| TR/EN guides with multi-section depth | ${posts.length} |
| DE/ZH guides with multi-section depth | ${localizedGuides.length} |
| Total editorial guide records | ${allGuides} |
| Largest intentional input-profile family | ${profileCounts[0] ?? 0} tools |

## Editorial decisions

- Generic privacy boilerplate no longer occupies three of four tool FAQs. Each page answers the tool-specific input, expected output, verification method, and on-device data boundary.
- HowTo copy now names the accepted data shape, the actual local method, a concrete acceptance check, and the relevant category limitation.
- The quick-answer panel exposes input, output, method, and verification as separate visible fields; matching FAQ and HowTo structured data are generated from the same source.
- Tool-to-guide links remain visible and every guide is tied to working tool routes. Canonical tool URLs remain indexable.
- Shared technical profiles are intentional only where input contracts genuinely match; tool goals, use cases, steps, titles, descriptions, and verification sentences remain distinct.

## Gate result

Repository-verifiable Stage 2 checks: **PASS**. This evidence improves content usefulness and consistency but does not promise AdSense approval; Google makes the final decision and the exact account-side rejection wording remains owner evidence.
`;

if (process.argv.includes("--write")) {
  await writeFile(reportUrl, report, "utf8");
  console.log("Generated Stage 2 AdSense content report.");
} else {
  assert.equal(await readFile(reportUrl, "utf8"), report, "Stage 2 report is stale; run pnpm stage2:generate");
  console.log(`AdSense Stage 2 audit: PASS (${localizedPages} localized pages, ${allGuides} guide records)`);
}
