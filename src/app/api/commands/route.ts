import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { target, content } = await req.json();
    
    if (!target || !content) {
      return NextResponse.json({ error: 'Target and content required' }, { status: 400 });
    }

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

export async function GET() {
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
