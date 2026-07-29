import type { Locale } from "./site";
import type { ArticleSection, Post } from "./posts";
import type { LocalizedGuide } from "./localized-guides";

type L = Record<Locale, string>;
type Guide = {
  slug: string;
  relatedTools: string[];
  title: L;
  excerpt: L;
  category: L;
  outcome: L;
  boundary: L;
  checks: Record<Locale, string[]>;
};

const l = (tr: string, en: string, de: string, zh: string): L => ({ tr, en, de, zh });

const guides: Guide[] = [
  {
    slug: "prompt-yonetisimi-degerlendirme-rehberi",
    relatedTools: ["talimat-cakisma-denetleyici", "few-shot-kapsama-analizoru", "degerlendirme-veri-seti-sablonu", "ajan-arac-yetki-matrisi"],
    title: l("Üretim Promptları İçin Yönetişim ve Değerlendirme Rehberi", "Governance and Evaluation for Production Prompts", "Governance und Evaluation für produktive Prompts", "生产提示词的治理与评估指南"),
    excerpt: l("Talimat çatışmalarını, örnek kapsamını, değerlendirme vakalarını ve ajan yetkilerini tek bir denetlenebilir süreçte yönetin.", "Manage instruction conflicts, example coverage, evaluation cases, and agent permissions in one auditable process.", "Verwalten Sie Anweisungskonflikte, Beispielabdeckung, Evaluationsfälle und Agentenrechte in einem prüfbaren Prozess.", "在一个可审计流程中管理指令冲突、示例覆盖、评估用例和智能体权限。"),
    category: l("Prompt yönetişimi", "Prompt governance", "Prompt-Governance", "提示词治理"),
    outcome: l("Bir müşteri destek ajanının sistem, politika ve kullanıcı talimatlarını öncelik sırasına koymak; iyi, sınır ve olumsuz vakalardan oluşan veri setiyle her sürümü tekrar sınamak.", "Order system, policy, and user instructions for a support agent, then retest every release with happy-path, boundary, and negative cases.", "System-, Richtlinien- und Nutzeranweisungen eines Support-Agenten ordnen und jede Version mit Normal-, Grenz- und Negativfällen erneut testen.", "为客服智能体排列系统、策略和用户指令的优先级，并用正常、边界和负面用例复测每个版本。"),
    boundary: l("Kural tabanlı ön kontrol, bir modelin gerçek davranışını kanıtlamaz. Yetki matrisi de tarayıcı veya sunucu izinlerinin yerine geçmez; uygulama katmanında ayrıca zorlanmalıdır.", "A rule-based pre-check does not prove actual model behavior. A permission matrix does not replace browser or server enforcement and must be implemented separately.", "Eine regelbasierte Vorprüfung beweist kein reales Modellverhalten. Eine Berechtigungsmatrix ersetzt keine technische Durchsetzung.", "规则预检不能证明模型的真实行为；权限矩阵也不能替代浏览器或服务器中的技术强制。"),
    checks: {
      tr: ["Her talimatın kaynağı ve önceliği yazılı.", "En az bir sınır ve bir kötüye kullanım vakası var.", "Araç çağrıları varsayılan olarak en az yetkili.", "Sürüm farkı ve kabul eşiği kaydediliyor."],
      en: ["Every instruction has a source and priority.", "At least one boundary and misuse case exists.", "Tool calls are least-privileged by default.", "Version differences and acceptance thresholds are recorded."],
      de: ["Quelle und Priorität jeder Anweisung sind dokumentiert.", "Mindestens ein Grenz- und Missbrauchsfall ist vorhanden.", "Werkzeugaufrufe haben minimale Rechte.", "Versionsunterschiede und Schwellenwerte sind protokolliert."],
      zh: ["记录每条指令的来源和优先级。", "至少包含一个边界和滥用用例。", "工具调用默认遵循最小权限。", "记录版本差异和验收阈值。"],
    },
  },
  {
    slug: "gizlilik-saklama-anonimlestirme-rehberi",
    relatedTools: ["veri-saklama-suresi-planlayici", "anonimlestirme-risk-on-kontrolu", "cookie-ozellik-denetleyici", "kvkk-veri-maskeleyici"],
    title: l("Veri Saklama ve Anonimleştirme İçin Uygulamalı Gizlilik Rehberi", "A Practical Privacy Guide to Retention and Anonymisation", "Praxisleitfaden für Aufbewahrung und Anonymisierung", "数据保留与匿名化实用隐私指南"),
    excerpt: l("Hangi verinin neden tutulduğunu belgeleyin, silme tarihini görünür kılın ve yeniden tanımlama riskini maskelemeden önce değerlendirin.", "Document why data is retained, make deletion dates visible, and assess re-identification risk before treating masking as anonymisation.", "Dokumentieren Sie Zweck und Löschdatum und bewerten Sie Re-Identifikationsrisiken vor einer Anonymisierungsbehauptung.", "记录保留数据的目的和删除日期，并在将掩码视为匿名化之前评估重新识别风险。"),
    category: l("Gizlilik mühendisliği", "Privacy engineering", "Privacy Engineering", "隐私工程"),
    outcome: l("Bir destek kaydındaki e-posta, cihaz kimliği ve serbest metin alanlarını sınıflandırmak; gerekçe, süre, silme tetikleyicisi ve doğrulama sahibini belirlemek.", "Classify email, device identifiers, and free text in a support record, then assign purpose, duration, deletion trigger, and verification owner.", "E-Mail, Gerätekennung und Freitext eines Supportfalls klassifizieren und Zweck, Dauer, Löschtrigger sowie Prüfer festlegen.", "对支持记录中的邮箱、设备标识和自由文本进行分类，并指定目的、期限、删除触发器和核验负责人。"),
    boundary: l("Bu araçlar hukuki görüş veya anonimlik garantisi vermez. Küçük gruplar, nadir özellikler ve dış veri kümeleri birlikte kullanıldığında maskelenmiş kayıtlar yeniden tanımlanabilir.", "These tools provide neither legal advice nor an anonymity guarantee. Small groups, rare attributes, and outside datasets can re-identify masked records.", "Diese Werkzeuge sind keine Rechtsberatung und garantieren keine Anonymität. Kleine Gruppen und externe Daten können maskierte Datensätze re-identifizieren.", "这些工具不构成法律意见，也不保证匿名；小群体、稀有属性和外部数据集可能重新识别掩码记录。"),
    checks: {
      tr: ["Her veri sınıfının açık amacı var.", "Süre sonunda otomatik veya sahipli silme adımı var.", "Doğrudan ve dolaylı tanımlayıcılar ayrı inceleniyor.", "Cookie güvenlik özellikleri bağlama göre doğrulanıyor."],
      en: ["Every data class has an explicit purpose.", "An owned or automated deletion step exists.", "Direct and indirect identifiers are reviewed separately.", "Cookie security attributes are verified in context."],
      de: ["Jede Datenklasse hat einen eindeutigen Zweck.", "Ein verantworteter oder automatisierter Löschschritt existiert.", "Direkte und indirekte Identifikatoren werden getrennt geprüft.", "Cookie-Attribute werden im Kontext verifiziert."],
      zh: ["每类数据都有明确目的。", "存在自动或指定负责人的删除步骤。", "分别审查直接和间接标识符。", "结合实际环境核验 Cookie 安全属性。"],
    },
  },
  {
    slug: "api-teslim-guvenlik-kontrol-listesi",
    relatedTools: ["graphql-degisken-dogrulayici", "http-cache-control-olusturucu", "content-disposition-olusturucu", "cors-politikasi-denetleyici", "oauth-yonlendirme-uri-denetleyici"],
    title: l("API Teslimi İçin Cache, CORS, OAuth ve İndirme Güvenliği", "API Delivery Security: Cache, CORS, OAuth, and Downloads", "Sichere API-Auslieferung mit Cache, CORS, OAuth und Downloads", "API 交付安全：缓存、CORS、OAuth 与下载"),
    excerpt: l("GraphQL değişkenlerinden indirme başlıklarına kadar istemci-sunucu sözleşmesini yayın öncesi açıklanabilir kontrollerle sınayın.", "Test the client-server contract from GraphQL variables to download headers with explainable pre-release checks.", "Prüfen Sie den Client-Server-Vertrag von GraphQL-Variablen bis Download-Headern nachvollziehbar vor dem Release.", "从 GraphQL 变量到下载响应头，以可解释的发布前检查验证客户端与服务器契约。"),
    category: l("API güvenliği", "API security", "API-Sicherheit", "API 安全"),
    outcome: l("Bir rapor indirme uç noktasında değişken sözleşmesini doğrulamak, hassas yanıtı önbellekten korumak, güvenli dosya adı üretmek ve yalnızca izinli origin ile tam OAuth dönüş URL’sini kabul etmek.", "Validate a report endpoint’s variables, prevent sensitive caching, produce a safe filename, and allow only approved origins and exact OAuth redirect URIs.", "Variablen eines Report-Endpunkts prüfen, sensible Caches verhindern, sicheren Dateinamen erzeugen und nur erlaubte Origins sowie exakte OAuth-Redirects akzeptieren.", "验证报告端点变量、防止敏感响应被缓存、生成安全文件名，并只允许批准的来源和完全匹配的 OAuth 重定向 URI。"),
    boundary: l("Metin tabanlı denetim gerçek HTTP isteği göndermez, DNS veya TLS kontrol etmez ve kimlik doğrulamaz. Üretim davranışı entegrasyon testi, tarayıcı testi ve sunucu günlükleriyle doğrulanmalıdır.", "Text inspection sends no HTTP request, checks neither DNS nor TLS, and performs no authentication. Verify production behavior with integration tests, browser tests, and server logs.", "Textprüfung sendet keine HTTP-Anfrage, prüft weder DNS noch TLS und authentifiziert nicht. Produktionsverhalten braucht Integrations- und Browsertests.", "文本检查不会发送 HTTP 请求，也不会验证 DNS、TLS 或身份；生产行为必须通过集成测试、浏览器测试和服务器日志核验。"),
    checks: {
      tr: ["GraphQL değişkenleri tanımlı ad ve türlerle eşleşiyor.", "Hassas yanıtlar paylaşımlı önbelleğe girmiyor.", "Dosya adı CR/LF ve yol ayraçlarından arındırılıyor.", "Credential kullanan CORS politikası joker origin içermiyor.", "OAuth dönüş adresi tam eşleşiyor."],
      en: ["GraphQL variables match declared names and types.", "Sensitive responses avoid shared caches.", "Filenames reject CR/LF and path separators.", "Credentialed CORS never uses a wildcard origin.", "OAuth redirects match exactly."],
      de: ["GraphQL-Variablen entsprechen Namen und Typen.", "Sensible Antworten meiden gemeinsame Caches.", "Dateinamen enthalten kein CR/LF oder Pfadtrenner.", "CORS mit Credentials nutzt keinen Wildcard-Origin.", "OAuth-Redirects stimmen exakt überein."],
      zh: ["GraphQL 变量与声明的名称和类型一致。", "敏感响应不进入共享缓存。", "文件名拒绝 CR/LF 与路径分隔符。", "携带凭据的 CORS 不使用通配来源。", "OAuth 重定向地址完全匹配。"],
    },
  },
  {
    slug: "csv-json-veri-yeniden-sekillendirme-rehberi",
    relatedTools: ["json-anahtar-esleme-donusturucu", "json-dizi-sirala-filtrele", "csv-pivot-ozeti", "csv-uzun-genis-donusturucu", "csv-sabit-genislik-donusturucu"],
    title: l("CSV ve JSON Verisini Kayıpsız Yeniden Şekillendirme", "Reshape CSV and JSON Data Without Silent Loss", "CSV- und JSON-Daten ohne stillen Verlust umformen", "无静默丢失地重塑 CSV 与 JSON 数据"),
    excerpt: l("Anahtar eşleme, filtreleme, pivot, uzun-geniş dönüşümü ve sabit genişlik aktarımını denetlenebilir bir veri hattında birleştirin.", "Combine key mapping, filtering, pivoting, long-wide conversion, and fixed-width exchange in an auditable data pipeline.", "Verbinden Sie Key-Mapping, Filter, Pivot, Long-Wide-Umformung und Fixed-Width-Austausch in einer prüfbaren Pipeline.", "在可审计数据管道中组合键映射、筛选、透视、长宽转换和定宽交换。"),
    category: l("Veri kalitesi", "Data quality", "Datenqualität", "数据质量"),
    outcome: l("Bir satış CSV’sini bölge ve aya göre özetlemek, uzun tabloyu rapor matrisine çevirmek, alan adlarını hedef sözleşmeye eşlemek ve satır sayısı ile toplamları her aşamada karşılaştırmak.", "Summarise sales CSV by region and month, turn long rows into a report matrix, map fields to a target contract, and compare row counts and totals after every step.", "Verkaufs-CSV nach Region und Monat zusammenfassen, Long-Daten in Berichtsmatrix umformen, Felder mappen und Zeilenzahl sowie Summen je Schritt vergleichen.", "按地区和月份汇总销售 CSV，将长表转换为报告矩阵，把字段映射到目标契约，并在每一步核对行数和总计。"),
    boundary: l("Tarayıcı içi dönüştürme girdiyi dışarı göndermez; ancak yanlış ayraç, ondalık biçimi, tarih yorumu veya yinelenen anahtar sessiz veri kaybına yol açabilir. Ham dosyayı değiştirmeyin.", "Browser processing keeps input local, but a wrong delimiter, decimal convention, date interpretation, or duplicate key can still cause silent loss. Preserve the raw file.", "Lokale Verarbeitung verhindert Uploads, doch falsche Trennzeichen, Dezimalformate, Datumsdeutung oder doppelte Schlüssel können Daten verlieren. Rohdatei behalten.", "浏览器内处理不会上传输入，但错误分隔符、小数格式、日期解释或重复键仍可能造成静默丢失；请保留原始文件。"),
    checks: {
      tr: ["Ham dosya salt okunur kopya olarak saklanıyor.", "Ayraç, kodlama ve ondalık biçimi açıkça seçiliyor.", "Her adımda satır, sütun ve boş değer sayısı karşılaştırılıyor.", "Pivot toplamı kaynak toplamla uzlaştırılıyor.", "Anahtar eşleme çakışmaları hata veriyor."],
      en: ["The raw file is preserved read-only.", "Delimiter, encoding, and decimal conventions are explicit.", "Rows, columns, and missing values are reconciled at each step.", "Pivot totals reconcile with source totals.", "Key mapping collisions fail visibly."],
      de: ["Rohdatei bleibt schreibgeschützt erhalten.", "Trennzeichen, Kodierung und Dezimalformat sind explizit.", "Zeilen, Spalten und Leerwerte werden je Schritt abgeglichen.", "Pivot-Summen stimmen mit der Quelle überein.", "Mapping-Konflikte erzeugen sichtbare Fehler."],
      zh: ["以只读副本保留原始文件。", "明确分隔符、编码和小数约定。", "每一步核对行数、列数和缺失值。", "透视总计与源数据一致。", "键映射冲突会明确报错。"],
    },
  },
  {
    slug: "kanit-odakli-arastirma-ve-guncellik-rehberi",
    relatedTools: ["pico-arastirma-sorusu-olusturucu", "boolean-arama-stratejisi-olusturucu", "iddia-kanit-boslugu-inceleyici", "kaynak-guncellik-takipcisi"],
    title: l("Kanıt Odaklı Araştırma: Sorudan Güncellik Takibine", "Evidence-Led Research: From Question to Freshness Review", "Evidenzbasierte Recherche von der Frage bis zur Aktualitätsprüfung", "循证研究：从问题构建到时效复核"),
    excerpt: l("PICO ile araştırılabilir soru kurun, Boolean sorguyu belgelendirin, iddia-kanıt boşluklarını bulun ve kaynakların güncelliğini izleyin.", "Build a researchable PICO question, document Boolean searches, find claim-evidence gaps, and track source freshness.", "Formulieren Sie eine PICO-Frage, dokumentieren Sie Boolesche Suchen, finden Sie Evidenzlücken und überwachen Sie Aktualität.", "用 PICO 构建可研究问题，记录布尔检索，识别主张与证据缺口，并跟踪来源时效。"),
    category: l("Araştırma yöntemi", "Research method", "Forschungsmethodik", "研究方法"),
    outcome: l("Belirsiz bir sağlık teknolojisi sorusunu PICO öğelerine ayırmak, birden fazla veri tabanı için arama blokları hazırlamak, her iddiayı kaynağa bağlamak ve güncelleme tarihini planlamak.", "Break an ambiguous health-technology question into PICO elements, prepare search blocks for multiple databases, link every claim to evidence, and schedule freshness review.", "Eine unklare Health-Tech-Frage in PICO zerlegen, Suchblöcke für mehrere Datenbanken erstellen, Aussagen belegen und Aktualitätsprüfung planen.", "把模糊的健康技术问题拆分为 PICO 要素，为多个数据库准备检索块，将每项主张关联到证据，并安排时效复核。"),
    boundary: l("Araçlar yayın veri tabanlarını aramaz, kaynağın kalitesini otomatik doğrulamaz ve uzman sistematik incelemesinin yerini tutmaz. Arama dizimi her veri tabanında ayrıca uyarlanmalıdır.", "The tools do not search publication databases, automatically validate source quality, or replace an expert systematic review. Query syntax must be adapted per database.", "Die Werkzeuge durchsuchen keine Datenbanken, bewerten Quellen nicht automatisch und ersetzen kein systematisches Review. Suchsyntax muss je Datenbank angepasst werden.", "工具不会搜索文献数据库、自动验证来源质量，也不能替代专家系统综述；检索语法必须按数据库调整。"),
    checks: {
      tr: ["Soru, ölçülebilir öğelere ayrılmış.", "Arama blokları ve hariç tutmalar kaydedilmiş.", "Her önemli iddianın doğrudan kaynağı var.", "Kaynağın yayın ve son inceleme tarihi ayrı tutuluyor.", "Sonuç bulunamaması da raporlanıyor."],
      en: ["The question is split into measurable elements.", "Search blocks and exclusions are recorded.", "Every consequential claim has a direct source.", "Publication and last-review dates are separate.", "No-result searches are also reported."],
      de: ["Die Frage ist in messbare Elemente zerlegt.", "Suchblöcke und Ausschlüsse sind dokumentiert.", "Jede wichtige Aussage hat eine direkte Quelle.", "Publikations- und Prüfdatum sind getrennt.", "Ergebnislose Suchen werden ebenfalls berichtet."],
      zh: ["问题已拆分为可测量要素。", "记录检索块和排除条件。", "每项重要主张都有直接来源。", "区分发布日期与最近复核日期。", "也报告无结果的检索。"],
    },
  },
];

