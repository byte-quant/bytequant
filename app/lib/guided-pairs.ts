import type { Locale } from "./site";

type Field = { key: string; label: Record<Locale, string>; type?: "number" | "date"; example: string };
const f = (key: string, example: string, tr: string, en: string, de: string, zh: string, type?: Field["type"]): Field => ({ key, example, label: { tr, en, de, zh }, type });

export const guidedPairFields: Record<string, { input?: Field[]; secondary?: Field[] }> = {
  "cagr-hesaplayici": { input: [
    f("start", "125000", "Başlangıç değeri", "Starting value", "Anfangswert", "初始值", "number"),
    f("end", "210000", "Bitiş değeri", "Ending value", "Endwert", "最终值", "number"),
    f("years", "4", "Süre (yıl)", "Duration (years)", "Dauer (Jahre)", "时长（年）", "number"),
  ] },
  "roas-roi-hesaplayici": { input: [
    f("revenue", "85000", "Gelir", "Revenue", "Umsatz", "收入", "number"),
    f("adSpend", "20000", "Reklam harcaması", "Advertising spend", "Werbeausgaben", "广告支出", "number"),
    f("totalCost", "52000", "Toplam maliyet", "Total cost", "Gesamtkosten", "总成本", "number"),
  ] },
  "content-disposition-olusturucu": { input: [
    f("type", "attachment", "Sunum türü (attachment / inline)", "Disposition (attachment / inline)", "Darstellung (attachment / inline)", "展示方式（attachment / inline）"),
    f("filename", "rapor.pdf", "Dosya adı", "File name", "Dateiname", "文件名"),
  ] },
  "pico-arastirma-sorusu-olusturucu": { input: [
    f("population", "remote software teams", "İncelenen grup", "Population", "Untersuchte Gruppe", "研究群体"),
    f("intervention", "asynchronous code review", "Müdahale / uygulama", "Intervention", "Intervention", "干预措施"),
    f("comparison", "synchronous review meetings", "Karşılaştırma (isteğe bağlı)", "Comparison (optional)", "Vergleich (optional)", "对照（可选）"),
    f("outcome", "review turnaround", "Ölçülecek sonuç", "Measured outcome", "Gemessenes Ergebnis", "衡量结果"),
    f("time", "12 weeks", "Süre (isteğe bağlı)", "Time frame (optional)", "Zeitraum (optional)", "时间范围（可选）"),
  ] },
  "tarih-ekle-cikar-hesaplayici": { input: [
    f("date", "2026-07-29", "Başlangıç tarihi", "Starting date", "Anfangsdatum", "开始日期", "date"),
    f("years", "0", "Eklenecek yıl", "Years to add", "Jahre hinzufügen", "增加年数", "number"),
    f("months", "1", "Eklenecek ay", "Months to add", "Monate hinzufügen", "增加月数", "number"),
    f("days", "5", "Eklenecek gün", "Days to add", "Tage hinzufügen", "增加天数", "number"),
    f("businessDays", "10", "Eklenecek iş günü (Pzt–Cum)", "Business days to add (Mon–Fri)", "Werktage hinzufügen (Mo–Fr)", "增加工作日（周一至周五）", "number"),
  ] },
  "csv-pivot-ozeti": { secondary: [
    f("group", "team", "Gruplama sütunu", "Group column", "Gruppenspalte", "分组列"),
    f("value", "hours", "Değer sütunu", "Value column", "Wertspalte", "数值列"),
    f("operation", "sum", "İşlem (sum / count / avg)", "Operation (sum / count / avg)", "Vorgang (sum / count / avg)", "操作（sum / count / avg）"),
  ] },
  "json-dizi-sirala-filtrele": { secondary: [
    f("sort", "score", "Sıralama alanı", "Sort field", "Sortierfeld", "排序字段"),
    f("direction", "desc", "Yön (asc / desc)", "Direction (asc / desc)", "Richtung (asc / desc)", "方向（asc / desc）"),
    f("filter", "team:A", "Filtre (alan:değer, isteğe bağlı)", "Filter (field:value, optional)", "Filter (Feld:Wert, optional)", "筛选（字段:值，可选）"),
  ] },
};

/** Never silently drop a line, duplicate key, comment, or unsupported syntax. */
export function readGuidedPairs(input: string): Record<string, string> | null {
  const entries: Array<[string, string]> = [];
  for (const line of input.split(/\r?\n/u).filter((line) => line.trim())) {
    const index = line.indexOf("=");
    if (index < 1) return null;
    const key = line.slice(0, index).trim();
    if (!key || entries.some(([existing]) => existing === key)) return null;
    entries.push([key, line.slice(index + 1).trim()]);
  }
  return Object.fromEntries(entries);
}

export function updateGuidedPair(input: string, key: string, value: string) {
  if (/[\r\n]/u.test(value) || !readGuidedPairs(input)) return input;
  const lines = input.split(/\r?\n/u);
  const index = lines.findIndex((line) => line.slice(0, line.indexOf("=")).trim() === key);
  if (index >= 0) lines[index] = `${key}=${value}`;
  else lines.push(`${key}=${value}`);
  return lines.filter((line) => line.trim()).join("\n");
}
