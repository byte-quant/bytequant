import Link from "next/link";
import { absoluteUrl, languageTag, organizationId, pathFor, siteUrl, websiteId, type Locale } from "../lib/site";
import { AgentConversation } from "./AgentConversation";
import { AgentVisualStudioLoader } from "./AgentVisualStudioLoader";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

const content = {
  tr: {
    eyebrow: "BYTEQUANT AI · CİHAZINIZDA ÇALIŞIR",
    title: "Sohbet edin; gerektiğinde araçları sizin için işe koysun",
    intro: "Günlük bir soru sorun, bir işi anlatın veya görselinizi cihazınızda düzenleyin. ByteQuant AI bağlamı hatırlar, uygun araçları seçer ve desteklenen işlemleri aynı ekranda tamamlar. Daha doğal konuşma için cihazınıza uygun açık kaynak model yalnız onayınızla hazırlanır.",
    start: "Sohbete başla", visual: "Görsel düzenle", workspace: "Görsel akış kur",
    steps: [["1", "Anlat", "Hedefi ve varsa örnek veriyi kendi cümlelerinizle yazın."], ["2", "Planı görün", "Araçları, sırayı ve güvenlik notlarını kontrol edin."], ["3", "Devam edin", "Metin akışı otomatik tamamlansın veya doldurulmuş aracı açın."]],
    howTitle: "Ajan ne yapar, ne yapmaz?", howIntro: "Bu sayfa araçların yerine geçmez; doğru aracı bulmayı ve güvenli bir sıra kurmayı kolaylaştırır.",
    cards: [["01", "İhtiyacı anlar", "Hedef, dosya biçimi ve gizlilik sinyallerini eşleştirir."], ["02", "Kısa plan kurar", "Uygun araçları gerekçesiyle sıralar ve eksik bilgiyi sorar."], ["03", "Kontrolü sizde tutar", "Dosya seçimi, çalıştırma ve indirme yalnızca sizin eyleminizle olur."], ["04", "Sonraki adımı açıklar", "Hata mesajını sadeleştirir ve yakın alternatifleri gösterir."]],
    privacyTitle: "İçeriğiniz cihazınızdan çıkmaz",
    privacy: ["Planlama, otomasyon ve cihaz içi model çıkarımı hedef metnini veya araç girdisini ByteQuant sunucusuna göndermez.", "Kısa konuşma belleği yalnızca açık sekmenin sessionStorage alanında tutulur.", "İsteğe bağlı açık kaynak model dosyaları yalnız onayınızla indirilir; sohbet içeriği indirme isteğine eklenmez.", "AI yanıtları hata yapabilir; hukuki, tıbbi, güvenlik veya kimlik doğrulama kararı değildir."],
    faq: [["ByteQuant AI gerçekten yapay zekâ mı?", "Evet. Açıklanabilir araç planlama ve doğrulama çekirdeği her cihazda çalışır; desteklenen cihazlarda seçtiğiniz Qwen3 modeli Web Worker içinde üretken yanıtlar oluşturur. Uzak bir AI API'sine sohbet gönderilmez."], ["Bir sohbeti hatırlar mı?", "Aynı sekmedeki son hedefleri ve yanıtları bağlam olarak kullanır; sekme kapandığında bu geçici bellek sona erer."], ["Araçları otomatik çalıştırır mı?", "Desteklenen ve sınırlandırılmış metin akışlarını cihazda tamamlayabilir, sonucu konuşmada gösterebilir, girdiyi ilk araca aktarabilir ve planı İş İstasyonu'na gönderebilir. Dosya seçimi, parola, kod çalıştırma, indirme ve yüksek etkili kararlar sizin onayınızı gerektirir."], ["Görselleri gerçekten düzenler mi?", "Evet. PNG, JPG ve WebP dosyalarında boyutlandırma, parlaklık, kontrast, doygunluk, gri ton, bulanıklık, döndürme ve çevirme işlemlerini Canvas veya OffscreenCanvas ile cihazda uygular. İstemden SVG taslak da üretir; nesne silme veya fotogerçekçi üretim iddiası sunmaz."], ["Neden bazen model indirme onayı istiyor?", "ByteQuant AI temel planlama ve otomasyonu hemen başlatır. Daha doğal yanıtlar için cihazınıza uygun açık kaynak model paketi gerekirse boyutu önceden gösterir ve yalnız onayınızla indirir; önceden hazır model otomatik yeniden kullanılır."]],
  },
  en: {
    eyebrow: "BYTEQUANT AI · RUNS ON YOUR DEVICE", title: "Chat naturally, then put the right tools to work", intro: "Ask an everyday question, describe a task, or edit an image on your device. ByteQuant AI remembers context, selects suitable tools, and completes supported work in the same screen. A device-suited open-source model is prepared only with your approval when you want more natural conversation.", start: "Start a conversation", visual: "Edit an image", workspace: "Build a visual flow",
    steps: [["1", "Describe", "Write the outcome and optional sample in your own words."], ["2", "Review", "Check the tools, order, and safety notes."], ["3", "Continue", "Finish a text flow or open the prepared first tool."]],
    howTitle: "What the Agent does—and does not do", howIntro: "It does not replace the tools. It makes the right tool and a safer order easier to find.",
    cards: [["01", "Understands the need", "Matches the outcome, file format, and privacy signals."], ["02", "Builds a short plan", "Orders suitable tools, explains why, and asks for missing details."], ["03", "Keeps you in control", "File selection, execution, and downloads happen only when you act."], ["04", "Explains the next move", "Turns common errors into plain language and offers nearby alternatives."]],
    privacyTitle: "Your content stays on your device", privacy: ["Planning, automation, and on-device inference do not send goals or tool inputs to a ByteQuant server.", "Short conversation memory stays in sessionStorage for the open tab only.", "Optional open-source model assets download only with your approval; chat content is not added to that request.", "AI answers can be wrong and are not legal, medical, security, or identity-verification decisions."],
    faq: [["Is ByteQuant AI real AI?", "Yes. Its explainable tool-planning and verification core works on every device; on supported devices, your selected Qwen3 model generates answers inside a Web Worker. Chat is not sent to a remote AI API."], ["Does it remember a conversation?", "It uses recent goals and answers as context in the same tab. Closing the tab ends this temporary memory."], ["Can it run tools automatically?", "It can complete supported bounded text workflows, show the result in the conversation, prepare input in the first tool, and send a plan to Workstation. File selection, passwords, code execution, downloads, and high-impact decisions require your approval."], ["Does it really edit images?", "Yes. It applies resizing, brightness, contrast, saturation, grayscale, blur, rotation, and flipping to PNG, JPG, and WebP with Canvas or OffscreenCanvas on your device. It can create prompt-based SVG drafts, but does not claim object removal or photorealistic generation."], ["Why does it sometimes ask before downloading a model?", "Core planning and automation start immediately. When a device-suited open-source model is needed for more natural replies, ByteQuant shows the size first and downloads only with your approval; a cached model is reused automatically."]],
  },
  de: {
    eyebrow: "BYTEQUANT AI · LÄUFT AUF IHREM GERÄT", title: "Natürlich chatten und passende Werkzeuge einsetzen", intro: "Stellen Sie eine Alltagsfrage, beschreiben Sie eine Aufgabe oder bearbeiten Sie ein Bild auf Ihrem Gerät. ByteQuant AI merkt sich den Kontext, wählt passende Werkzeuge und erledigt unterstützte Aufgaben im selben Bildschirm. Ein passendes Open-Source-Modell wird für natürlichere Gespräche nur mit Ihrer Zustimmung vorbereitet.", start: "Gespräch starten", visual: "Bild bearbeiten", workspace: "Visuellen Ablauf bauen",
    steps: [["1", "Beschreiben", "Ergebnis und optionales Beispiel formulieren."], ["2", "Prüfen", "Werkzeuge, Reihenfolge und Sicherheitshinweise ansehen."], ["3", "Fortfahren", "Textablauf abschließen oder vorbereitetes Werkzeug öffnen."]],
    howTitle: "Was der Agent kann – und was nicht", howIntro: "Er ersetzt die Werkzeuge nicht, sondern erleichtert die Auswahl und eine sichere Reihenfolge.",
    cards: [["01", "Versteht den Bedarf", "Ordnet Ziel, Dateiformat und Datenschutzsignale zu."], ["02", "Erstellt einen kurzen Plan", "Sortiert passende Werkzeuge, nennt Gründe und fragt fehlende Angaben ab."], ["03", "Lässt die Kontrolle bei Ihnen", "Dateiauswahl, Ausführung und Download erfolgen nur durch Ihre Aktion."], ["04", "Erklärt den nächsten Schritt", "Vereinfacht typische Fehler und zeigt nahe Alternativen."]],
    privacyTitle: "Ihre Inhalte bleiben auf dem Gerät", privacy: ["Planung, Automatisierung und lokale Modellinferenz senden Ziele oder Werkzeugeingaben nicht an ByteQuant-Server.", "Kurzes Gesprächsgedächtnis bleibt nur im sessionStorage des geöffneten Tabs.", "Optionale Open-Source-Modelldateien werden nur mit Zustimmung geladen; Gesprächsinhalte werden nicht mitgesendet.", "KI-Antworten können irren und sind keine Rechts-, Medizin-, Sicherheits- oder Identitätsprüfung."],
    faq: [["Ist ByteQuant AI echte KI?", "Ja. Der nachvollziehbare Kern für Werkzeugplanung und Prüfung läuft auf jedem Gerät; auf unterstützten Geräten erzeugt das gewählte Qwen3-Modell Antworten im Web Worker. Gespräche gehen nicht an eine entfernte KI-API."], ["Merkt sie sich ein Gespräch?", "Letzte Ziele und Antworten dienen im selben Tab als Kontext. Beim Schließen endet dieses Kurzzeitgedächtnis."], ["Kann sie Werkzeuge automatisch ausführen?", "Begrenzte Textabläufe können lokal abgeschlossen, Ergebnisse im Gespräch gezeigt, Eingaben vorbereitet und Pläne an die Workstation übergeben werden. Dateiauswahl, Passwörter, Codeausführung, Downloads und folgenreiche Entscheidungen benötigen Ihre Freigabe."], ["Bearbeitet sie Bilder wirklich?", "Ja. PNG-, JPG- und WebP-Dateien werden mit Canvas oder OffscreenCanvas lokal skaliert, aufgehellt, kontrastiert, gesättigt, weichgezeichnet, gedreht oder gespiegelt. Prompt-basierte SVG-Entwürfe sind möglich; Objektentfernung oder fotorealistische Generierung wird nicht behauptet."], ["Warum wird manchmal vor einem Modelldownload gefragt?", "Planung und Automatisierung starten sofort. Für natürlichere Antworten zeigt ByteQuant die Größe eines passenden Open-Source-Modells vorab und lädt es nur mit Ihrer Zustimmung; vorhandene Modelle werden automatisch wiederverwendet."]],
  },
  zh: {
    eyebrow: "BYTEQUANT AI · 在您的设备上运行", title: "自然对话，并让合适的工具开始工作", intro: "您可以提出日常问题、描述任务，或直接在设备上编辑图片。ByteQuant AI 会记住上下文、选择合适工具，并在同一界面完成受支持的工作。若需要更自然的对话，适合设备的开源模型只会在您同意后准备。", start: "开始对话", visual: "编辑图片", workspace: "创建可视化流程",
    steps: [["1", "描述", "用自己的话说明结果并可加入示例。"], ["2", "检查", "确认工具、顺序和安全提示。"], ["3", "继续", "完成文本流程或打开已准备的工具。"]],
    howTitle: "助手能做什么、不能做什么", howIntro: "它不会替代工具，而是帮助您找到合适工具和更安全的顺序。",
    cards: [["01", "理解需求", "匹配目标、文件格式与隐私信号。"], ["02", "生成短计划", "排列合适工具、解释原因并询问缺失信息。"], ["03", "由您控制", "文件选择、执行和下载都需要您的操作。"], ["04", "说明下一步", "用简单语言解释常见错误并提供相近替代方案。"]],
    privacyTitle: "内容留在您的设备上", privacy: ["规划、自动化与设备端模型推理不会把目标或工具输入发送到 ByteQuant 服务器。", "短期对话记忆只保存在当前标签页的 sessionStorage 中。", "可选开源模型文件只会在您同意后下载，对话内容不会加入下载请求。", "AI 回答可能出错，不能替代法律、医疗、安全或身份验证结论。"],
    faq: [["ByteQuant AI 是真正的 AI 吗？", "是。可解释的工具规划与核验核心可在各类设备上运行；在支持的设备上，您选择的 Qwen3 模型会在 Web Worker 中生成回答。对话不会发送到远程 AI API。"], ["它会记住对话吗？", "同一标签页中的近期目标与回答会作为上下文；关闭标签页后临时记忆结束。"], ["它能自动运行工具吗？", "它可以在设备端完成受限文本流程、在对话中显示结果、把输入交给首个工具，并把计划发送到工作站。文件选择、密码、代码执行、下载和高影响决定需要您的确认。"], ["它真的可以编辑图片吗？", "可以。PNG、JPG 和 WebP 会通过设备端 Canvas 或 OffscreenCanvas 完成尺寸、亮度、对比度、饱和度、灰度、模糊、旋转和翻转处理，也可生成基于提示词的 SVG 草稿；不会宣称能够移除物体或生成照片级内容。"], ["为什么有时会询问是否下载模型？", "基础规划与自动化会立即开始。若需要开源模型来获得更自然的回答，ByteQuant 会先显示大小并仅在您同意后下载；已有缓存会自动复用。"]],
  },
} as const;