function sections(locale: Locale, guide: Guide): ArticleSection[] {
  const headings = {
    tr: ["Önce karar sorusunu yazın", "Veriyi ve yöntemi hazırlayın", "Adım adım uygulayın", "Sonucu karşı sınayın", "Kayıt, sınır ve sonraki inceleme"],
    en: ["Write the decision question first", "Prepare data and method", "Run the workflow step by step", "Challenge the result", "Record, limits, and next review"],
    de: ["Entscheidungsfrage zuerst formulieren", "Daten und Methode vorbereiten", "Ablauf Schritt für Schritt ausführen", "Ergebnis kritisch prüfen", "Protokoll, Grenzen und nächste Prüfung"],
    zh: ["先写明决策问题", "准备数据与方法", "逐步执行工作流", "反向检验结果", "记录、边界与下次复核"],
  }[locale];

  const common = {
    tr: [
      `Başarılı bir çalışma “hangi düğmeye basacağım?” sorusuyla değil, hangi kararın hangi kanıtla verileceğiyle başlar. Bu rehberdeki hedef şudur: ${guide.outcome.tr} Kabul ölçütünü, sorumlu kişiyi ve durdurma koşulunu girdi hazırlanırken yazın. Böylece sonucun cazip görünmesi yöntemin önüne geçmez.`,
      `Örnekleri sentetik veya açıkça kullanım izni olan verilerden seçin. Ham veriyi değiştirmeden saklayın; kolon, alan, birim, dil, tarih ve eksik değer kurallarını ayrı bir veri sözlüğünde belirtin. ${guide.boundary.tr}`,
      `İşlemleri küçük ve geri alınabilir adımlara ayırın. Her araçtan önce beklenen girdiyi, araçtan sonra oluşması gereken şemayı ve hata durumunda yapılacak işlemi yazın. ${guide.relatedTools.join(", ")} araçlarını bir zincire eklerken önce tekil örneklerle, sonra sınır vakaları ve küçük toplu veriyle sınayın.`,
      `Doğrulama yalnızca “çıktı üretildi” demek değildir. Kaynak ve çıktı satır sayılarını, toplamları, boş değerleri, yinelenenleri ve değişen alanları karşılaştırın. İyi örneğin yanında boş, bozuk, çok uzun, beklenmeyen Unicode içeren ve kasıtlı olarak çelişkili girdiler kullanın.`,
      `Son kayıtta tarih, araç sürümü, girdi şeması, varsayımlar, bilinen sınırlar, kabul edilen istisnalar ve insan onayı bulunmalıdır. Çıktı hukuki, güvenlik, tıbbi veya mali etkiliyse yetkili uzmanın ve güncel birincil kaynağın bağımsız kontrolünü planlayın.`,
    ],
    en: [
      `Reliable work starts with the decision and evidence required—not the button to press. The outcome here is: ${guide.outcome.en} Define acceptance criteria, owner, and stop conditions while preparing input so an attractive output cannot outrun the method.`,
      `Use synthetic data or material whose reuse rights are clear. Preserve an unchanged raw copy and document fields, units, language, dates, and missing-value rules in a data dictionary. ${guide.boundary.en}`,
      `Split work into small, reversible steps. Before each tool, state the expected input; after it, state the required output schema and failure response. Test ${guide.relatedTools.join(", ")} with one example, boundary cases, and a small batch before scaling.`,
      `Validation means more than receiving output. Reconcile source and output row counts, totals, missing values, duplicates, and changed fields. Test empty, malformed, oversized, unexpected-Unicode, and deliberately conflicting inputs alongside the happy path.`,
      `The final record should include date, tool version, input schema, assumptions, known limits, accepted exceptions, and human approval. For legal, security, medical, or financial impact, schedule independent review by a qualified person using current primary sources.`,
    ],
    de: [
      `Zuverlässige Arbeit beginnt mit Entscheidung und Beleg, nicht mit einer Schaltfläche. Das Ziel lautet: ${guide.outcome.de} Abnahmekriterien, Verantwortung und Stoppbedingungen werden bereits bei der Eingabe festgelegt.`,
      `Nutzen Sie synthetische Daten oder Inhalte mit eindeutigem Nutzungsrecht. Bewahren Sie eine unveränderte Rohkopie auf und dokumentieren Sie Felder, Einheiten, Sprache, Datum sowie fehlende Werte. ${guide.boundary.de}`,
      `Zerlegen Sie die Arbeit in kleine, reversible Schritte. Vor jedem Werkzeug werden erwartete Eingabe, Ausgabeschema und Fehlerreaktion festgelegt. Testen Sie ${guide.relatedTools.join(", ")} zuerst einzeln, dann mit Grenzfällen und einem kleinen Batch.`,
      `Validierung ist mehr als eine erzeugte Ausgabe. Gleichen Sie Zeilen, Summen, Leerwerte, Duplikate und geänderte Felder ab. Prüfen Sie leere, fehlerhafte, übergroße, ungewöhnliche Unicode- und bewusst widersprüchliche Eingaben.`,
      `Das Abschlussprotokoll enthält Datum, Werkzeugversion, Eingabeschema, Annahmen, Grenzen, akzeptierte Ausnahmen und menschliche Freigabe. Rechtliche, sicherheitskritische, medizinische oder finanzielle Folgen erfordern unabhängige Fachprüfung und aktuelle Primärquellen.`,
    ],
    zh: [
      `可靠工作先明确决策和所需证据，而不是先寻找按钮。本指南的目标是：${guide.outcome.zh} 在准备输入时就定义验收标准、负责人和停止条件，避免“看起来不错”的输出掩盖方法缺陷。`,
      `只使用合成数据或重用权明确的材料。保留不变的原始副本，并在数据字典中记录字段、单位、语言、日期和缺失值规则。${guide.boundary.zh}`,
      `把工作拆分为小而可撤销的步骤。每个工具运行前写明预期输入，运行后写明所需输出结构和失败处理。先用单个示例测试 ${guide.relatedTools.join("、")}，再测试边界情况和小批量数据。`,
      `验证不等于“成功生成输出”。需要核对源数据与输出的行数、总计、缺失值、重复项和变更字段，并测试空值、格式错误、超长内容、异常 Unicode 和刻意冲突的输入。`,
      `最终记录应包含日期、工具版本、输入结构、假设、已知边界、接受的例外和人工批准。涉及法律、安全、医疗或财务影响时，应由合格人员结合最新一手来源独立复核。`,
    ],
  }[locale];

  return headings.map((heading, index) => ({
    heading,
    paragraphs: [common[index], index === 0 ? guide.excerpt[locale] : index === 4 ? guide.boundary[locale] : guide.outcome[locale]],
    bullets: guide.checks[locale],
  }));
}

