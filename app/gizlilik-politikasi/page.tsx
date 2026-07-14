import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
export const metadata: Metadata = { title: "Gizlilik Politikası", description: "ByteQuant araç girdileri, yerel tercihler, barındırma kayıtları, reklam ve KVKK/GDPR hakları hakkında gizlilik politikası.", alternates: { canonical: "/gizlilik-politikasi", languages: { "tr-TR": "/gizlilik-politikasi", "en-US": "/en/privacy" } } };
export default function Page() { return <InfoPage pageKey="privacy" locale="tr" />; }

