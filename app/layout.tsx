import type { Metadata } from "next";
import "./globals.css";
import { PwaRegistrar } from "./components/PwaInstall";
import { DomainGuard } from "./components/DomainGuard";
import { BYTEQUANT_BUILD_SIGNATURE, BYTEQUANT_CANONICAL_ORIGIN } from "./lib/brand-integrity";

export const metadata: Metadata = {
  metadataBase: new URL("https://bytequant.org"),
  title: { default: "ByteQuant · Gizlilik Odaklı Tarayıcı İçi Araçlar", template: "ByteQuant · %s" },
  description: "Prompt, metin, hesaplama, veri, PDF, görsel, yapay zekâ ve güvenlik işlemlerini tarayıcınızda tamamlayan 89 ücretsiz araç.",
  applicationName: "ByteQuant",
  authors: [{ name: "ByteQuant Editorial", url: "https://bytequant.org/hakkimizda" }],
  creator: "ByteQuant",
  publisher: "ByteQuant",
  alternates: { canonical: BYTEQUANT_CANONICAL_ORIGIN },
  other: { "bytequant:canonical-origin": BYTEQUANT_CANONICAL_ORIGIN, "bytequant:build-signature": BYTEQUANT_BUILD_SIGNATURE },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: { type: "website", siteName: "ByteQuant", locale: "tr_TR", alternateLocale: ["en_US", "de_DE", "zh_CN"], url: "https://bytequant.org", title: "ByteQuant · Yerel İş İstasyonu ve 89 Tarayıcı Aracı", description: "89 ücretsiz araç, görsel iş akışları, şifreli cihaz içi projeler ve sunucusuz P2P. Üyelik, veri yükleme ve uzak model yok.", images: [{ url: "/og-v5.png", width: 1200, height: 630, alt: "ByteQuant Yerel İş İstasyonu, AI plan önizleme ve güven kodlu P2P" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant · Yerel İş İstasyonu + 89 Araç", description: "Görsel akışlar, AI plan önizleme, şifreli cihaz içi projeler ve güven kodlu P2P.", images: ["/og-v5.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }], shortcut: "/favicon.png", apple: [{ url: "/favicon.png", sizes: "512x512", type: "image/png" }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" suppressHydrationWarning data-bytequant-origin={BYTEQUANT_CANONICAL_ORIGIN}><head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang=location.pathname.startsWith('/en/')||location.pathname==='/en'?'en':location.pathname.startsWith('/de/')||location.pathname==='/de'?'de':location.pathname.startsWith('/zh/')||location.pathname==='/zh'?'zh-CN':'tr'" }} /><meta name="bytequant:canonical-origin" content={BYTEQUANT_CANONICAL_ORIGIN} /><meta name="bytequant:build-signature" content={BYTEQUANT_BUILD_SIGNATURE} /><meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; script-src-attr 'none'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; upgrade-insecure-requests" /><meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" /></head><body data-bytequant-origin={BYTEQUANT_CANONICAL_ORIGIN} data-bytequant-signature={BYTEQUANT_BUILD_SIGNATURE}><DomainGuard /><PwaRegistrar />{children}</body></html>;
}
