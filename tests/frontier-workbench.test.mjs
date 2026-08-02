import assert from "node:assert/strict";
import test from "node:test";

import { frontierToolSlugs } from "../app/lib/frontier-tools.ts";
import { precisionTools } from "../app/lib/precision-tools.ts";
import { toolAliases } from "../app/lib/tool-aliases.ts";
import { tools } from "../app/lib/tools.ts";
import { frontierDemos, runFrontierTool } from "../app/components/FrontierWorkbenches.tsx";
import { precisionDemos, runPrecisionTool } from "../app/components/PrecisionWorkbenches.tsx";

const locales = ["tr", "en", "de", "zh"];

test("the complete 321-tool catalog has unique identities and four-language guidance", () => {
  assert.equal(tools.length, 321);
  assert.equal(new Set(tools.map((tool) => tool.slug)).size, tools.length);
  assert.equal(new Set(tools.map((tool) => tool.mark)).size, tools.length);
  for (const tool of tools) {
    assert.match(tool.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const locale of locales) {
      assert.ok(tool.title[locale]?.length > 3, `${tool.slug} is missing its ${locale} title`);
      assert.ok(tool.short[locale]?.length > 12, `${tool.slug} has a shallow ${locale} summary`);
      assert.ok(tool.description[locale]?.length > (locale === "zh" ? 20 : 50), `${tool.slug} has a shallow ${locale} description`);
      assert.equal(tool.steps[locale]?.length, 3, `${tool.slug} needs three ${locale} usage steps`);
      assert.ok(tool.useCases[locale]?.length >= 3, `${tool.slug} needs three ${locale} use cases`);
    }
  }

  for (const locale of locales) {
    const titles = new Map();
    for (const tool of tools) {
      const title = tool.title[locale].toLocaleLowerCase(locale === "zh" ? "zh-CN" : locale);
      titles.set(title, [...(titles.get(title) ?? []), tool.slug]);
    }
    for (const slugs of [...titles.values()].filter((items) => items.length > 1)) {
      const canonical = new Set(slugs.map((slug) => toolAliases[slug] ?? slug));
      assert.equal(canonical.size, 1, `${locale} repeats an unrelated title across ${slugs.join(", ")}`);
    }
  }
});

test("every frontier tool has a runnable, non-placeholder demo in all locales", async () => {
  assert.equal(frontierToolSlugs.size, 75);
  assert.deepEqual(new Set(Object.keys(frontierDemos)), frontierToolSlugs);

  for (const slug of frontierToolSlugs) {
    const demo = frontierDemos[slug];
    assert.ok(demo?.input.trim(), `${slug} has no meaningful demo input`);
    for (const locale of locales) {
      const result = await runFrontierTool(slug, demo.input, demo.secondary ?? "", demo.mode ?? "default", locale);
      assert.ok(result.output.trim(), `${slug} returned an empty ${locale} result`);
      assert.doesNotMatch(result.output, /Implementation missing|Unsupported frontier tool/i, `${slug} fell through its processor`);
      assert.ok(result.metrics?.length, `${slug} returned no measurable result`);
      if (locale !== "en" && result.warning) assert.doesNotMatch(result.warning, /^Review the result/i, `${slug} kept the English review boundary in ${locale}`);
      if (/^\s*\|/m.test(result.output)) assert.match(result.output, /^\s*\|\s*:?-{3,}/m, `${slug} did not emit a renderable table divider`);
    }
  }
});

