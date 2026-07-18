import { WORKSPACE_MAX_BYTES, validateWorkspaceDocument, type WorkspaceDocument } from "./workspace-types";

const SIGNAL_LIMIT = 180_000;
const CHUNK_SIZE = 12_000;
const MAX_CHUNKS = 256;

type OfferSignal = { v: 1; kind: "offer"; roomId: string; offerId: string; from: string; sdp: RTCSessionDescriptionInit };
type AnswerSignal = { v: 1; kind: "answer"; roomId: string; offerId: string; from: string; to: string; sdp: RTCSessionDescriptionInit };
type Signal = OfferSignal | AnswerSignal;
type WireChunk = { v: 1; type: "workspace-chunk"; roomId: string; from: string; transferId: string; index: number; total: number; payload: string };

function shortId(prefix: string, size = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  return `${prefix}-${Array.from(bytes, (value) => value.toString(36).padStart(2, "0")).join("").slice(0, size * 2)}`;
}

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("signal-format");
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

function validId(value: unknown) { return typeof value === "string" && /^[a-z0-9][a-z0-9-]{2,79}$/.test(value); }

export function encodeCollaborationSignal(signal: Signal) {
  const code = `p1.${base64UrlEncode(JSON.stringify(signal))}`;
  if (code.length > SIGNAL_LIMIT) throw new Error("signal-size");
  return code;
}

export function decodeCollaborationSignal(code: string): Signal {
  const clean = code.trim();
  if (!clean.startsWith("p1.") || clean.length > SIGNAL_LIMIT) throw new Error("signal-format");
  const value = JSON.parse(base64UrlDecode(clean.slice(3))) as Signal;
  if (value?.v !== 1 || !["offer", "answer"].includes(value.kind) || !validId(value.roomId) || !validId(value.offerId) || !validId(value.from)
    || !value.sdp || typeof value.sdp.sdp !== "string" || value.sdp.sdp.length > 140_000 || !["offer", "answer"].includes(value.sdp.type ?? "")) throw new Error("signal-invalid");
  if (value.kind === "answer" && !validId(value.to)) throw new Error("signal-invalid");
  return value;
}

async function waitForIce(connection: RTCPeerConnection) {
  if (connection.iceGatheringState === "complete") return;
  await new Promise<void>((resolve) => {
    const timeout = window.setTimeout(done, 8_000);
    function done() { window.clearTimeout(timeout); connection.removeEventListener("icegatheringstatechange", onChange); resolve(); }
    function onChange() { if (connection.iceGatheringState === "complete") done(); }
    connection.addEventListener("icegatheringstatechange", onChange);
  });
}

export class WorkspacePeerMesh {
  roomId: string;
  readonly peerId: string;
  private connections = new Map<string, RTCPeerConnection>();
  private channels = new Map<string, RTCDataChannel>();
  private offers = new Map<string, RTCPeerConnection>();
  private chunks = new Map<string, { parts: string[]; total: number; bytes: number; from: string }>();
  onWorkspace?: (document: WorkspaceDocument, from: string) => void;
  onStatus?: (status: string, peers: number) => void;

  constructor(roomId = shortId("room", 4)) {
    this.roomId = roomId;
    this.peerId = shortId("peer", 5);
  }

  get peerCount() { return [...this.channels.values()].filter((channel) => channel.readyState === "open").length; }

  private createConnection() {
    if (typeof RTCPeerConnection === "undefined") throw new Error("webrtc-unavailable");
    const connection = new RTCPeerConnection({ iceServers: [], iceTransportPolicy: "all", bundlePolicy: "max-bundle" });
    connection.addEventListener("connectionstatechange", () => {
      this.onStatus?.(connection.connectionState, this.peerCount);
      if (["failed", "closed"].includes(connection.connectionState)) this.removeConnection(connection);
    });
    return connection;
  }

  private removeConnection(connection: RTCPeerConnection) {
    for (const [peer, item] of this.connections) if (item === connection) { this.connections.delete(peer); this.channels.delete(peer); }
    connection.close();
    this.onStatus?.("closed", this.peerCount);
  }

  private attachChannel(peer: string, connection: RTCPeerConnection, channel: RTCDataChannel) {
    this.connections.set(peer, connection);
    this.channels.set(peer, channel);
    channel.addEventListener("open", () => this.onStatus?.("connected", this.peerCount));
    channel.addEventListener("close", () => this.onStatus?.("closed", this.peerCount));
    channel.addEventListener("message", (event) => this.receive(String(event.data), peer));
  }