const scenarioContent = {
  tr: {
    kicker: "GERÇEK KULLANIM ÖRNEKLERİ", title: "Bir cümleden kullanılabilir sonuca nasıl gider?", intro: "Aşağıdaki örnekler, model indirmeden çalışan hızlı yanıt katmanı ile araç otomasyonunun sınırlarını somutlaştırır. ByteQuant AI güncel bilgiyi uydurmaz; elinizdeki metni, seçeneği veya dosyayı işler.",
    items: [
      ["Yazı ve iletişim", "“Müşteriye gecikme için kısa bir özür e-postası yaz.”", "Alıcı, sorumluluk, yeni tarih ve telafi adımını içeren gönderilebilir bir taslak üretir; tonu tek tıkla samimi veya resmî hâle getirebilirsiniz."],
      ["Karar desteği", "“Freelance ve tam zamanlı işi riskleriyle karşılaştır.”", "Gelir düzeni, özgürlük, yan haklar, müşteri bulma ve mali tampon gibi konuya özgü ölçütleri ayırır; doğrulanabilir bir geçiş deneyi önerir."],
      ["Hata açıklama", "“TypeError: cannot read properties of undefined ne demek?”", "Hatanın nedenini günlük dille açıklar, güvenli erişim örneği verir ve yalnız gerekli kod bağlamını ister."],
      ["Araç otomasyonu", "“Bu fotoğrafları tek PDF yap ve sayfaları sırala.”", "Görselden PDF aracını seçer, dosya gereksinimini açıklar, girdiyi hazırlar ve çalıştırmadan önce onayınızı bekler."],
    ],
  },
  en: {
    kicker: "REAL USE CASES", title: "How one sentence becomes a usable result", intro: "These examples show what the download-free fast layer and tool automation actually do. ByteQuant AI does not invent live facts; it works with the text, choices, or files you provide.",
    items: [
      ["Writing and communication", "“Write a short apology email for a delayed delivery.”", "Produces a sendable draft with accountability, a revised date, and a corrective action; you can then make the tone warmer or more formal."],
      ["Decision support", "“Compare freelance and full-time work by risk.”", "Separates domain-specific criteria such as income stability, autonomy, benefits, client acquisition, and financial runway, then suggests a reversible test."],
      ["Error explanation", "“What does TypeError: cannot read properties of undefined mean?”", "Explains the cause in plain language, shows safe access, and asks only for the code context needed for a concrete fix."],
      ["Tool automation", "“Combine these photos into one ordered PDF.”", "Selects the image-to-PDF tool, explains the file requirement, prepares the handoff, and waits for approval before processing."],
    ],
  },
  de: {
    kicker: "ECHTE ANWENDUNGSFÄLLE", title: "Vom Satz zum nutzbaren Ergebnis", intro: "Die Beispiele zeigen die konkrete Leistung der schnellen Ebene ohne Download und der Werkzeugautomatisierung. ByteQuant AI erfindet keine Live-Fakten, sondern arbeitet mit Ihren Texten, Optionen und Dateien.",
    items: [
      ["Text und Kommunikation", "„Kurze Entschuldigungsmail wegen verspäteter Lieferung schreiben.“", "Erstellt einen versandfertigen Entwurf mit Verantwortung, neuem Termin und Korrekturmaßnahme; der Ton lässt sich danach freundlich oder formell anpassen."],
      ["Entscheidungshilfe", "„Freelancing und Festanstellung nach Risiken vergleichen.“", "Ordnet Einkommensstabilität, Freiheit, Leistungen, Akquise und Rücklagen als passende Kriterien und schlägt einen rücknehmbaren Test vor."],
      ["Fehler erklären", "„Was bedeutet TypeError: cannot read properties of undefined?“", "Erklärt die Ursache verständlich, zeigt sicheren Zugriff und fragt nur den nötigen Codekontext für eine konkrete Korrektur ab."],
      ["Werkzeugautomatisierung", "„Diese Fotos in ein sortiertes PDF zusammenführen.“", "Wählt Bild-zu-PDF, erklärt die Dateianforderung, bereitet die Übergabe vor und wartet vor der Verarbeitung auf Ihre Freigabe."],
    ],
  },
  zh: {
    kicker: "真实使用示例", title: "如何从一句话得到可用结果", intro: "以下示例说明无需下载的快速回答层与工具自动化究竟能做什么。ByteQuant AI 不会编造实时事实，而是处理您提供的文字、选项或文件。",
    items: [
      ["写作与沟通", "“为延期交付写一封简短道歉邮件。”", "生成包含责任说明、新日期和改进措施的可发送草稿，并可继续调整为更亲切或更正式的语气。"],
      ["决策支持", "“比较自由职业与全职工作的风险。”", "按收入稳定、自由度、福利、获客和资金缓冲等相关标准拆解，并建议可撤回的小规模验证。"],
      ["错误解释", "“TypeError: cannot read properties of undefined 是什么意思？”", "用简单语言解释原因，给出安全访问示例，并只询问完成具体修复所需的代码上下文。"],
      ["工具自动化", "“把这些照片按顺序合成一个 PDF。”", "匹配图片转 PDF 工具，说明文件要求，准备交接，并在处理前等待您的确认。"],
    ],
  },
} as const;

