import type { Metadata } from "next";
import { NewsPage } from "../../components/NewsPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Science, Technology & Security Updates | ByteQuant";
const description = "A finite, source-transparent ByteQuant update feed from official NASA, NIST, and openly licensed GOV.UK sources, with local search, reading lenses, and saved cards.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "news"), pathFor("en", "news")), ...localizedSocialMetadata("en", title, description, pathFor("en", "news")) };
export default function Page() { return <NewsPage locale="en" />; }
