import Link from "next/link";
import { exampleGuideTools, getEditorialExample, type EditorialExample as Example } from "../lib/editorial-examples";
import { toolPath, type Locale } from "../lib/site";

const copy = {
  tr: { label: "GİRDİDEN SONUCA", input: "Örnek girdi", output: "Beklenen çıktı", fail: "Hata vermesi gereken girdi", source: "Yöntem kaynağı", try: "Bu örneği araçta deneyin", note: "Sentetik test verisi · Gerçek kişi veya kayıt içermez" },
  en: { label: "FROM INPUT TO RESULT", input: "Sample input", output: "Expected output", fail: "Input that should fail", source: "Method reference", try: "Try this example in the tool", note: "Synthetic test data · No real people or records" },
  de: { label: "VON DER EINGABE ZUM ERGEBNIS", input: "Beispieleingabe", output: "Erwartete Ausgabe", fail: "Eingabe, die fehlschlagen soll", source: "Methodenquelle", try: "Beispiel im Werkzeug ausprobieren", note: "Synthetische Testdaten · Keine echten Personen oder Datensätze" },
  zh: { label: "从输入到结果", input: "示例输入", output: "预期输出", fail: "应报错的输入", source: "方法来源", try: "在工具中尝试此示例", note: "合成测试数据 · 不含真实个人或记录" },
};

export function EditorialExample({ example, locale, link = false }: { example: Example; locale: Locale; link?: boolean }) {
  const t = copy[locale];
  return <section className="editorial-example" data-editorial-example={example.tool} aria-labelledby={`example-${example.tool}`}>
    <span className="kicker">{t.label}</span>
    <h3 id={`example-${example.tool}`}>{example.title[locale]}</h3>
    <p>{example.explanation[locale]}</p>
    <div className="example-comparison">
      <figure><figcaption>{t.input}</figcaption><pre><code>{example.input}</code></pre></figure>
      <figure><figcaption>{t.output}</figcaption><pre><code>{example.output}</code></pre></figure>
    </div>
    <h4>{t.fail}</h4><pre><code>{example.counterexample}</code></pre>
    <p>{example.caution[locale]}</p>
    <footer><a href={example.source.url} rel="noopener noreferrer">{t.source}: {example.source.title} ↗</a>{link && <Link href={toolPath(locale, example.tool)}>{t.try} →</Link>}<small>{t.note}</small></footer>
  </section>;
}

export function GuideExamples({ slug, locale }: { slug: string; locale: Locale }) {
  return (exampleGuideTools[slug] ?? []).map((tool) => {
    const example = getEditorialExample(tool);
    return example ? <EditorialExample key={tool} example={example} locale={locale} link /> : null;
  });
}

export function guideExampleText(slug: string, locale: Locale) {
  return (exampleGuideTools[slug] ?? []).flatMap((tool) => {
    const e = getEditorialExample(tool);
    return e ? [e.title[locale], e.explanation[locale], e.input, e.output, e.counterexample, e.caution[locale]] : [];
  }).join(" ");
}
