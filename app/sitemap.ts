import type { MetadataRoute } from "next";
import { posts } from "./lib/posts";
import { tools } from "./lib/tools";
import { pathFor, postPath, siteUrl, toolPath } from "./lib/site";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-14T00:00:00.000Z");
  const staticKeys = ["home", "blog", "about", "privacy", "terms", "contact", "faq"] as const;
  const languages = (trPath: string, enPath: string) => ({
    "tr-TR": `${siteUrl}${trPath}`,
    "en-US": `${siteUrl}${enPath}`,
    "x-default": `${siteUrl}${trPath}`,
  });
  const staticRoutes = (["tr", "en"] as const).flatMap((locale) => staticKeys.map((key) => ({ url: `${siteUrl}${pathFor(locale, key)}`, lastModified: updated, changeFrequency: key === "home" || key === "blog" ? "weekly" as const : "monthly" as const, priority: key === "home" ? 1 : key === "blog" ? 0.85 : 0.65, alternates: { languages: languages(pathFor("tr", key), pathFor("en", key)) } })));
  const toolRoutes = tools.flatMap((tool) => (["tr", "en"] as const).map((locale) => ({ url: `${siteUrl}${toolPath(locale, tool.slug)}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.8, alternates: { languages: languages(toolPath("tr", tool.slug), toolPath("en", tool.slug)) } })));
  const postRoutes = posts.flatMap((post) => (["tr", "en"] as const).map((locale) => ({ url: `${siteUrl}${postPath(locale, post.slug)}`, lastModified: new Date(post.date), changeFrequency: "monthly" as const, priority: 0.75, alternates: { languages: languages(postPath("tr", post.slug), postPath("en", post.slug)) } })));
  return [...staticRoutes, ...toolRoutes, ...postRoutes];
}
