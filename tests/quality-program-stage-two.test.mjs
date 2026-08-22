import assert from "node:assert/strict";
import test from "node:test";
import { stageTwoTools, stageTwoToolSlugs } from "../app/lib/stage-two-tools.ts";
import { stageTwoDemos, runStageTwoTool } from "../app/components/StageTwoWorkbenches.tsx";
import { stageTwoPosts, stageTwoLocalizedGuides } from "../app/lib/stage-two-guides.ts";
import { publicTools } from "../app/lib/tools.ts";

const locales = ["tr", "en", "de", "zh"];

test("Stage 2 publishes eight unique tools with four-language product contracts", () => {
  assert.equal(stageTwoTools.length, 8);
  assert.equal(stageTwoToolSlugs.size, 8);
  assert.equal(publicTools.length, 327);
  for (const tool of stageTwoTools) {
    assert.ok(stageTwoDemos[tool.slug]?.input.trim(), `${tool.slug}: missing demo`);
    for (const locale of locales) {
      assert.ok(tool.title[locale]?.length >= 8, `${tool.slug}/${locale}: missing title`);
      assert.ok(tool.description[locale]?.length >= (locale === "zh" ? 40 : 100), `${tool.slug}/${locale}: shallow description`);
      assert.equal(tool.useCases[locale]?.length, 3);
      assert.equal(tool.steps[locale]?.length, 3);
    }
  }
});

test("every Stage 2 demo produces structured, non-echo output in all languages", () => {
  for (const slug of stageTwoToolSlugs) {
    const demo = stageTwoDemos[slug];
    for (const locale of locales) {
      const result = runStageTwoTool(slug, demo.input, demo.secondary ?? "", locale);
      assert.ok(result.output.trim().length > 30, `${slug}/${locale}: shallow output`);
      assert.notEqual(result.output.trim(), demo.input.trim(), `${slug}/${locale}: echoed input`);
      assert.ok(result.metrics.length >= 2, `${slug}/${locale}: metrics missing`);
      assert.ok(result.warning.trim().length >= (locale === "zh" ? 15 : 45), `${slug}/${locale}: boundary missing`);
    }
  }
});

test("Stage 2 processors reject malformed or incomplete input", () => {
  assert.throws(() => runStageTwoTool("json-schema-geriye-uyumluluk-denetleyici", "{}", "", "en"));
  assert.throws(() => runStageTwoTool("openapi-kirilma-degisikligi-denetleyici", "not-json", "{}", "en"));
  assert.throws(() => runStageTwoTool("csv-eksik-veri-deseni-analizoru", "only-header", "", "en"));
  assert.throws(() => runStageTwoTool("html-tablo-erisilebilirlik-denetleyici", "<p>no table</p>", "", "en"));
  assert.throws(() => runStageTwoTool("borc-odeme-stratejisi-karsilastirici", "Card|1000|20|100", "50", "en"));
});

test("Stage 2 guides are long, original, and complete in every locale", () => {
  assert.equal(stageTwoPosts.length, 4);
  assert.equal(stageTwoLocalizedGuides.length, 4);
  assert.deepEqual(new Set(stageTwoPosts.map((post) => post.slug)), new Set(stageTwoLocalizedGuides.map((guide) => guide.slug)));
  for (const post of stageTwoPosts) {
    assert.ok(post.relatedTools.some((slug) => stageTwoToolSlugs.has(slug)), `${post.slug}: no Stage 2 tool link`);
    for (const locale of ["tr", "en"]) {
      assert.equal(post.sections[locale].length, 6);
      assert.ok(post.sections[locale].flatMap((section) => section.paragraphs).join(" ").length >= (locale === "tr" ? 1800 : 1600), `${post.slug}/${locale}: guide too short`);
    }
    const localized = stageTwoLocalizedGuides.find((guide) => guide.slug === post.slug);
    for (const locale of ["de", "zh"]) {
      assert.equal(localized.copy[locale].sections.length, 6);
      assert.ok(localized.copy[locale].sections.flatMap((section) => section.paragraphs).join(" ").length >= (locale === "zh" ? 500 : 1200), `${post.slug}/${locale}: guide too short`);
    }
  }
});
