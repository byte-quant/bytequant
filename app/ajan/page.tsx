import type { Metadata } from "next";
import { AgentPage } from "../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";
const title = "Yerel Ajan · Tarayıcı İçi Akıllı Araç Orkestrasyonu";
const description = "Hedefinizi doğal dille yazın; ByteQuant'ın 131 aracında tamamen tarayıcı içi, açıklanabilir ve kullanıcı denetimli çok adımlı bir plan oluşturun.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "agent")) };
export default function Page() { return <AgentPage locale="tr" />; }
