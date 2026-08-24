import type { Tool } from "../lib/tools";
import { CONTENT_REVIEW_DATE } from "../lib/content-review";
import type { Locale } from "../lib/site";
import { getToolGuidanceDetails } from "../lib/tool-guidance";
import { getToolDeepDive } from "../lib/tool-deep-dives";

const methodology = {
  prompt: {
    tr: "Hedef, bağlam, çıktı sözleşmesi ve çelişen kısıtlar ayrı ayrı incelenir. Araç bir dil modeli çalıştırmaz; yalnızca görünür kuralları uygular.",
    en: "Goal, context, output contract, and conflicting constraints are inspected separately. The tool runs no language model and applies only visible rules.",
    de: "Ziel, Kontext, Ausgabevertrag und widersprüchliche Bedingungen werden getrennt geprüft. Das Werkzeug nutzt kein Sprachmodell und wendet nur sichtbare Regeln an.",
    zh: "分别检查目标、上下文、输出约定与冲突约束。该工具不运行语言模型，只应用页面公开的规则。",
  },
  text: {
    tr: "Metin, Unicode ve satır sınırları korunarak deterministik kurallarla işlenir. Anlam, niyet veya doğruluk hakkında otomatik otorite iddiası üretilmez.",
    en: "Text is processed with deterministic rules that preserve Unicode and line boundaries. The result makes no authoritative claim about meaning, intent, or truth.",
    de: "Text wird mit deterministischen Regeln unter Erhalt von Unicode- und Zeilengrenzen verarbeitet. Das Ergebnis erhebt keinen verbindlichen Anspruch auf Bedeutung, Absicht oder Wahrheit.",
    zh: "文本按确定性规则处理，并保留 Unicode 与行边界。结果不会对语义、意图或真实性作权威判断。",
  },
  data: {
    tr: "Girdi önce ayrıştırılır; geçersiz yapı açık hata üretir. Başarılı çıktı, alan ve tür kaybını fark edebilmeniz için yapılandırılmış biçimde gösterilir.",
    en: "Input is parsed before transformation and malformed structures produce an explicit error. Successful output remains structured so field or type loss can be reviewed.",
    de: "Eingaben werden vor der Umwandlung geparst; fehlerhafte Strukturen erzeugen eine klare Meldung. Strukturierte Ausgaben machen Feld- oder Typverluste prüfbar.",
    zh: "转换前先解析输入，格式错误会生成明确提示。成功输出保持结构化，便于检查字段或类型是否丢失。",
  },
  security: {
    tr: "Sonuç yalnızca açıklanabilir bir ön kontroldür. Kimlik doğrulama, zararlı yazılım kararı, mevzuat uygunluğu veya profesyonel güvenlik incelemesi yerine geçmez.",
    en: "The result is an explainable pre-check only. It does not replace authentication, a malware verdict, regulatory assessment, or professional security review.",
    de: "Das Ergebnis ist nur eine erklärbare Vorprüfung. Es ersetzt weder Authentifizierung, Schadsoftwarebewertung, Rechtsprüfung noch professionelle Sicherheitsanalyse.",
    zh: "结果仅为可解释的初步检查，不能替代身份验证、恶意软件判定、法规评估或专业安全审查。",
  },
  converter: {
    tr: "Dönüşümden sonra çıktı biçimi yeniden doğrulanır; kayıplı veya tarayıcıya bağlı işlemler ayrıca belirtilir. Kritik dosyalarda özgün kopya korunmalıdır.",
    en: "The target format is validated after conversion and lossy or browser-dependent behavior is disclosed. Keep the original copy for important files.",
    de: "Das Zielformat wird nach der Umwandlung geprüft; verlustbehaftetes oder browserabhängiges Verhalten wird offengelegt. Wichtige Originaldateien sollten erhalten bleiben.",
    zh: "转换后会再次验证目标格式，并说明有损或依赖浏览器的行为。重要文件应保留原始副本。",
  },
  calculation: {
    tr: "Formül, birim, yuvarlama ve dahil etme kuralları görünür tutulur. Finansal, hukuki, akademik veya sağlıkla ilgili sonuçlar yetkili kaynakla doğrulanmalıdır.",
    en: "Formula, units, rounding, and inclusion rules remain visible. Financial, legal, academic, or health-related results require verification with an authoritative source.",
    de: "Formel, Einheiten, Rundung und Einbeziehungsregeln bleiben sichtbar. Finanzielle, rechtliche, akademische oder gesundheitliche Ergebnisse sind fachlich zu prüfen.",
    zh: "公式、单位、舍入与纳入规则保持可见。涉及财务、法律、学术或健康的结果须由权威来源复核。",
  },
  general: {
    tr: "İşlem sınırları, örnek girdi ve hata yolu birlikte gösterilir. Çıktı yalnızca açıklanan kullanım senaryosu için değerlendirilmelidir.",
    en: "Processing limits, sample input, and the failure path are shown together. Evaluate output only for the disclosed use case.",
    de: "Verarbeitungsgrenzen, Beispieleingabe und Fehlerweg werden gemeinsam gezeigt. Ergebnisse gelten nur für den beschriebenen Anwendungsfall.",
    zh: "处理边界、示例输入与失败路径会一并说明。输出仅适用于页面公开的使用场景。",
  },
  ai: {
    tr: "Araç uzak model veya üretken LLM kullanmaz. Yerel, açıklanabilir sezgiler öneri üretir; bağlamı ve son kararı kullanıcı sağlar.",
    en: "The tool uses no remote model or generative LLM. Local explainable heuristics produce suggestions while the user supplies context and the final decision.",
    de: "Das Werkzeug verwendet weder ein entferntes Modell noch ein generatives LLM. Lokale, erklärbare Heuristiken liefern Hinweise; Kontext und Entscheidung bleiben beim Menschen.",
    zh: "该工具不使用远程模型或生成式 LLM。本地可解释启发式规则提供建议，语境与最终决定由用户负责。",
  },
  codeSecurity: {
    tr: "Kod çalıştırılmaz; yalnızca statik desen ve sözleşmeler incelenir. Bulgu olmaması güvenlik açığı bulunmadığını kanıtlamaz.",
    en: "Code is not executed; only static patterns and contracts are inspected. No finding does not prove the absence of a vulnerability.",
    de: "Code wird nicht ausgeführt; geprüft werden nur statische Muster und Verträge. Kein Fund beweist nicht die Abwesenheit einer Schwachstelle.",
    zh: "代码不会执行，仅检查静态模式与约定。未发现问题并不能证明不存在安全漏洞。",
  },
  research: {
    tr: "Araç kaynak, tarih, iddia ve kanıt kaydını düzenler; kaynağın doğruluğunu kendiliğinden kanıtlamaz. Birincil kaynak ve güncellik ayrıca kontrol edilmelidir.",
    en: "The tool organises source, date, claim, and evidence records; it does not prove a source true. Recency and primary evidence must be checked separately.",
    de: "Das Werkzeug ordnet Quelle, Datum, Behauptung und Beleg; es beweist keine Quellenwahrheit. Aktualität und Primärbelege müssen separat geprüft werden.",
    zh: "该工具整理来源、日期、主张与证据记录，但不会自动证明来源真实。仍需单独核对时效性与一手证据。",
  },
} as const;

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

