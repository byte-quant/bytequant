import type { Metadata } from "next";

export const locales = ["tr", "en", "de", "zh"] as const;
export type Locale = (typeof locales)[number];

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
  de: {
    brand: "ByteQuant",
    descriptor: "Datenschutzorientierte Produktivitätswerkzeuge",
    nav: {
      home: "Startseite",
      tools: "Werkzeuge",
      blog: "Ratgeber",
      about: "Über uns",
      faq: "FAQ",
      contact: "Kontakt",
    },
    toolCta: "Werkzeug öffnen",
    allTools: "Alle Werkzeuge entdecken",
    blogCta: "Ratgeber lesen",
    free: "Kostenlos · Kein Konto · Daten bleiben auf Ihrem Gerät",
    adLabel: "Werbefläche",
    language: "Sprache",
  },
  zh: {
    brand: "ByteQuant",
    descriptor: "隐私优先的生产力工具",
    nav: {
      home: "首页",
      tools: "工具",
      blog: "指南",
      about: "关于我们",
      faq: "常见问题",
      contact: "联系",
    },
    toolCta: "打开工具",
    allTools: "浏览全部工具",
    blogCta: "阅读指南",
    free: "免费 · 无需账户 · 数据保留在您的设备上",
    adLabel: "广告位",
    language: "语言",
  },
} as const;

export function pathFor(locale: Locale, key: "home" | "tools" | "blog" | "about" | "privacy" | "cookies" | "terms" | "contact" | "faq") {
  const routes = {
    tr: { home: "/", tools: "/#araclar", blog: "/blog", about: "/hakkimizda", privacy: "/gizlilik-politikasi", cookies: "/cerez-politikasi", terms: "/kullanim-kosullari", contact: "/iletisim", faq: "/sss" },
    en: { home: "/en", tools: "/en#tools", blog: "/en/blog", about: "/en/about", privacy: "/en/privacy", cookies: "/en/cookies", terms: "/en/terms", contact: "/en/contact", faq: "/en/faq" },
    de: { home: "/de", tools: "/de#tools", blog: "/de/blog", about: "/de/about", privacy: "/de/privacy", cookies: "/de/cookies", terms: "/de/terms", contact: "/de/contact", faq: "/de/faq" },
    zh: { home: "/zh", tools: "/zh#tools", blog: "/zh/blog", about: "/zh/about", privacy: "/zh/privacy", cookies: "/zh/cookies", terms: "/zh/terms", contact: "/zh/contact", faq: "/zh/faq" },
  } as const;
  return routes[locale][key];
}

export function toolPath(locale: Locale, slug: string) {
  return locale === "tr" ? `/araclar/${slug}` : `/${locale}/tools/${slug}`;
}

export function postPath(locale: Locale, slug: string) {
  return locale === "tr" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
}

export function languageTag(locale: Locale) {
  return { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" }[locale];
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
  if (/^\/en\/(?:blog|references)\//.test(enPath)) return bilingualLanguageUrls(trPath, enPath);
  const trUrl = absoluteUrl(trPath);
  const enUrl = absoluteUrl(enPath);
  const deUrl = absoluteUrl(localizedPath("de", trPath, enPath));
  const zhUrl = absoluteUrl(localizedPath("zh", trPath, enPath));
  return {
    tr: trUrl,
    "tr-TR": trUrl,
    en: enUrl,
    "en-US": enUrl,
    de: deUrl,
    "de-DE": deUrl,
    zh: zhUrl,
    "zh-CN": zhUrl,
    "x-default": enUrl,
  };
}

export function bilingualLanguageUrls(trPath: string, enPath: string) {
  const trUrl = absoluteUrl(trPath);
  const enUrl = absoluteUrl(enPath);
  return { tr: trUrl, "tr-TR": trUrl, en: enUrl, "en-US": enUrl, "x-default": enUrl };
}

export function bilingualAlternates(locale: "tr" | "en", trPath: string, enPath: string) {
  return { canonical: absoluteUrl(locale === "tr" ? trPath : enPath), languages: bilingualLanguageUrls(trPath, enPath) };
}

export function localizedPath(locale: Locale, trPath: string, enPath: string) {
  if (locale === "tr") return trPath;
  if (locale === "en") return enPath;
  const [pathname, hash = ""] = enPath.split("#", 2);
  const localized = pathname === "/en" ? `/${locale}` : pathname.replace(/^\/en(?=\/)/, `/${locale}`);
  return hash ? `${localized}#${hash}` : localized;
}

/**
 * Keeps canonical and hreflang declarations identical across every localized
 * route. Generic language entries serve global speakers, regional aliases
 * preserve the established Turkey/US signals, and x-default points to the
 * global English fallback for languages ByteQuant does not yet translate.
 */
export function localizedAlternates(locale: Locale, trPath: string, enPath: string) {
  return {
    canonical: absoluteUrl(localizedPath(locale, trPath, enPath)),
    languages: localizedLanguageUrls(trPath, enPath),
  };
}

export function localizedSocialMetadata(locale: Locale, title: string, description: string, path: string): Pick<Metadata, "openGraph" | "twitter"> {
  const fullTitle = `ByteQuant · ${title}`;
  return {
    openGraph: {
      type: "website",
      siteName: "ByteQuant",
      locale: { tr: "tr_TR", en: "en_US", de: "de_DE", zh: "zh_CN" }[locale],
      alternateLocale: locales.filter((item) => item !== locale).map((item) => ({ tr: "tr_TR", en: "en_US", de: "de_DE", zh: "zh_CN" })[item]),
      url: absoluteUrl(path),
      title: fullTitle,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImageUrl] },
  };
}
