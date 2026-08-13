import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "ByteQuant AI · Private on-device chat and tool automation";
const description = "Discuss everyday questions, find the right ByteQuant tool, and complete supported tasks on your device without sending chat or tool input to a remote AI API.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("en", title, description, pathFor("en", "agent")) };
export default function Page() { return <AgentPage locale="en" />; }
