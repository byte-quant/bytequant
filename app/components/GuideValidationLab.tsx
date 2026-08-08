import type { Locale } from "../lib/site";
import type { Tool } from "../lib/tools";

const copy = {
  tr: {
    eyebrow: "UYGULAMALI DOĞRULAMA",
    title: "Rehberi tekrarlanabilir bir kontrole dönüştürün",
    intro: (guide: string, count: number) => `“${guide}” için aşağıdaki ${count} araçlık kontrol planını kullanın. Gerçek kişisel veri yerine güvenli bir örnekle başlayın; ayarları, beklenen sonucu ve kabul kararını kaydedin.`,
    prepare: "Hazırlık",
    run: "Uygulama",
    verify: "Kabul kontrolü",
    expected: "Beklenen çıktı",
    stopTitle: "Ne zaman durmalısınız?",
    stopBody: "Girdi biçimi belirsizse, araç uyarı veriyorsa veya sonuç hedef bağlamla uyuşmuyorsa dışa aktarmayın. Hukuki, finansal, tıbbi ya da güvenlik açısından etkili bir kararı bağımsız bir kaynak veya yetkili kişiyle doğrulayın.",
    recordTitle: "Denetim kaydı",
    recordBody: "Hassas içeriği değil; araç adını, seçilen ayarı, tarayıcı sürümünü, test türünü ve kabul/red gerekçesini kaydedin. Böylece aynı kontrol gerçek veriyi çoğaltmadan tekrarlanabilir.",
  },
  en: {
    eyebrow: "APPLIED VERIFICATION",
    title: "Turn the guide into a repeatable review",
    intro: (guide: string, count: number) => `Use this ${count}-tool review plan for “${guide}”. Start with a safe example instead of real personal data, then record the settings, expected result, and acceptance decision.`,
    prepare: "Prepare",
    run: "Apply",
    verify: "Acceptance check",
    expected: "Expected output",
    stopTitle: "When should you stop?",
    stopBody: "Do not export when the input format is uncertain, the tool reports a warning, or the result conflicts with the target context. Independently verify any legal, financial, medical, or security-significant decision with an authoritative source or qualified person.",
    recordTitle: "Review record",
    recordBody: "Record the tool name, selected setting, browser version, test type, and acceptance or rejection reason—not the sensitive content. This keeps the check repeatable without copying real data.",
  },
  de: {
    eyebrow: "ANGEWANDTE PRÜFUNG",
    title: "Den Ratgeber in eine wiederholbare Prüfung überführen",
    intro: (guide: string, count: number) => `Nutzen Sie diesen Prüfplan mit ${count} Werkzeugen für „${guide}“. Beginnen Sie mit einem sicheren Beispiel statt echten personenbezogenen Daten und dokumentieren Sie Einstellungen, Sollergebnis und Abnahmeentscheidung.`,
    prepare: "Vorbereitung",
    run: "Durchführung",
    verify: "Abnahmekontrolle",
    expected: "Erwartete Ausgabe",
    stopTitle: "Wann müssen Sie abbrechen?",
    stopBody: "Exportieren Sie nicht, wenn das Eingabeformat unklar ist, das Werkzeug warnt oder das Ergebnis dem Zielkontext widerspricht. Rechtlich, finanziell, medizinisch oder sicherheitsrelevante Entscheidungen müssen anhand einer maßgeblichen Quelle oder durch eine qualifizierte Person unabhängig geprüft werden.",
    recordTitle: "Prüfprotokoll",
    recordBody: "Dokumentieren Sie Werkzeug, Einstellung, Browserversion, Testart und Abnahme- oder Ablehnungsgrund – nicht den sensiblen Inhalt. So bleibt die Prüfung wiederholbar, ohne Echtdaten zu vervielfältigen.",
  },
  zh: {
    eyebrow: "应用核验",
    title: "把指南转化为可重复的检查流程",
    intro: (guide: string, count: number) => `请使用这套包含 ${count} 个工具的检查计划来落实《${guide}》。先使用安全示例而非真实个人数据，再记录所选设置、预期结果与验收决定。`,
    prepare: "准备",
    run: "执行",
    verify: "验收检查",
    expected: "预期输出",
    stopTitle: "何时应停止？",
    stopBody: "如果输入格式不明确、工具发出警告，或结果与目标语境冲突，请勿导出。涉及法律、财务、医疗或安全影响的决定，必须通过权威来源或合格专业人员独立核验。",
    recordTitle: "检查记录",
    recordBody: "记录工具名称、所选设置、浏览器版本、测试类型及接受或拒绝理由，而不是敏感内容。这样既能重复检查，也不会复制真实数据。",
  },
} as const;

export function GuideValidationLab({ guideTitle, locale, tools }: { guideTitle: string; locale: Locale; tools: Tool[] }) {
  if (!tools.length) return null;
  const t = copy[locale];
  return (
    <section className="guide-validation-lab" data-guide-validation="applied" aria-labelledby="guide-validation-title">
      <span className="section-index" aria-hidden="true">✓</span>
      <span className="kicker">{t.eyebrow}</span>
      <h2 id="guide-validation-title">{t.title}</h2>
      <p>{t.intro(guideTitle, tools.length)}</p>
      <div className="guide-validation-tools">
        {tools.map((tool, index) => (
          <article key={tool.slug}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><h3>{tool.title[locale]}</h3></header>
            <dl>
              <div><dt>{t.prepare}</dt><dd>{tool.useCases[locale][0]}</dd></div>
              <div><dt>{t.run}</dt><dd>{tool.steps[locale][1] ?? tool.steps[locale][0]}</dd></div>
              <div><dt>{t.verify}</dt><dd>{tool.steps[locale][2] ?? tool.steps[locale][tool.steps[locale].length - 1]}</dd></div>
              <div><dt>{t.expected}</dt><dd>{tool.short[locale]}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className="guide-validation-notes">
        <article><strong>{t.stopTitle}</strong><p>{t.stopBody}</p></article>
        <article><strong>{t.recordTitle}</strong><p>{t.recordBody}</p></article>
      </div>
    </section>
  );
}
