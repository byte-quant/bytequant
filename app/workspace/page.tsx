import type { Metadata } from "next";
import { WorkstationPage } from "../components/WorkstationPage";
import { absoluteUrl } from "../lib/site";
export const metadata: Metadata = { title: "Import Workstation Recipe", description: "Open a ByteQuant visual workflow recipe locally.", robots: { index: false, follow: false, noarchive: true }, alternates: { canonical: absoluteUrl("/en/workstation") } };
export default function Page() { return <WorkstationPage locale="en" importer />; }
