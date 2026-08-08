const legacyGuideToolSlugs: Record<string, string> = {
  "metin-farki": "metin-farki-diff",
  "kod-guvenlik-on-taramasi": "kod-guvenligi-on-taramasi",
  "metin-sikistirma-orani-hesaplayici": "kelime-sayaci",
  "url-risk-on-taramasi": "url-guvenlik-on-kontrolu",
  "kaynak-guvenilirlik-puanlayici": "kaynak-guvenilirlik-matrisi",
  "iddia-kaynak-eslestirici": "iddia-kanit-boslugu-inceleyici",
  "tarih-sure-hesaplayici": "tarih-farki-hesaplayici",
  "indirim-kdv-hesaplayici": "kdv-indirim-hesaplayici",
  "sri-hash-olusturucu": "sri-butunluk-hash-uretici",
  "http-durum-kodu-rehberi": "http-durum-kodu-gezgini",
};

/** Preserve old editorial identifiers while linking only to canonical tools. */
export function canonicalGuideToolSlugs(slugs: string[]) {
  return [...new Set(slugs.map((slug) => legacyGuideToolSlugs[slug] ?? slug))];
}
