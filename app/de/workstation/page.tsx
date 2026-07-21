import type { Metadata } from "next";
import { WorkstationPage } from "../../components/WorkstationPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Workstation · Visuelle Browser-Abläufe";
const description = "104 ByteQuant-Werkzeuge visuell verbinden, Projekte lokal verschlüsseln und per URL-Rezept oder serverlosem WebRTC teilen.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("de", pathFor("tr", "workstation"), pathFor("en", "workstation")), ...localizedSocialMetadata("de", title, description, pathFor("de", "workstation")) };
export default function Page() { return <WorkstationPage locale="de" />; }
