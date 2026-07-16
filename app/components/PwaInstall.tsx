"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../lib/site";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const content = {
  tr: { kicker: "BYTEQUANT UYGULAMASI", title: "Araçlarınıza masaüstünden veya ana ekrandan ulaşın", body: "ByteQuant'ı kurulabilir web uygulaması olarak ekleyin. Ayrı mağaza hesabı gerekmez; uygulama kendi penceresinde açılır, daha önce ziyaret edilen sayfalar çevrimdışıyken kullanılabilir ve araç girdileri önbelleğe yazılmaz.", install: "Uygulamayı yükle", installed: "Uygulama yüklendi", manual: "Tarayıcı menüsünden “Ana ekrana ekle” veya “Uygulamayı yükle” seçeneğini kullanın.", ios: "iPhone/iPad: Safari'de Paylaş düğmesine, ardından “Ana Ekrana Ekle” seçeneğine dokunun.", ready: "Kurulum istemi hazır. Yükleme yalnızca açıkça onayladığınızda başlar." },
  en: { kicker: "BYTEQUANT APP", title: "Open your tools from the desktop or home screen", body: "Install ByteQuant as a web app. No app-store account is required; it opens in its own window, previously visited pages can work offline, and tool inputs are never written to the cache.", install: "Install app", installed: "App installed", manual: "Use “Install app” or “Add to Home Screen” in your browser menu.", ios: "iPhone/iPad: in Safari, tap Share and then “Add to Home Screen.”", ready: "The install prompt is ready. Installation begins only after your explicit approval." },
  de: { kicker: "BYTEQUANT APP", title: "Werkzeuge direkt vom Desktop oder Startbildschirm öffnen", body: "Installieren Sie ByteQuant als Web-App. Kein App-Store-Konto ist nötig; sie öffnet sich in einem eigenen Fenster, bereits besuchte Seiten können offline funktionieren und Werkzeugeingaben werden nie im Cache gespeichert.", install: "App installieren", installed: "App installiert", manual: "Wählen Sie im Browsermenü „App installieren“ oder „Zum Startbildschirm hinzufügen“.", ios: "iPhone/iPad: Tippen Sie in Safari auf „Teilen“ und dann auf „Zum Home-Bildschirm“.", ready: "Die Installationsabfrage ist bereit. Die Installation beginnt nur nach Ihrer ausdrücklichen Bestätigung." },
  zh: { kicker: "BYTEQUANT 应用", title: "从桌面或主屏幕直接打开工具", body: "把 ByteQuant 安装为 Web 应用，无需应用商店账户。它会在独立窗口中打开，已访问页面可在离线时使用，工具输入绝不会写入缓存。", install: "安装应用", installed: "应用已安装", manual: "请在浏览器菜单中选择“安装应用”或“添加到主屏幕”。", ios: "iPhone/iPad：在 Safari 中点击“分享”，然后选择“添加到主屏幕”。", ready: "安装提示已就绪。只有在您明确确认后才会开始安装。" },
} as const;

export function PwaRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
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

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const frame = window.requestAnimationFrame(() => setInstalled(media.matches || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))));
    const beforeInstall = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); };
    const appInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", appInstalled);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("beforeinstallprompt", beforeInstall); window.removeEventListener("appinstalled", appInstalled); };
  }, []);

  async function install() {
    if (!prompt) { setManual(true); return; }
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPrompt(null);
  }

  if (compact) return <button type="button" className="install-trigger" onClick={() => void install()} disabled={installed}>{installed ? labels.installed : labels.install}</button>;
  return (
    <section className="section install-section" aria-labelledby={"install-" + locale}>
      <div className="container install-card">
        <div className="install-icon" aria-hidden="true"><span>BQ</span><i>＋</i></div>
        <div><span className="kicker">{labels.kicker}</span><h2 id={"install-" + locale}>{labels.title}</h2><p>{labels.body}</p><ul><li>✓ PWA · standalone</li><li>✓ Same-origin offline shell</li><li>✓ No input caching</li></ul></div>
        <div className="install-actions"><button type="button" className="primary-button" onClick={() => void install()} disabled={installed}>{installed ? labels.installed : labels.install}</button><small>{prompt ? labels.ready : labels.manual}</small>{(manual || /iPad|iPhone|iPod/.test(typeof navigator === "undefined" ? "" : navigator.userAgent)) && <small>{labels.ios}</small>}</div>
      </div>
    </section>
  );
}
