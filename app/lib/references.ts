import type { Locale } from "./site";
type SourceReferenceLocale = "tr" | "en";
export type ReferenceLocale = Locale;

export type ReferenceEntry = { expression: string; meaning: Record<SourceReferenceLocale, string>; example?: string };
export type ReferenceGuide = {
  slug: string;
  title: Record<SourceReferenceLocale, string>;
  description: Record<SourceReferenceLocale, string>;
  intro: Record<SourceReferenceLocale, string>;
  toolSlug: string;
  sections: { title: Record<SourceReferenceLocale, string>; entries: ReferenceEntry[] }[];
  faq: { question: Record<SourceReferenceLocale, string>; answer: Record<SourceReferenceLocale, string> }[];
};

export type ReferenceCopy = {
  title: string;
  description: string;
  intro: string;
  sections: { title: string; entries: { expression: string; meaning: string; example?: string }[] }[];
  faq: { question: string; answer: string }[];
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

type AdditionalCopy = Omit<ReferenceCopy, "sections"> & { sectionTitles: string[]; meanings: string[][] };

const additionalCopy: Record<"de" | "zh", Record<string, AdditionalCopy>> = {
  de: {
    "regex-cheat-sheet": {
      title: "Regex Cheat Sheet: Muster, Flags und sichere Tests",
      description: "Praxisreferenz zu Zeichenklassen, Gruppen, Grenzen, Quantifizierern und Flags regulärer JavaScript-Ausdrücke.",
      intro: "Diese Kurzreferenz gilt für die JavaScript-Regex-Syntax. Eine Übereinstimmung beweist weder Echtheit noch Vertrauenswürdigkeit einer Eingabe. E-Mail-, Identitäts-, URL- und Sicherheitsprüfungen benötigen zusätzlich Fachregeln und serverseitige Validierung.",
      sectionTitles: ["Grundbausteine", "Wiederholung und Gruppierung", "JavaScript-Flags"],
      meanings: [
        ["Ein beliebiges Zeichen außer Zeilenumbruch", "Ziffer / Nicht-Ziffer", "ASCII-Wortzeichen / Umkehrung", "Bereich / negierte Zeichenklasse", "Anfang / Ende von Eingabe oder Zeile"],
        ["Null-oder-mehr / eins-oder-mehr / optional", "Exakte oder begrenzte Wiederholung", "Erfassende / nicht erfassende Gruppe", "Benannte Erfassungsgruppe", "Positive / negative Vorwärtssuche"],
        ["Alle Treffer finden, nicht beim ersten stoppen", "Groß-/Kleinschreibung ignorieren", "^ und $ zeilenweise anwenden", ". darf Zeilenumbrüche erfassen", "Unicode-Modi; Engine-Unterstützung prüfen"],
      ],
      faq: [
        { question: "Kann Regex eine E-Mail-Adresse validieren?", answer: "Regex prüft nur einen Formatkandidaten. Zustellbarkeit und Besitz erfordern eine Bestätigungs-E-Mail." },
        { question: "Was ist ein ReDoS-Risiko?", answer: "Schlecht entworfene verschachtelte Quantifizierer können extremes Backtracking auslösen. Begrenzen Sie Eingaben, testen Sie Muster und isolieren Sie nicht vertrauenswürdige Ausdrücke." },
      ],
    },
    "cron-cheat-sheet": {
      title: "Cron Cheat Sheet: Leitfaden für fünf Felder",
      description: "Praxisreferenz zu klassischen Cron-Feldern, Platzhaltern, Bereichen, Listen, Schritten und sicherem Betrieb.",
      intro: "Diese Seite verwendet das klassische Cron-Format mit fünf Feldern: Minute, Stunde, Monatstag, Monat und Wochentag. Quartz, systemd und Cloud-Scheduler können abweichen. Die Erklärung ist nur eine Vorprüfung; prüfen Sie Engine, Zeitzone und nächste Ausführungszeiten im Zielsystem.",
      sectionTitles: ["Felder", "Häufige Zeitpläne", "Betriebliche Kontrollen"],
      meanings: [
        ["0–59", "0–23", "1–31", "1–12", "Meist 0–7; Sonntag ist 0 oder 7"],
        ["Jede Minute", "Alle 15 Minuten", "Täglich um 03:00", "Montag bis Freitag um 09:30", "Am ersten Tag jedes Monats um 00:00", "Täglich um 06:00 und 18:00"],
        ["Im Cron-Text unsichtbar; Scheduler-Konfiguration dokumentieren", "Lokale Jobs können ausfallen oder doppelt laufen", "Doppelte Ausführungen sicher beherrschen", "Geplanten/tatsächlichen Start und Ergebnis protokollieren"],
      ],
      faq: [
        { question: "Enthält ein Cron-Ausdruck eine Zeitzone?", answer: "Das klassische Fünf-Felder-Format nicht. Zeitzone und Sommerzeit kommen aus Daemon-, Container- oder Plattformkonfiguration." },
        { question: "Wie wirken Monatstag und Wochentag zusammen?", answer: "Engines unterscheiden sich; manche starten, wenn eines der Felder passt. Prüfen Sie die Dokumentation und die nächsten Läufe der Produktions-Engine." },
      ],
    },
  },
  zh: {
    "regex-cheat-sheet": {
      title: "正则表达式速查表：模式、标志与安全测试",
      description: "通过示例掌握 JavaScript 正则表达式的字符类、分组、边界、量词和标志。",
      intro: "本速查表面向 JavaScript 正则语法。匹配成功并不能证明输入真实或可信；电子邮件、身份、URL 与安全检查仍需业务规则和服务端验证。",
      sectionTitles: ["核心构件", "重复与分组", "JavaScript 标志"],
      meanings: [
        ["除换行符外的任意单个字符", "数字 / 非数字", "ASCII 单词字符 / 其反集", "范围 / 否定字符类", "输入或行的开头 / 结尾"],
        ["零次或多次 / 一次或多次 / 可选", "精确次数或范围重复", "捕获组 / 非捕获组", "命名捕获组", "正向 / 负向先行断言"],
        ["查找全部匹配，而非在首个匹配处停止", "忽略大小写", "让 ^ 与 $ 按行生效", "允许 . 匹配换行符", "Unicode 模式；请检查引擎支持"],
      ],
      faq: [
        { question: "正则表达式能验证电子邮件地址吗？", answer: "正则只能检查候选格式。可送达性和所有权仍需要验证邮件。" },
        { question: "什么是 ReDoS 风险？", answer: "设计不当的嵌套量词可能造成大量回溯。请限制输入、测试模式，并隔离不受信任的表达式。" },
      ],
    },
    "cron-cheat-sheet": {
      title: "Cron 速查表：五字段调度指南",
      description: "通过示例了解经典 Cron 字段、通配符、范围、列表、步长和生产安全。",
      intro: "本页采用经典五字段 Cron：分钟、小时、月中日期、月份、星期。Quartz、systemd 和云调度器可能使用不同语法。本解释仅用于预检查；请在目标系统中核验实际引擎、时区与后续运行时间。",
      sectionTitles: ["字段", "常见调度", "运行检查"],
      meanings: [
        ["0–59", "0–23", "1–31", "1–12", "通常为 0–7；星期日可为 0 或 7"],
        ["每分钟", "每 15 分钟", "每天 03:00", "周一至周五 09:30", "每月第一天 00:00", "每天 06:00 与 18:00"],
        ["Cron 文本中不可见；请记录调度器配置", "本地时间任务可能跳过或重复", "确保重复触发仍然安全", "记录计划/实际开始时间与结果"],
      ],
      faq: [
        { question: "Cron 表达式包含时区吗？", answer: "经典五字段表达式不包含时区。时区由守护进程、容器或平台配置提供。" },
        { question: "月中日期和星期字段如何共同生效？", answer: "不同引擎的语义可能不同；有些引擎任一字段匹配就会运行。请检查生产引擎文档与后续运行时间。" },
      ],
    },
  },
};

export function getReference(slug: string) { return references.find((item) => item.slug === slug); }
export function referenceCopy(guide: ReferenceGuide, locale: ReferenceLocale): ReferenceCopy {
  if (locale === "tr" || locale === "en") return {
    title: guide.title[locale],
    description: guide.description[locale],
    intro: guide.intro[locale],
    sections: guide.sections.map((section) => ({ title: section.title[locale], entries: section.entries.map((entry) => ({ expression: entry.expression, meaning: entry.meaning[locale], example: entry.example })) })),
    faq: guide.faq.map((item) => ({ question: item.question[locale], answer: item.answer[locale] })),
  };
  const copy = additionalCopy[locale][guide.slug];
  if (!copy) throw new Error(`Missing ${locale} reference copy for ${guide.slug}`);
  return {
    title: copy.title,
    description: copy.description,
    intro: copy.intro,
    sections: guide.sections.map((section, sectionIndex) => ({
      title: copy.sectionTitles[sectionIndex],
      entries: section.entries.map((entry, entryIndex) => ({ expression: entry.expression, meaning: copy.meanings[sectionIndex][entryIndex], example: entry.example })),
    })),
    faq: copy.faq,
  };
}
export function referencePath(locale: Locale, slug: string) { return locale === "tr" ? `/referanslar/${slug}` : `/${locale}/references/${slug}`; }
