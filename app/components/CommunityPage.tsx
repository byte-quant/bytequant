import Link from "next/link";
import { absoluteUrl, languageTag, organizationId, pathFor, toolPath, type Locale } from "../lib/site";
import { CommunityComposer } from "./CommunityComposer";
import { CommunityFeed } from "./CommunityFeed";
import { CommunityP2PChat } from "./CommunityP2PChat";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

type StarterDestination = "mask" | "agent" | "workstation";

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

function starterHref(locale: Locale, destination: StarterDestination) {
  if (destination === "mask") return toolPath(locale, "kvkk-veri-maskeleyici");
  return pathFor(locale, destination);
}

export function CommunityPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const pageUrl = absoluteUrl(pathFor(locale, "community"));
  const schema = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.intro, url: pageUrl, inLanguage: languageTag(locale), isPartOf: { "@id": `${absoluteUrl(pathFor(locale, "home"))}#website` }, author: { "@id": organizationId } },
    { "@context": "https://schema.org", "@type": "HowTo", name: c.title, inLanguage: languageTag(locale), step: c.steps.map(([number, name, text], index) => ({ "@type": "HowToStep", position: index + 1, name: `${number} · ${name}`, text })) },
  ];
  return <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "community")} languageHrefs={{ tr: pathFor("tr", "community"), en: pathFor("en", "community"), de: pathFor("de", "community"), zh: pathFor("zh", "community") }}>
    <SchemaScript data={schema} />
    <section className="community-product-intro"><div className="container"><div><span className="eyebrow"><i />{c.eyebrow}</span><h1>{c.title}</h1><p>{c.intro}</p></div><nav aria-label={c.title}><a className="primary-button" href="#community-feed">{c.jump[0]} ↓</a><a className="secondary-button" href="#community-compose">{c.jump[1]} +</a><a className="secondary-button" href="#community-live">{c.jump[2]} →</a></nav><ol>{c.steps.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><small>{text}</small></div></li>)}</ol></div></section>
    <section className="section community-compose-section" id="community-compose"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">CREATE</span><h2>{c.compose}</h2></div><p>{c.composeHelp}</p></div><CommunityComposer locale={locale} /></div></section>
    <section className="section community-feed-section" id="community-feed"><div className="container"><CommunityFeed locale={locale} /></div></section>
    <section className="section community-starters"><div className="container"><div className="section-heading"><span className="kicker">STARTERS</span><h2>{c.startersTitle}</h2></div><div>{c.starters.map(([title, text, destination]) => <article key={title}><span aria-hidden="true">↗</span><h3>{title}</h3><p>{text}</p><Link className="text-link" href={starterHref(locale, destination)}>{c.open} →</Link></article>)}</div></div></section>
    <section className="section community-live-section" id="community-live"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">DIRECT P2P</span><h2>{c.live}</h2></div><p>{c.liveHelp}</p></div><details className="community-live-details"><summary><span>●</span><strong>{c.jump[2]}</strong><small>{c.liveHelp}</small><b>+</b></summary><CommunityP2PChat locale={locale} /></details></div></section>
    <section className="section community-boundary"><div className="container"><div><span className="kicker">TRUST & SAFETY</span><h2>{c.boundaryTitle}</h2><p>{c.boundary}</p></div><Link className="secondary-button" href="https://github.com/byte-quant/bytequant" target="_blank" rel="noreferrer noopener">{c.repo} ↗</Link></div></section>
  </SiteShell>;
}
