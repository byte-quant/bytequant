import Link from "next/link";
import { absoluteUrl, languageTag, organizationId, pathFor, type Locale } from "../lib/site";
import { CommunityComposer } from "./CommunityComposer";
import { CommunityFeed } from "./CommunityFeed";
import { CommunityNetwork } from "./CommunityNetwork";
import { CommunityP2PChat } from "./CommunityP2PChat";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

const copy = {
  tr: {
    eyebrow: "AÇIK NOSTR TOPLULUĞU", title: "Global akışı okuyun, kendi anahtarınızla güvenle katılın", intro: "Hesap açmadan global akışı okuyun. Paylaşmak istediğinizde cihazınızda şifrelenen taşınabilir bir Nostr profili oluşturun; gönderileri imzalayın, yanıtlayın ve kaydedin.",
    jump: ["Akışı keşfet", "Yeni gönderi", "Canlı oturum"], compose: "Yeni bir gönderi hazırlayın", composeHelp: "Bir şablon seçin, hedef kitlenizi belirleyin ve cihaz içi güvenlik kontrolünden sonra panonuza ekleyin.",
    live: "Aynı anda çevrimiçi biriyle doğrudan konuşun", liveHelp: "İsteğe bağlı P2P oturumu yalnızca iki açık tarayıcı arasında çalışır; oda içeriği bir sunucuda tutulmaz.",
    startersTitle: "İlk paylaşımınız için hazır fikirler", starters: [["KVKK veri temizleme", "CSV → hassas alanları maskele → JSON olarak indir", "mask"], ["Prompt güçlendirme", "Hedefi yapılandır → örnek ekle → tutarlılığı denetle", "agent"], ["JSON teslim kontrolü", "Biçimlendir → şemayla doğrula → sürümleri karşılaştır", "workstation"]], open: "Akışı aç",
    boundaryTitle: "Nostr hakkında açık sınırlar", boundary: "ByteQuant bir relay veya ortak hesap veritabanı işletmez. Global akış bağımsız Nostr relay’lerinden gelir; sayaçlar yalnızca yüklenen ve imzası doğrulanan olayları gösterir. Silme işlemi imzalı bir istek yayınlar, ancak her relay’in eski kopyayı kaldıracağı garanti edilemez.", repo: "Açık kaynak kodunu incele",
    steps: [["1", "Akış bağlantısını onaylayın", "Seçili relay işletmecilerinin IP adresinizi görebileceğini okuyun ve global akışı tek tıkla bağlayın."], ["2", "Taşınabilir profilinizi oluşturun", "Özel anahtar cihaz parolanızla AES-GCM kullanılarak şifrelenir; ByteQuant’a gönderilmez."], ["3", "Güvenle paylaşın ve etkileşin", "Yerel güvenlik kontrolünden geçen gönderiyi imzalayın; yanıt, beğeni, düzenleme ve silme isteklerini Nostr üzerinden yayınlayın."]],
  },
  en: {
    eyebrow: "OPEN NOSTR COMMUNITY", title: "Read the global feed and join safely with keys you control", intro: "Read the global feed without creating an account. When you want to contribute, create a portable Nostr profile encrypted on your device, sign posts, reply, and save useful ideas.",
    jump: ["Explore the feed", "New post", "Live session"], compose: "Prepare a new post", composeHelp: "Pick a starter, choose the audience, and add the post to your board after an on-device safety check.",
    live: "Talk directly with someone who is online now", liveHelp: "The optional P2P session works only between two open browsers; room content is not stored on a server.",
    startersTitle: "Ready ideas for your first post", starters: [["Privacy-cleaning flow", "CSV → mask sensitive fields → export JSON", "mask"], ["Prompt improvement", "Structure goal → add examples → check consistency", "agent"], ["JSON delivery check", "Format → validate against a schema → compare versions", "workstation"]], open: "Open flow",
    boundaryTitle: "Clear Nostr boundaries", boundary: "ByteQuant operates no relay or shared account database. The global feed comes from independent Nostr relays, and counts cover only loaded, signature-verified events. Delete publishes a signed request; no client can guarantee every relay removes an older copy.", repo: "Review the open-source code",
    steps: [["1", "Approve the feed connection", "Read that selected relay operators can see your IP address, then connect the global feed with one action."], ["2", "Create your portable profile", "Your private key is encrypted with AES-GCM using the device passphrase and is never sent to ByteQuant."], ["3", "Post and interact safely", "Sign a locally screened post, then publish replies, reactions, revisions, and deletion requests through Nostr."]],
  },
  de: {
    eyebrow: "OFFENE NOSTR-COMMUNITY", title: "Globalen Feed lesen und sicher mit eigenen Schlüsseln teilnehmen", intro: "Den globalen Feed ohne Konto lesen. Für Beiträge ein portables, auf dem Gerät verschlüsseltes Nostr-Profil erstellen, Beiträge signieren, antworten und Nützliches speichern.",
    jump: ["Feed entdecken", "Neuer Beitrag", "Live-Sitzung"], compose: "Neuen Beitrag vorbereiten", composeHelp: "Vorlage und Zielgruppe wählen und den Beitrag nach lokaler Sicherheitsprüfung zum Board hinzufügen.",
    live: "Direkt mit einer gleichzeitig aktiven Person sprechen", liveHelp: "Die optionale P2P-Sitzung funktioniert nur zwischen zwei geöffneten Browsern; Rauminhalte werden nicht auf einem Server gespeichert.",
    startersTitle: "Fertige Ideen für den ersten Beitrag", starters: [["Datenschutz-Ablauf", "CSV → sensible Felder maskieren → JSON exportieren", "mask"], ["Prompt verbessern", "Ziel strukturieren → Beispiele ergänzen → Konsistenz prüfen", "agent"], ["JSON-Lieferprüfung", "Formatieren → Schema prüfen → Versionen vergleichen", "workstation"]], open: "Ablauf öffnen",
    boundaryTitle: "Klare Nostr-Grenzen", boundary: "ByteQuant betreibt weder Relay noch gemeinsame Kontodatenbank. Der globale Feed kommt von unabhängigen Nostr-Relays; Zähler umfassen nur geladene, signaturgeprüfte Ereignisse. Löschen veröffentlicht eine signierte Anforderung, kann aber nicht garantieren, dass jedes Relay ältere Kopien entfernt.", repo: "Open-Source-Code ansehen",
    steps: [["1", "Feed-Verbindung bestätigen", "Hinweis zur für Relay-Betreiber sichtbaren IP-Adresse lesen und den globalen Feed bewusst verbinden."], ["2", "Portables Profil erstellen", "Der private Schlüssel wird per AES-GCM mit der Geräte-Passphrase verschlüsselt und nie an ByteQuant gesendet."], ["3", "Sicher veröffentlichen", "Lokal geprüfte Beiträge signieren und Antworten, Reaktionen, Revisionen sowie Löschanforderungen über Nostr senden."]],
  },
  zh: {
    eyebrow: "开放 NOSTR 社区", title: "阅读全球动态，并使用自己掌控的密钥安全参与", intro: "无需账号即可阅读全球动态。需要参与时，可创建仅在设备上加密的便携 Nostr 资料，用它签名发帖、回复并收藏有用内容。",
    jump: ["浏览动态", "新建帖子", "实时会话"], compose: "准备新帖子", composeHelp: "选择模板和受众，通过设备端安全检查后添加到看板。",
    live: "与当前在线的人直接交流", liveHelp: "可选 P2P 会话仅在两个打开的浏览器之间工作；房间内容不会存储在服务器上。",
    startersTitle: "第一篇分享的现成思路", starters: [["隐私清理流程", "CSV → 遮盖敏感字段 → 导出 JSON", "mask"], ["增强提示词", "明确目标 → 添加示例 → 检查一致性", "agent"], ["JSON 交付检查", "格式化 → Schema 验证 → 比较版本", "workstation"]], open: "打开流程",
    boundaryTitle: "清晰的 Nostr 边界", boundary: "ByteQuant 不运营中继，也没有共享账号数据库。全球动态来自独立的 Nostr 中继，计数只涵盖已加载且签名验证通过的事件。删除操作会发布签名请求，但无法保证所有中继都移除旧副本。", repo: "查看开源代码",
    steps: [["1", "确认动态连接", "阅读所选中继运营者可看到 IP 地址的提示，再主动连接全球动态。"], ["2", "创建便携资料", "私钥使用设备密码通过 AES-GCM 加密，绝不会发送给 ByteQuant。"], ["3", "安全发布与互动", "签名发布通过本地检查的帖子，并通过 Nostr 发送回复、点赞、修订和删除请求。"]],
  },
} as const;

