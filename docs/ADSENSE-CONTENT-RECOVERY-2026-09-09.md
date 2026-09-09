# ByteQuant içerik düzeltmesi — 9 Eylül 2026

## Esas alınan ret gerekçesi

Önceki konuşmada kullanıcı tarafından aktarılan Google bildirimi iki başlık içeriyor: “Yetersiz içerik” ve “İçerik kalitesi sorunları”. Bildirim yeterli, özgün ve yararlı metin ile tamamlanmış bir yayın istiyor. Hesabın bugünkü Policy Center durumu bu çalışma sırasında okunmadı. Önceki bildirim `ADSENSE-REJECTION-EVIDENCE.md` kaydına işlendi.

## Yapılan düzeltmeler

- Yerelleştirme katmanının gerçek Türkçe/İngilizce adımları başlık ve kategori paragraflarıyla uzatması kaldırıldı. Yazılmış Almanca/Çince adımlar artık genel kategori metniyle ezilmiyor.
- Araç adı ekleyerek farklı görünen senaryo paragrafları ve tekrar eden kullanım özeti kaldırıldı. Uygulama adımları, yöntem, girdi/çıktı, doğrulama, sınırlar ve mevcut çalışılmış örnekler korunuyor.
- JSON biçimlendirme, JWT çözümleme, parola üretimi ve PDF birleştirme için dört dilde işlemle eşleşen açıklamalar yazıldı. Büyük JSON sayılarında hassasiyet, yinelenen anahtarlar, JWT imza doğrulaması, rastgele parola üretimi ve PDF imza/form sınırları somutlaştırıldı. Bütün 342 aracın tek tek yeniden yazıldığı iddia edilmiyor.
- Liste/CSV/JSON rehberine dört dilde e-posta tekilleştirme, sütun kaybı ve baştaki sıfırların korunmasını gösteren çalışılmış örnek eklendi.
- Araçla doğrudan ilgili, odaklı rehberler geniş kapsamlı ve yalnızca daha yeni derlemelerin önüne alındı.
- HowTo verisindeki ölçülmemiş sabit üç dakika süresi kaldırıldı; görünür adımlar ile yapılandırılmış veri aynı kaynaktan üretiliyor. Dil, canonical, hreflang, sitemap ve JSON-LD kontrolleri korunuyor.
- Geliştirme sunucusunun üretim dosyalarını izlemesi engellendi; önceki derleme sırasında gözlenen yeniden yükleme/bellek taşması döngüsünün kaynağı giderildi.

## Doğrulama ve kanıt sınırları

- 196 uygulama testi, lint ve üretim derlemesi başarılı.
- 22 yayın denetimi başarılı: statik çıktı, AdSense, içerik değeri, içerik gerçekliği, yayıncı yüzeyleri, editoryal derinlik, güven, envanter, aşama/kapanış/kalite kontrolleri, deneyim, sürüm ve lisanslar.
- 342 araç, dört dilde 1.368 kanonik araç sayfası ve 408 rehber sayfası korunuyor. 110 araç için dört dilde 440 çalıştırılabilir örnek kontrol ediliyor.
- Uzun tekrar paragrafları için yayıncı denetiminde eşik ihlali yok. İki ortak kısa talimat onar sayfada hâlâ bulunuyor; sıfır ortak metin veya mutlak özgünlük iddiası yok.
- Kısa, doğru kullanım adımlarına sırf uzunluk/farklılık için metin eklenmesini zorlayan testler düzeltildi. Ayrı içerik derinliği, yayıncı tekrarları, işlem açıklamaları, çalışılmış örnekler ve statik sayfa denetimleri korunuyor. Metinlerin birbirinden farklı olması tek başına insan incelemesi veya özgünlük kanıtı değil.
- AdSense betiği ve `public/ads.txt` değiştirilmedi. SHA-256 korumaları aynı.
- Bu dosya yerel doğrulamayı kaydeder; uzak yayın başarısı ayrıca aynı Git commit'inin Actions sonucu ve canlı HTTP yanıtlarıyla doğrulanır.

## Yeniden başvuru

Canlı yayın tamamlandıktan sonra AdSense Sites ekranında mevcut ret ayrıntıları ve yeniden inceleme seçeneği kontrol edilmeli. Hesap tarafındaki CMP/izin ayarları ve önerilen reklam hariç tutmaları kaynak kodundan doğrulanamaz. Bu çalışma yeniden başvuru göndermedi. Arama veya yapay zekâ yanıtlarında görünürlük ve AdSense kabulü garanti edilemez.

Google kaynakları: [AdSense site hazır olma ölçütleri](https://support.google.com/adsense/answer/12176698?hl=en), [üretken yapay zekâ içeriği](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content), [arama içindeki yapay zekâ özellikleri](https://developers.google.com/search/docs/appearance/ai-features).
