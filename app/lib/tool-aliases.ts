export const toolAliases = {
  "kredi-taksit-hesaplayici": "kredi-odeme-hesaplayici",
  "tarih-sure-hesaplayici": "tarih-farki-hesaplayici",
  "kelime-sikligi-analizoru": "kelime-sikligi-ngram-analizi",
  "okunabilirlik-on-analizi": "okunabilirlik-analizi",
  "liste-siralama-temizleme": "satir-siralayici-tekillestirici",
  "sri-hash-olusturucu": "sri-butunluk-hash-uretici",
} as const satisfies Record<string, string>;

export type ToolAliasSlug = keyof typeof toolAliases;

export function isToolAlias(slug: string): slug is ToolAliasSlug {
  return Object.hasOwn(toolAliases, slug);
}

export function canonicalToolSlug(slug: string) {
  return isToolAlias(slug) ? toolAliases[slug] : slug;
}
