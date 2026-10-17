import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, readJson, str, badRequest } from '@/lib/auth';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
  try {
    const body = await readJson(req, 64 * 1024);
    if (!body) return badRequest('Invalid JSON body');
    const contenido = str(body.contenido, 20000);
    const origen = str(body.origen, 100);
    const tipo = str(body.tipo, 100);
    const prioridad = str(body.prioridad, 50);
    if (!contenido || !origen || !tipo || !prioridad) return badRequest('Missing or invalid fields');
    let tags: string | null = null;
    if (body.tags != null && body.tags !== '') {
      tags = str(body.tags, 500);
      if (!tags) return badRequest('Invalid tags');
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
        tags,
        contenido,
      },
    });

    return NextResponse.json(capture);
  } catch (error) {
    console.error('Capture API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
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
