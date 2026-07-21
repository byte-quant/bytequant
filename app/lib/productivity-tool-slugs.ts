export const productivityToolSlugs = [
  "prompt-sinirlandirici-ayirici", "yapisal-cikti-semasi-olusturucu", "ai-red-team-kontrol-listesi",
  "grapheme-guvenli-metin-ters-cevirici", "cumle-paragraf-bolucu", "srt-altyazi-zaman-kaydirici", "unicode-kod-noktasi-inceleyici", "mors-kodu-donusturucu",
  "json-kanoniklestirici", "json-string-kacis-donusturucu", "csv-sql-insert-olusturucu", "http-istek-basligi-olusturucu", "mime-turu-bulucu", "uuid-inceleyici", "ulid-uretici-inceleyici", "changelog-bicimlendirici",
  "css-gradient-olusturucu", "css-box-shadow-olusturucu", "sayi-tabani-donusturucu", "byte-hex-inceleyici",
  "e-posta-basligi-analizoru", "csp-nonce-uretici", "parola-politikasi-olusturucu",
  "bilesik-faiz-hesaplayici", "birikim-hedefi-planlayici", "yakit-maliyeti-hesaplayici", "tempo-hiz-donusturucu",
] as const;

export type ProductivityToolSlug = (typeof productivityToolSlugs)[number];
