import { NextResponse } from 'next/server';

// SCI status endpoint - Kill Switch + operational state
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    positron: {
      node_id: 'positron',
      node_number: 35,
      circle: 'estructura',
      verify: 'ejecutar',
      status: 'OPERATIONAL',
      kill_switch: 'OFF',
    },
    sci: {
      protocol_version: 'SCI-WAIPL-1.0',
      authorized_senders: ['R1','R2','R3','R4','R5','R6','R7','R8','R9','R10','R11','R12','R13'],
      webhook: '/api/sci/webhook',
      states: ['RECEIVED','ACCEPTED','EXECUTING','EXECUTED','VERIFIED','REJECTED','FAILED'],
    },
    timestamp: new Date().toISOString(),
  });
}
