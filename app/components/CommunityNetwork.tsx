"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Event as NostrEvent, SimplePool as SimplePoolType } from "nostr-tools";
import { reviewCommunityText } from "../lib/community-safety";
import type { Locale } from "../lib/site";

type SocialKind = "workflow" | "tip" | "question" | "idea";
type SourceQuote = { title: string; url: string; source: string };
type SocialContent = { v: 1; title: string; body: string; kind: SocialKind; group: string; source?: SourceQuote };
type Profile = { name: string; about: string; picture?: string };
type StoredIdentity = { v: 1; pubkey: string; salt: string; iv: string; cipher: string; name: string; about: string };
type NetworkState = "idle" | "connecting" | "connected" | "partial" | "error";

const identityKey = "bytequant:nostr-identity:v1";
const relayKey = "bytequant:nostr-relays:v1";
const blockedKey = "bytequant:nostr-blocked:v1";
const followingKey = "bytequant:nostr-following:v1";
const newsQuoteKey = "bytequant:community-news-quote:v1";
const defaultRelays = ["wss://relay.damus.io", "wss://nos.lol"];
const MAX_EVENT_BYTES = 6_000;
const MAX_CLOCK_SKEW_SECONDS = 5 * 60;
const AUTO_LOCK_MS = 15 * 60 * 1000;
const localeTags: Record<Locale, string> = { tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN" };

const copy = {
  tr: {
    eyebrow: "GLOBAL TOPLULUK", title: "Fikirler, iş akışları ve insanlar—tek bir akışta", intro: "Akışı hesap açmadan okuyun. Paylaşmak, yorum yapmak veya beğenmek için cihazınızda şifrelenen taşınabilir bir profil oluşturun.", connect: "Global akışa bağlan", connecting: "Relay’lere bağlanılıyor…", connected: "Global akış canlı", partial: "Bazı relay’ler çevrimdışı; akış kullanılabilir", error: "Şu anda relay bağlantısı kurulamadı", privacy: "Bağlandığınızda IP adresiniz seçili relay işletmecileri tarafından görülebilir. Gönderiler herkese açık ve kriptografik olarak imzalıdır.", refresh: "Yenile", compose: "Topluluğa yaz", composeHint: "Kısa bir başlık ve başkalarının uygulayabileceği bağlam ekleyin.", titleLabel: "Başlık", body: "Ne paylaşmak istiyorsunuz?", kind: "Tür", group: "Konu / grup", publish: "Yayımla", publishing: "Yayımlanıyor…", published: "Gönderi en az bir relay tarafından kabul edildi.", identity: "Profiliniz", create: "Güvenli profil oluştur", unlock: "Profilin kilidini aç", lock: "Kilitle", name: "Görünen ad", about: "Kısa tanıtım", pass: "Cihaz parolası", passHint: "En az 10 karakter. Parola veya özel anahtar ByteQuant’a gönderilmez.", identityReady: "Profil açık", identityLocked: "Bu cihazda kilitli bir profil var", npub: "Taşınabilir kimlik", feed: "Keşfet", latest: "En yeni", groups: "Gruplar", people: "İnsanlar", saved: "Kaydedilenler", all: "Tümü", search: "Akışta ara", empty: "Bu etikette henüz gönderi yok. İlk faydalı paylaşımı siz yapabilirsiniz.", editorial: "ByteQuant başlangıç", comment: "Yorum", commentPlaceholder: "Yapıcı bir yanıt yazın", sendComment: "Yanıtla", like: "Beğen", repost: "Yeniden paylaş", share: "Bağlantıyı paylaş", block: "Kullanıcıyı gizle", blocked: "Gizlenen hesap", moderation: "Yerel moderasyon", moderationBody: "İmzalar sahteciliği azaltır; içeriğin doğru veya güvenli olduğunu kanıtlamaz. Kötüye kullanım filtresi ve gizlenen hesap listesi yalnızca bu cihazda uygulanır.", relaySettings: "Bağlantı ayarları", relayHelp: "Her satıra bir wss:// relay adresi yazın. ByteQuant relay işletmez; erişilebilirlik, saklama ve moderasyon politikaları relay’e aittir.", saveRelays: "Ayarı kaydet", status: "Durum", comments: "yanıt", likes: "beğeni", kinds: { workflow: "İş akışı", tip: "İpucu", question: "Soru", idea: "Fikir" }, unsafe: "İçerik güvenlik kontrolünden geçmedi. Kişisel veri, sır, spam veya uygunsuz dil bulunabilir.", identityError: "Profil açılamadı. Parolayı ve tarayıcı depolama iznini kontrol edin.", relayDisclosure: "Açık Nostr protokolü · Ücretsiz relay seçimi · ByteQuant hesabı yok", noIdentity: "Etkileşim için önce profilinizi oluşturun veya açın.", liveProfiles: "Akıştaki kişiler", activeGroups: "Aktif gruplar", copyId: "Kimliği kopyala", copied: "Kopyalandı", explain: "Nasıl çalışır?", explainBody: "Profil ve gönderiler Nostr biçiminde imzalanır; seçtiğiniz relay’ler bunları dağıtır. Özel anahtar yalnızca açık oturum belleğinde tutulur ve cihaz parolanızla AES-GCM kullanılarak şifrelenmiş halde saklanır. Relay bir ByteQuant sunucusu değildir.", localStarter: "Global bağlantı kurulana kadar örnek akış", resetIdentity: "Bu cihazdaki profili sil", resetConfirm: "Şifreli profil bu cihazdan silinsin mi? Yedek yoksa kimlik geri alınamaz.",
  },
  en: {
    eyebrow: "GLOBAL COMMUNITY", title: "Ideas, workflows, and people in one feed", intro: "Read without creating an account. Create a portable profile encrypted on your device to post, reply, or react.", connect: "Connect global feed", connecting: "Connecting to relays…", connected: "Global feed is live", partial: "Some relays are offline; the feed remains usable", error: "No relay connection is available right now", privacy: "When you connect, selected relay operators can see your IP address. Posts are public and cryptographically signed.", refresh: "Refresh", compose: "Write to the community", composeHint: "Add a clear title and context someone else can act on.", titleLabel: "Title", body: "What would you like to share?", kind: "Type", group: "Topic / group", publish: "Publish", publishing: "Publishing…", published: "At least one relay accepted the post.", identity: "Your profile", create: "Create secure profile", unlock: "Unlock profile", lock: "Lock", name: "Display name", about: "Short bio", pass: "Device passphrase", passHint: "At least 10 characters. Your passphrase and private key are never sent to ByteQuant.", identityReady: "Profile unlocked", identityLocked: "A locked profile exists on this device", npub: "Portable identity", feed: "Explore", latest: "Latest", groups: "Groups", people: "People", saved: "Saved", all: "All", search: "Search the feed", empty: "No posts are available under this tag yet. You can make the first useful contribution.", editorial: "ByteQuant starter", comment: "Reply", commentPlaceholder: "Write a constructive reply", sendComment: "Reply", like: "Like", repost: "Repost", share: "Share link", block: "Hide user", blocked: "Hidden account", moderation: "Local moderation", moderationBody: "Signatures reduce impersonation; they do not prove that content is true or safe. Abuse filtering and hidden accounts apply only on this device.", relaySettings: "Connection settings", relayHelp: "Enter one wss:// relay per line. ByteQuant operates no relay; availability, retention, and moderation belong to each relay operator.", saveRelays: "Save settings", status: "Status", comments: "replies", likes: "likes", kinds: { workflow: "Workflow", tip: "Tip", question: "Question", idea: "Idea" }, unsafe: "The content did not pass the safety check. It may contain personal data, a secret, spam, or abusive language.", identityError: "The profile could not be opened. Check the passphrase and browser storage permission.", relayDisclosure: "Open Nostr protocol · Free relay choice · No ByteQuant account", noIdentity: "Create or unlock your profile before interacting.", liveProfiles: "People in this feed", activeGroups: "Active groups", copyId: "Copy identity", copied: "Copied", explain: "How does it work?", explainBody: "Profiles and posts are signed in Nostr format and distributed by the relays you select. Your private key stays only in active memory and is stored encrypted with AES-GCM using your device passphrase. A relay is not a ByteQuant server.", localStarter: "Starter feed until the global connection is active", resetIdentity: "Delete profile from this device", resetConfirm: "Delete the encrypted profile from this device? Without a backup, the identity cannot be recovered.",
  },
  de: {
    eyebrow: "GLOBALE COMMUNITY", title: "Ideen, Abläufe und Menschen in einem Feed", intro: "Ohne Konto lesen. Zum Veröffentlichen, Antworten und Reagieren ein portables, lokal verschlüsseltes Profil erstellen.", connect: "Globalen Feed verbinden", connecting: "Verbindung zu Relays…", connected: "Globaler Feed ist live", partial: "Einige Relays sind offline; der Feed bleibt nutzbar", error: "Derzeit ist kein Relay erreichbar", privacy: "Beim Verbinden können Relay-Betreiber Ihre IP-Adresse sehen. Beiträge sind öffentlich und kryptografisch signiert.", refresh: "Aktualisieren", compose: "Community-Beitrag", composeHint: "Klare Überschrift und anwendbaren Kontext ergänzen.", titleLabel: "Überschrift", body: "Was möchten Sie teilen?", kind: "Typ", group: "Thema / Gruppe", publish: "Veröffentlichen", publishing: "Wird veröffentlicht…", published: "Mindestens ein Relay hat den Beitrag angenommen.", identity: "Ihr Profil", create: "Sicheres Profil erstellen", unlock: "Profil entsperren", lock: "Sperren", name: "Anzeigename", about: "Kurzprofil", pass: "Geräte-Passphrase", passHint: "Mindestens 10 Zeichen. Passphrase und privater Schlüssel verlassen das Gerät nicht.", identityReady: "Profil entsperrt", identityLocked: "Auf diesem Gerät liegt ein gesperrtes Profil", npub: "Portable Identität", feed: "Entdecken", latest: "Neueste", groups: "Gruppen", people: "Personen", saved: "Gespeichert", all: "Alle", search: "Feed durchsuchen", empty: "Unter diesem Tag gibt es noch keinen Beitrag. Veröffentlichen Sie den ersten hilfreichen Beitrag.", editorial: "ByteQuant-Start", comment: "Antwort", commentPlaceholder: "Konstruktiv antworten", sendComment: "Antworten", like: "Gefällt mir", repost: "Erneut teilen", share: "Link teilen", block: "Nutzer ausblenden", blocked: "Ausgeblendetes Konto", moderation: "Lokale Moderation", moderationBody: "Signaturen erschweren Identitätsmissbrauch, beweisen aber weder Wahrheit noch Sicherheit. Filter und ausgeblendete Konten gelten nur auf diesem Gerät.", relaySettings: "Verbindungseinstellungen", relayHelp: "Pro Zeile eine wss://-Relay-Adresse. ByteQuant betreibt kein Relay; Verfügbarkeit, Speicherung und Moderation liegen beim Betreiber.", saveRelays: "Einstellung speichern", status: "Status", comments: "Antworten", likes: "Likes", kinds: { workflow: "Ablauf", tip: "Tipp", question: "Frage", idea: "Idee" }, unsafe: "Inhalt hat die Sicherheitsprüfung nicht bestanden. Möglicherweise Personendaten, Geheimnisse, Spam oder beleidigende Sprache.", identityError: "Profil konnte nicht geöffnet werden. Passphrase und Browser-Speicherberechtigung prüfen.", relayDisclosure: "Offenes Nostr-Protokoll · freie Relay-Wahl · kein ByteQuant-Konto", noIdentity: "Zum Interagieren Profil erstellen oder entsperren.", liveProfiles: "Personen im Feed", activeGroups: "Aktive Gruppen", copyId: "Identität kopieren", copied: "Kopiert", explain: "Wie funktioniert es?", explainBody: "Profile und Beiträge werden im Nostr-Format signiert und über gewählte Relays verteilt. Der private Schlüssel bleibt im Arbeitsspeicher und wird per AES-GCM mit der Geräte-Passphrase verschlüsselt gespeichert. Ein Relay ist kein ByteQuant-Server.", localStarter: "Start-Feed bis zur globalen Verbindung", resetIdentity: "Profil von diesem Gerät löschen", resetConfirm: "Verschlüsseltes Profil löschen? Ohne Sicherung kann die Identität nicht wiederhergestellt werden.",
  },
  zh: {
    eyebrow: "全球社区", title: "在同一动态中连接想法、流程与人", intro: "无需账号即可阅读。若要发布、回复或点赞，可创建仅在设备上加密的便携身份。", connect: "连接全球动态", connecting: "正在连接中继…", connected: "全球动态已连接", partial: "部分中继离线；动态仍可使用", error: "目前无法连接中继", privacy: "连接后，所选中继运营者可能看到您的 IP 地址。帖子公开并带有加密签名。", refresh: "刷新", compose: "发布到社区", composeHint: "添加清晰标题和他人可执行的背景信息。", titleLabel: "标题", body: "想分享什么？", kind: "类型", group: "主题 / 小组", publish: "发布", publishing: "正在发布…", published: "至少一个中继已接受帖子。", identity: "您的资料", create: "创建安全资料", unlock: "解锁资料", lock: "锁定", name: "显示名称", about: "简介", pass: "设备密码", passHint: "至少 10 个字符。密码和私钥不会发送给 ByteQuant。", identityReady: "资料已解锁", identityLocked: "此设备上有一个已锁定资料", npub: "便携身份", feed: "发现", latest: "最新", groups: "小组", people: "用户", saved: "已收藏", all: "全部", search: "搜索动态", empty: "此标签下暂无帖子。您可以发布第一条有用内容。", editorial: "ByteQuant 示例", comment: "评论", commentPlaceholder: "写下建设性回复", sendComment: "回复", like: "点赞", repost: "转发", share: "分享链接", block: "隐藏用户", blocked: "已隐藏账户", moderation: "本地审核", moderationBody: "签名可减少冒充，但不能证明内容真实或安全。滥用过滤和隐藏列表只在本设备生效。", relaySettings: "连接设置", relayHelp: "每行填写一个 wss:// 中继。ByteQuant 不运营中继；可用性、保留与审核政策由中继运营者决定。", saveRelays: "保存设置", status: "状态", comments: "条回复", likes: "次点赞", kinds: { workflow: "工作流", tip: "技巧", question: "问题", idea: "想法" }, unsafe: "内容未通过安全检查，可能包含个人数据、机密、垃圾内容或不当语言。", identityError: "无法打开资料。请检查密码与浏览器存储权限。", relayDisclosure: "开放 Nostr 协议 · 自由选择免费中继 · 无 ByteQuant 账号", noIdentity: "互动前请创建或解锁资料。", liveProfiles: "动态中的用户", activeGroups: "活跃小组", copyId: "复制身份", copied: "已复制", explain: "如何工作？", explainBody: "资料与帖子按 Nostr 格式签名，并由您选择的中继分发。私钥仅保留在当前内存中，并使用设备密码通过 AES-GCM 加密存储。中继不是 ByteQuant 服务器。", localStarter: "全球连接建立前的示例动态", resetIdentity: "从此设备删除资料", resetConfirm: "要从此设备删除加密资料吗？若无备份，该身份无法恢复。",
  },
} as const;

const experienceCopy = {
  tr: {
    group: "Konu",
    groups: "Konular",
    activeGroups: "Akıştaki konular",
    localStarter: "ByteQuant tarafından hazırlanmış örnek gönderiler",
    identity: "Paylaşım profiliniz",
    create: "Güvenli paylaşım profili oluştur",
  },
  en: {
    group: "Topic",
    groups: "Topics",
    activeGroups: "Topics in this feed",
    localStarter: "Example posts prepared by ByteQuant",
    identity: "Your posting profile",
    create: "Create a secure posting profile",
  },
  de: {
    group: "Thema",
    groups: "Themen",
    activeGroups: "Themen in diesem Feed",
    localStarter: "Von ByteQuant erstellte Beispielbeiträge",
    identity: "Ihr Beitragsprofil",
    create: "Sicheres Beitragsprofil erstellen",
  },
  zh: {
    group: "主题",
    groups: "主题",
    activeGroups: "此动态中的主题",
    localStarter: "由 ByteQuant 编写的示例帖子",
    identity: "您的发布资料",
    create: "创建安全发布资料",
  },
} as const;

const secureCopy = {
  tr: { autoLocked: "Profil 15 dakikalık hareketsizlikten sonra otomatik kilitlendi.", rateLimited: "Çok hızlı işlem yapıldı. Spam koruması için kısa bir süre bekleyin.", security: ["Gönderi sahibini doğrular", "Riskli içeriği paylaşmadan uyarır", "Profili kendiliğinden kilitler"], profileSettings: "Profil ve güvenlik", startPost: "Yeni bir paylaşım başlat", closeComposer: "Taslağı kapat", backup: "Şifreli profil yedeğini indir", restore: "Şifreli yedeği içe aktar", backupReady: "Şifreli profil yedeği hazırlandı.", restoreReady: "Şifreli profil bu cihaza aktarıldı. Açmak için parolanızı girin.", publicProfile: "Nostr profili ve gönderileri herkese açıktır. Gerçek ad, konum veya özel iletişim bilgisi yazmayın.", clearBlocked: "Gizlenenleri temizle" },
  en: { autoLocked: "The profile was locked automatically after 15 minutes of inactivity.", rateLimited: "Too many actions were attempted. Wait briefly while anti-spam protection resets.", security: ["Checks who signed each post", "Warns before risky content is shared", "Locks your profile automatically"], profileSettings: "Profile and security", startPost: "Start a new post", closeComposer: "Close draft", backup: "Download encrypted profile backup", restore: "Import encrypted backup", backupReady: "The encrypted profile backup is ready.", restoreReady: "The encrypted profile was imported to this device. Enter its passphrase to unlock it.", publicProfile: "Nostr profiles and posts are public. Do not add your real name, location, or private contact details.", clearBlocked: "Clear hidden accounts" },
  de: { autoLocked: "Das Profil wurde nach 15 Minuten Inaktivität automatisch gesperrt.", rateLimited: "Zu viele Aktionen. Bitte kurz warten, bis der Spam-Schutz zurückgesetzt ist.", security: ["Prüft, wer einen Beitrag signiert hat", "Warnt vor riskanten Inhalten", "Sperrt das Profil automatisch"], profileSettings: "Profil und Sicherheit", startPost: "Neuen Beitrag beginnen", closeComposer: "Entwurf schließen", backup: "Verschlüsselte Profilsicherung laden", restore: "Verschlüsselte Sicherung importieren", backupReady: "Die verschlüsselte Profilsicherung wurde erstellt.", restoreReady: "Das verschlüsselte Profil wurde importiert. Zum Entsperren Passphrase eingeben.", publicProfile: "Nostr-Profile und Beiträge sind öffentlich. Keine echten Namen, Orte oder privaten Kontaktdaten angeben.", clearBlocked: "Ausgeblendete Konten leeren" },
  zh: { autoLocked: "资料已在闲置 15 分钟后自动锁定。", rateLimited: "操作过于频繁。请稍候，待反垃圾保护重置。", security: ["核对每篇帖子的签名者", "发布风险内容前发出提醒", "自动锁定您的资料"], profileSettings: "资料与安全", startPost: "发布新内容", closeComposer: "关闭草稿", backup: "下载加密资料备份", restore: "导入加密备份", backupReady: "加密资料备份已生成。", restoreReady: "加密资料已导入此设备。请输入密码解锁。", publicProfile: "Nostr 资料与帖子均为公开内容。请勿填写真实姓名、位置或私人联系方式。", clearBlocked: "清空隐藏账户" },
} as const;

const profileExperienceCopy = {
  tr: { profileSettings: "Paylaşmak için profil oluşturun veya açın", publicProfile: "Profil yalnızca paylaşmak, yanıtlamak ve tepki vermek için gerekir. Nostr profili ve gönderileri herkese açıktır; gerçek ad, konum veya özel iletişim bilgisi yazmayın." },
  en: { profileSettings: "Create or unlock a profile to participate", publicProfile: "A profile is needed only to post, reply, or react. Nostr profiles and posts are public; do not add your real name, location, or private contact details." },
  de: { profileSettings: "Profil zum Mitmachen erstellen oder entsperren", publicProfile: "Ein Profil ist nur zum Veröffentlichen, Antworten oder Reagieren nötig. Nostr-Profile und Beiträge sind öffentlich; keine echten Namen, Orte oder privaten Kontaktdaten angeben." },
  zh: { profileSettings: "创建或解锁资料后参与互动", publicProfile: "只有发布、回复或点赞时才需要资料。Nostr 资料和帖子均公开；请勿填写真实姓名、位置或私人联系方式。" },
} as const;

const postActionCopy = {
  tr: { edit: "Düzenle", editing: "Gönderiyi düzenliyorsunuz", cancel: "Vazgeç", update: "Değişikliği yayımla", updated: "Düzenlenmiş sürüm yayımlandı; eski sürüm için silme isteği relay’lere iletildi.", updatedPartial: "Düzenlenmiş sürüm yayımlandı; ancak bazı relay’ler eski sürümün silme isteğini kabul etmedi. Eski kopya başka istemcilerde kalabilir.", remove: "Sil", removeConfirm: "Bu gönderi için Nostr silme isteği yayımlansın mı? Bazı relay veya istemciler eski kopyayı tutabilir.", removed: "Silme isteği relay’lere iletildi ve gönderi bu akıştan kaldırıldı.", quoted: "Gündemden alıntı", source: "Kaynağı aç" },
  en: { edit: "Edit", editing: "You are editing this post", cancel: "Cancel", update: "Publish revision", updated: "The revision was published and a deletion request for the old note was sent to relays.", updatedPartial: "The revision was published, but some relays did not accept the deletion request for the previous note. Older copies may remain in other clients.", remove: "Delete", removeConfirm: "Publish a Nostr deletion request for this post? Some relays or clients may retain an older copy.", removed: "The deletion request was sent to relays and the post was removed from this feed.", quoted: "Quoted from Updates", source: "Open source" },
  de: { edit: "Bearbeiten", editing: "Sie bearbeiten diesen Beitrag", cancel: "Abbrechen", update: "Änderung veröffentlichen", updated: "Die neue Fassung wurde veröffentlicht und eine Löschanforderung für die alte Notiz gesendet.", updatedPartial: "Die neue Fassung wurde veröffentlicht, aber einige Relays nahmen die Löschanforderung für die alte Notiz nicht an. Ältere Kopien können in anderen Clients bestehen bleiben.", remove: "Löschen", removeConfirm: "Eine Nostr-Löschanforderung senden? Einige Relays oder Clients können eine ältere Kopie behalten.", removed: "Die Löschanforderung wurde gesendet und der Beitrag aus diesem Feed entfernt.", quoted: "Aus Updates zitiert", source: "Quelle öffnen" },
  zh: { edit: "编辑", editing: "正在编辑此帖子", cancel: "取消", update: "发布修订版", updated: "修订版已发布，并已向中继发送旧帖删除请求。", updatedPartial: "修订版已发布，但部分中继未接受旧帖删除请求；旧副本可能仍保留在其他客户端中。", remove: "删除", removeConfirm: "要为此帖子发布 Nostr 删除请求吗？部分中继或客户端可能仍保留旧副本。", removed: "删除请求已发送到中继，帖子已从当前动态中移除。", quoted: "引用自动态", source: "打开来源" },
} as const;

const networkCopy = {
  tr: { disconnect: "Bağlantıyı kes", consent: "Bağlanınca iki seçili Nostr relay’iyle doğrudan iletişim kurulur. Bu tercih cihazınızda hatırlanır; istediğiniz an bağlantıyı kesebilirsiniz.", connectedRelays: "bağlı relay", visiblePosts: "global gönderi", liveActivity: "Canlı etkileşimler açık", connectFirst: "Global gönderileri görmek için güvenli bağlantıyı başlatın. Okumak için profil gerekmez.", profileFirst: "Paylaşmak ve yanıtlamak için Profiliniz kartından cihaz profilinizi oluşturun.", newest: "En yeni", active: "Hareketli", myPosts: "Gönderilerim", savedLabel: "Kaydedilenler", copiedLink: "Nostr gönderi adresi kopyalandı.", reactionSent: "Etkileşim relay’lere gönderildi.", noOwnPosts: "Bu profille yayımlanmış bir gönderi bulunamadı.", hideConfirm: "Bu hesabın gönderileri yalnızca bu cihazda gizlensin mi?", loadError: "Global akış şu anda yüklenemedi. Örnek akışı kullanabilir veya biraz sonra yeniden deneyebilirsiniz." },
  en: { disconnect: "Disconnect", consent: "Connecting talks directly to the two selected Nostr relays. This choice is remembered on this device, and you can disconnect at any time.", connectedRelays: "relays connected", visiblePosts: "global posts", liveActivity: "Live interactions on", connectFirst: "Start the privacy-aware connection to see global posts. No profile is required to read.", profileFirst: "To post or reply, create your device profile from the Your profile card.", newest: "Newest", active: "Active", myPosts: "My posts", savedLabel: "Saved", copiedLink: "The Nostr post address was copied.", reactionSent: "The interaction was sent to relays.", noOwnPosts: "No posts published with this profile were found.", hideConfirm: "Hide this account’s posts only on this device?", loadError: "The global feed could not be loaded right now. You can use the starter feed or try again shortly." },
  de: { disconnect: "Trennen", consent: "Beim Verbinden kommuniziert der Browser direkt mit den zwei gewählten Nostr-Relays. Diese Wahl wird auf diesem Gerät gespeichert und kann jederzeit widerrufen werden.", connectedRelays: "Relays verbunden", visiblePosts: "globale Beiträge", liveActivity: "Live-Interaktionen aktiv", connectFirst: "Datenschutzbewusst verbinden, um globale Beiträge zu sehen. Zum Lesen ist kein Profil nötig.", profileFirst: "Zum Veröffentlichen oder Antworten im Profilbereich ein Geräteprofil anlegen.", newest: "Neueste", active: "Aktiv", myPosts: "Meine Beiträge", savedLabel: "Gespeichert", copiedLink: "Die Nostr-Beitragsadresse wurde kopiert.", reactionSent: "Die Interaktion wurde an Relays gesendet.", noOwnPosts: "Für dieses Profil wurden keine Beiträge gefunden.", hideConfirm: "Beiträge dieses Kontos nur auf diesem Gerät ausblenden?", loadError: "Der globale Feed konnte gerade nicht geladen werden. Nutzen Sie den Start-Feed oder versuchen Sie es später erneut." },
  zh: { disconnect: "断开连接", consent: "连接后，浏览器会直接与所选的两个 Nostr 中继通信。此选择会保存在本设备上，您可随时断开。", connectedRelays: "个中继已连接", visiblePosts: "条全球帖子", liveActivity: "实时互动已开启", connectFirst: "启动注重隐私的连接即可查看全球帖子；阅读无需创建资料。", profileFirst: "若要发布或回复，请在“您的资料”卡片中创建设备资料。", newest: "最新", active: "活跃", myPosts: "我的帖子", savedLabel: "已收藏", copiedLink: "Nostr 帖子地址已复制。", reactionSent: "互动已发送到中继。", noOwnPosts: "未找到此资料发布的帖子。", hideConfirm: "仅在此设备上隐藏该账户的帖子吗？", loadError: "目前无法加载全球动态。您可以浏览示例动态，或稍后重试。" },
} as const;

const socialExperienceCopy = {
  tr: {
    consent: "Bağlantı yalnızca bu oturum için ve siz düğmeye bastığınızda kurulur. Tarayıcınız seçtiğiniz Nostr relay’leriyle doğrudan iletişim kurar; relay işletmecileri IP adresinizi görebilir.",
    readStep: "1 · Önce akışı okuyun",
    readStepBody: "Okumak için profil gerekmez. Relay bağlantısı yalnızca açık onayınızla başlar.",
    shareStep: "2 · Hazır olduğunuzda katılın",
    shareStepBody: "Paylaşmak, yanıtlamak veya beğenmek için cihazınızda şifrelenen profili açın.",
    relayHealth: "Relay durumu",
    relayReady: "yanıt veriyor",
    relayUnavailable: "bağlı değil",
    relayChecking: "kontrol ediliyor",
    examplesOffline: "Bunlar gerçek relay gönderileri değildir. Bağlantı kurmadan arayüzü güvenle inceleyebilmeniz için ByteQuant tarafından hazırlanmıştır.",
    examplesEmpty: "Relay bağlantısı kuruldu ancak henüz doğrulanmış bir ByteQuant gönderisi yüklenmedi. Aşağıdaki kartlar açıkça işaretlenmiş editoryal örneklerdir.",
    exampleBadge: "Editoryal örnek · Relay gönderisi değil",
    exampleNoActions: "Örnek gönderilerde ağ etkileşimleri kapalıdır.",
    postActions: "Gönderi işlemleri",
    ownerActions: "Gönderinizi yönetme işlemleri",
    clearFilters: "Filtreleri temizle",
    emptyFiltered: "Bu görünümde eşleşen gönderi yok. Filtreleri temizleyerek akışa dönebilirsiniz.",
    topicsLabel: "Konu filtreleri",
    guestSummary: "Örnek akışı güvenle inceleyin; global gönderiler yalnızca siz bağlandığınızda yüklenir.",
    liveSummary: "Doğrulanmış global gönderiler bu oturumda güncelleniyor.",
    connectionDetails: "Bağlantı ve gizlilik ayrıntıları",
  },
  en: {
    consent: "The connection is created only for this session and only after you press the button. Your browser talks directly to the selected Nostr relays, whose operators can see your IP address.",
    readStep: "1 · Read the feed first",
    readStepBody: "No profile is needed to read. A relay connection starts only with your explicit approval.",
    shareStep: "2 · Join when you are ready",
    shareStepBody: "Unlock the profile encrypted on this device to post, reply, or react.",
    relayHealth: "Relay health",
    relayReady: "responding",
    relayUnavailable: "not connected",
    relayChecking: "checking",
    examplesOffline: "These are not relay posts. ByteQuant prepared them so you can inspect the experience safely before connecting.",
    examplesEmpty: "The relays are connected, but no verified ByteQuant post has loaded yet. The cards below are clearly marked editorial examples.",
    exampleBadge: "Editorial example · Not a relay post",
    exampleNoActions: "Network interactions are unavailable on example posts.",
    postActions: "Post actions",
    ownerActions: "Manage your post",
    clearFilters: "Clear filters",
    emptyFiltered: "No post matches this view. Clear the filters to return to the feed.",
    topicsLabel: "Topic filters",
    guestSummary: "Explore the examples safely; global posts load only after you choose to connect.",
    liveSummary: "Verified global posts are updating in this session.",
    connectionDetails: "Connection and privacy details",
  },
  de: {
    consent: "Die Verbindung wird nur für diese Sitzung und erst nach Ihrem Klick aufgebaut. Der Browser spricht direkt mit den gewählten Nostr-Relays; deren Betreiber können Ihre IP-Adresse sehen.",
    readStep: "1 · Zuerst den Feed lesen",
    readStepBody: "Zum Lesen ist kein Profil nötig. Die Relay-Verbindung startet nur nach Ihrer ausdrücklichen Zustimmung.",
    shareStep: "2 · Mitmachen, wenn Sie bereit sind",
    shareStepBody: "Zum Veröffentlichen, Antworten oder Reagieren das auf diesem Gerät verschlüsselte Profil öffnen.",
    relayHealth: "Relay-Status",
    relayReady: "erreichbar",
    relayUnavailable: "nicht verbunden",
    relayChecking: "wird geprüft",
    examplesOffline: "Dies sind keine Relay-Beiträge. ByteQuant hat sie vorbereitet, damit Sie die Oberfläche vor dem Verbinden sicher kennenlernen können.",
    examplesEmpty: "Die Relays sind verbunden, aber noch kein verifizierter ByteQuant-Beitrag wurde geladen. Die folgenden Karten sind klar markierte redaktionelle Beispiele.",
    exampleBadge: "Redaktionelles Beispiel · Kein Relay-Beitrag",
    exampleNoActions: "Netzwerkinteraktionen sind bei Beispielbeiträgen deaktiviert.",
    postActions: "Beitragsaktionen",
    ownerActions: "Eigenen Beitrag verwalten",
    clearFilters: "Filter zurücksetzen",
    emptyFiltered: "Für diese Ansicht gibt es keinen Treffer. Setzen Sie die Filter zurück, um zum Feed zurückzukehren.",
    topicsLabel: "Themenfilter",
    guestSummary: "Beispiele sicher ansehen; globale Beiträge laden erst nach Ihrer Verbindung.",
    liveSummary: "Geprüfte globale Beiträge werden in dieser Sitzung aktualisiert.",
    connectionDetails: "Verbindungs- und Datenschutzdetails",
  },
  zh: {
    consent: "连接仅在本次会话中、且只会在您按下按钮后建立。浏览器会直接连接所选 Nostr 中继；中继运营者可能看到您的 IP 地址。",
    readStep: "1 · 先阅读动态",
    readStepBody: "阅读无需资料。只有在您明确同意后才会连接中继。",
    shareStep: "2 · 准备好后再参与",
    shareStepBody: "若要发布、回复或点赞，请解锁仅在此设备上加密的资料。",
    relayHealth: "中继状态",
    relayReady: "可用",
    relayUnavailable: "未连接",
    relayChecking: "检查中",
    examplesOffline: "这些不是中继帖子，而是 ByteQuant 编写的示例，方便您在连接前安全了解界面。",
    examplesEmpty: "中继已连接，但尚未载入经过验证的 ByteQuant 帖子。下方卡片均为明确标注的编辑示例。",
    exampleBadge: "编辑示例 · 不是中继帖子",
    exampleNoActions: "示例帖子不支持网络互动。",
    postActions: "帖子操作",
    ownerActions: "管理您的帖子",
    clearFilters: "清除筛选",
    emptyFiltered: "当前视图没有匹配帖子。清除筛选即可返回动态。",
    topicsLabel: "主题筛选",
    guestSummary: "可先安全浏览示例；只有主动连接后才会加载全球帖子。",
    liveSummary: "本次会话正在更新已验证的全球帖子。",
    connectionDetails: "连接与隐私详情",
  },
} as const;

const communityPolishCopy = {
  tr: { following: "Takip ettiklerim", follow: "Takip et", unfollow: "Takibi bırak", localFollow: "Takip listeniz yalnızca bu cihazda tutulur.", emptyFollowing: "Henüz kimseyi takip etmiyorsunuz. Keşfet akışında yararlı bir yazarın yanındaki ‘Takip et’ düğmesini kullanın.", loadMore: "Daha fazla gönderi göster", remaining: "gönderi daha", feedHint: "En yeni paylaşımları okuyun; beğeni, yorum ve takip için profilinizi açın." },
  en: { following: "Following", follow: "Follow", unfollow: "Unfollow", localFollow: "Your following list stays only on this device.", emptyFollowing: "You are not following anyone yet. Use Follow beside a useful author in Explore.", loadMore: "Show more posts", remaining: "more posts", feedHint: "Read the newest posts; unlock your profile to like, reply, or follow." },
  de: { following: "Gefolgt", follow: "Folgen", unfollow: "Nicht mehr folgen", localFollow: "Ihre Folgeliste bleibt nur auf diesem Gerät.", emptyFollowing: "Sie folgen noch niemandem. Nutzen Sie ‘Folgen’ bei einem hilfreichen Autor im Entdecken-Feed.", loadMore: "Weitere Beiträge zeigen", remaining: "weitere Beiträge", feedHint: "Neueste Beiträge lesen; zum Liken, Antworten oder Folgen Profil öffnen." },
  zh: { following: "正在关注", follow: "关注", unfollow: "取消关注", localFollow: "关注列表仅保存在此设备上。", emptyFollowing: "您还没有关注任何人。请在发现动态中点击有用作者旁的“关注”。", loadMore: "显示更多帖子", remaining: "条更多帖子", feedHint: "阅读最新帖子；解锁资料后可点赞、回复或关注。" },
} as const;

const starters: Record<Locale, Array<SocialContent & { id: string; author: string }>> = {
  tr: [
    { id: "starter-1", v: 1, title: "KVKK paylaşımı öncesi üç adımlı kontrol", body: "Sentetik örnekle başlayın, maskeleme sonrasında önce/sonra farkını inceleyin ve yalnızca gerekli alanları dışa aktarın.", kind: "workflow", group: "Gizlilik", author: "ByteQuant" },
    { id: "starter-2", v: 1, title: "JSON tesliminde sessiz hataları azaltın", body: "Biçimlendirmeden sonra şema kontrolü yapın; sürüm değiştiyse yapısal diff ile eklenen ve silinen alanları ayrıca inceleyin.", kind: "tip", group: "Veri", author: "ByteQuant" },
    { id: "starter-3", v: 1, title: "Bir promptu paylaşmadan önce sınırlarını yazın", body: "Hedefi, beklenen çıktı biçimini ve yapılmaması gerekenleri ayrı satırlarda belirtin. Sonra Few-shot aracıyla en az bir olumlu ve bir sınır örneği ekleyin.", kind: "tip", group: "Yapay Zekâ", author: "ByteQuant" },
    { id: "starter-4", v: 1, title: "API teslimi için tekrar kullanılabilir kontrol akışı", body: "Önce cURL komutunu güvenli biçimde inceleyin; gizli başlıkları kaldırın, eşdeğer kodu üretin ve Cache-Control ile CORS politikasını ayrı ayrı doğrulayın.", kind: "workflow", group: "Geliştirici", author: "ByteQuant" },
    { id: "starter-5", v: 1, title: "Hangi yerel iş akışını görmek istersiniz?", body: "Yeni başlayanların uygulayabileceği bir araç zinciri önerin. Girdi örneğini sentetik tutun ve beklenen sonucu açıkça tarif edin.", kind: "question", group: "Topluluk", author: "ByteQuant" },
  ],
  en: [
    { id: "starter-1", v: 1, title: "A three-step check before privacy-sensitive sharing", body: "Start with synthetic data, inspect the before/after diff after masking, and export only the fields the recipient needs.", kind: "workflow", group: "Privacy", author: "ByteQuant" },
    { id: "starter-2", v: 1, title: "Reduce silent failures in JSON delivery", body: "Validate against a schema after formatting, then use a structural diff to review added and removed fields when versions change.", kind: "tip", group: "Data", author: "ByteQuant" },
    { id: "starter-3", v: 1, title: "Write a prompt’s boundaries before sharing it", body: "Separate the goal, expected output format, and prohibited behavior. Then add at least one positive and one boundary example with the Few-shot tool.", kind: "tip", group: "AI", author: "ByteQuant" },
    { id: "starter-4", v: 1, title: "A reusable API delivery check", body: "Inspect the cURL command safely, remove secret headers, generate equivalent code, then review Cache-Control and CORS policy independently.", kind: "workflow", group: "Developer", author: "ByteQuant" },
    { id: "starter-5", v: 1, title: "Which local workflow should we document next?", body: "Suggest a tool chain a newcomer can reproduce. Keep the example input synthetic and describe the expected result clearly.", kind: "question", group: "Community", author: "ByteQuant" },
  ],
  de: [
    { id: "starter-1", v: 1, title: "Drei Prüfungen vor datenschutzrelevanter Freigabe", body: "Mit synthetischen Daten beginnen, den Vorher/Nachher-Vergleich nach der Maskierung prüfen und nur notwendige Felder exportieren.", kind: "workflow", group: "Datenschutz", author: "ByteQuant" },
    { id: "starter-2", v: 1, title: "Stille Fehler bei JSON-Ausgaben reduzieren", body: "Nach dem Formatieren per Schema prüfen und bei Versionswechseln hinzugefügte sowie entfernte Felder strukturell vergleichen.", kind: "tip", group: "Daten", author: "ByteQuant" },
    { id: "starter-3", v: 1, title: "Grenzen eines Prompts vor dem Teilen festlegen", body: "Ziel, Ausgabeformat und unerwünschtes Verhalten getrennt notieren. Danach mit dem Few-shot-Werkzeug mindestens ein positives und ein Grenzbeispiel ergänzen.", kind: "tip", group: "KI", author: "ByteQuant" },
    { id: "starter-4", v: 1, title: "Wiederverwendbare Prüfung für eine API-Übergabe", body: "cURL-Befehl sicher prüfen, geheime Header entfernen, äquivalenten Code erzeugen und Cache-Control sowie CORS getrennt kontrollieren.", kind: "workflow", group: "Entwicklung", author: "ByteQuant" },
    { id: "starter-5", v: 1, title: "Welchen lokalen Ablauf sollen wir als Nächstes erklären?", body: "Einen Werkzeugablauf vorschlagen, den Einsteiger nachvollziehen können. Beispieldaten synthetisch halten und das erwartete Ergebnis klar beschreiben.", kind: "question", group: "Community", author: "ByteQuant" },
  ],
  zh: [
    { id: "starter-1", v: 1, title: "隐私数据分享前的三步检查", body: "先使用合成数据，脱敏后查看前后差异，只导出接收方真正需要的字段。", kind: "workflow", group: "隐私", author: "ByteQuant" },
    { id: "starter-2", v: 1, title: "减少 JSON 交付中的静默错误", body: "格式化后进行 Schema 验证；版本变化时用结构化差异检查新增与删除字段。", kind: "tip", group: "数据", author: "ByteQuant" },
    { id: "starter-3", v: 1, title: "分享提示词前先写清边界", body: "分别写明目标、预期输出格式和禁止行为，再用 Few-shot 工具加入至少一个正向示例与一个边界示例。", kind: "tip", group: "AI", author: "ByteQuant" },
    { id: "starter-4", v: 1, title: "可复用的 API 交付检查流程", body: "安全检查 cURL 命令，移除敏感请求头，生成等价代码，再分别核对 Cache-Control 与 CORS 策略。", kind: "workflow", group: "开发", author: "ByteQuant" },
    { id: "starter-5", v: 1, title: "接下来想看到哪种本地工作流？", body: "推荐一个新手也能复现的工具链；示例输入应使用合成数据，并清楚说明预期结果。", kind: "question", group: "社区", author: "ByteQuant" },
  ],
};

function clean(value: string, max: number) { return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, max); }
function safeSource(value: unknown): SourceQuote | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Partial<SourceQuote>;
  if (typeof candidate.title !== "string" || typeof candidate.url !== "string" || typeof candidate.source !== "string") return undefined;
  try {
    const url = new URL(candidate.url);
    if (url.protocol !== "https:" || url.username || url.password || candidate.url.length > 500) return undefined;
    const result = { title: clean(candidate.title, 160), url: url.toString(), source: clean(candidate.source, 80) };
    return result.title && result.source ? result : undefined;
  } catch { return undefined; }
}
function bytesToBase64(value: Uint8Array) { let binary = ""; value.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); }
function base64ToBytes(value: string) { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }
function tagValue(event: NostrEvent, name: string) { return event.tags.find((tag) => tag[0] === name)?.[1] ?? ""; }
function plausibleEvent(event: NostrEvent, now = Math.floor(Date.now() / 1000), allowHistorical = false) {
  return /^[0-9a-f]{64}$/i.test(event.id) && /^[0-9a-f]{64}$/i.test(event.pubkey) && /^[0-9a-f]{128}$/i.test(event.sig)
    && event.created_at <= now + MAX_CLOCK_SKEW_SECONDS && (allowHistorical || event.created_at >= now - 60 * 60 * 24 * 46)
    && event.content.length <= MAX_EVENT_BYTES && event.tags.length <= 30 && event.tags.every((tag) => tag.length <= 8 && tag.every((item) => typeof item === "string" && item.length <= 500));
}
function parsePost(event: NostrEvent): SocialContent | null {
  try {
    const value = JSON.parse(event.content) as Partial<SocialContent>;
    if (value.v !== 1 || !["workflow", "tip", "question", "idea"].includes(value.kind ?? "") || typeof value.title !== "string" || typeof value.body !== "string") return null;
    const result: SocialContent = { v: 1, title: clean(value.title, 120), body: clean(value.body, 3000), kind: value.kind as SocialKind, group: clean(value.group ?? "", 40), source: safeSource(value.source) };
    return result.title.length >= 3 && result.body.length >= 10 && reviewCommunityText(`${result.title}\n${result.body}`).length === 0 ? result : null;
  } catch { return null; }
}
function parseProfile(event: NostrEvent): Profile | null { try { if (event.content.length > 2_000) return null; const value = JSON.parse(event.content) as Record<string, unknown>; const name = clean(String(value.display_name ?? value.name ?? ""), 40); const about = clean(String(value.about ?? ""), 180); return name && reviewCommunityText(`${name}\n${about}`).length === 0 ? { name, about } : null; } catch { return null; } }
function isPrivateRelayHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host === "::1" || host.endsWith(".local") || host.endsWith(".internal")) return true;
  const parts = host.split(".").map(Number);
  return parts.length === 4 && parts.every(Number.isInteger) && (parts[0] === 10 || parts[0] === 127 || parts[0] === 0 || (parts[0] === 169 && parts[1] === 254) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168));
}
function validRelays(value: string) { return [...new Set(value.slice(0, 2_500).split(/\s+/).map((item) => item.trim()).filter((item) => { try { const url = new URL(item); return url.protocol === "wss:" && !url.username && !url.password && !isPrivateRelayHost(url.hostname); } catch { return false; } }))].slice(0, 5); }

