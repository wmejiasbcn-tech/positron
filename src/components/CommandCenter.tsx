'use client';

import { useEffect, useState } from 'react';
import { NPC_COMMANDS } from '@/lib/vault';

interface Command {
  id: string;
  target: string;
  content: string;
  status: string;
  timestamp: string;
}

export default function CommandCenter() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [target, setTarget] = useState('CAP');
  const [freeCommand, setFreeCommand] = useState('');
  const [sending, setSending] = useState(false);

  const loadCommands = () => {
    fetch('/api/commands').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCommands(data);
    }).catch(() => {});
  };

  useEffect(() => { loadCommands(); }, []);

  const sendCommand = async (cmd: string, npc: string) => {
    setSending(true);
    try {
      await fetch('/api/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: npc, content: cmd }),
      });
      loadCommands();
    } catch {} finally { setSending(false); }
  };

  const sendFree = () => {
    if (!freeCommand.trim() || sending) return;
    sendCommand(freeCommand, target);
    setFreeCommand('');
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Command templates */}
      <div className="glass" style={{ width: 400, padding: 24 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Centro de Comandos (NPCs)</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NPC_COMMANDS.map(cmd => (
            <button
              key={cmd.npc}
              onClick={() => sendCommand(cmd.command, cmd.npc)}
              disabled={sending}
              className="glass"
              style={{ padding: '12px 16px', textAlign: 'left', border: '1px solid var(--border-glass)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-purple)' }}>NPC-{cmd.npc}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{cmd.label}</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{cmd.command}</p>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: 13, color: 'var(--accent-purple)', marginBottom: 12 }}>Comando Libre</h4>
          <select value={target} onChange={e => setTarget(e.target.value)} style={{ width: '100%', marginBottom: 8 }}>
            {NPC_COMMANDS.map(c => <option key={c.npc} value={c.npc}>NPC-{c.npc}</option>)}
          </select>
          <input type="text" value={freeCommand} onChange={e => setFreeCommand(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendFree()} placeholder="Comando personalizado..." style={{ width: '100%', marginBottom: 8 }} />
          <button onClick={sendFree} disabled={sending || !freeCommand.trim()} className="btn-primary" style={{ width: '100%' }}>
            Enviar Comando
          </button>
        </div>
      </div>

      {/* Command history */}
      <div className="glass" style={{ flex: 1, padding: 24, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Historial de Comandos</h3>
        {commands.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Sin comandos registrados</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {commands.map(cmd => (
              <div key={cmd.id} className="glass" style={{ padding: 12, border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-purple)' }}>{cmd.target}</span>
                  <span style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 4,
                    color: cmd.status === 'completado' ? 'var(--accent-green)' : 'var(--accent-amber)',
                    background: cmd.status === 'completado' ? 'rgba(91,229,132,0.1)' : 'rgba(255,179,71,0.1)',
                  }}>{cmd.status}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{new Date(cmd.timestamp).toLocaleString('es-ES')}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{cmd.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
