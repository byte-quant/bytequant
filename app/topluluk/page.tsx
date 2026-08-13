import type { Metadata } from "next";
import { CommunityPage } from "../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";

const title = "ByteQuant Topluluğu · İş Akışları, Sorular ve Fikirler";
const description = "Hesap açmadan global ByteQuant konu akışını okuyun; hazır olduğunuzda cihazınızda şifrelenen profilinizle paylaşın, yanıtlayın ve faydalı fikirleri kaydedin.";

export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "community")) };
export default function Page() { return <CommunityPage locale="tr" />; }
