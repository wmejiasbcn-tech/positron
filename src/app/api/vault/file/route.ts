import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const folder = req.nextUrl.searchParams.get('folder');
  const file = req.nextUrl.searchParams.get('file');
  
  if (!folder || !file) {
    return NextResponse.json({ error: 'Folder and file required' }, { status: 400 });
  }

  // In serverless deployment, vault files are mocked
  const mockContent = `# ${file}

Archivo del compartimiento ${folder}.

> Nota: En el despliegue serverless, el contenido del vault se sirve desde la base de datos o Vercel Blob. El vault fisico de 51 archivos (ICP 98%) reside en el entorno original del Segundo Cerebro.

**Para migrar:** Configurar Vercel Blob Storage y migrar los 51 archivos del vault original.`;
  
  return NextResponse.json({ name: file, folder, content: mockContent });
}
