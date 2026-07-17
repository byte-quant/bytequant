import type { ArticleSection } from "./posts";

export type LocalizedGuideLocale = "de" | "zh";
type GuideCopy = { title: string; excerpt: string; description: string; category: string; readTime: string; sections: ArticleSection[] };
export type LocalizedGuide = { slug: string; date: string; updated?: string; relatedTools: string[]; copy: Record<LocalizedGuideLocale, GuideCopy> };

export const localizedGuides: LocalizedGuide[] = [
  {
    slug: "local-prompt-text-date-workflow",
    date: "2026-07-16",
    relatedTools: ["prompt-sablon-degisken-doldurucu", "yerel-metin-ozetleyici", "tarih-farki-hesaplayici"],
    copy: {
      de: {
        title: "Lokale Produktivität: Prompt-Vorlagen, Textzusammenfassung und Datumsplanung",
        excerpt: "Drei browserbasierte Arbeitsabläufe für wiederholbare Prompts, nachvollziehbare Kurzfassungen und robuste Datumsberechnungen.",
        description: "Praxisleitfaden zu Prompt-Variablen, extraktiver Zusammenfassung und Datumsdifferenzen mit Datenschutz-, Qualitäts- und Prüfgrenzen.",
        category: "Lokale Produktivität",
        readTime: "10 Min.",
        sections: [
          { heading: "Warum kleine lokale Schritte produktiver sein können", paragraphs: ["Viele Alltagsaufgaben benötigen weder ein Benutzerkonto noch eine serverseitige KI. Eine Prompt-Vorlage wird durch deterministische Textersetzung gefüllt, eine extraktive Zusammenfassung bewertet vorhandene Sätze und eine Datumsdifferenz nutzt Kalenderarithmetik. Diese Grenzen machen das Ergebnis nachvollziehbar und vermeiden unnötige Datenkopien.", "Lokal bedeutet nicht automatisch fehlerfrei. Browser-Erweiterungen, ein kompromittiertes Gerät, ungeprüfte Eingaben und falsch interpretierte Ergebnisse bleiben Risiken. Deshalb zeigt jeder Schritt Methode, Eingabegrenze und notwendige menschliche Kontrolle."], bullets: ["Keine sensiblen Werte in gemeinsam genutzte Prompt-Vorlagen schreiben.", "Zusammenfassungen immer mit der Quelle vergleichen.", "Rechtliche Fristen nur nach der einschlägigen Regel berechnen."] },
          { heading: "Prompt-Vorlagen ohne versteckte Lücken", paragraphs: ["Benannte {{variablen}} machen sichtbar, welche Werte eine wiederkehrende Aufgabe benötigt. Verständliche Namen wie {{zielgruppe}} oder {{ausgabeformat}} sind besser als v1 und v2. Die Werte sollten getrennt von der Vorlage gepflegt werden, damit Änderungen geprüft und dokumentiert werden können.", "Nach dem Füllen müssen Restplatzhalter, widersprüchliche Werte und personenbezogene Daten geprüft werden. Textersetzung bewertet weder Wahrheit noch Angemessenheit des fertigen Prompts und ruft kein Modell auf."], bullets: ["Eine Variable hat genau eine Bedeutung.", "Pflichtwerte und optionale Werte dokumentieren.", "Mit leeren, langen und mehrsprachigen Werten testen."] },
          { heading: "Extraktive Zusammenfassung richtig einordnen", paragraphs: ["Der lokale Zusammenfasser schreibt keinen neuen Text. Er zerlegt die Quelle in Sätze, gewichtet häufige Inhaltswörter und übernimmt die bestbewerteten Originalsätze in Quellenreihenfolge. Das senkt Halluzinationsrisiken, kann aber seltene und dennoch entscheidende Informationen übersehen.", "Für Verträge, medizinische Angaben, Sicherheitsereignisse oder Zahlenwerke sollte jede ausgewählte Aussage zur Fundstelle zurückverfolgt werden. Eine kurze Fassung ist eine Navigationshilfe, kein Ersatz für die Quelle."], bullets: ["Mehrere Zusammenfassungslängen vergleichen.", "Negationen, Ausnahmen und Zahlen separat prüfen.", "Keine semantische KI-Bewertung behaupten."] },
          { heading: "Datumsdifferenzen ohne Zeitzonenfalle", paragraphs: ["Reine Kalenderdaten werden als UTC-Tage behandelt, damit Sommerzeit oder lokale Mitternacht keinen zusätzlichen Tag erzeugt. Die Option zur Einbeziehung beider Endpunkte muss bewusst gewählt werden: 1. bis 2. Januar sind als Abstand ein Tag, bei inklusiver Zählung zwei Kalendertage.", "Wochentage sind keine offiziellen Arbeitstage. Regionale Feiertage, tarifliche Regeln, Annahmeschlusszeiten und gesetzliche Fristberechnung müssen außerhalb des Rechners berücksichtigt werden."] },
        ],
      },
      zh: {
        title: "本地效率工作流：提示词模板、文本摘要与日期规划",
        excerpt: "用三个浏览器内工作流完成可复用提示词、可解释摘要和稳健日期计算。",
        description: "详细说明提示词变量、抽取式摘要和日期差计算，并明确隐私、质量与核验边界。",
        category: "本地效率",
        readTime: "约 10 分钟",
        sections: [
          { heading: "为什么小型本地步骤可以提高效率", paragraphs: ["许多日常任务不需要账户、服务器或远程 AI。提示词模板只是确定性文本替换；抽取式摘要对原文句子评分；日期差使用日历运算。明确的技术边界让结果更容易解释，也减少不必要的数据副本。", "本地并不等于绝对正确或安全。浏览器扩展、受感染设备、未经检查的输入和错误解释仍然是风险。因此每一步都应显示方法、输入限制和人工核验要求。"], bullets: ["不要把敏感值写入共享提示词模板。", "摘要必须与原文逐项核对。", "法律期限必须按照适用规则另行计算。"] },
          { heading: "用命名变量避免提示词缺口", paragraphs: ["{{变量}} 能明确展示重复任务需要哪些信息。{{受众}}、{{输出格式}} 等有意义的名称优于 v1、v2。模板和值应分开维护，以便审核、复用和记录变更。", "填充后仍需检查残留占位符、冲突值和个人数据。文本替换不会判断最终提示词是否真实、适当，也不会调用模型。"], bullets: ["每个变量只表达一个含义。", "记录必填项与可选项。", "用空值、长文本和多语言值测试。"] },
          { heading: "正确理解抽取式摘要", paragraphs: ["本地摘要器不会重写内容。它把来源拆成句子，根据高频内容词评分，再按原文顺序返回高分句。因此它能减少生成式幻觉，却可能遗漏低频但关键的信息。", "合同、医疗信息、安全事件或数字报告中的每项摘要都应回溯到原始位置。短摘要是导航工具，不能替代完整来源。"], bullets: ["比较不同句数的摘要。", "单独检查否定、例外和数字。", "不要把结果描述为语义 AI 判断。"] },
          { heading: "避免日期计算的时区陷阱", paragraphs: ["纯日期按 UTC 日历日处理，可避免夏令时或本地午夜导致多算一天。是否包含起止两天必须明确：1 月 1 日到 2 日的间隔是 1 天，若两端都计入则是 2 个日历日。", "工作日数量不等于官方办公日。地区假日、组织制度、截止时间和法律期限规则必须在计算器之外另行处理。"] },
        ],
      },
    },
  },
  {
    slug: "json-schema-image-hash-workflow",
    date: "2026-07-16",
    relatedTools: ["json-schema-olusturucu", "gorsel-boyutlandirici", "dosya-hash-karsilastirici"],
    copy: {
      de: {
        title: "Daten- und Dateiintegrität: JSON Schema, Bildskalierung und SHA-256",
        excerpt: "So entwickeln Sie aus Beispieldaten prüfbare Schemas, skalieren Bilder datensparsam und vergleichen Dateien mit SHA-256.",
        description: "Technischer Leitfaden für lokale JSON-Schema-Ableitung, Canvas-Bildskalierung und Datei-Integritätsprüfung mit SHA-256.",
        category: "Daten & Integrität",
        readTime: "11 Min.",
        sections: [
          { heading: "Von einem JSON-Beispiel zum belastbaren Vertrag", paragraphs: ["Ein automatisch abgeleitetes Schema beschreibt nur das gegebene Beispiel. Ist ein Feld vorhanden, wird es zunächst als erforderlich behandelt; enthält eine Beispiel-Liste nur Text, ist damit nicht bewiesen, dass produktive Daten niemals null oder Zahlen enthalten.", "Nutzen Sie das Ergebnis als Entwurf. Ergänzen Sie format, enum, Längen- und Wertebereiche, bewusst optionale Felder sowie zusätzliche Beispiele. Validieren Sie gute und absichtlich fehlerhafte Datensätze in CI, bevor das Schema als Vertrag gilt."], bullets: ["Mehrere repräsentative Beispiele sammeln.", "Required-Listen fachlich prüfen.", "additionalProperties bewusst entscheiden.", "Schema-Version und Änderungspolitik dokumentieren."] },
          { heading: "Bilder im Browser skalieren", paragraphs: ["Canvas dekodiert das Bild und zeichnet Pixel in eine neue Fläche. Dadurch lassen sich WebP oder JPG mit Qualitätsfaktor erzeugen und Abmessungen reduzieren, ohne die Datei hochzuladen. Die Verarbeitung benötigt jedoch Gerätespeicher entsprechend der dekodierten Pixelmenge, nicht nur entsprechend der komprimierten Dateigröße.", "Beim Neucodieren können EXIF, ICC-Profile und andere Metadaten verloren gehen. Das ist für Webausgaben oft erwünscht, für Druck, Beweisführung oder Archivierung aber möglicherweise ungeeignet. Bewahren Sie das Original getrennt auf und prüfen Sie Transparenz, Schärfe und Farbwirkung."], bullets: ["Seitenverhältnis standardmäßig bewahren.", "Nicht unnötig hochskalieren.", "Dateigröße und sichtbare Qualität gemeinsam vergleichen.", "Das Original niemals überschreiben."] },
          { heading: "Was SHA-256 beweist – und was nicht", paragraphs: ["SHA-256 erzeugt für dieselben Bytes denselben Digest. Stimmen zwei lokal berechnete Werte überein, sind die verglichenen Dateien mit extrem hoher Wahrscheinlichkeit bytegleich. Die Aussage ist nur so vertrauenswürdig wie der erwartete Hash und dessen Übertragungsweg.", "Ein Angreifer kann eine schädliche Datei zusammen mit ihrem passenden Hash veröffentlichen. Hashes sind daher keine Malware-Prüfung, Signatur und Identitätsbestätigung. Für Herkunft benötigen Sie eine vertrauenswürdige digitale Signatur oder einen getrennt authentisierten Kanal."], bullets: ["Erwarteten Hash über einen unabhängigen Kanal beziehen.", "Algorithmus und Groß-/Kleinschreibung normalisieren.", "Bei Abweichung Datei nicht ausführen.", "Für Herkunft Signaturen prüfen."] },
          { heading: "Ein kombinierter Prüfablauf", paragraphs: ["Datenstrukturen zuerst mit repräsentativen Beispielen und Schema validieren. Medien anschließend in einer Kopie skalieren und das Ergebnis visuell prüfen. Für freizugebende Artefakte zum Schluss SHA-256 protokollieren. So bleiben Struktur, Darstellung und Byte-Integrität getrennte, nachvollziehbare Kontrollen.", "Keine einzelne Stufe erklärt den gesamten Sicherheitszustand. Ergänzen Sie Berechtigungsprüfung, Malware-Schutz, Backups, Quellcodeprüfung und fachliche Freigaben passend zum Risiko."] },
        ],
      },
      zh: {
        title: "数据与文件完整性：JSON Schema、图片缩放与 SHA-256",
        excerpt: "从示例数据构建可检查 Schema，在本地缩放图片，并用 SHA-256 比较文件。",
        description: "面向本地 JSON Schema 推断、Canvas 图片缩放和 SHA-256 文件完整性检查的技术指南。",
        category: "数据与完整性",
        readTime: "约 11 分钟",
        sections: [
          { heading: "从单个 JSON 示例走向可靠契约", paragraphs: ["自动推断的 Schema 只描述当前示例。示例中出现的字段会先被视为必填；数组里只有字符串，也不能证明生产数据永远不会出现 null 或数字。", "应把输出当作草稿，补充 format、enum、长度和数值范围，明确可选字段，并加入更多示例。在把 Schema 作为契约前，应在 CI 中验证正常数据和故意错误的数据。"], bullets: ["收集多个有代表性的样本。", "由业务负责人核对 required 列表。", "明确决定 additionalProperties。", "记录 Schema 版本和变更政策。"] },
          { heading: "在浏览器中调整图片尺寸", paragraphs: ["Canvas 会解码图片并把像素绘制到新画布，因此可在不上传文件的情况下生成带质量参数的 WebP/JPG 并降低尺寸。但内存消耗取决于解码后的像素数量，而不仅是压缩文件大小。", "重新编码可能移除 EXIF、ICC 配置和其他元数据。网页发布时这通常有利，但不一定适合打印、证据保全或归档。请单独保存原图，并检查透明度、锐度与颜色。"], bullets: ["默认保持宽高比。", "避免无意义放大。", "同时比较文件大小与可见质量。", "绝不覆盖原始文件。"] },
          { heading: "SHA-256 能证明什么", paragraphs: ["相同字节会生成相同 SHA-256 摘要。如果两个本地结果一致，文件极大概率逐字节相同。但结论的可信度取决于预期哈希值及其传递渠道。", "攻击者可以同时发布恶意文件和对应哈希，因此哈希不是恶意软件检测、数字签名或身份验证。验证来源需要可信数字签名或独立认证渠道。"], bullets: ["通过独立渠道获取预期哈希。", "确认算法并规范大小写。", "不一致时不要执行文件。", "来源验证应使用签名。"] },
          { heading: "组合成可审计工作流", paragraphs: ["先用代表性样本和 Schema 验证数据结构，再对媒体副本调整尺寸并目视检查，最后为待交付文件记录 SHA-256。结构、显示效果与字节完整性因此成为相互独立、可追踪的控制。", "任何单一步骤都不能说明整体安全状态。应根据风险补充权限检查、恶意软件防护、备份、代码审查和业务审批。"] },
        ],
      },
    },
  },
  {
    slug: "loan-ai-rubric-csp-workflow",
    date: "2026-07-16",
    relatedTools: ["kredi-odeme-hesaplayici", "ai-yanit-degerlendirme-rubrigi", "csp-olusturucu-denetleyici"],
    copy: {
      de: {
        title: "Entscheidungen prüfbar machen: Kreditrechnung, KI-Rubrik und CSP-Audit",
        excerpt: "Transparente Formeln, gewichtete menschliche Bewertung und schrittweise CSP-Einführung für Entscheidungen mit höherer Wirkung.",
        description: "Leitfaden für überprüfbare Kredit-Szenarien, KI-Antwort-Rubriken und sichere Content-Security-Policy-Einführung.",
        category: "Prüfbare Entscheidungen",
        readTime: "12 Min.",
        sections: [
          { heading: "Gemeinsames Prinzip: Annahmen vor dem Ergebnis", paragraphs: ["Kreditberechnung, KI-Bewertung und CSP wirken fachlich verschieden, teilen aber eine wichtige Regel: Erst Eingaben und Annahmen dokumentieren, dann Ergebnis oder Bewertung erzeugen. Eine präzise Zahl, ein hoher Score oder eine lange Sicherheitsrichtlinie ist ohne nachvollziehbaren Kontext wenig wert.", "Werkzeuge sollten Entscheidungen strukturieren, nicht Verantwortung automatisieren. Finanzielle, organisatorische und sicherheitskritische Freigaben benötigen zuständige Menschen, aktuelle Regeln und prüfbare Aufzeichnungen."], bullets: ["Eingabequelle und Zeitpunkt notieren.", "Unsicherheit sichtbar lassen.", "Gegenbeispiele testen.", "Freigabeverantwortung benennen."] },
          { heading: "Kredit-Szenarien korrekt lesen", paragraphs: ["Die Annuitätenformel berechnet bei konstantem Periodenzins eine gleichbleibende Rate. Anfangs ist der Zinsanteil höher; mit sinkender Restschuld steigt der Tilgungsanteil. Ein längerer Zeitraum kann die Rate senken und dennoch die Gesamtkosten erhöhen.", "Vergleichen Sie nicht nur die Rate. Prüfen Sie effektiven Jahreszins, Gebühren, Versicherungen, Steuern, variable Zinssätze, Sondertilgung und offizielle Rundung. Der ByteQuant-Rechner ist ein mathematisches Szenario und kein verbindliches Angebot."], bullets: ["Monats- und Jahreszins nicht verwechseln.", "Alle einmaligen Kosten erfassen.", "Mehrere Laufzeiten vergleichen.", "Bankplan und gesetzliche Pflichtangaben heranziehen."] },
          { heading: "KI-Antworten mit Rubriken statt Bauchgefühl", paragraphs: ["Eine gute Rubrik definiert für die konkrete Aufgabe wenige unterscheidbare Kriterien, eine Gewichtung und beobachtbare Fragen. Genauigkeit, Quellenbezug, Unsicherheit, Sicherheit und Zielgruppenpassung sollten getrennt bewertet werden, weil flüssige Sprache fachliche Fehler verdecken kann.", "Vier Leistungsstufen helfen, Bewertungen zu kalibrieren. Lassen Sie mehrere Personen dieselben Beispiele unabhängig bewerten, vergleichen Sie Abweichungen und präzisieren Sie Kriterien. Ein Rubrik-Score ist kein Beweis für Wahrheit oder Modellsicherheit."], bullets: ["Gewichte müssen zur Auswirkung passen.", "Jedes Kriterium braucht beobachtbare Evidenz.", "Grenzfälle und absichtlich schlechte Antworten testen.", "Inter-Rater-Abweichung dokumentieren."] },
          { heading: "CSP schrittweise und ohne Produktionsausfall einführen", paragraphs: ["Content-Security-Policy begrenzt, aus welchen Quellen Browser Skripte, Stile, Bilder und andere Ressourcen laden dürfen. default-src, base-uri, object-src und frame-ancestors bilden einen sinnvollen Start. Wildcards, unsicheres HTTP, unsafe-eval und inline Skripte vergrößern die Angriffsfläche.", "Eine strenge Policy kann legitime Funktionen blockieren. Beginnen Sie mit Content-Security-Policy-Report-Only, sammeln Sie Verletzungen ohne sensible Daten, inventarisieren Sie tatsächliche Quellen und ersetzen Sie breite Ausnahmen möglichst durch Nonces oder Hashes. Erst nach Browser- und Funktionsprüfung sollte die Policy erzwungen werden."], bullets: ["Quelleninventar vor der Policy erstellen.", "Report-Only und automatisierte Seitentests verwenden.", "Keine Berichtsdaten mit Geheimnissen senden.", "Policy bei jeder neuen Drittintegration neu prüfen."] },
          { heading: "Freigabekriterien definieren", paragraphs: ["Für jeden Ablauf braucht es ein Stop-Kriterium: Kreditwerte weichen vom offiziellen Plan ab, KI-Bewerter erzielen keine ausreichende Übereinstimmung oder CSP-Berichte zeigen unerklärte Blockierungen. In diesen Fällen ist Nacharbeit erforderlich, keine automatische Freigabe.", "Dokumentieren Sie Version, Eingaben, Ergebnis, Prüfer und Entscheidung. So wird ein Browserwerkzeug Teil eines kontrollierten Prozesses statt eine scheinbar endgültige Antwortmaschine."] },
        ],
      },
      zh: {
        title: "让决策可核验：贷款计算、AI 量表与 CSP 审计",
        excerpt: "用透明公式、加权人工评估和分阶段 CSP 部署处理影响更高的决策。",
        description: "关于可核验贷款情景、AI 回答评估量表和安全引入 Content-Security-Policy 的详细指南。",
        category: "可核验决策",
        readTime: "约 12 分钟",
        sections: [
          { heading: "共同原则：先记录假设，再看结果", paragraphs: ["贷款计算、AI 评估和 CSP 看似不同，却共享一条重要规则：先记录输入与假设，再生成结果或评分。没有上下文的精确数字、高分或很长的安全策略，价值都很有限。", "工具应帮助组织决策，而不是自动承担责任。财务、组织和安全关键审批仍需要明确负责人、最新规则和可审计记录。"], bullets: ["记录输入来源和时间。", "保留并显示不确定性。", "测试反例和边界情况。", "明确最终审批责任人。"] },
          { heading: "正确阅读贷款情景", paragraphs: ["年金公式在周期利率不变时计算等额还款。初期利息占比较高，随着余额下降，本金占比提高。延长期限可能降低月供，却增加总成本。", "不要只比较月供，还要核对实际年利率、费用、保险、税费、浮动利率、提前还款和官方舍入规则。ByteQuant 结果是数学情景，不是具有约束力的报价。"], bullets: ["不要混淆月利率与年利率。", "纳入所有一次性成本。", "比较多个期限。", "以银行正式计划和法定披露为准。"] },
          { heading: "用量表而不是直觉评估 AI 回答", paragraphs: ["优秀量表应针对具体任务，定义少量可区分标准、权重和可观察问题。准确性、来源、不确定性、安全性和受众适配应分别评分，因为流畅语言可能掩盖事实错误。", "四级标准有助于校准。让多位评审者独立评价同一批样本，比较差异并改进描述。量表得分不能证明内容真实或模型安全。"], bullets: ["权重应与潜在影响一致。", "每项标准都需要可观察证据。", "测试边界案例和故意错误回答。", "记录评审者之间的差异。"] },
          { heading: "分阶段部署 CSP，避免生产故障", paragraphs: ["Content-Security-Policy 限制浏览器可从哪些来源加载脚本、样式、图片等资源。default-src、base-uri、object-src 和 frame-ancestors 是合理起点。通配符、不安全 HTTP、unsafe-eval 与内联脚本会扩大攻击面。", "严格策略也可能阻断正常功能。应先使用 Content-Security-Policy-Report-Only，在不包含敏感数据的前提下收集违规，盘点真实来源，并尽量用 nonce 或 hash 取代宽泛例外。完成浏览器与功能测试后再正式强制。"], bullets: ["先建立资源来源清单。", "结合 Report-Only 与自动化页面测试。", "不要在报告中发送秘密信息。", "每次新增第三方集成都重新审计。"] },
          { heading: "定义明确的停止与审批条件", paragraphs: ["每个流程都要有停止条件：贷款结果与正式计划不符、AI 评审者一致性不足，或 CSP 报告出现无法解释的拦截。遇到这些情况应返工，而不是自动批准。", "记录版本、输入、结果、评审者和最终决定。这样，浏览器工具才能成为受控流程的一部分，而不是看似给出最终答案的机器。"] },
        ],
      },
    },
  },
];

export const legacyLocalizedGuideSlugs = {
  "lokale-produktivitaet-prompt-text-datum-workflow": "local-prompt-text-date-workflow",
  "json-schema-bild-hash-integritaet-workflow": "json-schema-image-hash-workflow",
  "kredit-ai-bewertung-csp-entscheidungsworkflow": "loan-ai-rubric-csp-workflow",
} as const;

/**
 * Editorial routes use one stable, ASCII, language-neutral slug identifier in
 * every locale. Legacy German-mixed slugs remain resolvable as noindex aliases
 * at the route layer so previously shared URLs do not become hard 404s.
 */
export function getLocalizedGuide(slug: string) {
  const canonicalSlug = legacyLocalizedGuideSlugs[slug as keyof typeof legacyLocalizedGuideSlugs] ?? slug;
  return localizedGuides.find((guide) => guide.slug === canonicalSlug);
}
