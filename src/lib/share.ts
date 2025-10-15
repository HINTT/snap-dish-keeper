// src/lib/share.ts
import LZString from "lz-string";

/** Turn a JS object into a compact, URL-safe token */
export function encodeRecipeToToken(recipe: unknown): string {
  const json = JSON.stringify(recipe);
  return LZString.compressToEncodedURIComponent(json);
}

/** Recover the original object from the token */
export function decodeRecipeFromToken(token: string): any | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(token);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Build a link that works with GitHub Pages + HashRouter */
export function buildShareUrl(token: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${window.location.origin}${base}#/shared/${token}`;
}
