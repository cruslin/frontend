import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Normalize any livestream input into a clean embed URL.
 * Accepts: full <iframe> HTML, YouTube watch/short/embed/live_stream URLs,
 * Vimeo URLs, or a bare YouTube video ID.
 * Returns null if nothing usable can be extracted.
 */
export function normalizeEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  let s = input.trim();
  if (!s) return null;

  // If the admin pasted the full <iframe ... src="..."> HTML, extract src.
  const iframeMatch = s.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (iframeMatch) s = iframeMatch[1];

  // Bare 11-char YouTube video ID
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) {
    return `https://www.youtube.com/embed/${s}?autoplay=1`;
  }

  // YouTube watch URL: https://www.youtube.com/watch?v=ID
  const watchMatch = s.match(/youtube\.com\/watch\?(?:[^#]*&)?v=([A-Za-z0-9_-]{11})/i);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
  }

  // youtu.be short link: https://youtu.be/ID
  const shortMatch = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/i);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
  }

  // YouTube live_stream?channel=UCxxx — valid embed, use as-is
  if (/youtube\.com\/embed\/live_stream\?channel=/i.test(s)) {
    return s;
  }

  // Already an embed URL
  if (/youtube\.com\/embed\//i.test(s) || /player\.vimeo\.com\//i.test(s)) {
    return s;
  }

  // Generic http(s) URL — return as-is and let the iframe try it
  if (/^https?:\/\//i.test(s)) return s;

  return null;
}
