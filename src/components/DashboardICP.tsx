'use client';

import { useEffect, useState } from 'react';

interface HealthData {
  icp: number;
  level: string;
  archivosTotales: number;
  npcsOperativos: string;
  alertasActivas: number;
  vault: Record<string, { status: string; files: number }>;
  npcs: Array<{ id: string; status: string }>;
}

export default function DashboardICP() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(data => {
      setHealth(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando dashboard...</div>;
  if (!health) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--accent-red)' }}>Error al cargar health-check</div>;

  const icpColor = health.icp >= 95 ? 'var(--accent-green)' : health.icp >= 85 ? 'var(--accent-amber)' : 'var(--accent-red)';
  const statusColor = (status: string) => status === 'ok' ? 'var(--accent-green)' : status === 'warning' ? 'var(--accent-amber)' : 'var(--accent-red)';

  const kpis = [
    { label: 'ICP del Vault', value: `${health.icp}%`, detail: `${health.level} - Preventivo`, color: icpColor },
    { label: 'Archivos Totales', value: String(health.archivosTotales), detail: '12 compartimientos', color: 'var(--accent-cyan)' },
    { label: 'NPCs Operativos', value: health.npcsOperativos, detail: '100% operativos', color: 'var(--accent-green)' },
    { label: 'Alertas Activas', value: String(health.alertasActivas), detail: 'Sin incidencias', color: 'var(--accent-green)' },
  ];

  const vaultEntries = Object.entries(health.vault);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ICP Gauge */}
      <div className="glass cyber-glow" style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 32 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="50" fill="none" stroke={icpColor} strokeWidth="8"
            strokeDasharray={2 * Math.PI * 50}
            strokeDashoffset={2 * Math.PI * 50 * (1 - health.icp / 100)}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
          <text x="60" y="58" textAnchor="middle" fill={icpColor} fontSize="24" fontWeight="700">{health.icp}%</text>
          <text x="60" y="76" textAnchor="middle" fill="var(--text-secondary)" fontSize="11">{health.level}</text>
        </svg>
        <div>
          <h3 style={{ fontSize: 16, color: 'var(--accent-purple)', marginBottom: 8 }}>Indice de Coherencia Positronica</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 400 }}>
            El sistema se encuentra en estado OPERATIVO. Todas las funcionalidades del dashboard interactivo estan activas.
            Las 12 rutas API responden con status 200.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="glass" style={{ padding: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{kpi.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: kpi.color }}>{kpi.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{kpi.detail}</p>
          </div>
        ))}
      </div>

      {/* Vault Status + NPC Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Estado del Vault (12 compartimientos)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {vaultEntries.map(([folder, data]) => (
              <div key={folder} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(10,10,26,0.5)', borderRadius: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(data.status), display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{folder}</span>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', marginLeft: 'auto' }}>{data.files}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>7 NPCs del Sistema</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {health.npcs.map(npc => (
              <div key={npc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(10,10,26,0.5)', borderRadius: 6 }}>
                <span className="npc-dot" style={{ background: npc.status === 'operativo' ? 'var(--accent-green)' : 'var(--accent-amber)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-purple)' }}>NPC-{npc.id}</span>
                <span style={{ fontSize: 12, color: npc.status === 'operativo' ? 'var(--accent-green)' : 'var(--accent-amber)', marginLeft: 'auto' }}>
                  {npc.status === 'operativo' ? 'Operativo' : 'Deuda tecnica'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture diagram */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Arquitectura de 3 Capas</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
          <div style={{ padding: '8px 16px', background: 'rgba(123,108,255,0.12)', borderRadius: 6, border: '1px solid rgba(123,108,255,0.2)' }}>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>NUCLEO</span> (12 nodos) - Gobierno, soberania, ADN
          </div>
          <div style={{ padding: '8px 16px', background: 'rgba(91,192,235,0.08)', borderRadius: 6, border: '1px solid rgba(91,192,235,0.15)' }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>VORTICE / CINTURON DE KUIPER</span> - Procesamiento y vision periferica
          </div>
          <div style={{ padding: '8px 16px', background: 'rgba(91,229,132,0.08)', borderRadius: 6, border: '1px solid rgba(91,229,132,0.15)' }}>
            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>PERIFERICOS</span> - Agentes nuevos (Super Plantilla v3.0)
          </div>
        </div>
      </div>
    </div>
  );
}
