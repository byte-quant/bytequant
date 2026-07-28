"use client";

import { useMemo, useState } from "react";
import type { Locale } from "../lib/site";
import type { NewsItem } from "../lib/generated-news";

const copy = {
  tr: { all: "Tümü", savedOnly: "Kaydedilenler", science: "Bilim", technology: "Teknoloji ve AI", security: "Siber güvenlik", standards: "Standartlar", search: "Konu, başlık veya kaynak ara", save: "Kaydet", saved: "Kaydedildi", share: "Paylaş", open: "Resmî kaynağı aç", more: "Daha fazla göster", empty: "Bu seçimde bir güncelleme bulunamadı.", local: "Kaydetme ve okundu bilgisi yalnızca bu cihazda tutulur.", sourceFilter: "Kaynak", allSources: "Tüm kaynaklar", showing: "sonuç", quick: "30 saniyelik okuma", why: "Neden önemli olabilir?", verify: "Neyi kontrol etmelisiniz?", sourceBrief: "Kaynağın yayımladığı kısa özet", sourceNote: "Bu bölüm yalnızca yeniden kullanım koşulları izin veren resmî akışlarda gösterilir. Bağlam ve güncel sürüm için kaynağı açın.", markReviewed: "Okudum", reviewed: "Okundu", terms: "Kısa sözlük", view: "Okuma görünümü", workflow: "Önce kısa açıklamayı okuyun, sonra kapsamı özgün kaynaktan doğrulayın." },
  en: { all: "All", savedOnly: "Saved", science: "Science", technology: "Technology & AI", security: "Cybersecurity", standards: "Standards", search: "Search a topic, title, or source", save: "Save", saved: "Saved", share: "Share", open: "Open official source", more: "Show more", empty: "No update matches this selection.", local: "Saved and read status stays only on this device.", sourceFilter: "Source", allSources: "All sources", showing: "results", quick: "30-second read", why: "Why might this matter?", verify: "What should you check?", sourceBrief: "Short summary published by the source", sourceNote: "This section appears only for official feeds whose reuse terms allow it. Open the source for context and the latest version.", markReviewed: "Mark read", reviewed: "Read", terms: "Quick glossary", view: "Reading view", workflow: "Read the plain-language note first, then verify scope at the original source." },
  de: { all: "Alle", savedOnly: "Gespeichert", science: "Wissenschaft", technology: "Technologie & KI", security: "Cybersicherheit", standards: "Standards", search: "Thema, Titel oder Quelle suchen", save: "Speichern", saved: "Gespeichert", share: "Teilen", open: "Offizielle Quelle öffnen", more: "Mehr anzeigen", empty: "Keine Meldung entspricht dieser Auswahl.", local: "Speicher- und Lesestatus bleiben nur auf diesem Gerät.", sourceFilter: "Quelle", allSources: "Alle Quellen", showing: "Ergebnisse", quick: "30-Sekunden-Überblick", why: "Warum könnte das wichtig sein?", verify: "Was sollten Sie prüfen?", sourceBrief: "Kurztext der Quelle", sourceNote: "Dieser Abschnitt erscheint nur bei offiziellen Feeds mit erlaubter Wiederverwendung. Für Kontext und aktuellen Stand die Quelle öffnen.", markReviewed: "Als gelesen", reviewed: "Gelesen", terms: "Kurzes Glossar", view: "Leseansicht", workflow: "Zuerst die verständliche Einordnung lesen, dann den Umfang an der Originalquelle prüfen." },
  zh: { all: "全部", savedOnly: "已收藏", science: "科学", technology: "技术与 AI", security: "网络安全", standards: "标准", search: "搜索主题、标题或来源", save: "收藏", saved: "已收藏", share: "分享", open: "打开官方来源", more: "显示更多", empty: "没有符合当前选择的动态。", local: "收藏与已读状态只保存在此设备。", sourceFilter: "来源", allSources: "全部来源", showing: "条结果", quick: "30 秒速读", why: "为什么可能重要？", verify: "需要核对什么？", sourceBrief: "来源发布的短摘要", sourceNote: "仅在官方 Feed 的复用条款允许时显示。请打开原始来源查看完整语境和最新版本。", markReviewed: "标记已读", reviewed: "已读", terms: "简明术语", view: "阅读视图", workflow: "先阅读通俗说明，再到原始来源核对适用范围。" },
} as const;

