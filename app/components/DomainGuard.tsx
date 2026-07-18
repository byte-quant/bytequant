"use client";

import { useEffect, useState } from "react";
import { BYTEQUANT_BUILD_SIGNATURE, BYTEQUANT_CANONICAL_ORIGIN, isAuthorizedByteQuantHostname } from "../lib/brand-integrity";

function currentLocale() {
  const first = location.pathname.split("/")[1];
  return first === "en" || first === "de" || first === "zh" ? first : "tr";
}

export function DomainGuard() {
  const [blocked, setBlocked] = useState(false);
  const [officialUrl, setOfficialUrl] = useState(BYTEQUANT_CANONICAL_ORIGIN);
  useEffect(() => {
    document.documentElement.dataset.bytequantSignature = BYTEQUANT_BUILD_SIGNATURE;
    if (!/^https?:$/.test(location.protocol) || isAuthorizedByteQuantHostname(location.hostname)) return;
    const site = document.querySelector<HTMLElement>(".site-shell");
    const frame = requestAnimationFrame(() => {
      setOfficialUrl(`${BYTEQUANT_CANONICAL_ORIGIN}${location.pathname}${location.search}${location.hash}`);
      setBlocked(true);
      site?.setAttribute("inert", "");
      site?.setAttribute("aria-hidden", "true");
    });
    return () => { cancelAnimationFrame(frame); site?.removeAttribute("inert"); site?.removeAttribute("aria-hidden"); };
  }, []);
  if (!blocked) return null;
  const locale = currentLocale();
  const text = {
    tr: ["Resmî ByteQuant alan adını kullanın", "Bu kopya yetkili bytequant.org alan adında çalışmıyor. Güvenlik, güncellik ve doğru canonical sinyalleri için resmî siteye geçin.", "Resmî siteyi aç"],
    en: ["Use the official ByteQuant domain", "This copy is not running on the authorized bytequant.org domain. Continue to the official site for security, current code, and correct canonical signals.", "Open the official site"],
    de: ["Offizielle ByteQuant-Domain verwenden", "Diese Kopie läuft nicht auf der autorisierten Domain bytequant.org. Wechseln Sie für Sicherheit, aktuellen Code und korrekte Canonical-Signale zur offiziellen Website.", "Offizielle Website öffnen"],
    zh: ["请使用 ByteQuant 官方域名", "此副本并非运行在获授权的 bytequant.org 域名。为确保安全、代码最新和 canonical 信号正确，请前往官方网站。", "打开官方网站"],
  }[locale];
  return <div className="domain-guard" role="alertdialog" aria-modal="true" aria-labelledby="domain-guard-title"><div><span className="domain-guard-mark">BQ</span><h1 id="domain-guard-title">{text[0]}</h1><p>{text[1]}</p><a className="primary-button" href={officialUrl}>{text[2]} →</a><small>{BYTEQUANT_CANONICAL_ORIGIN}</small></div></div>;
}
