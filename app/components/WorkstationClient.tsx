"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createAgentPlan } from "../lib/agent-core";
import { WORKSPACE_ACTIVE_KEY, WORKSPACE_HANDOFF_KEY, readActiveWorkspace, readWorkspaceHandoff } from "../lib/workspace-handoff";
import { createWorkspaceRecipe } from "../lib/workspace-recipe";
import { deleteWorkspace, listWorkspaces, loadWorkspace, requestPersistentWorkspaceStorage, saveWorkspace, type WorkspaceSummary } from "../lib/workspace-storage";
import { decodeRecipeInWorker, encodeRecipeInWorker } from "../lib/workspace-worker-client";
import { WORKSPACE_MAX_NODES, createWorkspace, documentFromRecipe, propagateWorkspaceOutput, updateWorkspace, workspaceId, type WorkspaceDocument, type WorkspaceNode } from "../lib/workspace-types";
import { categories, tools } from "../lib/tools";
import { pathFor, toolPath, type Locale } from "../lib/site";
import { WorkspaceP2PPanel } from "./WorkspaceP2PPanel";

const copy = {
  tr: { title: "ByteQuant İş İstasyonu", saved: "Cihazda şifreli olarak kaydedildi", saving: "Şifreli kayıt hazırlanıyor…", saveError: "Çalışma alanı kaydedilemedi. Depolama kotasını veya özel gezinme ayarını kontrol edin.", projects: "Projeler", newProject: "Yeni proje", delete: "Sil", persist: "Kalıcı depolama iste", persisted: "Tarayıcı kalıcı depolamayı onayladı.", palette: "Araç paleti", search: "89 araçta ara", drag: "Tuvale sürükleyin veya ekle düğmesine basın.", add: "Ekle", canvas: "Görsel akış tuvali", empty: "İlk düğümü soldaki paletten sürükleyin.", connect: "Çıkış portunu, ardından hedef giriş portunu seçin.", max: "Bu çalışma alanı güvenli düğüm sınırına ulaştı.", inspector: "Düğüm denetçisi", input: "Girdi", output: "Son çıktı", open: "Araçta çalıştır", remove: "Düğümü kaldır", select: "Düzenlemek için bir düğüm seçin.", ai: "Yerel Ajan → görsel akış", aiPlaceholder: "Örn. JSON'u doğrula, hassas alanları maskele ve CSV'ye dönüştür", aiBuild: "Planı düğümlere dönüştür", aiBoundary: "Bu plan uzak LLM değil; açıklanabilir yerel eşleştirme kullanır ve araçları otomatik çalıştırmaz.", share: "URL tarifi", include: "Girdileri bağlantıya dahil et", createLink: "Paylaşım bağlantısı üret", copy: "Bağlantıyı kopyala", shareSafe: "Çıktılar hiçbir zaman URL'ye eklenmez. Girdiler varsayılan olarak çıkarılır.", imported: "Paylaşılan tarif cihazınızda yeni bir proje olarak kuruldu.", importError: "Tarif okunamadı veya güvenli boyut sınırını aşıyor.", flow: "Akış", noEdge: "Bağlantı yok", from: "Çıkış", to: "Giriş", restored: "Araç çıktısı düğüme ve bağlı sonraki girdiye aktarıldı.", confirmDelete: "Bu cihazdaki şifreli projeyi silmek istiyor musunuz?", local: "AES-GCM ile IndexedDB içinde cihazda şifreli", unsaved: "Hazırlanıyor…" },
  en: { title: "ByteQuant Workstation", saved: "Encrypted on this device", saving: "Preparing encrypted save…", saveError: "Workspace could not be saved. Check storage quota or private-browsing settings.", projects: "Projects", newProject: "New project", delete: "Delete", persist: "Request persistent storage", persisted: "The browser approved persistent storage.", palette: "Tool palette", search: "Search 89 tools", drag: "Drag to the canvas or press Add.", add: "Add", canvas: "Visual workflow canvas", empty: "Drag the first node from the palette.", connect: "Select an output port, then the target input port.", max: "This workspace reached its safe node limit.", inspector: "Node inspector", input: "Input", output: "Latest output", open: "Run in tool", remove: "Remove node", select: "Select a node to edit it.", ai: "Local Agent → visual workflow", aiPlaceholder: "Example: validate JSON, mask sensitive fields, then convert to CSV", aiBuild: "Turn plan into nodes", aiBoundary: "This is not a remote LLM. It uses explainable local matching and never runs tools automatically.", share: "URL recipe", include: "Include inputs in the link", createLink: "Create share link", copy: "Copy link", shareSafe: "Outputs are never added to a URL. Inputs are excluded by default.", imported: "The shared recipe was installed as a new on-device project.", importError: "Recipe is invalid or exceeds the safe size limit.", flow: "Flow", noEdge: "No connection", from: "Output", to: "Input", restored: "Tool output reached this node and the next connected input.", confirmDelete: "Delete this encrypted project from this device?", local: "AES-GCM encrypted in on-device IndexedDB", unsaved: "Preparing…" },
  de: { title: "ByteQuant Workstation", saved: "Auf diesem Gerät verschlüsselt gespeichert", saving: "Verschlüsselte Speicherung…", saveError: "Arbeitsbereich konnte nicht gespeichert werden. Speicherquote oder privaten Modus prüfen.", projects: "Projekte", newProject: "Neues Projekt", delete: "Löschen", persist: "Dauerhaften Speicher anfordern", persisted: "Der Browser hat dauerhaften Speicher bestätigt.", palette: "Werkzeugpalette", search: "89 Werkzeuge durchsuchen", drag: "Auf die Fläche ziehen oder Hinzufügen wählen.", add: "Hinzufügen", canvas: "Visuelle Ablaufoberfläche", empty: "Ersten Knoten aus der Palette hierher ziehen.", connect: "Erst Ausgang, dann Zieleingang wählen.", max: "Sichere Knotengrenze erreicht.", inspector: "Knotenprüfung", input: "Eingabe", output: "Letzte Ausgabe", open: "Im Werkzeug ausführen", remove: "Knoten entfernen", select: "Knoten zum Bearbeiten auswählen.", ai: "Lokaler Agent → visueller Ablauf", aiPlaceholder: "Beispiel: JSON prüfen, sensible Felder maskieren und in CSV umwandeln", aiBuild: "Plan in Knoten umwandeln", aiBoundary: "Kein Remote-LLM: nachvollziehbare lokale Zuordnung; Werkzeuge starten nie automatisch.", share: "URL-Rezept", include: "Eingaben in Link aufnehmen", createLink: "Freigabelink erstellen", copy: "Link kopieren", shareSafe: "Ausgaben gelangen nie in die URL. Eingaben sind standardmäßig ausgeschlossen.", imported: "Das geteilte Rezept wurde als neues lokales Projekt eingerichtet.", importError: "Rezept ist ungültig oder zu groß.", flow: "Ablauf", noEdge: "Keine Verbindung", from: "Ausgang", to: "Eingang", restored: "Werkzeugausgabe wurde an Knoten und Folgeeingang übertragen.", confirmDelete: "Verschlüsseltes Projekt von diesem Gerät löschen?", local: "AES-GCM-verschlüsselt in lokalem IndexedDB", unsaved: "Vorbereitung…" },
  zh: { title: "ByteQuant 工作站", saved: "已在此设备上加密保存", saving: "正在准备加密保存…", saveError: "无法保存工作区。请检查存储配额或隐私浏览设置。", projects: "项目", newProject: "新建项目", delete: "删除", persist: "申请持久存储", persisted: "浏览器已批准持久存储。", palette: "工具面板", search: "搜索 89 个工具", drag: "拖到画布，或点击添加。", add: "添加", canvas: "可视化工作流画布", empty: "从左侧面板拖入第一个节点。", connect: "先选择输出端口，再选择目标输入端口。", max: "此工作区已达到安全节点上限。", inspector: "节点检查器", input: "输入", output: "最新输出", open: "在工具中运行", remove: "移除节点", select: "选择节点进行编辑。", ai: "本地助手 → 可视化流程", aiPlaceholder: "例如：验证 JSON、遮蔽敏感字段，再转换为 CSV", aiBuild: "把计划转换为节点", aiBoundary: "它不是远程 LLM，而是可解释的本地匹配系统，绝不会自动运行工具。", share: "URL 配方", include: "在链接中包含输入", createLink: "生成分享链接", copy: "复制链接", shareSafe: "输出绝不会加入 URL；输入默认排除。", imported: "分享配方已作为新的设备端项目建立。", importError: "配方无效或超过安全大小限制。", flow: "流程", noEdge: "无连接", from: "输出", to: "输入", restored: "工具输出已传给该节点及下一个连接的输入。", confirmDelete: "从此设备删除这个加密项目？", local: "使用 AES-GCM 加密保存在设备端 IndexedDB", unsaved: "正在准备…" },
} as const;