const insights = {
  tr: {
    science: { brief: "Bu, yeni bir araştırma sonucu, görev gelişmesi veya bilim kurumu duyurusudur.", why: "Yeni veri ya da yöntemler araştırma yönünü ve ileride kullanılan araçları etkileyebilir.", verify: ["Sonuç hakemli bir çalışma mı, kurum duyurusu mu?", "İnsan, laboratuvar veya simülasyon verisi mi?", "Belirsizlikler ve sınırlamalar neler?"] },
    technology: { brief: "Bu, bir teknoloji, yapay zekâ uygulaması veya kamu politikası güncellemesidir.", why: "Ürünlerin nasıl çalıştığını, kimlerin kullanabildiğini veya hangi kurallara tabi olduğunu değiştirebilir.", verify: ["Duyuru, çalışan bir ürün mü yoksa plan mı?", "Kimler ve hangi bölgeler için geçerli?", "Gizlilik, güvenlik ve maliyet sınırları neler?"] },
    security: { brief: "Bu, etkisi ve kapsamı ayrıca kontrol edilmesi gereken bir siber güvenlik duyurusudur.", why: "Kullandığınız bir ürün veya sürüm etkileniyorsa güncelleme ya da yapılandırma değişikliği gerekebilir.", verify: ["Hangi ürün ve sürümler etkileniyor?", "Aktif istismar kanıtı var mı?", "Resmî düzeltme ve geri alma adımı nedir?"] },
    standards: { brief: "Bu, ölçüm, standart veya teknik rehberlikte yapılan bir güncellemedir.", why: "Uyumluluk, test yöntemi veya teknik kararların dayanağı değişebilir.", verify: ["Belgenin sürümü ve yürürlük tarihi nedir?", "Zorunlu kural mı, isteğe bağlı rehber mi?", "Eski sürümle temel farklar neler?"] },
  },
  en: {
    science: { brief: "This is a research result, mission development, or science-agency announcement.", why: "New data or methods can shape research priorities and the tools people use next.", verify: ["Is it peer-reviewed research or an institutional announcement?", "Does it use human, laboratory, or simulation data?", "What uncertainties and limits are disclosed?"] },
    technology: { brief: "This is a technology, AI application, or public-policy update.", why: "It may change how a product works, who can use it, or which rules apply.", verify: ["Is this a working release or a future plan?", "Which people and regions are in scope?", "What are the privacy, safety, and cost limits?"] },
    security: { brief: "This is a cybersecurity notice whose impact and scope need separate confirmation.", why: "If a product or version you use is affected, an update or configuration change may be needed.", verify: ["Which products and versions are affected?", "Is there evidence of active exploitation?", "What is the official fix and rollback path?"] },
    standards: { brief: "This is an update to measurement, standards, or technical guidance.", why: "The basis for compliance, testing, or technical decisions may change.", verify: ["What is the document version and effective date?", "Is it a requirement or optional guidance?", "What materially changed from the previous version?"] },
  },
  de: {
    science: { brief: "Dies ist ein Forschungsergebnis, eine Missionsentwicklung oder Meldung einer Wissenschaftsbehörde.", why: "Neue Daten oder Methoden können Forschungsschwerpunkte und künftige Werkzeuge beeinflussen.", verify: ["Begutachtete Studie oder institutionelle Meldung?", "Menschen-, Labor- oder Simulationsdaten?", "Welche Unsicherheiten und Grenzen werden genannt?"] },
    technology: { brief: "Dies ist eine Technik-, KI-Anwendungs- oder Politikmeldung.", why: "Sie kann Funktionsweise, Zugang oder geltende Regeln eines Produkts verändern.", verify: ["Funktionierende Veröffentlichung oder Zukunftsplan?", "Für welche Personen und Regionen gilt sie?", "Welche Datenschutz-, Sicherheits- und Kostengrenzen gibt es?"] },
    security: { brief: "Dies ist eine Sicherheitsmeldung, deren Wirkung und Umfang gesondert bestätigt werden müssen.", why: "Bei betroffenen Produkten oder Versionen kann ein Update oder eine Konfigurationsänderung nötig sein.", verify: ["Welche Produkte und Versionen sind betroffen?", "Gibt es Hinweise auf aktive Ausnutzung?", "Wie lauten offizielle Abhilfe und Rücknahme?"] },
    standards: { brief: "Dies ist eine Aktualisierung zu Messung, Standards oder technischer Anleitung.", why: "Grundlagen für Konformität, Tests oder technische Entscheidungen können sich ändern.", verify: ["Version und Gültigkeitsdatum?", "Pflicht oder freiwillige Anleitung?", "Was änderte sich wesentlich zur Vorversion?"] },
  },
  zh: {
    science: { brief: "这是一项研究成果、任务进展或科学机构公告。", why: "新数据或新方法可能影响研究方向与今后使用的工具。", verify: ["这是同行评审研究还是机构公告？", "使用的是人体、实验室还是模拟数据？", "说明了哪些不确定性和限制？"] },
    technology: { brief: "这是一项技术、AI 应用或公共政策动态。", why: "它可能改变产品的工作方式、适用人群或相关规则。", verify: ["这是可用产品还是未来计划？", "适用于哪些人群和地区？", "隐私、安全和成本限制是什么？"] },
    security: { brief: "这是一项需要单独核实影响和范围的网络安全公告。", why: "如果您使用的产品或版本受影响，可能需要更新或调整配置。", verify: ["哪些产品和版本受影响？", "是否存在正在被利用的证据？", "官方修复与回退步骤是什么？"] },
    standards: { brief: "这是一项测量、标准或技术指南更新。", why: "合规、测试或技术决策的依据可能发生变化。", verify: ["文档版本和生效日期是什么？", "这是强制要求还是可选指南？", "与上一版本相比有哪些实质变化？"] },
  },
} as const;

