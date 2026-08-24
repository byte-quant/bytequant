import Link from "next/link";
import { categories, publicTools, type ToolCategory } from "../lib/tools";
import { absoluteUrl, languageTag, organizationId, pageLanguageHrefs, pathFor, toolPath, websiteId, type Locale } from "../lib/site";
import { HeroToolSearch } from "./HeroToolSearch";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { ToolCard } from "./ToolCard";

const text = {
  tr: {
    eyebrow: "ARAÇ KÜTÜPHANESİ",
    title: "Yapmak istediğiniz işi bulun, hemen başlayın",
    intro: "Metin, veri, dosya, hesaplama, kod ve gizlilik işleri için ücretsiz araçları tek yerde keşfedin. Arama yapabilir veya aşağıdaki kategorilerden birini seçebilirsiniz.",
    search: "Bir araç arayın: JSON, PDF, maskeleme…",
    categories: "İhtiyacınıza göre göz atın",
    count: "araç",
    back: "Kategorilere dön",
    privacy: "Temel işlemler tarayıcınızda çalışır; araç girdileri ByteQuant sunucusuna gönderilmez.",
    guide: "Nereden başlayacağınızdan emin değil misiniz? Yerel Ajan hedefinizi uygun araçlara dönüştürebilir.",
    agent: "Yerel Ajan ile başlayın",
  },
  en: {
    eyebrow: "TOOL LIBRARY",
    title: "Find the task you need and get started",
    intro: "Explore free tools for text, data, files, calculations, code, and privacy in one place. Search directly or choose a category below.",
    search: "Search for a tool: JSON, PDF, masking…",
    categories: "Browse by need",
    count: "tools",
    back: "Back to categories",
    privacy: "Core processing runs in your browser; tool inputs are not sent to ByteQuant servers.",
    guide: "Not sure where to begin? Local Agent can turn your goal into a practical tool plan.",
    agent: "Start with Local Agent",
  },
  de: {
    eyebrow: "WERKZEUGBIBLIOTHEK",
    title: "Finden Sie die passende Aufgabe und legen Sie los",
    intro: "Entdecken Sie kostenlose Werkzeuge für Text, Daten, Dateien, Berechnungen, Code und Datenschutz. Suchen Sie direkt oder wählen Sie eine Kategorie.",
    search: "Werkzeug suchen: JSON, PDF, Maskierung…",
    categories: "Nach Bedarf durchsuchen",
    count: "Werkzeuge",
    back: "Zurück zu den Kategorien",
    privacy: "Die Kernverarbeitung läuft im Browser; Werkzeugeingaben werden nicht an ByteQuant-Server gesendet.",
    guide: "Sie wissen nicht, wo Sie beginnen sollen? Der lokale Agent erstellt aus Ihrem Ziel einen passenden Werkzeugplan.",
    agent: "Mit dem lokalen Agenten starten",
  },
  zh: {
    eyebrow: "工具库",
    title: "找到所需任务，立即开始",
    intro: "在一个页面中查找文本、数据、文件、计算、代码和隐私工具。您可以直接搜索，也可以按类别浏览。",
    search: "搜索工具：JSON、PDF、数据遮蔽…",
    categories: "按需求浏览",
    count: "个工具",
    back: "返回类别",
    privacy: "核心处理在浏览器中完成；工具输入不会发送到 ByteQuant 服务器。",
    guide: "不确定从哪里开始？本地助手可以把您的目标整理成实用的工具计划。",
    agent: "从本地助手开始",
  },
} as const;

export function ToolLibraryPage({ locale }: { locale: Locale }) {
  const t = text[locale];
  const language = languageTag(locale);
  const categoryKeys = Object.keys(categories) as ToolCategory[];
  const searchTools = publicTools.map((tool) => ({ slug: tool.slug, category: tool.category, mark: tool.mark, title: tool.title[locale], short: tool.short[locale], categoryLabel: categories[tool.category].label[locale] }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(pathFor(locale, "tools"))}#collection`,
    name: t.title,
    description: t.intro,
    url: absoluteUrl(pathFor(locale, "tools")),
    inLanguage: language,
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: publicTools.length,
      itemListElement: publicTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title[locale],
        url: absoluteUrl(toolPath(locale, tool.slug)),
      })),
    },
  };

  return (
    <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "tools")} languageHrefs={pageLanguageHrefs("tools")}>
      <SchemaScript data={schema} />
      <section className="tool-library-hero">
        <div className="container tool-library-hero-grid">
          <div>
            <nav className="breadcrumbs" aria-label={locale === "tr" ? "Sayfa yolu" : "Breadcrumb"}>
              <Link href={pathFor(locale, "home")}>{locale === "tr" ? "Ana sayfa" : locale === "de" ? "Startseite" : locale === "zh" ? "首页" : "Home"}</Link><span>/</span><span>{t.eyebrow}</span>
            </nav>
            <span className="kicker">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
            <div className="tool-library-search"><HeroToolSearch locale={locale} tools={searchTools} placeholder={t.search} /></div>
          </div>
          <aside className="tool-library-trust-card">
            <span aria-hidden="true">✓</span>
            <strong>{publicTools.length} {t.count}</strong>
            <p>{t.privacy}</p>
            <div><p>{t.guide}</p><Link href={pathFor(locale, "agent")}>{t.agent} →</Link></div>
          </aside>
        </div>
      </section>

      <section className="section tool-library-content" id="categories">
        <div className="container">
          <div className="section-heading"><span className="kicker">{t.categories}</span><h2>{t.categories}</h2></div>
          <nav className="tool-library-category-nav" aria-label={t.categories}>
            {categoryKeys.map((key) => {
              const count = publicTools.filter((tool) => tool.category === key).length;
              return <a key={key} href={`#category-${key}`}><span className={`category-dot category-${key}`}>{categories[key].mark}</span><span><strong>{categories[key].label[locale]}</strong><small>{count} {t.count}</small></span></a>;
            })}
          </nav>
          {categoryKeys.map((key) => <section className="tool-category-block tool-library-category" id={`category-${key}`} key={key} aria-labelledby={`category-title-${key}`}>
            <div className="category-block-heading"><div><span className={`category-dot large category-${key}`}>{categories[key].mark}</span><div><h2 id={`category-title-${key}`}>{categories[key].label[locale]}</h2><p>{categories[key].description[locale]}</p></div></div><a href="#categories">{t.back} ↑</a></div>
            <div className="tool-grid">{publicTools.filter((tool) => tool.category === key).map((tool) => <ToolCard key={tool.slug} tool={tool} locale={locale} />)}</div>
          </section>)}
        </div>
      </section>
    </SiteShell>
  );
}
