import Link from "next/link";
import { posts } from "../lib/posts";
import { categories, tools, type ToolCategory } from "../lib/tools";
import { copy, pathFor, postPath, siteUrl, toolPath, type Locale } from "../lib/site";
import { AdSlot } from "./AdSlot";
import { SchemaScript } from "./SchemaScript";
import { SiteShell } from "./SiteShell";
import { ToolCard } from "./ToolCard";
import { PopularTools } from "./ToolUsage";

const faqs = {
  tr: [
    ["ByteQuant'a yazdığım metinler sunucuya gönderiliyor mu?", "Hayır. Araçların temel analiz ve dönüşüm işlemleri tarayıcınızda JavaScript ve Web API'leriyle çalışır. Girdi alanlarındaki içerik ByteQuant sunucularına gönderilmez."],
    ["Araçları kullanmak için üyelik gerekiyor mu?", "Hayır. Araçlar ücretsizdir ve hesap açmadan kullanılabilir. Araç girdileri tarayıcı depolamasına kaydedilmez; tema ve kişisel popüler araç sayacı yalnızca bu cihazda, hassas içerik olmadan tutulabilir."],
    ["Sonuçlar hukuki veya güvenlik garantisi verir mi?", "Hayır. Maskeleme ve analiz araçları ön kontrol sağlar. KVKK, GDPR, güvenlik veya hukuki kararlar için yetkin uzman incelemesi gerekir."],
    ["Token sayacı neden yaklaşık sonuç verir?", "Her model farklı bir tokenizer kullanır. ByteQuant, veriyi dışarı göndermeden hızlı planlama yapabilmeniz için karakter ve dil yapısına dayalı yaklaşık değer üretir."],
    ["Araçlar mobil cihazlarda çalışır mı?", "Evet. Güncel mobil tarayıcılarda temel araçlar çalışır. Web Crypto gibi bazı özellikler tarayıcı desteğine bağlıdır."],
    ["Site reklam içeriyor mu?", "Şu anda ayrılmış reklam alanları gösterilir. Reklam hizmeti etkinleştirilirse çerez, onay ve gizlilik bilgileri hizmet devreye alınmadan önce güncellenecektir."],
  ],
  en: [
    ["Is text entered into ByteQuant sent to a server?", "No. Core analysis and transformation run in your browser using JavaScript and Web APIs. Tool input is not sent to ByteQuant servers."],
    ["Do I need an account?", "No. The tools are free and require no account. Tool input is not saved to browser storage; theme and personal popular-tool counts may stay on this device without sensitive content."],
    ["Do results provide legal or security assurance?", "No. Masking and analysis are pre-checks. KVKK, GDPR, security, and legal decisions require qualified human review."],
    ["Why is the token count approximate?", "Each model uses a different tokenizer. ByteQuant estimates from characters and language so you can plan without transmitting the text."],
    ["Do the tools work on mobile?", "Yes. Core tools work in current mobile browsers. Some features, including Web Crypto operations, depend on browser support."],
    ["Does the site contain advertising?", "Reserved advertising areas are currently shown. If an ad service is activated, consent and privacy information will be updated before launch."],
  ],
} as const;

