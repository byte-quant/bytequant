import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bytequant.org"),
  title: { default: "ByteQuant · Gizlilik Odaklı Tarayıcı İçi Araçlar", template: "ByteQuant · %s" },
  description: "Prompt, metin, veri, PDF, görsel ve güvenlik işlemlerini tarayıcınızda tamamlayan 38 ücretsiz ve gizlilik odaklı araç.",
  applicationName: "ByteQuant",
  authors: [{ name: "ByteQuant Editorial", url: "https://bytequant.org/hakkimizda" }],
  creator: "ByteQuant",
  publisher: "ByteQuant",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: { type: "website", siteName: "ByteQuant", locale: "tr_TR", alternateLocale: "en_US", url: "https://bytequant.org", title: "ByteQuant · Gizlilik Odaklı Tarayıcı İçi Araçlar", description: "38 ücretsiz araç. Üyelik yok, yükleme yok; PDF, görsel ve veri işlemleri cihazınızda.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "ByteQuant gizlilik odaklı tarayıcı içi araçlar" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant", description: "Gizlilik odaklı, tarayıcı içinde çalışan ücretsiz araçlar.", images: ["/og.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }], shortcut: "/favicon.png", apple: [{ url: "/favicon.png", sizes: "512x512", type: "image/png" }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang=location.pathname.startsWith('/en/')||location.pathname==='/en'?'en':'tr'" }} /><meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests" /><meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" /><meta httpEquiv="X-Content-Type-Options" content="nosniff" /></head><body>{children}</body></html>;
}
