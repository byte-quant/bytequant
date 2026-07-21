import type { Metadata } from "next";
import { WorkstationPage } from "../components/WorkstationPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";
const title = "İş İstasyonu · Görsel Araç Akışları";
const description = "131 ByteQuant aracını görsel düğümlerle bağlayın; projeleri cihazda şifreleyin, URL tarifleri ve sunucusuz WebRTC ile paylaşın.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "workstation"), pathFor("en", "workstation")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "workstation")) };
export default function Page() { return <WorkstationPage locale="tr" />; }
