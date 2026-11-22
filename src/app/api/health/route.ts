import { NextResponse } from 'next/server';
import { VAULT_FOLDERS } from '@/lib/vault';

export const dynamic = 'force-dynamic';

// Public health endpoint. It must not fabricate telemetry (SCI_INTEGRATION.md §5):
// no health-check script runs in this deployment, the vault is still simulated and
// the NPCs are not measured, so those values are reported as not verified (null).
// Live database reachability is only exposed by the authenticated
// /api/diagnostics/database route.
const VERIFIED_FACTS = {
  compartimentos: 2, // PERSONAL + ECOSISTEMA (src/app/api/personal/unlock, src/lib/auth.ts)
  modelosDB: 7, // prisma/schema.prisma
  rutasAPI: 14, // src/app/api/**/route.ts
};

export async function GET() {
  const health = {
    estado: 'NO_ACTIVO',
    motivo: 'Migración pendiente: vault simulado, cerebro sin proveedor configurado y SCI sin emisor.',
    icp: null,
    icp_estado: 'NO_VERIFICADO',
    level: 'NO_DETERMINADO',
    archivosTotales: null,
    vault_estado: 'SIMULADO',
    npcsOperativos: 'NO_VERIFICADO',
    alertasActivas: null,
    baseDatos: 'NO_VERIFICADO_EN_ESTA_RUTA',
    ...VERIFIED_FACTS,
    timestamp: new Date().toISOString(),
    vault: Object.fromEntries(VAULT_FOLDERS.map((f) => [f.id, { status: 'simulado', files: null }])),
    npcs: [
      { id: 'CAP', status: 'no_verificado' },
      { id: 'CLA', status: 'no_verificado' },
      { id: 'ANA', status: 'no_verificado' },
      { id: 'EJE', status: 'deuda' },
      { id: 'AUD', status: 'no_verificado' },
      { id: 'CON', status: 'no_verificado' },
      { id: 'MEJ', status: 'no_verificado' },
    ],
  };

  return NextResponse.json(health);
}
