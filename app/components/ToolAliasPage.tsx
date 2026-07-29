import { toolPath, type Locale } from "../lib/site";
import { SiteShell } from "./SiteShell";
import { ToolAliasRedirect } from "./ToolAliasRedirect";

export function ToolAliasPage({ locale, canonicalSlug, toolTitle }: { locale: Locale; canonicalSlug: string; toolTitle: string }) {
  const alternateLocale: Locale = locale === "tr" ? "en" : "tr";
  return <SiteShell locale={locale} alternateHref={toolPath(alternateLocale, canonicalSlug)} languageHrefs={{ tr: toolPath("tr", canonicalSlug), en: toolPath("en", canonicalSlug), de: toolPath("de", canonicalSlug), zh: toolPath("zh", canonicalSlug) }}><ToolAliasRedirect locale={locale} canonicalSlug={canonicalSlug} toolTitle={toolTitle} /></SiteShell>;
}
