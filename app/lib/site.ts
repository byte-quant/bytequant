import type { Metadata } from "next";

export type Locale = "tr" | "en";

export const siteUrl = "https://bytequant.org";
export const contactEmail = "bytequant@yahoo.com";
export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;
export const ogImageUrl = `${siteUrl}/og.png`;

export const copy = {
  tr: {
    brand: "ByteQuant",
    descriptor: "Gizlilik odaklı üretkenlik araçları",
    nav: {
      home: "Ana sayfa",
      tools: "Araçlar",
      blog: "Rehberler",
      about: "Hakkımızda",
      faq: "SSS",
      contact: "İletişim",
    },
    toolCta: "Aracı aç",
    allTools: "Tüm araçları keşfet",
    blogCta: "Rehberleri oku",
    free: "Ücretsiz · Üyelik yok · Veriler cihazınızda",
    adLabel: "Reklam alanı",
    language: "English",
  },
  en: {
    brand: "ByteQuant",
    descriptor: "Privacy-first productivity tools",
    nav: {
      home: "Home",
      tools: "Tools",
      blog: "Guides",
      about: "About",
      faq: "FAQ",
      contact: "Contact",
    },
    toolCta: "Open tool",
    allTools: "Explore all tools",
    blogCta: "Read the guides",
    free: "Free · No account · Data stays on your device",
    adLabel: "Advertisement",
    language: "Türkçe",
  },
} as const;

export function pathFor(locale: Locale, key: "home" | "tools" | "blog" | "about" | "privacy" | "cookies" | "terms" | "contact" | "faq") {
  const routes = locale === "tr"
    ? { home: "/", tools: "/#araclar", blog: "/blog", about: "/hakkimizda", privacy: "/gizlilik-politikasi", cookies: "/cerez-politikasi", terms: "/kullanim-kosullari", contact: "/iletisim", faq: "/sss" }
    : { home: "/en", tools: "/en#tools", blog: "/en/blog", about: "/en/about", privacy: "/en/privacy", cookies: "/en/cookies", terms: "/en/terms", contact: "/en/contact", faq: "/en/faq" };
  return routes[key];
}

export function toolPath(locale: Locale, slug: string) {
  return locale === "tr" ? `/araclar/${slug}` : `/en/tools/${slug}`;
}

export function postPath(locale: Locale, slug: string) {
  return locale === "tr" ? `/blog/${slug}` : `/en/blog/${slug}`;
}

export function languageTag(locale: Locale) {
  return locale === "tr" ? "tr-TR" : "en";
}

export function schemaDate(date: string) {
  return `${date}T09:00:00+03:00`;
}

export function absoluteUrl(path: string) {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  const isFilePath = /\/[^/]+\.[a-z0-9]+$/i.test(pathname);
  const finalPath = pathname === "/" || pathname.endsWith("/") || isFilePath ? pathname : `${pathname}/`;
  return `${siteUrl}${finalPath}`;
}

export function localizedLanguageUrls(trPath: string, enPath: string) {
  const trUrl = absoluteUrl(trPath);
  const enUrl = absoluteUrl(enPath);
  return {
    tr: trUrl,
    "tr-TR": trUrl,
    en: enUrl,
    "en-US": enUrl,
    "x-default": enUrl,
  };
}

/**
 * Keeps canonical and hreflang declarations identical across every localized
 * route. Generic language entries serve global speakers, regional aliases
 * preserve the established Turkey/US signals, and x-default points to the
 * global English fallback for languages ByteQuant does not yet translate.
 */
export function localizedAlternates(locale: Locale, trPath: string, enPath: string) {
  return {
    canonical: absoluteUrl(locale === "tr" ? trPath : enPath),
    languages: localizedLanguageUrls(trPath, enPath),
  };
}

export function localizedSocialMetadata(locale: Locale, title: string, description: string, path: string): Pick<Metadata, "openGraph" | "twitter"> {
  const fullTitle = `ByteQuant · ${title}`;
  return {
    openGraph: {
      type: "website",
      siteName: "ByteQuant",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      alternateLocale: locale === "tr" ? "en_US" : "tr_TR",
      url: absoluteUrl(path),
      title: fullTitle,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImageUrl] },
  };
}
