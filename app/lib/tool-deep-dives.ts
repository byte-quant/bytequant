import type { Locale } from "./site";

type LocalizedText = Record<Locale, string>;

export type ToolDeepDive = {
  situation: LocalizedText;
  fixture: LocalizedText;
  evidence: LocalizedText;
  failure: LocalizedText;
};

const l = (tr: string, en: string, de: string, zh: string): LocalizedText => ({ tr, en, de, zh });

/**
 * Hand-reviewed examples for high-intent landing pages. These are deliberately
 * concrete: each record describes a reproducible input, a useful acceptance
 * signal, and a reason to stop. They complement—not replace—the live demo.
 */
const deepDives: Record<string, ToolDeepDive> = {
  "curl-kod-donusturucu": {
    situation: l(
      "Bir API belgesindeki cURL örneğini JavaScript `fetch` taslağına çevirip URL, yöntem, başlık ve gövdenin korunduğunu denetlemek.",
      "Convert a cURL example from API documentation into a JavaScript `fetch` draft and verify the URL, method, headers, and body.",
      "Ein cURL-Beispiel aus einer API-Dokumentation in einen JavaScript-`fetch`-Entwurf umwandeln und URL, Methode, Header sowie Body prüfen.",
      "将 API 文档中的 cURL 示例转换为 JavaScript `fetch` 草稿，并核对 URL、方法、请求头和正文。",
    ),
    fixture: l(
      "Yapay bir `https://api.example.test/items` adresine POST yapan, JSON `Content-Type` başlığı ve `{\"name\":\"demo\"}` gövdesi içeren komut kullanın; gerçek erişim anahtarı eklemeyin.",
      "Use a command that POSTs to synthetic `https://api.example.test/items` with a JSON `Content-Type` header and `{\"name\":\"demo\"}` body; include no real access token.",
      "Nutzen Sie einen POST an die synthetische Adresse `https://api.example.test/items` mit JSON-`Content-Type` und dem Body `{\"name\":\"demo\"}`; keinen echten Zugriffsschlüssel einfügen.",
      "使用向合成地址 `https://api.example.test/items` 发送 POST 的命令，包含 JSON `Content-Type` 和 `{\"name\":\"demo\"}` 正文；不要加入真实访问令牌。",
    ),
    evidence: l(
      "Üretilen kod aynı yöntem, URL, başlık ve JSON gövdesini açıkça gösterir; komut çalıştırılmaz ve ağ isteği yapılmaz.",
      "Generated code shows the same method, URL, header, and JSON body; the command is not executed and no network request is made.",
      "Der erzeugte Code zeigt dieselbe Methode, URL, denselben Header und JSON-Body; der Befehl wird nicht ausgeführt und keine Netzwerkanfrage gesendet.",
      "生成的代码明确保留相同的方法、URL、请求头和 JSON 正文；不会执行命令，也不会发起网络请求。",
    ),
    failure: l(
      "Kabuk değişkeni, dosya yükleme, sertifika seçeneği veya karmaşık yönlendirme sessizce kayboluyorsa kodu çalıştırmayın; eksik davranışı hedef dilde elle uygulayın.",
      "Do not run the code if shell variables, file uploads, certificate options, or complex redirects disappear silently; implement the missing behavior explicitly in the target language.",
      "Code nicht ausführen, wenn Shell-Variablen, Datei-Uploads, Zertifikatsoptionen oder komplexe Weiterleitungen still verloren gehen; fehlendes Verhalten explizit ergänzen.",
      "如果 Shell 变量、文件上传、证书选项或复杂重定向被静默丢弃，请不要运行代码，并在目标语言中明确补上缺失行为。",
    ),
  },
  "exif-meta-veri-temizleyici": {
    situation: l(
      "Bir fotoğrafı herkese açık paylaşmadan önce konum, cihaz ve çekim zamanı meta verilerini inceleyip temiz bir kopya üretmek.",
      "Inspect location, device, and capture-time metadata before sharing a photo publicly, then create a clean copy.",
      "Vor der öffentlichen Freigabe eines Fotos Standort-, Geräte- und Aufnahmezeit-Metadaten prüfen und eine bereinigte Kopie erzeugen.",
      "公开分享照片前，检查位置、设备和拍摄时间元数据，并生成干净副本。",
    ),
    fixture: l(
      "Kendinize ait, hassas kişi veya belge göstermeyen bir test JPEG'i seçin. Önce bulunan alanları not edin, sonra temizlenen dosyayı yeni adla indirin.",
      "Choose your own test JPEG containing no sensitive person or document. Record the detected fields first, then download the cleaned file under a new name.",
      "Ein eigenes Test-JPEG ohne sensible Personen oder Dokumente wählen. Gefundene Felder notieren und die bereinigte Datei unter neuem Namen herunterladen.",
      "选择您自己的测试 JPEG，且不要包含敏感人物或文件；先记录检测到的字段，再用新文件名下载清理后的文件。",
    ),
    evidence: l(
      "Temiz kopya görüntüleyicide açılır; piksel görünümü beklenen düzeydedir ve yeniden taramada hedef meta alanları artık görünmez.",
      "The clean copy opens in an image viewer, its pixels look as expected, and a second scan no longer exposes the targeted metadata fields.",
      "Die bereinigte Kopie öffnet im Bildbetrachter, sieht wie erwartet aus und zeigt bei erneuter Prüfung die Ziel-Metadaten nicht mehr.",
      "清理后的副本可在图片查看器中打开，像素外观符合预期，再次扫描时目标元数据字段不再出现。",
    ),
    failure: l(
      "Yeniden taramada GPS/cihaz bilgisi kalıyorsa, renk yönü bozuluyorsa veya biçim desteklenmiyorsa dosyayı paylaşmayın; başka bir güvenilir dışa aktarma yolu kullanın.",
      "Do not share if a rescan still finds GPS or device data, orientation or colour is damaged, or the format is unsupported; use another trusted export path.",
      "Nicht teilen, wenn GPS-/Gerätedaten verbleiben, Ausrichtung oder Farbe beschädigt ist oder das Format nicht unterstützt wird; einen anderen vertrauenswürdigen Exportweg nutzen.",
      "如果重新扫描仍发现 GPS 或设备信息、方向或颜色受损，或格式不受支持，请不要分享，并使用其他可信导出方式。",
    ),
  },
  "json-bicimlendirici": {
    situation: l(
      "Bir API yanıtını hata kaydına eklemeden önce sözdizimini doğrulayıp ekipçe okunabilir hâle getirmek.",
      "Validate an API response and make it readable before attaching it to an incident report.",
      "Eine API-Antwort vor dem Anhängen an einen Incident-Bericht validieren und lesbar formatieren.",
      "在将 API 响应附到故障报告前，先验证语法并整理为易读格式。",
    ),
    fixture: l(
      "`{\"requestId\":\"r-104\",\"ok\":true,\"items\":[{\"id\":7,\"stock\":0}]}` örneğini biçimlendirin; sonra kapanış süslü parantezini silerek hata yolunu da deneyin.",
      "Format `{\"requestId\":\"r-104\",\"ok\":true,\"items\":[{\"id\":7,\"stock\":0}]}`, then remove the final brace to exercise the error path.",
      "Formatieren Sie `{\"requestId\":\"r-104\",\"ok\":true,\"items\":[{\"id\":7,\"stock\":0}]}` und entfernen Sie danach die letzte Klammer, um den Fehlerweg zu prüfen.",
      "格式化 `{\"requestId\":\"r-104\",\"ok\":true,\"items\":[{\"id\":7,\"stock\":0}]}`，再删除最后一个花括号以测试错误路径。",
    ),
    evidence: l(
      "`ok` boolean, `stock` sayı ve boş olmayan `items` dizisi olarak kalır; yalnız girinti değişir. Bozuk sürüm açık bir ayrıştırma hatası verir.",
      "`ok` remains a boolean, `stock` remains numeric, and `items` remains an array; only whitespace changes. The broken variant returns an explicit parse error.",
      "`ok` bleibt boolesch, `stock` numerisch und `items` ein Array; nur die Einrückung ändert sich. Die fehlerhafte Variante liefert einen klaren Parse-Fehler.",
      "`ok` 仍为布尔值、`stock` 仍为数字、`items` 仍为数组；只有缩进发生变化。损坏版本会返回明确的解析错误。",
    ),
    failure: l(
      "Alan türü değişiyorsa, sayı hassasiyeti kayboluyorsa veya çıktı geçersiz girdiye rağmen başarılı görünüyorsa sonucu aktarmayın.",
      "Do not hand off the result if a field type changes, numeric precision is lost, or malformed input appears successful.",
      "Übergeben Sie das Ergebnis nicht, wenn sich ein Feldtyp ändert, Zahlengenauigkeit verloren geht oder fehlerhafte Eingabe als erfolgreich erscheint.",
      "如果字段类型改变、数字精度丢失，或无效输入仍显示成功，请不要继续传递结果。",
    ),
  },
  "json-csv-donusturucu": {
    situation: l(
      "Üç satırlık bir ürün listesini e-tabloya aktarıp daha sonra kayıpsız biçimde yeniden JSON'a çevirmek.",
      "Move a three-row product list into a spreadsheet and convert it back to JSON without silent loss.",
      "Eine Produktliste mit drei Zeilen in eine Tabelle übertragen und ohne stillen Verlust zurück nach JSON konvertieren.",
      "将三行商品列表导入电子表格，再无损地转换回 JSON。",
    ),
    fixture: l(
      "Adında virgül ve çift tırnak bulunan bir kayıt, boş bir hücre ve `0` stok değeri içeren düz nesne dizisi kullanın.",
      "Use a flat object array containing one name with a comma and quote, one empty cell, and a stock value of `0`.",
      "Verwenden Sie ein flaches Objekt-Array mit einem Namen samt Komma und Anführungszeichen, einer leeren Zelle und dem Lagerwert `0`.",
      "使用扁平对象数组，其中包含带逗号和引号的名称、一个空单元格以及库存值 `0`。",
    ),
    evidence: l(
      "CSV başlık sayısı kaynak alan sayısıyla eşleşir; özel karakterli hücre tırnaklanır; geri dönüşte kayıt ve alan sayısı korunur.",
      "The CSV header count matches the source fields, the special-character cell is quoted, and the round trip preserves row and field counts.",
      "Die Anzahl der CSV-Spalten entspricht den Quellfeldern, die Sonderzeichen-Zelle ist korrekt zitiert und der Rückweg erhält Zeilen- und Feldzahl.",
      "CSV 表头数量与源字段一致，特殊字符单元格被正确引用，往返转换后行数和字段数保持不变。",
    ),
    failure: l(
      "İç içe nesne, dizi veya tür bilgisinin korunması gerekiyorsa düz CSV'yi son biçim olarak kullanmayın; önce bir düzleştirme sözleşmesi belirleyin.",
      "If nested objects, arrays, or value types must survive, do not use flat CSV as the final format; define a flattening contract first.",
      "Wenn verschachtelte Objekte, Arrays oder Werttypen erhalten bleiben müssen, verwenden Sie flaches CSV nicht als Endformat; definieren Sie zuerst einen Flattening-Vertrag.",
      "如果必须保留嵌套对象、数组或值类型，请不要把扁平 CSV 作为最终格式；先定义扁平化约定。",
    ),
  },
  "kvkk-veri-maskeleyici": {
    situation: l(
      "Bir destek kaydını geliştirici ekibiyle paylaşmadan önce e-posta, telefon, IBAN ve IP adresini görünür yer tutucularla değiştirmek.",
      "Replace email, phone, IBAN, and IP values with visible placeholders before sharing a support ticket with developers.",
      "E-Mail, Telefon, IBAN und IP-Adresse vor der Weitergabe eines Support-Tickets an das Entwicklungsteam durch sichtbare Platzhalter ersetzen.",
      "在向开发团队分享客服记录前，用清晰占位符替换邮箱、电话、IBAN 和 IP 地址。",
    ),
    fixture: l(
      "Tamamen yapay bir kayıt kullanın: `Ada Test`, `ada@example.test`, `+90 555 000 00 00`, örnek IBAN ve `192.0.2.10`; aynı satıra bir sipariş numarası da ekleyin.",
      "Use a fully synthetic record: `Ada Test`, `ada@example.test`, `+90 555 000 00 00`, a sample IBAN, and `192.0.2.10`; include an order number on the same line.",
      "Nutzen Sie einen vollständig synthetischen Datensatz: `Ada Test`, `ada@example.test`, `+90 555 000 00 00`, eine Beispiel-IBAN und `192.0.2.10`; ergänzen Sie eine Bestellnummer.",
      "使用完全合成的记录：`Ada Test`、`ada@example.test`、`+90 555 000 00 00`、示例 IBAN 和 `192.0.2.10`，并在同一行加入订单号。",
    ),
    evidence: l(
      "Hassas desenler türü belli yer tutuculara dönüşür; sipariş numarası ve sorunu anlatan metin korunur. Önce/sonra görünümünde istemeden silinen bağlam yoktur.",
      "Sensitive patterns become type-labelled placeholders while the order number and issue description remain. The before/after view shows no unintended context loss.",
      "Sensible Muster werden durch typisierte Platzhalter ersetzt; Bestellnummer und Problembeschreibung bleiben erhalten. Der Vorher-Nachher-Vergleich zeigt keinen unbeabsichtigten Kontextverlust.",
      "敏感模式变为带类型标签的占位符，订单号和问题描述仍保留；前后对比中没有意外的上下文丢失。",
    ),
    failure: l(
      "Gerçek ad, serbest metindeki dolaylı kimlik veya kuruma özgü müşteri numarası görünür kalıyorsa paylaşmayın; alan envanterini elle tamamlayın.",
      "Do not share if a real name, an indirect identifier in free text, or an organisation-specific customer number remains visible; complete the field inventory manually.",
      "Nicht teilen, wenn Realname, indirekte Kennung im Freitext oder organisationsspezifische Kundennummer sichtbar bleibt; Feldinventar manuell ergänzen.",
      "如果真实姓名、自由文本中的间接标识符或机构专用客户编号仍可见，请不要分享，并人工补全字段清单。",
    ),
  },
  "pdf-birlestirme": {
    situation: l(
      "Bir başvuru formu ile eklerini doğru sırada tek PDF olarak teslim etmek ve kaynak dosyaları cihazda tutmak.",
      "Deliver an application form and its attachments as one correctly ordered PDF while keeping the source files on-device.",
      "Antragsformular und Anlagen in korrekter Reihenfolge als eine PDF ausgeben, während die Quelldateien auf dem Gerät bleiben.",
      "将申请表及附件按正确顺序合并为一个 PDF，同时让源文件留在设备上。",
    ),
    fixture: l(
      "İki küçük, şifresiz PDF seçin: önce iki sayfalık form, sonra tek sayfalık ek. Birleştirmeden önce dosya adını ve sayfa sırasını kontrol edin.",
      "Choose two small, unencrypted PDFs: a two-page form followed by a one-page attachment. Confirm filenames and page order before merging.",
      "Wählen Sie zwei kleine, unverschlüsselte PDFs: zuerst ein zweiseitiges Formular, danach eine einseitige Anlage. Dateinamen und Reihenfolge vor dem Zusammenführen prüfen.",
      "选择两个较小且未加密的 PDF：先放两页申请表，再放一页附件；合并前确认文件名和页面顺序。",
    ),
    evidence: l(
      "İndirilen dosya üç sayfa açılır; form sayfaları önde, ek sonda ve metin/görseller görünür durumdadır.",
      "The downloaded file opens with three pages; the form comes first, the attachment last, and all text and images remain visible.",
      "Die heruntergeladene Datei öffnet sich mit drei Seiten; Formular zuerst, Anlage zuletzt, Text und Bilder bleiben sichtbar.",
      "下载文件可正常打开且共有三页：申请表在前、附件在后，所有文字和图像均可见。",
    ),
    failure: l(
      "Şifreli, bozuk veya etkileşimli form alanları içeren bir kaynak uyarı verirse özgün dosyaları silmeyin; hedef görüntüleyicide her sayfayı doğrulamadan teslim etmeyin.",
      "If an encrypted, damaged, or interactive-form source raises a warning, keep the originals and do not deliver until every page is checked in the target viewer.",
      "Bei Warnungen zu verschlüsselten, beschädigten oder interaktiven PDFs die Originale behalten und erst nach Kontrolle jeder Seite im Ziel-Viewer ausliefern.",
      "如果加密、损坏或含交互表单的源文件触发警告，请保留原件，并在目标阅读器逐页检查前不要交付。",
    ),
  },
  "qr-kod-olusturucu": {
    situation: l(
      "Bir etkinlik kayıt bağlantısını basılı afişe eklemeden önce okunabilir bir QR kod üretip hedef adresi bağımsız olarak doğrulamak.",
      "Generate a readable QR code for an event registration poster and independently verify its destination before printing.",
      "Einen lesbaren QR-Code für einen Veranstaltungslink erzeugen und das Ziel vor dem Druck unabhängig prüfen.",
      "为活动报名海报生成可读二维码，并在印刷前独立核验目标地址。",
    ),
    fixture: l(
      "`https://example.test/register?event=demo` gibi kişisel veri içermeyen kısa bir test URL'si kullanın; açık ve koyu temada önizleyin, PNG ve SVG çıktısını deneyin.",
      "Use a short, non-personal test URL such as `https://example.test/register?event=demo`; preview it in light and dark themes and try both PNG and SVG output.",
      "Eine kurze Test-URL ohne Personendaten wie `https://example.test/register?event=demo` verwenden; in hellem und dunklem Theme sowie als PNG und SVG prüfen.",
      "使用不含个人信息的短测试 URL，例如 `https://example.test/register?event=demo`；在浅色和深色主题预览，并测试 PNG 与 SVG 输出。",
    ),
    evidence: l(
      "İki farklı güncel telefon kamerayla tarama aynı açık hedef URL'yi gösterir; kenar boşluğu korunur ve görsel küçük boyutta da seçilebilir.",
      "Scanning with two current phone cameras shows the same explicit destination URL; the quiet zone remains intact and the code is readable at the intended size.",
      "Scans mit zwei aktuellen Smartphone-Kameras zeigen dieselbe klare Ziel-URL; Ruhezone und Lesbarkeit in der Zielgröße bleiben erhalten.",
      "使用两部现代手机扫描时均显示相同且明确的目标 URL；静区保持完整，在预期尺寸下仍可识别。",
    ),
    failure: l(
      "Tarayıcı hedefi göstermeden açıyorsa, kod düşük kontrastlıysa veya baskı ölçeğinde okunmuyorsa yayımlamayın; daha kısa URL ve daha yüksek kontrast kullanın.",
      "Do not publish if the scanner opens without showing the destination, contrast is weak, or the printed size is unreadable; use a shorter URL and stronger contrast.",
      "Nicht veröffentlichen, wenn der Scanner das Ziel nicht anzeigt, der Kontrast schwach oder die Druckgröße unlesbar ist; kürzere URL und höheren Kontrast wählen.",
      "如果扫描器未显示目标便直接打开、对比度过低或印刷尺寸无法识别，请不要发布；请使用更短 URL 和更高对比度。",
    ),
  },
  "jwt-decoder": {
    situation: l(
      "Bir oturum hatasını incelerken token içindeki `iss`, `aud`, `exp` ve rol alanlarını okumak; fakat kullanıcı kimliği hakkında karar vermemek.",
      "Read `iss`, `aud`, `exp`, and role claims while diagnosing a session issue—without treating them as proof of identity.",
      "Bei einer Sitzungsanalyse die Claims `iss`, `aud`, `exp` und Rolle lesen, ohne sie als Identitätsnachweis zu behandeln.",
      "排查会话问题时读取 `iss`、`aud`、`exp` 和角色声明，但不把它们当作身份证明。",
    ),
    fixture: l(
      "Yalnız sentetik bir JWT kullanın. Yükte geçmiş bir `exp`, beklenen test `aud` değeri ve kişisel veri içermeyen örnek bir rol bulunsun.",
      "Use a synthetic JWT only. Put an expired `exp`, the expected test `aud`, and a non-personal sample role in its payload.",
      "Nur ein synthetisches JWT verwenden. Der Payload enthält ein abgelaufenes `exp`, die erwartete Test-`aud` und eine nicht personenbezogene Beispielrolle.",
      "仅使用合成 JWT；载荷包含已过期的 `exp`、预期测试 `aud` 以及不含个人信息的示例角色。",
    ),
    evidence: l(
      "Header ve payload ayrı, geçerli JSON olarak görünür; Unix zamanı okunabilir tarihe çevrilebilir. Sayfa imzanın doğrulanmadığını açıkça belirtir.",
      "Header and payload appear as separate valid JSON, and the Unix time can be converted to a readable date. The page clearly states that the signature was not verified.",
      "Header und Payload erscheinen als getrenntes gültiges JSON; die Unix-Zeit lässt sich lesbar umwandeln. Die Seite weist klar auf die fehlende Signaturprüfung hin.",
      "头部和载荷分别显示为有效 JSON，Unix 时间可转换为可读日期；页面明确说明尚未验证签名。",
    ),
    failure: l(
      "Çözülen alanları güvenilir kabul etmeyin. İmza, algoritma, anahtar, issuer ve audience sunucuda doğrulanmadan erişim veya kimlik kararı vermeyin.",
      "Do not trust decoded claims. Make no access or identity decision until signature, algorithm, key, issuer, and audience are verified server-side.",
      "Dekodierte Claims nicht als vertrauenswürdig behandeln. Keine Zugriffs- oder Identitätsentscheidung ohne serverseitige Prüfung von Signatur, Algorithmus, Schlüssel, Issuer und Audience.",
      "不要信任已解码声明；在服务端验证签名、算法、密钥、签发者和受众前，不要作出访问或身份决定。",
    ),
  },
  "regex-test-araci": {
    situation: l(
      "Bir destek kaydındaki `ORD-2026-1042` biçimli sipariş kodlarını bulurken benzer ama geçersiz değerleri dışarıda bırakmak.",
      "Match order codes shaped like `ORD-2026-1042` in support text while excluding similar invalid values.",
      "Bestellcodes im Format `ORD-2026-1042` in Supporttexten finden und ähnliche ungültige Werte ausschließen.",
      "在客服文本中匹配形如 `ORD-2026-1042` 的订单号，同时排除相似但无效的值。",
    ),
    fixture: l(
      "`ORD-2026-1042`, `ord-2026-1042`, `ORD-26-1042` ve çok uzun bir tire dizisini birlikte test edin; kalıp ve bayrakları görünür tutun.",
      "Test `ORD-2026-1042`, `ord-2026-1042`, `ORD-26-1042`, and a very long dash sequence together; keep the pattern and flags visible.",
      "Testen Sie gemeinsam `ORD-2026-1042`, `ord-2026-1042`, `ORD-26-1042` und eine sehr lange Bindestrichfolge; Muster und Flags sichtbar halten.",
      "同时测试 `ORD-2026-1042`、`ord-2026-1042`、`ORD-26-1042` 以及很长的连字符序列，并保持模式和标志可见。",
    ),
    evidence: l(
      "Beklenen pozitif örnek eşleşir, negatif örnekler eşleşmez; konum ve yakalama grupları anlaşılırdır; uzun sınır girdisi arayüzü kilitlemez.",
      "The intended positive sample matches, negative samples do not, positions and capture groups are clear, and the long boundary input does not lock the interface.",
      "Das erwartete Positivbeispiel trifft, Negativbeispiele nicht; Positionen und Gruppen sind klar, die lange Grenzeingabe blockiert die Oberfläche nicht.",
      "预期正例匹配、反例不匹配，位置和捕获组清晰，长边界输入不会锁死界面。",
    ),
    failure: l(
      "Kalıp iç içe sınırsız tekrarlar içeriyorsa veya hedef çalışma zamanı JavaScript'ten farklıysa yayımlamadan önce o motorda performans testi yapın.",
      "If the pattern contains nested unbounded repetition or the target runtime differs from JavaScript, performance-test it in that engine before release.",
      "Bei verschachtelten unbegrenzten Wiederholungen oder einer von JavaScript abweichenden Ziellaufzeit vor Veröffentlichung in dieser Engine testen.",
      "如果模式包含嵌套的无限重复，或目标运行时并非 JavaScript，请在发布前用对应引擎做性能测试。",
    ),
  },
  "markdown-onizleyici": {
    situation: l(
      "Bir README bölümünü yayımlamadan önce başlık, bağlantı, liste, kod ve tablo görünümünü birlikte kontrol etmek.",
      "Review headings, links, lists, code, and a table together before publishing a README section.",
      "Überschriften, Links, Listen, Code und Tabelle eines README-Abschnitts vor der Veröffentlichung gemeinsam prüfen.",
      "在发布 README 章节前，一并检查标题、链接、列表、代码和表格的呈现。",
    ),
    fixture: l(
      "Tek bir örnekte H2 başlık, iki maddelik liste, göreli bağlantı, dil etiketli kod bloğu, tablo ve ham `<script>` metni kullanın.",
      "Use one sample containing an H2, a two-item list, a relative link, a language-tagged code fence, a table, and literal `<script>` text.",
      "Ein Beispiel mit H2, Zweipunktliste, relativem Link, Codeblock mit Sprachkennung, Tabelle und wörtlichem `<script>`-Text verwenden.",
      "使用一个包含 H2、两项列表、相对链接、带语言标记的代码块、表格和原样 `<script>` 文本的示例。",
    ),
    evidence: l(
      "Başlık sırası korunur, bağlantı hedefi görünür, kod çalıştırılmaz ve çıktı kodu önizlemeyle aynı yapıyı temsil eder.",
      "Heading order is preserved, the link destination is inspectable, code does not execute, and the output markup represents the same structure as the preview.",
      "Überschriftenfolge bleibt erhalten, Linkziel ist prüfbar, Code wird nicht ausgeführt und Ausgabemarkup entspricht der Vorschau.",
      "标题顺序保持不变，链接目标可检查，代码不会执行，输出标记与预览结构一致。",
    ),
    failure: l(
      "Ham HTML beklenmedik biçimde çalışıyor, bağlantı hedefi belirsizleşiyor veya başlık hiyerarşisi atlıyorsa çıktıyı yayımlamayın.",
      "Do not publish if raw HTML executes unexpectedly, a link destination becomes unclear, or the heading hierarchy skips levels.",
      "Nicht veröffentlichen, wenn Roh-HTML unerwartet ausgeführt wird, Linkziele unklar werden oder Überschriftenebenen übersprungen sind.",
      "如果原始 HTML 意外执行、链接目标不清楚或标题层级跳级，请不要发布。",
    ),
  },
  "gorsel-sikistirici": {
    situation: l(
      "Bir ürün görselinin dosya boyutunu düşürürken okunabilir etiketleri ve gerekli ayrıntıyı korumak.",
      "Reduce a product image's file size while preserving readable labels and necessary detail.",
      "Die Dateigröße eines Produktbilds reduzieren, ohne lesbare Beschriftungen und notwendige Details zu verlieren.",
      "压缩商品图片文件大小，同时保留可读标签和必要细节。",
    ),
    fixture: l(
      "Kişisel veri ve konum bilgisi içermeyen bir test görselini üç kalite düzeyinde işleyin; aynı yakınlaştırma oranında özgün dosyayla karşılaştırın.",
      "Process a test image with no personal data or location metadata at three quality levels, then compare each result with the original at the same zoom.",
      "Ein Testbild ohne personenbezogene Daten oder Standortmetadaten in drei Qualitätsstufen verarbeiten und bei gleicher Vergrößerung mit dem Original vergleichen.",
      "对不含个人数据或位置元数据的测试图片使用三种质量级别处理，并在相同缩放比例下与原图比较。",
    ),
    evidence: l(
      "Yeni dosya daha küçüktür, hedef biçimde açılır ve ince yazı/kenarlarda kabul edilemez bozulma yoktur; boyut kazancı görünürdür.",
      "The new file is smaller, opens in the target format, and shows no unacceptable damage around fine text or edges; the size saving is visible.",
      "Die neue Datei ist kleiner, öffnet im Zielformat und zeigt an feinen Schriften oder Kanten keine unzumutbaren Artefakte; die Einsparung ist sichtbar.",
      "新文件更小、可用目标格式打开，细小文字或边缘没有不可接受的失真，并能看到明确的体积节省。",
    ),
    failure: l(
      "Metin bulanıklaşıyor, renkler belirgin kayıyor veya hedef uygulama dosyayı açmıyorsa daha yüksek kalite ya da farklı biçim seçin; özgün dosyayı koruyun.",
      "If text becomes blurry, colours shift visibly, or the target application cannot open the file, choose a higher quality or different format and keep the original.",
      "Wenn Text unscharf wird, Farben sichtbar kippen oder die Zielanwendung die Datei nicht öffnet, höhere Qualität oder ein anderes Format wählen und das Original behalten.",
      "如果文字变模糊、颜色明显偏移或目标应用无法打开文件，请提高质量或更换格式，并保留原图。",
    ),
  },
  "cron-ifadesi-aciklayici": {
    situation: l(
      "Her gece yedek alan bir görevin beklenmedik saatte çalışmasını önlemek için beş alanlı cron ifadesini, sunucu saat dilimini ve yaz saati etkisini birlikte incelemek.",
      "Review a five-field cron expression, server time zone, and daylight-saving impact together so a nightly backup does not run at an unexpected hour.",
      "Einen fünfteiligen Cron-Ausdruck zusammen mit Serverzeitzone und Sommerzeit prüfen, damit eine nächtliche Sicherung nicht unerwartet ausgeführt wird.",
      "同时检查五字段 Cron 表达式、服务器时区和夏令时影响，避免夜间备份在意外时间运行。",
    ),
    fixture: l(
      "`0 3 * * 1-5` ifadesini deneyin; hedef sistemin klasik beş alan kullandığını ve `3` değerini hangi saat diliminde yorumladığını ayrıca not edin.",
      "Try `0 3 * * 1-5`; separately record that the target scheduler uses the classic five fields and which time zone interprets the value `3`.",
      "Testen Sie `0 3 * * 1-5`; halten Sie zusätzlich fest, dass der Ziel-Scheduler fünf Felder nutzt und in welcher Zeitzone der Wert `3` gilt.",
      "测试 `0 3 * * 1-5`；另行记录目标调度器采用经典五字段格式，以及数值 `3` 按哪个时区解释。",
    ),
    evidence: l(
      "Dakika, saat ve hafta günü alanları ayrı ayrı geçerlidir; açıklama hafta içi 03:00 anlamını verir ve üretim ortamındaki bir sonraki üç çalıştırma zamanı bununla uyuşur.",
      "Minute, hour, and weekday fields validate separately; the explanation says 03:00 on weekdays and the scheduler's next three production run times agree.",
      "Minute, Stunde und Wochentag sind einzeln gültig; die Erklärung nennt werktags 03:00 und die nächsten drei Läufe des Zielsystems stimmen überein.",
      "分钟、小时和星期字段均分别有效；说明显示工作日 03:00，且目标系统接下来的三次运行时间与之相符。",
    ),
    failure: l(
      "Hedef sistem altı/yedi alan, farklı hafta günü numarası veya UTC kullanıyorsa açıklamayı doğrudan kopyalamayın; zamanlayıcının kendi önizlemesiyle yeniden doğrulayın.",
      "If the target uses six or seven fields, different weekday numbering, or UTC, do not copy the explanation into production; verify it with that scheduler's own preview.",
      "Bei sechs oder sieben Feldern, anderer Wochentagsnummerierung oder UTC die Erklärung nicht direkt übernehmen, sondern im Ziel-Scheduler erneut prüfen.",
      "如果目标系统使用六/七字段、不同星期编号或 UTC，请勿直接用于生产，应在该调度器自身的预览中重新核验。",
    ),
  },
  "guclu-parola-uretici": {
    situation: l(
      "Yeni ve benzersiz bir hesap parolası üretirken tarayıcının kriptografik rastgeleliğini kullanmak ve sonucu yalnız güvenilir parola yöneticisine aktarmak.",
      "Create a new unique account password with cryptographic browser randomness and transfer it only to a trusted password manager.",
      "Ein neues eindeutiges Kontopasswort mit kryptografischer Browser-Zufälligkeit erzeugen und nur in einen vertrauenswürdigen Passwortmanager übernehmen.",
      "使用浏览器的加密随机数生成全新且唯一的账户密码，并只保存到可信密码管理器。",
    ),
    fixture: l(
      "24 ve 32 karakter uzunluklarında iki sentetik sonuç üretin; her birinde büyük/küçük harf, rakam ve sembol bulunduğunu görünür ölçülerden kontrol edin.",
      "Generate synthetic results at lengths 24 and 32, then use the visible metrics to confirm that each contains upper- and lowercase letters, digits, and symbols.",
      "Erzeugen Sie synthetische Ergebnisse mit 24 und 32 Zeichen und prüfen Sie anhand der sichtbaren Werte Groß-/Kleinbuchstaben, Ziffern und Symbole.",
      "分别生成 24 位和 32 位的合成结果，并通过可见指标确认其中包含大小写字母、数字和符号。",
    ),
    evidence: l(
      "Her üretimde sonuç değişir, seçilen uzunluk korunur ve kaynak Web Crypto olarak görünür; parola sayfayı yenilediğinizde kalıcı uygulama alanında bulunmaz.",
      "Each run produces a different value at the chosen length, identifies Web Crypto as the source, and does not persist the password in application storage after reload.",
      "Jeder Lauf liefert einen anderen Wert in gewählter Länge, nennt Web Crypto als Quelle und speichert das Passwort nach Neuladen nicht im Anwendungsspeicher.",
      "每次生成的值都不同、长度符合选择，来源显示为 Web Crypto；刷新页面后密码不会保存在应用持久存储中。",
    ),
    failure: l(
      "Sonucu birden fazla hesapta kullanmayın, mesaja veya düz metin notuna koymayın; pano geçmişi olan paylaşılan cihazda üretim yaptıysanız panoyu temizleyin.",
      "Do not reuse the result across accounts or place it in chat or a plain-text note; clear clipboard history after generation on a shared device.",
      "Das Ergebnis nicht für mehrere Konten verwenden oder in Chat bzw. Klartextnotizen ablegen; auf gemeinsam genutzten Geräten den Zwischenablageverlauf löschen.",
      "不要在多个账户重复使用，也不要放入聊天或纯文本笔记；若在共享设备生成，请清理剪贴板历史。",
    ),
  },
  "sifre-gucu-testi": {
    situation: l(
      "Bir parola politikasını değerlendirirken gerçek parolayı paylaşmadan, aynı uzunluk ve yapıdaki sentetik örneklerin tahmin edilebilirlik işaretlerini karşılaştırmak.",
      "Compare predictability signals using synthetic examples with the same length and structure while evaluating a password policy without exposing a real password.",
      "Bei der Bewertung einer Passwortrichtlinie Vorhersagbarkeit anhand synthetischer Beispiele gleicher Länge und Struktur vergleichen, ohne ein echtes Passwort offenzulegen.",
      "评估密码策略时，不暴露真实密码，而是使用长度和结构相同的合成示例比较可预测性信号。",
    ),
    fixture: l(
      "`Summer2026!`, tekrar eden 20 karakter ve beş rastgele sözcüklü sentetik bir parola cümlesini ayrı ayrı deneyin; gerçek hesap parolası kullanmayın.",
      "Test `Summer2026!`, a repeated 20-character pattern, and a synthetic five-word random passphrase separately; never enter a real account password.",
      "Testen Sie `Summer2026!`, ein wiederholtes 20-Zeichen-Muster und eine synthetische zufällige Fünfwort-Passphrase getrennt; kein echtes Passwort eingeben.",
      "分别测试 `Summer2026!`、重复的 20 字符模式和合成的五词随机密码短语；不要输入真实账户密码。",
    ),
    evidence: l(
      "Araç uzunluğun yanında yaygın yıl/kelime, tekrar ve karakter havuzu etkisini açıklar; daha uzun rastgele örnek ölçülebilir biçimde daha yüksek tahmin üretir.",
      "The tool explains common-year or word patterns, repetition, and character-pool effects alongside length; the longer random sample receives a measurably stronger estimate.",
      "Das Werkzeug erklärt neben Länge auch Jahres-/Wortmuster, Wiederholungen und Zeichenvorrat; das längere Zufallsbeispiel erhält eine messbar stärkere Schätzung.",
      "工具除长度外还解释常见年份/词语、重复和字符池影响；更长的随机示例会得到可量化的更强估计。",
    ),
    failure: l(
      "Tahmini kırılma süresini garanti saymayın; çevrim içi hız sınırlaması, sızıntı geçmişi ve saldırgan modeli farklıdır. Gerçek parolayı sızıntı sorgusu yapılmayan bu ön kontrole dayanarak onaylamayın.",
      "Do not treat estimated crack time as a guarantee; online rate limits, breach history, and attacker models differ. Do not approve a real password from this pre-check alone.",
      "Die geschätzte Knackzeit ist keine Garantie; Online-Limits, Leak-Historie und Angreifermodelle unterscheiden sich. Ein echtes Passwort nicht allein damit freigeben.",
      "不要把预计破解时间视为保证；在线限速、泄露历史和攻击模型各不相同，不能仅凭此预检查批准真实密码。",
    ),
  },
  "metin-farki-diff": {
    situation: l(
      "Bir gizlilik bildiriminin yeni sürümünde yükümlülük, saklama süresi veya kişi kategorisi gibi anlamlı değişiklikleri biçim değişikliklerinden ayırmak.",
      "Separate meaningful changes to obligations, retention periods, or data-subject categories from mere formatting changes in a revised privacy notice.",
      "In einer überarbeiteten Datenschutzerklärung Änderungen an Pflichten, Aufbewahrung oder Personengruppen von reiner Formatierung unterscheiden.",
      "在隐私声明新版本中，将义务、保存期限或主体类别等实质变化与单纯格式变化区分开。",
    ),
    fixture: l(
      "Kısa bir sentetik metnin ilk sürümünde `30 gün`, ikinci sürümünde `90 gün` kullanın; ayrıca bir başlığı taşıyıp noktalama değişikliği ekleyin.",
      "Use `30 days` in one short synthetic version and `90 days` in the next; also move a heading and change punctuation.",
      "Verwenden Sie in einer kurzen synthetischen Fassung `30 Tage`, in der nächsten `90 Tage`; verschieben Sie zusätzlich eine Überschrift und ändern Sie Zeichensetzung.",
      "在简短合成文本的第一版写“30 天”，第二版写“90 天”；同时移动一个标题并改变标点。",
    ),
    evidence: l(
      "Eklenen ve silinen parçalar ayrı renk ve etiketle görünür; `30`→`90` değişikliği kolayca bulunur ve özgün iki metin karşılaştırma boyunca korunur.",
      "Insertions and deletions have distinct colours and labels, the `30`→`90` change is easy to locate, and both source texts remain available throughout review.",
      "Einfügungen und Löschungen sind getrennt markiert, die Änderung `30`→`90` ist leicht auffindbar und beide Ausgangstexte bleiben sichtbar.",
      "新增与删除使用不同颜色和标签，`30`→`90` 的变化易于定位，审阅过程中两个原文都保持可见。",
    ),
    failure: l(
      "Araç yeniden sıralanan büyük blokları bağımsız silme/ekleme gibi gösteriyorsa bunu anlamsal karar olarak yorumlamayın; kritik metni bölüm bölüm ve bir editörle inceleyin.",
      "If reordered blocks appear as unrelated deletion and insertion, do not treat that as a semantic verdict; review consequential text section by section with an editor.",
      "Werden verschobene Blöcke als getrennte Löschung und Einfügung dargestellt, ist das kein semantisches Urteil; wichtige Texte abschnittsweise redaktionell prüfen.",
      "如果重排的大段内容显示为独立删除和新增，不要将其视为语义结论；重要文本应逐节并由编辑复核。",
    ),
  },
  "csv-inceleyici": {
    situation: l(
      "Bir müşteri dışa aktarımını JSON veya SQL'e çevirmeden önce ayraç, başlık, sütun sayısı, boş değer ve düzensiz satır sorunlarını sentetik kopyada bulmak.",
      "Find delimiter, header, column-count, empty-value, and irregular-row problems in a synthetic copy before converting a customer export to JSON or SQL.",
      "Vor der Umwandlung eines Kundenexports in JSON oder SQL Trennzeichen, Header, Spaltenzahl, Leerwerte und unregelmäßige Zeilen in einer synthetischen Kopie prüfen.",
      "在将客户导出数据转换为 JSON 或 SQL 前，先在合成副本中发现分隔符、表头、列数、空值和不规则行问题。",
    ),
    fixture: l(
      "Noktalı virgüllü üç sütunlu örneğe bir boş başlık, bir eksik hücre ve tırnak içinde satır sonu ekleyin; gerçek müşteri verisi kullanmayın.",
      "Use a three-column semicolon sample with one blank header, one missing cell, and a quoted line break; do not use real customer data.",
      "Nutzen Sie ein dreispaltiges Semikolon-Beispiel mit leerem Header, fehlender Zelle und zitiertem Zeilenumbruch; keine echten Kundendaten.",
      "使用三列分号分隔的示例，加入一个空表头、一个缺失单元格和一个带引号的换行；不要使用真实客户数据。",
    ),
    evidence: l(
      "Algılanan ayraç doğru görünür; başlık ve düzensiz satır sayıları beklenen değerle eşleşir, tırnaklı satır sonu tek hücre olarak korunur.",
      "The detected delimiter is correct, header and irregular-row counts match expectations, and the quoted line break remains inside one cell.",
      "Das erkannte Trennzeichen stimmt, Header- und Zeilenfehler entsprechen der Erwartung und der zitierte Umbruch bleibt in einer Zelle.",
      "检测到的分隔符正确，表头问题和不规则行数量符合预期，带引号的换行仍保留在同一单元格。",
    ),
    failure: l(
      "Kodlama bozuksa, bir satır beklenmeyen sütun sayısı veriyorsa veya yinelenen başlık varsa dönüşüme geçmeyin; kaynağın dışa aktarma ayarını düzeltin.",
      "Do not convert when encoding is damaged, any row has an unexpected column count, or headers repeat; correct the source export settings first.",
      "Bei beschädigter Kodierung, unerwarteter Spaltenzahl oder doppelten Headern nicht konvertieren; zuerst die Export-Einstellungen der Quelle korrigieren.",
      "若编码损坏、任一行列数异常或表头重复，请不要继续转换，应先修正源系统的导出设置。",
    ),
  },
  "prompt-kalite-denetimi": {
    situation: l(
      "Bir ekip özetleme promptunu modele göndermeden önce hedef, bağlam, çıktı biçimi, sınır, hedef kitle ve doğrulama ölçütlerinin görünür olup olmadığını incelemek.",
      "Check whether a team summarisation prompt states its goal, context, output format, boundaries, audience, and verification criteria before sending it to a model.",
      "Vor der Modellnutzung prüfen, ob ein Team-Prompt für Zusammenfassungen Ziel, Kontext, Ausgabeformat, Grenzen, Zielgruppe und Prüfkriterien nennt.",
      "在把团队摘要提示词发送给模型前，检查其中是否明确目标、语境、输出格式、边界、受众和核验标准。",
    ),
    fixture: l(
      "Önce yalnız `Bu raporu özetle` yazın; sonra sentetik rapor bağlamı, beş maddelik çıktı, yönetici hedef kitlesi, bilinmeyeni uydurmama sınırı ve tarih kontrolü ekleyin.",
      "Start with only `Summarise this report`; then add synthetic report context, a five-bullet format, executive audience, a no-invention boundary, and a date check.",
      "Beginnen Sie nur mit `Fasse diesen Bericht zusammen`; ergänzen Sie dann synthetischen Kontext, fünf Stichpunkte, Führungskräfte als Zielgruppe, Erfindungsverbot und Datumsprüfung.",
      "先只输入“总结这份报告”；随后加入合成报告背景、五点输出格式、管理层受众、不得编造的边界和日期核验。",
    ),
    evidence: l(
      "İkinci sürüm daha fazla görünür ölçütü karşılar ve rapor her eksik bileşeni ayrı gerekçeyle işaretler; aynı metin tekrarlandığında sonuç deterministiktir.",
      "The second version passes more visible checks, each missing component receives a separate reason, and rerunning the same text returns the same deterministic result.",
      "Die zweite Fassung erfüllt mehr sichtbare Kriterien, jeder fehlende Baustein wird separat begründet und dieselbe Eingabe liefert dasselbe Ergebnis.",
      "第二版通过更多可见检查，每个缺失项都有独立理由；重复运行相同文本时结果保持确定一致。",
    ),
    failure: l(
      "Yüksek skorun gerçek model doğruluğunu kanıtladığını varsaymayın; promptu temsilî iyi, sınır ve kötü niyetli örneklerle hedef modelde ayrıca test edin.",
      "Do not assume a high score proves model accuracy; test the prompt on the target model with representative success, boundary, and adversarial examples.",
      "Ein hoher Wert beweist keine Modellgenauigkeit; testen Sie den Prompt im Zielmodell mit Erfolgs-, Grenz- und adversarialen Beispielen.",
      "不要认为高分能证明模型准确；仍需在目标模型中使用代表性成功、边界和对抗样例测试。",
    ),
  },
  "unix-zaman-damgasi-donusturucu": {
    situation: l(
      "Bir olay kaydındaki saniye veya milisaniye epoch değerini yanlış birime bölmeden UTC ve yerel saatle karşılaştırmak.",
      "Compare a seconds- or milliseconds-based epoch value with UTC and local time without applying the wrong unit conversion.",
      "Einen Epoch-Wert in Sekunden oder Millisekunden korrekt mit UTC und Ortszeit vergleichen, ohne die falsche Einheit anzuwenden.",
      "正确比较以秒或毫秒表示的 epoch 值与 UTC、当地时间，避免使用错误单位。",
    ),
    fixture: l(
      "Aynı sentetik anı önce `1785328200` saniye, sonra `1785328200000` milisaniye olarak deneyin; beklenen UTC değerini bağımsız tarih aracıyla not edin.",
      "Test the same synthetic instant first as `1785328200` seconds and then `1785328200000` milliseconds; record the expected UTC value independently.",
      "Testen Sie denselben synthetischen Zeitpunkt als `1785328200` Sekunden und `1785328200000` Millisekunden; notieren Sie UTC unabhängig.",
      "将同一合成时刻分别以 `1785328200` 秒和 `1785328200000` 毫秒测试，并独立记录预期 UTC 值。",
    ),
    evidence: l(
      "Her iki girdi aynı UTC anına dönüşür, algılanan birim açıkça gösterilir ve yerel saat çıktısı tarayıcının geçerli saat dilimiyle uyumludur.",
      "Both inputs resolve to the same UTC instant, the detected unit is explicit, and local output agrees with the browser's current time zone.",
      "Beide Eingaben ergeben denselben UTC-Zeitpunkt, die erkannte Einheit ist sichtbar und die Ortszeit entspricht der Browser-Zeitzone.",
      "两种输入转换为同一 UTC 时刻，检测到的单位清晰显示，当地时间与浏览器当前时区一致。",
    ),
    failure: l(
      "Saat dilimi, yaz saati veya belirsiz insan tarihi açık değilse sonucu kayıt sırası için kullanmayın; özgün değer, birim ve IANA saat dilimini birlikte saklayın.",
      "If the time zone, daylight-saving rule, or human date is ambiguous, do not use the result to order records; retain the original value, unit, and IANA zone together.",
      "Bei unklarer Zeitzone, Sommerzeit oder Datumsangabe das Ergebnis nicht zur Reihenfolge nutzen; Originalwert, Einheit und IANA-Zone gemeinsam behalten.",
      "若时区、夏令时规则或人类日期存在歧义，不要用结果排序记录；应同时保留原值、单位和 IANA 时区。",
    ),
  },
  "renk-donusturucu": {
    situation: l(
      "Bir arayüz rengini HEX, RGB ve HSL arasında dönüştürürken aynı görünümü korumak ve metin kontrastını ayrıca doğrulamak.",
      "Preserve the same visual colour while converting among HEX, RGB, and HSL, then validate text contrast separately.",
      "Bei der Umwandlung zwischen HEX, RGB und HSL dieselbe sichtbare Farbe erhalten und den Textkontrast separat prüfen.",
      "在 HEX、RGB 和 HSL 之间转换时保持相同视觉颜色，并另行验证文字对比度。",
    ),
    fixture: l(
      "`#3366FF` değerini RGB ve HSL'ye dönüştürün, sonra oluşan değerlerden HEX'e geri dönün; açık ve koyu zemin önizlemelerini karşılaştırın.",
      "Convert `#3366FF` to RGB and HSL, then convert the results back to HEX; compare previews on light and dark backgrounds.",
      "Konvertieren Sie `#3366FF` nach RGB und HSL und anschließend zurück nach HEX; vergleichen Sie helle und dunkle Hintergründe.",
      "将 `#3366FF` 转换为 RGB 和 HSL，再由结果转换回 HEX；比较浅色与深色背景预览。",
    ),
    evidence: l(
      "Geri dönüş değeri yuvarlama toleransı içinde aynı rengi üretir; örnek kart ve renk seçici eşleşir, her kanal izin verilen aralıkta kalır.",
      "The round trip produces the same colour within rounding tolerance, swatch and picker agree, and every channel remains within its valid range.",
      "Die Rückkonvertierung ergibt innerhalb der Rundungstoleranz dieselbe Farbe, Farbfeld und Picker stimmen überein und alle Kanäle sind gültig.",
      "往返转换在舍入容差内保持同一颜色，色块与取色器一致，各通道均处于有效范围。",
    ),
    failure: l(
      "Renk uzayı, alfa kanalı veya geniş gamut gereksinimi kayboluyorsa sonucu tasarım sistemine aktarmayın; hedef platformun renk yönetimini ayrıca kontrol edin.",
      "Do not move the result into a design system when colour space, alpha, or wide-gamut requirements are lost; check target-platform colour management separately.",
      "Bei Verlust von Farbraum, Alpha oder Wide-Gamut-Anforderungen die Ausgabe nicht ins Designsystem übernehmen; Farbmanagement separat prüfen.",
      "若颜色空间、透明度或广色域要求丢失，请不要把结果加入设计系统，应另行检查目标平台的颜色管理。",
    ),
  },
};

export function getToolDeepDive(slug: string) {
  return deepDives[slug] ?? null;
}

export const toolDeepDiveSlugs = Object.freeze(Object.keys(deepDives));
