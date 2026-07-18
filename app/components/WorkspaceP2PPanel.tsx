"use client";

import { useEffect, useRef, useState } from "react";
import { WorkspacePeerMesh } from "../lib/workspace-p2p";
import type { Locale } from "../lib/site";
import type { WorkspaceDocument } from "../lib/workspace-types";

const p2pCopy = {
  tr: { title: "Sunucusuz P2P işbirliği", intro: "Her eş için bir davet/yanıt kodu değiş tokuş edin. Kodlar SDP ve yerel ağ adayları içerir; yalnızca güvendiğiniz kişiyle ayrı bir kanaldan paylaşın.", start: "Yeni oda daveti üret", offer: "Davet kodu", signal: "Davet veya yanıt kodu", join: "Daveti kabul et ve yanıt üret", answer: "Yanıt kodu", finish: "Yanıtı uygula", copy: "Kopyala", room: "Oda", peers: "bağlı eş", idle: "Bağlantı bekleniyor", connected: "Şifreli DataChannel bağlı", failed: "Bağlantı kurulamadı", unsupported: "Bu tarayıcı WebRTC DataChannel desteklemiyor.", boundary: "Dış sinyalleme, STUN veya TURN yoktur. Bu nedenle aynı LAN dışındaki NAT/firewall kombinasyonlarında bağlantı mümkün olmayabilir; bu bir hata değil, tam sunucusuz mimarinin sınırıdır.", bad: "Kod okunamadı veya bu odayla eşleşmiyor.", close: "Odayı kapat" },
  en: { title: "Serverless P2P collaboration", intro: "Exchange one invite/answer pair per peer. Codes contain SDP and local network candidates; share them only with a trusted person through a separate channel.", start: "Create a new room invite", offer: "Invite code", signal: "Invite or answer code", join: "Accept invite and create answer", answer: "Answer code", finish: "Apply answer", copy: "Copy", room: "Room", peers: "connected peers", idle: "Waiting for connection", connected: "Encrypted DataChannel connected", failed: "Connection could not be established", unsupported: "This browser does not support WebRTC DataChannel.", boundary: "There is no external signaling, STUN, or TURN. Some NAT/firewall combinations outside the same LAN therefore cannot connect; this is the boundary of a strictly serverless design, not a hidden fallback.", bad: "The code is invalid or belongs to another room.", close: "Close room" },
  de: { title: "Serverlose P2P-Zusammenarbeit", intro: "Pro Gegenstelle wird ein Einladungs-/Antwortpaar ausgetauscht. Die Codes enthalten SDP und lokale Netzwerkkandidaten und gehören nur über einen separaten Kanal an vertrauenswürdige Personen.", start: "Neue Raumeinladung erstellen", offer: "Einladungscode", signal: "Einladungs- oder Antwortcode", join: "Einladung annehmen und Antwort erstellen", answer: "Antwortcode", finish: "Antwort anwenden", copy: "Kopieren", room: "Raum", peers: "verbundene Gegenstellen", idle: "Warten auf Verbindung", connected: "Verschlüsselter DataChannel verbunden", failed: "Verbindung konnte nicht hergestellt werden", unsupported: "Dieser Browser unterstützt WebRTC DataChannel nicht.", boundary: "Ohne externe Signalisierung, STUN oder TURN können manche NAT-/Firewall-Kombinationen außerhalb desselben LAN keine Verbindung herstellen. Das ist die Grenze der vollständig serverlosen Architektur.", bad: "Code ist ungültig oder gehört zu einem anderen Raum.", close: "Raum schließen" },
  zh: { title: "无服务器 P2P 协作", intro: "每个对等端交换一组邀请/应答代码。代码包含 SDP 和本地网络候选信息，请只通过独立渠道交给可信人员。", start: "创建新的房间邀请", offer: "邀请代码", signal: "邀请或应答代码", join: "接受邀请并生成应答", answer: "应答代码", finish: "应用应答", copy: "复制", room: "房间", peers: "个已连接对等端", idle: "等待连接", connected: "加密 DataChannel 已连接", failed: "无法建立连接", unsupported: "此浏览器不支持 WebRTC DataChannel。", boundary: "系统不使用外部信令、STUN 或 TURN。因此，同一局域网之外的部分 NAT/防火墙组合可能无法连接；这是严格无服务器架构的边界。", bad: "代码无效或不属于此房间。", close: "关闭房间" },
} as const;

