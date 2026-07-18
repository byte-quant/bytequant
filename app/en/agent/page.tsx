import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Local Agent · In-browser tool orchestration";
const description = "Describe an outcome and create an explainable, user-controlled workflow across 89 ByteQuant tools with no remote model or data upload.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("en", title, description, pathFor("en", "agent")) };
export default function Page() { return <AgentPage locale="en" />; }