export function HomePage({ locale }: { locale: Locale }) {
  const isTr = locale === "tr";
  const languageTag = isTr ? "tr-TR" : "en-US";
  const t = copy[locale];
  const alternateHref = locale === "tr" ? "/en" : "/";
  const schema = [
    { "@context": "https://schema.org", "@type": "WebSite", name: "ByteQuant", url: locale === "tr" ? siteUrl : `${siteUrl}/en`, inLanguage: languageTag, description: isTr ? "Tarayıcı içinde çalışan gizlilik odaklı prompt, metin, veri ve güvenlik araçları." : "Privacy-first prompt, text, data, and security tools that run in the browser." },
    { "@context": "https://schema.org", "@type": "WebApplication", name: "ByteQuant", url: locale === "tr" ? siteUrl : `${siteUrl}/en`, applicationCategory: "ProductivityApplication", operatingSystem: "Any modern browser", inLanguage: languageTag, isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, featureList: tools.map((tool) => tool.title[locale]) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs[locale].map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ];

  return (
    <SiteShell locale={locale} alternateHref={alternateHref}>
      <SchemaScript data={schema} />
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><i />{isTr ? "Gizlilik, bir ayar değil; mimari karar" : "Privacy is an architecture decision, not a setting"}</span>
            <h1>{isTr ? <>Hassas verileriniz tarayıcıdan çıkmadan <em>işlerinizi tamamlayın.</em></> : <>Get work done <em>without sensitive data leaving your browser.</em></>}</h1>
            <p>{isTr ? `Promptları iyileştirin, metinleri analiz edin, veriyi dönüştürün ve kişisel bilgileri koruyun. ${tools.length} açıklanabilir araç; üyelik, sunucuya yükleme ve uzak API olmadan çalışır.` : `Improve prompts, analyze text, transform data, and protect personal information. ${tools.length} explainable tools work without accounts, server uploads, or remote APIs.`}</p>
            <div className="hero-actions"><Link className="primary-button" href={pathFor(locale, "tools")}>{t.allTools}<span aria-hidden="true"> →</span></Link><Link className="secondary-button" href={pathFor(locale, "blog")}>{t.blogCta}</Link></div>
            <div className="hero-trust"><span>✓ {isTr ? "Üyelik yok" : "No account"}</span><span>✓ {isTr ? "Sunucuya yükleme yok" : "No server upload"}</span><span>✓ {isTr ? "Açıklanabilir sonuç" : "Explainable output"}</span></div>
          </div>
          <div className="hero-product" aria-label={isTr ? "ByteQuant araç arayüzü örneği" : "ByteQuant tool interface preview"}>
            <div className="product-window">
              <div className="window-bar"><span><i /><i /><i /></span><b>bytequant.org/{isTr ? "araclar" : "tools"}</b><small>● {isTr ? "Yerel" : "Local"}</small></div>
              <div className="window-content">
                <div className="preview-heading"><span className="tool-mark category-prompt">01</span><div><small>{isTr ? "PROMPT ARAÇLARI" : "PROMPT TOOLS"}</small><strong>{isTr ? "Prompt Kalite Denetimi" : "Prompt Quality Checker"}</strong></div><span className="score-ring">84</span></div>
                <div className="preview-input">{isTr ? "Yeni kullanıcılar için gizlilik araçlarını anlatan kısa bir rehber hazırla…" : "Create a short guide to privacy tools for new users…"}</div>
                <div className="preview-checks"><span>✓ {isTr ? "Açık hedef" : "Clear goal"}</span><span>✓ {isTr ? "Çıktı biçimi" : "Output format"}</span><span>○ {isTr ? "Kalite ölçütü" : "Quality criterion"}</span></div>
                <div className="preview-footer"><span><i />{isTr ? "Bu metin cihazınızda işlendi" : "Processed on your device"}</span><b>{isTr ? "Analizi çalıştır" : "Run analysis"} →</b></div>
              </div>
            </div>
            <div className="floating-note"><span>◎</span><div><strong>{isTr ? "Ağ isteği yok" : "No network request"}</strong><small>{isTr ? "Girdi tarayıcı belleğinde" : "Input remains in browser memory"}</small></div></div>
          </div>
        </div>
      </section>

      <section className="proof-strip"><div className="container proof-grid"><div><strong>{tools.length}</strong><span>{isTr ? "işlevsel araç" : "working tools"}</span></div><div><strong>4</strong><span>{isTr ? "odaklı kategori" : "focused categories"}</span></div><div><strong>0</strong><span>{isTr ? "zorunlu hesap" : "required accounts"}</span></div><div><strong>100%</strong><span>{isTr ? "tarayıcı içi çekirdek işlem" : "in-browser core processing"}</span></div></div></section>

      <PopularTools locale={locale} />

      <section className="section category-section" id={locale === "tr" ? "araclar" : "tools"}>
        <div className="container">
          <div className="section-heading split-heading"><div><span className="kicker">{isTr ? "ARAÇ KÜTÜPHANESİ" : "TOOL LIBRARY"}</span><h2>{isTr ? "Günlük işler için küçük, güvenilir araçlar" : "Small, dependable tools for everyday work"}</h2></div><p>{isTr ? "Her araç tek bir işi iyi yapar, yöntemi açıklar ve veriyi dışarı göndermeden kullanılabilir bir sonuç üretir." : "Each tool does one job well, explains its method, and produces a useful result without sending input away."}</p></div>
          <div className="category-nav">{(Object.keys(categories) as ToolCategory[]).map((key) => <a key={key} href={`#category-${key}`}><span className={`category-dot category-${key}`}>{categories[key].mark}</span><span><strong>{categories[key].label[locale]}</strong><small>{tools.filter((tool) => tool.category === key).length} {isTr ? "araç" : "tools"}</small></span></a>)}</div>
          {(Object.keys(categories) as ToolCategory[]).map((key) => <div className="tool-category-block" id={`category-${key}`} key={key}><div className="category-block-heading"><div><span className={`category-dot large category-${key}`}>{categories[key].mark}</span><div><h3>{categories[key].label[locale]}</h3><p>{categories[key].description[locale]}</p></div></div><a href={`#${locale === "tr" ? "araclar" : "tools"}`}>{isTr ? "Başa dön" : "Back to top"} ↑</a></div><div className="tool-grid">{tools.filter((tool) => tool.category === key).map((tool) => <ToolCard key={tool.slug} tool={tool} locale={locale} />)}</div></div>)}
        </div>
      </section>

      <div className="container"><AdSlot locale={locale} /></div>

      <section className="section workflow-section">
        <div className="container workflow-grid"><div className="workflow-copy"><span className="kicker">{isTr ? "NASIL ÇALIŞIR?" : "HOW IT WORKS"}</span><h2>{isTr ? "Veri yolculuğunu kısa tutan tasarım" : "A design that keeps the data journey short"}</h2><p>{isTr ? "Araçlar, görevi tamamlamak için tarayıcının yerleşik özelliklerini kullanır. Girdi bir sunucuya gönderilmediği için ek veri kopyaları ve gereksiz erişim noktaları oluşmaz." : "The tools use built-in browser capabilities to complete the task. Because input is not sent to a server, unnecessary copies and access paths are avoided."}</p><Link className="text-link" href={postPath(locale, "client-side-ai-araclari-nedir")}>{isTr ? "Client-side mimari rehberini okuyun" : "Read the client-side architecture guide"} →</Link></div><ol className="workflow-steps"><li><span>01</span><div><strong>{isTr ? "Girdiyi cihazınızda açın" : "Open input on your device"}</strong><p>{isTr ? "Metin yalnızca etkin tarayıcı sekmesinde bulunur." : "Text exists only in the active browser tab."}</p></div></li><li><span>02</span><div><strong>{isTr ? "Yerel işlemi çalıştırın" : "Run the local operation"}</strong><p>{isTr ? "JavaScript, Regex veya Web Crypto sonucu üretir." : "JavaScript, Regex, or Web Crypto produces the result."}</p></div></li><li><span>03</span><div><strong>{isTr ? "Sonucu siz yönetin" : "You control the result"}</strong><p>{isTr ? "Kontrol edin, kopyalayın, indirin veya sekmeyle birlikte kapatın." : "Review, copy, download, or close it with the tab."}</p></div></li></ol></div>
      </section>

      <section className="section editorial-section">
        <div className="container"><div className="section-heading split-heading"><div><span className="kicker">{isTr ? "REHBERLER" : "GUIDES"}</span><h2>{isTr ? "Aracı değil, doğru yöntemi öğrenin" : "Learn the method, not only the tool"}</h2></div><p>{isTr ? "Gizlilik, prompt kalitesi ve veri güvenliği hakkında uygulamaya dönük, kaynak mantığı açık yazılar." : "Practical writing on privacy, prompt quality, and data security with transparent reasoning."}</p></div><div className="post-grid">{posts.slice(0, 3).map((post, index) => <article className={`post-card post-card-${index + 1}`} key={post.slug}><span>{post.category[locale]} · {post.readTime[locale]}</span><h3><Link href={postPath(locale, post.slug)}>{post.title[locale]}</Link></h3><p>{post.excerpt[locale]}</p><Link className="text-link" href={postPath(locale, post.slug)}>{isTr ? "Rehberi oku" : "Read guide"} →</Link></article>)}</div><div className="center-action"><Link className="secondary-button" href={pathFor(locale, "blog")}>{isTr ? "Tüm rehberleri görüntüle" : "View all guides"}</Link></div></div>
      </section>

      <section className="section principles-section"><div className="container"><div className="section-heading centered"><span className="kicker">{isTr ? "NEDEN BYTEQUANT?" : "WHY BYTEQUANT?"}</span><h2>{isTr ? "Gösterişli iddialar yerine denetlenebilir ilkeler" : "Auditable principles instead of flashy claims"}</h2></div><div className="principle-grid"><article><span>↘</span><h3>{isTr ? "Yerel varsayılan" : "Local by default"}</h3><p>{isTr ? "Sunucu gerektirmeyen görevler cihazınızda kalır. Yeni dış hizmet eklenirse açıkça belirtilir." : "Tasks that do not need a server stay on-device. Any future external service will be disclosed."}</p></article><article><span>≋</span><h3>{isTr ? "Açıklanabilir yöntem" : "Explainable methods"}</h3><p>{isTr ? "Skorların ve dönüşümlerin neye dayandığını, yaklaşık sonuçları ve sınırları gösteririz." : "We disclose what scores and transformations use, including estimates and limitations."}</p></article><article><span>□</span><h3>{isTr ? "Tek iş, net çıktı" : "One job, clear output"}</h3><p>{isTr ? "Araçlar gereksiz panel karmaşası olmadan tek bir sorunu çözmeye odaklanır." : "Tools focus on one problem without unnecessary dashboard complexity."}</p></article><article><span>✓</span><h3>{isTr ? "Dürüst sınırlar" : "Honest limitations"}</h3><p>{isTr ? "Otomatik sonuçların uzman görüşü veya hukuki uygunluk garantisi olmadığını açıkça söyleriz." : "Automated output is never presented as expert opinion or legal compliance assurance."}</p></article></div></div></section>

      <section className="section faq-section"><div className="container faq-layout"><div><span className="kicker">{isTr ? "SIK SORULAN SORULAR" : "FREQUENTLY ASKED QUESTIONS"}</span><h2>{isTr ? "Başlamadan önce bilmeniz gerekenler" : "What to know before you start"}</h2><p>{isTr ? "Başka bir sorunuz varsa bize yazın; ürün davranışı ve gizlilik açıklamalarını açık tutmayı önemsiyoruz." : "If your question is not here, contact us. We value clear explanations of product behavior and privacy."}</p><Link className="secondary-button" href={pathFor(locale, "contact")}>{isTr ? "Bize ulaşın" : "Contact us"}</Link></div><div className="faq-list">{faqs[locale].map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="cta-band"><div className="container"><div><span>{isTr ? `${tools.length} ARAÇ · ÜCRETSİZ · ÜYELİKSİZ` : `${tools.length} TOOLS · FREE · NO ACCOUNT`}</span><h2>{isTr ? "İlk işleminizi cihazınızda tamamlayın." : "Complete your first task on-device."}</h2></div><Link className="light-button" href={toolPath(locale, "kvkk-veri-maskeleyici")}>{isTr ? "Gizlilik aracını deneyin" : "Try the privacy tool"} →</Link></div></section>
    </SiteShell>
  );
}
