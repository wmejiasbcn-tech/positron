import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, readJson, str, badRequest } from '@/lib/auth';

// ElevenLabs TTS endpoint - converts text to speech audio
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;
  try {
    const body = await readJson(req, 32 * 1024);
    if (!body) return badRequest('Invalid JSON body');
    const text = str(body.text, 5000);
    if (!text) return badRequest('Text required (1-5000 chars)');
    const voiceId = typeof body.voiceId === 'string' && /^[A-Za-z0-9]{1,64}$/.test(body.voiceId) ? body.voiceId : undefined;

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const vId = voiceId || process.env.ELEVENLABS_VOICE_ID || 'l32B8XDoylOsZKiSdfhE';

    if (!apiKey) {
      return NextResponse.json({ error: 'ELEVENLABS_API_KEY not configured' }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text.substring(0, 5000),
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.85 },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'ElevenLabs API error' }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
