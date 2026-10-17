import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side guard for private API routes (chat, captures, commands, email,
 * notifications, speak).
 *
 * A request is authorized when:
 *  1. it carries `Authorization: Bearer <POSITRON_API_KEY>` (machine callers), or
 *  2. it arrives on a Vercel-generated host of this team
 *     (`*-wmejiasbcn-8378s-projects.vercel.app`, overridable with
 *     POSITRON_SSO_HOST_SUFFIX). Those hosts sit behind Vercel Authentication
 *     (SSO), so the edge has already authenticated the visitor before the
 *     function runs. Public aliases/custom domains (e.g. positron-gamma.vercel.app)
 *     are NOT trusted and need the Bearer key.
 *
 * Fail closed: if POSITRON_API_KEY is not configured, every private request
 * gets 401. The key never reaches the browser (no NEXT_PUBLIC_ prefix).
 */
const DEFAULT_SSO_HOST_SUFFIX = '-wmejiasbcn-8378s-projects.vercel.app';

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  // Length is not secret (fixed-size random key); content comparison is constant-time.
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function isAuthorized(req: NextRequest): boolean {
  const key = process.env.POSITRON_API_KEY;
  if (!key) return false;

  const auth = req.headers.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(auth);
  if (m && safeEqual(m[1].trim(), key)) return true;

  const host = (req.headers.get('host') || '').toLowerCase().split(':')[0];
  const suffix = (process.env.POSITRON_SSO_HOST_SUFFIX || DEFAULT_SSO_HOST_SUFFIX).toLowerCase();
  if (process.env.VERCEL === '1' && suffix && host.endsWith(suffix)) return true;

  if (process.env.NODE_ENV === 'development' && (host === 'localhost' || host === '127.0.0.1')) {
    return true;
  }
  return false;
}

/** Returns a 401 response when unauthorized, or null when the request may proceed. */
export function requireAuth(req: NextRequest): NextResponse | null {
  if (isAuthorized(req)) return null;
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401, headers: { 'WWW-Authenticate': 'Bearer', 'Cache-Control': 'no-store' } },
  );
}

/** Parse a JSON body with a size cap; returns null on invalid/oversized input. */
export async function readJson<T = Record<string, unknown>>(
  req: NextRequest,
  maxBytes = 64 * 1024,
): Promise<T | null> {
  try {
    const text = await req.text();
    if (Buffer.byteLength(text, 'utf8') > maxBytes) return null;
    const data = JSON.parse(text);
    return data && typeof data === 'object' && !Array.isArray(data) ? (data as T) : null;
  } catch {
    return null;
  }
}

export function str(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t || t.length > max) return null;
  return t;
}

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}
