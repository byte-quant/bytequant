import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { localizedAlternates, localizedSocialMetadata } from "../lib/site";
const description = "ByteQuant araç girdileri, yerel tercihler, barındırma kayıtları, reklam ve KVKK/GDPR hakları hakkında gizlilik politikası.";
export const metadata: Metadata = { title: "Gizlilik Politikası", description, alternates: localizedAlternates("tr", "/gizlilik-politikasi", "/en/privacy"), ...localizedSocialMetadata("tr", "Gizlilik Politikası", description, "/gizlilik-politikasi") };
export default function Page() { return <InfoPage pageKey="privacy" locale="tr" />; }
