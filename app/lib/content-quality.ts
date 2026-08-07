import { frontierToolSlugs } from "./frontier-tools";

/**
 * Search and advertising review must reflect editorial reality. The original
 * 234-tool library has individual product QA. The 75-tool laboratory remains
 * available to visitors, Agent, and Workstation, but stays out of search
 * indexes until every item receives the same manual review depth.
 */
export function isEditoriallyReviewedTool(slug: string) {
  return !frontierToolSlugs.has(slug);
}

export const laboratoryToolCount = frontierToolSlugs.size;

export const nonIndexableRobots = {
  index: false,
  follow: true,
  noarchive: true,
  googleBot: { index: false, follow: true, noarchive: true },
} as const;

export const adsenseAccountExclusionPaths = [
  "/topluluk/",
  "/en/community/",
  "/de/community/",
  "/zh/community/",
  "/guncel/",
  "/en/updates/",
  "/de/updates/",
  "/zh/updates/",
  "/workspace/",
] as const;
