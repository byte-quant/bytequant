"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Locale } from "../lib/site";
import { ToolNotice, type ToolNoticeData } from "./ToolNotice";

export const newWorkbenchSlugs = new Set([
  "arac-zinciri-pipeline",
  "json-diff-karsilastirma",
  "curl-kod-donusturucu",
  "meta-etiket-favicon-uretici",
]);

function Frame({ locale, children, onDemo, onClear }: { locale: Locale; children: ReactNode; onDemo: () => void; onClear: () => void }) {
  const copy = {
    tr: { aria: "Araç çalışma alanı", local: "Girdi yalnızca etkin tarayıcı sekmesinde işlenir.", demo: "Örnek veri yükle", clear: "Temizle" },
    en: { aria: "Tool workbench", local: "Input is processed only in the active browser tab.", demo: "Load example", clear: "Clear" },
    de: { aria: "Werkzeug-Arbeitsbereich", local: "Die Eingabe wird nur im aktiven Browser-Tab verarbeitet.", demo: "Beispiel laden", clear: "Leeren" },
    zh: { aria: "工具工作区", local: "输入仅在当前浏览器标签页中处理。", demo: "加载示例", clear: "清除" },
  }[locale];
  return <section className="workbench specialized-workbench" aria-label={copy.aria}>
    <div className="workbench-bar"><span className="local-status"><i />{copy.local}</span><div className="workbench-bar-actions"><button type="button" className="demo-button" onClick={onDemo}>{copy.demo}</button><button type="button" className="ghost-button" onClick={onClear}>{copy.clear}</button></div></div>
    {children}
  </section>;
}

function saveText(value: string, filename: string, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function copyText(value: string, locale: Locale, setNotice: (notice: ToolNoticeData) => void) {
  try { await navigator.clipboard.writeText(value); setNotice({ kind: "success", text: locale === "tr" ? "Çıktı panoya kopyalandı." : "Output copied to the clipboard." }); }
  catch { setNotice({ kind: "error", text: locale === "tr" ? "Tarayıcı pano izni vermedi." : "The browser denied clipboard access." }); }
}

function parseCsv(source: string) {
  if (source.length > 5_000_000) throw new Error("size");
  const sample = source.split(/\r?\n/, 4).join("\n");
  const candidates = [",", ";", "\t"];
  const delimiter = candidates.map((value) => ({ value, count: sample.split(value).length - 1 })).sort((a, b) => b.count - a.count)[0].value;
  const rows: string[][] = []; let row: string[] = []; let field = ""; let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; if (rows.length > 10_001) throw new Error("rows"); }
    else field += char;
  }
  if (quoted) throw new Error("quote");
  row.push(field.replace(/\r$/, "")); if (row.some(Boolean) || rows.length === 0) rows.push(row);
  const headers = rows[0].map((item, index) => item.trim() || `column_${index + 1}`);
  if (headers.length > 100) throw new Error("columns");
  if (new Set(headers).size !== headers.length) throw new Error("headers");
  const records = rows.slice(1).filter((values) => values.some(Boolean)).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
  return { delimiter, headers, records };
}

type MaskKind = "email" | "phone" | "iban" | "tckn" | "card";
type MaskOptions = Record<MaskKind, boolean>;
const maskLabels: Record<MaskKind, string> = { email: "EMAIL", phone: "PHONE", iban: "IBAN", tckn: "TCKN_CANDIDATE", card: "CARD_CANDIDATE" };

function validLuhn(value: string) {
  const digits = value.replace(/\D/g, ""); if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0; let alternate = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) { let digit = Number(digits[index]); if (alternate) { digit *= 2; if (digit > 9) digit -= 9; } sum += digit; alternate = !alternate; }
  return sum % 10 === 0;
}

