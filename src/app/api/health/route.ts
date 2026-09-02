import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const health = {
    icp: 98,
    level: 'N1',
    archivosTotales: 51,
    npcsOperativos: '7/7',
    alertasActivas: 0,
    compartimentos: 2,
    tablasDB: 5,
    modulosUI: 7,
    rutasAPI: 12,
    timestamp: new Date().toISOString(),
    vault: {
      '00-SOBERANIA': { status: 'ok', files: 5 },
      '01-INBOX': { status: 'warning', files: 2 },
      '02-DIARIO': { status: 'ok', files: 2 },
      '03-PERSONAL': { status: 'ok', files: 2 },
      '04-PROFESIONAL': { status: 'ok', files: 2 },
      '05-PROYECTOS': { status: 'ok', files: 2 },
      '06-CONOCIMIENTO': { status: 'ok', files: 3 },
      '07-TEMPLATES': { status: 'ok', files: 2 },
      '08-AUDITORIA': { status: 'ok', files: 8 },
      '09-MANUALES': { status: 'ok', files: 15 },
      '10-AUTOMATIZACIONES': { status: 'ok', files: 3 },
      '11-ECOSISTEMA': { status: 'ok', files: 5 },
    },
    npcs: [
      { id: 'CAP', status: 'operativo' },
      { id: 'CLA', status: 'operativo' },
      { id: 'ANA', status: 'operativo' },
      { id: 'EJE', status: 'deuda' },
      { id: 'AUD', status: 'operativo' },
      { id: 'CON', status: 'operativo' },
      { id: 'MEJ', status: 'operativo' },
    ],
  };
  
  return NextResponse.json(health);
}
