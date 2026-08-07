import type { Metadata } from "next";
import { CommunityPage } from "../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";
import { nonIndexableRobots } from "../lib/content-quality";

const title = "Global ByteQuant Topluluğu · Akışlar, Gruplar ve Profiller";
const description = "Açık Nostr ağı üzerinden global gönderileri okuyun; cihazda şifreli taşınabilir profilinizle iş akışı paylaşın, yorum yapın, beğenin ve grupları keşfedin.";

export const metadata: Metadata = { title, description, robots: nonIndexableRobots, alternates: localizedAlternates("tr", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "community")) };
export default function Page() { return <CommunityPage locale="tr" />; }
