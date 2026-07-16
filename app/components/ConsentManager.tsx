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
      {{ tr: "Gizlilik tercihleri", en: "Privacy choices", de: "Datenschutzauswahl", zh: "隐私选择" }[locale]}
    </button>
  );
}

export function ConsentManager({ locale }: { locale: Locale }) {
  const banner = {
    tr: { kicker: "GİZLİLİK TERCİHİ", title: "Araçlar çerezsiz çalışır", body: "Zorunlu depolama yalnızca seçiminizi ve istediğiniz temayı hatırlar. İsteğe bağlı yerel kişiselleştirme, araç içeriklerini değil yalnızca bu cihazdaki açılma sayılarını saklar. Reddetseniz de tüm araçlar çalışır.", details: "Yerel depolama ayrıntıları", essential: "Yalnızca zorunlu", manage: "Tercihleri yönet", enable: "Yerel kısayolları aç" },
    en: { kicker: "PRIVACY CHOICE", title: "The tools work without cookies", body: "Essential storage only remembers your choice and requested theme. Optional local personalization stores tool-open counts on this device, never tool content. Every tool works if you decline.", details: "Local-storage details", essential: "Essential only", manage: "Manage choices", enable: "Enable local shortcuts" },
    de: { kicker: "DATENSCHUTZAUSWAHL", title: "Die Werkzeuge funktionieren ohne Cookies", body: "Erforderlicher Speicher merkt nur Ihre Auswahl und das gewünschte Design. Optionale lokale Personalisierung speichert nur Öffnungszahlen auf diesem Gerät, niemals Werkzeuginhalte. Alle Werkzeuge funktionieren auch bei Ablehnung.", details: "Details zum lokalen Speicher", essential: "Nur erforderlich", manage: "Auswahl verwalten", enable: "Lokale Abkürzungen aktivieren" },
    zh: { kicker: "隐私选择", title: "工具无需 Cookie 即可运行", body: "必要存储只记住您的选择和主题。可选本地个性化仅保存本设备上的工具打开次数，绝不保存工具内容。即使拒绝，所有工具仍可使用。", details: "本地存储详情", essential: "仅必要项", manage: "管理选择", enable: "启用本地快捷方式" },
  }[locale];
  const settings = {
    tr: { kicker: "KONTROL SİZDE", title: "Gizlilik tercihleri", close: "Pencereyi kapat", intro: "İsteğe bağlı depolama varsayılan olarak kapalıdır. Tercihinizi 180 gün sonra yeniden sorarız; istediğiniz anda değiştirebilirsiniz.", essential: "Zorunlu yerel depolama", essentialBody: "Onay kaydı ve sizin seçtiğiniz tema. Araçların çalışması için reklam veya analitik depolaması kullanılmaz.", essentialAria: "Zorunlu depolama her zaman etkin", personalization: "Yerel kişiselleştirme", personalizationBody: "bq-tool-usage-v1 yalnızca araç slug'ı, sayaç ve son kullanım zamanını bu cihazda tutar. Girdi ve çıktı saklanmaz.", inactive: "Analitik ve reklam: etkin değil", inactiveBody: "Sitede aktif analitik SDK'sı, AdSense kimliği veya reklam çerezi bulunmaz. Bunlar gelecekte etkinleştirilirse ayrı ve geçerli onay alınmadan yüklenmeyecektir.", reject: "İsteğe bağlıları reddet", save: "Seçimi kaydet", policy: "Çerez ve yerel depolama politikası" },
    en: { kicker: "YOU ARE IN CONTROL", title: "Privacy choices", close: "Close dialog", intro: "Optional storage is off by default. We ask again after 180 days, and you can change the choice at any time.", essential: "Essential local storage", essentialBody: "Consent record and the theme you request. No advertising or analytics storage is needed for the tools.", essentialAria: "Essential storage is always active", personalization: "Local personalization", personalizationBody: "bq-tool-usage-v1 keeps only tool slug, count, and last-used time on this device. Input and output are never stored.", inactive: "Analytics and advertising: inactive", inactiveBody: "The site has no active analytics SDK, AdSense identifier, or advertising cookie. If that changes, those services will not load before separate valid consent.", reject: "Reject optional", save: "Save choice", policy: "Cookie and local-storage policy" },
    de: { kicker: "SIE HABEN DIE KONTROLLE", title: "Datenschutzauswahl", close: "Dialog schließen", intro: "Optionaler Speicher ist standardmäßig deaktiviert. Nach 180 Tagen fragen wir erneut; Sie können die Auswahl jederzeit ändern.", essential: "Erforderlicher lokaler Speicher", essentialBody: "Einwilligungsnachweis und das von Ihnen gewählte Design. Für die Werkzeuge ist kein Werbe- oder Analysespeicher nötig.", essentialAria: "Erforderlicher Speicher ist immer aktiv", personalization: "Lokale Personalisierung", personalizationBody: "bq-tool-usage-v1 speichert auf diesem Gerät nur Werkzeug-Slug, Anzahl und letzte Nutzung. Ein- und Ausgaben werden nie gespeichert.", inactive: "Analyse und Werbung: inaktiv", inactiveBody: "Die Website enthält kein aktives Analyse-SDK, keine AdSense-Kennung und kein Werbe-Cookie. Falls sich dies ändert, werden solche Dienste nicht ohne separate wirksame Einwilligung geladen.", reject: "Optionale ablehnen", save: "Auswahl speichern", policy: "Cookie- und lokale Speicher-Richtlinie" },
    zh: { kicker: "由您掌控", title: "隐私选择", close: "关闭对话框", intro: "可选存储默认关闭。180 天后我们会再次询问，您也可以随时更改选择。", essential: "必要本地存储", essentialBody: "仅保存同意记录和您选择的主题。工具运行不需要广告或分析存储。", essentialAria: "必要存储始终启用", personalization: "本地个性化", personalizationBody: "bq-tool-usage-v1 仅在本设备保存工具 slug、次数和最后使用时间，绝不保存输入或输出。", inactive: "分析与广告：未启用", inactiveBody: "网站目前没有启用分析 SDK、AdSense 标识符或广告 Cookie。若未来发生变化，未经单独且有效的同意，这些服务不会加载。", reject: "拒绝可选项", save: "保存选择", policy: "Cookie 与本地存储政策" },
  }[locale];
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
            <span className="consent-kicker">{banner.kicker}</span>
            <h2 id={titleId}>{banner.title}</h2>
            <p>{banner.body}</p>
            <Link href={pathFor(locale, "cookies")}>{banner.details}</Link>
          </div>
          <div className="consent-actions">
            <button type="button" className="consent-button" onClick={() => choose(false)}>
              {banner.essential}
            </button>
            <button type="button" className="consent-button" onClick={() => setSettingsOpen(true)}>
              {banner.manage}
            </button>
            <button type="button" className="consent-button consent-button-primary" onClick={() => choose(true)}>
              {banner.enable}
            </button>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div className="consent-overlay" role="presentation">
          <section ref={dialogRef} className="consent-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId + "-settings"}>
            <div className="consent-dialog-header">
              <div>
                <span className="consent-kicker">{settings.kicker}</span>
                <h2 id={titleId + "-settings"}>{settings.title}</h2>
              </div>
              <button ref={closeButtonRef} type="button" className="consent-close" onClick={() => setSettingsOpen(false)} aria-label={settings.close}>×</button>
            </div>
            <p>{settings.intro}</p>
            <div className="consent-category">
              <div><strong>{settings.essential}</strong><small>{settings.essentialBody}</small></div>
              <input type="checkbox" checked disabled aria-label={settings.essentialAria} />
            </div>
            <label className="consent-category">
              <div><strong>{settings.personalization}</strong><small>{settings.personalizationBody}</small></div>
              <input type="checkbox" checked={preferences} onChange={(event) => setPreferences(event.target.checked)} />
            </label>
            <div className="consent-inactive-note">
              <strong>{settings.inactive}</strong>
              <p>{settings.inactiveBody}</p>
            </div>
            <div className="consent-dialog-actions">
              <button type="button" className="consent-button" onClick={() => choose(false)}>{settings.reject}</button>
              <button type="button" className="consent-button consent-button-primary" onClick={() => choose(preferences)}>{settings.save}</button>
            </div>
            <p className="consent-policy-link"><Link href={pathFor(locale, "cookies")}>{settings.policy}</Link></p>
          </section>
        </div>
      )}
    </>
  );
}
