import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const title = "Open-source Community · Safe Workflow Sharing";
const description = "Prepare a workflow on-device, pre-screen personal data and secrets, and share a safe draft with the ByteQuant open-source community.";

export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("en", title, description, pathFor("en", "community")) };
export default function Page() { return <CommunityPage locale="en" />; }
