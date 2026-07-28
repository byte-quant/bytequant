"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Event as NostrEvent, SimplePool as SimplePoolType } from "nostr-tools";
import { reviewCommunityText } from "../lib/community-safety";
import type { Locale } from "../lib/site";

type SocialKind = "workflow" | "tip" | "question" | "idea";
type SocialContent = { v: 1; title: string; body: string; kind: SocialKind; group: string };
type Profile = { name: string; about: string; picture?: string };
type StoredIdentity = { v: 1; pubkey: string; salt: string; iv: string; cipher: string; name: string; about: string };
type NetworkState = "idle" | "connecting" | "connected" | "partial" | "error";

const identityKey = "bytequant:nostr-identity:v1";
const relayKey = "bytequant:nostr-relays:v1";
const blockedKey = "bytequant:nostr-blocked:v1";
const defaultRelays = ["wss://relay.damus.io", "wss://nos.lol"];
const localeTags: Record<Locale, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };

const copy = {
  tr: {
    eyebrow: "GLOBAL TOPLULUK", title: "Fikirler, iş akışları ve insanlar—tek bir akışta", intro: "Akışı hesap açmadan okuyun. Paylaşmak, yorum yapmak veya beğenmek için cihazınızda şifrelenen taşınabilir bir profil oluşturun.", connect: "Global akışa bağlan", connecting: "Relay’lere bağlanılıyor…", connected: "Global akış canlı", partial: "Bazı relay’ler çevrimdışı; akış kullanılabilir", error: "Şu anda relay bağlantısı kurulamadı", privacy: "Bağlandığınızda IP adresiniz seçili relay işletmecileri tarafından görülebilir. Gönderiler herkese açık ve kriptografik olarak imzalıdır.", refresh: "Yenile", compose: "Topluluğa yaz", composeHint: "Kısa bir başlık ve başkalarının uygulayabileceği bağlam ekleyin.", titleLabel: "Başlık", body: "Ne paylaşmak istiyorsunuz?", kind: "Tür", group: "Konu / grup", publish: "Yayımla", publishing: "Yayımlanıyor…", published: "Gönderi en az bir relay tarafından kabul edildi.", identity: "Profiliniz", create: "Güvenli profil oluştur", unlock: "Profilin kilidini aç", lock: "Kilitle", name: "Görünen ad", about: "Kısa tanıtım", pass: "Cihaz parolası", passHint: "En az 10 karakter. Parola veya özel anahtar ByteQuant’a gönderilmez.", identityReady: "Profil açık", identityLocked: "Bu cihazda kilitli bir profil var", npub: "Taşınabilir kimlik", feed: "Keşfet", latest: "En yeni", groups: "Gruplar", people: "İnsanlar", saved: "Kaydedilenler", all: "Tümü", search: "Akışta ara", empty: "Bu etikette henüz gönderi yok. İlk faydalı paylaşımı siz yapabilirsiniz.", editorial: "ByteQuant başlangıç", comment: "Yorum", commentPlaceholder: "Yapıcı bir yanıt yazın", sendComment: "Yanıtla", like: "Beğen", repost: "Yeniden paylaş", share: "Bağlantıyı paylaş", block: "Kullanıcıyı gizle", blocked: "Gizlenen hesap", moderation: "Yerel moderasyon", moderationBody: "İmzalar sahteciliği azaltır; içeriğin doğru veya güvenli olduğunu kanıtlamaz. Kötüye kullanım filtresi ve gizlenen hesap listesi yalnızca bu cihazda uygulanır.", relaySettings: "Bağlantı ayarları", relayHelp: "Her satıra bir wss:// relay adresi yazın. ByteQuant relay işletmez; erişilebilirlik, saklama ve moderasyon politikaları relay’e aittir.", saveRelays: "Ayarı kaydet", status: "Durum", comments: "yanıt", likes: "beğeni", kinds: { workflow: "İş akışı", tip: "İpucu", question: "Soru", idea: "Fikir" }, unsafe: "İçerik güvenlik kontrolünden geçmedi. Kişisel veri, sır, spam veya uygunsuz dil bulunabilir.", identityError: "Profil açılamadı. Parolayı ve tarayıcı depolama iznini kontrol edin.", relayDisclosure: "Açık Nostr protokolü · Ücretsiz relay seçimi · ByteQuant hesabı yok", noIdentity: "Etkileşim için önce profilinizi oluşturun veya açın.", liveProfiles: "Akıştaki kişiler", activeGroups: "Aktif gruplar", copyId: "Kimliği kopyala", copied: "Kopyalandı", explain: "Nasıl çalışır?", explainBody: "Profil ve gönderiler Nostr biçiminde imzalanır; seçtiğiniz relay’ler bunları dağıtır. Özel anahtar yalnızca açık oturum belleğinde tutulur ve cihaz parolanızla AES-GCM kullanılarak şifrelenmiş halde saklanır. Relay bir ByteQuant sunucusu değildir.", localStarter: "Global bağlantı kurulana kadar örnek akış", resetIdentity: "Bu cihazdaki profili sil", resetConfirm: "Şifreli profil bu cihazdan silinsin mi? Yedek yoksa kimlik geri alınamaz.",
  },
  en: {
    eyebrow: "GLOBAL COMMUNITY", title: "Ideas, workflows, and people in one feed", intro: "Read without creating an account. Create a portable profile encrypted on your device to post, reply, or react.", connect: "Connect global feed", connecting: "Connecting to relays…", connected: "Global feed is live", partial: "Some relays are offline; the feed remains usable", error: "No relay connection is available right now", privacy: "When you connect, selected relay operators can see your IP address. Posts are public and cryptographically signed.", refresh: "Refresh", compose: "Write to the community", composeHint: "Add a clear title and context someone else can act on.", titleLabel: "Title", body: "What would you like to share?", kind: "Type", group: "Topic / group", publish: "Publish", publishing: "Publishing…", published: "At least one relay accepted the post.", identity: "Your profile", create: "Create secure profile", unlock: "Unlock profile", lock: "Lock", name: "Display name", about: "Short bio", pass: "Device passphrase", passHint: "At least 10 characters. Your passphrase and private key are never sent to ByteQuant.", identityReady: "Profile unlocked", identityLocked: "A locked profile exists on this device", npub: "Portable identity", feed: "Explore", latest: "Latest", groups: "Groups", people: "People", saved: "Saved", all: "All", search: "Search the feed", empty: "No posts are available under this tag yet. You can make the first useful contribution.", editorial: "ByteQuant starter", comment: "Reply", commentPlaceholder: "Write a constructive reply", sendComment: "Reply", like: "Like", repost: "Repost", share: "Share link", block: "Hide user", blocked: "Hidden account", moderation: "Local moderation", moderationBody: "Signatures reduce impersonation; they do not prove that content is true or safe. Abuse filtering and hidden accounts apply only on this device.", relaySettings: "Connection settings", relayHelp: "Enter one wss:// relay per line. ByteQuant operates no relay; availability, retention, and moderation belong to each relay operator.", saveRelays: "Save settings", status: "Status", comments: "replies", likes: "likes", kinds: { workflow: "Workflow", tip: "Tip", question: "Question", idea: "Idea" }, unsafe: "The content did not pass the safety check. It may contain personal data, a secret, spam, or abusive language.", identityError: "The profile could not be opened. Check the passphrase and browser storage permission.", relayDisclosure: "Open Nostr protocol · Free relay choice · No ByteQuant account", noIdentity: "Create or unlock your profile before interacting.", liveProfiles: "People in this feed", activeGroups: "Active groups", copyId: "Copy identity", copied: "Copied", explain: "How does it work?", explainBody: "Profiles and posts are signed in Nostr format and distributed by the relays you select. Your private key stays only in active memory and is stored encrypted with AES-GCM using your device passphrase. A relay is not a ByteQuant server.", localStarter: "Starter feed until the global connection is active", resetIdentity: "Delete profile from this device", resetConfirm: "Delete the encrypted profile from this device? Without a backup, the identity cannot be recovered.",
  },
  de: {
    eyebrow: "GLOBALE COMMUNITY", title: "Ideen, Abläufe und Menschen in einem Feed", intro: "Ohne Konto lesen. Zum Veröffentlichen, Antworten und Reagieren ein portables, lokal verschlüsseltes Profil erstellen.", connect: "Globalen Feed verbinden", connecting: "Verbindung zu Relays…", connected: "Globaler Feed ist live", partial: "Einige Relays sind offline; der Feed bleibt nutzbar", error: "Derzeit ist kein Relay erreichbar", privacy: "Beim Verbinden können Relay-Betreiber Ihre IP-Adresse sehen. Beiträge sind öffentlich und kryptografisch signiert.", refresh: "Aktualisieren", compose: "Community-Beitrag", composeHint: "Klare Überschrift und anwendbaren Kontext ergänzen.", titleLabel: "Überschrift", body: "Was möchten Sie teilen?", kind: "Typ", group: "Thema / Gruppe", publish: "Veröffentlichen", publishing: "Wird veröffentlicht…", published: "Mindestens ein Relay hat den Beitrag angenommen.", identity: "Ihr Profil", create: "Sicheres Profil erstellen", unlock: "Profil entsperren", lock: "Sperren", name: "Anzeigename", about: "Kurzprofil", pass: "Geräte-Passphrase", passHint: "Mindestens 10 Zeichen. Passphrase und privater Schlüssel verlassen das Gerät nicht.", identityReady: "Profil entsperrt", identityLocked: "Auf diesem Gerät liegt ein gesperrtes Profil", npub: "Portable Identität", feed: "Entdecken", latest: "Neueste", groups: "Gruppen", people: "Personen", saved: "Gespeichert", all: "Alle", search: "Feed durchsuchen", empty: "Unter diesem Tag gibt es noch keinen Beitrag. Veröffentlichen Sie den ersten hilfreichen Beitrag.", editorial: "ByteQuant-Start", comment: "Antwort", commentPlaceholder: "Konstruktiv antworten", sendComment: "Antworten", like: "Gefällt mir", repost: "Erneut teilen", share: "Link teilen", block: "Nutzer ausblenden", blocked: "Ausgeblendetes Konto", moderation: "Lokale Moderation", moderationBody: "Signaturen erschweren Identitätsmissbrauch, beweisen aber weder Wahrheit noch Sicherheit. Filter und ausgeblendete Konten gelten nur auf diesem Gerät.", relaySettings: "Verbindungseinstellungen", relayHelp: "Pro Zeile eine wss://-Relay-Adresse. ByteQuant betreibt kein Relay; Verfügbarkeit, Speicherung und Moderation liegen beim Betreiber.", saveRelays: "Einstellung speichern", status: "Status", comments: "Antworten", likes: "Likes", kinds: { workflow: "Ablauf", tip: "Tipp", question: "Frage", idea: "Idee" }, unsafe: "Inhalt hat die Sicherheitsprüfung nicht bestanden. Möglicherweise Personendaten, Geheimnisse, Spam oder beleidigende Sprache.", identityError: "Profil konnte nicht geöffnet werden. Passphrase und Browser-Speicherberechtigung prüfen.", relayDisclosure: "Offenes Nostr-Protokoll · freie Relay-Wahl · kein ByteQuant-Konto", noIdentity: "Zum Interagieren Profil erstellen oder entsperren.", liveProfiles: "Personen im Feed", activeGroups: "Aktive Gruppen", copyId: "Identität kopieren", copied: "Kopiert", explain: "Wie funktioniert es?", explainBody: "Profile und Beiträge werden im Nostr-Format signiert und über gewählte Relays verteilt. Der private Schlüssel bleibt im Arbeitsspeicher und wird per AES-GCM mit der Geräte-Passphrase verschlüsselt gespeichert. Ein Relay ist kein ByteQuant-Server.", localStarter: "Start-Feed bis zur globalen Verbindung", resetIdentity: "Profil von diesem Gerät löschen", resetConfirm: "Verschlüsseltes Profil löschen? Ohne Sicherung kann die Identität nicht wiederhergestellt werden.",
  },
  zh: {
    eyebrow: "全球社区", title: "在同一动态中连接想法、流程与人", intro: "无需账号即可阅读。若要发布、回复或点赞，可创建仅在设备上加密的便携身份。", connect: "连接全球动态", connecting: "正在连接中继…", connected: "全球动态已连接", partial: "部分中继离线；动态仍可使用", error: "目前无法连接中继", privacy: "连接后，所选中继运营者可能看到您的 IP 地址。帖子公开并带有加密签名。", refresh: "刷新", compose: "发布到社区", composeHint: "添加清晰标题和他人可执行的背景信息。", titleLabel: "标题", body: "想分享什么？", kind: "类型", group: "主题 / 小组", publish: "发布", publishing: "正在发布…", published: "至少一个中继已接受帖子。", identity: "您的资料", create: "创建安全资料", unlock: "解锁资料", lock: "锁定", name: "显示名称", about: "简介", pass: "设备密码", passHint: "至少 10 个字符。密码和私钥不会发送给 ByteQuant。", identityReady: "资料已解锁", identityLocked: "此设备上有一个已锁定资料", npub: "便携身份", feed: "发现", latest: "最新", groups: "小组", people: "用户", saved: "已收藏", all: "全部", search: "搜索动态", empty: "此标签下暂无帖子。您可以发布第一条有用内容。", editorial: "ByteQuant 示例", comment: "评论", commentPlaceholder: "写下建设性回复", sendComment: "回复", like: "点赞", repost: "转发", share: "分享链接", block: "隐藏用户", blocked: "已隐藏账户", moderation: "本地审核", moderationBody: "签名可减少冒充，但不能证明内容真实或安全。滥用过滤和隐藏列表只在本设备生效。", relaySettings: "连接设置", relayHelp: "每行填写一个 wss:// 中继。ByteQuant 不运营中继；可用性、保留与审核政策由中继运营者决定。", saveRelays: "保存设置", status: "状态", comments: "条回复", likes: "次点赞", kinds: { workflow: "工作流", tip: "技巧", question: "问题", idea: "想法" }, unsafe: "内容未通过安全检查，可能包含个人数据、机密、垃圾内容或不当语言。", identityError: "无法打开资料。请检查密码与浏览器存储权限。", relayDisclosure: "开放 Nostr 协议 · 自由选择免费中继 · 无 ByteQuant 账号", noIdentity: "互动前请创建或解锁资料。", liveProfiles: "动态中的用户", activeGroups: "活跃小组", copyId: "复制身份", copied: "已复制", explain: "如何工作？", explainBody: "资料与帖子按 Nostr 格式签名，并由您选择的中继分发。私钥仅保留在当前内存中，并使用设备密码通过 AES-GCM 加密存储。中继不是 ByteQuant 服务器。", localStarter: "全球连接建立前的示例动态", resetIdentity: "从此设备删除资料", resetConfirm: "要从此设备删除加密资料吗？若无备份，该身份无法恢复。",
  },
} as const;

