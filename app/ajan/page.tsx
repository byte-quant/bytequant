import type { Metadata } from "next";
import { AgentPage } from "../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";
const title = "ByteQuant AI · Cihaz İçi Sohbet ve Araç Otomasyonu";
const description = "Günlük sorularınızı konuşun, doğru ByteQuant aracını bulun ve desteklenen işlemleri cihazınızda tamamlayın; uzak AI API'sine sohbet veya araç girdisi gönderilmez.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "agent")) };
export default function Page() { return <AgentPage locale="tr" />; }
