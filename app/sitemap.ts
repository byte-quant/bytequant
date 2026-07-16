import type { MetadataRoute } from "next";
import { posts } from "./lib/posts";
import { tools } from "./lib/tools";
import { absoluteUrl, bilingualLanguageUrls, locales, localizedLanguageUrls, pathFor, postPath, toolPath } from "./lib/site";
import { referencePath, references } from "./lib/references";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-16T09:00:00+03:00");
  const staticKeys = ["home", "blog", "about", "privacy", "cookies", "terms", "contact", "faq"] as const;
  const staticRoutes = locales.flatMap((locale) => staticKeys.map((key) => ({ url: absoluteUrl(pathFor(locale, key)), lastModified: updated, alternates: { languages: localizedLanguageUrls(pathFor("tr", key), pathFor("en", key)) } })));
  const toolRoutes = tools.flatMap((tool) => locales.map((locale) => ({ url: absoluteUrl(toolPath(locale, tool.slug)), lastModified: updated, alternates: { languages: localizedLanguageUrls(toolPath("tr", tool.slug), toolPath("en", tool.slug)) } })));
  const postRoutes = posts.flatMap((post) => (["tr", "en"] as const).map((locale) => ({ url: absoluteUrl(postPath(locale, post.slug)), lastModified: new Date(`${post.updated ?? post.date}T09:00:00+03:00`), alternates: { languages: bilingualLanguageUrls(postPath("tr", post.slug), postPath("en", post.slug)) } })));
  const referenceRoutes = references.flatMap((guide) => (["tr", "en"] as const).map((locale) => ({ url: absoluteUrl(referencePath(locale, guide.slug)), lastModified: updated, alternates: { languages: bilingualLanguageUrls(referencePath("tr", guide.slug), referencePath("en", guide.slug)) } })));
  return [...staticRoutes, ...toolRoutes, ...referenceRoutes, ...postRoutes];
}
