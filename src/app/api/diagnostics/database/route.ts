import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Authenticated DB diagnostic: reports configuration and reachability without
// exposing connection strings, hosts or data.
export async function GET(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;

  const configured = (process.env.DATABASE_URL || '').trim() !== '';
  const result: Record<string, unknown> = { configured, reachable: false, tables: {} };
  if (!configured) return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });

  try {
    const rows = await prisma.$queryRaw<Array<{ name: string; present: boolean }>>`
      SELECT t.name, to_regclass('public.' || t.name) IS NOT NULL AS present
      FROM (VALUES ('messages'), ('captures'), ('commands'), ('notifications'), ('emails'),
                   ('radar_signals'), ('quarantine_entries'), ('_prisma_migrations')) AS t(name)`;
    result.reachable = true;
    result.tables = Object.fromEntries(rows.map((r) => [r.name, r.present]));
  } catch (error) {
    const e = error as { code?: string; errorCode?: string; name?: string };
    result.error = { name: e?.name || 'Error', code: e?.code || e?.errorCode || null };
  }
  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
