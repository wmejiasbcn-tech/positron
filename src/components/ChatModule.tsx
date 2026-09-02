'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: string;
  content: string;
  timestamp: string;
  audio: boolean;
}

export default function ChatModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/chat').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setMessages(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    
    const userMsg: Message = {
      id: 'temp-' + Date.now(),
      role: 'william',
      content: input,
      timestamp: new Date().toISOString(),
      audio: listening,
    };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentInput, audio: listening }),
      });
      const data = await res.json();
      
      if (data.brainMessage) {
        setMessages(prev => [...prev, data.brainMessage]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: 'brain',
        content: '[Error de conexion]',
        timestamp: new Date().toISOString(),
        audio: false,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startSTT = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition no disponible en este navegador');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;
    
    setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <div ref={scrollRef} className="glass" style={{ flex: 1, overflowY: 'auto', padding: 20, marginBottom: 16 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 60 }}>
            <p style={{ fontSize: 14 }}>Inicia una conversacion con el Segundo Cerebro Positronico</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.role === 'william' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: msg.role === 'william' 
                    ? 'rgba(123, 108, 255, 0.15)' 
                    : 'rgba(18, 18, 42, 0.8)',
                  border: msg.role === 'william'
                    ? '1px solid rgba(123, 108, 255, 0.2)'
                    : '1px solid var(--border-glass)',
                }}>
                  <p style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                      {new Date(msg.timestamp).toLocaleTimeString('es-ES')}
                    </span>
                    {msg.audio && <span style={{ fontSize: 10, color: 'var(--accent-amber)' }}>voz</span>}
                    {msg.role === 'brain' && (
                      <button
                        onClick={() => speakResponse(msg.content)}
                        style={{ background: 'none', border: 'none', fontSize: 12, padding: 0, color: 'var(--accent-purple)', cursor: 'pointer' }}
                        title="Escuchar respuesta"
                      >
                        {speaking ? '🔇' : '🔊'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontSize: 13, padding: '8px 16px' }}>
                <span className="pulse-glow">El cerebro esta pensando...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={startSTT}
          className="btn-secondary"
          style={{ padding: '10px 12px', flexShrink: 0 }}
          title="Dictar por voz"
        >
          {listening ? '🎤' : '🎤'}
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={listening ? 'Escuchando...' : 'Escribe o dicta un mensaje...'}
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="btn-primary"
          disabled={loading || !input.trim()}
          style={{ padding: '10px 20px', flexShrink: 0 }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
