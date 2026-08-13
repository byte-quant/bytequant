import type { Metadata } from "next";
import { WorkstationPage } from "../../components/WorkstationPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Visueller Workflow-Builder · Workstation";
const description = "Wiederkehrende Text- und Datenaufgaben in klare Abläufe verwandeln. 317 kostenlose Browser-Werkzeuge nutzen; der Arbeitsstand bleibt auf Ihrem Gerät.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("de", pathFor("tr", "workstation"), pathFor("en", "workstation")), ...localizedSocialMetadata("de", title, description, pathFor("de", "workstation")) };
export default function Page() { return <WorkstationPage locale="de" />; }
