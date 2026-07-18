import type { InfoKey } from "./info";

export type ExtendedLocale = "de" | "zh";
type Section = { heading: string; paragraphs: string[]; bullets?: string[] };
type Content = { eyebrow: string; title: string; intro: string; updated?: string; sections: Section[] };

export const localizedInfo: Record<ExtendedLocale, Record<InfoKey, Content>> = {
  de: {
    about: {
      eyebrow: "ÜBER BYTEQUANT",
      title: "Digitale Arbeit privater, transparenter und zugänglicher machen",
      intro: "ByteQuant ist ein unabhängiges Webprojekt für datenschutzorientierte Werkzeuge, die direkt im Browser laufen.",
      sections: [
        { heading: "Warum ByteQuant existiert", paragraphs: ["Viele kleine Aufgaben wie JSON-Prüfung, Einheitenumrechnung oder Datenmaskierung benötigen technisch keinen Upload. ByteQuant hält solche Arbeit im aktiven Browser-Tab und erklärt Methode und Grenzen sichtbar.", "Das Produkt versteht clientseitige Verarbeitung als technische Grenze, nicht als Werbeversprechen. Neue externe Datenflüsse müssten vor der Aktivierung offengelegt werden."] },
        { heading: "Produktprinzipien", paragraphs: ["Wir entwickeln kleine, zugängliche und nachvollziehbare Werkzeuge ohne Pflichtkonto."], bullets: ["Serverfreie Aufgaben auf dem Gerät halten", "Fehler verständlich anzeigen", "Näherungen und rechtliche Grenzen offenlegen", "Mobil, tastaturbedienbar und schnell bleiben", "Korrekturen und Sicherheitsmeldungen erreichbar machen"] },
        { heading: "Sicherheit und redaktioneller Ansatz", paragraphs: ["Datei-, Code- und URL-Prüfungen sind begrenzte heuristische Vorprüfungen. Sie sind kein Antivirus, keine vollständige SAST-Analyse und keine Reputationsprüfung.", "Rechtliche, finanzielle und sicherheitskritische Inhalte sind allgemeine Informationen. Für konkrete Entscheidungen ist qualifizierte Fachberatung erforderlich."] },
      ],
    },
    privacy: {
      eyebrow: "DATENSCHUTZERKLÄRUNG",
      title: "Klare und möglichst kurze Datenwege",
      intro: "Diese Erklärung beschreibt die Datenverarbeitung bei bytequant.org. Werkzeugeingaben werden in der aktuellen Version nicht an ByteQuant-Server gesendet.",
      updated: "Zuletzt aktualisiert: 17. Juli 2026",
      sections: [
        { heading: "1. Verantwortlicher und Kontakt", paragraphs: ["ByteQuant ist für diesen Dienst verantwortlich. Datenschutzanfragen können an bytequant@yahoo.com gesendet werden.", "Werkzeugeingaben werden nicht zentral gespeichert. Bei einer Kontaktaufnahme per E-Mail werden Nachricht und Kontaktdaten nur zur Bearbeitung und erforderlichen Dokumentation verarbeitet."] },
        { heading: "2. Browserbasierte Werkzeugverarbeitung", paragraphs: ["Text, Prompt, JSON, CSV, Code, Passwörter, Bilder und PDFs werden im aktiven Browser-Tab verarbeitet. Datei- und Code-Vorprüfungen führen Inhalte nicht aus und senden sie nicht an einen Scan-Dienst.", "Kopieren und Herunterladen erzeugt eine von Ihnen kontrollierte Kopie. Zwischenablage, Downloads und gemeinsam genutzte Geräte liegen danach in Ihrer Verantwortung."] },
        { heading: "3. PWA, Service Worker und Offline-Cache", paragraphs: ["Die installierbare Web-App speichert nur gleichursprüngliche Anwendungsteile und bereits besuchte GET-Seiten. Werkzeugeingaben, generierte Ergebnisse, Passwörter und ausgewählte Dateien werden nicht in den Offline-Cache geschrieben.", "ByteQuant verteilt keine APK. Auf Android erzeugt der Browser die WebAPK/App-Hülle; die Website kann deren Android-Zielversion nicht festlegen. Bei einer Warnung zu einer alten Android-Version: abbrechen, Browser aktualisieren, alte ByteQuant-Verknüpfung entfernen und über das aktuelle Browsermenü neu installieren.", "Der Service Worker kann in den Browser- oder App-Einstellungen entfernt werden. Ein installierbares Symbol ändert nicht das lokale Datenschutzmodell."] },
        { heading: "4. Lokaler Speicher und Einwilligung", paragraphs: ["bq-consent-v1 speichert die Auswahl für 180 Tage und bq-theme das gewünschte Farbschema. bq-tool-usage-v1 wird nur nach Einwilligung aktiviert und enthält ausschließlich Werkzeugkennung, Anzahl und letzte Nutzung – nie Inhalte.", "Analytik-, Werbe- oder Tracking-SDKs sind nicht aktiv. Vor einer späteren Aktivierung würden Erklärung und gültiger Einwilligungsprozess aktualisiert."] },
        { heading: "5. Hosting, Rechte und Sicherheit", paragraphs: ["Die statische Website ist für GitHub Pages vorgesehen. Hosting- und Netzbetreiber können übliche Verbindungsdaten wie IP-Adresse, Zeit, Pfad und User-Agent nach eigenen Richtlinien verarbeiten; Werkzeugeingaben sind nicht Teil dieser Requests.", "Soweit anwendbar bestehen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Beschwerde. Datenminimierung reduziert Risiken, garantiert aber keine absolute Sicherheit."] },
      ],
    },
    cookies: {
      eyebrow: "COOKIES & LOKALER SPEICHER",
      title: "Keine Tracking-Cookies; optionale lokale Abkürzungen nur mit Einwilligung",
      intro: "ByteQuant verwendet derzeit keine HTTP-Cookies, Analytik-IDs oder aktive Werbetags.",
      updated: "Zuletzt aktualisiert: 17. Juli 2026",
      sections: [
        { heading: "Erforderlicher Speicher", paragraphs: ["bq-consent-v1 merkt Ihre Auswahl 180 Tage; bq-theme speichert das ausdrücklich gewählte Farbschema. Diese Werte enthalten keine Werkzeugeingaben."] },
        { heading: "Optionale Personalisierung", paragraphs: ["bq-tool-usage-v1 zählt nach Ihrer Einwilligung lokal geöffnete Werkzeuge. Es speichert Slug, Zähler und letzten Zeitpunkt, aber keine Texte, Dateien, Passwörter oder Ergebnisse.", "Sie können die Einwilligung über „Datenschutzauswahl“ im Fußbereich zurückziehen; der optionale Datensatz wird dann gelöscht."] },
        { heading: "Offline-Cache der installierbaren App", paragraphs: ["Der same-origin Service Worker speichert Anwendungsteile und bereits besuchte Seiten für den Offline-Start. Formulareingaben und Werkzeugausgaben werden nicht abgefangen oder gespeichert. Der Cache kann über Browser- oder App-Einstellungen gelöscht werden."] },
      ],
    },
    terms: {
      eyebrow: "NUTZUNGSBEDINGUNGEN",
      title: "Kostenlose Werkzeuge mit klaren Verantwortungsgrenzen",
      intro: "Mit der Nutzung von ByteQuant akzeptieren Sie diese Bedingungen und verwenden die Werkzeuge nur für rechtmäßige, autorisierte Zwecke.",
      updated: "Zuletzt aktualisiert: 17. Juli 2026",
      sections: [
        { heading: "Zulässige Nutzung", paragraphs: ["Verarbeiten Sie nur Daten, Dateien, URLs und Quellcode, die Sie rechtmäßig prüfen dürfen. Umgehen Sie keine Zugriffskontrollen, Verschlüsselung, Lizenz oder Rechte Dritter."] },
        { heading: "Keine Fach- oder Sicherheitsgarantie", paragraphs: ["Berechnungen, Vertrags- und Rechnungsentwürfe, Zitationen, Malware-Indikatoren und Prompt-Bewertungen sind Hilfsmittel. Sie ersetzen keine Rechts-, Finanz-, Studien-, Steuer- oder Sicherheitsberatung.", "Ein unauffälliger Datei-, Code- oder URL-Bericht beweist keine Sicherheit. Kritische Ergebnisse müssen unabhängig geprüft werden."] },
        { heading: "Verfügbarkeit und Haftung", paragraphs: ["Der Dienst wird ohne Verfügbarkeits- oder Fehlerfreiheitsgarantie bereitgestellt. Die Installation ist eine Browser-PWA-Funktion; ByteQuant verteilt keine APK und garantiert nicht die Kompatibilität der vom Browser erzeugten Android-Hülle. Prüfen und sichern Sie Ergebnisse vor wichtiger Nutzung. Soweit gesetzlich zulässig, liegt die Verantwortung für Eingabe, Interpretation und Verwendung bei Ihnen."] },
      ],
    },
    contact: {
      eyebrow: "KONTAKT",
      title: "Fragen, Korrekturen und Sicherheitsmeldungen",
      intro: "Kontaktieren Sie ByteQuant zu Support, Datenschutz, Barrierefreiheit, redaktionellen Korrekturen oder verantwortungsvollen Sicherheitsmeldungen.",
      sections: [
        { heading: "E-Mail", paragraphs: ["Schreiben Sie an bytequant@yahoo.com. Senden Sie keine Passwörter, privaten Schlüssel, ungeschwärzten personenbezogenen Datensätze oder aktive Schadsoftware per E-Mail."] },
        { heading: "Sicherheitsmeldung", paragraphs: ["Beschreiben Sie betroffene URL, reproduzierbare Schritte, Auswirkung und eine sichere Kontaktmöglichkeit. Veröffentlichen Sie den Befund nicht, bevor eine angemessene Behebung möglich war.", "Die koordinierte Meldung ist auch in /.well-known/security.txt dokumentiert."] },
      ],
    },
    faq: {
      eyebrow: "HÄUFIGE FRAGEN",
      title: "Was Sie vor der Nutzung wissen sollten",
      intro: "Kurze Antworten zu Datenschutz, Installation, Offline-Nutzung, neuen Sprachen und Sicherheitsgrenzen.",
      sections: [
        { heading: "Werden Werkzeugeingaben hochgeladen?", paragraphs: ["Nein. Die Kernverarbeitung läuft im aktiven Browser-Tab. Datei-, Code- und URL-Vorprüfungen verwenden keine externe Scan-API."] },
        { heading: "Ist ByteQuant ein Antivirusprogramm?", paragraphs: ["Nein. Der Datei-Scanner liest nur begrenzte Proben, Signaturen und Muster, ohne die Datei auszuführen. Ein sauberes Ergebnis beweist keine Harmlosigkeit."] },
        { heading: "Wie installiere ich ByteQuant?", paragraphs: ["Nutzen Sie die Schaltfläche „App installieren“ oder den Browserbefehl „Zum Startbildschirm hinzufügen“. Auf iOS erfolgt dies in Safari über Teilen → Zum Home-Bildschirm. ByteQuant ist eine PWA und keine APK. Bei einer Android-Altwarnung: abbrechen, Browser aktualisieren, alte Verknüpfung entfernen und neu installieren."] },
        { heading: "Was funktioniert offline?", paragraphs: ["Die App-Hülle und bereits besuchte, gecachte Seiten können offline geöffnet werden. Noch nicht besuchte Seiten benötigen eine Verbindung. Werkzeugeingaben werden nie offline gespeichert."] },
        { heading: "Sind Deutsch und Chinesisch vollständig unterstützt?", paragraphs: ["Navigation, alle 89 Werkzeugseiten, Kernseiten, Metadaten und strukturierte Daten sind lokalisiert. Sieben ausführliche Arbeitsabläufe sind redaktionell auf Deutsch und Chinesisch verfügbar; weitere Bestandsartikel bleiben transparent als englische Originale gekennzeichnet."] },
        { heading: "Sind Vertrags-, Rechnungs- oder Finanzresultate verbindlich?", paragraphs: ["Nein. Es sind editierbare Entwürfe und mathematische Szenarien. Prüfen Sie Rechtsordnung, Steuerregeln, Institutionstabellen und professionelle Beratung separat."] },
        { heading: "Was beweist ein gleicher Datei-Hash?", paragraphs: ["Ein gleicher SHA-256-Wert macht bytegleiche Dateien sehr wahrscheinlich. Er beweist weder Schadstofffreiheit noch Herkunft oder Identität des Herausgebers; dafür sind getrennt vertrauenswürdige Hashes, Signaturen und Sicherheitsprüfungen nötig."] },
        { heading: "Kann die erzeugte CSP direkt produktiv verwendet werden?", paragraphs: ["Nein. Die Startpolicy muss zuerst im Report-Only-Modus mit den realen Seiten, Browsern und Integrationen getestet werden. Unerklärte Verstöße müssen vor der Durchsetzung behoben werden."] },
      ],
    },
  },
  zh: {
    about: {
      eyebrow: "关于 BYTEQUANT",
      title: "让数字工作更私密、透明且易于使用",
      intro: "ByteQuant 是一个独立的隐私优先 Web 项目，工具直接在浏览器中运行。",
      sections: [
        { heading: "为什么创建 ByteQuant", paragraphs: ["JSON 验证、单位换算或数据遮蔽等许多小任务在技术上并不需要上传。ByteQuant 把这类工作保留在当前浏览器标签页，并清楚说明方法与限制。", "我们把客户端处理视为技术边界，而不是营销口号。未来如增加外部数据流，必须在启用前公开说明。"] },
        { heading: "产品原则", paragraphs: ["我们构建无需强制账户、可访问、可解释的小工具。"], bullets: ["无需服务器的任务留在设备上", "友好显示错误", "明确说明估算与法律限制", "保持移动端、键盘和性能友好", "提供纠错与安全报告渠道"] },
        { heading: "安全与编辑方法", paragraphs: ["文件、代码和 URL 检查只是有限的启发式预扫描，不是杀毒软件、完整 SAST 或信誉查询。", "法律、财务和安全关键内容仅为一般信息，具体决策需要合格专业人员审查。"] },
      ],
    },
    privacy: {
      eyebrow: "隐私政策",
      title: "让数据路径清晰并尽可能短",
      intro: "本政策说明访问 bytequant.org 时的数据处理方式。当前版本不会把工具输入发送到 ByteQuant 服务器。",
      updated: "最后更新：2026 年 7 月 17 日",
      sections: [
        { heading: "1. 负责人和联系", paragraphs: ["ByteQuant 是本服务的数据负责人。隐私请求可发送至 bytequant@yahoo.com。", "工具输入不会被集中保存。通过电子邮件联系时，消息和联系方式仅用于回复及必要记录。"] },
        { heading: "2. 浏览器内工具处理", paragraphs: ["文本、提示词、JSON、CSV、代码、密码、图片和 PDF 在当前浏览器标签页中处理。文件与代码预扫描不会执行内容，也不会把内容发送到扫描服务。", "复制或下载会在您的设备上创建由您控制的新副本。之后的剪贴板、下载文件和共享设备风险由您管理。"] },
        { heading: "3. PWA、Service Worker 与离线缓存", paragraphs: ["可安装 Web 应用只缓存同源应用资源和已访问的 GET 页面。工具输入、生成结果、密码和所选文件绝不会写入离线缓存。", "ByteQuant 不分发 APK。Android 的 WebAPK/应用封装由浏览器生成，网站无法设置其目标 Android 版本。如出现旧版 Android 警告，请取消安装、更新浏览器、移除旧的 ByteQuant 快捷方式，再从最新版浏览器菜单重新安装。", "您可在浏览器或应用设置中移除 Service Worker。安装图标不会改变本地隐私模型。"] },
        { heading: "4. 本地存储与同意", paragraphs: ["bq-consent-v1 保存 180 天的选择，bq-theme 保存所选主题。bq-tool-usage-v1 仅在同意后启用，只包含工具标识、次数和最后使用时间，不包含内容。", "当前没有启用分析、广告或跟踪 SDK。如未来启用，会先更新说明和有效同意流程。"] },
        { heading: "5. 托管、权利与安全", paragraphs: ["静态网站计划托管于 GitHub Pages。托管和网络提供商可能按其政策处理 IP、时间、路径和 User-Agent 等连接记录；工具输入不属于这些请求。", "在适用法律范围内，您可能享有访问、更正、删除、限制、反对和投诉权。数据最小化能降低风险，但不能保证绝对安全。"] },
      ],
    },
    cookies: {
      eyebrow: "COOKIE 与本地存储",
      title: "无跟踪 Cookie；可选本地快捷方式需先同意",
      intro: "ByteQuant 当前不设置 HTTP Cookie、分析标识或活动广告标签。",
      updated: "最后更新：2026 年 7 月 17 日",
      sections: [
        { heading: "必要存储", paragraphs: ["bq-consent-v1 记住 180 天的选择，bq-theme 保存明确选择的主题。它们不包含工具输入。"] },
        { heading: "可选个性化", paragraphs: ["经您同意后，bq-tool-usage-v1 在本地记录打开的工具，只保存 slug、计数和最后时间，不保存文本、文件、密码或结果。", "您可通过页脚的“隐私选择”撤回同意，相关可选记录会被删除。"] },
        { heading: "可安装应用的离线缓存", paragraphs: ["同源 Service Worker 缓存应用资源和已访问页面，以便离线启动。表单输入与工具输出不会被拦截或保存。缓存可在浏览器或应用设置中删除。"] },
      ],
    },
    terms: {
      eyebrow: "使用条款",
      title: "免费工具与清晰的责任边界",
      intro: "使用 ByteQuant 即表示您接受本条款，并仅将工具用于合法且获授权的目的。",
      updated: "最后更新：2026 年 7 月 17 日",
      sections: [
        { heading: "允许的使用", paragraphs: ["只处理您依法有权检查的数据、文件、URL 和源代码。不得绕过访问控制、加密、许可证或第三方权利。"] },
        { heading: "不构成专业或安全保证", paragraphs: ["计算、合同与发票草稿、引用、恶意指标和提示词评分只是辅助工具，不能替代法律、财务、教育、税务或安全建议。", "文件、代码或 URL 报告无异常，并不能证明安全。关键结果必须独立核验。"] },
        { heading: "可用性与责任", paragraphs: ["服务不保证持续可用或没有错误。安装属于浏览器 PWA 功能；ByteQuant 不分发 APK，也不保证浏览器生成的 Android 封装兼容性。重要使用前请核验并备份结果。在法律允许范围内，输入、解释和使用责任由用户承担。"] },
      ],
    },
    contact: {
      eyebrow: "联系",
      title: "问题、纠错与安全报告",
      intro: "可就支持、隐私、无障碍、内容纠错或负责任的安全报告联系 ByteQuant。",
      sections: [
        { heading: "电子邮件", paragraphs: ["请发送至 bytequant@yahoo.com。不要通过邮件发送密码、私钥、未遮蔽的个人数据集或活动恶意软件。"] },
        { heading: "安全报告", paragraphs: ["请说明受影响 URL、可复现步骤、影响和安全联系方式。在给予合理修复时间前，请勿公开问题。", "协调披露方式也记录在 /.well-known/security.txt。"] },
      ],
    },
    faq: {
      eyebrow: "常见问题",
      title: "使用前需要了解的事项",
      intro: "关于隐私、安装、离线使用、新语言和安全限制的简短说明。",
      sections: [
        { heading: "工具输入会上传吗？", paragraphs: ["不会。核心处理在当前浏览器标签页中运行。文件、代码和 URL 预扫描不使用外部扫描 API。"] },
        { heading: "ByteQuant 是杀毒软件吗？", paragraphs: ["不是。文件扫描器只读取有限样本、签名和模式，不会执行文件。无发现不代表文件无害。"] },
        { heading: "如何安装 ByteQuant？", paragraphs: ["使用“安装应用”按钮，或浏览器的“添加到主屏幕”。在 iOS Safari 中选择“分享”→“添加到主屏幕”。ByteQuant 是 PWA，不是 APK；若 Android 显示旧版本警告，请取消、更新浏览器、移除旧快捷方式后重新安装。"] },
        { heading: "离线时哪些功能可用？", paragraphs: ["应用外壳和已访问且已缓存的页面可离线打开。未访问页面需要联网。工具输入绝不会被离线保存。"] },
        { heading: "德语和中文是否完整支持？", paragraphs: ["导航、全部 89 个工具页面、核心页面、元数据和结构化数据已本地化。七个详细工作流已完成德语与中文编辑本地化；其他既有文章会明确标注为英文原文。"] },
        { heading: "合同、发票或投资结果具有约束力吗？", paragraphs: ["不具有。它们是可编辑草稿和数学情景。司法辖区、税务、院校换算和专业建议必须另行核验。"] },
        { heading: "文件哈希一致能证明什么？", paragraphs: ["相同 SHA-256 表明文件极大概率逐字节一致，但不能证明无恶意内容、来源可信或发布者身份。仍需独立可信哈希、数字签名和安全检查。"] },
        { heading: "生成的 CSP 可以直接用于生产环境吗？", paragraphs: ["不可以。应先在 Report-Only 模式下结合真实页面、浏览器和集成进行测试。正式强制前必须解决无法解释的违规。"] },
      ],
    },
  },
};
