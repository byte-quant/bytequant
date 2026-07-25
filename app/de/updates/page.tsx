import type { Metadata } from "next";
import { NewsPage } from "../../components/NewsPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Wissenschaft, Technik & Sicherheit aktuell | ByteQuant";
const description = "Quellentransparente ByteQuant-Meldungen aus offiziellen NASA- und NIST-RSS-Feeds mit lokalen Favoriten und Originallinks.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("de", pathFor("tr", "news"), pathFor("en", "news")), ...localizedSocialMetadata("de", title, description, pathFor("de", "news")) };
export default function Page() { return <NewsPage locale="de" />; }
