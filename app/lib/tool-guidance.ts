import type { Locale } from "./site";
import type { ToolCategory } from "./tools";

type L = Record<Locale, string>;
type GuidanceSource = { slug: string; category: ToolCategory; title: L; short: L };
type Profile = { input: L; method: L; output: L; verification: L; workflow: L };
export type ToolGuidanceDetails = { input: L; method: L; output: L; verification: L; boundary: L };

const l = (tr: string, en: string, de: string, zh: string): L => ({ tr, en, de, zh });
const profile = (input: L, method: L, output: L, verification: L, workflow: L): Profile => ({ input, method, output, verification, workflow });

const profiles = {
  structured: profile(
    l("Sözdizimi geçerli JSON, YAML, XML, INI veya araçta belirtilen yapılandırılmış metin", "Syntactically valid JSON, YAML, XML, INI, or the structured text named by the tool", "Syntaktisch gültiges JSON, YAML, XML, INI oder der vom Werkzeug genannte strukturierte Text", "语法有效的 JSON、YAML、XML、INI，或工具指定的结构化文本"),
    l("Ayrıştırma, alan ve tür sınırlarını koruyan deterministik kurallarla yapılır.", "Parsing uses deterministic rules that preserve field and type boundaries.", "Die Verarbeitung nutzt deterministische Regeln und erhält Feld- und Typgrenzen.", "解析采用确定性规则，并保留字段与类型边界。"),
    l("ayrıştırılmış yapı, alan ölçümleri ve açık sözdizimi bulguları", "a parsed structure, field metrics, and explicit syntax findings", "eine geparste Struktur, Feldkennzahlen und klare Syntaxbefunde", "解析后的结构、字段指标和明确的语法问题"),
    l("alan adları, veri türleri, kaçışlar ve boş/null değerlerin kaynakla birebir karşılaştırılması", "field names, value types, escaping, and empty or null values compared with the source", "Feldnamen, Werttypen, Escaping sowie Leer- und Nullwerte im Vergleich zur Quelle", "将字段名、值类型、转义以及空值或 null 与源数据逐项比较"),
    l("API, yapılandırma veya veri aktarımı", "API, configuration, or data hand-off", "API-, Konfigurations- oder Datenübergabe", "API、配置或数据交接")),
  table: profile(
    l("Başlık ve satır yapısı tutarlı CSV, TSV, tablo veya ayraçlı kayıtlar", "CSV, TSV, tabular, or delimited records with a consistent header and row shape", "CSV-, TSV-, Tabellen- oder Trennzeichendaten mit konsistenter Kopf- und Zeilenstruktur", "表头和行结构一致的 CSV、TSV、表格或分隔记录"),
    l("Ayraç, tırnak, satır ve sütun sınırları ayrı ayrı incelenir.", "Delimiter, quoting, row, and column boundaries are inspected separately.", "Trennzeichen, Anführungszeichen sowie Zeilen- und Spaltengrenzen werden getrennt geprüft.", "分隔符、引号、行边界和列边界会分别检查。"),
    l("satır/sütun özeti, normalize edilmiş kayıtlar ve sorunlu hücrelerin konumu", "row and column totals, normalized records, and locations of problematic cells", "Zeilen- und Spaltensummen, normalisierte Datensätze und Positionen problematischer Zellen", "行列统计、规范化记录以及问题单元格位置"),
    l("başlık sayısı, satır uzunluğu, tırnak kaçışları ve örnek kayıtların hedef tabloda açılması", "header count, row width, quote escaping, and representative records opened in the target table", "Kopfzahl, Zeilenbreite, Anführungs-Escaping und Beispielzeilen in der Zieltabelle", "核对表头数量、行宽、引号转义，并在目标表格中打开代表性记录"),
    l("e-tablo içe aktarma, raporlama veya veri temizleme", "spreadsheet import, reporting, or data cleanup", "Tabellenimport, Bericht oder Datenbereinigung", "电子表格导入、报告或数据清理")),
  pattern: profile(
    l("Desen, bayraklar ve temsili eşleşen/eşleşmeyen metin örnekleri", "a pattern, flags, and representative matching and non-matching text", "ein Muster, Flags sowie repräsentative passende und nicht passende Texte", "模式、标志，以及有代表性的匹配与不匹配文本"),
    l("Desen sınırlı girdi üzerinde çalıştırılır; eşleşme ve risk işaretleri görünür tutulur.", "The pattern runs against bounded input while matches and risk signals remain visible.", "Das Muster läuft auf begrenzten Eingaben; Treffer und Risikosignale bleiben sichtbar.", "模式仅在受限输入上运行，并显示匹配结果与风险信号。"),
    l("eşleşme konumları, yakalama grupları ve gözden geçirilecek karmaşıklık işaretleri", "match locations, capture groups, and complexity signals that need review", "Trefferpositionen, Gruppen und zu prüfende Komplexitätssignale", "匹配位置、捕获组以及需要复核的复杂度信号"),
    l("pozitif, negatif, boş, uzun ve kötü niyetli sınır örnekleriyle yeniden test", "retesting with positive, negative, empty, long, and adversarial boundary cases", "erneute Tests mit positiven, negativen, leeren, langen und adversarialen Grenzfällen", "使用正例、反例、空值、长文本和对抗性边界案例重新测试"),
    l("metin dönüştürme veya doğrulama kuralını yayımlama", "publishing a text transformation or validation rule", "Veröffentlichung einer Textumwandlungs- oder Prüfregel", "发布文本转换或验证规则")),
  web: profile(
    l("Araçta istenen URL, HTTP başlığı, cURL komutu, API veya web yapılandırması", "the URL, HTTP headers, cURL command, API definition, or web configuration requested by the tool", "die vom Werkzeug verlangte URL, HTTP-Header, cURL-Anweisung, API-Definition oder Webkonfiguration", "工具要求的 URL、HTTP 标头、cURL 命令、API 定义或 Web 配置"),
    l("Girdi ağ isteği yapılmadan ayrıştırılır; bileşenler ve riskli varsayımlar ayrı gösterilir.", "Input is parsed without making a network request; components and risky assumptions are separated.", "Die Eingabe wird ohne Netzwerkanfrage geparst; Bestandteile und riskante Annahmen werden getrennt dargestellt.", "输入在不发起网络请求的情况下解析，并分别显示组成部分和高风险假设。"),
    l("normalize edilmiş web yapılandırması, bileşen envanteri ve uygulanabilir inceleme notları", "normalized web configuration, a component inventory, and actionable review notes", "normalisierte Webkonfiguration, Komponentenübersicht und konkrete Prüfhilfen", "规范化的 Web 配置、组件清单和可执行的复核提示"),
    l("çıktının yetkili test ortamında, güncel standart ve gerçek sunucu davranışıyla karşılaştırılması", "comparison with the current standard and real server behavior in an authorized test environment", "Vergleich mit aktuellem Standard und realem Serververhalten in einer autorisierten Testumgebung", "在获授权的测试环境中，与现行标准和真实服务器行为进行比较"),
    l("web yayını, API incelemesi veya istemci entegrasyonu", "web publishing, API review, or client integration", "Webveröffentlichung, API-Prüfung oder Client-Integration", "网站发布、API 审查或客户端集成")),
  temporal: profile(
    l("Açık saat dilimi ve biçim içeren tarih, saat, süre veya zamanlama ifadesi", "a date, time, duration, or schedule with an explicit format and time zone", "Datum, Uhrzeit, Dauer oder Zeitplan mit eindeutigem Format und Zeitzone", "包含明确格式和时区的日期、时间、时长或计划表达式"),
    l("Takvim, saat dilimi ve dahil etme kuralları birbirinden ayrılarak hesaplanır.", "Calendar, time-zone, and inclusion rules are calculated separately.", "Kalender-, Zeitzonen- und Einschlussregeln werden getrennt berechnet.", "日历、时区和计入规则会分开计算。"),
    l("normalize edilmiş zaman değeri, hesaplama özeti ve belirsiz saat dilimi uyarıları", "a normalized temporal value, calculation summary, and ambiguous-zone warnings", "normalisierte Zeitwerte, Rechenübersicht und Warnungen bei unklaren Zeitzonen", "规范化时间值、计算摘要和时区歧义警告"),
    l("UTC karşılığı, yaz/kış saati geçişleri, uç tarihler ve resmî takvim kurallarının kontrolü", "UTC equivalence, daylight-saving transitions, boundary dates, and applicable official calendar rules", "UTC-Entsprechung, Zeitumstellungen, Grenzdaten und geltende offizielle Kalenderregeln", "核对 UTC 对应值、夏令时切换、边界日期以及适用的官方日历规则"),
    l("takvim, rapor veya otomasyon planını paylaşma", "sharing a calendar, report, or automation schedule", "Freigabe eines Kalender-, Berichts- oder Automationsplans", "共享日历、报告或自动化计划")),
  visual: profile(
    l("Desteklenen renk, CSS, SVG, görsel veya boyut değerleri", "supported color, CSS, SVG, image, or dimension values", "unterstützte Farb-, CSS-, SVG-, Bild- oder Maßwerte", "受支持的颜色、CSS、SVG、图像或尺寸值"),
    l("Değerler tarayıcı API'leri ve görünür dönüşüm formülleriyle işlenir; kaynak korunur.", "Values are processed with browser APIs and disclosed conversion formulas while the source is preserved.", "Werte werden mit Browser-APIs und offengelegten Umrechnungen verarbeitet; die Quelle bleibt erhalten.", "使用浏览器 API 和公开的转换公式处理数值，同时保留源内容。"),
    l("önizlenebilir görsel değer, ölçü/biçim özeti ve kopyalanabilir ya da indirilebilir sonuç", "a previewable visual value, dimension or format summary, and a copyable or downloadable result", "Vorschauwert, Maß- oder Formatübersicht und kopier- beziehungsweise ladbares Ergebnis", "可预览的视觉值、尺寸或格式摘要，以及可复制或下载的结果"),
    l("açık/koyu arka plan, farklı ekran boyutları, hedef uygulama ve kaynakla görsel karşılaştırma", "visual comparison across light and dark backgrounds, viewport sizes, the target app, and the source", "visueller Vergleich auf hellen und dunklen Flächen, mehreren Bildschirmgrößen, in der Zielanwendung und mit der Quelle", "在浅色/深色背景、不同屏幕尺寸、目标应用及源内容之间进行视觉比较"),
    l("tasarım sistemine veya yayın varlığına aktarma", "handoff to a design system or publishing asset", "Übergabe an Designsystem oder Publikationsdatei", "交付到设计系统或发布素材")),
  file: profile(
    l("Desteklenen türde, boyut sınırını aşmayan yerel dosya veya dosyalar", "local file or files of a supported type within the disclosed size limit", "lokale Datei(en) eines unterstützten Typs innerhalb der angegebenen Größenbegrenzung", "类型受支持且不超过公开大小限制的本地文件"),
    l("Dosya tarayıcı belleğinde okunur; özgün dosya değiştirilmeden yeni çıktı üretilir.", "The file is read in browser memory and a new output is created without overwriting the original.", "Die Datei wird im Browserspeicher gelesen; eine neue Ausgabe entsteht, ohne das Original zu überschreiben.", "文件在浏览器内存中读取，并在不覆盖原文件的情况下生成新输出。"),
    l("indirilebilir yeni dosya, boyut/biçim ölçümleri ve işlem sınırı", "a downloadable new file, size and format metrics, and disclosed processing limits", "neue Download-Datei, Größen- und Formatkennzahlen sowie offengelegte Verarbeitungsgrenzen", "可下载的新文件、大小与格式指标，以及公开的处理限制"),
    l("özgün dosyanın korunması; çıktı açılabilirliği, beklenen sayfa/kare sayısı, boyut ve görünür kalitenin kontrolü", "preserving the original and checking that output opens correctly, retains expected pages or frames, size, and visible quality", "Erhalt des Originals sowie Prüfung von Öffnung, Seiten/Bildern, Größe und sichtbarer Qualität", "保留原文件，并检查输出能否正常打开、预期页数或帧数、大小及可见质量"),
    l("dosyayı arşivleme, paylaşma veya hedef uygulamada kullanma", "archiving, sharing, or opening the file in its target application", "Archivierung, Freigabe oder Nutzung in der Zielanwendung", "归档、共享文件或在目标应用中使用")),
  prompt: profile(
    l("Amaç, hedef kitle, bağlam, kısıtlar ve beklenen çıktı biçimi açık bir talimat", "an instruction with an explicit goal, audience, context, constraints, and expected output format", "eine Anweisung mit klarem Ziel, Zielgruppe, Kontext, Grenzen und Ausgabeformat", "明确说明目标、受众、上下文、约束和预期输出格式的指令"),
    l("Kural tabanlı inceleme talimat bileşenlerini ayırır; uzak bir model çağırmaz.", "A rule-based review separates instruction components and calls no remote model.", "Eine regelbasierte Prüfung trennt Anweisungsteile und ruft kein entferntes Modell auf.", "基于规则的检查会拆分指令组成部分，不调用远程模型。"),
    l("düzenlenebilir prompt taslağı, kapsam ölçümleri ve açık iyileştirme maddeleri", "an editable prompt draft, coverage metrics, and explicit improvement actions", "bearbeitbarer Prompt-Entwurf, Abdeckungskennzahlen und klare Verbesserungsmaßnahmen", "可编辑的提示词草稿、覆盖指标和明确的改进项"),
    l("normal, eksik, çelişkili, hassas veri içeren ve prompt enjeksiyonlu temsilî vakalarla model üzerinde test", "model testing with representative normal, missing-context, conflicting, sensitive-data, and prompt-injection cases", "Modelltests mit normalen, unvollständigen, widersprüchlichen, sensiblen und Prompt-Injection-Fällen", "在模型上用正常、缺少上下文、冲突、敏感数据和提示词注入案例测试"),
    l("promptu modele, ajana veya ekip şablonuna aktarma", "handoff to a model, agent, or team prompt template", "Übergabe an Modell, Agent oder Teamvorlage", "交付给模型、智能体或团队提示词模板")),
  security: profile(
    l("Yalnızca inceleme yetkiniz bulunan sentetikleştirilmiş kod, yapılandırma, tanımlayıcı veya dosya içeriği", "synthetic or minimized code, configuration, identifiers, or file content you are authorized to review", "synthetischer oder minimierter Code, Konfigurationen, Kennungen oder Dateiinhalte, die Sie prüfen dürfen", "您有权检查的、已合成或最小化的代码、配置、标识符或文件内容"),
    l("İçerik çalıştırılmaz; yalnızca açıklanabilir statik desenler ve sınırlandırılmış tarayıcı işlemleri uygulanır.", "Content is not executed; only explainable static patterns and bounded browser operations are applied.", "Inhalte werden nicht ausgeführt; es gelten nur nachvollziehbare statische Muster und begrenzte Browseroperationen.", "内容不会执行；只应用可解释的静态模式和受限的浏览器操作。"),
    l("kanıt konumu, önem derecesi, yanlış pozitif olasılığı ve sonraki doğrulama adımı", "evidence locations, severity, false-positive considerations, and the next verification action", "Fundstellen, Schweregrad, mögliche Fehlalarme und nächster Prüfschritt", "证据位置、严重程度、误报可能性和下一步核验操作"),
    l("bulgunun kaynak satırında elle incelenmesi ve uygun profesyonel güvenlik aracı ya da yetkili süreçle bağımsız doğrulama", "manual review at the source location and independent verification with an appropriate professional security tool or authorized process", "manuelle Prüfung an der Fundstelle und unabhängige Bestätigung mit geeignetem Sicherheitswerkzeug oder autorisiertem Prozess", "在源位置人工复核，并使用适当的专业安全工具或授权流程独立验证"),
    l("kod incelemesi, güvenlik triage'ı veya kontrollü düzeltme", "code review, security triage, or controlled remediation", "Codeprüfung, Sicherheits-Triage oder kontrollierte Behebung", "代码审查、安全分诊或受控修复")),
  calculation: profile(
    l("Birimleri, dönemleri ve dahil etme varsayımları açık sayısal değerler", "numeric values with explicit units, periods, and inclusion assumptions", "Zahlenwerte mit klaren Einheiten, Zeiträumen und Einschlussannahmen", "单位、周期和计入假设明确的数值"),
    l("Formül, ara değerler, yuvarlama ve sıfıra bölme sınırları görünür biçimde uygulanır.", "The formula, intermediate values, rounding, and divide-by-zero boundaries remain visible.", "Formel, Zwischenwerte, Rundung und Division-durch-null-Grenzen bleiben sichtbar.", "公式、中间值、舍入规则和除零边界均保持可见。"),
    l("hesaplanan değer, kullanılan formül, birim ve senaryo varsayımları", "the calculated value, formula, units, and scenario assumptions", "berechneter Wert, Formel, Einheiten und Szenarioannahmen", "计算结果、所用公式、单位和情景假设"),
    l("örnek elle hesap, sıfır/negatif/uç değerler, birim dönüşümü ve yetkili kaynaktaki kural ile karşılaştırma", "a hand-worked example, zero, negative, and extreme values, unit conversion, and comparison with the authoritative rule", "Handrechnung, Null-, Negativ- und Extremwerte, Einheitenumrechnung und Vergleich mit der maßgeblichen Regel", "通过手工示例、零值、负值、极值、单位换算以及权威规则进行比较"),
    l("bütçe, eğitim, ölçüm veya planlama kararını belgelemek", "documenting a budgeting, education, measurement, or planning decision", "Dokumentation einer Budget-, Bildungs-, Mess- oder Planungsentscheidung", "记录预算、教育、测量或规划决策")),
  research: profile(
    l("Kaynak kimliği, tarih, iddia, yöntem ve kanıt notları birbirinden ayrılmış kayıtlar", "records that separate source identity, date, claim, method, and evidence notes", "Datensätze, die Quellenidentität, Datum, Behauptung, Methode und Evidenznotizen trennen", "将来源身份、日期、主张、方法和证据说明分开的记录"),
    l("Kaynaklar indirilmeden kayıtlar karşılaştırılır; belirsizlik ve eksik karşı kanıt korunur.", "Records are compared without fetching sources, while uncertainty and missing counter-evidence stay explicit.", "Datensätze werden ohne Quellenabruf verglichen; Unsicherheit und fehlende Gegenbelege bleiben sichtbar.", "在不抓取来源的情况下比较记录，同时明确保留不确定性和缺失的反证。"),
    l("izlenebilir iddia-kaynak tablosu, kanıt boşlukları ve öncelikli doğrulama listesi", "a traceable claim-source table, evidence gaps, and a prioritized verification list", "nachvollziehbare Aussage-Quellen-Tabelle, Evidenzlücken und priorisierte Prüfliste", "可追溯的主张-来源表、证据缺口和优先核验清单"),
    l("DOI/URL, yazar, yayın tarihi, yöntem ve ilgili iddianın birincil kaynakta açılıp kontrol edilmesi", "opening the primary source to verify DOI or URL, author, date, method, and the relevant claim", "Öffnen der Primärquelle zur Prüfung von DOI/URL, Autor, Datum, Methode und relevanter Aussage", "打开一手来源，核对 DOI/URL、作者、发布日期、方法和相关主张"),
    l("araştırma notunu, kaynakçayı veya kanıt özetini yayımlama", "publishing research notes, a bibliography, or an evidence summary", "Veröffentlichung von Forschungsnotizen, Literaturverzeichnis oder Evidenzübersicht", "发布研究笔记、参考文献或证据摘要")),
  text: profile(
    l("Amaç ve hedef dil korunarak düzenlenecek veya karşılaştırılacak düz metin", "plain text to edit or compare while preserving its purpose and target language", "zu bearbeitender oder zu vergleichender Klartext unter Beibehaltung von Zweck und Zielsprache", "在保留用途和目标语言的前提下需要编辑或比较的纯文本"),
    l("Unicode, satır ve kelime sınırları korunarak deterministik metin kuralları uygulanır.", "Deterministic text rules are applied while preserving Unicode, line, and word boundaries.", "Deterministische Textregeln erhalten Unicode-, Zeilen- und Wortgrenzen.", "在保留 Unicode、行和词边界的同时应用确定性文本规则。"),
    l("düzenlenmiş metin, değişiklik özeti ve ölçülebilir dil/yapı göstergeleri", "edited text, a change summary, and measurable language or structure indicators", "bearbeiteter Text, Änderungsübersicht und messbare Sprach- oder Strukturindikatoren", "编辑后的文本、变更摘要以及可量化的语言或结构指标"),
    l("anlamı değiştiren cümleler, özel adlar, sayılar, noktalama ve çok dilli karakterlerin önce/sonra karşılaştırması", "a before-and-after comparison of meaning-changing sentences, proper names, numbers, punctuation, and multilingual characters", "Vorher-Nachher-Vergleich bedeutungstragender Sätze, Eigennamen, Zahlen, Zeichensetzung und mehrsprachiger Zeichen", "对可能改变语义的句子、专有名词、数字、标点和多语言字符进行前后比较"),
    l("metni yayımlama, çeviri veya ekip incelemesine gönderme", "publishing, translating, or sending text for team review", "Veröffentlichung, Übersetzung oder Teamprüfung des Textes", "发布、翻译文本或提交团队审阅")),
  general: profile(
    l("Araç etiketlerine uygun, gerçek kişisel veri içermeyen alanlar veya satırlar", "fields or lines that follow the tool labels and contain no unnecessary personal data", "Felder oder Zeilen gemäß Werkzeugbeschriftung ohne unnötige personenbezogene Daten", "符合工具字段说明且不含不必要个人数据的内容"),
    l("Girdi açık kurallarla yapılandırılır; kullanıcı onayı olmadan dış sisteme gönderilmez.", "Input is structured with disclosed rules and is not sent to an external system without user action.", "Eingaben werden nach offengelegten Regeln strukturiert und ohne Nutzeraktion nicht extern übertragen.", "输入依据公开规则进行结构化，未经用户操作不会发送到外部系统。"),
    l("düzenlenebilir taslak, alan özeti ve açık sonraki işlem önerisi", "an editable draft, field summary, and explicit next action", "bearbeitbarer Entwurf, Feldübersicht und klarer nächster Schritt", "可编辑草稿、字段摘要和明确的下一步操作"),
    l("zorunlu alanlar, tarih ve sayı değerleri, hedef kitle ve resmî gereksinimlerin elle kontrolü", "manual review of required fields, dates and numbers, audience fit, and any official requirements", "manuelle Prüfung von Pflichtfeldern, Datums- und Zahlenwerten, Zielgruppe und offiziellen Anforderungen", "人工检查必填字段、日期和数值、受众适配以及任何正式要求"),
    l("taslağı paylaşma, kaydetme veya resmî sürece aktarma", "sharing, saving, or moving the draft into an official process", "Freigabe, Speicherung oder Übernahme des Entwurfs in einen offiziellen Prozess", "共享、保存草稿或将其转入正式流程")),
} satisfies Record<string, Profile>;

