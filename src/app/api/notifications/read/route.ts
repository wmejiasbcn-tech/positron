import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, readJson, str, badRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
  try {
    const body = await readJson(req, 4 * 1024);
    if (!body) return badRequest('Invalid JSON body');
    const id = str(body.id, 64);
    if (!id) return badRequest('ID required');

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
