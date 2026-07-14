"use client";

import { useMemo, useState } from "react";
import type { Locale } from "../lib/site";
import { SpecializedWorkbench, specializedSlugs } from "./SpecializedWorkbench";
import { ToolNotice, type ToolNoticeData } from "./ToolNotice";

type Metric = { label: string; value: string | number };

const noInputTools = new Set(["guclu-parola-uretici", "uuid-uretici"]);
const secondInputTools = new Set(["meta-prompt-olusturucu", "metin-benzerlik-analizi", "regex-test-araci", "few-shot-ornek-olusturucu", "sistem-promptu-persona-sablonu"]);

const samples: Record<string, Record<Locale, string>> = {
  "prompt-kalite-denetimi": { tr: "Yeni kullanıcılar için tarayıcı içi gizlilik araçlarını anlatan kısa bir rehber hazırla. Teknik terimleri açıkla ve sonucu 5 maddelik liste olarak ver.", en: "Create a short guide to in-browser privacy tools for new users. Explain technical terms and return five bullet points." },
  "meta-prompt-olusturucu": { tr: "Müşteri geri bildirimlerini temalara ayır ve uygulanabilir öneriler çıkar.", en: "Group customer feedback into themes and produce actionable recommendations." },
  "token-sayaci": { tr: "Bu alana token ihtiyacını tahmin etmek istediğiniz metni yazın.", en: "Enter the text whose token demand you want to estimate." },
  "okunabilirlik-analizi": { tr: "Açık ve anlaşılır metin, okuyucunun karar vermesini kolaylaştırır. Uzun cümleleri bölmek ve gereksiz terimleri açıklamak okunabilirliği artırır.", en: "Clear writing helps readers make decisions. Shorter sentences and explained terminology improve readability." },
  "metin-benzerlik-analizi": { tr: "Tarayıcı içi araçlar veriyi cihazınızda işler.", en: "In-browser tools process data on your device." },
  "metin-temizleyici": { tr: "  Fazladan    boşluklar var.\n\n\nBu satırlar   daha düzenli olabilir.  ", en: "  There are    extra spaces.\n\n\nThese lines   can be cleaner.  " },
  "buyuk-kucuk-harf-donusturucu": { tr: "gizlilik odaklı araçlarla daha güvenli çalışma", en: "safer work with privacy-first tools" },
  "kelime-sayaci": { tr: "Ölçmek istediğiniz metni buraya yazın. Sonuç cihazınızda hesaplanır.", en: "Write the text you want to measure here. Results are calculated on-device." },
  "json-bicimlendirici": { tr: "{\"proje\":\"ByteQuant\",\"yerel\":true,\"aracSayisi\":29}", en: "{\"project\":\"ByteQuant\",\"local\":true,\"toolCount\":29}" },
  "json-csv-donusturucu": { tr: "[{\"ad\":\"Ada\",\"rol\":\"Analist\"},{\"ad\":\"Deniz\",\"rol\":\"Editör\"}]", en: "[{\"name\":\"Ada\",\"role\":\"Analyst\"},{\"name\":\"Deniz\",\"role\":\"Editor\"}]" },
  "regex-test-araci": { tr: "İletişim: ekip@example.com ve destek@example.org", en: "Contact: team@example.com and support@example.org" },
  "csv-inceleyici": { tr: "ad,rol,aktif\nAda,Analist,true\nDeniz,Editör,true", en: "name,role,active\nAda,Analyst,true\nDeniz,Editor,true" },
  "base64-kodlayici": { tr: "Merhaba ByteQuant", en: "Hello ByteQuant" },
  "url-kodlayici": { tr: "gizlilik odaklı araçlar", en: "privacy-first tools" },
  "kvkk-veri-maskeleyici": { tr: "Ayşe'nin e-postası ayse@example.com, telefonu +90 555 123 45 67 ve IP adresi 192.168.1.24.", en: "Ada's email is ada@example.com, phone +1 202 555 0147, and IP address 192.168.1.24." },
  "sha256-ozet-uretici": { tr: "Bütünlüğü kontrol edilecek metin", en: "Text whose integrity will be checked" },
  "few-shot-ornek-olusturucu": { tr: "Müşteri mesajını olumlu, nötr veya olumsuz olarak sınıflandır.", en: "Classify a customer message as positive, neutral, or negative." },
  "sistem-promptu-persona-sablonu": { tr: "Teknik kavramları yeni başlayanlara açıklayan bir ürün eğitim uzmanı", en: "A product education specialist who explains technical concepts to beginners" },
  "jwt-decoder": { tr: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIiwiZXhwIjoyMDAwMDAwMDAwfQ.signature", en: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIiwiZXhwIjoyMDAwMDAwMDAwfQ.signature" },
  "cron-ifadesi-aciklayici": { tr: "0 3 * * *", en: "0 3 * * *" },
};

function secondarySample(slug: string, locale: Locale) {
  const isTr = locale === "tr";
  if (slug === "regex-test-araci") return "[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}";
  if (slug === "metin-benzerlik-analizi") return isTr ? "Yerel araçlar metninizi uzak bir sunucuya göndermeden çalışır." : "Local tools work without sending your text to a remote server.";
  if (slug === "few-shot-ornek-olusturucu") return isTr
    ? "Ürünü çok sevdim => olumlu\nTeslimat zamanında geldi => olumlu\nArayüz kullanılabilir => nötr\nUygulama sürekli kapanıyor => olumsuz"
    : "I love the product => positive\nDelivery arrived on time => positive\nThe interface is usable => neutral\nThe app keeps crashing => negative";
  if (slug === "sistem-promptu-persona-sablonu") return isTr
    ? "Ton: sakin, açık ve destekleyici\nHedef kitle: teknik olmayan yeni kullanıcılar\nSınırlar: bilinmeyen bilgiyi uydurma; güvenlik iddiası verme"
    : "Tone: calm, clear, and supportive\nAudience: non-technical beginners\nBoundaries: do not invent missing facts or make security guarantees";
  return "";
}