const networkHero = {
  tr: { eyebrow: "BYTEQUANT TOPLULUK", title: "Gerçek insanlardan iş akışları, fikirler ve sorular", intro: "Global akışı okuyun; isterseniz cihazınızda şifrelenen taşınabilir bir profil oluşturup paylaşın, yanıtlayın ve beğenin. Yerel arşiv ve doğrudan P2P seçenekleri ayrı, sade alanlarda kalır.", global: "Global akışı aç", local: "Cihaz arşivi", live: "Doğrudan görüşme", archiveTitle: "Cihazınızdaki özel pano", archiveBody: "Bağlantıya göndermek istemediğiniz taslakları, özel grupları ve taşınabilir paketleri yalnızca bu cihazda yönetin.", p2pTitle: "Tek kullanımlık P2P görüşme", p2pBody: "Belirli bir kişiyle eşzamanlı konuşmak için davet kodu kullanın. Bu alan global akıştan bağımsızdır." },
  en: { eyebrow: "BYTEQUANT COMMUNITY", title: "Workflows, ideas, and questions from real people", intro: "Read the global feed, then optionally create a portable profile encrypted on your device to post, reply, and react. The private archive and direct P2P tools remain in separate, calm spaces.", global: "Open global feed", local: "Device archive", live: "Direct session", archiveTitle: "Private board on this device", archiveBody: "Manage drafts, private groups, and portable packs that you do not want to send to a relay.", p2pTitle: "One-time P2P session", p2pBody: "Use an invitation code to talk synchronously with one specific person. This is independent from the global feed." },
  de: { eyebrow: "BYTEQUANT COMMUNITY", title: "Abläufe, Ideen und Fragen von echten Menschen", intro: "Globalen Feed lesen und optional ein lokal verschlüsseltes, portables Profil zum Veröffentlichen, Antworten und Reagieren erstellen. Privates Archiv und P2P bleiben getrennt und übersichtlich.", global: "Globalen Feed öffnen", local: "Gerätearchiv", live: "Direkte Sitzung", archiveTitle: "Privates Board auf diesem Gerät", archiveBody: "Entwürfe, private Gruppen und portable Pakete verwalten, die nicht an ein Relay gesendet werden sollen.", p2pTitle: "Einmalige P2P-Sitzung", p2pBody: "Per Einladungscode synchron mit einer bestimmten Person sprechen. Dieser Bereich ist vom globalen Feed getrennt." },
  zh: { eyebrow: "BYTEQUANT 社区", title: "来自真实用户的工作流、想法与问题", intro: "浏览全球动态；也可创建仅在设备上加密的便携资料，用于发布、回复与点赞。本地私密归档和直接 P2P 工具保持独立、清晰。", global: "打开全球动态", local: "设备归档", live: "直接会话", archiveTitle: "此设备上的私密看板", archiveBody: "管理不希望发送到中继的草稿、私密小组和便携内容包。", p2pTitle: "一次性 P2P 会话", p2pBody: "使用邀请码与指定用户实时交流。此功能与全球动态相互独立。" },
} as const;

