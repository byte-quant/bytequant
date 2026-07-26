import Link from "next/link";
import { absoluteUrl, languageTag, organizationId, pathFor, siteUrl, websiteId, type Locale } from "../lib/site";
import { AgenticAssistant } from "./AgenticAssistant";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

const content = {
  tr: {
    eyebrow: "YEREL AKIŞ YARDIMCISI",
    title: "Hedefinizi yazın, uygulanabilir yolu birlikte çıkaralım",
    intro: "Araç adı bilmeniz gerekmez. Ne elde etmek istediğinizi günlük dille anlatın; Yerel Ajan uygun adımları bulsun, siz de her adımı onaylayarak ilerleyin.",
    start: "Sohbete başla", workspace: "Görsel akış kur",
    steps: [["1", "Anlat", "Sonucu kendi cümlelerinizle yazın."], ["2", "Planı görün", "Araçları, sırayı ve güvenlik notlarını kontrol edin."], ["3", "Uygulayın", "Her adımı siz başlatın; içerik bu sekmede kalsın."]],
    howTitle: "Ajan ne yapar, ne yapmaz?", howIntro: "Bu sayfa araçların yerine geçmez; doğru aracı bulmayı ve güvenli bir sıra kurmayı kolaylaştırır.",
    cards: [["01", "İhtiyacı anlar", "Hedef, dosya biçimi ve gizlilik sinyallerini eşleştirir."], ["02", "Kısa plan kurar", "Uygun araçları gerekçesiyle sıralar ve eksik bilgiyi sorar."], ["03", "Kontrolü sizde tutar", "Dosya seçimi, çalıştırma ve indirme yalnızca sizin eyleminizle olur."], ["04", "Sonraki adımı açıklar", "Hata mesajını sadeleştirir ve yakın alternatifleri gösterir."]],
    privacyTitle: "İçeriğiniz cihazınızdan çıkmaz",
    privacy: ["Hedef metni ve araç girdileri ByteQuant sunucusuna veya üçüncü taraf modele gönderilmez.", "Kısa konuşma belleği yalnızca açık sekmenin sessionStorage alanında tutulur.", "Ses girişi yalnızca tarayıcı cihaz içi işlemeyi doğrularsa açılır; uzak servise geri dönüş yoktur.", "Yerel Ajan üretken bir LLM değildir; açıklanabilir arama ve planlama motorudur. Hukuki, güvenlik veya kimlik doğrulama kararı vermez."],
    faq: [["Yerel Ajan gerçekten çalışıyor mu?", "Evet. Hedefi çok dilli semantik eşleştirme ve sürümlenmiş plan kurallarıyla araç kataloğuna bağlar. Sonuçlar rastgele üretilmez ve ağ çağrısı yapılmaz."], ["Bir sohbeti hatırlar mı?", "Aynı sekmedeki son hedefleri ve planları hatırlar; yeni sekme veya kapatılan sekmeyle bu geçici bellek sona erer."], ["Araçları kendiliğinden çalıştırır mı?", "Hayır. Dosya seçimi, araç çalıştırma, çıktı aktarımı ve indirme kullanıcı onayı gerektirir."], ["Neden bir LLM kullanılmıyor?", "İçeriği dışarı göndermeden hızlı ve öngörülebilir çalışmak için. Açıkça desteklenmeyen bir istekte Ajan bunu belirtir ve yakın araçları önerir."]],
  },
  en: {
    eyebrow: "LOCAL WORKFLOW HELPER", title: "Describe the outcome and build a practical path together", intro: "You do not need to know tool names. Describe what you want to finish in everyday language; Local Agent will find suitable steps while you approve every action.", start: "Start a conversation", workspace: "Build a visual flow",
    steps: [["1", "Describe", "Write the outcome in your own words."], ["2", "Review", "Check the tools, order, and safety notes."], ["3", "Run", "You start every step and content stays in this tab."]],
    howTitle: "What the Agent does—and does not do", howIntro: "It does not replace the tools. It makes the right tool and a safer order easier to find.",
    cards: [["01", "Understands the need", "Matches the outcome, file format, and privacy signals."], ["02", "Builds a short plan", "Orders suitable tools, explains why, and asks for missing details."], ["03", "Keeps you in control", "File selection, execution, and downloads happen only when you act."], ["04", "Explains the next move", "Turns common errors into plain language and offers nearby alternatives."]],
    privacyTitle: "Your content stays on your device", privacy: ["Goals and tool inputs are never sent to a ByteQuant server or third-party model.", "Short conversation memory stays in sessionStorage for the open tab only.", "Voice input starts only when the browser verifies on-device processing; there is no remote fallback.", "Local Agent is not a generative LLM. It is an explainable search and planning engine, not legal, security, or identity verification."],
    faq: [["Does Local Agent really work?", "Yes. It connects the goal to the tool catalog with multilingual semantic matching and versioned planning rules. It makes no network model call."], ["Does it remember a conversation?", "It remembers recent goals and plans in the same tab. Closing the tab ends this temporary memory."], ["Can it run tools on its own?", "No. File selection, tool execution, output handoff, and downloads require your action."], ["Why is there no LLM?", "To remain fast, predictable, and private without sending content elsewhere. Unsupported requests are disclosed and nearby tools are suggested."]],
  },
  de: {
    eyebrow: "LOKALER ABLAUFHELFER", title: "Ziel beschreiben und gemeinsam einen praktischen Weg erstellen", intro: "Werkzeugnamen sind nicht nötig. Beschreiben Sie das Ergebnis in Alltagssprache; der lokale Agent findet passende Schritte, während Sie jede Aktion bestätigen.", start: "Gespräch starten", workspace: "Visuellen Ablauf bauen",
    steps: [["1", "Beschreiben", "Ergebnis in eigenen Worten formulieren."], ["2", "Prüfen", "Werkzeuge, Reihenfolge und Sicherheitshinweise ansehen."], ["3", "Ausführen", "Sie starten jeden Schritt; Inhalte bleiben im Tab."]],
    howTitle: "Was der Agent kann – und was nicht", howIntro: "Er ersetzt die Werkzeuge nicht, sondern erleichtert die Auswahl und eine sichere Reihenfolge.",
    cards: [["01", "Versteht den Bedarf", "Ordnet Ziel, Dateiformat und Datenschutzsignale zu."], ["02", "Erstellt einen kurzen Plan", "Sortiert passende Werkzeuge, nennt Gründe und fragt fehlende Angaben ab."], ["03", "Lässt die Kontrolle bei Ihnen", "Dateiauswahl, Ausführung und Download erfolgen nur durch Ihre Aktion."], ["04", "Erklärt den nächsten Schritt", "Vereinfacht typische Fehler und zeigt nahe Alternativen."]],
    privacyTitle: "Ihre Inhalte bleiben auf dem Gerät", privacy: ["Ziele und Eingaben gehen weder an ByteQuant-Server noch an Drittmodelle.", "Kurzes Gesprächsgedächtnis bleibt nur im sessionStorage des geöffneten Tabs.", "Spracheingabe startet nur bei bestätigter lokaler Verarbeitung; kein Remote-Fallback.", "Der lokale Agent ist kein generatives LLM, sondern nachvollziehbare Suche und Planung; keine Rechts-, Sicherheits- oder Identitätsprüfung."],
    faq: [["Funktioniert der lokale Agent wirklich?", "Ja. Mehrsprachige semantische Zuordnung und versionierte Regeln verbinden das Ziel mit dem Werkzeugkatalog; ohne Modellaufruf im Netz."], ["Merkt er sich ein Gespräch?", "Ziele und Pläne bleiben im selben Tab im Kurzzeitgedächtnis. Beim Schließen endet es."], ["Kann er Werkzeuge selbst starten?", "Nein. Dateiauswahl, Ausführung, Übergabe und Download erfordern Ihre Aktion."], ["Warum wird kein LLM verwendet?", "Damit Inhalte lokal, schnell und vorhersehbar bleiben. Nicht unterstützte Wünsche werden offengelegt und Alternativen vorgeschlagen."]],
  },
  zh: {
    eyebrow: "本地工作流助手", title: "描述目标，一起生成可执行的路径", intro: "无需记住工具名称。用日常语言说明想完成什么；本地助手会推荐合适步骤，每一步都由您确认。", start: "开始对话", workspace: "创建可视化流程",
    steps: [["1", "描述", "用自己的话说明结果。"], ["2", "检查", "确认工具、顺序和安全提示。"], ["3", "执行", "每一步由您启动，内容留在当前标签页。"]],
    howTitle: "助手能做什么、不能做什么", howIntro: "它不会替代工具，而是帮助您找到合适工具和更安全的顺序。",
    cards: [["01", "理解需求", "匹配目标、文件格式与隐私信号。"], ["02", "生成短计划", "排列合适工具、解释原因并询问缺失信息。"], ["03", "由您控制", "文件选择、执行和下载都需要您的操作。"], ["04", "说明下一步", "用简单语言解释常见错误并提供相近替代方案。"]],
    privacyTitle: "内容留在您的设备上", privacy: ["目标和工具输入不会发送到 ByteQuant 服务器或第三方模型。", "短期对话记忆只保存在当前标签页的 sessionStorage 中。", "仅在浏览器确认设备端处理时启用语音输入；没有远程回退。", "本地助手不是生成式 LLM，而是可解释的搜索与规划引擎，不提供法律、安全或身份验证结论。"],
    faq: [["本地助手真的会工作吗？", "会。它使用多语言语义匹配和版本化规划规则，把目标连接到工具目录，不调用网络模型。"], ["它会记住对话吗？", "会记住同一标签页中的近期目标和计划；关闭标签页后临时记忆结束。"], ["它能自动运行工具吗？", "不能。文件选择、工具执行、输出传递和下载都需要您的操作。"], ["为什么不使用 LLM？", "这样无需把内容发送到外部，也能保持快速、可预测。对于不支持的请求会明确说明并推荐相近工具。"]],
  },
} as const;

