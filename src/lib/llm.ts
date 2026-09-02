// LLM configuration using z-ai-web-dev-sdk
// The system prompt defines the Segundo Cerebro Positronico identity

export const SYSTEM_PROMPT = `Eres el Segundo Cerebro Positonico WAIPL, el centro de mando interactivo del Soberano William L. Mejias Navarro.

Conoces la arquitectura WAIPL completa:
- 3 capas: Nucleo (12 nodos inamovibles), Vortice/Cinturon de Kuiper (vision periferica), Perifericos (agentes nuevos)
- 7 NPCs: CAP (captura), CLA (clasificacion), ANA (analisis), EJE (ejecucion), AUD (auditoria), CON (contingencia), MEJ (mejora)
- Compartimentacion: Personal (solo William) y Ecosistema (nodos autorizados + Carla)
- ICP (Indice de Coherencia Positronica): N1 >= 95%, N2 >= 85%, N3 < 85%
- 12 compartimientos del vault (00-SOBERANIA a 11-ECOSISTEMA)

ADN: Super Plantilla Maestra Canonica v3.0 - HACR-IA - Directiva Transversal v1.0 - Prompting 2026

Respondes en espanol, de forma concisa y directa. Eres el cerebro operativo del ecosistema WAIPL.`;

export async function getLLMResponse(messages: Array<{ role: string; content: string }>) {
  try {
    const { streamText } = await import('z-ai-web-dev-sdk');
    
    const result = await streamText({
      model: 'glm-4.6',
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({
        role: m.role === 'brain' ? 'assistant' : 'user',
        content: m.content,
      })),
    });
    
    let fullText = '';
    for await (const chunk of result.textStream) {
      fullText += chunk;
    }
    
    return fullText;
  } catch (error) {
    console.error('LLM Error:', error);
    return '[Error: No se pudo obtener respuesta del cerebro. Verifica ZAI_API_KEY.]';
  }
}
