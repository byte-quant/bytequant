export const consentStorageKey = "bq-consent-v1";
export const usageStorageKey = "bq-tool-usage-v1";
export const favoritesStorageKey = "bq-tool-favorites-v1";
export const consentChangeEvent = "bq-consent-change";
export const openPrivacySettingsEvent = "bq-open-privacy-settings";

const consentVersion = 1;
const consentLifetimeMs = 180 * 24 * 60 * 60 * 1000;

export type ConsentRecord = {
  version: typeof consentVersion;
  decidedAt: number;
  expiresAt: number;
  preferences: boolean;
};

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ConsentRecord>;
  return record.version === consentVersion
    && typeof record.decidedAt === "number"
    && Number.isFinite(record.decidedAt)
    && typeof record.expiresAt === "number"
    && Number.isFinite(record.expiresAt)
    && typeof record.preferences === "boolean";
}

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(consentStorageKey) ?? "null");
    if (!isConsentRecord(parsed) || parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(consentStorageKey);
      window.localStorage.removeItem(usageStorageKey);
      window.localStorage.removeItem(favoritesStorageKey);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function hasPreferenceConsent() {
  return readConsent()?.preferences === true;
}

export function saveConsent(preferences: boolean) {
  const now = Date.now();
  const record: ConsentRecord = {
    version: consentVersion,
    decidedAt: now,
    expiresAt: now + consentLifetimeMs,
    preferences,
  };
  try {
    window.localStorage.setItem(consentStorageKey, JSON.stringify(record));
    if (!preferences) {
      window.localStorage.removeItem(usageStorageKey);
      window.localStorage.removeItem(favoritesStorageKey);
    }
  } catch {
    // Privacy choices still apply for the current page when storage is unavailable.
  } finally {
    window.dispatchEvent(new CustomEvent(consentChangeEvent, { detail: record }));
  }
  return record;
}

export function openPrivacySettings() {
  window.dispatchEvent(new Event(openPrivacySettingsEvent));
}
