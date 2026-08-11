import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Lokaler KI-Agent · Privater Browser-Chat und Werkzeugautomatisierung";
const description = "Nutzen Sie echte lokale Qwen3-Konversation oder schnelle nachvollziehbare Planung für 317 ByteQuant-Werkzeuge – ohne Remote-Inferenz-API oder Daten-Upload.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("de", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("de", title, description, pathFor("de", "agent")) };
export default function Page() { return <AgentPage locale="de" />; }
