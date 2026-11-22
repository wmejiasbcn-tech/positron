import { NextResponse } from 'next/server';

// SCI status endpoint.
// Reports only what is true today. Positrón has no real Kill Switch store and no
// SCI sender connected, so nothing here may claim OPERATIONAL/ACTIVE/OFF.
// See SCI_INTEGRATION.md §5 (no fabricated telemetry) and §119-129.
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    positron: {
      node_id: 'positron',
      node_number: 33,
      circle: 'estructura',
      verify: 'ejecutar',
      status: 'NO_ACTIVO',
      status_reason: 'Migración pendiente: receptor SCI sin emisor conectado ni procesamiento.',
      kill_switch: 'NO_IMPLEMENTADO',
      kill_switch_reason: 'Positrón no consulta todavía ningún interruptor de emergencia del SCI.',
    },
    sci: {
      protocol_version: 'SCI-WAIPL-1.0',
      connection: 'NO_IMPLEMENTADA',
      authorized_senders: ['R1','R2','R3','R4','R5','R6','R7','R8','R9','R10','R11','R12','R13'],
      webhook: '/api/sci/webhook',
      webhook_behavior: 'Valida firma, emisor, destino e integridad y responde RECEIVED; no ejecuta operaciones.',
      states: ['RECEIVED','ACCEPTED','EXECUTING','EXECUTED','VERIFIED','REJECTED','FAILED'],
    },
    timestamp: new Date().toISOString(),
  });
}
