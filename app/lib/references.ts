import type { Locale } from "./site";

export type ReferenceEntry = { expression: string; meaning: Record<Locale, string>; example?: string };
export type ReferenceGuide = {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  intro: Record<Locale, string>;
  toolSlug: string;
  sections: { title: Record<Locale, string>; entries: ReferenceEntry[] }[];
  faq: { question: Record<Locale, string>; answer: Record<Locale, string> }[];
};

export const references: ReferenceGuide[] = [
  {
    slug: "regex-cheat-sheet", toolSlug: "regex-test-araci",
    title: { tr: "Regex Cheat Sheet: Kalıplar, Bayraklar ve Güvenli Test", en: "Regex Cheat Sheet: Patterns, Flags, and Safer Testing" },
    description: { tr: "JavaScript düzenli ifadelerinde karakter sınıfları, gruplar, sınırlar, niceleyiciler ve bayraklar için örnekli başvuru.", en: "An example-driven reference to JavaScript regular-expression classes, groups, boundaries, quantifiers, and flags." },
    intro: { tr: "Bu hızlı başvuru JavaScript regex sözdizimini esas alır. Bir kalıbın eşleşmesi, girdinin gerçek veya güvenilir olduğunu kanıtlamaz; e-posta, kimlik, URL ve güvenlik kontrollerinde alan kuralları ile sunucu tarafı doğrulaması ayrıca gerekir.", en: "This quick reference targets JavaScript regex syntax. A pattern match does not prove that input is real or trustworthy; email, identity, URL, and security checks still need domain rules and server-side validation." },
    sections: [
      { title: { tr: "Temel yapı taşları", en: "Core building blocks" }, entries: [
        { expression: ".", meaning: { tr: "Satır sonu dışındaki tek karakter", en: "Any single character except a line break" }, example: "a.c" },
        { expression: "\\d / \\D", meaning: { tr: "Rakam / rakam olmayan", en: "Digit / non-digit" }, example: "\\d{4}" },
        { expression: "\\w / \\W", meaning: { tr: "ASCII sözcük karakteri / tersi", en: "ASCII word character / inverse" }, example: "\\w+" },
        { expression: "[a-z] / [^a-z]", meaning: { tr: "Aralık / olumsuz karakter sınıfı", en: "Range / negated character class" }, example: "[A-F0-9]" },
        { expression: "^ / $", meaning: { tr: "Girdi veya satır başlangıcı / sonu", en: "Start / end of input or line" }, example: "^OK$" },
      ] },
      { title: { tr: "Tekrar ve gruplama", en: "Repetition and grouping" }, entries: [
        { expression: "* / + / ?", meaning: { tr: "0+ / 1+ / isteğe bağlı", en: "Zero-or-more / one-or-more / optional" }, example: "https?" },
        { expression: "{n} / {n,m}", meaning: { tr: "Kesin veya aralıklı tekrar", en: "Exact or ranged repetition" }, example: "\\d{2,4}" },
        { expression: "(abc) / (?:abc)", meaning: { tr: "Yakalama / yakalamayan grup", en: "Capturing / non-capturing group" }, example: "(?:png|webp)" },
        { expression: "(?<name>...)", meaning: { tr: "Adlandırılmış yakalama grubu", en: "Named capture group" }, example: "(?<year>\\d{4})" },
        { expression: "(?=...) / (?!...)", meaning: { tr: "Olumlu / olumsuz ileri bakış", en: "Positive / negative lookahead" }, example: "\\d+(?=px)" },
      ] },
      { title: { tr: "JavaScript bayrakları", en: "JavaScript flags" }, entries: [
        { expression: "g", meaning: { tr: "İlk eşleşmede durma; tümünü bul", en: "Find all matches rather than stopping at the first" } },
        { expression: "i", meaning: { tr: "Büyük/küçük harf duyarsız", en: "Case-insensitive matching" } },
        { expression: "m", meaning: { tr: "^ ve $ işaretlerini satır bazında uygula", en: "Make ^ and $ operate per line" } },
        { expression: "s", meaning: { tr: ". karakterinin satır sonuyla eşleşmesine izin ver", en: "Allow . to match line breaks" } },
        { expression: "u / v", meaning: { tr: "Unicode kipleri; motor desteğini kontrol edin", en: "Unicode modes; check engine support" } },
      ] },
    ],
    faq: [
      { question: { tr: "Regex ile e-posta doğrulanır mı?", en: "Can regex validate an email address?" }, answer: { tr: "Regex yalnızca biçim adayını kontrol eder. Teslim edilebilirlik ve sahiplik için doğrulama e-postası gerekir.", en: "Regex checks only a format candidate. Deliverability and ownership require a verification email." } },
      { question: { tr: "ReDoS riski nedir?", en: "What is ReDoS risk?" }, answer: { tr: "Kötü tasarlanmış iç içe niceleyiciler bazı girdilerde aşırı geri izleme yaratabilir. Girdiyi sınırlayın, kalıbı test edin ve güvenilmeyen kalıpları izole edin.", en: "Poorly designed nested quantifiers can cause extreme backtracking. Bound input, test patterns, and isolate untrusted expressions." } },
    ],
  },
  {
    slug: "cron-cheat-sheet", toolSlug: "cron-ifadesi-aciklayici",
    title: { tr: "Cron Cheat Sheet: Beş Alanlı Zamanlama Rehberi", en: "Cron Cheat Sheet: Five-Field Scheduling Guide" },
    description: { tr: "Klasik cron alanları, jokerler, aralıklar, listeler, adımlar ve üretim güvenliği için örnekli başvuru.", en: "An example-driven reference to classic cron fields, wildcards, ranges, lists, steps, and production safety." },
    intro: { tr: "Bu sayfa beş alanlı klasik cron biçimini kullanır: dakika, saat, ayın günü, ay, haftanın günü. Quartz, systemd ve bazı bulut zamanlayıcıları farklı alan veya sözdizimi kullanabilir. Açıklama bir ön kontroldür; gerçek motor, saat dilimi ve sonraki çalışma zamanları ayrıca doğrulanmalıdır.", en: "This page uses classic five-field cron: minute, hour, day of month, month, day of week. Quartz, systemd, and cloud schedulers may differ. An explanation is only a preflight; verify the actual engine, time zone, and next run times." },
    sections: [
      { title: { tr: "Alanlar", en: "Fields" }, entries: [
        { expression: "1 · dakika", meaning: { tr: "0–59", en: "0–59" }, example: "0" },
        { expression: "2 · saat", meaning: { tr: "0–23", en: "0–23" }, example: "3" },
        { expression: "3 · ayın günü", meaning: { tr: "1–31", en: "1–31" }, example: "1" },
        { expression: "4 · ay", meaning: { tr: "1–12", en: "1–12" }, example: "1,6,12" },
        { expression: "5 · haftanın günü", meaning: { tr: "Genellikle 0–7; Pazar 0 veya 7", en: "Usually 0–7; Sunday is 0 or 7" }, example: "1-5" },
      ] },
      { title: { tr: "Yaygın ifadeler", en: "Common schedules" }, entries: [
        { expression: "* * * * *", meaning: { tr: "Her dakika", en: "Every minute" } },
        { expression: "*/15 * * * *", meaning: { tr: "Her 15 dakikada bir", en: "Every 15 minutes" } },
        { expression: "0 3 * * *", meaning: { tr: "Her gün 03:00", en: "Every day at 03:00" } },
        { expression: "30 9 * * 1-5", meaning: { tr: "Pazartesi–cuma 09:30", en: "Monday–Friday at 09:30" } },
        { expression: "0 0 1 * *", meaning: { tr: "Her ayın ilk günü 00:00", en: "First day of every month at 00:00" } },
        { expression: "0 6,18 * * *", meaning: { tr: "Her gün 06:00 ve 18:00", en: "Every day at 06:00 and 18:00" } },
      ] },
      { title: { tr: "Operasyon kontrolü", en: "Operational checks" }, entries: [
        { expression: "Saat dilimi", meaning: { tr: "Cron metninde görünmez; zamanlayıcı yapılandırmasını kaydedin", en: "Not visible in cron text; record scheduler configuration" } },
        { expression: "DST", meaning: { tr: "Yerel saat görevleri atlanabilir veya iki kez çalışabilir", en: "Local-time jobs may be skipped or duplicated" } },
        { expression: "İdempotency", meaning: { tr: "Tekrarlanan tetiklemeyi güvenli kılın", en: "Make duplicate triggers safe" } },
        { expression: "Gözlemlenebilirlik", meaning: { tr: "Planlanan/gerçek başlangıç ve sonucu loglayın", en: "Log scheduled/actual start and outcome" } },
      ] },
    ],
    faq: [
      { question: { tr: "Cron ifadesi saat dilimini içerir mi?", en: "Does a cron expression include a time zone?" }, answer: { tr: "Klasik beş alanlı ifade içermez. Saat dilimi daemon, konteyner veya platform yapılandırmasından gelir.", en: "Classic five-field cron does not. The daemon, container, or platform configuration supplies it." } },
      { question: { tr: "Ayın günü ve haftanın günü birlikte nasıl çalışır?", en: "How do day-of-month and day-of-week interact?" }, answer: { tr: "Motorlar farklı semantik kullanabilir; bazıları ikisinden biri eşleşince çalışır. Üretim motorunun belgesini ve sonraki çalışmaları kontrol edin.", en: "Engines differ; some run when either field matches. Check production-engine documentation and upcoming runs." } },
    ],
  },
];

export function getReference(slug: string) { return references.find((item) => item.slug === slug); }
export function referencePath(locale: Locale, slug: string) { return locale === "tr" ? `/referanslar/${slug}` : `/en/references/${slug}`; }
