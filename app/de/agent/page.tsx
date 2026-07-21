import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Lokaler Agent · Werkzeug-Orchestrierung im Browser";
const description = "Beschreiben Sie Ihr Ziel und erstellen Sie einen nachvollziehbaren, nutzergesteuerten Ablauf über 104 ByteQuant-Werkzeuge – ohne Remote-Modell oder Upload.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("de", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("de", title, description, pathFor("de", "agent")) };
export default function Page() { return <AgentPage locale="de" />; }
