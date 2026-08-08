import test from "node:test";
import assert from "node:assert/strict";
import { publicTools } from "../app/lib/tools.ts";
import { getToolGuidanceDetails } from "../app/lib/tool-guidance.ts";

const locales = ["tr", "en", "de", "zh"];

test("publishes tool-specific use cases and acceptance steps in every locale", () => {
  assert.equal(publicTools.length, 309);
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
