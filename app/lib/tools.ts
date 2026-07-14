import type { Locale } from "./site";

export type ToolCategory = "prompt" | "text" | "data" | "security";

export type Tool = {
  slug: string;
  category: ToolCategory;
  mark: string;
  title: Record<Locale, string>;
  short: Record<Locale, string>;
  description: Record<Locale, string>;
  useCases: Record<Locale, string[]>;
  steps: Record<Locale, string[]>;
};

export const categories: Record<ToolCategory, { label: Record<Locale, string>; description: Record<Locale, string>; mark: string }> = {
  prompt: {
    label: { tr: "Prompt araçları", en: "Prompt tools" },
    description: { tr: "Daha açık, sınanabilir ve yeniden kullanılabilir yapay zekâ talimatları hazırlayın.", en: "Build clearer, testable, and reusable AI instructions." },
    mark: "P",
  },
  text: {
    label: { tr: "Metin ve NLP", en: "Text & NLP" },
    description: { tr: "Metnin yapısını, okunabilirliğini ve benzerliğini cihazınızda inceleyin.", en: "Inspect structure, readability, and similarity directly on your device." },
    mark: "T",
  },
  data: {
    label: { tr: "Veri ve geliştirici", en: "Data & developer" },
    description: { tr: "JSON, CSV, Regex ve kodlama işlemlerini hızlıca tamamlayın.", en: "Handle JSON, CSV, Regex, and encoding tasks quickly." },
    mark: "D",
  },
  security: {
    label: { tr: "Gizlilik ve güvenlik", en: "Privacy & security" },
    description: { tr: "Hassas verileri maskeleyin ve güvenli tanımlayıcılar üretin.", en: "Mask sensitive data and generate secure identifiers." },
    mark: "S",
  },
};

