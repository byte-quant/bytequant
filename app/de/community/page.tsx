import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const title = "Open-Source-Community · Sicher Abläufe teilen";
const description = "Abläufe lokal vorbereiten, Personendaten und Geheimnisse vorprüfen und einen sicheren Entwurf mit der ByteQuant-Community teilen.";

export const metadata: Metadata = { title, description, alternates: localizedAlternates("de", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("de", title, description, pathFor("de", "community")) };
export default function Page() { return <CommunityPage locale="de" />; }
