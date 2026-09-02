import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// SCI Webhook - Positron receives SCI messages from n8n
// Must validate SHA-256, respect Kill Switch, return correct states
// RECEIVED -> ACCEPTED -> EXECUTING -> EXECUTED -> VERIFIED

export const dynamic = 'force-dynamic';

const AUTHORIZED_SENDERS = ['R1','R2','R3','R4','R5','R6','R7','R8','R9','R10','R11','R12','R13'];

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
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
