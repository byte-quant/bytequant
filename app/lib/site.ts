export type Locale = "tr" | "en";

export const siteUrl = "https://bytequant.org";
export const contactEmail = "bytequant@yahoo.com";

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

export function pathFor(locale: Locale, key: "home" | "tools" | "blog" | "about" | "privacy" | "terms" | "contact" | "faq") {
  const routes = locale === "tr"
    ? { home: "/", tools: "/#araclar", blog: "/blog", about: "/hakkimizda", privacy: "/gizlilik-politikasi", terms: "/kullanim-kosullari", contact: "/iletisim", faq: "/sss" }
    : { home: "/en", tools: "/en#tools", blog: "/en/blog", about: "/en/about", privacy: "/en/privacy", terms: "/en/terms", contact: "/en/contact", faq: "/en/faq" };
  return routes[key];
}

export function toolPath(locale: Locale, slug: string) {
  return locale === "tr" ? `/araclar/${slug}` : `/en/tools/${slug}`;
}

export function postPath(locale: Locale, slug: string) {
  return locale === "tr" ? `/blog/${slug}` : `/en/blog/${slug}`;
}

