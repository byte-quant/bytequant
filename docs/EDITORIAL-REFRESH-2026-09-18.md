# Editoryel içerik ve kullanım düzeni — 18 Eylül 2026

Bu çalışma, kullanıcının yeniden bildirdiği içerik kalitesi/yetersiz içerik reddi üzerine yapılmıştır. Son ret e-postası bu turda yeniden okunmadı; hesap tarafındaki gerekçe kullanıcı beyanıdır. Bu rapor bir AdSense kabul belgesi değildir.

## Giderilen sorunlar

- Araç adı ve hedefi aynı yöntem cümlesine tekrar ekleyerek farklı metin üretme kaldırıldı. Genel teknik açıklamalar, bağımsız editoryel inceleme yapılmış gibi sayılmıyor.
- Araç sayfasındaki tekrarlanan hızlı cevap tablosu, çalışma özeti, üçlü şeffaflık metni ve ikinci adım listesi kaldırıldı. Çalışan araçlar korunuyor; yöntem, girdi, çıktı, doğrulama, sınır ve adımlar tek bölümde okunuyor. Her HowTo adımının sayfada bir bağlantı hedefi var.
- Tam cümleleri başka cümlelerin içine ekleyerek oluşan bozuk “güvenli sonraki adım” metni kaldırıldı.
- Base64, URL ve JSON–CSV için dört dilde açıklamalar gerçek uygulamaya göre yazıldı. UTF-8 hata yolu, URI bileşeni/form kodlaması ayrımı, CSV tırnakları, düz JSON gereksinimi ve dönüştürücünün kayıt sınırları açıklandı.
- JSON, JSON–CSV, Base64 ve URL için sentetik girdi, beklenen çıktı, başarısız olması gereken girdi ve yöntem kaynağı eklendi. Beş yeni işlem/doğruluk testi ve bir statik çıktı testi bu örnekleri kontrol ediyor.
- Üç rehberin dört dil sürümüne çalışılmış örnekler eklendi. Rehber gövdesi araç çalışma planından önce geliyor. Yalnız değişen rehberlerin içerik tarihi güncellendi; sayfa güncellemesi tüm algoritmaların o gün yeniden incelendiği iddiasından ayrıldı.
- Ana sayfanın sahte konuşma önizlemesi, doğrudan açılabilen üç rehberle değiştirildi. Canlı demo öne alındı; başlık, tanıtım metni ve dikey boşluklar sadeleştirildi. Ölçülmemiş “en çok kullanılan” sıralaması ve eski bağımsız doğrulama iddiası kaldırıldı.
- Açık/koyu tema renkleri, mobil örnek kod kutuları ve okunabilir metin genişlikleri düzenlendi. Asıl rehber bölümlerinde ertelenmiş içerik görünürlüğü kaldırıldı.
- Tarayıcıda bulunan bir davranış hatası giderildi: yeni girdi veya hata geldiğinde eski Önce/Sonra karşılaştırması temizleniyor ve yalnız tamamlanmış işlemde gösteriliyor.

## SEO, GEO ve AEO kapsamı

Kanonik adresler, dört dil alternatifi, sitemap, bağlantılar, görünür içerikle eşleşen FAQ/HowTo verisi ve kaynak bağlantıları korunmuştur. Yeni örnek metinleri sunucuda oluşturulan HTML içindedir; JavaScript çalıştırmadan da okunabilir. Çalışılmış örneklerin metni makale kelime hesabına dahildir. Güncellenen araç sayfası tarihleri sitemap ve WebPage verisiyle eşleşir. Yeni bir indekslenebilir sayfa yığını veya anahtar kelime varyasyonu oluşturulmadı.

## Denetimin anlamı

Eski 650 kelime/benzeri eşikler bir Google şartı değildir. Bu nedenle kısa bir yardımcı programı tekrarlarla uzatmayı teşvik eden eşikler artık raporlanan editoryel inceleme sinyalleridir. Aynı şekilde araç adına göre farklılaşan cümlelerin farklı hash üretmesi özgünlük kanıtı sayılmıyor.

Kontroller hâlâ eksik çalışma alanını, eksik/tekrarlanan HowTo hedefini, bozuk bağlantıyı, yinelenen başlık/açıklamayı, eksik yöntem alanlarını, beklenmeyen yaygın editoryel paragraf tekrarını ve korunan AdSense dosyası değişikliğini engeller. Ortak yöntem ve araç SSS metinleri HTML içinde açıkça işaretlidir; görünür kalır ve tekrar envanterinden çıkarılmaz. Bunlar özgün makale metni gibi sayılmaz.

İnceleme sinyalleri sıfırlanmış değildir: 156 paragraf en az sekiz sayfada tekrar eder; toplam 928 sinyal çoğunlukla eski uzunluk eşikleri ve ortak talimatlardır. Bu sayı bir ret tahmini değildir. Ancak tüm 342 aracın ayrı ayrı özgün bir uzman incelemesinden geçtiği veya Google tarafından yeterli bulunacağı da ileri sürülmez. Yeni çalıştırılabilir editoryel örnek kapsamı dört araçtır; önceki ayrıntılı örnekler korunmuştur.

## Doğrulama

- 202 uygulama/statik çıktı testi başarılı; lint ve üretim derlemesi başarılı.
- Statik çıktı: 1.905 HTML, 1.860 geçerli JSON-LD bloğu, 1.840 sitemap adresi, sıfır kırık iç bağlantı.
- Dört dilde 342 kanonik araç ve mevcut özellikler korunuyor.
- Gerçek tarayıcı: JSON başarılı/hatalı veri, Almanca Base64 Unicode ve geçersiz UTF-8, CSV tırnak ve kimlik koruması, hata sonrası eski karşılaştırmanın temizlenmesi.
- Masaüstü açık tema ana sayfası; 390 piksel mobil görünümde Almanca araç ve Çince rehber. Ölçülen sayfa genişliği ve kaydırma genişliği eşit; yatay taşma yok.
- AdSense scriptinin bulunduğu `app/layout.tsx` ve `public/ads.txt` değiştirilmedi. Yeni ücretli servis, bağımlılık veya veri toplama eklenmedi.

Yayın doğrulaması aynı commit için GitHub Actions sonucuyla ve canlı sayfalardaki örneklerle ayrıca yapılmalıdır. Yeni AdSense inceleme başvurusu bu çalışma kapsamında gönderilmemiştir. Hesap/CMP incelemesi ve Google’ın nihai kalite değerlendirmesi otomatik depo testlerinin kapsamı dışındadır.

## Başvuru ölçütleri için kaynaklar

- [AdSense: Sayfalarınızın AdSense için hazır olduğundan emin olun](https://support.google.com/adsense/answer/7299563)
- [Google Search: Yararlı ve güvenilir içerik](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search: Üretken yapay zekâ içeriği](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)

Bu ilkeler fayda, özgün katkı ve kullanılabilirlik için yol gösterir; hiçbiri onay garantisi sağlamaz.