function scenarioNarrative(locale: Locale, index: number, useCase: string, guidance: ReturnType<typeof getToolGuidanceDetails>) {
  const action = {
    tr: [
      `Önce bu ihtiyacı temsil eden küçük ve sentetik bir örnek hazırlayın. Beklenen girdi: ${guidance.input.tr}.`,
      `Aynı örneği değişmeden koruyup cihaz içi yöntemi çalıştırın: ${guidance.method.tr}`,
      `Sonucu hedef sürece taşımadan önce çıktı kaydını saklayın: ${guidance.output.tr}.`,
    ],
    en: [
      `Start with a small synthetic fixture that represents this need. Expected input: ${guidance.input.en}.`,
      `Keep that fixture unchanged and run the on-device method: ${guidance.method.en}`,
      `Retain the output record before moving it into the target workflow: ${guidance.output.en}.`,
    ],
    de: [
      `Zuerst ein kleines synthetisches Beispiel für diesen Bedarf vorbereiten. Erwartete Eingabe: ${guidance.input.de}.`,
      `Dieses Beispiel unverändert lassen und die lokale Methode ausführen: ${guidance.method.de}`,
      `Vor der Übergabe in den Zielprozess die Ausgabe dokumentieren: ${guidance.output.de}.`,
    ],
    zh: [
      `先准备一个代表该需求的小型合成样本。预期输入：${guidance.input.zh}。`,
      `保持样本不变并运行设备端方法：${guidance.method.zh}`,
      `将结果交给目标流程前，先保留输出记录：${guidance.output.zh}。`,
    ],
  }[locale][index] ?? "";
  const check = {
    tr: [`Örnek, “${useCase}” ihtiyacını gerçek kişisel veri kullanmadan yeniden üretebilmelidir.`, `Aynı girdi aynı sonucu vermeli; yöntemin dışındaki hiçbir ağ veya dosya işlemi varsayılmamalıdır.`, `Kabul için ${guidance.verification.tr}; aksi durumda sonucu ilerletmeyin.`],
    en: [`The fixture should reproduce “${useCase}” without real personal data.`, `Identical input should return the same result, with no network or file action assumed beyond the disclosed method.`, `Acceptance requires ${guidance.verification.en}; otherwise do not move the result forward.`],
    de: [`Das Beispiel soll „${useCase}“ ohne echte Personendaten reproduzieren.`, `Dieselbe Eingabe soll dasselbe Ergebnis liefern; keine nicht offengelegte Netz- oder Dateiaktion annehmen.`, `Für die Abnahme gilt: ${guidance.verification.de}; andernfalls nicht weitergeben.`],
    zh: [`样本应在不使用真实个人数据的情况下复现“${useCase}”。`, `相同输入应得到相同结果，不得假设公开方法之外的网络或文件操作。`, `验收要求：${guidance.verification.zh}；否则不要继续传递结果。`],
  }[locale][index] ?? "";
  return { action, check };
}