const glossary = [
  { pattern: /\bAI\b|artificial intelligence/i, terms: { tr: "AI · bilgisayarların örüntü bulmasını sağlayan yöntemler", en: "AI · methods that let computers find patterns", de: "KI · Methoden, mit denen Computer Muster erkennen", zh: "AI · 让计算机识别模式的方法" } },
  { pattern: /quantum/i, terms: { tr: "Kuantum · atom ölçeğindeki fizik kurallarını kullanan yaklaşım", en: "Quantum · an approach using physics at atomic scales", de: "Quanten · Ansatz mit Physik auf atomarer Skala", zh: "量子 · 利用原子尺度物理规律的方法" } },
  { pattern: /cyber|vulnerab|exploit|malware/i, terms: { tr: "Siber risk · yazılım veya sistem güvenliğini etkileyen durum", en: "Cyber risk · a condition affecting software or system safety", de: "Cyberrisiko · Zustand mit Wirkung auf Software- oder Systemsicherheit", zh: "网络风险 · 影响软件或系统安全的情况" } },
  { pattern: /standard|measurement|framework/i, terms: { tr: "Standart · ortak test veya uygulama ölçütü", en: "Standard · a shared test or implementation reference", de: "Standard · gemeinsame Prüf- oder Umsetzungsgrundlage", zh: "标准 · 共同的测试或实施依据" } },
] as const;

const key = "bytequant:news-favorites:v2";
const reviewedKey = "bytequant:news-reviewed:v2";

