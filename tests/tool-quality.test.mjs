import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("everyday expansion calculators use field-based forms instead of visitor-authored JSON", async () => {
  const source = await read("app/components/ExpansionWorkbenches.tsx");
  const slugs = [
    "kredi-amortisman-tahminleyici",
    "enflasyon-satin-alma-gucu",
    "basabas-noktasi-hesaplayici",
    "marj-kar-orani-hesaplayici",
    "olasilik-hesaplayici",
    "orneklem-buyuklugu-tahminleyici",
  ];
  for (const slug of slugs) assert.match(source, new RegExp(`guidedCalculatorFields[\\s\\S]*?"${slug}"`));
  assert.match(source, /guidedFields\.length \? <div className="essential-form tool-guided-form" data-agent-contract="fields-v1">/);
  assert.match(source, /const effectiveInput = guidedFields\.length \? JSON\.stringify\(guidedValues\) : input/);
  assert.match(source, /guidedCalculatorFields\[slug\]\) return processGuidedCalculator/);
});

test("probability calculator validates percentages, dependence, and feasible intersection", async () => {
  const source = await read("app/components/ExpansionWorkbenches.tsx");
  assert.match(source, /const minIntersection = Math\.max\(0, a \+ b - 1\), maxIntersection = Math\.min\(a, b\)/);
  assert.match(source, /c\.relationship === "known" \? num\(c\.intersection/);
  assert.match(source, /intersection < minIntersection - 1e-12 \|\| intersection > maxIntersection \+ 1e-12/);
  assert.match(source, /Intersection was calculated as A×B; validate independence/);
});

test("text workbench families expose only completed output to the local-agent bridge", async () => {
  const structuredOutput = await read("app/components/StructuredToolOutput.tsx");
  assert.match(structuredOutput, /data-agent-output data-ready=\{output \? "true" : "false"\}/);
  assert.match(structuredOutput, /data-agent-output data-ready="true"/);
  const files = [
    "app/components/AdvancedWorkbenches.tsx",
    "app/components/DemandWorkbenches.tsx",
    "app/components/DiscoveryWorkbenches.tsx",
    "app/components/ExpansionWorkbenches.tsx",
    "app/components/GrowthWorkbenches.tsx",
    "app/components/PrecisionWorkbenches.tsx",
    "app/components/ProductivityWorkbenches.tsx",
    "app/components/SpecializedWorkbench.tsx",
  ];
  for (const file of files) {
    const source = await read(file);
    assert.match(source, /data-agent-output|<StructuredToolOutput/);
    if (source.includes("<StructuredToolOutput")) assert.match(source, /import \{ StructuredToolOutput \}/);
    else assert.match(source, /data-ready=/);
  }
});

test("shared tool experience never treats a not-ready placeholder as completed output", async () => {
  const source = await read("app/components/ToolExperience.tsx");
  assert.match(source, /\[data-agent-output\]\[data-ready="true"\]/);
  assert.match(source, /\[data-agent-output\]:not\(\[data-ready\]\)/);
  assert.match(source, /const candidates = ready\.length \? ready : legacy/);
});

test("line sorter publishes a complete Agent handoff contract and hydration-safe retry", async () => {
  const [demand, productivity, bridge] = await Promise.all([
    read("app/components/DemandWorkbenches.tsx"),
    read("app/components/ProductivityWorkbenches.tsx"),
    read("app/components/AgentToolBridge.tsx"),
  ]);
  assert.match(demand, /className="workbench-inputs" data-agent-contract="single-text-v1"/);
  assert.match(demand, /textarea data-agent-input data-agent-key="input"/);
  assert.match(demand, /select data-agent-mode/);
  assert.match(productivity, /data-agent-contract="single-text-v1"/);
  assert.match(productivity, /textarea data-agent-input data-agent-key="input"/);
  assert.match(demand, /value: "stable-unique"/);
  assert.match(demand, /if \(option !== "stable-unique"\)/);
  assert.match(bridge, /step\.operation === "deduplicate" \? "stable-unique"/);
  assert.match(bridge, /step\.operation === "sort" \? "alpha"/);
  assert.match(bridge, /const deadline = performance\.now\(\) \+ 4_000/);
  assert.match(bridge, /if \(result === "applied"\)[\s\S]*?removeItem\(AGENT_AUTO_PREPARE_KEY\)/);
});

test("privacy masking keeps review guidance outside the transferable data payload", async () => {
  const source = await read("app/components/ToolWorkbench.tsx");
  assert.match(source, /case "kvkk-veri-maskeleyici"[\s\S]*?setResult\(masked,/);
  assert.match(source, /case "kvkk-veri-maskeleyici"[\s\S]*?setNotice\(\{ kind: "warning"/);
  assert.match(source, /const aliases = new Map<string, string>\(\)/);
  assert.match(source, /const existing = aliases\.get\(key\)/);
  assert.doesNotMatch(source, /setResult\(`\$\{masked\}\\n\\n/);
});

test("agent actions remain reachable and localized tool feedback cannot overflow", async () => {
  const [agent, styles] = await Promise.all([
    read("app/components/AgentConversation.tsx"),
    read("app/globals.css"),
  ]);
  assert.match(agent, /const primaryActionsRef = useRef<HTMLDivElement \| null>\(null\)/);
  assert.match(agent, /primaryActionsRef\.current\?\.scrollIntoView/);
  assert.match(agent, /className="agent-primary-actions" ref=\{primaryActionsRef\}/);
  assert.match(styles, /\.agent-chat-stream \.agent-answer-card\{flex:0 0 auto\}/);
  assert.match(styles, /scrollbar-gutter:stable/);
  assert.match(styles, /\.tool-status>span,\.local-trust-card>p/);
  assert.match(styles, /overflow-wrap:anywhere/);
});

test("the shared visual layer is progressive, low-power, and fully cleaned up", async () => {
  const [scene, shell, styles] = await Promise.all([
    read("app/components/AmbientScene.tsx"),
    read("app/components/SiteShell.tsx"),
    read("app/globals.css"),
  ]);
  assert.match(shell, /<AmbientScene \/>/);
  assert.match(scene, /prefers-reduced-motion: reduce/);
  assert.match(scene, /deviceMemory/);
  assert.match(scene, /powerPreference: "low-power"/);
  assert.match(scene, /document\.visibilityState === "visible"/);
  assert.match(scene, /now - lastFrame >= 40/);
  assert.match(scene, /cancelAnimationFrame/);
  assert.match(scene, /resizeObserver\?\.disconnect/);
  assert.match(scene, /deleteBuffer/);
  assert.match(styles, /\.ambient-webgl\{[^}]*pointer-events:none/);
  assert.match(styles, /@media\(prefers-reduced-motion:reduce\)/);
});

test("responsive quality layer prevents clipped community and localized tool controls", async () => {
  const styles = await read("app/globals.css");
  assert.match(styles, /\.community-social-main\{[^}]*grid-template-columns:minmax\(0,1fr\)/);
  assert.match(styles, /\.community-global-composer[^}]*max-width:100%/);
  assert.match(styles, /\.tool-notice\{[\s\S]*?grid-template-columns:32px minmax\(0,1fr\)/);
  assert.match(styles, /\.tool-status>span[^}]*overflow-wrap:break-word[^}]*word-break:normal/);
  assert.doesNotMatch(styles, /\.site-shell,\.site-shell \*\{min-inline-size:0\}/);
  assert.match(styles, /html\{scrollbar-gutter:stable\}/);
  assert.match(styles, /input,textarea,select\{font-size:16px\}/);
});

test("community device board uses a readable post preview instead of raw Markdown", async () => {
  const [composer, styles] = await Promise.all([
    read("app/components/CommunityComposer.tsx"),
    read("app/globals.css"),
  ]);
  assert.match(composer, /className="community-draft-card"/);
  assert.match(composer, /className="community-preview-actions"/);
  assert.doesNotMatch(composer, /<pre>\{markdown\}<\/pre>/);
  assert.match(styles, /\.community-preview-actions\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});

test("JSON-LD serialization escapes executable separators and unsafe markup", async () => {
  const source = await read("app/components/SchemaScript.tsx");
  assert.match(source, /replace\(\/<\/g, "\\\\u003c"\)/);
  assert.match(source, /replace\(\/\\u2028\/g, "\\\\u2028"\)/);
  assert.match(source, /replace\(\/\\u2029\/g, "\\\\u2029"\)/);
});

test("download helpers retain object URLs through the browser click task", async () => {
  const files = [
    "app/components/SpecializedWorkbench.tsx",
    "app/components/EssentialWorkbenches.tsx",
    "app/components/CommunityComposer.tsx",
    "app/components/CommunityFeed.tsx",
    "app/components/ToolWorkbench.tsx",
  ];
  for (const file of files) {
    const source = await read(file);
    assert.doesNotMatch(source, /\.click\(\);\s*URL\.revokeObjectURL/);
    assert.match(source, /\.click\(\);\s*(?:window\.)?setTimeout\(\(\) => URL\.revokeObjectURL/);
  }
});
