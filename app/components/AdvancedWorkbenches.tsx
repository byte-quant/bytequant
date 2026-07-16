"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Locale } from "../lib/site";
import { ToolNotice, type ToolNoticeData } from "./ToolNotice";

export const advancedWorkbenchSlugs = new Set([
  "yatirim-getiri-simulatoru",
  "birim-donusturucu",
  "not-ortalamasi-hesaplayici",
  "gpa-cevirici",
  "kaynakca-atif-formatlayici",
  "fatura-sablonu-olusturucu",
  "basit-sozlesme-sablonu",
  "asiri-kesinlik-dil-tarayicisi",
  "konusma-disa-aktarma-formatlayici",
  "token-baglam-butcesi-planlayici",
  "sistem-promptu-netlik-kontrolu",
  "rol-persona-tutarlilik-kontrolu",
  "dosya-risk-on-taramasi",
  "kod-guvenligi-on-taramasi",
  "url-guvenlik-on-kontrolu",
]);

type Messages = Record<Locale, string>;
type Severity = "HIGH" | "MEDIUM" | "INFO";
type Finding = { severity: Severity; label: string; line?: number };
const msg = (locale: Locale, messages: Messages) => messages[locale];
const lineText = (...values: (string | number)[]) => values.join("\n");

function saveText(value: string, filename: string) {
  const url = URL.createObjectURL(new Blob([value], { type: "text/plain;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function Frame({ locale, children, onDemo, onClear, busy = false }: { locale: Locale; children: ReactNode; onDemo: () => void; onClear: () => void; busy?: boolean }) {
  return (
    <section className="workbench specialized-workbench advanced-workbench" aria-busy={busy} aria-label={msg(locale, { tr: "Araç çalışma alanı", en: "Tool workbench", de: "Werkzeug-Arbeitsbereich", zh: "工具工作区" })}>
      <div className="workbench-bar">
        <span className="local-status"><i />{msg(locale, { tr: "Girdi yalnızca etkin tarayıcı sekmesinde işlenir.", en: "Input is processed only in the active browser tab.", de: "Eingaben werden nur im aktiven Browser-Tab verarbeitet.", zh: "输入仅在当前浏览器标签页中处理。" })}</span>
        <div className="workbench-bar-actions">
          <button type="button" className="demo-button" onClick={onDemo} disabled={busy}>{msg(locale, { tr: "Örnek veri yükle", en: "Load example", de: "Beispiel laden", zh: "加载示例" })}</button>
          <button type="button" className="ghost-button" onClick={onClear} disabled={busy}>{msg(locale, { tr: "Temizle", en: "Clear", de: "Leeren", zh: "清除" })}</button>
        </div>
      </div>
      {children}
    </section>
  );
}

function Output({ locale, value, filename, notice, extra }: { locale: Locale; value: string; filename: string; notice?: ToolNoticeData | null; extra?: ReactNode }) {
  const [copyNotice, setCopyNotice] = useState<ToolNoticeData | null>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopyNotice({ kind: "success", text: msg(locale, { tr: "Çıktı panoya kopyalandı.", en: "Output copied to the clipboard.", de: "Ausgabe in die Zwischenablage kopiert.", zh: "输出已复制到剪贴板。" }) });
    } catch {
      setCopyNotice({ kind: "error", text: msg(locale, { tr: "Tarayıcı pano izni vermedi.", en: "The browser denied clipboard access.", de: "Der Browser hat den Zwischenablagezugriff verweigert.", zh: "浏览器拒绝访问剪贴板。" }) });
    }
  }
  return (
    <div className="result-panel" aria-live="polite">
      <div className="result-header"><span>{msg(locale, { tr: "Sonuç", en: "Result", de: "Ergebnis", zh: "结果" })}</span><div className="output-actions"><button type="button" disabled={!value} onClick={copy}>{msg(locale, { tr: "Kopyala", en: "Copy", de: "Kopieren", zh: "复制" })}</button><button type="button" disabled={!value} onClick={() => saveText(value, filename)}>{msg(locale, { tr: "İndir", en: "Download", de: "Herunterladen", zh: "下载" })}</button></div></div>
      {extra}
      <pre className={value ? "has-output" : ""}>{value || msg(locale, { tr: "Sonuç burada görünecek.", en: "Your result will appear here.", de: "Das Ergebnis erscheint hier.", zh: "结果将显示在这里。" })}</pre>
      <ToolNotice notice={notice ?? copyNotice} locale={locale} />
    </div>
  );
}

function NumberField({ label, value, setValue, min = 0, max = 10000000, step = 1 }: { label: string; value: number; setValue: (value: number) => void; min?: number; max?: number; step?: number }) {
  return <label className="field-label"><span>{label}</span><input type="number" value={value} min={min} max={max} step={step} onChange={(event) => setValue(Math.min(max, Math.max(min, Number(event.target.value) || 0)))} /></label>;
}

function InvestmentWorkbench({ locale }: { locale: Locale }) {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(750);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(8);
  const [fee, setFee] = useState(1);
  const [inflation, setInflation] = useState(3);
  const [currency, setCurrency] = useState("USD");
  const output = useMemo(() => {
    const months = Math.min(1200, Math.max(1, Math.round(years * 12)));
    const netAnnual = Math.max(-0.9999, (rate - fee) / 100);
    const monthlyRate = Math.pow(1 + netAnnual, 1 / 12) - 1;
    let balance = Math.max(0, initial);
    for (let index = 0; index < months; index += 1) balance = balance * (1 + monthlyRate) + Math.max(0, monthly);
    const contributed = initial + monthly * months;
    const real = balance / Math.pow(1 + inflation / 100, months / 12);
    const format = (value: number) => new Intl.NumberFormat(locale === "de" ? "de-DE" : locale === "zh" ? "zh-CN" : locale === "tr" ? "tr-TR" : "en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
    return lineText(
      msg(locale, { tr: "YATIRIM SENARYOSU", en: "INVESTMENT SCENARIO", de: "ANLAGESZENARIO", zh: "投资情景" }), "",
      msg(locale, { tr: "Tahmini nominal son değer", en: "Estimated nominal ending value", de: "Geschätzter nominaler Endwert", zh: "预计名义终值" }) + ": " + format(balance),
      msg(locale, { tr: "Enflasyona göre düzeltilmiş değer", en: "Inflation-adjusted value", de: "Inflationsbereinigter Wert", zh: "通胀调整后价值" }) + ": " + format(real),
      msg(locale, { tr: "Toplam katkı", en: "Total contributions", de: "Gesamte Einzahlungen", zh: "总投入" }) + ": " + format(contributed),
      msg(locale, { tr: "Nominal kazanç", en: "Nominal gain", de: "Nominaler Zuwachs", zh: "名义收益" }) + ": " + format(balance - contributed),
      msg(locale, { tr: "Net yıllık varsayım", en: "Net annual assumption", de: "Netto-Jahresannahme", zh: "年化净收益假设" }) + ": " + (netAnnual * 100).toFixed(2) + "%", "",
      msg(locale, { tr: "Uyarı: Bu deterministik hesap vergi, oynaklık ve nakit akışı zamanlamasını modellemez; yatırım tavsiyesi değildir.", en: "Warning: this deterministic calculation does not model tax, volatility, or exact cash-flow timing and is not investment advice.", de: "Hinweis: Diese deterministische Rechnung modelliert weder Steuern noch Volatilität oder genaue Zahlungszeitpunkte und ist keine Anlageberatung.", zh: "提示：该确定性计算未模拟税费、波动或精确现金流时间，也不是投资建议。" })
    );
  }, [currency, fee, inflation, initial, locale, monthly, rate, years]);
  return (
    <Frame locale={locale} onDemo={() => { setInitial(10000); setMonthly(750); setYears(10); setRate(8); setFee(1); setInflation(3); }} onClear={() => { setInitial(0); setMonthly(0); setYears(1); setRate(0); setFee(0); setInflation(0); }}>
      <div className="workbench-grid">
        <div className="workbench-inputs advanced-form-grid">
          <NumberField label={msg(locale, { tr: "Başlangıç tutarı", en: "Initial amount", de: "Startbetrag", zh: "初始金额" })} value={initial} setValue={setInitial} max={1e12} step={100} />
          <NumberField label={msg(locale, { tr: "Aylık katkı", en: "Monthly contribution", de: "Monatliche Sparrate", zh: "每月投入" })} value={monthly} setValue={setMonthly} max={1e10} step={10} />
          <NumberField label={msg(locale, { tr: "Süre (yıl)", en: "Duration (years)", de: "Laufzeit (Jahre)", zh: "期限（年）" })} value={years} setValue={setYears} min={1 / 12} max={100} step={0.5} />
          <NumberField label={msg(locale, { tr: "Yıllık getiri (%)", en: "Annual return (%)", de: "Jährliche Rendite (%)", zh: "年收益率（%）" })} value={rate} setValue={setRate} min={-99} max={1000} step={0.1} />
          <NumberField label={msg(locale, { tr: "Yıllık ücret (%)", en: "Annual fee (%)", de: "Jährliche Gebühr (%)", zh: "年费率（%）" })} value={fee} setValue={setFee} max={100} step={0.1} />
          <NumberField label={msg(locale, { tr: "Enflasyon (%)", en: "Inflation (%)", de: "Inflation (%)", zh: "通胀（%）" })} value={inflation} setValue={setInflation} min={-20} max={100} step={0.1} />
          <label className="field-label"><span>{msg(locale, { tr: "Para birimi", en: "Currency", de: "Währung", zh: "币种" })}</span><select value={currency} onChange={(event) => setCurrency(event.target.value)}>{["TRY", "USD", "EUR", "CNY", "GBP"].map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <Output locale={locale} value={output} filename="bytequant-investment-scenario.txt" />
      </div>
    </Frame>
  );
}

type UnitDef = { label: string; factor: number };
const units: Record<string, Record<string, UnitDef>> = {
  length: { mm: { label: "mm", factor: 0.001 }, cm: { label: "cm", factor: 0.01 }, m: { label: "m", factor: 1 }, km: { label: "km", factor: 1000 }, inch: { label: "in", factor: 0.0254 }, ft: { label: "ft", factor: 0.3048 }, mile: { label: "mi", factor: 1609.344 } },
  mass: { mg: { label: "mg", factor: 0.000001 }, g: { label: "g", factor: 0.001 }, kg: { label: "kg", factor: 1 }, oz: { label: "oz", factor: 0.028349523125 }, lb: { label: "lb", factor: 0.45359237 } },
  volume: { ml: { label: "mL", factor: 0.001 }, l: { label: "L", factor: 1 }, tsp: { label: "tsp", factor: 0.00492892159375 }, tbsp: { label: "tbsp", factor: 0.01478676478125 }, cup: { label: "cup", factor: 0.2365882365 }, gal: { label: "US gal", factor: 3.785411784 } },
  data: { B: { label: "B", factor: 1 }, kB: { label: "kB", factor: 1000 }, MB: { label: "MB", factor: 1e6 }, GB: { label: "GB", factor: 1e9 }, KiB: { label: "KiB", factor: 1024 }, MiB: { label: "MiB", factor: 1048576 }, GiB: { label: "GiB", factor: 1073741824 } },
  temperature: { C: { label: "°C", factor: 1 }, F: { label: "°F", factor: 1 }, K: { label: "K", factor: 1 } },
};
function convertTemperature(value: number, from: string, to: string) {
  const celsius = from === "C" ? value : from === "F" ? (value - 32) * 5 / 9 : value - 273.15;
  return to === "C" ? celsius : to === "F" ? celsius * 9 / 5 + 32 : celsius + 273.15;
}
function UnitWorkbench({ locale }: { locale: Locale }) {
  const [category, setCategory] = useState("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [value, setValue] = useState(1);
  const categoryLabels: Record<string, Messages> = {
    length: { tr: "Uzunluk", en: "Length", de: "Länge", zh: "长度" },
    mass: { tr: "Kütle", en: "Mass", de: "Masse", zh: "质量" },
    temperature: { tr: "Sıcaklık", en: "Temperature", de: "Temperatur", zh: "温度" },
    volume: { tr: "Hacim", en: "Volume", de: "Volumen", zh: "体积" },
    data: { tr: "Veri boyutu", en: "Data size", de: "Datenmenge", zh: "数据容量" },
  };
  function changeCategory(next: string) {
    const keys = Object.keys(units[next]);
    setCategory(next); setFrom(keys[0]); setTo(keys[1] ?? keys[0]);
  }
  const converted = category === "temperature" ? convertTemperature(value, from, to) : value * units[category][from].factor / units[category][to].factor;
  const output = lineText(
    value + " " + units[category][from].label + " = " + Number(converted.toPrecision(12)).toLocaleString(locale === "de" ? "de-DE" : locale === "zh" ? "zh-CN" : locale === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 12 }) + " " + units[category][to].label, "",
    msg(locale, { tr: "Formül", en: "Formula", de: "Formel", zh: "公式" }) + ": " + (category === "temperature" ? msg(locale, { tr: "ofset ve ölçek dönüşümü", en: "offset and scale conversion", de: "Offset- und Skalierungsumrechnung", zh: "偏移与比例换算" }) : "× " + units[category][from].factor + " ÷ " + units[category][to].factor)
  );
  return (
    <Frame locale={locale} onDemo={() => { setCategory("length"); setFrom("km"); setTo("mile"); setValue(5); }} onClear={() => setValue(0)}>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          <label className="field-label"><span>{msg(locale, { tr: "Kategori", en: "Category", de: "Kategorie", zh: "类别" })}</span><select value={category} onChange={(event) => changeCategory(event.target.value)}>{Object.entries(categoryLabels).map(([key, labels]) => <option key={key} value={key}>{labels[locale]}</option>)}</select></label>
          <NumberField label={msg(locale, { tr: "Değer", en: "Value", de: "Wert", zh: "数值" })} value={value} setValue={setValue} min={-1e15} max={1e15} step={0.01} />
          <div className="inline-fields">
            <label className="field-label"><span>{msg(locale, { tr: "Kaynak", en: "From", de: "Von", zh: "源单位" })}</span><select value={from} onChange={(event) => setFrom(event.target.value)}>{Object.entries(units[category]).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></label>
            <label className="field-label"><span>{msg(locale, { tr: "Hedef", en: "To", de: "Nach", zh: "目标单位" })}</span><select value={to} onChange={(event) => setTo(event.target.value)}>{Object.entries(units[category]).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></label>
          </div>
        </div>
        <Output locale={locale} value={output} filename="bytequant-unit-conversion.txt" />
      </div>
    </Frame>
  );
}

function GradeWorkbench({ locale }: { locale: Locale }) {
  const demo = msg(locale, {
    tr: "Ara sınav|78|30\nProje|92|25\nFinal|85|45",
    en: "Midterm|78|30\nProject|92|25\nFinal|85|45",
    de: "Klausur|78|30\nProjekt|92|25\nAbschluss|85|45",
    zh: "期中考试|78|30\n项目|92|25\n期末考试|85|45",
  });
  const [input, setInput] = useState(demo);
  const [target, setTarget] = useState(80);
  const analysis = useMemo(() => {
    const rows = input.split(/\r?\n/).map((line, index) => {
      const [name, scoreText, weightText] = line.split("|");
      return { line: index + 1, name: name?.trim(), score: Number(scoreText), weight: Number(weightText) };
    }).filter((row) => row.name);
    const invalid = rows.filter((row) => !Number.isFinite(row.score) || row.score < 0 || row.score > 100 || !Number.isFinite(row.weight) || row.weight <= 0 || row.weight > 100);
    const valid = rows.filter((row) => !invalid.includes(row));
    const totalWeight = valid.reduce((sum, row) => sum + row.weight, 0);
    const points = valid.reduce((sum, row) => sum + row.score * row.weight / 100, 0);
    const average = totalWeight ? points / totalWeight * 100 : 0;
    const remaining = 100 - totalWeight;
    const needed = remaining > 0 ? (target - points) / remaining * 100 : null;
    return { invalid, totalWeight, average, remaining, needed };
  }, [input, target]);
  const output = lineText(
    msg(locale, { tr: "Ağırlıklı ortalama", en: "Weighted average", de: "Gewichteter Durchschnitt", zh: "加权平均" }) + ": " + analysis.average.toFixed(2) + " / 100",
    msg(locale, { tr: "Toplam ağırlık", en: "Total weight", de: "Gesamtgewicht", zh: "总权重" }) + ": " + analysis.totalWeight.toFixed(2) + "%",
    msg(locale, { tr: "Geçersiz satırlar", en: "Invalid rows", de: "Ungültige Zeilen", zh: "无效行" }) + ": " + (analysis.invalid.length ? analysis.invalid.map((row) => row.line).join(", ") : msg(locale, { tr: "yok", en: "none", de: "keine", zh: "无" })),
    analysis.needed === null ? "" : msg(locale, { tr: "Kalan ağırlıkta hedef için gereken not", en: "Score needed on remaining weight for target", de: "Nötige Note im Restgewicht für das Ziel", zh: "剩余权重达到目标所需分数" }) + ": " + analysis.needed.toFixed(2), "",
    msg(locale, { tr: "Satır biçimi: ad|not|ağırlık. Kurumun resmî yuvarlama ve geçme kuralını ayrıca doğrulayın.", en: "Line format: name|score|weight. Verify the institution's official rounding and pass rules.", de: "Zeilenformat: Name|Note|Gewicht. Prüfen Sie die offiziellen Rundungs- und Bestehensregeln.", zh: "行格式：名称|分数|权重。请另行核验学校的正式舍入与通过规则。" })
  );
  const notice: ToolNoticeData | null = analysis.totalWeight > 100.001
    ? { kind: "error", text: msg(locale, { tr: "Toplam ağırlık %100'ü aşıyor.", en: "Total weight exceeds 100%.", de: "Das Gesamtgewicht überschreitet 100 %.", zh: "总权重超过 100%。" }) }
    : analysis.totalWeight < 99.999
      ? { kind: "info", text: msg(locale, { tr: "Ağırlığın bir kısmı henüz girilmedi.", en: "Part of the weight is not entered yet.", de: "Ein Teil des Gewichts fehlt noch.", zh: "仍有部分权重未输入。" }) }
      : null;
  return (
    <Frame locale={locale} onDemo={() => setInput(demo)} onClear={() => setInput("")}>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          <label className="field-label"><span>{msg(locale, { tr: "Değerlendirmeler — ad|not|ağırlık", en: "Assessments — name|score|weight", de: "Bewertungen — Name|Note|Gewicht", zh: "考核项 — 名称|分数|权重" })}</span><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={11} maxLength={20000} /></label>
          <NumberField label={msg(locale, { tr: "Hedef ortalama", en: "Target average", de: "Zieldurchschnitt", zh: "目标平均分" })} value={target} setValue={setTarget} max={100} step={0.1} />
        </div>
        <Output locale={locale} value={output} filename="bytequant-grade-report.txt" notice={notice} />
      </div>
    </Frame>
  );
}

function GpaWorkbench({ locale }: { locale: Locale }) {
  const scales = { "4.0": 4, "5.0": 5, "10.0": 10, "100": 100 };
  const [from, setFrom] = useState<keyof typeof scales>("100");
  const [to, setTo] = useState<keyof typeof scales>("4.0");
  const [value, setValue] = useState(82);
  const sourceMax = scales[from];
  const targetMax = scales[to];
  const bounded = Math.min(sourceMax, Math.max(0, value));
  const result = bounded / sourceMax * targetMax;
  const output = lineText(
    bounded.toFixed(2) + " / " + sourceMax + " ≈ " + result.toFixed(3) + " / " + targetMax, "",
    msg(locale, { tr: "Yaklaşık formül", en: "Approximation", de: "Näherung", zh: "近似公式" }) + ": (" + bounded + " ÷ " + sourceMax + ") × " + targetMax, "",
    msg(locale, { tr: "Bu doğrusal tahmin resmî denklik değildir. Başvuru kurumunun resmî tablosunu kullanın.", en: "This linear estimate is not an official equivalency. Use the receiving institution's official table.", de: "Diese lineare Schätzung ist keine offizielle Äquivalenz. Verwenden Sie die Tabelle der empfangenden Institution.", zh: "该线性估算不是官方等值。请使用接收院校的正式换算表。" })
  );
  return (
    <Frame locale={locale} onDemo={() => { setFrom("100"); setTo("4.0"); setValue(82); }} onClear={() => setValue(0)}>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          <NumberField label={msg(locale, { tr: "Not", en: "Grade", de: "Note", zh: "成绩" })} value={value} setValue={setValue} max={sourceMax} step={0.01} />
          <div className="inline-fields">
            <label className="field-label"><span>{msg(locale, { tr: "Kaynak ölçek", en: "Source scale", de: "Ausgangsskala", zh: "源量表" })}</span><select value={from} onChange={(event) => setFrom(event.target.value as keyof typeof scales)}>{Object.keys(scales).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="field-label"><span>{msg(locale, { tr: "Hedef ölçek", en: "Target scale", de: "Zielskala", zh: "目标量表" })}</span><select value={to} onChange={(event) => setTo(event.target.value as keyof typeof scales)}>{Object.keys(scales).map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
        </div>
        <Output locale={locale} value={output} filename="bytequant-gpa-estimate.txt" />
      </div>
    </Frame>
  );
}

function CitationWorkbench({ locale }: { locale: Locale }) {
  const [style, setStyle] = useState<"apa" | "mla">("apa");
  const [kind, setKind] = useState<"web" | "article" | "book">("web");
  const [author, setAuthor] = useState("Lovelace, Ada");
  const [title, setTitle] = useState("Notes on analytical engines");
  const [year, setYear] = useState("1843");
  const [container, setContainer] = useState("Scientific Memoirs");
  const [url, setUrl] = useState("https://example.org/source");
  const [doi, setDoi] = useState("");
  const authorParts = author.split(",").map((item) => item.trim());
  const apaAuthor = authorParts.length > 1 ? authorParts[0] + ", " + authorParts[1].split(/\s+/).filter(Boolean).map((item) => item[0] + ".").join(" ") : author;
  const mlaAuthor = authorParts.length > 1 ? authorParts[0] + ", " + authorParts[1] : author;
  const locator = doi.trim() ? "https://doi.org/" + doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "") : url.trim();
  const citation = style === "apa"
    ? (apaAuthor || "Author") + ". (" + (year || "n.d.") + "). " + (title || "Untitled") + "." + (container ? " " + container + "." : "") + (locator ? " " + locator : "")
    : (mlaAuthor || "Author") + ". " + (kind === "book" ? "" : "\"") + (title || "Untitled") + (kind === "book" ? "." : ".\"") + (container ? " " + container + "," : "") + (year ? " " + year + "," : "") + (locator ? " " + locator + "." : "");
  const output = lineText(
    style.toUpperCase() + " " + msg(locale, { tr: "KAYNAKÇA TASLAĞI", en: "REFERENCE DRAFT", de: "LITERATUR-ENTWURF", zh: "参考文献草稿" }), "", citation, "",
    msg(locale, { tr: "Son kontrol: yazar sırası, italik, büyük/küçük harf, DOI/URL ve erişim tarihi kurallarını güncel stil kılavuzundan doğrulayın.", en: "Final check: verify author order, italics, capitalization, DOI/URL, and access-date rules in the current style guide.", de: "Endkontrolle: Autorenreihenfolge, Kursivsetzung, Großschreibung, DOI/URL und Abrufdatum im aktuellen Stilhandbuch prüfen.", zh: "最终核对：请根据最新格式指南检查作者顺序、斜体、大小写、DOI/URL 和访问日期。" })
  );
  return (
    <Frame locale={locale} onDemo={() => { setAuthor("Lovelace, Ada"); setTitle("Notes on analytical engines"); setYear("1843"); setContainer("Scientific Memoirs"); setUrl("https://example.org/source"); }} onClear={() => { setAuthor(""); setTitle(""); setYear(""); setContainer(""); setUrl(""); setDoi(""); }}>
      <div className="workbench-grid">
        <div className="workbench-inputs advanced-form-grid">
          <div className="inline-fields">
            <label className="field-label"><span>{msg(locale, { tr: "Stil", en: "Style", de: "Stil", zh: "格式" })}</span><select value={style} onChange={(event) => setStyle(event.target.value as "apa" | "mla")}><option value="apa">APA 7</option><option value="mla">MLA 9</option></select></label>
            <label className="field-label"><span>{msg(locale, { tr: "Kaynak türü", en: "Source type", de: "Quellentyp", zh: "来源类型" })}</span><select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="web">Web</option><option value="article">Article</option><option value="book">Book</option></select></label>
          </div>
          <label className="field-label"><span>{msg(locale, { tr: "Yazar — Soyad, Ad", en: "Author — Last, First", de: "Autor — Nachname, Vorname", zh: "作者 — 姓, 名" })}</span><input value={author} onChange={(event) => setAuthor(event.target.value)} /></label>
          <label className="field-label"><span>{msg(locale, { tr: "Başlık", en: "Title", de: "Titel", zh: "标题" })}</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <div className="inline-fields"><label className="field-label"><span>{msg(locale, { tr: "Yıl", en: "Year", de: "Jahr", zh: "年份" })}</span><input value={year} onChange={(event) => setYear(event.target.value.replace(/[^0-9]/g, "").slice(0, 4))} /></label><label className="field-label"><span>{msg(locale, { tr: "Yayın / site", en: "Publication / site", de: "Publikation / Website", zh: "出版物 / 网站" })}</span><input value={container} onChange={(event) => setContainer(event.target.value)} /></label></div>
          <label className="field-label"><span>URL</span><input type="url" value={url} onChange={(event) => setUrl(event.target.value)} /></label>
          <label className="field-label"><span>DOI</span><input value={doi} onChange={(event) => setDoi(event.target.value)} /></label>
        </div>
        <Output locale={locale} value={output} filename={"bytequant-" + style + "-citation.txt"} />
      </div>
    </Frame>
  );
}

function InvoiceWorkbench({ locale }: { locale: Locale }) {
  const [seller, setSeller] = useState("ByteQuant Studio");
  const [buyer, setBuyer] = useState("Example Client");
  const [number, setNumber] = useState("INV-2026-001");
  const [date, setDate] = useState("2026-07-16");
  const [currency, setCurrency] = useState("EUR");
  const [tax, setTax] = useState(20);
  const [items, setItems] = useState("Privacy review|2|150\nDocumentation|1|220");
  const parsed = useMemo(() => items.split(/\r?\n/).filter(Boolean).map((line, index) => {
    const [description, quantity, price] = line.split("|");
    return { line: index + 1, description: description?.trim(), quantity: Number(quantity), price: Number(price) };
  }), [items]);
  const valid = parsed.filter((item) => item.description && Number.isFinite(item.quantity) && item.quantity > 0 && Number.isFinite(item.price) && item.price >= 0);
  const subtotal = valid.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = subtotal * tax / 100;
  const format = (value: number) => new Intl.NumberFormat(locale === "de" ? "de-DE" : locale === "zh" ? "zh-CN" : locale === "tr" ? "tr-TR" : "en-US", { style: "currency", currency }).format(value);
  const output = lineText(
    msg(locale, { tr: "FATURA TASLAĞI", en: "INVOICE DRAFT", de: "RECHNUNGSENTWURF", zh: "发票草稿" }),
    msg(locale, { tr: "Numara", en: "Number", de: "Nummer", zh: "编号" }) + ": " + number,
    msg(locale, { tr: "Tarih", en: "Date", de: "Datum", zh: "日期" }) + ": " + date,
    msg(locale, { tr: "Satıcı", en: "Seller", de: "Verkäufer", zh: "销售方" }) + ": " + seller,
    msg(locale, { tr: "Müşteri", en: "Customer", de: "Kunde", zh: "客户" }) + ": " + buyer, "",
    ...valid.map((item) => item.description + " | " + item.quantity + " × " + format(item.price) + " | " + format(item.quantity * item.price)), "",
    msg(locale, { tr: "Ara toplam", en: "Subtotal", de: "Zwischensumme", zh: "小计" }) + ": " + format(subtotal),
    msg(locale, { tr: "Vergi", en: "Tax", de: "Steuer", zh: "税额" }) + " (" + tax + "%): " + format(taxAmount),
    msg(locale, { tr: "Genel toplam", en: "Total", de: "Gesamtsumme", zh: "总计" }) + ": " + format(subtotal + taxAmount), "",
    msg(locale, { tr: "Hukuki not: Bu taslak e-fatura değildir; vergi kimliği, seri, adres, oran, para birimi ve saklama kurallarını ülkenize göre doğrulayın.", en: "Legal note: this draft is not an e-invoice; verify tax IDs, numbering, addresses, rates, currency, and retention rules for your jurisdiction.", de: "Rechtlicher Hinweis: Dies ist keine E-Rechnung. Prüfen Sie Steuer-ID, Nummerierung, Anschrift, Steuersatz, Währung und Aufbewahrungspflichten.", zh: "法律提示：该草稿不是电子发票；请按适用地区核验税号、编号、地址、税率、币种和保存要求。" })
  );
  const notice = parsed.length === valid.length ? null : { kind: "error" as const, text: msg(locale, { tr: "Bazı kalemler geçersiz. Satır biçimi: açıklama|miktar|birim fiyat.", en: "Some items are invalid. Line format: description|quantity|unit price.", de: "Einige Positionen sind ungültig. Format: Beschreibung|Menge|Einzelpreis.", zh: "部分项目无效。行格式：说明|数量|单价。" }) };
  return (
    <Frame locale={locale} onDemo={() => { setSeller("ByteQuant Studio"); setBuyer("Example Client"); setItems("Privacy review|2|150\nDocumentation|1|220"); }} onClear={() => { setSeller(""); setBuyer(""); setItems(""); }}>
      <div className="workbench-grid">
        <div className="workbench-inputs advanced-form-grid">
          <div className="inline-fields"><label className="field-label"><span>{msg(locale, { tr: "Satıcı", en: "Seller", de: "Verkäufer", zh: "销售方" })}</span><input value={seller} onChange={(event) => setSeller(event.target.value)} /></label><label className="field-label"><span>{msg(locale, { tr: "Müşteri", en: "Customer", de: "Kunde", zh: "客户" })}</span><input value={buyer} onChange={(event) => setBuyer(event.target.value)} /></label></div>
          <div className="inline-fields"><label className="field-label"><span>{msg(locale, { tr: "Fatura no", en: "Invoice no.", de: "Rechnungsnr.", zh: "发票编号" })}</span><input value={number} onChange={(event) => setNumber(event.target.value)} /></label><label className="field-label"><span>{msg(locale, { tr: "Tarih", en: "Date", de: "Datum", zh: "日期" })}</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div>
          <div className="inline-fields"><label className="field-label"><span>{msg(locale, { tr: "Para birimi", en: "Currency", de: "Währung", zh: "币种" })}</span><select value={currency} onChange={(event) => setCurrency(event.target.value)}>{["TRY", "USD", "EUR", "CNY", "GBP"].map((item) => <option key={item}>{item}</option>)}</select></label><NumberField label={msg(locale, { tr: "Vergi (%)", en: "Tax (%)", de: "Steuer (%)", zh: "税率（%）" })} value={tax} setValue={setTax} max={100} step={0.1} /></div>
          <label className="field-label"><span>{msg(locale, { tr: "Kalemler — açıklama|miktar|birim fiyat", en: "Items — description|quantity|unit price", de: "Positionen — Beschreibung|Menge|Einzelpreis", zh: "项目 — 说明|数量|单价" })}</span><textarea value={items} onChange={(event) => setItems(event.target.value)} rows={8} /></label>
        </div>
        <Output locale={locale} value={output} filename="bytequant-invoice-draft.txt" notice={notice} />
      </div>
    </Frame>
  );
}

function ContractWorkbench({ locale }: { locale: Locale }) {
  const [provider, setProvider] = useState("Provider Ltd.");
  const [client, setClient] = useState("Client GmbH");
  const [scope, setScope] = useState(msg(locale, { tr: "Tarayıcı içi veri işleme arayüzü tasarımı ve dokümantasyonu.", en: "Design and documentation of an in-browser data-processing interface.", de: "Entwurf und Dokumentation einer browserbasierten Datenverarbeitung.", zh: "浏览器内数据处理界面的设计与文档。" }));
  const [fee, setFee] = useState("EUR 2,500");
  const [term, setTerm] = useState("30 days");
  const [termination, setTermination] = useState("7 days written notice");
  const [law, setLaw] = useState("");
  const output = lineText(
    msg(locale, { tr: "BASİT HİZMET SÖZLEŞMESİ TASLAĞI", en: "SIMPLE SERVICES AGREEMENT DRAFT", de: "ENTWURF EINES EINFACHEN DIENSTLEISTUNGSVERTRAGS", zh: "简易服务合同草稿" }), "",
    "1. " + msg(locale, { tr: "TARAFLAR", en: "PARTIES", de: "PARTEIEN", zh: "双方" }),
    msg(locale, { tr: "Hizmet sağlayıcı", en: "Provider", de: "Auftragnehmer", zh: "服务方" }) + ": " + provider,
    msg(locale, { tr: "Müşteri", en: "Client", de: "Auftraggeber", zh: "客户方" }) + ": " + client, "",
    "2. " + msg(locale, { tr: "KAPSAM VE TESLİMAT", en: "SCOPE AND DELIVERABLES", de: "LEISTUNGSUMFANG", zh: "服务范围与交付" }), scope, "",
    "3. " + msg(locale, { tr: "BEDEL VE ÖDEME", en: "FEES AND PAYMENT", de: "VERGÜTUNG UND ZAHLUNG", zh: "费用与支付" }), fee, "",
    "4. " + msg(locale, { tr: "SÜRE", en: "TERM", de: "LAUFZEIT", zh: "期限" }), term, "",
    "5. " + msg(locale, { tr: "FESİH", en: "TERMINATION", de: "KÜNDIGUNG", zh: "终止" }), termination, "",
    "6. " + msg(locale, { tr: "UYGULANACAK HUKUK / YETKİ", en: "GOVERNING LAW / VENUE", de: "ANWENDBARES RECHT / GERICHTSSTAND", zh: "适用法律 / 管辖" }), law || msg(locale, { tr: "Taraflar ve hukuk uzmanı tarafından doldurulmalıdır.", en: "To be completed by the parties with qualified legal advice.", de: "Von den Parteien mit qualifizierter Rechtsberatung auszufüllen.", zh: "应由双方在专业法律建议下填写。" }), "",
    "7. " + msg(locale, { tr: "İMZALAR", en: "SIGNATURES", de: "UNTERSCHRIFTEN", zh: "签署" }),
    provider + ": ____________________    " + client + ": ____________________", "",
    msg(locale, { tr: "ÖNEMLİ: Bu otomatik metin hukuk tavsiyesi değildir ve ülkeye özgü zorunlu hükümleri kapsamayabilir. İmzadan önce yetkin hukuk uzmanına inceletin.", en: "IMPORTANT: this automated text is not legal advice and may omit jurisdiction-specific mandatory terms. Obtain qualified legal review before signing.", de: "WICHTIG: Dieser automatisch erzeugte Text ist keine Rechtsberatung und kann zwingendes Landesrecht auslassen. Lassen Sie ihn vor Unterzeichnung fachlich prüfen.", zh: "重要：此自动生成文本不是法律意见，可能遗漏特定司法辖区的强制条款。签署前请由专业律师审阅。" })
  );
  return (
    <Frame locale={locale} onDemo={() => { setProvider("Provider Ltd."); setClient("Client GmbH"); }} onClear={() => { setProvider(""); setClient(""); setScope(""); setFee(""); setTerm(""); setTermination(""); setLaw(""); }}>
      <div className="workbench-grid">
        <div className="workbench-inputs advanced-form-grid">
          <div className="inline-fields"><label className="field-label"><span>{msg(locale, { tr: "Hizmet sağlayıcı", en: "Provider", de: "Auftragnehmer", zh: "服务方" })}</span><input value={provider} onChange={(event) => setProvider(event.target.value)} /></label><label className="field-label"><span>{msg(locale, { tr: "Müşteri", en: "Client", de: "Auftraggeber", zh: "客户方" })}</span><input value={client} onChange={(event) => setClient(event.target.value)} /></label></div>
          <label className="field-label"><span>{msg(locale, { tr: "Kapsam ve teslimat", en: "Scope and deliverables", de: "Leistungsumfang", zh: "服务范围与交付" })}</span><textarea value={scope} onChange={(event) => setScope(event.target.value)} rows={5} /></label>
          <div className="inline-fields"><label className="field-label"><span>{msg(locale, { tr: "Bedel", en: "Fee", de: "Vergütung", zh: "费用" })}</span><input value={fee} onChange={(event) => setFee(event.target.value)} /></label><label className="field-label"><span>{msg(locale, { tr: "Süre", en: "Term", de: "Laufzeit", zh: "期限" })}</span><input value={term} onChange={(event) => setTerm(event.target.value)} /></label></div>
          <label className="field-label"><span>{msg(locale, { tr: "Fesih", en: "Termination", de: "Kündigung", zh: "终止" })}</span><input value={termination} onChange={(event) => setTermination(event.target.value)} /></label>
          <label className="field-label"><span>{msg(locale, { tr: "Uygulanacak hukuk / yetki", en: "Governing law / venue", de: "Anwendbares Recht / Gerichtsstand", zh: "适用法律 / 管辖" })}</span><input value={law} onChange={(event) => setLaw(event.target.value)} /></label>
        </div>
        <Output locale={locale} value={output} filename="bytequant-contract-draft.txt" />
      </div>
    </Frame>
  );
}

const certaintyPatterns: Record<Locale, RegExp> = {
  tr: /\b(her zaman|asla|kesinlikle|garanti(?:li|dir)?|imkânsız|risksiz|yüzde yüz)\b/giu,
  en: /\b(always|never|definitely|guaranteed?|impossible|risk[- ]free|100%)\b/giu,
  de: /\b(immer|niemals|definitiv|garantiert|unmöglich|risikofrei|hundertprozentig)\b/giu,
  zh: /(永远|从不|绝对|肯定|保证|不可能|零风险|百分之百)/gu,
};

function CertaintyWorkbench({ locale }: { locale: Locale }) {
  const demo = msg(locale, {
    tr: "Bu yöntem her zaman doğru sonuç verir ve tamamen risksizdir.",
    en: "This method always produces a correct result and is completely risk-free.",
    de: "Diese Methode liefert immer richtige Ergebnisse und ist völlig risikofrei.",
    zh: "这种方法永远正确，而且完全零风险。",
  });
  const [input, setInput] = useState(demo);
  const findings = useMemo(() => {
    const result: { line: number; match: string }[] = [];
    input.split(/\r?\n/).forEach((line, index) => {
      const configured = certaintyPatterns[locale];
      const pattern = new RegExp(configured.source, configured.flags);
      for (const match of line.matchAll(pattern)) result.push({ line: index + 1, match: match[0] });
    });
    return result;
  }, [input, locale]);
  const output = lineText(
    msg(locale, { tr: "AŞIRI KESİNLİK ÖN KONTROLÜ", en: "OVERCONFIDENCE PRE-CHECK", de: "ÜBERGEWISSHEITS-VORPRÜFUNG", zh: "过度确定性预检查" }), "",
    ...(findings.length
      ? findings.map((item, index) => (index + 1) + ". " + msg(locale, { tr: "Satır", en: "Line", de: "Zeile", zh: "行" }) + " " + item.line + ": “" + item.match + "” → " + msg(locale, { tr: "kanıt ve koşula bağlı daha ölçülü bir ifade düşünün", en: "consider a calibrated claim tied to evidence and conditions", de: "eine an Belege und Bedingungen geknüpfte Aussage erwägen", zh: "建议改为结合证据和条件的审慎表述" }))
      : [msg(locale, { tr: "Kural kümesinde eşleşme bulunmadı.", en: "No rule match was found.", de: "Keine Regelübereinstimmung gefunden.", zh: "规则集中未发现匹配。" })]), "",
    msg(locale, { tr: "Sınır: Araç bağlamı, gerçekliği veya hukuki anlamı doğrulamaz. İnsan editör her işareti kanıt düzeyiyle değerlendirmelidir.", en: "Limit: the tool does not verify context, truth, or legal meaning. A human editor must assess every flag against the evidence.", de: "Grenze: Das Werkzeug prüft weder Kontext noch Wahrheit oder rechtliche Bedeutung. Jeder Hinweis muss anhand der Belege bewertet werden.", zh: "限制：工具不验证语境、事实或法律含义。人工编辑必须结合证据评估每个标记。" })
  );
  return (
    <Frame locale={locale} onDemo={() => setInput(demo)} onClear={() => setInput("")}>
      <div className="workbench-grid">
        <div className="workbench-inputs"><label className="field-label"><span>{msg(locale, { tr: "İncelenecek metin", en: "Text to review", de: "Zu prüfender Text", zh: "待检查文本" })}</span><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={15} maxLength={100000} /></label></div>
        <Output locale={locale} value={output} filename="bytequant-certainty-report.txt" extra={<div className="metric-strip"><div><strong>{findings.length}</strong><span>{msg(locale, { tr: "İşaret", en: "Flags", de: "Hinweise", zh: "标记" })}</span></div></div>} />
      </div>
    </Frame>
  );
}

type ChatMessage = { role: string; content: string };
function parseConversation(input: string): ChatMessage[] {
  if (!input.trim()) return [];
  if (input.trimStart().startsWith("[")) {
    const parsed: unknown = JSON.parse(input);
    if (!Array.isArray(parsed)) throw new Error("array");
    return parsed.map((item) => {
      if (!item || typeof item !== "object") throw new Error("shape");
      const value = item as Record<string, unknown>;
      if (typeof value.role !== "string" || typeof value.content !== "string") throw new Error("shape");
      return { role: value.role, content: value.content };
    });
  }
  const messages: ChatMessage[] = [];
  let current: ChatMessage | null = null;
  for (const line of input.split(/\r?\n/)) {
    const match = line.match(/^([\p{L}_-]{2,30})\s*[:：]\s*(.*)$/u);
    if (match) { current = { role: match[1].toLowerCase(), content: match[2] }; messages.push(current); }
    else if (current) current.content += "\n" + line;
    else if (line.trim()) { current = { role: "unknown", content: line }; messages.push(current); }
  }
  return messages;
}
function ConversationWorkbench({ locale }: { locale: Locale }) {
  const demo = msg(locale, {
    tr: "Kullanıcı: JSON verimi nasıl doğrularım?\nAsistan: Veriyi JSON.parse ile yerel olarak ayrıştırabilir ve hatayı kullanıcıya gösterebilirsiniz.",
    en: "User: How can I validate JSON?\nAssistant: Parse it locally with JSON.parse and surface any error to the user.",
    de: "Nutzer: Wie validiere ich JSON?\nAssistent: Parsen Sie es lokal mit JSON.parse und zeigen Sie Fehler verständlich an.",
    zh: "用户：如何验证 JSON？\n助手：可使用 JSON.parse 在本地解析，并向用户显示错误。",
  });
  const [input, setInput] = useState(demo);
  const [format, setFormat] = useState<"markdown" | "jsonl" | "text">("markdown");
  let messages: ChatMessage[] = [];
  let error = "";
  try { messages = parseConversation(input); } catch { error = msg(locale, { tr: "JSON konuşma dizisi role ve content metin alanları içermelidir.", en: "A JSON conversation array must contain string role and content fields.", de: "Ein JSON-Gespräch muss Textfelder role und content enthalten.", zh: "JSON 对话数组必须包含字符串 role 和 content 字段。" }); }
  const output = error ? "" : format === "jsonl"
    ? messages.map((item) => JSON.stringify(item)).join("\n")
    : format === "text"
      ? messages.map((item) => item.role.toUpperCase() + ": " + item.content).join("\n\n")
      : messages.map((item) => "### " + item.role + "\n\n" + item.content).join("\n\n---\n\n");
  return (
    <Frame locale={locale} onDemo={() => setInput(demo)} onClear={() => setInput("")}>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          <label className="field-label"><span>{msg(locale, { tr: "Konuşma — Rol: içerik veya JSON mesaj dizisi", en: "Conversation — Role: content or JSON message array", de: "Gespräch — Rolle: Inhalt oder JSON-Nachrichten", zh: "对话 — 角色：内容或 JSON 消息数组" })}</span><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={15} maxLength={500000} /></label>
          <label className="field-label"><span>{msg(locale, { tr: "Çıktı biçimi", en: "Output format", de: "Ausgabeformat", zh: "输出格式" })}</span><select value={format} onChange={(event) => setFormat(event.target.value as typeof format)}><option value="markdown">Markdown</option><option value="jsonl">JSONL</option><option value="text">Text</option></select></label>
          <p className="privacy-hint">{msg(locale, { tr: "Paylaşmadan önce kişisel veri, sır ve üçüncü taraf içerik haklarını kontrol edin.", en: "Review personal data, secrets, and third-party content rights before sharing.", de: "Prüfen Sie vor dem Teilen personenbezogene Daten, Geheimnisse und Inhaltsrechte.", zh: "分享前请检查个人数据、密钥和第三方内容权利。" })}</p>
        </div>
        <Output locale={locale} value={output} filename={"bytequant-conversation." + (format === "markdown" ? "md" : format)} notice={error ? { kind: "error", text: error } : null} extra={<div className="metric-strip"><div><strong>{messages.length}</strong><span>{msg(locale, { tr: "Mesaj", en: "Messages", de: "Nachrichten", zh: "消息" })}</span></div><div><strong>{new Set(messages.map((item) => item.role)).size}</strong><span>{msg(locale, { tr: "Rol", en: "Roles", de: "Rollen", zh: "角色" })}</span></div></div>} />
      </div>
    </Frame>
  );
}

function BudgetWorkbench({ locale }: { locale: Locale }) {
  const [limit, setLimit] = useState(128000);
  const [system, setSystem] = useState(3000);
  const [history, setHistory] = useState(24000);
  const [sources, setSources] = useState(50000);
  const [input, setInput] = useState(4000);
  const [outputTokens, setOutputTokens] = useState(8000);
  const [reservePercent, setReservePercent] = useState(10);
  const reserve = Math.ceil(limit * reservePercent / 100);
  const used = system + history + sources + input + outputTokens + reserve;
  const remaining = limit - used;
  const status = remaining >= 0 ? msg(locale, { tr: "Bütçe içinde", en: "Within budget", de: "Im Budget", zh: "预算内" }) : msg(locale, { tr: "Bütçe aşıldı", en: "Over budget", de: "Budget überschritten", zh: "超出预算" });
  const output = lineText(
    msg(locale, { tr: "BAĞLAM BÜTÇESİ", en: "CONTEXT BUDGET", de: "KONTEXTBUDGET", zh: "上下文预算" }), "",
    msg(locale, { tr: "Sınır", en: "Limit", de: "Grenze", zh: "上限" }) + ": " + limit.toLocaleString(),
    msg(locale, { tr: "Sistem", en: "System", de: "System", zh: "系统" }) + ": " + system.toLocaleString(),
    msg(locale, { tr: "Geçmiş", en: "History", de: "Verlauf", zh: "历史" }) + ": " + history.toLocaleString(),
    msg(locale, { tr: "Kaynaklar", en: "Sources", de: "Quellen", zh: "来源" }) + ": " + sources.toLocaleString(),
    msg(locale, { tr: "Kullanıcı girdisi", en: "User input", de: "Nutzereingabe", zh: "用户输入" }) + ": " + input.toLocaleString(),
    msg(locale, { tr: "Çıktı payı", en: "Output allocation", de: "Ausgabeanteil", zh: "输出额度" }) + ": " + outputTokens.toLocaleString(),
    msg(locale, { tr: "Güvenlik rezervi", en: "Safety reserve", de: "Sicherheitsreserve", zh: "安全余量" }) + ": " + reserve.toLocaleString() + " (" + reservePercent + "%)", "",
    msg(locale, { tr: "Durum", en: "Status", de: "Status", zh: "状态" }) + ": " + status,
    msg(locale, { tr: "Kalan", en: "Remaining", de: "Verbleibend", zh: "剩余" }) + ": " + remaining.toLocaleString(), "",
    msg(locale, { tr: "Gerçek tokenizer, sağlayıcı sistem ekleri ve araç çağrıları ek token kullanabilir.", en: "The actual tokenizer, provider system additions, and tool calls can consume more tokens.", de: "Tokenizer, Systemzusätze des Anbieters und Tool-Aufrufe können weitere Token verbrauchen.", zh: "实际分词器、服务商系统附加内容和工具调用可能消耗更多 Token。" })
  );
  return (
    <Frame locale={locale} onDemo={() => { setLimit(128000); setSystem(3000); setHistory(24000); setSources(50000); setInput(4000); setOutputTokens(8000); setReservePercent(10); }} onClear={() => { setSystem(0); setHistory(0); setSources(0); setInput(0); setOutputTokens(0); }}>
      <div className="workbench-grid">
        <div className="workbench-inputs advanced-form-grid">
          <NumberField label={msg(locale, { tr: "Bağlam sınırı", en: "Context limit", de: "Kontextgrenze", zh: "上下文上限" })} value={limit} setValue={setLimit} />
          <NumberField label={msg(locale, { tr: "Sistem promptu", en: "System prompt", de: "System-Prompt", zh: "系统提示词" })} value={system} setValue={setSystem} />
          <NumberField label={msg(locale, { tr: "Konuşma geçmişi", en: "Conversation history", de: "Gesprächsverlauf", zh: "对话历史" })} value={history} setValue={setHistory} />
          <NumberField label={msg(locale, { tr: "Kaynak / RAG", en: "Sources / RAG", de: "Quellen / RAG", zh: "来源 / RAG" })} value={sources} setValue={setSources} />
          <NumberField label={msg(locale, { tr: "Kullanıcı girdisi", en: "User input", de: "Nutzereingabe", zh: "用户输入" })} value={input} setValue={setInput} />
          <NumberField label={msg(locale, { tr: "Çıktı payı", en: "Output allocation", de: "Ausgabeanteil", zh: "输出额度" })} value={outputTokens} setValue={setOutputTokens} />
          <NumberField label={msg(locale, { tr: "Rezerv (%)", en: "Reserve (%)", de: "Reserve (%)", zh: "余量（%）" })} value={reservePercent} setValue={setReservePercent} max={50} />
        </div>
        <Output locale={locale} value={output} filename="bytequant-context-budget.txt" notice={{ kind: remaining < 0 ? "error" : "success", text: status }} extra={<div className="budget-meter"><i style={{ width: Math.min(100, used / Math.max(1, limit) * 100) + "%" }} /></div>} />
      </div>
    </Frame>
  );
}

function promptAnalysis(input: string, locale: Locale) {
  const checks: [string, RegExp][] = [
    [msg(locale, { tr: "Amaç / görev", en: "Purpose / task", de: "Zweck / Aufgabe", zh: "目的 / 任务" }), /\b(goal|objective|task|must|amaç|görev|hedef|ziel|aufgabe|目标|任务|必须)\b/iu],
    [msg(locale, { tr: "Rol ve yetki", en: "Role and authority", de: "Rolle und Befugnis", zh: "角色与权限" }), /\b(role|you are|act as|rol|sen bir|rolle|du bist|角色|你是)\b/iu],
    [msg(locale, { tr: "Sınırlar / yasaklar", en: "Boundaries / prohibitions", de: "Grenzen / Verbote", zh: "边界 / 禁止" }), /\b(do not|never|must not|yapma|asla|verme|nicht|niemals|不得|不要|禁止)\b/iu],
    [msg(locale, { tr: "Çıktı biçimi", en: "Output format", de: "Ausgabeformat", zh: "输出格式" }), /\b(output|format|json|table|list|çıktı|biçim|liste|ausgabe|格式|输出|列表)\b/iu],
    [msg(locale, { tr: "Belirsizlik davranışı", en: "Uncertainty behavior", de: "Umgang mit Unsicherheit", zh: "不确定性处理" }), /\b(uncertain|unknown|insufficient|belirsiz|bilinm|yetersiz|unsicher|unbekannt|不确定|未知|信息不足)\b/iu],
    [msg(locale, { tr: "Talimat önceliği", en: "Instruction priority", de: "Anweisungspriorität", zh: "指令优先级" }), /\b(priority|conflict|higher-priority|öncelik|çeliş|priorität|konflikt|优先级|冲突)\b/iu],
    [msg(locale, { tr: "Hassas veri sınırı", en: "Sensitive-data boundary", de: "Grenze für sensible Daten", zh: "敏感数据边界" }), /\b(sensitive|personal data|secret|hassas|kişisel veri|sır|sensib|personenbezogen|geheim|敏感|个人数据|密钥)\b/iu],
  ];
  const results = checks.map(([label, pattern]) => ({ label, ok: pattern.test(input) }));
  return { results, score: Math.round(results.filter((item) => item.ok).length / results.length * 100) };
}
function ClarityWorkbench({ locale }: { locale: Locale }) {
  const demo = msg(locale, {
    tr: "Rol: Teknik eğitim uzmanı. Amaç: yeni kullanıcının JSON hatasını anlamasına yardım et. Yalnızca verilen veriyi kullan; kişisel veriyi tekrar etme. Bilgi yetersizse bunu söyle. Talimatlar çelişirse daha yüksek öncelikli güvenlik sınırını uygula. Çıktı: kısa özet ve madde listesi.",
    en: "Role: technical educator. Goal: help a beginner understand a JSON error. Use only supplied data; do not repeat personal data. Say when information is insufficient. If instructions conflict, follow the higher-priority safety boundary. Output: a short summary and bullet list.",
    de: "Rolle: Technischer Trainer. Ziel: Einem Anfänger einen JSON-Fehler erklären. Nur bereitgestellte Daten nutzen; personenbezogene Daten nicht wiederholen. Unzureichende Informationen benennen. Bei Konflikten gilt die höher priorisierte Sicherheitsgrenze. Ausgabe: kurze Zusammenfassung und Liste.",
    zh: "角色：技术教育者。目标：帮助初学者理解 JSON 错误。只使用提供的数据，不重复个人数据。信息不足时明确说明。指令冲突时遵循更高优先级的安全边界。输出：简短摘要和列表。",
  });
  const [input, setInput] = useState(demo);
  const analysis = useMemo(() => promptAnalysis(input, locale), [input, locale]);
  const output = lineText(
    msg(locale, { tr: "SİSTEM PROMPTU NETLİK RAPORU", en: "SYSTEM PROMPT CLARITY REPORT", de: "SYSTEM-PROMPT-KLARHEITSBERICHT", zh: "系统提示词清晰度报告" }), "",
    ...analysis.results.map((item) => (item.ok ? "✓ " : "○ ") + item.label + (item.ok ? "" : " — " + msg(locale, { tr: "eksik olabilir", en: "may be missing", de: "möglicherweise nicht definiert", zh: "可能缺失" }))), "",
    msg(locale, { tr: "Skor güvenli veya doğru model davranışı garantisi değildir. Gerçek model ve saldırgan girdi testleri ayrıca yapılmalıdır.", en: "The score does not guarantee safe or correct model behavior. Test the actual model and adversarial inputs separately.", de: "Der Wert garantiert kein sicheres oder korrektes Modellverhalten. Testen Sie Modell und adversariale Eingaben separat.", zh: "评分不保证模型安全或正确。仍需单独测试实际模型和对抗性输入。" })
  );
  return (
    <Frame locale={locale} onDemo={() => setInput(demo)} onClear={() => setInput("")}>
      <div className="workbench-grid">
        <div className="workbench-inputs"><label className="field-label"><span>{msg(locale, { tr: "Sistem promptu", en: "System prompt", de: "System-Prompt", zh: "系统提示词" })}</span><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={17} maxLength={100000} /></label></div>
        <Output locale={locale} value={output} filename="bytequant-system-prompt-report.txt" extra={<div className="metric-strip"><div><strong>{analysis.score}/100</strong><span>{msg(locale, { tr: "Netlik kapsamı", en: "Clarity coverage", de: "Klarheitsabdeckung", zh: "清晰度覆盖" })}</span></div></div>} />
      </div>
    </Frame>
  );
}

function PersonaWorkbench({ locale }: { locale: Locale }) {
  const personaDemo = msg(locale, {
    tr: "Sakin ve açık bir ürün eğitim uzmanı gibi davran. Bilmediğin şeyi uydurma. Hukuki veya güvenlik garantisi verme.",
    en: "Act as a calm, clear product educator. Do not invent unknown facts or give legal or security guarantees.",
    de: "Handle als ruhiger, klarer Produkttrainer. Erfinde keine unbekannten Fakten und gib keine Rechts- oder Sicherheitsgarantien.",
    zh: "扮演冷静、清晰的产品教育者。不要编造未知事实，也不要作法律或安全保证。",
  });
  const responseDemo = msg(locale, {
    tr: "Bu yöntem kesinlikle risksizdir. Ben hukuk danışmanınız olarak uyumluluğu garanti ediyorum.",
    en: "This method is completely risk-free. As your legal advisor, I guarantee compliance.",
    de: "Diese Methode ist völlig risikofrei. Als Ihr Rechtsberater garantiere ich die Konformität.",
    zh: "这种方法完全零风险。作为您的法律顾问，我保证合规。",
  });
  const [persona, setPersona] = useState(personaDemo);
  const [response, setResponse] = useState(responseDemo);
  const signals: { label: string; personaRule: RegExp; responseRule: RegExp }[] = [
    { label: msg(locale, { tr: "Garanti / mutlak kesinlik", en: "Guarantee / absolute certainty", de: "Garantie / absolute Gewissheit", zh: "保证 / 绝对确定" }), personaRule: /garanti|guarantee|garant|保证|kesin|absolute/iu, responseRule: /garanti|guarantee|garant|保证|always|her koşulda|immer|永远|risk[- ]free|risksiz|risikofrei|零风险/iu },
    { label: msg(locale, { tr: "Yetkisiz uzman rolü", en: "Unauthorized expert role", de: "Nicht autorisierte Expertenrolle", zh: "未经授权的专家角色" }), personaRule: /hukuk|legal|rechts|法律|tıbbi|medical|medizin|医疗/iu, responseRule: /advisor|danışman|berater|顾问|doctor|doktor|arzt|医生/iu },
  ];
  const findings = signals.filter((item) => item.personaRule.test(persona) && item.responseRule.test(response));
  const output = lineText(
    msg(locale, { tr: "ROL / PERSONA TUTARLILIK RAPORU", en: "ROLE / PERSONA CONSISTENCY REPORT", de: "ROLLEN-/PERSONA-KONSISTENZBERICHT", zh: "角色 / PERSONA 一致性报告" }), "",
    ...(findings.length ? findings.map((item) => "⚠ " + item.label) : [msg(locale, { tr: "Tanımlı heuristiklerde açık çelişki bulunmadı.", en: "No direct conflict was found by the configured heuristics.", de: "Die konfigurierten Heuristiken fanden keinen direkten Konflikt.", zh: "配置的启发式规则未发现直接冲突。" })]), "",
    msg(locale, { tr: "Bu karşılaştırma sözcük sinyallerine dayanır; anlam, jailbreak dayanıklılığı veya uzun konuşma tutarlılığı ölçmez. Gerçek cevapları insan ve red-team testleriyle doğrulayın.", en: "This comparison relies on lexical signals; it does not measure semantics, jailbreak resistance, or long-conversation consistency. Verify real responses with human and red-team testing.", de: "Der Vergleich beruht auf Wortsignalen und misst weder Semantik noch Jailbreak-Resistenz oder Langzeitkonsistenz. Reale Antworten müssen menschlich und im Red-Team geprüft werden.", zh: "该比较基于词语信号，不衡量语义、越狱抵抗或长对话一致性。请通过人工和红队测试核验真实回答。" })
  );
  return (
    <Frame locale={locale} onDemo={() => { setPersona(personaDemo); setResponse(responseDemo); }} onClear={() => { setPersona(""); setResponse(""); }}>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          <label className="field-label"><span>{msg(locale, { tr: "Persona / rol kuralları", en: "Persona / role rules", de: "Persona-/Rollenregeln", zh: "Persona / 角色规则" })}</span><textarea value={persona} onChange={(event) => setPersona(event.target.value)} rows={8} maxLength={50000} /></label>
          <label className="field-label"><span>{msg(locale, { tr: "Örnek yanıtlar", en: "Sample responses", de: "Beispielantworten", zh: "示例回答" })}</span><textarea value={response} onChange={(event) => setResponse(event.target.value)} rows={8} maxLength={100000} /></label>
        </div>
        <Output locale={locale} value={output} filename="bytequant-persona-consistency.txt" extra={<div className="metric-strip"><div><strong>{findings.length}</strong><span>{msg(locale, { tr: "Olası çelişki", en: "Possible conflicts", de: "Mögliche Konflikte", zh: "可能冲突" })}</span></div></div>} />
      </div>
    </Frame>
  );
}

function bytesToHex(bytes: Uint8Array, length = 16) {
  return [...bytes.slice(0, length)].map((value) => value.toString(16).padStart(2, "0")).join(" ");
}
function sampleEntropy(bytes: Uint8Array) {
  if (!bytes.length) return 0;
  const counts = new Uint32Array(256);
  bytes.forEach((value) => { counts[value] += 1; });
  return [...counts].reduce((entropy, count) => count ? entropy - count / bytes.length * Math.log2(count / bytes.length) : entropy, 0);
}
function detectedMagic(bytes: Uint8Array) {
  const hex = bytesToHex(bytes, 8).replace(/ /g, "");
  if (hex.startsWith("4d5a")) return { type: "Windows executable", extensions: ["exe", "dll", "scr", "com"] };
  if (hex.startsWith("504b0304")) return { type: "ZIP / Office Open XML", extensions: ["zip", "docx", "xlsx", "pptx", "jar", "apk"] };
  if (hex.startsWith("25504446")) return { type: "PDF", extensions: ["pdf"] };
  if (hex.startsWith("89504e470d0a1a0a")) return { type: "PNG", extensions: ["png"] };
  if (hex.startsWith("ffd8ff")) return { type: "JPEG", extensions: ["jpg", "jpeg"] };
  if (hex.startsWith("7f454c46")) return { type: "ELF executable", extensions: ["elf", "bin", "so"] };
  if (hex.startsWith("2321")) return { type: "Script with shebang", extensions: ["sh", "py", "pl", "rb"] };
  return { type: "Unknown / text", extensions: [] as string[] };
}
function FileRiskWorkbench({ locale }: { locale: Locale }) {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const [busy, setBusy] = useState(false);
  async function scan(next: File) {
    setBusy(true); setOutput(""); setNotice(null); setFile(next);
    try {
      if (next.size > 100 * 1024 * 1024) throw new Error(msg(locale, { tr: "Dosya 100 MB yerel tarama sınırını aşıyor.", en: "The file exceeds the 100 MB local scan limit.", de: "Die Datei überschreitet das lokale Limit von 100 MB.", zh: "文件超过 100 MB 本地扫描上限。" }));
      const sampleLimit = 1024 * 1024;
      const first = new Uint8Array(await next.slice(0, sampleLimit).arrayBuffer());
      const tail = next.size > sampleLimit ? new Uint8Array(await next.slice(Math.max(sampleLimit, next.size - sampleLimit), next.size).arrayBuffer()) : new Uint8Array();
      const combined = new Uint8Array(first.length + tail.length);
      combined.set(first); combined.set(tail, first.length);
      const magic = detectedMagic(first);
      const parts = next.name.toLowerCase().split(".");
      const extension = parts.length > 1 ? parts.at(-1)! : "";
      const findings: Finding[] = [];
      if (parts.length >= 3 && ["exe", "scr", "com", "bat", "cmd", "js", "vbs", "ps1", "jar"].includes(extension)) findings.push({ severity: "HIGH", label: msg(locale, { tr: "Çift uzantılı çalıştırılabilir/betik dosya adı", en: "Double-extension executable/script filename", de: "Doppelte Endung bei ausführbarer/Skriptdatei", zh: "双扩展名的可执行/脚本文件" }) });
      if (magic.extensions.length && extension && !magic.extensions.includes(extension)) findings.push({ severity: "HIGH", label: msg(locale, { tr: "Uzantı ile dosya imzası uyuşmuyor", en: "Extension and file signature do not match", de: "Endung und Dateisignatur stimmen nicht überein", zh: "扩展名与文件签名不匹配" }) + ": ." + extension + " ↔ " + magic.type });
      if (["docm", "xlsm", "pptm", "xlam"].includes(extension)) findings.push({ severity: "HIGH", label: msg(locale, { tr: "Makro etkin Office uzantısı", en: "Macro-enabled Office extension", de: "Makrofähige Office-Endung", zh: "启用宏的 Office 扩展名" }) });
      if (["exe", "dll", "scr", "com", "msi", "bat", "cmd", "ps1", "vbs", "js", "jar", "apk"].includes(extension)) findings.push({ severity: "MEDIUM", label: msg(locale, { tr: "Dosya türü çalıştırılabilir kod içerebilir", en: "File type may contain executable code", de: "Dateityp kann ausführbaren Code enthalten", zh: "文件类型可能包含可执行代码" }) });
      const textSample = new TextDecoder("utf-8", { fatal: false }).decode(combined);
      const patterns: [RegExp, string][] = [
        [/powershell(?:\.exe)?\s+(?:-[a-z]+\s+)*-(?:enc|encodedcommand)\b/i, "Encoded PowerShell"],
        [/WScript\.Shell|CreateObject\s*\(/i, "Windows Script Host"],
        [/Auto(?:Open|_Open)|Document_Open/i, "Office auto-open macro"],
        [/<script\b|javascript:/i, "Embedded script"],
        [/cmd\.exe\s*\/c|\/bin\/(?:sh|bash)\s+-c/i, "Shell command"],
        [/eval\s*\(|new\s+Function\s*\(/i, "Dynamic code execution"],
        [/(?:FromBase64String|base64_decode|atob)\s*\(/i, "Base64 decode behavior"],
      ];
      patterns.forEach(([pattern, label]) => { if (pattern.test(textSample)) findings.push({ severity: "HIGH", label }); });
      const entropy = sampleEntropy(combined);
      if (entropy > 7.7) findings.push({ severity: "INFO", label: msg(locale, { tr: "Örnek entropisi çok yüksek; sıkıştırılmış, şifreli veya paketlenmiş veri olabilir (tek başına zararlı göstergesi değildir).", en: "Sample entropy is very high; data may be compressed, encrypted, or packed (not malicious by itself).", de: "Die Sample-Entropie ist sehr hoch; Daten könnten komprimiert, verschlüsselt oder gepackt sein (allein kein Schadindikator).", zh: "样本熵很高，可能是压缩、加密或封装数据（本身不代表恶意）。" }) });
      const top = findings.some((item) => item.severity === "HIGH") ? 3 : findings.some((item) => item.severity === "MEDIUM") ? 2 : 1;
      const status = top === 3
        ? msg(locale, { tr: "ŞÜPHELİ BULGULAR", en: "SUSPICIOUS FINDINGS", de: "VERDÄCHTIGE BEFUNDE", zh: "发现可疑特征" })
        : top === 2
          ? msg(locale, { tr: "DİKKAT GEREKİYOR", en: "CAUTION", de: "VORSICHT", zh: "需要谨慎" })
          : msg(locale, { tr: "BELİRGİN KURAL EŞLEŞMESİ YOK", en: "NO OBVIOUS RULE MATCH", de: "KEINE OFFENSICHTLICHE REGELÜBEREINSTIMMUNG", zh: "未发现明显规则匹配" });
      setOutput(lineText(
        msg(locale, { tr: "YEREL DOSYA RİSK RAPORU", en: "LOCAL FILE RISK REPORT", de: "LOKALER DATEI-RISIKOBERICHT", zh: "本地文件风险报告" }), "",
        msg(locale, { tr: "Dosya", en: "File", de: "Datei", zh: "文件" }) + ": " + next.name,
        msg(locale, { tr: "Boyut", en: "Size", de: "Größe", zh: "大小" }) + ": " + (next.size / 1024).toFixed(1) + " KiB",
        "MIME: " + (next.type || "—"),
        msg(locale, { tr: "İmza", en: "Signature", de: "Signatur", zh: "签名" }) + ": " + magic.type,
        msg(locale, { tr: "İlk baytlar", en: "First bytes", de: "Erste Bytes", zh: "起始字节" }) + ": " + bytesToHex(first),
        msg(locale, { tr: "Örnek entropisi", en: "Sample entropy", de: "Sample-Entropie", zh: "样本熵" }) + ": " + entropy.toFixed(3) + " / 8",
        msg(locale, { tr: "Durum", en: "Status", de: "Status", zh: "状态" }) + ": " + status, "",
        ...(findings.length ? findings.map((item, index) => (index + 1) + ". [" + item.severity + "] " + item.label) : [msg(locale, { tr: "Sınırlı kural kümesi eşleşme bulmadı.", en: "The bounded rule set found no match.", de: "Der begrenzte Regelsatz fand keine Übereinstimmung.", zh: "有限规则集未发现匹配。" })]), "",
        msg(locale, { tr: "KRİTİK SINIR: Dosya çalıştırılmadı ve ağa gönderilmedi. Bu örneklemeli heuristik tarama antivirüs değildir; temiz sonuç dosyanın zararsız olduğunu kanıtlamaz. Şüpheli dosyayı açmayın, izole edin ve güncel profesyonel güvenlik ürünüyle doğrulayın.", en: "CRITICAL LIMIT: the file was not executed or uploaded. This sampled heuristic scan is not antivirus; a clean result does not prove the file is harmless. Do not open suspicious files—quarantine and verify with a current professional security product.", de: "KRITISCHE GRENZE: Die Datei wurde weder ausgeführt noch hochgeladen. Diese stichprobenartige Heuristik ist kein Antivirus; ein unauffälliges Ergebnis beweist keine Harmlosigkeit. Verdächtige Dateien nicht öffnen, sondern isolieren und professionell prüfen.", zh: "关键限制：文件未被执行或上传。该抽样启发式扫描不是杀毒软件；无发现不等于文件无害。请勿打开可疑文件，应隔离并使用最新的专业安全产品核验。" })
      ));
      setNotice({ kind: top === 3 ? "warning" : top === 2 ? "info" : "success", text: status });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : String(error) });
    } finally {
      setBusy(false);
    }
  }
  async function demo() {
    const content = "#!/bin/sh\n# Harmless text demo containing a risky-looking marker\necho demo\n# powershell -EncodedCommand EXAMPLE_ONLY";
    await scan(new File([content], "report.pdf.js", { type: "text/javascript" }));
  }
  return (
    <Frame locale={locale} onDemo={() => void demo()} onClear={() => { setFile(null); setOutput(""); setNotice(null); }} busy={busy}>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          <div className="file-drop"><label><input type="file" onChange={(event) => { const next = event.target.files?.[0]; if (next) void scan(next); event.currentTarget.value = ""; }} /><span>＋</span><strong>{msg(locale, { tr: "Taranacak dosyayı seçin", en: "Choose a file to scan", de: "Datei zur Prüfung wählen", zh: "选择要扫描的文件" })}</strong><small>{msg(locale, { tr: "En fazla 100 MB · İlk/son örnekler okunur · Dosya çalıştırılmaz veya yüklenmez", en: "Up to 100 MB · First/last samples are read · File is never executed or uploaded", de: "Bis 100 MB · Anfang/Ende werden gelesen · Keine Ausführung oder Upload", zh: "最大 100 MB · 读取首尾样本 · 不执行、不上传" })}</small></label></div>
          {file && <p className="privacy-hint">{file.name} · {(file.size / 1024).toFixed(1)} KiB</p>}
        </div>
        <Output locale={locale} value={output} filename="bytequant-file-risk-report.txt" notice={notice} />
      </div>
    </Frame>
  );
}

type CodeFinding = Finding & { line: number };
function scanCodeWorker(code: string): Promise<CodeFinding[]> {
  const workerSource = [
    "self.onmessage=function(event){try{",
    "const code=String(event.data||'');",
    "const rules=[",
    "['Dynamic code execution','HIGH',/\\b(?:eval|Function)\\s*\\(/g],",
    "['Unsafe HTML sink','HIGH',/\\b(?:innerHTML|outerHTML)\\s*=|document\\.write\\s*\\(/g],",
    "['Shell or process execution','HIGH',/(?:child_process\\.(?:exec|execSync|spawn)|os\\.system|subprocess\\.(?:run|Popen)|Runtime\\.getRuntime\\(\\)\\.exec)/g],",
    "['TLS verification disabled','HIGH',/(?:rejectUnauthorized\\s*:\\s*false|verify\\s*=\\s*False|NODE_TLS_REJECT_UNAUTHORIZED\\s*=\\s*['\\\"]?0)/g],",
    "['Possible private key','HIGH',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],",
    "['Possible cloud or API secret','HIGH',/(?:AKIA[0-9A-Z]{16}|(?:api[_-]?key|secret|token|password)\\s*[:=]\\s*['\\\"][A-Za-z0-9_\\-\\/.+=]{16,}['\\\"])/gi],",
    "['Weak cryptographic hash','MEDIUM',/\\b(?:md5|sha1)\\s*\\(/gi],",
    "['Insecure randomness candidate','MEDIUM',/Math\\.random\\s*\\(\\)|random\\.random\\s*\\(\\)/g],",
    "['SQL string assembly candidate','MEDIUM',/(?:SELECT|INSERT|UPDATE|DELETE)[^\\n]{0,120}(?:\\+|\\$\\{|%s)/gi],",
    "['Debug or localhost setting','INFO',/(?:debug\\s*[:=]\\s*true|localhost:\\d{2,5})/gi]",
    "];",
    "const starts=[0];for(let i=0;i<code.length;i++)if(code.charCodeAt(i)===10)starts.push(i+1);",
    "const lineOf=function(index){let low=0,high=starts.length;while(low<high){const mid=(low+high)>>1;if(starts[mid]<=index)low=mid+1;else high=mid;}return low;};",
    "const out=[];for(const rule of rules){rule[2].lastIndex=0;let match;while((match=rule[2].exec(code))&&out.length<300){out.push({label:rule[0],severity:rule[1],line:lineOf(match.index)});if(match[0]==='')rule[2].lastIndex++;}}",
    "self.postMessage({out:out});}catch(error){self.postMessage({error:String(error)});}}",
  ].join("");
  const url = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
  const worker = new Worker(url);
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => { worker.terminate(); URL.revokeObjectURL(url); reject(new Error("timeout")); }, 1200);
    worker.onmessage = (event: MessageEvent<{ out?: CodeFinding[]; error?: string }>) => {
      window.clearTimeout(timeout); worker.terminate(); URL.revokeObjectURL(url);
      if (event.data.error) reject(new Error(event.data.error)); else resolve(event.data.out ?? []);
    };
    worker.onerror = () => { window.clearTimeout(timeout); worker.terminate(); URL.revokeObjectURL(url); reject(new Error("worker")); };
    worker.postMessage(code);
  });
}
function CodeRiskWorkbench({ locale }: { locale: Locale }) {
  const demo = "const apiKey = \"demo_key_not_a_real_secret_12345\";\nconst html = userInput;\nelement.innerHTML = html;\nconst token = Math.random().toString(36);";
  const [code, setCode] = useState(demo);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [notice, setNotice] = useState<ToolNoticeData | null>(null);
  const [busy, setBusy] = useState(false);
  async function run() {
    setOutput(""); setNotice(null);
    if (!code.trim()) { setNotice({ kind: "error", text: msg(locale, { tr: "Önce kod girin.", en: "Enter code first.", de: "Geben Sie zuerst Code ein.", zh: "请先输入代码。" }) }); return; }
    if (code.length > 500000) { setNotice({ kind: "error", text: msg(locale, { tr: "Kod 500.000 karakter sınırını aşıyor.", en: "Code exceeds the 500,000-character limit.", de: "Der Code überschreitet 500.000 Zeichen.", zh: "代码超过 500,000 字符限制。" }) }); return; }
    setBusy(true);
    try {
      const findings = await scanCodeWorker(code);
      const high = findings.filter((item) => item.severity === "HIGH").length;
      const medium = findings.filter((item) => item.severity === "MEDIUM").length;
      setOutput(lineText(
        msg(locale, { tr: "KOD GÜVENLİĞİ ÖN TARAMA RAPORU", en: "CODE SECURITY PRE-SCAN REPORT", de: "CODE-SICHERHEITS-VORPRÜFUNG", zh: "代码安全预扫描报告" }),
        msg(locale, { tr: "Dil etiketi", en: "Language label", de: "Sprachkennzeichnung", zh: "语言标签" }) + ": " + language,
        msg(locale, { tr: "Satır", en: "Lines", de: "Zeilen", zh: "行" }) + ": " + code.split(/\r?\n/).length,
        msg(locale, { tr: "Yüksek", en: "High", de: "Hoch", zh: "高" }) + ": " + high + " · " + msg(locale, { tr: "Orta", en: "Medium", de: "Mittel", zh: "中" }) + ": " + medium, "",
        ...(findings.length ? findings.map((item, index) => (index + 1) + ". [" + item.severity + "] " + msg(locale, { tr: "Satır", en: "Line", de: "Zeile", zh: "行" }) + " " + item.line + " — " + item.label) : [msg(locale, { tr: "Sınırlı kural kümesi eşleşme bulmadı.", en: "The bounded rule set found no match.", de: "Der begrenzte Regelsatz fand keine Übereinstimmung.", zh: "有限规则集未发现匹配。" })]), "",
        msg(locale, { tr: "KRİTİK SINIR: Araç kodu çalıştırmaz ve sunucuya göndermez. Regex ön taraması veri akışını, bağımlılıkları veya çalışma zamanı davranışını anlayamaz; temiz sonuç güvenlik onayı değildir. Uzman incelemesi ve güncel SAST/dependency araçlarıyla doğrulayın.", en: "CRITICAL LIMIT: the tool neither executes nor uploads code. A regex pre-scan cannot understand data flow, dependencies, or runtime behavior; a clean result is not security approval. Verify with expert review and current SAST/dependency tooling.", de: "KRITISCHE GRENZE: Das Werkzeug führt Code weder aus noch lädt es ihn hoch. Regex-Prüfungen verstehen Datenfluss, Abhängigkeiten und Laufzeitverhalten nicht; ein unauffälliges Ergebnis ist keine Freigabe. Mit Expertenprüfung und aktuellen SAST-/Dependency-Werkzeugen verifizieren.", zh: "关键限制：工具不会执行或上传代码。基于正则的预扫描无法理解数据流、依赖或运行时行为；无发现不代表安全批准。请通过专家审查及最新 SAST/依赖工具核验。" })
      ));
      setNotice({ kind: high ? "warning" : medium ? "info" : "success", text: high ? msg(locale, { tr: "Yüksek öncelikli bulgular var; yayımlamadan önce inceleyin.", en: "High-priority findings require review before release.", de: "Hoch priorisierte Befunde müssen vor der Veröffentlichung geprüft werden.", zh: "存在高优先级发现，发布前必须审查。" }) : msg(locale, { tr: "Tarama tamamlandı; sonuç güvenlik garantisi değildir.", en: "Scan complete; the result is not a security guarantee.", de: "Prüfung abgeschlossen; das Ergebnis ist keine Sicherheitsgarantie.", zh: "扫描完成；结果不构成安全保证。" }) });
    } catch {
      setNotice({ kind: "error", text: msg(locale, { tr: "Güvenli Worker taraması tamamlanamadı veya süre sınırını aştı.", en: "The safe Worker scan failed or exceeded its time limit.", de: "Die sichere Worker-Prüfung ist fehlgeschlagen oder hat das Zeitlimit überschritten.", zh: "安全 Worker 扫描失败或超时。" }) });
    } finally {
      setBusy(false);
    }
  }
  return (
    <Frame locale={locale} onDemo={() => setCode(demo)} onClear={() => { setCode(""); setOutput(""); setNotice(null); }} busy={busy}>
      <div className="workbench-grid">
        <div className="workbench-inputs">
          <label className="field-label"><span>{msg(locale, { tr: "Dil etiketi", en: "Language label", de: "Sprachkennzeichnung", zh: "语言标签" })}</span><select value={language} onChange={(event) => setLanguage(event.target.value)}>{["javascript", "typescript", "python", "php", "java", "csharp", "go", "rust", "other"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="field-label"><span>{msg(locale, { tr: "Kaynak kodu", en: "Source code", de: "Quellcode", zh: "源代码" })}</span><textarea value={code} onChange={(event) => setCode(event.target.value)} rows={17} maxLength={500000} spellCheck="false" /></label>
          <button type="button" className="primary-button run-button" onClick={() => void run()} disabled={busy}>{busy ? msg(locale, { tr: "Worker tarıyor…", en: "Worker scanning…", de: "Worker prüft…", zh: "Worker 扫描中…" }) : msg(locale, { tr: "Cihazımda tara", en: "Scan on my device", de: "Auf meinem Gerät prüfen", zh: "在设备上扫描" })}</button>
        </div>
        <Output locale={locale} value={output} filename="bytequant-code-security-report.txt" notice={notice} />
      </div>
    </Frame>
  );
}

function UrlRiskWorkbench({ locale }: { locale: Locale }) {
  const demo = "https://login.example.com@xn--exmple-cua.test/continue?redirect=https%3A%2F%2Fexample.org";
  const [input, setInput] = useState(demo);
  let output = "";
  let notice: ToolNoticeData | null = null;
  try {
    const url = new URL(input.trim());
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("protocol");
    const findings: Finding[] = [];
    if (url.protocol !== "https:") findings.push({ severity: "HIGH", label: msg(locale, { tr: "HTTPS kullanılmıyor", en: "HTTPS is not used", de: "HTTPS wird nicht verwendet", zh: "未使用 HTTPS" }) });
    if (url.username || url.password) findings.push({ severity: "HIGH", label: msg(locale, { tr: "URL içinde kullanıcı adı/parola bölümü var", en: "URL contains a username/password section", de: "URL enthält Benutzername/Passwort", zh: "URL 含用户名/密码部分" }) });
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(url.hostname) || /^\[[0-9a-f:]+\]$/i.test(url.hostname)) findings.push({ severity: "MEDIUM", label: msg(locale, { tr: "Alan adı yerine IP adresi kullanılıyor", en: "An IP address is used instead of a domain", de: "IP-Adresse statt Domainname", zh: "使用 IP 地址而非域名" }) });
    if (url.hostname.includes("xn--")) findings.push({ severity: "MEDIUM", label: msg(locale, { tr: "Punycode/uluslararası alan adı etiketi var; görünür yazımı doğrulayın", en: "Punycode/internationalized domain label present; verify the visible spelling", de: "Punycode-/IDN-Label vorhanden; Schreibweise sorgfältig prüfen", zh: "存在 Punycode/国际化域名标签，请仔细核对显示拼写" }) });
    if (url.hostname.split(".").length > 5) findings.push({ severity: "INFO", label: msg(locale, { tr: "Çok sayıda alt alan etiketi", en: "Many subdomain labels", de: "Viele Subdomain-Labels", zh: "子域名层级较多" }) });
    if ((input.match(/%[0-9a-f]{2}/gi) ?? []).length > 6) findings.push({ severity: "MEDIUM", label: msg(locale, { tr: "Yoğun yüzde kodlama", en: "Heavy percent encoding", de: "Starke Prozentkodierung", zh: "大量百分号编码" }) });
    if (input.length > 500) findings.push({ severity: "INFO", label: msg(locale, { tr: "Olağan dışı uzun URL", en: "Unusually long URL", de: "Ungewöhnlich lange URL", zh: "URL 异常长" }) });
    ["redirect", "redirect_uri", "url", "next", "continue", "target", "dest", "destination", "return", "returnurl"].forEach((name) => { if (url.searchParams.has(name)) findings.push({ severity: "MEDIUM", label: msg(locale, { tr: "Yönlendirme hedefi parametresi", en: "Redirect-target parameter", de: "Weiterleitungsparameter", zh: "重定向目标参数" }) + ": " + name }); });
    if (url.port && !["80", "443"].includes(url.port)) findings.push({ severity: "INFO", label: msg(locale, { tr: "Standart dışı port", en: "Non-standard port", de: "Nicht standardmäßiger Port", zh: "非标准端口" }) + ": " + url.port });
    const high = findings.some((item) => item.severity === "HIGH");
    output = lineText(
      msg(locale, { tr: "URL YAPISAL RİSK RAPORU", en: "URL STRUCTURAL RISK REPORT", de: "URL-STRUKTUR-RISIKOBERICHT", zh: "URL 结构风险报告" }), "",
      msg(locale, { tr: "Protokol", en: "Protocol", de: "Protokoll", zh: "协议" }) + ": " + url.protocol,
      "Host: " + url.hostname,
      "Port: " + (url.port || msg(locale, { tr: "varsayılan", en: "default", de: "Standard", zh: "默认" })),
      msg(locale, { tr: "Yol", en: "Path", de: "Pfad", zh: "路径" }) + ": " + url.pathname,
      msg(locale, { tr: "Parametre sayısı", en: "Parameter count", de: "Parameteranzahl", zh: "参数数量" }) + ": " + [...url.searchParams].length, "",
      ...(findings.length ? findings.map((item, index) => (index + 1) + ". [" + item.severity + "] " + item.label) : [msg(locale, { tr: "Sınırlı yapısal kurallar belirgin bir sinyal bulmadı.", en: "The bounded structural rules found no obvious signal.", de: "Die begrenzten Strukturregeln fanden kein auffälliges Signal.", zh: "有限结构规则未发现明显信号。" })]), "",
      msg(locale, { tr: "KRİTİK SINIR: Bağlantıya ağ isteği yapılmadı. İtibar, TLS sertifikası, DNS, indirme, yönlendirme zinciri ve sayfa içeriği doğrulanmadı. Temiz sonuç URL'nin güvenli olduğunu kanıtlamaz.", en: "CRITICAL LIMIT: no network request was made. Reputation, TLS certificate, DNS, downloads, redirect chain, and page content were not verified. A clean result does not prove the URL is safe.", de: "KRITISCHE GRENZE: Es wurde keine Netzwerkanfrage gestellt. Reputation, TLS-Zertifikat, DNS, Downloads, Weiterleitungskette und Seiteninhalt wurden nicht geprüft. Ein unauffälliges Ergebnis beweist keine Sicherheit.", zh: "关键限制：未发起网络请求，因此未验证信誉、TLS 证书、DNS、下载、重定向链或页面内容。无发现不代表 URL 安全。" })
    );
    notice = { kind: high ? "warning" : findings.length ? "info" : "success", text: high ? msg(locale, { tr: "Yüksek öncelikli yapısal sinyal bulundu; bağlantıyı açmayın.", en: "A high-priority structural signal was found; do not open the link.", de: "Ein hoch priorisiertes Struktursignal wurde gefunden; Link nicht öffnen.", zh: "发现高优先级结构信号，请勿打开链接。" }) : msg(locale, { tr: "Yapısal ön kontrol tamamlandı; bu bir itibar doğrulaması değildir.", en: "Structural pre-check complete; this is not a reputation check.", de: "Strukturprüfung abgeschlossen; dies ist keine Reputationsprüfung.", zh: "结构预检查完成；这不是信誉验证。" }) };
  } catch (error) {
    if (input.trim()) notice = { kind: "error", text: error instanceof Error && error.message === "protocol" ? msg(locale, { tr: "Yalnızca http veya https URL girin.", en: "Enter an http or https URL only.", de: "Geben Sie nur eine HTTP- oder HTTPS-URL ein.", zh: "只能输入 http 或 https URL。" }) : msg(locale, { tr: "URL ayrıştırılamadı. Tam adresi protokolle birlikte girin.", en: "The URL could not be parsed. Include the full address and protocol.", de: "Die URL konnte nicht geparst werden. Geben Sie die vollständige Adresse mit Protokoll ein.", zh: "无法解析 URL。请输入包含协议的完整地址。" }) };
  }
  return (
    <Frame locale={locale} onDemo={() => setInput(demo)} onClear={() => setInput("")}>
      <div className="workbench-grid">
        <div className="workbench-inputs"><label className="field-label"><span>URL</span><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={9} maxLength={4000} spellCheck="false" /></label><p className="privacy-hint">{msg(locale, { tr: "Adres yalnızca metin olarak ayrıştırılır; bağlantı açılmaz, DNS veya HTTP isteği yapılmaz.", en: "The address is parsed only as text; it is not opened and no DNS or HTTP request is made.", de: "Die Adresse wird nur als Text geparst; kein Öffnen, keine DNS- oder HTTP-Anfrage.", zh: "地址仅作为文本解析；不会打开，也不会发起 DNS 或 HTTP 请求。" })}</p></div>
        <Output locale={locale} value={output} filename="bytequant-url-risk-report.txt" notice={notice} />
      </div>
    </Frame>
  );
}

export function AdvancedWorkbench({ slug, locale }: { slug: string; locale: Locale }) {
  if (slug === "yatirim-getiri-simulatoru") return <InvestmentWorkbench locale={locale} />;
  if (slug === "birim-donusturucu") return <UnitWorkbench locale={locale} />;
  if (slug === "not-ortalamasi-hesaplayici") return <GradeWorkbench locale={locale} />;
  if (slug === "gpa-cevirici") return <GpaWorkbench locale={locale} />;
  if (slug === "kaynakca-atif-formatlayici") return <CitationWorkbench locale={locale} />;
  if (slug === "fatura-sablonu-olusturucu") return <InvoiceWorkbench locale={locale} />;
  if (slug === "basit-sozlesme-sablonu") return <ContractWorkbench locale={locale} />;
  if (slug === "asiri-kesinlik-dil-tarayicisi") return <CertaintyWorkbench locale={locale} />;
  if (slug === "konusma-disa-aktarma-formatlayici") return <ConversationWorkbench locale={locale} />;
  if (slug === "token-baglam-butcesi-planlayici") return <BudgetWorkbench locale={locale} />;
  if (slug === "sistem-promptu-netlik-kontrolu") return <ClarityWorkbench locale={locale} />;
  if (slug === "rol-persona-tutarlilik-kontrolu") return <PersonaWorkbench locale={locale} />;
  if (slug === "dosya-risk-on-taramasi") return <FileRiskWorkbench locale={locale} />;
  if (slug === "kod-guvenligi-on-taramasi") return <CodeRiskWorkbench locale={locale} />;
  return <UrlRiskWorkbench locale={locale} />;
}
