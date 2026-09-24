/**
 * Sliding-window limiter, per user and bucket.
 *
 * In-memory on purpose: zero dependencies and fine for a single instance. On
 * serverless/multi-instance deployments each instance keeps its own window, so
 * swap this for Upstash Redis (@upstash/ratelimit) if you need a hard global cap.
 */
type Bucket = { name: string; limit: number; windowMs: number };

export const BUCKETS = {
    chat: { name: "chat", limit: 20, windowMs: 60_000 },
    structured: { name: "structured", limit: 30, windowMs: 60_000 },
    vision: { name: "vision", limit: 8, windowMs: 60_000 },
} satisfies Record<string, Bucket>;

const hits = new Map<string, number[]>();

export function checkRateLimit(userId: string, bucket: Bucket, now = Date.now()) {
    const key = `${bucket.name}:${userId}`;
    const recent = (hits.get(key) ?? []).filter((t) => now - t < bucket.windowMs);

    if (recent.length >= bucket.limit) {
        hits.set(key, recent);

        return {
            allowed: false as const,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowMs - (now - recent[0])) / 1000)),
        };
    }

    recent.push(now);
    hits.set(key, recent);

    if (hits.size > 5000) {
        for (const [k, times] of hits) {
            if (times.every((t) => now - t >= bucket.windowMs)) hits.delete(k);
        }
    }

    return { allowed: true as const };
}

export function resetRateLimits() {
    hits.clear();
}