async function keyFromPassphrase(passphrase: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", iterations: 210_000, salt: salt as BufferSource }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
async function encryptSecret(secret: Uint8Array, passphrase: string, profile: { name: string; about: string }, pubkey: string): Promise<StoredIdentity> {
  const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12)); const key = await keyFromPassphrase(passphrase, salt);
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, secret as BufferSource));
  return { v: 1, pubkey, salt: bytesToBase64(salt), iv: bytesToBase64(iv), cipher: bytesToBase64(cipher), name: profile.name, about: profile.about };
}
async function decryptSecret(identity: StoredIdentity, passphrase: string) {
  const salt = base64ToBytes(identity.salt); const iv = base64ToBytes(identity.iv); const key = await keyFromPassphrase(passphrase, salt);
  return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, base64ToBytes(identity.cipher) as BufferSource));
}
function validStoredIdentity(value: unknown): value is StoredIdentity {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoredIdentity>;
  return candidate.v === 1 && typeof candidate.pubkey === "string" && /^[0-9a-f]{64}$/i.test(candidate.pubkey)
    && typeof candidate.salt === "string" && candidate.salt.length >= 20 && candidate.salt.length <= 128 && /^[A-Za-z0-9+/]+={0,2}$/.test(candidate.salt)
    && typeof candidate.iv === "string" && candidate.iv.length >= 16 && candidate.iv.length <= 128 && /^[A-Za-z0-9+/]+={0,2}$/.test(candidate.iv)
    && typeof candidate.cipher === "string" && candidate.cipher.length >= 24 && candidate.cipher.length <= 512 && /^[A-Za-z0-9+/]+={0,2}$/.test(candidate.cipher)
    && typeof candidate.name === "string" && candidate.name.length >= 2 && candidate.name.length <= 40 && candidate.name === clean(candidate.name, 40)
    && typeof candidate.about === "string" && candidate.about.length <= 180 && candidate.about === clean(candidate.about, 180)
    && reviewCommunityText(`${candidate.name}\n${candidate.about}`).length === 0;
}

