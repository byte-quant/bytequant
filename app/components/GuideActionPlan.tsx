"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "../lib/site";

type PlanTool = { slug: string; title: string; href: string; prepare: string; verify: string };

const copy = {
  tr: { eyebrow: "UYGULAMA PLANI", title: "Okuduklarınızı güvenli bir denemeye dönüştürün", intro: (guide: string, firstTool: string) => `“${guide}” adımlarını gerçek veriye geçmeden önce sentetik bir örnekle ${firstTool} üzerinde deneyin. İşaretler yalnızca bu sekmede tutulur.`, progress: "tamamlandı", open: "Aracı aç", copy: "Planı kopyala", copied: "Plan panoya kopyalandı.", copyError: "Pano izni verilmedi. Adımları ekrandan takip edebilirsiniz.", reset: "Sıfırla", privacy: (guide: string) => `“${guide}” kontrol listesi hesap oluşturmaz veya içeriğinizi sunucuya göndermez; ilerleme sayfa yenilendiğinde temizlenir.`, prepare: "Hazırlık", verify: "Kabul kontrolü" },
  en: { eyebrow: "ACTION PLAN", title: "Turn the guide into a safe trial", intro: (guide: string, firstTool: string) => `Test the steps in “${guide}” with synthetic data in ${firstTool} before using live material. Checkmarks remain only in this tab.`, progress: "complete", open: "Open tool", copy: "Copy plan", copied: "Plan copied to the clipboard.", copyError: "Clipboard access was unavailable. You can still follow the steps on screen.", reset: "Reset", privacy: (guide: string) => `The “${guide}” checklist creates no account and sends none of your content to a server; progress clears when the page reloads.`, prepare: "Prepare", verify: "Acceptance check" },
  de: { eyebrow: "AKTIONSPLAN", title: "Den Ratgeber sicher ausprobieren", intro: (guide: string, firstTool: string) => `Testen Sie die Schritte aus „${guide}“ zuerst mit synthetischen Daten in ${firstTool}. Häkchen bleiben nur in diesem Tab.`, progress: "abgeschlossen", open: "Werkzeug öffnen", copy: "Plan kopieren", copied: "Plan wurde in die Zwischenablage kopiert.", copyError: "Kein Zugriff auf die Zwischenablage. Die Schritte bleiben auf dem Bildschirm verfügbar.", reset: "Zurücksetzen", privacy: (guide: string) => `Die Checkliste zu „${guide}“ erstellt kein Konto und sendet keine Inhalte an einen Server; der Fortschritt wird beim Neuladen gelöscht.`, prepare: "Vorbereitung", verify: "Abnahmekontrolle" },
  zh: { eyebrow: "行动计划", title: "把指南转化为安全试用流程", intro: (guide: string, firstTool: string) => `使用真实资料前，请先在${firstTool}中用合成数据试做《${guide}》的步骤。勾选状态只保留在当前标签页。`, progress: "已完成", open: "打开工具", copy: "复制计划", copied: "计划已复制到剪贴板。", copyError: "无法访问剪贴板，您仍可按屏幕步骤执行。", reset: "重置", privacy: (guide: string) => `《${guide}》清单不会创建账户，也不会把您的内容发送到服务器；页面刷新后进度会被清除。`, prepare: "准备", verify: "验收检查" },
} as const;

export function GuideActionPlan({ guideTitle, locale, tools }: { guideTitle: string; locale: Locale; tools: PlanTool[] }) {
  const t = copy[locale];
  const [completed, setCompleted] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const progress = tools.length ? Math.round((completed.length / tools.length) * 100) : 0;
  const planText = useMemo(() => [guideTitle, ...tools.flatMap((tool, index) => [`${index + 1}. ${tool.title}`, `   ${t.prepare}: ${tool.prepare}`, `   ${t.verify}: ${tool.verify}`])].join("\n"), [guideTitle, tools, t.prepare, t.verify]);

  if (!tools.length) return null;
  const toggle = (slug: string) => setCompleted((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  const copyPlan = async () => {
    try { await navigator.clipboard.writeText(planText); setMessage(t.copied); }
    catch { setMessage(t.copyError); }
  };

  return (
    <section className="guide-action-plan" aria-labelledby="guide-action-plan-title" data-guide-action-plan="interactive">
      <header><div><span className="kicker">{t.eyebrow}</span><h2 id="guide-action-plan-title">{t.title}</h2><p>{t.intro(guideTitle, tools[0].title)}</p></div><div className="guide-plan-progress" aria-label={`${progress}% ${t.progress}`}><strong>{progress}%</strong><span>{completed.length}/{tools.length} {t.progress}</span><i><b style={{ width: `${progress}%` }} /></i></div></header>
      <ol>{tools.map((tool, index) => { const checked = completed.includes(tool.slug); return <li key={tool.slug} className={checked ? "is-complete" : ""}><button type="button" aria-pressed={checked} onClick={() => toggle(tool.slug)}><span aria-hidden="true">{checked ? "✓" : String(index + 1).padStart(2, "0")}</span><span><strong>{tool.title}</strong><small><b>{t.prepare}:</b> {tool.prepare}</small><small><b>{t.verify}:</b> {tool.verify}</small></span></button><Link href={tool.href}>{t.open} →</Link></li>; })}</ol>
      <footer><p>● {t.privacy(guideTitle)}</p><div><button type="button" className="secondary-button" onClick={() => { setCompleted([]); setMessage(""); }}>{t.reset}</button><button type="button" className="primary-button" onClick={copyPlan}>{t.copy}</button></div></footer>
      <p className="sr-only" role="status" aria-live="polite">{message}</p>
    </section>
  );
}
