"use client";

import { useMemo, useState } from "react";
import type { Locale } from "../lib/site";

type CommunityKind = "workflow" | "tip" | "idea" | "question";

const copy = {
  tr: { kind: "Paylaşım türü", kinds: { workflow: "İş akışı tarifi", tip: "Araç ipucu", idea: "Yeni özellik fikri", question: "Yöntem sorusu" }, title: "Kısa ve açıklayıcı başlık", body: "Bağlam, denediğiniz adımlar ve beklenen sonucu yazın. Gerçek kişisel veri, parola veya anahtar eklemeyin.", recipe: "İsteğe bağlı ByteQuant tarif bağlantısı", check: "Paylaşımı yerelde kontrol et", checking: "Kontrol ediliyor…", safe: "Paylaşım taslağı hazır", blocked: "Taslak yayımlanmadan önce düzeltilmeli", copy: "Güvenli Markdown'ı kopyala", copied: "Kopyalandı", discuss: "GitHub Discussions'ı aç", intro: "Metin yalnızca bu sekmede incelenir. Açık küfür/tehdit, kişisel veri, sır ve ByteQuant dışı bağlantılar sınırlı kurallarla engellenir.", boundary: "Bu filtre yalnızca ön kontroldür; dolaylı kötüye kullanımı kusursuz yakalayamaz. Kamuya açık yayın için GitHub hesabı ve GitHub moderasyonu gerekir.", issues: "Bulunan noktalar", empty: "Başlık en az 8, açıklama en az 40 karakter olmalı.", safeRecipe: "Tarif yalnızca bytequant.org/workspace adresinden olabilir." },
  en: { kind: "Post type", kinds: { workflow: "Workflow recipe", tip: "Tool tip", idea: "Feature idea", question: "Method question" }, title: "Short, descriptive title", body: "Describe the context, steps tried, and expected outcome. Do not include real personal data, passwords, or keys.", recipe: "Optional ByteQuant recipe link", check: "Check the post locally", checking: "Checking…", safe: "Draft is ready to share", blocked: "Fix the draft before publishing", copy: "Copy safe Markdown", copied: "Copied", discuss: "Open GitHub Discussions", intro: "Text is reviewed only in this tab. Limited rules block explicit abuse/threats, personal data, secrets, and non-ByteQuant links.", boundary: "This filter is a pre-check and cannot catch every indirect abuse. Public publishing requires a GitHub account and remains subject to GitHub moderation.", issues: "Items to review", empty: "Use at least 8 characters for the title and 40 for the description.", safeRecipe: "A recipe must use bytequant.org/workspace." },
  de: { kind: "Beitragstyp", kinds: { workflow: "Ablaufrezept", tip: "Werkzeugtipp", idea: "Funktionsidee", question: "Methodenfrage" }, title: "Kurzer, klarer Titel", body: "Beschreiben Sie Kontext, getestete Schritte und erwartetes Ergebnis. Keine echten Personendaten, Passwörter oder Schlüssel.", recipe: "Optionaler ByteQuant-Rezeptlink", check: "Beitrag lokal prüfen", checking: "Prüfung…", safe: "Entwurf ist bereit", blocked: "Entwurf vor Veröffentlichung korrigieren", copy: "Sicheres Markdown kopieren", copied: "Kopiert", discuss: "GitHub Discussions öffnen", intro: "Text wird nur in diesem Tab geprüft. Begrenzte Regeln blockieren offene Beleidigungen/Drohungen, Personendaten, Geheimnisse und fremde Links.", boundary: "Der Filter ist nur eine Vorprüfung und erkennt nicht jeden indirekten Missbrauch. Öffentliche Beiträge benötigen ein GitHub-Konto und unterliegen der GitHub-Moderation.", issues: "Zu prüfende Punkte", empty: "Titel mit mindestens 8 und Beschreibung mit mindestens 40 Zeichen verwenden.", safeRecipe: "Ein Rezept muss bytequant.org/workspace verwenden." },
  zh: { kind: "分享类型", kinds: { workflow: "工作流配方", tip: "工具技巧", idea: "功能建议", question: "方法问题" }, title: "简短明确的标题", body: "说明背景、已尝试步骤与预期结果。请勿加入真实个人数据、密码或密钥。", recipe: "可选 ByteQuant 配方链接", check: "在本地检查内容", checking: "正在检查…", safe: "草稿可以分享", blocked: "发布前请修正草稿", copy: "复制安全 Markdown", copied: "已复制", discuss: "打开 GitHub Discussions", intro: "文本只在当前标签页检查。有限规则会拦截明显辱骂/威胁、个人数据、秘密和非 ByteQuant 链接。", boundary: "该过滤器只是预检查，无法识别所有间接滥用。公开发布需要 GitHub 账户，并受 GitHub 审核规则约束。", issues: "需要检查", empty: "标题至少 8 个字符，说明至少 40 个字符。", safeRecipe: "配方必须使用 bytequant.org/workspace。" },
} as const;