function friendlyError(slug: string, error: unknown, locale: Locale) {
  const isTr = locale === "tr";
  const detail = error instanceof Error ? error.message : String(error);
  if (["json-bicimlendirici", "json-csv-donusturucu"].includes(slug) && error instanceof SyntaxError) {
    return isTr
      ? `JSON ayrıştırılamadı. Anahtar ve metinlerde çift tırnak, doğru virgül ve kapanan parantez kullandığınızdan emin olun. Teknik ayrıntı: ${detail}`
      : `The JSON could not be parsed. Check double quotes, commas, and closing brackets. Technical detail: ${detail}`;
  }
  if (slug === "jwt-decoder") {
    return isTr
      ? `JWT okunamadı. Üç nokta ayrımlı bölüm ve geçerli Base64URL JSON içeren bir token girin. İmza doğrulaması bu araçta yapılmaz. Teknik ayrıntı: ${detail}`
      : `The JWT could not be read. Enter three dot-separated segments containing valid Base64URL JSON. This tool does not verify signatures. Technical detail: ${detail}`;
  }
  if (slug === "regex-test-araci" && error instanceof SyntaxError) {
    return isTr ? `Regex kalıbı geçerli değil. Parantez, köşeli parantez ve kaçış karakterlerini kontrol edin. Teknik ayrıntı: ${detail}` : `The regular expression is invalid. Check brackets, groups, and escape characters. Technical detail: ${detail}`;
  }
  if (slug === "base64-kodlayici") {
    return isTr ? `Base64 metni çözülemedi. Alfabe, padding (=) ve kopyalama sırasında eklenen boşlukları kontrol edin. Teknik ayrıntı: ${detail}` : `The Base64 text could not be decoded. Check its alphabet, padding (=), and copied whitespace. Technical detail: ${detail}`;
  }
  if (slug === "url-kodlayici" && error instanceof URIError) {
    return isTr ? `URL kodlaması çözülemedi. Eksik veya bozuk yüzde kaçışlarını (ör. %20) kontrol edin. Teknik ayrıntı: ${detail}` : `The URL encoding could not be decoded. Check incomplete or malformed percent escapes such as %20. Technical detail: ${detail}`;
  }
  return detail;
}

function words(text: string, locale: Locale) {
  return text.toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US").match(/[\p{L}\p{N}’'-]+/gu) ?? [];
}

function sentenceCount(text: string) {
  return Math.max(1, (text.match(/[.!?]+(?:\s|$)/g) ?? []).length || (text.trim() ? 1 : 0));
}

function csvParse(input: string, locale: Locale): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(cell); cell = ""; }
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

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function explainCron(expression: string, isTr: boolean) {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) throw new Error(isTr ? "Klasik cron ifadesi 5 alan içermelidir." : "A classic cron expression must contain five fields.");
  const definitions = [
    { name: isTr ? "Dakika" : "Minute", min: 0, max: 59 },
    { name: isTr ? "Saat" : "Hour", min: 0, max: 23 },
    { name: isTr ? "Ayın günü" : "Day of month", min: 1, max: 31 },
    { name: isTr ? "Ay" : "Month", min: 1, max: 12 },
    { name: isTr ? "Haftanın günü" : "Day of week", min: 0, max: 7 },
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
  fields.forEach((field, index) => { if (!validate(field, definitions[index].min, definitions[index].max)) throw new Error(`${definitions[index].name}: ${isTr ? "geçersiz değer" : "invalid value"} (${field})`); });
  const [minute, hour, day, month, weekday] = fields;
  let summary = isTr ? "Özel cron zamanlaması" : "Custom cron schedule";
  if (minute === "*" && hour === "*" && day === "*" && month === "*" && weekday === "*") summary = isTr ? "Her dakika çalışır." : "Runs every minute.";
  else if (/^\*\/\d+$/.test(minute) && hour === "*" && day === "*" && month === "*" && weekday === "*") summary = isTr ? `Her ${minute.slice(2)} dakikada bir çalışır.` : `Runs every ${minute.slice(2)} minutes.`;
  else if (/^\d+$/.test(minute) && hour === "*" && day === "*" && month === "*" && weekday === "*") summary = isTr ? `Her saat ${minute.padStart(2, "0")}. dakikada çalışır.` : `Runs at minute ${minute.padStart(2, "0")} of every hour.`;
  else if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && day === "*" && month === "*" && weekday === "*") summary = isTr ? `Her gün saat ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}'te çalışır.` : `Runs every day at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}.`;
  else if (/^\d+$/.test(minute) && /^\d+$/.test(hour) && day === "*" && month === "*" && /^\d$/.test(weekday)) {
    const daysTr = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    summary = isTr ? `Her ${daysTr[Number(weekday)]} saat ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}'te çalışır.` : `Runs every ${daysEn[Number(weekday)]} at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}.`;
  }
  const details = fields.map((field, index) => `${definitions[index].name}: ${field === "*" ? (isTr ? "her değer" : "every value") : field}`).join("\n");
  return `${summary}\n\n${details}\n\n${isTr ? "Saat dilimi: Cron çalıştırıcısının/sunucunun saat dilimini ayrıca doğrulayın." : "Time zone: verify the scheduler or server time zone separately."}`;
}

