import type { Metadata } from "next";
import { NewsPage } from "../components/NewsPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";
const title = "Bilim, Teknoloji ve Güvenlik Gündemi | ByteQuant";
const description = "NASA, NIST ve açık lisanslı GOV.UK resmî akışlarından derlenen; dört dilde okuma notları, yerel arama ve cihazda kayıt sunan kaynak şeffaf ByteQuant gündemi.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "news"), pathFor("en", "news")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "news")) };
export default function Page() { return <NewsPage locale="tr" />; }
