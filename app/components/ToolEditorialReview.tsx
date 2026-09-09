import type { Tool } from "../lib/tools";
import { CONTENT_REVIEW_DATE } from "../lib/content-review";
import type { Locale } from "../lib/site";
import { getToolGuidanceDetails } from "../lib/tool-guidance";
import { getToolDeepDive } from "../lib/tool-deep-dives";
const copy = {
  tr: {
    eyebrow: "UYGULAMA VE KARAR REHBERİ", title: (name: string) => `${name} için doğru girdi, doğru kontrol ve güvenli sonraki adım`,
    body: (name: string, description: string) => `${description} Bu inceleme ${name} sonucunun amaca uyup uymadığını, hangi kanıtla kabul edileceğini ve zayıf bir çıktının nerede durdurulacağını açıklar.`,
    method: "Araç gerçekte nasıl çalışır?", input: "Başlamadan önce girdi kontrolü", output: "Çıktıyı nasıl yorumlamalısınız?", scenarios: "Üç gerçek kullanım senaryosu", action: "Uygulama", check: "Kabul işareti", boundary: "Sonucu kullanmadan önce durma koşulu", next: "Güvenli sonraki adım", nextBody: (verification: string, boundary: string) => `Sonucu başka bir araca veya gerçek sürece yalnızca ${verification} tamamlandıktan sonra taşıyın. Karar kaydında şu sınırı görünür tutun: ${boundary}`, worked: "Uygulamalı karar kaydı", situation: "Gerçek ihtiyaç", fixture: "Denenecek örnek", evidence: "Başarı kanıtı", failure: "Durma ve düzeltme koşulu", date: "Son içerik ve yöntem incelemesi", badge: "İNCELENDİ",
  },
  en: {
    eyebrow: "APPLICATION AND DECISION GUIDE", title: (name: string) => `Use ${name} with the right input, acceptance check, and next step`,
    body: (name: string, description: string) => `${description} The notes below help you do more than produce a result: they show how to test whether ${name} fits the task and when to stop before a weak output travels further.`,
    method: "How does the tool actually work?", input: "Input check before you begin", output: "How should you interpret the output?", scenarios: "Three practical use cases", action: "Action", check: "Acceptance signal", boundary: "Stop condition before using the result", next: "Safe next step", nextBody: (verification: string, boundary: string) => `Move the result to another tool or live process only after ${verification}. Keep this limit visible in the decision record: ${boundary}`, worked: "Worked decision record", situation: "Real need", fixture: "Example to try", evidence: "Evidence of success", failure: "Stop and correct when", date: "Latest content and method review", badge: "REVIEWED",
  },
  de: {
    eyebrow: "ANWENDUNGS- UND ENTSCHEIDUNGSHILFE", title: (name: string) => `${name}: passende Eingabe, Abnahmekriterium und nächster Schritt`,
    body: (name: string, description: string) => `${description} Die folgenden Hinweise helfen nicht nur beim Erzeugen eines Ergebnisses. Sie zeigen, wie Sie die Eignung von ${name} für den konkreten Zweck prüfen und eine schwache Ausgabe rechtzeitig stoppen.`,
    method: "Wie arbeitet das Werkzeug tatsächlich?", input: "Eingabeprüfung vor dem Start", output: "Wie ist die Ausgabe zu bewerten?", scenarios: "Drei praktische Einsatzfälle", action: "Durchführung", check: "Abnahmesignal", boundary: "Abbruchbedingung vor der Nutzung", next: "Sicherer nächster Schritt", nextBody: (verification: string, boundary: string) => `Das Ergebnis erst nach ${verification} in ein anderes Werkzeug oder einen Live-Prozess übergeben. Im Entscheidungsprotokoll diese Grenze sichtbar halten: ${boundary}`, worked: "Nachvollziehbares Praxisbeispiel", situation: "Konkreter Bedarf", fixture: "Testbeispiel", evidence: "Erfolgsnachweis", failure: "Stoppen und korrigieren, wenn", date: "Letzte Inhalts- und Methodenprüfung", badge: "GEPRÜFT",
  },
  zh: {
    eyebrow: "应用与决策指南", title: (name: string) => `${name}：正确输入、验收检查与安全的下一步`,
    body: (name: string, description: string) => `${description} 以下说明不仅帮助生成结果，还会说明如何判断${name}是否适合当前任务，以及何时应在低质量输出继续流转前停止。`,
    method: "工具实际如何工作？", input: "开始前的输入检查", output: "如何解读输出？", scenarios: "三个实际使用场景", action: "执行", check: "验收信号", boundary: "使用结果前的停止条件", next: "安全的下一步", nextBody: (verification: string, boundary: string) => `只有完成${verification}后，才能把结果交给其他工具或真实流程。请在决策记录中明确保留此边界：${boundary}`, worked: "可复现的决策记录", situation: "实际需求", fixture: "试用示例", evidence: "成功证据", failure: "出现以下情况应停止并修正", date: "最近内容与方法审核", badge: "已审核",
  },
} as const;
export function ToolEditorialReview({ tool, locale }: { tool: Tool; locale: Locale }) {
  const t = copy[locale];
  const guidance = getToolGuidanceDetails(tool);
  const deepDive = getToolDeepDive(tool.slug);
  return (
    <section className="container tool-editorial-review is-published" data-editorial-status="published" data-editorial-depth="applied" data-content-depth="task-specific" aria-labelledby={`editorial-${tool.slug}`}>
      <div className="tool-editorial-heading">
        <div><span className="kicker">{t.eyebrow}</span><h2 id={`editorial-${tool.slug}`}>{t.title(tool.title[locale])}</h2></div>

      </div>
      <p>{t.body(tool.title[locale], tool.description[locale])}</p>
      <div className="tool-editorial-grid">
        <article><strong>{t.method}</strong><p>{guidance.method[locale]}</p></article>
        <article><strong>{t.input}</strong><p>{guidance.input[locale]} {({ tr: "Biçimi önce kişisel veri içermeyen küçük bir örnekle doğrulayın.", en: "Confirm the shape first with a small example containing no personal data.", de: "Das Format zuerst mit einem kleinen Beispiel ohne Personendaten prüfen.", zh: "请先用不含个人数据的小样本确认格式。" } as const)[locale]}</p></article>
        <article><strong>{t.output}</strong><p>{guidance.output[locale]} — {guidance.verification[locale]}</p></article>
      </div>
      <div className="tool-editorial-scenarios" data-tool-acceptance="three-scenario">
        <h3>{({ tr: "Uygulama adımları", en: "Practical steps", de: "Praktische Schritte", zh: "实际操作步骤" })[locale]}</h3>
        <ol>{tool.steps[locale].map((step, index) => <li key={index}>{step}</li>)}</ol>
      </div>
      <div className="tool-editorial-decision">
        <article><strong>{t.boundary}</strong><p>{({ tr: "Sonuç aşağıdaki sınırı aşan bir karar için kullanılmamalıdır: ", en: "Do not use the result for a decision beyond this boundary: ", de: "Das Ergebnis nicht für Entscheidungen außerhalb dieser Grenze nutzen: ", zh: "不要将结果用于超出以下边界的决策：" } as const)[locale]}{guidance.boundary[locale]}</p></article>
        <article><strong>{t.next}</strong><p>{t.nextBody(guidance.verification[locale], guidance.boundary[locale])}</p></article>
      </div>
      {deepDive ? <section className="tool-worked-example" id="worked-example" aria-labelledby={`worked-${tool.slug}`}>
        <div className="tool-worked-example-heading"><span aria-hidden="true">↳</span><h3 id={`worked-${tool.slug}`}>{t.worked}</h3></div>
        <div className="tool-worked-example-grid">
          <article><strong>{t.situation}</strong><p>{deepDive.situation[locale]}</p></article>
          <article><strong>{t.fixture}</strong><p>{deepDive.fixture[locale]}</p></article>
          <article><strong>{t.evidence}</strong><p>{deepDive.evidence[locale]}</p></article>
          <article><strong>{t.failure}</strong><p>{deepDive.failure[locale]}</p></article>
        </div>
      </section> : null}
      <small>{t.date}: <time dateTime={CONTENT_REVIEW_DATE}>{CONTENT_REVIEW_DATE}</time></small>
    </section>
  );
}
