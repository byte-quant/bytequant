import type { Locale } from "./site";

type StandardSection = {
  title: string;
  paragraphs: string[];
  checks: string[];
};

type StandardSource = { label: string; href: string };

export type PublishingStandardsCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  breadcrumb: string;
  evidenceLabel: string;
  evidence: Array<{ value: string; label: string; detail: string }>;
  sections: StandardSection[];
  sourcesTitle: string;
  sourcesIntro: string;
  sources: StandardSource[];
  reportTitle: string;
  reportBody: string;
  reportCta: string;
};

const sharedSources: StandardSource[] = [
  { label: "Google Search — helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
  { label: "Google Publisher Policies", href: "https://support.google.com/publisherpolicies/answer/10502938?hl=en" },
  { label: "Google AdSense — site approval guidance", href: "https://support.google.com/adsense/answer/81904?hl=en" },
  { label: "Google — data use on partner sites", href: "https://policies.google.com/technologies/partner-sites" },
  { label: "ByteQuant source and release history", href: "https://github.com/byte-quant/bytequant" },
  { label: "ByteQuant responsible security reporting", href: "https://github.com/byte-quant/bytequant/blob/main/SECURITY.md" },
];

export const publishingStandards: Record<Locale, PublishingStandardsCopy> = {
  tr: {
    eyebrow: "YAYINCILIK VE GÜVEN STANDARTLARI",
    title: "Ne yayımladığımızı, nasıl doğruladığımızı ve reklamı içerikten nasıl ayırdığımızı açıklıyoruz",
    intro: "Bu sayfa ByteQuant araçları, rehberleri ve ürün açıklamaları için sahiplik, üretim, kaynak, düzeltme, reklam ve gizlilik kurallarını tek yerde toplar. Amaç bir rozet göstermek değil; denetlenebilir bir yayın süreci sunmaktır.",
    updated: "Son doğrulama: 8 Ağustos 2026",
    breadcrumb: "Yayın ilkeleri",
    evidenceLabel: "DOĞRULANABİLİR YAYINCI KANITLARI",
    evidence: [
      { value: "317", label: "benzersiz araç", detail: "Her biri yöntem, sınır ve kullanım adımlarıyla yayımlanır." },
      { value: "4", label: "tam arayüz dili", detail: "Türkçe, İngilizce, Almanca ve Basitleştirilmiş Çince." },
      { value: "MIT", label: "açık kaynak lisansı", detail: "Kaynak, sürüm geçmişi ve üretim bağımlılıkları denetlenebilir." },
      { value: "0", label: "araç girdisi sunucuya", detail: "Temel araç girdileri etkin tarayıcı sekmesinde işlenir." },
    ],
    sections: [
      { title: "1. Yayıncı kimliği ve sorumluluk", paragraphs: ["ByteQuant, bytequant.org üzerinde yayımlanan bağımsız bir web projesidir. İçerik ve ürün sorumluluğu ByteQuant yayıncısına aittir; destek, gizlilik, telif ve düzeltme talepleri bytequant@yahoo.com adresinden alınır.", "Doğrulanamayan kişi biyografileri, uzmanlık unvanları veya kurumsal ortaklıklar üretmeyiz. Bir içerik kurumsal imzayla yayımlandığında yazar adı olarak ByteQuant Editorial kullanılır ve değerlendirme yöntemi bu sayfaya bağlanır."], checks: ["Sayfada yayıncı ve iletişim yolu görünür.", "Rehberlerde kurumsal byline ve değişiklik tarihi bulunur.", "Hukuk, finans, sağlık ve güvenlik sonuçları profesyonel onay olarak sunulmaz."] },
      { title: "2. İçeriği nasıl üretiyor ve doğruluyoruz?", paragraphs: ["Bir araç sayfası yalnızca başlık ve formdan oluşmaz. Girdi sözleşmesi, çalışan örnek, hata durumu, yöntem açıklaması, kabul kontrolü, bilinen sınırlar ve ilgili iş akışı birlikte incelenir. Rehberlerde anlatılan adımlar gerçek ürün yolları ve sentetik örneklerle karşılaştırılır.", "Otomasyon; tekrar eden bağlantı, dil, schema ve statik çıktı kontrollerinde kullanılır. Otomatik sonuç nihai editoryal karar değildir. Yüksek etkili iddialar birincil veya yetkili kaynak gerektirir; çıkarım ile doğrulanmış bilgi ayrı yazılır."], checks: ["Başlık, araç davranışı ve demo aynı işi anlatır.", "Normal, eksik, hatalı ve sınır girdileri test edilir.", "Kaynak metinden kopyalama yerine özgün yöntem ve uygulama değeri eklenir.", "Yayın öncesinde lint, tür, test, derleme, bağlantı ve yapılandırılmış veri denetimleri çalışır."] },
      { title: "3. Düzeltme ve sürüm politikası", paragraphs: ["Hata bildirimi; ilgili URL, gözlenen davranış, beklenen davranış, tarayıcı veya cihaz ve kişisel veri içermeyen tekrarlanabilir bir örnekle gönderilebilir. İçerik düzeltmeleri ile güvenlik açıkları aynı kanaldan herkese açık biçimde paylaşılmamalıdır; güvenlik bulguları SECURITY.md sürecinden özel olarak bildirilir.", "Doğrulanmış hata kaynak kodunda düzeltilir, test edilir ve Git geçmişine bağlanır. Anlamlı yöntem veya politika değişikliklerinde görünen son güncelleme tarihi yenilenir. Eski URL gerekiyorsa kanonik yönlendirmeyle korunur; sessizce farklı bir amaca dönüştürülmez."], checks: ["Düzeltme kanalı: bytequant@yahoo.com", "Güvenlik kanalı: SECURITY.md", "Değişiklik kanıtı: Git commit ve otomatik build", "Kullanıcı verisi rapora eklenmez."] },
      { title: "4. Reklam, bağımsızlık ve kullanıcı deneyimi", paragraphs: ["ByteQuant ücretsiz araçlarını Google AdSense ile destekleyebilir. Reklam, araç sıralamasını, hesaplama sonucunu, rehber önerisini veya editoryal değerlendirmeyi satın alamaz. Sponsorlu içerik yayımlanırsa başlığın yanında açıkça etiketlenir; mevcut rehberler sponsorlu değildir.", "Google Auto Ads uygun alanları kendi sistemiyle belirleyebilir. ByteQuant bu nedenle sahte reklam kutuları veya reklama benzeyen indirme düğmeleri yayımlamaz. Reklamların navigasyonu, araç girdisini, sonuç kontrolünü, yasal uyarıyı ya da indirme düğmesini kapatmaması gerekir. Reklama tıklamayı teşvik eden ifade, ok veya ödül kullanılmaz."], checks: ["Reklam ile araç kontrolü görsel olarak karışmaz.", "İçeriksiz, özel veya yüksek etkileşimli yüzeyler hesap düzeyinde hariç tutulur.", "Reklamveren araç sonucunu veya editoryal sırayı etkilemez.", "AdSense onayı ve canlı reklam uygunluğu yalnızca Google tarafından belirlenir."] },
      { title: "5. Gizlilik, onay ve veri sınırı", paragraphs: ["Temel araç girdileri ByteQuant sunucusuna veya reklam sistemine gönderilmez. Google reklam etiketi ise IP adresi, çevrim içi tanımlayıcılar, web işaretçileri veya çerezler gibi verileri Google politikalarına göre işleyebilir. Bu ayrım Gizlilik Politikası ile Çerez ve Yerel Depolama Politikası'nda açıklanır.", "ByteQuant'ın isteğe bağlı yerel kişiselleştirme seçimi reklam onayı değildir. Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre gibi gerekli bölgelerde reklam seçimleri AdSense hesabında yayımlanacak Google sertifikalı CMP ile yönetilmelidir. Kullanıcı tercihleri geri çekilebilir olmalı ve araç girdileri kişiselleştirilmiş reklam sinyaline dönüştürülmemelidir."], checks: ["Yerel kişiselleştirme varsayılan olarak kapalıdır.", "Araç girdisi reklam isteğine eklenmez.", "Gizlilik ve çerez sayfaları footer'dan tek adımda erişilir.", "CMP durumu site koduyla değil AdSense hesabından doğrulanır."] },
      { title: "6. Kaynak, telif ve yapay zekâ ilkesi", paragraphs: ["Ürün davranışı için resmî dokümantasyon; mevzuat için güncel resmî metin veya yetkili kurum; bilimsel iddia için yöntemini açıklayan birincil çalışma tercih edilir. Üçüncü taraf bir içeriğin başlığını veya kısa kaynağa ait özetini gösterdiğimizde özgün bağlantıyı görünür tutar, tam metni ya da görseli yeniden yayımlamayız.", "Yerel Ajan bir uzak LLM değildir ve bilinmeyen bilgiyi yetkili gerçek gibi üretmemelidir. Otomasyon veya üretken sistem içeriğin hazırlanmasına yardım ederse insan tarafından yöntem, ürün davranışı, kaynak ve dil açısından kontrol edilir. Arama sıralamasını manipüle etmek için seri, yüzeysel içerik üretmeyiz."], checks: ["Kaynak türü iddianın etkisine uygundur.", "Alıntı sınırlı; özgün yorum ve uygulama değeri baskındır.", "Ticari kullanıma uygun olmayan kod veya medya eklenmez.", "Yapay zekâ yardımı nihai doğrulamanın yerine geçmez."] },
    ],
    sourcesTitle: "Dayandığımız birincil standartlar",
    sourcesIntro: "Bu bağlantılar bir onay rozeti değildir. Yayın ve reklam uygulamalarını güncel tutmak için doğrudan resmî metinleri izleriz.",
    sources: sharedSources,
    reportTitle: "Bir hata, eksik açıklama veya çıkar çatışması mı gördünüz?",
    reportBody: "İlgili sayfa bağlantısını ve kişisel veri içermeyen tekrarlanabilir örneği gönderin. Güvenlik açığını herkese açık kanalda paylaşmayın.",
    reportCta: "Düzeltme gönder",
  },
  en: {
    eyebrow: "PUBLISHING & TRUST STANDARDS",
    title: "How we publish, verify, correct, and keep advertising separate from content",
    intro: "This page brings ownership, production, sourcing, corrections, advertising, and privacy rules for ByteQuant tools and guides into one auditable standard. It is evidence of process, not a trust badge.",
    updated: "Last verified: August 8, 2026",
    breadcrumb: "Publishing standards",
    evidenceLabel: "VERIFIABLE PUBLISHER EVIDENCE",
    evidence: [
      { value: "317", label: "distinct tools", detail: "Each publishes its method, limits, and usage steps." },
      { value: "4", label: "complete interface languages", detail: "Turkish, English, German, and Simplified Chinese." },
      { value: "MIT", label: "open-source license", detail: "Source, release history, and production dependencies are inspectable." },
      { value: "0", label: "tool inputs sent to ByteQuant", detail: "Core tool inputs run in the active browser tab." },
    ],
    sections: [
      { title: "1. Publisher identity and accountability", paragraphs: ["ByteQuant is an independent web project published at bytequant.org. ByteQuant is accountable for its product and content; support, privacy, copyright, and correction requests are accepted at bytequant@yahoo.com.", "We do not invent personal biographies, qualifications, or commercial relationships. Organizational bylines use ByteQuant Editorial and link readers to this disclosed review method."], checks: ["Publisher and contact route are visible.", "Guides carry an organizational byline and modification date.", "Legal, financial, health, and security output is never presented as professional approval."] },
      { title: "2. How content and tools are verified", paragraphs: ["A tool page is reviewed as a complete task: input contract, working example, error state, method, acceptance check, limitations, and next workflow. Guide steps are compared with real product routes using synthetic data.", "Automation checks repetitive links, locale coverage, schemas, and static output. It does not make the final editorial decision. High-impact claims require primary or competent sources, and inference is separated from verified fact."], checks: ["Title, runtime behavior, and demo describe the same task.", "Normal, missing, malformed, and boundary inputs are tested.", "Original method and application value exceed any source summary.", "Lint, type, test, build, link, and structured-data gates run before release."] },
      { title: "3. Corrections and versioning", paragraphs: ["A correction should include the affected URL, observed and expected behavior, browser or device, and a reproducible example without personal data. Security findings belong in the private SECURITY.md process rather than a public discussion.", "A confirmed error is fixed in source, tested, and tied to Git history. Material method or policy changes update the visible review date. Existing URLs are preserved with canonical redirects when needed, not silently repurposed."], checks: ["Corrections: bytequant@yahoo.com", "Security: SECURITY.md", "Change evidence: commit and automated build", "Reports must contain no real user data."] },
      { title: "4. Advertising independence and experience", paragraphs: ["ByteQuant may fund free tools with Google AdSense. Advertising cannot buy tool ranking, calculation output, guide recommendations, or editorial findings. Any sponsored material would be clearly labeled; current guides are not sponsored.", "Google Auto Ads may choose eligible positions. ByteQuant therefore publishes no fake ad boxes or download controls that resemble ads. Ads must not cover navigation, inputs, result controls, legal notices, or downloads, and no text, arrow, or reward encourages ad clicks."], checks: ["Ads and tool controls remain visually distinct.", "Private or highly interactive surfaces are excluded at account level.", "Advertisers do not affect output or editorial order.", "Only Google determines AdSense approval and live ad eligibility."] },
      { title: "5. Privacy, consent, and data boundaries", paragraphs: ["Core tool input is not sent to ByteQuant or advertising systems. Google's advertising tag may process IP addresses, online identifiers, web beacons, or cookies under Google's policies; the privacy and cookie pages disclose this separate flow.", "ByteQuant's optional local personalization is not advertising consent. Where required, including the EEA, UK, and Switzerland, advertising choices must be managed through a Google-certified CMP published from the AdSense account. Tool input must never become an ad-personalization signal."], checks: ["Optional local personalization starts off.", "Tool input is not added to ad requests.", "Privacy and cookie pages are one step from the footer.", "CMP status is verified in AdSense, not inferred from site code."] },
      { title: "6. Sources, copyright, and AI assistance", paragraphs: ["We prefer official documentation for product behavior, current official text or competent authorities for law, and method-rich primary research for scientific claims. When a third-party headline or source-owned brief is shown, the original link stays visible and ByteQuant does not republish full text or imagery.", "The Local Agent is not a remote LLM and must not present unknown material as authoritative fact. If automation or generative systems assist production, a human checks method, product behavior, sourcing, and language. We do not mass-publish shallow pages to manipulate ranking."], checks: ["Source strength matches claim impact.", "Quoting is limited and original application value dominates.", "No code or media lacking commercial-use permission is added.", "AI assistance never replaces final verification."] },
    ],
    sourcesTitle: "Primary standards we follow",
    sourcesIntro: "These links are not an endorsement badge. We monitor the original policies to keep publishing and advertising practice current.",
    sources: sharedSources,
    reportTitle: "Found an error, missing disclosure, or conflict of interest?",
    reportBody: "Send the affected page and a reproducible example without personal data. Never disclose a security vulnerability in a public channel.",
    reportCta: "Submit a correction",
  },
  de: {
    eyebrow: "PUBLIKATIONS- & VERTRAUENSSTANDARDS",
    title: "Wie wir veröffentlichen, prüfen, korrigieren und Werbung von Inhalten trennen",
    intro: "Diese Seite bündelt Verantwortlichkeit, Herstellung, Quellen, Korrekturen, Werbung und Datenschutz für ByteQuant-Werkzeuge und Ratgeber in einem prüfbaren Standard.",
    updated: "Zuletzt geprüft: 8. August 2026",
    breadcrumb: "Publikationsstandards",
    evidenceLabel: "ÜBERPRÜFBARE NACHWEISE",
    evidence: [
      { value: "317", label: "eigenständige Werkzeuge", detail: "Mit Methode, Grenzen und Nutzungsschritten." },
      { value: "4", label: "vollständige Oberflächensprachen", detail: "Türkisch, Englisch, Deutsch und vereinfachtes Chinesisch." },
      { value: "MIT", label: "Open-Source-Lizenz", detail: "Quellcode, Versionen und Abhängigkeiten sind prüfbar." },
      { value: "0", label: "Werkzeugeingaben an ByteQuant", detail: "Kernwerkzeuge arbeiten im aktiven Browser-Tab." },
    ],
    sections: [
      { title: "1. Herausgeber und Verantwortung", paragraphs: ["ByteQuant ist ein unabhängiges Webprojekt auf bytequant.org. Support-, Datenschutz-, Urheberrechts- und Korrekturanfragen erreichen den verantwortlichen Herausgeber unter bytequant@yahoo.com.", "Wir erfinden keine Biografien, Qualifikationen oder Partnerschaften. Organisatorische Autorenzeilen nennen ByteQuant Editorial und verweisen auf diese Prüfmethode."], checks: ["Herausgeber und Kontakt sind sichtbar.", "Ratgeber zeigen Autorenzeile und Änderungsdatum.", "Rechts-, Finanz-, Gesundheits- oder Sicherheitsergebnisse gelten nicht als fachliche Freigabe."] },
      { title: "2. Herstellung und Prüfung", paragraphs: ["Werkzeugseiten werden als vollständige Aufgabe geprüft: Eingabevertrag, Beispiel, Fehlerzustand, Methode, Abnahmekriterium, Grenzen und Folgeablauf. Ratgeber werden mit echten Produktwegen und synthetischen Daten abgeglichen.", "Automatisierung prüft wiederholbare Links, Sprachen, Schemas und statische Ausgaben. Die redaktionelle Entscheidung bleibt menschlich; folgenreiche Aussagen benötigen Primär- oder zuständige Quellen."], checks: ["Titel, Laufzeitverhalten und Demo passen zusammen.", "Normale, fehlende, fehlerhafte und Grenzwerte werden getestet.", "Eigene Methode und Nutzwert überwiegen Quellenzusammenfassungen.", "Lint, Typen, Tests, Build, Links und strukturierte Daten werden geprüft."] },
      { title: "3. Korrekturen und Versionen", paragraphs: ["Korrekturen enthalten URL, beobachtetes und erwartetes Verhalten, Browser oder Gerät und ein reproduzierbares Beispiel ohne personenbezogene Daten. Sicherheitsfunde gehören vertraulich in den SECURITY.md-Prozess.", "Bestätigte Fehler werden im Quellcode behoben, getestet und mit der Git-Historie verknüpft. Wesentliche Methoden- oder Richtlinienänderungen aktualisieren das sichtbare Prüfdatum."], checks: ["Korrekturen: bytequant@yahoo.com", "Sicherheit: SECURITY.md", "Änderungsnachweis: Commit und automatischer Build", "Keine echten Nutzerdaten in Berichten."] },
      { title: "4. Werbung und Unabhängigkeit", paragraphs: ["ByteQuant kann kostenlose Werkzeuge mit Google AdSense finanzieren. Werbung bestimmt weder Reihenfolge noch Berechnung, Empfehlung oder Bewertung. Gesponserte Inhalte würden klar gekennzeichnet; vorhandene Ratgeber sind nicht gesponsert.", "Google Auto Ads kann geeignete Positionen bestimmen. Es gibt daher keine Scheinanzeigen oder mit Werbung verwechselbare Download-Schaltflächen. Anzeigen dürfen Navigation, Eingaben, Ergebnisse, Rechtshinweise oder Downloads nicht verdecken."], checks: ["Anzeigen und Werkzeugsteuerung bleiben unterscheidbar.", "Private und stark interaktive Flächen werden im Konto ausgeschlossen.", "Werbekunden beeinflussen keine Ergebnisse.", "AdSense-Zulassung entscheidet ausschließlich Google."] },
      { title: "5. Datenschutz und Einwilligung", paragraphs: ["Kernwerkzeuge senden Eingaben weder an ByteQuant noch an Werbesysteme. Googles Werbetag kann nach Google-Richtlinien IP-Adressen, Kennungen, Web-Beacons oder Cookies verarbeiten; Datenschutz- und Cookie-Seite legen diesen getrennten Datenfluss offen.", "Die optionale lokale Personalisierung ist keine Werbeeinwilligung. Wo erforderlich, müssen Werbeentscheidungen über eine im AdSense-Konto veröffentlichte Google-zertifizierte CMP verwaltet werden."], checks: ["Optionale Personalisierung ist zunächst aus.", "Werkzeugeingaben gelangen nicht in Anzeigenanfragen.", "Datenschutz und Cookies sind im Footer direkt erreichbar.", "CMP-Status wird in AdSense geprüft."] },
      { title: "6. Quellen, Urheberrecht und KI", paragraphs: ["Für Produktverhalten nutzen wir offizielle Dokumentation, für Recht aktuelle amtliche Texte oder Behörden und für wissenschaftliche Aussagen methodenreiche Primärforschung. Bei fremden Meldungen bleibt der Originallink sichtbar; Volltexte und Bilder werden nicht übernommen.", "Der lokale Agent ist kein Remote-LLM. Unterstützt Automatisierung die Produktion, prüft ein Mensch Methode, Produktverhalten, Quellen und Sprache. Oberflächliche Masseninhalte zur Ranking-Manipulation sind ausgeschlossen."], checks: ["Quellenstärke entspricht der Tragweite.", "Kurze Zitate, überwiegend eigener Nutzwert.", "Nur kommerziell zulässiger Code und Inhalt.", "KI ersetzt keine Schlussprüfung."] },
    ],
    sourcesTitle: "Primärstandards",
    sourcesIntro: "Diese Links sind kein Prüfsiegel. Wir verfolgen die Originalrichtlinien, um Veröffentlichung und Werbung aktuell zu halten.",
    sources: sharedSources,
    reportTitle: "Fehler, fehlende Offenlegung oder Interessenkonflikt gefunden?",
    reportBody: "Senden Sie die betroffene Seite und ein reproduzierbares Beispiel ohne personenbezogene Daten. Sicherheitslücken niemals öffentlich melden.",
    reportCta: "Korrektur senden",
  },
  zh: {
    eyebrow: "发布与信任标准",
    title: "我们如何发布、核验、纠错，并把广告与内容清晰分开",
    intro: "本页把 ByteQuant 工具与指南的责任主体、制作流程、来源、纠错、广告和隐私规则汇总为可检查的发布标准，而不是空泛的信任徽章。",
    updated: "最后核验：2026 年 8 月 8 日",
    breadcrumb: "发布标准",
    evidenceLabel: "可核验的发布者证据",
    evidence: [
      { value: "317", label: "个独立工具", detail: "每个工具都公开方法、限制和使用步骤。" },
      { value: "4", label: "种完整界面语言", detail: "土耳其语、英语、德语和简体中文。" },
      { value: "MIT", label: "开源许可证", detail: "源码、版本历史和生产依赖均可检查。" },
      { value: "0", label: "工具输入发送给 ByteQuant", detail: "核心工具在当前浏览器标签页运行。" },
    ],
    sections: [
      { title: "1. 发布者身份与责任", paragraphs: ["ByteQuant 是发布在 bytequant.org 的独立 Web 项目。产品和内容责任由 ByteQuant 发布者承担；支持、隐私、版权与纠错请求可发送至 bytequant@yahoo.com。", "我们不会虚构个人履历、资质或合作关系。机构署名使用 ByteQuant Editorial，并链接到本页公开的审核方法。"], checks: ["发布者与联系方式清晰可见。", "指南显示机构署名和修改日期。", "法律、财务、健康和安全结果不被描述为专业批准。"] },
      { title: "2. 内容与工具如何核验", paragraphs: ["工具页按完整任务审核：输入约定、可运行示例、错误状态、方法、验收检查、已知限制与后续工作流。指南步骤使用合成数据与真实产品路径进行比对。", "自动化用于重复性的链接、语言、Schema 和静态输出检查，不代替最终编辑判断。高影响主张必须使用一手或主管来源，并区分推断与已核实事实。"], checks: ["标题、运行行为和演示描述同一任务。", "测试正常、缺失、错误和边界输入。", "原创方法与应用价值高于来源摘要。", "发布前运行 lint、类型、测试、构建、链接和结构化数据检查。"] },
      { title: "3. 纠错与版本政策", paragraphs: ["纠错报告应包含页面 URL、实际与预期行为、浏览器或设备，以及不含个人数据的可复现实例。安全漏洞应通过 SECURITY.md 私下报告，而不是公开讨论。", "确认的问题会在源码中修复、测试并关联 Git 历史。重要的方法或政策变更会更新可见日期；旧 URL 必要时使用规范重定向保留。"], checks: ["纠错：bytequant@yahoo.com", "安全：SECURITY.md", "变更证据：Commit 与自动构建", "报告不得包含真实用户数据。"] },
      { title: "4. 广告独立性与体验", paragraphs: ["ByteQuant 可使用 Google AdSense 支持免费工具。广告不能购买工具排序、计算结果、指南推荐或编辑结论。如未来发布赞助内容，会清晰标注；当前指南并非赞助内容。", "Google Auto Ads 可能选择合适位置，因此 ByteQuant 不设置虚假广告框，也不让下载按钮看起来像广告。广告不得遮挡导航、输入、结果控制、法律提示或下载按钮，也不会用文字、箭头或奖励诱导点击。"], checks: ["广告与工具控制保持清晰区别。", "私密或高交互页面在账户中排除。", "广告主不影响结果或编辑顺序。", "AdSense 批准与广告资格仅由 Google 决定。"] },
      { title: "5. 隐私、同意与数据边界", paragraphs: ["核心工具输入不会发送给 ByteQuant 或广告系统。Google 广告标签可能按其政策处理 IP 地址、在线标识符、Web Beacon 或 Cookie；隐私政策与 Cookie 政策会单独披露这一数据流。", "ByteQuant 的可选本地个性化不等于广告同意。在欧洲经济区、英国、瑞士等适用地区，广告选择必须通过 AdSense 账户发布的 Google 认证 CMP 管理。"], checks: ["可选本地个性化默认关闭。", "工具输入不加入广告请求。", "页脚可一步进入隐私与 Cookie 页面。", "CMP 状态在 AdSense 中核验。"] },
      { title: "6. 来源、版权与 AI 辅助", paragraphs: ["产品行为优先使用官方文档，法律主张使用现行官方文本或主管机构，科学主张使用方法充分的一手研究。展示第三方标题或来源短摘要时保留原始链接，不转载全文或图片。", "本地助手不是远程 LLM。若自动化或生成系统协助制作，仍由人工核对方法、产品行为、来源和语言。我们不会为操纵排名而批量发布浅薄页面。"], checks: ["来源强度匹配主张影响。", "引用有限，原创应用价值占主导。", "仅使用允许商业使用的代码与内容。", "AI 辅助不替代最终核验。"] },
    ],
    sourcesTitle: "我们遵循的一手标准",
    sourcesIntro: "这些链接不是认可徽章。我们直接跟踪原始政策，以保持发布与广告实践更新。",
    sources: sharedSources,
    reportTitle: "发现错误、披露缺失或利益冲突？",
    reportBody: "请发送相关页面和不含个人数据的可复现实例。安全漏洞不要在公开渠道披露。",
    reportCta: "提交纠错",
  },
};