const boundaries: Record<ToolCategory, L> = {
  prompt: l("Kural tabanlı değerlendirme gerçek model davranışını kanıtlamaz; temsilî vakalarla yeniden test edin.", "Rule-based review does not prove real model behavior; retest with representative cases.", "Die regelbasierte Prüfung beweist kein reales Modellverhalten; testen Sie repräsentative Fälle.", "规则检查不能证明真实模型行为；请使用代表性案例复测。"),
  text: l("Dil, anlam ve bağlamla ilgili son karar insan incelemesi gerektirir.", "Language, meaning, and context still require final human review.", "Sprache, Bedeutung und Kontext benötigen eine abschließende menschliche Prüfung.", "语言、语义和上下文仍需人工最终审核。"),
  data: l("Şema, kodlama ve veri kaybı varsayımlarını hedef sistemde doğrulayın.", "Verify schema, encoding, and data-loss assumptions in the target system.", "Prüfen Sie Schema, Kodierung und mögliche Datenverluste im Zielsystem.", "请在目标系统核验架构、编码和数据丢失假设。"),
  converter: l("Kaynak kopyayı koruyun; çıktı uyumluluğunu hedef uygulamada doğrulayın.", "Keep the source copy and verify output interoperability in the target application.", "Bewahren Sie die Quelle auf und prüfen Sie die Ausgabe in der Zielanwendung.", "请保留源文件，并在目标应用中验证输出兼容性。"),
  security: l("Bu bir ön kontroldür; kimlik, güvenlik veya mevzuat uygunluğu garantisi değildir.", "This is a pre-check, not a guarantee of identity, security, or regulatory compliance.", "Dies ist eine Vorprüfung, keine Garantie für Identität, Sicherheit oder Rechtskonformität.", "这只是预检查，不保证身份、安全或法规合规。"),
  calculation: l("Sonuç profesyonel finans, sağlık, hukuk veya bilim tavsiyesi değildir.", "The result is not professional financial, medical, legal, or scientific advice.", "Das Ergebnis ist keine professionelle Finanz-, Gesundheits-, Rechts- oder Wissenschaftsberatung.", "结果不构成专业财务、医疗、法律或科学建议。"),
  general: l("Çıktı düzenlenebilir bir taslaktır ve resmî belge ya da uzman onayı yerine geçmez.", "Output is an editable draft and does not replace an official document or expert approval.", "Die Ausgabe ist ein bearbeitbarer Entwurf und ersetzt kein offizielles Dokument oder fachliche Freigabe.", "输出是可编辑草稿，不能替代正式文件或专业批准。"),
  ai: l("Araç uzak model çağırmaz; model çıktısı üretmez veya doğrulamaz.", "The tool calls no remote model and neither generates nor verifies model output.", "Das Werkzeug ruft kein entferntes Modell auf und erzeugt oder prüft keine Modellantwort.", "工具不调用远程模型，也不生成或验证模型输出。"),
  codeSecurity: l("Kod çalıştırılmaz; bulgu olmaması güvenlik açığı bulunmadığını kanıtlamaz.", "Code is not executed, and no finding does not prove the absence of vulnerabilities.", "Code wird nicht ausgeführt; kein Fund beweist nicht die Abwesenheit von Schwachstellen.", "代码不会执行；未发现问题并不能证明不存在漏洞。"),
  research: l("Araç kaynağın doğruluğunu kanıtlamaz; güncellik ve birincil kanıt ayrıca kontrol edilmelidir.", "The tool does not prove a source true; recency and primary evidence require separate checks.", "Das Werkzeug beweist keine Quellenwahrheit; Aktualität und Primärbelege sind separat zu prüfen.", "工具不会证明来源真实；时效性和一手证据仍需单独核对。"),
};

