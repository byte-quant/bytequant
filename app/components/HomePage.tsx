import Link from "next/link";
import { posts } from "../lib/posts";
import { categories, tools, type ToolCategory } from "../lib/tools";
import { absoluteUrl, copy, languageTag, organizationId, pathFor, postPath, toolPath, websiteId, type Locale } from "../lib/site";
import { AdSlot } from "./AdSlot";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { ToolCard } from "./ToolCard";
import { PopularTools } from "./ToolUsage";
import { PwaInstall } from "./PwaInstall";
import { localizedGuides } from "../lib/localized-guides";

const faqs = {
  tr: [
    ["ByteQuant'a yazdığım metinler sunucuya gönderiliyor mu?", "Hayır. Araçların temel analiz ve dönüşüm işlemleri tarayıcınızda JavaScript ve Web API'leriyle çalışır. Girdi alanlarındaki içerik ByteQuant sunucularına gönderilmez."],
    ["Araçları kullanmak için üyelik gerekiyor mu?", "Hayır. Araçlar ücretsizdir ve hesap açmadan kullanılabilir. Araç girdileri tarayıcı depolamasına kaydedilmez; tema ve kişisel popüler araç sayacı yalnızca bu cihazda, hassas içerik olmadan tutulabilir."],
    ["Sonuçlar hukuki veya güvenlik garantisi verir mi?", "Hayır. Maskeleme ve analiz araçları ön kontrol sağlar. KVKK, GDPR, güvenlik veya hukuki kararlar için yetkin uzman incelemesi gerekir."],
    ["Token sayacı neden yaklaşık sonuç verir?", "Her model farklı bir tokenizer kullanır. ByteQuant, veriyi dışarı göndermeden hızlı planlama yapabilmeniz için karakter ve dil yapısına dayalı yaklaşık değer üretir."],
    ["Araçlar mobil cihazlarda çalışır mı?", "Evet. Güncel mobil tarayıcılarda temel araçlar çalışır. Web Crypto gibi bazı özellikler tarayıcı desteğine bağlıdır."],
    ["Site reklam içeriyor mu?", "Şu anda ayrılmış reklam alanları gösterilir. Reklam hizmeti etkinleştirilirse çerez, onay ve gizlilik bilgileri hizmet devreye alınmadan önce güncellenecektir."],
    ["Yeni araçların sonuçları nasıl doğrulanmalı?", "JSON Schema yalnızca örneği yansıtır, özetleyici kaynak cümleleri seçer, kredi hesabı matematiksel senaryodur ve güvenlik denetimleri ön kontroldür. Her araç yöntem sınırını gösterir; yüksek etkili sonuçları bağımsız kaynakla doğrulayın."],
    ["Görsel ve dosya araçları verimi saklıyor mu?", "Hayır. Görsel yeniden boyutlandırma ve SHA-256 hesaplama bu sekmede çalışır. Seçtiğiniz dosya sunucuya gönderilmez veya localStorage'a yazılmaz; yalnızca sizin indirdiğiniz çıktı cihazda kalır."],
  ],
  en: [
    ["Is text entered into ByteQuant sent to a server?", "No. Core analysis and transformation run in your browser using JavaScript and Web APIs. Tool input is not sent to ByteQuant servers."],
    ["Do I need an account?", "No. The tools are free and require no account. Tool input is not saved to browser storage; theme and personal popular-tool counts may stay on this device without sensitive content."],
    ["Do results provide legal or security assurance?", "No. Masking and analysis are pre-checks. KVKK, GDPR, security, and legal decisions require qualified human review."],
    ["Why is the token count approximate?", "Each model uses a different tokenizer. ByteQuant estimates from characters and language so you can plan without transmitting the text."],
    ["Do the tools work on mobile?", "Yes. Core tools work in current mobile browsers. Some features, including Web Crypto operations, depend on browser support."],
    ["Does the site contain advertising?", "Reserved advertising areas are currently shown. If an ad service is activated, consent and privacy information will be updated before launch."],
    ["How should I verify output from the new tools?", "JSON Schema reflects only its sample, summaries select source sentences, loan figures are mathematical scenarios, and security audits are pre-checks. Review each disclosed limitation and independently verify high-impact output."],
    ["Do image and file tools retain my data?", "No. Image resizing and SHA-256 run in this tab. Selected files are neither uploaded nor written to localStorage; only output you explicitly download remains on your device."],
  ],
  de: [
    ["Werden Texte, die ich in ByteQuant eingebe, an einen Server gesendet?", "Nein. Die Kernanalyse und -konvertierung läuft mit JavaScript und Web APIs in Ihrem Browser. Werkzeugeingaben werden nicht an ByteQuant-Server gesendet."],
    ["Brauche ich ein Konto?", "Nein. Die Werkzeuge sind kostenlos und ohne Konto nutzbar. Eingaben werden nicht im Browserspeicher gespeichert; nur Thema und ein optionaler lokaler Werkzeugzähler können auf diesem Gerät bleiben."],
    ["Sind Ergebnisse eine Rechts- oder Sicherheitsgarantie?", "Nein. Maskierung, Berechnung und Scans sind Vorprüfungen. Rechtliche, finanzielle und sicherheitskritische Entscheidungen erfordern qualifizierte menschliche Prüfung."],
    ["Warum sind Tokenwerte nur Schätzungen?", "Modelle verwenden unterschiedliche Tokenizer. ByteQuant schätzt lokal aus Zeichen- und Sprachstruktur, ohne Text zu übertragen."],
    ["Funktionieren die Werkzeuge mobil?", "Ja. Die Kernfunktionen laufen in aktuellen mobilen Browsern. Einige Datei- und Web-Crypto-Funktionen hängen von Browser und Gerätespeicher ab."],
    ["Enthält die Website Werbung?", "Derzeit werden nur reservierte Werbeflächen gezeigt. Vor Aktivierung eines Werbedienstes werden Einwilligung und Datenschutzinformationen aktualisiert."],
    ["Wie müssen Ergebnisse der neuen Werkzeuge geprüft werden?", "JSON Schema beschreibt nur das Beispiel, Zusammenfassungen wählen Quellsätze, Kreditwerte sind Rechenszenarien und Sicherheitsprüfungen sind Vorchecks. Prüfen Sie wichtige Ausgaben unabhängig."],
    ["Werden Bild- oder Dateidaten gespeichert?", "Nein. Bildskalierung und SHA-256 laufen in diesem Tab. Dateien werden weder hochgeladen noch in localStorage geschrieben; nur ausdrücklich heruntergeladene Ergebnisse bleiben auf Ihrem Gerät."],
  ],
  zh: [
    ["我输入 ByteQuant 的文本会发送到服务器吗？", "不会。核心分析与转换通过 JavaScript 和 Web API 在浏览器中运行，工具输入不会发送到 ByteQuant 服务器。"],
    ["使用工具需要账户吗？", "不需要。工具免费且无需注册。输入不会保存到浏览器存储；仅主题和可选的本地工具计数可能保留在本设备。"],
    ["结果是否构成法律或安全保证？", "不构成。遮蔽、计算和扫描只是预检查。法律、财务和安全关键决策仍需合格专业人员审查。"],
    ["为什么 Token 数只是估算？", "不同模型使用不同分词器。ByteQuant 根据字符与语言结构在本地估算，无需传输文本。"],
    ["工具能在手机上运行吗？", "可以。核心工具支持现代移动浏览器；部分文件与 Web Crypto 功能取决于浏览器能力和设备内存。"],
    ["网站是否包含广告？", "目前仅显示预留广告位。若启用广告服务，将提前更新同意和隐私说明。"],
    ["如何核验新工具的结果？", "JSON Schema 只反映示例，摘要器选择原句，贷款结果是数学情景，安全审计只是预检查。请阅读每项方法限制，并独立核验高影响输出。"],
    ["图片和文件工具会保存数据吗？", "不会。图片调整和 SHA-256 在当前标签页运行，文件不会上传或写入 localStorage；只有您主动下载的输出会留在设备上。"],
  ],
} as const;

