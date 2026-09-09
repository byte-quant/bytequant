import test from "node:test";
import assert from "node:assert/strict";
import { localizeTool } from "../app/lib/tool-locales.ts";
import { publicTools } from "../app/lib/tools.ts";
import { rankToolGuides } from "../app/lib/guide-relevance.ts";
import { reviewedToolGuidance } from "../app/lib/reviewed-tool-guidance.ts";

test("localization retains authored instructions instead of substituting category copy", () => {
  const base = {
    ...publicTools.find((tool) => tool.slug === "json-bicimlendirici"),
    steps: { tr: ["JSON yapıştırın.", "Biçimlendirin.", "Türleri karşılaştırın."], en: ["Paste JSON.", "Format it.", "Compare types."], de: ["JSON einfügen.", "Formatieren.", "Typen vergleichen."], zh: ["粘贴 JSON。", "格式化。", "比较类型。"] },
    useCases: { tr: ["API yanıtı", "Yapılandırma", "Hata inceleme"], en: ["API response", "Configuration", "Debugging"], de: ["API-Antwort", "Konfiguration", "Fehlersuche"], zh: ["API 响应", "配置", "排错"] },
  };
  const localized = localizeTool(base);
  assert.deepEqual(localized.steps, base.steps);
  assert.deepEqual(localized.useCases, base.useCases);
});
test("focused exact-tool guides outrank recent broad roundups and category-only matches", () => {
  const tool = {slug:"json",category:"data"};
  const lookup = (slug) => ({slug,category:slug === "pdf" ? "file" : "data"});
  const guides = [
    {slug:"unrelated",relatedTools:["pdf"]},
    {slug:"new-roundup",relatedTools:["json","csv","yaml","xml"]},
    {slug:"category",relatedTools:["csv"]},
    {slug:"focused",relatedTools:["json"]},
  ];
  assert.deepEqual(rankToolGuides(tool,guides,lookup).map(g=>g.slug),["focused","new-roundup","category"]);
});
test("reviewed explanations disclose operation-specific risks and avoid deterministic password claims", () => {
  assert.match(reviewedToolGuidance["json-bicimlendirici"].boundary.en,/precision/);
  assert.match(reviewedToolGuidance["json-bicimlendirici"].boundary.en,/Duplicate keys/);
  assert.match(reviewedToolGuidance["jwt-decoder"].boundary.en,/server-side/);
  assert.match(reviewedToolGuidance["guclu-parola-uretici"].method.en,/new password/);
  assert.match(reviewedToolGuidance["pdf-birlestirme"].boundary.en,/signatures/);
  for(const [slug,record] of Object.entries(reviewedToolGuidance)) for(const locale of ["tr","en","de","zh"]) {
    const paragraphs=Object.values(record).map(field=>field[locale]);
    assert.equal(new Set(paragraphs).size,5,slug+"/"+locale);
    assert.ok(paragraphs.every(value=>value && !value.includes("undefined")),slug+"/"+locale);
  }
});
