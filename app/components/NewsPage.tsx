import { newsGeneratedAt, newsItems } from "../lib/generated-news";
import { absoluteUrl, languageTag, organizationId, pathFor, type Locale } from "../lib/site";
import { NewsFeedClient } from "./NewsFeedClient";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

const copy = {
  tr: {
    eyebrow: "BYTEQUANT GÜNDEM", title: "Bilim, teknoloji ve güvenlikte gerçekten ne değişti?", intro: "Resmî kaynaklardan gelen güncel başlıkları tarih sırasıyla tarayın. Her karttaki kısa feed açıklamasını okuyun; kapsamı ve son durumu doğrudan resmî sayfada doğrulayın.", update: "Son kaynak taraması", sources: "resmî kaynak", records: "güncelleme", direct: "Kısa özeti okuyun, önemli olanı kaydedin ve ayrıntı için doğrudan resmî sayfaya gidin.",
    desk: "Bölgenizdeki resmî kaynaklar", deskIntro: "Yerel gelişmeleri kurumun kendi dili ve bağlamıyla izlemek için bu sayfaları açın. ByteQuant bu sayfaların içeriğini kopyalamaz.", method: "İçeriği nasıl hazırlıyoruz?", notes: ["Akışlar günlük otomatik derleme sırasında, izin verilen resmî HTTPS adreslerinden okunur; sayfa açılırken arka planda izleme yapılmaz.", "Başlık, tarih ve bağlantı kaynağa aittir. Feed açıklaması atıfla gösterilir ve telif sınırını korumak için en fazla 24 kelimeye kısaltılır.", "Açıklama yoksa yalnızca başlık ve kaynak metadatasına dayalı sınırlı bir not gösterilir; ByteQuant haber ayrıntısı uydurmaz, ücretli içeriği aşmaz veya makale gövdesini yeniden yayımlamaz.", "Bir içeriğin görünmesi onay veya yatırım/güvenlik tavsiyesi değildir. Karar öncesinde özgün kaynağı okuyun."],
  },
  en: {
    eyebrow: "BYTEQUANT UPDATES", title: "What actually changed in science, technology, and security?", intro: "Scan current official-source headlines in date order. Read the short feed description on every card, then verify scope and current status on the official page.", update: "Latest source scan", sources: "official sources", records: "updates", direct: "Read the brief, save what matters, and open the official page for detail.",
    desk: "Official sources for your region", deskIntro: "Open these pages to follow local developments in the institution’s own language and context. ByteQuant does not copy their pages.", method: "How this digest is prepared", notes: ["Feeds are read during the automated daily build from allowlisted official HTTPS endpoints; the page performs no background tracking.", "The source owns its title, date, and link. Feed descriptions are attributed and limited to 24 words to respect copyright boundaries.", "If a feed supplies no description, the card shows a limited note based only on headline and source metadata. ByteQuant does not invent reporting, bypass paid content, or republish article bodies.", "Inclusion is not an endorsement or investment/security advice. Read the original before making a decision."],
  },
  de: {
    eyebrow: "BYTEQUANT AKTUELL", title: "Was hat sich in Wissenschaft, Technik und Sicherheit wirklich geändert?", intro: "Aktuelle Überschriften offizieller Quellen nach Datum überblicken. Den kurzen Feed-Text jeder Karte lesen und Umfang sowie Stand auf der offiziellen Seite prüfen.", update: "Letzter Quellenabruf", sources: "offizielle Quellen", records: "Meldungen", direct: "Kurztext lesen, Wichtiges speichern und für Details die offizielle Seite öffnen.",
    desk: "Offizielle Quellen Ihrer Region", deskIntro: "Lokale Entwicklungen direkt in Sprache und Kontext der Institution verfolgen. ByteQuant kopiert diese Seiten nicht.", method: "So entsteht der Überblick", notes: ["Feeds werden beim automatischen täglichen Build von erlaubten offiziellen HTTPS-Adressen gelesen; die Seite verfolgt nichts im Hintergrund.", "Titel, Datum und Link gehören zur Quelle. Feed-Beschreibungen werden mit Quellenangabe gezeigt und auf 24 Wörter begrenzt.", "Fehlt eine Beschreibung, erscheint nur eine begrenzte Notiz aus Überschrift und Quellenmetadaten. ByteQuant erfindet keine Meldung, umgeht keine Bezahlinhalte und veröffentlicht keine Artikelkörper erneut.", "Aufnahme ist keine Empfehlung und keine Anlage- oder Sicherheitsberatung. Vor Entscheidungen die Originalquelle lesen."],
  },
  zh: {
    eyebrow: "BYTEQUANT 动态", title: "科学、技术与安全领域究竟发生了什么变化？", intro: "按日期浏览官方来源的最新标题。阅读每张卡片的简短 Feed 说明，并在官方网站核对范围与最新状态。", update: "最近来源扫描", sources: "个官方来源", records: "条动态", direct: "阅读简短摘要、收藏重要内容，再打开官方网站了解详情。",
    desk: "您所在地区的官方来源", deskIntro: "直接在机构自己的语言和语境中查看本地动态。ByteQuant 不复制这些页面。", method: "简报如何生成", notes: ["每日自动构建时读取白名单中的官方 HTTPS Feed；页面打开时不会后台跟踪。", "标题、日期和链接属于来源；Feed 说明会标注来源，并限制为最多 24 个词。", "若 Feed 没有说明，卡片只显示基于标题与来源元数据的受限备注。ByteQuant 不编造报道、不绕过付费内容，也不转载新闻正文。", "收录不代表背书，也不是投资或安全建议；做决定前请阅读原始来源。"],
  },
} as const;

