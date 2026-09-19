import Link from "next/link";
import { toolPath, type Locale } from "../lib/site";

const copy = {
  tr: {
    title: "7.7 ile deneyin: isteği anlatın, veriyi sonra gönderin",
    intro: "Hızlı yanıt katmanı, belirli hesapları ve metin işlemlerini açık kurallarla çalıştırır. Aşağıdaki örnekler model indirmeden denenebilir; sonuçları yanlarında verildiği için yalnızca bir başarı mesajına güvenmek zorunda değilsiniz.",
    steps: ["1. İsteğiniz", "2. Sonraki mesajınız", "Kontrol edeceğiniz sonuç"],
    cases: [
      ["Tablodan JSON'a", "CSV verisini JSON'a dönüştür", 'id;name\n007;Ada', '"id": "007"', "İlk mesaj işlemi seçer. Tabloyu ikinci mesajda yapıştırdığınızda aynı plan çalışır. Noktalı virgül ve elektronik tablodan kopyalanan sekmeler desteklenir. 007 sayıya çevrilmez; baştaki sıfırlar korunur. İki sütuna aynı başlığı verirseniz dönüşüm durur: sütunları benzersiz adlandırıp yeniden deneyin.", "json-csv-donusturucu"],
      ["Kodla, sonra geri çöz", "Base64 kodla: Merhaba", "Şimdi bunu çöz", "Merhaba", "İlk çıktı TWVyaGFiYQ== olur. İkinci mesaj, bu çıktıyı aktif Base64 işlemine bağlar. Çözülen metni başlangıç metniyle karşılaştırın. Base64 şifreleme değildir; gizli veriyi korumaz. Ayrı bir JWT isteği açarsanız önceki çıktıyı kendiliğinden JWT girdisi olarak kullanmaz.", "base64-kodlayici"],
      ["Hesabı kısa bir yanıtla değiştir", "200'ün %15'i kaç?", "Peki %30?", "60", "İlk yanıt 30, ikinci yanıt 60 olmalıdır. İkinci istekte yalnız oran değişir; temel değer 200 olarak kalır. Hesap 200 × 30 ÷ 100'dür. Desteklenen bu kısa yüzde düzeltmesi, her türlü matematik probleminin çözülebildiği anlamına gelmez.", "yuzde-degisim-hesaplayici"],
    ],
    limits: "Hızlı katman genel amaçlı bir LLM değildir. Güncel internet araştırması, uzman değerlendirmesi ve belirsiz açık uçlu görevler için yeterli olmayabilir. Emin olunmayan araç eşleşmeleri otomatik çalıştırılmaz. İsteğinize girdi türünü ve beklenen çıktıyı ekleyin. Örnek yanıtlar sitede bakımı yapılan içerikten gelir; yeni bir kaynak araştırması yapılmış gibi sunulmaz.",
    fields: "Daha kolay girdi: CAGR, ROAS/ROI, dosya sunum başlığı, PICO ve tarih ekleme araçlarında adlandırılmış alanları doldurun. CSV pivot ve JSON sıralama araçlarının kurallarını da alanlardan seçebilirsiniz. Ham girdi gelişmiş düzenlemede erişilebilir kalır. Yinelenen anahtar veya tanınmayan satır varsa alanlara tahminle aktarılmaz; özgün metin korunur.",
    open: "İlgili aracı aç",
  },
  en: {
    title: "Try 7.7: describe the task, send the data next",
    intro: "The fast response layer executes specific calculations and text operations using explicit rules. These examples work without downloading a model. Each includes an expected result so you can check the output instead of relying on a success message.",
    steps: ["1. Your request", "2. Your next message", "Result to check"],
    cases: [
      ["Table to JSON", "Convert CSV to JSON", 'id;name\n007;Ada', '"id": "007"', "The first message selects the operation. Paste the table in the second message to run that same plan. Semicolons and tabs copied from spreadsheets are supported. 007 remains a string, preserving its leading zeros. Repeated column names stop conversion: give each column a unique name and retry.", "json-csv-donusturucu"],
      ["Encode, then decode", "Base64 encode: Merhaba", "Now decode this", "Merhaba", "The first output is TWVyaGFiYQ==. The second request connects that output to the active Base64 operation. Compare the decoded text with the original. Base64 is not encryption and does not protect secrets. Starting a separate JWT task does not silently reuse the preceding output as a JWT.", "base64-kodlayici"],
      ["Change a calculation with a short reply", "15% of 200", "What about 30%?", "60", "The first answer should be 30; the second should be 60. Only the percentage changes, while the base remains 200. The calculation is 200 × 30 ÷ 100. Support for this short percentage correction does not imply that arbitrary mathematical problems can be solved.", "yuzde-degisim-hesaplayici"],
    ],
    limits: "The fast layer is not a general-purpose LLM. It may be insufficient for current web research, expert assessment or ambiguous open-ended tasks. Uncertain tool matches do not execute automatically. Include the input type and desired output in your request. Worked answers come from maintained site content; they do not claim that fresh research was performed.",
    fields: "Easier input: use named fields for CAGR, ROAS/ROI, Content-Disposition, PICO and date addition. CSV pivot and JSON sorting rules also have fields. Raw input remains available under advanced editing. Duplicate keys or unrecognised lines prevent guessed field mapping; your original text stays intact.",
    open: "Open the related tool",
  },
  de: {
    title: "7.7 ausprobieren: Aufgabe beschreiben, Daten nachreichen",
    intro: "Die schnelle Antwortschicht führt bestimmte Berechnungen und Textoperationen nach ausdrücklichen Regeln aus. Diese Beispiele benötigen keinen Modelldownload. Das erwartete Ergebnis steht daneben, damit Sie die Ausgabe selbst prüfen können.",
    steps: ["1. Ihre Anfrage", "2. Ihre nächste Nachricht", "Zu prüfendes Ergebnis"],
    cases: [
      ["Tabelle zu JSON", "CSV zu JSON konvertieren", 'id;name\n007;Ada', '"id": "007"', "Die erste Nachricht wählt den Vorgang. Die Tabelle in der zweiten Nachricht führt denselben Plan aus. Semikolons und aus Tabellen kopierte Tabulatoren werden unterstützt. 007 bleibt eine Zeichenfolge mit führenden Nullen. Doppelte Spaltennamen stoppen die Umwandlung: eindeutige Namen vergeben und erneut versuchen.", "json-csv-donusturucu"],
      ["Kodieren und wieder dekodieren", "Base64 encode: Merhaba", "Dieses Ergebnis dekodieren", "Merhaba", "Die erste Ausgabe lautet TWVyaGFiYQ==. Die zweite Anfrage verbindet diese Ausgabe mit dem aktiven Base64-Vorgang. Vergleichen Sie das Ergebnis mit dem Ursprungstext. Base64 ist keine Verschlüsselung und schützt keine Geheimnisse. Eine neue JWT-Aufgabe übernimmt die vorige Ausgabe nicht stillschweigend.", "base64-kodlayici"],
      ["Berechnung mit kurzer Antwort ändern", "15% von 200", "Und 30%?", "60", "Die erste Antwort muss 30 und die zweite 60 sein. Nur der Prozentsatz ändert sich; der Grundwert bleibt 200. Gerechnet wird 200 × 30 ÷ 100. Diese gezielte Korrektur bedeutet nicht, dass beliebige mathematische Probleme gelöst werden können.", "yuzde-degisim-hesaplayici"],
    ],
    limits: "Die schnelle Schicht ist kein allgemeines LLM. Für aktuelle Webrecherche, fachliche Bewertungen oder mehrdeutige offene Aufgaben reicht sie möglicherweise nicht aus. Unsichere Werkzeugtreffer werden nicht automatisch ausgeführt. Eingabetyp und gewünschtes Ergebnis ergänzen. Ausgearbeitete Antworten stammen aus gepflegten Seiteninhalten und behaupten keine neue Recherche.",
    fields: "Einfachere Eingabe: Benannte Felder für CAGR, ROAS/ROI, Content-Disposition, PICO und Datumsaddition ausfüllen. Auch Regeln für CSV-Pivot und JSON-Sortierung haben Felder. Die Roheingabe bleibt in der erweiterten Bearbeitung verfügbar. Doppelte Schlüssel oder unbekannte Zeilen werden nicht erraten; der Originaltext bleibt erhalten.",
    open: "Passendes Werkzeug öffnen",
  },
  zh: {
    title: "试用 7.7：先描述任务，再发送数据",
    intro: "快速回答层通过明确规则执行特定计算和文本操作。以下示例无需下载模型即可使用，并给出了预期结果，便于您核对实际输出，而不只依赖成功提示。",
    steps: ["1. 您的请求", "2. 下一条消息", "需要核对的结果"],
    cases: [
      ["表格转 JSON", "将CSV转为JSON", 'id;name\n007;Ada', '"id": "007"', "第一条消息选择操作，第二条消息粘贴表格后执行同一计划。支持分号及从电子表格复制的制表符。007 仍为字符串，保留开头的零。重复列名会停止转换：请为各列设置唯一名称后重试。", "json-csv-donusturucu"],
      ["编码后再解码", "Base64 encode: Merhaba", "解码这个结果", "Merhaba", "第一次输出为 TWVyaGFiYQ==。第二条请求将该输出关联到当前 Base64 操作。请将解码文本与原文比较。Base64 不是加密，不能保护秘密。开始新的 JWT 任务时，不会自动把上一结果当作 JWT 输入。", "base64-kodlayici"],
      ["用简短回复修改计算", "200的15%", "那30%呢？", "60", "第一个答案应为 30，第二个为 60。只修改百分比，基数仍是 200。计算过程为 200 × 30 ÷ 100。支持这种简短修正，并不意味着能够解决任意数学问题。", "yuzde-degisim-hesaplayici"],
    ],
    limits: "快速层不是通用大语言模型，可能无法完成实时网络研究、专业评估或含糊的开放任务。不确定的工具匹配不会自动执行。请说明输入类型和预期输出。示例回答来自网站维护的内容，不会声称进行了新的资料研究。",
    fields: "更方便的输入：CAGR、ROAS/ROI、Content-Disposition、PICO 和日期加减工具提供具名字段，CSV 透视和 JSON 排序规则也可通过字段设置。高级编辑仍提供原始输入。若存在重复键或无法识别的行，不会猜测映射方式，而是保留原文。",
    open: "打开相关工具",
  },
};

export function AgentWorkedGuide({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return <section className="section agent-worked-guide" id="agent-worked-examples"><div className="container">
    <div className="section-heading"><span className="kicker">BYTEQUANT AI 7.7</span><h2>{text.title}</h2><p>{text.intro}</p></div>
    <aside className="agent-mode-boundary"><p>{text.limits}</p></aside>
    <div className="agent-worked-grid">{text.cases.map(([title, first, next, output, explanation, slug]) => <article key={slug}>
      <h3>{title}</h3><dl><dt>{text.steps[0]}</dt><dd>{first}</dd><dt>{text.steps[1]}</dt><dd><pre>{next}</pre></dd><dt>{text.steps[2]}</dt><dd><code>{output}</code></dd></dl>
      <p>{explanation}</p><Link href={toolPath(locale, slug)}>{text.open} →</Link>
    </article>)}</div><p>{text.fields}</p>
  </div></section>;
}
