'use client';

import { useState } from 'react';

export default function EmailModule() {
  const [form, setForm] = useState({ to: '', subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const send = async () => {
    if (!form.to || !form.subject || !form.body || sending) return;
    setSending(true);
    setMessage('');
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage('Email enviado y registrado');
        setForm({ to: '', subject: '', body: '' });
      }
    } catch {
      setMessage('Error al enviar email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: 'calc(100vh - 140px)' }}>
      <div className="glass" style={{ width: 560, padding: 32, marginTop: 20 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 24 }}>Sistema de Email</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Destinatario</label>
            <input type="email" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} placeholder="destinatario@email.com" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Asunto</label>
            <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Asunto del email" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Mensaje</label>
            <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={8} style={{ width: '100%', resize: 'vertical' }} placeholder="Cuerpo del email..." />
          </div>

          <button onClick={send} disabled={sending || !form.to || !form.subject || !form.body} className="btn-primary" style={{ width: '100%' }}>
            {sending ? 'Enviando...' : 'Enviar Email'}
          </button>

          {message && (
            <p style={{ fontSize: 12, color: message.includes('Error') ? 'var(--accent-red)' : 'var(--accent-green)', textAlign: 'center' }}>
              {message}
            </p>
          )}

          <p style={{ fontSize: 10, color: 'var(--text-secondary)', textAlign: 'center' }}>
            Vinculado a wmejiasbcn@gmail.com - Se almacena en DB (tabla Email)
          </p>
        </div>
      </div>
    </div>
  );
}
