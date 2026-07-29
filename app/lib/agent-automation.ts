import type { AgentPlan } from "./agent-core";
import type { Locale } from "./site";

export type AgentAutomationStep = {
  toolSlug: string;
  title: string;
  status: "completed" | "failed";
  note: string;
  outputLength: number;
};

export type AgentAutomationResult = {
  output: string;
  steps: AgentAutomationStep[];
};

const MAX_INPUT = 200_000;

const messages = {
  tr: { validated: "Yapı doğrulandı ve veri sonraki adıma aktarıldı.", transformed: "Dönüşüm cihazda tamamlandı.", empty: "İşlenecek veri boş.", large: "Otomatik çalışma için veri 200.000 karakteri aşmamalı.", unsupported: "Bu adım dosya seçimi veya görsel etkileşim gerektirdiği için otomatik çalıştırılamıyor.", csv: "CSV satırlarında sütun sayısı tutarsız.", json: "Geçerli JSON gerekli." },
  en: { validated: "Structure validated and the data was passed to the next step.", transformed: "Transformation completed on this device.", empty: "There is no data to process.", large: "Automated runs accept up to 200,000 characters.", unsupported: "This step needs file selection or visual interaction and cannot run automatically.", csv: "CSV rows contain inconsistent column counts.", json: "Valid JSON is required." },
  de: { validated: "Struktur geprüft; Daten wurden an den nächsten Schritt übergeben.", transformed: "Umwandlung wurde auf diesem Gerät abgeschlossen.", empty: "Keine Daten zur Verarbeitung.", large: "Automatische Abläufe akzeptieren höchstens 200.000 Zeichen.", unsupported: "Dieser Schritt benötigt Dateiauswahl oder visuelle Interaktion und kann nicht automatisch laufen.", csv: "CSV-Zeilen haben unterschiedliche Spaltenzahlen.", json: "Gültiges JSON ist erforderlich." },
  zh: { validated: "结构已验证，数据已传递到下一步。", transformed: "转换已在此设备完成。", empty: "没有可处理的数据。", large: "自动运行最多接受 200,000 个字符。", unsupported: "此步骤需要选择文件或进行可视交互，无法自动运行。", csv: "CSV 各行的列数不一致。", json: "需要有效的 JSON。" },
} as const;

function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === '"') {
      if (quoted && input[index + 1] === '"') { cell += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("CSV quote is not closed.");
  row.push(cell);
  if (row.some(Boolean) || rows.length === 0) rows.push(row);
  return rows.filter((item) => item.some((value) => value.trim()));
}

function csvToJson(input: string, locale: Locale) {
  const rows = parseCsv(input);
  const headers = rows[0]?.map((value) => value.trim()) ?? [];
  if (!headers.length || rows.some((row) => row.length !== headers.length)) throw new Error(messages[locale].csv);
  return JSON.stringify(rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header || `column_${index + 1}`, row[index] ?? ""]))), null, 2);
}

function jsonToCsv(input: string, locale: Locale) {
  let parsed: unknown;
  try { parsed = JSON.parse(input); } catch { throw new Error(messages[locale].json); }
  if (!Array.isArray(parsed) || parsed.some((item) => !item || typeof item !== "object" || Array.isArray(item))) throw new Error(messages[locale].json);
  const records = parsed as Array<Record<string, unknown>>;
  const headers = [...new Set(records.flatMap((record) => Object.keys(record)))];
  const escape = (value: unknown) => { const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value); return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; };
  return [headers.map(escape).join(","), ...records.map((record) => headers.map((header) => escape(record[header])).join(","))].join("\n");
}

function maskPrivateData(input: string) {
  return input
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL]")
    .replace(/(?<!\d)(?:\+?90\s*)?(?:0\s*)?5\d{2}[\s().-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}(?!\d)/g, "[PHONE]")
    .replace(/(?<!\d)\d{11}(?!\d)/g, "[ID]")
    .replace(/(?<!\d)(?:\d[ -]?){13,19}(?!\d)/g, "[PAYMENT_NUMBER]");
}

function encodeBase64(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  const chunk = 16_384;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
}

function decodeBase64(input: string, locale: Locale) {
  const compact = input.trim().replace(/\s+/gu, "").replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/u.test(compact) || compact.length % 4 === 1) throw new Error(messages[locale].json);
  try {
    const bytes = Uint8Array.from(atob(compact.padEnd(Math.ceil(compact.length / 4) * 4, "=")), (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch { throw new Error(messages[locale].json); }
}

function decodeJwt(input: string, locale: Locale) {
  const parts = input.trim().split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1]) throw new Error(messages[locale].json);
  try {
    const header = JSON.parse(decodeBase64(parts[0], locale));
    const payload = JSON.parse(decodeBase64(parts[1], locale));
    return JSON.stringify({ header, payload, signature: parts[2] ? "present — not verified" : "missing — not verified", verified: false }, null, 2);
  } catch { throw new Error(messages[locale].json); }
}

