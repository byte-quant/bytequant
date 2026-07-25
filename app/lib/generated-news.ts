export type NewsItem = { id: string; title: string; url: string; date: string; source: "NASA" | "NIST"; category: "science" | "technology" | "security" | "standards" };

// Build-time fallback. scripts/sync-news.mjs replaces this list during scheduled public-repository builds.
export const newsGeneratedAt = "2026-07-25T00:00:00.000Z";
export const newsItems: NewsItem[] = [
  { id: "nasa-spacecraft-tech-moon-2026", title: "NASA Announces New Spacecraft Technology Demonstration Mission at Moon", url: "https://www.nasa.gov/news-release/nasa-announces-new-spacecraft-technology-demonstration-mission-at-moon/", date: "2026-07-24", source: "NASA", category: "technology" },
  { id: "nasa-hybrid-electric-flight-2026", title: "NASA, GE Aerospace Work Enables Hybrid-Electric Flight Demonstration", url: "https://www.nasa.gov/aeronautics/", date: "2026-07-20", source: "NASA", category: "technology" },
  { id: "nasa-wing-design-2026", title: "NASA Pushes New Wing Design to Find Structural Limits", url: "https://www.nasa.gov/aeronautics/", date: "2026-07-18", source: "NASA", category: "science" },
  { id: "nist-cybersecurity-feed", title: "NIST Cybersecurity News and Research Updates", url: "https://www.nist.gov/topics/cybersecurity", date: "2026-07-01", source: "NIST", category: "security" },
  { id: "nist-information-technology-feed", title: "NIST Information Technology Research Updates", url: "https://www.nist.gov/topics/information-technology", date: "2026-07-01", source: "NIST", category: "technology" },
  { id: "nist-standards-feed", title: "NIST Standards and Measurements Updates", url: "https://www.nist.gov/standards", date: "2026-07-01", source: "NIST", category: "standards" },
];
