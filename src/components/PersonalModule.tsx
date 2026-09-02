'use client';

import { useState } from 'react';
import { getVaultFiles } from '@/lib/vault';

export default function PersonalModule() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string } | null>(null);

  const unlock = () => {
    const correctPin = process.env.NEXT_PUBLIC_PERSONAL_PIN || 'WAIPL2026';
    if (pin === correctPin) {
      setUnlocked(true);
      setError('');
    } else {
      setError('PIN incorrecto');
    }
  };

  const lock = () => {
    setUnlocked(false);
    setPin('');
    setSelectedFile(null);
  };

  if (!unlocked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)' }}>
        <div className="glass glass-amber" style={{ padding: 40, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u{1F512}'}</div>
          <h3 style={{ fontSize: 16, color: 'var(--accent-amber)', marginBottom: 8 }}>Compartimento Personal</h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Solo el Soberano William puede acceder. Introduce tu PIN.
          </p>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && unlock()}
            placeholder="PIN"
            style={{ width: '100%', textAlign: 'center', fontSize: 18, letterSpacing: 4, marginBottom: 16 }}
            autoFocus
          />
          {error && <p style={{ fontSize: 12, color: 'var(--accent-red)', marginBottom: 12 }}>{error}</p>}
          <button onClick={unlock} className="btn-primary" style={{ width: '100%' }}>
            Desbloquear
          </button>
          <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 16 }}>
            El ecosistema NO accede sin autorizacion explicita del Soberano
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass glass-amber" style={{ padding: 24, minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, color: 'var(--accent-amber)' }}>Compartimento Personal - 03-PERSONAL</h3>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Borde dorado - Solo William</p>
        </div>
        <button onClick={lock} className="btn-danger" style={{ fontSize: 12 }}>
          Bloquear
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 240 }}>
          {getVaultFiles('03-PERSONAL').map(file => (
            <button
              key={file.name}
              onClick={() => setSelectedFile({ name: file.name, content: '' })}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                background: selectedFile?.name === file.name ? 'rgba(255,179,71,0.12)' : 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--text-primary)',
                fontSize: 12,
                marginBottom: 4,
              }}
            >
              {file.name}
              <span style={{ float: 'right', color: 'var(--text-secondary)' }}>{file.size}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: 16, background: 'rgba(10,10,26,0.5)', borderRadius: 8 }}>
          {selectedFile ? (
            <>
              <h4 style={{ fontSize: 14, color: 'var(--accent-amber)', marginBottom: 12 }}>{selectedFile.name}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Contenido del archivo personal. En el despliegue serverless, el contenido se sirve desde la base de datos o Vercel Blob.
              </p>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
              Selecciona un archivo del compartimento personal
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
