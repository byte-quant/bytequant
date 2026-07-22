"use client";

import { useEffect, useMemo, useState } from "react";
import { reviewCommunityText } from "../lib/community-safety";
import type { Locale } from "../lib/site";
import { communityPublishEvent } from "./CommunityComposer";

type Kind = "workflow" | "tip" | "idea" | "question";
type FeedPost = { id: string; kind: Kind; title: string; body: string; recipe: string; local: boolean; createdAt: number };
type FeedComment = { id: string; body: string; createdAt: number };
type FeedState = { posts: FeedPost[]; liked: string[]; comments: Record<string, FeedComment[]> };
type SharedDraft = { version: 1; kind: Kind; title: string; body: string; recipe: string };

const storageKey = "bytequant:community-feed:v1";
const kindOrder: Kind[] = ["workflow", "tip", "idea", "question"];
const copy = {
  tr: { eyebrow: "YEREL TOPLULUK AKIŞI", title: "Keşfedin, tepki verin ve hesabınız olmadan katkı yapın", intro: "Bu sosyal akış yalnızca bu sekmede yaşar. Beğeniler ve yorumlar gerçek cihaz içi etkileşimlerdir; küresel popülerlik sayacı gibi gösterilmez. Bir bağlantı paylaştığınızda içerik yalnızca seçtiğiniz kişiye gider.", all: "Keşfet", mine: "Paylaşımlarım", search: "Başlık veya yöntemde ara", empty: "Bu görünümde henüz paylaşım yok. Aşağıdaki güvenli taslakla ilk paylaşımınızı ekleyebilirsiniz.", likes: "Beğen", liked: "Beğendiniz", comment: "Yorum", share: "Paylaş", comments: "Yerel yorumlar", placeholder: "Yapıcı bir yorum yazın; kişisel veri veya sır eklemeyin.", add: "Yorumu ekle", blocked: "Yorum eklenemedi: kişisel veri, sır, dış bağlantı veya uygunsuz dil olabilir.", short: "Yorum en az 3 karakter olmalı.", shared: "Paylaşım bağlantısı kopyalandı.", local: "Bu cihaz", curated: "Başlangıç örneği", kinds: { workflow: "İş akışı", tip: "İpucu", idea: "Fikir", question: "Soru" } },
  en: { eyebrow: "LOCAL COMMUNITY FEED", title: "Explore, react, and contribute without an account", intro: "This social feed lives only in this tab. Likes and comments are genuine on-device interactions and are never presented as global popularity. A share link sends content only to the people you choose.", all: "Explore", mine: "My posts", search: "Search titles or methods", empty: "There are no posts in this view yet. Use the safe composer below to add the first one.", likes: "Like", liked: "Liked", comment: "Comment", share: "Share", comments: "Local comments", placeholder: "Write a constructive comment; do not include personal data or secrets.", add: "Add comment", blocked: "Comment blocked: it may contain personal data, a secret, an external link, or abusive language.", short: "A comment needs at least 3 characters.", shared: "Share link copied.", local: "This device", curated: "Starter example", kinds: { workflow: "Workflow", tip: "Tip", idea: "Idea", question: "Question" } },
  de: { eyebrow: "LOKALER COMMUNITY-FEED", title: "Entdecken, reagieren und ohne Konto beitragen", intro: "Dieser soziale Feed bleibt in diesem Tab. Likes und Kommentare sind echte lokale Interaktionen und werden nie als globale Beliebtheit dargestellt. Ein Teilungslink geht nur an gewählte Personen.", all: "Entdecken", mine: "Meine Beiträge", search: "Titel oder Methode suchen", empty: "In dieser Ansicht gibt es noch keine Beiträge. Mit dem sicheren Formular unten können Sie den ersten hinzufügen.", likes: "Gefällt mir", liked: "Gefällt Ihnen", comment: "Kommentar", share: "Teilen", comments: "Lokale Kommentare", placeholder: "Konstruktiv kommentieren; keine Personendaten oder Geheimnisse.", add: "Kommentar hinzufügen", blocked: "Kommentar blockiert: mögliche Personendaten, Geheimnisse, externer Link oder Missbrauch.", short: "Ein Kommentar benötigt mindestens 3 Zeichen.", shared: "Teilungslink kopiert.", local: "Dieses Gerät", curated: "Startbeispiel", kinds: { workflow: "Ablauf", tip: "Tipp", idea: "Idee", question: "Frage" } },
  zh: { eyebrow: "本地社区动态", title: "无需账号即可发现、互动与贡献", intro: "此社交动态仅存在于当前标签页。点赞与评论是真实的设备内互动，不会伪装成全站热度。分享链接只会发送给您选择的人。", all: "发现", mine: "我的分享", search: "搜索标题或方法", empty: "当前视图还没有分享。可使用下方安全编辑器添加第一条。", likes: "点赞", liked: "已点赞", comment: "评论", share: "分享", comments: "本地评论", placeholder: "写下建设性评论；不要包含个人数据或密钥。", add: "添加评论", blocked: "评论被阻止：可能包含个人数据、密钥、外部链接或不当语言。", short: "评论至少需要 3 个字符。", shared: "分享链接已复制。", local: "本设备", curated: "起始示例", kinds: { workflow: "工作流", tip: "技巧", idea: "建议", question: "问题" } },
} as const;

