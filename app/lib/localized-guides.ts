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
  {
    slug: "browser-only-agentic-ai-tool-orchestration",
    date: "2026-07-18",
    relatedTools: ["arac-zinciri-pipeline", "prompt-enjeksiyon-on-taramasi", "prompt-test-vaka-matrisi", "http-guvenlik-basliklari-denetleyici", "token-baglam-butcesi-planlayici"],
    copy: {
      de: {
        title: "Browser-only Agentic AI: sichere Werkzeug-Orchestrierung",
        excerpt: "Semantische Suche, mehrstufige Pläne, sichtbare Begründungen, Fehlerübersetzung und lokale Spracheingabe ohne Upload verbinden.",
        description: "Praxisleitfaden zu Werkzeugwahl, Nutzerfreigabe, Datenübergabe und lokaler Spracheingabe für einen vollständig browserbasierten Agenten.",
        category: "Lokale KI-Architektur", readTime: "14 Min.",
        sections: [
          { heading: "Agentisch bedeutet nicht automatisch großes Sprachmodell", paragraphs: ["Eine agentische Oberfläche versteht ein Ziel, wählt Fähigkeiten, ordnet Schritte und verbindet Ausgaben. In einem begrenzten Werkzeugkatalog können mehrsprachige semantische Bewertung, versionierte Regeln und explizite Parameterextraktion schneller, prüfbarer und wirklich offline sein.", "Die Methode muss sichtbar bleiben. Ein System ohne generatives Modell darf kein LLM vortäuschen, sondern soll Treffer, Auswahlgründe, Plansicherheit und Grenzen zeigen. ByteQuant bezeichnet den lokalen Agenten deshalb als nachvollziehbare hybride Suche und Planung."], bullets: ["Modelltyp und Version nennen.", "Netzwerk und Speicherung getrennt erklären.", "Vorprüfung nicht als Verifikation bezeichnen."] },
          { heading: "Planung und Ausführungsrecht trennen", paragraphs: ["Dateiauswahl, Codeausführung, Download und externe Anfrage sind keine harmlosen Planungsdetails. Jeder Schritt muss sichtbar und bearbeitbar bleiben; Nebenwirkungen erfordern eine ausdrückliche Nutzeraktion.", "Eine Werkzeugbrücke darf Text übergeben, aber keine Passwortfelder, Dateiauswahl oder Downloads automatisch bedienen. Plan und begrenzte Zwischenausgabe gehören nur in das sessionStorage des offenen Tabs."], bullets: ["Zweck und Eingabequelle pro Schritt anzeigen.", "Datei und Download manuell lassen.", "Wichtige Ergebnisse unabhängig prüfen."] },
          { heading: "Lokale Sprache und ehrliche Transparenz", paragraphs: ["Nützliche Transparenz zeigt Signale, extrahierte Parameter, Auswahlgründe und Grenzen – keine verborgene Gedankenkette. Fehlererklärung durch lokale Muster ist außerdem keine Ursachenanalyse oder Sicherheitsfreigabe.", "Spracherkennung darf nur starten, wenn der Browser lokale Verarbeitung und das Sprachpaket bestätigt. `processLocally` muss erzwungen werden; ohne Unterstützung bleibt Texteingabe verfügbar. Sprache ist Komfort, keine Authentisierung."] },
        ],
      },
      zh: {
        title: "纯浏览器 Agentic AI：安全设计工具编排",
        excerpt: "无需上传数据，把语义搜索、多步骤计划、可见理由、错误解释与设备端语音组合起来。",
        description: "介绍纯浏览器助手的工具选择、用户授权、数据传递和安全设备端语音架构。",
        category: "本地 AI 架构", readTime: "约 14 分钟",
        sections: [
          { heading: "Agentic 不等于必须使用大型语言模型", paragraphs: ["Agentic 界面会理解目标、选择能力、排列步骤，并把输出连接到下一步。在有限工具目录中，多语言语义评分、版本化规则和明确参数提取可以更快、更可审计，也真正离线。", "方法说明比名称重要。没有生成式模型的系统不应暗示自己是 LLM，而应展示匹配信号、选择理由、计划置信度与限制。因此 ByteQuant 把本地助手定义为可解释的混合搜索与规划引擎。"], bullets: ["公开模型类型与版本。", "分别说明网络与存储边界。", "不要把预检查称为验证。"] },
          { heading: "把规划与执行权限分开", paragraphs: ["选择文件、运行代码、下载结果或访问外部地址都需要单独授权。安全编排应展示并允许编辑每一步，不能自动执行带副作用的动作。", "工具桥可以传递文本，但不得自动填写密码、选择文件或触发下载。计划与有限的中间输出只应保留在当前标签页的 sessionStorage 中。"], bullets: ["显示每步目的与输入来源。", "文件和下载保持手动。", "高影响结果需要独立复核。"] },
          { heading: "设备端语音与诚实的透明度", paragraphs: ["有用的透明度展示匹配信号、提取参数、选用理由和边界，而不是隐藏思维链。基于本地规则解释错误也不等于根因分析或安全批准。", "只有浏览器确认设备端处理和语言可用时才能启动语音，并强制 `processLocally`；不支持时保留文本输入，不回退到远程识别。语音只是输入便利，不是身份验证。"] },
        ],
      },
    },
  },
  {
    slug: "visual-workflow-indexeddb-webrtc-workstation",
    date: "2026-07-19",
    relatedTools: ["arac-zinciri-pipeline", "json-bicimlendirici", "kvkk-veri-maskeleyici", "base64-kodlayici", "sha256-ozet-uretici"],
    copy: {
      de: {
        title: "Browser-Workstation: Visuelle Abläufe, IndexedDB und WebRTC",
        excerpt: "Werkzeugknoten sicher verbinden, Projekte lokal verschlüsseln und die echten Grenzen serverloser Peer-Zusammenarbeit verstehen.",
        description: "Praxisleitfaden zu visuellen Werkzeugketten, AES-GCM-verschlüsselten IndexedDB-Projekten, komprimierten Rezept-URLs und manueller WebRTC-Zusammenarbeit.",
        category: "Browserbasierte Arbeitsabläufe",
        readTime: "15 Min.",
        sections: [
          { heading: "Knoten, Kabel und Ausführung getrennt halten", paragraphs: ["Ein Knoten beschreibt Werkzeug, Eingabe und sichtbare Ausgabe; ein Kabel nur die beabsichtigte Datenübergabe. Eine gezeichnete Verbindung ist weder Ausführungserlaubnis noch Beweis für kompatible Datentypen.", "Sichere Orchestrierung übergibt Text nur auf Nutzerwunsch. Dateiauswahl, Passwortfelder, Codeausführung, Netzwerkanfragen und Downloads bleiben ausdrücklich manuell."], bullets: ["Stabile Werkzeugkennungen speichern.", "Eingaben vor der Übergabe prüfen.", "Fehler je Knoten sichtbar halten.", "Folgenreiche Aktionen nicht automatisieren."] },
          { heading: "IndexedDB und AES-GCM richtig einordnen", paragraphs: ["Projektdokumente können mit frischem Initialisierungsvektor pro Datensatz und dem Projektbezeichner als authentifizierten Zusatzdaten verschlüsselt werden. Ein nicht exportierbarer CryptoKey in derselben IndexedDB hält den Ablauf serverlos.", "Diese Verschlüsselung schützt nicht vor einem kompromittierten Gerät, einer bösartigen Erweiterung oder feindlichem Code desselben Ursprungs. Werden Website-Daten und Schlüssel gelöscht, ist der Chiffretext nicht wiederherstellbar. Browserkontingent und datenschutzgerechte Backups bleiben Nutzeraufgaben."], bullets: ["Schema und Größe vor und nach Entschlüsselung prüfen.", "Für jeden Datensatz einen neuen 96-Bit-IV erzeugen.", "Kontingentfehler verständlich anzeigen.", "Löschfunktionen anbieten."] },
          { heading: "Rezept-URLs sind kein geheimer Kanal", paragraphs: ["Knoten und Kanten lassen sich als begrenztes JSON definieren, gzip-komprimieren und Base64url-codieren. Importiert werden dürfen nur bekannte Versionen, Werkzeug-Slugs und gültige Referenzen innerhalb fester Größenlimits.", "URLs können in Verlauf, Zwischenablage, Nachrichten und Screenshots erscheinen. Ausgaben müssen immer und Eingaben standardmäßig entfernt werden. Ein noindex-Importpfad ist Suchmaschinenhygiene, aber keine Zugriffskontrolle."], bullets: ["Keine Passwörter oder Dateien serialisieren.", "Eingaben nur durch gesondertes Opt-in aufnehmen.", "Unbekannte Schemaversionen ablehnen."] },
          { heading: "WebRTC benötigt Signalisierung und einen Identitätsabgleich", paragraphs: ["RTCDataChannel schützt die Übertragung mit DTLS, aber Angebot, Antwort und ICE-Kandidaten müssen ausgetauscht werden. Ohne Signalisierungsdienst geschieht dies mit einmaligen Codes, die nach zehn Minuten verfallen und Netzwerkinformationen enthalten können.", "DTLS beweist nicht die reale Identität des Absenders. Beide Personen vergleichen deshalb einen aus Raum, Peer-IDs und DTLS-Fingerprints abgeleiteten Sicherheitscode über einen zweiten Kanal. Abweichungen können eine aktive Zwischenstelle zeigen; Übereinstimmung ist dennoch keine Identitätsprüfung. Die Live-Freigabe beginnt pausiert und wird gesondert aktiviert.", "Ohne STUN und TURN können NAT, Unternehmens-Firewall oder Browserregeln die Verbindung verhindern. Begrenzte Einladungen, Transfers, Chunks, Dokumentgrößen und DataChannel-Puffer reduzieren Ressourcenmissbrauch."], bullets: ["iceServers leer lassen.", "Codes kurzlebig und einmalig halten.", "Sicherheitscode vor der Freigabe vergleichen.", "Keine Identitätsgarantie behaupten."] },
          { heading: "Leistung und Tests", paragraphs: ["Der Editor wird nur auf der Workstation-Route dynamisch geladen; Kompression gehört in einen Web Worker. Vollständige Werkzeugfilter, Startabläufe, automatische Anordnung, Rückgängig/Wiederholen und eine mobile Einspaltenansicht verhindern, dass ein Canvas zur Barriere wird.", "Der Agent zeigt Konfidenz und Auswahlgründe vor einer Änderung. Tests decken Rezept-Rundlauf, Schemata, AES-GCM-Manipulation, Kontingentwache, gefälschte Pfade, abgelaufene Signalcodes, symmetrische Sicherheitscodes sowie noindex und Canonical ab. Peer-Erreichbarkeit bleibt netzabhängig."] },
        ],
      },
      zh: {
        title: "浏览器工作站：可视化流程、IndexedDB 与 WebRTC",
        excerpt: "安全连接工具节点、在设备上加密项目，并理解无服务器对等协作的真实边界。",
        description: "关于可视化工具链、AES-GCM 加密 IndexedDB 项目、压缩配方 URL 与手动 WebRTC 协作的实践指南。",
        category: "浏览器内工作流",
        readTime: "约 15 分钟",
        sections: [
          { heading: "区分节点、连线与执行权限", paragraphs: ["节点表示工具、输入和最近可见输出，连线只表示计划的数据传递。画出连线并不等于允许自动运行，也不能证明两端数据类型兼容。", "安全编排只在用户请求时传递文本。文件选择、密码字段、代码运行、网络请求和下载必须保持手动。"], bullets: ["保存稳定的工具标识。", "传递前审查输入和输出。", "每个节点显示错误状态。", "不自动执行高影响操作。"] },
          { heading: "正确理解 IndexedDB 与 AES-GCM", paragraphs: ["项目记录可使用每条记录独立的随机 IV，并把项目 ID 作为认证附加数据进行 AES-GCM 加密。不可导出的 CryptoKey 存在同一 IndexedDB 中，使流程无需服务器。", "这不能防止已被入侵的设备、恶意扩展或同源恶意脚本。清除站点数据会同时删除密钥，使剩余密文无法恢复；浏览器配额和不含敏感数据的备份仍需用户管理。"], bullets: ["加密前后都验证结构与大小。", "每条记录使用新的 96 位 IV。", "清楚显示配额错误。", "提供项目删除控制。"] },
          { heading: "配方 URL 不是秘密通道", paragraphs: ["节点和边可写成受限 JSON，再用 gzip 压缩与 Base64url 编码。导入端只能接受已知版本、合法工具 slug、有效引用及限定大小。", "URL 可能出现在历史、剪贴板、消息或截图中。输出必须始终排除，输入默认排除；noindex 导入页只是搜索卫生措施，不是访问控制。"], bullets: ["绝不序列化密码或文件。", "包含输入必须单独确认。", "拒绝未知结构版本。"] },
          { heading: "WebRTC 仍需信令与安全码核对", paragraphs: ["RTCDataChannel 使用 DTLS 加密传输，但 SDP 提议、应答与 ICE 候选仍需交换。无信令服务时使用十分钟后失效的一次性代码；代码可能包含网络信息，应通过独立可信渠道传递。", "DTLS 不能证明复制 SDP 的人是谁。双方应通过另一渠道核对由房间、对等端标识与两端 DTLS 指纹生成的安全码。不同代码可能表示主动中间人；相同代码也不等于身份验证。实时共享默认暂停，并需单独开启。", "没有 STUN 或 TURN 时，NAT、防火墙或浏览器策略可能阻断连接。对待处理邀请、并发传输、分片、完整文档和 DataChannel 缓冲设置上限，可降低资源滥用。"], bullets: ["保持 iceServers 为空。", "代码应短期有效且一次性使用。", "共享前通过另一渠道核对安全码。", "不要把安全码称为身份验证。"] },
          { heading: "性能、可访问性与测试", paragraphs: ["编辑器只在工作站路由动态加载，压缩放在 Web Worker 中。完整工具筛选、起始流程、自动布局、撤销/重做与移动端单列界面可避免只依赖画布。", "本地助手在修改画布前显示置信度与选择理由。测试覆盖配方往返、非法结构、AES-GCM 篡改、配额、伪造路径、过期信令码、对称安全码以及 noindex/canonical。真实连接仍取决于网络拓扑。"] },
        ],
      },
    },
  },
  {
    slug: "private-agent-workstation-pipeline", date: "2026-07-21", relatedTools: ["arac-zinciri-pipeline", "kvkk-veri-maskeleyici", "json-bicimlendirici"],
    copy: {
      de: { title: "Lokalen Agentenplan sicher in einen Workstation-Ablauf übertragen", excerpt: "Ziel beschreiben, begründeten Plan prüfen und mit einem Klick als nutzergesteuerten Knotenfluss öffnen.", description: "Praxisleitfaden zu Planübergabe, Datengrenzen, Fehlerprüfung und Rückgängig-Funktion zwischen lokalem Agenten und Workstation.", category: "Lokale Automatisierung", readTime: "12 Min.", sections: [
        { heading: "Zuerst das Ziel, dann das Werkzeug", paragraphs: ["Ein guter lokaler Plan beginnt beim gewünschten Ergebnis. Das Ziel „Kundenliste als teilbares JSON vorbereiten“ lässt sich in Datenschutzprüfung, Maskierung, Strukturprüfung und Export zerlegen. Der Agent ordnet Zielsignale dem Katalog zu und erfindet keine Fakten wie ein generatives LLM.", "Vor der Übernahme sind Gründe, Alternativen und Grenzen zu prüfen. Konfidenz beschreibt die Eindeutigkeit der Zuordnung, nicht die garantierte Richtigkeit."], bullets: ["Eingabetyp und Ergebnis nennen.", "Folgenreiche Schritte trennen.", "Alternativen nach Datenkompatibilität prüfen."] },
        { heading: "Ein-Klick-Übergabe ist keine automatische Ausführung", paragraphs: ["Die Übergabe schreibt nur Werkzeugkennungen und Kanten begrenzt in sessionStorage desselben Tabs. Die Workstation baut Knoten, wählt aber keine Datei, gibt kein Passwort ein, führt keinen Code aus und startet keinen Download.", "Daten gelangen erst nach einer bewussten Nutzeraktion in den nächsten Schritt. So verbreitet sich ein ungeeigneter Plan nicht still durch die Kette."] },
        { heading: "Sicher mit Versionsverlauf experimentieren", paragraphs: ["Knoten-, Kanten- und Layoutänderungen lassen sich rückgängig machen. Vor großen Änderungen sollte das Projekt lokal gespeichert und danach in kleinen prüfbaren Schritten bearbeitet werden.", "AES-GCM in IndexedDB schützt nicht vor kompromittierten Geräten oder schädlichen Erweiterungen. Keine vertraulichen Eingaben in Rezeptlinks aufnehmen und P2P-Sicherheitscodes über einen zweiten Kanal vergleichen."] },
      ] },
      zh: { title: "将本地助手计划安全转为工作站流程", excerpt: "描述目标、审阅有理由的计划，并一键转为仍由用户控制的节点流程。", description: "介绍 ByteQuant 本地助手与工作站之间的计划交接、数据边界、错误审查与撤销方法。", category: "本地自动化", readTime: "约 12 分钟", sections: [
        { heading: "先确定目标，再选择工具", paragraphs: ["实用的本地计划从期望结果开始，而不是从工具名称开始。“把客户列表变为可分享 JSON”可以拆为敏感数据检查、遮蔽、结构验证与导出。本地助手把目标信号匹配到目录，不会像生成式 LLM 那样创造事实。", "接受前应阅读每一步的理由、替代方案与边界。置信度只表示匹配是否明确，不是正确性保证。"], bullets: ["说明输入类型与最终输出。", "把高影响操作拆开。", "按理由与数据兼容性比较替代工具。"] },
        { heading: "一键交接不等于自动执行", paragraphs: ["交接只把工具标识与连线以受限文档写入同一标签页的 sessionStorage。工作站会建立节点，但不会选择文件、填写密码、运行代码或启动下载。", "数据只有在用户主动选择后才进入下一步，因此不合适的计划不会悄悄传播。"] },
        { heading: "用版本历史安全试验", paragraphs: ["节点、连线与布局变更可撤销。重大变更前应在设备上保存项目，再以小而可验证的步骤推进。", "IndexedDB 中的 AES-GCM 不能防护已入侵设备或恶意扩展。不要把敏感输入放入配方 URL，并通过另一渠道核对 P2P 安全码。"] },
      ] },
    },
  },
  {
    slug: "batch-masking-before-after-quality-control", date: "2026-07-21", relatedTools: ["kvkk-veri-maskeleyici", "metin-temizleyici", "metin-farki"],
    copy: {
      de: { title: "Vorher-/Nachher-Qualitätskontrolle bei Stapelmaskierung", excerpt: "Trennzeichen, Fehlalarme, Kontextverlust und Stichproben bei lokaler Stapelverarbeitung systematisch kontrollieren.", description: "Methode zur Prüfung von Stapelmaskierung mit Vergleichsansicht und menschlicher Kontrolle für DSGVO/KVKK-Vorbereitung.", category: "Datenschutz", readTime: "11 Min.", sections: [
        { heading: "Stapelgrenzen ausdrücklich definieren", paragraphs: ["Datensätze werden mit einer eigenen `---`-Zeile statt mit mehrdeutigen Leerzeilen getrennt. Jeder Teil wird unabhängig und mit einer Höchstzahl pro Lauf verarbeitet, damit der Hauptthread nicht lange blockiert.", "Kommt das Trennzeichen im Datensatz vor, ist ein sichereres Exportformat oder eine kleinere Gruppe nötig. Mehrzeilige Felder dürfen nicht versehentlich als neue Datensätze gelten."], bullets: ["Trennregel dokumentieren.", "Kleine repräsentative Gruppe testen.", "Datensatz- und Zeichengrenzen beachten."] },
        { heading: "Vergleich ist eine Prüffläche, kein Beweis", paragraphs: ["Die Ansicht stellt Rohtext und letzte sichtbare Ausgabe nebeneinander. Sie hilft, vergessene Kennungen und Übermaskierung zu erkennen; kein Treffer beweist jedoch nicht die Abwesenheit personenbezogener Daten.", "E-Mail- und Telefonmuster sind leichter als kontextabhängige Namen, Gesundheitsangaben oder indirekte Identifikatoren. Musterabgleich braucht menschliche Prüfung und Dateninventar."] },
        { heading: "Ausgabe kontrolliert weitergeben", paragraphs: ["Die Ausgabe kann über eine Übergabe im selben Tab höchstens zwanzig Minuten für ein JSON- oder CSV-Werkzeug bereitstehen. Das ist kein Cloudspeicher.", "Im Folgeschritt müssen Schema und Zeilenzahl erneut geprüft werden. Ein Download erzeugt eine neue Datei unter Ihrer Speicher- und Zugriffskontrolle."] },
      ] },
      zh: { title: "批量数据遮蔽的前后质量检查", excerpt: "在设备端批量处理时系统管理分隔符、误报、上下文损失与抽样检查。", description: "在 GDPR/KVKK 准备中，通过前后对比与人工复核验证批量遮蔽输出的方法。", category: "数据隐私", readTime: "约 11 分钟", sections: [
        { heading: "明确批处理边界", paragraphs: ["使用单独的 `---` 行分隔记录，而不是含糊的空白。每段独立处理并限制单次数量，避免主线程长时间阻塞。", "如果记录本身可能包含该分隔符，应换用更安全的导出格式或缩小批次；不能把多行字段误切成新记录。"], bullets: ["记录分隔规则。", "先测试小型代表样本。", "遵守记录与字符上限。"] },
        { heading: "前后对比是审阅面，不是证明", paragraphs: ["面板并排显示原始输入与最新输出，有助于发现遗漏标识与过度遮蔽；没有发现并不能证明不存在个人数据。", "电子邮件与电话模式较容易，依赖语境的姓名、健康信息和间接标识仍需人工复核与数据清单。"] },
        { heading: "受控传递输出", paragraphs: ["结果可通过同一标签页、最多二十分钟的交接记录送到 JSON 或 CSV 工具；它不是云存储。", "下一步应重新检查结构与行数。下载会在设备上产生新的文件，其保留与访问由用户负责。"] },
      ] },
    },
  },
  {
    slug: "browser-tool-handoff-json-csv-base64", date: "2026-07-21", relatedTools: ["json-bicimlendirici", "json-csv-donusturucu", "base64-kodlayici"],
    copy: {
      de: { title: "Sichere Browser-Übergabe zwischen JSON, CSV und Base64", excerpt: "Wiederverwendbare Abläufe mit weniger Kopieren und klaren Typ-, Kodierungs- und Fehlergrenzen.", description: "JSON-Prüfung, CSV-Konvertierung und Base64-Kodierung mit einer Übergabe im selben Tab sicher verbinden.", category: "Datenkonvertierung", readTime: "10 Min.", sections: [
        { heading: "Syntax und Struktur zuerst prüfen", paragraphs: ["Schön formatiertes JSON erfüllt nicht automatisch Geschäftsregeln. Nach Parserfehlern müssen Pflichtschlüssel, Typen, Nullwerte und Arraystruktur geprüft werden. Vor CSV ist festzulegen, wie verschachtelte Objekte dargestellt werden.", "Zahlen, Boolesche Werte und Datumswerte können in CSV zu Text werden; beim Rückweg entstehen die Ursprungstypen nicht automatisch."], bullets: ["Feldtypen dokumentieren.", "Fehlende und zusätzliche Schlüssel prüfen.", "Regel für Verschachtelung festlegen."] },
        { heading: "Lebenszyklus der Übergabe verstehen", paragraphs: ["Die Aktion speichert nur sichtbare Ausgabe, Ziel-Slug und Zeit in sessionStorage. Das Ziel liest die Eingabe im selben Tab und entfernt den Datensatz nach Nutzung oder zwanzig Minuten.", "Bequemlichkeit anonymisiert keine Daten. Bei Bedarf vor der Konvertierung maskieren und unerwartete Inhalte am Ziel prüfen."] },
        { heading: "Base64 ist keine Verschlüsselung", paragraphs: ["Base64 ist umkehrbare Kodierung ohne Vertraulichkeit, Zugriffskontrolle oder Integrität. Sie ist für transportierbaren Text geeignet, nicht zum Verbergen von Geheimnissen.", "Unicode muss durch einen Rundlauf geprüft werden. Große Dateien verursachen mehr Speicherbedarf; jenseits der Werkzeuggrenzen ist ein dateiorientierter Ablauf nötig."] },
      ] },
      zh: { title: "JSON、CSV 与 Base64 之间的安全浏览器内交接", excerpt: "减少复制粘贴，同时保持类型、编码与错误边界的可复用流程。", description: "通过同一标签页的结果交接安全串联 JSON 验证、CSV 转换与 Base64 编码。", category: "数据转换", readTime: "约 10 分钟", sections: [
        { heading: "先验证语法与结构", paragraphs: ["格式美观的 JSON 不代表符合业务规则。修复解析错误后，还要检查必需键、类型、空值和数组结构；转 CSV 前先决定如何表示嵌套对象。", "数字、布尔值与日期在 CSV 中可能成为文本，反向转换不会自动恢复原类型。"], bullets: ["记录字段类型。", "检查缺失与额外键。", "确定嵌套扁平化规则。"] },
        { heading: "理解交接生命周期", paragraphs: ["交接只把可见输出、目标 slug 与时间写入 sessionStorage。目标在同一标签页载入后删除记录，或在二十分钟后失效。", "便利不会自动净化敏感数据。需要时先遮蔽，并在运行目标工具前审查异常内容。"] },
        { heading: "Base64 不是加密", paragraphs: ["Base64 是可逆编码，不提供秘密性、访问控制或完整性。它适合文本传输，不适合隐藏秘密。", "应验证 Unicode 往返结果。大文件会放大内存开销，超过工具上限时应采用面向文件的流程。"] },
      ] },
    },
  },
  {
    slug: "open-source-browser-tool-security-audit", date: "2026-07-21", relatedTools: ["sha256-ozet-uretici", "kod-guvenlik-on-taramasi", "http-guvenlik-basliklari-denetleyici"],
    copy: {
      de: { title: "Open-Source-Browserwerkzeuge sicherheitstechnisch prüfen", excerpt: "Datenschutzangaben anhand von Quelle, Abhängigkeiten, Netzwerk, CSP und Änderungshistorie prüfen.", description: "Leitfaden zur Überprüfung von Lizenz, lokalem Verhalten, Netzgrenzen und Testnachweisen eines Browserwerkzeugs.", category: "Open-Source-Vertrauen", readTime: "12 Min.", sections: [
        { heading: "Lizenz und Verhalten getrennt prüfen", paragraphs: ["Eine Open-Source-Lizenz regelt Nutzung und Prüfung, beweist aber weder Sicherheit noch Datenschutz. Repository-Lizenz, Produktionsabhängigkeiten, Versionen und Lockdatei müssen zusammen betrachtet werden.", "Nachgeladene CDN-Skripte, geschlossene APIs oder nicht erklärte Telemetrie begrenzen jede Aussage zur lokalen Verarbeitung."], bullets: ["LICENSE und Manifest lesen.", "Produktionspakete mit Lockdatei abgleichen.", "Dynamische Skripte und Endpunkte suchen."] },
        { heading: "Browsergrenze beobachten", paragraphs: ["Mit repräsentativen Daten im Network-Panel lässt sich normales Laden von Requests beim Werkzeuglauf trennen. Eingaben dürfen nicht in URL, Request-Body, Fehlerbericht oder Analytik gelangen.", "CSP reduziert Verbindungen, repariert aber keine schlechte Logik. Auch Service-Worker-Cache, localStorage und IndexedDB prüfen: nicht gesendet bedeutet nicht nie lokal gespeichert."] },
        { heading: "Nachweiskette vervollständigen", paragraphs: ["Typprüfung, Lint und Unit-Tests ergänzen Browserprüfungen für Mobilansicht, Tastatur, Interaktion und Metadaten. Ein sauberer heuristischer Scan oder Hash ist keine Sicherheitsfreigabe.", "Befunde mit Version, Pfad, reproduzierbaren Schritten und Erwartung melden—ohne echte Geheimnisse oder Personendaten."] },
      ] },
      zh: { title: "如何安全审计开源浏览器工具", excerpt: "通过源代码、依赖、网络请求、CSP 与变更历史验证隐私声明。", description: "从许可证、设备端行为、网络边界与测试证据审查浏览器工具的实践指南。", category: "开源信任", readTime: "约 12 分钟", sections: [
        { heading: "分别验证许可证与行为", paragraphs: ["开源许可证规定查看与使用代码的条件，但不证明安全或隐私。应一起检查仓库许可证、生产依赖、版本与锁文件。", "运行时 CDN 脚本、封闭 API 或未披露遥测都会限制设备端声明。"], bullets: ["阅读 LICENSE 与包清单。", "把生产依赖与锁文件对应。", "搜索动态脚本与网络端点。"] },
        { heading: "观察浏览器边界", paragraphs: ["用代表性输入打开 Network 面板，把正常页面资源与工具操作产生的请求区分开，确认输入不进入 URL、请求体、错误报告或分析事件。", "CSP 能减少意外连接但不能修复错误逻辑。还应检查 Service Worker 缓存、localStorage 与 IndexedDB：未上传不等于从未本地保存。"] },
        { heading: "完成证据链", paragraphs: ["类型检查、Lint 与单元测试还需配合浏览器测试，验证移动端、键盘、交互与元数据。干净的启发式扫描或哈希并不是安全批准。", "报告应包含版本、路径、可复现步骤与预期行为，绝不包含真实秘密或个人数据。"] },
      ] },
    },
  },
  {
    slug: "core-web-vitals-client-side-tools", date: "2026-07-21", relatedTools: ["metin-sikistirma-orani-hesaplayici", "gorsel-sikistirici", "meta-etiket-favicon-uretici"],
    copy: {
      de: { title: "Core Web Vitals für clientseitige Werkzeuge", excerpt: "Schwere Editoren verzögert laden, Hauptthread-Arbeit begrenzen und visuelle Stabilität in echten Abläufen erhalten.", description: "Leitfaden zu LCP, INP und CLS für Browserwerkzeuge und Workstations mit Komponenten-, Worker-, Datei- und Mobilstrategien.", category: "Webleistung", readTime: "11 Min.", sections: [
        { heading: "Beim Start nur das Notwendige ausliefern", paragraphs: ["Knoteneditor, PDF-Engine oder aufwendiger Parser gehören nicht in das erste Homepage-Bundle. Dynamisches Laden auf der jeweiligen Route verschiebt Download und Parsing bis zur Nutzerabsicht.", "Serverseitig erzeugte Überschriften und Navigation bleiben sofort sichtbar. Ein Platzhalter mit fester Größe verhindert Layoutsprünge und unnötiges CLS."], bullets: ["Schwere Funktionen routenbezogen laden.", "Platzhaltergröße reservieren.", "Ersten CTA nicht von JavaScript abhängig machen."] },
        { heading: "Lange Arbeit teilen und begrenzen", paragraphs: ["Große Text- oder Dateischleifen können Klicks verzögern. Datensatz- und Zeichenlimits sowie Web Worker für Kompression oder intensive Analyse schützen den Hauptthread.", "Sofortige Zustände für Verarbeitung, Abschluss und Fehler verhindern Doppelklicks und erklären, was geschieht. Objekt-URLs und Worker müssen anschließend freigegeben werden."] },
        { heading: "Mobilität und Messung verbinden", paragraphs: ["Spalten werden mobil gestapelt; lange URLs, Code und Tabellen umbrechen oder scrollen. Drag-and-drop braucht Schaltflächen- und Tastaturalternativen.", "Wichtige Routen sind auf langsamen Geräten mit echten Aufgaben zu testen: Demo laden, ausführen, Ergebnis übergeben und rückgängig machen. Leistung darf nicht durch Entfernen von Barrierefreiheit oder Fehlermeldungen entstehen."] },
      ] },
      zh: { title: "客户端工具的 Core Web Vitals 与性能设计", excerpt: "延迟加载重型编辑器、拆分主线程工作，并在真实流程中保持视觉稳定。", description: "面向浏览器工具与工作站的 LCP、INP、CLS 组件、Worker、文件和移动设计指南。", category: "Web 性能", readTime: "约 11 分钟", sections: [
        { heading: "首屏只发送必要体验", paragraphs: ["节点编辑器、PDF 引擎或高级解析器不应进入首页初始包。按路由动态加载可把下载与解析延后到用户明确需要时。", "服务端输出的标题、说明与导航应立即可见。给重型组件预留稳定尺寸，可避免加载时布局跳动与 CLS。"], bullets: ["仅在相关路由加载重型功能。", "预留固定占位尺寸。", "首个 CTA 不应完全依赖 JavaScript。"] },
        { heading: "拆分并限制长任务", paragraphs: ["大文本或文件循环会延迟点击。限制记录数与字符数，并把压缩或高强度解析移入 Web Worker，可保护主线程。", "立即显示处理中、完成和错误状态，能防止重复操作并解释进度。结束后应释放对象 URL 与 Worker。"] },
        { heading: "结合移动端现实与测量", paragraphs: ["桌面多列在手机上应堆叠；长 URL、代码与表格要换行或滚动。拖放必须提供按钮和键盘替代。", "应在低端设备与慢网络模拟中测试真实任务：载入示例、运行、传递结果与撤销。不能通过删除无障碍或错误说明来换取分数。"] },
      ] },
    },
  },
];

