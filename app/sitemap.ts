import type { MetadataRoute } from "next";
import { posts } from "./lib/posts";
import { tools } from "./lib/tools";
import { absoluteUrl, bilingualLanguageUrls, locales, localizedLanguageUrls, pathFor, postPath, toolPath } from "./lib/site";
import { referencePath, references } from "./lib/references";
import { localizedGuides } from "./lib/localized-guides";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-18T09:00:00+03:00");
  const staticKeys = ["home", "blog", "about", "privacy", "cookies", "terms", "contact", "faq"] as const;
  const staticRoutes = locales.flatMap((locale) => staticKeys.map((key) => ({ url: absoluteUrl(pathFor(locale, key)), lastModified: updated, alternates: { languages: localizedLanguageUrls(pathFor("tr", key), pathFor("en", key)) } })));
  const toolRoutes = tools.flatMap((tool) => locales.map((locale) => ({ url: absoluteUrl(toolPath(locale, tool.slug)), lastModified: updated, alternates: { languages: localizedLanguageUrls(toolPath("tr", tool.slug), toolPath("en", tool.slug)) } })));
  const localizedGuideSlugs = new Set(localizedGuides.map((guide) => guide.slug));
  const postRoutes = posts.flatMap((post) => {
    const fullyLocalized = localizedGuideSlugs.has(post.slug);
    const guideLanguages = { "tr-TR": absoluteUrl(postPath("tr", post.slug)), "en-US": absoluteUrl(postPath("en", post.slug)), "de-DE": absoluteUrl(postPath("de", post.slug)), "zh-CN": absoluteUrl(postPath("zh", post.slug)), "x-default": absoluteUrl(postPath("en", post.slug)) };
    return (fullyLocalized ? locales : (["tr", "en"] as const)).map((locale) => ({ url: absoluteUrl(postPath(locale, post.slug)), lastModified: new Date(`${post.updated ?? post.date}T09:00:00+03:00`), alternates: { languages: fullyLocalized ? guideLanguages : bilingualLanguageUrls(postPath("tr", post.slug), postPath("en", post.slug)) } }));
  });
  const referenceRoutes = references.flatMap((guide) => locales.map((locale) => ({ url: absoluteUrl(referencePath(locale, guide.slug)), lastModified: updated, alternates: { languages: localizedLanguageUrls(referencePath("tr", guide.slug), referencePath("en", guide.slug)) } })));
  return [...staticRoutes, ...toolRoutes, ...referenceRoutes, ...postRoutes];
}
