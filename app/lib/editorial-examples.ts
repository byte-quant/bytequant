import type { Locale } from "./site";

type Localized = Record<Locale, string>;
const l = (tr: string, en: string, de: string, zh: string): Localized => ({ tr, en, de, zh });
export type EditorialExample = {
  tool: string; title: Localized; input: string; output: string;
  explanation: Localized; counterexample: string; caution: Localized;
  source: { title: string; url: string };
};

// Fixtures are deliberately synthetic. Tests execute these exact inputs through
// the converter or the same platform primitive used by the workbench.
export const editorialExamples: EditorialExample[] = [
  {
    tool: "json-bicimlendirici",
    title: l("JSON: biçim ile veri türü farklıdır", "JSON: formatting is not type conversion", "JSON: Formatierung ändert keine Datentypen", "JSON：格式化不等于类型转换"),
    input: '{"id":"007","enabled":false,"items":[]}',
    output: '{\n  "id": "007",\n  "enabled": false,\n  "items": []\n}',
    explanation: l(
      'İki boşlukla biçimlendirdiğinizde satırlar değişir; "007" metin, false mantıksal değer, items boş dizi olarak kalır. Bu ayrım ürün kodları için önemlidir: kimliği sayıya çevirmek baştaki sıfırları kaybettirir. Çıktıyı yeniden ayrıştırıp yalnız görünüşünü değil, alanların türlerini de karşılaştırın. Araç JSON şemasına veya uygulamanızın iş kurallarına uygunluğu doğrulamaz.',
      'With two-space indentation, the layout changes while "007" remains a string, false remains a boolean, and items remains an empty array. Product identifiers often depend on this distinction: converting an identifier to a number loses its leading zeros. Parse the output again and compare field types as well as values. This formatter does not validate a JSON schema or your application’s business rules.',
      'Bei zwei Leerzeichen Einrückung ändert sich das Layout. "007" bleibt eine Zeichenfolge, false ein Wahrheitswert und items ein leeres Array. Bei Produktkennungen ist dieser Unterschied entscheidend: Eine Umwandlung in eine Zahl entfernt führende Nullen. Parsen Sie die Ausgabe erneut und vergleichen Sie Werte und Datentypen. Der Formatierer prüft weder ein JSON-Schema noch die Geschäftsregeln Ihrer Anwendung.',
      '使用两个空格缩进后，排版会改变，但 "007" 仍是字符串、false 仍是布尔值、items 仍是空数组。产品编号尤其需要保留这种区别：转成数字会丢失开头的零。请重新解析输出，同时比较字段类型和值。本格式化工具不会验证 JSON Schema 或应用的业务规则。'),
    counterexample: '{"id":"007",}',
    caution: l(
      'Sondaki virgül geçerli JSON değildir ve işlem hata vermelidir; aracı veriyi tahmin ederek onaran bir düzenleyici olarak kullanmayın. Yinelenen anahtarlar ise farklı bir risktir: JSON.parse son değeri tutabilir. Kaynakta iki kez geçen "id" alanını biçimlendirilmiş çıktıdan geri kazanamazsınız. Büyük tamsayıları da JavaScript sayı hassasiyeti açısından ayrıca inceleyin.',
      'A trailing comma is invalid JSON and must produce an error; the formatter is not a repair tool that guesses your intention. Duplicate keys are a different risk: JSON.parse can retain the last value. An earlier "id" value cannot be recovered from the formatted output. Large integers also need a separate check for JavaScript number precision.',
      'Ein abschließendes Komma ist ungültiges JSON und muss einen Fehler auslösen. Der Formatierer errät keine Reparatur. Doppelte Schlüssel sind ein anderes Risiko: JSON.parse kann den letzten Wert behalten. Ein früherer "id"-Wert lässt sich dann nicht aus der Ausgabe rekonstruieren. Prüfen Sie große Ganzzahlen außerdem auf die Zahlengenauigkeit von JavaScript.',
      '末尾逗号不是有效 JSON，必须报错；格式化工具不会猜测并修复意图。重复键是另一种风险：JSON.parse 可能仅保留最后一个值，因此无法从格式化结果恢复更早的 "id"。大型整数还需单独检查 JavaScript 的数值精度。'),
    source: { title: "MDN · JSON.parse", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse" },
  },
  {
    tool: "json-csv-donusturucu",
    title: l("CSV: virgül her zaman yeni sütun değildir", "CSV: a comma is not always a new column", "CSV: Ein Komma beginnt nicht immer eine Spalte", "CSV：逗号并不总是列分隔符"),
    input: 'id,note\n007,"A,B"',
    output: '[\n  {\n    "id": "007",\n    "note": "A,B"\n  }\n]',
    explanation: l(
      'CSV → JSON yönünü seçin. Bu örnekte iki sütun ve bir veri kaydı vardır. Tırnak içindeki virgül note değerinin parçasıdır; split(",") ile ayırmak fazladan sütun üretirdi. Dönüştürücü hücreleri metin olarak korur, bu nedenle id alanı "007" kalır. Satır sayısını başlığı hariç tutarak karşılaştırın ve her kaydın aynı iki anahtarı taşıdığını kontrol edin.',
      'Choose CSV → JSON. This sample has two columns and one data record. The quoted comma belongs to note; splitting on every comma would invent a third column. The converter preserves cells as strings, so id stays "007". Count records without the header and check that each record has the same two keys. Numeric interpretation should be an explicit downstream decision.',
      'Wählen Sie CSV → JSON. Das Beispiel enthält zwei Spalten und einen Datensatz. Das Komma in Anführungszeichen gehört zu note; ein einfaches Trennen an jedem Komma würde eine dritte Spalte erzeugen. Zellen bleiben Zeichenfolgen, deshalb bleibt id gleich "007". Zählen Sie Datensätze ohne Kopfzeile und prüfen Sie die beiden Schlüssel. Zahlenumwandlungen benötigen eine bewusste Folgeentscheidung.',
      '选择 CSV → JSON。此样本有两列、一条数据记录。引号中的逗号属于 note 值；按每个逗号拆分会错误地产生第三列。转换器把单元格保留为字符串，因此 id 仍是 "007"。统计记录时排除表头，并检查每条记录的两个键。是否转成数值应由后续步骤明确决定。'),
    counterexample: 'id,note\n007,A,B',
    caution: l(
      'Tırnakları kaldırdığınızda veri satırı üç alana çıkar ve iki alanlı başlıkla uyuşmaz; dönüşüm durmalıdır. Bir başka sınır ters yöndedir: iç içe JSON nesneleri doğrudan CSV olamaz. Önce hangi alanların sütuna dönüşeceğini belirleyin. Formül benzeri hücreler dışa aktarımda koruyucu apostrof alabilir; elektronik tabloda açtıktan sonra hücreyi ve ham CSV metnini birlikte kontrol edin.',
      'Removing the quotes creates three fields under a two-field header, so conversion must stop. In the reverse direction, nested JSON objects cannot become flat CSV automatically: decide the column mapping first. Formula-like cells may receive a protective apostrophe on export. Check both the raw CSV and the cell after importing into a spreadsheet; a successful conversion alone does not prove the receiving program interpreted it correctly.',
      'Ohne Anführungszeichen entstehen drei Felder unter einem Header mit zwei Feldern; die Konvertierung muss stoppen. Umgekehrt lassen sich verschachtelte JSON-Objekte nicht automatisch in flache CSV-Zeilen umwandeln. Legen Sie zunächst die Spaltenzuordnung fest. Formelähnliche Zellen können beim Export ein schützendes Apostroph erhalten. Prüfen Sie deshalb Rohtext und Tabellenzelle nach dem Import.',
      '去掉引号会在两列表头下产生三个字段，转换应停止。反向转换也有限制：嵌套 JSON 对象不能自动变成扁平 CSV，需先确定列映射。导出时，类似公式的单元格可能增加保护性单引号。请同时检查 CSV 原文和导入电子表格后的单元格；转换成功并不代表接收程序解释正确。'),
    source: { title: "RFC 4180 · CSV format", url: "https://www.rfc-editor.org/rfc/rfc4180" },
  },
  {
    tool: "base64-kodlayici",
    title: l("Base64: Unicode ile gidiş-dönüş kontrolü", "Base64: a Unicode round-trip check", "Base64: Unicode im Hin- und Rückweg prüfen", "Base64：Unicode 往返核验"),
    input: "Çay ☕", output: "w4dheSDimJU=", counterexample: "/w==",
    explanation: l(
      'Kodlama yönünde Çay ☕ metnini aynen girin. Sonuç UTF-8 baytlarının Base64 gösterimidir; sondaki = dolgu karakterini koruyun. Ardından çözme yönünde çıktıyı geri verin: Ç ve kahve simgesi dahil aynı metin dönmelidir. Harf sayısı ile bayt sayısı aynı değildir. Türkçe karakterleri içeren bu örnek, yalnız ASCII ile yapılan bir testin kaçıracağı kodlama hatalarını yakalar.',
      'Encode the exact text Çay ☕. The result represents its UTF-8 bytes in Base64; retain the final padding character. Switch to decode and paste the output back: the Ç and coffee symbol must both survive. Character count is not byte count. This sample catches encoding mistakes that an ASCII-only test would miss, without using any personal information.',
      'Kodieren Sie genau den Text Çay ☕. Das Ergebnis stellt seine UTF-8-Bytes in Base64 dar; behalten Sie das Füllzeichen am Ende. Wechseln Sie zum Dekodieren und geben Sie das Ergebnis zurück: Ç und Kaffeetasse müssen unverändert bleiben. Zeichenanzahl und Byteanzahl unterscheiden sich. Dieses Beispiel entdeckt Kodierungsfehler, die reine ASCII-Tests übersehen.',
      '准确输入 Çay ☕ 并编码。结果是其 UTF-8 字节的 Base64 表示，请保留末尾填充字符。切换到解码后粘贴结果，Ç 和咖啡符号都应完整还原。字符数量不等于字节数量。这个不含个人信息的样本能发现纯 ASCII 测试遗漏的编码问题。'),
    caution: l(
      '/w== geçerli Base64 baytlarını temsil eder, ancak çözülen 0xFF tek başına geçerli UTF-8 metni değildir. Bu metin aracı hata vermelidir; dosya veya resim çözücü olarak değerlendirmeyin. Base64 gizleme ya da şifreleme sağlamaz. Parola, erişim belirteci veya kişisel bilgi paylaşmak için kodlanmış biçimi güvenli kabul etmeyin.',
      '/w== represents valid Base64 bytes, but its decoded byte 0xFF is not valid standalone UTF-8 text. This text decoder should reject it; it is not an image or arbitrary-file decoder. Base64 provides no secrecy or encryption. An encoded password, access token, or personal record is still exposed to anyone who can decode it.',
      '/w== stellt gültige Base64-Bytes dar, doch das dekodierte Byte 0xFF ist allein kein gültiger UTF-8-Text. Dieser Textdekoder sollte es ablehnen; er ist kein Dekoder für Bilder oder beliebige Dateien. Base64 bietet weder Geheimhaltung noch Verschlüsselung. Kodierte Passwörter, Zugriffstoken und Personendaten sind weiterhin lesbar.',
      '/w== 表示有效 Base64 字节，但解出的单字节 0xFF 不是有效 UTF-8 文本，因此该文本解码器应拒绝它。它并非图片或任意文件解码器。Base64 不提供保密或加密能力；编码后的密码、访问令牌和个人记录仍可被他人解码读取。'),
    source: { title: "MDN · Base64", url: "https://developer.mozilla.org/en-US/docs/Glossary/Base64" },
  },
  {
    tool: "url-kodlayici",
    title: l("URL: parametre değeri ile tam adresi ayırın", "URL: distinguish a value from a whole address", "URL: Parameterwert und vollständige Adresse trennen", "URL：区分参数值与完整地址"),
    input: "a+b & page=1", output: "a%2Bb%20%26%20page%3D1", counterexample: "%E0%A4%A",
    explanation: l(
      'Bu örnek tek bir parametre değeridir. + işareti %2B, boşluk %20, & işareti %26 olur. Böylece değerin içindeki & yanlışlıkla yeni parametre başlatmaz. Tam bir https adresini aynı işlemden geçirmek : ve / ayraçlarını da kodlar; sonuç doğrudan gezilecek adres olmaktan çıkar. Adresi kurarken yalnız parametre değerini kodlayın ve hedef uygulamanın çözme davranışını kontrol edin.',
      'This sample is one parameter value. The plus becomes %2B, spaces become %20, and the ampersand becomes %26, preventing it from starting an unintended parameter. Encoding an entire https address also escapes its colon and slashes, so the result is no longer a directly navigable address. Encode the value when building a URL and verify how the destination decodes it.',
      'Dieses Beispiel ist ein einzelner Parameterwert. Plus wird zu %2B, Leerzeichen zu %20 und das Und-Zeichen zu %26. So beginnt das Und-Zeichen keinen unbeabsichtigten Parameter. Eine vollständige HTTPS-Adresse würde auch Doppelpunkt und Schrägstriche kodieren und wäre nicht mehr direkt aufrufbar. Kodieren Sie beim URL-Aufbau den Wert und prüfen Sie die Dekodierung am Ziel.',
      '此样本是单个参数值。加号变成 %2B、空格变成 %20、& 变成 %26，避免值中的 & 意外开启新参数。如果编码整个 https 地址，冒号和斜杠也会转义，结果就不能直接作为访问地址。构建 URL 时应编码参数值，并核验目标应用的解码行为。'),
    caution: l(
      'Eksik yüzde dizisi %E0%A4%A hata üretmelidir. Ayrıca decodeURIComponent("a+b") sonucu a+b olur; + işaretini otomatik boşluğa çevirmez. Form kodlaması ile URI bileşeni çözümünü karıştırmak arama ifadelerini değiştirir. Çıktıyı ikinci kez kodlamak % karakterlerini yeniden kodlayacağı için değeri hedefe yalnız bir kez kodlanmış olarak iletin.',
      'The incomplete percent sequence %E0%A4%A must fail. Also, decodeURIComponent("a+b") returns a+b; it does not automatically turn a plus into a space. Confusing form decoding with URI-component decoding can change a search query. Encoding the result twice escapes the percent characters again, so pass a value encoded exactly once to the receiving system.',
      'Die unvollständige Prozentfolge %E0%A4%A muss fehlschlagen. decodeURIComponent("a+b") liefert außerdem a+b und ersetzt Plus nicht automatisch durch Leerzeichen. Eine Verwechslung mit Formulardekodierung verändert Suchbegriffe. Zweifaches Kodieren kodiert auch Prozentzeichen erneut. Übergeben Sie den Wert daher genau einmal kodiert.',
      '不完整百分号序列 %E0%A4%A 必须报错。另外 decodeURIComponent("a+b") 返回 a+b，不会自动把加号变为空格。混淆表单解码与 URI 组件解码会改变搜索词。重复编码还会再次转义百分号，因此应向接收系统传递仅编码一次的值。'),
    source: { title: "MDN · encodeURIComponent", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" },
  },
];

// These fixtures show the decisive result field/header, not the localized report around it.
editorialExamples.push(
  {
    tool: "tarih-ekle-cikar-hesaplayici",
    title: l("Ay sonu: 31 Ocak'a bir ay eklemek", "Month end: adding one month to January 31", "Monatsende: ein Monat nach dem 31. Januar", "月末：1 月 31 日加一个月"),
    input: "date=2024-01-31\nyears=0\nmonths=1\ndays=0\nbusinessDays=0", output: "2024-02-29",
    counterexample: "date=2023-02-29\nmonths=1",
    explanation: l(
      "Tarih alanına 2024-01-31, ay alanına 1, diğer fark alanlarına 0 yazın. Sonuç satırında 2024-02-29 görmelisiniz: araç önce yılı ve ayı değiştirir, ardından başlangıç gününü hedef ayın son geçerli gününe sınırlar. 2024 artık yıl olduğu için Şubat 29 gündür. Bu işlem 30 gün eklemekle aynı değildir. Ham girdi bölümüne aşağıdaki kaydı yapıştırarak aynı hesabı yeniden üretebilirsiniz.",
      "Enter 2024-01-31 as the date, 1 as months, and 0 in the other offset fields. The result date must be 2024-02-29. The tool changes year and month first, then clamps the original day to the last valid day of that month. February has 29 days in leap year 2024. This differs from adding 30 days. Paste the record below into raw input to reproduce the same calculation.",
      "Datum 2024-01-31, Monate 1 und alle anderen Abstände 0 eingeben. Das Ergebnisdatum muss 2024-02-29 sein. Das Werkzeug ändert zuerst Jahr und Monat und begrenzt dann den ursprünglichen Tag auf den letzten gültigen Tag im Zielmonat. Im Schaltjahr 2024 hat Februar 29 Tage. Das ist nicht dasselbe wie 30 Tage zu addieren. Mit der Roheingabe unten lässt sich die Rechnung wiederholen.",
      "日期填 2024-01-31，月份填 1，其余偏移填 0。结果日期应为 2024-02-29。工具先修改年和月，再把原来的日限制在目标月份的最后一个有效日。2024 是闰年，二月有 29 天；这与增加 30 天不同。也可将下方记录粘贴到原始输入中复现。"),
    caution: l(
      "2023-02-29 takvimde yoktur ve reddedilmelidir; otomatik olarak Mart'a kaydırılmamalıdır. Gün farkı ay hesabından sonra, Pazartesi–Cuma farkı ise en son uygulanır. Örneğe days=1 eklerseniz 2024-03-01 elde edersiniz. İş günü alanı bölgesel tatilleri bilmez; bu sonuç bir sözleşmenin veya resmi sürenin son gününü doğrulamaz.",
      "2023-02-29 does not exist and must fail rather than silently roll into March. Calendar days are applied after months; Monday–Friday offsets are applied last. Changing days to 1 in this fixture gives 2024-03-01. The business-day field has no regional holiday calendar and cannot certify a contractual or statutory deadline.",
      "2023-02-29 existiert nicht und muss einen Fehler auslösen, statt in den März zu wechseln. Kalendertage folgen auf Monate, Montag–Freitag-Abstände zuletzt. Mit days=1 ergibt dieses Beispiel 2024-03-01. Das Werktagsfeld kennt keine regionalen Feiertage und bestätigt keine vertraglichen oder gesetzlichen Fristen.",
      "2023-02-29 不存在，必须报错，不能默默顺延到三月。日偏移在月份之后执行，周一至周五偏移最后执行。把本例的 days 改为 1，应得到 2024-03-01。工作日字段不包含地区节假日，因此不能据此确认合同或法定期限。"),
    source: { title: "MDN · Date.setUTCMonth (calendar overflow)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setUTCMonth" },
  },
  {
    tool: "content-disposition-olusturucu",
    title: l("İndirme adı: Türkçe karakterleri koruyun", "Download names: preserve non-ASCII characters", "Downloadnamen: Sonderzeichen erhalten", "下载名称：保留非 ASCII 字符"),
    input: "type=attachment\nfilename=çay raporu.pdf",
    output: "Content-Disposition: attachment; filename=\"cay raporu.pdf\"; filename*=UTF-8''%C3%A7ay%20raporu.pdf",
    counterexample: "type=attachment\nfilename=",
    explanation: l(
      "Tür olarak attachment, dosya adı olarak çay raporu.pdf girin. Çıktının ilk satırı aşağıdaki başlık olmalıdır. filename eski istemciler için ASCII yedeğini, filename* ise UTF-8 dosya adını taşır. Bu örnekte ç, UTF-8 baytlarıyla %C3%A7; boşluk ise %20 olur. Dosya adı sunucu yanıtında nasıl yorumlanıyorsa tarayıcıdaki önerilen kayıt adı da ona göre belirlenir; yalnız oluşturulan metne bakmak yeterli değildir.",
      "Choose attachment and enter çay raporu.pdf as the filename. The first output line must match the header below. filename carries an ASCII fallback; filename* carries the UTF-8 name. In this fixture ç becomes its UTF-8 bytes %C3%A7 and the space becomes %20. Verify the suggested save name in the receiving browser as well as the generated text, because the actual server response determines how the name is interpreted.",
      "attachment wählen und çay raporu.pdf als Dateinamen eingeben. Die erste Ausgabezeile muss dem Header unten entsprechen. filename enthält die ASCII-Ausweichform, filename* den UTF-8-Namen. Im Beispiel wird ç zu seinen UTF-8-Bytes %C3%A7 und das Leerzeichen zu %20. Neben dem erzeugten Text auch den vorgeschlagenen Speichernamen im Zielbrowser prüfen: Entscheidend ist die tatsächliche Serverantwort.",
      "类型选择 attachment，文件名填 çay raporu.pdf。输出第一行应与下方标头一致。filename 提供 ASCII 回退名称，filename* 携带 UTF-8 名称。本例的 ç 变为 UTF-8 字节 %C3%A7，空格变为 %20。还需在接收浏览器中核验建议保存名称，因为最终解释取决于实际服务器响应。"),
    caution: l(
      "Boş filename alanı hata vermelidir. Bu araç dosya oluşturmaz, sunucu ayarını değiştirmez ve dosyanın güvenli olduğunu onaylamaz. Başlığı yanıtınıza eklerken yalnız ilk satırı kullanın; alttaki açıklama başlığın parçası değildir. Uygulamanız ayrıca yol parçalarını, uzantıları ve çakışan dosya adlarını kontrol etmelidir. Özel bilgiler içeren dosya adlarını herkese açık yanıtlarda kullanmayın.",
      "An empty filename field must fail. This tool does not create a file, configure a server, or certify file safety. Use only the first line when setting a response header; the explanatory report is not part of the header. Your application must separately handle path components, extensions, and conflicting filenames. Avoid exposing private information through public download names.",
      "Ein leeres filename-Feld muss scheitern. Das Werkzeug erzeugt keine Datei, konfiguriert keinen Server und bestätigt keine Dateisicherheit. Für einen Antwort-Header nur die erste Zeile verwenden; der erläuternde Bericht gehört nicht hinein. Pfadbestandteile, Erweiterungen und Namenskonflikte muss die Anwendung separat prüfen. Private Angaben gehören nicht in öffentliche Downloadnamen.",
      "filename 为空时必须报错。此工具不会创建文件、配置服务器或证明文件安全。设置响应标头时只使用第一行，下方说明不是标头的一部分。应用仍需单独处理路径片段、扩展名和名称冲突。不要通过公开下载名称泄露私人信息。"),
    source: { title: "MDN · Content-Disposition", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition" },
  },
);

export const exampleGuideTools: Record<string, string[]> = {
  "browser-tool-handoff-json-csv-base64": ["json-csv-donusturucu", "base64-kodlayici"],
  "json-schema-image-hash-workflow": ["json-bicimlendirici"],
  "liste-csv-json-cihazda-temizleme": ["json-csv-donusturucu", "url-kodlayici"],
};
export const getEditorialExample = (slug: string) => editorialExamples.find((example) => example.tool === slug);