export function WorkspaceP2PPanel({ locale, document, onRemoteDocument }: { locale: Locale; document: WorkspaceDocument; onRemoteDocument: (document: WorkspaceDocument) => void }) {
  const t = p2pCopy[locale];
  const meshRef = useRef<WorkspacePeerMesh | null>(null);
  const remoteVersionRef = useRef("");
  const [invite, setInvite] = useState("");
  const [answer, setAnswer] = useState("");
  const [incoming, setIncoming] = useState("");
  const [status, setStatus] = useState<string>(t.idle);
  const [peers, setPeers] = useState(0);
  const [room, setRoom] = useState("");
  const supported = typeof window !== "undefined" && "RTCPeerConnection" in window;

  function mesh() {
    if (!meshRef.current) {
      const value = new WorkspacePeerMesh();
      value.onStatus = (next, count) => { setPeers(count); setStatus(next === "connected" ? t.connected : next === "failed" ? t.failed : t.idle); };
      value.onWorkspace = (next) => { remoteVersionRef.current = next.updatedAt; onRemoteDocument(next); };
      meshRef.current = value; setRoom(value.roomId);
    }
    return meshRef.current;
  }

  useEffect(() => {
    const value = meshRef.current;
    if (!value || value.peerCount === 0) return;
    if (remoteVersionRef.current === document.updatedAt) { remoteVersionRef.current = ""; return; }
    const timeout = window.setTimeout(() => { try { value.broadcast(document); } catch { setStatus(t.failed); } }, 250);
    return () => window.clearTimeout(timeout);
  }, [document, t.failed]);

  useEffect(() => () => meshRef.current?.close(), []);

  const createInvite = async () => {
    try { const value = mesh(); setInvite(await value.createInvite()); setRoom(value.roomId); setStatus(t.idle); }
    catch { setStatus(t.failed); }
  };
  const acceptInvite = async () => {
    try { const value = mesh(); setAnswer(await value.acceptInvite(incoming)); setRoom(value.roomId); setStatus(t.idle); }
    catch { setStatus(t.bad); }
  };
  const applyAnswer = async () => {
    try { await mesh().acceptAnswer(incoming); setStatus(t.idle); }
    catch { setStatus(t.bad); }
  };
  const copyText = async (value: string) => { if (value) await navigator.clipboard.writeText(value); };
  const close = () => { meshRef.current?.close(); meshRef.current = null; setInvite(""); setAnswer(""); setIncoming(""); setRoom(""); setPeers(0); setStatus(t.idle); };

  return <section className="workspace-panel workspace-p2p-panel" aria-labelledby="p2p-title">
    <div className="workspace-panel-heading"><div><span className="workspace-live-dot" /><h3 id="p2p-title">{t.title}</h3></div>{room && <small>{t.room}: <code>{room}</code> · {peers} {t.peers}</small>}</div>
    <p>{t.intro}</p>
    {!supported ? <div className="workspace-alert" role="alert">{t.unsupported}</div> : <>
      <div className="workspace-p2p-actions"><button type="button" className="secondary-button" onClick={createInvite}>{t.start}</button>{room && <button type="button" onClick={close}>{t.close}</button>}</div>
      {invite && <label>{t.offer}<textarea readOnly value={invite} /><button type="button" onClick={() => copyText(invite)}>{t.copy}</button></label>}
      <label>{t.signal}<textarea value={incoming} onChange={(event) => setIncoming(event.target.value)} placeholder="p1.…" /></label>
      <div className="workspace-p2p-actions"><button type="button" onClick={acceptInvite}>{t.join}</button><button type="button" onClick={applyAnswer}>{t.finish}</button></div>
      {answer && <label>{t.answer}<textarea readOnly value={answer} /><button type="button" onClick={() => copyText(answer)}>{t.copy}</button></label>}
      <p className="workspace-p2p-status" role="status"><span className={peers ? "connected" : ""} />{status}</p>
    </>}
    <small className="workspace-boundary">{t.boundary}</small>
  </section>;
}