test("reported problem tools produce purpose-specific Turkish results", async () => {
  const graphql = await runFrontierTool("graphql-islem-envanteri", frontierDemos["graphql-islem-envanteri"].input, "", "default", "tr");
  assert.match(graphql.output, /\| Tür \| Ad \|/);
  assert.match(graphql.output, /query \| GetUser/);

  const shift = await runFrontierTool("vardiya-kapsama-hesaplayici", frontierDemos["vardiya-kapsama-hesaplayici"].input, "", "default", "tr");
  assert.match(shift.output, /\| Saat \| Zorunlu alan \| Mevcut \| Fark \| Durum \|/);
  assert.match(shift.output, /\| 09:00 \| 4 \| 3 \| -1 \| Eksik \|/);

  const cookie = await runFrontierTool("cerez-envanteri-risk-siniflandirici", frontierDemos["cerez-envanteri-risk-siniflandirici"].input, "", "default", "tr");
  assert.match(cookie.output, /\| Ad \| Alan adı \| Süre \| Amaç \| Taraf \| Öncelik \|/);
  assert.match(cookie.output, /Üçüncü taraf|Birinci taraf/);

  const terminology = await runFrontierTool("terim-tutarlilik-denetleyici", frontierDemos["terim-tutarlilik-denetleyici"].input, frontierDemos["terim-tutarlilik-denetleyici"].secondary, "default", "tr");
  assert.match(terminology.output, /\| Tercih edilen \| Varyant \| Kullanım \|/);

  const toolCall = await runFrontierTool("arac-cagrisi-json-dogrulayici", frontierDemos["arac-cagrisi-json-dogrulayici"].input, frontierDemos["arac-cagrisi-json-dogrulayici"].secondary, "default", "tr");
  assert.match(toolCall.output, /Araç çağrısı bildirilen yerel sözleşmeyi karşılıyor/);

  const evidence = await runFrontierTool("kanit-tablosu-tekillestirici", frontierDemos["kanit-tablosu-tekillestirici"].input, "", "default", "tr");
  assert.match(evidence.output, /Kesin anahtar tekrar grupları:/);
  assert.match(evidence.output, /\| Satır \| DOI \| Başlık \| Yıl \|/);
});

test("sentence, plain-language, and paragraph tools no longer share one generic report", async () => {
  const slugs = ["cumle-uzunluk-dagilimi", "sade-dil-kontrolu", "paragraf-gecis-analizoru"];
  const outputs = await Promise.all(slugs.map((slug) => runFrontierTool(slug, frontierDemos[slug].input, "", "default", "en").then((result) => result.output)));
  assert.equal(new Set(outputs).size, 3);
  assert.match(outputs[0], /Average sentence/);
  assert.match(outputs[1], /heavy expression|heavy-language signal/);
  assert.match(outputs[2], /opening transition/i);
});

test("tools 234–246 run real demos with localized results in all four languages", () => {
  const audited = precisionTools.filter((tool) => Number(tool.mark) >= 234 && Number(tool.mark) <= 246);
  assert.equal(audited.length, 13);
  for (const tool of audited) {
    const demo = precisionDemos[tool.slug];
    assert.ok(demo?.input.trim(), `${tool.slug} has no demo input`);
    const english = runPrecisionTool(tool.slug, demo.input, demo.secondary ?? "", demo.mode ?? "default", "en");
    assert.ok(english.output.trim(), `${tool.slug} returned an empty English result`);
    for (const locale of locales) {
      const result = runPrecisionTool(tool.slug, demo.input, demo.secondary ?? "", demo.mode ?? "default", locale);
      assert.ok(result.output.trim(), `${tool.slug}/${locale} returned an empty result`);
      assert.ok(result.metrics?.length, `${tool.slug}/${locale} returned no metrics`);
      assert.doesNotMatch(result.output, /Unsupported precision tool/i, `${tool.slug}/${locale} fell through its processor`);
      if (locale !== "en") {
        assert.notEqual(result.warning, english.warning, `${tool.slug}/${locale} retained the English warning`);
        for (let index = 0; index < (result.metrics?.length ?? 0); index += 1) {
          const metric = result.metrics[index][0];
          if (!/^(?:n|CAGR|ROAS|ROI|URIs)$/.test(metric)) assert.notEqual(metric, english.metrics?.[index]?.[0], `${tool.slug}/${locale} retained English metric ${metric}`);
        }
      }
      if (/^\s*\|/m.test(result.output)) assert.match(result.output, /^\s*\|\s*:?-{3,}/m, `${tool.slug}/${locale} emitted an invalid Markdown table`);
    }
  }
});
