"use client";

import Link from "next/link";
import { useEffect } from "react";
import { toolPath, type Locale } from "../lib/site";

const copy = {
  tr: { eyebrow: "ARAÇ BİRLEŞTİRİLDİ", title: "Bu işlev daha kapsamlı araca taşındı", body: "Aynı işi yapan iki ayrı sayfa yerine, örnekleri ve gelişmiş seçenekleri tek bir güncel araçta birleştirdik.", action: "Güncel araca geç" },
  en: { eyebrow: "TOOL CONSOLIDATED", title: "This feature has moved to a more capable tool", body: "Instead of maintaining two pages for the same task, examples and advanced options now live in one current tool.", action: "Open the current tool" },
  de: { eyebrow: "WERKZEUG ZUSAMMENGEFÜHRT", title: "Diese Funktion wurde in ein umfangreicheres Werkzeug verschoben", body: "Statt zwei Seiten für dieselbe Aufgabe zu pflegen, befinden sich Beispiele und erweiterte Optionen jetzt in einem aktuellen Werkzeug.", action: "Aktuelles Werkzeug öffnen" },
  zh: { eyebrow: "工具已合并", title: "此功能已迁移到功能更完整的工具", body: "同一任务不再由两个页面重复提供；示例与高级选项现已整合到一个持续更新的工具中。", action: "打开当前工具" },
} as const;

export function ToolAliasRedirect({ locale, canonicalSlug, toolTitle }: { locale: Locale; canonicalSlug: string; toolTitle: string }) {
  const target = toolPath(locale, canonicalSlug);
  const text = copy[locale];
  useEffect(() => { window.location.replace(target); }, [target]);
  return <main className="tool-alias-main"><section className="tool-alias-card" role="status"><span className="kicker">{text.eyebrow}</span><h1>{text.title}</h1><p>{text.body}</p><Link className="primary-button" href={target}>{text.action}: {toolTitle} →</Link></section></main>;
}
