"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "../lib/site";

type PlanTool = { slug: string; title: string; href: string; prepare: string; verify: string };

const copy = {
  tr: { eyebrow: "UYGULAMA PLANI", title: "Okuduklarınızı güvenli bir denemeye dönüştürün", intro: "Gerçek veriye geçmeden önce sentetik bir örnekle adımları tamamlayın. İşaretler yalnızca bu sekmede tutulur.", progress: "tamamlandı", open: "Aracı aç", copy: "Planı kopyala", copied: "Plan panoya kopyalandı.", copyError: "Pano izni verilmedi. Adımları ekrandan takip edebilirsiniz.", reset: "Sıfırla", privacy: "Bu kontrol listesi hesap oluşturmaz, sunucuya gönderilmez ve sayfa yenilendiğinde temizlenir.", prepare: "Hazırlık", verify: "Kabul kontrolü" },
  en: { eyebrow: "ACTION PLAN", title: "Turn the guide into a safe trial", intro: "Complete the steps with a synthetic example before using real data. Checkmarks live only in this tab.", progress: "complete", open: "Open tool", copy: "Copy plan", copied: "Plan copied to the clipboard.", copyError: "Clipboard access was unavailable. You can still follow the steps on screen.", reset: "Reset", privacy: "This checklist creates no account, sends nothing to a server, and clears when the page reloads.", prepare: "Prepare", verify: "Acceptance check" },
  de: { eyebrow: "AKTIONSPLAN", title: "Den Ratgeber sicher ausprobieren", intro: "Führen Sie die Schritte zuerst mit einem synthetischen Beispiel aus. Häkchen bleiben nur in diesem Tab.", progress: "abgeschlossen", open: "Werkzeug öffnen", copy: "Plan kopieren", copied: "Plan wurde in die Zwischenablage kopiert.", copyError: "Kein Zugriff auf die Zwischenablage. Die Schritte bleiben auf dem Bildschirm verfügbar.", reset: "Zurücksetzen", privacy: "Diese Liste erstellt kein Konto, sendet nichts an einen Server und wird beim Neuladen gelöscht.", prepare: "Vorbereitung", verify: "Abnahmekontrolle" },
  zh: { eyebrow: "行动计划", title: "把指南转化为安全试用流程", intro: "在使用真实数据前，请先用合成示例完成这些步骤。勾选状态只保留在当前标签页。", progress: "已完成", open: "打开工具", copy: "复制计划", copied: "计划已复制到剪贴板。", copyError: "无法访问剪贴板，您仍可按屏幕步骤执行。", reset: "重置", privacy: "此清单不创建账户、不向服务器发送数据，并会在刷新页面后清除。", prepare: "准备", verify: "验收检查" },
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
      <header><div><span className="kicker">{t.eyebrow}</span><h2 id="guide-action-plan-title">{t.title}</h2><p>{t.intro}</p></div><div className="guide-plan-progress" aria-label={`${progress}% ${t.progress}`}><strong>{progress}%</strong><span>{completed.length}/{tools.length} {t.progress}</span><i><b style={{ width: `${progress}%` }} /></i></div></header>
      <ol>{tools.map((tool, index) => { const checked = completed.includes(tool.slug); return <li key={tool.slug} className={checked ? "is-complete" : ""}><button type="button" aria-pressed={checked} onClick={() => toggle(tool.slug)}><span aria-hidden="true">{checked ? "✓" : String(index + 1).padStart(2, "0")}</span><span><strong>{tool.title}</strong><small><b>{t.prepare}:</b> {tool.prepare}</small><small><b>{t.verify}:</b> {tool.verify}</small></span></button><Link href={tool.href}>{t.open} →</Link></li>; })}</ol>
      <footer><p>● {t.privacy}</p><div><button type="button" className="secondary-button" onClick={() => { setCompleted([]); setMessage(""); }}>{t.reset}</button><button type="button" className="primary-button" onClick={copyPlan}>{t.copy}</button></div></footer>
      <p className="sr-only" role="status" aria-live="polite">{message}</p>
    </section>
  );
}
