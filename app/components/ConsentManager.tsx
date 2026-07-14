"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  openPrivacySettings,
  openPrivacySettingsEvent,
  readConsent,
  saveConsent,
} from "../lib/consent";
import { pathFor, type Locale } from "../lib/site";

export function PrivacySettingsButton({ locale }: { locale: Locale }) {
  return (
    <button className="footer-privacy-button" type="button" onClick={openPrivacySettings}>
      {locale === "tr" ? "Gizlilik tercihleri" : "Privacy choices"}
    </button>
  );
}

export function ConsentManager({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    const frame = window.requestAnimationFrame(() => {
      setPreferences(consent?.preferences ?? false);
      setBannerOpen(!consent);
      setMounted(true);
    });
    const openSettings = () => {
      const current = readConsent();
      setPreferences(current?.preferences ?? false);
      setSettingsOpen(true);
    };
    window.addEventListener(openPrivacySettingsEvent, openSettings);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(openPrivacySettingsEvent, openSettings);
    };
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSettingsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])")];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [settingsOpen]);

  function choose(next: boolean) {
    saveConsent(next);
    setPreferences(next);
    setBannerOpen(false);
    setSettingsOpen(false);
  }

  if (!mounted) return null;

  return (
    <>
      {bannerOpen && (
        <section className="consent-banner" aria-labelledby={titleId}>
          <div>
            <span className="consent-kicker">{isTr ? "GİZLİLİK TERCİHİ" : "PRIVACY CHOICE"}</span>
            <h2 id={titleId}>{isTr ? "Araçlar çerezsiz çalışır" : "The tools work without cookies"}</h2>
            <p>
              {isTr
                ? "Zorunlu depolama yalnızca seçiminizi ve istediğiniz temayı hatırlar. İsteğe bağlı yerel kişiselleştirme, araç içeriklerini değil yalnızca bu cihazdaki açılma sayılarını saklar. Reddetseniz de tüm araçlar çalışır."
                : "Essential storage only remembers your choice and requested theme. Optional local personalization stores tool-open counts on this device, never tool content. Every tool works if you decline."}
            </p>
            <Link href={pathFor(locale, "cookies")}>{isTr ? "Yerel depolama ayrıntıları" : "Local-storage details"}</Link>
          </div>
          <div className="consent-actions">
            <button type="button" className="consent-button" onClick={() => choose(false)}>
              {isTr ? "Yalnızca zorunlu" : "Essential only"}
            </button>
            <button type="button" className="consent-button" onClick={() => setSettingsOpen(true)}>
              {isTr ? "Tercihleri yönet" : "Manage choices"}
            </button>
            <button type="button" className="consent-button consent-button-primary" onClick={() => choose(true)}>
              {isTr ? "Yerel kısayolları aç" : "Enable local shortcuts"}
            </button>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div className="consent-overlay" role="presentation">
          <section ref={dialogRef} className="consent-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId + "-settings"}>
            <div className="consent-dialog-header">
              <div>
                <span className="consent-kicker">{isTr ? "KONTROL SİZDE" : "YOU ARE IN CONTROL"}</span>
                <h2 id={titleId + "-settings"}>{isTr ? "Gizlilik tercihleri" : "Privacy choices"}</h2>
              </div>
              <button ref={closeButtonRef} type="button" className="consent-close" onClick={() => setSettingsOpen(false)} aria-label={isTr ? "Pencereyi kapat" : "Close dialog"}>×</button>
            </div>
            <p>{isTr ? "İsteğe bağlı depolama varsayılan olarak kapalıdır. Tercihinizi 180 gün sonra yeniden sorarız; istediğiniz anda değiştirebilirsiniz." : "Optional storage is off by default. We ask again after 180 days, and you can change the choice at any time."}</p>
            <div className="consent-category">
              <div><strong>{isTr ? "Zorunlu yerel depolama" : "Essential local storage"}</strong><small>{isTr ? "Onay kaydı ve sizin seçtiğiniz tema. Araçların çalışması için reklam veya analitik depolaması kullanılmaz." : "Consent record and the theme you request. No advertising or analytics storage is needed for the tools."}</small></div>
              <input type="checkbox" checked disabled aria-label={isTr ? "Zorunlu depolama her zaman etkin" : "Essential storage is always active"} />
            </div>
            <label className="consent-category">
              <div><strong>{isTr ? "Yerel kişiselleştirme" : "Local personalization"}</strong><small>{isTr ? "bq-tool-usage-v1 yalnızca araç slug'ı, sayaç ve son kullanım zamanını bu cihazda tutar. Girdi ve çıktı saklanmaz." : "bq-tool-usage-v1 keeps only tool slug, count, and last-used time on this device. Input and output are never stored."}</small></div>
              <input type="checkbox" checked={preferences} onChange={(event) => setPreferences(event.target.checked)} />
            </label>
            <div className="consent-inactive-note">
              <strong>{isTr ? "Analitik ve reklam: etkin değil" : "Analytics and advertising: inactive"}</strong>
              <p>{isTr ? "Sitede aktif analitik SDK'sı, AdSense kimliği veya reklam çerezi bulunmaz. Bunlar gelecekte etkinleştirilirse ayrı ve geçerli onay alınmadan yüklenmeyecektir." : "The site has no active analytics SDK, AdSense identifier, or advertising cookie. If that changes, those services will not load before separate valid consent."}</p>
            </div>
            <div className="consent-dialog-actions">
              <button type="button" className="consent-button" onClick={() => choose(false)}>{isTr ? "İsteğe bağlıları reddet" : "Reject optional"}</button>
              <button type="button" className="consent-button consent-button-primary" onClick={() => choose(preferences)}>{isTr ? "Seçimi kaydet" : "Save choice"}</button>
            </div>
            <p className="consent-policy-link"><Link href={pathFor(locale, "cookies")}>{isTr ? "Çerez ve yerel depolama politikası" : "Cookie and local-storage policy"}</Link></p>
          </section>
        </div>
      )}
    </>
  );
}
