import type { Metadata } from "next";
import { AgentPage } from "../../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
const title = "Local AI Agent · Private in-browser chat and tool automation";
const description = "Use real on-device Qwen3 chat or fast explainable planning to coordinate 317 ByteQuant tools in your browser, with no remote inference API or data upload.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("en", title, description, pathFor("en", "agent")) };
export default function Page() { return <AgentPage locale="en" />; }
