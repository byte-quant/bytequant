import type { Metadata } from "next";
import { HomePage } from "../components/HomePage";
import { absoluteUrl, localizedAlternates, ogImageUrl } from "../lib/site";

export const metadata: Metadata = {
  title: { absolute: "ByteQuant · Datenschutzorientierte Browser-Werkzeuge" },
  description: "104 kostenlose Werkzeuge für Daten, Dateien, Berechnungen, KI-Workflows und Code-Sicherheits-Vorprüfungen. Kernverarbeitung bleibt im Browser.",
  alternates: localizedAlternates("de", "/", "/en"),
  openGraph: { type: "website", siteName: "ByteQuant", locale: "de_DE", alternateLocale: ["tr_TR", "en_US", "zh_CN"], url: absoluteUrl("/de"), title: "ByteQuant · Datenschutzorientierte Browser-Werkzeuge", description: "104 kostenlose Werkzeuge ohne Konto oder Server-Upload.", images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "ByteQuant Datenschutzwerkzeuge" }] },
  twitter: { card: "summary_large_image", title: "ByteQuant", description: "Datenschutzorientierte Werkzeuge im Browser.", images: [ogImageUrl] },
};
export default function GermanHome() { return <div lang="de"><HomePage locale="de" /></div>; }
