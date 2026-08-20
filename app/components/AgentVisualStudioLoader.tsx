"use client";

import { lazy, Suspense, useState } from "react";
import type { Locale } from "../lib/site";

const AgentVisualStudio = lazy(() => import("./AgentVisualStudio").then((module) => ({ default: module.AgentVisualStudio })));

const copy = {
  tr: { title: "Görseli düzenleyin veya yeni bir taslak oluşturun", text: "Bir görsel yükleyip ne istediğinizi yazın ya da istemden özgün bir vektör taslak üretin. İşlem yalnız bu sekmede başlar.", open: "Görsel stüdyoyu aç", loading: "Görsel stüdyo hazırlanıyor…" },
  en: { title: "Edit an image or create a new visual draft", text: "Upload an image and describe the edit, or create an original vector draft from a prompt. Work starts only in this tab.", open: "Open Visual Studio", loading: "Preparing Visual Studio…" },
  de: { title: "Bild bearbeiten oder neuen Entwurf erstellen", text: "Laden Sie ein Bild hoch und beschreiben Sie die Änderung oder erstellen Sie aus einem Prompt einen eigenen Vektorentwurf. Die Verarbeitung startet nur in diesem Tab.", open: "Bildstudio öffnen", loading: "Bildstudio wird vorbereitet…" },
  zh: { title: "编辑图片或创建全新视觉草稿", text: "上传图片并描述修改要求，或根据提示词创建原创矢量草稿。所有处理仅在当前标签页开始。", open: "打开视觉工作室", loading: "正在准备视觉工作室…" },
} as const;

type Props = {
  locale: Locale;
  initialCommand?: string;
  initialFile?: File | null;
  openOnMount?: boolean;
  embedded?: boolean;
  onClose?: () => void;
};

export function AgentVisualStudioLoader({ locale, initialCommand = "", initialFile = null, openOnMount = false, embedded = false, onClose }: Props) {
  const [openedByUser, setOpenedByUser] = useState(false);
  const open = openOnMount || openedByUser;
  const c = copy[locale];
  if (open) return <Suspense fallback={<div className="agent-visual-loading" role="status"><span /><strong>{c.loading}</strong></div>}><AgentVisualStudio locale={locale} initialCommand={initialCommand} initialFile={initialFile} embedded={embedded} onClose={onClose ?? (() => setOpenedByUser(false))} /></Suspense>;
  return <div className="agent-visual-gate"><div><span className="kicker">BYTEQUANT VISUAL</span><h2>{c.title}</h2><p>{c.text}</p></div><button className="primary-button" type="button" onClick={() => setOpenedByUser(true)}><span aria-hidden="true">◫</span>{c.open}<i aria-hidden="true">→</i></button></div>;
}