export function AgentPage({ locale }: { locale: Locale }) {
  const c = content[locale];
  const scenarios = scenarioContent[locale];
  const visualPrompt = { tr: "Bir görsel oluşturmak veya yüklediğim resmi düzenlemek istiyorum", en: "I want to create a visual or edit an image I upload", de: "Ich möchte ein Bild erstellen oder ein hochgeladenes Bild bearbeiten", zh: "我想创建视觉内容或编辑我上传的图片" }[locale];
  const pageUrl = absoluteUrl(pathFor(locale, "agent"));
  const agentName = "ByteQuant AI";
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebApplication", "@id": `${pageUrl}#application`, name: `ByteQuant ${agentName}`, url: pageUrl, description: c.intro, applicationCategory: "ProductivityApplication", operatingSystem: "Any modern browser", browserRequirements: "JavaScript enabled; WebGPU is optional for the local generative model", inLanguage: languageTag(locale), isAccessibleForFree: true, creator: { "@id": organizationId }, isPartOf: { "@id": websiteId }, featureList: [...c.cards.map((item) => item[1]), c.faq[0][0], c.faq[3][0]], offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: locale === "tr" ? "Ana sayfa" : locale === "en" ? "Home" : locale === "de" ? "Startseite" : "首页", item: absoluteUrl(pathFor(locale, "home")) }, { "@type": "ListItem", position: 2, name: c.title, item: pageUrl }] },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: languageTag(locale), mainEntity: c.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];
  return <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "agent")} languageHrefs={{ tr: pathFor("tr", "agent"), en: pathFor("en", "agent"), de: pathFor("de", "agent"), zh: pathFor("zh", "agent") }}>
    <SchemaScript data={schemas} />
    <section className="agent-product-intro agent-product-intro-compact agent-product-intro-v74"><div className="container agent-product-intro-grid"><div><span className="eyebrow"><i />{c.eyebrow}</span><h1>{c.title}</h1><p>{c.intro}</p><div className="agent-intro-actions"><a className="primary-button" href="#local-agent">{c.start} <span aria-hidden="true">↓</span></a><Link className="secondary-button" href={`${pathFor(locale, "agent")}?q=${encodeURIComponent(visualPrompt)}#local-agent`}>{c.visual} <span aria-hidden="true">→</span></Link><Link className="secondary-button" href={pathFor(locale, "workstation")}>{c.workspace} <span aria-hidden="true">→</span></Link></div></div><aside className="agent-simple-promise"><span>01</span><strong>{c.steps[0][1]}</strong><i>→</i><span>02</span><strong>{c.steps[1][1]}</strong><i>→</i><span>03</span><strong>{c.steps[2][1]}</strong></aside></div></section>
    <section id="local-agent" className="section agent-console-section"><div className="container"><AgentConversation locale={locale} /></div></section>
    <section id="agent-visual" className="section agent-visual-section"><div className="container"><AgentVisualStudioLoader locale={locale} /></div></section>
    <section className="section agent-how"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">LOCAL-FIRST</span><h2>{c.howTitle}</h2></div><p>{c.howIntro}</p></div><div className="agent-how-grid">{c.cards.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section agent-scenarios"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">{scenarios.kicker}</span><h2>{scenarios.title}</h2></div><p>{scenarios.intro}</p></div><div className="agent-scenario-grid">{scenarios.items.map(([label, prompt, result], index) => <article key={label}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{label}</small><h3>{prompt}</h3><p>{result}</p></div></article>)}</div></div></section>
    <section className="section agent-privacy"><div className="container agent-privacy-grid"><div><span className="kicker">PRIVACY BY DESIGN</span><h2>{c.privacyTitle}</h2><p>{siteUrl.replace("https://", "")} · HTTPS · {agentName}</p></div><ul>{c.privacy.map((item) => <li key={item}><span>✓</span><p>{item}</p></li>)}</ul></div></section>
    <section className="section compact-faq"><div className="container"><div className="section-heading centered"><span className="kicker">FAQ</span><h2>{locale === "tr" ? "Kısa ve açık yanıtlar" : locale === "de" ? "Kurze, klare Antworten" : locale === "zh" ? "简明解答" : "Short, clear answers"}</h2></div><div className="faq-list narrow">{c.faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>
  </SiteShell>;
}
