'use client';

import { useState } from 'react';

export type ModuleId = 'dashboard' | 'chat' | 'archivos' | 'capturas' | 'comandos' | 'personal' | 'ecosistema' | 'email';

const MODULES: Array<{ id: ModuleId; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Dashboard ICP', icon: '📊' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'archivos', label: 'Archivos', icon: '📁' },
  { id: 'capturas', label: 'Capturas', icon: '📝' },
  { id: 'comandos', label: 'Comandos', icon: '🎯' },
  { id: 'personal', label: 'Personal', icon: '🔒' },
  { id: 'ecosistema', label: 'Ecosistema', icon: '🌐' },
  { id: 'email', label: 'Email', icon: '📧' },
];

export default function Sidebar({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  return (
    <aside className="glass cyber-glow" style={{ width: 240, minHeight: '100vh', padding: '16px 0', position: 'sticky', top: 0 }}>
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border-glass)' }}>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: 1 }}>
          POSITRON
        </h1>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
          Segundo Cerebro WAIPL
        </p>
      </div>
      <nav style={{ marginTop: 16 }}>
        {MODULES.map(m => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 20px',
              background: active === m.id ? 'rgba(123, 108, 255, 0.12)' : 'transparent',
              border: 'none',
              borderLeft: active === m.id ? '3px solid var(--accent-purple)' : '3px solid transparent',
              color: active === m.id ? 'var(--accent-purple)' : 'var(--text-secondary)',
              textAlign: 'left',
              fontSize: 14,
            }}
          >
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, fontSize: 10, color: 'var(--text-secondary)' }}>
        <p>Soberano: William Mejias</p>
        <p style={{ marginTop: 4 }}>ADN: SPM v3.0 - HACR-IA</p>
        <p style={{ marginTop: 4, color: 'var(--accent-amber)' }}>Nodo #35 de 46</p>
      </div>
    </aside>
  );
}
