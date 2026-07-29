export const toolAliases = {
  "kredi-taksit-hesaplayici": "kredi-odeme-hesaplayici",
  "tarih-sure-hesaplayici": "tarih-farki-hesaplayici",
  "kelime-sikligi-analizoru": "kelime-sikligi-ngram-analizi",
  "okunabilirlik-on-analizi": "okunabilirlik-analizi",
  "liste-siralama-temizleme": "satir-siralayici-tekillestirici",
  "sri-hash-olusturucu": "sri-butunluk-hash-uretici",
  "yuzde-degisim-hizli-hesaplayici": "yuzde-degisim-hesaplayici",
  "indirim-kdv-hesaplayici": "kdv-indirim-hesaplayici",
  "rastgele-takim-olusturucu": "rastgele-secici-takim-karistirici",
  "query-string-olusturucu": "sorgu-dizesi-json-donusturucu",
  "http-durum-kodu-rehberi": "http-durum-kodu-gezgini",
  "mime-turu-bulucu": "mime-tipi-inceleyici",
} as const satisfies Record<string, string>;

export type ToolAliasSlug = keyof typeof toolAliases;

export function isToolAlias(slug: string): slug is ToolAliasSlug {
  return Object.hasOwn(toolAliases, slug);
}

export function canonicalToolSlug(slug: string) {
  return isToolAlias(slug) ? toolAliases[slug] : slug;
}
