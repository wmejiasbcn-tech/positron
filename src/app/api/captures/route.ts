import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { origen, tipo, prioridad, tags, contenido } = await req.json();
    
    if (!contenido || !origen || !tipo || !prioridad) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const uuid = uuidv4();
    const hash = crypto.createHash('sha256').update(contenido).digest('hex');

    const capture = await prisma.capture.create({
      data: {
        uuid,
        hash,
        origen,
        tipo,
        prioridad,
        tags: tags || null,
        contenido,
      },
    });

    return NextResponse.json(capture);
  } catch (error) {
    console.error('Capture API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const captures = await prisma.capture.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    return NextResponse.json(captures);
  } catch (error) {
    console.error('Captures list error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
