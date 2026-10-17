import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, readJson, str, badRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
  try {
    const body = await readJson(req, 16 * 1024);
    if (!body) return badRequest('Invalid JSON body');
    const target = str(body.target, 50);
    const content = str(body.content, 4000);
    if (!target || !content) return badRequest('Target and content required');

    const command = await prisma.command.create({
      data: { target, content, status: 'enviado' },
    });

    // Create notification for the command
    await prisma.notification.create({
      data: {
        type: 'comando',
        title: `Comando a ${target}`,
        content: content.substring(0, 200),
      },
    });

    // Simulate processing -> completed
    await prisma.command.update({
      where: { id: command.id },
      data: { status: 'completado' },
    });

    return NextResponse.json({ ...command, status: 'completado' });
  } catch (error) {
    console.error('Command API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
  try {
    const commands = await prisma.command.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    return NextResponse.json(commands);
  } catch (error) {
    console.error('Commands list error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
