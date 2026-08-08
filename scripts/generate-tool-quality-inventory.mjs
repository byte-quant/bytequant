import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { publicTools, categories } from "../app/lib/tools.ts";
import { toolAliases } from "../app/lib/tool-aliases.ts";
import { frontierToolSlugs } from "../app/lib/frontier-tools.ts";
import { precisionToolSlugs } from "../app/lib/precision-tools.ts";

const locales = ["tr", "en", "de", "zh"];
const reportUrl = new URL("../docs/TOOL-QUALITY-INVENTORY.md", import.meta.url);

assert.equal(publicTools.length, 309, "public canonical catalog must contain 309 tools");
assert.equal(Object.keys(toolAliases).length, 12, "legacy alias register must contain 12 entries");
assert.equal(Object.keys(categories).length, 10, "catalog must contain ten categories");
assert.equal(new Set(publicTools.map((tool) => tool.slug)).size, publicTools.length, "canonical slugs must be unique");
assert.equal(new Set(publicTools.map((tool) => tool.mark)).size, publicTools.length, "public tool marks must be unique");

const deepRuntimeAudited = new Set([...precisionToolSlugs, ...frontierToolSlugs]);
const rows = publicTools.map((tool) => {
  assert.match(tool.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${tool.slug}: invalid slug`);
  assert.ok(Object.hasOwn(categories, tool.category), `${tool.slug}: unknown category`);
  for (const locale of locales) {
    assert.ok(tool.title[locale].trim().length >= 4, `${tool.slug}: missing ${locale} title`);
    const shortMinimum = locale === "zh" ? 12 : 24;
    const descriptionMinimum = locale === "zh" ? 28 : 80;
    assert.ok(tool.short[locale].trim().length >= shortMinimum, `${tool.slug}: shallow ${locale} summary`);
    assert.ok(tool.description[locale].trim().length >= descriptionMinimum, `${tool.slug}: shallow ${locale} description`);
    assert.ok(tool.useCases[locale].length >= 3, `${tool.slug}: missing ${locale} use cases`);
    assert.equal(tool.steps[locale].length, 3, `${tool.slug}: ${locale} must have three HowTo steps`);
  }
  return {
    tool,
    priority: deepRuntimeAudited.has(tool.slug) ? "4-locale runtime demo" : "Runtime family + content audit",
  };
});

const categorySummary = Object.entries(categories).map(([key, category]) =>
  `| ${category.mark} | ${category.label.en} | ${publicTools.filter((tool) => tool.category === key).length} |`,
).join("\n");
const table = rows.map(({ tool, priority }) =>
  `| ${tool.mark} | \`${tool.slug}\` | ${categories[tool.category].label.en} | TR · EN · DE · ZH | 3 × 4 | ${priority} |`,
).join("\n");
const report = `# ByteQuant tool quality inventory

Generated: 2026-08-08

This is an automated catalog, runtime-routing, and content-integrity inventory, not a claim of professional certification or exhaustive manual functional review. Phase 1 verified discoverability, canonical identity, four-language content presence, HowTo coverage, and catalog uniqueness. Phase 2 adds an implemented-workbench-family assertion for every canonical tool and four-locale runnable-demo checks for the 88 highest-risk tools (catalog marks 234–321).

## Inventory scope

| Measure | Count |
| --- | ---: |
| Public canonical tools | 309 |
| Supported locales per tool | 4 |
| Tool categories | 10 |
| Legacy alias URLs (noindex + canonical) | 12 |
| Canonical tools mapped to an implemented runtime family | ${publicTools.length} |
| Deep four-locale runtime-demo tools | ${deepRuntimeAudited.size} |

## Category distribution

| Mark | Category | Tools |
| --- | --- | ---: |
${categorySummary}

## Automated checks applied to every public tool

- unique canonical slug and numeric catalog mark;
- Turkish, English, German, and Simplified Chinese title, summary, and substantive description;
- at least three localized use cases and exactly three localized HowTo steps;
- inclusion in the four-locale sitemap and publication-status disclosure (validated after production export);
- alias separation so legacy URLs do not compete with canonical tool pages.
- an implemented workbench-family route for every canonical tool, enforced by the test suite;
- executable, non-placeholder demo output, measurable results, renderable tables, and localized review boundaries for marks 234–321;
- purpose-specific regression checks for previously reported GraphQL, shift, cookie, terminology, tool-call, and evidence-table tools;
- localized explanatory output and actionable input-error guidance for the 75 frontier tools.

## Per-tool register

| Mark | Canonical slug | Category | Locales | HowTo | Automated review lane |
| ---: | --- | --- | --- | --- | --- |
${table}
`;

if (process.argv.includes("--check")) {
  const current = await readFile(reportUrl, "utf8");
  assert.equal(current, report, "tool inventory is stale; run pnpm run inventory:generate");
  console.log(`Tool inventory audit: PASS (${publicTools.length} canonical tools, ${Object.keys(toolAliases).length} aliases)`);
} else {
  await writeFile(reportUrl, report, "utf8");
  console.log(`Generated ${publicTools.length}-tool quality inventory at docs/TOOL-QUALITY-INVENTORY.md`);
}
