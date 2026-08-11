"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Locale } from "../lib/site";
import { SpecializedWorkbench, specializedSlugs } from "./SpecializedWorkbench";
import { ExpansionWorkbench } from "./ExpansionWorkbenches";
import { expansionToolSlugs } from "../lib/expansion-tools";
import { NewToolWorkbench, newWorkbenchSlugs } from "./NewToolWorkbenches";
import { ToolNotice, type ToolNoticeData } from "./ToolNotice";
import { AdvancedWorkbench, advancedWorkbenchSlugs } from "./AdvancedWorkbenches";
import { EssentialWorkbench } from "./EssentialWorkbenches";
import { essentialToolSlugs, guidedLegacyToolSlugs } from "../lib/essential-tool-slugs";
import { GrowthWorkbench, growthWorkbenchSlugs } from "./GrowthWorkbenches";
import { demandToolSlugs } from "../lib/demand-tool-slugs";
import { discoveryToolSlugs } from "../lib/discovery-tool-slugs";
import { productivityToolSlugs } from "../lib/productivity-tool-slugs";
import { PrecisionWorkbench } from "./PrecisionWorkbenches";
import { precisionToolSlugs } from "../lib/precision-tools";
import { frontierToolSlugs } from "../lib/frontier-tools";
import { stageTwoToolSlugs } from "../lib/stage-two-tools";
import { StructuredToolOutput } from "./StructuredToolOutput";

export const converterSlugs = new Set(["gorsel-format-donusturucu", "gorsel-sikistirici", "gorselden-pdf", "pdf-birlestirme", "pdf-bolme"]);
const ConverterWorkbench = dynamic(() => import("./ConverterWorkbenches").then((module) => module.ConverterWorkbench), {
  loading: () => <div className="workbench converter-loading" aria-busy="true" />,
});
const FrontierWorkbench = dynamic(() => import("./FrontierWorkbenches").then((module) => module.FrontierWorkbench), {
  loading: () => <div className="workbench frontier-workbench" aria-busy="true" />,
});
const StageTwoWorkbench = dynamic(() => import("./StageTwoWorkbenches").then((module) => module.StageTwoWorkbench), {
  loading: () => <div className="workbench stage-two-workbench" aria-busy="true" />,
});
const DemandWorkbench = dynamic(() => import("./DemandWorkbenches").then((module) => module.DemandWorkbench), {
  loading: () => <div className="workbench converter-loading" aria-busy="true" />,
});
const DiscoveryWorkbench = dynamic(() => import("./DiscoveryWorkbenches").then((module) => module.DiscoveryWorkbench), {
  loading: () => <div className="workbench converter-loading" aria-busy="true" />,
});
const ProductivityWorkbench = dynamic(() => import("./ProductivityWorkbenches").then((module) => module.ProductivityWorkbench), {
  loading: () => <div className="workbench converter-loading" aria-busy="true" />,
});

type Metric = { label: string; value: string | number };

const noInputTools = new Set(["guclu-parola-uretici", "uuid-uretici"]);
const secondInputTools = new Set(["meta-prompt-olusturucu", "metin-benzerlik-analizi", "regex-test-araci", "few-shot-ornek-olusturucu", "sistem-promptu-persona-sablonu"]);
const batchSlugs = new Set(["metin-temizleyici", "buyuk-kucuk-harf-donusturucu", "json-bicimlendirici", "base64-kodlayici", "url-kodlayici", "kvkk-veri-maskeleyici"]);
export const legacyGenericToolSlugs = new Set([
  "prompt-kalite-denetimi", "meta-prompt-olusturucu", "token-sayaci", "okunabilirlik-analizi", "metin-benzerlik-analizi",
  "metin-temizleyici", "buyuk-kucuk-harf-donusturucu", "kelime-sayaci", "json-bicimlendirici", "json-csv-donusturucu",
  "regex-test-araci", "csv-inceleyici", "base64-kodlayici", "url-kodlayici", "kvkk-veri-maskeleyici", "guclu-parola-uretici",
  "uuid-uretici", "sha256-ozet-uretici", "few-shot-ornek-olusturucu", "sistem-promptu-persona-sablonu", "jwt-decoder",
  "cron-ifadesi-aciklayici",
]);

export type ToolRuntimeFamily = "stageTwo" | "frontier" | "precision" | "essential" | "expansion" | "discovery" | "productivity" | "demand" | "growth" | "converter" | "new" | "specialized" | "advanced" | "generic" | "unsupported";

export function getToolRuntimeFamily(slug: string): ToolRuntimeFamily {
  if (stageTwoToolSlugs.has(slug)) return "stageTwo";
  if (frontierToolSlugs.has(slug)) return "frontier";
  if (precisionToolSlugs.has(slug)) return "precision";
  if (essentialToolSlugs.has(slug) || guidedLegacyToolSlugs.has(slug)) return "essential";
  if (expansionToolSlugs.has(slug)) return "expansion";
  if (discoveryToolSlugs.has(slug)) return "discovery";
  if ((productivityToolSlugs as readonly string[]).includes(slug)) return "productivity";
  if (demandToolSlugs.has(slug)) return "demand";
  if (growthWorkbenchSlugs.has(slug)) return "growth";
  if (converterSlugs.has(slug)) return "converter";
  if (newWorkbenchSlugs.has(slug)) return "new";
  if (specializedSlugs.has(slug)) return "specialized";
  if (advancedWorkbenchSlugs.has(slug)) return "advanced";
  if (legacyGenericToolSlugs.has(slug)) return "generic";
  return "unsupported";
}

export const legacyGenericSamples: Record<string, Record<Locale, string>> = {
  "prompt-kalite-denetimi": { tr: "Yeni kullanıcılar için tarayıcı içi gizlilik araçlarını anlatan kısa bir rehber hazırla. Teknik terimleri açıkla ve sonucu 5 maddelik liste olarak ver.", en: "Create a short guide to in-browser privacy tools for new users. Explain technical terms and return five bullet points.", de: "Erstellen Sie einen kurzen Leitfaden zu Browser-Datenschutzwerkzeugen für Einsteiger. Erklären Sie Fachbegriffe und geben Sie fünf Stichpunkte aus.", zh: "为新用户编写一份简短的浏览器隐私工具指南，解释技术术语，并用五个要点输出。" },
  "meta-prompt-olusturucu": { tr: "Müşteri geri bildirimlerini temalara ayır ve uygulanabilir öneriler çıkar.", en: "Group customer feedback into themes and produce actionable recommendations.", de: "Ordnen Sie Kundenfeedback nach Themen und leiten Sie umsetzbare Empfehlungen ab.", zh: "按主题整理客户反馈，并提出可执行建议。" },
  "token-sayaci": { tr: "Bu alana token ihtiyacını tahmin etmek istediğiniz metni yazın.", en: "Enter the text whose token demand you want to estimate.", de: "Geben Sie den Text ein, dessen Token-Bedarf Sie schätzen möchten.", zh: "输入需要估算 token 数量的文本。" },
  "okunabilirlik-analizi": { tr: "Açık ve anlaşılır metin, okuyucunun karar vermesini kolaylaştırır. Uzun cümleleri bölmek ve gereksiz terimleri açıklamak okunabilirliği artırır.", en: "Clear writing helps readers make decisions. Shorter sentences and explained terminology improve readability.", de: "Klare Texte erleichtern Entscheidungen. Kürzere Sätze und erklärte Fachbegriffe verbessern die Lesbarkeit.", zh: "清晰的文字有助于读者做出决定。缩短句子并解释术语可以提高可读性。" },
  "metin-benzerlik-analizi": { tr: "Tarayıcı içi araçlar veriyi cihazınızda işler.", en: "In-browser tools process data on your device.", de: "Browser-Werkzeuge verarbeiten Daten auf Ihrem Gerät.", zh: "浏览器工具会在您的设备上处理数据。" },
  "metin-temizleyici": { tr: "  Fazladan    boşluklar var.\n\n\nBu satırlar   daha düzenli olabilir.  ", en: "  There are    extra spaces.\n\n\nThese lines   can be cleaner.  ", de: "  Hier sind    zusätzliche Leerzeichen.\n\n\nDiese Zeilen   können sauberer sein.  ", zh: "  这里有    多余空格。\n\n\n这些行   可以更整洁。  " },
  "buyuk-kucuk-harf-donusturucu": { tr: "gizlilik odaklı araçlarla daha güvenli çalışma", en: "safer work with privacy-first tools", de: "sicherer arbeiten mit datenschutzorientierten werkzeugen", zh: "使用隐私优先工具更安全地工作" },
  "kelime-sayaci": { tr: "Ölçmek istediğiniz metni buraya yazın. Sonuç cihazınızda hesaplanır.", en: "Write the text you want to measure here. Results are calculated on-device.", de: "Geben Sie hier den zu messenden Text ein. Das Ergebnis wird auf dem Gerät berechnet.", zh: "在此输入需要统计的文本。结果会在设备上计算。" },
  "json-bicimlendirici": { tr: "{\"proje\":\"ByteQuant\",\"yerel\":true,\"aracSayisi\":317}", en: "{\"project\":\"ByteQuant\",\"local\":true,\"toolCount\":317}", de: "{\"projekt\":\"ByteQuant\",\"lokal\":true,\"werkzeuge\":317}", zh: "{\"项目\":\"ByteQuant\",\"本地处理\":true,\"工具数量\":317}" },
  "json-csv-donusturucu": { tr: "[{\"ad\":\"Ada\",\"rol\":\"Analist\"},{\"ad\":\"Deniz\",\"rol\":\"Editör\"}]", en: "[{\"name\":\"Ada\",\"role\":\"Analyst\"},{\"name\":\"Deniz\",\"role\":\"Editor\"}]", de: "[{\"name\":\"Ada\",\"rolle\":\"Analyse\"},{\"name\":\"Deniz\",\"rolle\":\"Redaktion\"}]", zh: "[{\"姓名\":\"Ada\",\"角色\":\"分析员\"},{\"姓名\":\"Deniz\",\"角色\":\"编辑\"}]" },
  "regex-test-araci": { tr: "İletişim: ekip@example.com ve destek@example.org", en: "Contact: team@example.com and support@example.org", de: "Kontakt: team@example.com und hilfe@example.org", zh: "联系方式：team@example.com 和 support@example.org" },
  "csv-inceleyici": { tr: "ad,rol,aktif\nAda,Analist,true\nDeniz,Editör,true", en: "name,role,active\nAda,Analyst,true\nDeniz,Editor,true", de: "name,rolle,aktiv\nAda,Analyse,true\nDeniz,Redaktion,true", zh: "姓名,角色,启用\nAda,分析员,true\nDeniz,编辑,true" },
  "base64-kodlayici": { tr: "Merhaba ByteQuant", en: "Hello ByteQuant", de: "Hallo ByteQuant", zh: "你好 ByteQuant" },
  "url-kodlayici": { tr: "gizlilik odaklı araçlar", en: "privacy-first tools", de: "datenschutzorientierte werkzeuge", zh: "隐私优先工具" },
  "kvkk-veri-maskeleyici": { tr: "Ayşe'nin e-postası ayse@example.com, telefonu +90 555 123 45 67 ve IP adresi 192.168.1.24.", en: "Ada's email is ada@example.com, phone +1 202 555 0147, and IP address 192.168.1.24.", de: "Adas E-Mail ist ada@example.com, Telefon +49 30 12345678 und IP-Adresse 192.168.1.24.", zh: "Ada 的邮箱是 ada@example.com，电话是 +86 138 0013 8000，IP 地址是 192.168.1.24。" },
  "sha256-ozet-uretici": { tr: "Bütünlüğü kontrol edilecek metin", en: "Text whose integrity will be checked", de: "Text, dessen Integrität geprüft wird", zh: "需要检查完整性的文本" },
  "few-shot-ornek-olusturucu": { tr: "Müşteri mesajını olumlu, nötr veya olumsuz olarak sınıflandır.", en: "Classify a customer message as positive, neutral, or negative.", de: "Klassifizieren Sie eine Kundennachricht als positiv, neutral oder negativ.", zh: "将客户消息分类为正面、中性或负面。" },
  "sistem-promptu-persona-sablonu": { tr: "Teknik kavramları yeni başlayanlara açıklayan bir ürün eğitim uzmanı", en: "A product education specialist who explains technical concepts to beginners", de: "Eine Produktschulungskraft, die Einsteigern technische Konzepte erklärt", zh: "向初学者解释技术概念的产品培训专家" },
  "jwt-decoder": { tr: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIiwiZXhwIjoyMDAwMDAwMDAwfQ.signature", en: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIiwiZXhwIjoyMDAwMDAwMDAwfQ.signature", de: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIiwiZXhwIjoyMDAwMDAwMDAwfQ.signature", zh: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIiwiZXhwIjoyMDAwMDAwMDAwfQ.signature" },
  "cron-ifadesi-aciklayici": { tr: "0 3 * * *", en: "0 3 * * *", de: "0 3 * * *", zh: "0 3 * * *" },
};

