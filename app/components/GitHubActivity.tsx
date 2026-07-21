import Link from "next/link";
import type { Locale } from "../lib/site";

const copy = {
  tr: {
    eyebrow: "Doğrulanabilir proje sağlığı",
    title: "Her ana dal güncellemesi derlenir ve test edilir",
    snapshot: "16 doğrulanmış güncelleme",
    through: "22 Temmuz 2026 tarihine kadar",
    items: ["Kilitli bağımlılıklarla yeniden üretilebilir kurulum", "Üretim derlemesi ve otomatik testler", "Başarılı kontrolden sonra statik dağıtım"],
    workflow: "CI iş akışını incele",
    commits: "Değişiklik geçmişini aç",
    note: "Bu hafif özet sayfayla birlikte gelir; GitHub API'sine veya başka bir izleyiciye istek göndermez.",
  },
  en: {
    eyebrow: "Verifiable project health",
    title: "Every main-branch update is built and tested",
    snapshot: "16 verified updates",
    through: "through July 22, 2026",
    items: ["Reproducible install from a locked dependency graph", "Production build and automated tests", "Static deployment only after successful checks"],
    workflow: "Inspect the CI workflow",
    commits: "Open the change history",
    note: "This lightweight snapshot ships with the page; it calls neither the GitHub API nor any tracker.",
  },
  de: {
    eyebrow: "Überprüfbarer Projektstatus",
    title: "Jede Aktualisierung des Hauptzweigs wird gebaut und getestet",
    snapshot: "16 geprüfte Aktualisierungen",
    through: "bis 22. Juli 2026",
    items: ["Reproduzierbare Installation mit gesperrten Abhängigkeiten", "Produktions-Build und automatisierte Tests", "Statische Bereitstellung erst nach erfolgreichen Prüfungen"],
    workflow: "CI-Ablauf prüfen",
    commits: "Änderungsverlauf öffnen",
    note: "Diese kompakte Momentaufnahme wird mit der Seite ausgeliefert und ruft weder die GitHub-API noch Tracker auf.",
  },
  zh: {
    eyebrow: "可验证的项目状态",
    title: "主分支的每次更新都会经过构建和测试",
    snapshot: "16 次已验证更新",
    through: "截至 2026 年 7 月 22 日",
    items: ["基于锁定依赖图的可重复安装", "生产构建与自动化测试", "仅在检查通过后进行静态部署"],
    workflow: "查看 CI 工作流",
    commits: "查看变更历史",
    note: "此轻量摘要随页面提供，不会请求 GitHub API 或任何跟踪服务。",
  },
} as const;

export function GitHubActivity({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="github-activity" aria-labelledby="github-health-title">
      <div>
        <span className="eyebrow">{t.eyebrow}</span>
        <h3 id="github-health-title">{t.title}</h3>
        <p className="github-activity-snapshot"><strong>{t.snapshot}</strong> · {t.through}</p>
      </div>
      <ul>{t.items.map((item) => <li key={item}>{item}</li>)}</ul>
      <div className="button-row">
        <Link className="button secondary" href="https://github.com/byte-quant/bytequant/actions/workflows/deploy.yml">{t.workflow}</Link>
        <Link className="text-link" href="https://github.com/byte-quant/bytequant/commits/main">{t.commits}</Link>
      </div>
      <small>{t.note}</small>
    </section>
  );
}
