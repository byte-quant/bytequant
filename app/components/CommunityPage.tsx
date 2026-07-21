import Link from "next/link";
import { absoluteUrl, languageTag, organizationId, pathFor, toolPath, type Locale } from "../lib/site";
import { CommunityComposer } from "./CommunityComposer";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";

type StarterDestination = "mask" | "agent" | "workstation";

const copy = {
  tr: {
    eyebrow: "HESAPSIZ, CİHAZ İÇİ PAYLAŞIM", title: "Yöntemi paylaşın; özel veriyi cihazınızda tutun", intro: "Güvenli bir taslağı cihazınızda hazırlayın, hazır örneklerden başlayın ve hesap açmadan bağlantı ya da Markdown dosyası olarak paylaşın. ByteQuant içerik sunucusu çalıştırmaz; GitHub yalnızca kalıcı, herkese açık yayın isteyenler için isteğe bağlıdır.",
    cards: [["01", "Hazır taslak seçin", "KVKK akışı, JSON ipucu veya özellik fikriyle başlayın; tüm alanları özgürce düzenleyin."], ["02", "Cihazda ön kontrol yapın", "Sır, kişisel veri biçimi, açık tehdit ve dış bağlantılar bu sekmede sınırlı kurallarla taranır."], ["03", "Hesapsız paylaşın", "Kısa bağlantıyı kopyalayın, .md indirin veya telefonunuzun paylaş menüsünü kullanın."]],
    gallery: "Başlamak için üç gerçek kullanım yolu", galleryItems: [["KVKK verisi temizleme", "CSV → hassas alanları maskele → JSON olarak indir", "mask"], ["Prompt güçlendirme", "Görevi yapılandır → örnek ekle → persona tutarlılığını denetle", "agent"], ["JSON teslim kontrolü", "Biçimlendir → şemayla doğrula → iki sürümü karşılaştır", "workstation"]], open: "Akışı aç",
    rules: "Paylaşım ilkeleri", ruleItems: ["Gerçek kişisel veri, parola, özel anahtar veya müşteri kaydı paylaşmayın.", "Yalnızca sahibi olduğunuz ya da paylaşma yetkiniz bulunan içeriği kullanın.", "Cihaz içi filtreyi nihai güvenlik veya moderasyon garantisi saymayın.", "Güvenlik açıklarını kamuya açık tartışma yerine SECURITY.md süreciyle bildirin."], repo: "Açık kaynak depoyu incele",
  },
  en: {
    eyebrow: "NO-ACCOUNT, ON-DEVICE SHARING", title: "Share the method; keep private data on your device", intro: "Prepare a safe draft on-device, start from a practical example, and share it as a link or Markdown file without creating an account. ByteQuant runs no content server; GitHub is optional for persistent public publishing.",
    cards: [["01", "Choose a starter", "Begin with a privacy flow, JSON tip, or feature idea, then edit every field."], ["02", "Pre-check on-device", "Limited rules inspect common secret and personal-data shapes, explicit threats, and external links in this tab."], ["03", "Share without an account", "Copy a compact link, download .md, or use the native share sheet on your phone."]],
    gallery: "Three practical ways to start", galleryItems: [["Privacy-cleaning flow", "CSV → mask sensitive fields → export JSON", "mask"], ["Prompt improvement", "Structure goal → add examples → check persona consistency", "agent"], ["JSON delivery check", "Format → validate against a schema → compare versions", "workstation"]], open: "Open flow",
    rules: "Sharing principles", ruleItems: ["Never share real personal data, passwords, private keys, or customer records.", "Use only material you own or are authorized to share.", "Do not treat the on-device filter as final security or moderation assurance.", "Report vulnerabilities through SECURITY.md rather than a public discussion."], repo: "Explore the open-source repository",
  },
  de: {
    eyebrow: "TEILEN OHNE KONTO, AUF DEM GERÄT", title: "Methode teilen, private Daten auf dem Gerät behalten", intro: "Sicheren Entwurf lokal vorbereiten, mit einem Praxisbeispiel beginnen und ohne Konto als Link oder Markdown-Datei teilen. ByteQuant betreibt keinen Inhaltsserver; GitHub ist nur für dauerhafte öffentliche Beiträge optional.",
    cards: [["01", "Vorlage wählen", "Mit Datenschutz-Ablauf, JSON-Tipp oder Funktionsidee beginnen und alle Felder bearbeiten."], ["02", "Lokal vorprüfen", "Begrenzte Regeln prüfen typische Geheimnisse, Personendaten, offene Drohungen und externe Links in diesem Tab."], ["03", "Ohne Konto teilen", "Kompakten Link kopieren, .md herunterladen oder das Teilen-Menü des Telefons nutzen."]],
    gallery: "Drei praktische Einstiege", galleryItems: [["Datenschutz-Ablauf", "CSV → sensible Felder maskieren → JSON exportieren", "mask"], ["Prompt verbessern", "Ziel strukturieren → Beispiele ergänzen → Persona prüfen", "agent"], ["JSON-Lieferprüfung", "Formatieren → Schema validieren → Versionen vergleichen", "workstation"]], open: "Ablauf öffnen",
    rules: "Grundsätze", ruleItems: ["Keine echten Personendaten, Passwörter, privaten Schlüssel oder Kundendaten teilen.", "Nur eigene oder autorisierte Inhalte verwenden.", "Lokalen Filter nicht als endgültige Sicherheits- oder Moderationsgarantie verstehen.", "Schwachstellen über SECURITY.md statt öffentlich melden."], repo: "Open-Source-Repository ansehen",
  },
  zh: {
    eyebrow: "免账号、设备内分享", title: "分享方法，同时把私密数据留在设备上", intro: "在设备上准备安全草稿，从实用示例开始，无需账号即可生成链接或 Markdown 文件。ByteQuant 不运行内容服务器；只有需要长期公开发布时才可选用 GitHub。",
    cards: [["01", "选择起始模板", "从隐私流程、JSON 技巧或功能建议开始，并可编辑全部字段。"], ["02", "在设备上预检查", "有限规则会在当前标签页检查常见密钥、个人数据形式、明显威胁与外部链接。"], ["03", "无需账号分享", "复制紧凑链接、下载 .md，或使用手机的系统分享菜单。"]],
    gallery: "三个实用起点", galleryItems: [["隐私清理流程", "CSV → 遮蔽敏感字段 → 导出 JSON", "mask"], ["提示词增强", "明确目标 → 添加示例 → 检查角色一致性", "agent"], ["JSON 交付检查", "格式化 → Schema 验证 → 比较版本", "workstation"]], open: "打开流程",
    rules: "分享原则", ruleItems: ["不要分享真实个人数据、密码、私钥或客户记录。", "只使用您拥有或获授权分享的内容。", "不要把设备内过滤器视为最终安全或审核保证。", "请通过 SECURITY.md 私下报告漏洞。"], repo: "查看开源仓库",
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
    { "@context": "https://schema.org", "@type": "HowTo", name: c.title, inLanguage: languageTag(locale), step: c.cards.map(([number, name, text], index) => ({ "@type": "HowToStep", position: index + 1, name: `${number} · ${name}`, text })) },
  ];

  return (
    <SiteShell locale={locale} alternateHref={pathFor(locale === "tr" ? "en" : "tr", "community")} languageHrefs={{ tr: pathFor("tr", "community"), en: pathFor("en", "community"), de: pathFor("de", "community"), zh: pathFor("zh", "community") }}>
      <SchemaScript data={schema} />
      <section className="community-hero"><div className="container"><span className="eyebrow"><i />{c.eyebrow}</span><h1>{c.title}</h1><p>{c.intro}</p><div className="community-how">{c.cards.map(([number, title, text]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{text}</p></article>)}</div></div></section>
      <section className="section community-gallery-section"><div className="container"><div className="section-heading"><span className="kicker">STARTER LIBRARY</span><h2>{c.gallery}</h2></div><div className="community-gallery">{c.galleryItems.map(([title, text, destination]) => <article key={title}><span aria-hidden="true">↗</span><h3>{title}</h3><p>{text}</p><Link className="text-link" href={starterHref(locale, destination)}>{c.open} →</Link></article>)}</div></div></section>
      <section className="section"><div className="container"><CommunityComposer locale={locale} /></div></section>
      <section className="section community-rules"><div className="container"><div><span className="kicker">TRUST & SAFETY</span><h2>{c.rules}</h2><ul>{c.ruleItems.map((item) => <li key={item}>✓ <span>{item}</span></li>)}</ul></div><Link className="primary-button" href="https://github.com/byte-quant/bytequant" target="_blank" rel="noreferrer noopener">{c.repo} ↗</Link></div></section>
    </SiteShell>
  );
}
