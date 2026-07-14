import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { localizedAlternates } from "../lib/site";

export const metadata: Metadata = {
  title: "Çerez ve Yerel Depolama Politikası",
  description: "ByteQuant'ın çerezsiz çalışma modelini, gerekli ve isteğe bağlı localStorage anahtarlarını, saklama sürelerini ve gizlilik tercihlerini inceleyin.",
  alternates: localizedAlternates("tr", "/cerez-politikasi", "/en/cookies"),
};

export default function Page() {
  return <InfoPage pageKey="cookies" locale="tr" />;
}
