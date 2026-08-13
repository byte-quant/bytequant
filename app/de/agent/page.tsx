import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "ByteQuant AI · Privater Geräte-Chat und Werkzeugautomatisierung";
const description = "Alltagsfragen besprechen, das passende ByteQuant-Werkzeug finden und unterstützte Aufgaben auf dem Gerät erledigen – ohne Gespräch oder Eingaben an eine entfernte KI-API zu senden.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("de", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("de", title, description, pathFor("de", "agent")) };
export default function Page() { return <AgentPage locale="de" />; }
