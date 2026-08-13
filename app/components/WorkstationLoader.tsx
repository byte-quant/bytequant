"use client";

import dynamic from "next/dynamic";
import type { Locale } from "../lib/site";

const loadingCopy = {
  tr: "ByteQuant İş İstasyonu cihazınızda hazırlanıyor…",
  en: "ByteQuant Workstation is loading on your device…",
  de: "ByteQuant Workstation wird auf Ihrem Gerät geladen…",
  zh: "ByteQuant 工作站正在您的设备上加载…",
} as const;

function Loading({ locale }: { locale: Locale }) {
  return <div className="workstation-loading" role="status"><span /><p>{loadingCopy[locale]}</p></div>;
}

const loadWorkstation = () => import("./WorkstationClient");
const WorkstationTr = dynamic(loadWorkstation, { ssr: false, loading: () => <Loading locale="tr" /> });
const WorkstationEn = dynamic(loadWorkstation, { ssr: false, loading: () => <Loading locale="en" /> });
const WorkstationDe = dynamic(loadWorkstation, { ssr: false, loading: () => <Loading locale="de" /> });
const WorkstationZh = dynamic(loadWorkstation, { ssr: false, loading: () => <Loading locale="zh" /> });

export function WorkstationLoader({ locale }: { locale: Locale }) {
  const WorkstationClient = locale === "tr" ? WorkstationTr : locale === "de" ? WorkstationDe : locale === "zh" ? WorkstationZh : WorkstationEn;
  return <WorkstationClient locale={locale} />;
}
