import { NextRequest } from 'next/server';

/**
 * Best-effort in-memory fixed-window limiter (per serverless instance).
 * Good enough to slow brute force; not a distributed guarantee.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  return (xff.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim();
}

export function hit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterS: number } {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterS: 0 };
  }
  b.count += 1;
  return { allowed: b.count <= limit, retryAfterS: Math.ceil((b.resetAt - now) / 1000) };
}

export function reset(key: string) {
  buckets.delete(key);
}