const specificBoundaries: Partial<Record<string, L>> = {
  "jwt-decoder": l(
    "JWT başlığı ve yükünü çözmek imzayı, göndereni, sürenin geçerliliğini veya kimliği doğrulamaz; güven kararı için anahtarla sunucu tarafında doğrulama yapın.",
    "Decoding a JWT header and payload does not verify its signature, issuer, expiry, or identity; validate it server-side with the correct key before making a trust decision.",
    "Das Dekodieren von JWT-Header und -Payload prüft weder Signatur, Aussteller, Ablauf noch Identität; validieren Sie das Token vor einer Vertrauensentscheidung serverseitig mit dem richtigen Schlüssel.",
    "解码 JWT 的头部和载荷不会验证签名、签发者、有效期或身份；作出信任决定前，请使用正确密钥在服务端完成验证。",
  ),
  "cron-ifadesi-aciklayici": l(
    "Cron yorumları uygulamaya göre değişebilir; üretimde kullanmadan önce hedef zamanlayıcının alan sayısını, saat dilimini ve yaz/kış saati davranışını doğrulayın.",
    "Cron semantics vary by scheduler; confirm the target scheduler's field count, time zone, and daylight-saving behavior before production use.",
    "Cron-Semantik unterscheidet sich je nach Scheduler; prüfen Sie vor dem Produktiveinsatz Feldanzahl, Zeitzone und Sommerzeitverhalten des Zielsystems.",
    "不同调度器的 Cron 语义可能不同；投入生产前，请确认目标调度器的字段数量、时区以及夏令时处理方式。",
  ),
  "regex-test-araci": l(
    "Tarayıcıdaki eşleşme başka bir çalışma zamanında aynı sonucu garanti etmez; motor uyumluluğunu ve kötü niyetli uzun girdilerde geri izleme maliyetini ayrıca test edin.",
    "A browser match does not guarantee the same result in another runtime; separately test engine compatibility and backtracking cost on adversarial long input.",
    "Ein Treffer im Browser garantiert kein identisches Ergebnis in einer anderen Laufzeit; prüfen Sie Engine-Kompatibilität und Backtracking-Kosten mit adversarialen langen Eingaben.",
    "浏览器中的匹配不保证其他运行时结果相同；请另行测试引擎兼容性，以及恶意长输入下的回溯开销。",
  ),
  "kvkk-veri-maskeleyici": l(
    "Desen tabanlı maskeleme tüm kişisel verileri bulduğunu veya KVKK/GDPR uyumunu kanıtlamaz; alan envanteri, yeniden tanımlama riski ve örnek çıktı insan tarafından incelenmelidir.",
    "Pattern-based masking does not prove that all personal data was found or that KVKK/GDPR duties are met; a human must review the field inventory, re-identification risk, and sample output.",
    "Musterbasierte Maskierung beweist weder die Erkennung aller personenbezogenen Daten noch die Erfüllung von KVKK/GDPR; Feldinventar, Reidentifikationsrisiko und Stichprobenausgabe müssen menschlich geprüft werden.",
    "基于模式的脱敏不能证明已发现全部个人数据，也不能证明满足 KVKK/GDPR；字段清单、重新识别风险和样本输出仍须人工复核。",
  ),
};