function uniqueLines(input: string, locale: Locale) {
  const rows = parseCsv(input);
  const csv = rows.length > 1 && (rows[0]?.length ?? 0) > 1 && rows.every((row) => row.length === rows[0].length);
  if (!csv) return [...new Set(input.split(/\r?\n/u).map((item) => item.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, locale)).join("\n");
  const escape = (value: string) => /[",\r\n]/u.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  const header = rows[0];
  const records = [...new Map(rows.slice(1).map((row) => [JSON.stringify(row), row])).values()].sort((a, b) => a.join("\u0000").localeCompare(b.join("\u0000"), locale));
  return [header, ...records].map((row) => row.map(escape).join(",")).join("\n");
}

function keyValueToJson(input: string, sections: boolean, locale: Locale) {
  const root: Record<string, unknown> = {};
  let target = root;
  for (const raw of input.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || /^[#!;]/.test(line)) continue;
    const section = sections ? line.match(/^\[([^\]]+)]$/) : null;
    if (section) { const name = section[1].trim(); const bucket: Record<string, string> = {}; root[name] = bucket; target = bucket; continue; }
    const match = line.match(/^([^=:\s][^=:]*?)\s*[=:]\s*(.*)$/);
    if (!match) continue;
    target[match[1].trim()] = match[2].trim();
  }
  if (!Object.keys(root).length) throw new Error(messages[locale].json);
  return JSON.stringify(root, null, 2);
}

function runStep(step: AgentPlan["steps"][number], input: string, locale: Locale): { output: string; validated: boolean } {
  switch (step.toolSlug) {
    case "csv-inceleyici": {
      const rows = parseCsv(input);
      const width = rows[0]?.length ?? 0;
      if (!width || rows.some((row) => row.length !== width)) throw new Error(messages[locale].csv);
      return { output: input, validated: true };
    }
    case "json-bicimlendirici": {
      try { return { output: JSON.stringify(JSON.parse(input), null, step.operation === "minify" ? 0 : 2), validated: false }; } catch { throw new Error(messages[locale].json); }
    }
    case "json-csv-donusturucu": return { output: step.operation === "csv-to-json" || (step.operation !== "json-to-csv" && !input.trimStart().startsWith("[")) ? csvToJson(input, locale) : jsonToCsv(input, locale), validated: false };
    case "kvkk-veri-maskeleyici": return { output: maskPrivateData(input), validated: false };
    case "e-posta-listesi-temizleyici": return { output: [...new Set(input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.map((item) => item.toLocaleLowerCase()) ?? [])].sort().join("\n"), validated: false };
    case "satir-siralayici-tekillestirici": return { output: uniqueLines(input, locale), validated: false };
    case "base64-kodlayici": return { output: step.operation === "decode" ? decodeBase64(input, locale) : encodeBase64(input), validated: false };
    case "url-kodlayici": return { output: step.operation === "decode" ? decodeURIComponent(input.trim()) : encodeURIComponent(input), validated: false };
    case "jwt-decoder": return { output: decodeJwt(input, locale), validated: false };
    case "metin-temizleyici": return { output: input.replace(/[\t ]+/gu, " ").replace(/ *\r?\n */gu, "\n").replace(/\n{3,}/gu, "\n\n").trim(), validated: false };
    case "unicode-normalizasyon-inceleyici": return { output: input.normalize("NFC"), validated: false };
    case "beyaz-alan-gorunurlestirici": return { output: input.replace(/\t/g, "⇥\t").replace(/ /g, "·").replace(/\r?\n/g, "↵\n"), validated: false };
    case "satir-sonu-donusturucu": return { output: input.replace(/\r\n?|\n/g, "\n"), validated: false };
    case "paragraf-ana-hat-cikarici": return { output: input.split(/\n\s*\n/).map((paragraph, index) => `${index + 1}. ${(paragraph.trim().match(/^.*?[.!?。！？](?:\s|$)/u)?.[0] ?? paragraph.trim()).slice(0, 240)}`).filter((line) => line.length > 3).join("\n"), validated: false };
    case "ini-json-donusturucu": return { output: keyValueToJson(input, true, locale), validated: false };
    case "properties-json-donusturucu": return { output: keyValueToJson(input, false, locale), validated: false };
    default: throw new Error(messages[locale].unsupported);
  }
}

const supported = new Set(["csv-inceleyici", "json-bicimlendirici", "json-csv-donusturucu", "kvkk-veri-maskeleyici", "e-posta-listesi-temizleyici", "satir-siralayici-tekillestirici", "base64-kodlayici", "url-kodlayici", "jwt-decoder", "metin-temizleyici", "unicode-normalizasyon-inceleyici", "beyaz-alan-gorunurlestirici", "satir-sonu-donusturucu", "paragraf-ana-hat-cikarici", "ini-json-donusturucu", "properties-json-donusturucu"]);

export function canAutomatePlan(plan: AgentPlan) {
  return plan.steps.length > 0 && (!plan.coverage || plan.coverage.missing.length === 0) && plan.steps.every((step) => !step.requiresFile && supported.has(step.toolSlug));
}

export function runAgentAutomation(plan: AgentPlan, input: string, locale: Locale): AgentAutomationResult {
  if (!input.trim()) throw new Error(messages[locale].empty);
  if (input.length > MAX_INPUT) throw new Error(messages[locale].large);
  let output = input;
  const steps: AgentAutomationStep[] = [];
  for (const step of plan.steps) {
    try {
      const result = runStep(step, output, locale);
      output = result.output;
      steps.push({ toolSlug: step.toolSlug, title: step.title, status: "completed", note: result.validated ? messages[locale].validated : messages[locale].transformed, outputLength: output.length });
    } catch (error) {
      steps.push({ toolSlug: step.toolSlug, title: step.title, status: "failed", note: error instanceof Error ? error.message : messages[locale].unsupported, outputLength: output.length });
      throw Object.assign(new Error(steps.at(-1)?.note), { steps, output });
    }
  }
  return { output, steps };
}