export function ToolWorkbench({ slug, locale }: { slug: string; locale: Locale }) {
  if (specializedSlugs.has(slug)) return <SpecializedWorkbench slug={slug} locale={locale} />;
  return <GenericToolWorkbench slug={slug} locale={locale} />;
}

function GenericToolWorkbench({ slug, locale }: { slug: string; locale: Locale }) {
  const isTr = locale === "tr";
  const [input, setInput] = useState("");
  const [secondary, setSecondary] = useState("");
  const [flags, setFlags] = useState("gi");
  const [mode, setMode] = useState("default");
  const [length, setLength] = useState(24);
  const [output, setOutput] = useState("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);

  const labels = useMemo(() => isTr ? {
    input: slug === "few-shot-ornek-olusturucu" ? "Görev tanımı" : slug === "sistem-promptu-persona-sablonu" ? "Rol ve temel sorumluluk" : slug === "jwt-decoder" ? "JWT" : slug === "cron-ifadesi-aciklayici" ? "Cron ifadesi" : "Girdi", second: slug === "regex-test-araci" ? "Regex kalıbı" : slug === "meta-prompt-olusturucu" ? "Bağlam ve kısıtlar (isteğe bağlı)" : slug === "few-shot-ornek-olusturucu" ? "Örnekler — her satır `girdi => çıktı`" : slug === "sistem-promptu-persona-sablonu" ? "Ton, hedef kitle ve sınırlar" : "Karşılaştırma metni",
    run: "Cihazımda çalıştır", copy: "Çıktıyı kopyala", download: "Metin olarak indir", clear: "Temizle", demo: "Örnek veri yükle", output: "Sonuç", empty: "Sonuç burada görünecek.", copied: "Çıktı panoya kopyalandı.", downloaded: "Çıktı metin dosyası olarak indirildi.", demoLoaded: "Hazır örnek yüklendi; aracı şimdi çalıştırabilirsiniz.", local: "Girdi bu sayfadan ayrılmaz.", flags: "Bayraklar", length: "Parola uzunluğu",
  } : {
    input: slug === "few-shot-ornek-olusturucu" ? "Task description" : slug === "sistem-promptu-persona-sablonu" ? "Role and primary responsibility" : slug === "jwt-decoder" ? "JWT" : slug === "cron-ifadesi-aciklayici" ? "Cron expression" : "Input", second: slug === "regex-test-araci" ? "Regex pattern" : slug === "meta-prompt-olusturucu" ? "Context and constraints (optional)" : slug === "few-shot-ornek-olusturucu" ? "Examples — one `input => output` pair per line" : slug === "sistem-promptu-persona-sablonu" ? "Tone, audience, and boundaries" : "Comparison text",
    run: "Run on my device", copy: "Copy output", download: "Download as text", clear: "Clear", demo: "Load example", output: "Result", empty: "Your result will appear here.", copied: "Output copied to the clipboard.", downloaded: "Output downloaded as a text file.", demoLoaded: "The ready-made example is loaded; you can now run the tool.", local: "Input never leaves this page.", flags: "Flags", length: "Password length",
  }, [isTr, slug]);

  function setResult(value: string, nextMetrics: Metric[] = []) {
    setOutput(value); setMetrics(nextMetrics); setNotice(null);
  }

  function clearWorkbench() {
    setInput(""); setSecondary(""); setFlags("gi"); setMode("default"); setLength(24); setOutput(""); setMetrics([]); setNotice(null);
  }

  function loadDemo() {
    setInput(samples[slug]?.[locale] ?? "");
    setSecondary(secondarySample(slug, locale));
    setFlags("gi"); setMode("default"); setLength(24); setOutput(""); setMetrics([]);
    setNotice({ kind: "info", text: labels.demoLoaded });
  }

  async function run() {
    try {
      if (!noInputTools.has(slug) && !input.trim()) throw new Error(isTr ? "Önce bir girdi yazın." : "Enter some input first.");
      const list = words(input, locale);
      switch (slug) {
        case "prompt-kalite-denetimi": {
          const checks = [
            { label: isTr ? "Açık hedef" : "Clear goal", ok: /(?:hazırla|oluştur|yaz|analiz|karşılaştır|üret|çıkar|create|write|analy[sz]e|compare|produce|extract)/i.test(input) },
            { label: isTr ? "Yeterli bağlam" : "Useful context", ok: list.length >= 18 },
            { label: isTr ? "Çıktı biçimi" : "Output format", ok: /(?:liste|tablo|json|başlık|madde|format|list|table|heading|bullet)/i.test(input) },
            { label: isTr ? "Kısıt veya sınır" : "Constraint", ok: /(?:en az|en fazla|yalnızca|kaçın|kullanma|zorunlu|at least|at most|only|avoid|must|do not)/i.test(input) },
            { label: isTr ? "Hedef kitle veya ton" : "Audience or tone", ok: /(?:kullanıcı|okuyucu|müşteri|uzman|başlangıç|ton|audience|reader|customer|expert|beginner|tone)/i.test(input) },
            { label: isTr ? "Kalite ölçütü" : "Quality criterion", ok: /(?:doğru|kaynak|kanıt|özgün|açık|kontrol|accurate|source|evidence|original|clear|verify)/i.test(input) },
          ];
          const score = Math.round(checks.filter((item) => item.ok).length / checks.length * 100);
          const report = checks.map((item) => `${item.ok ? "✓" : "○"} ${item.label}${item.ok ? "" : isTr ? " — eklenmesi önerilir" : " — consider adding"}`).join("\n");
          setResult(`${isTr ? "PROMPT KALİTE RAPORU" : "PROMPT QUALITY REPORT"}\n\n${report}\n\n${isTr ? "Öneri: Eksik bileşenleri doğal bir dille ekleyin; gereksiz uzunluktan kaçının." : "Recommendation: add missing components in natural language and avoid unnecessary length."}`, [{ label: isTr ? "Kalite skoru" : "Quality score", value: `${score}/100` }, { label: isTr ? "Karşılanan ölçüt" : "Checks passed", value: `${checks.filter((item) => item.ok).length}/${checks.length}` }, { label: isTr ? "Kelime" : "Words", value: list.length }]);
          break;
        }
        case "meta-prompt-olusturucu": {
          setResult(`${isTr ? "ROL" : "ROLE"}\n${isTr ? "Görevin amacına uygun, kanıta dayalı ve açık iletişim kuran bir uzman gibi çalış." : "Act as a domain-appropriate specialist who communicates clearly and relies on evidence."}\n\n${isTr ? "HEDEF" : "OBJECTIVE"}\n${input.trim()}\n\n${isTr ? "BAĞLAM VE SINIRLAR" : "CONTEXT AND CONSTRAINTS"}\n${secondary.trim() || (isTr ? "Yalnızca verilen bilgiyi kullan. Bilinmeyen noktaları varsayma; 'yetersiz bilgi' olarak işaretle." : "Use only the supplied information. Do not invent missing facts; mark them as 'insufficient information.'")}\n\n${isTr ? "ÇALIŞMA SÜRECİ" : "PROCESS"}\n1. ${isTr ? "Hedefi ve başarı ölçütünü yeniden ifade et." : "Restate the goal and success criteria."}\n2. ${isTr ? "Girdiyi çelişki, eksik bilgi ve hassas veri açısından kontrol et." : "Check the input for conflicts, missing information, and sensitive data."}\n3. ${isTr ? "Sonucu en açık ve kısa yapıda hazırla." : "Prepare the result in the clearest concise structure."}\n4. ${isTr ? "Son kontrolde iddiaları, kapsamı ve biçimi doğrula." : "Verify claims, scope, and format before finalizing."}\n\n${isTr ? "ÇIKTI SÖZLEŞMESİ" : "OUTPUT CONTRACT"}\n- ${isTr ? "Önce kısa sonuç özeti" : "Start with a short outcome summary"}\n- ${isTr ? "Ardından gerekçeli maddeler" : "Follow with reasoned bullet points"}\n- ${isTr ? "Son bölümde riskler ve sonraki adımlar" : "End with risks and next steps"}`, [{ label: isTr ? "Şablon bölümü" : "Template sections", value: 5 }, { label: isTr ? "Hedef kelimesi" : "Goal words", value: list.length }]);
          break;
        }
        case "few-shot-ornek-olusturucu": {
          const examples = secondary.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => { const divider = line.indexOf("=>"); if (divider < 1 || divider >= line.length - 2) throw new Error(isTr ? "Her örneği `girdi => çıktı` biçiminde yazın." : "Write every example as `input => output`."); return { input: line.slice(0, divider).trim(), output: line.slice(divider + 2).trim() }; });
          if (examples.length < 2) throw new Error(isTr ? "Deseni göstermek için en az iki örnek ekleyin." : "Add at least two examples to demonstrate the pattern.");
          const exampleBlock = examples.map((example, index) => `${isTr ? "ÖRNEK" : "EXAMPLE"} ${index + 1}\n${isTr ? "Girdi" : "Input"}: ${example.input}\n${isTr ? "Çıktı" : "Output"}: ${example.output}`).join("\n\n");
          setResult(`${isTr ? "GÖREV" : "TASK"}\n${input.trim()}\n\n${isTr ? "TALİMATLAR" : "INSTRUCTIONS"}\n- ${isTr ? "Aşağıdaki örneklerdeki karar mantığını ve çıktı biçimini izle." : "Follow the decision pattern and output format demonstrated below."}\n- ${isTr ? "Örnekleri ezberlemek yerine yeni girdinin özelliklerini değerlendir." : "Evaluate the new input rather than copying an example."}\n- ${isTr ? "Belirsiz durumda varsayımını kısa biçimde belirt." : "State any assumption briefly when the input is ambiguous."}\n\n${exampleBlock}\n\n${isTr ? "YENİ GİRDİ" : "NEW INPUT"}\n{{input}}\n\n${isTr ? "ÇIKTI" : "OUTPUT"}\n`, [{ label: isTr ? "Örnek" : "Examples", value: examples.length }, { label: isTr ? "Görev kelimesi" : "Task words", value: list.length }]);
          break;
        }
        case "sistem-promptu-persona-sablonu": {
          const guidelines = secondary.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
          setResult(`${isTr ? "SİSTEM ROLÜ" : "SYSTEM ROLE"}\n${isTr ? `Sen ${input.trim()}.` : `You are ${input.trim()}.`}\n\n${isTr ? "AMAÇ" : "MISSION"}\n${isTr ? "Kullanıcının hedefini doğru anlayıp açık, yararlı ve doğrulanabilir bir yanıt üret. Başarıyı yalnızca akıcı metinle değil, talimatlara ve sınırlarına uyumla ölç." : "Understand the user's goal and produce a clear, useful, verifiable response. Measure success by adherence to instructions and boundaries, not fluency alone."}\n\n${isTr ? "İLETİŞİM VE DAVRANIŞ" : "COMMUNICATION AND BEHAVIOR"}\n${guidelines.length ? guidelines.map((item) => `- ${item}`).join("\n") : `- ${isTr ? "Sakin, açık ve doğrudan yaz." : "Write calmly, clearly, and directly."}\n- ${isTr ? "Teknik terimleri ilk kullanımda açıkla." : "Explain technical terms on first use."}`}\n\n${isTr ? "DEĞİŞMEZ SINIRLAR" : "NON-NEGOTIABLE BOUNDARIES"}\n- ${isTr ? "Bilinmeyen bilgi, kaynak veya sonucu uydurma." : "Do not invent missing facts, sources, or outcomes."}\n- ${isTr ? "Hassas veriyi gereksiz yere isteme veya tekrar etme." : "Do not request or repeat sensitive data unnecessarily."}\n- ${isTr ? "Hukuki, tıbbi, finansal veya güvenlik açısından kritik konuda kesin garanti verme." : "Do not guarantee legal, medical, financial, or security-critical outcomes."}\n- ${isTr ? "Talimatlar çelişirse çelişkiyi açıkla ve güvenli seçeneği sor." : "If instructions conflict, explain the conflict and ask for the safer choice."}\n\n${isTr ? "ÇIKTI SÖZLEŞMESİ" : "OUTPUT CONTRACT"}\n1. ${isTr ? "Sonuç veya öneriyle başla." : "Lead with the outcome or recommendation."}\n2. ${isTr ? "Gerekçeyi kısa ve denetlenebilir maddelerle açıkla." : "Explain the reasoning with concise, auditable points."}\n3. ${isTr ? "Varsayımları, belirsizliği ve sonraki adımı belirt." : "State assumptions, uncertainty, and the next step."}\n4. ${isTr ? "Yanıtı göndermeden önce rol, sınır ve biçim uyumunu kontrol et." : "Before sending, verify role, boundary, and format compliance."}`, [{ label: isTr ? "Kural" : "Rules", value: guidelines.length + 8 }, { label: isTr ? "Rol kelimesi" : "Role words", value: list.length }]);
          break;
        }
        case "token-sayaci": {
          const chars = input.length; const tokens = Math.max(1, Math.ceil(chars / (isTr ? 3.2 : 4)));
          setResult(isTr ? `Yaklaşık ${tokens.toLocaleString("tr-TR")} token. Bu değer modelden bağımsız bir tahmindir; gerçek tokenizer sonucu değişebilir.` : `Approximately ${tokens.toLocaleString("en-US")} tokens. This is a model-agnostic estimate; exact tokenizer results vary.`, [{ label: isTr ? "Yaklaşık token" : "Estimated tokens", value: tokens }, { label: isTr ? "Kelime" : "Words", value: list.length }, { label: isTr ? "Karakter" : "Characters", value: chars }, { label: isTr ? "Satır" : "Lines", value: input.split(/\r?\n/).length }]);
          break;
        }
        case "okunabilirlik-analizi": {
          const sentences = sentenceCount(input); const syllables = list.reduce((sum, word) => sum + Math.max(1, (word.match(/[aeıioöuü]/gi) ?? []).length), 0);
          const avg = list.length / sentences; const score = isTr ? Math.max(0, Math.min(100, 198.825 - 40.175 * (syllables / Math.max(1, list.length)) - 2.61 * avg)) : Math.max(0, Math.min(100, 206.835 - 1.015 * avg - 84.6 * (syllables / Math.max(1, list.length))));
          const level = score >= 70 ? (isTr ? "Kolay" : "Easy") : score >= 50 ? (isTr ? "Orta" : "Moderate") : (isTr ? "Zor" : "Difficult");
          setResult(isTr ? `${level} okunabilirlik. ${avg > 20 ? "Ortalama cümleler uzun; bazı cümleleri bölmeyi deneyin." : "Cümle uzunluğu dengeli görünüyor."} Bu skor yaklaşık bir dil göstergesidir.` : `${level} readability. ${avg > 20 ? "Average sentences are long; consider splitting some of them." : "Sentence length appears balanced."} This score is an approximate language indicator.`, [{ label: isTr ? "Okunabilirlik" : "Readability", value: Math.round(score) }, { label: isTr ? "Ort. cümle" : "Avg. sentence", value: avg.toFixed(1) }, { label: isTr ? "Cümle" : "Sentences", value: sentences }, { label: isTr ? "Kelime çeşitliliği" : "Lexical diversity", value: `${Math.round(new Set(list).size / Math.max(1, list.length) * 100)}%` }]);
          break;
        }
        case "metin-benzerlik-analizi": {
          if (!secondary.trim()) throw new Error(isTr ? "İkinci metni de girin." : "Enter the comparison text.");
          const result = similarity(input, secondary, locale);
          setResult(isTr ? `Sözcük tabanlı kosinüs benzerliği %${Math.round(result.cosine * 100)}, Jaccard örtüşmesi %${Math.round(result.jaccard * 100)}. Bu ölçüm bağlamsal yapay zekâ benzerliği değildir.` : `Word-based cosine similarity is ${Math.round(result.cosine * 100)}%; Jaccard overlap is ${Math.round(result.jaccard * 100)}%. This is not contextual AI similarity.`, [{ label: "Cosine", value: `${Math.round(result.cosine * 100)}%` }, { label: "Jaccard", value: `${Math.round(result.jaccard * 100)}%` }, { label: isTr ? "Ortak sözcük" : "Shared terms", value: result.shared }]);
          break;
        }
        case "metin-temizleyici": {
          const cleaned = input.replace(/[\t ]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
          setResult(cleaned, [{ label: isTr ? "Kaldırılan karakter" : "Characters removed", value: input.length - cleaned.length }, { label: isTr ? "Satır" : "Lines", value: cleaned.split(/\r?\n/).length }]);
          break;
        }
        case "buyuk-kucuk-harf-donusturucu": {
          const localeCode = isTr ? "tr-TR" : "en-US";
          let converted = input;
          if (mode === "upper") converted = input.toLocaleUpperCase(localeCode);
          else if (mode === "lower") converted = input.toLocaleLowerCase(localeCode);
          else if (mode === "sentence") converted = input.toLocaleLowerCase(localeCode).replace(/(^|[.!?]\s+)(\p{L})/gu, (_, start, char) => start + char.toLocaleUpperCase(localeCode));
          else converted = input.toLocaleLowerCase(localeCode).replace(/(^|[\s–—-])(\p{L})/gu, (_, start, char) => start + char.toLocaleUpperCase(localeCode));
          setResult(converted, [{ label: isTr ? "Karakter" : "Characters", value: converted.length }]);
          break;
        }
        case "kelime-sayaci": {
          const paragraphs = input.trim().split(/\n\s*\n/).filter(Boolean).length;
          const readMinutes = Math.max(1, Math.ceil(list.length / 200));
          setResult(isTr ? `Tahmini okuma süresi ${readMinutes} dakika. Uzunluk tek başına kalite göstergesi değildir; içeriğin amacı ve okuyucunun ihtiyacıyla birlikte değerlendirin.` : `Estimated reading time is ${readMinutes} minute${readMinutes === 1 ? "" : "s"}. Length alone does not indicate quality; evaluate it against purpose and reader needs.`, [{ label: isTr ? "Kelime" : "Words", value: list.length }, { label: isTr ? "Karakter" : "Characters", value: input.length }, { label: isTr ? "Cümle" : "Sentences", value: sentenceCount(input) }, { label: isTr ? "Paragraf" : "Paragraphs", value: paragraphs }]);
          break;
        }
        case "json-bicimlendirici": {
          const parsed = JSON.parse(input); const pretty = mode !== "minify";
          setResult(JSON.stringify(parsed, null, pretty ? 2 : 0), [{ label: isTr ? "Durum" : "Status", value: isTr ? "Geçerli JSON" : "Valid JSON" }, { label: isTr ? "Üst düzey tür" : "Root type", value: Array.isArray(parsed) ? "Array" : typeof parsed }, { label: isTr ? "Bayt (yaklaşık)" : "Bytes (approx.)", value: new Blob([input]).size }]);
          break;
        }
        case "json-csv-donusturucu": {
          if (mode === "csv-to-json") {
            const rows = csvParse(input, locale); const headers = rows[0] ?? [];
            const data = rows.slice(1).filter((row) => row.some(Boolean)).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
            setResult(JSON.stringify(data, null, 2), [{ label: isTr ? "Kayıt" : "Records", value: data.length }, { label: isTr ? "Sütun" : "Columns", value: headers.length }]);
          } else {
            const data = JSON.parse(input); if (!Array.isArray(data) || !data.every((item) => item && typeof item === "object" && !Array.isArray(item))) throw new Error(isTr ? "Düz nesnelerden oluşan bir JSON dizisi gerekir." : "A JSON array of flat objects is required.");
            const headers = [...new Set(data.flatMap((item) => Object.keys(item)))];
            const csv = [headers.map(csvEscape).join(","), ...data.map((item) => headers.map((header) => csvEscape(item[header])).join(","))].join("\n");
            setResult(csv, [{ label: isTr ? "Kayıt" : "Records", value: data.length }, { label: isTr ? "Sütun" : "Columns", value: headers.length }]);
          }
          break;
        }
        case "regex-test-araci": {
          if (!secondary.trim()) throw new Error(isTr ? "Bir regex kalıbı girin veya örnek veriyi yükleyin." : "Enter a regular expression or load the example.");
          if (input.length > 50000) throw new Error(isTr ? "Performans için test metni 50.000 karakterle sınırlıdır." : "Sample text is limited to 50,000 characters for performance.");
          if (/(\([^)]*[+*][^)]*\))[+*{]/.test(secondary)) throw new Error(isTr ? "İç içe nicelik belirteci ReDoS riski taşıyabilir; kalıbı sadeleştirin." : "Nested quantifiers may create a ReDoS risk; simplify the pattern.");
          const re = new RegExp(secondary, flags.includes("g") ? flags : `${flags}g`); const matches = [...input.matchAll(re)].slice(0, 200);
          const report = matches.length ? matches.map((match, index) => `${index + 1}. [${match.index}] ${JSON.stringify(match[0])}${match.length > 1 ? ` | ${isTr ? "gruplar" : "groups"}: ${match.slice(1).map((v) => JSON.stringify(v)).join(", ")}` : ""}`).join("\n") : (isTr ? "Eşleşme bulunamadı." : "No matches found.");
          setResult(report, [{ label: isTr ? "Eşleşme" : "Matches", value: matches.length }, { label: isTr ? "Metin uzunluğu" : "Text length", value: input.length }]);
          break;
        }
        case "csv-inceleyici": {
          const rows = csvParse(input, locale).filter((row) => row.some((cell) => cell.length)); const headers = rows[0] ?? []; const irregular = rows.slice(1).map((row, index) => ({ row, line: index + 2 })).filter(({ row }) => row.length !== headers.length);
          setResult(`${isTr ? "Başlıklar" : "Headers"}: ${headers.join(" · ")}\n${isTr ? "Düzensiz satırlar" : "Irregular rows"}: ${irregular.length ? irregular.map((item) => item.line).join(", ") : (isTr ? "yok" : "none")}`, [{ label: isTr ? "Veri satırı" : "Data rows", value: Math.max(0, rows.length - 1) }, { label: isTr ? "Sütun" : "Columns", value: headers.length }, { label: isTr ? "Düzensiz satır" : "Irregular rows", value: irregular.length }]);
          break;
        }
        case "base64-kodlayici": {
          if (mode === "decode") {
            const bytes = Uint8Array.from(atob(input.trim()), (char) => char.charCodeAt(0));
            setResult(new TextDecoder().decode(bytes), [{ label: isTr ? "Çözülen bayt" : "Decoded bytes", value: bytes.length }]);
          } else {
            const bytes = new TextEncoder().encode(input); let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
            setResult(btoa(binary), [{ label: isTr ? "Kaynak bayt" : "Source bytes", value: bytes.length }]);
          }
          break;
        }
        case "url-kodlayici": {
          const result = mode === "decode" ? decodeURIComponent(input.trim()) : encodeURIComponent(input);
          setResult(result, [{ label: isTr ? "Çıktı karakteri" : "Output characters", value: result.length }]);
          break;
        }
        case "jwt-decoder": {
          const segments = input.trim().split("."); if (segments.length !== 3) throw new Error(isTr ? "JWT üç nokta ayrımlı bölüm içermelidir." : "A JWT must contain three dot-separated segments.");
          const header = JSON.parse(decodeBase64Url(segments[0])); const payload = JSON.parse(decodeBase64Url(segments[1]));
          const timeClaims = ["iat", "nbf", "exp"].filter((claim) => typeof payload[claim] === "number").map((claim) => `${claim}: ${new Date(payload[claim] * 1000).toISOString()}`);
          const expired = typeof payload.exp === "number" ? payload.exp * 1000 < Date.now() : null;
          setResult(`${isTr ? "HEADER" : "HEADER"}\n${JSON.stringify(header, null, 2)}\n\n${isTr ? "PAYLOAD" : "PAYLOAD"}\n${JSON.stringify(payload, null, 2)}${timeClaims.length ? `\n\n${isTr ? "ZAMAN CLAIM'LERİ" : "TIME CLAIMS"}\n${timeClaims.join("\n")}` : ""}\n\n${isTr ? "UYARI: Bu yalnızca decode işlemidir; imza ve token güvenilirliği doğrulanmadı." : "WARNING: This only decodes the token; its signature and trustworthiness were not verified."}`, [{ label: isTr ? "Algoritma iddiası" : "Claimed algorithm", value: typeof header.alg === "string" ? header.alg : "—" }, { label: isTr ? "Payload alanı" : "Payload claims", value: Object.keys(payload).length }, { label: isTr ? "Süre durumu" : "Expiry status", value: expired === null ? (isTr ? "exp yok" : "no exp") : expired ? (isTr ? "Süresi dolmuş" : "Expired") : (isTr ? "Süresi geçerli" : "Not expired") }]);
          break;
        }
        case "cron-ifadesi-aciklayici": {
          const explanation = explainCron(input, isTr);
          setResult(explanation, [{ label: isTr ? "Alan" : "Fields", value: 5 }, { label: isTr ? "Durum" : "Status", value: isTr ? "Geçerli" : "Valid" }]);
          break;
        }
        case "kvkk-veri-maskeleyici": {
          const patterns = [
            { label: "EMAIL", re: /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g },
            { label: "IBAN", re: /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){11,30}\b/gi },
            { label: "CARD", re: /\b(?:\d[ -]*?){13,19}\b/g },
            { label: "IP", re: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g },
            { label: "PHONE", re: /(?<!\d)(?:\+?\d{1,3}[ .-]?)?(?:\(?\d{3}\)?[ .-]?)\d{3}[ .-]?\d{2}[ .-]?\d{2}(?!\d)/g },
            { label: "TCKN", re: /\b[1-9]\d{10}\b/g },
          ];
          let masked = input; const found: Metric[] = [];
          patterns.forEach(({ label, re }) => { let count = 0; masked = masked.replace(re, () => { count += 1; return `[${label}_${count}]`; }); if (count) found.push({ label, value: count }); });
          setResult(`${masked}\n\n${isTr ? "Not: Otomatik maskeleme bağlamsal kişisel verilerin tamamını bulamaz. Paylaşmadan önce elle kontrol edin." : "Note: automatic masking cannot find all contextual personal data. Review manually before sharing."}`, found.length ? found : [{ label: isTr ? "Bulunan desen" : "Patterns found", value: 0 }]);
          break;
        }
        case "guclu-parola-uretici": {
          const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*-_+=?"; let password = "";
          for (let index = 0; index < Math.min(128, Math.max(12, length)); index += 1) password += alphabet[secureIndex(alphabet.length)];
          setResult(password, [{ label: isTr ? "Uzunluk" : "Length", value: password.length }, { label: isTr ? "Kaynak" : "Source", value: "Web Crypto" }]);
          break;
        }
        case "uuid-uretici": {
          const value = crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (char) => (Number(char) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(char) / 4).toString(16));
          setResult(value, [{ label: isTr ? "Sürüm" : "Version", value: "UUID v4" }]);
          break;
        }
        case "sha256-ozet-uretici": {
          const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
          const value = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
          setResult(value, [{ label: isTr ? "Özet uzunluğu" : "Digest length", value: "256 bit" }, { label: isTr ? "Algoritma" : "Algorithm", value: "SHA-256" }]);
          break;
        }
        default: throw new Error(isTr ? "Araç yapılandırması bulunamadı." : "Tool configuration was not found.");
      }
    } catch (error) {
      setOutput(""); setMetrics([]);
      setNotice({ kind: "error", text: friendlyError(slug, error, locale) });
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setNotice({ kind: "success", text: labels.copied });
    } catch {
      setNotice({ kind: "error", text: isTr ? "Tarayıcı pano izni vermedi. Çıktıyı seçip elle kopyalayabilirsiniz." : "The browser denied clipboard access. Select the output and copy it manually." });
    }
  }

  function downloadOutput() {
    if (!output) return;
    try {
      const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `bytequant-${slug}.txt`; anchor.click(); URL.revokeObjectURL(url);
      setNotice({ kind: "success", text: labels.downloaded });
    } catch {
      setNotice({ kind: "error", text: isTr ? "Dosya indirilemedi. Tarayıcının indirme iznini kontrol edin." : "The file could not be downloaded. Check the browser's download permission." });
    }
  }

  const showMode = ["buyuk-kucuk-harf-donusturucu", "json-bicimlendirici", "json-csv-donusturucu", "base64-kodlayici", "url-kodlayici"].includes(slug);

  return (
    <section className="workbench" aria-label={isTr ? "Araç çalışma alanı" : "Tool workbench"}>
      <div className="workbench-bar"><span className="local-status"><i />{labels.local}</span><div className="workbench-bar-actions"><button type="button" className="demo-button" onClick={loadDemo}>{labels.demo}</button><button type="button" className="ghost-button" onClick={clearWorkbench}>{labels.clear}</button></div></div>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          {!noInputTools.has(slug) && <label className="field-label"><span>{labels.input}</span><textarea value={input} maxLength={100000} rows={slug === "metin-benzerlik-analizi" ? 7 : 11} onChange={(event) => setInput(event.target.value)} spellCheck="false" /></label>}
          {secondInputTools.has(slug) && <label className="field-label"><span>{labels.second}</span>{slug === "regex-test-araci" ? <input value={secondary} onChange={(event) => setSecondary(event.target.value)} spellCheck="false" /> : <textarea value={secondary} rows={5} onChange={(event) => setSecondary(event.target.value)} spellCheck="false" />}</label>}
          {slug === "regex-test-araci" && <label className="field-label compact-field"><span>{labels.flags}</span><input value={flags} maxLength={6} onChange={(event) => setFlags(event.target.value.replace(/[^dgimsuvy]/g, ""))} /></label>}
          {slug === "guclu-parola-uretici" && <label className="field-label range-field"><span>{labels.length}: {length}</span><input type="range" min="12" max="128" value={length} onChange={(event) => setLength(Number(event.target.value))} /></label>}
          {showMode && <label className="field-label compact-field"><span>{isTr ? "İşlem" : "Operation"}</span><select value={mode} onChange={(event) => setMode(event.target.value)}>
            {slug === "buyuk-kucuk-harf-donusturucu" && <><option value="default">{isTr ? "Başlık biçimi" : "Title case"}</option><option value="sentence">{isTr ? "Cümle biçimi" : "Sentence case"}</option><option value="upper">{isTr ? "BÜYÜK HARF" : "UPPERCASE"}</option><option value="lower">{isTr ? "küçük harf" : "lowercase"}</option></>}
            {slug === "json-bicimlendirici" && <><option value="default">{isTr ? "Biçimlendir" : "Pretty print"}</option><option value="minify">{isTr ? "Küçült" : "Minify"}</option></>}
            {slug === "json-csv-donusturucu" && <><option value="default">JSON → CSV</option><option value="csv-to-json">CSV → JSON</option></>}
            {(slug === "base64-kodlayici" || slug === "url-kodlayici") && <><option value="default">{isTr ? "Kodla" : "Encode"}</option><option value="decode">{isTr ? "Çöz" : "Decode"}</option></>}
          </select></label>}
          <button type="button" className="primary-button run-button" onClick={run}>{labels.run}<span aria-hidden="true"> →</span></button>
        </div>
        <div className="result-panel" aria-live="polite">
          <div className="result-header"><span>{labels.output}</span><div className="output-actions"><button type="button" onClick={copyOutput} disabled={!output}>{labels.copy}</button><button type="button" onClick={downloadOutput} disabled={!output}>{labels.download}</button></div></div>
          {metrics.length > 0 && <div className="metric-strip">{metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
          <pre className={output ? "has-output" : ""}>{output || labels.empty}</pre>
          <ToolNotice notice={notice} locale={locale} />
        </div>
      </div>
    </section>
  );
}