function choose(tool: GuidanceSource): Profile {
  const slug = tool.slug;
  if (/(pdf|gorsel|resim|image|png|jpe?g|webp|heic|exif|dosya|file|zip|favicon)/.test(slug)) return profiles.file;
  if (/(renk|color|kontrast|css|svg|en-boy|aspect|piksel|pixel)/.test(slug)) return profiles.visual;
  if (/(regex|desen|pattern)/.test(slug)) return profiles.pattern;
  if (/(csv|tsv|tablo|pivot|sutun|kolon|satir.*(?:tekil|sirala|sec)|spreadsheet)/.test(slug)) return profiles.table;
  if (/(json|yaml|xml|ini|properties|graphql|sql|schema|toml|ndjson|jsonl)/.test(slug)) return profiles.structured;
  if (/(url|http|curl|api|header|csp|cookie|robots|hreflang|sitemap|utm|domain|dns|html|uri|webhook|openapi)/.test(slug)) return profiles.web;
  if (/(tarih|saat|zaman|time|date|cron|epoch|unix|takvim|calendar|sure|duration)/.test(slug)) return profiles.temporal;
  if (tool.category === "prompt" || tool.category === "ai" || /(prompt|ajan|agent|token|model|llm|few-shot|persona|konusma)/.test(slug)) return profiles.prompt;
  if (tool.category === "security" || tool.category === "codeSecurity" || /(guvenlik|risk|zararli|virus|hash|sha|jwt|sifre|parola|secret|izin|permission)/.test(slug)) return profiles.security;
  if (tool.category === "calculation" || /(hesap|oran|yuzde|ortalama|gpa|yatirim|kredi|faiz|not-|birim|olcu|bmi)/.test(slug)) return profiles.calculation;
  if (tool.category === "research" || /(kaynak|kanit|iddia|doi|atif|bibli|arastirma)/.test(slug)) return profiles.research;
  if (tool.category === "text") return profiles.text;
  return profiles.general;
}

