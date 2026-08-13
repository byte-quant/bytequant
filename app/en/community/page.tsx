import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";

const title = "ByteQuant Community · Workflows, Questions, and Ideas";
const description = "Read the global ByteQuant topic feed without an account; when ready, use a profile encrypted on your device to post, reply, and save useful ideas.";

export const metadata: Metadata = { title, description, alternates: localizedAlternates("en", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("en", title, description, pathFor("en", "community")) };
export default function Page() { return <CommunityPage locale="en" />; }
