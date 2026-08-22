import type { Metadata } from "next";
import { ToolLibraryPage } from "../components/ToolLibraryPage";
import { localizedAlternates, localizedSocialMetadata } from "../lib/site";

const description = "Metin, veri, PDF, görsel, hesaplama, kod ve gizlilik işleri için 327 ücretsiz tarayıcı aracı. Arayın, kategori seçin ve üyelik olmadan başlayın.";
export const metadata: Metadata = {
  title: "Ücretsiz Tarayıcı Araçları",
  description,
  alternates: localizedAlternates("tr", "/araclar", "/en/tools"),
  ...localizedSocialMetadata("tr", "Ücretsiz Tarayıcı Araçları", description, "/araclar"),
};

export default function TurkishToolLibrary() { return <ToolLibraryPage locale="tr" />; }
