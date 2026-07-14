import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bytequant.org"),
  title: { default: "ByteQuant · Gizlilik Odaklı Tarayıcı İçi Araçlar", template: "%s · ByteQuant" },
  description: "Prompt, metin, veri ve güvenlik işlemlerini tarayıcınızda tamamlayan 18 ücretsiz ve gizlilik odaklı araç.",
  applicationName: "ByteQuant",
  authors: [{ name: "ByteQuant Editorial", url: "https://bytequant.org/hakkimizda" }],
  creator: "ByteQuant",
  publisher: "ByteQuant",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: { type: "website", siteName: "ByteQuant", locale: "tr_TR", alternateLocale: "en_US", url: "https://bytequant.org", title: "ByteQuant · Gizlilik Odaklı Tarayıcı İçi Araçlar", description: "18 ücretsiz araç. Üyelik yok, yükleme yok; temel işlemler cihazınızda.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "ByteQuant gizlilik odaklı tarayıcı içi araçlar" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant", description: "Gizlilik odaklı, tarayıcı içinde çalışan ücretsiz araçlar.", images: ["/og.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: [{ url: "/favicon.png", type: "image/png", sizes: "192x192" }], shortcut: "/favicon.png", apple: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" suppressHydrationWarning><head><meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests" /><meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" /><meta httpEquiv="X-Content-Type-Options" content="nosniff" /></head><body>{children}</body></html>;
}
