import type { Locale } from "./site";
import type { Tool, ToolCategory } from "./tools";

type BaseLocale = "tr" | "en";
type BaseLocalized<T> = Record<BaseLocale, T>;

export type BaseTool = Omit<Tool, "title" | "short" | "description" | "useCases" | "steps"> & {
  title: BaseLocalized<string>;
  short: BaseLocalized<string>;
  description: BaseLocalized<string>;
  useCases: BaseLocalized<string[]>;
  steps: BaseLocalized<string[]>;
};

type Translation = { title: string; short: string; description: string };
type TranslationPair = { de: Translation; zh: Translation };

const translations: Record<string, TranslationPair> = {
  "prompt-kalite-denetimi": {
    de: { title: "Prompt-Qualitätsprüfung", short: "Bewerten Sie Ziel, Kontext, Grenzen und Ausgabeformat anhand transparenter Regeln.", description: "Prüft Zielklarheit, Kontext, Zielgruppe, Einschränkungen, Beispiele und Ausgabeformat eines Prompts. Das Ergebnis kombiniert eine nachvollziehbare Bewertung mit konkreten Verbesserungsvorschlägen." },
    zh: { title: "提示词质量检查器", short: "使用透明规则评估目标、上下文、约束和输出格式。", description: "检查提示词的目标清晰度、上下文、受众、约束、示例和输出格式，并给出可解释评分与可执行的改进建议。" },
  },
  "meta-prompt-olusturucu": {
    de: { title: "Meta-Prompt-Generator", short: "Verwandeln Sie ein Ziel in Rolle, Ablauf, Grenzen und ein klares Ausgabeschema.", description: "Erstellt aus einer kurzen Aufgabe einen wiederverwendbaren Meta-Prompt mit Rolle, Erfolgskriterien, Arbeitsschritten, Grenzen und Ausgabevertrag – vollständig auf dem Gerät." },
    zh: { title: "元提示词生成器", short: "把目标转换为包含角色、流程、边界和输出结构的提示词。", description: "将简短任务转化为可复用的元提示词，包含角色、成功标准、工作流程、约束和输出协议，全程在设备上生成。" },
  },
  "token-sayaci": {
    de: { title: "Token- & Kontextzähler", short: "Schätzen Sie Textlänge und Tokenbedarf, ohne Inhalte an ein Modell zu senden.", description: "Berechnet Zeichen, Wörter, Zeilen und eine modellunabhängige Token-Näherung. Exakte Werte hängen vom jeweiligen Tokenizer ab; die Ausgabe dient der sicheren Kontextplanung." },
    zh: { title: "Token 与上下文计数器", short: "无需把内容发送给模型，即可估算文本长度和 Token 需求。", description: "计算字符、单词、行数和近似 Token 数。精确值取决于模型分词器，本结果用于安全的上下文规划。" },
  },
  "okunabilirlik-analizi": {
    de: { title: "Lesbarkeitsanalyse", short: "Bewerten Sie Verständlichkeit anhand von Satz- und Wortstruktur.", description: "Erzeugt eine nachvollziehbare Lesbarkeitsübersicht aus Satzlänge, Wortvielfalt und Silbendichte, mit sprachspezifischen Näherungsverfahren." },
    zh: { title: "可读性分析", short: "通过句子和词语结构评估文本清晰度。", description: "基于句长、词汇多样性和音节密度生成可解释的可读性摘要，并采用适合不同语言的近似指标。" },
  },
  "metin-benzerlik-analizi": {
    de: { title: "Textähnlichkeitsanalyse", short: "Vergleichen Sie zwei Texte mit Wortüberschneidung und Kosinus-Ähnlichkeit.", description: "Vergleicht lokale Worthäufigkeiten und liefert Jaccard- sowie Kosinus-Werte. Es handelt sich um eine erklärbare lexikalische Messung, nicht um ein semantisches KI-Modell." },
    zh: { title: "文本相似度分析", short: "使用词语重叠和余弦相似度比较两段文本。", description: "比较本地词频并返回 Jaccard 与余弦相似度。这是可解释的词汇指标，并非 AI 语义模型。" },
  },
  "metin-temizleyici": {
    de: { title: "Textbereiniger", short: "Entfernen Sie überflüssige Leerzeichen, Leerzeilen und uneinheitliche Formatierung.", description: "Bereinigt kopierten Text von überzähligen Abständen, wiederholten Leerzeilen und Zeilenumbruchproblemen, ohne die beabsichtigte Bedeutung zu verändern." },
    zh: { title: "文本清理器", short: "清除多余空格、重复空行和不一致格式。", description: "清理复制文本中的多余空格、重复空行和换行问题，同时尽量保持原意不变。" },
  },
  "buyuk-kucuk-harf-donusturucu": {
    de: { title: "Groß-/Kleinschreibung konvertieren", short: "Wandeln Sie Text in Satz-, Titel-, Groß- oder Kleinschreibung um.", description: "Konvertiert Text lokal zwischen Groß-, Klein-, Satz- und Titelschreibung und berücksichtigt sprachabhängige Zeichenregeln." },
    zh: { title: "大小写转换器", short: "将文本转换为句首、标题、大写或小写格式。", description: "在大写、小写、句首大写和标题格式之间本地转换文本，并考虑语言相关字符规则。" },
  },
  "kelime-sayaci": {
    de: { title: "Wort-, Zeichen- & Lesezeitzähler", short: "Messen Sie Umfang, Absätze und geschätzte Lesezeit eines Textes.", description: "Zählt Wörter, Zeichen, Sätze, Absätze und Zeilen und schätzt die Lesezeit mit einer transparenten Standard-Lesegeschwindigkeit." },
    zh: { title: "字数、字符与阅读时间", short: "测量内容长度、段落数量和预计阅读时间。", description: "统计词语、字符、句子、段落和行数，并基于透明的标准阅读速度估算阅读时间。" },
  },
  "json-bicimlendirici": {
    de: { title: "JSON-Formatierer & Validator", short: "Validieren, formatieren oder minimieren Sie JSON direkt im Browser.", description: "Validiert die JSON-Syntax lokal und erzeugt lesbare oder minimierte Ausgabe. Parse-Fehler werden verständlich angezeigt, ohne Nutzdaten zu übertragen." },
    zh: { title: "JSON 格式化与验证器", short: "直接在浏览器中验证、美化或压缩 JSON。", description: "在本地验证 JSON 语法并生成可读或压缩输出。解析错误会友好显示，数据不会被发送。" },
  },
  "json-csv-donusturucu": {
    de: { title: "JSON ↔ CSV-Konverter", short: "Konvertieren Sie flache Objektlisten und CSV-Tabellen lokal.", description: "Wandelt flache JSON-Objektlisten in CSV und CSV-Tabellen in JSON um, einschließlich korrekter Behandlung von Anführungszeichen und Trennzeichen." },
    zh: { title: "JSON ↔ CSV 转换器", short: "在本地转换扁平对象数组与 CSV 表格。", description: "在扁平 JSON 对象数组和 CSV 表格之间转换，并正确处理引号、分隔符和转义。" },
  },
  "regex-test-araci": {
    de: { title: "Regex-Tester", short: "Testen Sie reguläre Ausdrücke mit begrenzter Laufzeit und sichtbaren Treffern.", description: "Führt Regex-Prüfungen in einem zeitlich begrenzten Web Worker aus, zeigt Treffer und Gruppen und reduziert so das Risiko blockierender Rückverfolgung." },
    zh: { title: "正则表达式测试器", short: "通过限时执行和可视化匹配安全测试正则表达式。", description: "在限时 Web Worker 中运行正则表达式，显示匹配与分组，降低灾难性回溯阻塞页面的风险。" },
  },
  "csv-inceleyici": {
    de: { title: "CSV-Inspektor", short: "Prüfen Sie Spalten, Zeilen, Trennzeichen und Datenqualität einer CSV-Datei.", description: "Analysiert CSV-Inhalte lokal, erkennt gängige Trennzeichen und fasst Tabellenform, leere Werte und Inkonsistenzen verständlich zusammen." },
    zh: { title: "CSV 检查器", short: "检查 CSV 的列、行、分隔符和数据质量。", description: "在本地分析 CSV，识别常见分隔符，并清晰汇总表格结构、空值和不一致问题。" },
  },
  "base64-kodlayici": {
    de: { title: "Base64-Kodierer/Decoder", short: "Kodieren oder dekodieren Sie UTF-8-Text lokal als Base64.", description: "Konvertiert UTF-8-Text und Base64 im Browser. Base64 ist eine Darstellung und keine Verschlüsselung; sensible Werte bleiben sichtbar dekodierbar." },
    zh: { title: "Base64 编码/解码器", short: "在本地对 UTF-8 文本进行 Base64 编码或解码。", description: "在浏览器中转换 UTF-8 文本与 Base64。Base64 是表示方式而非加密，敏感值仍可被解码读取。" },
  },
  "url-kodlayici": {
    de: { title: "URL-Kodierer/Decoder", short: "Kodieren oder dekodieren Sie URL-Komponenten mit verständlichen Fehlern.", description: "Wendet percent-encoding lokal auf URL-Komponenten an und meldet unvollständige oder ungültige Escape-Sequenzen, ohne Netzwerkzugriff." },
    zh: { title: "URL 编码/解码器", short: "对 URL 组件进行编码或解码，并显示清晰错误。", description: "在本地对 URL 组件执行百分号编码，并报告不完整或无效的转义序列，无需联网。" },
  },
  "kvkk-veri-maskeleyici": {
    de: { title: "Maskierung personenbezogener Daten", short: "Erkennen und maskieren Sie häufige E-Mail-, Telefon-, IP- und Identifikationsmuster.", description: "Ersetzt häufige sensible Muster lokal durch lesbare Platzhalter. Die regelbasierte Erkennung ist eine Vorprüfung und keine Garantie für DSGVO-, KVKK- oder Rechtskonformität." },
    zh: { title: "个人数据遮蔽工具", short: "检测并遮蔽常见的邮箱、电话、IP 和身份标识模式。", description: "在本地用清晰占位符替换常见敏感模式。规则检测仅用于预检查，不构成 GDPR、KVKK 或法律合规保证。" },
  },
  "guclu-parola-uretici": {
    de: { title: "Sicherer Passwortgenerator", short: "Erzeugen Sie lokal starke Zufallspasswörter mit Web Crypto.", description: "Erzeugt mit kryptografischem Browser-Zufall lange Passwörter aus mehreren Zeichengruppen. Das Ergebnis wird weder übertragen noch dauerhaft gespeichert." },
    zh: { title: "强密码生成器", short: "使用 Web Crypto 在本地生成强随机密码。", description: "利用浏览器的加密随机数从多类字符中生成长密码，结果不会被发送或持久保存。" },
  },
  "uuid-uretici": {
    de: { title: "UUID-v4-Generator", short: "Erzeugen Sie standardkonforme zufällige UUIDs direkt im Browser.", description: "Erstellt UUID-v4-Kennungen mit der Web-Crypto-Schnittstelle. UUIDs sind eindeutige Kennungen, aber keine geheimen Zugangsdaten." },
    zh: { title: "UUID v4 生成器", short: "直接在浏览器中生成符合标准的随机 UUID。", description: "使用 Web Crypto 接口生成 UUID v4 标识符。UUID 用于唯一标识，并不是秘密凭证。" },
  },
  "sha256-ozet-uretici": {
    de: { title: "SHA-256-Hashgenerator", short: "Berechnen Sie den SHA-256-Hash von Text lokal mit Web Crypto.", description: "Erzeugt einen SHA-256-Digest im Browser zur Integritätsprüfung. Ein Hash verschlüsselt Inhalte nicht und ersetzt keine digitale Signatur oder Identitätsprüfung." },
    zh: { title: "SHA-256 摘要生成器", short: "使用 Web Crypto 在本地计算文本的 SHA-256。", description: "在浏览器中生成 SHA-256 摘要用于完整性核对。哈希不是加密，也不能替代数字签名或身份验证。" },
  },
  "few-shot-ornek-olusturucu": {
    de: { title: "Few-shot-Beispielgenerator", short: "Strukturieren Sie Aufgaben und Beispiele zu einem wiederverwendbaren Few-shot-Prompt.", description: "Ordnet Aufgabe, Eingabe-Ausgabe-Beispiele und neue Anfrage in ein klares Prompt-Format. Die Qualität hängt von Vielfalt und Richtigkeit der Beispiele ab." },
    zh: { title: "Few-shot 示例生成器", short: "把任务和示例整理为可复用的 Few-shot 提示词。", description: "将任务、输入输出示例和新请求组织为清晰提示格式。结果质量取决于示例的正确性与多样性。" },
  },
  "sistem-promptu-persona-sablonu": {
    de: { title: "System-Prompt- & Persona-Vorlage", short: "Definieren Sie Rolle, Ton, Stil und Grenzen eines KI-Assistenten.", description: "Erstellt schrittweise einen professionellen System-Prompt mit Rolle, Zielgruppe, Ton, Arbeitsprinzipien, Sicherheitsgrenzen und Ausgabeerwartungen." },
    zh: { title: "系统提示词 / 角色模板", short: "定义 AI 助手的角色、语气、风格和边界。", description: "逐步生成专业系统提示词，包含角色、受众、语气、工作原则、安全边界和输出要求。" },
  },
  "metin-farki-diff": {
    de: { title: "Text-Diff", short: "Markieren Sie hinzugefügte und entfernte Zeilen oder Wörter übersichtlich.", description: "Vergleicht zwei Texte lokal und hebt Ergänzungen und Löschungen farblich hervor. Die Darstellung dient der redaktionellen Prüfung und ist keine Versionskontrolle." },
    zh: { title: "文本差异比较", short: "清晰标记新增和删除的行或词语。", description: "在本地比较两段文本并用颜色突出新增和删除内容，适合编辑审阅，但不能替代版本控制。" },
  },
  "markdown-onizleyici": {
    de: { title: "Markdown-Vorschau", short: "Schreiben Sie Markdown und prüfen Sie sichere HTML-Vorschau sowie Ausgabecode.", description: "Rendert eine lokale Vorschau und erzeugt bereinigtes HTML aus einer unterstützten Markdown-Teilmenge. Eingebettetes Roh-HTML und Skripte werden nicht ausgeführt." },
    zh: { title: "Markdown 预览器", short: "编写 Markdown，并查看安全 HTML 预览与输出代码。", description: "从受支持的 Markdown 子集生成本地预览和净化后的 HTML，不执行嵌入的原始 HTML 或脚本。" },
  },
  "unix-zaman-damgasi-donusturucu": {
    de: { title: "Unix-Zeitstempel-Konverter", short: "Konvertieren Sie Epoch-Werte und lesbare Datumsangaben in beide Richtungen.", description: "Wandelt Sekunden oder Millisekunden seit der Unix-Epoche in lokale/UTC-Zeit und Datumswerte zurück in Zeitstempel. Zeitzone und Einheit werden sichtbar ausgewiesen." },
    zh: { title: "Unix 时间戳转换器", short: "在 Epoch 数值和可读日期之间双向转换。", description: "把 Unix Epoch 秒或毫秒转换为本地/UTC 时间，也可把日期转换回时间戳，并明确显示时区和单位。" },
  },
  "jwt-decoder": {
    de: { title: "JWT-Decoder", short: "Lesen Sie Header und Payload eines JWT lokal als formatiertes JSON.", description: "Dekodiert Base64URL-Header und -Payload im Browser. Das Werkzeug verifiziert weder Signatur noch Aussteller, Gültigkeit oder Identität und darf nicht zur Authentifizierung verwendet werden." },
    zh: { title: "JWT 解码器", short: "在本地把 JWT Header 和 Payload 读取为格式化 JSON。", description: "在浏览器中解码 Base64URL Header 与 Payload。工具不会验证签名、签发者、有效性或身份，不能用于认证。" },
  },
  "renk-donusturucu": {
    de: { title: "HEX/RGB/HSL-Farbkonverter", short: "Konvertieren Sie Farben live zwischen HEX, RGB und HSL.", description: "Synchronisiert Farbwähler und numerische Werte lokal und validiert Eingaben mit klaren Bereichsangaben. Bildschirmdarstellung ersetzt kein professionelles Farbmanagement." },
    zh: { title: "HEX/RGB/HSL 颜色转换器", short: "在 HEX、RGB 与 HSL 之间实时转换颜色。", description: "在本地同步颜色选择器和数值，并通过明确范围验证输入。屏幕显示不能替代专业色彩管理。" },
  },
  "qr-kod-olusturucu": {
    de: { title: "QR-Code-Generator", short: "Erzeugen Sie aus Text oder URLs lokale QR-Codes als PNG oder SVG.", description: "Erstellt QR-Codes vollständig im Browser und bietet PNG- sowie SVG-Download. Prüfen Sie Ziel und Lesbarkeit vor Veröffentlichung; ein QR-Code bestätigt keine Vertrauenswürdigkeit." },
    zh: { title: "二维码生成器", short: "根据文本或网址在本地生成 PNG 或 SVG 二维码。", description: "完全在浏览器中生成二维码，并支持 PNG 与 SVG 下载。发布前请核对目标和可读性；二维码本身不代表目标可信。" },
  },
  "cron-ifadesi-aciklayici": {
    de: { title: "Cron-Ausdruckserklärer", short: "Übersetzen Sie klassische fünfteilige Cron-Ausdrücke in verständliche Sprache.", description: "Validiert übliche Cron-Felder und erklärt typische Zeitpläne. Die tatsächliche Ausführung hängt von Scheduler, Zeitzone und unterstützter Cron-Variante ab." },
    zh: { title: "Cron 表达式解释器", short: "把经典五段 Cron 表达式转换为易懂语言。", description: "验证常见 Cron 字段并解释典型计划。实际执行取决于调度器、时区和所支持的 Cron 变体。" },
  },
  "exif-meta-veri-temizleyici": {
    de: { title: "EXIF-/Metadaten-Bereiniger", short: "Prüfen und entfernen Sie sensible Bildmetadaten lokal.", description: "Liest erkennbare JPEG-/PNG-Metadaten und erstellt aus Pixeldaten eine bereinigte Kopie. Prüfen Sie Spezialprofile und professionelle Workflows zusätzlich." },
    zh: { title: "EXIF / 元数据清理器", short: "在本地检查并移除图片中的敏感元数据。", description: "读取可识别的 JPEG/PNG 元数据，并从像素数据重建干净副本。特殊色彩配置和专业流程仍需另行核验。" },
  },
  "sifre-gucu-testi": {
    de: { title: "Passwortstärke-Test", short: "Schätzen Sie Entropie, Musterprobleme und theoretische Angriffsdauer lokal.", description: "Bewertet Länge, Zeichenvorrat und häufige Muster ohne Netzwerkabfrage. Entropie und Knackzeit sind mathematische Näherungen und keine Sicherheitsgarantie." },
    zh: { title: "密码强度测试", short: "在本地估算熵、常见模式风险和理论破解时间。", description: "无需联网，根据长度、字符集合和常见模式评分。熵与破解时间仅为数学估算，不构成安全保证。" },
  },
  "arac-zinciri-pipeline": {
    de: { title: "Werkzeug-Pipeline", short: "Maskieren, konvertieren und exportieren Sie Tabellendaten in einem lokalen Ablauf.", description: "Verbindet CSV-Prüfung, regelbasierte Datenmaskierung, JSON-Konvertierung und Download auf einer Seite. Erkennung ist heuristisch und keine Rechts- oder Identitätsprüfung." },
    zh: { title: "工具流水线", short: "在一个本地流程中完成表格数据遮蔽、转换和导出。", description: "在同一页面串联 CSV 检查、规则数据遮蔽、JSON 转换与下载。检测是启发式预检查，不是法律或身份验证。" },
  },
  "json-diff-karsilastirma": {
    de: { title: "Struktureller JSON-Vergleich", short: "Erkennen Sie hinzugefügte, entfernte und geänderte JSON-Pfade.", description: "Vergleicht zwei JSON-Werte strukturell und listet Änderungen nach Pfad und Typ. Semantische Gleichwertigkeit, Signaturen und Identitäten werden nicht geprüft." },
    zh: { title: "结构化 JSON 对比", short: "识别新增、删除和变更的 JSON 路径。", description: "按结构比较两个 JSON 值，并按路径和类型列出变化。不验证语义等价、签名或身份。" },
  },
  "curl-kod-donusturucu": {
    de: { title: "cURL-zu-Code-Konverter", short: "Konvertieren Sie cURL in Fetch-, Python-requests- oder PHP-cURL-Code.", description: "Parst gängige cURL-Optionen lokal, ohne den Befehl auszuführen, und erzeugt äquivalente Codeentwürfe. Prüfen Sie Geheimnisse, Shell-Sonderfälle und Sicherheitsannahmen vor Nutzung." },
    zh: { title: "cURL 转代码", short: "把 cURL 转换为 Fetch、Python requests 或 PHP cURL 代码。", description: "在不执行命令的情况下本地解析常见 cURL 选项并生成等效代码草稿。使用前请检查密钥、Shell 特例和安全假设。" },
  },
  "meta-etiket-favicon-uretici": {
    de: { title: "Meta-Tag- & Favicon-Generator", short: "Erzeugen Sie SEO-, Open-Graph-, Social-Card- und Favicon-Markup.", description: "Erstellt aus Seitendaten escaped HTML-Metadaten, einen Next.js-Entwurf und Manifest-Hinweise. Die Vorprüfung garantiert weder Indexierung noch korrekte Darstellung durch Crawler." },
    zh: { title: "Meta 标签 / Favicon 生成器", short: "生成 SEO、Open Graph、社交卡片与 Favicon 标记。", description: "根据页面数据生成转义后的 HTML 元数据、Next.js 草稿和 Manifest 提示。预检查不保证搜索引擎收录或爬虫展示。" },
  },
  "gorsel-format-donusturucu": {
    de: { title: "PNG/JPG/WebP/SVG-Konverter", short: "Konvertieren Sie unterstützte Bilder lokal in PNG, JPG oder WebP.", description: "Kodiert Bildpixel mit Canvas neu; SVG wird rasterisiert und keine Datei hochgeladen. Das Werkzeug behauptet keine echte PNG-zu-SVG-Vektorisierung." },
    zh: { title: "PNG/JPG/WebP/SVG 转换器", short: "在本地把支持的图片转换为 PNG、JPG 或 WebP。", description: "使用 Canvas 重新编码图片像素；SVG 会被栅格化，文件不会上传。本工具不声称能把 PNG 真正矢量化为 SVG。" },
  },
  "gorsel-sikistirici": {
    de: { title: "Bildkomprimierer", short: "Passen Sie Qualität und Kantenlänge an und erzeugen Sie kleinere WebP-/JPG-Kopien.", description: "Skaliert und kodiert Bilder lokal mit wählbarer verlustbehafteter Qualität neu und zeigt die tatsächlich erreichte Dateigröße vor dem Download." },
    zh: { title: "图片压缩器", short: "调整质量和最长边，生成更小的 WebP 或 JPG 副本。", description: "在本地缩放并以可选的有损质量重新编码图片，下载前显示实际生成的文件大小。" },
  },
  "gorselden-pdf": {
    de: { title: "Bilder-zu-PDF-Konverter", short: "Kombinieren Sie PNG-, JPG-, WebP- und SVG-Bilder lokal zu einem PDF.", description: "Rasterisiert bis zu zwanzig Bilder im aktiven Tab und platziert sie in Dateireihenfolge auf PDF-Seiten. Die Dateien werden nicht hochgeladen." },
    zh: { title: "图片转 PDF", short: "在本地把 PNG、JPG、WebP 和 SVG 图片合并为 PDF。", description: "在活动标签页中栅格化最多二十张图片，并按文件顺序放入 PDF 页面，文件不会上传。" },
  },
  "pdf-birlestirme": {
    de: { title: "PDF zusammenführen", short: "Führen Sie mehrere PDFs in gewählter Reihenfolge lokal zusammen.", description: "Kopiert Seiten mehrerer PDFs im Browser in ein neues Dokument. Verschlüsselung wird nicht umgangen; vorhandene digitale Signaturen können ungültig werden." },
    zh: { title: "PDF 合并", short: "按所选顺序在本地合并多个 PDF。", description: "在浏览器中把多个 PDF 的页面复制到新文档。不会绕过加密；现有数字签名可能失效。" },
  },
  "pdf-bolme": {
    de: { title: "PDF teilen / Seiten extrahieren", short: "Extrahieren Sie ausgewählte Seitenbereiche lokal in ein neues PDF.", description: "Liest die Seitenzahl und kopiert gewählte Bereiche in ein neues Dokument. Verschlüsselung wird nicht entfernt; Formulare und digitale Signaturen können sich ändern." },
    zh: { title: "PDF 拆分 / 页面提取", short: "在本地把选定页码范围提取到新的 PDF。", description: "读取页数并把选定范围复制到新文档。不会移除加密；表单行为和数字签名可能发生变化。" },
  },
  "yatirim-getiri-simulatoru": {
    de: { title: "Rendite-Simulator", short: "Simulieren Sie Einmalanlage, Sparrate, Rendite, Gebühren und Inflation.", description: "Berechnet nominalen und inflationsbereinigten Endwert mit transparenter monatlicher Verzinsung. Das Ergebnis ist ein Szenario, keine Anlageberatung oder Renditegarantie." },
    zh: { title: "投资回报模拟器", short: "模拟初始投资、定投、收益率、费用和通胀。", description: "使用透明的月度复利公式计算名义与通胀调整后的终值。结果仅为情景模拟，不是投资建议或收益保证。" },
  },
  "birim-donusturucu": {
    de: { title: "Einheitenkonverter", short: "Konvertieren Sie Länge, Masse, Temperatur, Datenmenge und Volumen.", description: "Konvertiert gängige Einheiten lokal mit sichtbarer Formel und kontrollierter Rundung. Für regulierte Messungen sind kalibrierte Systeme erforderlich." },
    zh: { title: "单位换算器", short: "换算长度、质量、温度、数据容量和体积。", description: "使用可见公式和受控舍入在本地换算常见单位。受监管测量仍需使用经校准的系统。" },
  },
  "not-ortalamasi-hesaplayici": {
    de: { title: "Notendurchschnitt-Rechner", short: "Berechnen Sie gewichtete Noten und erforderliche Zielwerte.", description: "Berechnet aus Noten und Gewichten einen transparenten Durchschnitt und prüft Gewichtssummen. Offizielle Schulregeln und Rundung können abweichen." },
    zh: { title: "加权成绩计算器", short: "计算加权成绩与达到目标所需分数。", description: "根据成绩和权重透明计算平均分并检查权重总和。学校的正式评分与舍入规则可能不同。" },
  },
  "gpa-cevirici": {
    de: { title: "GPA-Konverter", short: "Schätzen Sie GPA-Werte zwischen 4,0-, 5,0-, 10- und 100-Punkte-Skalen.", description: "Bietet eine klar gekennzeichnete lineare Näherung zwischen häufigen Skalen. Hochschulen verwenden eigene nichtlineare Tabellen; das Ergebnis ist nicht offiziell." },
    zh: { title: "GPA 换算器", short: "在 4.0、5.0、10 分和百分制之间估算 GPA。", description: "在常见评分尺度之间提供明确标注的线性近似。院校可能采用非线性官方表格，本结果不具官方效力。" },
  },
  "kaynakca-atif-formatlayici": {
    de: { title: "Zitationsformatierer (APA/MLA)", short: "Erstellen Sie prüfbare APA- oder MLA-Entwürfe aus bibliografischen Feldern.", description: "Formatiert Buch-, Artikel- und Webquellen lokal als APA-7- oder MLA-9-Entwurf. Interpunktion, Großschreibung und Sonderfälle müssen gegen die aktuelle Stilrichtlinie geprüft werden." },
    zh: { title: "参考文献格式化（APA/MLA）", short: "根据书目信息生成可核验的 APA 或 MLA 草稿。", description: "在本地把图书、文章和网页来源格式化为 APA 7 或 MLA 9 草稿。标点、大小写和特殊情况仍需对照最新规范核验。" },
  },
  "fatura-sablonu-olusturucu": {
    de: { title: "Rechnungsvorlage", short: "Erstellen Sie eine druckbare Rechnung mit Positionen, Steuer und Summen.", description: "Erzeugt lokal eine druckbare Rechnungsansicht und CSV-Zusammenfassung. Steuerangaben, Pflichtfelder, Nummerierung und Aufbewahrung müssen an die jeweilige Rechtsordnung angepasst werden." },
    zh: { title: "发票模板生成器", short: "创建含项目、税额和合计的可打印发票。", description: "在本地生成可打印发票视图和 CSV 摘要。税务信息、必填字段、编号和保存要求必须按适用司法辖区调整。" },
  },
  "basit-sozlesme-sablonu": {
    de: { title: "Einfache Vertragsvorlage", short: "Strukturieren Sie Parteien, Leistung, Vergütung, Laufzeit und Unterschriften.", description: "Erstellt aus eingegebenen Fakten einen neutralen Vertragsentwurf. Er ist keine Rechtsberatung, berücksichtigt keine individuelle Rechtsordnung und muss fachlich geprüft werden." },
    zh: { title: "简易合同模板", short: "整理双方、服务、报酬、期限与签署条款。", description: "根据输入事实生成中性合同草稿。这不是法律意见，也不会自动适配具体司法辖区，使用前必须由专业人士审阅。" },
  },
  "asiri-kesinlik-dil-tarayicisi": {
    de: { title: "Übergewissheits-Sprachscanner", short: "Finden Sie absolute, unbelegte oder garantierende Formulierungen in Texten.", description: "Markiert regelbasiert Wörter wie ‚immer‘, ‚garantiert‘ oder ‚unmöglich‘ und schlägt kalibrierte Alternativen vor. Die Prüfung versteht den Kontext nicht wie ein Mensch." },
    zh: { title: "过度确定性语言扫描器", short: "查找文本中绝对化、无依据或保证性表述。", description: "基于规则标记“永远”“保证”“不可能”等词，并建议更审慎的替代表达。工具不能像人类一样理解完整语境。" },
  },
  "konusma-disa-aktarma-formatlayici": {
    de: { title: "Gesprächsexport-Formatierer", short: "Konvertieren Sie Chat-Transkripte in Markdown, JSONL oder Klartext.", description: "Parst einfache Sprecherzeilen oder JSON-Nachrichten und erzeugt bereinigte lokale Exporte. Prüfen und entfernen Sie sensible Inhalte vor dem Teilen." },
    zh: { title: "对话导出格式化器", short: "把聊天记录转换为 Markdown、JSONL 或纯文本。", description: "解析简单的角色行或 JSON 消息并生成干净的本地导出。分享前请检查并移除敏感信息。" },
  },
  "token-baglam-butcesi-planlayici": {
    de: { title: "Token-/Kontextbudget-Planer", short: "Verteilen Sie Kontextfenster auf Systemtext, Verlauf, Eingabe und Ausgabe.", description: "Schätzt Tokenanteile und Sicherheitsreserve für ein gewähltes Kontextfenster. Exakte Werte hängen von Modell, Tokenizer und Anbieterregeln ab." },
    zh: { title: "Token / 上下文预算规划器", short: "在系统提示、历史、输入与输出之间分配上下文窗口。", description: "为所选上下文窗口估算各部分 Token 和安全余量。精确值取决于模型、分词器和服务规则。" },
  },
  "sistem-promptu-netlik-kontrolu": {
    de: { title: "System-Prompt-Klarheitsprüfung", short: "Prüfen Sie Ziel, Autorität, Grenzen, Konflikte und Ausgabeformat.", description: "Bewertet System-Prompts mit transparenten Regeln und meldet fehlende Zuständigkeiten, widersprüchliche Anweisungen und unklare Fehlerbehandlung. Es wird kein Modell aufgerufen." },
    zh: { title: "系统提示词清晰度检查", short: "检查目标、权限、边界、冲突和输出格式。", description: "使用透明规则评估系统提示词，指出缺失的职责、冲突指令和不清晰的失败处理，全程不调用模型。" },
  },
  "rol-persona-tutarlilik-kontrolu": {
    de: { title: "Rollen-/Persona-Konsistenzprüfung", short: "Vergleichen Sie Persona-Regeln mit Beispielen auf Ton- und Grenzkonflikte.", description: "Sucht lokal nach widersprüchlichen Rollen, Tonvorgaben und Grenzen zwischen Persona und Beispielantworten. Die heuristische Prüfung ersetzt keinen Red-Team-Test." },
    zh: { title: "角色 / Persona 一致性检查", short: "比较角色规则与示例中的语气和边界冲突。", description: "在本地查找 Persona 与示例回答之间的角色、语气和边界矛盾。启发式检查不能替代红队测试。" },
  },
  "dosya-risk-on-taramasi": {
    de: { title: "Lokaler Datei-Risiko-Scanner", short: "Prüfen Sie Dateityp, Signatur, Doppelendung, Makrohinweise und verdächtige Textmuster.", description: "Analysiert Dateiname, Magic Bytes und begrenzte Inhaltsproben vollständig im Browser. Es ist kein Antivirenprogramm, führt nichts aus und kann Malware weder sicher bestätigen noch ausschließen." },
    zh: { title: "本地文件风险扫描器", short: "检查文件类型、魔数、双扩展名、宏迹象和可疑文本模式。", description: "完全在浏览器中分析文件名、Magic Bytes 和受限内容样本。它不是杀毒软件，不会执行文件，也不能可靠确认或排除恶意软件。" },
  },
  "kod-guvenligi-on-taramasi": {
    de: { title: "Code-Sicherheits-Vorprüfung", short: "Finden Sie riskante APIs, eingebettete Geheimnisse und unsichere Muster im Quellcode.", description: "Prüft Quellcode in einem begrenzten lokalen Worker auf eval, unsichere DOM-Sinks, Shell-Aufrufe, schwache Kryptografie und Secret-Muster. Ergebnisse sind Hinweise, keine vollständige SAST-Prüfung." },
    zh: { title: "代码安全预扫描", short: "查找源代码中的危险 API、硬编码密钥和不安全模式。", description: "在受限本地 Worker 中检查 eval、不安全 DOM Sink、Shell 调用、弱加密和密钥模式。结果仅是线索，不是完整 SAST 审计。" },
  },
  "url-guvenlik-on-kontrolu": {
    de: { title: "URL-Sicherheits-Vorprüfung", short: "Prüfen Sie URLs lokal auf Zugangsdaten, IP-Hosts, Punycode und Verschleierung.", description: "Analysiert die URL-Struktur ohne die Adresse aufzurufen. Heuristiken erkennen auffällige Merkmale, können aber weder Reputation noch tatsächlichen Seiteninhalt bestätigen." },
    zh: { title: "URL 安全预检查", short: "在本地检查凭据、IP 主机、Punycode 和混淆特征。", description: "无需访问目标即可分析 URL 结构。启发式规则能发现可疑特征，但无法确认信誉或网页实际内容。" },
  },
  "prompt-sablon-degisken-doldurucu": {
    de: { title: "Prompt-Vorlage & Variablenfüller", short: "Füllen Sie wiederverwendbare Prompts mit {{variablen}} konsistent aus.", description: "Erkennt benannte Platzhalter, setzt lokale variable=wert-Zeilen ein und lässt fehlende Werte sichtbar. Es wird kein Modell aufgerufen; Inhalt und sensible Daten müssen geprüft werden." },
    zh: { title: "提示词模板与变量填充器", short: "安全一致地填充包含 {{变量}} 的可复用提示词。", description: "识别命名占位符，根据本地“变量=值”行进行替换，并保留缺失项。工具不调用模型；请检查内容准确性和敏感数据。" },
  },
  "yerel-metin-ozetleyici": {
    de: { title: "Lokale Textzusammenfassung", short: "Extrahieren Sie wichtige Sätze anhand nachvollziehbarer Worthäufigkeit.", description: "Bewertet Sätze lokal nach Worthäufigkeit und gibt ausgewählte Originalsätze in Quellenreihenfolge zurück. Das Verfahren versteht Kontext nicht wie ein Mensch und kann wichtige Details übersehen." },
    zh: { title: "本地文本摘要器", short: "基于可解释词频提取重要原句。", description: "在本地按词频为句子评分，并按原文顺序返回所选句子。该方法不能像人一样理解语境，可能遗漏关键细节。" },
  },
  "json-schema-olusturucu": {
    de: { title: "JSON-Schema-Generator", short: "Leiten Sie aus Beispiel-JSON ein Draft-2020-12-Startschema ab.", description: "Erzeugt aus Objekten, Arrays und Grundtypen eines gültigen Beispiels ein editierbares Startschema. Optionale Felder, Formate und reale Varianten müssen anschließend modelliert werden." },
    zh: { title: "JSON Schema 生成器", short: "从示例 JSON 推断 Draft 2020-12 起始 Schema。", description: "根据有效示例中的对象、数组、字段和基本类型生成可编辑的起始 Schema。可选字段、格式和真实数据变体仍需进一步建模。" },
  },
  "gorsel-boyutlandirici": {
    de: { title: "Bildgrößen-Konverter", short: "Skalieren und konvertieren Sie PNG, JPG oder WebP mit erhaltenem Seitenverhältnis.", description: "Skaliert ein Bild lokal per Canvas bis 8192 Pixel und bietet Qualitätskontrolle für JPG/WebP. Die Ausgabe entsteht auf dem Gerät; professionelle Farbprofile und Metadaten bleiben nicht vollständig erhalten." },
    zh: { title: "图片尺寸调整器", short: "保持宽高比调整 PNG、JPG 或 WebP 尺寸并转换格式。", description: "使用 Canvas 在本地将单张图片调整到最高 8192 像素，并控制 JPG/WebP 质量。输出在设备上生成；专业色彩配置和元数据不会全部保留。" },
  },
  "dosya-hash-karsilastirici": {
    de: { title: "Datei-Hash-Rechner & Vergleich", short: "Berechnen und vergleichen Sie SHA-256 für eine oder zwei Dateien lokal.", description: "Erzeugt SHA-256-Digests per Web Crypto ohne Upload und vergleicht Dateien bytegenau. Ein gleicher Hash unterstützt Integritätsprüfungen, bestätigt aber weder Sicherheit noch Herkunft." },
    zh: { title: "文件哈希计算与比较器", short: "在本地计算并比较一个或两个文件的 SHA-256。", description: "使用 Web Crypto 无需上传即可生成 SHA-256，并逐字节比较文件。哈希一致有助于核对完整性，但不能证明安全性或来源。" },
  },
  "kredi-odeme-hesaplayici": {
    de: { title: "Kreditraten- & Rückzahlungsrechner", short: "Berechnen Sie gleichbleibende Raten aus Monatszins, Laufzeit und Gebühren.", description: "Berechnet mit der Annuitätenformel Monatsrate, Gesamtrückzahlung und einen Beispielplan. Kreditgeberspezifische Steuern, Versicherungen und Rundungen fehlen; es ist kein Angebot oder Finanzrat." },
    zh: { title: "贷款还款与分期计算器", short: "根据月利率、期限和费用计算等额还款情景。", description: "使用标准年金公式计算月供、总还款和示例计划。不含机构特定税费、保险和舍入规则；结果不是贷款报价或财务建议。" },
  },
  "tarih-farki-hesaplayici": {
    de: { title: "Datumsdifferenz-Rechner", short: "Berechnen Sie Tage, Wochen, ungefähre Jahre und Wochentage zwischen Daten.", description: "Vergleicht zwei Daten als UTC-Kalendertage, optional einschließlich beider Endpunkte. Feiertage und rechtliche Fristregeln sind nicht enthalten und müssen separat geprüft werden." },
    zh: { title: "日期差计算器", short: "计算两个日期间的天数、周数、约合年数和工作日。", description: "按 UTC 日历日比较两个日期，可选择包含起止日期。不包含公共假日和法律期限规则，需另行核验。" },
  },
  "ai-yanit-degerlendirme-rubrigi": {
    de: { title: "Bewertungsrubrik für KI-Antworten", short: "Erstellen Sie aufgabenspezifische Kriterien, Gewichte und vier Bewertungsstufen.", description: "Erzeugt eine wiederverwendbare Markdown-Rubrik und prüft die Gewichtssumme. Sie strukturiert menschliche Prüfung, bewertet Antworten aber nicht automatisch und garantiert keine Modellqualität." },
    zh: { title: "AI 回答评估量表", short: "创建任务特定标准、权重和四级人工评估量表。", description: "生成可复用 Markdown 量表并校验权重总和，用于规范人工评审；不会自动评分，也不保证模型质量。" },
  },
  "csp-olusturucu-denetleyici": {
    de: { title: "CSP-Generator & Prüfer", short: "Erzeugen Sie eine sichere CSP-Basis und prüfen Sie riskante Quellen.", description: "Analysiert CSP-Direktiven lokal und meldet fehlende Basisschutzwerte, Wildcards, HTTP, unsafe-eval und riskantes Inline-Script. Vor Durchsetzung muss jede Policy im Report-Only-Modus getestet werden." },
    zh: { title: "CSP 生成与审计器", short: "生成安全 CSP 起始策略并检查高风险来源。", description: "在本地分析 CSP 指令，报告缺失基线、通配符、HTTP、unsafe-eval 和危险内联脚本。正式强制前必须先用 Report-Only 模式测试。" },
  },
  "yaml-json-donusturucu": {
    de: { title: "YAML ↔ JSON-Konverter", short: "Konvertieren Sie YAML und JSON mit sicherem Parsing und klaren Fehlern.", description: "Wandelt YAML mit begrenzter Alias-Auflösung in JSON und gültiges JSON in lesbares YAML um. Benutzerdefinierte Tags werden nicht ausgeführt; Ausgaben müssen gegen das Zielschema geprüft werden." },
    zh: { title: "YAML ↔ JSON 转换器", short: "使用安全解析和清晰错误在 YAML 与 JSON 之间转换。", description: "将限制别名展开的 YAML 转换为 JSON，并把有效 JSON 转为可读 YAML。不会执行自定义标签；输出仍需按目标 Schema 核验。" },
  },
  "xml-bicimlendirici-dogrulayici": {
    de: { title: "XML-Formatierer & Validator", short: "Validieren, formatieren oder minimieren Sie XML lokal.", description: "Parst XML mit DOMParser, zeigt Syntaxfehler und erzeugt lesbare oder minimierte Ausgabe. XSD, externe Entitäten und XML-Signaturen werden nicht validiert." },
    zh: { title: "XML 格式化与验证器", short: "在本地验证、美化或压缩 XML。", description: "使用 DOMParser 解析 XML，显示语法错误并生成美化或压缩输出；不验证 XSD、外部实体或 XML 数字签名。" },
  },
  "json-flatten-unflatten": {
    de: { title: "JSON abflachen / wiederherstellen", short: "Wandeln Sie verschachteltes JSON verlustfrei in JSON-Pointer-Pfade um.", description: "Konvertiert Objekte und Arrays in RFC-6901-Pfade und baut sie wieder auf. Schlüssel-Escapes bleiben erhalten; widersprüchliche Pfade erzeugen verständliche Fehler." },
    zh: { title: "JSON 扁平化 / 还原", short: "把嵌套 JSON 无损转换为 JSON Pointer 路径并还原。", description: "在对象、数组与 RFC 6901 路径之间转换，保留键名转义，并对冲突路径给出明确错误。" },
  },
  "csv-tekil-satir-ayiklayici": {
    de: { title: "CSV-Deduplizierer", short: "Finden und entfernen Sie doppelte CSV-Zeilen anhand ausgewählter Spalten.", description: "Erkennt Trennzeichen, verarbeitet zitierte Felder und behält je nach Schlüsselspalten den ersten oder letzten Datensatz. Großschreibung und Leerraum sind explizite Optionen." },
    zh: { title: "CSV 去重与重复行查找", short: "按选定列查找并移除 CSV 重复行。", description: "识别分隔符、解析带引号字段，并按关键列保留首条或末条记录；大小写和空格归一化均为明确选项。" },
  },
  "url-sorgu-parametresi-analizoru": {
    de: { title: "URL-Query-Parameter-Analyse", short: "Prüfen Sie URL-Bestandteile, doppelte Parameter und Tracking-Tags.", description: "Zerlegt eine URL ohne Aufruf in Host, Pfad, Fragment und Parameter und meldet Duplikate, leere Werte und gängige Tracking-Felder." },
    zh: { title: "URL 查询参数分析器", short: "检查 URL 组成、重复参数与跟踪标签。", description: "无需访问目标即可拆分主机、路径、片段和查询参数，并报告重复键、空值及常见跟踪字段。" },
  },
  "html-varlik-kodlayici": {
    de: { title: "HTML-Entity-Encoder/Decoder", short: "Kodieren Sie HTML-Sonderzeichen oder dekodieren Sie Entities als Text.", description: "Konvertiert Sonderzeichen und numerische Unicode-Entities lokal. Dekodierte Ausgabe wird nicht als HTML ausgeführt; Encoding allein ist kein kontextabhängiger XSS-Schutz." },
    zh: { title: "HTML 实体编码 / 解码器", short: "编码 HTML 特殊字符或把实体解码为文本。", description: "在本地转换特殊字符与 Unicode 数字实体；解码结果不会作为 HTML 执行，编码本身也不是上下文感知的 XSS 防护。" },
  },
  "ip-cidr-alt-ag-hesaplayici": {
    de: { title: "IPv4-CIDR- & Subnetzrechner", short: "Berechnen Sie Netz, Broadcast, Hostbereich und verfügbare IPv4-Adressen.", description: "Berechnet für /0 bis /32 Netmask, Wildcard, Netzwerk, Broadcast und klassischen Hostbereich. IPv6, Routerregeln und Cloud-Reservierungen sind nicht enthalten." },
    zh: { title: "IPv4 CIDR 与子网计算器", short: "计算网络、广播、主机范围与可用 IPv4 地址。", description: "针对 /0 至 /32 计算掩码、反掩码、网络、广播和传统主机范围；不包含 IPv6、路由策略或云平台保留地址。" },
  },
  "robots-txt-olusturucu-denetleyici": {
    de: { title: "Robots.txt-Generator & Prüfer", short: "Analysieren Sie robots.txt-Gruppen, Konflikte und kritische Sperren.", description: "Prüft User-agent, Allow, Disallow, Sitemap und unbekannte Direktiven lokal. Tatsächliches Crawling und Indexierung müssen mit dem Live-System verifiziert werden." },
    zh: { title: "Robots.txt 生成与审计器", short: "分析 robots.txt 分组、冲突与关键抓取阻止。", description: "在本地检查 User-agent、Allow、Disallow、Sitemap 及未知指令；真实抓取和索引行为仍需在上线环境核验。" },
  },
  "hreflang-etiket-olusturucu": {
    de: { title: "Hreflang-Generator & Prüfer", short: "Erzeugen Sie reziproke Hreflang-Tags und Sitemap-Alternativen.", description: "Validiert Sprach-/Regionscodes und absolute HTTPS-URLs, meldet Duplikate und fehlendes x-default und erzeugt HTML- sowie Sitemap-Entwürfe." },
    zh: { title: "Hreflang 标签生成与审计器", short: "生成互相引用的 Hreflang 标签与 Sitemap 替代链接。", description: "验证语言地区代码与绝对 HTTPS URL，报告重复项或缺少 x-default，并生成 HTML 与 Sitemap 草稿。" },
  },
  "faq-json-ld-olusturucu": {
    de: { title: "FAQPage-JSON-LD-Generator", short: "Erzeugen Sie valides FAQPage-JSON-LD aus sichtbaren Fragen und Antworten.", description: "Konvertiert Frage-Antwort-Zeilen in Schema.org FAQPage und meldet leere oder doppelte Fragen. Markierter Inhalt muss auf der Seite sichtbar sein; Rich Results sind nicht garantiert." },
    zh: { title: "FAQPage JSON-LD 生成器", short: "根据页面可见问答生成有效 FAQPage JSON-LD。", description: "把问答行转换为 Schema.org FAQPage，并检查空白或重复问题；标记内容必须在页面可见，且不保证富媒体结果。" },
  },
  "utm-kampanya-url-olusturucu": {
    de: { title: "UTM-Kampagnen-URL-Generator", short: "Erstellen Sie konsistente Tracking-URLs mit Quelle, Medium und Kampagne.", description: "Fügt UTM-Werte sicher kodiert zu einer HTTP(S)-URL hinzu, erhält vorhandene Parameter und öffnet oder überträgt die Adresse nicht." },
    zh: { title: "UTM 营销 URL 生成器", short: "使用来源、媒介与活动字段生成一致的跟踪 URL。", description: "以安全编码向 HTTP(S) URL 添加 UTM 字段，保留现有参数，且不会打开地址或发送到分析服务。" },
  },
  "unicode-normalizasyon-inceleyici": {
    de: { title: "Unicode-Normalisierung & Zeichenprüfung", short: "Prüfen Sie Normalformen, Codepoints und unsichtbare Zeichen.", description: "Normalisiert nach NFC/NFD/NFKC/NFKD und zeigt Codepoints, kombinierende Zeichen sowie gängige unsichtbare und Bidi-Steuerzeichen. Visuelle Gleichheit wird nicht garantiert." },
    zh: { title: "Unicode 规范化与字符检查", short: "检查规范化形式、码点和不可见字符。", description: "支持 NFC/NFD/NFKC/NFKD，并显示码点、组合字符以及常见不可见和双向控制字符；不保证视觉等价。" },
  },
  "satir-siralayici-tekillestirici": {
    de: { title: "Zeilensortierer & Deduplizierer", short: "Sortieren Sie Zeilen sprachabhängig und entfernen Sie Duplikate kontrolliert.", description: "Sortiert mit Intl.Collator alphabetisch, natürlich numerisch oder rückwärts und bietet explizite Optionen für Leerraum und Groß-/Kleinschreibung." },
    zh: { title: "行排序与去重工具", short: "按语言规则排序行，并可控地移除空行或重复项。", description: "使用 Intl.Collator 进行字母、自然数字或逆序排序，并提供明确的空格和大小写选项。" },
  },
  "seo-slug-olusturucu": {
    de: { title: "SEO- & URL-Slug-Generator", short: "Erzeugen Sie stabile, kleingeschriebene und URL-sichere Slugs.", description: "Normalisiert Unicode, bildet deutsche und türkische Zeichen explizit ab und bewahrt nicht abbildbare Zeichen als Code-Tokens. Veröffentlichte URLs dürfen nicht automatisch geändert werden." },
    zh: { title: "SEO 与 URL Slug 生成器", short: "把标题转换为稳定、小写且 URL 安全的 Slug。", description: "规范化 Unicode，明确映射德语与土耳其语字符，并把无法映射的字符保留为编码 token；不应自动更改已发布 URL。" },
  },
  "kelime-sikligi-ngram-analizi": {
    de: { title: "Wortfrequenz- & N-Gramm-Analyse", short: "Finden Sie häufige Wörter, Bigramme und Trigramme lokal.", description: "Segmentiert sprachabhängig mit Intl.Segmenter und zählt ein- bis dreiwortige N-Gramme. Die Werte belegen weder Bedeutung noch SEO-Ranking." },
    zh: { title: "词频与 N-gram 分析", short: "在本地查找高频词、二元组与三元组。", description: "使用 Intl.Segmenter 按语言分词并统计一至三词 N-gram；结果不代表语义、质量或搜索排名。" },
  },
  "yuzde-degisim-hesaplayici": {
    de: { title: "Prozentänderungs-, Erhöhungs- & Anteilsrechner", short: "Berechnen Sie Änderung, Anteil und Zielerhöhung mit sichtbaren Formeln.", description: "Berechnet Prozentänderung, Prozentpunkte, Anteil am Ganzen und Zu-/Abschläge und warnt explizit bei null oder negativen Ausgangswerten." },
    zh: { title: "百分比变化、增减与占比计算器", short: "使用可见公式计算变化、占比与目标增幅。", description: "计算百分比变化、百分点、部分占整体比例及增减值，并明确提示零或负基准的数学限制。" },
  },
  "kdv-indirim-hesaplayici": {
    de: { title: "MwSt.-/Steuer- & Rabattrechner", short: "Berechnen Sie Netto, Steuer und aufeinanderfolgende Rabatte transparent.", description: "Verwendet einen eingegebenen Steuersatz für Brutto/Netto und wendet Rabatte nacheinander an. Es wählt keine Sätze und ist keine Steuer- oder Rechnungsberatung." },
    zh: { title: "增值税 / 税费与折扣计算器", short: "透明计算含税/未税价格和连续折扣。", description: "使用用户输入税率拆分净价与税额，并顺序应用多个折扣；不会选择法定税率，也不构成税务或开票建议。" },
  },
  "sure-mesai-hesaplayici": {
    de: { title: "Dauer-, Arbeitszeit- & Pausenrechner", short: "Berechnen Sie Brutto- und Nettozeit über Mitternacht und Pausen hinweg.", description: "Berechnet verstrichene Zeit zwischen zwei Datumswerten und zieht Pausen ab. Ohne Offset gilt die Browser-Zeitzone; Arbeitsrecht und Lohnregeln sind nicht enthalten." },
    zh: { title: "时长、工时与休息计算器", short: "计算跨夜和扣除休息后的总时长与净时长。", description: "计算两个日期时间之间的实际时长并扣除休息；没有时区偏移时使用浏览器本地时区，不包含劳动或工资规则。" },
  },
  "rastgele-secici-takim-karistirici": {
    de: { title: "Kryptografische Zufallsauswahl & Team-Mischer", short: "Mischen, wählen oder teilen Sie Listen mit Web Crypto.", description: "Verwendet kryptografischen Fisher-Yates-Zufall für Gewinner oder ausgeglichene Teams. Teilnahmeberechtigung, Fairness der Eingangsliste und Gewinnspielrecht werden nicht geprüft." },
    zh: { title: "加密随机选择与团队分组", short: "使用 Web Crypto 打乱列表、抽取条目或分组。", description: "使用加密随机 Fisher–Yates 算法生成获选者或均衡团队；不验证参与资格、输入公平性或抽奖法规。" },
  },
  "hatirlanabilir-parola-uretici": {
    de: { title: "Merkbarer Passphrase-Generator", short: "Erzeugen Sie lange Passphrasen aus lesbaren synthetischen Wörtern.", description: "Erstellt ohne externe Wortliste kryptografisch zufällige, aussprechbare Tokens. Entropie ist eine theoretische Obergrenze; eindeutige Nutzung und Passwortmanager bleiben empfohlen." },
    zh: { title: "易记 Passphrase 生成器", short: "使用 Web Crypto 和可读合成词生成长密码短语。", description: "无需外部词表即可生成加密随机、可发音的合成 token；熵值是理论上限，仍建议唯一使用并存入密码管理器。" },
  },
  "hmac-olusturucu-dogrulayici": {
    de: { title: "HMAC-Generator & Prüfer", short: "Erzeugen Sie HMAC-SHA-256/384/512 und vergleichen Sie optional einen erwarteten Digest lokal.", description: "Erstellt HMAC per Web Crypto und prüft einen optionalen erwarteten Wert mit längennormalisiertem Bytevergleich. JavaScript-Laufzeiten garantieren keine konstante Ausführungszeit. HMAC ist weder Verschlüsselung noch Identitätsnachweis oder öffentliche Signatur." },
    zh: { title: "HMAC 生成与验证器", short: "在本地生成 HMAC-SHA-256/384/512，并可比较预期摘要。", description: "使用 Web Crypto 生成 HMAC，并以长度归一的字节比较检查可选预期值；JavaScript 运行时不保证恒定执行时间。HMAC 不是加密、身份凭证或公钥签名。" },
  },
  "sri-butunluk-hash-uretici": {
    de: { title: "Subresource-Integrity-Hashgenerator", short: "Erzeugen Sie SRI-Werte für lokale Dateien oder exakten Text.", description: "Berechnet sha256/384/512-Base64 aus exakten Bytes. SRI erkennt spätere Ressourcenänderungen, beweist aber weder Sicherheit noch Urheberschaft des Originals." },
    zh: { title: "子资源完整性（SRI）哈希生成器", short: "为本地文件或精确文本生成 SRI 值。", description: "根据精确字节计算 sha256/384/512-Base64；SRI 可发现后续资源变化，但不能证明原始资源安全或归属正确。" },
  },
  "rag-parcalama-butcesi-planlayici": {
    de: { title: "RAG-Chunking- & Kontextbudget-Planer", short: "Planen Sie Dokument, Chunk, Überlappung, Treffer und Ausgabe gemeinsam.", description: "Schätzt Chunkzahl, doppelte Token, abgerufenen Kontext und Ausgaberest. Retrieval-Qualität, Tokenizer, Embeddings und Dokumentstruktur müssen empirisch getestet werden." },
    zh: { title: "RAG 分块与上下文预算规划器", short: "统一规划文档、分块、重叠、检索数量与输出预算。", description: "估算分块数、重复 token、检索上下文和剩余输出预算；检索质量、分词器、嵌入模型与文档结构仍需实验验证。" },
  },
  "prompt-enjeksiyon-on-taramasi": {
    de: { title: "Prompt-Injection-Risiko-Vorprüfung", short: "Finden Sie lokale Signale für Anweisungsüberschreibung, Geheimnisabfrage und Tool-Missbrauch.", description: "Meldet mit erklärbaren Regeln Rollenwechsel, Ignore-Anweisungen, Secret-/Systemprompt-Anfragen und kodierte Befehle. Es ist keine semantische Klassifizierung, Sandbox oder Jailbreak-Garantie." },
    zh: { title: "提示词注入风险预扫描", short: "在本地查找覆盖指令、索取秘密与滥用工具的信号。", description: "使用可解释规则报告角色切换、忽略既有指令、索取秘密/系统提示词及编码命令；不是语义分类、沙箱或越狱保证。" },
  },
  "prompt-test-vaka-matrisi": {
    de: { title: "Prompt-Testfall-Matrix", short: "Erstellen Sie Normal-, Grenz-, Missbrauchs- und Mehrdeutigkeitsfälle für Prompts.", description: "Erzeugt aus Aufgabe, Zielverhalten und Risiken einen wiederholbaren Matrixentwurf mit Erfolgskriterien und Prüfernotizen. Das Werkzeug ruft kein Modell auf, führt keine Tests aus und zertifiziert keine Sicherheit." },
    zh: { title: "提示词测试用例矩阵生成器", short: "为提示词构建正常、边界、滥用与歧义测试用例。", description: "根据任务、目标行为与风险生成可重复的矩阵草稿，分列展示成功标准和人工审核说明；不会调用模型、执行测试或提供安全认证。" },
  },
  "data-uri-donusturucu": {
    de: { title: "Data-URI-Encoder / Decoder", short: "Wandeln Sie Text oder kleine Dateien in Data-URIs um und dekodieren Sie deren Metadaten und Inhalt.", description: "Erzeugt und dekodiert Data-URIs bis 5 MB lokal mit Browser-APIs. Medientyp und Bytes werden angezeigt; ein Data-URI beweist weder Vertrauen, Unschädlichkeit noch einen korrekten MIME-Typ." },
    zh: { title: "Data URI 编码 / 解码器", short: "把文本或小文件转换为 Data URI，并解析其元数据与内容。", description: "使用浏览器 API 在本地生成或解析最大 5 MB 的 Data URI，并显示媒体类型与字节数；Data URI 不能证明来源可信、内容无害或 MIME 正确。" },
  },
  "http-guvenlik-basliklari-denetleyici": {
    de: { title: "HTTP-Sicherheitsheader-Prüfer", short: "Prüfen Sie eingefügte Antwortheader auf CSP, HSTS, nosniff, Referrer- und Berechtigungsrichtlinien.", description: "Analysiert rohe HTTP-Header lokal und meldet Duplikate oder Lücken bei CSP, HSTS, nosniff, Referrer-, Berechtigungs- und Framing-Schutz. Es sendet keine Anfrage und prüft weder TLS noch Live-Weiterleitungen." },
    zh: { title: "HTTP 安全响应头审计器", short: "检查粘贴的响应头中的 CSP、HSTS、nosniff、Referrer 与权限策略。", description: "在本地解析原始 HTTP 响应头，报告 CSP、HSTS、nosniff、Referrer、权限与防嵌入保护中的重复或缺失；不会发出请求，也不验证 TLS 或线上重定向。" },
  },
};