function validTckn(value: string) {
  if (!/^[1-9]\d{10}$/.test(value)) return false;
  const d = [...value].map(Number); const tenth = ((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10;
  return (tenth + 10) % 10 === d[9] && d.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10 === d[10];
}

function maskValue(value: string, options: MaskOptions, counts: Record<MaskKind, number>) {
  let result = value;
  const replace = (kind: MaskKind, pattern: RegExp, validate?: (candidate: string) => boolean) => { if (!options[kind]) return; result = result.replace(pattern, (candidate) => { if (validate && !validate(candidate)) return candidate; counts[kind] += 1; return `[${maskLabels[kind]}]`; }); };
  replace("email", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi);
  replace("iban", /\bTR\d{2}(?:\s?\d{4}){5}\s?\d{2}\b/gi);
  replace("tckn", /\b[1-9]\d{10}\b/g, validTckn);
  replace("card", /\b(?:\d[ -]*?){13,19}\b/g, validLuhn);
  replace("phone", /(?<!\d)(?:\+?90[\s.-]?)?(?:\(?0?5\d{2}\)?[\s.-]?)\d{3}[\s.-]?\d{2}[\s.-]?\d{2}(?!\d)/g);
  return result;
}

function csvEscape(value: string) { return /["\r\n,;\t]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value; }

function PipelineWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr"; const demo = isTr ? "ad,eposta,telefon,tckn,kart,not\nAyşe,ayse@example.com,+90 532 555 12 34,10000000146,4111 1111 1111 1111,Demo müşteri\nCan,can@example.org,0533 222 11 00,11111111110,5555 5555 5555 4444,Test kaydı" : "name,email,phone,turkish_id,card,note\nAda,ada@example.com,+90 532 555 12 34,10000000146,4111 1111 1111 1111,Demo customer\nCan,can@example.org,0533 222 11 00,11111111110,5555 5555 5555 4444,Test record";
  const [source, setSource] = useState(""); const [options, setOptions] = useState<MaskOptions>({ email: true, phone: true, iban: true, tckn: true, card: true }); const [format, setFormat] = useState<"json" | "csv">("json"); const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const processed = useMemo(() => { if (!source.trim()) return null; try { const parsed = parseCsv(source); const counts: Record<MaskKind, number> = { email: 0, phone: 0, iban: 0, tckn: 0, card: 0 }; let changed = 0; const records = parsed.records.map((record) => Object.fromEntries(Object.entries(record).map(([key, value]) => { const masked = maskValue(value, options, counts); if (masked !== value) changed += 1; return [key, masked]; }))); const csv = [parsed.headers.join(parsed.delimiter), ...records.map((record) => parsed.headers.map((header) => csvEscape(record[header])).join(parsed.delimiter))].join("\n"); return { ...parsed, records, counts, changed, output: format === "json" ? JSON.stringify(records, null, 2) : csv }; } catch (error) { return { error: error instanceof Error ? error.message : "parse" }; } }, [source, options, format]);
  const error = processed && "error" in processed ? ({ size: isTr ? "CSV en fazla 5 MB olabilir." : "CSV can be at most 5 MB.", rows: isTr ? "En fazla 10.000 veri satırı işlenebilir." : "At most 10,000 data rows can be processed.", columns: isTr ? "En fazla 100 sütun işlenebilir." : "At most 100 columns can be processed.", quote: isTr ? "Kapanmamış bir CSV tırnağı bulundu." : "An unclosed CSV quote was found.", headers: isTr ? "Sütun başlıkları benzersiz olmalıdır." : "Column headers must be unique." }[String(processed.error)] ?? (isTr ? "CSV ayrıştırılamadı." : "CSV could not be parsed.")) : "";
  const kinds = Object.keys(options) as MaskKind[];
  const auditReport = processed && !("error" in processed) ? JSON.stringify({
    tool: "ByteQuant browser-only masking pipeline",
    sourceRows: processed.records.length,
    columns: processed.headers,
    enabledRules: kinds.filter((kind) => options[kind]),
    detectedCandidates: processed.counts,
    changedCells: processed.changed,
    outputFormat: format,
    limitation: isTr ? "Algoritmik aday tespiti gerçek kimlik doğrulama veya hukuki uygunluk kanıtı değildir." : "Algorithmic candidate detection is not identity verification or proof of legal compliance.",
  }, null, 2) : "";
  return <Frame locale={locale} onDemo={() => { setSource(demo); setNotice({ kind: "info", text: isTr ? "Yalnızca yapay demo verisi yüklendi." : "Synthetic demo data loaded." }); }} onClear={() => { setSource(""); setNotice(null); }}>
    <div className="pipeline-layout"><section className="pipeline-input"><label className="field-label"><span>{isTr ? "1 · CSV dosyası veya metni" : "1 · CSV file or text"}</span><input type="file" accept=".csv,text/csv" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 5_000_000) { setNotice({ kind: "error", text: isTr ? "Dosya 5 MB sınırını aşıyor." : "The file exceeds the 5 MB limit." }); return; } setSource(await file.text()); setNotice({ kind: "success", text: isTr ? "Dosya bu sekmede okundu; yükleme yapılmadı." : "File read in this tab; nothing was uploaded." }); }} /></label><label className="field-label"><span>{isTr ? "CSV içeriği" : "CSV content"}</span><textarea value={source} onChange={(event) => { setSource(event.target.value); setNotice(null); }} spellCheck="false" placeholder="name,email&#10;Ada,ada@example.com" /></label><ToolNotice notice={error ? { kind: "error", text: error } : notice} locale={locale} /></section>
      <section className="pipeline-controls"><div><span className="pipeline-step-label">{isTr ? "2 · Maskeleme kuralları" : "2 · Masking rules"}</span><div className="mask-options">{kinds.map((kind) => <label key={kind}><input type="checkbox" checked={options[kind]} onChange={() => setOptions((current) => ({ ...current, [kind]: !current[kind] }))} /><span>{maskLabels[kind]}</span></label>)}</div><p className="privacy-hint">{isTr ? "TCKN ve kart adayları yalnızca checksum geçen sayılarda maskelenir. Bu kontrol, numaranın gerçek bir kişiye veya hesaba ait olduğunu kanıtlamaz." : "Turkish ID and card candidates are masked only when their checksum passes. This does not prove that a number belongs to a real person or account."}</p></div><label className="field-label"><span>{isTr ? "3 · Çıktı biçimi" : "3 · Output format"}</span><select value={format} onChange={(event) => setFormat(event.target.value as "json" | "csv")}><option value="json">JSON</option><option value="csv">CSV</option></select></label></section>
      <section className="pipeline-output"><div className="result-header"><span>{isTr ? "Temizlenmiş çıktı" : "Cleaned output"}</span><div className="output-actions"><button type="button" disabled={!processed || "error" in processed} onClick={() => processed && !("error" in processed) && copyText(processed.output, locale, setNotice)}>{isTr ? "Kopyala" : "Copy"}</button><button type="button" disabled={!processed || "error" in processed} onClick={() => processed && !("error" in processed) && saveText(processed.output, `bytequant-cleaned.${format}`, format === "json" ? "application/json" : "text/csv")}>{isTr ? "İndir" : "Download"}</button><button type="button" disabled={!auditReport} onClick={() => saveText(auditReport, "bytequant-mask-audit.json", "application/json")}>{isTr ? "Denetim özeti" : "Audit summary"}</button></div></div>{processed && !("error" in processed) ? <><div className="pipeline-metrics"><span><strong>{processed.records.length}</strong>{isTr ? " satır" : " rows"}</span><span><strong>{processed.headers.length}</strong>{isTr ? " sütun" : " columns"}</span><span><strong>{processed.changed}</strong>{isTr ? " değişen hücre" : " changed cells"}</span></div><div className="pipeline-detections" aria-label={isTr ? "Aday tespit özeti" : "Candidate detection summary"}>{kinds.map((kind) => <span key={kind}><strong>{processed.counts[kind]}</strong>{maskLabels[kind]}</span>)}</div><div className="table-scroll"><table><thead><tr>{processed.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{processed.records.slice(0, 8).map((record, index) => <tr key={index}>{processed.headers.map((header) => <td key={header}>{record[header]}</td>)}</tr>)}</tbody></table></div><details className="raw-output"><summary>{isTr ? "Ham çıktıyı göster" : "Show raw output"}</summary><pre>{processed.output}</pre></details></> : <div className="empty-result">{isTr ? "Akışı başlatmak için CSV ekleyin." : "Add CSV to start the pipeline."}</div>}</section></div>
  </Frame>;
}

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
type JsonChange = { path: string; kind: "added" | "removed" | "changed" | "type"; before?: JsonValue; after?: JsonValue };
function valueType(value: JsonValue) { return value === null ? "null" : Array.isArray(value) ? "array" : typeof value; }
function compareJson(before: JsonValue, after: JsonValue) {
  const changes: JsonChange[] = []; let nodes = 0;
  const walk = (left: JsonValue, right: JsonValue, path: string, depth: number) => {
    nodes += 1; if (nodes > 5_000 || depth > 32) throw new Error("limit");
    const leftType = valueType(left); const rightType = valueType(right);
    if (leftType !== rightType) { changes.push({ path: path || "/", kind: "type", before: left, after: right }); return; }
    if (Array.isArray(left) && Array.isArray(right)) { const length = Math.max(left.length, right.length); for (let index = 0; index < length; index += 1) { const next = `${path}/${index}`; if (index >= left.length) changes.push({ path: next, kind: "added", after: right[index] }); else if (index >= right.length) changes.push({ path: next, kind: "removed", before: left[index] }); else walk(left[index], right[index], next, depth + 1); } return; }
    if (left && right && typeof left === "object" && typeof right === "object") { const a = left as Record<string, JsonValue>; const b = right as Record<string, JsonValue>; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) { const next = `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`; if (!(key in a)) changes.push({ path: next, kind: "added", after: b[key] }); else if (!(key in b)) changes.push({ path: next, kind: "removed", before: a[key] }); else walk(a[key], b[key], next, depth + 1); } return; }
    if (!Object.is(left, right)) changes.push({ path: path || "/", kind: "changed", before: left, after: right });
  };
  walk(before, after, "", 0); return changes;
}
function compactValue(value: JsonValue | undefined) { if (value === undefined) return "—"; const result = JSON.stringify(value); return result.length > 110 ? `${result.slice(0, 107)}…` : result; }

function JsonDiffWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr"; const samples = isTr ? ['{"id":7,"ad":"Ada","roller":["editor"],"aktif":true}', '{"id":7,"ad":"Ada Lovelace","roller":["editor","admin"],"aktif":"true","takim":"Ar-Ge"}'] : ['{"id":7,"name":"Ada","roles":["editor"],"active":true}', '{"id":7,"name":"Ada Lovelace","roles":["editor","admin"],"active":"true","team":"R&D"}'];
  const [before, setBefore] = useState(""); const [after, setAfter] = useState(""); const [filter, setFilter] = useState<"all" | JsonChange["kind"]>("all"); const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const result = useMemo<{ changes: JsonChange[] } | { error: string } | null>(() => { if (!before.trim() && !after.trim()) return null; try { const changes = compareJson(JSON.parse(before) as JsonValue, JSON.parse(after) as JsonValue); return { changes }; } catch (error) { return { error: error instanceof SyntaxError ? (isTr ? "JSON alanlarından biri geçersiz. Tırnak, virgül ve parantezleri kontrol edin." : "One JSON value is invalid. Check quotes, commas, and brackets.") : (isTr ? "Karşılaştırma 5.000 düğüm veya 32 derinlik güvenlik sınırını aşıyor." : "Comparison exceeds the 5,000-node or 32-level safety limit.") }; } }, [before, after, isTr]);
  const changes = result && "changes" in result ? result.changes.filter((item) => filter === "all" || item.kind === filter) : [];
  const report = JSON.stringify(result && "changes" in result ? result.changes : [], null, 2);
  const labels = isTr ? { added: "Eklendi", removed: "Silindi", changed: "Değişti", type: "Tür değişti" } : { added: "Added", removed: "Removed", changed: "Changed", type: "Type changed" };
  return <Frame locale={locale} onDemo={() => { setBefore(JSON.stringify(JSON.parse(samples[0]), null, 2)); setAfter(JSON.stringify(JSON.parse(samples[1]), null, 2)); setNotice({ kind: "info", text: isTr ? "Yapısal değişiklikler içeren demo yüklendi." : "A demo with structural changes was loaded." }); }} onClear={() => { setBefore(""); setAfter(""); setNotice(null); }}><div className="json-diff-layout"><div className="dual-input-grid"><label className="field-label"><span>{isTr ? "Önceki JSON" : "Before JSON"}</span><textarea value={before} onChange={(event) => { setBefore(event.target.value); setNotice(null); }} spellCheck="false" /></label><label className="field-label"><span>{isTr ? "Yeni JSON" : "After JSON"}</span><textarea value={after} onChange={(event) => { setAfter(event.target.value); setNotice(null); }} spellCheck="false" /></label></div><div className="json-diff-results"><div className="result-header"><label><span>{isTr ? "Filtre" : "Filter"}</span><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">{isTr ? "Tüm değişiklikler" : "All changes"}</option>{Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><div className="output-actions"><button type="button" disabled={!changes.length} onClick={() => copyText(report, locale, setNotice)}>{isTr ? "Kopyala" : "Copy"}</button><button type="button" disabled={!changes.length} onClick={() => saveText(report, "bytequant-json-diff.json", "application/json")}>{isTr ? "İndir" : "Download"}</button></div></div><ToolNotice notice={result && "error" in result ? { kind: "error", text: result.error } : notice} locale={locale} />{result && "changes" in result && <div className="change-summary">{Object.entries(labels).map(([kind, label]) => <span key={kind}><strong>{result.changes.filter((item) => item.kind === kind).length}</strong>{label}</span>)}</div>}<div className="change-list">{changes.map((change, index) => <article className={`change-${change.kind}`} key={`${change.path}-${index}`}><div><span>{labels[change.kind]}</span><code>{change.path}</code></div><p><del>{compactValue(change.before)}</del><b>→</b><ins>{compactValue(change.after)}</ins></p></article>)}{result && "changes" in result && result.changes.length === 0 && <div className="empty-result">{isTr ? "Yapısal fark bulunmadı." : "No structural difference found."}</div>}</div></div></div></Frame>;
}

