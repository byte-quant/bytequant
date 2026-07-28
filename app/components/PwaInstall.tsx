"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "../lib/site";
import { isAuthorizedByteQuantHostname } from "../lib/brand-integrity";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type InstallState = "checking" | "ready" | "installed" | "manual" | "error";
type Platform = "ios" | "android" | "desktop";

const copy = {
  tr: { kicker: "BYTEQUANT UYGULAMASI", title: "ByteQuant’ı telefonunuza veya bilgisayarınıza ekleyin", body: "Araçlara tek dokunuşla ulaşın. Mağaza hesabı ve APK gerekmez; daha önce açtığınız sayfalar çevrimdışıyken de kullanılabilir. Araç girdileri önbelleğe alınmaz.", install: "Uygulamayı yükle", installed: "Uygulama yüklü", checking: "Kurulum desteği kontrol ediliyor…", ready: "Tarayıcınız kuruluma hazır.", manual: "Kurulum adımlarını göster", failed: "Tarayıcı kurulum penceresini açamadı. Aşağıdaki güvenli adımları kullanın.", guideTitle: "ByteQuant nasıl yüklenir?", guideIntro: "Bu işlem bir APK indirmez. Yalnızca tarayıcınızın yerleşik web uygulaması özelliğini kullanır.", ios: ["Safari’de ByteQuant’ı açın.", "Paylaş düğmesine dokunun.", "Ana Ekrana Ekle’yi seçip onaylayın."], android: ["Güncel Chrome veya Edge’de ByteQuant’ı açın.", "Sağ üstteki tarayıcı menüsünü açın.", "Uygulamayı yükle veya Ana ekrana ekle’yi seçin."], desktop: ["ByteQuant’ı Chrome veya Edge’de açın.", "Adres çubuğundaki yükle simgesini ya da tarayıcı menüsünü açın.", "ByteQuant’ı yükle seçeneğini onaylayın."], close: "Kapat", privacy: "Girdi ve çıktılarınız bu kurulum sırasında gönderilmez veya PWA önbelleğine yazılmaz." },
  en: { kicker: "BYTEQUANT APP", title: "Add ByteQuant to your phone or computer", body: "Reach your tools in one tap. No app-store account or APK is needed; previously opened pages can work offline. Tool inputs are never cached.", install: "Install app", installed: "App installed", checking: "Checking install support…", ready: "Your browser is ready to install.", manual: "Show install steps", failed: "The browser could not open its install prompt. Use the safe steps below.", guideTitle: "How to install ByteQuant", guideIntro: "This does not download an APK. It only uses your browser’s built-in web-app feature.", ios: ["Open ByteQuant in Safari.", "Tap the Share button.", "Choose Add to Home Screen and confirm."], android: ["Open ByteQuant in an up-to-date Chrome or Edge.", "Open the browser menu in the top-right corner.", "Choose Install app or Add to Home screen."], desktop: ["Open ByteQuant in Chrome or Edge.", "Use the install icon in the address bar or open the browser menu.", "Confirm Install ByteQuant."], close: "Close", privacy: "Your inputs and outputs are not sent or written to the PWA cache during installation." },
  de: { kicker: "BYTEQUANT APP", title: "ByteQuant auf Smartphone oder Computer installieren", body: "Werkzeuge mit einem Tipp öffnen. Kein App-Store-Konto und keine APK nötig; bereits geöffnete Seiten können offline funktionieren. Werkzeugeingaben werden nie gecacht.", install: "App installieren", installed: "App installiert", checking: "Installationsunterstützung wird geprüft…", ready: "Ihr Browser ist zur Installation bereit.", manual: "Installationsschritte anzeigen", failed: "Der Browser konnte den Installationsdialog nicht öffnen. Nutzen Sie die sicheren Schritte unten.", guideTitle: "ByteQuant installieren", guideIntro: "Dabei wird keine APK heruntergeladen. Es wird nur die integrierte Web-App-Funktion des Browsers verwendet.", ios: ["ByteQuant in Safari öffnen.", "Auf Teilen tippen.", "Zum Home-Bildschirm wählen und bestätigen."], android: ["ByteQuant in einem aktuellen Chrome oder Edge öffnen.", "Das Browsermenü oben rechts öffnen.", "App installieren oder Zum Startbildschirm wählen."], desktop: ["ByteQuant in Chrome oder Edge öffnen.", "Das Installationssymbol in der Adressleiste oder das Browsermenü öffnen.", "ByteQuant installieren bestätigen."], close: "Schließen", privacy: "Ihre Ein- und Ausgaben werden bei der Installation weder gesendet noch im PWA-Cache gespeichert." },
  zh: { kicker: "BYTEQUANT 应用", title: "将 ByteQuant 添加到手机或电脑", body: "一键打开常用工具。无需应用商店账户或 APK；已打开的页面可离线使用，工具输入绝不会写入缓存。", install: "安装应用", installed: "应用已安装", checking: "正在检查安装支持…", ready: "浏览器已准备好安装。", manual: "查看安装步骤", failed: "浏览器无法打开安装提示，请使用下方的安全步骤。", guideTitle: "如何安装 ByteQuant", guideIntro: "此过程不会下载 APK，只使用浏览器内置的 Web 应用功能。", ios: ["在 Safari 中打开 ByteQuant。", "点击分享按钮。", "选择添加到主屏幕并确认。"], android: ["在最新版 Chrome 或 Edge 中打开 ByteQuant。", "打开右上角的浏览器菜单。", "选择安装应用或添加到主屏幕。"], desktop: ["在 Chrome 或 Edge 中打开 ByteQuant。", "点击地址栏的安装图标或打开浏览器菜单。", "确认安装 ByteQuant。"], close: "关闭", privacy: "安装过程中，您的输入和输出不会被发送或写入 PWA 缓存。" },
} as const;