function secondarySample(slug: string, locale: Locale) {
  if (slug === "regex-test-araci") return "[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}";
  if (slug === "metin-benzerlik-analizi") return ui(locale, {
    tr: "Yerel araçlar metninizi uzak bir sunucuya göndermeden çalışır.",
    en: "Local tools work without sending your text to a remote server.",
    de: "Lokale Werkzeuge funktionieren, ohne Ihren Text an einen entfernten Server zu senden.",
    zh: "本地工具无需将文本发送到远程服务器即可运行。",
  });
  if (slug === "few-shot-ornek-olusturucu") return ui(locale, {
    tr: "Ürünü çok sevdim => olumlu\nTeslimat zamanında geldi => olumlu\nArayüz kullanılabilir => nötr\nUygulama sürekli kapanıyor => olumsuz",
    en: "I love the product => positive\nDelivery arrived on time => positive\nThe interface is usable => neutral\nThe app keeps crashing => negative",
    de: "Ich mag das Produkt sehr => positiv\nDie Lieferung kam pünktlich => positiv\nDie Oberfläche ist nutzbar => neutral\nDie Anwendung stürzt ständig ab => negativ",
    zh: "我很喜欢这个产品 => 正面\n配送准时到达 => 正面\n界面可以使用 => 中性\n应用总是崩溃 => 负面",
  });
  if (slug === "sistem-promptu-persona-sablonu") return ui(locale, {
    tr: "Ton: sakin, açık ve destekleyici\nHedef kitle: teknik olmayan yeni kullanıcılar\nSınırlar: bilinmeyen bilgiyi uydurma; güvenlik iddiası verme",
    en: "Tone: calm, clear, and supportive\nAudience: non-technical beginners\nBoundaries: do not invent missing facts or make security guarantees",
    de: "Ton: ruhig, klar und unterstützend\nZielgruppe: nichttechnische Einsteiger\nGrenzen: keine fehlenden Fakten erfinden und keine Sicherheitsgarantien geben",
    zh: "语气：冷静、清晰并提供支持\n受众：非技术背景的初学者\n边界：不得编造未知事实，也不得作出安全保证",
  });
  return "";
}

function friendlyError(slug: string, error: unknown, locale: Locale) {
  const detail = error instanceof Error ? error.message : String(error);
  if (["json-bicimlendirici", "json-csv-donusturucu"].includes(slug) && error instanceof SyntaxError) {
    return ui(locale, {
      tr: `JSON ayrıştırılamadı. Anahtar ve metinlerde çift tırnak, doğru virgül ve kapanan parantez kullandığınızdan emin olun. Teknik ayrıntı: ${detail}`,
      en: `The JSON could not be parsed. Check double quotes, commas, and closing brackets. Technical detail: ${detail}`,
      de: `JSON konnte nicht geparst werden. Prüfen Sie doppelte Anführungszeichen, Kommas und schließende Klammern. Technisches Detail: ${detail}`,
      zh: `无法解析 JSON。请检查双引号、逗号和闭合括号。技术详情：${detail}`,
    });
  }
  if (slug === "jwt-decoder") {
    return ui(locale, {
      tr: `JWT okunamadı. Üç nokta ayrımlı bölüm ve geçerli Base64URL JSON içeren bir token girin. İmza doğrulaması bu araçta yapılmaz. Teknik ayrıntı: ${detail}`,
      en: `The JWT could not be read. Enter three dot-separated segments containing valid Base64URL JSON. This tool does not verify signatures. Technical detail: ${detail}`,
      de: `JWT konnte nicht gelesen werden. Geben Sie drei durch Punkte getrennte Segmente mit gültigem Base64URL-JSON ein. Dieses Werkzeug prüft keine Signatur. Technisches Detail: ${detail}`,
      zh: `无法读取 JWT。请输入由三个点分段且包含有效 Base64URL JSON 的令牌。该工具不验证签名。技术详情：${detail}`,
    });
  }
  if (slug === "regex-test-araci" && (error instanceof SyntaxError || /invalid regular expression|unterminated|invalid flags/i.test(detail))) {
    return ui(locale, { tr: `Regex kalıbı geçerli değil. Parantez, köşeli parantez ve kaçış karakterlerini kontrol edin. Teknik ayrıntı: ${detail}`, en: `The regular expression is invalid. Check brackets, groups, and escape characters. Technical detail: ${detail}`, de: `Der reguläre Ausdruck ist ungültig. Prüfen Sie Klammern, Gruppen und Escape-Zeichen. Technisches Detail: ${detail}`, zh: `正则表达式无效。请检查括号、分组和转义字符。技术详情：${detail}` });
  }
  if (slug === "regex-test-araci" && detail === "REGEX_TIMEOUT") {
    return ui(locale, { tr: "Regex 600 ms güvenlik sınırını aştı. Geri izlemeyi azaltmak için iç içe tekrarları ve belirsiz grupları sadeleştirin.", en: "The regex exceeded the 600 ms safety limit. Reduce backtracking by simplifying nested repetition and ambiguous groups.", de: "Der reguläre Ausdruck hat die Sicherheitsgrenze von 600 ms überschritten. Vereinfachen Sie verschachtelte Wiederholungen und mehrdeutige Gruppen.", zh: "正则表达式超过了 600 毫秒安全限制。请简化嵌套重复和歧义分组以减少回溯。" });
  }
  if (slug === "regex-test-araci" && detail === "REGEX_WORKER") {
    return ui(locale, { tr: "Regex güvenli çalışma alanı başlatılamadı. Tarayıcınızın Worker desteğini veya içerik engelleyicisini kontrol edin.", en: "The safe regex worker could not start. Check browser Worker support or content-blocking settings.", de: "Der sichere Regex-Worker konnte nicht gestartet werden. Prüfen Sie die Worker-Unterstützung und Inhaltsblocker des Browsers.", zh: "无法启动安全正则 Worker。请检查浏览器 Worker 支持或内容拦截设置。" });
  }
  if (slug === "base64-kodlayici") {
    return ui(locale, { tr: `Base64 metni çözülemedi. Alfabe, padding (=) ve kopyalama sırasında eklenen boşlukları kontrol edin. Teknik ayrıntı: ${detail}`, en: `The Base64 text could not be decoded. Check its alphabet, padding (=), and copied whitespace. Technical detail: ${detail}`, de: `Der Base64-Text konnte nicht dekodiert werden. Prüfen Sie Alphabet, Padding (=) und kopierte Leerzeichen. Technisches Detail: ${detail}`, zh: `无法解码 Base64 文本。请检查字符集、填充符（=）和复制产生的空白。技术详情：${detail}` });
  }
  if (slug === "url-kodlayici" && error instanceof URIError) {
    return ui(locale, { tr: `URL kodlaması çözülemedi. Eksik veya bozuk yüzde kaçışlarını (ör. %20) kontrol edin. Teknik ayrıntı: ${detail}`, en: `The URL encoding could not be decoded. Check incomplete or malformed percent escapes such as %20. Technical detail: ${detail}`, de: `Die URL-Kodierung konnte nicht dekodiert werden. Prüfen Sie unvollständige oder fehlerhafte Prozent-Escapes wie %20. Technisches Detail: ${detail}`, zh: `无法解码 URL 编码。请检查不完整或错误的百分号转义，例如 %20。技术详情：${detail}` });
  }
  return locale === "en" || locale === "tr" ? detail : ui(locale, { tr: detail, en: detail, de: `Eingabe prüfen: ${detail}`, zh: `请检查输入：${detail}` });
}

const localeTags: Record<Locale, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };
const ui = <T,>(locale: Locale, values: Record<Locale, T>) => values[locale];

function words(text: string, locale: Locale) {
  const normalized = text.toLocaleLowerCase(localeTags[locale]);
  if (typeof Intl.Segmenter === "function") {
    const segments = new Intl.Segmenter(localeTags[locale], { granularity: "word" }).segment(normalized);
    return [...segments].filter((segment) => segment.isWordLike).map((segment) => segment.segment);
  }
  return normalized.match(/[\p{L}\p{N}’'-]+/gu) ?? [];
}

function estimateSyllables(word: string, locale: Locale) {
  if (locale === "tr") return Math.max(1, (word.match(/[aeıioöuü]/gi) ?? []).length);
  const groups = word.toLocaleLowerCase(localeTags[locale]).match(locale === "de" ? /[aeiouyäöü]+/gi : /[aeiouy]+/gi);
  let count = groups?.length ?? 1;
  if (locale === "en" && word.length > 3 && /e$/i.test(word) && !/(?:le|ye)$/i.test(word)) count -= 1;
  return Math.max(1, count);
}

function tokenEstimate(text: string, locale: Locale) {
  const hanLike = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0;
  const remaining = text.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, "");
  const punctuation = remaining.match(/[^\p{L}\p{N}\s]/gu)?.length ?? 0;
  const denominator = locale === "tr" ? 3.15 : locale === "de" ? 3.55 : 4;
  const estimate = Math.max(1, Math.ceil(hanLike * 1.05 + remaining.length / denominator + punctuation * 0.18));
  return { estimate, low: Math.max(1, Math.floor(estimate * 0.82)), high: Math.ceil(estimate * 1.2), hanLike };
}

function convertCase(input: string, mode: string, locale: Locale) {
  const tag = localeTags[locale];
  const protectedParts = input.split(/((?:https?:\/\/|www\.)\S+|[\p{L}\p{N}.+_-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,})/giu);
  return protectedParts.map((part, index) => {
    if (index % 2 === 1) return part;
    if (mode === "upper") return part.toLocaleUpperCase(tag);
    if (mode === "lower") return part.toLocaleLowerCase(tag);
    const lowered = part.toLocaleLowerCase(tag);
    if (mode === "sentence") return lowered.replace(/(^|[.!?。！？]\s*)(\p{L})/gu, (_, start, char: string) => start + char.toLocaleUpperCase(tag));
    return lowered.replace(/\p{L}[\p{L}\p{M}]*/gu, (word, offset) => {
      const original = part.slice(offset, offset + word.length);
      if (original.length <= 6 && original.length >= 2 && original === original.toLocaleUpperCase(tag)) return original;
      return word[0].toLocaleUpperCase(tag) + word.slice(1);
    });
  }).join("");
}

function sentenceCount(text: string) {
  return Math.max(1, (text.match(/[.!?]+(?:\s|$)/g) ?? []).length || (text.trim() ? 1 : 0));
}

function detectCsvDelimiter(input: string) {
  const firstLine = input.replace(/^\uFEFF/, "").split(/\r?\n/).find((line) => line.trim()) ?? "";
  const candidates = [",", ";", "\t"];
  const counts = candidates.map((delimiter) => {
    let quoted = false;
    let count = 0;
    for (let index = 0; index < firstLine.length; index += 1) {
      if (firstLine[index] === '"') quoted = !quoted;
      else if (firstLine[index] === delimiter && !quoted) count += 1;
    }
    return { delimiter, count };
  });
  return counts.sort((a, b) => b.count - a.count)[0]?.count ? counts.sort((a, b) => b.count - a.count)[0].delimiter : ",";
}

function csvParse(input: string, locale: Locale, delimiter = detectCsvDelimiter(input)): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === delimiter && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[i + 1] === "\n") i += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error(locale === "tr" ? "CSV içinde kapanmamış bir çift tırnaklı alan var." : "The CSV contains an unclosed quoted field.");
  row.push(cell);
  if (row.some((value) => value.length) || rows.length === 0) rows.push(row);
  return rows;
}

function csvEscape(value: unknown) {
  const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function frequency(text: string, locale: Locale) {
  const map = new Map<string, number>();
  words(text, locale).forEach((word) => map.set(word, (map.get(word) ?? 0) + 1));
  return map;
}

function similarity(a: string, b: string, locale: Locale) {
  const fa = frequency(a, locale); const fb = frequency(b, locale);
  const vocabulary = new Set([...fa.keys(), ...fb.keys()]);
  let dot = 0; let ma = 0; let mb = 0;
  vocabulary.forEach((token) => { const x = fa.get(token) ?? 0; const y = fb.get(token) ?? 0; dot += x * y; ma += x * x; mb += y * y; });
  const cosine = ma && mb ? dot / (Math.sqrt(ma) * Math.sqrt(mb)) : 0;
  const setA = new Set(fa.keys()); const setB = new Set(fb.keys());
  const union = new Set([...setA, ...setB]);
  const intersection = [...setA].filter((token) => setB.has(token)).length;
  return { cosine, jaccard: union.size ? intersection / union.size : 0, shared: intersection };
}

function secureIndex(max: number) {
  const maxUint = 0x100000000;
  const limit = Math.floor(maxUint / max) * max;
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value); while (value[0] >= limit);
  return value[0] % max;
}

