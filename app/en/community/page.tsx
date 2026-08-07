import type { Metadata } from "next";
import { CommunityPage } from "../../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../../lib/site";
import { nonIndexableRobots } from "../../lib/content-quality";

const title = "Global ByteQuant Community · Workflows, Groups, and Profiles";
const description = "Read global posts over the open Nostr network; use a portable profile encrypted on your device to share workflows, reply, react, and discover groups.";

export const metadata: Metadata = { title, description, robots: nonIndexableRobots, alternates: localizedAlternates("en", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("en", title, description, pathFor("en", "community")) };
export default function Page() { return <CommunityPage locale="en" />; }
