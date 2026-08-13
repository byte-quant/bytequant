import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "ByteQuant AI · Private on-device chat and tool automation";
const description = "Chat with ByteQuant AI, find the right tool, automate supported work, and edit images on your device without sending content to a remote AI API.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("en", title, description, pathFor("en", "agent")) };
export default function Page() { return <AgentPage locale="en" />; }
