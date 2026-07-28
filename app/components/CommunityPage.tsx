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
    eyebrow: "CİHAZINIZDA SOSYAL ÜRETİM", title: "Fikirleri ve güvenli iş akışlarını, hesap açmadan paylaşın", intro: "Bir profil oluşturun, gruplarınızı düzenleyin, gönderi yayınlayın, yorum yapın ve faydalı içerikleri kaydedin. Panonuz bu cihazda kalır; herkese açık içerikleri bağlantı veya doğrulanmış paketle taşırsınız.",
    jump: ["Akışı keşfet", "Yeni gönderi", "Canlı oturum"], compose: "Yeni bir gönderi hazırlayın", composeHelp: "Bir şablon seçin, hedef kitlenizi belirleyin ve cihaz içi güvenlik kontrolünden sonra panonuza ekleyin.",
    live: "Aynı anda çevrimiçi biriyle doğrudan konuşun", liveHelp: "İsteğe bağlı P2P oturumu yalnızca iki açık tarayıcı arasında çalışır; oda içeriği bir sunucuda tutulmaz.",
    startersTitle: "İlk paylaşımınız için hazır fikirler", starters: [["KVKK veri temizleme", "CSV → hassas alanları maskele → JSON olarak indir", "mask"], ["Prompt güçlendirme", "Hedefi yapılandır → örnek ekle → tutarlılığı denetle", "agent"], ["JSON teslim kontrolü", "Biçimlendir → şemayla doğrula → sürümleri karşılaştır", "workstation"]], open: "Akışı aç",
    boundaryTitle: "Dürüst ürün sınırı", boundary: "ByteQuant içerik sunucusu veya ortak hesap veritabanı çalıştırmaz. Bu nedenle küresel sayaç, çevrimdışı mesaj ve kalıcı takipçi ağı taklit edilmez. Gerçek yerel etkileşim, içerik taşıyan bağlantılar, doğrulanan paketler ve isteğe bağlı doğrudan P2P sunulur.", repo: "Açık kaynak kodunu incele",
    steps: [["1", "Profilinizi düzenleyin", "Görünen ad, kullanıcı adı ve açık/gizli profil seçimi yalnızca bu cihazda saklanır."], ["2", "Gönderiyi güvenle hazırlayın", "Yerel filtre kişisel veri, sır, spam ve uygunsuz dil sinyallerini önceden kontrol eder."], ["3", "Nasıl paylaşacağınızı seçin", "Cihaz panosu, bağlantı, paket veya doğrudan P2P seçeneklerinden uygun olanı kullanın."]],
  },
  en: {
    eyebrow: "SOCIAL MAKING ON YOUR DEVICE", title: "Share ideas and safer workflows without creating an account", intro: "Create a profile, organize groups, publish posts, comment, and save useful ideas. Your board stays on this device; public content moves through a link or validated pack.",
    jump: ["Explore the feed", "New post", "Live session"], compose: "Prepare a new post", composeHelp: "Pick a starter, choose the audience, and add the post to your board after an on-device safety check.",
    live: "Talk directly with someone who is online now", liveHelp: "The optional P2P session works only between two open browsers; room content is not stored on a server.",
    startersTitle: "Ready ideas for your first post", starters: [["Privacy-cleaning flow", "CSV → mask sensitive fields → export JSON", "mask"], ["Prompt improvement", "Structure goal → add examples → check consistency", "agent"], ["JSON delivery check", "Format → validate against a schema → compare versions", "workstation"]], open: "Open flow",
    boundaryTitle: "An honest product boundary", boundary: "ByteQuant runs no content server or shared account database. It therefore does not fake global counts, offline messages, or a persistent follower graph. It offers real local interaction, content-carrying links, validated packs, and optional direct P2P.", repo: "Review the open-source code",
    steps: [["1", "Set up your profile", "Display name, handle, and public/private choice stay only on this device."], ["2", "Prepare a safer post", "A local filter pre-checks personal-data, secret, spam, and abusive-language signals."], ["3", "Choose how to share", "Use the device board, a link, a pack, or direct P2P according to the audience."]],
  },
  de: {
    eyebrow: "SOZIALES ARBEITEN AUF DEM GERÄT", title: "Ideen und sichere Abläufe ohne Konto teilen", intro: "Profil anlegen, Gruppen organisieren, Beiträge veröffentlichen, kommentieren und Nützliches speichern. Das Board bleibt auf diesem Gerät; öffentliche Inhalte reisen per Link oder geprüftem Paket.",
    jump: ["Feed entdecken", "Neuer Beitrag", "Live-Sitzung"], compose: "Neuen Beitrag vorbereiten", composeHelp: "Vorlage und Zielgruppe wählen und den Beitrag nach lokaler Sicherheitsprüfung zum Board hinzufügen.",
    live: "Direkt mit einer gleichzeitig aktiven Person sprechen", liveHelp: "Die optionale P2P-Sitzung funktioniert nur zwischen zwei geöffneten Browsern; Rauminhalte werden nicht auf einem Server gespeichert.",
    startersTitle: "Fertige Ideen für den ersten Beitrag", starters: [["Datenschutz-Ablauf", "CSV → sensible Felder maskieren → JSON exportieren", "mask"], ["Prompt verbessern", "Ziel strukturieren → Beispiele ergänzen → Konsistenz prüfen", "agent"], ["JSON-Lieferprüfung", "Formatieren → Schema prüfen → Versionen vergleichen", "workstation"]], open: "Ablauf öffnen",
    boundaryTitle: "Eine ehrliche Produktgrenze", boundary: "ByteQuant betreibt keinen Inhaltsserver und keine gemeinsame Kontodatenbank. Globale Zähler, Offline-Nachrichten und dauerhafte Follower werden daher nicht vorgetäuscht. Verfügbar sind echte lokale Interaktion, Inhaltslinks, geprüfte Pakete und optionales direktes P2P.", repo: "Open-Source-Code ansehen",
    steps: [["1", "Profil einrichten", "Anzeigename, Kürzel und Sichtbarkeit bleiben ausschließlich auf diesem Gerät."], ["2", "Sicheren Beitrag vorbereiten", "Der lokale Filter prüft Signale für Personendaten, Geheimnisse, Spam und Missbrauch."], ["3", "Teilungsweg wählen", "Je nach Zielgruppe Geräte-Board, Link, Paket oder direktes P2P nutzen."]],
  },
  zh: {
    eyebrow: "设备端社交创作", title: "无需账号，也能分享想法和更安全的工作流", intro: "创建个人资料、整理群组、发布内容、评论并收藏有用想法。看板留在此设备；公开内容可通过链接或验证包传递。",
    jump: ["浏览动态", "新建帖子", "实时会话"], compose: "准备新帖子", composeHelp: "选择模板和受众，通过设备端安全检查后添加到看板。",
    live: "与当前在线的人直接交流", liveHelp: "可选 P2P 会话仅在两个打开的浏览器之间工作；房间内容不会存储在服务器上。",
    startersTitle: "第一篇分享的现成思路", starters: [["隐私清理流程", "CSV → 遮盖敏感字段 → 导出 JSON", "mask"], ["增强提示词", "明确目标 → 添加示例 → 检查一致性", "agent"], ["JSON 交付检查", "格式化 → Schema 验证 → 比较版本", "workstation"]], open: "打开流程",
    boundaryTitle: "诚实的产品边界", boundary: "ByteQuant 不运行内容服务器或共享账号数据库，因此不会伪造全球计数、离线消息或永久关注网络。它提供真实的本地互动、内容链接、验证包和可选的直接 P2P。", repo: "查看开源代码",
    steps: [["1", "设置资料", "显示名称、用户名和公开/私密选择仅保存在此设备。"], ["2", "安全准备帖子", "本地过滤器会预检个人数据、密钥、垃圾内容和不当语言信号。"], ["3", "选择分享方式", "按受众选择设备看板、链接、内容包或直接 P2P。"]],
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