export function AgentPage({ locale }: { locale: Locale }) {
  const c = content[locale];
  const pageUrl = absoluteUrl(pathFor(locale, "agent"));
  const agentName = locale === "tr" ? "Yerel Ajan" : locale === "en" ? "Local Agent" : locale === "de" ? "Lokaler Agent" : "本地助手";
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebApplication", "@id": `${pageUrl}#application`, name: `ByteQuant ${agentName}`, url: pageUrl, description: c.intro, applicationCategory: "ProductivityApplication", operatingSystem: "Any modern browser", browserRequirements: "JavaScript enabled; on-device speech recognition is optional", inLanguage: languageTag(locale), isAccessibleForFree: true, creator: { "@id": organizationId }, isPartOf: { "@id": websiteId }, featureList: c.cards.map((item) => item[1]), offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: locale === "tr" ? "Ana sayfa" : locale === "en" ? "Home" : locale === "de" ? "Startseite" : "首页", item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: c.title, item: pageUrl }] },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: languageTag(locale), mainEntity: c.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];
  return <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "agent")} languageHrefs={{ tr: pathFor("tr", "agent"), en: pathFor("en", "agent"), de: pathFor("de", "agent"), zh: pathFor("zh", "agent") }}>
    <SchemaScript data={schemas} />
    <section className="agent-product-intro"><div className="container agent-product-intro-grid"><div><span className="eyebrow"><i />{c.eyebrow}</span><h1>{c.title}</h1><p>{c.intro}</p><div className="agent-intro-actions"><a className="primary-button" href="#local-agent">{c.start} <span aria-hidden="true">↓</span></a><Link className="secondary-button" href={pathFor(locale, "workstation")}>{c.workspace} <span aria-hidden="true">→</span></Link></div></div><ol>{c.steps.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><small>{text}</small></div></li>)}</ol></div></section>
    <section id="local-agent" className="section agent-console-section"><div className="container"><AgenticAssistant locale={locale} /></div></section>
    <section className="section agent-how"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">LOCAL-FIRST</span><h2>{c.howTitle}</h2></div><p>{c.howIntro}</p></div><div className="agent-how-grid">{c.cards.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section agent-privacy"><div className="container agent-privacy-grid"><div><span className="kicker">PRIVACY BY DESIGN</span><h2>{c.privacyTitle}</h2><p>{siteUrl.replace("https://", "")} · HTTPS · {agentName}</p></div><ul>{c.privacy.map((item) => <li key={item}><span>✓</span><p>{item}</p></li>)}</ul></div></section>
    <section className="section compact-faq"><div className="container"><div className="section-heading centered"><span className="kicker">FAQ</span><h2>{locale === "tr" ? "Kısa ve açık yanıtlar" : locale === "de" ? "Kurze, klare Antworten" : locale === "zh" ? "简明解答" : "Short, clear answers"}</h2></div><div className="faq-list narrow">{c.faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>
  </SiteShell>;
}
