import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { editorialExamples, exampleGuideTools } from "../app/lib/editorial-examples.ts";
import { csvToJson, jsonToCsv } from "../app/lib/csv-conversion.ts";
import { getTool } from "../app/lib/tools.ts";
import { getPost } from "../app/lib/posts.ts";
import { getLocalizedGuide } from "../app/lib/localized-guides.ts";
import { runPrecisionTool } from "../app/components/PrecisionWorkbenches.tsx";

const bySlug = (slug) => editorialExamples.find((example) => example.tool === slug);
test("published month-end fixture clamps leap day before applying calendar days", () => {
  const e = bySlug("tarih-ekle-cikar-hesaplayici");
  for (const locale of ["tr", "en", "de", "zh"]) {
    assert.ok(runPrecisionTool(e.tool, e.input, "", "default", locale).output.includes(e.output));
    assert.ok(runPrecisionTool(e.tool, e.input.replace("\ndays=0", "\ndays=1"), "", "default", locale).output.includes("2024-03-01"));
    assert.throws(() => runPrecisionTool(e.tool, e.counterexample, "", "default", locale));
  }
});
test("published download header preserves Unicode and rejects an empty filename", () => {
  const e = bySlug("content-disposition-olusturucu");
  for (const locale of ["tr", "en", "de", "zh"]) {
    assert.equal(runPrecisionTool(e.tool, e.input, "", "default", locale).output.split("\n")[0], e.output);
    assert.throws(() => runPrecisionTool(e.tool, e.counterexample, "", "default", locale));
  }
});
test("published JSON example preserves types and rejects a trailing comma", () => {
  const e = bySlug("json-bicimlendirici");
  assert.equal(JSON.stringify(JSON.parse(e.input), null, 2), e.output);
  assert.deepEqual(JSON.parse(e.output), { id: "007", enabled: false, items: [] });
  assert.throws(() => JSON.parse(e.counterexample));
});
test("published CSV example uses the production converter in every locale", () => {
  const e = bySlug("json-csv-donusturucu");
  for (const locale of ["tr", "en", "de", "zh"]) {
    const result = csvToJson(e.input, locale);
    assert.equal(result.output, e.output);
    assert.equal(result.records, 1);
    assert.equal(result.columns, 2);
    assert.throws(() => csvToJson(e.counterexample, locale));
    assert.equal(jsonToCsv(e.output, locale).output, e.input);
    assert.throws(() => jsonToCsv('[{"item":{"id":"007"}}]', locale));
    assert.equal(jsonToCsv('[{"cell":"=1+1"}]', locale).output, "cell\n'=1+1");
  }
});
test("published Base64 example round-trips UTF-8 and rejects non-text bytes", () => {
  const e = bySlug("base64-kodlayici");
  const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(e.input)));
  const decode = (value) => new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(value), (character) => character.charCodeAt(0)));
  assert.equal(encoded, e.output);
  assert.equal(decode(e.output), e.input);
  assert.throws(() => decode(e.counterexample));
});
test("published URL example protects separators and distinguishes form decoding", () => {
  const e = bySlug("url-kodlayici");
  assert.equal(encodeURIComponent(e.input), e.output);
  assert.equal(decodeURIComponent(e.output), e.input);
  assert.equal(decodeURIComponent("a+b"), "a+b");
  assert.notEqual(encodeURIComponent(e.output), e.output);
  assert.throws(() => decodeURIComponent(e.counterexample));
});
test("example routes and explanations exist in all four languages", () => {
  for (const e of editorialExamples) {
    assert.ok(getTool(e.tool));
    assert.match(e.source.url, /^https:\/\/(developer\.mozilla\.org|www\.rfc-editor\.org)\//);
    for (const locale of ["tr", "en", "de", "zh"]) {
      assert.ok(e.title[locale] && e.explanation[locale] && e.caution[locale]);
    }
  }
  for (const slug of Object.keys(exampleGuideTools)) {
    assert.ok(getPost(slug));
    assert.ok(getLocalizedGuide(slug));
  }
});

test("exported example pages expose the actual fixtures and sources in every language", async () => {
  const decode = (html) => html.replace(/<script\b[\s\S]*?<\/script>/giu, "")
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  for (const locale of ["tr", "en", "de", "zh"]) {
    for (const example of editorialExamples) {
      const prefix = locale === "tr" ? "araclar" : `${locale}/tools`;
      const html = decode(await readFile(new URL(`../out/${prefix}/${example.tool}/index.html`, import.meta.url), "utf8"));
      for (const value of [example.input, example.output, example.counterexample, example.explanation[locale], example.caution[locale], example.source.url]) {
        assert.ok(html.includes(value), `${locale}/${example.tool}: missing visible example content`);
      }
    }
  }
});
