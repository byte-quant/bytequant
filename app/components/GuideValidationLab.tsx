import type { Locale } from "../lib/site";
import type { Tool } from "../lib/tools";
import { getToolGuidanceDetails } from "../lib/tool-guidance";

const copy = {
  tr: {
    eyebrow: "UYGULAMALI DOĞRULAMA",
    title: "Rehberi tekrarlanabilir bir kontrole dönüştürün",
    intro: (guide: string, count: number, goal: string) => `“${guide}” için aşağıdaki ${count} araçlık kontrol planını kullanın. Hedef: ${goal} Gerçek veri yerine güvenli bir örnekle başlayın; her adımın beklenen sonucunu ve kabul kararını kaydedin.`,
    prepare: "Hazırlık",
    run: "Uygulama",
    verify: "Kabul kontrolü",
    expected: "Beklenen çıktı",
    stopTitle: "Ne zaman durmalısınız?",
    stopBody: (tool: string, boundary: string) => `${tool} için şu sınır geçerlidir: ${boundary} Bu koşul karşılanmıyorsa çıktıyı zincirin sonraki adımına aktarmayın.`,
    recordTitle: "Denetim kaydı",
    recordBody: (guide: string, useCase: string) => `“${guide}” kaydında hassas içeriği değil; araç adını, seçilen ayarı, tarayıcı sürümünü ve “${useCase}” için kabul/red gerekçesini tutun. Böylece kontrol gerçek veriyi çoğaltmadan tekrarlanabilir.`,
  },
  en: {
    eyebrow: "APPLIED VERIFICATION",
    title: "Turn the guide into a repeatable review",
    intro: (guide: string, count: number, goal: string) => `Use this ${count}-tool review plan for “${guide}”. Goal: ${goal} Start with a safe example instead of real data, then record each expected result and acceptance decision.`,
    prepare: "Prepare",
    run: "Apply",
    verify: "Acceptance check",
    expected: "Expected output",
    stopTitle: "When should you stop?",
    stopBody: (tool: string, boundary: string) => `Apply this boundary to ${tool}: ${boundary} If that condition is not met, do not pass the output to the next workflow step.`,
    recordTitle: "Review record",
    recordBody: (guide: string, useCase: string) => `For “${guide}”, record the tool, selected setting, browser version, and acceptance or rejection reason for “${useCase}”—not the sensitive content. This keeps the review repeatable without copying real data.`,
  },
  de: {
    eyebrow: "ANGEWANDTE PRÜFUNG",
    title: "Den Ratgeber in eine wiederholbare Prüfung überführen",
    intro: (guide: string, count: number, goal: string) => `Nutzen Sie diesen Prüfplan mit ${count} Werkzeugen für „${guide}“. Ziel: ${goal} Beginnen Sie mit einem sicheren Beispiel statt Echtdaten und dokumentieren Sie Sollergebnis und Abnahmeentscheidung jedes Schritts.`,
    prepare: "Vorbereitung",
    run: "Durchführung",
    verify: "Abnahmekontrolle",
    expected: "Erwartete Ausgabe",
    stopTitle: "Wann müssen Sie abbrechen?",
    stopBody: (tool: string, boundary: string) => `Für ${tool} gilt folgende Grenze: ${boundary} Ist diese Bedingung nicht erfüllt, darf die Ausgabe nicht an den nächsten Arbeitsschritt übergeben werden.`,
    recordTitle: "Prüfprotokoll",
    recordBody: (guide: string, useCase: string) => `Dokumentieren Sie für „${guide}“ Werkzeug, Einstellung, Browserversion und den Abnahme- oder Ablehnungsgrund für „${useCase}“ – nicht den sensiblen Inhalt. So bleibt die Prüfung ohne Echtdaten wiederholbar.`,
  },
  zh: {
    eyebrow: "应用核验",
    title: "把指南转化为可重复的检查流程",
    intro: (guide: string, count: number, goal: string) => `请使用这套包含 ${count} 个工具的检查计划来落实《${guide}》。目标：${goal} 请先用安全示例代替真实数据，并记录每一步的预期结果与验收决定。`,
    prepare: "准备",
    run: "执行",
    verify: "验收检查",
    expected: "预期输出",
    stopTitle: "何时应停止？",
    stopBody: (tool: string, boundary: string) => `${tool}适用以下边界：${boundary} 如果未满足该条件，请勿把输出传递到工作流的下一步。`,
    recordTitle: "检查记录",
    recordBody: (guide: string, useCase: string) => `落实《${guide}》时，请记录工具名称、所选设置、浏览器版本，以及“${useCase}”的接受或拒绝理由，而不是敏感内容。这样既能重复检查，也不会复制真实数据。`,
  },
} as const;

function buildValidationContent(guideTitle: string, guideSummary: string, locale: Locale, tools: Tool[]) {
  const t = copy[locale];
  const primary = tools[0];
  const primaryGuidance = primary ? getToolGuidanceDetails(primary) : null;
  return {
    intro: t.intro(guideTitle, tools.length, guideSummary),
    stop: primary && primaryGuidance ? t.stopBody(primary.title[locale], primaryGuidance.boundary[locale]) : "",
    record: primary ? t.recordBody(guideTitle, primary.useCases[locale][0]) : "",
  };
}

export function guideValidationText(guideTitle: string, guideSummary: string, locale: Locale, tools: Tool[]) {
  if (!tools.length) return "";
  const content = buildValidationContent(guideTitle, guideSummary, locale, tools);
  return [content.intro, ...tools.flatMap((tool) => {
    const guidance = getToolGuidanceDetails(tool);
    return [tool.title[locale], ...tool.steps[locale], `${guidance.output[locale]}. ${tool.short[locale]}`];
  }), content.stop, content.record].join(" ");
}

export function GuideValidationLab({ guideTitle, guideSummary, locale, tools }: { guideTitle: string; guideSummary: string; locale: Locale; tools: Tool[] }) {
  if (!tools.length) return null;
  const t = copy[locale];
  const content = buildValidationContent(guideTitle, guideSummary, locale, tools);
  return (
    <section className="guide-validation-lab" data-guide-validation="applied" data-guide-content-depth="tool-specific" aria-labelledby="guide-validation-title">
      <span className="section-index" aria-hidden="true">✓</span>
      <span className="kicker">{t.eyebrow}</span>
      <h2 id="guide-validation-title">{t.title}</h2>
      <p>{content.intro}</p>
      <div className="guide-validation-tools">
        {tools.map((tool, index) => (
          <article key={tool.slug}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><h3>{tool.title[locale]}</h3></header>
            <dl>
              <div><dt>{t.prepare}</dt><dd>{tool.steps[locale][0]}</dd></div>
              <div><dt>{t.run}</dt><dd>{tool.steps[locale][1] ?? tool.steps[locale][0]}</dd></div>
              <div><dt>{t.verify}</dt><dd>{tool.steps[locale][2] ?? tool.steps[locale][tool.steps[locale].length - 1]}</dd></div>
              <div><dt>{t.expected}</dt><dd>{getToolGuidanceDetails(tool).output[locale]}. {tool.short[locale]}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className="guide-validation-notes">
        <article><strong>{t.stopTitle}</strong><p>{content.stop}</p></article>
        <article><strong>{t.recordTitle}</strong><p>{content.record}</p></article>
      </div>
    </section>
  );
}
