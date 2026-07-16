import { posts, type EditorialLocale } from "./posts";
import { absoluteUrl, languageTag, pathFor, postPath, schemaDate } from "./site";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '\"': "&quot;",
  })[character] ?? character);
}

export function buildFeed(locale: EditorialLocale) {
  const isTr = locale === "tr";
  const orderedPosts = [...posts].sort((left, right) => right.date.localeCompare(left.date));
  const feedUrl = absoluteUrl(isTr ? "/feed.xml" : "/en/feed.xml");
  const homeUrl = absoluteUrl(pathFor(locale, "home"));
  const lastBuildDate = new Date(schemaDate(orderedPosts[0]?.updated ?? orderedPosts[0]?.date ?? "2026-07-15")).toUTCString();
  const items = orderedPosts.map((post) => {
    const url = absoluteUrl(postPath(locale, post.slug));
    return `<item><title>${escapeXml(post.title[locale])}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(schemaDate(post.date)).toUTCString()}</pubDate><description>${escapeXml(post.excerpt[locale])}</description><category>${escapeXml(post.category[locale])}</category></item>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${isTr ? "ByteQuant Rehberleri" : "ByteQuant Guides"}</title><link>${homeUrl}</link><description>${isTr ? "Gizlilik, tarayıcı içi araçlar, teknik SEO ve veri güvenliği için kanıta dayalı rehberler." : "Evidence-led guides to privacy, in-browser tools, technical SEO, and data security."}</description><language>${languageTag(locale)}</language><lastBuildDate>${lastBuildDate}</lastBuildDate><atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${feedUrl}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