function readStoredJson(storageName: "localStorage" | "sessionStorage", key: string): unknown {
  try { return JSON.parse(window[storageName].getItem(key) ?? "null") as unknown; }
  catch { return null; }
}

export function CommunityNetwork({ locale }: { locale: Locale }) {
  const passHint = { tr: "En az 12 karakter. Parola ve özel anahtar ByteQuant’a gönderilmez.", en: "At least 12 characters. Your passphrase and private key are never sent to ByteQuant.", de: "Mindestens 12 Zeichen. Passphrase und privater Schlüssel verlassen das Gerät nicht.", zh: "至少 12 个字符。密码和私钥不会发送给 ByteQuant。" }[locale];
  const t = { ...copy[locale], ...experienceCopy[locale], ...secureCopy[locale], ...profileExperienceCopy[locale], passHint };
  const actions = postActionCopy[locale];
  const networkText = { ...networkCopy[locale], ...socialExperienceCopy[locale], ...communityPolishCopy[locale] };
  const [network, setNetwork] = useState<NetworkState>("idle");
  const [connectedRelays, setConnectedRelays] = useState(0);
  const [relayHealth, setRelayHealth] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [interactions, setInteractions] = useState<NostrEvent[]>([]);
  const [relays, setRelays] = useState(defaultRelays);
  const [relayDraft, setRelayDraft] = useState(defaultRelays.join("\n"));
  const [identity, setIdentity] = useState<StoredIdentity | null>(null);
  const [secret, setSecret] = useState<Uint8Array | null>(null);
  const [profileDraft, setProfileDraft] = useState({ name: "", about: "", passphrase: "" });
  const [composer, setComposer] = useState({ title: "", body: "", kind: "workflow" as SocialKind, group: "ByteQuant" });
  const [quoteSource, setQuoteSource] = useState<SourceQuote | undefined>();
  const [editingId, setEditingId] = useState("");
  const [reply, setReply] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [blocked, setBlocked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const [followingOnly, setFollowingOnly] = useState(false);
  const [activeSort, setActiveSort] = useState(false);
  const [feedLimit, setFeedLimit] = useState(12);
  const [composerOpen, setComposerOpen] = useState(false);
  const poolRef = useRef<SimplePoolType | null>(null);
  const subscriptionRef = useRef<{ close(reason?: string): void } | null>(null);
  const connectingRef = useRef(false);
  const connectionGenerationRef = useRef(0);
  const actionTimesRef = useRef<Record<string, number[]>>({});
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const stored = readStoredJson("localStorage", identityKey);
      if (validStoredIdentity(stored)) { setIdentity(stored); setProfileDraft((current) => ({ ...current, name: stored.name, about: stored.about })); }

      const relayValue = readStoredJson("localStorage", relayKey);
      const relayList = Array.isArray(relayValue) ? validRelays(relayValue.filter((item): item is string => typeof item === "string" && item.length <= 500).join("\n")) : [];
      if (relayList.length) { setRelays(relayList); setRelayDraft(relayList.join("\n")); }

      const hidden = readStoredJson("localStorage", blockedKey);
      if (Array.isArray(hidden)) setBlocked(hidden.filter((item): item is string => typeof item === "string" && /^[0-9a-f]{64}$/i.test(item)).slice(-100));

      const kept = readStoredJson("localStorage", "bytequant:nostr-saved:v1");
      if (Array.isArray(kept)) setSaved(kept.filter((item): item is string => typeof item === "string" && (/^[0-9a-f]{64}$/i.test(item) || /^starter-[1-9]\d?$/.test(item))).slice(-200));

      const followed = readStoredJson("localStorage", followingKey);
      if (Array.isArray(followed)) setFollowing(followed.filter((item): item is string => typeof item === "string" && /^[0-9a-f]{64}$/i.test(item)).slice(-200));

      const quote = readStoredJson("sessionStorage", newsQuoteKey) as { title?: unknown; body?: unknown; url?: unknown; source?: unknown } | null;
      const sourceQuote = safeSource(quote);
      if (sourceQuote && typeof quote?.title === "string" && typeof quote.body === "string") {
        setComposer({ title: clean(quote.title, 120), body: clean(quote.body, 1200), kind: "idea", group: locale === "tr" ? "Gündem" : locale === "de" ? "Updates" : locale === "zh" ? "动态" : "Updates" });
        setQuoteSource(sourceQuote); setComposerOpen(true);
        try { sessionStorage.removeItem(newsQuoteKey); } catch { /* optional draft bridge */ }
      }

    }, 0);
    return () => { window.clearTimeout(restore); connectionGenerationRef.current += 1; connectingRef.current = false; subscriptionRef.current?.close("component-unmount"); poolRef.current?.destroy(); };
    // Restore local preferences only. Network access always requires a fresh, explicit click.
  }, [locale]);

  useEffect(() => {
    if (!secret) return;
    const lock = () => { setSecret((current) => { current?.fill(0); return null; }); setStatus(t.autoLocked); };
    let timer = window.setTimeout(lock, AUTO_LOCK_MS);
    const renew = () => { window.clearTimeout(timer); timer = window.setTimeout(lock, AUTO_LOCK_MS); };
    const hide = () => { if (document.visibilityState === "hidden") lock(); };
    window.addEventListener("pointerdown", renew, { passive: true });
    window.addEventListener("keydown", renew);
    document.addEventListener("visibilitychange", hide);
    return () => { window.clearTimeout(timer); window.removeEventListener("pointerdown", renew); window.removeEventListener("keydown", renew); document.removeEventListener("visibilitychange", hide); };
  }, [secret, t.autoLocked]);

  function allowAction(bucket: string, limit: number, windowMs: number) {
    const now = Date.now();
    const recent = (actionTimesRef.current[bucket] ?? []).filter((time) => now - time < windowMs);
    if (recent.length >= limit) { setStatus(t.rateLimited); return false; }
    actionTimesRef.current[bucket] = [...recent, now];
    return true;
  }

  async function connect(targetRelays = relays) {
    if (connectingRef.current) return;
    const generation = ++connectionGenerationRef.current;
    connectingRef.current = true; setNetwork("connecting"); setRelayHealth({}); setStatus("");
    try {
      const [{ SimplePool }, { verifyEvent }] = await Promise.all([import("nostr-tools/pool"), import("nostr-tools/pure")]);
      poolRef.current?.destroy();
      const pool = new SimplePool({ enableReconnect: true }); poolRef.current = pool;
      const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 45;
      const [notes, activity] = await Promise.all([
        pool.querySync(targetRelays, { kinds: [1, 5], "#t": ["bytequant"], since, limit: 160 }, { maxWait: 6500 }).catch(() => []),
        pool.querySync(targetRelays, { kinds: [1, 6, 7], "#t": ["bytequant"], since, limit: 240 }, { maxWait: 6500 }).catch(() => []),
      ]);
      const noteIds = new Set(notes.map((event) => event.id));
      const initial = [...notes, ...activity.filter((candidate) => !noteIds.has(candidate.id))];
      if (generation !== connectionGenerationRef.current) { pool.destroy(); return; }
      const verified = initial.filter((event) => plausibleEvent(event) && verifyEvent(event));
      const deleted = new Set(verified.filter((event) => event.kind === 5).flatMap((event) => event.tags.filter((tag) => tag[0] === "e").map((tag) => `${event.pubkey}:${tag[1]}`)));
      const accepted = verified.filter((event) => event.kind === 1 && parsePost(event) && !deleted.has(`${event.pubkey}:${event.id}`) && !blocked.includes(event.pubkey));
      setEvents(accepted.sort((a, b) => b.created_at - a.created_at));
      setInteractions(verified.filter((event) => (event.kind === 6 || event.kind === 7 || (event.kind === 1 && !parsePost(event))) && Boolean(tagValue(event, "e"))));
      subscriptionRef.current?.close("refresh");
      subscriptionRef.current = pool.subscribeMany(targetRelays, { kinds: [1, 5, 6, 7], "#t": ["bytequant"], since, limit: 320 }, { onevent: (event) => {
        if (!plausibleEvent(event) || !verifyEvent(event)) return;
        if (event.kind === 5) { const ids = new Set(event.tags.filter((tag) => tag[0] === "e").map((tag) => tag[1])); setEvents((current) => current.filter((item) => item.pubkey !== event.pubkey || !ids.has(item.id))); return; }
        const content = event.kind === 1 ? parsePost(event) : null;
        if (!content && Boolean(tagValue(event, "e"))) { setInteractions((current) => [event, ...current.filter((item) => item.id !== event.id)].slice(0, 400)); return; }
        if (!content || blocked.includes(event.pubkey)) return;
        setEvents((current) => [event, ...current.filter((item) => item.id !== event.id)].sort((a, b) => b.created_at - a.created_at).slice(0, 120));
      }, maxWait: 6500 });
      const authors = [...new Set(accepted.map((event) => event.pubkey))].slice(0, 80);
      if (authors.length) {
        const profileEvents = await pool.querySync(targetRelays, { kinds: [0], authors, limit: authors.length * 2 }, { maxWait: 5000 });
        const latest = new Map<string, NostrEvent>(); profileEvents.forEach((event) => { if ((latest.get(event.pubkey)?.created_at ?? 0) < event.created_at) latest.set(event.pubkey, event); });
        setProfiles(Object.fromEntries([...latest].flatMap(([pubkey, event]) => { const profile = plausibleEvent(event, undefined, true) && verifyEvent(event) ? parseProfile(event) : null; return profile ? [[pubkey, profile]] : []; })));
      }
      const connectionStatuses = pool.listConnectionStatus();
      const statuses = [...connectionStatuses.values()];
      const online = statuses.filter(Boolean).length;
      setRelayHealth(Object.fromEntries(targetRelays.map((relay) => [relay, connectionStatuses.get(relay) ?? false])));
      setConnectedRelays(online);
      setNetwork(online > 0 ? online === targetRelays.length ? "connected" : "partial" : accepted.length ? "partial" : "error");
    } catch { if (generation === connectionGenerationRef.current) { setNetwork("error"); setConnectedRelays(0); setStatus(networkText.loadError); } }
    finally { if (generation === connectionGenerationRef.current) connectingRef.current = false; }
  }

  function consentAndConnect() { void connect(); }

  function disconnect() {
    connectionGenerationRef.current += 1;
    subscriptionRef.current?.close("user-disconnect"); subscriptionRef.current = null;
    poolRef.current?.destroy(); poolRef.current = null;
    connectingRef.current = false; setNetwork("idle"); setConnectedRelays(0); setRelayHealth({}); setEvents([]); setProfiles({}); setInteractions([]); setStatus("");
  }

  async function publishEvent(kind: number, content: string, tags: string[][]) {
    if (!secret || !poolRef.current || network === "idle" || network === "error") { setStatus(t.noIdentity); return null; }
    const { finalizeEvent } = await import("nostr-tools/pure");
    const event = finalizeEvent({ kind, created_at: Math.floor(Date.now() / 1000), content, tags }, secret);
    const results = await Promise.allSettled(poolRef.current.publish(relays, event, { maxWait: 6500 }));
    if (!results.some((result) => result.status === "fulfilled")) throw new Error("relay-rejected");
    return event;
  }

  async function updateProfile() {
    if (!secret || !identity) return;
    if (!allowAction("profile", 3, 10 * 60 * 1000)) return;
    const profile = { name: clean(profileDraft.name, 40), about: clean(profileDraft.about, 180) };
    if (profile.name.length < 2 || reviewCommunityText(`${profile.name}\n${profile.about}`).length) { setStatus(t.unsafe); return; }
    setBusy(true); setStatus("");
    try {
      await publishEvent(0, JSON.stringify({ name: profile.name, display_name: profile.name, about: profile.about }), []);
      const nextIdentity = { ...identity, name: profile.name, about: profile.about };
      setIdentity(nextIdentity); localStorage.setItem(identityKey, JSON.stringify(nextIdentity));
      setProfiles((current) => ({ ...current, [identity.pubkey]: profile })); setStatus(t.published);
    } catch { setStatus(t.error); } finally { setBusy(false); }
  }

  async function createIdentity() {
    if (profileDraft.name.trim().length < 2 || profileDraft.passphrase.length < 12) { setStatus(t.identityError); return; }
    if (reviewCommunityText(`${profileDraft.name}\n${profileDraft.about}`).length) { setStatus(t.unsafe); return; }
    setBusy(true); setStatus("");
    try {
      const { generateSecretKey, getPublicKey } = await import("nostr-tools/pure");
      const nextSecret = generateSecretKey(); const pubkey = getPublicKey(nextSecret);
      const stored = await encryptSecret(nextSecret, profileDraft.passphrase, { name: clean(profileDraft.name, 40), about: clean(profileDraft.about, 180) }, pubkey);
      localStorage.setItem(identityKey, JSON.stringify(stored)); setIdentity(stored); setSecret(nextSecret); setProfileDraft((current) => ({ ...current, passphrase: "" }));
      if (poolRef.current && network !== "idle" && network !== "error") {
        const { finalizeEvent } = await import("nostr-tools/pure");
        const event = finalizeEvent({ kind: 0, created_at: Math.floor(Date.now() / 1000), content: JSON.stringify({ name: stored.name, display_name: stored.name, about: stored.about }), tags: [] }, nextSecret);
        await Promise.allSettled(poolRef.current.publish(relays, event, { maxWait: 6500 }));
      }
    } catch { setStatus(t.identityError); } finally { setBusy(false); }
  }

  async function unlockIdentity() {
    if (!identity || profileDraft.passphrase.length < 12) { setStatus(t.identityError); return; }
    setBusy(true); setStatus("");
    try {
      const nextSecret = await decryptSecret(identity, profileDraft.passphrase);
      const { getPublicKey } = await import("nostr-tools/pure"); if (getPublicKey(nextSecret) !== identity.pubkey) throw new Error("identity-mismatch");
      setSecret(nextSecret); setProfileDraft((current) => ({ ...current, passphrase: "" }));
    } catch { setStatus(t.identityError); } finally { setBusy(false); }
  }

  async function publishPost() {
    const content: SocialContent = { v: 1, title: clean(composer.title, 120), body: clean(composer.body, 3000), kind: composer.kind, group: clean(composer.group, 40), source: quoteSource };
    if (!secret) { setStatus(t.noIdentity); return; }
    if (!allowAction("post", 3, 10 * 60 * 1000)) return;
    if (content.title.length < 3 || content.body.length < 10 || reviewCommunityText(`${content.title}\n${content.body}`).length) { setStatus(t.unsafe); return; }
    setBusy(true); setStatus("");
    try {
      const previous = editingId ? events.find((item) => item.id === editingId && item.pubkey === identity?.pubkey) : undefined;
      const tags = [["t", "bytequant"], ["t", `bytequant-${content.kind}`], ["g", content.group.toLocaleLowerCase().replace(/[^a-z0-9\p{L}]+/gu, "-").slice(0, 40)], ["lang", locale], ["client", "ByteQuant"]];
      if (previous) tags.push(["e", previous.id, "", "replace"], ["edited", previous.id]);
      const event = await publishEvent(1, JSON.stringify(content), tags);
      if (event) {
        setEvents((current) => [event, ...current.filter((item) => item.id !== event.id && item.id !== previous?.id)]);
        setComposer({ title: "", body: "", kind: "workflow", group: "ByteQuant" }); setQuoteSource(undefined); setEditingId(""); setComposerOpen(false);
        if (previous) {
          try { await publishEvent(5, "Replaced by an edited version", [["e", previous.id], ["k", "1"], ["t", "bytequant"], ["client", "ByteQuant"]]); setStatus(actions.updated); }
          catch { setStatus(actions.updatedPartial); }
        } else setStatus(t.published);
      }
    } catch { setStatus(t.error); } finally { setBusy(false); }
  }

  function editPost(event: NostrEvent, content: SocialContent) {
    if (!identity || event.pubkey !== identity.pubkey) return;
    setEditingId(event.id); setComposer({ title: content.title, body: content.body, kind: content.kind, group: content.group }); setQuoteSource(content.source); setComposerOpen(true); document.getElementById("global-community")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function deletePost(event: NostrEvent) {
    if (!identity || event.pubkey !== identity.pubkey || !secret || !window.confirm(actions.removeConfirm) || !allowAction("delete", 4, 10 * 60 * 1000)) return;
    setBusy(true); setStatus("");
    try {
      const deletion = await publishEvent(5, "Deleted by author", [["e", event.id], ["k", "1"], ["t", "bytequant"], ["client", "ByteQuant"]]);
      if (deletion) { setEvents((current) => current.filter((item) => item.id !== event.id)); setSaved((current) => current.filter((id) => id !== event.id)); setStatus(actions.removed); }
    } catch { setStatus(t.error); } finally { setBusy(false); }
  }

  async function react(event: NostrEvent, kind: 1 | 6 | 7) {
    if (!secret) { setStatus(t.noIdentity); return; }
    if (!allowAction(kind === 1 ? "comment" : "reaction", kind === 1 ? 8 : 16, 5 * 60 * 1000)) return;
    setBusy(true); setStatus("");
    try {
      const content = kind === 7 ? "+" : kind === 6 ? JSON.stringify(event) : clean(reply[event.id] ?? "", 800);
      if (kind === 1 && (content.length < 3 || reviewCommunityText(content).length)) { setStatus(t.unsafe); return; }
      const next = await publishEvent(kind, content, [["e", event.id, "", "root"], ["p", event.pubkey], ["t", "bytequant"], ["client", "ByteQuant"]]);
      if (next) { setInteractions((current) => [next, ...current.filter((item) => item.id !== next.id)]); if (kind === 1) setReply((current) => ({ ...current, [event.id]: "" })); setStatus(networkText.reactionSent); }
    } catch { setStatus(t.error); } finally { setBusy(false); }
  }

  const interactionCounts = useMemo(() => interactions.reduce<Record<string, number>>((counts, event) => { const target = tagValue(event, "e"); if (target) counts[target] = (counts[target] ?? 0) + 1; return counts; }, {}), [interactions]);
  const socialPosts = useMemo(() => events.flatMap((event) => { const content = parsePost(event); return content ? [{ event, content }] : []; }).filter(({ event, content }) => !blocked.includes(event.pubkey) && (!savedOnly || saved.includes(event.id)) && (!mineOnly || event.pubkey === identity?.pubkey) && (!followingOnly || following.includes(event.pubkey)) && (!groupFilter || content.group === groupFilter) && `${content.title} ${content.body} ${content.group} ${profiles[event.pubkey]?.name ?? ""}`.toLocaleLowerCase(localeTags[locale]).includes(query.trim().toLocaleLowerCase(localeTags[locale]))).sort((a, b) => {
    if (!activeSort) return b.event.created_at - a.event.created_at;
    return (interactionCounts[b.event.id] ?? 0) - (interactionCounts[a.event.id] ?? 0) || b.event.created_at - a.event.created_at;
  }), [activeSort, blocked, events, following, followingOnly, groupFilter, identity?.pubkey, interactionCounts, locale, mineOnly, profiles, query, saved, savedOnly]);
  const groupCounts = useMemo(() => Object.entries(events.reduce<Record<string, number>>((result, event) => { const group = parsePost(event)?.group; if (group) result[group] = (result[group] ?? 0) + 1; return result; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 8), [events]);
  const authorCounts = useMemo(() => Object.entries(events.reduce<Record<string, number>>((result, event) => { result[event.pubkey] = (result[event.pubkey] ?? 0) + 1; return result; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6), [events]);

  function setHidden(pubkey: string) { if (!window.confirm(networkText.hideConfirm)) return; const next = [...new Set([...blocked, pubkey])].slice(-100); setBlocked(next); try { localStorage.setItem(blockedKey, JSON.stringify(next)); } catch { /* optional local moderation preference */ } }
  function toggleSaved(id: string) { const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id].slice(-200); setSaved(next); try { localStorage.setItem("bytequant:nostr-saved:v1", JSON.stringify(next)); } catch { /* optional saved-post preference */ } }
  function toggleFollowing(pubkey: string) { const next = following.includes(pubkey) ? following.filter((item) => item !== pubkey) : [...following, pubkey].slice(-200); setFollowing(next); try { localStorage.setItem(followingKey, JSON.stringify(next)); } catch { /* optional device-only preference */ } }
  async function share(event: NostrEvent) { const { nip19 } = await import("nostr-tools"); const value = `nostr:${nip19.neventEncode({ id: event.id, author: event.pubkey, relays })}`; if (navigator.share) { try { await navigator.share({ title: "ByteQuant Community", text: value }); return; } catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; } } try { await navigator.clipboard.writeText(value); setStatus(networkText.copiedLink); } catch { setStatus(t.error); } }
  function backupIdentity() {
    if (!identity) return;
    const blob = new Blob([JSON.stringify({ type: "bytequant-nostr-profile", version: 1, identity }, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = href; anchor.download = `bytequant-nostr-${identity.pubkey.slice(0, 8)}.json`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 0); setStatus(t.backupReady);
  }
  async function restoreIdentity(file: File | undefined) {
    if (!file || file.size > 16_000 || file.type && file.type !== "application/json") { setStatus(t.identityError); return; }
    try {
      const parsed = JSON.parse(await file.text()) as { type?: string; version?: number; identity?: unknown };
      if (parsed.type !== "bytequant-nostr-profile" || parsed.version !== 1 || !validStoredIdentity(parsed.identity)) throw new Error("invalid-backup");
      localStorage.setItem(identityKey, JSON.stringify(parsed.identity)); setIdentity(parsed.identity); setSecret(null); setProfileDraft({ name: parsed.identity.name, about: parsed.identity.about, passphrase: "" }); setStatus(t.restoreReady);
    } catch { setStatus(t.identityError); }
  }

  const filtersActive = Boolean(query || groupFilter || savedOnly || mineOnly || followingOnly);
  const showingStarterFeed = events.length === 0 && !filtersActive;
  const visiblePosts = showingStarterFeed ? starters[locale].map((content) => ({ event: { id: content.id, pubkey: "bytequant", created_at: 0, kind: 1, tags: [], content: JSON.stringify(content), sig: "" } as NostrEvent, content })) : socialPosts;
  const displayedPosts = visiblePosts.slice(0, feedLimit);
  const stateLabel = network === "connected" ? t.connected : network === "partial" ? t.partial : network === "connecting" ? t.connecting : network === "error" ? t.error : t.connect;
  const starterExplanation = network === "connected" || network === "partial" ? networkText.examplesEmpty : networkText.examplesOffline;
  const relaySummary = relays.map((relay) => {
    let name = relay;
    try { name = new URL(relay).hostname; } catch { /* Relays are validated before storage. */ }
    const state = network === "connecting" ? networkText.relayChecking : relayHealth[relay] ? networkText.relayReady : networkText.relayUnavailable;
    return `${name}: ${state}`;
  }).join(" · ");

  function clearFeedFilters() {
    setActiveSort(false); setMineOnly(false); setSavedOnly(false); setFollowingOnly(false); setGroupFilter(""); setQuery("");
  }

  return <section className="community-network" aria-labelledby="global-community-title">
    <header className="community-network-head">
      <div>
        <span className="eyebrow"><i />{t.eyebrow}</span>
        <h2 id="global-community-title">{t.title}</h2>
        <p>{t.intro}</p>
      </div>
      <div className={`community-network-status status-${network}`} aria-busy={network === "connecting"}>
        <span aria-hidden="true" />
        <strong role="status" aria-live="polite">{stateLabel}</strong>
        <small className="community-status-summary">{network === "connected" || network === "partial" ? networkText.liveSummary : networkText.guestSummary}</small>
        <details className="community-connection-details"><summary>{networkText.connectionDetails}</summary><p>{t.relayDisclosure}</p><p>{networkText.relayHealth}: {relaySummary}</p></details>
        {network === "connected" || network === "partial" ? <>
          <div className="community-network-stats"><b>{connectedRelays}</b><small>{networkText.connectedRelays}</small><b>{events.length}</b><small>{networkText.visiblePosts}</small></div>
          <div className="community-network-buttons"><button type="button" onClick={() => void connect()}>{t.refresh}</button><button type="button" onClick={disconnect}>{networkText.disconnect}</button></div>
        </> : <button className="primary-button" type="button" disabled={network === "connecting"} onClick={consentAndConnect}>{network === "connecting" ? t.connecting : `${t.connect} →`}</button>}
      </div>
    </header>
    <div className="community-network-disclosure"><span aria-hidden="true">ⓘ</span><p><strong>{networkText.readStep}</strong> {networkText.readStepBody} <strong>{networkText.shareStep}</strong> {networkText.shareStepBody}</p><details><summary>{t.explain}</summary><p>{networkText.consent} {t.explainBody}</p></details></div>
    <div className="community-security-strip" aria-label={t.moderation}>{t.security.map((item, index) => <span key={item}><i>{index === 0 ? "✓" : index === 1 ? "◎" : "⌁"}</i>{item}</span>)}</div>

    <div className="community-social-layout">
      <aside className="community-social-left">
        <section className="community-identity-card" id="community-profile">
          <header><span className="community-avatar">{(identity?.name || "BQ").slice(0, 2).toLocaleUpperCase(localeTags[locale])}</span><div><strong>{t.identity}</strong><small>{secret ? t.identityReady : identity ? t.identityLocked : t.create}</small></div></header>
          <details className="community-profile-setup">
            <summary>{t.profileSettings}<span aria-hidden="true">+</span></summary>
            <p className="community-public-warning">{t.publicProfile}</p>
            <label><span>{t.name}</span><input value={profileDraft.name} maxLength={40} disabled={Boolean(identity) && !secret} onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))} /></label>
            <label><span>{t.about}</span><textarea value={profileDraft.about} maxLength={180} rows={3} disabled={Boolean(identity) && !secret} onChange={(event) => setProfileDraft((current) => ({ ...current, about: event.target.value }))} /></label>
            {!secret && <label><span>{t.pass}</span><input type="password" value={profileDraft.passphrase} minLength={12} autoComplete={identity ? "current-password" : "new-password"} onChange={(event) => setProfileDraft((current) => ({ ...current, passphrase: event.target.value }))} /><small>{t.passHint}</small></label>}
            {!identity ? <button type="button" className="primary-button" disabled={busy} onClick={() => void createIdentity()}>{t.create}</button> : !secret ? <button type="button" className="primary-button" disabled={busy} onClick={() => void unlockIdentity()}>{t.unlock}</button> : <div className="community-profile-actions"><button type="button" className="primary-button" disabled={busy || !(network === "connected" || network === "partial")} onClick={() => void updateProfile()}>{t.publish}</button><button type="button" onClick={() => { setSecret((current) => { current?.fill(0); return null; }); setStatus(""); }}>{t.lock}</button></div>}
            {identity && <><div className="community-public-key"><small>{t.npub}</small><code>{identity.pubkey.slice(0, 12)}…{identity.pubkey.slice(-8)}</code><button type="button" onClick={async () => { const { nip19 } = await import("nostr-tools"); try { await navigator.clipboard.writeText(nip19.npubEncode(identity.pubkey)); setStatus(t.copied); } catch { setStatus(t.error); } }}>{t.copyId}</button></div><div className="community-backup-actions"><button type="button" onClick={backupIdentity}>{t.backup}</button><button type="button" onClick={() => importRef.current?.click()}>{t.restore}</button><input aria-label={t.restore} ref={importRef} hidden type="file" accept="application/json" onChange={(event) => { void restoreIdentity(event.target.files?.[0]); event.currentTarget.value = ""; }} /></div><details className="community-danger-zone"><summary>{t.resetIdentity}</summary><button type="button" onClick={() => { if (!window.confirm(t.resetConfirm)) return; try { localStorage.removeItem(identityKey); } catch { /* state can still be cleared for this session */ } setIdentity(null); setSecret((current) => { current?.fill(0); return null; }); setProfileDraft({ name: "", about: "", passphrase: "" }); }}>{t.resetIdentity}</button></details></>}
          </details>
        </section>
      </aside>

      <section className="community-social-main" id="community-feed" aria-label={t.feed}>
        <nav className="community-social-nav" aria-label={t.feed}>
          <button type="button" aria-pressed={!activeSort && !mineOnly && !savedOnly && !followingOnly && !groupFilter} className={!activeSort && !mineOnly && !savedOnly && !followingOnly && !groupFilter ? "active" : ""} onClick={clearFeedFilters}>⌂ {networkText.newest}</button>
          <button type="button" aria-pressed={activeSort && !mineOnly && !savedOnly && !followingOnly} className={activeSort && !mineOnly && !savedOnly && !followingOnly ? "active" : ""} onClick={() => { setActiveSort(true); setMineOnly(false); setFollowingOnly(false); setQuery(""); setGroupFilter(""); setSavedOnly(false); }}>◉ {networkText.active}</button>
          <button type="button" aria-pressed={followingOnly} className={followingOnly ? "active" : ""} onClick={() => { setFollowingOnly(true); setActiveSort(false); setMineOnly(false); setSavedOnly(false); setGroupFilter(""); setQuery(""); }}>＋ {networkText.following}</button>
          <button type="button" aria-pressed={mineOnly} className={mineOnly ? "active" : ""} disabled={!identity} title={!identity ? networkText.profileFirst : undefined} onClick={() => { setMineOnly(true); setFollowingOnly(false); setSavedOnly(false); setGroupFilter(""); setQuery(""); }}>◎ {networkText.myPosts}</button>
          <button type="button" aria-pressed={savedOnly} className={savedOnly ? "active" : ""} onClick={() => { setSavedOnly(true); setFollowingOnly(false); setMineOnly(false); setGroupFilter(""); setQuery(""); }}>☆ {networkText.savedLabel}</button>
        </nav>
        <p className="community-feed-hint">{followingOnly ? networkText.localFollow : networkText.feedHint}</p>
        <section className={`community-global-composer${composerOpen ? " open" : ""}`} id="community-compose">
          <button type="button" className="community-compose-launch" aria-expanded={composerOpen} aria-controls="community-composer-fields" onClick={() => { if (!secret) { const profile = document.querySelector<HTMLDetailsElement>("#community-profile .community-profile-setup"); if (profile) profile.open = true; document.getElementById("community-profile")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; } setComposerOpen((value) => !value); }}><span className="community-avatar">{(identity?.name || "BQ").slice(0, 2).toLocaleUpperCase(localeTags[locale])}</span><span><strong>{editingId ? actions.editing : composerOpen ? t.closeComposer : t.startPost}</strong><small>{secret ? t.composeHint : networkText.profileFirst}</small></span><b aria-hidden="true">{composerOpen ? "×" : "+"}</b></button>
          {composerOpen && <div className="community-composer-fields" id="community-composer-fields">{quoteSource && <aside className="community-source-quote"><small>{actions.quoted} · {quoteSource.source}</small><strong>{quoteSource.title}</strong><a href={quoteSource.url} target="_blank" rel="nofollow noreferrer noopener">{actions.source} ↗</a></aside>}<input aria-label={t.titleLabel} value={composer.title} maxLength={120} onChange={(event) => setComposer((current) => ({ ...current, title: event.target.value }))} placeholder={t.titleLabel} /><textarea aria-label={t.body} value={composer.body} maxLength={3000} rows={5} onChange={(event) => setComposer((current) => ({ ...current, body: event.target.value }))} placeholder={t.body} /><small className="community-character-count">{composer.title.length}/120 · {composer.body.length}/3000</small><div className="community-composer-meta"><label><span>{t.kind}</span><select value={composer.kind} onChange={(event) => setComposer((current) => ({ ...current, kind: event.target.value as SocialKind }))}>{(Object.keys(t.kinds) as SocialKind[]).map((kind) => <option key={kind} value={kind}>{t.kinds[kind]}</option>)}</select></label><label><span>{t.group}</span><input value={composer.group} maxLength={40} onChange={(event) => setComposer((current) => ({ ...current, group: event.target.value }))} /></label>{editingId && <button type="button" onClick={() => { setEditingId(""); setQuoteSource(undefined); setComposer({ title: "", body: "", kind: "workflow", group: "ByteQuant" }); }}>{actions.cancel}</button>}<button type="button" className="primary-button" disabled={!secret || busy || !(network === "connected" || network === "partial") || composer.title.trim().length < 3 || composer.body.trim().length < 10} onClick={() => void publishPost()}>{busy ? t.publishing : editingId ? actions.update : t.publish} ↑</button></div></div>}
        </section>
        <div className="community-feed-toolbar"><label><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSavedOnly(false); setMineOnly(false); }} placeholder={t.search} /></label><div role="group" aria-label={networkText.topicsLabel}><button type="button" aria-pressed={!groupFilter} className={!groupFilter ? "active" : ""} onClick={() => { setGroupFilter(""); setSavedOnly(false); setMineOnly(false); }}>{t.all}</button>{groupCounts.slice(0, 4).map(([group, count]) => <button type="button" aria-pressed={groupFilter === group} className={groupFilter === group ? "active" : ""} onClick={() => { setGroupFilter(group); setSavedOnly(false); setMineOnly(false); }} key={group}>#{group} · {count}</button>)}</div></div>
        {status && <p className="community-network-message" role="status" aria-live="polite">{status}</p>}
        {showingStarterFeed && <div className="community-starter-label" role="note"><strong>{t.localStarter}</strong><span>{starterExplanation}</span></div>}
        <div className="community-global-feed" aria-busy={network === "connecting"}>{displayedPosts.map(({ event, content }) => {
          const isExample = event.pubkey === "bytequant";
          const profile = profiles[event.pubkey] ?? { name: isExample ? "ByteQuant" : `${event.pubkey.slice(0, 8)}…`, about: "" };
          const postInteractions = interactions.filter((item) => tagValue(item, "e") === event.id);
          const comments = postInteractions.filter((item) => item.kind === 1 && clean(item.content, 800).length >= 3 && reviewCommunityText(item.content).length === 0);
          const likeAuthors = new Set(postInteractions.filter((item) => item.kind === 7 && item.content === "+").map((item) => item.pubkey));
          const likes = likeAuthors.size;
          const reposts = new Set(postInteractions.filter((item) => item.kind === 6).map((item) => item.pubkey)).size;
          const likedByMe = Boolean(identity && likeAuthors.has(identity.pubkey));
          const owned = Boolean(secret && identity && event.pubkey === identity.pubkey);
          const repliesId = `community-replies-${event.id}`;
          const interactionTitle = isExample ? networkText.exampleNoActions : !secret ? networkText.profileFirst : undefined;
          return <article className={`community-global-post${owned ? " owned" : ""}`} data-origin={isExample ? "editorial-example" : "nostr-relay"} key={event.id}>
            <header><span className="community-avatar">{profile.name.slice(0, 2).toLocaleUpperCase(localeTags[locale])}</span><div><strong>{profile.name}</strong><small>{event.created_at ? new Date(event.created_at * 1000).toLocaleString(localeTags[locale], { dateStyle: "medium", timeStyle: "short" }) : t.editorial}</small></div>{owned ? <div className="community-owner-actions" role="group" aria-label={networkText.ownerActions}><button type="button" onClick={() => editPost(event, content)}>{actions.edit}</button><button type="button" disabled={busy} onClick={() => void deletePost(event)}>{actions.remove}</button></div> : <div className="community-post-author-actions">{!isExample && <button type="button" className="community-follow-button" aria-pressed={following.includes(event.pubkey)} onClick={() => toggleFollowing(event.pubkey)}>{following.includes(event.pubkey) ? networkText.unfollow : networkText.follow}</button>}<button type="button" disabled={isExample} onClick={() => setHidden(event.pubkey)} aria-label={t.block} title={isExample ? networkText.exampleNoActions : t.block}>×</button></div>}</header>
            <div className="community-post-meta">{isExample && <span>{networkText.exampleBadge}</span>}<span>{t.kinds[content.kind]}</span>{content.group && <button type="button" onClick={() => { setGroupFilter(content.group); setMineOnly(false); setSavedOnly(false); }}>#{content.group}</button>}</div>
            <h3>{content.title}</h3><p>{content.body}</p>
            {content.source && <aside className="community-source-quote"><small>{actions.quoted} · {content.source.source}</small><strong>{content.source.title}</strong><a href={content.source.url} target="_blank" rel="nofollow noreferrer noopener">{actions.source} ↗</a></aside>}
            <footer aria-label={networkText.postActions}>
              <button type="button" aria-label={`${t.like}: ${likes}`} aria-pressed={likedByMe} className={likedByMe ? "active" : ""} disabled={!secret || likedByMe || isExample} title={interactionTitle} onClick={() => void react(event, 7)}>♡ {t.like}{likes ? ` · ${likes}` : ""}</button>
              <button type="button" aria-label={`${t.comment}: ${comments.length}`} aria-controls={repliesId} aria-expanded={reply[event.id] !== undefined} disabled={isExample} title={isExample ? networkText.exampleNoActions : undefined} onClick={() => setReply((current) => { const next = { ...current }; if (Object.hasOwn(next, event.id)) delete next[event.id]; else next[event.id] = ""; return next; })}>◌ {t.comment}{comments.length ? ` · ${comments.length}` : ""}</button>
              <button type="button" aria-label={`${t.repost}: ${reposts}`} disabled={!secret || isExample} title={interactionTitle} onClick={() => void react(event, 6)}>↻ {t.repost}{reposts ? ` · ${reposts}` : ""}</button>
              {!isExample && <button type="button" aria-label={networkText.savedLabel} aria-pressed={saved.includes(event.id)} className={saved.includes(event.id) ? "active" : ""} onClick={() => toggleSaved(event.id)}>☆</button>}
              <button type="button" disabled={isExample} title={isExample ? networkText.exampleNoActions : undefined} onClick={() => void share(event)}>↗ {t.share}</button>
            </footer>
            {reply[event.id] !== undefined && <section className="community-global-comments" id={repliesId} aria-label={t.comments}>{comments.map((comment) => <p key={comment.id}><strong>{profiles[comment.pubkey]?.name ?? `${comment.pubkey.slice(0, 8)}…`}</strong>{clean(comment.content, 800)}</p>)}<div><textarea aria-label={t.commentPlaceholder} value={reply[event.id]} rows={2} maxLength={800} placeholder={t.commentPlaceholder} onChange={(change) => setReply((current) => ({ ...current, [event.id]: change.target.value }))} /><button type="button" disabled={!secret || !(reply[event.id] ?? "").trim()} title={!secret ? networkText.profileFirst : undefined} onClick={() => void react(event, 1)}>{t.sendComment}</button></div></section>}
          </article>;
        })}{!visiblePosts.length && <div className="community-network-empty"><span aria-hidden="true">◎</span><p>{followingOnly ? networkText.emptyFollowing : mineOnly ? networkText.noOwnPosts : filtersActive ? networkText.emptyFiltered : t.empty}</p>{filtersActive && <button type="button" className="secondary-button" onClick={clearFeedFilters}>{networkText.clearFilters}</button>}</div>}{visiblePosts.length > displayedPosts.length && <button type="button" className="community-load-more" onClick={() => setFeedLimit((current) => current + 12)}>{networkText.loadMore}<small>{visiblePosts.length - displayedPosts.length} {networkText.remaining}</small></button>}</div>
      </section>

      <aside className="community-social-right">
        <section id="community-topics"><header><span>#</span><strong>{t.activeGroups}</strong></header>{groupCounts.length ? groupCounts.map(([group, count]) => <button type="button" onClick={() => { setGroupFilter(group); setMineOnly(false); setSavedOnly(false); }} key={group}><span>#{group}</span><small>{count}</small></button>) : <p>{networkText.connectFirst}</p>}</section>
        <section id="community-people"><header><span>◎</span><strong>{t.liveProfiles}</strong></header>{authorCounts.length ? authorCounts.map(([pubkey, count]) => <button type="button" onClick={() => { setQuery(profiles[pubkey]?.name ?? pubkey.slice(0, 8)); setMineOnly(false); setSavedOnly(false); }} key={pubkey}><span className="community-avatar">{(profiles[pubkey]?.name ?? pubkey).slice(0, 2).toLocaleUpperCase(localeTags[locale])}</span><span>{profiles[pubkey]?.name ?? `${pubkey.slice(0, 8)}…`}<small>{count}</small></span></button>) : <p>{networkText.connectFirst}</p>}</section>
        <section className="community-moderation-card"><header><span>◉</span><strong>{t.moderation}</strong></header><p>{t.moderationBody}</p><small>{blocked.length} · {t.blocked}</small>{blocked.length > 0 && <button type="button" onClick={() => { setBlocked([]); try { localStorage.removeItem(blockedKey); } catch { /* the in-memory list is still cleared */ } }}>{t.clearBlocked}</button>}</section>
        <details className="community-relay-settings"><summary>{t.relaySettings}<span aria-hidden="true">+</span></summary><p>{t.relayHelp}</p><textarea aria-label={t.relaySettings} value={relayDraft} rows={4} maxLength={2_500} onChange={(event) => setRelayDraft(event.target.value)} /><button type="button" onClick={() => { const next = validRelays(relayDraft); if (!next.length) { setStatus(t.error); return; } disconnect(); setRelays(next); setRelayDraft(next.join("\n")); try { localStorage.setItem(relayKey, JSON.stringify(next)); } catch { /* current-session relay choice still works */ } }}>{t.saveRelays}</button></details>
      </aside>
    </div>
  </section>;
}
