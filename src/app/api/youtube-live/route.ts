// Tracks live status for YouTube channel @theecclesiaembassy (UCrvZyTocoH926b_wv81bpzA).
// Primary: YouTube Data API v3 (reliable, needs YOUTUBE_API_KEY env var).
// Fallback: HTML scraping — used when the key is missing or quota drops to 500 units remaining.
import { isQuotaSafe, consumeQuota } from "@/lib/youtube-quota";

const CHANNEL_ID = "UCrvZyTocoH926b_wv81bpzA";
const LIVE_DELAY_MS = 60_000;
const CACHE_TTL_MS = 5 * 60_000;
const SEARCH_COST = 100; // units per search.list call
const CHANNEL_FALLBACK_URL = `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1`;

interface LiveStatus {
  isLive: boolean;
  videoId: string | null;
  embedUrl: string | null;
  fallbackUrl?: string | null;
  useFallbackEmbed?: boolean;
}

const NOT_LIVE: LiveStatus = { isLive: false, videoId: null, embedUrl: null };
const CHANNEL_FALLBACK: LiveStatus = {
  isLive: false,
  videoId: null,
  embedUrl: null,
  fallbackUrl: CHANNEL_FALLBACK_URL,
  useFallbackEmbed: true,
};

let cached: { status: LiveStatus; expiresAt: number } | null = null;
let firstDetectedLiveAt: number | null = null;

async function fetchViaApi(apiKey: string): Promise<string | null> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${CHANNEL_ID}&eventType=live&type=video&maxResults=1&key=${apiKey}`,
    { signal: AbortSignal.timeout(10_000) }
  );

  if (res.status === 403) {
    const body = await res.json().catch(() => ({}));
    const reason = body?.error?.errors?.[0]?.reason ?? "";
    if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") {
      return "QUOTA_EXCEEDED";
    }
  }

  if (!res.ok) throw new Error(`API ${res.status}`);

  consumeQuota(SEARCH_COST);
  const data = await res.json();
  return data.items?.[0]?.id?.videoId ?? null;
}

async function fetchViaScraping(): Promise<string | null> {
  const res = await fetch(
    `https://www.youtube.com/channel/${CHANNEL_ID}/live`,
    {
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: "CONSENT=YES+; SOCS=CAI",
      },
    }
  );

  if (res.url.includes("consent.youtube.com")) return null;

  const html = await res.text();
  const watchMatch = /[?&]v=([a-zA-Z0-9_-]{11})/.exec(res.url);
  const htmlVideoMatch = /"videoId":"([a-zA-Z0-9_-]{11})"/.exec(html);
  const videoId = watchMatch?.[1] ?? htmlVideoMatch?.[1] ?? null;

  const isLive =
    videoId !== null &&
    (html.includes('"isLive":true') ||
      html.includes('"isLiveBroadcast":true') ||
      html.includes('"broadcastStatus":"live"') ||
      html.includes('"liveBadge"'));

  return isLive ? videoId : null;
}

async function fetchLiveStatus(): Promise<LiveStatus> {
  const now = Date.now();
  if (cached && now < cached.expiresAt) return cached.status;

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    let videoId: string | null;

    let apiQuotaExceeded = false;

    if (apiKey && isQuotaSafe(SEARCH_COST)) {
      const result = await fetchViaApi(apiKey);
      if (result === "QUOTA_EXCEEDED") {
        apiQuotaExceeded = true;
        videoId = await fetchViaScraping();
      } else {
        videoId = result;
      }
    } else {
      videoId = await fetchViaScraping();
    }

    if (!videoId) {
      firstDetectedLiveAt = null;
      // Preserve the channel fallback as metadata for callers that want it,
      // but do not expose it as the active embed unless a live video is confirmed.
      const status = apiQuotaExceeded ? CHANNEL_FALLBACK : NOT_LIVE;
      cached = { status, expiresAt: now + CACHE_TTL_MS };
      return status;
    }

    // Enforce the 1-minute delay before surfacing the stream to visitors.
    if (firstDetectedLiveAt === null) {
      firstDetectedLiveAt = now;
    }

    const delayElapsed = now - firstDetectedLiveAt >= LIVE_DELAY_MS;

    if (!delayElapsed) {
      const remaining = LIVE_DELAY_MS - (now - firstDetectedLiveAt);
      cached = { status: NOT_LIVE, expiresAt: now + remaining };
      return NOT_LIVE;
    }

    const status: LiveStatus = {
      isLive: true,
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
    };

    cached = { status, expiresAt: now + CACHE_TTL_MS };
    return status;
  } catch {
    // On any unexpected error fall back to the channel iframe rather than
    // silently dropping visitors to the countdown screen.
    cached = { status: CHANNEL_FALLBACK, expiresAt: now + 30_000 };
    return CHANNEL_FALLBACK;
  }
}

export async function GET() {
  const status = await fetchLiveStatus();
  return Response.json(status);
}
