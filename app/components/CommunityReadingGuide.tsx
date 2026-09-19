import Link from "next/link";
import { toolPath, type Locale } from "../lib/site";

const copy = {
  tr: {
    label: "BYTEQUANT EDİTORYAL REHBERİ", title: "Tekrar denenebilir bir paylaşım nasıl hazırlanır?",
    intro: "İyi bir araç sorusu, aynı sonucu başka birinin de üretebilmesini sağlar. Aşağıdaki örnekleri ByteQuant hazırladı; kullanıcı gönderisi veya canlı topluluk etkinliği değildir. Okumak ve araçları denemek için relay bağlantısı gerekmez.",
    cases: [
      { title: "CSV dönüşümünde kaybolan sütunu araştırın", slug: "json-csv-donusturucu", input: 'id,note\n007,"A,B"', result: '[{"id":"007","note":"A,B"}]', body: "Paylaşımda dönüşüm yönünü CSV → JSON olarak yazın. İki sütun ve bir kayıt beklediğinizi belirtin. Tırnaklar note içindeki virgülü korur; id metin olarak kalır. Sonucunuz üç sütunsa başlığı, ayıracı ve tırnakları karşılaştırın. Tam müşteri dosyasını paylaşmak yerine bu iki satırlık örneği kullanın." },
      { title: "Bir kodlama sorununu gidiş–dönüşle gösterin", slug: "base64-kodlayici", input: "Çay ☕", result: "w4dheSDimJU= → Çay ☕", body: "Önce kodlayın, sonra aynı çıktıyı çözün. Paylaşımınızda tarayıcı adını, işlem yönünü ve bozulan karakteri belirtin. Ç harfinin veya simgenin değişmesi, yalnız ASCII ile fark edilmeyen bir metin kodlama sorununa işaret eder. Base64 gizleme veya şifreleme değildir; örneğe parola eklemeyin." },
    ],
    input: "Küçük girdi", result: "Kontrol edilecek sonuç", open: "Örneği araçta deneyin",
    reportTitle: "“Çalışmıyor” yerine şu bilgileri verin",
    checklist: ["Araç adı, seçilen işlem ve kullandığınız tarayıcı.", "Kişisel veri içermeyen en küçük girdi ve tekrarlama adımları.", "Beklediğiniz çıktı ile gerçekten gördüğünüz çıktı veya hata metni.", "Sorunun örnek girdiyle de oluşup oluşmadığı; ekran görüntüsü kullanıyorsanız kişisel alanları kaldırın."],
    boundariesTitle: "Hangi alan kim tarafından görülebilir?",
    boundaries: [["Global akış", "Bağlanmak seçtiğiniz bağımsız relay’lere ağ isteği gönderir. Yayınlanan içerik herkese açık olabilir ve kopyalanabilir; silme isteği bütün kopyaları geri almaz."], ["Cihaz arşivi", "Yerel pano otomatik olarak global akışa gönderilmez. Paylaşılan cihazda görünürlüğünü düşünün; dışa aktardığınız paket, kaydettiğiniz yerde ayrıca bir kopyadır."], ["Doğrudan görüşme", "P2P davetini yalnız görüşeceğiniz kişiyle paylaşın. Alıcı konuşmayı kopyalayabilir; birebir bağlantı, içerik üzerinde sonradan kontrol garantisi vermez."]],
  },
  en: {
    label: "BYTEQUANT EDITORIAL GUIDE", title: "How to prepare a reproducible post",
    intro: "A useful tool question lets somebody else reproduce the same result. ByteQuant prepared the examples below; they are not user posts or evidence of live community activity. Reading them and trying the tools requires no relay connection.",
    cases: [
      { title: "Investigate a misplaced CSV column", slug: "json-csv-donusturucu", input: 'id,note\n007,"A,B"', result: '[{"id":"007","note":"A,B"}]', body: "State that the direction is CSV → JSON and that you expect two columns and one record. Quotes preserve the comma inside note; id stays a string. If you see three columns, compare the header, delimiter, and quotes. Share this two-line fixture instead of an entire customer file." },
      { title: "Demonstrate an encoding issue with a round trip", slug: "base64-kodlayici", input: "Çay ☕", result: "w4dheSDimJU= → Çay ☕", body: "Encode first, then decode that exact output. Include the browser name, operation, and affected character in your post. A changed Ç or symbol points to a text encoding issue that an ASCII-only sample might miss. Base64 does not hide or encrypt secrets; keep passwords out of the sample." },
    ],
    input: "Minimal input", result: "Result to check", open: "Try the example in the tool",
    reportTitle: "Replace “it does not work” with these details",
    checklist: ["Tool name, selected operation, and browser.", "The smallest input without personal data, plus steps to reproduce.", "Expected output versus the actual output or error message.", "Whether the built-in example also fails; remove personal fields before sharing a screenshot."],
    boundariesTitle: "Who can see each area?",
    boundaries: [["Global feed", "Connecting sends network requests to the independent relays you choose. Published content can be public and copied; a deletion request does not retract every copy."], ["Device archive", "The local board is not automatically sent to the global feed. Consider access on a shared device; an exported pack is another copy wherever you save it."], ["Direct session", "Share a P2P invitation only with the intended person. The recipient can copy the conversation; a direct connection does not guarantee later control over its content."]],
  },
  de: {
    label: "REDAKTIONELLER BYTEQUANT-RATGEBER", title: "Einen nachvollziehbaren Beitrag vorbereiten",
    intro: "Eine hilfreiche Werkzeugfrage ermöglicht anderen, das Ergebnis nachzustellen. Die folgenden Beispiele stammen von ByteQuant; sie sind keine Nutzerbeiträge und belegen keine Live-Aktivität. Zum Lesen und Ausprobieren ist keine Relay-Verbindung nötig.",
    cases: [
      { title: "Eine verschobene CSV-Spalte untersuchen", slug: "json-csv-donusturucu", input: 'id,note\n007,"A,B"', result: '[{"id":"007","note":"A,B"}]', body: "Nennen Sie CSV → JSON als Richtung und zwei Spalten mit einem Datensatz als Erwartung. Anführungszeichen erhalten das Komma in note; id bleibt Text. Bei drei Spalten vergleichen Sie Kopfzeile, Trennzeichen und Anführungszeichen. Teilen Sie dieses Beispiel mit zwei Zeilen statt einer vollständigen Kundendatei." },
      { title: "Kodierungsfehler durch Rückumwandlung zeigen", slug: "base64-kodlayici", input: "Çay ☕", result: "w4dheSDimJU= → Çay ☕", body: "Zuerst kodieren, dann genau dieses Ergebnis dekodieren. Nennen Sie Browser, Vorgang und betroffenes Zeichen. Ein verändertes Ç oder Symbol weist auf ein Kodierungsproblem hin, das ein reines ASCII-Beispiel übersehen kann. Base64 verschlüsselt keine Geheimnisse; verwenden Sie keine Passwörter im Beispiel." },
    ],
    input: "Minimale Eingabe", result: "Zu prüfendes Ergebnis", open: "Beispiel im Werkzeug testen",
    reportTitle: "Diese Angaben helfen mehr als „funktioniert nicht“",
    checklist: ["Werkzeugname, gewählter Vorgang und Browser.", "Kleinste Eingabe ohne Personendaten und Schritte zur Wiederholung.", "Erwartete Ausgabe sowie tatsächliche Ausgabe oder Fehlermeldung.", "Ob auch das integrierte Beispiel scheitert; persönliche Felder vor einem Screenshot entfernen."],
    boundariesTitle: "Wer kann welchen Bereich sehen?",
    boundaries: [["Globaler Feed", "Beim Verbinden gehen Netzwerkanfragen an die gewählten unabhängigen Relays. Veröffentlichte Inhalte können öffentlich sein und kopiert werden; eine Löschanfrage holt nicht jede Kopie zurück."], ["Gerätearchiv", "Das lokale Board wird nicht automatisch im globalen Feed veröffentlicht. Auf gemeinsam genutzten Geräten den Zugriff bedenken; ein exportiertes Paket ist am Speicherort eine weitere Kopie."], ["Direkte Sitzung", "Eine P2P-Einladung nur mit der vorgesehenen Person teilen. Empfänger können Gespräche kopieren; eine direkte Verbindung garantiert keine spätere Kontrolle über den Inhalt."]],
  },
  zh: {
    label: "BYTEQUANT 编辑指南", title: "如何准备可复现的分享",
    intro: "有用的工具问题应让他人也能复现相同结果。以下示例由 ByteQuant 编写，并非用户帖子，也不表示社区的实时活动。阅读和试用工具无需连接中继。",
    cases: [
      { title: "调查 CSV 转换中的列错位", slug: "json-csv-donusturucu", input: 'id,note\n007,"A,B"', result: '[{"id":"007","note":"A,B"}]', body: "在帖子中注明方向为 CSV → JSON，预期有两列、一条记录。引号保留 note 内的逗号，id 仍为字符串。如果出现三列，请对照表头、分隔符和引号。分享这个两行样本，无需公开完整客户文件。" },
      { title: "通过往返转换展示编码问题", slug: "base64-kodlayici", input: "Çay ☕", result: "w4dheSDimJU= → Çay ☕", body: "先编码，再准确解码该输出。在帖子中注明浏览器、操作方向和异常字符。如果 Ç 或符号改变，可能是纯 ASCII 样本无法发现的文本编码问题。Base64 不能隐藏或加密秘密，请勿在示例中加入密码。" },
    ],
    input: "最小输入", result: "需核验的结果", open: "在工具中试用示例",
    reportTitle: "用这些信息代替“无法使用”",
    checklist: ["工具名称、所选操作和浏览器。", "不含个人数据的最小输入，以及复现步骤。", "预期输出与实际输出或错误信息。", "内置示例是否也会失败；分享截图前移除个人字段。"],
    boundariesTitle: "谁能看到各个区域？",
    boundaries: [["全球动态", "连接会向您选择的独立中继发送网络请求。发布的内容可能公开且可被复制；删除请求无法收回所有副本。"], ["设备归档", "本地看板不会自动发送到全球动态。请考虑共享设备上的访问权限；导出的内容包会在保存位置形成另一份副本。"], ["直接会话", "仅向预期对象分享 P2P 邀请。接收者可以复制对话；直接连接并不保证您以后仍能控制内容。"]],
  },
};

export function CommunityReadingGuide({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <section className="section community-reading-guide" id="community-sharing-guide" aria-labelledby="community-guide-title"><div className="container">
    <header className="section-heading"><span className="kicker">{t.label}</span><h2 id="community-guide-title">{t.title}</h2><p>{t.intro}</p></header>
    <div className="community-guide-cases">{t.cases.map((item) => <article key={item.slug}><h3>{item.title}</h3><p>{item.body}</p><dl><dt>{t.input}</dt><dd><pre><code>{item.input}</code></pre></dd><dt>{t.result}</dt><dd><pre><code>{item.result}</code></pre></dd></dl><Link className="text-link" href={toolPath(locale, item.slug)}>{t.open} →</Link></article>)}</div>
    <div className="community-guide-notes"><section><h3>{t.reportTitle}</h3><ol>{t.checklist.map((item) => <li key={item}>{item}</li>)}</ol></section><section><h3>{t.boundariesTitle}</h3><dl>{t.boundaries.map(([label, body]) => <div key={label}><dt>{label}</dt><dd>{body}</dd></div>)}</dl></section></div>
  </div></section>;
}
