"use client";

import { useMemo, useState } from "react";
import type { Locale } from "../lib/site";

type CommunityKind = "workflow" | "tip" | "idea" | "question";
type ShareDraft = { version: 1; kind: CommunityKind; title: string; body: string; recipe: string };

const copy = {
  tr: { kind: "Paylaşım türü", kinds: { workflow: "İş akışı tarifi", tip: "Araç ipucu", idea: "Yeni özellik fikri", question: "Yöntem sorusu" }, title: "Kısa ve açıklayıcı başlık", body: "Bağlamı, denediğiniz adımları ve beklenen sonucu yazın. Gerçek kişisel veri, parola veya anahtar eklemeyin.", recipe: "İsteğe bağlı ByteQuant tarif bağlantısı", check: "Paylaşımı cihazda kontrol et", safe: "Taslak güvenli paylaşım için hazır", blocked: "Paylaşmadan önce taslağı düzeltin", copy: "Markdown'ı kopyala", copied: "Kopyalandı", link: "Hesapsız paylaşım bağlantısı", linked: "Bağlantı kopyalandı", share: "Cihazla paylaş", download: ".md indir", import: "Bağlantıdaki taslağı aç", imported: "Paylaşılan taslak açıldı", noDraft: "Bu bağlantıda geçerli bir taslak bulunamadı.", discuss: "İsteğe bağlı: GitHub'da yayımla", intro: "Metin yalnızca bu sekmede incelenir. Hesap açmadan bağlantı oluşturabilir, dosya indirebilir veya cihazınızın paylaş menüsünü kullanabilirsiniz.", boundary: "Ön kontrol; açık kötüye kullanım dilini, kişisel veri biçimlerini, sırları ve dış bağlantıları yakalamaya çalışır. Kusursuz moderasyon garantisi değildir. Kalıcı herkese açık yayın için GitHub isteğe bağlıdır.", issues: "Kontrol edilmesi gerekenler", empty: "Başlık en az 8, açıklama en az 40 karakter olmalı.", safeRecipe: "Tarif yalnızca bytequant.org/workspace adresinden olabilir.", templates: "Hazır taslakla başla", templateNames: ["KVKK temizleme akışı", "JSON kalite ipucu", "Yeni araç fikri"] },
  en: { kind: "Post type", kinds: { workflow: "Workflow recipe", tip: "Tool tip", idea: "Feature idea", question: "Method question" }, title: "Short, descriptive title", body: "Describe the context, steps tried, and expected outcome. Do not include real personal data, passwords, or keys.", recipe: "Optional ByteQuant recipe link", check: "Check on this device", safe: "Draft is ready for safe sharing", blocked: "Fix the draft before sharing", copy: "Copy Markdown", copied: "Copied", link: "No-account share link", linked: "Link copied", share: "Share from device", download: "Download .md", import: "Open draft from link", imported: "Shared draft opened", noDraft: "This link does not contain a valid draft.", discuss: "Optional: publish on GitHub", intro: "Text is reviewed only in this tab. Create a link, download a file, or use your device share sheet without creating an account.", boundary: "This pre-check looks for explicit abuse, common personal-data shapes, secrets, and external links. It is not a moderation guarantee. GitHub is optional for persistent public publishing.", issues: "Items to review", empty: "Use at least 8 characters for the title and 40 for the description.", safeRecipe: "A recipe must use bytequant.org/workspace.", templates: "Start from a safe draft", templateNames: ["Privacy-cleaning flow", "JSON quality tip", "New tool idea"] },
  de: { kind: "Beitragstyp", kinds: { workflow: "Ablaufrezept", tip: "Werkzeugtipp", idea: "Funktionsidee", question: "Methodenfrage" }, title: "Kurzer, klarer Titel", body: "Beschreiben Sie Kontext, getestete Schritte und erwartetes Ergebnis. Keine echten Personendaten, Passwörter oder Schlüssel.", recipe: "Optionaler ByteQuant-Rezeptlink", check: "Auf diesem Gerät prüfen", safe: "Entwurf ist sicher teilbar", blocked: "Entwurf vor dem Teilen korrigieren", copy: "Markdown kopieren", copied: "Kopiert", link: "Kontofreier Teilungslink", linked: "Link kopiert", share: "Vom Gerät teilen", download: ".md herunterladen", import: "Entwurf aus Link öffnen", imported: "Geteilter Entwurf geöffnet", noDraft: "Dieser Link enthält keinen gültigen Entwurf.", discuss: "Optional: auf GitHub veröffentlichen", intro: "Text wird nur in diesem Tab geprüft. Ohne Konto können Sie einen Link erstellen, eine Datei laden oder das Teilen-Menü des Geräts nutzen.", boundary: "Die Vorprüfung sucht nach offenem Missbrauch, typischen Personendaten, Geheimnissen und externen Links. Sie ist keine Moderationsgarantie. GitHub bleibt für dauerhafte öffentliche Beiträge optional.", issues: "Zu prüfende Punkte", empty: "Titel mit mindestens 8 und Beschreibung mit mindestens 40 Zeichen verwenden.", safeRecipe: "Ein Rezept muss bytequant.org/workspace verwenden.", templates: "Mit sicherem Entwurf beginnen", templateNames: ["Datenschutz-Ablauf", "JSON-Qualitätstipp", "Neue Werkzeugidee"] },
  zh: { kind: "分享类型", kinds: { workflow: "工作流配方", tip: "工具技巧", idea: "功能建议", question: "方法问题" }, title: "简短明确的标题", body: "说明背景、已尝试步骤与预期结果。请勿加入真实个人数据、密码或密钥。", recipe: "可选 ByteQuant 配方链接", check: "在本设备检查", safe: "草稿可安全分享", blocked: "分享前请修正草稿", copy: "复制 Markdown", copied: "已复制", link: "免账号分享链接", linked: "链接已复制", share: "通过设备分享", download: "下载 .md", import: "打开链接中的草稿", imported: "已打开分享草稿", noDraft: "该链接不包含有效草稿。", discuss: "可选：发布到 GitHub", intro: "文本仅在当前标签页检查。无需账号即可创建链接、下载文件或使用设备分享菜单。", boundary: "预检查会寻找明显滥用、常见个人数据、密钥与外部链接，但不构成完整审核保证。GitHub 仅作为可选的长期公开发布渠道。", issues: "需要检查", empty: "标题至少 8 个字符，说明至少 40 个字符。", safeRecipe: "配方必须使用 bytequant.org/workspace。", templates: "从安全草稿开始", templateNames: ["隐私清理流程", "JSON 质量技巧", "新工具建议"] },
} as const;

