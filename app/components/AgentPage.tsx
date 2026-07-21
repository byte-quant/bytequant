import Link from "next/link";
import type { CSSProperties } from "react";
import { absoluteUrl, languageTag, organizationId, pathFor, siteUrl, websiteId, type Locale } from "../lib/site";
import { AgenticAssistant } from "./AgenticAssistant";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

const content = {
  tr: {
    eyebrow: "TAMAMEN YEREL · AÇIKLANABİLİR · KULLANICI DENETİMLİ", title: "Hedefinizi yazın; ByteQuant araçlarıyla denetlenebilir bir akış kurun",
    intro: "Yerel Ajan, doğal dildeki hedefinizi analiz eder, uygun araçları bulur ve çok adımlı bir plan oluşturur. Planı siz onaylar, her adımı siz çalıştırırsınız; veri ve muhakeme özeti bu sekmeden çıkmaz.",
    badges: ["131 araçla senkronize", "0 uzak model çağrısı", "Görünür karar özeti"],
    howTitle: "Tek bir zeki katman, mevcut araçların tamamı", howIntro: "Araçların çekirdek işlevleri değişmedi. Ajan yalnızca keşif, planlama ve açıkça onayladığınız veri aktarımını koordine eder.",
    cards: [["01", "Anla", "Çok dilli semantik puanlama hedefi, formatları ve gizlilik sinyallerini çıkarır."], ["02", "Planla", "Sürüm kontrollü kurallar uygun araçları sıralar ve her seçimin gerekçesini gösterir."], ["03", "Çalıştır", "Adımları tek tek açar; giriş ve çıktıyı yalnızca sizin eyleminizle bu sekmede devreder."], ["04", "Doğrula", "Hata tercümanı olası nedeni, güvenli kontrolleri ve yöntemin sınırını açıklar."]],
    privacyTitle: "Gerçek tarayıcı içi mimari", privacy: ["Ne prompt ne araç girdisi ByteQuant sunucusuna veya üçüncü taraf modele gönderilir.", "Plan sessionStorage içinde yalnızca açık sekme boyunca tutulur; localStorage'a içerik yazılmaz.", "Sesli giriş, yalnızca tarayıcı cihaz içi işlemeyi doğruladığında etkinleşir; uzak tanımaya geri dönüş yapılmaz.", "Bu sistem üretken bir temel model değildir. Açıklanabilir hibrit arama ve planlama motorudur; hukuki, güvenlik veya kimlik doğrulama kararı vermez."],
    faq: [["Yerel Ajan bir LLM mi?", "Hayır. Gizli ağırlıkları veya uzak çıkarımı olan üretken bir LLM değildir. Çok dilli semantik eşleştirme ve açıklanabilir, sürüm kontrollü plan kuralları kullanır."], ["Araçları benden habersiz çalıştırabilir mi?", "Hayır. Dosya seçimi, araç çalıştırma, indirme ve adım geçişleri kullanıcı eylemi gerektirir."], ["Ses kaydı gönderiliyor mu?", "Hayır. Ses düğmesi yalnızca tarayıcı cihaz içi konuşma tanımayı doğruladığında açılır; başka durumda ses alınmaz."], ["Karar özeti gerçek düşünce zinciri mi?", "Hayır. Gizli iç muhakeme gösterilmez. Görünür özet; eşleşen sinyalleri, çıkarılan parametreleri, araç seçimi nedenini ve sınırları listeler."]],
    cta: "Yerel planlamayı deneyin",
  },
  en: {
    eyebrow: "FULLY LOCAL · EXPLAINABLE · USER-CONTROLLED", title: "Describe the outcome; build an auditable workflow across ByteQuant tools",
    intro: "Local Agent analyzes a natural-language goal, finds suitable tools, and creates a multi-step plan. You approve and run every step; data and the decision summary stay in this tab.",
    badges: ["Synced with 131 tools", "0 remote model calls", "Visible decision summary"],
    howTitle: "One intelligent layer across every existing tool", howIntro: "Core tool behavior is unchanged. The agent coordinates discovery, planning, and only the data handoff you explicitly approve.",
    cards: [["01", "Understand", "Multilingual semantic scoring extracts the goal, formats, and privacy signals."], ["02", "Plan", "Versioned rules rank suitable tools and disclose the reason for each choice."], ["03", "Run", "Open each step and pass input or output inside this tab only when you act."], ["04", "Verify", "The error translator explains a likely cause, safe checks, and the method boundary."]],
    privacyTitle: "A genuinely in-browser architecture", privacy: ["Neither prompts nor tool inputs go to a ByteQuant server or third-party model.", "The plan uses sessionStorage for the open tab only; content is never written to localStorage.", "Voice input activates only after the browser verifies on-device processing; there is no remote fallback.", "This is not a generative foundation model. It is an explainable hybrid search and planning engine, not legal, security, or identity verification."],
    faq: [["Is Local Agent an LLM?", "No. It is not a generative LLM with hidden weights or remote inference. It uses multilingual semantic matching and explainable, versioned planning rules."], ["Can it run tools without me?", "No. File selection, tool execution, downloads, and step transitions require user action."], ["Is voice sent anywhere?", "No. The voice control starts only if the browser verifies on-device speech recognition; otherwise it captures nothing."], ["Is the decision summary chain-of-thought?", "No. Hidden internal reasoning is not exposed. The summary lists matched signals, extracted parameters, tool-choice reasons, and limitations."]],
    cta: "Try local planning",
  },
  de: {
    eyebrow: "VOLLSTÄNDIG LOKAL · NACHVOLLZIEHBAR · NUTZERGESTEUERT", title: "Ziel beschreiben und einen prüfbaren Ablauf mit ByteQuant-Werkzeugen erstellen",
    intro: "Der lokale Agent analysiert Ihr Ziel, findet passende Werkzeuge und erstellt einen mehrstufigen Plan. Sie bestätigen und starten jeden Schritt; Daten und Entscheidungsübersicht bleiben in diesem Tab.",
    badges: ["Mit 131 Werkzeugen synchronisiert", "0 Remote-Modellaufrufe", "Sichtbare Entscheidungsübersicht"],
    howTitle: "Eine intelligente Ebene über allen bestehenden Werkzeugen", howIntro: "Die Kernfunktionen bleiben unverändert. Der Agent koordiniert Suche, Planung und nur die von Ihnen bestätigte Datenübergabe.",
    cards: [["01", "Verstehen", "Mehrsprachige semantische Bewertung erkennt Ziel, Formate und Datenschutzsignale."], ["02", "Planen", "Versionierte Regeln ordnen Werkzeuge und legen die Auswahlgründe offen."], ["03", "Ausführen", "Jeder Schritt wird einzeln geöffnet; Übergaben erfolgen nur durch Ihre Aktion in diesem Tab."], ["04", "Prüfen", "Der Fehlerübersetzer nennt mögliche Ursache, sichere Prüfungen und Methodengrenzen."]],
    privacyTitle: "Echte Browser-Architektur", privacy: ["Prompts und Eingaben gehen weder an ByteQuant-Server noch an Drittmodelle.", "Der Plan bleibt nur im sessionStorage des offenen Tabs; Inhalte landen nicht in localStorage.", "Spracheingabe wird nur bei bestätigter lokaler Verarbeitung aktiviert; kein Remote-Fallback.", "Kein generatives Basismodell, sondern nachvollziehbare hybride Suche und Planung; keine Rechts-, Sicherheits- oder Identitätsprüfung."],
    faq: [["Ist der lokale Agent ein LLM?", "Nein. Er verwendet mehrsprachige semantische Zuordnung und nachvollziehbare, versionierte Planregeln ohne Remote-Inferenz."], ["Kann er Werkzeuge selbstständig starten?", "Nein. Dateiauswahl, Ausführung, Downloads und Schrittwechsel erfordern Ihre Aktion."], ["Wird Sprache übertragen?", "Nein. Die Aufnahme startet nur bei bestätigter lokaler Spracherkennung."], ["Ist die Übersicht eine Gedankenkette?", "Nein. Sie zeigt Signale, Parameter, Auswahlgründe und Grenzen statt verborgener interner Überlegungen."]],
    cta: "Lokale Planung testen",
  },
  zh: {
    eyebrow: "完全本地 · 可解释 · 用户控制", title: "描述目标，用 ByteQuant 工具建立可审计的工作流",
    intro: "本地助手分析自然语言目标、查找合适工具并创建多步骤计划。每一步都由您确认和运行；数据与决策摘要不会离开当前标签页。",
    badges: ["同步 131 个工具", "0 次远程模型调用", "决策摘要可见"],
    howTitle: "一个智能层，连接全部现有工具", howIntro: "工具核心功能保持不变。助手只协调发现、规划以及您明确批准的数据传递。",
    cards: [["01", "理解", "多语言语义评分提取目标、格式和隐私信号。"], ["02", "规划", "版本化规则排列合适工具，并公开每项选择的理由。"], ["03", "运行", "逐步打开工具；只有在您操作时才在当前标签页传递输入和输出。"], ["04", "核验", "错误解释器给出可能原因、安全检查和方法边界。"]],
    privacyTitle: "真正的浏览器内架构", privacy: ["提示词和工具输入都不会发往 ByteQuant 服务器或第三方模型。", "计划只在当前标签页的 sessionStorage 中保留，内容不会写入 localStorage。", "仅当浏览器确认设备端处理时才启用语音；没有远程回退。", "它不是生成式基础模型，而是可解释的混合搜索和规划引擎，不提供法律、安全或身份验证结论。"],
    faq: [["本地助手是 LLM 吗？", "不是。它不含隐藏权重或远程推理，而是使用多语言语义匹配和可解释的版本化规划规则。"], ["它能在我不知情时运行工具吗？", "不能。选择文件、运行工具、下载和步骤切换都需要用户操作。"], ["语音会被发送吗？", "不会。只有浏览器确认设备端语音识别时才会开始，否则不会采集。"], ["决策摘要是思维链吗？", "不是。摘要列出匹配信号、提取参数、选用理由和限制，不披露隐藏内部推理。"]],
    cta: "体验本地规划",
  },
} as const;

