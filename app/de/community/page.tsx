import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const title = "ByteQuant-Community · Abläufe, Fragen und Ideen";
const description = "Den globalen ByteQuant-Themenfeed ohne Konto lesen und bei Bedarf mit einem lokal verschlüsselten Profil Beiträge teilen, antworten und Ideen speichern.";

export const metadata: Metadata = { title, description, alternates: localizedAlternates("de", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("de", title, description, pathFor("de", "community")) };
export default function Page() { return <CommunityPage locale="de" />; }