const starters: Record<Locale, Array<SocialContent & { id: string; author: string }>> = {
  tr: [
    { id: "starter-1", v: 1, title: "KVKK paylaşımı öncesi üç adımlı kontrol", body: "Sentetik örnekle başlayın, maskeleme sonrasında önce/sonra farkını inceleyin ve yalnızca gerekli alanları dışa aktarın.", kind: "workflow", group: "Gizlilik", author: "ByteQuant" },
    { id: "starter-2", v: 1, title: "JSON tesliminde sessiz hataları azaltın", body: "Biçimlendirmeden sonra şema kontrolü yapın; sürüm değiştiyse yapısal diff ile eklenen ve silinen alanları ayrıca inceleyin.", kind: "tip", group: "Veri", author: "ByteQuant" },
  ],
  en: [
    { id: "starter-1", v: 1, title: "A three-step check before privacy-sensitive sharing", body: "Start with synthetic data, inspect the before/after diff after masking, and export only the fields the recipient needs.", kind: "workflow", group: "Privacy", author: "ByteQuant" },
    { id: "starter-2", v: 1, title: "Reduce silent failures in JSON delivery", body: "Validate against a schema after formatting, then use a structural diff to review added and removed fields when versions change.", kind: "tip", group: "Data", author: "ByteQuant" },
  ],
  de: [
    { id: "starter-1", v: 1, title: "Drei Prüfungen vor datenschutzrelevanter Freigabe", body: "Mit synthetischen Daten beginnen, den Vorher/Nachher-Vergleich nach der Maskierung prüfen und nur notwendige Felder exportieren.", kind: "workflow", group: "Datenschutz", author: "ByteQuant" },
    { id: "starter-2", v: 1, title: "Stille Fehler bei JSON-Ausgaben reduzieren", body: "Nach dem Formatieren per Schema prüfen und bei Versionswechseln hinzugefügte sowie entfernte Felder strukturell vergleichen.", kind: "tip", group: "Daten", author: "ByteQuant" },
  ],
  zh: [
    { id: "starter-1", v: 1, title: "隐私数据分享前的三步检查", body: "先使用合成数据，脱敏后查看前后差异，只导出接收方真正需要的字段。", kind: "workflow", group: "隐私", author: "ByteQuant" },
    { id: "starter-2", v: 1, title: "减少 JSON 交付中的静默错误", body: "格式化后进行 Schema 验证；版本变化时用结构化差异检查新增与删除字段。", kind: "tip", group: "数据", author: "ByteQuant" },
  ],
};