export function HomePage({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const editorialLocale = locale === "tr" ? "tr" : "en";
  const localized = (tr: string, en: string, de: string, zh: string) => ({ tr, en, de, zh })[locale];
  const currentLanguage = languageTag(locale);
  const t = copy[locale];
  const guideCards = locale === "de" || locale === "zh"
    ? localizedGuides.map((guide) => ({ slug: guide.slug, category: guide.copy[locale].category, readTime: guide.copy[locale].readTime, title: guide.copy[locale].title, excerpt: guide.copy[locale].excerpt, href: postPath(locale, guide.slug), hrefLang: locale }))
    : posts.slice(-3).reverse().map((post) => ({ slug: post.slug, category: post.category[editorialLocale], readTime: post.readTime[editorialLocale], title: post.title[editorialLocale], excerpt: post.excerpt[editorialLocale], href: postPath(editorialLocale, post.slug), hrefLang: editorialLocale }));
  const alternateHref = locale === "tr" ? "/en" : "/";
  const schema = { "@context": "https://schema.org", "@type": "WebApplication", "@id": `${absoluteUrl(pathFor(locale, "home"))}#application`, name: "ByteQuant", url: absoluteUrl(pathFor(locale, "home")), applicationCategory: "ProductivityApplication", operatingSystem: "Any modern browser", browserRequirements: "JavaScript enabled", inLanguage: currentLanguage, isAccessibleForFree: true, isPartOf: { "@id": websiteId }, creator: { "@id": organizationId }, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, featureList: [localized("Yerel Ajan ile açıklanabilir araç orkestrasyonu", "Explainable tool orchestration with Local Agent", "Nachvollziehbare Werkzeug-Orchestrierung mit lokalem Agenten", "使用本地助手进行可解释工具编排"), ...tools.map((tool) => tool.title[locale])] };

  return (
    <SiteShell locale={locale} alternateHref={alternateHref} languageHrefs={{ tr: "/", en: "/en", de: "/de", zh: "/zh" }}>
      <SchemaScript data={schema} />
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><i />{localized("Gizlilik, bir ayar değil; mimari karar", "Privacy is an architecture decision, not a setting", "Datenschutz ist eine Architekturentscheidung, keine Einstellung", "隐私是一项架构决策，而不是一个设置")}</span>
            <h1>{localized("Hassas verileriniz tarayıcıdan çıkmadan işlerinizi tamamlayın.", "Get work done without sensitive data leaving your browser.", "Erledigen Sie Aufgaben, ohne sensible Daten aus dem Browser zu senden.", "无需让敏感数据离开浏览器，即可完成工作。")}</h1>
            <p>{localized(`Promptları iyileştirin, metinleri analiz edin, veriyi dönüştürün ve kişisel bilgileri koruyun. ${tools.length} açıklanabilir araç; üyelik, sunucuya yükleme ve uzak API olmadan çalışır.`, `Improve prompts, analyze text, transform data, and protect personal information. ${tools.length} explainable tools work without accounts, server uploads, or remote APIs.`, `Verbessern Sie Prompts, analysieren Sie Texte, konvertieren Sie Daten und schützen Sie persönliche Informationen. ${tools.length} nachvollziehbare Werkzeuge funktionieren ohne Konto, Upload oder Remote-API.`, `优化提示词、分析文本、转换数据并保护个人信息。${tools.length} 个可解释工具无需账户、服务器上传或远程 API。`)}</p>
            <div className="hero-actions"><Link className="primary-button" href={pathFor(locale, "agent")}>{localized("Yerel Ajanla planla", "Plan with Local Agent", "Mit lokalem Agenten planen", "使用本地助手规划")}<span aria-hidden="true"> →</span></Link><Link className="secondary-button" href={pathFor(locale, "tools")}>{t.allTools}</Link></div>
            <div className="hero-trust"><span>✓ {localized("Üyelik yok", "No account", "Kein Konto", "无需账户")}</span><span>✓ {localized("Sunucuya yükleme yok", "No server upload", "Kein Server-Upload", "无需上传服务器")}</span><span>✓ {localized("Açıklanabilir sonuç", "Explainable output", "Nachvollziehbare Ausgabe", "可解释输出")}</span></div>
          </div>
          <div className="hero-product" aria-label={isTr ? "ByteQuant araç arayüzü örneği" : "ByteQuant tool interface preview"}>
            <div className="product-window">
              <div className="window-bar"><span><i /><i /><i /></span><b>bytequant.org/{isTr ? "araclar" : "tools"}</b><small>● {isTr ? "Yerel" : "Local"}</small></div>
              <div className="window-content">
                <div className="preview-heading"><span className="tool-mark category-prompt">01</span><div><small>{isTr ? "PROMPT ARAÇLARI" : "PROMPT TOOLS"}</small><strong>{isTr ? "Prompt Kalite Denetimi" : "Prompt Quality Checker"}</strong></div><span className="score-ring">84</span></div>
                <div className="preview-input">{isTr ? "Yeni kullanıcılar için gizlilik araçlarını anlatan kısa bir rehber hazırla…" : "Create a short guide to privacy tools for new users…"}</div>
                <div className="preview-checks"><span>✓ {isTr ? "Açık hedef" : "Clear goal"}</span><span>✓ {isTr ? "Çıktı biçimi" : "Output format"}</span><span>○ {isTr ? "Kalite ölçütü" : "Quality criterion"}</span></div>
                <div className="preview-footer"><span><i />{isTr ? "Bu metin cihazınızda işlendi" : "Processed on your device"}</span><b>{isTr ? "Analizi çalıştır" : "Run analysis"} →</b></div>
              </div>
            </div>
            <div className="floating-note"><span>◎</span><div><strong>{isTr ? "Ağ isteği yok" : "No network request"}</strong><small>{isTr ? "Girdi tarayıcı belleğinde" : "Input remains in browser memory"}</small></div></div>
          </div>
        </div>
      </section>

      <section className="proof-strip"><div className="container proof-grid"><div><strong>{tools.length}</strong><span>{localized("işlevsel araç", "working tools", "funktionierende Werkzeuge", "个可用工具")}</span></div><div><strong>{Object.keys(categories).length}</strong><span>{localized("odaklı kategori", "focused categories", "fokussierte Kategorien", "个专注类别")}</span></div><div><strong>0</strong><span>{localized("zorunlu hesap", "required accounts", "Pflichtkonten", "个必需账户")}</span></div><div><strong>100%</strong><span>{localized("tarayıcı içi çekirdek işlem", "in-browser core processing", "Kernverarbeitung im Browser", "核心处理在浏览器内")}</span></div></div></section>

      <PopularTools locale={locale} />
      <PwaInstall locale={locale} />

      <section className="section home-agent-section">
        <div className="container home-agent-grid">
          <div className="home-agent-copy"><span className="kicker">BQ-AGENT 1.0 · LOCAL-FIRST</span><h2>{localized("Bir hedef yazın; araçlar canlı bir iş akışına dönüşsün", "Write one outcome; turn the tools into a living workflow", "Ein Ziel eingeben und Werkzeuge zu einem Ablauf verbinden", "写下目标，让工具组成连贯工作流")}</h2><p>{localized("Çok dilli semantik arama hedefinizi anlar; açıklanabilir planlayıcı uygun araçları sıralar. Her adımı siz açar ve çalıştırırsınız. Uzak model, veri yükleme veya gizli düşünce zinciri yoktur.", "Multilingual semantic search understands the goal, while an explainable planner orders suitable tools. You open and run every step. There is no remote model, data upload, or hidden chain-of-thought.", "Mehrsprachige semantische Suche versteht das Ziel; ein nachvollziehbarer Planer ordnet passende Werkzeuge. Jeder Schritt wird von Ihnen gestartet – ohne Remote-Modell, Upload oder verborgene Gedankenkette.", "多语言语义搜索理解目标，可解释规划器排列合适工具。每一步均由您打开和运行；没有远程模型、数据上传或隐藏思维链。")}</p><div className="home-agent-actions"><Link className="primary-button" href={pathFor(locale, "agent")}>{localized("Yerel Ajanı aç", "Open Local Agent", "Lokalen Agenten öffnen", "打开本地助手")} →</Link><span>0 {localized("ağ isteği", "network calls", "Netzaufrufe", "次网络请求")}</span></div></div>
          <div className="home-agent-flow" aria-label={localized("Yerel ajan iş akışı", "Local Agent workflow", "Ablauf des lokalen Agenten", "本地助手工作流")}><article><span>01</span><div><strong>{localized("Hedef", "Outcome", "Ziel", "目标")}</strong><small>{localized("Doğal dille yazın", "Describe naturally", "Natürlich beschreiben", "自然语言描述")}</small></div></article><i>→</i><article><span>02</span><div><strong>{localized("Plan", "Plan", "Plan", "计划")}</strong><small>{localized("Gerekçeyi görün", "Inspect rationale", "Begründung prüfen", "查看理由")}</small></div></article><i>→</i><article><span>03</span><div><strong>{localized("Araçlar", "Tools", "Werkzeuge", "工具")}</strong><small>{localized("Adımları çalıştırın", "Run each step", "Schritte starten", "逐步运行")}</small></div></article><i>→</i><article><span>04</span><div><strong>{localized("Doğrula", "Verify", "Prüfen", "核验")}</strong><small>{localized("Çıktı ve sınırlar", "Output and limits", "Ausgabe und Grenzen", "输出与边界")}</small></div></article></div>
        </div>
      </section>

      <section className="section category-section" id={locale === "tr" ? "araclar" : "tools"}>
        <div className="container">
          <div className="section-heading split-heading"><div><span className="kicker">{localized("ARAÇ KÜTÜPHANESİ", "TOOL LIBRARY", "WERKZEUGBIBLIOTHEK", "工具库")}</span><h2>{localized("Günlük işler için küçük, güvenilir araçlar", "Small, dependable tools for everyday work", "Kleine, verlässliche Werkzeuge für den Alltag", "适合日常工作的可靠小工具")}</h2></div><p>{localized("Yeni paket YAML/XML/JSON/CSV dönüşümlerini, URL ve teknik SEO kontrollerini, Unicode ve metin işlerini, günlük hesaplamaları, Web Crypto yardımcılarını ve yerel RAG/prompt enjeksiyonu ön kontrollerini kapsar. Her araç gerçek çıktı, örnek veri, yöntem ve sınır sunar.", "The new package covers YAML/XML/JSON/CSV transformations, URL and technical SEO checks, Unicode and text workflows, everyday calculations, Web Crypto utilities, and local RAG/prompt-injection pre-checks. Every tool provides working output, sample data, method, and limits.", "Das neue Paket umfasst YAML/XML/JSON/CSV, URL- und technische SEO-Prüfungen, Unicode- und Textabläufe, Alltagsberechnungen, Web-Crypto-Helfer sowie lokale RAG-/Prompt-Injection-Vorprüfungen. Jedes Werkzeug bietet echte Ausgabe, Beispieldaten, Methode und Grenzen.", "新工具包涵盖 YAML/XML/JSON/CSV 转换、URL 与技术 SEO 检查、Unicode 和文本流程、日常计算、Web Crypto 工具以及本地 RAG/提示词注入预检查。每个工具都提供真实输出、示例数据、方法和限制。")}</p></div>
          <div className="category-nav">{(Object.keys(categories) as ToolCategory[]).map((key) => <a key={key} href={`#category-${key}`}><span className={`category-dot category-${key}`}>{categories[key].mark}</span><span><strong>{categories[key].label[locale]}</strong><small>{tools.filter((tool) => tool.category === key).length} {localized("araç", "tools", "Werkzeuge", "个工具")}</small></span></a>)}</div>
          {(Object.keys(categories) as ToolCategory[]).map((key) => <div className="tool-category-block" id={`category-${key}`} key={key}><div className="category-block-heading"><div><span className={`category-dot large category-${key}`}>{categories[key].mark}</span><div><h3>{categories[key].label[locale]}</h3><p>{categories[key].description[locale]}</p></div></div><a href={`#${locale === "tr" ? "araclar" : "tools"}`}>{localized("Başa dön", "Back to top", "Nach oben", "返回顶部")} ↑</a></div><div className="tool-grid">{tools.filter((tool) => tool.category === key).map((tool) => <ToolCard key={tool.slug} tool={tool} locale={locale} />)}</div></div>)}
        </div>
      </section>

      <div className="container"><AdSlot locale={locale} /></div>

      <section className="section workflow-section">
        <div className="container workflow-grid"><div className="workflow-copy"><span className="kicker">{localized("NASIL ÇALIŞIR?", "HOW IT WORKS", "SO FUNKTIONIERT ES", "工作原理")}</span><h2>{localized("Veri yolculuğunu kısa tutan tasarım", "A design that keeps the data journey short", "Ein Design mit kurzen Datenwegen", "缩短数据路径的设计")}</h2><p>{localized("Araçlar tarayıcının yerleşik özelliklerini kullanır. Girdi sunucuya gönderilmediği için ek veri kopyaları oluşmaz.", "The tools use built-in browser capabilities. Because input is not sent to a server, unnecessary copies are avoided.", "Die Werkzeuge nutzen Browser-Funktionen. Weil Eingaben nicht an einen Server gesendet werden, entstehen keine unnötigen Kopien.", "工具使用浏览器内置能力。由于输入不发送到服务器，因此避免了不必要的数据副本。")}</p><Link className="text-link" href={postPath(editorialLocale, "client-side-ai-araclari-nedir")} hrefLang={editorialLocale}>{localized("Client-side mimari rehberini okuyun", "Read the client-side architecture guide", "Englischen Architektur-Ratgeber lesen", "阅读英文客户端架构指南")} →</Link></div><ol className="workflow-steps"><li><span>01</span><div><strong>{localized("Girdiyi cihazınızda açın", "Open input on your device", "Eingabe auf dem Gerät öffnen", "在设备上打开输入")}</strong><p>{localized("Metin yalnızca etkin tarayıcı sekmesinde bulunur.", "Text exists only in the active browser tab.", "Text bleibt im aktiven Browser-Tab.", "文本仅存在于当前浏览器标签页。")}</p></div></li><li><span>02</span><div><strong>{localized("Yerel işlemi çalıştırın", "Run the local operation", "Lokale Verarbeitung starten", "运行本地处理")}</strong><p>{localized("JavaScript, Regex veya Web Crypto sonucu üretir.", "JavaScript, Regex, or Web Crypto produces the result.", "JavaScript, Regex oder Web Crypto erzeugt das Ergebnis.", "JavaScript、正则表达式或 Web Crypto 生成结果。")}</p></div></li><li><span>03</span><div><strong>{localized("Sonucu siz yönetin", "You control the result", "Sie kontrollieren das Ergebnis", "由您控制结果")}</strong><p>{localized("Kontrol edin, kopyalayın, indirin veya sekmeyle birlikte kapatın.", "Review, copy, download, or close it with the tab.", "Prüfen, kopieren, herunterladen oder mit dem Tab schließen.", "检查、复制、下载，或随标签页一起关闭。")}</p></div></li></ol></div>
      </section>

      <section className="section editorial-section">
        <div className="container"><div className="section-heading split-heading"><div><span className="kicker">{localized("REHBERLER", "GUIDES", "RATGEBER", "指南")}</span><h2>{localized("Aracı değil, doğru yöntemi öğrenin", "Learn the method, not only the tool", "Lernen Sie die Methode, nicht nur das Werkzeug", "学习方法，而不只是工具")}</h2></div><p>{localized("Yeni araçların tamamı için dört dilde adım adım kullanım, varsayım, hata sınırı ve bağımsız doğrulama içeriği; ayrıca veri/SEO, metin/hesaplama, kriptografi ve RAG güvenliği için dört derin çalışma rehberi.", "Every new tool includes four-language steps, assumptions, error boundaries, and independent verification, plus four deep workflow guides for data/SEO, text/calculation, cryptography, and RAG safety.", "Alle neuen Werkzeuge enthalten Schritte, Annahmen, Fehlergrenzen und unabhängige Prüfung in vier Sprachen sowie vier vertiefende Ratgeber zu Daten/SEO, Text/Berechnung, Kryptografie und RAG-Sicherheit.", "所有新工具均提供四语言步骤、假设、错误边界与独立核验，并新增数据/SEO、文本/计算、密码学和 RAG 安全四篇深度指南。")}</p></div><div className="post-grid">{guideCards.map((guide, index) => <article className={`post-card post-card-${index + 1}`} key={guide.slug}><span>{guide.category} · {guide.readTime}</span><h3><Link href={guide.href} hrefLang={guide.hrefLang}>{guide.title}</Link></h3><p>{guide.excerpt}</p><Link className="text-link" href={guide.href} hrefLang={guide.hrefLang}>{localized("Rehberi oku", "Read guide", "Ratgeber lesen", "阅读指南")} →</Link></article>)}</div><div className="center-action"><Link className="secondary-button" href={pathFor(locale, "blog")}>{localized("Tüm rehberleri görüntüle", "View all guides", "Alle Ratgeber", "查看全部指南")}</Link></div></div>
      </section>

      <section className="section principles-section"><div className="container"><div className="section-heading centered"><span className="kicker">{localized("NEDEN BYTEQUANT?", "WHY BYTEQUANT?", "WARUM BYTEQUANT?", "为什么选择 BYTEQUANT？")}</span><h2>{localized("Gösterişli iddialar yerine denetlenebilir ilkeler", "Auditable principles instead of flashy claims", "Prüfbare Prinzipien statt großer Versprechen", "用可核验原则取代夸张承诺")}</h2></div><div className="principle-grid"><article><span>↘</span><h3>{localized("Yerel varsayılan", "Local by default", "Standardmäßig lokal", "默认本地处理")}</h3><p>{localized("Sunucu gerektirmeyen görevler cihazınızda kalır. Yeni dış hizmet eklenirse açıkça belirtilir.", "Tasks that do not need a server stay on-device. Any future external service will be disclosed.", "Aufgaben ohne Serverbedarf bleiben auf dem Gerät. Neue externe Dienste werden offengelegt.", "无需服务器的任务保留在设备上。未来新增外部服务会明确说明。")}</p></article><article><span>≋</span><h3>{localized("Açıklanabilir yöntem", "Explainable methods", "Nachvollziehbare Methoden", "可解释方法")}</h3><p>{localized("Skorların ve dönüşümlerin neye dayandığını, yaklaşık sonuçları ve sınırları gösteririz.", "We disclose what scores and transformations use, including estimates and limitations.", "Wir erklären Grundlagen, Näherungen und Grenzen von Bewertungen und Konvertierungen.", "我们说明评分与转换的依据、估算方式和限制。")}</p></article><article><span>□</span><h3>{localized("Tek iş, net çıktı", "One job, clear output", "Eine Aufgabe, klare Ausgabe", "一项任务，清晰输出")}</h3><p>{localized("Araçlar gereksiz panel karmaşası olmadan tek bir sorunu çözmeye odaklanır.", "Tools focus on one problem without unnecessary dashboard complexity.", "Werkzeuge konzentrieren sich ohne unnötige Oberfläche auf ein Problem.", "工具专注解决一个问题，避免不必要的界面复杂度。")}</p></article><article><span>✓</span><h3>{localized("Dürüst sınırlar", "Honest limitations", "Ehrliche Grenzen", "诚实说明限制")}</h3><p>{localized("Otomatik sonuçların uzman görüşü veya hukuki uygunluk garantisi olmadığını açıkça söyleriz.", "Automated output is never presented as expert opinion or legal compliance assurance.", "Automatische Ausgaben werden nicht als Fachmeinung oder Rechtsgarantie dargestellt.", "自动输出不会被描述为专业意见或法律合规保证。")}</p></article></div></div></section>

      <section className="section faq-section"><div className="container faq-layout"><div><span className="kicker">{localized("SIK SORULAN SORULAR", "FREQUENTLY ASKED QUESTIONS", "HÄUFIGE FRAGEN", "常见问题")}</span><h2>{localized("Başlamadan önce bilmeniz gerekenler", "What to know before you start", "Was Sie vor dem Start wissen sollten", "开始前需要了解的事项")}</h2><p>{localized("Başka bir sorunuz varsa bize yazın; ürün davranışı ve gizlilik açıklamalarını açık tutmayı önemsiyoruz.", "If your question is not here, contact us. We value clear explanations of product behavior and privacy.", "Wenn Ihre Frage fehlt, kontaktieren Sie uns. Klare Produkt- und Datenschutzerklärungen sind uns wichtig.", "如果这里没有您的问题，请联系我们。我们重视清晰的产品行为与隐私说明。")}</p><Link className="secondary-button" href={pathFor(locale, "contact")}>{localized("Bize ulaşın", "Contact us", "Kontakt", "联系我们")}</Link></div><div className="faq-list">{faqs[locale].map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="cta-band"><div className="container"><div><span>{localized(`${tools.length} ARAÇ · ÜCRETSİZ · ÜYELİKSİZ`, `${tools.length} TOOLS · FREE · NO ACCOUNT`, `${tools.length} WERKZEUGE · KOSTENLOS · KEIN KONTO`, `${tools.length} 个工具 · 免费 · 无需账户`)}</span><h2>{localized("İlk işleminizi cihazınızda tamamlayın.", "Complete your first task on-device.", "Erledigen Sie Ihre erste Aufgabe auf dem Gerät.", "在设备上完成第一项任务。")}</h2></div><Link className="light-button" href={toolPath(locale, "kvkk-veri-maskeleyici")}>{localized("Gizlilik aracını deneyin", "Try the privacy tool", "Datenschutzwerkzeug testen", "试用隐私工具")} →</Link></div></section>
    </SiteShell>
  );
}
