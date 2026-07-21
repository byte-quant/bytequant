import type { Metadata } from "next";
import { WorkstationPage } from "../../components/WorkstationPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Workstation · Visual Browser Tool Workflows";
const description = "Connect 131 ByteQuant tools as visual nodes, encrypt projects on-device, and share through URL recipes or serverless WebRTC.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "workstation"), pathFor("en", "workstation")), ...localizedSocialMetadata("en", title, description, pathFor("en", "workstation")) };
export default function Page() { return <WorkstationPage locale="en" />; }