  async createInvite() {
    const connection = this.createConnection();
    const offerId = shortId("offer", 5);
    const channel = connection.createDataChannel("bytequant-workspace", { ordered: true });
    this.connections.set(`pending-${offerId}`, connection);
    this.channels.set(`pending-${offerId}`, channel);
    await connection.setLocalDescription(await connection.createOffer());
    await waitForIce(connection);
    if (!connection.localDescription) throw new Error("offer-missing");
    this.offers.set(offerId, connection);
    return encodeCollaborationSignal({ v: 1, kind: "offer", roomId: this.roomId, offerId, from: this.peerId, sdp: connection.localDescription.toJSON() });
  }

  async acceptInvite(code: string) {
    const offer = decodeCollaborationSignal(code);
    if (offer.kind !== "offer") throw new Error("offer-required");
    this.roomId = offer.roomId;
    const connection = this.createConnection();
    connection.addEventListener("datachannel", (event) => this.attachChannel(offer.from, connection, event.channel), { once: true });
    await connection.setRemoteDescription(offer.sdp);
    await connection.setLocalDescription(await connection.createAnswer());
    await waitForIce(connection);
    if (!connection.localDescription) throw new Error("answer-missing");
    return encodeCollaborationSignal({ v: 1, kind: "answer", roomId: offer.roomId, offerId: offer.offerId, from: this.peerId, to: offer.from, sdp: connection.localDescription.toJSON() });
  }

  async acceptAnswer(code: string) {
    const answer = decodeCollaborationSignal(code);
    if (answer.kind !== "answer" || answer.to !== this.peerId || answer.roomId !== this.roomId) throw new Error("answer-mismatch");
    const connection = this.offers.get(answer.offerId);
    if (!connection) throw new Error("answer-expired");
    await connection.setRemoteDescription(answer.sdp);
    this.offers.delete(answer.offerId);
    const pending = `pending-${answer.offerId}`;
    const channel = this.channels.get(pending);
    this.connections.delete(pending); this.channels.delete(pending);
    if (channel) this.attachChannel(answer.from, connection, channel);
  }

  broadcast(document: WorkspaceDocument) {
    if (!validateWorkspaceDocument(document)) throw new Error("workspace-invalid");
    const json = JSON.stringify(document);
    if (new TextEncoder().encode(json).length > WORKSPACE_MAX_BYTES) throw new Error("workspace-size");
    const total = Math.ceil(json.length / CHUNK_SIZE);
    if (total > MAX_CHUNKS) throw new Error("workspace-chunks");
    const transferId = shortId("sync", 6);
    for (const channel of this.channels.values()) {
      if (channel.readyState !== "open") continue;
      for (let index = 0; index < total; index += 1) {
        const chunk: WireChunk = { v: 1, type: "workspace-chunk", roomId: this.roomId, from: this.peerId, transferId, index, total, payload: json.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE) };
        channel.send(JSON.stringify(chunk));
      }
    }
  }

  private receive(raw: string, peer: string) {
    if (raw.length > CHUNK_SIZE * 2) return;
    try {
      const chunk = JSON.parse(raw) as WireChunk;
      if (chunk?.v !== 1 || chunk.type !== "workspace-chunk" || !validId(chunk.roomId) || !validId(chunk.from) || !validId(chunk.transferId)
        || !Number.isInteger(chunk.index) || !Number.isInteger(chunk.total) || chunk.index < 0 || chunk.total < 1 || chunk.total > MAX_CHUNKS || chunk.index >= chunk.total
        || typeof chunk.payload !== "string" || chunk.payload.length > CHUNK_SIZE || chunk.roomId !== this.roomId) return;
      for (const [otherPeer, channel] of this.channels) if (otherPeer !== peer && channel.readyState === "open") channel.send(raw);
      const key = `${peer}:${chunk.transferId}`;
      const transfer = this.chunks.get(key) ?? { parts: Array<string>(chunk.total), total: chunk.total, bytes: 0, from: chunk.from };
      if (transfer.total !== chunk.total) { this.chunks.delete(key); return; }
      if (!transfer.parts[chunk.index]) { transfer.parts[chunk.index] = chunk.payload; transfer.bytes += new TextEncoder().encode(chunk.payload).length; }
      if (transfer.bytes > WORKSPACE_MAX_BYTES) { this.chunks.delete(key); return; }
      this.chunks.set(key, transfer);
      if (transfer.parts.filter((part) => typeof part === "string").length !== transfer.total) return;
      this.chunks.delete(key);
      const value = JSON.parse(transfer.parts.join("")) as unknown;
      if (!validateWorkspaceDocument(value)) return;
      this.onWorkspace?.(value, transfer.from);
    } catch { /* malformed peer data is ignored */ }
  }

  close() {
    this.channels.forEach((channel) => channel.close());
    this.connections.forEach((connection) => connection.close());
    this.channels.clear(); this.connections.clear(); this.offers.clear(); this.chunks.clear();
    this.onStatus?.("closed", 0);
  }
}
