"use client";

import { useEffect, useRef, useState } from "react";
import { WorkspacePeerMesh } from "../lib/workspace-p2p";
import type { Locale } from "../lib/site";
import type { WorkspaceDocument } from "../lib/workspace-types";

const p2pCopy = {
  tr: { title: "Güvenli sunucusuz P2P", intro: "Her eş için tek kullanımlık davet/yanıt kodunu ayrı ve güvenilir bir kanaldan paylaşın. Kodlar 10 dakika içinde geçersiz olur ve yerel ağ adayları içerebilir.", consent: "Kodların ağ bağlantı adayları içerebileceğini ve yalnızca güvendiğim kişiyle paylaşmam gerektiğini anlıyorum.", start: "Yeni davet üret", offer: "Tek kullanımlık davet kodu", signal: "Davet veya yanıt kodu", join: "Daveti kabul et", answer: "Tek kullanımlık yanıt kodu", finish: "Yanıtı uygula", copy: "Kopyala", room: "Oda", peers: "bağlı eş", idle: "Bağlantı bekleniyor", connected: "Şifreli DataChannel bağlı; paylaşım duraklatıldı", failed: "Bağlantı kurulamadı veya güvenli sınır aşıldı", unsupported: "Bu tarayıcı WebRTC DataChannel desteklemiyor.", bad: "Kod geçersiz, süresi dolmuş veya bu odayla eşleşmiyor.", close: "Odayı kapat", safety: "Güvenlik kodu", safetyHelp: "Karşı tarafla bu kodu sesli veya ayrı bir güvenilir kanaldan karşılaştırın. Kodlar aynı değilse paylaşımı başlatmayın.", verified: "Karşı taraftaki güvenlik kodunun aynı olduğunu doğruladım.", startShare: "Canlı paylaşımı başlat", pauseShare: "Paylaşımı duraklat", sharing: "Canlı paylaşım açık: bağlı eşler proje düğümlerini, girdileri ve çıktıları alabilir.", paused: "Paylaşım kapalı; gelen çalışma alanı değişiklikleri uygulanmıyor.", boundary: "ByteQuant sinyalleme, STUN veya TURN kullanmaz. DTLS aktarımı şifreler; güvenlik kodu ise aradaki kişi saldırısını fark etmeye yardımcı olur. Kimlik doğrulaması değildir ve bazı NAT/firewall kombinasyonları bağlanamaz." },
  en: { title: "Secure serverless P2P", intro: "Exchange one single-use invite/answer pair per peer through a separate trusted channel. Codes expire after 10 minutes and can contain local network candidates.", consent: "I understand that codes may expose network connection candidates and must be shared only with a trusted person.", start: "Create new invite", offer: "Single-use invite code", signal: "Invite or answer code", join: "Accept invite", answer: "Single-use answer code", finish: "Apply answer", copy: "Copy", room: "Room", peers: "connected peers", idle: "Waiting for connection", connected: "Encrypted DataChannel connected; sharing is paused", failed: "Connection failed or a safety limit was reached", unsupported: "This browser does not support WebRTC DataChannel.", bad: "The code is invalid, expired, or belongs to another room.", close: "Close room", safety: "Safety code", safetyHelp: "Compare this code by voice or through another trusted channel. Do not start sharing if the codes differ.", verified: "I verified that the other person's safety code is identical.", startShare: "Start live sharing", pauseShare: "Pause sharing", sharing: "Live sharing is active: connected peers can receive project nodes, inputs, and outputs.", paused: "Sharing is off; incoming workspace changes are not applied.", boundary: "ByteQuant uses no signaling service, STUN, or TURN. DTLS encrypts transport; the safety code helps detect an active intermediary. It is not identity verification, and some NAT/firewall combinations cannot connect." },
  de: { title: "Sicheres serverloses P2P", intro: "Pro Gegenstelle wird ein einmaliges Einladungs-/Antwortpaar über einen separaten vertrauenswürdigen Kanal ausgetauscht. Codes verfallen nach 10 Minuten und können lokale Netzwerkkandidaten enthalten.", consent: "Mir ist bewusst, dass Codes Netzwerkkandidaten offenlegen können und nur an vertrauenswürdige Personen gehören.", start: "Neue Einladung erstellen", offer: "Einmaliger Einladungscode", signal: "Einladungs- oder Antwortcode", join: "Einladung annehmen", answer: "Einmaliger Antwortcode", finish: "Antwort anwenden", copy: "Kopieren", room: "Raum", peers: "verbundene Gegenstellen", idle: "Warten auf Verbindung", connected: "Verschlüsselter DataChannel verbunden; Freigabe pausiert", failed: "Verbindung fehlgeschlagen oder Sicherheitsgrenze erreicht", unsupported: "Dieser Browser unterstützt WebRTC DataChannel nicht.", bad: "Code ist ungültig, abgelaufen oder gehört zu einem anderen Raum.", close: "Raum schließen", safety: "Sicherheitscode", safetyHelp: "Code per Sprache oder über einen weiteren vertrauenswürdigen Kanal vergleichen. Bei Abweichung nicht freigeben.", verified: "Ich habe bestätigt, dass der Sicherheitscode der Gegenstelle identisch ist.", startShare: "Live-Freigabe starten", pauseShare: "Freigabe pausieren", sharing: "Live-Freigabe aktiv: Gegenstellen können Knoten, Eingaben und Ausgaben empfangen.", paused: "Freigabe ist aus; eingehende Änderungen werden nicht übernommen.", boundary: "ByteQuant verwendet keine Signalisierung, STUN oder TURN. DTLS verschlüsselt die Übertragung; der Sicherheitscode hilft, aktive Zwischenstellen zu erkennen. Er ist keine Identitätsprüfung, und manche NAT-/Firewall-Kombinationen können nicht verbinden." },
  zh: { title: "安全的无服务器 P2P", intro: "每个对等端通过独立可信渠道交换一组一次性邀请/应答代码。代码 10 分钟后失效，并可能包含本地网络候选信息。", consent: "我了解代码可能暴露网络连接候选信息，并且只应交给可信人员。", start: "创建新邀请", offer: "一次性邀请代码", signal: "邀请或应答代码", join: "接受邀请", answer: "一次性应答代码", finish: "应用应答", copy: "复制", room: "房间", peers: "个已连接对等端", idle: "等待连接", connected: "加密 DataChannel 已连接；共享已暂停", failed: "连接失败或达到安全限制", unsupported: "此浏览器不支持 WebRTC DataChannel。", bad: "代码无效、已过期或不属于此房间。", close: "关闭房间", safety: "安全码", safetyHelp: "通过语音或另一个可信渠道与对方核对安全码。代码不同就不要开始共享。", verified: "我已确认对方显示的安全码完全相同。", startShare: "开始实时共享", pauseShare: "暂停共享", sharing: "实时共享已开启：连接的对等端可以接收项目节点、输入与输出。", paused: "共享已关闭；收到的工作区更改不会应用。", boundary: "ByteQuant 不使用信令服务、STUN 或 TURN。DTLS 加密传输；安全码有助于发现主动中间人，但不等于身份验证，部分 NAT/防火墙组合也可能无法连接。" },
} as const;

