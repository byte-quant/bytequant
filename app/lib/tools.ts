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
  {
    slug: "few-shot-ornek-olusturucu", category: "prompt", mark: "19",
    title: { tr: "Few-shot Örnek Oluşturucu", en: "Few-shot Example Builder" },
    short: { tr: "Bir görevi örnek girdi–çıktı çiftleriyle yapılandırılmış bir prompta dönüştürün.", en: "Turn a task and example input-output pairs into a structured prompt." },
    description: { tr: "Görev tanımı ile örnek girdi–çıktı çiftlerini bir araya getirerek modellerin beklenen deseni daha açık görmesini sağlayan yeniden kullanılabilir bir few-shot prompt üretir. Örnekler yalnızca tarayıcı belleğinde işlenir.", en: "Combines a task description with example input-output pairs to produce a reusable few-shot prompt that makes the expected pattern explicit. Examples are processed only in browser memory." },
    useCases: { tr: ["Sınıflandırma ve etiketleme", "Tutarlı içerik biçimi", "Dönüşüm görevleri için örnekleme"], en: ["Classification and labeling", "Consistent content formats", "Demonstrating transformation tasks"] },
    steps: { tr: ["Modelin yapacağı görevi açık bir cümleyle yazın.", "Her satıra `girdi => çıktı` biçiminde kaliteli örnekler ekleyin.", "Promptu üretip örneklerin çeşitliliğini ve doğruluğunu kontrol edin."], en: ["Describe the model's task in one clear sentence.", "Add strong examples as `input => output`, one per line.", "Generate the prompt and review example quality and coverage."] },
  },
  {
    slug: "sistem-promptu-persona-sablonu", category: "prompt", mark: "20",
    title: { tr: "Sistem Promptu / Persona Şablonu", en: "System Prompt / Persona Template" },
    short: { tr: "Rol, ton, çalışma ilkeleri ve sınırları profesyonel bir sistem promptunda birleştirin.", en: "Combine role, tone, operating principles, and boundaries in a professional system prompt." },
    description: { tr: "Bir rol tanımını görev, hedef kitle, ton, stil, güvenlik sınırları ve çıktı sözleşmesiyle yapılandırır. Üretilen şablon iddialı ama belirsiz persona cümleleri yerine denetlenebilir davranış kuralları kullanır.", en: "Structures a role around mission, audience, tone, style, safety boundaries, and an output contract. The template favors testable behavior rules over vague persona claims." },
    useCases: { tr: ["Kurumsal asistan davranışı", "İçerik tonu standardı", "Destek botu sınırları"], en: ["Company assistant behavior", "Editorial tone standards", "Support-bot boundaries"] },
    steps: { tr: ["Rolü ve temel sorumluluğu tanımlayın.", "Ton, hedef kitle ve değişmez sınırları ekleyin.", "Şablonu üretip gerçek örneklerle sınayın ve daraltın."], en: ["Define the role and primary responsibility.", "Add tone, audience, and non-negotiable boundaries.", "Generate the template, test it with real examples, and refine it."] },
  },
  {
    slug: "metin-farki-diff", category: "text", mark: "21",
    title: { tr: "Metin Farkı (Diff) Aracı", en: "Text Diff Tool" },
    short: { tr: "İki sürümde eklenen ve silinen satır ya da kelimeleri renkli olarak görün.", en: "See added and removed lines or words across two versions." },
    description: { tr: "İki metni satır veya kelime düzeyinde karşılaştırır; silinen parçaları kırmızı, eklenen parçaları yeşil olarak işaretler. Karşılaştırma LCS tabanlı ve tamamen istemci tarafındadır.", en: "Compares two texts at line or word level, marking removals in red and additions in green. The LCS-based comparison runs entirely client-side." },
    useCases: { tr: ["Metin sürümü inceleme", "Editoryal düzeltme kontrolü", "Kod dışı yapılandırma karşılaştırma"], en: ["Reviewing text versions", "Checking editorial revisions", "Comparing non-code configuration"] },
    steps: { tr: ["Eski ve yeni metni ayrı alanlara yapıştırın.", "Satır veya kelime karşılaştırmasını seçin.", "Renkli farkı inceleyip ekleme ve silme sayılarını doğrulayın."], en: ["Paste the old and new text into separate fields.", "Choose line-level or word-level comparison.", "Review the colored diff and verify addition and removal counts."] },
  },
  {
    slug: "markdown-onizleyici", category: "text", mark: "22",
    title: { tr: "Markdown Önizleyici", en: "Markdown Previewer" },
    short: { tr: "Markdown metnini güvenli HTML önizlemesi ve kopyalanabilir kodla birlikte görün.", en: "Preview Markdown as safe HTML and inspect the generated code." },
    description: { tr: "Başlık, liste, bağlantı, alıntı, vurgu ve kod bloklarını tarayıcıda anlık HTML'e dönüştürür. Ham HTML yürütülmez; giriş önce güvenli biçimde kaçışlanır.", en: "Converts headings, lists, links, quotes, emphasis, and code blocks to live HTML in the browser. Raw HTML is never executed; input is escaped first." },
    useCases: { tr: ["README ve dokümantasyon", "İçerik taslağı önizleme", "Güvenli HTML çıktısı hazırlama"], en: ["README and documentation", "Previewing content drafts", "Preparing safe HTML output"] },
    steps: { tr: ["Markdown metnini sol alana yazın veya yapıştırın.", "Sağdaki canlı önizlemeyi ve HTML kodunu kontrol edin.", "Üretilen HTML'i kopyalayın veya dosya olarak indirin."], en: ["Write or paste Markdown in the left field.", "Review the live preview and generated HTML on the right.", "Copy the HTML or download it as a file."] },
  },
  {
    slug: "unix-zaman-damgasi-donusturucu", category: "data", mark: "23",
    title: { tr: "Unix Zaman Damgası Dönüştürücü", en: "Unix Timestamp Converter" },
    short: { tr: "Epoch saniyesi, milisaniye ve okunabilir tarih arasında iki yönlü dönüşüm yapın.", en: "Convert between epoch seconds, milliseconds, and human-readable dates." },
    description: { tr: "Unix zaman damgasını yerel saat ve UTC tarihine çevirir; seçilen normal tarihin saniye ve milisaniye karşılığını üretir. Saat dilimi farkını açıkça gösterir.", en: "Converts Unix timestamps to local and UTC dates and returns seconds and milliseconds for a selected calendar date. Time-zone differences are displayed explicitly." },
    useCases: { tr: ["Log kaydı inceleme", "API tarih alanı dönüştürme", "Saat dilimi hata ayıklama"], en: ["Inspecting log records", "Converting API date fields", "Debugging time-zone issues"] },
    steps: { tr: ["Epoch değeri veya normal bir tarih girin.", "Saniye/milisaniye algısını ve saat dilimini kontrol edin.", "UTC, yerel tarih ve Unix sonuçlarını kopyalayın."], en: ["Enter an epoch value or a calendar date.", "Check unit detection and the displayed time zone.", "Copy the UTC, local, or Unix result."] },
  },
  {
    slug: "jwt-decoder", category: "data", mark: "24",
    title: { tr: "JWT Decoder", en: "JWT Decoder" },
    short: { tr: "JWT Header ve Payload bölümlerini imza doğrulamadan yerel JSON olarak okuyun.", en: "Read JWT header and payload as local JSON without verifying the signature." },
    description: { tr: "JSON Web Token'ın Base64URL kodlu Header ve Payload bölümlerini tarayıcıda çözer; exp, iat ve nbf zamanlarını okunabilir tarihle açıklar. İmzayı doğrulamaz ve tokenı hiçbir sunucuya göndermez.", en: "Decodes the Base64URL header and payload of a JSON Web Token in the browser and explains exp, iat, and nbf times. It does not verify the signature or send the token to a server." },
    useCases: { tr: ["Kimlik doğrulama hata ayıklama", "Claim inceleme", "Süre sonu kontrolü"], en: ["Authentication debugging", "Inspecting claims", "Checking token expiry"] },
    steps: { tr: ["Hassas olmayan test JWT'sini alana yapıştırın.", "Header, Payload ve zaman claim'lerini çözün.", "Sonucun yalnızca decode olduğunu; imza doğrulaması olmadığını unutmayın."], en: ["Paste a non-sensitive test JWT.", "Decode its header, payload, and time claims.", "Remember that decoding does not verify the signature."] },
  },
  {
    slug: "renk-donusturucu", category: "data", mark: "25",
    title: { tr: "HEX / RGB / HSL Renk Dönüştürücü", en: "HEX / RGB / HSL Color Converter" },
    short: { tr: "HEX, RGB ve HSL değerlerini renk seçiciyle anlık olarak eşitleyin.", en: "Synchronize HEX, RGB, and HSL values instantly with a color picker." },
    description: { tr: "HEX, RGB veya HSL biçimlerinden birini girerek diğer iki gösterimi hesaplar ve erişilebilir bir renk önizlemesi sunar. Dönüşümler tamamen tarayıcıda yapılır.", en: "Accepts HEX, RGB, or HSL input, calculates the other representations, and shows an accessible color preview. All conversion happens in the browser." },
    useCases: { tr: ["Tasarım tokenı hazırlama", "CSS rengi dönüştürme", "Marka paleti kontrolü"], en: ["Preparing design tokens", "Converting CSS colors", "Reviewing brand palettes"] },
    steps: { tr: ["Renk seçiciyi kullanın veya desteklenen bir değer girin.", "HEX, RGB ve HSL sonuçlarını birlikte inceleyin.", "İhtiyacınız olan biçimi tek tıklamayla kopyalayın."], en: ["Use the color picker or enter a supported value.", "Review the synchronized HEX, RGB, and HSL results.", "Copy the format you need with one click."] },
  },
  {
    slug: "qr-kod-olusturucu", category: "data", mark: "26",
    title: { tr: "QR Kod Oluşturucu", en: "QR Code Generator" },
    short: { tr: "Metin veya URL için tarayıcıda QR kod üretip PNG ya da SVG indirin.", en: "Generate a QR code for text or a URL and download PNG or SVG." },
    description: { tr: "Girilen içeriği üçüncü taraf QR servisine göndermeden tarayıcıda QR koda dönüştürür. Yüksek çözünürlüklü PNG ve ölçeklenebilir SVG indirme seçenekleri sunar.", en: "Turns input into a QR code in the browser without calling a third-party QR service. Download options include high-resolution PNG and scalable SVG." },
    useCases: { tr: ["Bağlantı paylaşımı", "Etkinlik ve Wi-Fi bilgisi", "Basılı materyal hazırlama"], en: ["Sharing links", "Event and Wi-Fi details", "Preparing printed material"] },
    steps: { tr: ["QR koda dönüştürülecek metin veya URL'yi girin.", "Oluşan kodu ikinci bir cihazla test edin.", "Kullanım amacına göre PNG veya SVG indirin."], en: ["Enter the text or URL to encode.", "Test the generated code with a second device.", "Download PNG or SVG for your intended medium."] },
  },
  {
    slug: "cron-ifadesi-aciklayici", category: "data", mark: "27",
    title: { tr: "Cron İfadesi Açıklayıcı", en: "Cron Expression Explainer" },
    short: { tr: "Beş alanlı klasik cron ifadelerini doğrulayıp insan dilinde açıklayın.", en: "Validate classic five-field cron expressions and explain them in plain language." },
    description: { tr: "Dakika, saat, ayın günü, ay ve haftanın günü alanlarını ayrı ayrı doğrular; yaygın ifadeleri kısa bir zamanlama cümlesine dönüştürür. Sunucu saat diliminin ayrıca kontrol edilmesi gerektiğini hatırlatır.", en: "Validates minute, hour, day-of-month, month, and day-of-week fields and turns common expressions into a short schedule. It also reminds you to verify the server time zone." },
    useCases: { tr: ["CI/CD zamanlaması", "Yedekleme görevi kontrolü", "Sunucu işi dokümantasyonu"], en: ["CI/CD schedules", "Checking backup jobs", "Documenting server tasks"] },
    steps: { tr: ["Beş alanlı cron ifadesini yapıştırın.", "Her alanın geçerli aralığını ve açıklamasını inceleyin.", "Canlı ortamda sunucu saat dilimini ayrıca doğrulayın."], en: ["Paste a five-field cron expression.", "Review the validation and explanation for every field.", "Verify the server time zone separately before production use."] },
  },
  {
    slug: "exif-meta-veri-temizleyici", category: "security", mark: "28",
    title: { tr: "EXIF / Meta Veri Temizleyici", en: "EXIF / Metadata Cleaner" },
    short: { tr: "JPEG ve PNG görsellerdeki hassas metadatayı yerel olarak okuyup temiz bir kopya indirin.", en: "Inspect sensitive JPEG and PNG metadata locally and download a clean copy." },
    description: { tr: "Seçtiğiniz JPEG veya PNG dosyasındaki cihaz, tarih, yazılım, GPS ve metin metadata alanlarını tarayıcıda inceler. Görseli canvas üzerinde yeniden kodlayarak metadata içermeyen yeni bir kopya üretir; dosya sunucuya yüklenmez.", en: "Inspects device, date, software, GPS, and text metadata in a selected JPEG or PNG inside the browser. It re-encodes pixels through canvas to create a clean copy; the file is never uploaded to a server." },
    useCases: { tr: ["Fotoğraf paylaşımı öncesi gizlilik", "Destek kaydı ekran görüntüsü", "Yayınlanacak görsel temizliği"], en: ["Privacy before photo sharing", "Support-ticket screenshots", "Cleaning images before publication"] },
    steps: { tr: ["En fazla 25 MB JPEG veya PNG dosyasını cihazınızdan seçin.", "Bulunan metadata alanlarını ve görsel boyutunu inceleyin.", "Temiz kopyayı üretip indirin; gerekirse indirdiğiniz dosyayı yeniden tarayın."], en: ["Select a JPEG or PNG up to 25 MB from your device.", "Review detected metadata and image dimensions.", "Generate and download the clean copy, then re-scan it if needed."] },
  },
  {
    slug: "sifre-gucu-testi", category: "security", mark: "29",
    title: { tr: "Şifre Gücü Test Aracı", en: "Password Strength Tester" },
    short: { tr: "Uzunluk, çeşitlilik, tahmini entropi ve kırılma süresi üzerinden parolanızı değerlendirin.", en: "Assess a password using length, variety, estimated entropy, and crack time." },
    description: { tr: "Parola uzunluğu, karakter havuzu, tekrarlar ve yaygın örüntüler üzerinden açıklanabilir bir güç tahmini üretir. Parola yalnızca tarayıcı belleğinde kalır; araç sızıntı veritabanı sorgusu yapmaz ve kesin güvenlik garantisi vermez.", en: "Produces an explainable estimate from password length, character pool, repetition, and common patterns. The password remains in browser memory; no breach database is queried and no absolute security guarantee is made." },
    useCases: { tr: ["Yeni parola ön kontrolü", "Parola politikası eğitimi", "Uzunluk ve çeşitlilik karşılaştırması"], en: ["Pre-checking a new password", "Password-policy education", "Comparing length and character variety"] },
    steps: { tr: ["Gerçek parolanızı paylaşılan cihazda girmeyin; mümkünse benzer bir örnek kullanın.", "Güç seviyesi, entropi ve uyarıları inceleyin.", "Kısa veya tahmin edilebilir yapıyı daha uzun benzersiz bir parola cümlesiyle değiştirin."], en: ["Avoid entering a real password on a shared device; use a representative sample when possible.", "Review the strength level, entropy estimate, and warnings.", "Replace short or predictable structure with a longer unique passphrase."] },
  },
];

