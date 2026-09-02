import { NextResponse } from 'next/server';
import { getVaultFiles, VAULT_FOLDERS } from '@/lib/vault';

export const dynamic = 'force-dynamic';

export async function GET() {
  const folders = VAULT_FOLDERS.map(f => ({
    ...f,
    files: getVaultFiles(f.id),
  }));
  return NextResponse.json(folders);
}
