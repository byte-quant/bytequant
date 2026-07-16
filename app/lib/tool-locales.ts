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
