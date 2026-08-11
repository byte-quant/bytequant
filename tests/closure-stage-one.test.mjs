import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getToolGuidanceDetails } from "../app/lib/tool-guidance.ts";
import { publicTools } from "../app/lib/tools.ts";

const locales = ["tr", "en", "de", "zh"];

test("all legacy generic workbenches have native four-locale demos", async () => {
  const source = await readFile(new URL("../app/components/ToolWorkbench.tsx", import.meta.url), "utf8");
  const slugBlock = source.match(/export const legacyGenericToolSlugs = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
  const sampleBlock = source.match(/export const legacyGenericSamples:[\s\S]*?= \{([\s\S]*?)\n\};\n\nfunction secondarySample/)?.[1] ?? "";
  const slugs = [...slugBlock.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
  const rows = sampleBlock.split("\n").filter((line) => /^  "[a-z0-9-]+": \{ tr:/.test(line));
  assert.equal(new Set(slugs).size, 22);
  assert.equal(rows.length, 20, "the two no-input generators intentionally need no demo text");
  for (const row of rows) {
    for (const locale of locales) assert.match(row, new RegExp(`(?:^|[, {])${locale}: \\"`), `${locale} demo missing: ${row.slice(0, 60)}`);
  }
});

test("all 317 tools publish a concrete three-scenario acceptance contract", () => {
  assert.equal(publicTools.length, 317);
  for (const tool of publicTools) {
    const guidance = getToolGuidanceDetails(tool);
    for (const locale of locales) {
      assert.ok(tool.steps[locale][1].length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}: normal scenario`);
      assert.ok(guidance.input[locale].length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}: malformed-input contract`);
      assert.ok(guidance.verification[locale].length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}: verification contract`);
      assert.ok(guidance.boundary[locale].length >= (locale === "zh" ? 12 : 35), `${tool.slug}/${locale}: boundary contract`);
    }
  }
});

test("tool pages expose tool-specific limits and the acceptance marker", async () => {
  const [toolPage, editorial, workbench] = await Promise.all([
    readFile(new URL("../app/components/ToolPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ToolEditorialReview.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ToolWorkbench.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(toolPage, /guidance\.boundary\[locale\]/);
  assert.doesNotMatch(toolPage, /Automated output is a preliminary assessment/);
  assert.match(editorial, /data-tool-acceptance="three-scenario"/);
  assert.match(editorial, /guidance\.verification\[locale\]/);
  assert.match(workbench, /legacyGenericSamples\[slug\]\?\.\[locale\]/);
});

test("high-risk legacy tools publish boundaries that match their real operation", () => {
  const jwt = publicTools.find((tool) => tool.slug === "jwt-decoder");
  const cron = publicTools.find((tool) => tool.slug === "cron-ifadesi-aciklayici");
  const regex = publicTools.find((tool) => tool.slug === "regex-test-araci");
  const masking = publicTools.find((tool) => tool.slug === "kvkk-veri-maskeleyici");
  assert.ok(jwt && cron && regex && masking);

  const jwtBoundary = getToolGuidanceDetails(jwt).boundary;
  assert.match(jwtBoundary.tr, /imzayı/);
  assert.match(jwtBoundary.en, /signature/);
  assert.match(jwtBoundary.de, /Signatur/);
  assert.match(jwtBoundary.zh, /签名/);

  const cronBoundary = getToolGuidanceDetails(cron).boundary;
  assert.match(cronBoundary.tr, /saat dilimini/);
  assert.match(cronBoundary.en, /time zone/);
  assert.match(cronBoundary.de, /Zeitzone/);
  assert.match(cronBoundary.zh, /时区/);

  assert.match(getToolGuidanceDetails(regex).boundary.en, /backtracking/);
  assert.match(getToolGuidanceDetails(masking).boundary.en, /re-identification/);
});