function clean(value: string, max: number) { return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, max); }
function bytesToBase64(value: Uint8Array) { let binary = ""; value.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); }
function base64ToBytes(value: string) { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }
function tagValue(event: NostrEvent, name: string) { return event.tags.find((tag) => tag[0] === name)?.[1] ?? ""; }
function parsePost(event: NostrEvent): SocialContent | null {
  try {
    const value = JSON.parse(event.content) as Partial<SocialContent>;
    if (value.v !== 1 || !["workflow", "tip", "question", "idea"].includes(value.kind ?? "") || typeof value.title !== "string" || typeof value.body !== "string") return null;
    const result: SocialContent = { v: 1, title: clean(value.title, 120), body: clean(value.body, 3000), kind: value.kind as SocialKind, group: clean(value.group ?? "", 40) };
    return result.title.length >= 3 && result.body.length >= 10 && reviewCommunityText(`${result.title}\n${result.body}`).length === 0 ? result : null;
  } catch { return null; }
}
function parseProfile(event: NostrEvent): Profile | null { try { const value = JSON.parse(event.content) as Record<string, unknown>; const name = clean(String(value.display_name ?? value.name ?? ""), 40); const about = clean(String(value.about ?? ""), 180); return name ? { name, about } : null; } catch { return null; } }
function validRelays(value: string) { return [...new Set(value.split(/\s+/).map((item) => item.trim()).filter((item) => { try { const url = new URL(item); return url.protocol === "wss:" && !url.username && !url.password; } catch { return false; } }))].slice(0, 5); }

