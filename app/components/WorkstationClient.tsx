"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createAgentPlan, type AgentPlan } from "../lib/agent-core";
import { WORKSPACE_ACTIVE_KEY, WORKSPACE_AGENT_GOAL_KEY, WORKSPACE_HANDOFF_KEY, readActiveWorkspace, readWorkspaceAgentGoal, readWorkspaceHandoff } from "../lib/workspace-handoff";
import { createWorkspaceRecipe } from "../lib/workspace-recipe";
import { deleteWorkspace, listWorkspaces, loadWorkspace, requestPersistentWorkspaceStorage, saveWorkspace, type WorkspaceSummary } from "../lib/workspace-storage";
import { decodeRecipeInWorker, encodeRecipeInWorker } from "../lib/workspace-worker-client";
import { WORKSPACE_MAX_NODES, createWorkspace, documentFromRecipe, layoutWorkspaceGraph, propagateWorkspaceOutput, updateWorkspace, workspaceGraphSummary, workspaceId, type WorkspaceDocument, type WorkspaceNode } from "../lib/workspace-types";
import { categories, tools, type ToolCategory } from "../lib/tools";
import { pathFor, toolPath, type Locale } from "../lib/site";
import { WorkspaceP2PPanel } from "./WorkspaceP2PPanel";