type PwaContextValue = {
  state: InstallState;
  install: (locale: Locale) => Promise<void>;
  showGuide: (locale: Locale) => void;
};

const PwaContext = createContext<PwaContextValue | null>(null);

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function PwaProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [state, setState] = useState<InstallState>("checking");
  const [guideLocale, setGuideLocale] = useState<Locale | null>(null);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const stateFrame = requestAnimationFrame(() => setState(standalone ? "installed" : "manual"));
    const beforeInstall = (event: Event) => {
      event.preventDefault();
      // A browser-generated prompt is authoritative. Do not reject it based on
      // user-agent version guesses: that was the source of false Android blocks.
      setPrompt(event as InstallPromptEvent);
      setState("ready");
    };
    const appInstalled = () => { setPrompt(null); setState("installed"); };
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", appInstalled);

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production" && isAuthorizedByteQuantHostname(location.hostname)) {
      const register = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => setState((current) => current === "installed" ? current : "manual"));
      if (document.readyState === "complete") void register();
      else window.addEventListener("load", register, { once: true });
      return () => {
        cancelAnimationFrame(stateFrame);
        window.removeEventListener("beforeinstallprompt", beforeInstall);
        window.removeEventListener("appinstalled", appInstalled);
        window.removeEventListener("load", register);
      };
    }
    return () => {
      cancelAnimationFrame(stateFrame);
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", appInstalled);
    };
  }, []);

  async function install(locale: Locale) {
    if (state === "installed") return;
    if (!prompt) { setGuideLocale(locale); return; }
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") setState("installed");
      else setState("manual");
    } catch {
      setState("error");
      setGuideLocale(locale);
    } finally {
      setPrompt(null);
    }
  }

  const value: PwaContextValue = { state, install, showGuide: setGuideLocale };
  const labels = guideLocale ? copy[guideLocale] : null;
  const steps = labels ? labels[typeof navigator === "undefined" ? "desktop" : detectPlatform()] : [];
  return <PwaContext.Provider value={value}>{children}{labels && <div className="pwa-guide-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setGuideLocale(null); }}><section className="pwa-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-guide-title"><header><div><span>{labels.kicker}</span><h2 id="pwa-guide-title">{labels.guideTitle}</h2></div><button type="button" onClick={() => setGuideLocale(null)} aria-label={labels.close}>×</button></header><p>{state === "error" ? labels.failed : labels.guideIntro}</p><ol>{steps.map((step, index) => <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>)}</ol><div className="pwa-guide-privacy"><span aria-hidden="true">✓</span><p>{labels.privacy}</p></div><button type="button" className="primary-button" onClick={() => setGuideLocale(null)}>{labels.close}</button></section></div>}</PwaContext.Provider>;
}

function usePwa() {
  const context = useContext(PwaContext);
  if (!context) throw new Error("PwaInstall must be rendered inside PwaProvider");
  return context;
}

export function PwaInstall({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const labels = copy[locale];
  const { state, install, showGuide } = usePwa();
  const installed = state === "installed";
  if (compact) return <button type="button" className="install-trigger" aria-label={installed ? labels.installed : labels.install} title={installed ? labels.installed : labels.install} onClick={() => void install(locale)} disabled={installed}><span aria-hidden="true">⇩</span><b>{installed ? labels.installed : labels.install}</b></button>;
  const status = state === "checking" ? labels.checking : state === "ready" ? labels.ready : state === "error" ? labels.failed : labels.manual;
  return <section className="section install-section" aria-labelledby={`install-${locale}`}><div className="container install-card"><div className="install-icon" aria-hidden="true"><span>BQ</span><i>＋</i></div><div><span className="kicker">{labels.kicker}</span><h2 id={`install-${locale}`}>{labels.title}</h2><p>{labels.body}</p><ul><li>✓ {locale === "tr" ? "Tek dokunuşla açılır" : locale === "de" ? "Mit einem Tipp öffnen" : locale === "zh" ? "一键打开" : "Open in one tap"}</li><li>✓ {locale === "tr" ? "Güvenli tarayıcı kurulumu" : locale === "de" ? "Sichere Browser-Installation" : locale === "zh" ? "安全的浏览器安装" : "Safe browser installation"}</li><li>✓ {locale === "tr" ? "Girdiler önbelleğe alınmaz" : locale === "de" ? "Eingaben werden nicht gecacht" : locale === "zh" ? "输入不会缓存" : "Inputs are never cached"}</li></ul></div><div className="install-actions" aria-live="polite"><button type="button" className="primary-button" onClick={() => void install(locale)} disabled={installed}>{installed ? labels.installed : state === "ready" ? labels.install : labels.manual}</button><small>{status}</small>{state !== "ready" && !installed && <button type="button" className="text-button" onClick={() => showGuide(locale)}>{labels.manual} →</button>}</div></div></section>;
}
