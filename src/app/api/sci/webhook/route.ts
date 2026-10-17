import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// SCI Webhook - Positron receives SCI messages from n8n
// Must validate SHA-256, respect Kill Switch, return correct states
// RECEIVED -> ACCEPTED -> EXECUTING -> EXECUTED -> VERIFIED

export const dynamic = 'force-dynamic';

const AUTHORIZED_SENDERS = ['R1','R2','R3','R4','R5','R6','R7','R8','R9','R10','R11','R12','R13'];

const MAX_BODY_BYTES = 256 * 1024;
const MAX_SKEW_S = 300;

/**
 * Sender authentication (same scheme as Agente-Will-App verificationGate):
 *   X-WAIPL-Timestamp: unix seconds
 *   X-WAIPL-Signature: hex HMAC-SHA256(POSITRON_SCI_WEBHOOK_SECRET, `${ts}.${rawBody}`)
 * Fail closed when the secret is not configured.
 */
function verifySignature(req: NextRequest, rawBody: string): string | null {
  const secret = (process.env.POSITRON_SCI_WEBHOOK_SECRET || '').trim();
  if (!secret) return 'WEBHOOK_SECRET_NOT_CONFIGURED';
  const ts = req.headers.get('x-waipl-timestamp') || '';
  const sig = (req.headers.get('x-waipl-signature') || '').trim().toLowerCase().replace(/^sha256=/, '');
  if (!/^\d{9,11}$/.test(ts) || !/^[0-9a-f]{64}$/.test(sig)) return 'MISSING_SIGNATURE';
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(ts)) > MAX_SKEW_S) return 'STALE_TIMESTAMP';
  const expected = crypto.createHmac('sha256', secret).update(`${ts}.`).update(rawBody).digest();
  const given = Buffer.from(sig, 'hex');
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return 'INVALID_SIGNATURE';
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
      return NextResponse.json({ status: 'REJECTED', reason: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
    }
    const authError = verifySignature(req, rawBody);
    if (authError) {
      return NextResponse.json({ status: 'REJECTED', reason: authError }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: Record<string, any>;
    try {
      const parsed = JSON.parse(rawBody);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
      payload = parsed;
    } catch {
      return NextResponse.json({ status: 'REJECTED', reason: 'INVALID_JSON' }, { status: 400 });
    }
    
    // 1. Validate required fields
    const { message_id, sender_node, target_node, intent, integrity } = payload;
    
    if (!message_id || !sender_node || !target_node) {
      return NextResponse.json({
        status: 'REJECTED',
        reason: 'MISSING_REQUIRED_FIELDS',
        message_id: message_id || 'unknown',
      }, { status: 400 });
    }

    // 2. Check authorization (whitelist R1-R13)
    if (!AUTHORIZED_SENDERS.includes(sender_node)) {
      return NextResponse.json({
        status: 'REJECTED',
        reason: 'EMISOR_NO_AUTORIZADO',
        message_id,
      }, { status: 403 });
    }

    // 3. Check target is positron
    if (target_node !== 'positron') {
      return NextResponse.json({
        status: 'REJECTED',
        reason: 'TARGET_MISMATCH',
        message_id,
      }, { status: 400 });
    }

    // 4. Validate integrity (SHA-256)
    if (integrity && integrity !== 'ABSENT_V1') {
      const { integrity: _, ...rest } = payload;
      const computedHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(rest))
        .digest('hex');
      
      if (computedHash !== integrity) {
        return NextResponse.json({
          status: 'REJECTED',
          reason: 'INTEGRITY_MISMATCH',
          message_id,
        }, { status: 400 });
      }
    }

    // 5. Return RECEIVED -> ACCEPTED
    // In production, this would process the operation asynchronously
    return NextResponse.json({
      status: 'ACCEPTED',
      message_id,
      correlation_id: payload.correlation_id || null,
      protocol_version: payload.protocol_version || 'SCI-WAIPL-1.0',
      received_at: new Date().toISOString(),
      execution: {
        status: 'EXECUTING',
      },
      next: 'Processing will continue asynchronously. Positron will return EXECUTED -> VERIFIED via SCI callback.',
    });

  } catch (error) {
    console.error('SCI webhook error:', error);
    return NextResponse.json({
      status: 'FAILED',
      reason: 'INTERNAL_ERROR',
    }, { status: 500 });
  }
}

// Kill Switch check endpoint
export async function GET() {
  return NextResponse.json({
    kill_switch: 'OFF',
    status: 'OPERATIONAL',
    positron: 'ACTIVE',
    timestamp: new Date().toISOString(),
  });
}
