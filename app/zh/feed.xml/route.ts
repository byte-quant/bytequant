import { buildLocalizedFeed } from "../../lib/feed";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLocalizedFeed("zh"), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
