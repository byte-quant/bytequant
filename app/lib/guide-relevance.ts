type ToolContext = { slug: string; category: string };
type Guide = { slug: string; relatedTools: string[] };
/** Prefer a guide focused on this exact tool over broad catalog roundups.
 * Stable source order breaks ties; publishing a new unrelated guide should not
 * displace an established tutorial merely because it is newer. */
export function rankToolGuides<T extends Guide>(tool: ToolContext, guides: readonly T[], lookup: (slug: string) => ToolContext | undefined): T[] {
  const score = (guide: T) => {
    const direct = guide.relatedTools.includes(tool.slug);
    const sameCategory = guide.relatedTools.filter((slug) => lookup(slug)?.category === tool.category).length;
    if (!direct && sameCategory === 0) return 0;
    return (direct ? 100 : 0) + sameCategory / Math.max(1, guide.relatedTools.length) + 1 / Math.max(1, guide.relatedTools.length);
  };
  return guides.map((guide, index) => ({ guide, index, score: score(guide) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.guide);
}
