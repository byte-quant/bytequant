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
};

export function getToolDeepDive(slug: string) {
  return deepDives[slug] ?? null;
}

export const toolDeepDiveSlugs = Object.freeze(Object.keys(deepDives));
