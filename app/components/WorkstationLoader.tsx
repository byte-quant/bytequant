"use client";

import dynamic from "next/dynamic";
import type { Locale } from "../lib/site";

const WorkstationClient = dynamic(() => import("./WorkstationClient"), {
  ssr: false,
  loading: () => <div className="workstation-loading" role="status"><span /><p>ByteQuant Workstation is loading locally…</p></div>,
});

export function WorkstationLoader({ locale }: { locale: Locale }) { return <WorkstationClient locale={locale} />; }