const templates = {
  tr: [
    { kind: "workflow", title: "KVKK için yerel veri temizleme akışı", body: "CSV verisini içe aktar, hassas alanları örnek kayıtlarla doğrula, KVKK Maskeleyici ile temizle ve sonucu JSON olarak indir. Gerçek müşteri kaydı yerine yapay örnek kullan." },
    { kind: "tip", title: "JSON çıktısını paylaşmadan önce doğrulama", body: "JSON Biçimlendirici ile sözdizimini kontrol et, JSON Schema ile beklenen alanları doğrula ve yalnızca geçerli örnek çıktıyı paylaş." },
    { kind: "idea", title: "Yerel araç deneyimi için özellik önerisi", body: "Çözmek istediğiniz kullanıcı sorununu, örnek girdiyi, beklenen çıktıyı ve neden yalnızca tarayıcıda çalışması gerektiğini açıklayın." },
  ],
  en: [
    { kind: "workflow", title: "Local privacy-cleaning workflow", body: "Import CSV, verify sensitive columns with synthetic records, mask them locally, and export the result as JSON. Use fabricated examples instead of real customer records." },
    { kind: "tip", title: "Validate JSON before sharing output", body: "Check syntax with JSON Formatter, validate expected fields with JSON Schema, and share only a valid synthetic result." },
    { kind: "idea", title: "Feature proposal for a local tool", body: "Describe the user problem, an example input, the expected output, and why the operation should stay entirely in the browser." },
  ],
  de: [
    { kind: "workflow", title: "Lokaler Ablauf zur Datenbereinigung", body: "CSV importieren, sensible Spalten mit synthetischen Datensätzen prüfen, lokal maskieren und als JSON exportieren. Keine echten Kundendaten verwenden." },
    { kind: "tip", title: "JSON vor dem Teilen validieren", body: "Syntax mit dem JSON-Formatierer prüfen, erwartete Felder per JSON-Schema validieren und nur ein gültiges synthetisches Ergebnis teilen." },
    { kind: "idea", title: "Funktionsidee für ein lokales Werkzeug", body: "Nutzerproblem, Beispieleingabe, erwartete Ausgabe und den Grund für eine vollständig lokale Verarbeitung beschreiben." },
  ],
  zh: [
    { kind: "workflow", title: "本地隐私数据清理流程", body: "导入 CSV，使用合成记录检查敏感列，在本地完成遮蔽并导出 JSON。不要使用真实客户记录。" },
    { kind: "tip", title: "分享前验证 JSON", body: "先用 JSON 格式化工具检查语法，再用 JSON Schema 验证字段，仅分享有效的合成结果。" },
    { kind: "idea", title: "本地工具功能建议", body: "说明用户问题、示例输入、预期输出，以及该操作为何应完全留在浏览器中。" },
  ],
} as const;