export const precisionPosts: Post[] = guides.map((guide) => ({
  slug: guide.slug,
  relatedTools: guide.relatedTools,
  date: "2026-07-29",
  updated: "2026-07-29",
  readTime: { tr: "16 dk", en: "15 min" },
  title: { tr: guide.title.tr, en: guide.title.en },
  excerpt: { tr: guide.excerpt.tr, en: guide.excerpt.en },
  description: { tr: `${guide.excerpt.tr} Uygulama adımları, hata yolu, doğrulama ölçütleri ve güven sınırlarıyla özgün rehber.`, en: `${guide.excerpt.en} An original guide with implementation steps, failure paths, verification criteria, and trust boundaries.` },
  category: { tr: guide.category.tr, en: guide.category.en },
  visualSuggestion: { tr: "Karar sorusundan denetlenebilir çıktıya uzanan, hata ve insan onayı kapıları bulunan yerel akış.", en: "A local flow from decision question to auditable output, including failure and human-approval gates." },
  sections: { tr: sections("tr", guide), en: sections("en", guide) },
}));

export const precisionLocalizedGuides: LocalizedGuide[] = guides.map((guide) => ({
  slug: guide.slug,
  relatedTools: guide.relatedTools,
  date: "2026-07-29",
  updated: "2026-07-29",
  copy: {
    de: { title: guide.title.de, excerpt: guide.excerpt.de, description: `${guide.excerpt.de} Mit Ablauf, Fehlerpfaden, Prüfkriterien und klaren Vertrauensgrenzen.`, category: guide.category.de, readTime: "15 Min.", sections: sections("de", guide) },
    zh: { title: guide.title.zh, excerpt: guide.excerpt.zh, description: `${guide.excerpt.zh} 包含执行步骤、失败路径、核验标准和清晰的信任边界。`, category: guide.category.zh, readTime: "约 15 分钟", sections: sections("zh", guide) },
  },
}));
