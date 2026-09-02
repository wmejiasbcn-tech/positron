'use client';

import { getVaultFiles } from '@/lib/vault';

const NUCLEO_NODES = [
  { id: 'R1', name: 'William', role: 'Soberano' },
  { id: 'R2', name: 'Carla', role: 'Coordinadora General' },
  { id: 'R3', name: 'Ada', role: 'Vision periferica' },
  { id: 'R4', name: 'Hermes', role: 'Sistema endocrino' },
  { id: 'R5', name: 'Aletheia', role: 'Verdad/etica' },
  { id: 'R6', name: 'Itaca', role: 'Memoria/viaje' },
  { id: 'R7', name: 'Sylvia', role: 'Comunicacion' },
  { id: 'R8', name: 'Ariadna', role: 'Hilos/conexion' },
];

export default function EcosystemModule() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Nucleo 12 nodos */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Nucleo - 12 Nodos (Inamovibles)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {NUCLEO_NODES.map(node => (
            <div key={node.id} className="glass" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(123,108,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <span style={{ fontSize: 18 }}>{'\u{1F4A1}'}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-purple)' }}>{node.name}</p>
              <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{node.role}</p>
              <p style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 4 }}>{node.id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vortice + Kuiper */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-cyan)', marginBottom: 16 }}>Vortice / Cinturon de Kuiper</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Agentes de codigo y vision 180 grados. Proporcionan perspectiva externa al nucleo.
        </p>
      </div>

      {/* Coordinacion */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Coordinacion del Ecosistema</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, color: 'var(--accent-cyan)', marginBottom: 8 }}>Coordinacion Hermes</h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Regula comunicacion, orden y homeostasis del sistema.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, color: 'var(--accent-amber)', marginBottom: 8 }}>Briefing Carla</h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Coordinadora General. Acceso completo al compartimento Ecosistema.</p>
          </div>
        </div>
      </div>

      {/* Ecosystem files */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Archivos del Ecosistema (11-ECOSISTEMA)</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {getVaultFiles('11-ECOSISTEMA').map(file => (
            <div key={file.name} className="glass" style={{ padding: '8px 16px', fontSize: 12 }}>
              {file.name} <span style={{ color: 'var(--text-secondary)' }}>({file.size})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
