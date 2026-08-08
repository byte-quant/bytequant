import Link from "next/link";
import { pathFor, type Locale } from "../lib/site";

const content = {
  tr: { eyebrow: "KİM · NASIL · NEDEN", title: "Yayıncıyı, yöntemi ve düzeltme yolunu tek bakışta görün", cards: [["Kim?", "ByteQuant Editorial", "Kurumsal yayıncı; doğrulanamayan kişisel unvan kullanmaz."], ["Nasıl?", "Ürünle birlikte doğrulama", "Yöntem, örnek, hata ve kabul kontrolü yayından önce incelenir."], ["Düzeltme", "İzlenebilir değişiklik", "Hata e-posta ile alınır; doğrulanan düzeltme test ve Git geçmişine bağlanır."]], cta: "Yayın standartlarını incele" },
  en: { eyebrow: "WHO · HOW · WHY", title: "See the publisher, method, and correction route at a glance", cards: [["Who?", "ByteQuant Editorial", "Organizational publisher with no invented personal credentials."], ["How?", "Verified with the product", "Method, examples, errors, and acceptance checks are reviewed before release."], ["Corrections", "Traceable change", "Reports arrive by email; confirmed fixes link tests and Git history."]], cta: "Read publishing standards" },
  de: { eyebrow: "WER · WIE · WARUM", title: "Herausgeber, Methode und Korrekturweg auf einen Blick", cards: [["Wer?", "ByteQuant Editorial", "Organisatorischer Herausgeber ohne erfundene persönliche Titel."], ["Wie?", "Mit dem Produkt geprüft", "Methode, Beispiele, Fehler und Abnahmekriterien werden geprüft."], ["Korrektur", "Nachvollziehbare Änderung", "Bestätigte Korrekturen verbinden Tests und Git-Historie."]], cta: "Publikationsstandards lesen" },
  zh: { eyebrow: "谁 · 如何 · 为什么", title: "一眼了解发布者、核验方法与纠错渠道", cards: [["谁？", "ByteQuant Editorial", "机构发布者，不虚构个人资质。"], ["如何？", "与产品一起核验", "发布前检查方法、示例、错误和验收标准。"], ["纠错", "可追踪变更", "确认的修复会关联测试与 Git 历史。"]], cta: "查看发布标准" },
} as const;

export function PublisherTrustBand({ locale }: { locale: Locale }) {
  const copy = content[locale];
  return <section className="publisher-trust-band" data-publisher-trust="visible" aria-labelledby="publisher-trust-title"><div className="container narrow-container"><div className="publisher-trust-heading"><span className="kicker">{copy.eyebrow}</span><h2 id="publisher-trust-title">{copy.title}</h2></div><div className="publisher-trust-grid">{copy.cards.map(([label, title, body]) => <article key={label}><span>{label}</span><strong>{title}</strong><p>{body}</p></article>)}</div><Link className="secondary-button" href={pathFor(locale, "standards")}>{copy.cta} →</Link></div></section>;
}