export function NewsFeedClient({ locale, items }: { locale: Locale; items: NewsItem[] }) {
  const t = copy[locale];
  const [category, setCategory] = useState<"all" | NewsItem["category"]>("all");
  const [source, setSource] = useState<"all" | NewsItem["source"]>("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(12);
  const [favorites, setFavorites] = useState<string[]>(() => { if (typeof window === "undefined") return []; try { const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]"); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(-200) : []; } catch { return []; } });
  const [reviewed, setReviewed] = useState<string[]>(() => { if (typeof window === "undefined") return []; try { const parsed: unknown = JSON.parse(localStorage.getItem(reviewedKey) ?? "[]"); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(-200) : []; } catch { return []; } });
  const sources = useMemo(() => [...new Set(items.map((item) => item.source))], [items]);
  const filtered = useMemo(() => [...items]
    .filter((item) => category === "all" || item.category === category)
    .filter((item) => source === "all" || item.source === source)
    .filter((item) => !savedOnly || favorites.includes(item.id))
    .filter((item) => `${item.title} ${item.source} ${item.sourceSummary ?? ""}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((left, right) => Date.parse(right.date) - Date.parse(left.date) || left.source.localeCompare(right.source)), [category, favorites, items, query, savedOnly, source]);
  const visible = filtered.slice(0, limit);
  const filters: Array<[typeof category, string]> = [["all", t.all], ["science", t.science], ["technology", t.technology], ["security", t.security], ["standards", t.standards]];
  function toggle(field: "favorites" | "reviewed", id: string) { const setter = field === "favorites" ? setFavorites : setReviewed; const storage = field === "favorites" ? key : reviewedKey; setter((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-200); try { localStorage.setItem(storage, JSON.stringify(next)); } catch { /* optional preference */ } return next; }); }
  async function share(item: NewsItem) { if (navigator.share) { try { await navigator.share({ title: item.title, url: item.url }); return; } catch { return; } } try { await navigator.clipboard.writeText(`${item.title}\n${item.url}`); } catch { /* source link remains visible */ } }
  return <section className="news-feed" aria-label={t.view}>
    <div className="news-reader-head"><div><span className="kicker">{t.view}</span><h2>{t.workflow}</h2><small>◉ {t.local}</small></div><label><span aria-hidden="true">⌕</span><input type="search" value={query} placeholder={t.search} onChange={(event) => { setQuery(event.target.value); setLimit(12); }} /></label></div>
    <div className="news-controls"><div>{filters.map(([value, label]) => <button type="button" className={category === value && !savedOnly ? "active" : ""} key={value} onClick={() => { setCategory(value); setSavedOnly(false); setLimit(12); }}>{label}</button>)}<button type="button" className={savedOnly ? "active" : ""} onClick={() => { setSavedOnly(true); setLimit(12); }}>☆ {t.savedOnly} · {favorites.length}</button></div><span>{filtered.length} {t.showing}</span></div>
    <div className="news-source-row"><span>{t.sourceFilter}</span><button type="button" className={source === "all" ? "active" : ""} onClick={() => setSource("all")}>{t.allSources}</button>{sources.map((item) => <button type="button" className={source === item ? "active" : ""} key={item} onClick={() => setSource(item)}>{item}</button>)}</div>
    <div className="news-grid">{visible.map((item, index) => { const lens = insights[locale][item.category]; const terms = glossary.filter((entry) => entry.pattern.test(item.title)).map((entry) => entry.terms[locale]); return <article className={`${reviewed.includes(item.id) ? "reviewed" : ""}${index === 0 ? " featured" : ""}`} key={item.id}>
      <header><span>{t[item.category]}</span><small>{item.source} · {item.region === "uk" ? "UK" : "GLOBAL"}</small></header>
      <small className="news-original-label">{item.source} · {new Date(`${item.date}T12:00:00Z`).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</small>
      <h3 lang={item.sourceLanguage}>{item.title}</h3>
      {item.sourceSummary ? <section className="news-source-brief-prominent"><strong>{t.sourceBrief}</strong><p lang={item.sourceLanguage}>{item.sourceSummary}</p><small>{t.sourceNote}</small></section> : <section className="news-no-summary"><strong>{t.sourceBrief}</strong><p>{locale === "tr" ? "Bu kaydın yeniden yayımlanabilir bir kaynak özeti yok. ByteQuant başlıktan haber metni uydurmaz; ayrıntı için resmî kaynağı açın." : locale === "de" ? "Für diesen Eintrag liegt kein zur Wiederveröffentlichung freigegebener Kurztext vor. ByteQuant erfindet keinen Artikel aus der Überschrift; Details stehen in der offiziellen Quelle." : locale === "zh" ? "此记录没有可再发布的来源摘要。ByteQuant 不会根据标题虚构新闻正文；请打开官方来源查看详情。" : "This record has no source brief cleared for republication. ByteQuant does not invent an article from its headline; open the official source for detail."}</p></section>}
      <section className="news-action-context"><strong>{locale === "tr" ? "Bu kayıt ne tür bir güncelleme?" : locale === "de" ? "Welche Art von Meldung ist das?" : locale === "zh" ? "这是什么类型的动态？" : "What kind of update is this?"}</strong><p>{lens.brief}</p></section>
      <details className="news-checklist"><summary>{t.verify}<span>+</span></summary><ul>{lens.verify.map((entry) => <li key={entry}>✓ <span>{entry}</span></li>)}</ul></details>
      {terms.length > 0 && <details className="news-glossary"><summary>{t.terms}<span>+</span></summary>{terms.map((term) => <p key={term}>{term}</p>)}</details>}
      <footer><button type="button" className={favorites.includes(item.id) ? "active" : ""} aria-pressed={favorites.includes(item.id)} onClick={() => toggle("favorites", item.id)}>☆ {favorites.includes(item.id) ? t.saved : t.save}</button><button type="button" className={reviewed.includes(item.id) ? "active" : ""} aria-pressed={reviewed.includes(item.id)} onClick={() => toggle("reviewed", item.id)}>✓ {reviewed.includes(item.id) ? t.reviewed : t.markReviewed}</button><button type="button" onClick={() => void share(item)}>↗ {t.share}</button><a href={item.url} target="_blank" rel="noreferrer noopener">{t.open} ↗</a></footer>
    </article>; })}{!visible.length && <p className="news-empty">{t.empty}</p>}</div>
    {visible.length < filtered.length && <button className="news-more" type="button" onClick={() => setLimit((value) => value + 12)}>{t.more} ↓</button>}
  </section>;
}
