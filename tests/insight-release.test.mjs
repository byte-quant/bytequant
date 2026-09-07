import assert from "node:assert/strict";
import test from "node:test";

import { insightLocalizedGuides, insightPosts } from "../app/lib/insight-guides.ts";
import { insightDefinitions, runInsightTool } from "../app/lib/insight-runtime.ts";
import { insightToolCount, insightToolSlugs, insightTools } from "../app/lib/insight-tools.ts";
import { publicTools } from "../app/lib/tools.ts";

const locales = ["tr", "en", "de", "zh"];

test("ships fifteen distinct local tools with complete four-language contracts", () => {
  assert.equal(insightToolCount, 15);
  assert.equal(insightTools.length, 15);
  assert.equal(new Set(insightTools.map((tool) => tool.slug)).size, 15);
  assert.deepEqual(new Set(Object.keys(insightDefinitions)), new Set(insightTools.map((tool) => tool.slug)));

  for (const locale of locales) {
    assert.equal(new Set(insightTools.map((tool) => tool.title[locale])).size, 15);
    assert.equal(new Set(insightTools.map((tool) => tool.short[locale])).size, 15);
    assert.equal(new Set(insightTools.map((tool) => tool.description[locale])).size, 15);
    for (const tool of insightTools) {
      assert.ok(tool.title[locale].length > 5, `${tool.slug} lacks a ${locale} title`);
      assert.ok(tool.short[locale].length > (locale === "zh" ? 14 : 30), `${tool.slug} has a shallow ${locale} summary`);
      assert.ok(tool.description[locale].length > (locale === "zh" ? 45 : 100), `${tool.slug} has a shallow ${locale} description`);
      assert.equal(tool.useCases[locale].length, 3);
      assert.equal(tool.steps[locale].length, 3);
    }
  }

  for (const tool of insightTools) {
    assert.ok(publicTools.some((entry) => entry.slug === tool.slug), `${tool.slug} is missing from the public catalog`);
    assert.ok(insightToolSlugs.has(tool.slug), `${tool.slug} is not routed to its field-based workbench`);
  }
});

test("every new tool runs its worked example in every locale", () => {
  for (const tool of insightTools) {
    const definition = insightDefinitions[tool.slug];
    assert.ok(definition.fields.length > 0, `${tool.slug} has no input fields`);
    for (const locale of locales) {
      const result = runInsightTool(tool.slug, definition.demo, locale);
      assert.ok(result.output.length > 80, `${tool.slug} returned a shallow ${locale} result`);
      assert.ok(result.metrics?.length, `${tool.slug} returned no measurable ${locale} result`);
      assert.doesNotMatch(result.output, /undefined|\[object Object\]/u);
    }
  }
});

test("new processors preserve their task-specific correctness boundaries", () => {
  const csv = runInsightTool("csv-satir-fark-uzlastirici", insightDefinitions["csv-satir-fark-uzlastirici"].demo, "en");
  assert.match(csv.output, /Added/u);
  assert.match(csv.output, /Removed/u);
  assert.match(csv.output, /Changed/u);
  assert.throws(() => runInsightTool("csv-satir-fark-uzlastirici", { before: "id,name\n1,A\n1,B", after: "id,name\n1,A", key: "id" }, "en"), /duplicated/u);

  const profile = runInsightTool("json-alan-tip-profilleyici", insightDefinitions["json-alan-tip-profilleyici"].demo, "en");
  assert.match(profile.output, /Mixed-type|Types/u);

  const latency = runInsightTool("yanit-suresi-yuzdelik-hesaplayici", { samples: "10, 20, 30, 40, 50, 60, 70, 80, 90, 100" }, "en");
  assert.match(latency.output, /p95/u);
  assert.match(latency.output, /100/u);

  assert.throws(() => runInsightTool("api-hata-zarfi-dogrulayici", { json: "not-json", traceRequired: true }, "en"), /valid error JSON/u);
});

test("publishes seven original long guides in Turkish, English, German, and Chinese", () => {
  assert.equal(insightPosts.length, 7);
  assert.equal(insightLocalizedGuides.length, 7);
  assert.equal(new Set(insightPosts.map((guide) => guide.slug)).size, 7);
  assert.deepEqual(new Set(insightLocalizedGuides.map((guide) => guide.slug)), new Set(insightPosts.map((guide) => guide.slug)));

  for (const post of insightPosts) {
    assert.ok(post.relatedTools.length >= 4);
    assert.equal(post.sources?.length, 1);
    assert.match(post.sources[0].url, /^https:\/\//u);
    for (const locale of ["tr", "en"]) {
      const sections = post.sections[locale];
      assert.equal(sections.length, 7);
      assert.ok(sections.every((section) => section.paragraphs.length === 2));
      assert.ok(sections.flatMap((section) => section.paragraphs).join(" ").length > 2200, `${post.slug} ${locale} copy is too shallow`);
    }
  }

  for (const guide of insightLocalizedGuides) {
    for (const locale of ["de", "zh"]) {
      const sections = guide.copy[locale].sections;
      assert.equal(sections.length, 7);
      assert.ok(sections.every((section) => section.paragraphs.length === 2));
      assert.ok(sections.flatMap((section) => section.paragraphs).join(" ").length > (locale === "zh" ? 650 : 1900), `${guide.slug} ${locale} copy is too shallow`);
    }
  }
});
