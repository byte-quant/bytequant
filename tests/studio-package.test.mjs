import assert from "node:assert/strict";
import test from "node:test";

import { runStudioTool } from "../app/components/StudioWorkbenches.tsx";
import { studioLocalizedGuides, studioPosts } from "../app/lib/studio-guides.ts";
import { studioTools } from "../app/lib/studio-tools.ts";
import { studioToolGuidance, studioGuidanceSlugs } from "../app/lib/studio-tool-guidance.ts";
import { studioToolDeepDives, studioToolDeepDiveSlugs } from "../app/lib/studio-tool-deep-dives.ts";

const locales = ["tr", "en", "de", "zh"];
const fixtures = {
  "retry-after-geri-cekilme-planlayici": { method: "GET", status: "429", retryAfter: "8", attempts: "4", baseMs: "500", capMs: "30000", jitter: "20" },
  "webhook-teslim-gunlugu-analizoru": { records: "2026-08-22T09:00:00Z|evt_1|500|420|1\n2026-08-22T09:00:03Z|evt_1|200|180|2" },
  "aria-erisebilir-ad-envanteri": { html: '<button aria-label="Open menu"></button><button><svg></svg></button>' },
  "html-dil-baslik-yapisi-denetleyici": { html: '<html lang="en"><head><title>Useful local HTML review</title><meta name="description" content="Review the language and heading structure before publishing."></head><body><h1>Review</h1><h2>Steps</h2></body></html>' },
  "sitemap-url-kume-analizoru": { urls: "https://bytequant.org/araclar/json-bicimlendirici/\nhttps://bytequant.org/en/tools/json-bicimlendirici/" },
  "robots-meta-politikasi-olusturucu": { index: true, follow: true, archive: true, largeImage: true, maxSnippet: "180" },
  "eposta-konu-onizleme-denetleyici": { subject: "Your weekly report is ready", preheader: "Review the three changes and the next practical action." },
  "web-performans-butce-planlayici": { budget: "900", html: "42", css: "68", js: "310", images: "360", fonts: "70", other: "20" },
  "yedekleme-3-2-1-hazirlik-denetleyici": { copies: "3", media: "2", offsite: true, encrypted: true, restoreDate: "2026-08-01", rto: "4" },
  "surum-notu-degisiklik-derleyici": { changes: "feat(agent): add contextual suggestions\nfix(mobile): prevent clipped actions\nsecurity: reject unsafe links" },
};

test("ships ten distinct purpose-built tools in all four languages", () => {
  assert.equal(studioTools.length, 10);
  assert.equal(new Set(studioTools.map((tool) => tool.slug)).size, 10);
  for (const tool of studioTools) for (const locale of locales) {
    assert.ok(tool.title[locale].length > 4, `${tool.slug}/${locale}/title`);
    assert.ok(tool.description[locale].length >= (locale === "zh" ? 35 : 100), `${tool.slug}/${locale}/description`);
    assert.equal(tool.steps[locale].length, 3, `${tool.slug}/${locale}/steps`);
    assert.ok(tool.useCases[locale].length >= 3, `${tool.slug}/${locale}/use-cases`);
  }
});

test("every studio tool executes a representative input in every locale", () => {
  const nodeRunnable = studioTools.filter((tool) => !["aria-erisebilir-ad-envanteri", "html-dil-baslik-yapisi-denetleyici"].includes(tool.slug));
  for (const tool of nodeRunnable) for (const locale of locales) {
    const result = runStudioTool(tool.slug, fixtures[tool.slug], locale);
    assert.ok(result.output.length > 80, `${tool.slug}/${locale}/output`);
    assert.ok(result.metrics.length >= 2, `${tool.slug}/${locale}/metrics`);
    assert.doesNotMatch(result.output, /undefined|NaN/iu, `${tool.slug}/${locale}/invalid-output`);
  }
});

test("every studio landing page has a hand-written task contract and worked example", () => {
  const expected = studioTools.map((tool) => tool.slug).sort();
  assert.deepEqual([...studioGuidanceSlugs].sort(), expected);
  assert.deepEqual([...studioToolDeepDiveSlugs].sort(), expected);
  for (const tool of studioTools) for (const locale of locales) {
    const guidance = studioToolGuidance[tool.slug];
    const deepDive = studioToolDeepDives[tool.slug];
    for (const field of ["input", "method", "output", "verification", "boundary", "workflow"]) {
      const minimum = field === "workflow" ? (locale === "zh" ? 8 : 25) : (locale === "zh" ? 18 : 45);
      assert.ok(guidance[field][locale].length >= minimum, `${tool.slug}/${locale}/guidance/${field}`);
    }
    for (const field of ["situation", "fixture", "evidence", "failure"]) {
      assert.ok(deepDive[field][locale].length >= (locale === "zh" ? 28 : 75), `${tool.slug}/${locale}/deep-dive/${field}`);
    }
  }
  for (const locale of locales) {
    assert.equal(new Set(studioTools.map((tool) => studioToolGuidance[tool.slug].input[locale])).size, studioTools.length, `${locale}/unique-input-contracts`);
    assert.equal(new Set(studioTools.map((tool) => studioToolDeepDives[tool.slug].fixture[locale])).size, studioTools.length, `${locale}/unique-fixtures`);
  }
});

test("studio processors reject incomplete input instead of inventing a result", () => {
  for (const tool of studioTools) assert.throws(() => runStudioTool(tool.slug, {}, "en"), Error, tool.slug);
});

test("ships five original long guides with complete localized sections", () => {
  assert.equal(studioPosts.length, 5);
  assert.equal(studioLocalizedGuides.length, 5);
  assert.equal(new Set(studioPosts.map((post) => post.slug)).size, 5);
  for (const post of studioPosts) for (const locale of ["tr", "en"]) {
    const sections = post.sections[locale];
    assert.ok(sections.length >= 7, `${post.slug}/${locale}/sections`);
    const words = sections.flatMap((section) => [...section.heading.split(/\s+/u), ...section.paragraphs.flatMap((paragraph) => paragraph.split(/\s+/u)), ...(section.bullets ?? []).flatMap((bullet) => bullet.split(/\s+/u))]).filter(Boolean);
    assert.ok(words.length >= 430, `${post.slug}/${locale}/depth:${words.length}`);
  }
  for (const guide of studioLocalizedGuides) for (const locale of ["de", "zh"]) {
    const sections = guide.copy[locale].sections;
    assert.ok(sections.length >= 7, `${guide.slug}/${locale}/sections`);
    const depth = sections.map((section) => `${section.heading} ${section.paragraphs.join(" ")} ${(section.bullets ?? []).join(" ")}`).join(" ").length;
    assert.ok(depth >= (locale === "zh" ? 900 : 2400), `${guide.slug}/${locale}/depth:${depth}`);
  }
});