const uiCopy = {
  tr: { title: "ByteQuant İş İstasyonu", saved: "Bu cihazda şifreli", saving: "Şifreli kayıt hazırlanıyor…", saveError: "Çalışma alanı kaydedilemedi. Depolama kotasını veya özel gezinme ayarını kontrol edin.", projects: "Projeler", newProject: "Yeni proje", delete: "Sil", persist: "Kalıcı depolama", persisted: "Tarayıcı kalıcı depolamayı onayladı.", palette: "Araç paleti", search: "89 araçta ara", category: "Tüm kategoriler", drag: "Sürükleyin veya Ekle düğmesini kullanın.", add: "Ekle", showAll: "Tüm araçları göster", showLess: "Listeyi daralt", canvas: "Görsel akış tuvali", empty: "Bir şablon seçin veya ilk düğümü araç paletinden ekleyin.", connect: "Çıkış portunu, ardından hedef giriş portunu seçin.", max: "Güvenli düğüm sınırına ulaşıldı.", inspector: "Düğüm denetçisi", input: "Girdi", output: "Son çıktı", open: "Araçta çalıştır", remove: "Düğümü kaldır", select: "Düzenlemek için bir düğüm seçin.", ai: "Yerel Ajan ile akış tasarla", aiPlaceholder: "Örn. JSON'u doğrula, hassas alanları maskele ve CSV'ye dönüştür", analyze: "Planı analiz et", addPlan: "Planı tuvale ekle", replacePlan: "Tuvali planla değiştir", aiBoundary: "Açıklanabilir yerel eşleştirme; uzak LLM veya otomatik araç çalıştırma yok.", decision: "Karar önizlemesi", confidence: "güven", share: "URL tarifi", include: "Girdileri bağlantıya dahil et", createLink: "Paylaşım bağlantısı üret", copy: "Bağlantıyı kopyala", shareSafe: "Çıktılar URL'ye eklenmez; girdiler varsayılan olarak çıkarılır.", imported: "Paylaşılan tarif yeni bir cihaz içi proje olarak kuruldu.", importError: "Tarif okunamadı veya güvenli boyut sınırını aşıyor.", flow: "bağlantı", restored: "Araç çıktısı düğüme ve bağlı sonraki girdiye aktarıldı.", confirmDelete: "Bu cihazdaki şifreli projeyi silmek istiyor musunuz?", confirmClear: "Tuvaldeki tüm düğüm ve bağlantılar silinsin mi?", local: "AES-GCM ile cihazdaki IndexedDB içinde şifreli", unsaved: "Hazırlanıyor…", nodes: "düğüm", ready: "hazır", complete: "tamamlandı", errors: "hata", all: "Tümü", templates: "Başlangıç akışları", undo: "Geri al", redo: "Yinele", layout: "Otomatik düzenle", clear: "Tuvali temizle", duplicate: "Çoğalt", connections: "Bağlantılar", noConnections: "Bu düğümün bağlantısı yok.", disconnect: "Bağlantıyı kaldır", navProjects: "Projeler", navTools: "Araçlar", navCanvas: "Tuval", navInspector: "Denetçi", characters: "karakter", status: { idle: "bekliyor", ready: "hazır", complete: "tamamlandı", error: "hata" } },
  en: { title: "ByteQuant Workstation", saved: "Encrypted on this device", saving: "Preparing encrypted save…", saveError: "Workspace could not be saved. Check storage quota or private-browsing settings.", projects: "Projects", newProject: "New project", delete: "Delete", persist: "Persistent storage", persisted: "The browser approved persistent storage.", palette: "Tool palette", search: "Search 89 tools", category: "All categories", drag: "Drag or use the Add button.", add: "Add", showAll: "Show all tools", showLess: "Collapse list", canvas: "Visual workflow canvas", empty: "Choose a starter flow or add the first node from the palette.", connect: "Select an output port, then a target input port.", max: "The safe node limit was reached.", inspector: "Node inspector", input: "Input", output: "Latest output", open: "Run in tool", remove: "Remove node", select: "Select a node to edit it.", ai: "Design a flow with Local Agent", aiPlaceholder: "Example: validate JSON, mask sensitive fields, then convert to CSV", analyze: "Analyze plan", addPlan: "Add plan to canvas", replacePlan: "Replace canvas with plan", aiBoundary: "Explainable local matching; no remote LLM or automatic tool execution.", decision: "Decision preview", confidence: "confidence", share: "URL recipe", include: "Include inputs in the link", createLink: "Create share link", copy: "Copy link", shareSafe: "Outputs never enter the URL; inputs are excluded by default.", imported: "The shared recipe was installed as a new on-device project.", importError: "Recipe is invalid or exceeds the safe size limit.", flow: "connections", restored: "Tool output reached the node and its connected next input.", confirmDelete: "Delete this encrypted project from this device?", confirmClear: "Remove every node and connection from the canvas?", local: "AES-GCM encrypted in on-device IndexedDB", unsaved: "Preparing…", nodes: "nodes", ready: "ready", complete: "complete", errors: "errors", all: "All", templates: "Starter flows", undo: "Undo", redo: "Redo", layout: "Auto layout", clear: "Clear canvas", duplicate: "Duplicate", connections: "Connections", noConnections: "This node has no connections.", disconnect: "Remove connection", navProjects: "Projects", navTools: "Tools", navCanvas: "Canvas", navInspector: "Inspector", characters: "characters", status: { idle: "idle", ready: "ready", complete: "complete", error: "error" } },
  de: { title: "ByteQuant Workstation", saved: "Auf diesem Gerät verschlüsselt", saving: "Verschlüsselte Speicherung…", saveError: "Arbeitsbereich konnte nicht gespeichert werden. Speicherquote oder privaten Modus prüfen.", projects: "Projekte", newProject: "Neues Projekt", delete: "Löschen", persist: "Dauerhafter Speicher", persisted: "Der Browser hat dauerhaften Speicher bestätigt.", palette: "Werkzeugpalette", search: "89 Werkzeuge durchsuchen", category: "Alle Kategorien", drag: "Ziehen oder Hinzufügen verwenden.", add: "Hinzufügen", showAll: "Alle Werkzeuge anzeigen", showLess: "Liste einklappen", canvas: "Visuelle Ablaufoberfläche", empty: "Startablauf wählen oder ersten Knoten aus der Palette hinzufügen.", connect: "Erst Ausgang, dann Zieleingang wählen.", max: "Sichere Knotengrenze erreicht.", inspector: "Knotenprüfung", input: "Eingabe", output: "Letzte Ausgabe", open: "Im Werkzeug ausführen", remove: "Knoten entfernen", select: "Knoten zum Bearbeiten auswählen.", ai: "Ablauf mit lokalem Agenten entwerfen", aiPlaceholder: "Beispiel: JSON prüfen, sensible Felder maskieren und in CSV umwandeln", analyze: "Plan analysieren", addPlan: "Plan zur Fläche hinzufügen", replacePlan: "Fläche durch Plan ersetzen", aiBoundary: "Nachvollziehbare lokale Zuordnung; kein Remote-LLM und keine automatische Ausführung.", decision: "Entscheidungsvorschau", confidence: "Sicherheit", share: "URL-Rezept", include: "Eingaben in Link aufnehmen", createLink: "Freigabelink erstellen", copy: "Link kopieren", shareSafe: "Ausgaben gelangen nie in die URL; Eingaben sind standardmäßig ausgeschlossen.", imported: "Das geteilte Rezept wurde als neues lokales Projekt eingerichtet.", importError: "Rezept ist ungültig oder zu groß.", flow: "Verbindungen", restored: "Werkzeugausgabe wurde an Knoten und Folgeeingang übertragen.", confirmDelete: "Verschlüsseltes Projekt von diesem Gerät löschen?", confirmClear: "Alle Knoten und Verbindungen entfernen?", local: "AES-GCM-verschlüsselt im lokalen IndexedDB", unsaved: "Vorbereitung…", nodes: "Knoten", ready: "bereit", complete: "fertig", errors: "Fehler", all: "Alle", templates: "Startabläufe", undo: "Rückgängig", redo: "Wiederholen", layout: "Automatisch anordnen", clear: "Fläche leeren", duplicate: "Duplizieren", connections: "Verbindungen", noConnections: "Dieser Knoten hat keine Verbindung.", disconnect: "Verbindung entfernen", navProjects: "Projekte", navTools: "Werkzeuge", navCanvas: "Fläche", navInspector: "Prüfung", characters: "Zeichen", status: { idle: "wartet", ready: "bereit", complete: "fertig", error: "Fehler" } },
  zh: { title: "ByteQuant 工作站", saved: "已在此设备上加密", saving: "正在准备加密保存…", saveError: "无法保存工作区。请检查存储配额或隐私浏览设置。", projects: "项目", newProject: "新建项目", delete: "删除", persist: "持久化存储", persisted: "浏览器已批准持久化存储。", palette: "工具面板", search: "搜索 89 个工具", category: "全部类别", drag: "拖动或使用添加按钮。", add: "添加", showAll: "显示全部工具", showLess: "收起列表", canvas: "可视化工作流画布", empty: "选择起始流程，或从工具面板添加第一个节点。", connect: "先选择输出端口，再选择目标输入端口。", max: "已达到安全节点上限。", inspector: "节点检查器", input: "输入", output: "最新输出", open: "在工具中运行", remove: "移除节点", select: "选择节点进行编辑。", ai: "使用本地助手设计流程", aiPlaceholder: "例如：验证 JSON、遮蔽敏感字段，再转换为 CSV", analyze: "分析计划", addPlan: "把计划添加到画布", replacePlan: "用计划替换画布", aiBoundary: "可解释的本地匹配；无远程 LLM，也不会自动运行工具。", decision: "决策预览", confidence: "置信度", share: "URL 配方", include: "在链接中包含输入", createLink: "生成分享链接", copy: "复制链接", shareSafe: "输出绝不进入 URL；输入默认排除。", imported: "分享配方已建立为新的设备端项目。", importError: "配方无效或超过安全大小限制。", flow: "条连接", restored: "工具输出已传给该节点及下一个连接输入。", confirmDelete: "从此设备删除这个加密项目？", confirmClear: "移除画布中的全部节点与连接？", local: "使用 AES-GCM 加密保存在设备端 IndexedDB", unsaved: "准备中…", nodes: "个节点", ready: "就绪", complete: "已完成", errors: "错误", all: "全部", templates: "起始流程", undo: "撤销", redo: "重做", layout: "自动布局", clear: "清空画布", duplicate: "复制节点", connections: "连接", noConnections: "此节点没有连接。", disconnect: "移除连接", navProjects: "项目", navTools: "工具", navCanvas: "画布", navInspector: "检查器", characters: "字符", status: { idle: "等待", ready: "就绪", complete: "已完成", error: "错误" } },
} as const;