type CurlRequest = { url: string; method: string; headers: Record<string, string>; body: string; warnings: string[] };
function shellTokens(input: string) {
  const tokens: string[] = []; let current = ""; let quote = ""; let escaped = false;
  for (const char of input.trim()) { if (escaped) { current += char; escaped = false; } else if (char === "\\" && quote !== "'") escaped = true; else if (quote) { if (char === quote) quote = ""; else current += char; } else if (char === '"' || char === "'") quote = char; else if (/\s/.test(char)) { if (current) { tokens.push(current); current = ""; } } else current += char; }
  if (quote || escaped) throw new Error("quote"); if (current) tokens.push(current); return tokens;
}
function parseCurl(input: string): CurlRequest {
  const tokens = shellTokens(input.replace(/\\\r?\n/g, " ")); if (tokens[0]?.toLowerCase() !== "curl") throw new Error("prefix");
  let url = ""; let method = ""; let body = ""; const headers: Record<string, string> = {}; const warnings: string[] = [];
  const take = (index: number) => { if (!tokens[index + 1]) throw new Error("value"); return tokens[index + 1]; };
  for (let index = 1; index < tokens.length; index += 1) { const token = tokens[index];
    if (["-X", "--request"].includes(token)) { method = take(index).toUpperCase(); index += 1; }
    else if (["-H", "--header"].includes(token)) { const header = take(index); index += 1; const separator = header.indexOf(":"); if (separator < 1) throw new Error("header"); headers[header.slice(0, separator).trim()] = header.slice(separator + 1).trim(); }
    else if (["-d", "--data", "--data-raw", "--data-binary"].includes(token)) { body += `${body ? "&" : ""}${take(index)}`; index += 1; }
    else if (token === "--url") { url = take(index); index += 1; }
    else if (["-u", "--user"].includes(token)) { warnings.push("credentials"); headers.Authorization = `Basic ${btoa(take(index))}`; index += 1; }
    else if (token.startsWith("http://") || token.startsWith("https://")) url = token;
    else if (token.startsWith("-") && !["-L", "--location", "-s", "--silent", "--compressed", "-k", "--insecure"].includes(token)) warnings.push(token);
  }
  if (!url) throw new Error("url"); try { new URL(url); } catch { throw new Error("url"); }
  if (!method) method = body ? "POST" : "GET";
  if (Object.keys(headers).some((key) => /authorization|cookie|api[-_]?key|token/i.test(key))) warnings.push("secrets");
  return { url, method, headers, body, warnings: [...new Set(warnings)] };
}
function generateCode(request: CurlRequest, language: "javascript" | "node" | "python" | "php") {
  const options = [`method: ${JSON.stringify(request.method)}`]; if (Object.keys(request.headers).length) options.push(`headers: ${JSON.stringify(request.headers, null, 2)}`); if (request.body) options.push(`body: ${JSON.stringify(request.body)}`);
  if (language === "javascript") return `const response = await fetch(${JSON.stringify(request.url)}, {\n  ${options.join(",\n  ").replace(/\n/g, "\n  ")}\n});\n\nif (!response.ok) throw new Error(\`HTTP \${response.status}\`);\nconst data = await response.json();`;
  if (language === "node") return `// Node.js 18+\nconst controller = new AbortController();\nconst timeout = setTimeout(() => controller.abort(), 10_000);\ntry {\n  const response = await fetch(${JSON.stringify(request.url)}, {\n    ${options.join(",\n    ").replace(/\n/g, "\n    ")},\n    signal: controller.signal\n  });\n  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);\n  console.log(await response.json());\n} finally { clearTimeout(timeout); }`;
  if (language === "python") return `import requests\n\nresponse = requests.request(\n    ${JSON.stringify(request.method)},\n    ${JSON.stringify(request.url)},${Object.keys(request.headers).length ? `\n    headers=${JSON.stringify(request.headers, null, 4).replace(/\n/g, "\n    ")},` : ""}${request.body ? `\n    data=${JSON.stringify(request.body)},` : ""}\n    timeout=10,\n)\nresponse.raise_for_status()\ndata = response.json()`;
  return `<?php\n$ch = curl_init(${JSON.stringify(request.url)});\ncurl_setopt_array($ch, [\n    CURLOPT_RETURNTRANSFER => true,\n    CURLOPT_CUSTOMREQUEST => ${JSON.stringify(request.method)},${Object.keys(request.headers).length ? `\n    CURLOPT_HTTPHEADER => json_decode(${JSON.stringify(JSON.stringify(Object.entries(request.headers).map(([key, value]) => `${key}: ${value}`)))}, true),` : ""}${request.body ? `\n    CURLOPT_POSTFIELDS => ${JSON.stringify(request.body)},` : ""}\n    CURLOPT_TIMEOUT => 10,\n]);\n$response = curl_exec($ch);\nif ($response === false) { throw new RuntimeException(curl_error($ch)); }\n$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);\ncurl_close($ch);\nif ($status >= 400) { throw new RuntimeException("HTTP $status"); }`;
}

function CurlWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr"; const demo = "curl -X POST 'https://api.example.com/v1/items' -H 'Content-Type: application/json' -H 'Authorization: Bearer DEMO_TOKEN' --data-raw '{\"name\":\"ByteQuant\",\"private\":true}'";
  const [source, setSource] = useState(""); const [language, setLanguage] = useState<"javascript" | "node" | "python" | "php">("javascript"); const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const parsed = useMemo<{ request: CurlRequest } | { error: string } | null>(() => { if (!source.trim()) return null; try { return { request: parseCurl(source) }; } catch (error) { const key = error instanceof Error ? error.message : "value"; const messages: Record<string, string> = isTr ? { quote: "Komutta kapanmamış tırnak veya kaçış karakteri var.", prefix: "Komut `curl` ile başlamalıdır.", value: "Bir cURL seçeneğinin değeri eksik.", header: "Header `Ad: değer` biçiminde olmalıdır.", url: "Geçerli bir http/https URL bulunamadı." } : { quote: "The command has an unclosed quote or escape.", prefix: "The command must start with `curl`.", value: "A cURL option is missing its value.", header: "A header must use `Name: value` format.", url: "No valid http/https URL was found." }; return { error: messages[key] ?? messages.value }; } }, [source, isTr]);
  const code = parsed && "request" in parsed ? generateCode(parsed.request, language) : "";
  return <Frame locale={locale} onDemo={() => { setSource(demo); setNotice({ kind: "info", text: isTr ? "Sahte token içeren güvenli demo yüklendi; komut çalıştırılmadı." : "A safe demo with a fake token was loaded; the command was not executed." }); }} onClear={() => { setSource(""); setNotice(null); }}><div className="workbench-grid curl-layout"><section className="workbench-inputs"><label className="field-label"><span>cURL</span><textarea value={source} onChange={(event) => { setSource(event.target.value); setNotice(null); }} spellCheck="false" placeholder="curl 'https://api.example.com/items'" /></label><div className="safety-callout"><strong>{isTr ? "Yalnızca ayrıştırır" : "Parse only"}</strong><p>{isTr ? "ByteQuant komutu çalıştırmaz ve hedef URL'ye istek göndermez. Authorization, Cookie ve API anahtarı gibi değerleri paylaşmadan önce silin." : "ByteQuant never executes the command or calls its URL. Remove Authorization, Cookie, and API-key values before sharing."}</p></div><ToolNotice notice={parsed && "error" in parsed ? { kind: "error", text: parsed.error } : notice} locale={locale} />{parsed && "request" in parsed && <dl className="request-summary"><div><dt>Method</dt><dd>{parsed.request.method}</dd></div><div><dt>URL</dt><dd>{parsed.request.url}</dd></div><div><dt>Headers</dt><dd>{Object.keys(parsed.request.headers).length}</dd></div><div><dt>Body</dt><dd>{parsed.request.body ? `${parsed.request.body.length} chars` : "—"}</dd></div></dl>}</section><section className="result-panel"><div className="result-header"><label><span>{isTr ? "Hedef dil" : "Target language"}</span><select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)}><option value="javascript">JavaScript · fetch</option><option value="node">Node.js 18+ · fetch</option><option value="python">Python · requests</option><option value="php">PHP · cURL</option></select></label><div className="output-actions"><button type="button" disabled={!code} onClick={() => copyText(code, locale, setNotice)}>{isTr ? "Kopyala" : "Copy"}</button><button type="button" disabled={!code} onClick={() => saveText(code, `bytequant-request.${language === "python" ? "py" : language === "php" ? "php" : "js"}`)}>{isTr ? "İndir" : "Download"}</button></div></div>{parsed && "request" in parsed && parsed.request.warnings.length > 0 && <div className="secret-warning">⚠ {isTr ? "Komut hassas header/kimlik bilgisi veya kısmen desteklenen seçenek içeriyor. Üretimden önce kodu gözden geçirin." : "The command contains a sensitive header/credential or a partially supported option. Review the code before production."}</div>}<pre>{code || (isTr ? "Geçerli bir cURL komutu girin." : "Enter a valid cURL command.")}</pre></section></div></Frame>;
}

