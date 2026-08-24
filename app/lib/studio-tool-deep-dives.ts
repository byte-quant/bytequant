import type { Locale } from "./site";
import { studioTools } from "./studio-tools";
import { studioToolGuidance } from "./studio-tool-guidance";
import type { ToolDeepDive } from "./tool-deep-dives";

type L = Record<Locale, string>;
const l = (tr: string, en: string, de: string, zh: string): L => ({ tr, en, de, zh });

const fixtures: Record<string, L> = {
  "retry-after-geri-cekilme-planlayici": l(
    "GET, 429, Retry-After 8 saniye, 5 deneme, 500 ms taban, 30.000 ms üst sınır ve %20 jitter girin; ardından yöntemi POST yaparak durma uyarısını karşılaştırın.",
    "Enter GET, 429, Retry-After 8 seconds, 5 attempts, a 500 ms base, 30,000 ms cap, and 20% jitter; then switch to POST and compare the stop warning.",
    "GET, 429, Retry-After 8 Sekunden, 5 Versuche, 500 ms Basis, 30.000 ms Obergrenze und 20 % Jitter eingeben; danach POST wählen und Warnung vergleichen.",
    "输入 GET、429、Retry-After 8 秒、5 次尝试、500 毫秒基础延迟、30000 毫秒上限和 20% 抖动；再切换为 POST 比较停止警告。",
  ),
  "webhook-teslim-gunlugu-analizoru": l(
    "`09:00:00Z|evt_101|500|420|1` ve üç saniye sonraki `evt_101|200|180|2` satırlarını; ayrıca aynı olay için ikinci bir 200 ve sırası geriye giden bir kayıt ekleyerek deneyin.",
    "Use `09:00:00Z|evt_101|500|420|1` followed three seconds later by `evt_101|200|180|2`; then add a second 200 and an out-of-order record for the same event.",
    "`09:00:00Z|evt_101|500|420|1` und drei Sekunden später `evt_101|200|180|2` verwenden; danach einen zweiten 200-Erfolg und eine ungeordnete Zeile ergänzen.",
    "先输入 `09:00:00Z|evt_101|500|420|1`，三秒后输入 `evt_101|200|180|2`；再为同一事件加入第二个 200 与一条乱序记录。",
  ),
  "aria-erisebilir-ad-envanteri": l(
    "Metinli bir bağlantı, `aria-label` kullanan ikon düğmesi, bağlı `label` içeren e-posta alanı ve adı olmayan ikinci ikon düğmesi bulunan küçük HTML örneğini tarayın.",
    "Scan a small HTML sample containing a text link, an icon button with `aria-label`, an email field with an associated `label`, and a second unnamed icon button.",
    "Ein kleines HTML-Beispiel mit Textlink, Icon-Button samt `aria-label`, E-Mail-Feld mit zugeordnetem `label` und zweitem unbenannten Icon-Button prüfen.",
    "扫描一个小型 HTML 示例，其中包含文本链接、带 `aria-label` 的图标按钮、有关联 `label` 的邮箱字段，以及第二个无名称图标按钮。",
  ),
  "html-dil-baslik-yapisi-denetleyici": l(
    "`lang=tr`, açıklayıcı title ve meta description, bir H1, ardından H2 ve H3 içeren örneği çalıştırın; sonra lang değerini ve H2'yi kaldırarak iki hata yolunu görün.",
    "Run a sample with `lang=en`, a descriptive title and meta description, one H1 followed by H2 and H3; then remove lang and H2 to expose two failure paths.",
    "Ein Beispiel mit `lang=de`, beschreibendem title und Meta-Text, einem H1 sowie H2/H3 prüfen; danach lang und H2 entfernen, um zwei Fehlerwege zu sehen.",
    "运行包含 `lang=zh`、描述性 title 与 meta description、一个 H1 以及 H2/H3 的示例；随后移除 lang 和 H2，观察两个失败路径。",
  ),
  "sitemap-url-kume-analizoru": l(
    "Aynı araç için tr/en/de/zh HTTPS URL'lerini, bir `http` kopyasını, `utm_source` sorgulu bir URL'yi ve beklenmeyen `www` hostunu aynı listeye ekleyin.",
    "List tr/en/de/zh HTTPS URLs for one tool together with an `http` copy, a URL containing `utm_source`, and an unexpected `www` host.",
    "Für ein Werkzeug tr/en/de/zh-HTTPS-URLs zusammen mit einer `http`-Kopie, einer URL mit `utm_source` und unerwartetem `www`-Host eingeben.",
    "为同一工具列出 tr/en/de/zh HTTPS URL，并加入一个 `http` 副本、一个带 `utm_source` 的 URL 与意外的 `www` 主机。",
  ),
  "robots-meta-politikasi-olusturucu": l(
    "Önce index, follow, archive, büyük görsel ve 180 karakter snippet seçin; sonra index seçimini kapatıp önizleme direktiflerinin neden sonuçtan çıkarıldığını inceleyin.",
    "First allow index, follow, archive, large images, and a 180-character snippet; then disable indexing and inspect why preview directives disappear from the result.",
    "Zuerst index, follow, archive, große Bilder und 180 Zeichen Snippet wählen; danach Indexierung ausschalten und prüfen, warum Vorschau-Direktiven entfallen.",
    "先允许 index、follow、archive、大图预览与 180 字符摘要；再关闭索引，检查预览指令为何从结果中移除。",
  ),
  "eposta-konu-onizleme-denetleyici": l(
    "`Raporunuz hazır: bu hafta neler değişti?` konusunu ve farklı bilgi taşıyan preheader'ı deneyin; ardından aynı dört kelimeyle başlayan, tamamı büyük harf ve aşırı ünlemli bir varyantı karşılaştırın.",
    "Try `Your report is ready: what changed this week?` with a preheader that adds new information; then compare a repeated-opening, all-caps, excessive-exclamation variant.",
    "`Ihr Bericht ist fertig: Was hat sich geändert?` mit ergänzendem Preheader testen; danach eine Variante mit gleichem Beginn, Versalien und vielen Ausrufezeichen vergleichen.",
    "用“您的报告已就绪：本周有哪些变化？”和补充新信息的预标题测试；再比较开头重复、全大写且感叹号过多的版本。",
  ),
  "web-performans-butce-planlayici": l(
    "900 KB mobil bütçeye karşı HTML 42, CSS 68, JS 310, görsel 460, font 96 ve diğer 35 KB girin; sonra görsel boyutunu 300 KB azaltıp koruma payını karşılaştırın.",
    "Against a 900 KB mobile budget, enter HTML 42, CSS 68, JS 310, images 460, fonts 96, and other 35 KB; then reduce images by 300 KB and compare headroom.",
    "Bei 900 KB Mobilbudget HTML 42, CSS 68, JS 310, Bilder 460, Fonts 96 und Sonstiges 35 KB eingeben; danach Bilder um 300 KB reduzieren und Reserve vergleichen.",
    "以 900 KB 移动预算为基准，输入 HTML 42、CSS 68、JS 310、图片 460、字体 96、其他 35 KB；再把图片减少 300 KB 比较余量。",
  ),
  "yedekleme-3-2-1-hazirlik-denetleyici": l(
    "3 güncel kopya, 2 ortam, uzak kopya ve şifreleme seçin; son geri yüklemeyi 30 gün önce, RTO'yu 4 saat girin. Sonra ortamı 1'e indirip geri yükleme tarihini 120 gün geriye alın.",
    "Select 3 current copies, 2 media types, off-site copy, and encryption; set the last restore to 30 days ago and RTO to 4 hours. Then reduce media to 1 and move the restore date back 120 days.",
    "3 aktuelle Kopien, 2 Medientypen, Außer-Haus-Kopie und Verschlüsselung wählen; Restore vor 30 Tagen und RTO 4 Stunden setzen. Danach Medien auf 1 und Restore auf 120 Tage ändern.",
    "选择 3 个当前副本、2 种介质、异地副本与加密；最近恢复设为 30 天前，RTO 为 4 小时。再把介质降为 1，并把恢复日期改为 120 天前。",
  ),
  "surum-notu-degisiklik-derleyici": l(
    "`feat(agent)`, `fix(mobile)`, `perf(home)`, `security`, `docs` ve bir `BREAKING CHANGE` satırı girin; aynı düzeltmeyi ikinci kez ekleyerek yinelenen maddenin birleştiğini doğrulayın.",
    "Enter `feat(agent)`, `fix(mobile)`, `perf(home)`, `security`, `docs`, and one `BREAKING CHANGE` line; add the same fix twice to confirm duplicate merging.",
    "Zeilen für `feat(agent)`, `fix(mobile)`, `perf(home)`, `security`, `docs` und `BREAKING CHANGE` eingeben; dieselbe Korrektur doppelt ergänzen und Zusammenführung prüfen.",
    "输入 `feat(agent)`、`fix(mobile)`、`perf(home)`、`security`、`docs` 与一条 `BREAKING CHANGE`；再重复同一修复，确认重复项会合并。",
  ),
};

