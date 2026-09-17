import { EditorialExample } from "./EditorialExample";
import { getEditorialExample } from "../lib/editorial-examples";
import type { Tool } from "../lib/tools";
import type { Locale } from "../lib/site";
import { getToolGuidanceDetails } from "../lib/tool-guidance";
import { getToolDeepDive } from "../lib/tool-deep-dives";
const copy = {
  tr: {
    eyebrow: "UYGULAMA VE KARAR REHBERİ", title: (name: string) => `${name}: yöntem ve kullanım`,
    method: "Araç gerçekte nasıl çalışır?", input: "Başlamadan önce girdi kontrolü", output: "Çıktıyı nasıl yorumlamalısınız?", scenarios: "Üç gerçek kullanım senaryosu", action: "Uygulama", check: "Kabul işareti", boundary: "Sonucu kullanmadan önce durma koşulu", next: "Güvenli sonraki adım", worked: "Uygulamalı karar kaydı", situation: "Gerçek ihtiyaç", fixture: "Denenecek örnek", evidence: "Başarı kanıtı", failure: "Durma ve düzeltme koşulu",
  },
  en: {
    eyebrow: "APPLICATION AND DECISION GUIDE", title: (name: string) => `${name}: method and usage`,
    method: "How does the tool actually work?", input: "Input check before you begin", output: "How should you interpret the output?", scenarios: "Three practical use cases", action: "Action", check: "Acceptance signal", boundary: "Stop condition before using the result", next: "Safe next step", worked: "Worked decision record", situation: "Real need", fixture: "Example to try", evidence: "Evidence of success", failure: "Stop and correct when",
  },
  de: {
    eyebrow: "ANWENDUNGS- UND ENTSCHEIDUNGSHILFE", title: (name: string) => `${name}: Methode und Anwendung`,
    method: "Wie arbeitet das Werkzeug tatsächlich?", input: "Eingabeprüfung vor dem Start", output: "Wie ist die Ausgabe zu bewerten?", scenarios: "Drei praktische Einsatzfälle", action: "Durchführung", check: "Abnahmesignal", boundary: "Abbruchbedingung vor der Nutzung", next: "Sicherer nächster Schritt", worked: "Nachvollziehbares Praxisbeispiel", situation: "Konkreter Bedarf", fixture: "Testbeispiel", evidence: "Erfolgsnachweis", failure: "Stoppen und korrigieren, wenn",
  },
  zh: {
    eyebrow: "应用与决策指南", title: (name: string) => `${name}：方法与使用说明`,
    method: "工具实际如何工作？", input: "开始前的输入检查", output: "如何解读输出？", scenarios: "三个实际使用场景", action: "执行", check: "验收信号", boundary: "使用结果前的停止条件", next: "安全的下一步", worked: "可复现的决策记录", situation: "实际需求", fixture: "试用示例", evidence: "成功证据", failure: "出现以下情况应停止并修正",
  },
} as const;
export function ToolEditorialReview({ tool, locale }: { tool: Tool; locale: Locale }) {
  const t = copy[locale];
  const guidance = getToolGuidanceDetails(tool);
  const deepDive = getToolDeepDive(tool.slug);
  const example = getEditorialExample(tool.slug);
  return (
    <section className="container tool-editorial-review is-published" data-editorial-status="published" data-editorial-depth="applied" data-content-depth="task-specific" aria-labelledby={`editorial-${tool.slug}`}>
      <div className="tool-editorial-heading">
        <div><span className="kicker">{t.eyebrow}</span><h2 id={`editorial-${tool.slug}`}>{t.title(tool.title[locale])}</h2></div>

      </div>
      <p>{tool.description[locale]}</p>
      <div className="tool-editorial-grid">
        <article><strong>{t.method}</strong><p data-shared-instruction="method">{guidance.method[locale]}</p></article>
        <article><strong>{t.input}</strong><p data-shared-instruction="method">{guidance.input[locale]} {({ tr: "Biçimi önce kişisel veri içermeyen küçük bir örnekle doğrulayın.", en: "Confirm the shape first with a small example containing no personal data.", de: "Das Format zuerst mit einem kleinen Beispiel ohne Personendaten prüfen.", zh: "请先用不含个人数据的小样本确认格式。" } as const)[locale]}</p></article>
        <article><strong>{t.output}</strong><p data-shared-instruction="method">{guidance.output[locale]}</p></article>
      </div>
      <div className="tool-editorial-scenarios" data-tool-acceptance="three-scenario">
        <h3>{({ tr: "Uygulama adımları", en: "Practical steps", de: "Praktische Schritte", zh: "实际操作步骤" })[locale]}</h3>
        <ol>{tool.steps[locale].map((step, index) => <li id={`how-to-step-${index + 1}`} key={index}>{step}</li>)}</ol>
      </div>
      <div className="tool-editorial-decision">
        <article><strong>{({ tr: "Doğrulama", en: "Verification", de: "Prüfung", zh: "核验" })[locale]}</strong><p data-shared-instruction="method">{guidance.verification[locale]}</p></article>
        <article><strong>{t.boundary}</strong><p data-shared-instruction="method">{guidance.boundary[locale]}</p></article>
      </div>
      <h3>{({ tr: "Uygun kullanım alanları", en: "Suitable use cases", de: "Geeignete Anwendungen", zh: "适用场景" })[locale]}</h3>
      <ul>{tool.useCases[locale].map((item) => <li key={item}>{item}</li>)}</ul>
      {example ? <EditorialExample example={example} locale={locale} /> : null}
      {deepDive ? <section className="tool-worked-example" id="worked-example" aria-labelledby={`worked-${tool.slug}`}>
        <div className="tool-worked-example-heading"><span aria-hidden="true">↳</span><h3 id={`worked-${tool.slug}`}>{t.worked}</h3></div>
        <div className="tool-worked-example-grid">
          <article><strong>{t.situation}</strong><p>{deepDive.situation[locale]}</p></article>
          <article><strong>{t.fixture}</strong><p>{deepDive.fixture[locale]}</p></article>
          <article><strong>{t.evidence}</strong><p>{deepDive.evidence[locale]}</p></article>
          <article><strong>{t.failure}</strong><p>{deepDive.failure[locale]}</p></article>
        </div>
      </section> : null}
    </section>
  );
}