export function AgentPage({ locale }: { locale: Locale }) {
  const c = content[locale];
  const pageUrl = absoluteUrl(pathFor(locale, "agent"));
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebApplication", "@id": `${pageUrl}#application`, name: `ByteQuant ${locale === "tr" ? "Yerel Ajan" : locale === "en" ? "Local Agent" : locale === "de" ? "Lokaler Agent" : "本地助手"}`, url: pageUrl, description: c.intro, applicationCategory: "ProductivityApplication", operatingSystem: "Any modern browser", browserRequirements: "JavaScript enabled; on-device speech recognition is optional", inLanguage: languageTag(locale), isAccessibleForFree: true, creator: { "@id": organizationId }, isPartOf: { "@id": websiteId }, featureList: c.cards.map((item) => item[1]), offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: locale === "tr" ? "Ana sayfa" : locale === "en" ? "Home" : locale === "de" ? "Startseite" : "首页", item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: c.title, item: pageUrl }] },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: languageTag(locale), mainEntity: c.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];
  return <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "agent")} languageHrefs={{ tr: pathFor("tr", "agent"), en: pathFor("en", "agent"), de: pathFor("de", "agent"), zh: pathFor("zh", "agent") }}>
    <SchemaScript data={schemas} />
    <section className="agent-hero"><div className="container agent-hero-grid"><div><span className="eyebrow"><i />{c.eyebrow}</span><h1>{c.title}</h1><p>{c.intro}</p><div className="agent-badges">{c.badges.map((item) => <span key={item}>✓ {item}</span>)}</div><div className="product-hero-actions"><a className="primary-button agent-launch-button" href="#local-agent"><b aria-hidden="true">✦</b><span>{c.cta}</span><i aria-hidden="true">→</i></a><Link className="secondary-button product-cross-link" href={pathFor(locale, "workstation")}><span>{locale === "tr" ? "İş İstasyonuna geç" : locale === "de" ? "Zur Workstation" : locale === "zh" ? "前往工作站" : "Go to Workstation"}</span><i aria-hidden="true">⌘</i></Link></div></div><div className="agent-orbit" aria-hidden="true"><span className="agent-orbit-core">BQ<small>Agent</small></span>{["{}", "PDF", "AI", "CSV", "🔒", "⌘"].map((item, index) => <i key={item} style={{ "--orbit-index": index } as CSSProperties}>{item}</i>)}</div></div></section>
    <section id="local-agent" className="section agent-console-section"><div className="container"><AgenticAssistant locale={locale} /></div></section>
    <section className="section agent-how"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">LOCAL-FIRST ORCHESTRATION</span><h2>{c.howTitle}</h2></div><p>{c.howIntro}</p></div><div className="agent-how-grid">{c.cards.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section agent-privacy"><div className="container agent-privacy-grid"><div><span className="kicker">PRIVACY BY ARCHITECTURE</span><h2>{c.privacyTitle}</h2><p>{siteUrl.replace("https://", "")} · HTTPS · {{ tr: "yerel planlama", en: "local planning", de: "lokale Planung", zh: "本地规划" }[locale]}</p></div><ul>{c.privacy.map((item) => <li key={item}><span>✓</span><p>{item}</p></li>)}</ul></div></section>
    <section className="section compact-faq"><div className="container"><div className="section-heading centered"><span className="kicker">FAQ</span><h2>{locale === "tr" ? "Yerel Ajan hakkında" : locale === "en" ? "About Local Agent" : locale === "de" ? "Über den lokalen Agenten" : "关于本地助手"}</h2></div><div className="faq-list narrow">{c.faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div><div className="center-action"><Link className="secondary-button" href={pathFor(locale, "tools")}>{locale === "tr" ? "Tüm araçları keşfet" : locale === "en" ? "Explore all tools" : locale === "de" ? "Alle Werkzeuge" : "浏览全部工具"} →</Link></div></div></section>
  </SiteShell>;
}