async function keyFromPassphrase(passphrase: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", iterations: 210_000, salt: salt as BufferSource }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
async function encryptSecret(secret: Uint8Array, passphrase: string, profile: { name: string; about: string }, pubkey: string): Promise<StoredIdentity> {
  const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12)); const key = await keyFromPassphrase(passphrase, salt);
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, secret as BufferSource));
  return { v: 1, pubkey, salt: bytesToBase64(salt), iv: bytesToBase64(iv), cipher: bytesToBase64(cipher), name: profile.name, about: profile.about };
}
async function decryptSecret(identity: StoredIdentity, passphrase: string) {
  const salt = base64ToBytes(identity.salt); const iv = base64ToBytes(identity.iv); const key = await keyFromPassphrase(passphrase, salt);
  return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, base64ToBytes(identity.cipher) as BufferSource));
}

export function CommunityNetwork({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [network, setNetwork] = useState<NetworkState>("idle");
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [interactions, setInteractions] = useState<NostrEvent[]>([]);
  const [relays, setRelays] = useState(defaultRelays);
  const [relayDraft, setRelayDraft] = useState(defaultRelays.join("\n"));
  const [identity, setIdentity] = useState<StoredIdentity | null>(null);
  const [secret, setSecret] = useState<Uint8Array | null>(null);
  const [profileDraft, setProfileDraft] = useState({ name: "", about: "", passphrase: "" });
  const [composer, setComposer] = useState({ title: "", body: "", kind: "workflow" as SocialKind, group: "ByteQuant" });
  const [reply, setReply] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [blocked, setBlocked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const poolRef = useRef<SimplePoolType | null>(null);
  const subscriptionRef = useRef<{ close(reason?: string): void } | null>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(identityKey) ?? "null") as StoredIdentity | null;
        if (stored?.v === 1 && /^[0-9a-f]{64}$/i.test(stored.pubkey)) { setIdentity(stored); setProfileDraft((current) => ({ ...current, name: stored.name, about: stored.about })); }
        const relayList = validRelays(JSON.parse(localStorage.getItem(relayKey) ?? "[]").join("\n")); if (relayList.length) { setRelays(relayList); setRelayDraft(relayList.join("\n")); }
        const hidden = JSON.parse(localStorage.getItem(blockedKey) ?? "[]"); if (Array.isArray(hidden)) setBlocked(hidden.filter((item): item is string => typeof item === "string" && /^[0-9a-f]{64}$/i.test(item)).slice(-100));
        const kept = JSON.parse(localStorage.getItem("bytequant:nostr-saved:v1") ?? "[]"); if (Array.isArray(kept)) setSaved(kept.filter((item): item is string => typeof item === "string").slice(-200));
      } catch { /* optional local preferences */ }
    }, 0);
    return () => { window.clearTimeout(restore); subscriptionRef.current?.close("component-unmount"); poolRef.current?.destroy(); };
  }, []);

  async function connect() {
    if (network === "connecting") return;
    setNetwork("connecting"); setStatus("");
    try {
      const { SimplePool } = await import("nostr-tools/pool");
      poolRef.current?.destroy();
      const pool = new SimplePool({ enableReconnect: true }); poolRef.current = pool;
      const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 45;
      const initial = await pool.querySync(relays, { kinds: [1], "#t": ["bytequant"], since, limit: 100 }, { maxWait: 6500 });
      const accepted = initial.filter((event) => parsePost(event) && !blocked.includes(event.pubkey));
      setEvents(accepted.sort((a, b) => b.created_at - a.created_at));
      subscriptionRef.current?.close("refresh");
      subscriptionRef.current = pool.subscribeMany(relays, { kinds: [1], "#t": ["bytequant"], since, limit: 100 }, { onevent: (event) => { if (!parsePost(event) || blocked.includes(event.pubkey)) return; setEvents((current) => [event, ...current.filter((item) => item.id !== event.id)].sort((a, b) => b.created_at - a.created_at).slice(0, 120)); }, maxWait: 6500 });
      const authors = [...new Set(accepted.map((event) => event.pubkey))].slice(0, 80);
      if (authors.length) {
        const profileEvents = await pool.querySync(relays, { kinds: [0], authors, limit: authors.length * 2 }, { maxWait: 5000 });
        const latest = new Map<string, NostrEvent>(); profileEvents.forEach((event) => { if ((latest.get(event.pubkey)?.created_at ?? 0) < event.created_at) latest.set(event.pubkey, event); });
        setProfiles(Object.fromEntries([...latest].flatMap(([pubkey, event]) => { const profile = parseProfile(event); return profile ? [[pubkey, profile]] : []; })));
        const ids = accepted.map((event) => event.id).slice(0, 80);
        if (ids.length) setInteractions(await pool.querySync(relays, { kinds: [1, 6, 7], "#e": ids, since, limit: 300 }, { maxWait: 5000 }));
      }
      const statuses = [...pool.listConnectionStatus().values()];
      setNetwork(statuses.some(Boolean) ? statuses.every(Boolean) ? "connected" : "partial" : accepted.length ? "partial" : "error");
    } catch { setNetwork("error"); }
  }

  async function publishEvent(kind: number, content: string, tags: string[][]) {
    if (!secret || !poolRef.current || network === "idle" || network === "error") { setStatus(t.noIdentity); return null; }
    const { finalizeEvent } = await import("nostr-tools/pure");
    const event = finalizeEvent({ kind, created_at: Math.floor(Date.now() / 1000), content, tags }, secret);
    const results = await Promise.allSettled(poolRef.current.publish(relays, event, { maxWait: 6500 }));
    if (!results.some((result) => result.status === "fulfilled")) throw new Error("relay-rejected");
    return event;
  }

  async function updateProfile() {
    if (!secret || !identity) return;
    const profile = { name: clean(profileDraft.name, 40), about: clean(profileDraft.about, 180) };
    if (profile.name.length < 2 || reviewCommunityText(`${profile.name}\n${profile.about}`).length) { setStatus(t.unsafe); return; }
    setBusy(true); setStatus("");
    try {
      await publishEvent(0, JSON.stringify({ name: profile.name, display_name: profile.name, about: profile.about }), []);
      const nextIdentity = { ...identity, name: profile.name, about: profile.about };
      setIdentity(nextIdentity); localStorage.setItem(identityKey, JSON.stringify(nextIdentity));
      setProfiles((current) => ({ ...current, [identity.pubkey]: profile })); setStatus(t.published);
    } catch { setStatus(t.error); } finally { setBusy(false); }
  }

  async function createIdentity() {
    if (profileDraft.name.trim().length < 2 || profileDraft.passphrase.length < 10) { setStatus(t.identityError); return; }
    setBusy(true); setStatus("");
    try {
      const { generateSecretKey, getPublicKey } = await import("nostr-tools/pure");
      const nextSecret = generateSecretKey(); const pubkey = getPublicKey(nextSecret);
      const stored = await encryptSecret(nextSecret, profileDraft.passphrase, { name: clean(profileDraft.name, 40), about: clean(profileDraft.about, 180) }, pubkey);
      localStorage.setItem(identityKey, JSON.stringify(stored)); setIdentity(stored); setSecret(nextSecret); setProfileDraft((current) => ({ ...current, passphrase: "" }));
      if (poolRef.current && network !== "idle" && network !== "error") {
        const { finalizeEvent } = await import("nostr-tools/pure");
        const event = finalizeEvent({ kind: 0, created_at: Math.floor(Date.now() / 1000), content: JSON.stringify({ name: stored.name, display_name: stored.name, about: stored.about }), tags: [] }, nextSecret);
        await Promise.allSettled(poolRef.current.publish(relays, event, { maxWait: 6500 }));
      }
    } catch { setStatus(t.identityError); } finally { setBusy(false); }
  }

  async function unlockIdentity() {
    if (!identity || profileDraft.passphrase.length < 10) { setStatus(t.identityError); return; }
    setBusy(true); setStatus("");
    try {
      const nextSecret = await decryptSecret(identity, profileDraft.passphrase);
      const { getPublicKey } = await import("nostr-tools/pure"); if (getPublicKey(nextSecret) !== identity.pubkey) throw new Error("identity-mismatch");
      setSecret(nextSecret); setProfileDraft((current) => ({ ...current, passphrase: "" }));
    } catch { setStatus(t.identityError); } finally { setBusy(false); }
  }

  async function publishPost() {
    const content: SocialContent = { v: 1, title: clean(composer.title, 120), body: clean(composer.body, 3000), kind: composer.kind, group: clean(composer.group, 40) };
    if (!secret) { setStatus(t.noIdentity); return; }
    if (content.title.length < 3 || content.body.length < 10 || reviewCommunityText(`${content.title}\n${content.body}`).length) { setStatus(t.unsafe); return; }
    setBusy(true); setStatus("");
    try {
      const event = await publishEvent(1, JSON.stringify(content), [["t", "bytequant"], ["t", `bytequant-${content.kind}`], ["g", content.group.toLocaleLowerCase().replace(/[^a-z0-9\p{L}]+/gu, "-").slice(0, 40)], ["lang", locale], ["client", "ByteQuant"]]);
      if (event) { setEvents((current) => [event, ...current.filter((item) => item.id !== event.id)]); setComposer({ title: "", body: "", kind: "workflow", group: "ByteQuant" }); setStatus(t.published); }
    } catch { setStatus(t.error); } finally { setBusy(false); }
  }

  async function react(event: NostrEvent, kind: 1 | 6 | 7) {
    if (!secret) { setStatus(t.noIdentity); return; }
    setBusy(true); setStatus("");
    try {
      const content = kind === 7 ? "+" : kind === 6 ? JSON.stringify(event) : clean(reply[event.id] ?? "", 800);
      if (kind === 1 && (content.length < 3 || reviewCommunityText(content).length)) { setStatus(t.unsafe); return; }
      const next = await publishEvent(kind, content, [["e", event.id, "", "root"], ["p", event.pubkey], ["t", "bytequant"], ["client", "ByteQuant"]]);
      if (next) { setInteractions((current) => [next, ...current.filter((item) => item.id !== next.id)]); if (kind === 1) setReply((current) => ({ ...current, [event.id]: "" })); }
    } catch { setStatus(t.error); } finally { setBusy(false); }
  }

  const socialPosts = useMemo(() => events.flatMap((event) => { const content = parsePost(event); return content ? [{ event, content }] : []; }).filter(({ event, content }) => !blocked.includes(event.pubkey) && (!savedOnly || saved.includes(event.id)) && (!groupFilter || content.group === groupFilter) && `${content.title} ${content.body} ${content.group} ${profiles[event.pubkey]?.name ?? ""}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a, b) => b.event.created_at - a.event.created_at), [blocked, events, groupFilter, profiles, query, saved, savedOnly]);
  const groupCounts = useMemo(() => Object.entries(events.reduce<Record<string, number>>((result, event) => { const group = parsePost(event)?.group; if (group) result[group] = (result[group] ?? 0) + 1; return result; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 8), [events]);
  const authorCounts = useMemo(() => Object.entries(events.reduce<Record<string, number>>((result, event) => { result[event.pubkey] = (result[event.pubkey] ?? 0) + 1; return result; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6), [events]);

  function setHidden(pubkey: string) { const next = [...new Set([...blocked, pubkey])].slice(-100); setBlocked(next); localStorage.setItem(blockedKey, JSON.stringify(next)); }
  function toggleSaved(id: string) { const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id].slice(-200); setSaved(next); localStorage.setItem("bytequant:nostr-saved:v1", JSON.stringify(next)); }
  async function share(event: NostrEvent) { const { nip19 } = await import("nostr-tools"); const value = `nostr:${nip19.neventEncode({ id: event.id, author: event.pubkey, relays })}`; if (navigator.share) { try { await navigator.share({ title: "ByteQuant Community", url: value }); return; } catch { return; } } await navigator.clipboard.writeText(value); setStatus(t.copied); }

  const visiblePosts = socialPosts.length ? socialPosts : events.length || query || groupFilter || savedOnly ? [] : starters[locale].map((content) => ({ event: { id: content.id, pubkey: "bytequant", created_at: 0, kind: 1, tags: [], content: JSON.stringify(content), sig: "" } as NostrEvent, content }));
  const stateLabel = network === "connected" ? t.connected : network === "partial" ? t.partial : network === "connecting" ? t.connecting : network === "error" ? t.error : t.connect;

  return <section className="community-network" aria-labelledby="global-community-title">
    <header className="community-network-head"><div><span className="eyebrow"><i />{t.eyebrow}</span><h2 id="global-community-title">{t.title}</h2><p>{t.intro}</p></div><div className={`community-network-status status-${network}`}><span /><strong>{stateLabel}</strong><small>{t.relayDisclosure}</small>{network === "idle" || network === "error" ? <button className="primary-button" type="button" onClick={() => void connect()}>{t.connect} →</button> : <button type="button" onClick={() => void connect()}>{t.refresh}</button>}</div></header>
    <div className="community-network-disclosure"><span>ⓘ</span><p>{t.privacy}</p><details><summary>{t.explain}</summary><p>{t.explainBody}</p></details></div>

    <div className="community-social-layout">
      <aside className="community-social-left">
        <section className="community-identity-card"><header><span className="community-avatar">{(identity?.name || "BQ").slice(0, 2).toLocaleUpperCase()}</span><div><strong>{t.identity}</strong><small>{secret ? t.identityReady : identity ? t.identityLocked : t.create}</small></div></header>
          <label><span>{t.name}</span><input value={profileDraft.name} maxLength={40} disabled={Boolean(identity) && !secret} onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))} /></label>
          <label><span>{t.about}</span><textarea value={profileDraft.about} maxLength={180} rows={3} disabled={Boolean(identity) && !secret} onChange={(event) => setProfileDraft((current) => ({ ...current, about: event.target.value }))} /></label>
          {!secret && <label><span>{t.pass}</span><input type="password" value={profileDraft.passphrase} minLength={10} autoComplete="current-password" onChange={(event) => setProfileDraft((current) => ({ ...current, passphrase: event.target.value }))} /><small>{t.passHint}</small></label>}
          {!identity ? <button type="button" className="primary-button" disabled={busy} onClick={() => void createIdentity()}>{t.create}</button> : !secret ? <button type="button" className="primary-button" disabled={busy} onClick={() => void unlockIdentity()}>{t.unlock}</button> : <div className="community-profile-actions"><button type="button" className="primary-button" disabled={busy || network === "idle" || network === "error"} onClick={() => void updateProfile()}>{t.publish}</button><button type="button" onClick={() => { setSecret(null); setStatus(""); }}>{t.lock}</button></div>}
          {identity && <><div className="community-public-key"><small>{t.npub}</small><code>{identity.pubkey.slice(0, 12)}…{identity.pubkey.slice(-8)}</code><button type="button" onClick={async () => { const { nip19 } = await import("nostr-tools"); await navigator.clipboard.writeText(nip19.npubEncode(identity.pubkey)); setStatus(t.copied); }}>{t.copyId}</button></div><details className="community-danger-zone"><summary>{t.resetIdentity}</summary><button type="button" onClick={() => { if (!window.confirm(t.resetConfirm)) return; localStorage.removeItem(identityKey); setIdentity(null); setSecret(null); setProfileDraft({ name: "", about: "", passphrase: "" }); }}>{t.resetIdentity}</button></details></>}
        </section>
        <nav className="community-social-nav"><button type="button" className={!groupFilter && !savedOnly ? "active" : ""} onClick={() => { setGroupFilter(""); setSavedOnly(false); setQuery(""); }}>⌂ {t.feed}</button><button type="button" onClick={() => { setQuery(""); setSavedOnly(false); }}>◉ {t.latest}</button><button type="button" onClick={() => { setGroupFilter(groupCounts[0]?.[0] ?? ""); setSavedOnly(false); }}># {t.groups}</button><button type="button" onClick={() => { setQuery(identity?.name ?? ""); setSavedOnly(false); }}>◎ {t.people}</button><button type="button" className={savedOnly ? "active" : ""} onClick={() => { setSavedOnly(true); setGroupFilter(""); setQuery(""); }}>☆ {t.saved}</button></nav>
      </aside>

      <section className="community-social-main">
        <section className="community-global-composer"><header><span className="community-avatar">{(identity?.name || "BQ").slice(0, 2).toLocaleUpperCase()}</span><div><strong>{t.compose}</strong><small>{secret ? t.composeHint : t.noIdentity}</small></div></header><input aria-label={t.titleLabel} value={composer.title} maxLength={120} onChange={(event) => setComposer((current) => ({ ...current, title: event.target.value }))} placeholder={t.titleLabel} /><textarea aria-label={t.body} value={composer.body} maxLength={3000} rows={4} onChange={(event) => setComposer((current) => ({ ...current, body: event.target.value }))} placeholder={t.body} /><div className="community-composer-meta"><label><span>{t.kind}</span><select value={composer.kind} onChange={(event) => setComposer((current) => ({ ...current, kind: event.target.value as SocialKind }))}>{(Object.keys(t.kinds) as SocialKind[]).map((kind) => <option key={kind} value={kind}>{t.kinds[kind]}</option>)}</select></label><label><span>{t.group}</span><input value={composer.group} maxLength={40} onChange={(event) => setComposer((current) => ({ ...current, group: event.target.value }))} /></label><button type="button" className="primary-button" disabled={!secret || busy || network === "idle" || network === "error"} onClick={() => void publishPost()}>{busy ? t.publishing : t.publish} ↑</button></div></section>
        <div className="community-feed-toolbar"><label><span>⌕</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSavedOnly(false); }} placeholder={t.search} /></label><div><button type="button" className={!groupFilter && !savedOnly ? "active" : ""} onClick={() => { setGroupFilter(""); setSavedOnly(false); }}>{t.all}</button>{groupCounts.slice(0, 4).map(([group, count]) => <button type="button" className={groupFilter === group ? "active" : ""} onClick={() => { setGroupFilter(group); setSavedOnly(false); }} key={group}>#{group} · {count}</button>)}</div></div>
        {status && <p className="community-network-message" role="status">{status}</p>}
        {network !== "connected" && network !== "partial" && <small className="community-starter-label">{t.localStarter}</small>}
        <div className="community-global-feed">{visiblePosts.map(({ event, content }) => {
          const profile = profiles[event.pubkey] ?? { name: event.pubkey === "bytequant" ? "ByteQuant" : `${event.pubkey.slice(0, 8)}…`, about: "" };
          const postInteractions = interactions.filter((item) => tagValue(item, "e") === event.id);
          const comments = postInteractions.filter((item) => item.kind === 1 && clean(item.content, 800).length >= 3 && reviewCommunityText(item.content).length === 0);
          const likes = new Set(postInteractions.filter((item) => item.kind === 7 && item.content === "+").map((item) => item.pubkey)).size;
        return <article className="community-global-post" key={event.id}><header><span className="community-avatar">{profile.name.slice(0, 2).toLocaleUpperCase()}</span><div><strong>{profile.name}</strong><small>{event.created_at ? new Date(event.created_at * 1000).toLocaleString(localeTags[locale], { dateStyle: "medium", timeStyle: "short" }) : t.editorial}</small></div><button type="button" disabled={event.pubkey === "bytequant"} onClick={() => setHidden(event.pubkey)} aria-label={t.block}>•••</button></header><div className="community-post-meta"><span>{t.kinds[content.kind]}</span>{content.group && <button type="button" onClick={() => setGroupFilter(content.group)}>#{content.group}</button>}</div><h3>{content.title}</h3><p>{content.body}</p><footer><button type="button" disabled={!secret || event.pubkey === "bytequant"} onClick={() => void react(event, 7)}>♡ {t.like}{likes ? ` · ${likes}` : ""}</button><button type="button" disabled={event.pubkey === "bytequant"} onClick={() => setReply((current) => ({ ...current, [event.id]: current[event.id] ?? "" }))}>◌ {t.comment}{comments.length ? ` · ${comments.length}` : ""}</button><button type="button" disabled={!secret || event.pubkey === "bytequant"} onClick={() => void react(event, 6)}>↻ {t.repost}</button><button type="button" className={saved.includes(event.id) ? "active" : ""} onClick={() => toggleSaved(event.id)}>☆</button><button type="button" disabled={event.pubkey === "bytequant"} onClick={() => void share(event)}>↗ {t.share}</button></footer>{reply[event.id] !== undefined && <section className="community-global-comments">{comments.map((comment) => <p key={comment.id}><strong>{profiles[comment.pubkey]?.name ?? `${comment.pubkey.slice(0, 8)}…`}</strong>{clean(comment.content, 800)}</p>)}<div><textarea value={reply[event.id]} rows={2} maxLength={800} placeholder={t.commentPlaceholder} onChange={(change) => setReply((current) => ({ ...current, [event.id]: change.target.value }))} /><button type="button" disabled={!secret || !(reply[event.id] ?? "").trim()} onClick={() => void react(event, 1)}>{t.sendComment}</button></div></section>}</article>;
        })}{!visiblePosts.length && <div className="community-network-empty"><span>◎</span><p>{t.empty}</p></div>}</div>
      </section>

      <aside className="community-social-right">
        <section><header><span>#</span><strong>{t.activeGroups}</strong></header>{groupCounts.length ? groupCounts.map(([group, count]) => <button type="button" onClick={() => setGroupFilter(group)} key={group}><span>#{group}</span><small>{count}</small></button>) : <p>{t.empty}</p>}</section>
        <section><header><span>◎</span><strong>{t.liveProfiles}</strong></header>{authorCounts.length ? authorCounts.map(([pubkey, count]) => <button type="button" onClick={() => setQuery(profiles[pubkey]?.name ?? pubkey.slice(0, 8))} key={pubkey}><span className="community-avatar">{(profiles[pubkey]?.name ?? pubkey).slice(0, 2).toLocaleUpperCase()}</span><span>{profiles[pubkey]?.name ?? `${pubkey.slice(0, 8)}…`}<small>{count}</small></span></button>) : <p>{t.empty}</p>}</section>
        <section className="community-moderation-card"><header><span>◉</span><strong>{t.moderation}</strong></header><p>{t.moderationBody}</p><small>{blocked.length} · {t.blocked}</small></section>
        <details className="community-relay-settings"><summary>{t.relaySettings}<span>+</span></summary><p>{t.relayHelp}</p><textarea value={relayDraft} rows={4} onChange={(event) => setRelayDraft(event.target.value)} /><button type="button" onClick={() => { const next = validRelays(relayDraft); if (!next.length) { setStatus(t.error); return; } setRelays(next); localStorage.setItem(relayKey, JSON.stringify(next)); setNetwork("idle"); poolRef.current?.destroy(); }}>{t.saveRelays}</button></details>
      </aside>
    </div>
  </section>;
}