const prohibited = ["fuck", "nigger", "terrorist threat", "öldür", "sikeyim", "piç", "hurensohn", "töten", "去死", "操你"];
const issueCopy = {
  tr: { abusive: "Hakaret veya tehdit dili", privateKey: "Özel anahtar", credential: "API anahtarı veya erişim belirteci", email: "E-posta adresi", identity: "Telefon veya kimlik numarası", external: "ByteQuant dışı bağlantı" },
  en: { abusive: "Abusive or threatening language", privateKey: "Private key", credential: "API key or access token", email: "Email address", identity: "Phone or identity number", external: "Non-ByteQuant link" },
  de: { abusive: "Beleidigende oder drohende Sprache", privateKey: "Privater Schlüssel", credential: "API-Schlüssel oder Zugriffstoken", email: "E-Mail-Adresse", identity: "Telefon- oder Identitätsnummer", external: "Externer Link außerhalb ByteQuant" },
  zh: { abusive: "侮辱或威胁性语言", privateKey: "私钥", credential: "API 密钥或访问令牌", email: "电子邮件地址", identity: "电话号码或身份号码", external: "非 ByteQuant 链接" },
} as const;
const secretPatterns = [
  { key: "privateKey", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i },
  { key: "credential", pattern: /\b(?:api[_ -]?key|secret|token|password)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{12,}/i },
  { key: "credential", pattern: /\b(?:sk|pk|rk)-[A-Za-z0-9_-]{20,}\b/i },
  { key: "credential", pattern: /\b(?:gh[opusr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16})\b/ },
  { key: "credential", pattern: /\bBearer\s+[A-Za-z0-9._~+/-]{20,}={0,2}\b/i },
  { key: "email", pattern: /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/i },
  { key: "identity", pattern: /(?<!\d)(?:\+?\d[ .-]?){10,16}(?!\d)/ },
] as const;

function clean(value: string, max: number) { return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/<[^>]*>/g, "").slice(0, max).trim(); }
function encodeDraft(draft: ShareDraft) { return btoa(unescape(encodeURIComponent(JSON.stringify(draft)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, ""); }
function decodeDraft(value: string): ShareDraft | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const parsed: unknown = JSON.parse(decodeURIComponent(escape(atob(padded))));
    if (!parsed || typeof parsed !== "object") return null;
    const draft = parsed as Partial<ShareDraft>;
    if (draft.version !== 1 || !["workflow", "tip", "idea", "question"].includes(draft.kind ?? "") || typeof draft.title !== "string" || typeof draft.body !== "string" || typeof draft.recipe !== "string") return null;
    return { version: 1, kind: draft.kind as CommunityKind, title: clean(draft.title, 120), body: clean(draft.body, 5000), recipe: clean(draft.recipe, 4000) };
  } catch { return null; }
}

