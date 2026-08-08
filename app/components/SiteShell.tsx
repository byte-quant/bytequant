import Link from "next/link";
import type { ReactNode } from "react";
import { copy, locales, organizationId, pathFor, siteUrl, websiteId, type Locale } from "../lib/site";
import { ConsentManager, PrivacySettingsButton } from "./ConsentManager";
import { ThemeToggle } from "./ThemeToggle";
import { BrandLogo } from "./BrandLogo";
import { CommandPalette } from "./CommandPalette";
import { referencePath } from "../lib/references";
import { publicTools as tools } from "../lib/tools";
import { SchemaScript } from "./SchemaScript";
import { PwaInstall } from "./PwaInstall";
import { AmbientScene } from "./AmbientScene";

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
      { "@type": "Organization", "@id": organizationId, name: "ByteQuant", url: `${siteUrl}/`, logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.png`, width: 512, height: 512 }, email: "bytequant@yahoo.com", description: "Privacy-first browser tools and local productivity software.", foundingDate: "2026", knowsLanguage: ["tr", "en", "de", "zh-CN"], knowsAbout: ["browser privacy", "local data processing", "developer tools", "document conversion", "prompt engineering"], contactPoint: { "@type": "ContactPoint", email: "bytequant@yahoo.com", contactType: "customer support and corrections", availableLanguage: ["Turkish", "English", "German", "Simplified Chinese"] }, ethicsPolicy: `${siteUrl}/gizlilik-politikasi/`, publishingPrinciples: `${siteUrl}/yayin-ilkeleri/`, sameAs: ["https://github.com/byte-quant/bytequant", "https://x.com/byte_quant", "https://www.instagram.com/byte.quant"] },
      { "@type": "WebSite", "@id": websiteId, name: "ByteQuant", alternateName: ["Gizlilik odaklı üretkenlik araçları", "Privacy-first productivity tools", "Datenschutzorientierte Produktivitätswerkzeuge", "隐私优先的生产力工具"], url: `${siteUrl}/`, inLanguage: ["tr-TR", "en-US", "de-DE", "zh-CN"], publisher: { "@id": organizationId }, copyrightYear: 2026, license: "https://github.com/byte-quant/bytequant/blob/main/LICENSE", accessibilityFeature: ["highContrastDisplay", "keyboardNavigation", "structuralNavigation", "alternativeText"] },
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
            <Link className="nav-product-link nav-library-link" href={pathFor(locale, "tools")}><span aria-hidden="true">⌕</span><b>{t.nav.tools}</b></Link>
            <Link className="nav-product-link agent-nav-link" href={pathFor(locale, "agent")}><span aria-hidden="true">✦</span><b>{localized("Yerel Ajan", "Local Agent", "Lokaler Agent", "本地助手")}</b></Link>
            <Link className="nav-product-link workstation-nav-link" href={pathFor(locale, "workstation")}><span aria-hidden="true">⌘</span><b>{localized("İş İstasyonu", "Workstation", "Workstation", "工作站")}</b></Link>
            <details className="nav-more-menu"><summary><span aria-hidden="true">＋</span>{localized("Keşfet", "Explore", "Entdecken", "探索")}</summary><div><Link href={pathFor(locale, "community")}><span>◎</span><b>{localized("Topluluk", "Community", "Community", "社区")}</b></Link><Link href={pathFor(locale, "news")}><span>◉</span><b>{localized("Gündem", "Updates", "Aktuell", "动态")}</b></Link><Link href={pathFor(locale, "blog")}><span>□</span><b>{t.nav.blog}</b></Link><Link href={pathFor(locale, "about")}><span>↗</span><b>{t.nav.about}</b></Link><Link href={pathFor(locale, "standards")}><span>✓</span><b>{localized("Yayın ilkeleri", "Publishing standards", "Publikationsstandards", "发布标准")}</b></Link><Link href={pathFor(locale, "faq")}><span>?</span><b>{t.nav.faq}</b></Link></div></details>
          </nav>
          <div className="header-actions">
            <CommandPalette locale={locale} showTrigger={false} />
            <PwaInstall locale={locale} compact />
            <details className="language-menu"><summary aria-label={localized("Dili değiştir", "Change language", "Sprache ändern", "切换语言")}><span className="language-menu-code" aria-hidden="true">{locale.toUpperCase()}</span><span className="language-menu-label">{localeNames[locale]}</span><span className="language-menu-chevron" aria-hidden="true">⌄</span></summary><div>{locales.map((item) => <Link key={item} className={item === locale ? "active" : ""} href={hrefs[item]} hrefLang={item} lang={item === "zh" ? "zh-CN" : item}><span>{localeNames[item]}</span><small>{item === "zh" ? "ZH-CN" : item.toUpperCase()}</small>{item === locale ? <b aria-hidden="true">✓</b> : null}</Link>)}</div></details>
            <ThemeToggle locale={locale} />
            <details className="mobile-menu">
              <summary aria-label={localized("Mobil menü", "Mobile menu", "Mobiles Menü", "移动菜单")}><span className="mobile-menu-open-icon" aria-hidden="true">☰</span><span className="mobile-menu-close-icon" aria-hidden="true">×</span></summary>
              <div className="mobile-menu-panel">
                <div className="mobile-menu-heading"><strong>{localized("Nereden başlamak istersiniz?", "Where would you like to start?", "Wo möchten Sie beginnen?", "您想从哪里开始？")}</strong><span>{localized("Tek iş, akıllı plan veya çok adımlı akış—size uygun yolu seçin.", "Choose one task, a guided plan, or a multi-step workflow.", "Wählen Sie Einzelaufgabe, geführten Plan oder mehrstufigen Ablauf.", "选择单项任务、引导计划或多步骤工作流。")}</span></div>
                <div className="mobile-menu-product-grid">
                  <Link className="mobile-menu-primary" href={pathFor(locale, "tools")}><b>⌕</b><span><strong>{t.nav.tools}</strong><small>{tools.length} · {localized("hemen kullan", "use now", "sofort nutzen", "立即使用")}</small></span></Link>
                  <Link className="agent-nav-link" href={pathFor(locale, "agent")}><b>✦</b><span><strong>{localized("Yerel Ajan", "Local Agent", "Lokaler Agent", "本地助手")}</strong><small>{localized("Hedefi plana çevir", "Turn a goal into a plan", "Ziel in Plan umwandeln", "把目标变成计划")}</small></span></Link>
                  <Link className="workstation-nav-link" href={pathFor(locale, "workstation")}><b>⌘</b><span><strong>{localized("İş İstasyonu", "Workstation", "Workstation", "工作站")}</strong><small>{localized("Adımları görsel bağla", "Connect steps visually", "Schritte visuell verbinden", "可视化连接步骤")}</small></span></Link>
                </div>
                <div className="mobile-menu-section"><strong>{localized("Keşfet", "Explore", "Entdecken", "探索")}</strong><div><Link href={pathFor(locale, "community")}>◎ {localized("Topluluk", "Community", "Community", "社区")}</Link><Link href={pathFor(locale, "news")}>◉ {localized("Gündem", "Updates", "Aktuell", "动态")}</Link><Link href={pathFor(locale, "blog")}>□ {t.nav.blog}</Link><Link href={pathFor(locale, "about")}>↗ {t.nav.about}</Link><Link href={pathFor(locale, "standards")}>✓ {localized("Yayın ilkeleri", "Publishing standards", "Publikationsstandards", "发布标准")}</Link><Link href={pathFor(locale, "faq")}>? {t.nav.faq}</Link><Link href={pathFor(locale, "contact")}>@ {t.nav.contact}</Link></div></div>
                <div className="mobile-menu-section mobile-language-section"><strong>{localized("Dil", "Language", "Sprache", "语言")}</strong><div>{locales.map((item) => <Link key={item} className={item === locale ? "active" : ""} href={hrefs[item]} hrefLang={item} lang={item === "zh" ? "zh-CN" : item}><span>{localeNames[item]}</span><small>{item === locale ? "✓" : item.toUpperCase()}</small></Link>)}</div></div>
                <div className="mobile-install-row"><PwaInstall locale={locale} compact /><small>{localized("Tarayıcınız destekliyorsa ana ekrana eklenir.", "Adds to your home screen when supported.", "Wird bei Unterstützung zum Startbildschirm hinzugefügt.", "浏览器支持时可添加到主屏幕。")}</small></div>
              </div>
            </details>
          </div>
        </div>
      </header>
      <main id="main-content"><AmbientScene />{children}</main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-intro">
            <div className="brand footer-brand"><BrandLogo /><span><strong>ByteQuant</strong><small>{t.descriptor}</small></span></div>
            <p>{localized("Günlük metin, veri ve prompt işlerini doğrudan tarayıcınızda tamamlayın. Araç girdileri ByteQuant sunucularına gönderilmez.", "Complete everyday text, data, and prompt tasks directly in your browser. Tool inputs are not sent to ByteQuant servers.", "Erledigen Sie Text-, Daten- und Prompt-Aufgaben direkt im Browser. Werkzeugeingaben werden nicht an ByteQuant-Server gesendet.", "直接在浏览器中完成文本、数据和提示词任务。工具输入不会发送到 ByteQuant 服务器。")}</p>
            <span className="privacy-pill">● {localized("Tarayıcı içinde işlenir", "Processed in your browser", "Im Browser verarbeitet", "在浏览器中处理")}</span>
          </div>
          <div><h2>{localized("Keşfet", "Explore", "Entdecken", "探索")}</h2><Link href={pathFor(locale, "tools")}>{t.nav.tools}</Link><Link href={pathFor(locale, "agent")}>{localized("Yerel Ajan", "Local Agent", "Lokaler Agent", "本地助手")}</Link><Link href={pathFor(locale, "workstation")}>{localized("İş İstasyonu", "Workstation", "Workstation", "工作站")}</Link><Link href={pathFor(locale, "community")}>{localized("Topluluk", "Community", "Community", "社区")}</Link><Link href={pathFor(locale, "news")}>{localized("Gündem", "Updates", "Aktuell", "动态")}</Link><Link href={pathFor(locale, "blog")}>{t.nav.blog}</Link><Link href={referencePath(locale, "regex-cheat-sheet")}>Regex cheat sheet</Link><Link href={referencePath(locale, "cron-cheat-sheet")}>Cron cheat sheet</Link><Link href={pathFor(locale, "faq")}>{t.nav.faq}</Link></div>
          <div><h2>{localized("Kurumsal", "Company", "Unternehmen", "公司信息")}</h2><Link href={pathFor(locale, "about")}>{t.nav.about}</Link><Link href={pathFor(locale, "standards")}>{localized("Yayıncılık ve güven standartları", "Publishing and trust standards", "Publikations- und Vertrauensstandards", "发布与信任标准")}</Link><Link href={pathFor(locale, "contact")}>{t.nav.contact}</Link><Link href={pathFor(locale, "privacy")}>{localized("Gizlilik politikası", "Privacy policy", "Datenschutz", "隐私政策")}</Link><Link href={pathFor(locale, "cookies")}>{localized("Çerez ve yerel depolama", "Cookies & local storage", "Cookies & lokaler Speicher", "Cookie 与本地存储")}</Link><PrivacySettingsButton locale={locale} /><Link href={pathFor(locale, "terms")}>{localized("Kullanım koşulları", "Terms of use", "Nutzungsbedingungen", "使用条款")}</Link></div>
          <div><h2>{localized("Sosyal", "Social", "Social Media", "社交媒体")}</h2><a href="https://github.com/byte-quant/bytequant" rel="me noopener noreferrer">GitHub · byte-quant</a><a href="https://x.com/byte_quant" rel="me noopener noreferrer">X · @byte_quant</a><a href="https://www.instagram.com/byte.quant" rel="me noopener noreferrer">Instagram · @byte.quant</a><a href="mailto:bytequant@yahoo.com">bytequant@yahoo.com</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 ByteQuant. {localized("Tüm hakları saklıdır.", "All rights reserved.", "Alle Rechte vorbehalten.", "保留所有权利。")}</span><span>{localized("Ücretsiz araçlar · Açıkça etiketli reklamlarla desteklenir", "Free tools · Supported by clearly labelled advertising", "Kostenlose Werkzeuge · Unterstützt durch klar gekennzeichnete Werbung", "免费工具 · 由明确标注的广告支持")}</span></div>
      </footer>
      <ConsentManager locale={locale} />
    </div>
  );
}
