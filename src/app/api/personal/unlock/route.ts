import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, readJson } from '@/lib/auth';
import { clientIp, hit, reset } from '@/lib/ratelimit';
import { getVaultFiles } from '@/lib/vault';

export const dynamic = 'force-dynamic';

const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function pinMatches(given: string, expected: string): boolean {
  const a = Buffer.from(given, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const noStore = { 'Cache-Control': 'no-store' };

// Server-side PIN check for the Personal compartment (03-PERSONAL).
// Requires the private-API auth (SSO host or Bearer) AND the PIN.
// Fail closed: without POSITRON_PERSONAL_PIN nothing unlocks.
export async function POST(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;

  const key = `pin:${clientIp(req)}`;
  const gate = hit(key, MAX_FAILS, WINDOW_MS);
  if (!gate.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Demasiados intentos. Prueba más tarde.' },
      { status: 429, headers: { ...noStore, 'Retry-After': String(gate.retryAfterS) } },
    );
  }

  const expected = (process.env.POSITRON_PERSONAL_PIN || '').trim();
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'PIN no configurado' }, { status: 503, headers: noStore });
  }

  const body = await readJson(req, 1024);
  const pin = typeof body?.pin === 'string' ? body.pin.trim() : '';
  if (!pin || pin.length > 32 || !pinMatches(pin, expected)) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false, error: 'PIN incorrecto' }, { status: 401, headers: noStore });
  }

  reset(key);
  return NextResponse.json({ ok: true, files: getVaultFiles('03-PERSONAL') }, { headers: noStore });
}
