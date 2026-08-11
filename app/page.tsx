import type { Metadata } from "next";
import { HomePage } from "./components/HomePage";
import { localizedAlternates, localizedSocialMetadata } from "./lib/site";

const description = "Prompt, metin, hesaplama, PDF, görsel, geliştirici, araştırma, AI ve güvenlik işlemleri için 317 benzersiz ücretsiz araç. Üyelik yok; temel işlemler tarayıcınızda.";

export const metadata: Metadata = {
  title: { absolute: "ByteQuant · Gizlilik Odaklı Tarayıcı İçi Araçlar" },
  description,
  alternates: localizedAlternates("tr", "/", "/en"),
  ...localizedSocialMetadata("tr", "Gizlilik Odaklı Tarayıcı İçi Araçlar", description, "/"),
};

export default function Home() { return <HomePage locale="tr" />; }
