/**
 * Search indexing and ad serving are separate controls. Unique public tools
 * remain discoverable; only canonical duplicates and private/technical routes
 * receive noindex at their route level. Community and news landing pages are
 * indexable, while the paths below remain recommended Auto Ads exclusions in
 * the AdSense account until their dynamic surfaces have separate ad review.
 */
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
