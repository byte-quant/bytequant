import type { Metadata } from "next";
import { CommunityPage } from "../components/CommunityPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";

const title = "Açık Kaynak Topluluğu · Güvenli İş Akışı Paylaşımı";
const description = "İş akışınızı cihazınızda hazırlayın, kişisel veri ve sırları ön kontrolden geçirin; güvenli taslağı ByteQuant açık kaynak topluluğuyla paylaşın.";

export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "community"), pathFor("en", "community")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "community")) };
export default function Page() { return <CommunityPage locale="tr" />; }
