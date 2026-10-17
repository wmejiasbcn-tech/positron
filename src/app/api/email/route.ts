import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, readJson, str, badRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
  try {
    const json = await readJson(req, 64 * 1024);
    if (!json) return badRequest('Invalid JSON body');
    const to = str(json.to, 320);
    const subject = str(json.subject, 300);
    const body = str(json.body, 20000);
    if (!to || !subject || !body) return badRequest('Missing or invalid fields');

    const email = await prisma.email.create({
      data: { to, subject, body, status: 'pendiente' },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'email',
        title: `Email a ${to}`,
        content: subject,
      },
    });

    return NextResponse.json(email);
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