const nodeWidth = 244;
const nodePortY = 66;

export default function WorkstationClient({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [document, setDocument] = useState(() => createWorkspace(locale));
  const [projects, setProjects] = useState<WorkspaceSummary[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [agentGoal, setAgentGoal] = useState("");
  const [includeInputs, setIncludeInputs] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);
  const returnPath = pathFor(locale, "workstation");
  const selected = document.nodes.find((node) => node.id === selectedId) ?? null;
  const filteredTools = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return tools.filter((tool) => !term || `${tool.title[locale]} ${tool.slug} ${tool.short[locale]}`.toLocaleLowerCase().includes(term)).slice(0, 30);
  }, [query, locale]);

  const refreshProjects = useCallback(async () => { try { setProjects(await listWorkspaces()); } catch { setProjects([]); } }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const active = readActiveWorkspace(sessionStorage.getItem(WORKSPACE_ACTIVE_KEY));
        const handoff = readWorkspaceHandoff(sessionStorage.getItem(WORKSPACE_HANDOFF_KEY));
        const recipeCode = new URLSearchParams(location.search).get("recipe");
        let initial = active;
        if (recipeCode) {
          const recipe = await decodeRecipeInWorker(recipeCode);
          initial = documentFromRecipe(recipe); setNotice(t.imported);
          history.replaceState(null, "", location.pathname);
        }
        if (!initial) {
          const summaries = await listWorkspaces();
          if (summaries[0]) initial = await loadWorkspace(summaries[0].id);
        }
        initial ??= createWorkspace(locale);
        if (handoff?.completed && handoff.workspaceId === initial.id) {
          initial = propagateWorkspaceOutput(initial, handoff.nodeId, handoff.output);
          setNotice(t.restored);
        }
        sessionStorage.removeItem(WORKSPACE_ACTIVE_KEY);
        sessionStorage.removeItem(WORKSPACE_HANDOFF_KEY);
        if (!cancelled) { setDocument(initial); setSelectedId(initial.nodes[0]?.id ?? null); setHydrated(true); }
      } catch { if (!cancelled) { setNotice(t.importError); setHydrated(true); } }
    })();
    return () => { cancelled = true; };
  }, [locale, t.importError, t.imported, t.restored]);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(async () => {
      setSaveState("saving");
      try { await saveWorkspace(document); setSaveState("saved"); await refreshProjects(); }
      catch { setSaveState("error"); }
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [document, hydrated, refreshProjects]);

  const setDocumentChanged = useCallback((updater: (current: WorkspaceDocument) => WorkspaceDocument) => setDocument((current) => updater(current)), []);

  function addTool(slug: string, position?: { x: number; y: number }) {
    if (document.nodes.length >= WORKSPACE_MAX_NODES) { setNotice(t.max); return; }
    const tool = tools.find((item) => item.slug === slug);
    if (!tool) return;
    const node: WorkspaceNode = { id: workspaceId("node"), toolSlug: slug, title: tool.title[locale], x: position?.x ?? 48 + (document.nodes.length % 3) * 280, y: position?.y ?? 48 + Math.floor(document.nodes.length / 3) * 190, input: "", output: "", status: "idle" };
    setDocumentChanged((current) => updateWorkspace(current, { nodes: [...current.nodes, node] }));
    setSelectedId(node.id);
  }

  function dropTool(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const slug = event.dataTransfer.getData("application/x-bytequant-tool");
    const rectangle = event.currentTarget.getBoundingClientRect();
    addTool(slug, { x: Math.max(10, event.clientX - rectangle.left - 100), y: Math.max(10, event.clientY - rectangle.top - 40) });
  }

  function beginMove(event: React.PointerEvent<HTMLButtonElement>, node: WorkspaceNode) {
    if (event.button !== 0) return;
    event.preventDefault(); setSelectedId(node.id);
    const start = { clientX: event.clientX, clientY: event.clientY, x: node.x, y: node.y };
    const move = (next: PointerEvent) => setDocumentChanged((current) => updateWorkspace(current, { nodes: current.nodes.map((item) => item.id === node.id ? { ...item, x: Math.max(0, start.x + next.clientX - start.clientX), y: Math.max(0, start.y + next.clientY - start.clientY) } : item) }));
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up, { once: true });
  }

  function connectTo(nodeId: string) {
    if (!connectFrom || connectFrom === nodeId) { setConnectFrom(null); return; }
    setDocumentChanged((current) => {
      if (current.edges.some((edge) => edge.from === connectFrom && edge.to === nodeId)) return current;
      return updateWorkspace(current, { edges: [...current.edges, { id: workspaceId("edge"), from: connectFrom, to: nodeId }] });
    });
    setConnectFrom(null);
  }

  function updateNode(id: string, patch: Partial<WorkspaceNode>) {
    setDocumentChanged((current) => updateWorkspace(current, { nodes: current.nodes.map((node) => node.id === id ? { ...node, ...patch } : node) }));
  }

  function removeNode(id: string) {
    setDocumentChanged((current) => updateWorkspace(current, { nodes: current.nodes.filter((node) => node.id !== id), edges: current.edges.filter((edge) => edge.from !== id && edge.to !== id) }));
    setSelectedId(null);
  }

  function openTool(node: WorkspaceNode) {
    sessionStorage.setItem(WORKSPACE_ACTIVE_KEY, JSON.stringify(document));
    sessionStorage.setItem(WORKSPACE_HANDOFF_KEY, JSON.stringify({ version: 1, workspaceId: document.id, nodeId: node.id, toolSlug: node.toolSlug, input: node.input, output: "", returnPath, completed: false }));
  }

  function buildAgentFlow() {
    const plan = createAgentPlan(agentGoal, tools, locale);
    if (!plan.steps.length) return;
    const nodes = plan.steps.map((step, index): WorkspaceNode => ({ id: workspaceId("node"), toolSlug: step.toolSlug, title: step.title, x: 48 + index * 285, y: 90 + (index % 2) * 36, input: index === 0 ? plan.goal : "", output: "", status: index === 0 ? "ready" : "idle" }));
    const edges = nodes.slice(1).map((node, index) => ({ id: workspaceId("edge"), from: nodes[index].id, to: node.id }));
    setDocumentChanged((current) => updateWorkspace(current, { name: plan.goal.slice(0, 80), nodes, edges }));
    setSelectedId(nodes[0]?.id ?? null);
  }

  async function createShareLink() {
    try {
      const code = await encodeRecipeInWorker(createWorkspaceRecipe(document, includeInputs));
      const url = `${location.origin}/workspace?recipe=${encodeURIComponent(code)}`;
      setShareUrl(url);
    } catch { setNotice(t.importError); }
  }

  async function createProject() { const next = createWorkspace(locale); setDocument(next); setSelectedId(null); setNotice(""); }
  async function openProject(id: string) { try { const next = await loadWorkspace(id); setDocument(next); setSelectedId(next.nodes[0]?.id ?? null); } catch { setSaveState("error"); } }
  async function removeProject(id: string) { if (!window.confirm(t.confirmDelete)) return; await deleteWorkspace(id); if (document.id === id) await createProject(); await refreshProjects(); }
  async function persist() { const granted = await requestPersistentWorkspaceStorage(); setNotice(granted ? t.persisted : t.local); }

  return <div className="workstation-app" aria-label={t.title}>
    <header className="workstation-toolbar"><div><span className="workspace-live-dot" /><strong>{document.name}</strong><small>{saveState === "saving" ? t.saving : saveState === "saved" ? t.saved : saveState === "error" ? t.saveError : t.unsaved}</small></div><label><span className="sr-only">{t.title}</span><input value={document.name} maxLength={100} onChange={(event) => setDocumentChanged((current) => updateWorkspace(current, { name: event.target.value || t.title }))} /></label><div><span className="workspace-encryption-badge">AES-256 · IndexedDB</span><button type="button" onClick={persist}>{t.persist}</button></div></header>
    {notice && <div className="workspace-notice" role="status">{notice}</div>}
    <div className="workstation-grid">
      <aside className="workspace-sidebar">
        <section className="workspace-panel"><div className="workspace-panel-heading"><h3>{t.projects}</h3><button type="button" onClick={createProject}>+ {t.newProject}</button></div><div className="workspace-project-list">{projects.map((project) => <div key={project.id} className={project.id === document.id ? "active" : ""}><button type="button" onClick={() => openProject(project.id)}><strong>{project.name}</strong><small>{project.nodes} nodes · {new Date(project.updatedAt).toLocaleDateString(locale)}</small></button><button type="button" aria-label={t.delete} onClick={() => removeProject(project.id)}>×</button></div>)}</div><small>{t.local}</small></section>
        <section className="workspace-panel"><div className="workspace-panel-heading"><h3>{t.palette}</h3><span>{tools.length}</span></div><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /><p>{t.drag}</p><div className="workspace-tool-palette">{filteredTools.map((tool) => <div key={tool.slug} draggable onDragStart={(event) => event.dataTransfer.setData("application/x-bytequant-tool", tool.slug)}><span className={`tool-mark category-${tool.category}`}>{tool.mark}</span><div><strong>{tool.title[locale]}</strong><small>{categories[tool.category].label[locale]}</small></div><button type="button" onClick={() => addTool(tool.slug)}>{t.add}</button></div>)}</div></section>
      </aside>

      <div className="workspace-main">
        <section className="workspace-ai-builder"><div><span className="kicker">BQ LOCAL AGENT</span><h3>{t.ai}</h3><p>{t.aiBoundary}</p></div><div><textarea value={agentGoal} onChange={(event) => setAgentGoal(event.target.value)} placeholder={t.aiPlaceholder} /><button type="button" className="primary-button" disabled={!agentGoal.trim()} onClick={buildAgentFlow}>{t.aiBuild}</button></div></section>
        <section className="workspace-canvas-shell" aria-labelledby="canvas-title"><header><div><h3 id="canvas-title">{t.canvas}</h3><small>{connectFrom ? t.connect : `${document.nodes.length}/${WORKSPACE_MAX_NODES} nodes · ${document.edges.length} ${t.flow}`}</small></div><button type="button" onClick={() => { setDocumentChanged((current) => updateWorkspace(current, { nodes: [], edges: [] })); setSelectedId(null); }}>{locale === "tr" ? "Tuvali temizle" : locale === "de" ? "Fläche leeren" : locale === "zh" ? "清空画布" : "Clear canvas"}</button></header><div className="workspace-canvas-scroll"><div ref={canvasRef} className="workspace-canvas" onDragOver={(event) => event.preventDefault()} onDrop={dropTool} onClick={() => setConnectFrom(null)}>
          <svg className="workspace-wires" aria-hidden="true">{document.edges.map((edge) => { const from = document.nodes.find((node) => node.id === edge.from); const to = document.nodes.find((node) => node.id === edge.to); if (!from || !to) return null; const x1 = from.x + nodeWidth; const y1 = from.y + nodePortY; const x2 = to.x; const y2 = to.y + nodePortY; return <path key={edge.id} d={`M ${x1} ${y1} C ${x1 + 90} ${y1}, ${x2 - 90} ${y2}, ${x2} ${y2}`} />; })}</svg>
          {document.nodes.length === 0 && <div className="workspace-empty"><span>⌘</span><p>{t.empty}</p></div>}
          {document.nodes.map((node) => <article key={node.id} className={`workspace-node ${selectedId === node.id ? "selected" : ""} status-${node.status}`} style={{ transform: `translate(${node.x}px, ${node.y}px)` }} onClick={(event) => { event.stopPropagation(); setSelectedId(node.id); }}><button className="workspace-node-handle" type="button" onPointerDown={(event) => beginMove(event, node)}><span className="workspace-grip">⠿</span><strong>{node.title}</strong><small>{node.toolSlug}</small></button><div className="workspace-node-body"><span>{node.input ? `${node.input.length} chars` : t.input}</span><i>→</i><span>{node.output ? `${node.output.length} chars` : t.output}</span></div><button className="workspace-port input" type="button" aria-label={`${t.to}: ${node.title}`} onClick={(event) => { event.stopPropagation(); connectTo(node.id); }} /><button className={`workspace-port output ${connectFrom === node.id ? "active" : ""}`} type="button" aria-label={`${t.from}: ${node.title}`} onClick={(event) => { event.stopPropagation(); setConnectFrom(node.id); }} /><footer><span className="workspace-node-status">{node.status}</span><Link href={toolPath(locale, node.toolSlug)} onClick={() => openTool(node)}>{t.open} →</Link></footer></article>)}
        </div></div></section>

        <div className="workspace-lower-grid"><section className="workspace-panel workspace-inspector"><h3>{t.inspector}</h3>{selected ? <><label>{t.input}<textarea value={selected.input} onChange={(event) => updateNode(selected.id, { input: event.target.value.slice(0, 200_000), status: event.target.value ? "ready" : "idle" })} /></label><label>{t.output}<textarea readOnly value={selected.output} /></label><div><Link className="primary-button" href={toolPath(locale, selected.toolSlug)} onClick={() => openTool(selected)}>{t.open}</Link><button type="button" onClick={() => removeNode(selected.id)}>{t.remove}</button></div></> : <p>{t.select}</p>}</section>
          <section className="workspace-panel workspace-recipe-panel"><h3>{t.share}</h3><p>{t.shareSafe}</p><label className="workspace-checkbox"><input type="checkbox" checked={includeInputs} onChange={(event) => setIncludeInputs(event.target.checked)} />{t.include}</label><button type="button" className="secondary-button" onClick={createShareLink}>{t.createLink}</button>{shareUrl && <label><span className="sr-only">URL</span><textarea readOnly value={shareUrl} /><button type="button" onClick={() => navigator.clipboard.writeText(shareUrl)}>{t.copy}</button></label>}</section></div>
        <WorkspaceP2PPanel locale={locale} document={document} onRemoteDocument={(remote) => setDocument((current) => remote.updatedAt > current.updatedAt ? remote : current)} />
      </div>
    </div>
  </div>;
}