const prefix = {
  tr: { situation: "Pratik senaryo", evidence: "Kabul kaydı", retention: "Sonuç kartındaki sayılar ve uyarılar, kaydedilen örnekle birlikte saklanır.", failure: "Bu durumda yayınlamayın" },
  en: { situation: "Practical scenario", evidence: "Acceptance record", retention: "Keep the result-card metrics and warnings together with the retained example.", failure: "Do not publish in this state" },
  de: { situation: "Praxisszenario", evidence: "Abnahmenachweis", retention: "Kennzahlen und Warnungen der Ergebniskarte zusammen mit dem Testbeispiel aufbewahren.", failure: "In diesem Zustand nicht veröffentlichen" },
  zh: { situation: "实践场景", evidence: "验收记录", retention: "将结果卡中的指标与警告同保留的测试样本一起保存。", failure: "出现此状态时不要发布" },
} satisfies Record<Locale, { situation: string; evidence: string; retention: string; failure: string }>;

export const studioToolDeepDives = Object.fromEntries(studioTools.map((tool) => {
  const guidance = studioToolGuidance[tool.slug];
  const fixture = fixtures[tool.slug];
  const situation = Object.fromEntries((Object.keys(prefix) as Locale[]).map((locale) => {
    const useCases = tool.useCases[locale] ?? tool.useCases.en;
    const title = tool.title[locale] ?? tool.title.en;
    const short = tool.short[locale] ?? tool.short.en;
    return [locale, `${prefix[locale].situation}: ${useCases[0] ?? title}. ${short}`];
  })) as L;
  const evidence = Object.fromEntries((Object.keys(prefix) as Locale[]).map((locale) => [locale, `${prefix[locale].evidence}: ${guidance.verification[locale]}. ${prefix[locale].retention}`])) as L;
  const failure = Object.fromEntries((Object.keys(prefix) as Locale[]).map((locale) => [locale, `${prefix[locale].failure}: ${guidance.boundary[locale]}`])) as L;
  return [tool.slug, { situation, fixture, evidence, failure } satisfies ToolDeepDive];
})) as Record<string, ToolDeepDive>;

export const studioToolDeepDiveSlugs = Object.freeze(Object.keys(studioToolDeepDives));
