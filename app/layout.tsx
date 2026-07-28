import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { PwaProvider } from "./components/PwaInstall";
import { DomainGuard } from "./components/DomainGuard";
import { BYTEQUANT_BUILD_SIGNATURE, BYTEQUANT_CANONICAL_ORIGIN } from "./lib/brand-integrity";

export const metadata: Metadata = {
  metadataBase: new URL("https://bytequant.org"),
  title: { default: "ByteQuant · Gizlilik Odaklı Tarayıcı İçi Araçlar", template: "ByteQuant · %s" },
  description: "Prompt, metin, hesaplama, veri, PDF, görsel, araştırma, yapay zekâ ve güvenlik işlemlerini tarayıcınızda tamamlayan 211 ücretsiz araç.",
  applicationName: "ByteQuant",
  authors: [{ name: "ByteQuant Editorial", url: "https://bytequant.org/hakkimizda" }],
  creator: "ByteQuant",
  publisher: "ByteQuant",
  alternates: { canonical: BYTEQUANT_CANONICAL_ORIGIN },
  other: { "bytequant:canonical-origin": BYTEQUANT_CANONICAL_ORIGIN, "bytequant:build-signature": BYTEQUANT_BUILD_SIGNATURE, "google-adsense-account": "ca-pub-4158794981134847" },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: { type: "website", siteName: "ByteQuant", locale: "tr_TR", alternateLocale: ["en_US", "de_DE", "zh_CN"], url: "https://bytequant.org", title: "ByteQuant · Yerel İş İstasyonu ve 211 Tarayıcı Aracı", description: "211 ücretsiz araç, açıklanabilir çok adımlı planlar, şifreli cihaz içi projeler ve sunucusuz P2P. Üyelik, veri yükleme ve uzak model yok.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "ByteQuant Yerel İş İstasyonu: JSON doğrulama, hassas veri maskeleme ve CSV hazırlama akışı" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant · Yerel İş İstasyonu + 211 Araç", description: "Görsel akışlar, çok adımlı yerel AI planlama, şifreli cihaz içi projeler ve güven kodlu P2P.", images: ["/og.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }], shortcut: "/favicon.png", apple: [{ url: "/favicon.png", sizes: "512x512", type: "image/png" }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning data-scroll-behavior="smooth" data-bytequant-origin={BYTEQUANT_CANONICAL_ORIGIN}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://*.adtrafficquality.google https://fundingchoicesmessages.google.com; script-src-attr 'none'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.googlesyndication.com https://*.googleusercontent.com https://*.doubleclick.net https://*.adtrafficquality.google; font-src 'self'; connect-src 'self' wss: https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://*.adtrafficquality.google https://fundingchoicesmessages.google.com; frame-src https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.adtrafficquality.google; media-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; upgrade-insecure-requests" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang=location.pathname.startsWith('/en/')||location.pathname==='/en'?'en':location.pathname.startsWith('/de/')||location.pathname==='/de'?'de':location.pathname.startsWith('/zh/')||location.pathname==='/zh'?'zh-CN':'tr'" }} />
        <meta name="bytequant:canonical-origin" content={BYTEQUANT_CANONICAL_ORIGIN} />
        <meta name="bytequant:build-signature" content={BYTEQUANT_BUILD_SIGNATURE} />
        <meta name="google-adsense-account" content="ca-pub-4158794981134847" />
      </head>
      <body data-bytequant-origin={BYTEQUANT_CANONICAL_ORIGIN} data-bytequant-signature={BYTEQUANT_BUILD_SIGNATURE}>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4158794981134847" crossOrigin="anonymous" strategy="afterInteractive" />
        <DomainGuard />
        <PwaProvider>{children}</PwaProvider>
      </body>
    </html>
  );
}
