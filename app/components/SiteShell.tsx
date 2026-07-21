import Link from "next/link";
import type { ReactNode } from "react";
import { copy, locales, organizationId, pathFor, siteUrl, websiteId, type Locale } from "../lib/site";
import { ConsentManager, PrivacySettingsButton } from "./ConsentManager";
import { ThemeToggle } from "./ThemeToggle";
import { BrandLogo } from "./BrandLogo";
import { CommandPalette } from "./CommandPalette";
import { referencePath } from "../lib/references";
import { tools } from "../lib/tools";
import { SchemaScript } from "./SchemaScript";
import { PwaInstall } from "./PwaInstall";

const localeNames = { tr: "Türkçe", en: "English", de: "Deutsch", zh: "简体中文" } as const;

export function SiteShell({ children, locale, alternateHref, languageHrefs }: { children: ReactNode; locale: Locale; alternateHref: string; languageHrefs?: Partial<Record<Locale, string>> }) {
  const t = copy[locale];
  const localized = (tr: string, en: string, de: string, zh: string) => ({ tr, en, de, zh })[locale];
  const hrefs: Record<Locale, string> = { tr: pathFor("tr", "home"), en: pathFor("en", "home"), de: pathFor("de", "home"), zh: pathFor("zh", "home"), ...languageHrefs };
  if (!languageHrefs) {
    if (locale === "tr") hrefs.en = alternateHref;
    if (locale === "en") hrefs.tr = alternateHref;
  }
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": organizationId, name: "ByteQuant", url: `${siteUrl}/`, logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.png`, width: 512, height: 512 }, email: "bytequant@yahoo.com", sameAs: ["https://x.com/byte_quant", "https://www.instagram.com/byte.quant"] },
      { "@type": "WebSite", "@id": websiteId, name: "ByteQuant", alternateName: ["Gizlilik odaklı üretkenlik araçları", "Privacy-first productivity tools", "Datenschutzorientierte Produktivitätswerkzeuge", "隐私优先的生产力工具"], url: `${siteUrl}/`, inLanguage: ["tr-TR", "en-US", "de-DE", "zh-CN"], publisher: { "@id": organizationId } },
    ],
  };
  return (
    <div className="site-shell">
      <SchemaScript data={globalSchema} />
      <a className="skip-link" href="#main-content">{localized("İçeriğe geç", "Skip to content", "Zum Inhalt", "跳到内容")}</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href={pathFor(locale, "home")} aria-label={`${t.brand} ${t.nav.home}`}>
            <BrandLogo />
            <span><strong>{t.brand}</strong><small>{t.descriptor}</small></span>
          </Link>
          <nav className="main-nav" aria-label={localized("Ana menü", "Main navigation", "Hauptnavigation", "主导航") }>
            <Link className="nav-library-link" href={pathFor(locale, "tools")}>{t.nav.tools}</Link>
            <Link className="agent-nav-link" href={pathFor(locale, "agent")}><span aria-hidden="true">✦</span>{localized("Yerel Ajan", "Local Agent", "Lokaler Agent", "本地助手")}</Link>
            <Link className="workstation-nav-link" href={pathFor(locale, "workstation")}><span aria-hidden="true">⌘</span>{localized("İş İstasyonu", "Workstation", "Workstation", "工作站")}</Link>
            <details className="nav-more-menu"><summary>{localized("Keşfet", "Explore", "Entdecken", "探索")}</summary><div><Link href={pathFor(locale, "blog")}>{t.nav.blog}</Link><Link href={pathFor(locale, "community")}>{localized("Topluluk", "Community", "Community", "社区")}</Link><Link href={pathFor(locale, "about")}>{t.nav.about}</Link><Link href={pathFor(locale, "faq")}>{t.nav.faq}</Link></div></details>
          </nav>
          <div className="header-actions">
            <CommandPalette locale={locale} />
            <PwaInstall locale={locale} compact />
            <details className="language-menu"><summary aria-label={localized("Dili değiştir", "Change language", "Sprache ändern", "切换语言")}><span className="language-menu-code" aria-hidden="true">{locale.toUpperCase()}</span><span className="language-menu-label">{localeNames[locale]}</span><span className="language-menu-chevron" aria-hidden="true">⌄</span></summary><div>{locales.map((item) => <Link key={item} className={item === locale ? "active" : ""} href={hrefs[item]} hrefLang={item} lang={item === "zh" ? "zh-CN" : item}><span>{localeNames[item]}</span><small>{item === "zh" ? "ZH-CN" : item.toUpperCase()}</small>{item === locale ? <b aria-hidden="true">✓</b> : null}</Link>)}</div></details>
            <ThemeToggle locale={locale} />
            <details className="mobile-menu">
              <summary aria-label={localized("Menüyü aç", "Open menu", "Menü öffnen", "打开菜单")}>☰</summary>
              <div className="mobile-menu-panel">
                <div className="mobile-menu-heading"><strong>ByteQuant</strong><span>{localized("Hızlı gezinme", "Quick navigation", "Schnellnavigation", "快速导航")}</span></div>
                <Link className="mobile-menu-primary" href={pathFor(locale, "tools")}><span>{t.nav.tools}</span><small>{tools.length}</small></Link>
                <Link className="agent-nav-link" href={pathFor(locale, "agent")}><span aria-hidden="true">✦</span>{localized("Yerel Ajan", "Local Agent", "Lokaler Agent", "本地助手")}</Link>
                <Link className="workstation-nav-link" href={pathFor(locale, "workstation")}><span aria-hidden="true">⌘</span>{localized("İş İstasyonu", "Workstation", "Workstation", "工作站")}</Link>
                <Link href={pathFor(locale, "community")}>{localized("Topluluk", "Community", "Community", "社区")}</Link>
                <Link href={pathFor(locale, "blog")}>{t.nav.blog}</Link>
                <Link href={pathFor(locale, "about")}>{t.nav.about}</Link>
                <Link href={pathFor(locale, "faq")}>{t.nav.faq}</Link>
                <Link href={pathFor(locale, "contact")}>{t.nav.contact}</Link>
              </div>
            </details>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-intro">
            <div className="brand footer-brand"><BrandLogo /><span><strong>ByteQuant</strong><small>{t.descriptor}</small></span></div>
            <p>{localized("Günlük metin, veri ve prompt işlerini doğrudan tarayıcınızda tamamlayın. Araç girdileri ByteQuant sunucularına gönderilmez.", "Complete everyday text, data, and prompt tasks directly in your browser. Tool inputs are not sent to ByteQuant servers.", "Erledigen Sie Text-, Daten- und Prompt-Aufgaben direkt im Browser. Werkzeugeingaben werden nicht an ByteQuant-Server gesendet.", "直接在浏览器中完成文本、数据和提示词任务。工具输入不会发送到 ByteQuant 服务器。")}</p>
            <span className="privacy-pill">● {localized("Tarayıcı içinde işlenir", "Processed in your browser", "Im Browser verarbeitet", "在浏览器中处理")}</span>
          </div>
          <div><h2>{localized("Keşfet", "Explore", "Entdecken", "探索")}</h2><Link href={pathFor(locale, "tools")}>{t.nav.tools}</Link><Link href={pathFor(locale, "agent")}>{localized("Yerel Ajan", "Local Agent", "Lokaler Agent", "本地助手")}</Link><Link href={pathFor(locale, "workstation")}>{localized("İş İstasyonu", "Workstation", "Workstation", "工作站")}</Link><Link href={pathFor(locale, "community")}>{localized("Topluluk", "Community", "Community", "社区")}</Link><Link href={pathFor(locale, "blog")}>{t.nav.blog}</Link><Link href={referencePath(locale, "regex-cheat-sheet")}>Regex cheat sheet</Link><Link href={referencePath(locale, "cron-cheat-sheet")}>Cron cheat sheet</Link><Link href={pathFor(locale, "faq")}>{t.nav.faq}</Link></div>
          <div><h2>{localized("Kurumsal", "Company", "Unternehmen", "公司信息")}</h2><Link href={pathFor(locale, "about")}>{t.nav.about}</Link><Link href={pathFor(locale, "contact")}>{t.nav.contact}</Link><Link href={pathFor(locale, "privacy")}>{localized("Gizlilik politikası", "Privacy policy", "Datenschutz", "隐私政策")}</Link><Link href={pathFor(locale, "cookies")}>{localized("Çerez ve yerel depolama", "Cookies & local storage", "Cookies & lokaler Speicher", "Cookie 与本地存储")}</Link><PrivacySettingsButton locale={locale} /><Link href={pathFor(locale, "terms")}>{localized("Kullanım koşulları", "Terms of use", "Nutzungsbedingungen", "使用条款")}</Link></div>
          <div><h2>{localized("Sosyal", "Social", "Social Media", "社交媒体")}</h2><a href="https://x.com/byte_quant" rel="me noopener noreferrer">X · @byte_quant</a><a href="https://www.instagram.com/byte.quant" rel="me noopener noreferrer">Instagram · @byte.quant</a><a href="mailto:bytequant@yahoo.com">bytequant@yahoo.com</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 ByteQuant. {localized("Tüm hakları saklıdır.", "All rights reserved.", "Alle Rechte vorbehalten.", "保留所有权利。")}</span><span>{localized("Ücretsiz araçlar · Reklamlarla desteklenebilir", "Free tools · May be supported by advertising", "Kostenlose Werkzeuge · Können werbefinanziert sein", "免费工具 · 未来可能由广告支持")}</span></div>
      </footer>
      <ConsentManager locale={locale} />
    </div>
  );
}
