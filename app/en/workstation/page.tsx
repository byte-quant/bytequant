import type { Metadata } from "next";
import { WorkstationPage } from "../../components/WorkstationPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Visual Workflow Builder · Workstation";
const description = "Turn repeated text and data tasks into clear step-by-step visual workflows. Use 317 free browser tools while progress stays on your device.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "workstation"), pathFor("en", "workstation")), ...localizedSocialMetadata("en", title, description, pathFor("en", "workstation")) };
export default function Page() { return <WorkstationPage locale="en" />; }
