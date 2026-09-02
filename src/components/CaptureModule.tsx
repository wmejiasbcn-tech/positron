'use client';

import { useEffect, useState } from 'react';

interface Capture {
  id: string;
  uuid: string;
  hash: string;
  origen: string;
  tipo: string;
  prioridad: string;
  tags: string | null;
  contenido: string;
  estadoCLA: string;
  estadoANA: string;
  timestamp: string;
}

export default function CaptureModule() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [form, setForm] = useState({
    origen: 'manual',
    tipo: 'idea',
    prioridad: 'media',
    tags: '',
    contenido: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadCaptures = () => {
    fetch('/api/captures').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCaptures(data);
    }).catch(() => {});
  };

  useEffect(() => { loadCaptures(); }, []);

  const submit = async () => {
    if (!form.contenido.trim() || submitting) return;
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/captures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags || undefined,
        }),
      });
      if (res.ok) {
        setMessage('Captura creada con UUID + SHA-256');
        setForm({ ...form, contenido: '', tags: '' });
        loadCaptures();
      }
    } catch {
      setMessage('Error al crear captura');
    } finally {
      setSubmitting(false);
    }
  };

  const prioridadColor = (p: string) => p === 'critica' ? 'var(--accent-red)' : p === 'alta' ? 'var(--accent-amber)' : 'var(--accent-green)';

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Capture form */}
      <div className="glass" style={{ width: 400, padding: 24 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Nueva Captura (NPC-CAP)</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Origen</label>
            <select value={form.origen} onChange={e => setForm({ ...form, origen: e.target.value })} style={{ width: '100%' }}>
              <option value="manual">Manual</option>
              <option value="voz">Voz</option>
              <option value="imagen">Imagen</option>
              <option value="web">Web</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Tipo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} style={{ width: '100%' }}>
              <option value="idea">Idea</option>
              <option value="dato">Dato</option>
              <option value="reflexion">Reflexion</option>
              <option value="tarea">Tarea</option>
              <option value="observacion">Observacion</option>
              <option value="pregunta">Pregunta</option>
              <option value="libre">Libre</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Prioridad</label>
            <select value={form.prioridad} onChange={e => setForm({ ...form, prioridad: e.target.value })} style={{ width: '100%' }}>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Critica</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Tags (separados por coma)</label>
            <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="waipl, urgente, ..." style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Contenido</label>
            <textarea value={form.contenido} onChange={e => setForm({ ...form, contenido: e.target.value })} rows={5} style={{ width: '100%', resize: 'vertical' }} placeholder="Escribe la captura..." />
          </div>

          <button onClick={submit} className="btn-primary" disabled={submitting || !form.contenido.trim()} style={{ marginTop: 8 }}>
            {submitting ? 'Capturando...' : 'Crear Captura'}
          </button>

          {message && (
            <p style={{ fontSize: 12, color: message.includes('Error') ? 'var(--accent-red)' : 'var(--accent-green)', marginTop: 8 }}>
              {message}
            </p>
          )}
          
          <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 8 }}>
            Auto-genera: UUID v4 + timestamp ISO 8601 + hash SHA-256
          </p>
        </div>
      </div>

      {/* Capture list */}
      <div className="glass" style={{ flex: 1, padding: 24, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Capturas Recientes</h3>
        {captures.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Sin capturas registradas</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {captures.map(c => (
              <div key={c.id} className="glass" style={{ padding: 16, border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, background: 'rgba(123,108,255,0.15)', padding: '2px 8px', borderRadius: 4, color: 'var(--accent-purple)' }}>{c.origen}</span>
                    <span style={{ fontSize: 11, background: 'rgba(91,192,235,0.12)', padding: '2px 8px', borderRadius: 4, color: 'var(--accent-cyan)' }}>{c.tipo}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, color: prioridadColor(c.prioridad), background: 'rgba(255,255,255,0.05)' }}>{c.prioridad}</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{new Date(c.timestamp).toLocaleString('es-ES')}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.5 }}>{c.contenido}</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 10, color: 'var(--text-secondary)' }}>
                  <span>UUID: {c.uuid.substring(0, 8)}...</span>
                  <span>SHA-256: {c.hash.substring(0, 12)}...</span>
                  <span style={{ color: c.estadoCLA === 'sin_clasificar' ? 'var(--accent-amber)' : 'var(--accent-green)' }}>CLA: {c.estadoCLA}</span>
                  <span style={{ color: c.estadoANA === 'pendiente' ? 'var(--accent-amber)' : 'var(--accent-green)' }}>ANA: {c.estadoANA}</span>
                </div>
                {c.tags && <p style={{ fontSize: 11, color: 'var(--accent-purple)', marginTop: 4 }}>#{c.tags.split(',').map(t => t.trim()).join(' #')}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
