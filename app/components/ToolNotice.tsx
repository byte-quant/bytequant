import type { Locale } from "../lib/site";

export type ToolNoticeData = {
  kind: "error" | "warning" | "success" | "info";
  text: string;
};

export function ToolNotice({ notice, locale }: { notice: ToolNoticeData | null; locale: Locale }) {
  if (!notice) return null;
  const titles = {
    tr: { error: "İşlem tamamlanamadı", warning: "İnceleme gerekiyor", success: "İşlem tamamlandı", info: "Bilgi" },
    en: { error: "Could not complete the operation", warning: "Review required", success: "Operation completed", info: "Information" },
    de: { error: "Vorgang konnte nicht abgeschlossen werden", warning: "Prüfung erforderlich", success: "Vorgang abgeschlossen", info: "Information" },
    zh: { error: "无法完成操作", warning: "需要审查", success: "操作已完成", info: "信息" },
  }[locale];
  return (
    <div className={`tool-notice ${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"} aria-live={notice.kind === "error" ? "assertive" : "polite"}>
      <span aria-hidden="true">{notice.kind === "error" || notice.kind === "warning" ? "!" : notice.kind === "success" ? "✓" : "i"}</span>
      <div><strong>{titles[notice.kind]}</strong><p>{notice.text}</p></div>
    </div>
  );
}
