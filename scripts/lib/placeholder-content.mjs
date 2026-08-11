const standalonePlaceholder = /^(?:lorem ipsum(?: dolor sit amet)?|under construction|coming soon)(?:[.!…])?$/iu;

const decodeBasicEntities = (value) => value
  .replace(/&(?:nbsp|#160);/giu, " ")
  .replace(/&(?:amp|#38);/giu, "&")
  .replace(/&(?:quot|#34);/giu, '"')
  .replace(/&(?:apos|#39);/giu, "'")
  .replace(/&#x27;/giu, "'");

export const findStandalonePlaceholder = (html) => {
  const withoutExecutableContent = html
    .replace(/<script\b[\s\S]*?<\/script>/giu, "")
    .replace(/<style\b[\s\S]*?<\/style>/giu, "");

  for (const match of withoutExecutableContent.matchAll(/>([^<>]+)</gu)) {
    const text = decodeBasicEntities(match[1]).replace(/\s+/gu, " ").trim();
    if (standalonePlaceholder.test(text)) return text;
  }
  return null;
};