export function CommunityPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const hero = networkHero[locale];
  const pageUrl = absoluteUrl(pathFor(locale, "community"));
  const schema = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: hero.title, description: hero.intro, url: pageUrl, inLanguage: languageTag(locale), isPartOf: { "@id": `${absoluteUrl(pathFor(locale, "home"))}#website` }, author: { "@id": organizationId } },
    { "@context": "https://schema.org", "@type": "HowTo", name: c.title, inLanguage: languageTag(locale), step: c.steps.map(([number, name, text], index) => ({ "@type": "HowToStep", position: index + 1, name: `${number} · ${name}`, text })) },
  ];
  return <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "community")} languageHrefs={{ tr: pathFor("tr", "community"), en: pathFor("en", "community"), de: pathFor("de", "community"), zh: pathFor("zh", "community") }}>
    <SchemaScript data={schema} />
    <section className="community-product-intro community-product-intro-compact"><div className="container"><div><span className="eyebrow"><i />{hero.eyebrow}</span><h1>{hero.title}</h1><p>{hero.intro}</p></div><nav aria-label={hero.title}><a className="primary-button" href="#global-community">{hero.global} ↓</a><a className="secondary-button" href="#community-local">{hero.local}</a><a className="secondary-button" href="#community-live">{hero.live}</a></nav></div></section>
    <section className="section community-network-section" id="global-community"><div className="container wide-container"><CommunityNetwork locale={locale} /></div></section>
    <section className="section community-secondary-tools"><div className="container">
      <details className="community-secondary-panel" id="community-local"><summary><span>▣</span><div><strong>{hero.archiveTitle}</strong><small>{hero.archiveBody}</small></div><b>+</b></summary><div className="community-secondary-panel-body"><CommunityComposer locale={locale} /><CommunityFeed locale={locale} /></div></details>
      <details className="community-secondary-panel" id="community-live"><summary><span>◉</span><div><strong>{hero.p2pTitle}</strong><small>{hero.p2pBody}</small></div><b>+</b></summary><div className="community-secondary-panel-body"><CommunityP2PChat locale={locale} /></div></details>
      <div className="community-boundary-inline"><div><strong>{c.boundaryTitle}</strong><p>{c.boundary}</p></div><Link href="https://github.com/byte-quant/bytequant" target="_blank" rel="noreferrer noopener">{c.repo} ↗</Link></div>
    </div></section>
  </SiteShell>;
}