export const tools: Tool[] = [
  {
    slug: "prompt-kalite-denetimi", category: "prompt", mark: "01",
    title: { tr: "Prompt Kalite Denetimi", en: "Prompt Quality Checker" },
    short: { tr: "Hedef, bağlam, kısıt ve çıktı biçimini şeffaf kurallarla puanlayın.", en: "Score goals, context, constraints, and output format with transparent rules." },
    description: { tr: "Bir promptun güçlü ve eksik yönlerini puanlayan bu araç; amaç netliği, bağlam, hedef kitle, kısıtlar, örnek ve çıktı biçimi gibi bileşenleri kontrol eder. Sonuç yalnızca bir skor değil, uygulanabilir bir iyileştirme listesi sunar.", en: "This tool evaluates a prompt for goal clarity, context, audience, constraints, examples, and output format. It returns both a score and a practical improvement checklist." },
    useCases: { tr: ["Üretim promptlarını yayınlamadan önce kontrol", "Ekip içi prompt standardı oluşturma", "Belirsiz talimatları iyileştirme"], en: ["Pre-flight checks for production prompts", "Shared team prompt standards", "Improving ambiguous instructions"] },
    steps: { tr: ["Promptunuzu giriş alanına yapıştırın.", "Analizi çalıştırın ve bileşen skorlarını inceleyin.", "Eksik maddeleri ekleyip yeniden ölçün."], en: ["Paste your prompt into the input area.", "Run the analysis and review component scores.", "Add missing elements and measure again."] },
  },
  {
    slug: "meta-prompt-olusturucu", category: "prompt", mark: "02",
    title: { tr: "Meta Prompt Oluşturucu", en: "Meta Prompt Builder" },
    short: { tr: "Bir hedefi rol, süreç, sınırlar ve çıktı şeması içeren yapıya dönüştürün.", en: "Turn a goal into a structured role, process, constraints, and output schema." },
    description: { tr: "Kısa bir görev tanımını; rol, başarı ölçütü, çalışma adımları, sınırlar ve çıktı sözleşmesi içeren yeniden kullanılabilir bir meta prompta dönüştürür. Üretilen metin cihazınızda hazırlanır.", en: "Transforms a short task description into a reusable meta prompt containing a role, success criteria, workflow, constraints, and output contract. Everything is generated on-device." },
    useCases: { tr: ["Tekrarlanan iş akışları", "Kurumsal prompt şablonları", "Ajans ve içerik ekipleri"], en: ["Repeatable workflows", "Team prompt templates", "Agency and content teams"] },
    steps: { tr: ["Gerçek hedefi tek cümleyle yazın.", "Varsa bağlam ve zorunlu kısıtları ekleyin.", "Şablonu üretin, gözden geçirin ve kopyalayın."], en: ["Describe the real goal in one sentence.", "Add context and non-negotiable constraints.", "Generate, review, and copy the template."] },
  },
  {
    slug: "token-sayaci", category: "prompt", mark: "03",
    title: { tr: "Token ve Bağlam Sayacı", en: "Token & Context Counter" },
    short: { tr: "Metin uzunluğunu ve yaklaşık token ihtiyacını modelden bağımsız görün.", en: "Estimate text length and token demand without sending it to a model." },
    description: { tr: "Karakter, kelime, satır ve yaklaşık token sayısını hesaplar. Token sonucu bir tahmindir; gerçek değer kullanılan modelin tokenizer yapısına göre değişir. Hızlı bağlam planlaması için güvenli bir ön kontrol sağlar.", en: "Calculates characters, words, lines, and an approximate token count. The token result is an estimate because exact counts vary by model tokenizer; it is intended for safe context planning." },
    useCases: { tr: ["Bağlam penceresi planlama", "Prompt uzunluğu karşılaştırma", "Maliyet ön tahmini"], en: ["Context-window planning", "Prompt length comparison", "Rough cost estimation"] },
    steps: { tr: ["Metni yapıştırın.", "Sayımı çalıştırın.", "Model sınırıyla karşılaştırırken güvenlik payı bırakın."], en: ["Paste your text.", "Run the count.", "Leave a safety margin when comparing with model limits."] },
  },
  {
    slug: "okunabilirlik-analizi", category: "text", mark: "04",
    title: { tr: "Okunabilirlik Analizi", en: "Readability Analyzer" },
    short: { tr: "Cümle ve kelime yapısını ölçerek metnin anlaşılabilirliğini inceleyin.", en: "Assess clarity through sentence and word structure." },
    description: { tr: "Cümle uzunluğu, kelime çeşitliliği ve hece yoğunluğu üzerinden açıklanabilir bir okunabilirlik özeti üretir. Türkçe için Ateşman yaklaşımından, İngilizce için Flesch yaklaşımından esinlenen yaklaşık ölçüler kullanır.", en: "Produces an explainable readability summary using sentence length, lexical variety, and syllable density. It uses approximate measures inspired by Ateşman for Turkish and Flesch for English." },
    useCases: { tr: ["Blog yazısı düzenleme", "Müşteri iletişimi", "Teknik metni sadeleştirme"], en: ["Editing guides", "Customer communication", "Simplifying technical copy"] },
    steps: { tr: ["En az birkaç cümle girin.", "Analizi çalıştırın.", "Uzun cümleleri bölüp sonucu yeniden karşılaştırın."], en: ["Enter at least a few sentences.", "Run the analysis.", "Split long sentences and compare the result again."] },
  },
  {
    slug: "metin-benzerlik-analizi", category: "text", mark: "05",
    title: { tr: "Metin Benzerlik Analizi", en: "Text Similarity Analyzer" },
    short: { tr: "İki metni sözcük örtüşmesi ve kosinüs benzerliğiyle karşılaştırın.", en: "Compare two texts with word overlap and cosine similarity." },
    description: { tr: "İki metni yerel sözcük frekanslarıyla karşılaştırır; Jaccard örtüşmesi ve kosinüs benzerliği verir. Sonuç anlamsal bir yapay zekâ modeli değildir, açıklanabilir sözcük tabanlı bir ölçümdür.", en: "Compares two texts using local word frequencies and returns Jaccard overlap plus cosine similarity. It is an explainable lexical measure, not an AI semantic model." },
    useCases: { tr: ["Sürüm karşılaştırma", "Tekrarlı içerik ön kontrolü", "Özet ile kaynak tutarlılığı"], en: ["Version comparison", "Duplicate-content pre-checks", "Summary-to-source consistency"] },
    steps: { tr: ["İlk metni ana alana girin.", "İkinci metni karşılaştırma alanına ekleyin.", "Benzerlik yüzdelerini bağlamla birlikte yorumlayın."], en: ["Enter the first text.", "Add the comparison text.", "Interpret similarity percentages in context."] },
  },
  {
    slug: "metin-temizleyici", category: "text", mark: "06",
    title: { tr: "Metin Temizleyici", en: "Text Cleaner" },
    short: { tr: "Gereksiz boşlukları, yinelenen satırları ve dağınık biçimi düzeltin.", en: "Fix excess whitespace, duplicate lines, and inconsistent formatting." },
    description: { tr: "Kopyalanmış metinlerdeki gereksiz boşlukları, yinelenen boş satırları ve satır sonu sorunlarını temizler. Metnin anlamını değiştirmeden daha düzenli bir çıktı üretmeyi amaçlar.", en: "Cleans excess spaces, repeated blank lines, and line-ending issues in copied text while preserving the original meaning." },
    useCases: { tr: ["PDF'den kopyalanan metin", "E-posta taslakları", "İçerik yönetim sistemine aktarım"], en: ["Text copied from PDFs", "Email drafts", "CMS preparation"] },
    steps: { tr: ["Dağınık metni yapıştırın.", "Temizle düğmesini kullanın.", "Çıktıyı kontrol edip kopyalayın veya indirin."], en: ["Paste messy text.", "Use the clean action.", "Review, then copy or download the output."] },
  },
  {
    slug: "buyuk-kucuk-harf-donusturucu", category: "text", mark: "07",
    title: { tr: "Büyük/Küçük Harf Dönüştürücü", en: "Case Converter" },
    short: { tr: "Metni cümle, başlık, büyük veya küçük harf biçimine dönüştürün.", en: "Convert text to sentence, title, uppercase, or lowercase form." },
    description: { tr: "Türkçe karakterleri dikkate alarak büyük, küçük, cümle ve başlık biçimleri arasında dönüşüm yapar. Dönüşüm biçimini araç içindeki seçenekten belirleyebilirsiniz.", en: "Converts text between uppercase, lowercase, sentence case, and title case. Choose the desired format inside the tool." },
    useCases: { tr: ["Başlık standardizasyonu", "Sosyal medya metni", "Veri temizliği"], en: ["Headline standardization", "Social copy", "Data cleanup"] },
    steps: { tr: ["Metni girin.", "Dönüşüm biçimini seçin.", "Sonucu üretip kontrol edin."], en: ["Enter text.", "Choose a conversion style.", "Generate and review the result."] },
  },
  {
    slug: "kelime-sayaci", category: "text", mark: "08",
    title: { tr: "Kelime, Karakter ve Okuma Süresi", en: "Word, Character & Reading Time" },
    short: { tr: "İçerik uzunluğunu, paragraf sayısını ve tahmini okuma süresini ölçün.", en: "Measure content length, paragraphs, and estimated reading time." },
    description: { tr: "Kelime, karakter, cümle, paragraf ve satır sayılarını birlikte sunar. Dakikada yaklaşık 200 kelime varsayımıyla okuma süresi tahmini verir.", en: "Reports words, characters, sentences, paragraphs, and lines, plus reading time estimated at roughly 200 words per minute." },
    useCases: { tr: ["SEO içerik planlama", "Konuşma metni süresi", "Editoryal sınır kontrolü"], en: ["SEO content planning", "Speech timing", "Editorial length checks"] },
    steps: { tr: ["Metni yapıştırın.", "Sayımı çalıştırın.", "Sonucu içeriğin amacıyla birlikte değerlendirin."], en: ["Paste your text.", "Run the count.", "Evaluate length against the content's purpose."] },
  },
  {
    slug: "json-bicimlendirici", category: "data", mark: "09",
    title: { tr: "JSON Biçimlendirici ve Doğrulayıcı", en: "JSON Formatter & Validator" },
    short: { tr: "JSON verisini doğrulayın, okunabilir biçime getirin veya küçültün.", en: "Validate, pretty-print, or minify JSON data." },
    description: { tr: "JSON sözdizimini tarayıcıda doğrular ve okunabilir girintili çıktı üretir. Hata varsa yaklaşık konumu ve tarayıcının ayrıştırma mesajını gösterir.", en: "Validates JSON syntax in the browser and produces readable, indented output. Parse errors are surfaced without sending the payload anywhere." },
    useCases: { tr: ["API yanıtı inceleme", "Yapılandırma dosyası düzenleme", "Hatalı JSON bulma"], en: ["Inspecting API responses", "Editing config files", "Finding malformed JSON"] },
    steps: { tr: ["JSON verisini yapıştırın.", "Biçimlendir veya küçült seçeneğini belirleyin.", "Doğrulanan çıktıyı kopyalayın."], en: ["Paste JSON data.", "Choose pretty or minified output.", "Copy the validated result."] },
  },
  {
    slug: "json-csv-donusturucu", category: "data", mark: "10",
    title: { tr: "JSON ↔ CSV Dönüştürücü", en: "JSON ↔ CSV Converter" },
    short: { tr: "Düz nesne dizileri ile CSV tabloları arasında yerel dönüşüm yapın.", en: "Convert flat object arrays and CSV tables locally." },
    description: { tr: "Düz JSON nesne dizilerini CSV'ye, CSV tablolarını JSON'a dönüştürür. Tırnak ve virgül kaçışlarını işler; karmaşık iç içe nesnelerde dönüştürmeden önce yapıyı düzleştirmeniz gerekir.", en: "Converts flat JSON object arrays to CSV and CSV tables to JSON, including standard quote and comma escaping. Nested objects should be flattened first." },
    useCases: { tr: ["E-tablo aktarımı", "Hızlı veri paylaşımı", "Basit rapor dönüşümü"], en: ["Spreadsheet transfer", "Quick data exchange", "Simple report conversion"] },
    steps: { tr: ["JSON dizisi veya CSV tablosu girin.", "Kaynak biçimi seçin.", "Dönüştürüp sonucu örnek verilerle kontrol edin."], en: ["Enter a JSON array or CSV table.", "Choose the source format.", "Convert and verify the result with sample rows."] },
  },
  {
    slug: "regex-test-araci", category: "data", mark: "11",
    title: { tr: "Regex Test Aracı", en: "Regex Tester" },
    short: { tr: "Düzenli ifadeyi eşleşmeler ve gruplarla güvenli biçimde sınayın.", en: "Test regular expressions with matches and groups." },
    description: { tr: "Bir düzenli ifadeyi örnek metin üzerinde çalıştırır; eşleşme sayısı, konum ve yakalama gruplarını listeler. Çok uzun metinler sınırlandırılarak tarayıcı donması riski azaltılır.", en: "Runs a regular expression against sample text and lists match count, positions, and capture groups. Input size is limited to reduce accidental browser freezes." },
    useCases: { tr: ["Doğrulama kalıbı geliştirme", "Log ayrıştırma", "Arama ve değiştirme hazırlığı"], en: ["Validation patterns", "Log parsing", "Search-and-replace preparation"] },
    steps: { tr: ["Test metnini ana alana yazın.", "Regex kalıbını ve bayrakları girin.", "Eşleşmeleri inceleyip kalıbı daraltın."], en: ["Enter sample text.", "Provide the regex pattern and flags.", "Review matches and refine the pattern."] },
  },
  {
    slug: "csv-inceleyici", category: "data", mark: "12",
    title: { tr: "CSV Yapı İnceleyici", en: "CSV Structure Inspector" },
    short: { tr: "Başlıkları, satır sayısını ve tutarsız sütunları hızlıca bulun.", en: "Find headers, row counts, and inconsistent columns." },
    description: { tr: "CSV içeriğini tarayıcıda ayrıştırarak başlıkları, veri satırı sayısını, sütun sayısını ve düzensiz satırları özetler. Büyük dosyalar için önce küçük bir örnekle kontrol önerilir.", en: "Parses CSV content in the browser and summarizes headers, data rows, column count, and inconsistent rows. Start with a representative sample for very large files." },
    useCases: { tr: ["İçe aktarma öncesi kontrol", "Bozuk satır bulma", "Veri şeması keşfi"], en: ["Pre-import checks", "Finding malformed rows", "Schema discovery"] },
    steps: { tr: ["CSV metnini yapıştırın.", "İncelemeyi çalıştırın.", "Düzensiz satır numaralarını kaynak dosyada düzeltin."], en: ["Paste CSV text.", "Run the inspection.", "Fix reported row numbers in the source file."] },
  },
  {
    slug: "base64-kodlayici", category: "data", mark: "13",
    title: { tr: "Base64 Kodlayıcı ve Çözücü", en: "Base64 Encoder & Decoder" },
    short: { tr: "Unicode metni Base64'e dönüştürün veya Base64 metnini çözün.", en: "Encode Unicode text to Base64 or decode it back." },
    description: { tr: "UTF-8 metni Base64'e kodlar veya geçerli Base64 verisini metne çevirir. Base64 şifreleme değildir; yalnızca veri gösterim biçimidir.", en: "Encodes UTF-8 text as Base64 or decodes valid Base64 to text. Base64 is an encoding format, not encryption." },
    useCases: { tr: ["Veri URI hazırlığı", "Hızlı örnek veri dönüşümü", "Kodlama hatası teşhisi"], en: ["Preparing data payloads", "Quick sample conversion", "Diagnosing encoding issues"] },
    steps: { tr: ["Metni girin.", "Kodla veya çöz seçeneğini belirleyin.", "Hassas çıktıyı paylaşmadan önce içeriği kontrol edin."], en: ["Enter text.", "Choose encode or decode.", "Review sensitive output before sharing it."] },
  },
  {
    slug: "url-kodlayici", category: "data", mark: "14",
    title: { tr: "URL Kodlayıcı ve Çözücü", en: "URL Encoder & Decoder" },
    short: { tr: "Sorgu değerlerini güvenli URL bileşenlerine dönüştürün.", en: "Convert query values into safe URL components." },
    description: { tr: "Metni encodeURIComponent standardıyla URL bileşeni olarak kodlar veya geri çözer. Tam URL yerine tek bir parametre değeriyle çalışmak daha güvenlidir.", en: "Encodes text as a URL component with encodeURIComponent or decodes it. It is safest to work on a single parameter value rather than a complete URL." },
    useCases: { tr: ["Sorgu parametresi hazırlama", "Bozuk bağlantı inceleme", "Yönlendirme değeri çözme"], en: ["Preparing query parameters", "Inspecting broken links", "Decoding redirect values"] },
    steps: { tr: ["URL bileşenini girin.", "Kodla veya çöz seçeneğini seçin.", "Sonucu gerçek bağlantıda kullanmadan önce doğrulayın."], en: ["Enter a URL component.", "Choose encode or decode.", "Verify the result before using it in a real link."] },
  },
  {
    slug: "kvkk-veri-maskeleyici", category: "security", mark: "15",
    title: { tr: "KVKK / GDPR Veri Maskeleyici", en: "KVKK / GDPR Data Masker" },
    short: { tr: "E-posta, telefon, IBAN, kart ve IP gibi desenleri cihazınızda maskeleyin.", en: "Mask email, phone, IBAN, card, and IP patterns on-device." },
    description: { tr: "Yaygın kişisel veri desenlerini düzenli ifadelerle bularak okunabilir yer tutucularla değiştirir. Bu araç hukuki uygunluk garantisi vermez; belgeyi paylaşmadan önce insan kontrolü zorunludur.", en: "Finds common personal-data patterns with regular expressions and replaces them with readable placeholders. It does not guarantee legal compliance; human review remains essential." },
    useCases: { tr: ["Destek kaydı anonimleştirme", "Örnek veri hazırlama", "Belge paylaşımı ön kontrolü"], en: ["Anonymizing support tickets", "Preparing sample data", "Pre-sharing document checks"] },
    steps: { tr: ["Metni yalnızca bu tarayıcı sekmesine yapıştırın.", "Maskelemeyi çalıştırın ve bulunan türleri inceleyin.", "Kaçan veya yanlış maskelenen alanları elle doğrulayın."], en: ["Paste text into this browser tab.", "Run masking and review detected types.", "Manually verify missed or incorrect replacements."] },
  },
  {
    slug: "guclu-parola-uretici", category: "security", mark: "16",
    title: { tr: "Güçlü Parola Üretici", en: "Strong Password Generator" },
    short: { tr: "Web Crypto ile 12–128 karakter arasında rastgele parola üretin.", en: "Generate a random 12–128 character password with Web Crypto." },
    description: { tr: "Tarayıcının kriptografik rastgele sayı üreticisini kullanarak güçlü parola oluşturur. Üretilen parola saklanmaz; kullanmadan önce güvenilir bir parola yöneticisine kaydedin.", en: "Uses the browser's cryptographic random-number generator to create a strong password. The result is not stored; save it in a trusted password manager." },
    useCases: { tr: ["Yeni hesap parolası", "Geçici erişim anahtarı", "Parola yöneticisi girdisi"], en: ["New account passwords", "Temporary access secrets", "Password-manager entries"] },
    steps: { tr: ["Uzunluğu seçin; 20 veya üzeri önerilir.", "Parola üretin.", "Sonucu güvenilir parola yöneticisine kaydedin."], en: ["Choose a length; 20 or more is recommended.", "Generate a password.", "Store it in a trusted password manager."] },
  },
  {
    slug: "uuid-uretici", category: "security", mark: "17",
    title: { tr: "UUID v4 Üretici", en: "UUID v4 Generator" },
    short: { tr: "Tarayıcınızda standart rastgele UUID tanımlayıcıları üretin.", en: "Generate standard random UUID identifiers in your browser." },
    description: { tr: "crypto.randomUUID desteği bulunan tarayıcılarda RFC 4122 uyumlu UUID v4 değerleri üretir. UUID bir parola veya kimlik doğrulama belirteci değildir.", en: "Generates RFC 4122 UUID v4 values in browsers that support crypto.randomUUID. A UUID is not a password or authentication token." },
    useCases: { tr: ["Test kaydı kimliği", "Yerel prototip", "Dağıtık kayıt anahtarı"], en: ["Test record IDs", "Local prototypes", "Distributed record keys"] },
    steps: { tr: ["Üret düğmesine basın.", "Değeri kopyalayın.", "Güvenlik sırrı olarak kullanmayın."], en: ["Press generate.", "Copy the value.", "Do not use it as a security secret."] },
  },
  {
    slug: "sha256-ozet-uretici", category: "security", mark: "18",
    title: { tr: "SHA-256 Özet Üretici", en: "SHA-256 Digest Generator" },
    short: { tr: "Metnin SHA-256 bütünlük özetini Web Crypto ile hesaplayın.", en: "Calculate a SHA-256 integrity digest with Web Crypto." },
    description: { tr: "Metni UTF-8 olarak kodlayıp Web Crypto API ile 64 karakterlik SHA-256 özeti üretir. Özet tek yönlüdür ancak parola saklamak için tek başına uygun değildir.", en: "Encodes text as UTF-8 and uses Web Crypto to return a 64-character SHA-256 digest. It is one-way, but plain SHA-256 is not suitable for password storage." },
    useCases: { tr: ["Metin bütünlüğü karşılaştırma", "İçerik parmak izi", "Test verisi özeti"], en: ["Text integrity comparison", "Content fingerprints", "Test-data digests"] },
    steps: { tr: ["Metni girin.", "SHA-256 hesaplamasını çalıştırın.", "Aynı girdinin aynı özeti verdiğini doğrulayın."], en: ["Enter text.", "Run the SHA-256 calculation.", "Verify identical input returns the same digest."] },
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

