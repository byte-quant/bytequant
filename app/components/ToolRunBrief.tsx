import type { Locale } from "../lib/site";
import type { Tool } from "../lib/tools";
import type { ToolGuidanceDetails } from "../lib/tool-guidance";

const copy = {
  tr: {
    eyebrow: "ARACA ÖZEL ÇALIŞMA PLANI",
    title: (name: string) => `${name} için ne gireceğinizi ve ne alacağınızı görün`,
    intro: (name: string, useCase: string) => `${name}, özellikle “${useCase}” ihtiyacını tamamlamak için aşağıdaki görev sözleşmesini kullanır. Önce örnekle biçimi kontrol edin; gerçek veriyi yalnızca alanlar ve beklenen çıktı doğruysa kullanın.`,
    input: "1 · Girdiyi hazırlayın",
    inputAction: "Bu biçimi kullanın",
    process: "2 · İşlemi çalıştırın",
    processAction: "Uygulanan yöntem",
    output: "3 · Sonucu okuyun",
    outputAction: "Beklenen çıktı",
    verify: "4 · Kabul edin veya düzeltin",
    verifyAction: "Kabul ölçütü",
    start: "Çalışma alanına geç",
    summary: "Girdi ve sonuç rehberi",
    summaryHint: "Biçim, yöntem ve kabul ölçütünü gerektiğinde açın",
    scenario: "Bu araca özgü örnek yol",
    note: "İpucu: Örnek veri düğmesi varsa önce onu çalıştırın. Sonuç, kabul ölçütünü karşılamıyorsa gerçek süreçte kullanmayın.",
  },
  en: {
    eyebrow: "TOOL-SPECIFIC RUN PLAN",
    title: (name: string) => `See exactly what ${name} expects and returns`,
    intro: (name: string, useCase: string) => `${name} uses the contract below to complete “${useCase}” in particular. Confirm the shape with the example first; use real data only when the fields and expected result are clear.`,
    input: "1 · Prepare the input",
    inputAction: "Use this shape",
    process: "2 · Run the operation",
    processAction: "Method applied",
    output: "3 · Read the result",
    outputAction: "Expected output",
    verify: "4 · Accept or correct",
    verifyAction: "Acceptance check",
    start: "Go to the workbench",
    summary: "Input and result guide",
    summaryHint: "Open the format, method, and acceptance check when needed",
    scenario: "A tool-specific example path",
    note: "Tip: when an example-data button is available, run it first. Do not use the result in a live process unless it passes the acceptance check.",
  },
  de: {
    eyebrow: "WERKZEUGSPEZIFISCHER ABLAUF",
    title: (name: string) => `Eingabe und Ergebnis von ${name} auf einen Blick`,
    intro: (name: string, useCase: string) => `${name} nutzt den folgenden Aufgabenvertrag besonders für „${useCase}“. Prüfen Sie das Format zuerst mit dem Beispiel und verwenden Sie Echtdaten erst, wenn Felder und Ergebnis eindeutig sind.`,
    input: "1 · Eingabe vorbereiten",
    inputAction: "Dieses Format verwenden",
    process: "2 · Vorgang starten",
    processAction: "Angewandte Methode",
    output: "3 · Ergebnis lesen",
    outputAction: "Erwartete Ausgabe",
    verify: "4 · Abnehmen oder korrigieren",
    verifyAction: "Abnahmekriterium",
    start: "Zum Arbeitsbereich",
    summary: "Eingabe- und Ergebnisleitfaden",
    summaryHint: "Format, Methode und Abnahmeprüfung bei Bedarf öffnen",
    scenario: "Werkzeugspezifischer Beispielweg",
    note: "Tipp: Falls Beispieldaten verfügbar sind, führen Sie diese zuerst aus. Ein Ergebnis ohne bestandene Abnahmeprüfung nicht in einem echten Prozess verwenden.",
  },
  zh: {
    eyebrow: "工具专属运行方案",
    title: (name: string) => `清楚了解${name}需要什么、会返回什么`,
    intro: (name: string, useCase: string) => `${name}尤其通过下方任务约定完成“${useCase}”。请先用示例确认格式；只有字段与预期结果明确后，才使用真实数据。`,
    input: "1 · 准备输入",
    inputAction: "使用此格式",
    process: "2 · 运行处理",
    processAction: "所用方法",
    output: "3 · 阅读结果",
    outputAction: "预期输出",
    verify: "4 · 验收或修正",
    verifyAction: "验收标准",
    start: "前往工作区",
    summary: "输入与结果指南",
    summaryHint: "需要时查看格式、方法与验收标准",
    scenario: "该工具的专属示例路径",
    note: "提示：如果有示例数据按钮，请先运行示例。结果未通过验收标准时，不要用于真实流程。",
  },
} as const;

export function ToolRunBrief({ tool, locale, guidance }: { tool: Tool; locale: Locale; guidance: ToolGuidanceDetails }) {
  const t = copy[locale];
  const name = tool.title[locale];
  const steps = tool.steps[locale];
  const useCases = tool.useCases[locale];
  const stages = [
    { number: "01", title: t.input, label: t.inputAction, body: `${name} — ${guidance.input[locale]}. ${steps[0]}` },
    { number: "02", title: t.process, label: t.processAction, body: `${name} — ${guidance.method[locale]} ${steps[1]}` },
    { number: "03", title: t.output, label: t.outputAction, body: `${name} — ${guidance.output[locale]}. ${useCases[1]}` },
    { number: "04", title: t.verify, label: t.verifyAction, body: `${name} — ${guidance.verification[locale]}. ${steps[2]}` },
  ];
  return (
    <details className="tool-run-brief tool-run-guide" data-tool-run-brief={tool.slug} data-content-depth="tool-specific-run-contract">
      <summary><span><span className="kicker">{t.eyebrow}</span><strong>{name}: {t.summary}</strong><small>{t.summaryHint}</small></span><b aria-hidden="true">+</b></summary>
      <div className="tool-run-guide-body">
        <header><div><h2 id={`run-brief-${tool.slug}`}>{t.title(name)}</h2><p>{t.intro(name, useCases[0])}</p></div></header>
        <ol>{stages.map((stage) => <li key={stage.number}><span aria-hidden="true">{stage.number}</span><div><small>{stage.label}</small><h3>{stage.title}</h3><p>{stage.body}</p></div></li>)}</ol>
        <div className="tool-run-brief-path"><strong>{t.scenario}</strong><p>{useCases.map((useCase, index) => `${index + 1}. ${useCase}`).join(" → ")}</p></div>
        <p className="tool-run-brief-note"><span aria-hidden="true">i</span>{t.note}</p>
      </div>
    </details>
  );
}
