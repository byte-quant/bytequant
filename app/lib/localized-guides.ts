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
  {
    slug: "yaml-xml-json-csv-local-data-workflow",
    date: "2026-07-18",
    relatedTools: ["yaml-json-donusturucu", "xml-bicimlendirici-dogrulayici", "json-flatten-unflatten", "csv-tekil-satir-ayiklayici", "url-sorgu-parametresi-analizoru", "html-varlik-kodlayici", "data-uri-donusturucu"],
    copy: {
      de: {
        title: "Lokale Datenkonvertierung: YAML, XML, JSON und CSV zuverlässig prüfen",
        excerpt: "Konvertieren, normalisieren und bereinigen Sie strukturierte Daten im Browser, ohne Syntaxprüfung mit fachlicher Validierung zu verwechseln.",
        description: "Ein technischer Leitfaden zu YAML/JSON, XML, flachem JSON, CSV-Deduplizierung, URL-Parametern und HTML-Entities mit klaren Prüfschritten.",
        category: "Datenqualität",
        readTime: "13 Min.",
        sections: [
          { heading: "Syntax ist erst die erste Prüfschicht", paragraphs: ["Ein Parser kann bestätigen, dass YAML, JSON oder XML formal lesbar ist. Er weiß jedoch nicht, ob Währung, Zeitzone, Kennung oder Pflichtfeld fachlich richtig sind. Bewahren Sie deshalb das Original, dokumentieren Sie Zeichencodierung und erwartetes Schema und prüfen Sie die Ausgabe mit repräsentativen Positiv- und Negativbeispielen.", "YAML-Aliase und mehrdeutige Typen, XML-Namespaces sowie große Dokumente brauchen besondere Grenzen. ByteQuant verarbeitet im aktiven Tab und begrenzt Alias-Auflösung; die Ausgabe bleibt dennoch ein Konvertierungsentwurf, kein Beweis für sichere Konfiguration."], bullets: ["Vor der Umwandlung eine unveränderte Kopie sichern.", "Schema und Pflichtfelder getrennt validieren.", "Null, leere Werte, Unicode und große Zahlen testen.", "Diff vor der Übernahme prüfen."] },
          { heading: "Flaches JSON und CSV-Deduplizierung brauchen eine Schlüsselregel", paragraphs: ["Beim Flattening werden verschachtelte Pfade zu Schlüsseln. Punkte, Array-Indizes und vorhandene Sonderzeichen können kollidieren; die Rückwandlung muss deshalb mit demselben Pfadvertrag getestet werden. Ein Roundtrip-Test aus Objekt, flacher Form und Objekt zeigt früh, ob Struktur verloren geht.", "CSV-Zeilen sind nur bezüglich der gewählten Spalten doppelt. Groß-/Kleinschreibung, Leerzeichen, leere Werte und die Entscheidung ‚erste oder letzte Zeile behalten‘ verändern das Ergebnis. Berichten Sie Quellzeilen, eindeutige Zeilen und entfernte Schlüssel und löschen Sie die Quelldatei nicht."], bullets: ["Eindeutigkeitsschlüssel fachlich benennen.", "Anführungszeichen und eingebettete Zeilenumbrüche testen.", "Entfernte Datensätze stichprobenartig prüfen."] },
          { heading: "URL-Parameter und HTML-Entities sind Kontextfragen", paragraphs: ["Doppelte Query-Parameter können je nach Server zuerst, zuletzt oder als Liste ausgewertet werden. Tracking-Parameter zu entfernen ändert die URL, beweist aber weder Datenschutz noch die Gleichheit der Serverantwort. Prüfen Sie Host, Pfad, Fragment, Signaturparameter und Weiterleitungen vor dem Teilen.", "HTML-Entity-Encoding schützt Text im HTML-Textkontext. Es ersetzt keine kontextabhängige Ausgabe-Kodierung für Attribute, URLs, CSS oder JavaScript und keine Sanitization von nicht vertrauenswürdigem HTML. Verwenden Sie DOM-APIs und ein geprüftes Sanitizing-Konzept, wenn Markup erlaubt werden soll."] },
        ],
      },
      zh: {
        title: "本地数据转换：可靠检查 YAML、XML、JSON 与 CSV",
        excerpt: "在浏览器内转换、规范化和清理结构化数据，同时区分语法有效与业务正确。",
        description: "涵盖 YAML/JSON、XML、扁平 JSON、CSV 去重、URL 参数与 HTML 实体的技术指南，并给出明确核验步骤。",
        category: "数据质量",
        readTime: "约 13 分钟",
        sections: [
          { heading: "语法只是第一层检查", paragraphs: ["解析器可以确认 YAML、JSON 或 XML 在形式上可读取，却不知道币种、时区、标识符和必填字段是否符合业务规则。应保留原始文件，记录字符编码和预期 Schema，并使用具有代表性的正确与错误样本核验输出。", "YAML 别名和隐式类型、XML 命名空间以及大型文档都需要专门限制。ByteQuant 在当前标签页处理并限制别名展开，但转换结果仍是待审核草稿，不是安全配置证明。"], bullets: ["转换前保存不可变原件。", "另行验证 Schema 与必填字段。", "测试 null、空值、Unicode 和大整数。", "采用前检查差异。"] },
          { heading: "扁平 JSON 与 CSV 去重必须先定义键", paragraphs: ["扁平化会把嵌套路径变成键；点号、数组索引和原有特殊字符可能发生冲突。应使用同一套路径约定进行对象→扁平→对象的往返测试，确认结构没有丢失。", "CSV 重复只相对于选定列成立。大小写、空格、空值以及保留第一行还是最后一行都会改变结果。请同时报告源行、唯一行和被移除键，并保留源文件。"], bullets: ["明确记录唯一键的业务含义。", "测试引号和字段内换行。", "抽样核对被移除记录。"] },
          { heading: "URL 参数与 HTML 实体取决于使用上下文", paragraphs: ["服务器可能把重复查询参数解释为首值、末值或列表。删除跟踪参数会改变 URL，但不能证明隐私合规，也不能保证响应相同。分享前检查主机、路径、片段、签名参数和重定向。", "HTML 实体编码只适用于 HTML 文本上下文。它不能替代属性、URL、CSS 或 JavaScript 的上下文输出编码，也不能净化不可信 HTML。若必须允许标记，请使用 DOM API 和经过审查的净化方案。"] },
        ],
      },
    },
  },
  {
    slug: "technical-seo-robots-hreflang-faq-utm-workflow",
    date: "2026-07-18",
    relatedTools: ["robots-txt-olusturucu-denetleyici", "hreflang-etiket-olusturucu", "faq-json-ld-olusturucu", "utm-kampanya-url-olusturucu", "seo-slug-olusturucu", "http-guvenlik-basliklari-denetleyici"],
    copy: {
      de: {
        title: "Technisches SEO ohne Abkürzungen: Robots, Hreflang, FAQ, UTM und Slugs",
        excerpt: "Bauen Sie stabile URL-Cluster, prüfbare Crawling-Regeln und sichtbare strukturierte Daten, ohne Ranking-Garantien zu versprechen.",
        description: "Praxisleitfaden für Robots.txt, reziprokes Hreflang, FAQPage JSON-LD, UTM-Namensregeln und langlebige Slugs nach Google-Grundsätzen.",
        category: "Technisches SEO",
        readTime: "14 Min.",
        sections: [
          { heading: "Stabile URLs, Canonicals und Weiterleitungen gemeinsam planen", paragraphs: ["Ein Slug soll lesbar sein, doch Stabilität ist wichtiger als nachträgliche Keyword-Optimierung. Wenn sich eine veröffentlichte URL ändern muss, benötigen alte Varianten eine permanente Weiterleitung; Canonical, interne Links, Sitemap und Sprachalternativen müssen im selben Release aktualisiert werden.", "Ein gemeinsamer ASCII-Slug in mehreren Sprachordnern ist kein Sprachfehler, wenn sichtbarer Inhalt und Metadaten vollständig lokalisiert sind. Jede Sprachseite braucht einen Self-Canonical und das gleiche reziproke Hreflang-Cluster."], bullets: ["Kollisionen vor Veröffentlichung prüfen.", "Alte Pfade in Redirect-Tests behalten.", "Tracking-Parameter nicht kanonisieren.", "Jede Sprache auf HTTP 200 prüfen."] },
          { heading: "Robots.txt steuert Crawling, nicht Zugriffsschutz", paragraphs: ["Robots.txt ist öffentlich und verhindert weder Zugriff noch zuverlässig die Indexierung einer bereits bekannten URL. Vertrauliche Inhalte benötigen Authentisierung und Autorisierung; zugängliche Seiten, die nicht indexiert werden sollen, brauchen passende Robots-Metadaten oder HTTP-Header.", "Prüfen Sie jede User-Agent-Gruppe, absolute HTTPS-Sitemaps und unbeabsichtigtes `Disallow: /`. Ein lokaler Strukturtest sieht keine CDN-Regel, keinen Live-Status und kein gerendertes Meta-Tag; kontrollieren Sie die bereitgestellte URL zusätzlich mit den Werkzeugen der Suchmaschine."] },
          { heading: "Hreflang, FAQ und UTM müssen die sichtbare Realität abbilden", paragraphs: ["Jede Sprachversion listet sich selbst und alle Alternativen mit identischen vollqualifizierten URLs; `x-default` dient als Fallback. Ein korrekter Code hilft nicht, wenn eine Alternative weiterleitet oder auf eine andere Seite kanonisiert.", "FAQPage-Markup darf nur sichtbare Fragen und Antworten enthalten. Gültiges JSON-LD garantiert kein Rich Result und keine Position. UTM-Werte dienen der Messung: standardisieren Sie source, medium und campaign, vermeiden Sie personenbezogene Daten und testen Sie Zielhost, Fragment und Analytik vor Veröffentlichung."], bullets: ["Markup und sichtbaren Text gemeinsam ändern.", "Keine Bewertung oder Garantie erfinden.", "Interne Standardlinks ohne UTM ausgeben.", "Suchleistung als Ergebnis messen, nicht behaupten."] },
        ],
      },
      zh: {
        title: "不走捷径的技术 SEO：Robots、Hreflang、FAQ、UTM 与 Slug",
        excerpt: "构建稳定 URL 集群、可核验抓取规则和可见结构化数据，不作排名保证。",
        description: "依据 Google 基本原则讲解 robots.txt、互惠 hreflang、FAQPage JSON-LD、UTM 命名与长期稳定 slug。",
        category: "技术 SEO",
        readTime: "约 14 分钟",
        sections: [
          { heading: "同步设计稳定 URL、Canonical 与重定向", paragraphs: ["Slug 应清晰，但稳定性比发布后追逐关键词更重要。必须变更已发布 URL 时，旧地址应永久重定向，并在同一次发布中同步更新 canonical、内部链接、站点地图和语言替代。", "不同语言目录共用 ASCII slug 并非语言错误，前提是可见内容和元数据都已完整本地化。每个语言页面都应自我 canonical，并列出完全相同、互相对应的 hreflang 集群。"], bullets: ["发布前检查冲突。", "在重定向测试中保留旧路径。", "不要把跟踪参数写入 canonical。", "确认每个语言版本返回 HTTP 200。"] },
          { heading: "Robots.txt 管理抓取，不是访问控制", paragraphs: ["robots.txt 是公开文件，不能阻止访问，也不能可靠移除搜索引擎已知 URL。敏感内容必须使用认证与授权；可访问但不应索引的页面应使用合适的 robots meta 或 HTTP 响应头。", "逐组检查 User-Agent、绝对 HTTPS sitemap，以及意外的 `Disallow: /`。本地结构检查无法看到 CDN 规则、线上状态或渲染后的 meta；部署后还应使用搜索引擎检查工具核验真实 URL。"] },
          { heading: "Hreflang、FAQ 与 UTM 必须对应可见事实", paragraphs: ["每个语言版本都应列出自身和所有替代页，并使用一致的完整 URL；`x-default` 提供未匹配语言的回退。语言代码正确并不足够，替代 URL 若重定向或 canonical 到别处，集群仍然错误。", "FAQPage 标记只能包含页面上可见的问题与答案。有效 JSON-LD 不保证富媒体结果或排名。UTM 用于测量：统一 source、medium、campaign 命名，不放个人数据，并在发布前测试目标主机、片段和分析事件。"], bullets: ["同步修改标记和可见文本。", "不得虚构评分或保证。", "普通内部链接不添加 UTM。", "通过数据测量效果，不预先声称效果。"] },
        ],
      },
    },
  },
  {
    slug: "unicode-text-percentage-time-productivity-workflow",
    date: "2026-07-18",
    relatedTools: ["unicode-normalizasyon-inceleyici", "satir-siralayici-tekillestirici", "kelime-sikligi-ngram-analizi", "yuzde-degisim-hesaplayici", "kdv-indirim-hesaplayici", "sure-mesai-hesaplayici", "rastgele-secici-takim-karistirici"],
    copy: {
      de: {
        title: "Versteckte Fehler in Texten und Alltagsrechnungen vermeiden",
        excerpt: "Nutzen Sie Unicode-, Listen-, N-Gramm-, Prozent-, Steuer-, Zeit- und Zufallswerkzeuge mit nachvollziehbaren Annahmen.",
        description: "Leitfaden zu Normalisierung, Deduplizierung, Formeln, Zeitzonen und Zufallsgrenzen bei kopierten Texten, Listen und Berechnungen.",
        category: "Produktivität & Qualität",
        readTime: "12 Min.",
        sections: [
          { heading: "Gleich aussehender Text kann technisch verschieden sein", paragraphs: ["Ein Zeichen kann als einzelner Codepoint oder als Grundzeichen plus Kombinationszeichen vorliegen. Unsichtbare Leer- und Richtungszeichen können Vergleiche, Slugs oder Sicherheitsprüfungen verändern. NFC, NFD, NFKC und NFKD haben unterschiedliche Zwecke; Kompatibilitätsformen führen bewusst manche typografischen Unterschiede zusammen.", "Bewahren Sie das Original und prüfen Sie Codepoints besonders bei Identitäten, Domains, Dateipfaden und Zugriffsregeln. Normalisierung verhindert keine Homograph-Angriffe, sondern macht nur manche Repräsentationsunterschiede sichtbar."] },
          { heading: "Sortieren, Deduplizieren und N-Gramme messen Verschiedenes", paragraphs: ["Sprachabhängige Sortierung ordnet Daten; Deduplizierung löscht Datensätze. Groß-/Kleinschreibung und Leerzeichen dürfen nur ignoriert werden, wenn die Fachregel dies erlaubt. Protokollieren Sie Ausgangszeilen, eindeutige Zeilen und entfernte Einträge.", "N-Gramme zeigen Wiederholung, aber weder Absicht noch Textqualität oder SEO-Erfolg. Kleine Stichproben verzerren Anteile; Segmentierung in Sprachen ohne Leerzeichen hängt von Browser-Sprachdaten ab. Lesen Sie Häufigkeiten immer im Originalkontext."], bullets: ["Originalreihenfolge wiederherstellbar halten.", "Deduplizierungsschlüssel dokumentieren.", "Stichprobengröße mitberichten."] },
          { heading: "Formel, Zeitzone und Auswahlverfahren offenlegen", paragraphs: ["Prozentänderung, Prozentpunkte, Steuer und aufeinanderfolgende Rabatte sind verschiedene Rechnungen. Bei Nullbasis ist eine Prozentänderung undefiniert; aktuelle Steuer- und Rundungsregeln müssen aus offizieller Quelle kommen. Eine mathematische Ausgabe ist keine Steuer- oder Rechtsberatung.", "Datum-Zeit ohne Offset verwendet die lokale Browserzone; Sommerzeit, Pausen und Lohnrundung können Ergebnisse ändern. Web Crypto kann eine starke Zufallsquelle liefern, aber doppelte oder unzulässige Einträge und Eingriffe nach der Auswahl bleiben Prozessfehler. Regulierte Ziehungen benötigen ein dokumentiertes unabhängiges Verfahren."] },
        ],
      },
      zh: {
        title: "避免文本与日常计算中的隐藏错误",
        excerpt: "以可审计的假设使用 Unicode、列表、N-gram、百分比、税费、时长与随机工具。",
        description: "解释复制文本、列表和日常数值场景中的规范化、去重、公式、时区与随机性边界。",
        category: "效率与质量",
        readTime: "约 12 分钟",
        sections: [
          { heading: "看起来相同的文本可能并非相同字节", paragraphs: ["一个字符既可由单一代码点表示，也可由基础字符加组合符号表示。不可见空格和双向控制符可能影响比较、slug 或安全审核。NFC、NFD、NFKC 与 NFKD 用途不同，兼容规范化会有意合并某些排版差异。", "请保留原文，尤其对身份标识、域名、文件路径和访问规则检查代码点。规范化不能解决同形异义攻击，只能让部分表示差异更容易发现。"] },
          { heading: "排序、去重与 N-gram 衡量的是不同问题", paragraphs: ["区域感知排序只改变顺序，而去重会删除数据。只有业务规则允许时才能忽略大小写或空格。应同时记录源行、唯一行和被移除条目。", "N-gram 能显示重复，却不能衡量意图、质量或 SEO 成功。小样本会放大比例；无空格语言的分词还依赖浏览器语言数据。频率必须结合原句解读。"], bullets: ["保留可恢复的原始顺序。", "记录去重键。", "报告样本大小。"] },
          { heading: "公开公式、时区和抽取过程", paragraphs: ["百分比变化、百分点、税费和连续折扣是不同运算。零基数的百分比变化没有定义；当前税率和舍入规则必须来自官方来源。数学结果不是税务或法律建议。", "不含偏移的日期时间使用浏览器本地时区，夏令时、休息和薪资舍入都可能改变结果。Web Crypto 可提供强随机源，但重复或不合格条目以及抽取后干预仍会破坏公平性。受监管抽奖应采用有记录的独立流程。"] },
        ],
      },
    },
  },
  {
    slug: "web-crypto-rag-prompt-injection-security-workflow",
    date: "2026-07-18",
    relatedTools: ["ip-cidr-alt-ag-hesaplayici", "hatirlanabilir-parola-uretici", "hmac-olusturucu-dogrulayici", "sri-butunluk-hash-uretici", "rag-parcalama-butcesi-planlayici", "prompt-enjeksiyon-on-taramasi", "prompt-test-vaka-matrisi"],
    copy: {
      de: {
        title: "Lokaler Sicherheitsleitfaden für Web Crypto, RAG und Prompt Injection",
        excerpt: "Ordnen Sie Passphrases, HMAC, SRI, CIDR, RAG-Budgets und Injection-Vorprüfungen ihren tatsächlichen Sicherheitsgrenzen zu.",
        description: "Ein vertiefter Leitfaden dazu, was Browser-Kryptografie und KI-Inhaltsscanner beweisen, was sie nicht beweisen und wie Ergebnisse geprüft werden.",
        category: "Sicherheit & KI",
        readTime: "15 Min.",
        sections: [
          { heading: "Zufall und Geheimnisse benötigen einen kontrollierten Lebenszyklus", paragraphs: ["Kryptografisch zufällige synthetische Wörter vermeiden eine externe Wortlistenlizenz und menschliche Auswahlverzerrung. Die angezeigte Entropie beschreibt nur den theoretischen Erzeugungsraum; Bearbeitung, Wiederverwendung und kürzere Varianten verringern die reale Stärke.", "Verwenden Sie pro Konto ein einzigartiges Ergebnis, speichern Sie es in einem Passwortmanager und aktivieren Sie phishing-resistente Mehrfaktor-Authentisierung, wo sie verfügbar ist. Geben Sie erzeugte Geheimnisse nicht in Chats, Bildschirmfotos oder gemeinsame Logs."] },
          { heading: "HMAC, SRI und CIDR beweisen unterschiedliche Dinge", paragraphs: ["HMAC prüft Nachrichtenintegrität zwischen Parteien mit demselben Geheimnis; es ist weder Verschlüsselung noch öffentlicher Herkunftsnachweis. Das Browserwerkzeug kann einen erwarteten Digest längennormalisiert vergleichen, doch JavaScript garantiert keine konstante Ausführungszeit. Produktionsserver sollten eine timing-resistente Plattform-API und die exakte Byte-Kanonisierung des Protokolls verwenden.", "SRI vergleicht geladene Ressourcenbytes mit einem veröffentlichten Hash, beweist aber nicht, dass die ursprüngliche Datei vertrauenswürdig war. CIDR berechnet Netzwerkgrenzen, entscheidet jedoch keine Firewall-Richtung, Cloud-Reserveadresse, IPv6-Regel oder Least-Privilege-Policy."], bullets: ["Kein Geheimnis in Client-Bundles einbauen.", "SRI-Änderungen wie Codeänderungen prüfen.", "Produktionsnetzregeln unabhängig gegenprüfen."] },
          { heading: "RAG-Kapazität von Instruktionsvertrauen trennen", paragraphs: ["Chunkgröße, Überlappung und topK planen Kontextkapazität; sie beweisen keine Retrieval-Qualität. Messen Sie Recall, Precision, Quellenabdeckung und Zitatgenauigkeit mit repräsentativen Fragen und reservieren Sie Platz für System, Anfrage und Ausgabe.", "Behandeln Sie abgerufenen Inhalt als Daten, nicht als Systemanweisung. Eine lexikalische Injection-Vorprüfung kann bekannte Signale zeigen, übersieht aber semantische, neue oder verschleierte Angriffe. Quellen-Allowlist, getrennte Daten-/Instruktionskanäle, minimale Werkzeugrechte, Ausgabekontrolle und echte Red-Team-Tests bleiben notwendig."], bullets: ["Retrieval-Inhalt erhält keine Geheimnisse oder Autorität.", "Tool-Aufrufe mit Schema und Allowlist begrenzen.", "Einen unauffälligen Scan nie als Freigabe behandeln."] },
        ],
      },
      zh: {
        title: "Web Crypto、RAG 与提示词注入的本地安全指南",
        excerpt: "正确理解口令、HMAC、SRI、CIDR、RAG 预算与注入预扫描各自的安全边界。",
        description: "深入说明浏览器密码学和 AI 内容扫描能证明什么、不能证明什么，以及如何核验结果。",
        category: "安全与 AI",
        readTime: "约 15 分钟",
        sections: [
          { heading: "随机性与秘密需要受控生命周期", paragraphs: ["密码学随机的合成词可避免外部词表许可与人工选择偏差。显示的熵只描述理论生成空间；用户修改、复用或选择更短版本都会降低实际强度。", "每个账户使用唯一结果，存入密码管理器，并在支持时启用抗钓鱼多因素认证。不要通过聊天、截图或共享日志传递生成的秘密。"] },
          { heading: "HMAC、SRI 与 CIDR 证明不同事实", paragraphs: ["HMAC 用于共享同一秘密的参与方检查消息完整性；它不是加密，也不是公开来源证明。浏览器工具可对预期摘要进行长度归一比较，但 JavaScript 不保证恒定执行时间。生产服务器应使用平台提供的抗时序比较 API，并严格遵守协议字节规范化。", "SRI 把加载资源的字节与已发布哈希比较，却不能证明原始文件可信。CIDR 计算网络边界，但不能决定防火墙方向、云保留地址、IPv6 规则或最小权限策略。"], bullets: ["不要把秘密写入客户端 bundle。", "像代码变更一样审核 SRI 更新。", "独立复核生产网络规则。"] },
          { heading: "把 RAG 容量与指令信任分开", paragraphs: ["分块大小、重叠和 topK 用于规划上下文容量，不能证明检索质量。请用代表性问题测量召回率、精确率、来源覆盖和引用准确性，并为系统、查询和输出保留空间。", "检索内容应被视为数据，而非系统指令。词法注入预扫描可以显示已知信号，却可能漏掉语义、新型或混淆攻击。仍需来源白名单、分离的数据/指令通道、最小工具权限、输出验证和真实红队测试。"], bullets: ["检索内容不得获得秘密或权限。", "用 Schema 与白名单约束工具调用。", "不得把无发现扫描视为安全批准。"] },
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