function secureShuffle(values: string[]) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const target = secureIndex(index + 1);
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

function generateSecurePassword(requestedLength: number) {
  const groups = [
    "ABCDEFGHJKLMNPQRSTUVWXYZ",
    "abcdefghijkmnopqrstuvwxyz",
    "23456789",
    "!@#$%*-_+=?",
  ];
  const alphabet = groups.join("");
  const length = Math.min(128, Math.max(12, requestedLength));
  const characters = groups.map((group) => group[secureIndex(group.length)]);
  while (characters.length < length) characters.push(alphabet[secureIndex(alphabet.length)]);
  return secureShuffle(characters).join("");
}

function generateUuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (char) => (Number(char) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(char) / 4).toString(16));
}

type SafeRegexMatch = { index: number; text: string; groups: (string | null)[] };

async function runRegexSafely(input: string, pattern: string, flags: string): Promise<SafeRegexMatch[]> {
  const workerSource = [
    "self.onmessage=function(event){try{",
    "const input=event.data.input,pattern=event.data.pattern;",
    "const flags=event.data.flags.includes('g')?event.data.flags:event.data.flags+'g';",
    "const expression=new RegExp(pattern,flags),matches=[];let match;",
    "while((match=expression.exec(input))&&matches.length<200){",
    "matches.push({index:match.index,text:match[0],groups:Array.from(match).slice(1).map(function(value){return value===undefined?null:value;})});",
    "if(match[0]==='')expression.lastIndex+=1;",
    "}self.postMessage({matches:matches});",
    "}catch(error){self.postMessage({error:error instanceof Error?error.message:String(error)});}};",
  ].join("");
  const url = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
  const worker = new Worker(url);
  try {
    return await new Promise<SafeRegexMatch[]>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        worker.terminate();
        reject(new Error("REGEX_TIMEOUT"));
      }, 600);
      worker.onmessage = (event: MessageEvent<{ matches?: SafeRegexMatch[]; error?: string }>) => {
        window.clearTimeout(timeout);
        if (event.data.error) reject(new Error(event.data.error));
        else resolve(event.data.matches ?? []);
      };
      worker.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("REGEX_WORKER"));
      };
      worker.postMessage({ input, pattern, flags });
    });
  } finally {
    worker.terminate();
    URL.revokeObjectURL(url);
  }
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function passesLuhn(value: string) {
  const digits = value.replace(/\D/g, ""); if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0; let double = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) { let digit = Number(digits[index]); if (double) { digit *= 2; if (digit > 9) digit -= 9; } sum += digit; double = !double; }
  return sum % 10 === 0;
}

function passesTcknChecksum(value: string) {
  if (!/^[1-9]\d{10}$/.test(value)) return false;
  const digits = [...value].map(Number);
  const tenth = ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - (digits[1] + digits[3] + digits[5] + digits[7])) % 10;
  return (tenth + 10) % 10 === digits[9] && digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10 === digits[10];
}

function explainCron(expression: string, locale: Locale) {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) throw new Error(ui(locale, { tr: "Klasik cron ifadesi 5 alan içermelidir.", en: "A classic cron expression must contain five fields.", de: "Ein klassischer Cron-Ausdruck muss fünf Felder enthalten.", zh: "经典 Cron 表达式必须包含五个字段。" }));
  const definitions = [
    { name: ui(locale, { tr: "Dakika", en: "Minute", de: "Minute", zh: "分钟" }), min: 0, max: 59 },
    { name: ui(locale, { tr: "Saat", en: "Hour", de: "Stunde", zh: "小时" }), min: 0, max: 23 },
    { name: ui(locale, { tr: "Ayın günü", en: "Day of month", de: "Tag des Monats", zh: "月中日期" }), min: 1, max: 31 },
    { name: ui(locale, { tr: "Ay", en: "Month", de: "Monat", zh: "月份" }), min: 1, max: 12 },
    { name: ui(locale, { tr: "Haftanın günü", en: "Day of week", de: "Wochentag", zh: "星期" }), min: 0, max: 7 },
  ];
  function validate(field: string, min: number, max: number) {
    const pieces = field.split(",");
    for (const piece of pieces) {
      if (piece === "*") continue;
      const [range, stepText] = piece.split("/");
      if (stepText && (!/^\d+$/.test(stepText) || Number(stepText) < 1)) return false;
      if (range === "*") continue;
      const bounds = range.split("-");
      if (!bounds.every((item) => /^\d+$/.test(item) && Number(item) >= min && Number(item) <= max)) return false;
      if (bounds.length > 2 || (bounds.length === 2 && Number(bounds[0]) > Number(bounds[1]))) return false;
    }
    return true;
  }
  fields.forEach((field, index) => { if (!validate(field, definitions[index].min, definitions[index].max)) throw new Error(`${definitions[index].name}: ${ui(locale, { tr: "geçersiz değer", en: "invalid value", de: "ungültiger Wert", zh: "值无效" })} (${field})`); });
  const [minute, hour, day, month, weekday] = fields;
  let summary = ui(locale, { tr: "Özel cron zamanlaması", en: "Custom cron schedule", de: "Benutzerdefinierter Cron-Zeitplan", zh: "自定义 Cron 计划" });
  if (minute === "*" && hour === "*" && day === "*" && month === "*" && weekday === "*") summary = ui(locale, { tr: "Her dakika çalışır.", en: "Runs every minute.", de: "Wird jede Minute ausgeführt.", zh: "每分钟运行一次。" });
  else if (/^\*\/\d+$/.test(minute) && hour === "*" && day === "*" && month === "*" && weekday === "*") summary = ui(locale, { tr: `Her ${minute.slice(2)} dakikada bir çalışır.`, en: `Runs every ${minute.slice(2)} minutes.`, de: `Wird alle ${minute.slice(2)} Minuten ausgeführt.`, zh: `每 ${minute.slice(2)} 分钟运行一次。` });
  else if (/^\d+$/.test(minute) && hour === "*" && day === "*" && month === "*" && weekday === "*") summary = ui(locale, { tr: `Her saat ${minute.padStart(2, "0")}. dakikada çalışır.`, en: `Runs at minute ${minute.padStart(2, "0")} of every hour.`, de: `Wird in jeder Stunde zur Minute ${minute.padStart(2, "0")} ausgeführt.`, zh: `每小时的第 ${minute.padStart(2, "0")} 分钟运行。` });
  else if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && day === "*" && month === "*" && weekday === "*") summary = ui(locale, { tr: `Her gün saat ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}'te çalışır.`, en: `Runs every day at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}.`, de: `Wird täglich um ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} Uhr ausgeführt.`, zh: `每天 ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} 运行。` });
  else if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && day === "*" && month === "*" && /^\d$/.test(weekday)) {
    const days = ui(locale, { tr: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], zh: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"] });
    summary = ui(locale, { tr: `Her ${days[Number(weekday)]} saat ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}'te çalışır.`, en: `Runs every ${days[Number(weekday)]} at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}.`, de: `Wird jeden ${days[Number(weekday)]} um ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} Uhr ausgeführt.`, zh: `每${days[Number(weekday)]} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} 运行。` });
  }
  else if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && day === "*" && month === "*" && weekday === "1-5") summary = ui(locale, { tr: `Pazartesi–cuma saat ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}'te çalışır.`, en: `Runs Monday–Friday at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}.`, de: `Wird montags bis freitags um ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} Uhr ausgeführt.`, zh: `周一至周五 ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} 运行。` });
  else if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && /^\d+$/.test(day) && month === "*" && weekday === "*") summary = ui(locale, { tr: `Her ayın ${day}. günü saat ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}'te çalışır.`, en: `Runs on day ${day} of every month at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}.`, de: `Wird am ${day}. Tag jedes Monats um ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} Uhr ausgeführt.`, zh: `每月 ${day} 日 ${hour.padStart(2, "0")}:${minute.padStart(2, "0")} 运行。` });
  const details = fields.map((field, index) => `${definitions[index].name}: ${field === "*" ? ui(locale, { tr: "her değer", en: "every value", de: "jeder Wert", zh: "任意值" }) : field}`).join("\n");
  return `${summary}\n\n${details}\n\n${ui(locale, { tr: "Saat dilimi: Cron çalıştırıcısının/sunucunun saat dilimini ayrıca doğrulayın.", en: "Time zone: verify the scheduler or server time zone separately.", de: "Zeitzone: Prüfen Sie die Zeitzone des Schedulers oder Servers gesondert.", zh: "时区：请另行确认调度器或服务器的时区。" })}`;
}

export function ToolWorkbench({ slug, locale }: { slug: string; locale: Locale }) {
  const family = getToolRuntimeFamily(slug);
  if (family === "stageTwo") return <StageTwoWorkbench slug={slug} locale={locale} />;
  if (family === "frontier") return <FrontierWorkbench slug={slug} locale={locale} />;
  if (family === "precision") return <PrecisionWorkbench slug={slug} locale={locale} />;
  if (family === "essential") return <EssentialWorkbench slug={slug} locale={locale} />;
  if (family === "expansion") return <ExpansionWorkbench slug={slug} locale={locale} />;
  if (family === "discovery") return <DiscoveryWorkbench slug={slug} locale={locale} />;
  if (family === "productivity") return <ProductivityWorkbench slug={slug} locale={locale} />;
  if (family === "demand") return <DemandWorkbench slug={slug} locale={locale} />;
  if (family === "growth") return <GrowthWorkbench slug={slug} locale={locale} />;
  if (family === "converter") return <ConverterWorkbench slug={slug} locale={locale} />;
  if (family === "new") return <NewToolWorkbench slug={slug} locale={locale} />;
  if (family === "specialized") return <SpecializedWorkbench slug={slug} locale={locale} />;
  if (family === "advanced") return <AdvancedWorkbench slug={slug} locale={locale} />;
  if (family === "generic") return <GenericToolWorkbench slug={slug} locale={locale} />;
  const text = ui(locale, {
    tr: "Bu araç için çalışma motoru bulunamadı. Sayfayı yenileyin; sorun sürerse araç bağlantısını GitHub hata kaydına ekleyin.",
    en: "No processing engine is registered for this tool. Refresh the page; if the issue remains, include the tool link in a GitHub issue.",
    de: "Für dieses Werkzeug ist keine Verarbeitungs-Engine registriert. Laden Sie die Seite neu und melden Sie den Werkzeuglink bei fortbestehendem Problem auf GitHub.",
    zh: "此工具尚未注册处理引擎。请刷新页面；若问题仍然存在，请在 GitHub 问题中附上工具链接。",
  });
  return <section className="workbench" data-runtime-family="unsupported"><div className="workbench-body"><ToolNotice notice={{ kind: "error", text }} locale={locale} /></div></section>;
}

