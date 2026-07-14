"use client";

/* Dynamic QR data URLs and local blob previews cannot use Next image optimization. */
/* eslint-disable @next/next/no-img-element */

import QRCode from "qrcode";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "../lib/site";
import { ToolNotice, type ToolNoticeData } from "./ToolNotice";

type DiffPart = { type: "same" | "added" | "deleted"; value: string };
type Rgb = { r: number; g: number; b: number };
type MetadataItem = { label: string; value: string };

export const specializedSlugs = new Set([
  "metin-farki-diff",
  "markdown-onizleyici",
  "unix-zaman-damgasi-donusturucu",
  "renk-donusturucu",
  "qr-kod-olusturucu",
  "exif-meta-veri-temizleyici",
  "sifre-gucu-testi",
]);

function WorkbenchFrame({ locale, children, onClear, onDemo }: { locale: Locale; children: ReactNode; onClear?: () => void; onDemo: () => void | Promise<void> }) {
  const isTr = locale === "tr";
  return (
    <section className="workbench specialized-workbench" aria-label={isTr ? "Araç çalışma alanı" : "Tool workbench"}>
      <div className="workbench-bar">
        <span className="local-status"><i />{isTr ? "Girdi bu sayfadan ayrılmaz." : "Input never leaves this page."}</span>
        <div className="workbench-bar-actions">
          <button type="button" className="demo-button" onClick={onDemo}>{isTr ? "Örnek veri yükle" : "Load example"}</button>
          {onClear && <button type="button" className="ghost-button" onClick={onClear}>{isTr ? "Temizle" : "Clear"}</button>}
        </div>
      </div>
      {children}
    </section>
  );
}

function tokenizeDiff(text: string, mode: "words" | "lines") {
  return mode === "lines" ? (text.match(/[^\n]*\n|[^\n]+$/g) ?? []) : (text.match(/\s+|[^\s]+/g) ?? []);
}

function calculateDiff(oldText: string, newText: string, mode: "words" | "lines"): { parts: DiffPart[]; error?: string } {
  const a = tokenizeDiff(oldText, mode);
  const b = tokenizeDiff(newText, mode);
  if (a.length + b.length > 1400) return { parts: [], error: "limit" };
  const width = b.length + 1;
  const table = new Uint16Array((a.length + 1) * width);
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      table[i * width + j] = a[i - 1] === b[j - 1]
        ? table[(i - 1) * width + j - 1] + 1
        : Math.max(table[(i - 1) * width + j], table[i * width + j - 1]);
    }
  }
  const reversed: DiffPart[] = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      reversed.push({ type: "same", value: a[i - 1] }); i -= 1; j -= 1;
    } else if (j > 0 && (i === 0 || table[i * width + j - 1] >= table[(i - 1) * width + j])) {
      reversed.push({ type: "added", value: b[j - 1] }); j -= 1;
    } else {
      reversed.push({ type: "deleted", value: a[i - 1] }); i -= 1;
    }
  }
  const merged: DiffPart[] = [];
  reversed.reverse().forEach((part) => {
    const previous = merged.at(-1);
    if (previous?.type === part.type) previous.value += part.value;
    else merged.push({ ...part });
  });
  return { parts: merged };
}

function DiffWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [oldText, setOldText] = useState(isTr ? "ByteQuant veriyi yerel olarak işler.\nAraçlar ücretsizdir." : "ByteQuant processes data locally.\nThe tools are free.");
  const [newText, setNewText] = useState(isTr ? "ByteQuant hassas veriyi tarayıcıda işler.\nAraçlar ücretsiz ve üyeliksizdir." : "ByteQuant processes sensitive data in the browser.\nThe tools are free and require no account.");
  const [mode, setMode] = useState<"words" | "lines">("words");
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const diff = useMemo(() => calculateDiff(oldText, newText, mode), [oldText, newText, mode]);
  const added = diff.parts.filter((part) => part.type === "added").reduce((sum, part) => sum + tokenizeDiff(part.value, mode).length, 0);
  const deleted = diff.parts.filter((part) => part.type === "deleted").reduce((sum, part) => sum + tokenizeDiff(part.value, mode).length, 0);
  const plainDiff = diff.parts.map((part) => `${part.type === "added" ? "+" : part.type === "deleted" ? "-" : " "}${part.value}`).join("");
  async function copyDiff() {
    try { await navigator.clipboard.writeText(plainDiff); setNotice({ kind: "success", text: isTr ? "Fark çıktısı panoya kopyalandı." : "Diff output copied to the clipboard." }); }
    catch { setNotice({ kind: "error", text: isTr ? "Tarayıcı pano izni vermedi." : "The browser denied clipboard access." }); }
  }
  return (
    <WorkbenchFrame locale={locale} onDemo={() => { setOldText(isTr ? "ByteQuant veriyi yerel olarak işler.\nAraçlar ücretsizdir." : "ByteQuant processes data locally.\nThe tools are free."); setNewText(isTr ? "ByteQuant hassas veriyi tarayıcıda işler.\nAraçlar ücretsiz ve üyeliksizdir." : "ByteQuant processes sensitive data in the browser.\nThe tools are free and require no account."); setMode("words"); }} onClear={() => { setOldText(""); setNewText(""); }}>
      <div className="special-toolbar"><label><span>{isTr ? "Karşılaştırma düzeyi" : "Comparison level"}</span><select value={mode} onChange={(event) => setMode(event.target.value as "words" | "lines")}><option value="words">{isTr ? "Kelime" : "Words"}</option><option value="lines">{isTr ? "Satır" : "Lines"}</option></select></label><div className="diff-legend"><span className="legend-added">+ {isTr ? "Eklenen" : "Added"}: {added}</span><span className="legend-deleted">− {isTr ? "Silinen" : "Removed"}: {deleted}</span></div></div>
      <div className="dual-input-grid"><label className="field-label"><span>{isTr ? "Eski metin" : "Old text"}</span><textarea rows={10} value={oldText} onChange={(event) => setOldText(event.target.value)} /></label><label className="field-label"><span>{isTr ? "Yeni metin" : "New text"}</span><textarea rows={10} value={newText} onChange={(event) => setNewText(event.target.value)} /></label></div>
      <div className="rich-result-panel"><div className="result-header"><span>{isTr ? "Renkli fark" : "Colored diff"}</span><div className="output-actions"><button type="button" onClick={copyDiff} disabled={!diff.parts.length || Boolean(diff.error)}>{isTr ? "Kopyala" : "Copy"}</button><button type="button" onClick={() => downloadText(plainDiff, "bytequant-diff.txt")} disabled={!diff.parts.length || Boolean(diff.error)}>{isTr ? "İndir" : "Download"}</button></div></div>{diff.error ? <ToolNotice locale={locale} notice={{ kind: "error", text: isTr ? "Karşılaştırma sınırı aşıldı. Daha küçük bir bölüm seçin (en fazla 1.400 parça)." : "The comparison limit was exceeded. Use a smaller section (up to 1,400 segments)." }} /> : <pre className={`diff-output diff-${mode}`}>{diff.parts.length ? diff.parts.map((part, index) => <span className={`diff-${part.type}`} key={`${part.type}-${index}`}>{part.value}</span>) : (isTr ? "Fark burada görünecek." : "The diff will appear here.")}</pre>}<ToolNotice notice={notice} locale={locale} /></div>
    </WorkbenchFrame>
  );
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)]\(((?:https?:\/\/|mailto:)[^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
}

function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeLanguage = "";
  let code: string[] = [];
  let listType: "ul" | "ol" | null = null;
  const closeList = () => { if (listType) { html.push(`</${listType}>`); listType = null; } };
  lines.forEach((line) => {
    const fence = line.match(/^```\s*([\w-]*)/);
    if (fence) {
      closeList();
      if (inCode) { html.push(`<pre><code${codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : ""}>${escapeHtml(code.join("\n"))}</code></pre>`); code = []; codeLanguage = ""; inCode = false; }
      else { inCode = true; codeLanguage = fence[1] ?? ""; }
      return;
    }
    if (inCode) { code.push(line); return; }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) { closeList(); const level = heading[1].length; html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); return; }
    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      const wanted = unordered ? "ul" : "ol";
      if (listType !== wanted) { closeList(); listType = wanted; html.push(`<${wanted}>`); }
      html.push(`<li>${inlineMarkdown((unordered ?? ordered)![1])}</li>`); return;
    }
    closeList();
    if (!line.trim()) return;
    if (/^>\s?/.test(line)) html.push(`<blockquote>${inlineMarkdown(line.replace(/^>\s?/, ""))}</blockquote>`);
    else if (/^---+$/.test(line.trim())) html.push("<hr>");
    else html.push(`<p>${inlineMarkdown(line)}</p>`);
  });
  closeList();
  if (inCode) html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
  return html.join("\n");
}

function downloadText(value: string, filename: string, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
}

function MarkdownWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [markdown, setMarkdown] = useState(isTr ? "# Gizlilik odaklı araçlar\n\n**ByteQuant**, veriyi tarayıcıda işler.\n\n- Sunucuya aktarım yok\n- Üyelik yok\n- Açıklanabilir sonuç\n\n[ByteQuant'ı aç](https://bytequant.org)" : "# Privacy-first tools\n\n**ByteQuant** processes data in the browser.\n\n- No server transfer\n- No account\n- Explainable output\n\n[Open ByteQuant](https://bytequant.org)");
  const html = useMemo(() => markdownToHtml(markdown.slice(0, 50000)), [markdown]);
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  async function copyHtml() {
    try { await navigator.clipboard.writeText(html); setNotice({ kind: "success", text: isTr ? "HTML panoya kopyalandı." : "HTML copied to the clipboard." }); }
    catch { setNotice({ kind: "error", text: isTr ? "Tarayıcı pano izni vermedi." : "The browser denied clipboard access." }); }
  }
  return (
    <WorkbenchFrame locale={locale} onDemo={() => { setMarkdown(isTr ? "# Gizlilik odaklı araçlar\n\n**ByteQuant**, veriyi tarayıcıda işler.\n\n- Sunucuya aktarım yok\n- Üyelik yok\n- Açıklanabilir sonuç\n\n[ByteQuant'ı aç](https://bytequant.org)" : "# Privacy-first tools\n\n**ByteQuant** processes data in the browser.\n\n- No server transfer\n- No account\n- Explainable output\n\n[Open ByteQuant](https://bytequant.org)"); setNotice({ kind: "info", text: isTr ? "Markdown örneği yüklendi." : "Markdown example loaded." }); }} onClear={() => { setMarkdown(""); setNotice(null); }}>
      <div className="markdown-grid"><label className="field-label"><span>Markdown</span><textarea rows={22} maxLength={50000} value={markdown} onChange={(event) => { setMarkdown(event.target.value); setNotice(null); }} spellCheck="false" /></label><div className="markdown-results"><div className="markdown-preview"><div className="result-header"><span>{isTr ? "Canlı önizleme" : "Live preview"}</span></div><article dangerouslySetInnerHTML={{ __html: html }} /></div><div className="html-code-panel"><div className="result-header"><span>HTML</span><div className="output-actions"><button type="button" onClick={copyHtml} disabled={!html}>{isTr ? "Kopyala" : "Copy"}</button><button type="button" onClick={() => downloadText(html, "bytequant-markdown.html", "text/html;charset=utf-8")} disabled={!html}>{isTr ? "İndir" : "Download"}</button></div></div><pre>{html || (isTr ? "HTML burada görünecek." : "HTML will appear here.")}</pre><ToolNotice notice={notice} locale={locale} /></div></div></div>
    </WorkbenchFrame>
  );
}

function TimestampWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [epoch, setEpoch] = useState("1767225600");
  const [calendar, setCalendar] = useState("2026-01-01T00:00");
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const epochResult = useMemo(() => {
    const raw = Number(epoch.trim());
    if (!epoch.trim() || !Number.isFinite(raw)) return null;
    const milliseconds = Math.abs(raw) < 100000000000 ? raw * 1000 : raw;
    const date = new Date(milliseconds);
    return Number.isNaN(date.getTime()) ? null : { date, unit: Math.abs(raw) < 100000000000 ? "seconds" : "milliseconds" };
  }, [epoch]);
  const calendarResult = useMemo(() => { const date = calendar ? new Date(calendar) : null; return date && !Number.isNaN(date.getTime()) ? date : null; }, [calendar]);
  const report = [
    epochResult ? `Epoch → ISO: ${epochResult.date.toISOString()}\nEpoch → ${isTr ? "yerel" : "local"}: ${epochResult.date.toLocaleString(isTr ? "tr-TR" : "en-US")}` : "",
    calendarResult ? `${isTr ? "Tarih" : "Date"} → Unix: ${Math.floor(calendarResult.getTime() / 1000)} s / ${calendarResult.getTime()} ms\n${isTr ? "Tarih" : "Date"} → ISO: ${calendarResult.toISOString()}` : "",
  ].filter(Boolean).join("\n\n");
  async function copyReport() {
    try { await navigator.clipboard.writeText(report); setNotice({ kind: "success", text: isTr ? "Dönüşüm sonucu kopyalandı." : "Conversion result copied." }); }
    catch { setNotice({ kind: "error", text: isTr ? "Tarayıcı pano izni vermedi." : "The browser denied clipboard access." }); }
  }
  return (
    <WorkbenchFrame locale={locale} onDemo={() => { setEpoch("1767225600"); setCalendar("2026-01-01T00:00"); setNotice({ kind: "info", text: isTr ? "Tarih örneği yüklendi." : "Date example loaded." }); }} onClear={() => { setEpoch(""); setCalendar(""); setNotice(null); }}>
      <div className="result-header converter-actions-header"><span>{isTr ? "Dönüşüm çıktıları" : "Conversion outputs"}</span><div className="output-actions"><button type="button" onClick={copyReport} disabled={!report}>{isTr ? "Kopyala" : "Copy"}</button><button type="button" onClick={() => downloadText(report, "bytequant-timestamp.txt")} disabled={!report}>{isTr ? "İndir" : "Download"}</button></div></div>
      <div className="converter-grid"><section><span className="kicker">UNIX → {isTr ? "TARİH" : "DATE"}</span><label className="field-label"><span>{isTr ? "Epoch saniye veya milisaniye" : "Epoch seconds or milliseconds"}</span><input inputMode="numeric" value={epoch} onChange={(event) => { setEpoch(event.target.value); setNotice(null); }} /></label>{epochResult ? <div className="conversion-card"><div><small>{isTr ? "Algılanan birim" : "Detected unit"}</small><strong>{epochResult.unit === "seconds" ? (isTr ? "Saniye" : "Seconds") : (isTr ? "Milisaniye" : "Milliseconds")}</strong></div><div><small>UTC / ISO 8601</small><code>{epochResult.date.toISOString()}</code></div><div><small>{isTr ? "Yerel tarih" : "Local date"}</small><code>{epochResult.date.toLocaleString(isTr ? "tr-TR" : "en-US", { dateStyle: "full", timeStyle: "long" })}</code></div></div> : epoch.trim() ? <ToolNotice locale={locale} notice={{ kind: "error", text: isTr ? "Geçerli bir Unix saniye veya milisaniye değeri girin." : "Enter valid Unix seconds or milliseconds." }} /> : null}</section><section><span className="kicker">{isTr ? "TARİH" : "DATE"} → UNIX</span><label className="field-label"><span>{isTr ? "Yerel tarih ve saat" : "Local date and time"}</span><input type="datetime-local" value={calendar} onChange={(event) => { setCalendar(event.target.value); setNotice(null); }} /></label>{calendarResult && <div className="conversion-card"><div><small>{isTr ? "Unix saniye" : "Unix seconds"}</small><code>{Math.floor(calendarResult.getTime() / 1000)}</code></div><div><small>{isTr ? "Unix milisaniye" : "Unix milliseconds"}</small><code>{calendarResult.getTime()}</code></div><div><small>UTC / ISO 8601</small><code>{calendarResult.toISOString()}</code></div></div>}<p className="privacy-hint">{isTr ? `Tarayıcı saat dilimi: ${Intl.DateTimeFormat().resolvedOptions().timeZone}` : `Browser time zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}</p></section></div><ToolNotice notice={notice} locale={locale} />
    </WorkbenchFrame>
  );
}

function clamp(value: number, min = 0, max = 255) { return Math.min(max, Math.max(min, value)); }
function rgbToHex(rgb: Rgb) { return `#${[rgb.r, rgb.g, rgb.b].map((value) => Math.round(clamp(value)).toString(16).padStart(2, "0")).join("")}`.toUpperCase(); }
function rgbToHsl({ r, g, b }: Rgb) {
  const nr = r / 255; const ng = g / 255; const nb = b / 255; const max = Math.max(nr, ng, nb); const min = Math.min(nr, ng, nb); const delta = max - min;
  let h = 0; const l = (max + min) / 2; const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  if (delta) { if (max === nr) h = 60 * (((ng - nb) / delta) % 6); else if (max === ng) h = 60 * ((nb - nr) / delta + 2); else h = 60 * ((nr - ng) / delta + 4); }
  if (h < 0) h += 360;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h: number, s: number, l: number): Rgb {
  const hue = ((h % 360) + 360) % 360; const sat = clamp(s, 0, 100) / 100; const light = clamp(l, 0, 100) / 100; const c = (1 - Math.abs(2 * light - 1)) * sat; const x = c * (1 - Math.abs((hue / 60) % 2 - 1)); const m = light - c / 2;
  const values = hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] : hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x];
  return { r: Math.round((values[0] + m) * 255), g: Math.round((values[1] + m) * 255), b: Math.round((values[2] + m) * 255) };
}
function parseColor(value: string): Rgb | null {
  const input = value.trim();
  const hex = input.match(/^#?([\da-f]{3}|[\da-f]{6})$/i);
  if (hex) { const full = hex[1].length === 3 ? hex[1].split("").map((char) => char + char).join("") : hex[1]; return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) }; }
  const rgb = input.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,[^)]+)?\)$/i);
  if (rgb) return { r: clamp(Number(rgb[1])), g: clamp(Number(rgb[2])), b: clamp(Number(rgb[3])) };
  const hsl = input.match(/^hsla?\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%(?:\s*,[^)]+)?\)$/i);
  return hsl ? hslToRgb(Number(hsl[1]), Number(hsl[2]), Number(hsl[3])) : null;
}

function ColorWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [value, setValue] = useState("#4F46E5");
  const [rgb, setRgb] = useState<Rgb>({ r: 79, g: 70, b: 229 });
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const hex = rgbToHex(rgb); const hsl = rgbToHsl(rgb); const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`; const hslText = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const report = `HEX: ${hex}\nRGB: ${rgbText}\nHSL: ${hslText}`;
  function update(input: string) { setValue(input); const parsed = parseColor(input); if (parsed) { setRgb(parsed); setNotice(null); } else setNotice({ kind: "error", text: isTr ? "HEX, rgb(r,g,b) veya hsl(h,s%,l%) biçimi kullanın." : "Use HEX, rgb(r,g,b), or hsl(h,s%,l%) format." }); }
  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setNotice({ kind: "success", text: isTr ? `${text} kopyalandı.` : `${text} copied.` }); }
    catch { setNotice({ kind: "error", text: isTr ? "Tarayıcı pano izni vermedi." : "The browser denied clipboard access." }); }
  }
  return (
    <WorkbenchFrame locale={locale} onDemo={() => update("#4F46E5")} onClear={() => update("#000000")}>
      <div className="result-header converter-actions-header"><span>{isTr ? "Renk çıktıları" : "Color outputs"}</span><div className="output-actions"><button type="button" onClick={() => copy(report)}>{isTr ? "Tümünü kopyala" : "Copy all"}</button><button type="button" onClick={() => downloadText(report, "bytequant-color.txt")}>{isTr ? "İndir" : "Download"}</button></div></div>
      <div className="color-workbench"><div className="color-controls"><label className="field-label color-picker-field"><span>{isTr ? "Renk seçici" : "Color picker"}</span><input type="color" value={hex} onChange={(event) => update(event.target.value)} /></label><label className="field-label"><span>{isTr ? "Renk değeri" : "Color value"}</span><input value={value} onChange={(event) => update(event.target.value)} placeholder="#4F46E5 · rgb(79,70,229) · hsl(243,75%,59%)" /></label><ToolNotice notice={notice} locale={locale} /></div><div className="color-swatch" style={{ backgroundColor: hex }}><span style={{ color: hsl.l > 60 ? "#111827" : "#ffffff" }}>{hex}</span></div><div className="color-values">{[["HEX", hex], ["RGB", rgbText], ["HSL", hslText]].map(([label, text]) => <button type="button" key={label} onClick={() => copy(text)}><small>{label}</small><code>{text}</code><span>{isTr ? "Kopyala" : "Copy"}</span></button>)}</div></div>
    </WorkbenchFrame>
  );
}

function QrWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [input, setInput] = useState("https://bytequant.org");
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      if (!input.trim()) { setPng(""); setSvg(""); return; }
      try {
        const [nextPng, nextSvg] = await Promise.all([
          QRCode.toDataURL(input.slice(0, 2000), { width: 640, margin: 2, errorCorrectionLevel: "M", color: { dark: "#102019", light: "#ffffff" } }),
          QRCode.toString(input.slice(0, 2000), { type: "svg", width: 640, margin: 2, errorCorrectionLevel: "M", color: { dark: "#102019", light: "#ffffff" } }),
        ]);
        if (active) { setPng(nextPng); setSvg(nextSvg); setNotice(null); }
      } catch (reason) { if (active) { setNotice({ kind: "error", text: (isTr ? "QR kod oluşturulamadı: " : "Could not generate the QR code: ") + (reason instanceof Error ? reason.message : String(reason)) }); setPng(""); setSvg(""); } }
    }, 180);
    return () => { active = false; window.clearTimeout(timer); };
  }, [input, isTr]);
  function download(url: string, filename: string) {
    try { const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); setNotice({ kind: "success", text: isTr ? `${filename} indirildi.` : `${filename} downloaded.` }); }
    catch { setNotice({ kind: "error", text: isTr ? "Dosya indirilemedi. Tarayıcı izinlerini kontrol edin." : "The file could not be downloaded. Check browser permissions." }); }
  }
  return (
    <WorkbenchFrame locale={locale} onDemo={() => { setInput("https://bytequant.org"); setNotice({ kind: "info", text: isTr ? "Örnek URL yüklendi." : "Example URL loaded." }); }} onClear={() => { setInput(""); setNotice(null); }}>
      <div className="qr-grid"><div><label className="field-label"><span>{isTr ? "Metin veya URL" : "Text or URL"}</span><textarea rows={10} maxLength={2000} value={input} onChange={(event) => { setInput(event.target.value); setNotice(null); }} /></label><p className="privacy-hint">{isTr ? `${input.length}/2.000 karakter · İçerik QR servisine gönderilmez.` : `${input.length}/2,000 characters · Content is not sent to a QR service.`}</p><ToolNotice notice={notice} locale={locale} /></div><div className="qr-result"><div className="result-header"><span>{isTr ? "QR çıktısı" : "QR output"}</span><div className="output-actions"><button type="button" disabled={!png} onClick={() => download(png, "bytequant-qr.png")}>PNG {isTr ? "indir" : "download"}</button><button type="button" disabled={!svg} onClick={() => download(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, "bytequant-qr.svg")}>SVG {isTr ? "indir" : "download"}</button></div></div><div className="qr-canvas">{png ? <img src={png} alt={isTr ? "Üretilen QR kod" : "Generated QR code"} /> : <span>{isTr ? "QR kod burada görünecek." : "The QR code will appear here."}</span>}</div><p>{isTr ? "Paylaşmadan veya basmadan önce kodu farklı bir cihazla test edin." : "Test the code with a different device before sharing or printing."}</p></div></div>
    </WorkbenchFrame>
  );
}

function readAscii(view: DataView, offset: number, length: number) {
  let value = ""; for (let index = 0; index < length && offset + index < view.byteLength; index += 1) { const code = view.getUint8(offset + index); if (!code) break; value += String.fromCharCode(code); } return value.trim();
}
function parseTiff(view: DataView, start: number): MetadataItem[] {
  if (start + 8 > view.byteLength) return [];
  const little = view.getUint16(start) === 0x4949; if (!little && view.getUint16(start) !== 0x4d4d) return [];
  const u16 = (offset: number) => view.getUint16(offset, little); const u32 = (offset: number) => view.getUint32(offset, little);
  if (u16(start + 2) !== 42) return [];
  const output: MetadataItem[] = []; const visited = new Set<number>();
  const typeSize: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
  const labels: Record<number, string> = { 0x010f: "Camera make", 0x0110: "Camera model", 0x0112: "Orientation", 0x0131: "Software", 0x0132: "Modified date", 0x829a: "Exposure", 0x829d: "F-number", 0x9003: "Captured date", 0x9004: "Digitized date", 0xa002: "Pixel width", 0xa003: "Pixel height", 0xa434: "Lens model" };
  function valueAt(entry: number, type: number, count: number) {
    const size = (typeSize[type] ?? 1) * count; const data = size <= 4 ? entry + 8 : start + u32(entry + 8); if (data < 0 || data + size > view.byteLength) return "";
    if (type === 2) return readAscii(view, data, count);
    if (type === 3) return Array.from({ length: count }, (_, index) => u16(data + index * 2)).join(", ");
    if (type === 4) return Array.from({ length: count }, (_, index) => u32(data + index * 4)).join(", ");
    if (type === 5) return Array.from({ length: count }, (_, index) => { const denominator = u32(data + index * 8 + 4); return denominator ? (u32(data + index * 8) / denominator).toFixed(4).replace(/0+$/, "").replace(/\.$/, "") : "0"; }).join(", ");
    return "";
  }
  function parseIfd(relativeOffset: number, gps = false) {
    const offset = start + relativeOffset; if (visited.has(offset) || offset + 2 > view.byteLength) return; visited.add(offset); const count = u16(offset); if (count > 512 || offset + 2 + count * 12 > view.byteLength) return;
    const gpsValues: Record<number, string> = {};
    for (let index = 0; index < count; index += 1) {
      const entry = offset + 2 + index * 12; const tag = u16(entry); const type = u16(entry + 2); const itemCount = u32(entry + 4);
      if ((tag === 0x8769 || tag === 0x8825) && type === 4) { parseIfd(u32(entry + 8), tag === 0x8825); continue; }
      const value = valueAt(entry, type, itemCount); if (!value) continue;
      if (gps) gpsValues[tag] = value; else if (labels[tag]) output.push({ label: labels[tag], value });
    }
    if (gps) {
      const toDecimal = (numbers: string, ref: string) => { const parts = numbers.split(",").map(Number); const decimal = (parts[0] ?? 0) + (parts[1] ?? 0) / 60 + (parts[2] ?? 0) / 3600; return ["S", "W"].includes(ref) ? -decimal : decimal; };
      if (gpsValues[2] && gpsValues[4]) output.push({ label: "GPS coordinates", value: `${toDecimal(gpsValues[2], gpsValues[1]).toFixed(6)}, ${toDecimal(gpsValues[4], gpsValues[3]).toFixed(6)}` });
      else output.push({ label: "GPS metadata", value: "Present" });
    }
  }
  parseIfd(u32(start + 4)); return output;
}
function inspectImageMetadata(buffer: ArrayBuffer): MetadataItem[] {
  const view = new DataView(buffer); const output: MetadataItem[] = [];
  if (view.byteLength > 4 && view.getUint16(0) === 0xffd8) {
    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      if (view.getUint8(offset) !== 0xff) { offset += 1; continue; }
      const marker = view.getUint8(offset + 1); if (marker === 0xda || marker === 0xd9) break; const length = view.getUint16(offset + 2); if (length < 2 || offset + 2 + length > view.byteLength) break;
      const dataStart = offset + 4;
      if (marker === 0xe1 && readAscii(view, dataStart, 6).startsWith("Exif")) output.push(...parseTiff(view, dataStart + 6));
      if (marker === 0xed) output.push({ label: "IPTC metadata", value: "Present" });
      if (marker === 0xfe) output.push({ label: "JPEG comment", value: readAscii(view, dataStart, length - 2) || "Present" });
      offset += length + 2;
    }
  } else if (view.byteLength > 8 && view.getUint32(0) === 0x89504e47) {
    let offset = 8;
    while (offset + 12 <= view.byteLength) {
      const length = view.getUint32(offset); const type = readAscii(view, offset + 4, 4); const data = offset + 8; if (data + length + 4 > view.byteLength) break;
      if (type === "tEXt") { const text = readAscii(view, data, length); const split = text.indexOf("\0"); output.push({ label: split >= 0 ? text.slice(0, split) : "PNG text", value: split >= 0 ? text.slice(split + 1) : text }); }
      if (type === "iTXt" || type === "zTXt") output.push({ label: `PNG ${type} metadata`, value: readAscii(view, data, Math.min(length, 100)) || "Present" });
      if (type === "eXIf") output.push(...parseTiff(view, data));
      offset = data + length + 4; if (type === "IEND") break;
    }
  }
  return output;
}

async function imageBitmapFromFile(file: File) {
  if ("createImageBitmap" in window) return createImageBitmap(file, { imageOrientation: "from-image" });
  const url = URL.createObjectURL(file);
  try { return await new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Image could not be decoded")); image.src = url; }); }
  finally { URL.revokeObjectURL(url); }
}

function ExifWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const [file, setFile] = useState<File | null>(null); const [preview, setPreview] = useState(""); const [cleaned, setCleaned] = useState(""); const [metadata, setMetadata] = useState<MetadataItem[]>([]); const [dimensions, setDimensions] = useState(""); const [notice, setNotice] = useState<ToolNoticeData | null>(null); const [busy, setBusy] = useState(false);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); if (cleaned) URL.revokeObjectURL(cleaned); }, [preview, cleaned]);
  async function choose(next: File | null) {
    if (preview) URL.revokeObjectURL(preview); if (cleaned) URL.revokeObjectURL(cleaned); setPreview(""); setCleaned(""); setMetadata([]); setDimensions(""); setNotice(null); setFile(null);
    if (!next) return;
    if (!["image/jpeg", "image/png"].includes(next.type)) { setNotice({ kind: "error", text: isTr ? "Yalnızca JPEG veya PNG seçin." : "Select a JPEG or PNG file." }); return; }
    if (next.size > 25 * 1024 * 1024) { setNotice({ kind: "error", text: isTr ? "Dosya 25 MB sınırını aşıyor." : "The file exceeds the 25 MB limit." }); return; }
    try { const [buffer, bitmap] = await Promise.all([next.arrayBuffer(), imageBitmapFromFile(next)]); setMetadata(inspectImageMetadata(buffer)); setDimensions(`${bitmap.width} × ${bitmap.height}`); if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close(); setPreview(URL.createObjectURL(next)); setFile(next); }
    catch (reason) { setNotice({ kind: "error", text: (isTr ? "Görsel okunamadı: " : "Could not read the image: ") + (reason instanceof Error ? reason.message : String(reason)) }); }
  }
  async function clean() {
    if (!file) return; setBusy(true); setNotice(null);
    try {
      const bitmap = await imageBitmapFromFile(file); if (bitmap.width * bitmap.height > 40000000) throw new Error(isTr ? "Görsel 40 megapiksel sınırını aşıyor." : "The image exceeds the 40-megapixel limit.");
      const canvas = document.createElement("canvas"); canvas.width = bitmap.width; canvas.height = bitmap.height; const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas is unavailable"); context.drawImage(bitmap, 0, 0); if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();
      const type = file.type === "image/png" ? "image/png" : "image/jpeg"; const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Encoding failed")), type, type === "image/jpeg" ? 0.92 : undefined)); if (cleaned) URL.revokeObjectURL(cleaned); setCleaned(URL.createObjectURL(blob)); setNotice({ kind: "success", text: isTr ? `Temiz kopya hazır: ${(blob.size / 1024).toFixed(1)} KB. Yeniden kodlama metadata alanlarını kaldırdı.` : `Clean copy ready: ${(blob.size / 1024).toFixed(1)} KB. Re-encoding removed metadata fields.` });
    } catch (reason) { setNotice({ kind: "error", text: (isTr ? "Temizleme tamamlanamadı: " : "Cleaning failed: ") + (reason instanceof Error ? reason.message : String(reason)) }); }
    finally { setBusy(false); }
  }
  async function loadDemo() {
    try {
      const canvas = document.createElement("canvas"); canvas.width = 720; canvas.height = 420;
      const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas is unavailable");
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height); gradient.addColorStop(0, "#102019"); gradient.addColorStop(1, "#48a18b"); context.fillStyle = gradient; context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#ffffff"; context.font = "700 44px sans-serif"; context.fillText("ByteQuant", 52, 190); context.font = "24px sans-serif"; context.fillText(isTr ? "Yerel görsel gizliliği demosu" : "Local image privacy demo", 52, 235);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Encoding failed")), "image/png"));
      await choose(new File([blob], "bytequant-exif-demo.png", { type: "image/png", lastModified: Date.now() }));
      setNotice({ kind: "info", text: isTr ? "Yerel demo PNG yüklendi. Metadata taramasını ve temiz kopya akışını deneyebilirsiniz." : "A local demo PNG is loaded. You can test metadata inspection and clean-copy output." });
    } catch (reason) { setNotice({ kind: "error", text: (isTr ? "Demo oluşturulamadı: " : "Could not create the demo: ") + (reason instanceof Error ? reason.message : String(reason)) }); }
  }
  async function copyMetadata() {
    try { await navigator.clipboard.writeText(metadata.map((item) => `${item.label}: ${item.value}`).join("\n")); setNotice({ kind: "success", text: isTr ? "Metadata raporu kopyalandı." : "Metadata report copied." }); }
    catch { setNotice({ kind: "error", text: isTr ? "Tarayıcı pano izni vermedi." : "The browser denied clipboard access." }); }
  }
  function download() { if (!cleaned || !file) return; const anchor = document.createElement("a"); anchor.href = cleaned; anchor.download = `${file.name.replace(/\.[^.]+$/, "")}-clean.${file.type === "image/png" ? "png" : "jpg"}`; anchor.click(); setNotice({ kind: "success", text: isTr ? "Temiz görsel indirildi." : "Clean image downloaded." }); }
  return (
    <WorkbenchFrame locale={locale} onDemo={loadDemo} onClear={() => choose(null)}>
      <div className="exif-grid"><div className="file-drop"><label><input type="file" accept="image/jpeg,image/png" onChange={(event) => choose(event.target.files?.[0] ?? null)} /><span>＋</span><strong>{isTr ? "JPEG veya PNG seçin" : "Choose a JPEG or PNG"}</strong><small>{isTr ? "En fazla 25 MB · Dosya ağ üzerinden gönderilmez" : "Up to 25 MB · The file is not sent over the network"}</small></label>{preview && <img src={preview} alt={isTr ? "Seçilen görsel önizlemesi" : "Selected image preview"} />}</div><div className="metadata-panel"><div className="result-header"><span>{isTr ? "Bulunan metadata" : "Detected metadata"}{file && <small>{dimensions} · {(file.size / 1024).toFixed(1)} KB</small>}</span><div className="output-actions"><button type="button" disabled={!metadata.length} onClick={copyMetadata}>{isTr ? "Raporu kopyala" : "Copy report"}</button><button type="button" disabled={!cleaned} onClick={download}>{isTr ? "Temiz görseli indir" : "Download clean image"}</button></div></div>{file ? metadata.length ? <dl>{metadata.map((item, index) => <div key={`${item.label}-${index}`}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl> : <p>{isTr ? "Okunabilir EXIF, GPS, IPTC veya PNG metin alanı bulunamadı. Temiz kopya yine de piksel verisinden yeniden oluşturulabilir." : "No readable EXIF, GPS, IPTC, or PNG text field was found. A clean copy can still be rebuilt from pixel data."}</p> : <p>{isTr ? "Dosya seçtiğinizde metadata burada listelenir." : "Metadata will be listed here after you choose a file."}</p>}<div className="exif-actions"><button type="button" className="primary-button" disabled={!file || busy} onClick={clean}>{busy ? (isTr ? "Temizleniyor…" : "Cleaning…") : (isTr ? "Temiz kopya oluştur" : "Create clean copy")}</button></div><ToolNotice notice={notice} locale={locale} /><p className="privacy-hint">{isTr ? "Not: JPEG yeniden kodlama küçük kalite/boyut farkı oluşturabilir. Animasyonlu veya özel renk profilli dosyalar için profesyonel doğrulama yapın." : "Note: JPEG re-encoding can slightly change quality or size. Professionally verify animated or color-managed assets."}</p></div></div>
    </WorkbenchFrame>
  );
}

function formatDuration(seconds: number, locale: Locale) {
  const isTr = locale === "tr"; if (!Number.isFinite(seconds) || seconds > 1e24) return isTr ? "trilyonlarca yıl" : "trillions of years";
  const units = [{ value: 31557600, tr: "yıl", en: "years" }, { value: 86400, tr: "gün", en: "days" }, { value: 3600, tr: "saat", en: "hours" }, { value: 60, tr: "dakika", en: "minutes" }, { value: 1, tr: "saniye", en: "seconds" }]; const unit = units.find((item) => seconds >= item.value) ?? units.at(-1)!; const amount = Math.max(0.001, seconds / unit.value); return `${amount >= 100 ? amount.toExponential(1) : amount.toFixed(amount < 10 ? 1 : 0)} ${unit[locale]}`;
}
function analyzePassword(password: string, locale: Locale) {
  let pool = 0; if (/[a-z]/.test(password)) pool += 26; if (/[A-Z]/.test(password)) pool += 26; if (/\d/.test(password)) pool += 10; if (/[^\w\s]/.test(password)) pool += 33; if (/\s/.test(password)) pool += 1;
  let entropy = password.length && pool ? password.length * Math.log2(pool) : 0; const warnings: string[] = [];
  if (password.length < 12) { entropy -= 12; warnings.push(locale === "tr" ? "12 karakterden kısa." : "Shorter than 12 characters."); }
  if (/(.)\1{2,}/.test(password)) { entropy -= 10; warnings.push(locale === "tr" ? "Tekrarlanan karakterler var." : "Contains repeated characters."); }
  if (/1234|abcd|qwerty|password|parola|admin|letmein/i.test(password)) { entropy -= 24; warnings.push(locale === "tr" ? "Yaygın veya sıralı bir desen içeriyor." : "Contains a common or sequential pattern."); }
  if (new Set(password).size < Math.max(4, password.length / 3)) { entropy -= 8; warnings.push(locale === "tr" ? "Karakter çeşitliliği düşük." : "Character variety is low."); }
  entropy = Math.max(0, entropy); const score = !password ? 0 : entropy >= 100 ? 4 : entropy >= 75 ? 3 : entropy >= 50 ? 2 : entropy >= 28 ? 1 : 0; const labels = locale === "tr" ? ["Çok zayıf", "Zayıf", "Orta", "Güçlü", "Çok güçlü"] : ["Very weak", "Weak", "Moderate", "Strong", "Very strong"];
  return { pool, entropy, score, label: labels[score], warnings, seconds: entropy ? 2 ** Math.max(0, entropy - 1) / 1e10 : 0 };
}
function PasswordWorkbench({ locale }: { locale: Locale }) {
  const isTr = locale === "tr"; const [password, setPassword] = useState(""); const [visible, setVisible] = useState(false); const [notice, setNotice] = useState<ToolNoticeData | null>(null); const analysis = useMemo(() => analyzePassword(password, locale), [password, locale]);
  const report = `${isTr ? "Güç" : "Strength"}: ${analysis.label}\n${isTr ? "Uzunluk" : "Length"}: ${password.length}\n${isTr ? "Tahmini entropi" : "Estimated entropy"}: ${analysis.entropy.toFixed(1)} bit\n${isTr ? "Tahmini kırılma süresi" : "Estimated crack time"}: ${formatDuration(analysis.seconds, locale)}${analysis.warnings.length ? `\n${isTr ? "Uyarılar" : "Warnings"}:\n- ${analysis.warnings.join("\n- ")}` : ""}\n\n${isTr ? "Not: Rapor güvenlik tahminidir ve parolanın kendisini içermez." : "Note: This is a security estimate and does not include the password itself."}`;
  async function copyReport() {
    try { await navigator.clipboard.writeText(report); setNotice({ kind: "success", text: isTr ? "Parola değeri olmadan güvenlik raporu kopyalandı." : "Security report copied without the password value." }); }
    catch { setNotice({ kind: "error", text: isTr ? "Tarayıcı pano izni vermedi." : "The browser denied clipboard access." }); }
  }
  return (
    <WorkbenchFrame locale={locale} onDemo={() => { setPassword("Bq!Mavi-Kutup_2026_Uzun"); setNotice({ kind: "info", text: isTr ? "Gerçek parola olmayan demo örneği yüklendi." : "A non-production demo password is loaded." }); }} onClear={() => { setPassword(""); setNotice(null); }}>
      <div className="password-workbench"><div><label className="field-label"><span>{isTr ? "Test edilecek parola" : "Password to test"}</span><div className="password-input-row"><input type={visible ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setNotice(null); }} autoComplete="new-password" spellCheck="false" /><button type="button" onClick={() => setVisible((value) => !value)}>{visible ? (isTr ? "Gizle" : "Hide") : (isTr ? "Göster" : "Show")}</button></div></label><p className="privacy-hint">{isTr ? "Parola ağ isteğine, sızıntı servisine veya localStorage alanına gönderilmez." : "The password is not sent to the network, a breach service, or localStorage."}</p><ToolNotice notice={notice} locale={locale} /></div><div className="password-report"><div className="result-header"><span>{isTr ? "Güvenlik raporu" : "Security report"}</span><div className="output-actions"><button type="button" onClick={copyReport} disabled={!password}>{isTr ? "Kopyala" : "Copy"}</button><button type="button" onClick={() => downloadText(report, "bytequant-password-report.txt")} disabled={!password}>{isTr ? "İndir" : "Download"}</button></div></div><div className="strength-heading"><span>{isTr ? "Güç seviyesi" : "Strength"}</span><strong>{analysis.label}</strong></div><div className="strength-meter" aria-label={analysis.label}><i style={{ width: `${password ? (analysis.score + 1) * 20 : 0}%` }} data-score={analysis.score} /></div><div className="metric-strip"><div><strong>{password.length}</strong><span>{isTr ? "Karakter" : "Characters"}</span></div><div><strong>{analysis.entropy.toFixed(1)}</strong><span>{isTr ? "Tahmini bit entropi" : "Estimated entropy bits"}</span></div><div><strong>{formatDuration(analysis.seconds, locale)}</strong><span>{isTr ? "10B tahmin/sn" : "At 10B guesses/sec"}</span></div></div><ul className="password-checks"><li className={password.length >= 16 ? "pass" : ""}>✓ {isTr ? "16+ karakter" : "16+ characters"}</li><li className={analysis.pool >= 62 ? "pass" : ""}>✓ {isTr ? "Geniş karakter havuzu" : "Broad character pool"}</li><li className={!analysis.warnings.length && password.length ? "pass" : ""}>✓ {isTr ? "Belirgin yaygın desen yok" : "No obvious common pattern"}</li></ul>{analysis.warnings.length > 0 && <div className="password-warnings"><strong>{isTr ? "İyileştirme önerileri" : "Improvement suggestions"}</strong><ul>{analysis.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}<p>{isTr ? "Kırılma süresi yalnızca matematiksel tahmindir; gerçek sonuç hash/KDF, saldırı yöntemi ve sızıntı durumuna bağlıdır." : "Crack time is a mathematical estimate; real outcomes depend on the hash/KDF, attack method, and breach exposure."}</p></div></div>
    </WorkbenchFrame>
  );
}

export function SpecializedWorkbench({ slug, locale }: { slug: string; locale: Locale }) {
  if (slug === "metin-farki-diff") return <DiffWorkbench locale={locale} />;
  if (slug === "markdown-onizleyici") return <MarkdownWorkbench locale={locale} />;
  if (slug === "unix-zaman-damgasi-donusturucu") return <TimestampWorkbench locale={locale} />;
  if (slug === "renk-donusturucu") return <ColorWorkbench locale={locale} />;
  if (slug === "qr-kod-olusturucu") return <QrWorkbench locale={locale} />;
  if (slug === "exif-meta-veri-temizleyici") return <ExifWorkbench locale={locale} />;
  return <PasswordWorkbench locale={locale} />;
}
