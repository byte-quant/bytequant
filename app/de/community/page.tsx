import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
import { nonIndexableRobots } from "../../lib/content-quality";

const title = "Globale ByteQuant-Community · Abläufe, Gruppen und Profile";
const description = "Globale Beiträge über das offene Nostr-Netz lesen und mit einem lokal verschlüsselten portablen Profil Abläufe teilen, antworten, reagieren und Gruppen entdecken.";

export const metadata: Metadata = { title, description, robots: nonIndexableRobots, alternates: localizedAlternates("de", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("de", title, description, pathFor("de", "community")) };
export default function Page() { return <CommunityPage locale="de" />; }