export function WorkspaceP2PPanel({ locale, document, onRemoteDocument }: { locale: Locale; document: WorkspaceDocument; onRemoteDocument: (document: WorkspaceDocument) => void }) {
  const t = p2pCopy[locale];
  const meshRef = useRef<WorkspacePeerMesh | null>(null);
  const remoteVersionRef = useRef("");
  const sharingRef = useRef(false);
  const [invite, setInvite] = useState("");
  const [answer, setAnswer] = useState("");
  const [incoming, setIncoming] = useState("");
  const [status, setStatus] = useState<string>(t.idle);
  const [peers, setPeers] = useState(0);
  const [room, setRoom] = useState("");
  const [consent, setConsent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [safetyCodes, setSafetyCodes] = useState<Record<string, string>>({});
  const supported = typeof window !== "undefined" && "RTCPeerConnection" in window;

  function mesh() {
    if (!meshRef.current) {
      const value = new WorkspacePeerMesh();
      value.onStatus = (next, count) => {
        setPeers(count);
        setStatus(next === "connected" ? t.connected : next === "failed" ? t.failed : t.idle);
        if (next === "connected") { value.setSharingEnabled(false); setInvite(""); setAnswer(""); setIncoming(""); setSharing(false); sharingRef.current = false; setVerified(false); }
      };
      value.onSecurity = (peer, code) => setSafetyCodes((current) => {
        const next = { ...current };
        if (code) next[peer] = code; else delete next[peer];
        return next;
      });
      value.onWorkspace = (next) => {
        if (!sharingRef.current) { setStatus(t.paused); return; }
        remoteVersionRef.current = next.updatedAt;
        onRemoteDocument(next);
      };
      meshRef.current = value; setRoom(value.roomId);
    }
    return meshRef.current;
  }

  useEffect(() => {
    const value = meshRef.current;
    if (!value || value.peerCount === 0 || !sharing) return;
    if (remoteVersionRef.current === document.updatedAt) { remoteVersionRef.current = ""; return; }
    const timeout = window.setTimeout(() => { try { value.broadcast(document); } catch { setStatus(t.failed); } }, 250);
    return () => window.clearTimeout(timeout);
  }, [document, sharing, t.failed]);

  useEffect(() => () => meshRef.current?.close(), []);

  const createInvite = async () => {
    if (!consent) return;
    try { const value = mesh(); setInvite(await value.createInvite()); setRoom(value.roomId); setStatus(t.idle); }
    catch { setStatus(t.failed); }
  };
  const acceptInvite = async () => {
    if (!consent) return;
    try { const value = mesh(); setAnswer(await value.acceptInvite(incoming)); setRoom(value.roomId); setStatus(t.idle); }
    catch { setStatus(t.bad); }
  };
  const applyAnswer = async () => {
    if (!consent) return;
    try { await mesh().acceptAnswer(incoming); setStatus(t.idle); }
    catch { setStatus(t.bad); }
  };
  const copyText = async (value: string) => { try { if (value) await navigator.clipboard.writeText(value); } catch { setStatus(t.failed); } };
  const toggleSharing = () => {
    const next = !sharing;
    if (next && !verified) return;
    meshRef.current?.setSharingEnabled(next); sharingRef.current = next; setSharing(next); setStatus(next ? t.sharing : t.paused);
    if (next) { try { meshRef.current?.broadcast(document); } catch { setStatus(t.failed); } }
  };
  const close = () => {
    meshRef.current?.setSharingEnabled(false); meshRef.current?.close(); meshRef.current = null; sharingRef.current = false;
    setInvite(""); setAnswer(""); setIncoming(""); setRoom(""); setPeers(0); setSharing(false); setVerified(false); setSafetyCodes({}); setStatus(t.idle);
  };
  const codes = Object.entries(safetyCodes);

  return <section className="workspace-panel workspace-p2p-panel" aria-labelledby="p2p-title">
    <div className="workspace-panel-heading"><div><span className="workspace-live-dot" /><h3 id="p2p-title">{t.title}</h3></div>{room && <small>{t.room}: <code>{room}</code> · {peers} {t.peers}</small>}</div>
    <p>{t.intro}</p>
    {!supported ? <div className="workspace-alert" role="alert">{t.unsupported}</div> : <>
      <label className="workspace-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> <span>{t.consent}</span></label>
      <div className="workspace-p2p-actions"><button type="button" className="secondary-button" onClick={createInvite} disabled={!consent}>{t.start}</button>{room && <button type="button" onClick={close}>{t.close}</button>}</div>
      {invite && <label>{t.offer}<textarea readOnly value={invite} /><button type="button" onClick={() => copyText(invite)}>{t.copy}</button></label>}
      <label>{t.signal}<textarea value={incoming} maxLength={180_000} onChange={(event) => setIncoming(event.target.value)} placeholder="p2.…" /></label>
      <div className="workspace-p2p-actions"><button type="button" onClick={acceptInvite} disabled={!consent || !incoming.trim()}>{t.join}</button><button type="button" onClick={applyAnswer} disabled={!consent || !incoming.trim()}>{t.finish}</button></div>
      {answer && <label>{t.answer}<textarea readOnly value={answer} /><button type="button" onClick={() => copyText(answer)}>{t.copy}</button></label>}
      <p className="workspace-p2p-status" role="status"><span className={peers ? "connected" : ""} />{status}</p>
      {codes.length > 0 && <div className="workspace-safety-card"><div><small>{t.safety}</small><div className="workspace-safety-codes">{codes.map(([peer, code]) => <span key={peer}><b>{peer}</b><code>{code}</code></span>)}</div></div><p>{t.safetyHelp}</p><label className="workspace-consent"><input type="checkbox" checked={verified} onChange={(event) => { setVerified(event.target.checked); if (!event.target.checked) { meshRef.current?.setSharingEnabled(false); sharingRef.current = false; setSharing(false); } }} /> <span>{t.verified}</span></label><button type="button" className={sharing ? "workspace-danger-button" : "primary-button"} disabled={!verified} onClick={toggleSharing}>{sharing ? t.pauseShare : t.startShare}</button><strong className={sharing ? "workspace-sharing-on" : "workspace-sharing-off"}>{sharing ? t.sharing : t.paused}</strong></div>}
    </>}
    <small className="workspace-boundary">{t.boundary}</small>
  </section>;
}
