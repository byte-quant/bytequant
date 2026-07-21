"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../lib/site";
import { isAuthorizedByteQuantHostname } from "../lib/brand-integrity";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const content = {
  tr: { kicker: "BYTEQUANT UYGULAMASI", title: "Araçlarınıza masaüstünden veya ana ekrandan ulaşın", body: "ByteQuant'ı kurulabilir web uygulaması olarak ekleyin. Ayrı mağaza hesabı gerekmez; uygulama kendi penceresinde açılır, daha önce ziyaret edilen sayfalar çevrimdışıyken kullanılabilir ve araç girdileri önbelleğe yazılmaz.", install: "Uygulamayı yükle", installed: "Uygulama yüklendi", manual: "Tarayıcı menüsünden “Ana ekrana ekle” veya “Uygulamayı yükle” seçeneğini kullanın.", ios: "iPhone/iPad: Safari'de Paylaş düğmesine, ardından “Ana Ekrana Ekle” seçeneğine dokunun.", android: "Android: güncel Chrome veya Edge kullanın. Daha önce yüklenen ByteQuant kısayolunu/uygulamasını kaldırın, sayfayı yenileyin ve tarayıcı menüsünden yeniden yükleyin.", legacy: "Bu eski veya yerleşik Android tarayıcısında güvenli kurulum istemi açılmadı. Görünen eski Android uyarısını onaylamayın; tarayıcıyı güncelleyin ve kurulumu güncel Chrome/Edge menüsünden başlatın.", noApk: "ByteQuant APK dağıtmaz. Android uygulama sarmalayıcısını tarayıcınız üretir; hedef Android sürümü uyarısı site tarafından ayarlanamaz.", failed: "Kurulum istemi tamamlanamadı. Tarayıcı menüsündeki kurulum seçeneğini deneyin.", ready: "Kurulum istemi hazır. Yükleme yalnızca açıkça onayladığınızda başlar." },
  en: { kicker: "BYTEQUANT APP", title: "Open your tools from the desktop or home screen", body: "Install ByteQuant as a web app. No app-store account is required; it opens in its own window, previously visited pages can work offline, and tool inputs are never written to the cache.", install: "Install app", installed: "App installed", manual: "Use “Install app” or “Add to Home Screen” in your browser menu.", ios: "iPhone/iPad: in Safari, tap Share and then “Add to Home Screen.”", android: "Android: use an up-to-date Chrome or Edge. Remove any previously installed ByteQuant shortcut/app, reload the page, and install it again from the browser menu.", legacy: "The safe install prompt was not opened in this old or embedded Android browser. Do not accept an old-Android warning; update the browser and start installation from the current Chrome/Edge menu.", noApk: "ByteQuant does not distribute an APK. Your browser creates the Android app wrapper; the site's manifest cannot set its target Android version.", failed: "The install prompt could not complete. Try the install option in your browser menu.", ready: "The install prompt is ready. Installation begins only after your explicit approval." },
  de: { kicker: "BYTEQUANT APP", title: "Werkzeuge direkt vom Desktop oder Startbildschirm öffnen", body: "Installieren Sie ByteQuant als Web-App. Kein App-Store-Konto ist nötig; sie öffnet sich in einem eigenen Fenster, bereits besuchte Seiten können offline funktionieren und Werkzeugeingaben werden nie im Cache gespeichert.", install: "App installieren", installed: "App installiert", manual: "Wählen Sie im Browsermenü „App installieren“ oder „Zum Startbildschirm hinzufügen“.", ios: "iPhone/iPad: Tippen Sie in Safari auf „Teilen“ und dann auf „Zum Home-Bildschirm“.", android: "Android: Verwenden Sie eine aktuelle Chrome- oder Edge-Version. Entfernen Sie eine zuvor installierte ByteQuant-Verknüpfung/App, laden Sie die Seite neu und installieren Sie sie erneut über das Browsermenü.", legacy: "In diesem alten oder eingebetteten Android-Browser wurde keine sichere Installationsabfrage geöffnet. Bestätigen Sie keine Warnung zu einer alten Android-Version; aktualisieren Sie den Browser und starten Sie die Installation im aktuellen Chrome-/Edge-Menü.", noApk: "ByteQuant verteilt keine APK. Der Browser erzeugt die Android-App-Hülle; die Website kann deren Android-Zielversion nicht festlegen.", failed: "Die Installationsabfrage konnte nicht abgeschlossen werden. Nutzen Sie die Installationsoption im Browsermenü.", ready: "Die Installationsabfrage ist bereit. Die Installation beginnt nur nach Ihrer ausdrücklichen Bestätigung." },
  zh: { kicker: "BYTEQUANT 应用", title: "从桌面或主屏幕直接打开工具", body: "把 ByteQuant 安装为 Web 应用，无需应用商店账户。它会在独立窗口中打开，已访问页面可在离线时使用，工具输入绝不会写入缓存。", install: "安装应用", installed: "应用已安装", manual: "请在浏览器菜单中选择“安装应用”或“添加到主屏幕”。", ios: "iPhone/iPad：在 Safari 中点击“分享”，然后选择“添加到主屏幕”。", android: "Android：请使用最新版 Chrome 或 Edge。先移除以前安装的 ByteQuant 快捷方式/应用，刷新页面，再从浏览器菜单重新安装。", legacy: "此旧版或内嵌 Android 浏览器未打开安全安装提示。请勿确认有关旧版 Android 的警告；更新浏览器后，从最新版 Chrome/Edge 菜单开始安装。", noApk: "ByteQuant 不分发 APK。Android 应用封装由浏览器生成；网站清单无法设置其目标 Android 版本。", failed: "安装提示未能完成。请改用浏览器菜单中的安装选项。", ready: "安装提示已就绪。只有在您明确确认后才会开始安装。" },
} as const;

