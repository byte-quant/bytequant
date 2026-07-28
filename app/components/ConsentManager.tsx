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
    tr: { kicker: "GİZLİLİK TERCİHİ", title: "Araçlar çerezsiz çalışır", body: "Zorunlu depolama yalnızca seçiminizi ve istediğiniz temayı hatırlar. İsteğe bağlı yerel kişiselleştirme, araç içeriklerini değil yalnızca açılma sayılarını ve sabitlediğiniz araç kimliklerini saklar. Reddetseniz de tüm araçlar çalışır.", details: "Yerel depolama ayrıntıları", essential: "Yalnızca zorunlu", manage: "Tercihleri yönet", enable: "Yerel kısayolları aç" },
    en: { kicker: "PRIVACY CHOICE", title: "The tools work without cookies", body: "Essential storage only remembers your choice and requested theme. Optional local personalization stores tool-open counts and pinned tool IDs on this device, never tool content. Every tool works if you decline.", details: "Local-storage details", essential: "Essential only", manage: "Manage choices", enable: "Enable local shortcuts" },
    de: { kicker: "DATENSCHUTZAUSWAHL", title: "Die Werkzeuge funktionieren ohne Cookies", body: "Erforderlicher Speicher merkt nur Ihre Auswahl und das gewünschte Design. Optionale lokale Personalisierung speichert Öffnungszahlen und angeheftete Werkzeugkennungen, niemals Werkzeuginhalte. Alle Werkzeuge funktionieren auch bei Ablehnung.", details: "Details zum lokalen Speicher", essential: "Nur erforderlich", manage: "Auswahl verwalten", enable: "Lokale Abkürzungen aktivieren" },
    zh: { kicker: "隐私选择", title: "工具无需 Cookie 即可运行", body: "必要存储只记住您的选择和主题。可选本地个性化仅保存工具打开次数与固定工具标识，绝不保存工具内容。即使拒绝，所有工具仍可使用。", details: "本地存储详情", essential: "仅必要项", manage: "管理选择", enable: "启用本地快捷方式" },
  }[locale];
  const settings = {
    tr: { kicker: "KONTROL SİZDE", title: "Gizlilik tercihleri", close: "Pencereyi kapat", intro: "İsteğe bağlı cihaz içi kişiselleştirme varsayılan olarak kapalıdır. Reklam gizlilik seçimleri, desteklenen bölgelerde Google'ın sertifikalı Gizlilik ve Mesajlaşma arayüzü üzerinden ayrıca sunulur.", essential: "Zorunlu yerel depolama", essentialBody: "Onay kaydı ve sizin seçtiğiniz tema. Araçların çalışması için reklam veya analitik depolaması kullanılmaz.", essentialAria: "Zorunlu depolama her zaman etkin", personalization: "Yerel kişiselleştirme", personalizationBody: "bq-tool-usage-v1 açılma sayısını; bq-tool-favorites-v1 sabitlediğiniz araç slug'larını bu cihazda tutar. Girdi ve çıktı saklanmaz.", inactive: "Google AdSense etkin", inactiveBody: "Yayıncı kimliği ca-pub-4158794981134847 olan Google AdSense etiketi sayfalarda yüklenir. Google reklam sunumu sırasında çevrim içi tanımlayıcılar ve çerezler işleyebilir; EEA, Birleşik Krallık ve İsviçre için seçim Google sertifikalı CMP üzerinden yönetilmelidir. Araç girdileri reklamlara gönderilmez.", reject: "İsteğe bağlıları reddet", save: "Seçimi kaydet", policy: "Çerez ve yerel depolama politikası" },
    en: { kicker: "YOU ARE IN CONTROL", title: "Privacy choices", close: "Close dialog", intro: "Optional on-device personalization is off by default. Where required, advertising privacy choices are presented separately through Google's certified Privacy & Messaging interface.", essential: "Essential local storage", essentialBody: "Consent record and the theme you request. No advertising or analytics storage is needed for the tools.", essentialAria: "Essential storage is always active", personalization: "Local personalization", personalizationBody: "bq-tool-usage-v1 keeps open counts; bq-tool-favorites-v1 keeps pinned tool slugs on this device. Input and output are never stored.", inactive: "Google AdSense is active", inactiveBody: "The Google AdSense tag for publisher ca-pub-4158794981134847 loads on site pages. Google may process online identifiers and cookies when serving ads; choices for the EEA, UK, and Switzerland must be managed by a Google-certified CMP. Tool input is never sent to advertising.", reject: "Reject optional", save: "Save choice", policy: "Cookie and local-storage policy" },
    de: { kicker: "SIE HABEN DIE KONTROLLE", title: "Datenschutzauswahl", close: "Dialog schließen", intro: "Optionale Personalisierung auf dem Gerät ist standardmäßig deaktiviert. Wo erforderlich, werden Werbe-Datenschutzoptionen separat über Googles zertifizierte Privacy-&-Messaging-Oberfläche angeboten.", essential: "Erforderlicher lokaler Speicher", essentialBody: "Einwilligungsnachweis und das von Ihnen gewählte Design. Für die Werkzeuge ist kein Werbe- oder Analysespeicher nötig.", essentialAria: "Erforderlicher Speicher ist immer aktiv", personalization: "Lokale Personalisierung", personalizationBody: "bq-tool-usage-v1 speichert Öffnungszahlen; bq-tool-favorites-v1 speichert angeheftete Werkzeug-Slugs auf diesem Gerät. Ein- und Ausgaben werden nie gespeichert.", inactive: "Google AdSense ist aktiv", inactiveBody: "Das Google-AdSense-Tag des Publishers ca-pub-4158794981134847 wird auf Seiten geladen. Google kann bei der Anzeigenschaltung Online-Kennungen und Cookies verarbeiten; die Auswahl für EWR, Vereinigtes Königreich und Schweiz muss über eine Google-zertifizierte CMP erfolgen. Werkzeugeingaben werden nie an Werbung gesendet.", reject: "Optionale ablehnen", save: "Auswahl speichern", policy: "Cookie- und lokale Speicher-Richtlinie" },
    zh: { kicker: "由您掌控", title: "隐私选择", close: "关闭对话框", intro: "设备内个性化默认关闭。在适用地区，广告隐私选择将通过 Google 认证的“隐私权和消息”界面另行提供。", essential: "必要本地存储", essentialBody: "仅保存同意记录和您选择的主题。工具运行不需要广告或分析存储。", essentialAria: "必要存储始终启用", personalization: "本地个性化", personalizationBody: "bq-tool-usage-v1 保存打开次数；bq-tool-favorites-v1 保存本设备固定的工具 slug。绝不保存输入或输出。", inactive: "Google AdSense 已启用", inactiveBody: "网页会加载发布商 ca-pub-4158794981134847 的 Google AdSense 标记。Google 在投放广告时可能处理在线标识符和 Cookie；欧洲经济区、英国和瑞士的选择必须由 Google 认证的 CMP 管理。工具输入绝不会发送给广告系统。", reject: "拒绝可选项", save: "保存选择", policy: "Cookie 与本地存储政策" },
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