const categoryUseCases: Record<ToolCategory, Record<"de" | "zh", string[]>> = {
  prompt: { de: ["Prompts vor der Nutzung prüfen", "Teamvorlagen vereinheitlichen", "Unklare Anweisungen verbessern"], zh: ["使用前检查提示词", "统一团队模板", "改进含糊指令"] },
  text: { de: ["Redaktion und Überarbeitung", "Inhalte vor Veröffentlichung prüfen", "Wiederkehrende Textarbeit beschleunigen"], zh: ["编辑与修订", "发布前内容检查", "加速重复文本工作"] },
  data: { de: ["Entwicklungsdaten prüfen", "Formate sicher konvertieren", "Fehler lokal untersuchen"], zh: ["检查开发数据", "安全转换格式", "在本地排查错误"] },
  converter: { de: ["Dateien vor dem Teilen vorbereiten", "Lokale Formate konvertieren", "Upload-Risiken vermeiden"], zh: ["分享前准备文件", "本地转换格式", "避免上传风险"] },
  security: { de: ["Sensible Daten vorab prüfen", "Lokale Sicherheitsaufgaben", "Risiken transparent dokumentieren"], zh: ["预检查敏感数据", "本地安全任务", "透明记录风险"] },
  calculation: { de: ["Szenarien vergleichen", "Annahmen nachvollziehbar rechnen", "Ergebnisse exportieren und prüfen"], zh: ["比较不同情景", "透明计算假设", "导出并核验结果"] },
  general: { de: ["Alltagsdokumente vorbereiten", "Strukturierte Entwürfe erstellen", "Ausgaben lokal kontrollieren"], zh: ["准备日常文档", "创建结构化草稿", "在本地控制输出"] },
  ai: { de: ["Modellkontext planen", "KI-Anweisungen vorab prüfen", "Gesprächsdaten lokal vorbereiten"], zh: ["规划模型上下文", "预检查 AI 指令", "本地整理对话数据"] },
  codeSecurity: { de: ["Verdächtige Merkmale vorsortieren", "Code-Review vorbereiten", "Lokale Triage ohne Upload"], zh: ["初步筛选可疑特征", "准备代码审查", "无需上传的本地分诊"] },
};