const curated: Record<Locale, FeedPost[]> = {
  tr: [
    { id: "starter-privacy", kind: "workflow", title: "Gerçek kayıt kullanmadan KVKK akışını prova edin", body: "Yapay bir CSV örneği yükleyin, hassas sütunları maskeleyin ve JSON çıktısını yapısal olarak doğrulayın. İlk denemede gerçek müşteri verisi kullanmayın.", recipe: "", local: false, createdAt: 0 },
    { id: "starter-json", kind: "tip", title: "JSON tesliminden önce üç kısa kontrol", body: "Sözdizimini biçimlendirin, beklenen alanları şemayla doğrulayın ve eski sürümle yapısal diff alın. Böylece yalnızca görünüşü değil veri sözleşmesini de kontrol edersiniz.", recipe: "", local: false, createdAt: 0 },
    { id: "starter-agent", kind: "question", title: "Ajan mı İş İstasyonu mu?", body: "Sonucu biliyor ama araç sırasından emin değilseniz Ajanla başlayın. Tekrarlanabilir bir akışı görsel olarak kurmak ve saklamak istiyorsanız planı İş İstasyonuna aktarın.", recipe: "", local: false, createdAt: 0 },
  ],
  en: [
    { id: "starter-privacy", kind: "workflow", title: "Rehearse a privacy workflow without real records", body: "Load a synthetic CSV sample, mask sensitive columns, and structurally validate the JSON output. Do not use real customer records for the first run.", recipe: "", local: false, createdAt: 0 },
    { id: "starter-json", kind: "tip", title: "Three checks before delivering JSON", body: "Format syntax, validate expected fields against a schema, and run a structural diff against the previous version. This checks the data contract, not only appearance.", recipe: "", local: false, createdAt: 0 },
    { id: "starter-agent", kind: "question", title: "Agent or Workstation?", body: "Start with Agent when you know the outcome but not the tool order. Send the plan to Workstation when you want a visual, repeatable workflow you can keep.", recipe: "", local: false, createdAt: 0 },
  ],
  de: [
    { id: "starter-privacy", kind: "workflow", title: "Datenschutz-Ablauf ohne echte Daten proben", body: "Synthetische CSV laden, sensible Spalten maskieren und die JSON-Ausgabe strukturell prüfen. Beim ersten Lauf keine echten Kundendaten verwenden.", recipe: "", local: false, createdAt: 0 },
    { id: "starter-json", kind: "tip", title: "Drei Prüfungen vor der JSON-Übergabe", body: "Syntax formatieren, erwartete Felder per Schema prüfen und einen strukturellen Diff zur Vorversion ausführen. So wird auch der Datenvertrag geprüft.", recipe: "", local: false, createdAt: 0 },
    { id: "starter-agent", kind: "question", title: "Agent oder Workstation?", body: "Mit dem Agenten starten, wenn das Ziel, aber nicht die Reihenfolge klar ist. Für einen visuellen, wiederholbaren Ablauf den Plan an die Workstation senden.", recipe: "", local: false, createdAt: 0 },
  ],
  zh: [
    { id: "starter-privacy", kind: "workflow", title: "不使用真实记录演练隐私流程", body: "加载合成 CSV，遮蔽敏感列，并对 JSON 输出进行结构验证。第一次运行不要使用真实客户数据。", recipe: "", local: false, createdAt: 0 },
    { id: "starter-json", kind: "tip", title: "交付 JSON 前的三项检查", body: "格式化语法、用 Schema 验证字段，并与旧版本做结构差异比较；检查的不只是外观，还有数据契约。", recipe: "", local: false, createdAt: 0 },
    { id: "starter-agent", kind: "question", title: "助手还是工作站？", body: "知道目标但不确定工具顺序时，先用助手；需要可视化、可复用且可保存的流程时，再发送到工作站。", recipe: "", local: false, createdAt: 0 },
  ],
};

