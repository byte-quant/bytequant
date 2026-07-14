import Link from "next/link";
import type { ReactNode } from "react";
import { copy, pathFor, type Locale } from "../lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteShell({ children, locale, alternateHref }: { children: ReactNode; locale: Locale; alternateHref: string }) {
  const t = copy[locale];
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">{locale === "tr" ? "İçeriğe geç" : "Skip to content"}</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href={pathFor(locale, "home")} aria-label={`${t.brand} ${t.nav.home}`}>
            <span className="brand-mark" aria-hidden="true">BQ</span>
            <span><strong>{t.brand}</strong><small>{t.descriptor}</small></span>
          </Link>
          <nav className="main-nav" aria-label={locale === "tr" ? "Ana menü" : "Main navigation"}>
            <Link href={pathFor(locale, "tools")}>{t.nav.tools}</Link>
            <Link href={pathFor(locale, "blog")}>{t.nav.blog}</Link>
            <Link href={pathFor(locale, "about")}>{t.nav.about}</Link>
            <Link href={pathFor(locale, "faq")}>{t.nav.faq}</Link>
          </nav>
          <div className="header-actions">
            <Link className="language-link" href={alternateHref} hrefLang={locale === "tr" ? "en" : "tr"}>{t.language}</Link>
            <ThemeToggle locale={locale} />
            <details className="mobile-menu">
              <summary aria-label={locale === "tr" ? "Menüyü aç" : "Open menu"}>☰</summary>
              <div className="mobile-menu-panel">
                <Link href={pathFor(locale, "tools")}>{t.nav.tools}</Link>
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
            <div className="brand footer-brand"><span className="brand-mark" aria-hidden="true">BQ</span><span><strong>ByteQuant</strong><small>{t.descriptor}</small></span></div>
            <p>{locale === "tr" ? "Günlük metin, veri ve prompt işlerini doğrudan tarayıcınızda tamamlayın. Araç girdileri ByteQuant sunucularına gönderilmez." : "Complete everyday text, data, and prompt tasks directly in your browser. Tool inputs are not sent to ByteQuant servers."}</p>
            <span className="privacy-pill">● {locale === "tr" ? "Tarayıcı içinde işlenir" : "Processed in your browser"}</span>
          </div>
          <div><h2>{locale === "tr" ? "Keşfet" : "Explore"}</h2><Link href={pathFor(locale, "tools")}>{t.nav.tools}</Link><Link href={pathFor(locale, "blog")}>{t.nav.blog}</Link><Link href={pathFor(locale, "faq")}>{t.nav.faq}</Link></div>
          <div><h2>{locale === "tr" ? "Kurumsal" : "Company"}</h2><Link href={pathFor(locale, "about")}>{t.nav.about}</Link><Link href={pathFor(locale, "contact")}>{t.nav.contact}</Link><Link href={pathFor(locale, "privacy")}>{locale === "tr" ? "Gizlilik politikası" : "Privacy policy"}</Link><Link href={pathFor(locale, "terms")}>{locale === "tr" ? "Kullanım koşulları" : "Terms of use"}</Link></div>
          <div><h2>{locale === "tr" ? "Sosyal" : "Social"}</h2><a href="https://x.com/byte_quant" rel="me noopener noreferrer">X · @byte_quant</a><a href="https://www.instagram.com/byte.quant" rel="me noopener noreferrer">Instagram · @byte.quant</a><a href="mailto:bytequant@yahoo.com">bytequant@yahoo.com</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 ByteQuant. {locale === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}</span><span>{locale === "tr" ? "Ücretsiz araçlar · Reklamlarla desteklenebilir" : "Free tools · May be supported by advertising"}</span></div>
      </footer>
    </div>
  );
}

