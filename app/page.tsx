import type { Metadata } from "next";
import { HomePage } from "./components/HomePage";
import { localizedAlternates } from "./lib/site";

export const metadata: Metadata = {
  title: { absolute: "ByteQuant · Gizlilik Odaklı Tarayıcı İçi Araçlar" },
  description: "Prompt, metin, hesaplama, PDF, görsel, geliştirici, AI ve güvenlik işlemleri için 104 ücretsiz araç. Üyelik yok; temel işlemler tarayıcınızda.",
  alternates: localizedAlternates("tr", "/", "/en"),
};

export default function Home() { return <HomePage locale="tr" />; }