const clean = (value: string) => value.trim().replace(/[.!?。！？]+$/u, "");
const lowerFirst = (value: string, locale: Locale) => value.charAt(0).toLocaleLowerCase(locale === "tr" ? "tr-TR" : locale) + value.slice(1);

export function buildToolGuidance(tool: GuidanceSource) {
  const p = choose(tool);
  const goal = { tr: clean(tool.short.tr), en: lowerFirst(clean(tool.short.en), "en"), de: clean(tool.short.de), zh: clean(tool.short.zh) } satisfies L;
  const boundary = specificBoundaries[tool.slug] ?? boundaries[tool.category];
  const useCases: Record<Locale, string[]> = {
    tr: [`İhtiyaç: ${goal.tr}`, `${p.workflow.tr} öncesinde ${p.output.tr} hazırlama`, `${tool.title.tr} sonucunu ${p.verification.tr} ile doğrulama`],
    en: [`Use ${tool.title.en} when you need to ${goal.en}`, `Prepare ${p.output.en} before ${p.workflow.en}`, `Verify ${tool.title.en} results through ${p.verification.en}`],
    de: [`${tool.title.de} einsetzen, wenn das Ziel lautet: ${goal.de}`, `${p.output.de} vor ${p.workflow.de} vorbereiten`, `Ergebnisse von ${tool.title.de} anhand folgender Prüfung abnehmen: ${p.verification.de}`],
    zh: [`使用${tool.title.zh}完成：${goal.zh}`, `在${p.workflow.zh}前准备${p.output.zh}`, `依据${p.verification.zh}核验${tool.title.zh}的结果`],
  };
  const steps: Record<Locale, string[]> = {
    tr: [`Girdiyi hazırlayın: ${p.input.tr}. Hassas gerçek veri yerine önce sentetik bir örnekle biçimi doğrulayın.`, `Cihaz içi işlemi çalıştırın. Hedef: ${goal.tr}. ${p.method.tr}`, `Kabul kontrolü: ${p.verification.tr}. ${boundary.tr}`],
    en: [`Prepare the input: ${p.input.en}. Confirm the format with a synthetic example before using sensitive real data.`, `Run the on-device operation. Goal: ${goal.en}. ${p.method.en}`, `Acceptance check: ${p.verification.en}. ${boundary.en}`],
    de: [`Eingabe vorbereiten: ${p.input.de}. Prüfen Sie das Format zuerst mit einem synthetischen Beispiel statt mit sensiblen Echtdaten.`, `Lokale Verarbeitung starten. Ziel: ${goal.de}. ${p.method.de}`, `Abnahmekriterium: ${p.verification.de}. ${boundary.de}`],
    zh: [`准备输入：${p.input.zh}。处理敏感真实数据前，请先用合成示例确认格式。`, `运行设备端处理。目标：${goal.zh}。${p.method.zh}`, `验收检查：${p.verification.zh}。${boundary.zh}`],
  };
  return { useCases, steps, details: { input: p.input, method: p.method, output: p.output, verification: p.verification, boundary } satisfies ToolGuidanceDetails };
}

export function getToolGuidanceDetails(tool: GuidanceSource) {
  return buildToolGuidance(tool).details;
}
