import type { Metadata } from "next";
import { ToolLibraryPage } from "../../components/ToolLibraryPage";
import { localizedAlternates, localizedSocialMetadata } from "../../lib/site";

const description = "Entdecken Sie 327 kostenlose Browser-Werkzeuge für Text, Daten, PDF, Bilder, Berechnungen, Code und Datenschutz. Ohne Konto starten.";
export const metadata: Metadata = {
  title: "Kostenlose Browser-Werkzeuge",
  description,
  alternates: localizedAlternates("de", "/araclar", "/en/tools"),
  ...localizedSocialMetadata("de", "Kostenlose Browser-Werkzeuge", description, "/de/tools"),
};

export default function GermanToolLibrary() { return <div lang="de"><ToolLibraryPage locale="de" /></div>; }
