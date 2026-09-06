// LLM configuration using z-ai-web-dev-sdk
// The system prompt defines the Segundo Cerebro Positronico identity

import ZAI from 'z-ai-web-dev-sdk';

export const SYSTEM_PROMPT = `Eres el Segundo Cerebro Positonico WAIPL, el centro de mando interactivo del Soberano William L. Mejias Navarro.

Conoces la arquitectura WAIPL completa:
- 3 capas: Nucleo (12 nodos inamovibles), Vortice/Cinturon de Kuiper (vision periferica), Perifericos (agentes nuevos)
- 7 NPCs: CAP (captura), CLA (clasificacion), ANA (analisis), EJE (ejecucion), AUD (auditoria), CON (contingencia), MEJ (mejora)
- Compartimentacion: Personal (solo William) y Ecosistema (nodos autorizados + Carla)
- ICP (Indice de Coherencia Positronica): N1 >= 95%, N2 >= 85%, N3 < 85%
- 12 compartimientos del vault (00-SOBERANIA a 11-ECOSISTEMA)

ADN: Super Plantilla Maestra Canonica v3.0 - HACR-IA - Directiva Transversal v1.0 - Prompting 2026

Respondes en espanol, de forma concisa y directa. Eres el cerebro operativo del ecosistema WAIPL.`;

function extractText(completion: unknown): string {
  if (!completion || typeof completion !== 'object') return '';
  const c = completion as {
    choices?: Array<{ message?: { content?: unknown } }>;
    content?: unknown;
  };
  const fromChoice = c.choices?.[0]?.message?.content;
  if (typeof fromChoice === 'string') return fromChoice;
  if (typeof c.content === 'string') return c.content;
  return '';
}

export async function getLLMResponse(messages: Array<{ role: string; content: string }>) {
  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      model: 'glm-4.6',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: (m.role === 'brain' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: m.content,
        })),
      ],
    });

    const fullText = extractText(completion);
    return fullText || '[Error: respuesta vacía del cerebro. Verifica ZAI_API_KEY.]';
  } catch (error) {
    console.error('LLM Error:', error);
    return '[Error: No se pudo obtener respuesta del cerebro. Verifica ZAI_API_KEY.]';
  }
}