function clean(value: string, max: number) { return value.replace(/[\u0000-\u001F\u007F]/g, "").replace(/<[^>]*>/g, "").trim().slice(0, max); }
function id() { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function validDraft(value: unknown): value is SharedDraft { const draft = value as Partial<SharedDraft>; return Boolean(draft && draft.version === 1 && kindOrder.includes(draft.kind as Kind) && typeof draft.title === "string" && typeof draft.body === "string" && typeof draft.recipe === "string"); }
function safeRecipe(value: string) { return !value || /^https:\/\/(?:www\.)?bytequant\.org\/workspace\/?\?recipe=[A-Za-z0-9_%.-]+$/i.test(value); }
function validPost(value: unknown): value is FeedPost { const post = value as Partial<FeedPost>; return Boolean(post && typeof post.id === "string" && post.id.length <= 120 && kindOrder.includes(post.kind as Kind) && typeof post.title === "string" && typeof post.body === "string" && typeof post.recipe === "string" && safeRecipe(post.recipe) && post.local === true && Number.isFinite(post.createdAt)); }
function validComment(value: unknown): value is FeedComment { const item = value as Partial<FeedComment>; return Boolean(item && typeof item.id === "string" && item.id.length <= 120 && typeof item.body === "string" && item.body.length <= 800 && Number.isFinite(item.createdAt)); }

export function CommunityFeed({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [state, setState] = useState<FeedState>({ posts: [], liked: [], comments: {} });
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<"all" | "mine" | Kind>("all");
  const [query, setQuery] = useState("");
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const parsed = JSON.parse(sessionStorage.getItem(storageKey) ?? "null") as Partial<FeedState> | null;
        if (parsed && Array.isArray(parsed.posts) && Array.isArray(parsed.liked) && parsed.comments && typeof parsed.comments === "object") {
          const comments = Object.fromEntries(Object.entries(parsed.comments).filter(([key, value]) => typeof key === "string" && key.length <= 120 && Array.isArray(value)).map(([key, value]) => [key, value.filter(validComment).slice(-30)]));
          setState({ posts: parsed.posts.filter(validPost).slice(-40), liked: parsed.liked.filter((item): item is string => typeof item === "string" && item.length <= 120).slice(-100), comments });
        }
      } catch { /* tab-only social state is optional */ }
      setHydrated(true);
    });
    const receive = (event: Event) => {
      const draft = (event as CustomEvent<unknown>).detail;
      if (!validDraft(draft) || reviewCommunityText(`${draft.title}\n${draft.body}`).length) return;
      const recipe = clean(draft.recipe, 4000); if (!safeRecipe(recipe)) return;
      const post: FeedPost = { id: id(), kind: draft.kind, title: clean(draft.title, 120), body: clean(draft.body, 5000), recipe, local: true, createdAt: Date.now() };
      setState((current) => ({ ...current, posts: [...current.posts, post].slice(-40) })); setFilter("mine");
    };
    window.addEventListener(communityPublishEvent, receive);
    return () => { cancelAnimationFrame(frame); window.removeEventListener(communityPublishEvent, receive); };
  }, []);
  useEffect(() => { if (hydrated) try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* continue without tab persistence */ } }, [hydrated, state]);

  const posts = useMemo(() => [...curated[locale], ...state.posts].filter((post) => filter === "all" ? true : filter === "mine" ? post.local : post.kind === filter).filter((post) => `${post.title} ${post.body}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [filter, locale, query, state.posts]);
  function toggleLike(postId: string) { setState((current) => ({ ...current, liked: current.liked.includes(postId) ? current.liked.filter((value) => value !== postId) : [...current.liked, postId].slice(-100) })); }
  function addComment(postId: string) {
    const body = clean(comment, 800); if (body.length < 3) { setStatus(t.short); return; } if (reviewCommunityText(body).length) { setStatus(t.blocked); return; }
    setState((current) => ({ ...current, comments: { ...current.comments, [postId]: [...(current.comments[postId] ?? []), { id: id(), body, createdAt: Date.now() }].slice(-30) } })); setComment(""); setStatus("");
  }
  async function share(post: FeedPost) {
    const url = new URL(window.location.href); url.hash = `community-${post.id}`;
    if (navigator.share) { try { await navigator.share({ title: post.title, text: post.body.slice(0, 180), url: url.toString() }); return; } catch { return; } }
    try { await navigator.clipboard.writeText(`${post.title}\n\n${post.body}\n\n${url}`); setStatus(t.shared); } catch { setStatus(post.body); }
  }

  return <section className="community-feed" aria-labelledby="community-feed-title"><header><div><span className="kicker">{t.eyebrow}</span><h2 id="community-feed-title">{t.title}</h2><p>{t.intro}</p></div><label><span className="sr-only">{t.search}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label></header><nav aria-label={t.title}><button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>{t.all}</button><button type="button" className={filter === "mine" ? "active" : ""} onClick={() => setFilter("mine")}>{t.mine} · {state.posts.length}</button>{kindOrder.map((kind) => <button type="button" className={filter === kind ? "active" : ""} key={kind} onClick={() => setFilter(kind)}>{t.kinds[kind]}</button>)}</nav>{status && <p className="community-feed-status" role="status">{status}</p>}<div className="community-feed-grid">{posts.map((post) => { const liked = state.liked.includes(post.id); const comments = state.comments[post.id] ?? []; return <article id={`community-${post.id}`} key={post.id}><header><span>{t.kinds[post.kind]}</span><small>{post.local ? t.local : t.curated}</small></header><h3>{post.title}</h3><p>{post.body}</p>{post.recipe && <a href={post.recipe} rel="nofollow">ByteQuant recipe →</a>}<footer><button type="button" className={liked ? "active" : ""} aria-pressed={liked} onClick={() => toggleLike(post.id)}>♡ {liked ? t.liked : t.likes}{liked ? " · 1" : ""}</button><button type="button" onClick={() => { setActiveComment(activeComment === post.id ? null : post.id); setStatus(""); }}>◌ {t.comment}{comments.length ? ` · ${comments.length}` : ""}</button><button type="button" onClick={() => share(post)}>↗ {t.share}</button></footer>{activeComment === post.id && <div className="community-comments"><strong>{t.comments}</strong>{comments.map((item) => <p key={item.id}><span>↳</span>{item.body}</p>)}<label><span className="sr-only">{t.placeholder}</span><textarea value={comment} maxLength={800} rows={3} onChange={(event) => setComment(event.target.value)} placeholder={t.placeholder} /></label><button type="button" onClick={() => addComment(post.id)}>{t.add}</button></div>}</article>; })}{posts.length === 0 && <div className="community-feed-empty"><span>◎</span><p>{t.empty}</p></div>}</div></section>;
}
