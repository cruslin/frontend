// YouTube Data API v3 free quota: 10,000 units/day. search.list = 100 units/call.
// This module tracks usage across both API routes in the same server process and
// pre-emptively switches to the scraping fallback when 500 units remain (at 9,500 used),
// rather than waiting for the quota-exceeded error at 0.
const DAILY_QUOTA = 10_000;
const SAFETY_BUFFER = 500;
const RESET_INTERVAL_MS = 24 * 60 * 60_000;

let unitsUsed = 0;
let windowStartMs = Date.now();

function maybeReset() {
  if (Date.now() - windowStartMs >= RESET_INTERVAL_MS) {
    unitsUsed = 0;
    windowStartMs = Date.now();
  }
}

export function isQuotaSafe(cost: number): boolean {
  maybeReset();
  return unitsUsed + cost <= DAILY_QUOTA - SAFETY_BUFFER;
}

export function consumeQuota(cost: number): void {
  maybeReset();
  unitsUsed += cost;
}
