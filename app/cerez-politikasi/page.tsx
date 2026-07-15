import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../lib/site";

const description = "ByteQuant'ın çerezsiz çalışma modelini, gerekli ve isteğe bağlı localStorage anahtarlarını, saklama sürelerini ve gizlilik tercihlerini inceleyin.";
export const metadata: Metadata = {
  title: "Çerez ve Yerel Depolama Politikası",
  description,
  alternates: localizedAlternates("tr", "/cerez-politikasi", "/en/cookies"),
  ...localizedSocialMetadata("tr", "Çerez ve Yerel Depolama Politikası", description, "/cerez-politikasi"),
};

export default function Page() {
  return <InfoPage pageKey="cookies" locale="tr" />;
}
