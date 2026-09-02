import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json();
    
    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

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
