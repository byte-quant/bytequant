import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { publicTools } from "../app/lib/tools.ts";
import { precisionDemos, runPrecisionTool } from "../app/components/PrecisionWorkbenches.tsx";
import { frontierDemos, runFrontierTool } from "../app/components/FrontierWorkbenches.tsx";

test("runtime dispatch is explicit and unknown tools fail closed", async () => {
  const source = await readFile(new URL("../app/components/ToolWorkbench.tsx", import.meta.url), "utf8");
  assert.match(source, /export function getToolRuntimeFamily/);
  assert.match(source, /if \(legacyGenericToolSlugs\.has\(slug\)\) return "generic"/);
  assert.match(source, /return "unsupported"/);
  assert.match(source, /data-runtime-family="unsupported"/);
  assert.doesNotMatch(source, /return <GenericToolWorkbench slug=\{slug\} locale=\{locale\} \/>;\s*\n}\s*\n\s*function GenericToolWorkbench/);
});

test("every canonical page publishes the catalog-v2 tool contract", async () => {
  const source = await readFile(new URL("../app/components/ToolPage.tsx", import.meta.url), "utf8");
  assert.equal(publicTools.length, 317);
  assert.match(source, /data-tool-quality-contract="catalog-v2"/);
  assert.match(source, /data-tool-slug=\{tool\.slug\}/);
});

test("the closest prompt tools now use separate input and result contracts", async () => {
  const coverageDemo = precisionDemos["few-shot-kapsama-analizoru"];
  const scenarioDemo = frontierDemos["prompt-ornek-denge-analizoru"];
  const coverage = runPrecisionTool("few-shot-kapsama-analizoru", coverageDemo.input, "", "default", "en");
  const scenario = await runFrontierTool("prompt-ornek-denge-analizoru", scenarioDemo.input, "", "default", "en");
  assert.match(coverage.output, /Conflicting labels for the same input: 1/);
  assert.match(coverage.output, /Largest\/smallest label ratio:/);
  assert.match(scenario.output, /\| case type \| count \| status \|/i);
  assert.match(scenario.output, /Missing scenario types: 0/);
  assert.notEqual(coverage.output, scenario.output);
  await assert.rejects(() => runFrontierTool("prompt-ornek-denge-analizoru", "positive|normal|missing output", "", "default", "en"), /must use class\|case type\|example input\|expected output/);
});

test("few-shot examples expose their real input-to-output format in all languages", async () => {
  const source = await readFile(new URL("../app/components/PrecisionWorkbenches.tsx", import.meta.url), "utf8");
  assert.match(source, /Her örneği ayrı satıra girdi => beklenen çıktı biçiminde yazın\./);
  assert.match(source, /Put each example on its own line as input => expected output\./);
  assert.match(source, /Eingabe => erwartete Ausgabe/);
  assert.match(source, /输入 => 预期输出/);
  assert.match(source, /kind: "input => output"/);
});

test("scenario-balance output and metrics are localized in every supported language", async () => {
  const demo = frontierDemos["prompt-ornek-denge-analizoru"];
  const translations = { tr: /Senaryo türü/, de: /Szenariotyp/, zh: /场景类型/ };
  for (const [locale, expected] of Object.entries(translations)) {
    const result = await runFrontierTool("prompt-ornek-denge-analizoru", demo.input, "", "default", locale);
    assert.match(result.output, expected);
    assert.doesNotMatch(result.output, /Class ratio|Duplicate input\/output pairs|Expected-output shapes|Missing scenario types/);
    assert.ok(result.metrics?.some(([label]) => expected.test(label)), `${locale}: scenario metric was not localized`);
  }
});