const categorySteps: Record<ToolCategory, Record<"de" | "zh", string[]>> = {
  prompt: { de: ["Fügen Sie die zu prüfende Anweisung ein.", "Starten Sie die lokale Analyse und prüfen Sie Hinweise.", "Überarbeiten Sie den Prompt und kontrollieren Sie ihn erneut."], zh: ["输入要检查的指令。", "运行本地分析并查看提示。", "修改提示词后再次检查。"] },
  text: { de: ["Fügen Sie den Text ein oder laden Sie das Beispiel.", "Wählen Sie die gewünschte Verarbeitung und starten Sie sie.", "Prüfen und kopieren oder laden Sie die Ausgabe herunter."], zh: ["粘贴文本或加载示例。", "选择所需处理并运行。", "检查后复制或下载输出。"] },
  data: { de: ["Geben Sie Daten ein oder laden Sie ein sicheres Beispiel.", "Wählen Sie Modus und Optionen und starten Sie die Verarbeitung.", "Prüfen Sie Warnungen und exportieren Sie nur validierte Ergebnisse."], zh: ["输入数据或加载安全示例。", "选择模式与选项并运行处理。", "查看警告，仅导出已验证结果。"] },
  converter: { de: ["Wählen Sie eine unterstützte lokale Datei.", "Legen Sie Ausgabeformat und Optionen fest.", "Prüfen Sie Vorschau und Größe und laden Sie die neue Datei herunter."], zh: ["选择受支持的本地文件。", "设置输出格式和选项。", "检查预览和大小后下载新文件。"] },
  security: { de: ["Geben Sie ausschließlich Daten ein, die Sie prüfen dürfen.", "Führen Sie die lokale Analyse oder Bereinigung aus.", "Bewerten Sie Grenzen und prüfen Sie kritische Ergebnisse unabhängig."], zh: ["只输入您有权检查的数据。", "运行本地分析或清理。", "了解限制并独立核验关键结果。"] },
  calculation: { de: ["Geben Sie Werte und Annahmen ein.", "Prüfen Sie Formel, Einheit und Rundung.", "Vergleichen Sie Szenarien und verifizieren Sie wichtige Entscheidungen."], zh: ["输入数值和假设。", "检查公式、单位和舍入。", "比较情景并核验重要决策。"] },
  general: { de: ["Füllen Sie die erforderlichen Felder aus.", "Erzeugen Sie den lokalen Entwurf.", "Prüfen, bearbeiten und exportieren Sie das Ergebnis."], zh: ["填写所需字段。", "生成本地草稿。", "检查、修改并导出结果。"] },
  ai: { de: ["Fügen Sie Prompt, Budget oder Gesprächsdaten ein.", "Starten Sie die regelbasierte lokale Prüfung.", "Prüfen Sie Vorschläge im Kontext, bevor Sie sie verwenden."], zh: ["输入提示词、预算或对话数据。", "运行基于规则的本地检查。", "结合语境审查建议后再使用。"] },
  codeSecurity: { de: ["Wählen Sie eine Datei oder fügen Sie autorisierten Inhalt ein.", "Starten Sie die zeitlich und größenmäßig begrenzte lokale Vorprüfung.", "Prüfen Sie Befunde manuell oder mit einem qualifizierten Sicherheitssystem."], zh: ["选择文件或粘贴获授权内容。", "运行有时间和大小限制的本地预扫描。", "手动或借助专业安全系统复核发现。"] },
};

export function localizeTool(base: BaseTool): Tool {
  const pair = translations[base.slug];
  if (!pair) throw new Error(`Missing German/Chinese translation for tool: ${base.slug}`);
  const category = base.category;
  return {
    ...base,
    title: { ...base.title, de: pair.de.title, zh: pair.zh.title },
    short: { ...base.short, de: pair.de.short, zh: pair.zh.short },
    description: { ...base.description, de: pair.de.description, zh: pair.zh.description },
    useCases: { ...base.useCases, de: categoryUseCases[category].de, zh: categoryUseCases[category].zh },
    steps: { ...base.steps, de: categorySteps[category].de, zh: categorySteps[category].zh },
  } satisfies Record<keyof Tool, unknown> as Tool;
}

export function localeName(locale: Locale) {
  return { tr: "Türkçe", en: "English", de: "Deutsch", zh: "简体中文" }[locale];
}
