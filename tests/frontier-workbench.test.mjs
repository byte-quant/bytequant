import assert from "node:assert/strict";
import test from "node:test";

import { frontierToolSlugs } from "../app/lib/frontier-tools.ts";
import { precisionTools } from "../app/lib/precision-tools.ts";
import { toolAliases } from "../app/lib/tool-aliases.ts";
import { publicTools, tools } from "../app/lib/tools.ts";
import { essentialToolSlugs, guidedLegacyToolSlugs } from "../app/lib/essential-tool-slugs.ts";
import { expansionToolSlugs } from "../app/lib/expansion-tools.ts";
import { productivityToolSlugs } from "../app/lib/productivity-tool-slugs.ts";
import { demandToolSlugs } from "../app/lib/demand-tool-slugs.ts";
import { discoveryToolSlugs } from "../app/lib/discovery-tool-slugs.ts";
import { specializedSlugs } from "../app/components/SpecializedWorkbench.tsx";
import { advancedWorkbenchSlugs } from "../app/components/AdvancedWorkbenches.tsx";
import { growthWorkbenchSlugs } from "../app/components/GrowthWorkbenches.tsx";
import { newWorkbenchSlugs } from "../app/components/NewToolWorkbenches.tsx";
import { precisionToolSlugs } from "../app/lib/precision-tools.ts";
import { frontierDemos, localizeFrontierError, runFrontierTool } from "../app/components/FrontierWorkbenches.tsx";
import { precisionDemos, runPrecisionTool } from "../app/components/PrecisionWorkbenches.tsx";
import { stageTwoToolSlugs } from "../app/lib/stage-two-tools.ts";
import { studioToolSlugs } from "../app/lib/studio-tools.ts";

const locales = ["tr", "en", "de", "zh"];

test("all 327 canonical tools route to an implemented workbench family", () => {
  const coreAndConverters = new Set([
    "prompt-kalite-denetimi", "meta-prompt-olusturucu", "token-sayaci", "okunabilirlik-analizi", "metin-benzerlik-analizi", "metin-temizleyici", "buyuk-kucuk-harf-donusturucu", "kelime-sayaci", "json-bicimlendirici", "json-csv-donusturucu", "regex-test-araci", "csv-inceleyici", "base64-kodlayici", "url-kodlayici", "kvkk-veri-maskeleyici", "guclu-parola-uretici", "uuid-uretici", "sha256-ozet-uretici", "few-shot-ornek-olusturucu", "sistem-promptu-persona-sablonu", "jwt-decoder", "cron-ifadesi-aciklayici", "gorsel-format-donusturucu", "gorsel-sikistirici", "gorselden-pdf", "pdf-birlestirme", "pdf-bolme",
  ]);
  const implemented = new Set([
    ...coreAndConverters, ...specializedSlugs, ...advancedWorkbenchSlugs, ...growthWorkbenchSlugs, ...newWorkbenchSlugs,
    ...demandToolSlugs, ...discoveryToolSlugs, ...essentialToolSlugs, ...guidedLegacyToolSlugs, ...expansionToolSlugs,
    ...productivityToolSlugs, ...precisionToolSlugs, ...frontierToolSlugs, ...stageTwoToolSlugs, ...studioToolSlugs,
  ]);
  assert.equal(publicTools.length, 327);
  const missing = publicTools.filter((tool) => !implemented.has(tool.slug)).map((tool) => tool.slug);
  assert.deepEqual(missing, [], `tools without a runtime family: ${missing.join(", ")}`);
});

test("the complete 339-tool catalog has unique identities and four-language guidance", () => {
  assert.equal(tools.length, 339);
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

test("priority frontier results localize explanatory prose instead of mixing interface languages", async () => {
  const cases = [
    ["calisma-ucreti-esdegerlik-hesaplayici", /Annual:|Monthly:|Assumptions:/],
    ["nakit-pisti-hesaplayici", /Usable cash after buffer:|Net monthly burn:|Model excludes/],
    ["csp-kaynak-ifadesi-tester", /Selected source list:|Approximate match:|This helper/],
    ["ssh-yetkili-anahtar-inceleyici", /Encoded bytes:|No private-key material/],
    ["embedding-parca-ortusme-planlayici", /Effective step:|Repeated overlap:|Expansion vs source:/],
  ];
  for (const [slug, englishLeak] of cases) {
    const demo = frontierDemos[slug];
    for (const locale of ["tr", "de", "zh"]) {
      const result = await runFrontierTool(slug, demo.input, demo.secondary ?? "", demo.mode ?? "default", locale);
      assert.doesNotMatch(result.output, englishLeak, `${slug}/${locale} leaked English explanatory copy`);
    }
  }
});

test("frontier validation errors give actionable guidance in every interface language", () => {
  const invalidJson = new Error("Invalid JSON: Unexpected end of JSON input");
  assert.match(localizeFrontierError(invalidJson, "tr"), /JSON okunamadı/);
  assert.match(localizeFrontierError(invalidJson, "de"), /JSON konnte nicht gelesen werden/);
  assert.match(localizeFrontierError(invalidJson, "zh"), /无法读取 JSON/);
  assert.match(localizeFrontierError(invalidJson, "en"), /JSON could not be read/);

  const keyValue = new Error("Expected key=value: bad line");
  assert.match(localizeFrontierError(keyValue, "tr"), /anahtar=değer/);
  assert.match(localizeFrontierError(keyValue, "de"), /Schlüssel=Wert/);
  assert.match(localizeFrontierError(keyValue, "zh"), /键=值/);
});

test("representative frontier families reject malformed input instead of returning plausible output", async () => {
  await assert.rejects(() => runFrontierTool("json-yol-degeri-cikarici", "{broken", "user.name", "default", "tr"), /Invalid JSON/);
  await assert.rejects(() => runFrontierTool("json-dizi-sayfalama-planlayici", "{}", "page=1\nsize=10", "default", "tr"), /JSON array/);
  await assert.rejects(() => runFrontierTool("base32-kodlayici", "%%%", "", "decode", "tr"), /Base32/);
  await assert.rejects(() => runFrontierTool("buyuk-tamsayi-taban-donusturucu", "value=12\nfrom=x\nto=10", "", "default", "tr"), /number/);
  await assert.rejects(() => runFrontierTool("ical-etkinlik-olusturucu", "title=Test\nstart=tomorrow\nend=later", "", "default", "tr"), /YYYYMMDD/);
  await assert.rejects(() => runFrontierTool("arac-cagrisi-json-dogrulayici", "[]", "name=test\nrequired=input", "default", "tr"), /JSON object/);
  const ndjson = await runFrontierTool("ndjson-toplu-dogrulayici", '{"broken":}', "", "default", "tr");
  assert.equal(ndjson.metrics?.find(([label]) => label === "Hata")?.[1], 1);
  assert.match(ndjson.output, /\| Satır \| Tür \| Sonuç \|/);
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