function GenericToolWorkbench({ slug, locale }: { slug: string; locale: Locale }) {
  const isTr = locale === "tr";
  const [input, setInput] = useState("");
  const [secondary, setSecondary] = useState("");
  const [flags, setFlags] = useState("gi");
  const [mode, setMode] = useState("default");
  const [length, setLength] = useState(24);
  const [quantity, setQuantity] = useState(5);
  const [batch, setBatch] = useState(false);
  const [output, setOutput] = useState("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const [busy, setBusy] = useState(false);

  const labels = useMemo(() => {
    if (locale === "de") return { input: slug === "jwt-decoder" ? "JWT" : slug === "cron-ifadesi-aciklayici" ? "Cron-Ausdruck" : "Eingabe", second: slug === "regex-test-araci" ? "Regex-Muster" : "Vergleich / Zusatzangaben", run: "Auf meinem Gerät ausführen", running: "Verarbeitung…", copy: "Ausgabe kopieren", download: "Als Text herunterladen", clear: "Leeren", demo: "Beispiel laden", output: "Ergebnis", empty: "Das Ergebnis erscheint hier.", copied: "Ausgabe wurde kopiert.", downloaded: "Ausgabe wurde heruntergeladen.", demoLoaded: "Beispiel geladen; das Werkzeug kann jetzt ausgeführt werden.", local: "Eingabe verlässt diese Seite nicht.", flags: "Flags", length: "Passwortlänge", quantity: "UUID-Anzahl", shortcut: "Strg/⌘ + Enter", batch: "Stapelmodus", batchHelp: "Bis zu 50 Einträge; jeweils mit einer Zeile --- trennen." };
    if (locale === "zh") return { input: slug === "jwt-decoder" ? "JWT" : slug === "cron-ifadesi-aciklayici" ? "Cron 表达式" : "输入", second: slug === "regex-test-araci" ? "正则表达式" : "比较 / 补充信息", run: "在设备上运行", running: "处理中…", copy: "复制输出", download: "下载文本", clear: "清除", demo: "加载示例", output: "结果", empty: "结果将显示在这里。", copied: "输出已复制。", downloaded: "输出已下载。", demoLoaded: "示例已加载，现在可以运行工具。", local: "输入不会离开此页面。", flags: "标志", length: "密码长度", quantity: "UUID 数量", shortcut: "Ctrl/⌘ + Enter", batch: "批量模式", batchHelp: "最多 50 项；每项使用单独一行 --- 分隔。" };
    return isTr ? {
    input: slug === "few-shot-ornek-olusturucu" ? "Görev tanımı" : slug === "sistem-promptu-persona-sablonu" ? "Rol ve temel sorumluluk" : slug === "jwt-decoder" ? "JWT" : slug === "cron-ifadesi-aciklayici" ? "Cron ifadesi" : "Girdi", second: slug === "regex-test-araci" ? "Regex kalıbı" : slug === "meta-prompt-olusturucu" ? "Bağlam ve kısıtlar (isteğe bağlı)" : slug === "few-shot-ornek-olusturucu" ? "Örnekler — her satır `girdi => çıktı`" : slug === "sistem-promptu-persona-sablonu" ? "Ton, hedef kitle ve sınırlar" : "Karşılaştırma metni",
    run: "Cihazımda çalıştır", running: "İşleniyor…", copy: "Çıktıyı kopyala", download: "Metin olarak indir", clear: "Temizle", demo: "Örnek veri yükle", output: "Sonuç", empty: "Sonuç burada görünecek.", copied: "Çıktı panoya kopyalandı.", downloaded: "Çıktı metin dosyası olarak indirildi.", demoLoaded: "Hazır örnek yüklendi; aracı şimdi çalıştırabilirsiniz.", local: "Girdi bu sayfadan ayrılmaz.", flags: "Bayraklar", length: "Parola uzunluğu", quantity: "Üretilecek UUID", shortcut: "Ctrl/⌘ + Enter", batch: "Toplu işlem", batchHelp: "En fazla 50 öğe; her öğeyi tek satırdaki --- ile ayırın.",
  } : {
    input: slug === "few-shot-ornek-olusturucu" ? "Task description" : slug === "sistem-promptu-persona-sablonu" ? "Role and primary responsibility" : slug === "jwt-decoder" ? "JWT" : slug === "cron-ifadesi-aciklayici" ? "Cron expression" : "Input", second: slug === "regex-test-araci" ? "Regex pattern" : slug === "meta-prompt-olusturucu" ? "Context and constraints (optional)" : slug === "few-shot-ornek-olusturucu" ? "Examples — one `input => output` pair per line" : slug === "sistem-promptu-persona-sablonu" ? "Tone, audience, and boundaries" : "Comparison text",
    run: "Run on my device", running: "Processing…", copy: "Copy output", download: "Download as text", clear: "Clear", demo: "Load example", output: "Result", empty: "Your result will appear here.", copied: "Output copied to the clipboard.", downloaded: "Output downloaded as a text file.", demoLoaded: "The ready-made example is loaded; you can now run the tool.", local: "Input never leaves this page.", flags: "Flags", length: "Password length", quantity: "UUID quantity", shortcut: "Ctrl/⌘ + Enter", batch: "Batch mode", batchHelp: "Up to 50 items; separate each with --- on its own line.",
  }; }, [isTr, locale, slug]);

  function setResult(value: string, nextMetrics: Metric[] = []) {
    setOutput(value); setMetrics(nextMetrics); setNotice(null);
  }

  function resetResult() {
    setOutput(""); setMetrics([]); setNotice(null);
  }

  function clearWorkbench() {
    setInput(""); setSecondary(""); setFlags("gi"); setMode("default"); setLength(24); setQuantity(5); setBatch(false); resetResult();
  }

  function loadDemo() {
    setInput(legacyGenericSamples[slug]?.[locale] ?? "");
    setSecondary(secondarySample(slug, locale));
    setFlags("gi"); setMode("default"); setLength(24); setQuantity(5); setOutput(""); setMetrics([]);
    setNotice({ kind: "info", text: labels.demoLoaded });
  }

  async function run() {
    if (busy) return;
    setBusy(true);
    try {
      if (!noInputTools.has(slug) && !input.trim()) throw new Error(ui(locale, { tr: "Önce bir girdi yazın.", en: "Enter some input first.", de: "Geben Sie zuerst einen Wert ein.", zh: "请先输入内容。" }));
      const list = words(input, locale);
      if (batch && batchSlugs.has(slug)) {
        const items = input.split(/\r?\n---\r?\n/u).map((item) => item.trim()).filter(Boolean);
        if (items.length < 2) throw new Error(ui(locale, { tr: "Toplu işlem için öğeleri tek satırdaki --- ayırıcıyla bölün.", en: "For batch mode, separate items with --- on its own line.", de: "Trennen Sie Stapelobjekte mit --- in einer eigenen Zeile.", zh: "批量模式请用单独一行 --- 分隔项目。" }));
        if (items.length > 50) throw new Error(ui(locale, { tr: "Tek toplu işlem en fazla 50 öğe içerebilir.", en: "One batch can contain at most 50 items.", de: "Ein Stapel darf höchstens 50 Einträge enthalten.", zh: "一次批量处理最多包含 50 项。" }));
        const processItem = (value: string) => {
          if (slug === "metin-temizleyici") return value.replace(/[\t ]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
          if (slug === "buyuk-kucuk-harf-donusturucu") return convertCase(value, mode, locale);
          if (slug === "json-bicimlendirici") return JSON.stringify(JSON.parse(value), null, mode === "minify" ? 0 : 2);
          if (slug === "url-kodlayici") return mode === "decode" ? decodeURIComponent(value.trim()) : encodeURIComponent(value);
          if (slug === "base64-kodlayici") {
            if (mode === "decode") { const compact = value.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/"); if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact) || compact.length % 4 === 1) throw new Error("Base64"); const bytes = Uint8Array.from(atob(compact.padEnd(Math.ceil(compact.length / 4) * 4, "=")), (char) => char.charCodeAt(0)); return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
            const bytes = new TextEncoder().encode(value); let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary);
          }
          if (slug === "kvkk-veri-maskeleyici") {
            const patterns = [
              { label: "EMAIL", re: /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, validate: undefined },
              { label: "IBAN", re: /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){11,30}\b/gi, validate: undefined },
              { label: "TCKN_CANDIDATE", re: /\b[1-9]\d{10}\b/g, validate: passesTcknChecksum },
              { label: "CARD_CANDIDATE", re: /\b(?:\d[ -]*?){13,19}\b/g, validate: passesLuhn },
              { label: "IP", re: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g, validate: undefined },
              { label: "PHONE", re: /(?<!\d)(?:\+?\d{1,3}[ .-]?)?(?:\(?\d{3}\)?[ .-]?)\d{3}[ .-]?\d{2}[ .-]?\d{2}(?!\d)/g, validate: undefined },
            ];
            let masked = value; patterns.forEach(({ label, re, validate }) => { let count = 0; masked = masked.replace(re, (candidate) => { if (validate && !validate(candidate)) return candidate; count += 1; return `[${label}_${count}]`; }); }); return masked;
          }
          return value;
        };
        const outputItems = items.map((item, index) => `${ui(locale, { tr: "ÖĞE", en: "ITEM", de: "EINTRAG", zh: "项目" })} ${index + 1}\n${processItem(item)}`);
        setResult(outputItems.join("\n\n---\n\n"), [{ label: ui(locale, { tr: "İşlenen öğe", en: "Items processed", de: "Verarbeitete Einträge", zh: "已处理项目" }), value: items.length }, { label: ui(locale, { tr: "Toplam karakter", en: "Total characters", de: "Zeichen gesamt", zh: "总字符数" }), value: input.length }]);
        return;
      }
      switch (slug) {
        case "prompt-kalite-denetimi": {
          const checks = [
            { label: ui(locale, { tr: "Açık hedef", en: "Clear goal", de: "Klares Ziel", zh: "明确目标" }), ok: /(?:hazırla|oluştur|yaz|analiz|karşılaştır|üret|çıkar|create|write|analy[sz]e|compare|produce|extract|erstell|schreib|analys|vergleich|生成|编写|分析|比较)/iu.test(input) },
            { label: ui(locale, { tr: "Yeterli bağlam", en: "Useful context", de: "Nützlicher Kontext", zh: "有效语境" }), ok: list.length >= 18 },
            { label: ui(locale, { tr: "Çıktı biçimi", en: "Output format", de: "Ausgabeformat", zh: "输出格式" }), ok: /(?:liste|tablo|json|başlık|madde|format|list|table|heading|bullet|tabelle|überschrift|列表|表格|标题|格式)/iu.test(input) },
            { label: ui(locale, { tr: "Kısıt veya sınır", en: "Constraint", de: "Bedingung", zh: "约束条件" }), ok: /(?:en az|en fazla|yalnızca|kaçın|kullanma|zorunlu|at least|at most|only|avoid|must|do not|mindestens|höchstens|nur|vermeiden|muss|至少|最多|仅|避免|必须)/iu.test(input) },
            { label: ui(locale, { tr: "Hedef kitle veya ton", en: "Audience or tone", de: "Zielgruppe oder Ton", zh: "受众或语气" }), ok: /(?:kullanıcı|okuyucu|müşteri|uzman|başlangıç|ton|audience|reader|customer|expert|beginner|tone|zielgruppe|leser|kunde|einsteiger|受众|读者|客户|初学者|语气)/iu.test(input) },
            { label: ui(locale, { tr: "Kalite ölçütü", en: "Quality criterion", de: "Qualitätskriterium", zh: "质量标准" }), ok: /(?:doğru|kaynak|kanıt|özgün|açık|kontrol|accurate|source|evidence|original|clear|verify|korrekt|quelle|beleg|prüf|准确|来源|证据|清晰|核验)/iu.test(input) },
          ];
          const score = Math.round(checks.filter((item) => item.ok).length / checks.length * 100);
          const report = checks.map((item) => `${item.ok ? "✓" : "○"} ${item.label}${item.ok ? "" : ui(locale, { tr: " — eklenmesi önerilir", en: " — consider adding", de: " — sollte ergänzt werden", zh: " — 建议补充" })}`).join("\n");
          setResult(`${ui(locale, { tr: "PROMPT KALİTE RAPORU", en: "PROMPT QUALITY REPORT", de: "PROMPT-QUALITÄTSBERICHT", zh: "提示词质量报告" })}\n\n${report}\n\n${ui(locale, { tr: "Öneri: Eksik bileşenleri doğal bir dille ekleyin; gereksiz uzunluktan kaçının.", en: "Recommendation: add missing components in natural language and avoid unnecessary length.", de: "Empfehlung: Ergänzen Sie fehlende Bestandteile in natürlicher Sprache und vermeiden Sie unnötige Länge.", zh: "建议：用自然语言补充缺失部分，并避免不必要的冗长内容。" })}`, [{ label: ui(locale, { tr: "Kalite skoru", en: "Quality score", de: "Qualitätswert", zh: "质量评分" }), value: `${score}/100` }, { label: ui(locale, { tr: "Karşılanan ölçüt", en: "Checks passed", de: "Erfüllte Kriterien", zh: "通过标准" }), value: `${checks.filter((item) => item.ok).length}/${checks.length}` }, { label: ui(locale, { tr: "Kelime", en: "Words", de: "Wörter", zh: "词/分段" }), value: list.length }]);
          break;
        }
        case "meta-prompt-olusturucu": {
          const t = ui(locale, {
            tr: { role: "ROL", roleText: "Görevin amacına uygun, kanıta dayalı ve açık iletişim kuran bir uzman gibi çalış.", objective: "HEDEF", context: "BAĞLAM VE SINIRLAR", fallback: "Yalnızca verilen bilgiyi kullan. Bilinmeyen noktaları varsayma; 'yetersiz bilgi' olarak işaretle.", process: "ÇALIŞMA SÜRECİ", steps: ["Hedefi ve başarı ölçütünü yeniden ifade et.", "Girdiyi çelişki, eksik bilgi ve hassas veri açısından kontrol et.", "Sonucu en açık ve kısa yapıda hazırla.", "Son kontrolde iddiaları, kapsamı ve biçimi doğrula."], contract: "ÇIKTI SÖZLEŞMESİ", bullets: ["Önce kısa sonuç özeti", "Ardından gerekçeli maddeler", "Son bölümde riskler ve sonraki adımlar"], sections: "Şablon bölümü", words: "Hedef kelimesi" },
            en: { role: "ROLE", roleText: "Act as a domain-appropriate specialist who communicates clearly and relies on evidence.", objective: "OBJECTIVE", context: "CONTEXT AND CONSTRAINTS", fallback: "Use only the supplied information. Do not invent missing facts; mark them as 'insufficient information.'", process: "PROCESS", steps: ["Restate the goal and success criteria.", "Check the input for conflicts, missing information, and sensitive data.", "Prepare the result in the clearest concise structure.", "Verify claims, scope, and format before finalizing."], contract: "OUTPUT CONTRACT", bullets: ["Start with a short outcome summary", "Follow with reasoned bullet points", "End with risks and next steps"], sections: "Template sections", words: "Goal words" },
            de: { role: "ROLLE", roleText: "Arbeiten Sie als fachlich passende Person, die klar kommuniziert und sich auf Belege stützt.", objective: "ZIEL", context: "KONTEXT UND GRENZEN", fallback: "Verwenden Sie nur die bereitgestellten Informationen. Erfinden Sie keine fehlenden Fakten; markieren Sie sie als 'unzureichende Information'.", process: "VORGEHEN", steps: ["Formulieren Sie Ziel und Erfolgskriterien neu.", "Prüfen Sie die Eingabe auf Widersprüche, fehlende Angaben und sensible Daten.", "Bereiten Sie das Ergebnis möglichst klar und knapp auf.", "Prüfen Sie abschließend Aussagen, Umfang und Format."], contract: "AUSGABEVERTRAG", bullets: ["Mit einer kurzen Ergebniszusammenfassung beginnen", "Begründete Stichpunkte folgen lassen", "Mit Risiken und nächsten Schritten enden"], sections: "Vorlagenabschnitte", words: "Wörter im Ziel" },
            zh: { role: "角色", roleText: "以符合任务领域的专家身份工作，清晰沟通并以证据为依据。", objective: "目标", context: "背景与边界", fallback: "仅使用给定信息。不要编造缺失事实；将其标记为“信息不足”。", process: "工作流程", steps: ["重新表述目标与成功标准。", "检查输入中的冲突、缺失信息和敏感数据。", "以最清晰、简洁的结构生成结果。", "完成前核验主张、范围和格式。"], contract: "输出约定", bullets: ["先给出简短结果摘要", "随后列出有依据的要点", "最后说明风险与后续步骤"], sections: "模板部分", words: "目标词/分段" },
          });
          setResult(`${t.role}\n${t.roleText}\n\n${t.objective}\n${input.trim()}\n\n${t.context}\n${secondary.trim() || t.fallback}\n\n${t.process}\n${t.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\n${t.contract}\n${t.bullets.map((item) => `- ${item}`).join("\n")}`, [{ label: t.sections, value: 5 }, { label: t.words, value: list.length }]);
          break;
        }
        case "few-shot-ornek-olusturucu": {
          const t = ui(locale, {
            tr: { shape: "Her örneği `girdi => çıktı` biçiminde yazın.", minimum: "Deseni göstermek için en az iki örnek ekleyin.", example: "ÖRNEK", input: "Girdi", output: "Çıktı", task: "GÖREV", instructions: "TALİMATLAR", rules: ["Aşağıdaki örneklerdeki karar mantığını ve çıktı biçimini izle.", "Örnekleri ezberlemek yerine yeni girdinin özelliklerini değerlendir.", "Belirsiz durumda varsayımını kısa biçimde belirt."], next: "YENİ GİRDİ", examples: "Örnek", words: "Görev kelimesi" },
            en: { shape: "Write every example as `input => output`.", minimum: "Add at least two examples to demonstrate the pattern.", example: "EXAMPLE", input: "Input", output: "Output", task: "TASK", instructions: "INSTRUCTIONS", rules: ["Follow the decision pattern and output format demonstrated below.", "Evaluate the new input rather than copying an example.", "State any assumption briefly when the input is ambiguous."], next: "NEW INPUT", examples: "Examples", words: "Task words" },
            de: { shape: "Schreiben Sie jedes Beispiel als `Eingabe => Ausgabe`.", minimum: "Fügen Sie mindestens zwei Beispiele hinzu, damit das Muster erkennbar ist.", example: "BEISPIEL", input: "Eingabe", output: "Ausgabe", task: "AUFGABE", instructions: "ANWEISUNGEN", rules: ["Folgen Sie der Entscheidungslogik und dem Ausgabeformat der Beispiele.", "Bewerten Sie die neue Eingabe, statt ein Beispiel zu kopieren.", "Nennen Sie bei Mehrdeutigkeit die Annahme kurz."], next: "NEUE EINGABE", examples: "Beispiele", words: "Aufgabenwörter" },
            zh: { shape: "请将每个示例写成 `输入 => 输出` 格式。", minimum: "至少添加两个示例以说明模式。", example: "示例", input: "输入", output: "输出", task: "任务", instructions: "说明", rules: ["遵循下方示例展示的判断逻辑和输出格式。", "评估新输入的特征，不要机械复制示例。", "输入有歧义时简要说明假设。"], next: "新输入", examples: "示例数量", words: "任务词/分段" },
          });
          const examples = secondary.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => { const divider = line.indexOf("=>"); if (divider < 1 || divider >= line.length - 2) throw new Error(t.shape); return { input: line.slice(0, divider).trim(), output: line.slice(divider + 2).trim() }; });
          if (examples.length < 2) throw new Error(t.minimum);
          const exampleBlock = examples.map((example, index) => `${t.example} ${index + 1}\n${t.input}: ${example.input}\n${t.output}: ${example.output}`).join("\n\n");
          setResult(`${t.task}\n${input.trim()}\n\n${t.instructions}\n${t.rules.map((rule) => `- ${rule}`).join("\n")}\n\n${exampleBlock}\n\n${t.next}\n{{input}}\n\n${t.output}\n`, [{ label: t.examples, value: examples.length }, { label: t.words, value: list.length }]);
          break;
        }
        case "sistem-promptu-persona-sablonu": {
          const guidelines = secondary.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
          const t = ui(locale, {
            tr: { role: "SİSTEM ROLÜ", roleText: `Sen ${input.trim()}.`, mission: "AMAÇ", missionText: "Kullanıcının hedefini doğru anlayıp açık, yararlı ve doğrulanabilir bir yanıt üret. Başarıyı yalnızca akıcı metinle değil, talimatlara ve sınırlarına uyumla ölç.", behavior: "İLETİŞİM VE DAVRANIŞ", defaults: ["Sakin, açık ve doğrudan yaz.", "Teknik terimleri ilk kullanımda açıkla."], boundaries: "DEĞİŞMEZ SINIRLAR", limits: ["Bilinmeyen bilgi, kaynak veya sonucu uydurma.", "Hassas veriyi gereksiz yere isteme veya tekrar etme.", "Hukuki, tıbbi, finansal veya güvenlik açısından kritik konuda kesin garanti verme.", "Talimatlar çelişirse çelişkiyi açıkla ve güvenli seçeneği sor."], contract: "ÇIKTI SÖZLEŞMESİ", steps: ["Sonuç veya öneriyle başla.", "Gerekçeyi kısa ve denetlenebilir maddelerle açıkla.", "Varsayımları, belirsizliği ve sonraki adımı belirt.", "Yanıtı göndermeden önce rol, sınır ve biçim uyumunu kontrol et."], rules: "Kural", words: "Rol kelimesi" },
            en: { role: "SYSTEM ROLE", roleText: `You are ${input.trim()}.`, mission: "MISSION", missionText: "Understand the user's goal and produce a clear, useful, verifiable response. Measure success by adherence to instructions and boundaries, not fluency alone.", behavior: "COMMUNICATION AND BEHAVIOR", defaults: ["Write calmly, clearly, and directly.", "Explain technical terms on first use."], boundaries: "NON-NEGOTIABLE BOUNDARIES", limits: ["Do not invent missing facts, sources, or outcomes.", "Do not request or repeat sensitive data unnecessarily.", "Do not guarantee legal, medical, financial, or security-critical outcomes.", "If instructions conflict, explain the conflict and ask for the safer choice."], contract: "OUTPUT CONTRACT", steps: ["Lead with the outcome or recommendation.", "Explain the reasoning with concise, auditable points.", "State assumptions, uncertainty, and the next step.", "Before sending, verify role, boundary, and format compliance."], rules: "Rules", words: "Role words" },
            de: { role: "SYSTEMROLLE", roleText: `Sie sind ${input.trim()}.`, mission: "AUFTRAG", missionText: "Verstehen Sie das Ziel der Person und liefern Sie eine klare, nützliche und überprüfbare Antwort. Messen Sie Erfolg an der Einhaltung von Anweisungen und Grenzen, nicht nur an flüssigem Text.", behavior: "KOMMUNIKATION UND VERHALTEN", defaults: ["Schreiben Sie ruhig, klar und direkt.", "Erklären Sie Fachbegriffe bei der ersten Verwendung."], boundaries: "UNVERHANDELBARE GRENZEN", limits: ["Erfinden Sie keine fehlenden Fakten, Quellen oder Ergebnisse.", "Fordern oder wiederholen Sie sensible Daten nicht unnötig.", "Geben Sie keine Garantien für rechtliche, medizinische, finanzielle oder sicherheitskritische Ergebnisse.", "Erklären Sie widersprüchliche Anweisungen und fragen Sie nach der sichereren Wahl."], contract: "AUSGABEVERTRAG", steps: ["Mit Ergebnis oder Empfehlung beginnen.", "Die Begründung in knappen, prüfbaren Punkten erklären.", "Annahmen, Unsicherheit und nächsten Schritt nennen.", "Vor dem Senden Rolle, Grenzen und Format prüfen."], rules: "Regeln", words: "Wörter der Rolle" },
            zh: { role: "系统角色", roleText: `你是${input.trim()}。`, mission: "使命", missionText: "准确理解用户目标，并生成清晰、有用、可验证的回答。成功标准是遵守说明与边界，而不只是语言流畅。", behavior: "沟通与行为", defaults: ["保持冷静、清晰和直接。", "技术术语首次出现时加以解释。"], boundaries: "不可突破的边界", limits: ["不得编造未知事实、来源或结果。", "不得无必要地索取或复述敏感数据。", "不得对法律、医疗、金融或安全关键结果作出保证。", "说明冲突的指令，并询问更安全的选择。"], contract: "输出约定", steps: ["先给出结果或建议。", "用简明、可审查的要点解释依据。", "说明假设、不确定性和下一步。", "发送前检查角色、边界和格式是否一致。"], rules: "规则", words: "角色词/分段" },
          });
          const behavior = (guidelines.length ? guidelines : t.defaults).map((item) => `- ${item}`).join("\n");
          setResult(`${t.role}\n${t.roleText}\n\n${t.mission}\n${t.missionText}\n\n${t.behavior}\n${behavior}\n\n${t.boundaries}\n${t.limits.map((item) => `- ${item}`).join("\n")}\n\n${t.contract}\n${t.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`, [{ label: t.rules, value: guidelines.length + 8 }, { label: t.words, value: list.length }]);
          break;
        }
        case "token-sayaci": {
          const chars = input.length; const estimate = tokenEstimate(input, locale); const formatter = new Intl.NumberFormat(localeTags[locale]);
          const budget = [4096, 8192, 16384, 32768].find((size) => estimate.high <= size);
          setResult(ui(locale, {
            tr: `Tahmini aralık ${formatter.format(estimate.low)}–${formatter.format(estimate.high)} token; orta değer ${formatter.format(estimate.estimate)}. Bu, Unicode yapısı ve noktalama yoğunluğunu hesaba katan modelden bağımsız bir planlama tahminidir. Gerçek sayı yalnızca hedef modelin tokenizer'ıyla belirlenir.`,
            en: `Estimated range: ${formatter.format(estimate.low)}–${formatter.format(estimate.high)} tokens; midpoint ${formatter.format(estimate.estimate)}. This model-agnostic planning estimate accounts for Unicode script and punctuation density. Only the target model's tokenizer can provide an exact count.`,
            de: `Geschätzter Bereich: ${formatter.format(estimate.low)}–${formatter.format(estimate.high)} Token; Mittelwert ${formatter.format(estimate.estimate)}. Diese modellunabhängige Planungsschätzung berücksichtigt Unicode-Schrift und Zeichensetzung. Exakt zählt nur der Tokenizer des Zielmodells.`,
            zh: `估算范围为 ${formatter.format(estimate.low)}–${formatter.format(estimate.high)} 个 token，中值 ${formatter.format(estimate.estimate)}。该模型无关的规划估算考虑了 Unicode 文字与标点密度；精确数量只能由目标模型的 tokenizer 给出。`,
          }), [
            { label: ui(locale, { tr: "Tahmini token", en: "Estimated tokens", de: "Geschätzte Token", zh: "估算 token" }), value: estimate.estimate },
            { label: ui(locale, { tr: "Güvenli üst tahmin", en: "Planning upper bound", de: "Planungsobergrenze", zh: "规划上限" }), value: estimate.high },
            { label: ui(locale, { tr: "Sığdığı ilk bağlam", en: "First fitting context", de: "Erstes passendes Kontextfenster", zh: "首个可容纳上下文" }), value: budget ? `${budget / 1024}K` : ">32K" },
            { label: ui(locale, { tr: "Kelime/segment", en: "Words/segments", de: "Wörter/Segmente", zh: "词/分段" }), value: list.length },
            { label: ui(locale, { tr: "Karakter", en: "Characters", de: "Zeichen", zh: "字符" }), value: chars },
          ]);
          break;
        }
        case "okunabilirlik-analizi": {
          const sentences = sentenceCount(input); const avg = list.length / sentences;
          const syllables = list.reduce((sum, word) => sum + estimateSyllables(word, locale), 0);
          const hanCharacters = input.match(/\p{Script=Han}/gu)?.length ?? 0;
          const rawScore = locale === "tr" ? 198.825 - 40.175 * (syllables / Math.max(1, list.length)) - 2.61 * avg
            : locale === "de" ? 180 - avg - 58.5 * (syllables / Math.max(1, list.length))
              : locale === "zh" ? 100 - Math.max(0, hanCharacters / sentences - 18) * 2.8 - Math.max(0, avg - 14) * 1.2
                : 206.835 - 1.015 * avg - 84.6 * (syllables / Math.max(1, list.length));
          const score = Math.max(0, Math.min(100, rawScore));
          const level = score >= 70 ? ui(locale, { tr: "Kolay", en: "Easy", de: "Leicht", zh: "较易" }) : score >= 50 ? ui(locale, { tr: "Orta", en: "Moderate", de: "Mittel", zh: "中等" }) : ui(locale, { tr: "Zor", en: "Difficult", de: "Schwierig", zh: "较难" });
          const longSentence = avg > (locale === "zh" ? 14 : 20);
          setResult(ui(locale, {
            tr: `${level} okunabilirlik. ${longSentence ? "Ortalama cümleler uzun; ana fikir başına daha kısa cümleler deneyin." : "Cümle uzunluğu dengeli görünüyor."} Ateşman yaklaşımı yalnızca yüzey yapısını ölçer; doğruluk ve konu zorluğunu ölçmez.`,
            en: `${level} readability. ${longSentence ? "Average sentences are long; consider one main idea per shorter sentence." : "Sentence length appears balanced."} Flesch-style scoring measures surface structure, not accuracy or subject difficulty.`,
            de: `${level} lesbar. ${longSentence ? "Die Sätze sind im Mittel lang; formulieren Sie möglichst eine Hauptidee pro kürzerem Satz." : "Die Satzlänge wirkt ausgewogen."} Die Amstad-Näherung misst Oberflächenstruktur, nicht Richtigkeit oder fachliche Schwierigkeit.`,
            zh: `可读性${level}。${longSentence ? "平均句子偏长，可尝试每个短句只表达一个主要观点。" : "句子长度较为均衡。"} 该结构性启发式只衡量表层长度，不衡量事实准确性或主题难度。`,
          }), [
            { label: ui(locale, { tr: "Okunabilirlik", en: "Readability", de: "Lesbarkeit", zh: "可读性" }), value: Math.round(score) },
            { label: ui(locale, { tr: "Ort. cümle", en: "Avg. sentence", de: "Ø Satzlänge", zh: "平均句长" }), value: avg.toFixed(1) },
            { label: ui(locale, { tr: "Cümle", en: "Sentences", de: "Sätze", zh: "句子" }), value: sentences },
            { label: ui(locale, { tr: "Kelime çeşitliliği", en: "Lexical diversity", de: "Wortvielfalt", zh: "词汇多样性" }), value: `${Math.round(new Set(list).size / Math.max(1, list.length) * 100)}%` },
          ]);
          if (list.length < 30) setNotice({ kind: "warning", text: ui(locale, { tr: "Kısa örneklerde skor oynaktır; daha güvenilir karşılaştırma için en az 30 kelime kullanın.", en: "Scores are unstable on short samples; use at least 30 words for a more reliable comparison.", de: "Bei kurzen Stichproben schwankt der Wert; verwenden Sie mindestens 30 Wörter für einen belastbareren Vergleich.", zh: "短文本评分波动较大；建议至少使用 30 个词或分段进行更可靠的比较。" }) });
          break;
        }
        case "metin-benzerlik-analizi": {
          if (!secondary.trim()) throw new Error(ui(locale, { tr: "İkinci metni de girin.", en: "Enter the comparison text.", de: "Geben Sie auch den Vergleichstext ein.", zh: "请输入用于比较的第二段文本。" }));
          const result = similarity(input, secondary, locale);
          setResult(ui(locale, { tr: `Sözcük tabanlı kosinüs benzerliği %${Math.round(result.cosine * 100)}, Jaccard örtüşmesi %${Math.round(result.jaccard * 100)}. Bu ölçüm bağlamsal yapay zekâ benzerliği değildir.`, en: `Word-based cosine similarity is ${Math.round(result.cosine * 100)}%; Jaccard overlap is ${Math.round(result.jaccard * 100)}%. This is not contextual AI similarity.`, de: `Die wortbasierte Kosinus-Ähnlichkeit beträgt ${Math.round(result.cosine * 100)} %, die Jaccard-Überlappung ${Math.round(result.jaccard * 100)} %. Dies ist keine kontextuelle KI-Ähnlichkeit.`, zh: `基于词项的余弦相似度为 ${Math.round(result.cosine * 100)}%，Jaccard 重合度为 ${Math.round(result.jaccard * 100)}%。该结果不是上下文 AI 相似度。` }), [{ label: "Cosine", value: `${Math.round(result.cosine * 100)}%` }, { label: "Jaccard", value: `${Math.round(result.jaccard * 100)}%` }, { label: ui(locale, { tr: "Ortak sözcük", en: "Shared terms", de: "Gemeinsame Begriffe", zh: "共有词项" }), value: result.shared }]);
          break;
        }
        case "metin-temizleyici": {
          const invisiblePattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u00AD\u034F\u061C\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/gu;
          const invisibleCount = (input.match(invisiblePattern) ?? []).length;
          const cleaned = input.normalize("NFC").replace(/\r\n?/g, "\n").replace(/\u00A0/g, " ").replace(invisiblePattern, "").replace(/[\t ]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
          const changed = Math.max(0, [...input].length - [...cleaned].length);
          setResult(cleaned, [{ label: ui(locale, { tr: "Kaldırılan/değişen", en: "Removed/changed", de: "Entfernt/geändert", zh: "移除或变更" }), value: changed }, { label: ui(locale, { tr: "Görünmez kontrol", en: "Invisible controls", de: "Unsichtbare Steuerzeichen", zh: "不可见控制字符" }), value: invisibleCount }, { label: ui(locale, { tr: "Satır", en: "Lines", de: "Zeilen", zh: "行" }), value: cleaned ? cleaned.split("\n").length : 0 }, { label: "Unicode", value: "NFC" }]);
          if (invisibleCount) setNotice({ kind: "warning", text: ui(locale, { tr: "Görünmez ve yön denetimi karakterleri kaldırıldı. İki yönlü metin veya dilbilimsel veri kullanıyorsanız çıktıyı özellikle kontrol edin.", en: "Invisible and directional controls were removed. Review carefully if the text intentionally uses bidirectional or linguistic controls.", de: "Unsichtbare und Richtungssteuerzeichen wurden entfernt. Bei bidirektionalem oder linguistischem Text bitte gezielt prüfen.", zh: "已移除不可见字符和方向控制符；若文本有意使用双向或语言控制，请仔细核对。" }) });
          break;
        }
        case "buyuk-kucuk-harf-donusturucu": {
          const converted = convertCase(input, mode, locale);
          const sourceChars = [...input]; const outputChars = [...converted];
          const changed = sourceChars.reduce((count, char, index) => count + (char !== outputChars[index] ? 1 : 0), 0) + Math.max(0, outputChars.length - sourceChars.length);
          setResult(converted, [{ label: ui(locale, { tr: "Karakter", en: "Characters", de: "Zeichen", zh: "字符" }), value: outputChars.length }, { label: ui(locale, { tr: "Değişen konum", en: "Changed positions", de: "Geänderte Positionen", zh: "变更位置" }), value: changed }, { label: ui(locale, { tr: "Korunan bağlantı/e-posta", en: "Protected links/emails", de: "Geschützte Links/E-Mails", zh: "受保护链接/邮箱" }), value: Math.max(0, input.split(/((?:https?:\/\/|www\.)\S+|[\p{L}\p{N}.+_-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,})/giu).filter((_, index) => index % 2 === 1).length) }]);
          break;
        }
        case "kelime-sayaci": {
          const paragraphs = input.trim().split(/\n\s*\n/).filter(Boolean).length;
          const readMinutes = Math.max(1, Math.ceil(list.length / 200));
          setResult(ui(locale, { tr: `Tahmini okuma süresi ${readMinutes} dakika. Uzunluk tek başına kalite göstergesi değildir; içeriğin amacı ve okuyucunun ihtiyacıyla birlikte değerlendirin.`, en: `Estimated reading time is ${readMinutes} minute${readMinutes === 1 ? "" : "s"}. Length alone does not indicate quality; evaluate it against purpose and reader needs.`, de: `Geschätzte Lesezeit: ${readMinutes} Minute${readMinutes === 1 ? "" : "n"}. Länge allein ist kein Qualitätsmerkmal; berücksichtigen Sie Zweck und Bedarf der Lesenden.`, zh: `预计阅读时间为 ${readMinutes} 分钟。篇幅本身不代表质量，请结合内容目的和读者需求判断。` }), [{ label: ui(locale, { tr: "Kelime", en: "Words", de: "Wörter", zh: "词/分段" }), value: list.length }, { label: ui(locale, { tr: "Karakter", en: "Characters", de: "Zeichen", zh: "字符" }), value: input.length }, { label: ui(locale, { tr: "Cümle", en: "Sentences", de: "Sätze", zh: "句子" }), value: sentenceCount(input) }, { label: ui(locale, { tr: "Paragraf", en: "Paragraphs", de: "Absätze", zh: "段落" }), value: paragraphs }]);
          break;
        }
        case "json-bicimlendirici": {
          const parsed = JSON.parse(input); const pretty = mode !== "minify"; const stack: Array<{ value: unknown; depth: number }> = [{ value: parsed, depth: 0 }]; let keys = 0; let nodes = 0; let maxDepth = 0;
          while (stack.length) { const current = stack.pop()!; nodes += 1; maxDepth = Math.max(maxDepth, current.depth); if (current.value && typeof current.value === "object") { if (Array.isArray(current.value)) current.value.forEach((value) => stack.push({ value, depth: current.depth + 1 })); else Object.entries(current.value as Record<string, unknown>).forEach(([, value]) => { keys += 1; stack.push({ value, depth: current.depth + 1 }); }); } if (nodes > 250_000) throw new Error(ui(locale, { tr: "JSON güvenli inceleme düğümü sınırını aşıyor.", en: "The JSON exceeds the safe inspection node limit.", de: "Das JSON überschreitet die sichere Grenze für Prüfobjekte.", zh: "JSON 超出了安全检查节点上限。" })); }
          const output = JSON.stringify(parsed, null, pretty ? 2 : 0);
          setResult(output, [{ label: ui(locale, { tr: "Durum", en: "Status", de: "Status", zh: "状态" }), value: ui(locale, { tr: "Geçerli JSON", en: "Valid JSON", de: "Gültiges JSON", zh: "有效 JSON" }) }, { label: ui(locale, { tr: "Kök tür", en: "Root type", de: "Wurzeltyp", zh: "根类型" }), value: Array.isArray(parsed) ? "Array" : parsed === null ? "null" : typeof parsed }, { label: ui(locale, { tr: "Alan", en: "Keys", de: "Schlüssel", zh: "字段" }), value: keys }, { label: ui(locale, { tr: "En derin seviye", en: "Maximum depth", de: "Maximale Tiefe", zh: "最大深度" }), value: maxDepth }, { label: ui(locale, { tr: "Çıktı baytı", en: "Output bytes", de: "Ausgabe-Bytes", zh: "输出字节" }), value: new Blob([output]).size }]);
          break;
        }
        case "json-csv-donusturucu": {
          if (mode === "csv-to-json") {
            const delimiter = detectCsvDelimiter(input); const rows = csvParse(input, locale, delimiter); const headers = rows[0] ?? [];
            const data = rows.slice(1).filter((row) => row.some(Boolean)).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
            setResult(JSON.stringify(data, null, 2), [{ label: ui(locale, { tr: "Kayıt", en: "Records", de: "Datensätze", zh: "记录" }), value: data.length }, { label: ui(locale, { tr: "Sütun", en: "Columns", de: "Spalten", zh: "列" }), value: headers.length }, { label: ui(locale, { tr: "Algılanan ayraç", en: "Detected delimiter", de: "Erkanntes Trennzeichen", zh: "检测到的分隔符" }), value: delimiter === "\t" ? "TAB" : delimiter }]);
          } else {
            const data = JSON.parse(input); if (!Array.isArray(data) || !data.every((item) => item && typeof item === "object" && !Array.isArray(item))) throw new Error(ui(locale, { tr: "Düz nesnelerden oluşan bir JSON dizisi gerekir.", en: "A JSON array of flat objects is required.", de: "Erforderlich ist ein JSON-Array aus flachen Objekten.", zh: "需要由扁平对象组成的 JSON 数组。" }));
            const headers = [...new Set(data.flatMap((item) => Object.keys(item)))];
            const csv = [headers.map(csvEscape).join(","), ...data.map((item) => headers.map((header) => csvEscape(item[header])).join(","))].join("\n");
            setResult(csv, [{ label: ui(locale, { tr: "Kayıt", en: "Records", de: "Datensätze", zh: "记录" }), value: data.length }, { label: ui(locale, { tr: "Sütun", en: "Columns", de: "Spalten", zh: "列" }), value: headers.length }]);
          }
          break;
        }
        case "regex-test-araci": {
          if (!secondary.trim()) throw new Error(ui(locale, { tr: "Bir regex kalıbı girin veya örnek veriyi yükleyin.", en: "Enter a regular expression or load the example.", de: "Geben Sie einen regulären Ausdruck ein oder laden Sie das Beispiel.", zh: "请输入正则表达式或加载示例。" }));
          if (input.length > 50000) throw new Error(ui(locale, { tr: "Performans için test metni 50.000 karakterle sınırlıdır.", en: "Sample text is limited to 50,000 characters for performance.", de: "Der Testtext ist aus Leistungsgründen auf 50.000 Zeichen begrenzt.", zh: "为保障性能，测试文本限 50,000 个字符。" }));
          if (secondary.length > 500) throw new Error(ui(locale, { tr: "Regex kalıbı güvenli inceleme için 500 karakterle sınırlıdır.", en: "The regex pattern is limited to 500 characters for safe inspection.", de: "Das Regex-Muster ist für eine sichere Prüfung auf 500 Zeichen begrenzt.", zh: "为安全检查，正则表达式限 500 个字符。" }));
          if (/(\([^)]*[+*][^)]*\))[+*{]/.test(secondary)) throw new Error(ui(locale, { tr: "İç içe nicelik belirteci ReDoS riski taşıyabilir; kalıbı sadeleştirin.", en: "Nested quantifiers may create a ReDoS risk; simplify the pattern.", de: "Verschachtelte Quantifizierer können ein ReDoS-Risiko erzeugen; vereinfachen Sie das Muster.", zh: "嵌套量词可能造成 ReDoS 风险，请简化表达式。" }));
          const matches = await runRegexSafely(input, secondary, flags);
          const report = matches.length ? matches.map((match, index) => `${index + 1}. [${match.index}] ${JSON.stringify(match.text)}${match.groups.length ? ` | ${ui(locale, { tr: "gruplar", en: "groups", de: "Gruppen", zh: "分组" })}: ${match.groups.map((value) => JSON.stringify(value)).join(", ")}` : ""}`).join("\n") : ui(locale, { tr: "Eşleşme bulunamadı.", en: "No matches found.", de: "Keine Treffer gefunden.", zh: "未找到匹配项。" });
          setResult(report, [{ label: ui(locale, { tr: "Eşleşme", en: "Matches", de: "Treffer", zh: "匹配项" }), value: matches.length }, { label: ui(locale, { tr: "Metin uzunluğu", en: "Text length", de: "Textlänge", zh: "文本长度" }), value: input.length }]);
          break;
        }
        case "csv-inceleyici": {
          const delimiter = detectCsvDelimiter(input); const rows = csvParse(input, locale, delimiter).filter((row) => row.some((cell) => cell.length)); const headers = rows[0] ?? []; const irregular = rows.slice(1).map((row, index) => ({ row, line: index + 2 })).filter(({ row }) => row.length !== headers.length);
          const duplicateHeaders = headers.filter((header, index) => headers.indexOf(header) !== index); const blankHeaders = headers.filter((header) => !header.trim()).length;
          const typeFor = (values: string[]) => values.every((value) => value === "" || /^-?\d+(?:[.,]\d+)?$/u.test(value)) ? "number" : values.every((value) => value === "" || /^(?:true|false|yes|no|0|1)$/iu.test(value)) ? "boolean" : values.every((value) => value === "" || !Number.isNaN(Date.parse(value))) ? "date-like" : "text";
          const profile = headers.map((header, index) => ({ header: header || `(column ${index + 1})`, type: typeFor(rows.slice(1, 101).map((row) => row[index] ?? "")), empty: rows.slice(1).filter((row) => !(row[index] ?? "").trim()).length, sample: rows.slice(1).map((row) => row[index] ?? "").find(Boolean)?.slice(0, 70) ?? "—" }));
          const report = [`${ui(locale, { tr: "ALGILANAN ŞEMA", en: "INFERRED PROFILE", de: "ERKANNTES PROFIL", zh: "推断概况" })}`, ...profile.map((column, index) => `${index + 1}. ${column.header} · ${column.type} · ${ui(locale, { tr: "boş", en: "empty", de: "leer", zh: "空值" })}: ${column.empty} · ${ui(locale, { tr: "örnek", en: "sample", de: "Beispiel", zh: "示例" })}: ${column.sample}`), "", `${ui(locale, { tr: "Düzensiz satırlar", en: "Irregular rows", de: "Unregelmäßige Zeilen", zh: "不规则行" })}: ${irregular.length ? irregular.slice(0, 50).map((item) => item.line).join(", ") : ui(locale, { tr: "yok", en: "none", de: "keine", zh: "无" })}`].join("\n");
          setResult(report, [{ label: ui(locale, { tr: "Veri satırı", en: "Data rows", de: "Datenzeilen", zh: "数据行" }), value: Math.max(0, rows.length - 1) }, { label: ui(locale, { tr: "Sütun", en: "Columns", de: "Spalten", zh: "列" }), value: headers.length }, { label: ui(locale, { tr: "Düzensiz satır", en: "Irregular rows", de: "Unregelmäßige Zeilen", zh: "不规则行" }), value: irregular.length }, { label: ui(locale, { tr: "Başlık sorunu", en: "Header issues", de: "Header-Probleme", zh: "表头问题" }), value: duplicateHeaders.length + blankHeaders }, { label: ui(locale, { tr: "Ayraç", en: "Delimiter", de: "Trennzeichen", zh: "分隔符" }), value: delimiter === "\t" ? "TAB" : delimiter }]);
          if (duplicateHeaders.length || blankHeaders) setNotice({ kind: "warning", text: ui(locale, { tr: `Başlıklarda ${duplicateHeaders.length} yinelenen ve ${blankHeaders} boş alan var; JSON/SQL dönüşümünden önce benzersiz adlar verin.`, en: `Headers contain ${duplicateHeaders.length} duplicate and ${blankHeaders} blank names; assign unique names before JSON or SQL conversion.`, de: `Header enthalten ${duplicateHeaders.length} doppelte und ${blankHeaders} leere Namen; vor JSON/SQL eindeutig benennen.`, zh: `表头包含 ${duplicateHeaders.length} 个重复项和 ${blankHeaders} 个空名称；转换为 JSON/SQL 前请使用唯一名称。` }) });
          break;
        }
        case "base64-kodlayici": {
          if (mode === "decode") {
            const compact = input.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compact) || compact.length % 4 === 1) throw new Error(ui(locale, { tr: "Geçerli standart veya URL-safe Base64 girin.", en: "Enter valid standard or URL-safe Base64.", de: "Geben Sie gültiges Standard- oder URL-sicheres Base64 ein.", zh: "请输入有效的标准 Base64 或 URL-safe Base64。" }));
            const padded = compact.padEnd(Math.ceil(compact.length / 4) * 4, "=");
            const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
            setResult(new TextDecoder("utf-8", { fatal: true }).decode(bytes), [{ label: ui(locale, { tr: "Çözülen bayt", en: "Decoded bytes", de: "Dekodierte Bytes", zh: "解码字节" }), value: bytes.length }]);
          } else {
            const bytes = new TextEncoder().encode(input); let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
            setResult(btoa(binary), [{ label: ui(locale, { tr: "Kaynak bayt", en: "Source bytes", de: "Quell-Bytes", zh: "源字节" }), value: bytes.length }]);
          }
          break;
        }
        case "url-kodlayici": {
          const result = mode === "decode" ? decodeURIComponent(input.trim()) : encodeURIComponent(input);
          setResult(result, [{ label: ui(locale, { tr: "Çıktı karakteri", en: "Output characters", de: "Ausgabezeichen", zh: "输出字符" }), value: result.length }]);
          break;
        }
        case "jwt-decoder": {
          const segments = input.trim().split("."); if (segments.length !== 3) throw new Error(ui(locale, { tr: "JWT üç nokta ayrımlı bölüm içermelidir.", en: "A JWT must contain three dot-separated segments.", de: "Ein JWT muss drei durch Punkte getrennte Segmente enthalten.", zh: "JWT 必须包含三个由点分隔的段。" }));
          const header = JSON.parse(decodeBase64Url(segments[0])); const payload = JSON.parse(decodeBase64Url(segments[1]));
          const timeClaims = ["iat", "nbf", "exp"].filter((claim) => typeof payload[claim] === "number").map((claim) => `${claim}: ${new Date(payload[claim] * 1000).toISOString()}`);
          const expired = typeof payload.exp === "number" ? payload.exp * 1000 < Date.now() : null;
          setResult(`HEADER\n${JSON.stringify(header, null, 2)}\n\nPAYLOAD\n${JSON.stringify(payload, null, 2)}${timeClaims.length ? `\n\n${ui(locale, { tr: "ZAMAN CLAIM'LERİ", en: "TIME CLAIMS", de: "ZEIT-CLAIMS", zh: "时间声明" })}\n${timeClaims.join("\n")}` : ""}\n\n${ui(locale, { tr: "UYARI: Bu yalnızca decode işlemidir; imza ve token güvenilirliği doğrulanmadı.", en: "WARNING: This only decodes the token; its signature and trustworthiness were not verified.", de: "WARNUNG: Dies dekodiert nur den Token; Signatur und Vertrauenswürdigkeit wurden nicht geprüft.", zh: "警告：此操作仅解码令牌，未验证签名或令牌可信度。" })}`, [{ label: ui(locale, { tr: "Algoritma iddiası", en: "Claimed algorithm", de: "Angegebener Algorithmus", zh: "声明算法" }), value: typeof header.alg === "string" ? header.alg : "—" }, { label: ui(locale, { tr: "Payload alanı", en: "Payload claims", de: "Payload-Claims", zh: "Payload 字段" }), value: Object.keys(payload).length }, { label: ui(locale, { tr: "Süre durumu", en: "Expiry status", de: "Ablaufstatus", zh: "有效期状态" }), value: expired === null ? ui(locale, { tr: "exp yok", en: "no exp", de: "kein exp", zh: "无 exp" }) : expired ? ui(locale, { tr: "Süresi dolmuş", en: "Expired", de: "Abgelaufen", zh: "已过期" }) : ui(locale, { tr: "Süresi geçerli", en: "Not expired", de: "Nicht abgelaufen", zh: "未过期" }) }]);
          break;
        }
        case "cron-ifadesi-aciklayici": {
          const explanation = explainCron(input, locale);
          setResult(explanation, [{ label: ui(locale, { tr: "Alan", en: "Fields", de: "Felder", zh: "字段" }), value: 5 }, { label: ui(locale, { tr: "Durum", en: "Status", de: "Status", zh: "状态" }), value: ui(locale, { tr: "Geçerli", en: "Valid", de: "Gültig", zh: "有效" }) }]);
          break;
        }
        case "kvkk-veri-maskeleyici": {
          const patterns = [
            { label: "EMAIL", re: /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, validate: undefined },
            { label: "IBAN", re: /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){11,30}\b/gi, validate: undefined },
            { label: "TCKN_CANDIDATE", re: /\b[1-9]\d{10}\b/g, validate: passesTcknChecksum },
            { label: "CARD_CANDIDATE", re: /\b(?:\d[ -]*?){13,19}\b/g, validate: passesLuhn },
            { label: "IP", re: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g, validate: undefined },
            { label: "PHONE", re: /(?<!\d)(?:\+?\d{1,3}[ .-]?)?(?:\(?\d{3}\)?[ .-]?)\d{3}[ .-]?\d{2}[ .-]?\d{2}(?!\d)/g, validate: undefined },
          ];
          let masked = input; const found: Metric[] = [];
          patterns.forEach(({ label, re, validate }) => {
            let count = 0;
            const aliases = new Map<string, string>();
            masked = masked.replace(re, (candidate) => {
              if (validate && !validate(candidate)) return candidate;
              count += 1;
              const key = candidate.toLocaleLowerCase(localeTags[locale]);
              const existing = aliases.get(key);
              if (existing) return existing;
              const alias = `[${label}_${aliases.size + 1}]`;
              aliases.set(key, alias);
              return alias;
            });
            if (count) found.push({ label, value: count });
          });
          setResult(masked, found.length ? found : [{ label: ui(locale, { tr: "Bulunan desen", en: "Patterns found", de: "Gefundene Muster", zh: "发现的模式" }), value: 0 }]);
          setNotice({ kind: "warning", text: ui(locale, {
            tr: "Otomatik maskeleme bağlamsal kişisel verilerin tamamını bulamaz. TCKN/kart checksum kontrolü yalnızca aday tespitidir; gerçek kimlik, sahiplik veya hukuki uygunluk doğrulaması değildir. Paylaşmadan önce elle kontrol edin.",
            en: "Automatic masking cannot find all contextual personal data. TCKN/card checksum checks identify candidates only; they do not verify identity, ownership, or legal compliance. Review manually before sharing.",
            de: "Die automatische Maskierung erkennt nicht alle kontextabhängigen personenbezogenen Daten. TCKN-/Karten-Prüfsummen finden nur Kandidaten und bestätigen weder Identität noch Eigentum oder Rechtskonformität. Vor dem Teilen manuell prüfen.",
            zh: "自动脱敏无法识别所有依赖语境的个人数据。TCKN/银行卡校验和只用于发现候选项，不验证身份、所有权或法律合规性；分享前请人工复核。",
          }) });
          break;
        }
        case "guclu-parola-uretici": {
          const password = generateSecurePassword(length);
          setResult(password, [{ label: ui(locale, { tr: "Uzunluk", en: "Length", de: "Länge", zh: "长度" }), value: password.length }, { label: ui(locale, { tr: "Kaynak", en: "Source", de: "Quelle", zh: "来源" }), value: "Web Crypto" }]);
          break;
        }
        case "uuid-uretici": {
          const values = Array.from({ length: Math.min(50, Math.max(1, quantity)) }, generateUuid);
          setResult(values.join("\n"), [{ label: ui(locale, { tr: "Üretilen", en: "Generated", de: "Erzeugt", zh: "已生成" }), value: values.length }, { label: ui(locale, { tr: "Sürüm", en: "Version", de: "Version", zh: "版本" }), value: "UUID v4" }, { label: ui(locale, { tr: "Kaynak", en: "Source", de: "Quelle", zh: "来源" }), value: "Web Crypto" }]);
          break;
        }
        case "sha256-ozet-uretici": {
          const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
          const value = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
          setResult(value, [{ label: ui(locale, { tr: "Özet uzunluğu", en: "Digest length", de: "Hash-Länge", zh: "摘要长度" }), value: "256 bit" }, { label: ui(locale, { tr: "Algoritma", en: "Algorithm", de: "Algorithmus", zh: "算法" }), value: "SHA-256" }]);
          break;
        }
        default: throw new Error(ui(locale, { tr: "Araç yapılandırması bulunamadı.", en: "Tool configuration was not found.", de: "Die Werkzeugkonfiguration wurde nicht gefunden.", zh: "未找到工具配置。" }));
      }
    } catch (error) {
      setOutput(""); setMetrics([]);
      setNotice({ kind: "error", text: friendlyError(slug, error, locale) });
    } finally {
      setBusy(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setNotice({ kind: "success", text: labels.copied });
    } catch {
      setNotice({ kind: "error", text: ui(locale, { tr: "Tarayıcı pano izni vermedi. Çıktıyı seçip elle kopyalayabilirsiniz.", en: "The browser denied clipboard access. Select the output and copy it manually.", de: "Der Browser hat den Zugriff auf die Zwischenablage verweigert. Markieren und kopieren Sie die Ausgabe manuell.", zh: "浏览器拒绝访问剪贴板。您可以选中输出并手动复制。" }) });
    }
  }

  function downloadOutput() {
    if (!output) return;
    try {
      const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `bytequant-${slug}.txt`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setNotice({ kind: "success", text: labels.downloaded });
    } catch {
      setNotice({ kind: "error", text: ui(locale, { tr: "Dosya indirilemedi. Tarayıcının indirme iznini kontrol edin.", en: "The file could not be downloaded. Check the browser's download permission.", de: "Die Datei konnte nicht heruntergeladen werden. Prüfen Sie die Download-Berechtigung des Browsers.", zh: "文件无法下载。请检查浏览器的下载权限。" }) });
    }
  }

  const showMode = ["buyuk-kucuk-harf-donusturucu", "json-bicimlendirici", "json-csv-donusturucu", "base64-kodlayici", "url-kodlayici"].includes(slug);
  const operationState = busy ? "busy" : notice?.kind === "error" ? "error" : output ? "success" : "idle";
  const operationLabel = operationState === "busy" ? labels.running : operationState === "error" ? ui(locale, { tr: "Kontrol gerekiyor", en: "Review needed", de: "Prüfung nötig", zh: "需要检查" }) : operationState === "success" ? ui(locale, { tr: "Tamamlandı", en: "Completed", de: "Abgeschlossen", zh: "已完成" }) : ui(locale, { tr: "Hazır", en: "Ready", de: "Bereit", zh: "就绪" });
  const privacyConfirmation = ui(locale, { tr: "Bu işlem tamamen cihazınızda gerçekleşti; girdi ByteQuant sunucusuna gönderilmedi.", en: "This operation happened entirely on your device; input was not sent to ByteQuant servers.", de: "Dieser Vorgang fand vollständig auf Ihrem Gerät statt; Eingaben wurden nicht an ByteQuant gesendet.", zh: "此操作完全在您的设备上完成；输入未发送到 ByteQuant 服务器。" });

  return (
    <section className="workbench" data-workbench-quality="stage-3" aria-label={ui(locale, { tr: "Araç çalışma alanı", en: "Tool workbench", de: "Werkzeug-Arbeitsbereich", zh: "工具工作区" })} aria-busy={busy} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); void run(); } }}>
      <div className="workbench-bar"><span className="local-status"><i />{labels.local}<small>{labels.shortcut}</small></span><div className="workbench-bar-actions"><button type="button" className="demo-button" onClick={loadDemo} disabled={busy}>{labels.demo}</button><button type="button" className="ghost-button" onClick={clearWorkbench} disabled={busy}>{labels.clear}</button></div></div>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          {!noInputTools.has(slug) && <label className="field-label"><span>{labels.input}</span><textarea aria-invalid={operationState === "error"} aria-errormessage={operationState === "error" ? `${slug}-workbench-error` : undefined} data-agent-input data-agent-key="input" value={input} maxLength={100000} rows={slug === "metin-benzerlik-analizi" ? 7 : 11} onChange={(event) => { setInput(event.target.value); resetResult(); }} spellCheck="false" /><small className="field-counter">{input.length.toLocaleString(localeTags[locale])} / 100.000</small></label>}
          {secondInputTools.has(slug) && <label className="field-label"><span>{labels.second}</span>{slug === "regex-test-araci" ? <input aria-invalid={operationState === "error"} aria-errormessage={operationState === "error" ? `${slug}-workbench-error` : undefined} data-agent-input data-agent-key="secondary" value={secondary} maxLength={500} onChange={(event) => { setSecondary(event.target.value); resetResult(); }} spellCheck="false" /> : <textarea aria-invalid={operationState === "error"} aria-errormessage={operationState === "error" ? `${slug}-workbench-error` : undefined} data-agent-input data-agent-key="secondary" value={secondary} maxLength={50000} rows={5} onChange={(event) => { setSecondary(event.target.value); resetResult(); }} spellCheck="false" />}<small className="field-counter">{secondary.length.toLocaleString(localeTags[locale])} / {slug === "regex-test-araci" ? "500" : "50.000"}</small></label>}
          {slug === "regex-test-araci" && <label className="field-label compact-field"><span>{labels.flags}</span><input value={flags} maxLength={6} onChange={(event) => { setFlags(event.target.value.replace(/[^dgimsuvy]/g, "")); resetResult(); }} /></label>}
          {slug === "guclu-parola-uretici" && <label className="field-label range-field"><span>{labels.length}: {length}</span><input type="range" min="12" max="128" value={length} onChange={(event) => { setLength(Number(event.target.value)); resetResult(); }} /><small className="field-help">{ui(locale, { tr: "Her parola büyük/küçük harf, rakam ve sembol içerir.", en: "Every password includes upper/lowercase, digits, and symbols.", de: "Jedes Passwort enthält Groß- und Kleinbuchstaben, Ziffern und Symbole.", zh: "每个密码都包含大小写字母、数字和符号。" })}</small></label>}
          {slug === "uuid-uretici" && <label className="field-label compact-field"><span>{labels.quantity}</span><input type="number" min="1" max="50" value={quantity} onChange={(event) => { setQuantity(Math.min(50, Math.max(1, Number(event.target.value) || 1))); resetResult(); }} /><small className="field-help">{ui(locale, { tr: "Tek işlemde 1–50 kriptografik UUID v4.", en: "Generate 1–50 cryptographic UUID v4 values at once.", de: "Erzeugt 1–50 kryptografische UUID-v4-Werte pro Vorgang.", zh: "一次生成 1–50 个加密安全的 UUID v4。" })}</small></label>}
          {showMode && <label className="field-label compact-field"><span>{ui(locale, { tr: "İşlem", en: "Operation", de: "Vorgang", zh: "操作" })}</span><select data-agent-mode value={mode} onChange={(event) => { setMode(event.target.value); resetResult(); }}>
            {slug === "buyuk-kucuk-harf-donusturucu" && <><option value="default">{ui(locale, { tr: "Başlık biçimi", en: "Title case", de: "Titel-Schreibweise", zh: "标题格式" })}</option><option value="sentence">{ui(locale, { tr: "Cümle biçimi", en: "Sentence case", de: "Satz-Schreibweise", zh: "句子格式" })}</option><option value="upper">{ui(locale, { tr: "BÜYÜK HARF", en: "UPPERCASE", de: "GROSSBUCHSTABEN", zh: "大写" })}</option><option value="lower">{ui(locale, { tr: "küçük harf", en: "lowercase", de: "kleinbuchstaben", zh: "小写" })}</option></>}
            {slug === "json-bicimlendirici" && <><option value="default">{ui(locale, { tr: "Biçimlendir", en: "Pretty print", de: "Formatieren", zh: "格式化" })}</option><option value="minify">{ui(locale, { tr: "Küçült", en: "Minify", de: "Minifizieren", zh: "压缩" })}</option></>}
            {slug === "json-csv-donusturucu" && <><option value="default">JSON → CSV</option><option value="csv-to-json">CSV → JSON</option></>}
            {(slug === "base64-kodlayici" || slug === "url-kodlayici") && <><option value="default">{ui(locale, { tr: "Kodla", en: "Encode", de: "Kodieren", zh: "编码" })}</option><option value="decode">{ui(locale, { tr: "Çöz", en: "Decode", de: "Dekodieren", zh: "解码" })}</option></>}
          </select></label>}
          {batchSlugs.has(slug) && <label className="batch-toggle"><input type="checkbox" checked={batch} onChange={(event) => { setBatch(event.target.checked); resetResult(); }} /><span><strong>{labels.batch}</strong><small>{labels.batchHelp}</small></span></label>}
          <button type="button" className="primary-button run-button" onClick={run} disabled={busy}>{busy ? labels.running : labels.run}<span aria-hidden="true"> →</span></button>
        </div>
        <div className="result-panel" aria-live="polite" aria-busy={busy}>
          <div className="result-header"><span>{labels.output}<small className="frontier-state" data-state={operationState}>{operationLabel}</small></span><div className="output-actions"><button type="button" onClick={copyOutput} disabled={!output || busy}>{labels.copy}</button><button type="button" onClick={downloadOutput} disabled={!output || busy}>{labels.download}</button></div></div>
          {metrics.length > 0 && <div className="metric-strip">{metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
          <StructuredToolOutput output={output} empty={labels.empty} />
          <div id={`${slug}-workbench-error`}><ToolNotice notice={notice} locale={locale} /></div>
          {output && operationState === "success" && <div className="workbench-trust-card"><span aria-hidden="true">✓</span><p>{privacyConfirmation}</p></div>}
        </div>
      </div>
    </section>
  );
}
