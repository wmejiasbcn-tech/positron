import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getLLMResponse } from '@/lib/llm';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { content, audio } = await req.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    // Store user message
    const userMsg = await prisma.message.create({
      data: { role: 'william', content, audio: audio || false },
    });

    // Get last 100 messages for context
    const history = await prisma.message.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    history.reverse();

    // Get LLM response
    const brainResponse = await getLLMResponse(history);

    // Store brain response
    const brainMsg = await prisma.message.create({
      data: { role: 'brain', content: brainResponse, audio: false },
    });

    return NextResponse.json({
      userMessage: userMsg,
      brainMessage: brainMsg,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    messages.reverse();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
