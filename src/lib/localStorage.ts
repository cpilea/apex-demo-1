import { config } from "./config";

function getScopedKey(key: string) {
  return `${config.appStorageNamespace}:${key}`;
}

export function readScopedStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(getScopedKey(key));
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeScopedStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getScopedKey(key), JSON.stringify(value));
}

export function removeScopedStorage(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getScopedKey(key));
}