type AndroidInstallMode = "ready" | "manual" | "legacy";

function androidInstallMode(userAgent: string): AndroidInstallMode {
  if (!/Android/i.test(userAgent)) return "ready";
  if (/;\s*wv\)|Version\/4\.0.+Chrome\//i.test(userAgent)) return "legacy";
  const chromium = /(?:Chrome|EdgA)\/(\d+)/i.exec(userAgent);
  if (!chromium) return "manual";
  return Number(chromium[1]) >= 120 ? "ready" : "legacy";
}

export function PwaRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production" || !isAuthorizedByteQuantHostname(location.hostname)) return;
    const register = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);
  return null;
}

export function PwaInstall({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const labels = content[locale];
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [manual, setManual] = useState(false);
  const [failed, setFailed] = useState(false);
  const [installMode, setInstallMode] = useState<AndroidInstallMode>("manual");
  const userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const isAndroid = /Android/i.test(userAgent);
  const isIos = /iPad|iPhone|iPod/.test(userAgent);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const frame = window.requestAnimationFrame(() => {
      setInstalled(media.matches || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)));
      const mode = androidInstallMode(navigator.userAgent);
      if (mode === "legacy") setInstallMode(mode);
    });
    const beforeInstall = (event: Event) => {
      event.preventDefault();
      const mode = androidInstallMode(navigator.userAgent);
      setInstallMode(mode);
      setPrompt(mode === "ready" ? event as InstallPromptEvent : null);
    };
    const appInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", appInstalled);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("beforeinstallprompt", beforeInstall); window.removeEventListener("appinstalled", appInstalled); };
  }, []);

  async function install() {
    if (!prompt) { setManual(true); return; }
    setFailed(false);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch {
      setFailed(true);
      setManual(true);
    } finally {
      setPrompt(null);
    }
  }

  if (compact) return <button type="button" className="install-trigger" aria-label={installed ? labels.installed : labels.install} title={installed ? labels.installed : labels.install} onClick={() => void install()} disabled={installed}><span aria-hidden="true">⇩</span><b>{installed ? labels.installed : labels.install}</b></button>;
  return (
    <section className="section install-section" aria-labelledby={"install-" + locale}>
      <div className="container install-card">
        <div className="install-icon" aria-hidden="true"><span>BQ</span><i>＋</i></div>
        <div><span className="kicker">{labels.kicker}</span><h2 id={"install-" + locale}>{labels.title}</h2><p>{labels.body}</p><ul><li>✓ PWA · standalone</li><li>✓ Same-origin offline shell</li><li>✓ No input caching</li></ul><p className="install-security-note">{labels.noApk}</p></div>
        <div className="install-actions" aria-live="polite"><button type="button" className="primary-button" onClick={() => void install()} disabled={installed}>{installed ? labels.installed : labels.install}</button><small className={installMode === "legacy" ? "install-warning" : undefined}>{failed ? labels.failed : installMode === "legacy" ? labels.legacy : prompt ? labels.ready : labels.manual}</small>{(isIos || (manual && isAndroid)) && <small>{isAndroid ? labels.android : labels.ios}</small>}</div>
      </div>
    </section>
  );
}