localizedGuides.push(
  {
    slug: "ndjson-openapi-semver-api-delivery", date: "2026-07-22", relatedTools: ["json-lines-donusturucu", "openapi-endpoint-envanteri", "semver-karsilastirici", "json-pointer-gezgini"],
    copy: {
      de: { title: "API-Auslieferung mit NDJSON, OpenAPI und SemVer prüfen", excerpt: "Streaming-Daten validieren, Endpunkte inventarisieren und Versionspriorität vor der Auslieferung kontrollieren.", description: "Browserbasierter Qualitätsablauf für JSON Lines, JSON Pointer, OpenAPI-Inventar und SemVer-Vergleich.", category: "API- & Datenqualität", readTime: "12 Min.", sections: [
        { heading: "Datensatzgrenzen zuerst validieren", paragraphs: ["JSON Lines enthält pro Zeile einen unabhängigen JSON-Wert. Jede Zeile muss einzeln geparst und ein Fehler mit genauer Nummer gemeldet werden; stilles Überspringen verfälscht nachfolgende Zähler.", "JSON Pointer findet verschachtelte Werte mit RFC-6901-Escapes. Ein Treffer beweist noch nicht, dass Typ und Bedeutung zum Vertrag passen."], bullets: ["Datensatzanzahl vor und nach der Umwandlung vergleichen.", "Fehlerzeilen sichtbar machen.", "Pointer-Ergebnis gegen das Schema prüfen."] },
        { heading: "OpenAPI als prüfbares Inventar", paragraphs: ["Methode, Pfad, operationId, Tags, Deprecation und Security ergeben zusammen eine übersichtliche Lieferliste. Fehlende Bezeichner oder unerwartet anonyme Operationen werden so sichtbar.", "Eine security-Angabe beweist keine echte Autorisierung. Das Inventar priorisiert Quellcodeprüfung und autorisierte Tests, ohne einen Live-Server aufzurufen."] },
        { heading: "SemVer-Priorität von Kompatibilität trennen", paragraphs: ["SemVer ordnet beta.11 nach beta.2 und vor der stabilen 2.0.0; Build-Metadaten ändern die Priorität nicht. Die Sortierung beweist keine Verhaltenskompatibilität.", "Änderungsprotokoll, Vertragstests und Nutzererwartungen gehören in die endgültige Entscheidung."] },
      ] },
      zh: { title: "使用 NDJSON、OpenAPI 与 SemVer 检查 API 交付", excerpt: "在交付前验证流式数据、整理端点并检查版本优先级。", description: "结合 JSON Lines、JSON Pointer、OpenAPI 清单与 SemVer 比较的浏览器内质量流程。", category: "API 与数据质量", readTime: "约 12 分钟", sections: [
        { heading: "先验证记录边界", paragraphs: ["JSON Lines 每行都是独立 JSON 值。应逐行解析并精确报告错误行，静默跳过会破坏后续计数。", "JSON Pointer 按 RFC 6901 转义定位嵌套值；找到值并不等于其类型和业务含义正确。"], bullets: ["比较转换前后的记录数。", "显示错误行而不是跳过。", "用预期 Schema 验证结果。"] },
        { heading: "把 OpenAPI 变成可审查清单", paragraphs: ["把方法、路径、operationId、标签、弃用与安全声明放在同一张表中，可快速发现缺失命名和意外匿名端点。", "规范中的 security 字段不能证明运行时授权。清单只用于安排源码检查和授权测试，不请求线上服务器。"] },
        { heading: "区分 SemVer 顺序与兼容性", paragraphs: ["SemVer 会把 beta.11 排在 beta.2 之后、稳定版 2.0.0 之前，构建元数据不影响优先级；这种排序不能证明行为兼容。", "最终决策还应结合变更日志、契约测试和使用者预期。"] },
      ] },
    },
  },
  {
    slug: "accessible-responsive-ui-contrast-clamp-ratio", date: "2026-07-22", relatedTools: ["renk-kontrast-denetleyici", "css-clamp-olusturucu", "en-boy-orani-hesaplayici"],
    copy: {
      de: { title: "Barrierefreie responsive UI: Kontrast, clamp() und Seitenverhältnis", excerpt: "Dark Mode, fließende Typografie und Medienflächen mit messbaren Grenzen gestalten.", description: "Praxisleitfaden zu WCAG-Kontrast, CSS-clamp(), Seitenverhältnis und mobilen Tests.", category: "Barrierefreies Design", readTime: "11 Min.", sections: [
        { heading: "Kontrast mit allen Zuständen prüfen", paragraphs: ["Das mathematische Verhältnis von Vorder- und Hintergrund ist nur der Anfang. Normaler Text, große Schrift, Fokus, Fehler und deaktivierte Zustände müssen in realer Größe und Stärke bewertet werden.", "Transparente Flächen und Bildhintergründe können vom Ergebnis eines flachen HEX-Paars abweichen."], bullets: ["Mindestens AA für Normaltext prüfen.", "Fokus und Fehler separat messen.", "Auf realen Geräten kontrollieren."] },
        { heading: "clamp() an klare Endpunkte binden", paragraphs: ["Explizite Minimal-/Maximalwerte und Viewport-Grenzen machen Steigung und Endpunkte einer clamp()-Formel überprüfbar.", "Lange deutsche Überschriften, chinesische Zeilenumbrüche und 200-Prozent-Zoom erfordern trotzdem echte Layouttests."] },
        { heading: "Medienplatz vor dem Laden reservieren", paragraphs: ["Ein bekanntes Seitenverhältnis reserviert Platz und reduziert CLS. 1920×1080 lässt sich zu 16:9 kürzen und auf Zielbreiten skalieren.", "CSS aspect-ratio, width/height, responsive Quellen und Alternativtext ergänzen die Rechnung."] },
      ] },
      zh: { title: "无障碍响应式界面：对比度、clamp() 与宽高比", excerpt: "用可测量边界设计深色模式、流式字体与媒体占位。", description: "结合 WCAG 对比度、CSS clamp()、宽高比和移动端实测的前端指南。", category: "无障碍设计", readTime: "约 11 分钟", sections: [
        { heading: "对比度要覆盖全部状态", paragraphs: ["前景和背景的数学比率只是起点。普通文本、大号文本、焦点、错误与禁用状态都要按真实字号和字重检查。", "透明表面与图片背景可能不同于平面 HEX 颜色对。"], bullets: ["普通文本至少检查 AA。", "分别测量焦点与错误颜色。", "在真实设备上确认。"] },
        { heading: "把 clamp() 绑定到明确端点", paragraphs: ["明确最小/最大值与视口边界，才能验证 clamp() 的斜率和端点。", "长德语标题、中文换行和 200% 缩放仍需要真实布局测试。"] },
        { heading: "加载前预留媒体空间", paragraphs: ["已知宽高比可预留空间并降低 CLS。1920×1080 可化简为 16:9，再按目标宽度计算高度。", "还应结合 CSS aspect-ratio、width/height、响应式资源与替代文本。"] },
      ] },
    },
  },
  {
    slug: "local-config-security-env-sql-unix-permissions", date: "2026-07-22", relatedTools: ["env-dosyasi-denetleyici", "sql-bicimlendirici-analizoru", "unix-izin-hesaplayici", "http-guvenlik-basliklari-denetleyici"],
    copy: {
      de: { title: "Lokale Sicherheitsvorprüfung für .env, SQL und Unix-Rechte", excerpt: "Konfigurations-, Abfrage- und Berechtigungsrisiken vor der Freigabe sichtbar machen, ohne Geheimnisse zu wiederholen.", description: "Praxisleitfaden zu maskierten Umgebungswerten, SQL-Risikomustern und chmod-Rechten.", category: "Code-Sicherheit", readTime: "12 Min.", sections: [
        { heading: ".env-Risiko ohne Wertewiederholung", paragraphs: ["Doppelte Schlüssel, ungültige Zuweisungen, leere kritische Werte und öffentliche Präfixe sind strukturell prüfbar. Werte sollten maskiert werden, damit der Bericht keine zweite Kopie eines Geheimnisses erzeugt.", "Bei vermuteter Offenlegung sind Rotation, Zugriffsprüfung und ein autorisierter Prozess für die Historie erforderlich."], bullets: ["Synthetische Werte bevorzugen.", "Öffentliche Präfixe prüfen.", "Verdächtige Schlüssel sofort rotieren."] },
        { heading: "SQL-Formatierung ist kein Sicherheitstest", paragraphs: ["Lesbares SQL macht SELECT *, mehrere Anweisungen und UPDATE/DELETE ohne WHERE sichtbar, validiert aber weder Schema noch Plan oder Autorisierung.", "Parameterbindung muss im Anwendungscode geprüft werden; der Browser darf die Abfrage nicht ausführen."] },
        { heading: "chmod im Dateikontext bewerten", paragraphs: ["755 kann für Verzeichnisse passen und für Geheimnisdateien zu weit sein. World-writable und Spezialbits sind kontextabhängige Risiken.", "ACL, Eigentümer, Mounts und umask liegen außerhalb eines reinen Rechners und müssen separat geprüft werden."] },
      ] },
      zh: { title: ".env、SQL 与 Unix 权限的本地安全预检查", excerpt: "在不重复密钥的前提下，于发布前显示配置、查询与权限风险。", description: "介绍环境值遮蔽、SQL 风险模式和 chmod 权限解释的实践指南。", category: "代码安全", readTime: "约 12 分钟", sections: [
        { heading: "报告 .env 风险而不重复值", paragraphs: ["重复键、错误赋值、空关键值与公开前缀可进行结构检查。输出应遮蔽值，避免报告成为第二份泄漏副本。", "如怀疑暴露，应轮换凭据、检查访问记录，并通过授权流程处理历史。"], bullets: ["优先使用合成值。", "检查公开前缀下的敏感名称。", "怀疑泄漏时立即轮换。"] },
        { heading: "SQL 格式化不是安全测试", paragraphs: ["可读 SQL 容易发现 SELECT *、多语句及缺少 WHERE 的 UPDATE/DELETE，但无法验证 Schema、执行计划或授权。", "参数绑定必须在应用代码中检查，浏览器工具不应执行查询。"] },
        { heading: "结合文件角色理解 chmod", paragraphs: ["755 可能适合目录，却不适合密钥文件；全局可写和特殊位的风险取决于上下文。", "ACL、所有者、挂载与 umask 超出计算器范围，必须另行检查。"] },
      ] },
    },
  },
  {
    slug: "global-team-planning-time-zones-business-days", date: "2026-07-22", relatedTools: ["zaman-dilimi-toplanti-planlayici", "is-gunu-hesaplayici", "bahsis-hesap-bolusturucu", "markdown-tablo-olusturucu"],
    copy: {
      de: { title: "Zeitzonen- und Arbeitstageplanung für globale Teams", excerpt: "Termine und Lieferdaten mit sichtbaren Sommerzeit-, Feiertags- und Einschlussregeln planen.", description: "Leitfaden für verteilte Teams mit IANA-Zonen, UTC-sicherer Arbeitstagezählung und Markdown-Tabellen.", category: "Alltagsproduktivität", readTime: "10 Min.", sections: [
        { heading: "IANA-Zonen statt Abkürzungen", paragraphs: ["EST oder CST ist mehrdeutig und verdeckt Sommerzeit. IANA-Namen wie Europe/Berlin erlauben dem Browser den korrekten Offset für das gewählte Datum.", "Die Quelle sollte ISO mit Z oder Offset enthalten; auch das lokale Datum ist anzuzeigen, weil die Umrechnung Mitternacht überschreiten kann."], bullets: ["UTC oder expliziten Offset nutzen.", "Lokales Datum zeigen.", "Termin menschlich bestätigen."] },
        { heading: "Wochentage sind keine Rechtsfrist", paragraphs: ["Montag-bis-Freitag-Zählung kennt nationale Feiertage, halbe Tage und Firmenkalender nicht automatisch. Feiertage und Endpunktregel müssen explizit sein.", "UTC-Arithmetik verhindert Sommerzeitfehler; rechtliche Fristen benötigen dennoch eine autoritative Quelle."] },
        { heading: "Entscheidung als Tabelle teilen", paragraphs: ["Eine Markdown-Tabelle kann ISO-Quelle, IANA-Zone, lokalen Termin und Bestätigung getrennt dokumentieren.", "Sie sendet keine Einladung. Bestätigung und Kalenderänderungen müssen vor der Freigabe ergänzt werden."] },
      ] },
      zh: { title: "全球团队的时区与工作日规划", excerpt: "把夏令时、节假日和起止日规则明确显示，减少会议与交付日期错误。", description: "使用 IANA 时区、UTC 安全工作日计算与 Markdown 表格的分布式团队指南。", category: "日常效率", readTime: "约 10 分钟", sections: [
        { heading: "使用 IANA 时区而非缩写", paragraphs: ["EST、CST 等缩写可能有多种含义并隐藏夏令时。Europe/Berlin 等 IANA 名称可让浏览器按所选日期应用正确偏移。", "源时间应为带 Z 或明确偏移的 ISO，并显示本地日期，因为转换可能跨越午夜。"], bullets: ["使用 UTC 或明确偏移。", "显示本地日期。", "发送邀请前人工确认。"] },
        { heading: "工作日不等于法律期限", paragraphs: ["周一至周五计算不会自动知道国家节假日、半天或公司日历；节假日与端点包含规则必须明确。", "UTC 日期运算可避免夏令时偏差，但法律期限仍需权威来源。"] },
        { heading: "把决定整理为表格", paragraphs: ["Markdown 表格可分别记录源 ISO、IANA 时区、本地时间与确认状态。", "它不会发送邀请；发布前仍需加入人工确认和日历变更。"] },
      ] },
    },
  },
);

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