export function CommunityComposer({ locale }: { locale: Locale }) {
  const t = copy[locale]; const issue = issueCopy[locale];
  const [kind, setKind] = useState<CommunityKind>("workflow"); const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [recipe, setRecipe] = useState(""); const [checked, setChecked] = useState(false); const [status, setStatus] = useState("");
  const issues = useMemo(() => {
    const combined = `${title}\n${body}`.toLocaleLowerCase(); const result: string[] = [];
    if (title.trim().length < 8 || body.trim().length < 40) result.push(t.empty);
    if (prohibited.some((word) => combined.includes(word))) result.push(issue.abusive);
    secretPatterns.forEach((item) => { if (item.pattern.test(combined)) result.push(issue[item.key]); });
    const urls = combined.match(/https?:\/\/[^\s)]+/g) ?? []; if (urls.some((url) => !/^https:\/\/(?:www\.)?bytequant\.org\//i.test(url))) result.push(issue.external);
    if (recipe.trim() && !/^https:\/\/(?:www\.)?bytequant\.org\/workspace\/?\?recipe=[A-Za-z0-9_%.-]+$/i.test(recipe.trim())) result.push(t.safeRecipe);
    return [...new Set(result)];
  }, [body, issue, recipe, t.empty, t.safeRecipe, title]);
  const markdown = useMemo(() => `## ${clean(title, 120)}\n\n**Type:** ${t.kinds[kind]}\n\n${clean(body, 5000)}${recipe.trim() ? `\n\n**ByteQuant recipe:** ${clean(recipe, 4000)}` : ""}\n\n---\nPrivacy check: no intentional personal data or secrets included.`, [body, kind, recipe, t.kinds, title]);
  const canShare = checked && issues.length === 0;
  const draft = (): ShareDraft => ({ version: 1, kind, title: clean(title, 120), body: clean(body, 5000), recipe: clean(recipe, 4000) });
  async function write(value: string, message: string) {
    try { await navigator.clipboard.writeText(value); setStatus(message); return; } catch {
      const field = document.createElement("textarea"); field.value = value; field.readOnly = true; field.style.position = "fixed"; field.style.opacity = "0"; document.body.appendChild(field); field.select();
      const copied = document.execCommand("copy"); field.remove();
      setStatus(copied ? message : ({ tr: "Pano izni verilmedi. .md indirme veya cihazla paylaşma seçeneğini kullanın.", en: "Clipboard access was denied. Use the .md download or device share option.", de: "Der Zwischenablagezugriff wurde verweigert. Nutzen Sie .md-Download oder Gerätefreigabe.", zh: "剪贴板权限被拒绝，请使用 .md 下载或设备分享。" })[locale]);
    }
  }
  async function shareLink() { if (!canShare) return; const url = new URL(window.location.href); url.searchParams.set("share", encodeDraft(draft())); await write(url.toString(), t.linked); }
  async function nativeShare() { if (!canShare) return; const url = new URL(window.location.href); url.searchParams.set("share", encodeDraft(draft())); if (navigator.share) { try { await navigator.share({ title, text: body.slice(0, 180), url: url.toString() }); return; } catch { return; } } await write(url.toString(), t.linked); }
  function download() { if (!canShare) return; const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" }); const href = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = href; anchor.download = `${title.toLocaleLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "bytequant-share"}.md`; anchor.click(); URL.revokeObjectURL(href); }
  function importFromLink() { const value = new URL(window.location.href).searchParams.get("share"); const imported = value ? decodeDraft(value) : null; if (!imported) { setStatus(t.noDraft); return; } setKind(imported.kind); setTitle(imported.title); setBody(imported.body); setRecipe(imported.recipe); setChecked(false); setStatus(t.imported); }
  function applyTemplate(index: number) { const value = templates[locale][index]; setKind(value.kind); setTitle(value.title); setBody(value.body); setRecipe(""); setChecked(false); setStatus(""); }
  return <div className="community-composer"><div className="community-form"><p>{t.intro}</p><fieldset className="community-templates"><legend>{t.templates}</legend>{t.templateNames.map((name, index) => <button type="button" key={name} onClick={() => applyTemplate(index)}>{name}</button>)}</fieldset><label><span>{t.kind}</span><select value={kind} onChange={(event) => { setKind(event.target.value as CommunityKind); setChecked(false); }}>{(Object.keys(t.kinds) as CommunityKind[]).map((key) => <option value={key} key={key}>{t.kinds[key]}</option>)}</select></label><label><span>{t.title}</span><input value={title} maxLength={120} onChange={(event) => { setTitle(event.target.value); setChecked(false); }} /></label><label><span>{t.body}</span><textarea value={body} maxLength={5000} rows={9} onChange={(event) => { setBody(event.target.value); setChecked(false); }} /></label><label><span>{t.recipe}</span><input type="url" value={recipe} maxLength={4000} onChange={(event) => { setRecipe(event.target.value); setChecked(false); }} placeholder="https://bytequant.org/workspace?recipe=…" /></label><div className="community-form-actions"><button type="button" className="primary-button" onClick={() => { setChecked(true); setStatus(""); }}>{t.check}</button><button type="button" className="secondary-button" onClick={importFromLink}>{t.import}</button></div><small>{t.boundary}</small>{status && <p className="community-status" role="status">{status}</p>}</div><aside className={checked && issues.length ? "community-preview blocked" : "community-preview"}><header><span>{checked ? issues.length ? "!" : "✓" : "○"}</span><strong>{checked ? issues.length ? t.blocked : t.safe : t.check}</strong></header>{checked && issues.length > 0 ? <><h3>{t.issues}</h3><ul>{issues.map((item) => <li key={item}>{item}</li>)}</ul></> : <pre>{markdown}</pre>}<div><button type="button" onClick={() => write(markdown, t.copied)} disabled={!canShare}>{t.copy}</button><button type="button" onClick={shareLink} disabled={!canShare}>{t.link}</button><button type="button" onClick={nativeShare} disabled={!canShare}>{t.share}</button><button type="button" onClick={download} disabled={!canShare}>{t.download}</button><a className="secondary-button" href="https://github.com/byte-quant/bytequant/discussions" target="_blank" rel="noreferrer noopener" aria-disabled={!canShare} onClick={(event) => { if (!canShare) event.preventDefault(); }}>{t.discuss} ↗</a></div></aside></div>;
}