function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!); }
function SeoKitWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr"; const initial = { title: "", description: "", url: "", image: "", favicon: "/favicon.png", site: "" }; const [form, setForm] = useState(initial); const [mode, setMode] = useState<"html" | "next">("html"); const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const generated = useMemo(() => { const title = form.title.trim(); const description = form.description.trim(); let validUrl = false; try { const url = new URL(form.url); validUrl = /^https?:$/.test(url.protocol); } catch { /* shown below */ } if (!title && !description && !form.url) return { output: "", warnings: [] as string[] }; const warnings: string[] = []; if (title.length < 30 || title.length > 60) warnings.push(isTr ? "Başlık için yaklaşık 30–60 karakter hedefleyin." : "Aim for roughly 30–60 title characters."); if (description.length < 120 || description.length > 160) warnings.push(isTr ? "Açıklama için yaklaşık 120–160 karakter hedefleyin." : "Aim for roughly 120–160 description characters."); if (!validUrl) warnings.push(isTr ? "Canonical için mutlak bir http/https URL girin." : "Enter an absolute http/https canonical URL."); const e = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, escapeHtml(value.trim())])) as typeof form; const html = `<title>${e.title}</title>\n<meta name="description" content="${e.description}">\n<link rel="canonical" href="${e.url}">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="${e.site || e.title}">\n<meta property="og:title" content="${e.title}">\n<meta property="og:description" content="${e.description}">\n<meta property="og:url" content="${e.url}">\n<meta property="og:image" content="${e.image}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${e.title}">\n<meta name="twitter:description" content="${e.description}">\n<meta name="twitter:image" content="${e.image}">\n<link rel="icon" type="image/png" sizes="512x512" href="${e.favicon}">\n<link rel="apple-touch-icon" href="${e.favicon}">\n<link rel="manifest" href="/manifest.webmanifest">`;
    const next = `import type { Metadata } from "next";\n\nexport const metadata: Metadata = ${JSON.stringify({ title, description, alternates: { canonical: form.url }, openGraph: { type: "website", siteName: form.site || title, title, description, url: form.url, images: form.image ? [form.image] : [] }, twitter: { card: "summary_large_image", title, description, images: form.image ? [form.image] : [] }, icons: { icon: form.favicon, apple: form.favicon }, manifest: "/manifest.webmanifest" }, null, 2)};`;
    return { output: mode === "html" ? html : next, warnings }; }, [form, mode, isTr]);
  const update = (key: keyof typeof form, value: string) => { setForm((current) => ({ ...current, [key]: value })); setNotice(null); };
  return <Frame locale={locale} onDemo={() => { setForm({ title: "ByteQuant · Privacy-First Browser Tools", description: "Use explainable tools for JSON, text, prompts, privacy, and developer workflows directly in your browser without uploading your input.", url: "https://bytequant.org/en", image: "https://bytequant.org/og.png", favicon: "/favicon.png", site: "ByteQuant" }); setNotice({ kind: "info", text: isTr ? "ByteQuant demo metadata seti yüklendi." : "ByteQuant demo metadata loaded." }); }} onClear={() => { setForm(initial); setNotice(null); }}><div className="seo-kit-layout"><section className="seo-fields"><div className="form-pair"><label className="field-label"><span>{isTr ? "Site / marka" : "Site / brand"}</span><input value={form.site} onChange={(event) => update("site", event.target.value)} /></label><label className="field-label"><span>{isTr ? "Sayfa başlığı" : "Page title"} · {form.title.length}</span><input value={form.title} onChange={(event) => update("title", event.target.value)} /></label></div><label className="field-label"><span>{isTr ? "Meta açıklaması" : "Meta description"} · {form.description.length}</span><textarea value={form.description} onChange={(event) => update("description", event.target.value)} /></label><div className="form-pair"><label className="field-label"><span>Canonical URL</span><input type="url" value={form.url} onChange={(event) => update("url", event.target.value)} placeholder="https://example.com/page" /></label><label className="field-label"><span>{isTr ? "Sosyal görsel URL" : "Social image URL"}</span><input value={form.image} onChange={(event) => update("image", event.target.value)} placeholder="https://example.com/og.png" /></label></div><label className="field-label"><span>{isTr ? "Favicon yolu" : "Favicon path"}</span><input value={form.favicon} onChange={(event) => update("favicon", event.target.value)} /></label><div className="serp-preview"><span>{isTr ? "Arama görünümü taslağı" : "Search appearance draft"}</span><strong>{form.title || (isTr ? "Sayfa başlığı" : "Page title")}</strong><small>{form.url || "https://example.com/page"}</small><p>{form.description || (isTr ? "Sayfa açıklaması burada görünür." : "The page description appears here.")}</p></div></section><section className="seo-output"><div className="result-header"><label><span>{isTr ? "Çıktı" : "Output"}</span><select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}><option value="html">HTML</option><option value="next">Next.js Metadata</option></select></label><div className="output-actions"><button type="button" disabled={!generated.output} onClick={() => copyText(generated.output, locale, setNotice)}>{isTr ? "Kopyala" : "Copy"}</button><button type="button" disabled={!generated.output} onClick={() => saveText(generated.output, mode === "html" ? "bytequant-meta-tags.html" : "bytequant-metadata.ts")}>{isTr ? "İndir" : "Download"}</button></div></div><ToolNotice notice={notice} locale={locale} />{generated.warnings.length > 0 && <ul className="seo-warnings">{generated.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}<pre>{generated.output || (isTr ? "Alanları doldurduğunuzda güvenli çıktı burada oluşur." : "Safe output appears here as you complete the fields.")}</pre><p className="privacy-hint">{isTr ? "Önizleme ve karakter önerileri editoryal kontroldür; indeksleme veya platform görünümü garantisi değildir." : "Preview and length suggestions are editorial checks, not guarantees of indexing or platform rendering."}</p></section></div></Frame>;
}

export function NewToolWorkbench({ slug, locale }: { slug: string; locale: Locale }) {
  if (slug === "arac-zinciri-pipeline") return <PipelineWorkbench locale={locale} />;
  if (slug === "json-diff-karsilastirma") return <JsonDiffWorkbench locale={locale} />;
  if (slug === "curl-kod-donusturucu") return <CurlWorkbench locale={locale} />;
  return <SeoKitWorkbench locale={locale} />;
}
