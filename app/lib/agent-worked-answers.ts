import { editorialExamples } from "./editorial-examples";
import type { Locale } from "./site";

/** Answers are retrieved from maintained worked examples, never invented citations. */
export function workedExampleAnswer(locale: Locale, goal: string, previousGoal = "") {
  if (!/(?:örnek|nasıl|neden|example|how|why|beispiel|wie|warum|示例|例子|如何|为什么)/iu.test(goal)) return null;
  const topic = (value: string) => /base64/iu.test(value) ? "base64-kodlayici"
    : /csv/iu.test(value) ? "json-csv-donusturucu"
    : /json/iu.test(value) ? "json-bicimlendirici"
    : /\burl\b|percent.encod/iu.test(value) ? "url-kodlayici" : null;
  const slug = topic(goal) || (goal.length < 120 && /(?:örnek|example|beispiel|示例|例子)/iu.test(goal) ? topic(previousGoal) : null);
  const example = editorialExamples.find((item) => item.tool === slug);
  if (!example) return null;
  const labels = {
    tr: ["Girdi", "Beklenen çıktı", "Hatalı örnek / sınır", "Kaynak"],
    en: ["Input", "Expected output", "Counterexample / boundary", "Source"],
    de: ["Eingabe", "Erwartete Ausgabe", "Gegenbeispiel / Grenze", "Quelle"],
    zh: ["输入", "预期输出", "反例 / 边界", "来源"],
  }[locale];
  return `${example.title[locale]}\n\n${example.explanation[locale]}\n\n${labels[0]}:\n${example.input}\n\n${labels[1]}:\n${example.output}\n\n${labels[2]}:\n${example.counterexample}\n${example.caution[locale]}\n\n${labels[3]}: ${example.source.title}\n${example.source.url}`;
}

/** Resolve one explicit percentage correction against the user's previous operands. */
export function percentageFollowUp(goal: string, previousGoal: string) {
  if (goal.length > 90 || !/^(?:peki|ya |şimdi|what about|and |now|und |jetzt|那么|那|改为)/iu.test(goal.trim())) return null;
  const next = goal.match(/(?:%\s*(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s*%)/u);
  if (!next || (goal.match(/\d+(?:[.,]\d+)?/gu) ?? []).length !== 1) return null;
  const rate = next[1] ?? next[2];
  if (/\d+(?:[.,]\d+)?\s*%\s*(?:of|von)\s*\d/iu.test(previousGoal)) return previousGoal.replace(/\d+(?:[.,]\d+)?\s*%/u, `${rate}%`);
  if (/\d+[\s\S]*?(?:yüzde\s+|%\s*)\d/iu.test(previousGoal)) return previousGoal.replace(/(?:yüzde\s+|%\s*)\d+(?:[.,]\d+)?/iu, `%${rate}`);
  if (/\d+[\s\S]*?的\s*\d+(?:[.,]\d+)?\s*%/u.test(previousGoal)) return previousGoal.replace(/的\s*\d+(?:[.,]\d+)?\s*%/u, `的${rate}%`);
  return null;
}
