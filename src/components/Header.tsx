'use client';

import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  timestamp: string;
}

export default function Header({ title }: { title: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/notifications').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    }).catch(() => {});
  }, []);

  const markAsRead = async (id: string) => {
    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <header className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', marginBottom: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent-purple)' }}>{title}</h2>
      
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="btn-secondary"
          style={{ position: 'relative', padding: '8px 12px' }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: 'var(--accent-red)',
              color: 'white',
              fontSize: 10,
              borderRadius: '50%',
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {unreadCount}
            </span>
          )}
        </button>
        
        {showDropdown && (
          <div className="glass fade-in" style={{ position: 'absolute', right: 0, top: 44, width: 320, maxHeight: 400, overflowY: 'auto', zIndex: 100 }}>
            {notifications.length === 0 ? (
              <p style={{ padding: 16, color: 'var(--text-secondary)', fontSize: 13 }}>Sin notificaciones</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markAsRead(n.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-glass)',
                    cursor: n.read ? 'default' : 'pointer',
                    background: n.read ? 'transparent' : 'rgba(123, 108, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-purple)' }}>{n.title}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                      {new Date(n.timestamp).toLocaleString('es-ES')}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{n.content}</p>
                  {!n.read && <span style={{ fontSize: 10, color: 'var(--accent-amber)' }}>Sin leer</span>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
