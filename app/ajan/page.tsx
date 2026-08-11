import type { Metadata } from "next";
import { AgentPage } from "../components/AgentPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";
const title = "Yerel AI Ajanı · Tarayıcı İçi Sohbet ve Araç Otomasyonu";
const description = "Qwen3 ile gerçek yerel AI sohbeti veya hızlı açıklanabilir planlama kullanın; 317 ByteQuant aracını uzak çıkarım API'si olmadan cihazınızda yönlendirin.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "agent"), pathFor("en", "agent")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "agent")) };
export default function Page() { return <AgentPage locale="tr" />; }
