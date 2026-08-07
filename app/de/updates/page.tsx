import type { Metadata } from "next";
import { NewsPage } from "../../components/NewsPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
import { nonIndexableRobots } from "../../lib/content-quality";
const title = "Wissenschaft, Technik & Sicherheit aktuell | ByteQuant";
const description = "Endlicher, quellentransparenter ByteQuant-Feed aus offiziellen NASA-, NIST- und offen lizenzierten GOV.UK-Quellen mit lokalen Filtern und Leserahmen.";
export const metadata: Metadata = { title, description, robots: nonIndexableRobots, alternates: localizedAlternates("de", pathFor("tr", "news"), pathFor("en", "news")), ...localizedSocialMetadata("de", title, description, pathFor("de", "news")) };
export default function Page() { return <NewsPage locale="de" />; }