export function ToolEditorialReview({ tool, locale }: { tool: Tool; locale: Locale }) {
  const t = copy[locale];
  const guidance = getToolGuidanceDetails(tool);
  const deepDive = getToolDeepDive(tool.slug);
  return (
    <section className="container tool-editorial-review is-published" data-editorial-status="published" data-editorial-depth="applied" data-content-depth="task-specific" aria-labelledby={`editorial-${tool.slug}`}>
      <div className="tool-editorial-heading">
        <div><span className="kicker">{t.eyebrow}</span><h2 id={`editorial-${tool.slug}`}>{t.title(tool.title[locale])}</h2></div>
        <span className="tool-editorial-badge">✓ {t.badge}</span>
      </div>
      <p>{t.body(tool.title[locale], tool.description[locale])}</p>
      <div className="tool-editorial-grid">
        <article><strong>{t.method}</strong><p>{guidance.method[locale]} {methodology[tool.category][locale]}</p></article>
        <article><strong>{t.input}</strong><p>{guidance.input[locale]} {({ tr: "Biçimi önce kişisel veri içermeyen küçük bir örnekle doğrulayın.", en: "Confirm the shape first with a small example containing no personal data.", de: "Das Format zuerst mit einem kleinen Beispiel ohne Personendaten prüfen.", zh: "请先用不含个人数据的小样本确认格式。" } as const)[locale]}</p></article>
        <article><strong>{t.output}</strong><p>{guidance.output[locale]} — {guidance.verification[locale]}</p></article>
      </div>
      <div className="tool-editorial-scenarios" data-tool-acceptance="three-scenario">
        <h3>{t.scenarios}</h3>
        <div>{tool.useCases[locale].map((useCase, index) => { const scenario = scenarioNarrative(locale, index, useCase, guidance); return <article key={useCase}><span>{String(index + 1).padStart(2, "0")}</span><h4>{useCase}</h4><p><b>{t.action}:</b> {scenario.action}</p><p><b>{t.check}:</b> {scenario.check}</p></article>; })}</div>
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