const templateDefinitions = [
  { id: "privacy", names: { tr: "CSV gizlilik akışı", en: "CSV privacy flow", de: "CSV-Datenschutzablauf", zh: "CSV 隐私流程" }, slugs: ["csv-inceleyici", "kvkk-veri-maskeleyici", "json-csv-donusturucu"] },
  { id: "json", names: { tr: "JSON kalite kapısı", en: "JSON quality gate", de: "JSON-Qualitätsprüfung", zh: "JSON 质量检查" }, slugs: ["json-bicimlendirici", "json-schema-olusturucu", "json-diff-karsilastirma"] },
  { id: "seo", names: { tr: "Teknik SEO paketi", en: "Technical SEO pack", de: "Technisches SEO-Paket", zh: "技术 SEO 套件" }, slugs: ["seo-slug-olusturucu", "hreflang-etiket-olusturucu", "faq-json-ld-olusturucu"] },
] as const;

const nodeWidth = 244;
const nodePortY = 66;

export default function WorkstationClient({ locale }: { locale: Locale }) {
  const t = uiCopy[locale];
  const [document, setDocument] = useState(() => createWorkspace(locale));
  const [projects, setProjects] = useState<WorkspaceSummary[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ToolCategory>("all");
  const [paletteExpanded, setPaletteExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [agentGoal, setAgentGoal] = useState("");
  const [agentPlan, setAgentPlan] = useState<AgentPlan | null>(null);
  const [includeInputs, setIncludeInputs] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [past, setPast] = useState<WorkspaceDocument[]>([]);
  const [future, setFuture] = useState<WorkspaceDocument[]>([]);
  const returnPath = pathFor(locale, "workstation");
  const selected = document.nodes.find((node) => node.id === selectedId) ?? null;
  const summary = useMemo(() => workspaceGraphSummary(document), [document]);
  const canvasSize = useMemo(() => ({ width: Math.max(1100, ...document.nodes.map((node) => node.x + 330)), height: Math.max(610, ...document.nodes.map((node) => node.y + 230)) }), [document.nodes]);
  const selectedEdges = useMemo(() => selected ? document.edges.filter((edge) => edge.from === selected.id || edge.to === selected.id) : [], [document.edges, selected]);
  const filteredTools = useMemo(() => {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
    return tools.filter((tool) => {
      if (category !== "all" && tool.category !== category) return false;
      const haystack = `${tool.title[locale]} ${tool.slug} ${tool.short[locale]}`.toLocaleLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [query, category, locale]);
  const paletteCanCollapse = !query.trim() && category === "all" && filteredTools.length > 24;
  const visibleTools = paletteCanCollapse && !paletteExpanded ? filteredTools.slice(0, 24) : filteredTools;

  const refreshProjects = useCallback(async () => { try { setProjects(await listWorkspaces()); } catch { setProjects([]); } }, []);
  const replaceDocument = useCallback((next: WorkspaceDocument) => { setDocument(next); setPast([]); setFuture([]); setSelectedId(next.nodes[0]?.id ?? null); }, []);
  const mutateDocument = useCallback((updater: (current: WorkspaceDocument) => WorkspaceDocument, track = true) => setDocument((current) => {
    const next = updater(current);
    if (next === current) return current;
    if (track) { setPast((items) => [...items.slice(-39), current]); setFuture([]); }
    return next;
  }), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const active = readActiveWorkspace(sessionStorage.getItem(WORKSPACE_ACTIVE_KEY));
        const handoff = readWorkspaceHandoff(sessionStorage.getItem(WORKSPACE_HANDOFF_KEY));
        const goalHandoff = readWorkspaceAgentGoal(sessionStorage.getItem(WORKSPACE_AGENT_GOAL_KEY));
        const recipeCode = new URLSearchParams(location.search).get("recipe");
        let initial = active;
        if (recipeCode) { initial = documentFromRecipe(await decodeRecipeInWorker(recipeCode)); setNotice(t.imported); history.replaceState(null, "", location.pathname); }
        if (!initial) { const summaries = await listWorkspaces(); if (summaries[0]) initial = await loadWorkspace(summaries[0].id); }
        initial ??= createWorkspace(locale);
        if (handoff?.completed && handoff.workspaceId === initial.id) { initial = propagateWorkspaceOutput(initial, handoff.nodeId, handoff.output); setNotice(t.restored); }
        sessionStorage.removeItem(WORKSPACE_ACTIVE_KEY); sessionStorage.removeItem(WORKSPACE_HANDOFF_KEY); sessionStorage.removeItem(WORKSPACE_AGENT_GOAL_KEY);
        if (!cancelled) {
          setDocument(initial); setSelectedId(initial.nodes[0]?.id ?? null); setHydrated(true);
          if (goalHandoff) { setAgentGoal(goalHandoff); setAgentPlan(createAgentPlan(goalHandoff, tools, locale)); }
        }
      } catch { if (!cancelled) { setNotice(t.importError); setHydrated(true); } }
    })();
    return () => { cancelled = true; };
  }, [locale, t.importError, t.imported, t.restored]);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(async () => {
      setSaveState("saving");
      try { await saveWorkspace(document); setSaveState("saved"); await refreshProjects(); } catch { setSaveState("error"); }
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [document, hydrated, refreshProjects]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input,textarea,select,[contenteditable=true]")) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); if (event.shiftKey) redo(); else undo(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });

  function undo() { const previous = past.at(-1); if (!previous) return; setFuture((items) => [document, ...items].slice(0, 40)); setPast((items) => items.slice(0, -1)); setDocument(previous); }
  function redo() { const next = future[0]; if (!next) return; setPast((items) => [...items.slice(-39), document]); setFuture((items) => items.slice(1)); setDocument(next); }

  function nodeFor(slug: string, index: number, baseX = 48, baseY = 58): WorkspaceNode | null {
    const tool = tools.find((item) => item.slug === slug); if (!tool) return null;
    return { id: workspaceId("node"), toolSlug: slug, title: tool.title[locale], x: baseX + index * 300, y: baseY, input: "", output: "", status: "idle" };
  }

  function addTool(slug: string, position?: { x: number; y: number }) {
    if (document.nodes.length >= WORKSPACE_MAX_NODES) { setNotice(t.max); return; }
    const node = nodeFor(slug, 0, position?.x ?? 48 + (document.nodes.length % 3) * 280, position?.y ?? 48 + Math.floor(document.nodes.length / 3) * 190);
    if (!node) return;
    mutateDocument((current) => updateWorkspace(current, { nodes: [...current.nodes, node] })); setSelectedId(node.id);
  }

  function addTemplate(slugs: readonly string[], name: string) {
    if (document.nodes.length + slugs.length > WORKSPACE_MAX_NODES) { setNotice(t.max); return; }
    const baseY = Math.max(58, ...document.nodes.map((node) => node.y + 190));
    const nodes = slugs.map((slug, index) => nodeFor(slug, index, 48, baseY)).filter((node): node is WorkspaceNode => Boolean(node));
    const edges = nodes.slice(1).map((node, index) => ({ id: workspaceId("edge"), from: nodes[index].id, to: node.id }));
    mutateDocument((current) => updateWorkspace(current, { name: current.nodes.length ? current.name : name, nodes: [...current.nodes, ...nodes], edges: [...current.edges, ...edges] }));
    setSelectedId(nodes[0]?.id ?? null);
  }

  function dropTool(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault(); const slug = event.dataTransfer.getData("application/x-bytequant-tool"); const rectangle = event.currentTarget.getBoundingClientRect();
    addTool(slug, { x: Math.max(10, event.clientX - rectangle.left - 100), y: Math.max(10, event.clientY - rectangle.top - 40) });
  }

  function beginMove(event: React.PointerEvent<HTMLButtonElement>, node: WorkspaceNode) {
    if (event.button !== 0) return; event.preventDefault(); setSelectedId(node.id); setPast((items) => [...items.slice(-39), document]); setFuture([]);
    const start = { clientX: event.clientX, clientY: event.clientY, x: node.x, y: node.y };
    const move = (next: PointerEvent) => mutateDocument((current) => updateWorkspace(current, { nodes: current.nodes.map((item) => item.id === node.id ? { ...item, x: Math.max(0, start.x + next.clientX - start.clientX), y: Math.max(0, start.y + next.clientY - start.clientY) } : item) }), false);
    const end = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", end, { once: true }); window.addEventListener("pointercancel", end, { once: true });
  }

  function connectTo(nodeId: string) {
    if (!connectFrom || connectFrom === nodeId) { setConnectFrom(null); return; }
    mutateDocument((current) => current.edges.some((edge) => edge.from === connectFrom && edge.to === nodeId) ? current : updateWorkspace(current, { edges: [...current.edges, { id: workspaceId("edge"), from: connectFrom, to: nodeId }] })); setConnectFrom(null);
  }
  function updateNode(id: string, patch: Partial<WorkspaceNode>) { mutateDocument((current) => updateWorkspace(current, { nodes: current.nodes.map((node) => node.id === id ? { ...node, ...patch } : node) }), false); }
  function removeNode(id: string) { mutateDocument((current) => updateWorkspace(current, { nodes: current.nodes.filter((node) => node.id !== id), edges: current.edges.filter((edge) => edge.from !== id && edge.to !== id) })); setSelectedId(null); }
  function duplicateNode(node: WorkspaceNode) { if (document.nodes.length >= WORKSPACE_MAX_NODES) return; const copy = { ...node, id: workspaceId("node"), title: `${node.title} · 2`, x: node.x + 36, y: node.y + 36, output: "", status: node.input ? "ready" as const : "idle" as const }; mutateDocument((current) => updateWorkspace(current, { nodes: [...current.nodes, copy] })); setSelectedId(copy.id); }
  function removeEdge(id: string) { mutateDocument((current) => updateWorkspace(current, { edges: current.edges.filter((edge) => edge.id !== id) })); }
  function openTool(node: WorkspaceNode) { sessionStorage.setItem(WORKSPACE_ACTIVE_KEY, JSON.stringify(document)); sessionStorage.setItem(WORKSPACE_HANDOFF_KEY, JSON.stringify({ version: 1, workspaceId: document.id, nodeId: node.id, toolSlug: node.toolSlug, input: node.input, output: "", returnPath, completed: false })); }

  function analyzeAgentGoal() { if (agentGoal.trim()) setAgentPlan(createAgentPlan(agentGoal, tools, locale)); }
  function applyAgentPlan(mode: "append" | "replace") {
    if (!agentPlan?.steps.length) return;
    const existingCount = mode === "append" ? document.nodes.length : 0;
    if (existingCount + agentPlan.steps.length > WORKSPACE_MAX_NODES) { setNotice(t.max); return; }
    const baseY = mode === "append" ? Math.max(70, ...document.nodes.map((node) => node.y + 190)) : 90;
    const nodes = agentPlan.steps.map((step, index): WorkspaceNode => ({ id: workspaceId("node"), toolSlug: step.toolSlug, title: step.title, x: 48 + index * 300, y: baseY + (index % 2) * 34, input: index === 0 ? agentPlan.goal : "", output: "", status: index === 0 ? "ready" : "idle" }));
    const edges = nodes.slice(1).map((node, index) => ({ id: workspaceId("edge"), from: nodes[index].id, to: node.id }));
    mutateDocument((current) => updateWorkspace(current, { name: mode === "replace" ? agentPlan.goal.slice(0, 80) : current.name, nodes: mode === "replace" ? nodes : [...current.nodes, ...nodes], edges: mode === "replace" ? edges : [...current.edges, ...edges] })); setSelectedId(nodes[0]?.id ?? null);
  }

  async function createShareLink() { try { const code = await encodeRecipeInWorker(createWorkspaceRecipe(document, includeInputs)); setShareUrl(`${location.origin}/workspace?recipe=${encodeURIComponent(code)}`); } catch { setNotice(t.importError); } }
  async function createProject() { replaceDocument(createWorkspace(locale)); setNotice(""); }
  async function openProject(id: string) { try { replaceDocument(await loadWorkspace(id)); } catch { setSaveState("error"); } }
  async function removeProject(id: string) { if (!window.confirm(t.confirmDelete)) return; await deleteWorkspace(id); if (document.id === id) await createProject(); await refreshProjects(); }
  async function persist() { setNotice(await requestPersistentWorkspaceStorage() ? t.persisted : t.local); }

  return <div className="workstation-app" aria-label={t.title}>
    <header className="workstation-toolbar"><div><span className="workspace-live-dot" /><strong>{document.name}</strong><small>{saveState === "saving" ? t.saving : saveState === "saved" ? t.saved : saveState === "error" ? t.saveError : t.unsaved}</small></div><label><span className="sr-only">{t.title}</span><input value={document.name} maxLength={100} onChange={(event) => mutateDocument((current) => updateWorkspace(current, { name: event.target.value || t.title }), false)} /></label><div><span className="workspace-encryption-badge">AES-256 · IndexedDB</span><button type="button" onClick={persist}>{t.persist}</button></div></header>
    <div className="workspace-commandbar" aria-label={t.canvas}><div><button type="button" onClick={undo} disabled={!past.length} title="Ctrl/⌘ Z">↶ {t.undo}</button><button type="button" onClick={redo} disabled={!future.length} title="Ctrl/⌘ Y">↷ {t.redo}</button><button type="button" onClick={() => mutateDocument(layoutWorkspaceGraph)}>{t.layout}</button><button type="button" onClick={() => { if (window.confirm(t.confirmClear)) { mutateDocument((current) => updateWorkspace(current, { nodes: [], edges: [] })); setSelectedId(null); } }}>{t.clear}</button></div><div className="workspace-health"><span><strong>{summary.nodes}</strong>{t.nodes}</span><span><strong>{summary.edges}</strong>{t.flow}</span><span><strong>{summary.ready}</strong>{t.ready}</span><span><strong>{summary.complete}</strong>{t.complete}</span>{summary.errors > 0 && <span className="error"><strong>{summary.errors}</strong>{t.errors}</span>}</div></div>
    {notice && <div className="workspace-notice" role="status">{notice}</div>}
    <nav className="workspace-mobile-nav" aria-label={t.title}><a href="#workspace-projects">{t.navProjects}</a><a href="#workspace-tools">{t.navTools}</a><a href="#workspace-canvas">{t.navCanvas}</a><a href="#workspace-inspector">{t.navInspector}</a></nav>
    <div className="workstation-grid"><aside className="workspace-sidebar">
      <section className="workspace-panel" id="workspace-projects"><div className="workspace-panel-heading"><h3>{t.projects}</h3><button type="button" onClick={createProject}>+ {t.newProject}</button></div><div className="workspace-project-list">{projects.map((project) => <div key={project.id} className={project.id === document.id ? "active" : ""}><button type="button" onClick={() => openProject(project.id)}><strong>{project.name}</strong><small>{project.nodes} {t.nodes} · {new Date(project.updatedAt).toLocaleDateString(locale)}</small></button><button type="button" aria-label={`${t.delete}: ${project.name}`} onClick={() => removeProject(project.id)}>×</button></div>)}</div><small>{t.local}</small></section>
      <section className="workspace-panel workspace-templates"><h3>{t.templates}</h3><div>{templateDefinitions.map((template) => <button type="button" key={template.id} onClick={() => addTemplate(template.slugs, template.names[locale])}>{template.names[locale]}<small>{template.slugs.length} {t.nodes}</small></button>)}</div></section>
      <section className="workspace-panel" id="workspace-tools"><div className="workspace-panel-heading"><h3>{t.palette}</h3><span aria-live="polite">{filteredTools.length}/{tools.length}</span></div><div className="workspace-filter-grid"><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /><select aria-label={t.category} value={category} onChange={(event) => setCategory(event.target.value as "all" | ToolCategory)}><option value="all">{t.category}</option>{Object.entries(categories).map(([id, item]) => <option key={id} value={id}>{item.label[locale]}</option>)}</select></div><p>{t.drag}</p><div className="workspace-tool-palette">{visibleTools.map((tool) => <div key={tool.slug} draggable onDragStart={(event) => event.dataTransfer.setData("application/x-bytequant-tool", tool.slug)}><span className={`tool-mark category-${tool.category}`}>{tool.mark}</span><div><strong>{tool.title[locale]}</strong><small>{categories[tool.category].label[locale]}</small></div><button type="button" onClick={() => addTool(tool.slug)}>{t.add}</button></div>)}</div>{paletteCanCollapse && <button className="workspace-palette-more" type="button" aria-expanded={paletteExpanded} onClick={() => setPaletteExpanded((value) => !value)}>{paletteExpanded ? t.showLess : `${t.showAll} · +${filteredTools.length - visibleTools.length}`}</button>}</section>
    </aside><div className="workspace-main">
      <section className="workspace-ai-builder"><div><span className="kicker">BQ LOCAL AGENT</span><h3>{t.ai}</h3><p>{t.aiBoundary}</p></div><div className="workspace-ai-input"><textarea value={agentGoal} maxLength={20_000} onChange={(event) => { setAgentGoal(event.target.value); setAgentPlan(null); }} placeholder={t.aiPlaceholder} /><button type="button" className="primary-button" disabled={!agentGoal.trim()} onClick={analyzeAgentGoal}>{t.analyze}</button></div>{agentPlan && <div className="workspace-ai-preview" aria-live="polite"><header><strong>{t.decision}</strong><span>{Math.round(agentPlan.confidence * 100)}% {t.confidence}</span></header><ol>{agentPlan.steps.map((step, index) => <li key={step.id}><span>{index + 1}</span><div><strong>{step.title}</strong><small>{step.reason}</small></div></li>)}</ol><div className="workspace-ai-signals">{agentPlan.signals.map((signal) => <span key={signal}>{signal}</span>)}</div><footer><button type="button" className="primary-button" onClick={() => applyAgentPlan("append")}>{t.addPlan}</button><button type="button" onClick={() => applyAgentPlan("replace")}>{t.replacePlan}</button></footer></div>}</section>
      <section className="workspace-canvas-shell" id="workspace-canvas" aria-labelledby="canvas-title"><header><div><h3 id="canvas-title">{t.canvas}</h3><small>{connectFrom ? t.connect : `${summary.nodes}/${WORKSPACE_MAX_NODES} ${t.nodes} · ${summary.edges} ${t.flow}`}</small></div></header><div className="workspace-canvas-scroll"><div className="workspace-canvas" style={{ width: canvasSize.width, height: canvasSize.height }} onDragOver={(event) => event.preventDefault()} onDrop={dropTool} onClick={() => setConnectFrom(null)}>
        <svg className="workspace-wires" aria-hidden="true">{document.edges.map((edge) => { const from = document.nodes.find((node) => node.id === edge.from); const to = document.nodes.find((node) => node.id === edge.to); if (!from || !to) return null; const x1 = from.x + nodeWidth; const y1 = from.y + nodePortY; const x2 = to.x; const y2 = to.y + nodePortY; return <path key={edge.id} d={`M ${x1} ${y1} C ${x1 + 90} ${y1}, ${x2 - 90} ${y2}, ${x2} ${y2}`} />; })}</svg>
        {!document.nodes.length && <div className="workspace-empty"><span>⌘</span><p>{t.empty}</p></div>}
        {document.nodes.map((node) => <article key={node.id} className={`workspace-node ${selectedId === node.id ? "selected" : ""} status-${node.status}`} style={{ transform: `translate(${node.x}px, ${node.y}px)` }} onClick={(event) => { event.stopPropagation(); setSelectedId(node.id); }}><button className="workspace-node-handle" type="button" aria-label={`${node.title}: ${t.layout}`} onPointerDown={(event) => beginMove(event, node)}><span className="workspace-grip">⠿</span><strong>{node.title}</strong><small>{node.toolSlug}</small></button><div className="workspace-node-body"><span>{node.input ? `${node.input.length} ${t.characters}` : t.input}</span><i>→</i><span>{node.output ? `${node.output.length} ${t.characters}` : t.output}</span></div><button className="workspace-port input" type="button" aria-label={`${t.input}: ${node.title}`} onClick={(event) => { event.stopPropagation(); connectTo(node.id); }} /><button className={`workspace-port output ${connectFrom === node.id ? "active" : ""}`} type="button" aria-label={`${t.output}: ${node.title}`} onClick={(event) => { event.stopPropagation(); setConnectFrom(node.id); }} /><footer><span className="workspace-node-status">{t.status[node.status]}</span><Link href={toolPath(locale, node.toolSlug)} onClick={() => openTool(node)}>{t.open} →</Link></footer></article>)}
      </div></div></section>
      <div className="workspace-lower-grid"><section className="workspace-panel workspace-inspector" id="workspace-inspector"><h3>{t.inspector}</h3>{selected ? <><label>{t.input}<textarea value={selected.input} onChange={(event) => updateNode(selected.id, { input: event.target.value.slice(0, 200_000), status: event.target.value ? "ready" : "idle" })} /></label><label>{t.output}<textarea readOnly value={selected.output} /></label><h4>{t.connections}</h4><div className="workspace-edge-list">{selectedEdges.map((edge) => { const otherId = edge.from === selected.id ? edge.to : edge.from; const other = document.nodes.find((node) => node.id === otherId); return <div key={edge.id}><span>{edge.from === selected.id ? "→" : "←"} {other?.title ?? otherId}</span><button type="button" aria-label={t.disconnect} onClick={() => removeEdge(edge.id)}>×</button></div>; })}{!selectedEdges.length && <small>{t.noConnections}</small>}</div><div><Link className="primary-button" href={toolPath(locale, selected.toolSlug)} onClick={() => openTool(selected)}>{t.open}</Link><button type="button" onClick={() => duplicateNode(selected)}>{t.duplicate}</button><button type="button" onClick={() => removeNode(selected.id)}>{t.remove}</button></div></> : <p>{t.select}</p>}</section>
        <section className="workspace-panel workspace-recipe-panel"><h3>{t.share}</h3><p>{t.shareSafe}</p><label className="workspace-checkbox"><input type="checkbox" checked={includeInputs} onChange={(event) => setIncludeInputs(event.target.checked)} />{t.include}</label><button type="button" className="secondary-button" onClick={createShareLink}>{t.createLink}</button>{shareUrl && <label><span className="sr-only">URL</span><textarea readOnly value={shareUrl} /><button type="button" onClick={() => navigator.clipboard.writeText(shareUrl)}>{t.copy}</button></label>}</section></div>
      <WorkspaceP2PPanel locale={locale} document={document} onRemoteDocument={(remote) => replaceDocument(remote)} />
    </div></div>
  </div>;
}
