// Vault structure - 12 compartments
export const VAULT_FOLDERS = [
  { id: '00-SOBERANIA', name: 'Soberania', status: 'ok', fileCount: 5 },
  { id: '01-INBOX', name: 'Inbox', status: 'warning', fileCount: 2 },
  { id: '02-DIARIO', name: 'Diario', status: 'ok', fileCount: 2 },
  { id: '03-PERSONAL', name: 'Personal', status: 'ok', fileCount: 2 },
  { id: '04-PROFESIONAL', name: 'Profesional', status: 'ok', fileCount: 2 },
  { id: '05-PROYECTOS', name: 'Proyectos', status: 'ok', fileCount: 2 },
  { id: '06-CONOCIMIENTO', name: 'Conocimiento', status: 'ok', fileCount: 3 },
  { id: '07-TEMPLATES', name: 'Templates', status: 'ok', fileCount: 2 },
  { id: '08-AUDITORIA', name: 'Auditoria', status: 'ok', fileCount: 8 },
  { id: '09-MANUALES', name: 'Manuales', status: 'ok', fileCount: 15 },
  { id: '10-AUTOMATIZACIONES', name: 'Automatizaciones', status: 'ok', fileCount: 3 },
  { id: '11-ECOSISTEMA', name: 'Ecosistema', status: 'ok', fileCount: 5 },
];

export const NPC_STATUS = [
  { id: 'CAP', name: 'Captura', status: 'operativo', color: 'green' },
  { id: 'CLA', name: 'Clasificacion', status: 'operativo', color: 'green' },
  { id: 'ANA', name: 'Analisis', status: 'operativo', color: 'green' },
  { id: 'EJE', name: 'Ejecucion', status: 'deuda', color: 'amber' },
  { id: 'AUD', name: 'Auditoria', status: 'operativo', color: 'green' },
  { id: 'CON', name: 'Contingencia', status: 'operativo', color: 'green' },
  { id: 'MEJ', name: 'Mejora', status: 'operativo', color: 'green' },
];

export const NPC_COMMANDS = [
  { npc: 'CAP', label: 'Capturar idea', command: 'CAP: Iniciar captura de nueva idea' },
  { npc: 'CLA', label: 'Clasificar inbox', command: 'CLA: Clasificar todos los items del inbox pendiente' },
  { npc: 'ANA', label: 'Analizar capturas', command: 'ANA: Analizar las capturas sin procesar' },
  { npc: 'EJE', label: 'Ejecutar tarea', command: 'EJE: Iniciar ejecucion de tareas pendientes' },
  { npc: 'AUD', label: 'Auditoria completa', command: 'AUD: Ejecutar auditoria completa del sistema' },
  { npc: 'CON', label: 'Ver contingencias', command: 'CON: Revisar planes de contingencia activos' },
  { npc: 'MEJ', label: 'Proponer mejora', command: 'MEJ: Proponer mejora basada en metricas actuales' },
];

// Mock vault files for deployment without filesystem
export function getVaultFiles(folder: string): Array<{ name: string; size: string }> {
  const filesMap: Record<string, Array<{ name: string; size: string }>> = {
    '00-SOBERANIA': [
      { name: 'DASHBOARD-ESTADO.md', size: '4.2 KB' },
      { name: 'alertas.md', size: '1.1 KB' },
      { name: 'decisiones-pendientes.md', size: '2.3 KB' },
      { name: 'health-check.json', size: '0.8 KB' },
      { name: 'estado-sistema.md', size: '1.5 KB' },
    ],
    '01-INBOX': [
      { name: 'captura-001.md', size: '1.2 KB' },
      { name: 'TEMPLATE-CAPTURA-v2.md', size: '0.9 KB' },
    ],
    '02-DIARIO': [
      { name: 'brief-2026-08-03.md', size: '2.1 KB' },
      { name: 'check-in-soberano.md', size: '0.5 KB' },
    ],
    '03-PERSONAL': [
      { name: 'pensamientos.md', size: '3.4 KB' },
      { name: 'reflexiones.md', size: '2.8 KB' },
    ],
    '04-PROFESIONAL': [
      { name: 'perfil-soberano.md', size: '1.8 KB' },
      { name: 'networking.md', size: '2.2 KB' },
    ],
    '05-PROYECTOS': [
      { name: 'waipl-tracking.md', size: '3.1 KB' },
      { name: 'metricas-proyectos.md', size: '1.9 KB' },
    ],
    '06-CONOCIMIENTO': [
      { name: 'frameworks.md', size: '4.5 KB' },
      { name: 'patrones.md', size: '3.2 KB' },
      { name: 'crm-contactos.md', size: '2.7 KB' },
    ],
    '07-TEMPLATES': [
      { name: 'template-captura-v2.md', size: '0.9 KB' },
      { name: 'template-auditoria.md', size: '1.3 KB' },
    ],
    '08-AUDITORIA': [
      { name: 'auditoria-2026-08.md', size: '5.2 KB' },
      { name: 'metricas-icp.md', size: '2.1 KB' },
      { name: 'desviaciones.md', size: '1.8 KB' },
      { name: 'plan-contingencia.md', size: '3.5 KB' },
      { name: 'informe-0801.md', size: '4.1 KB' },
      { name: 'informe-0802.md', size: '4.3 KB' },
      { name: 'informe-0803.md', size: '4.0 KB' },
      { name: 'resumen-auditoria.md', size: '2.9 KB' },
    ],
    '09-MANUALES': [
      { name: 'NPC-CAP.md', size: '2.1 KB' },
      { name: 'NPC-CLA.md', size: '2.3 KB' },
      { name: 'NPC-ANA.md', size: '2.5 KB' },
      { name: 'NPC-EJE.md', size: '2.4 KB' },
      { name: 'NPC-AUD.md', size: '2.2 KB' },
      { name: 'NPC-CON.md', size: '2.0 KB' },
      { name: 'NPC-MEJ.md', size: '2.1 KB' },
      { name: 'README-CAP.md', size: '0.8 KB' },
      { name: 'README-CLA.md', size: '0.8 KB' },
      { name: 'README-ANA.md', size: '0.8 KB' },
      { name: 'README-EJE.md', size: '0.8 KB' },
      { name: 'README-AUD.md', size: '0.8 KB' },
      { name: 'README-CON.md', size: '0.8 KB' },
      { name: 'README-MEJ.md', size: '0.8 KB' },
      { name: 'README-GENERAL.md', size: '1.5 KB' },
    ],
    '10-AUTOMATIZACIONES': [
      { name: 'health-check.py', size: '3.2 KB' },
      { name: 'dashboard-auto.sh', size: '0.9 KB' },
      { name: 'automatizaciones.md', size: '1.8 KB' },
    ],
    '11-ECOSISTEMA': [
      { name: 'nucleo-12-nodos.md', size: '4.5 KB' },
      { name: 'vortice-kuiper.md', size: '2.3 KB' },
      { name: 'coordinacion-hermes.md', size: '1.9 KB' },
      { name: 'briefing-carla.md', size: '3.1 KB' },
      { name: 'arquitectura-sistema.md', size: '2.7 KB' },
    ],
  };
  return filesMap[folder] || [];
}