const prohibited = ["fuck", "nigger", "terrorist threat", "öldür", "sikeyim", "piç", "hassrede", "hurensohn", "töten", "去死", "操你"];
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
  { key: "credential", pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{8,}\b/ },
  { key: "email", pattern: /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/i },
  { key: "identity", pattern: /(?<!\d)(?:\+?\d[ .-]?){10,16}(?!\d)/ },
] as const;

function clean(value: string, max: number) { return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/<[^>]*>/g, "").slice(0, max).trim(); }

export function CommunityComposer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const issue = issueCopy[locale];
  const [kind, setKind] = useState<CommunityKind>("workflow"); const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [recipe, setRecipe] = useState(""); const [checked, setChecked] = useState(false); const [copied, setCopied] = useState(false);
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
  function check() { setChecked(true); setCopied(false); }
  async function copyMarkdown() { if (issues.length) { setChecked(true); return; } try { await navigator.clipboard.writeText(markdown); setCopied(true); } catch { setCopied(false); } }
  return <div className="community-composer"><div className="community-form"><p>{t.intro}</p><label><span>{t.kind}</span><select value={kind} onChange={(event) => { setKind(event.target.value as CommunityKind); setChecked(false); }}>{(Object.keys(t.kinds) as CommunityKind[]).map((key) => <option value={key} key={key}>{t.kinds[key]}</option>)}</select></label><label><span>{t.title}</span><input value={title} maxLength={120} onChange={(event) => { setTitle(event.target.value); setChecked(false); }} /></label><label><span>{t.body}</span><textarea value={body} maxLength={5000} rows={9} onChange={(event) => { setBody(event.target.value); setChecked(false); }} /></label><label><span>{t.recipe}</span><input type="url" value={recipe} maxLength={4000} onChange={(event) => { setRecipe(event.target.value); setChecked(false); }} placeholder="https://bytequant.org/workspace?recipe=…" /></label><button type="button" className="primary-button" onClick={check}>{t.check}</button><small>{t.boundary}</small></div><aside className={checked && issues.length ? "community-preview blocked" : "community-preview"}><header><span>{checked ? issues.length ? "!" : "✓" : "○"}</span><strong>{checked ? issues.length ? t.blocked : t.safe : t.check}</strong></header>{checked && issues.length > 0 ? <><h3>{t.issues}</h3><ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></> : <pre>{markdown}</pre>}<div><button type="button" onClick={copyMarkdown} disabled={!checked || issues.length > 0}>{copied ? t.copied : t.copy}</button><a className="secondary-button" href="https://github.com/byte-quant/bytequant/discussions" target="_blank" rel="noreferrer noopener" aria-disabled={!checked || issues.length > 0} onClick={(event) => { if (!checked || issues.length) event.preventDefault(); }}>{t.discuss} ↗</a></div></aside></div>;
}
