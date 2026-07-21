"use client";

import { useState } from "react";
import type { Locale } from "../lib/site";

const copy = {
  tr: { idle: "Son 7 günlük aktiviteyi göster", loading: "GitHub aktivitesi alınıyor…", result: "Son 7 günde {count} commit", error: "Aktivite şu an alınamadı; depo bağlantısı çalışmaya devam ediyor.", note: "İsteğe bağlı kontrol, tıkladığınızda GitHub'ın herkese açık API'sine doğrudan istek gönderir; araç girdileri gönderilmez." },
  en: { idle: "Show activity from the last 7 days", loading: "Fetching GitHub activity…", result: "{count} commits in the last 7 days", error: "Activity is unavailable right now; the repository link still works.", note: "This optional check sends a direct request to GitHub's public API only after you click; no tool input is included." },
  de: { idle: "Aktivität der letzten 7 Tage anzeigen", loading: "GitHub-Aktivität wird geladen…", result: "{count} Commits in den letzten 7 Tagen", error: "Aktivität ist derzeit nicht abrufbar; der Repository-Link bleibt verfügbar.", note: "Diese optionale Abfrage sendet erst nach Ihrem Klick eine direkte Anfrage an die öffentliche GitHub-API; Werkzeugeingaben werden nicht übertragen." },
  zh: { idle: "查看最近 7 天活动", loading: "正在获取 GitHub 活动…", result: "最近 7 天有 {count} 次提交", error: "暂时无法获取活动；代码仓库链接仍可使用。", note: "仅在您点击后，此可选检查才会直接请求 GitHub 公共 API；不会包含任何工具输入。" },
} as const;

export function GitHubActivity({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState(0);
  async function load() {
    if (state === "loading") return;
    setState("loading");
    const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), 7000);
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const response = await fetch(`https://api.github.com/repos/byte-quant/bytequant/commits?since=${encodeURIComponent(since)}&per_page=100`, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal });
      if (!response.ok) throw new Error("github");
      const value: unknown = await response.json(); if (!Array.isArray(value)) throw new Error("github");
      setCount(value.length); setState("done");
    } catch { setState("error"); }
    finally { window.clearTimeout(timeout); }
  }
  return <div className="github-activity"><button type="button" onClick={load} disabled={state === "loading"}>{state === "loading" ? t.loading : state === "done" ? t.result.replace("{count}", count === 100 ? "100+" : String(count)) : t.idle}</button>{state === "error" && <p role="status">{t.error}</p>}<small>{t.note}</small></div>;
}
