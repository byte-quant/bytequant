import test from "node:test";
import assert from "node:assert/strict";
import { publicTools } from "../app/lib/tools.ts";
import { getToolGuidanceDetails } from "../app/lib/tool-guidance.ts";
import { getToolDeepDive, toolDeepDiveSlugs } from "../app/lib/tool-deep-dives.ts";
import { localizedInfo } from "../app/lib/localized-info.ts";

const locales = ["tr", "en", "de", "zh"];

test("publishes tool-specific use cases and acceptance steps in every locale", () => {
  assert.equal(publicTools.length, 317);
  for (const locale of locales) {
    assert.equal(new Set(publicTools.map((tool) => JSON.stringify(tool.useCases[locale]))).size, publicTools.length);
    assert.equal(new Set(publicTools.map((tool) => JSON.stringify(tool.steps[locale]))).size, publicTools.length);
  }
});

test("describes a concrete input, method, output, verification, and boundary for every tool", () => {
  for (const tool of publicTools) {
    const details = getToolGuidanceDetails(tool);
    for (const locale of locales) {
      for (const field of ["input", "method", "output", "verification", "boundary"]) {
        assert.ok(details[field][locale].trim().length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}/${field}`);
      }
    }
  }
});

test("publishes hand-reviewed worked examples for high-intent tools in every locale", () => {
  const expected = [
    "curl-kod-donusturucu", "exif-meta-veri-temizleyici", "gorsel-sikistirici", "json-bicimlendirici",
    "json-csv-donusturucu", "jwt-decoder", "kvkk-veri-maskeleyici", "markdown-onizleyici",
    "pdf-birlestirme", "qr-kod-olusturucu", "regex-test-araci",
  ];
  assert.deepEqual([...toolDeepDiveSlugs].sort(), expected);
  for (const slug of expected) {
    const deepDive = getToolDeepDive(slug);
    assert.ok(deepDive, slug);
    for (const locale of locales) {
      for (const field of ["situation", "fixture", "evidence", "failure"]) {
        assert.ok(deepDive[field][locale].trim().length >= (locale === "zh" ? 25 : 80), `${slug}/${locale}/${field}`);
      }
    }
  }
});

test("keeps German and Chinese publisher about pages at full editorial depth", () => {
  for (const locale of ["de", "zh"]) {
    const page = localizedInfo[locale].about;
    assert.ok(page.intro.length >= (locale === "zh" ? 25 : 50), locale);
    assert.ok(page.sections.length >= 5, `${locale}/sections`);
    assert.ok(page.sections.every((section) => `${section.paragraphs.join(" ")} ${(section.bullets ?? []).join(" ")}`.length >= (locale === "zh" ? 65 : 120)), `${locale}/section-depth`);
  }
});
