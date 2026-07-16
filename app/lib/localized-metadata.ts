import type { Metadata } from "next";
import type { InfoKey } from "./info";
import { localizedInfo, type ExtendedLocale } from "./localized-info";
import { localizedAlternates, localizedSocialMetadata, pathFor } from "./site";

export function infoMetadata(locale: ExtendedLocale, key: InfoKey): Metadata {
  const content = localizedInfo[locale][key];
  const path = pathFor(locale, key);
  return { title: content.title, description: content.intro, alternates: localizedAlternates(locale, pathFor("tr", key), pathFor("en", key)), ...localizedSocialMetadata(locale, content.title, content.intro, path) };
}
