import type { Metadata } from "next";
import { NewsPage } from "../../components/NewsPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Science, Technology & Security Updates | ByteQuant";
const description = "A source-transparent ByteQuant update feed built from official NASA and NIST RSS, with on-device favorites and direct original links.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "news"), pathFor("en", "news")), ...localizedSocialMetadata("en", title, description, pathFor("en", "news")) };
export default function Page() { return <NewsPage locale="en" />; }
