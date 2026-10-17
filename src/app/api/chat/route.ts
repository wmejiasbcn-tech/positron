import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getLLMResponse } from '@/lib/llm';
import { requireAuth, readJson, str, badRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MAX_MESSAGE_CHARS = 4000;
const CONTEXT_MESSAGES = 30;
const HISTORY_DEFAULT = 50;
const HISTORY_MAX = 100;

export async function POST(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
  try {
    const body = await readJson(req, 16 * 1024);
    if (!body) return badRequest('Invalid JSON body');
    const content = str(body.content, MAX_MESSAGE_CHARS);
    if (!content) return badRequest(`Content required (1-${MAX_MESSAGE_CHARS} chars)`);
    const audio = body.audio === true;

    // Store user message
    const userMsg = await prisma.message.create({
      data: { role: 'william', content, audio },
    });

    // Last N messages for context
    const history = await prisma.message.findMany({
      orderBy: { timestamp: 'desc' },
      take: CONTEXT_MESSAGES,
    });
    history.reverse();

    const brainResponse = await getLLMResponse(history);

    const brainMsg = await prisma.message.create({
      data: { role: 'brain', content: brainResponse, audio: false },
    });

    return NextResponse.json({ userMessage: userMsg, brainMessage: brainMsg });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
  try {
    const raw = Number(req.nextUrl.searchParams.get('limit'));
    const take = Number.isInteger(raw) && raw > 0 ? Math.min(raw, HISTORY_MAX) : HISTORY_DEFAULT;
    const messages = await prisma.message.findMany({
      orderBy: { timestamp: 'desc' },
      take,
    });
    messages.reverse();
    return NextResponse.json(messages, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