const relatedBySlug: Record<string, string[]> = {
  "prompt-kalite-denetimi": ["meta-prompt-olusturucu", "few-shot-ornek-olusturucu", "sistem-promptu-persona-sablonu"],
  "meta-prompt-olusturucu": ["sistem-promptu-persona-sablonu", "few-shot-ornek-olusturucu", "prompt-kalite-denetimi"],
  "few-shot-ornek-olusturucu": ["sistem-promptu-persona-sablonu", "meta-prompt-olusturucu", "token-sayaci"],
  "sistem-promptu-persona-sablonu": ["prompt-kalite-denetimi", "few-shot-ornek-olusturucu", "meta-prompt-olusturucu"],
  "metin-benzerlik-analizi": ["metin-farki-diff", "okunabilirlik-analizi", "kelime-sayaci"],
  "metin-farki-diff": ["metin-benzerlik-analizi", "markdown-onizleyici", "metin-temizleyici"],
  "markdown-onizleyici": ["metin-farki-diff", "metin-temizleyici", "kelime-sayaci"],
  "json-bicimlendirici": ["json-csv-donusturucu", "jwt-decoder", "base64-kodlayici"],
  "json-csv-donusturucu": ["json-bicimlendirici", "csv-inceleyici", "base64-kodlayici"],
  "jwt-decoder": ["base64-kodlayici", "unix-zaman-damgasi-donusturucu", "json-bicimlendirici"],
  "unix-zaman-damgasi-donusturucu": ["jwt-decoder", "cron-ifadesi-aciklayici", "json-bicimlendirici"],
  "renk-donusturucu": ["qr-kod-olusturucu", "base64-kodlayici", "url-kodlayici"],
  "qr-kod-olusturucu": ["url-kodlayici", "renk-donusturucu", "base64-kodlayici"],
  "cron-ifadesi-aciklayici": ["unix-zaman-damgasi-donusturucu", "regex-test-araci", "json-bicimlendirici"],
  "exif-meta-veri-temizleyici": ["kvkk-veri-maskeleyici", "sha256-ozet-uretici", "sifre-gucu-testi"],
  "sifre-gucu-testi": ["guclu-parola-uretici", "sha256-ozet-uretici", "exif-meta-veri-temizleyici"],
  "guclu-parola-uretici": ["sifre-gucu-testi", "sha256-ozet-uretici", "uuid-uretici"],
};

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(tool: Tool, limit = 3) {
  const preferred = (relatedBySlug[tool.slug] ?? [])
    .map((slug) => getTool(slug))
    .filter((item): item is Tool => Boolean(item));
  const fallback = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug && !preferred.some((candidate) => candidate.slug === item.slug));
  return [...preferred, ...fallback].slice(0, limit);
}
