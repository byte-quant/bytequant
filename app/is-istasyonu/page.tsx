import type { Metadata } from "next";
import { WorkstationPage } from "../components/WorkstationPage";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "../lib/site";
const title = "Görsel İş Akışı Oluşturucu · İş İstasyonu";
const description = "Tekrarlanan metin ve veri işlerini hazır, adım adım görsel akışlara dönüştürün. 317 ücretsiz araçla çalışın; ilerlemeniz yalnızca cihazınızda kalsın.";
export const metadata: Metadata = { title, description, alternates: localizedAlternates("tr", pathFor("tr", "workstation"), pathFor("en", "workstation")), ...localizedSocialMetadata("tr", title, description, pathFor("tr", "workstation")) };
export default function Page() { return <WorkstationPage locale="tr" />; }
