import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { publicTools } from "../app/lib/tools.ts";
import { getToolGuidanceDetails } from "../app/lib/tool-guidance.ts";
import { createAgentPlan } from "../app/lib/agent-core.ts";
import { AGENT_VERSION } from "../app/lib/agent-session.ts";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("ByteQuant AI 7.5 keeps the complete catalog available to natural-language routing", () => {
  assert.equal(AGENT_VERSION, "ByteQuant AI 7.5");
  assert.equal(publicTools.length, 327);
  const examples = [
    ["Fotoğrafları tek bir PDF dosyası yap", "tr", "gorselden-pdf"],
    ["Format and validate this JSON", "en", "json-bicimlendirici"],
    ["JWT dekodieren und Zeitangaben prüfen", "de", "jwt-decoder"],
    ["把 CSV 转换成 JSON", "zh", "json-csv-donusturucu"],
  ];
  for (const [goal, locale, slug] of examples) {
    const plan = createAgentPlan(goal, publicTools, locale);
    assert.equal(plan.steps[0]?.toolSlug, slug, `${locale}: ${goal}`);
  }
});

test("all 327 tool pages receive a localized input, method, output, verification, and boundary contract", () => {
  for (const tool of publicTools) {
    const guidance = getToolGuidanceDetails(tool);
    for (const locale of ["tr", "en", "de", "zh"]) {
      for (const field of ["input", "method", "output", "verification", "boundary"]) {
        const minimumLength = locale === "zh" ? 12 : 24;
        assert.ok(
          guidance[field][locale].trim().length >= minimumLength,
          `${tool.slug}/${locale}: thin ${field}`,
        );
      }
    }
  }
});

test("the tool-specific run brief and runtime families improve every workbench without replacing it", async () => {
  const [page, brief, workbench, css] = await Promise.all([
    source("app/components/ToolPage.tsx"),
    source("app/components/ToolRunBrief.tsx"),
    source("app/components/ToolWorkbench.tsx"),
    source("app/globals.css"),
  ]);
  assert.match(page, /data-input-output-contract="guided-v3"/);
  assert.match(page, /<ToolRunBrief[\s\S]*<ToolWorkbench/);
  assert.match(brief, /tool-specific-run-contract/);
  assert.match(brief, /guidance\.input\[locale\]/);
  assert.match(brief, /guidance\.output\[locale\]/);
  assert.match(brief, /guidance\.verification\[locale\]/);
  assert.match(brief, /tool\.steps\[locale\]/);
  assert.match(workbench, /data-input-experience=\{experience\}/);
  assert.match(workbench, /tool-runtime-\$\{experience\}/);
  assert.match(css, /\.tool-run-brief/);
  assert.match(css, /\.tool-runtime-anchor textarea/);
  assert.match(css, /\.tool-runtime-structured/);
  assert.match(css, /\.tool-runtime-guided/);
});
