'use client';

import { useEffect, useState } from 'react';
import { VAULT_FOLDERS, getVaultFiles } from '@/lib/vault';

export default function FileExplorer() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string } | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);

  const openFile = async (folder: string, file: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vault/file?folder=${encodeURIComponent(folder)}&file=${encodeURIComponent(file)}`);
      const data = await res.json();
      setSelectedFile({ name: file, content: data.content || '' });
      setFileContent(data.content || '[Archivo no disponible]');
    } catch {
      setFileContent('[Error al cargar archivo]');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, minHeight: 'calc(100vh - 140px)' }}>
      {/* Folder tree */}
      <div className="glass" style={{ width: 260, padding: 16, overflowY: 'auto' }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>Vault (12 compartimientos)</h3>
        {VAULT_FOLDERS.map(folder => (
          <button
            key={folder.id}
            onClick={() => { setSelectedFolder(folder.id); setSelectedFile(null); }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              background: selectedFolder === folder.id ? 'rgba(123,108,255,0.12)' : 'transparent',
              border: 'none',
              borderRadius: 6,
              color: selectedFolder === folder.id ? 'var(--accent-purple)' : 'var(--text-secondary)',
              fontSize: 12,
              marginBottom: 4,
            }}
          >
            <span style={{ color: folder.status === 'ok' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
              {folder.status === 'ok' ? '●' : '●'}
            </span>
            {' '}{folder.id}
            <span style={{ float: 'right', color: 'var(--text-secondary)' }}>{folder.fileCount}</span>
          </button>
        ))}
      </div>

      {/* File list */}
      <div className="glass" style={{ width: 280, padding: 16, overflowY: 'auto' }}>
        {selectedFolder ? (
          <>
            <h3 style={{ fontSize: 14, color: 'var(--accent-purple)', marginBottom: 16 }}>{selectedFolder}</h3>
            {getVaultFiles(selectedFolder).map(file => (
              <button
                key={file.name}
                onClick={() => openFile(selectedFolder, file.name)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: selectedFile?.name === file.name ? 'rgba(123,108,255,0.12)' : 'transparent',
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
          </>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
            Selecciona un compartimiento
          </p>
        )}
      </div>

      {/* File content */}
      <div className="glass" style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {selectedFile ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, color: 'var(--accent-purple)' }}>{selectedFile.name}</h3>
              <button onClick={() => setSelectedFile(null)} className="btn-secondary" style={{ fontSize: 12, padding: '4px 12px' }}>
                Cerrar
              </button>
            </div>
            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {fileContent}
              </pre>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 60 }}>
            <p style={{ fontSize: 14 }}>Explorador de Archivos del Vault</p>
            <p style={{ fontSize: 12, marginTop: 8 }}>51 archivos en 12 compartimientos - ICP 98%</p>
          </div>
        )}
      </div>
    </div>
  );
}