const regionalSources = [
  { code: "TR", name: "TÜBİTAK Haberler", url: "https://tubitak.gov.tr/tr/haberler", descriptions: { tr: "Türkiye’den bilim, araştırma ve teknoloji duyuruları.", en: "Science, research, and technology announcements from Türkiye.", de: "Wissenschafts- und Technikmeldungen aus der Türkei.", zh: "来自土耳其的科学、研究与技术动态。" } },
  { code: "UK", name: "GOV.UK · AI & technology", url: "https://www.gov.uk/search/news-and-communications?keywords=artificial%20intelligence", descriptions: { tr: "Birleşik Krallık kamu kurumlarının AI ve teknoloji duyuruları.", en: "UK public-sector AI and technology announcements.", de: "KI- und Technikmeldungen des britischen öffentlichen Sektors.", zh: "英国公共部门的 AI 与技术公告。" } },
  { code: "DE", name: "BSI Meldungen", url: "https://www.bsi.bund.de/DE/Service-Navi/Presse/Alle-Meldungen-News/alle-meldungen-news_node.html", descriptions: { tr: "Almanya Federal Bilgi Güvenliği Dairesinin duyuruları.", en: "Updates from Germany’s Federal Office for Information Security.", de: "Aktuelle Meldungen des Bundesamts für Sicherheit in der Informationstechnik.", zh: "德国联邦信息安全办公室的最新动态。" } },
  { code: "CN", name: "中国科学院 · CAS", url: "https://www.cas.cn/cm/", descriptions: { tr: "Çin Bilimler Akademisinin araştırma ve bilim iletişimi.", en: "Research and science communication from the Chinese Academy of Sciences.", de: "Forschungsmeldungen der Chinesischen Akademie der Wissenschaften.", zh: "中国科学院的科研与科学传播动态。" } },
  { code: "EU", name: "European Commission · Research", url: "https://research-and-innovation.ec.europa.eu/news_en", descriptions: { tr: "Avrupa Birliği araştırma ve yenilik politikası gelişmeleri.", en: "European research and innovation policy developments.", de: "Europäische Forschungs- und Innovationspolitik.", zh: "欧洲研究与创新政策动态。" } },
  { code: "US", name: "NSF News", url: "https://www.nsf.gov/news", descriptions: { tr: "Bilimsel keşifler, araştırma ve yenilik duyuruları.", en: "Scientific discovery, research, and innovation news.", de: "Meldungen zu Forschung, Entdeckungen und Innovation.", zh: "科学发现、研究与创新动态。" } },
] as const;

export function NewsPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const url = absoluteUrl(pathFor(locale, "news"));
  const sourceCount = new Set(newsItems.map((item) => item.source)).size;
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: t.title, description: t.intro, url, inLanguage: languageTag(locale), isPartOf: { "@id": `${absoluteUrl(pathFor(locale, "home"))}#website` }, publisher: { "@id": organizationId }, mainEntity: { "@type": "ItemList", itemListElement: newsItems.slice(0, 20).map((item, index) => ({ "@type": "ListItem", position: index + 1, url: item.url, name: item.title })) } };
  return <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "news")} languageHrefs={{ tr: pathFor("tr", "news"), en: pathFor("en", "news"), de: pathFor("de", "news"), zh: pathFor("zh", "news") }}>
    <SchemaScript data={schema} />
    <div className="news-page">
      <section className="news-product-intro"><div className="container"><div><span className="eyebrow"><i />{t.eyebrow}</span><h1>{t.title}</h1><p>{t.intro}</p></div><aside><strong>{sourceCount}</strong><span>{t.sources}</span><strong>{newsItems.length}</strong><span>{t.records}</span><small>{t.direct}</small><time dateTime={newsGeneratedAt}>{t.update}: {new Date(newsGeneratedAt).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</time></aside></div></section>
      <section className="section news-feed-section"><div className="container"><NewsFeedClient locale={locale} items={newsItems} /></div></section>
      <section className="section news-regional"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">OFFICIAL SOURCES</span><h2>{t.desk}</h2></div><p>{t.deskIntro}</p></div><div className="news-regional-grid">{regionalSources.map((source) => <a key={source.code} href={source.url} target="_blank" rel="noreferrer noopener"><span>{source.code}</span><div><strong>{source.name}</strong><p>{source.descriptions[locale]}</p></div><b>↗</b></a>)}</div></div></section>
      <section className="section news-method"><div className="container"><div><span className="kicker">SOURCE TRANSPARENCY</span><h2>{t.method}</h2></div><ul>{t.notes.map((note) => <li key={note}>✓ <span>{note}</span></li>)}</ul></div></section>
    </div>
  </SiteShell>;
}
