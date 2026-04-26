import { useState, useRef, useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';

const QUICK_QUESTIONS = [
  '💡 Beste Reisezeit?',
  '💰 Wie spare ich Geld?',
  '🚌 Wie komme ich rum?',
  '🍽️ Was muss ich essen?',
  '⚠️ Was beachten?',
];

export default function PlanChatbot({ plan }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hallo! 👋 Ich bin dein Reise-Assistent für **${plan?.destination}**. Stell mir alles was du wissen möchtest!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  const planSummary = `${plan?.destination}, ${plan?.days?.length} Tage, ${plan?.persons} Personen, Budget ${plan?.budget}€. Tage: ${plan?.days?.slice(0,3).map(d => d.title).join(', ')}...`;

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    const assistantIdx = newMessages.length;
    setMessages(m => [...m, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planSummary,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const ev = JSON.parse(line.slice(6));
            if (ev.type === 'chunk') {
              fullText += ev.text;
              setMessages(m => m.map((msg, i) => i === assistantIdx ? { ...msg, content: fullText } : msg));
            }
          } catch {}
        }
      }
    } catch {
      setMessages(m => m.map((msg, i) => i === assistantIdx ? { ...msg, content: '❌ Fehler beim Laden. Bitte nochmal versuchen.' } : msg));
    } finally {
      setLoading(false);
    }
  };

  const chatWidth = isMobile ? 'calc(100vw - 24px)' : 360;
  const chatHeight = isMobile ? '70vh' : 480;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? '#1e3a8a' : 'linear-gradient(135deg,#2563eb,#0ea5e9)',
          border: 'none', cursor: 'pointer', fontSize: 24,
          boxShadow: '0 4px 20px rgba(37,99,235,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s ease',
          transform: open ? 'rotate(180deg)' : 'none',
        }}
        title="KI-Assistent"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 16, zIndex: 8999,
          width: chatWidth, height: chatHeight,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
          border: '1px solid #e2e8f0',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatIn 0.25s ease',
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>Reise-Assistent</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>{plan?.destination} · KI-powered</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg,#2563eb,#0ea5e9)' : '#f8fafc',
                  color: msg.role === 'user' ? '#fff' : '#0f172a',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  fontSize: 13, lineHeight: 1.55,
                  border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                }}>
                  {msg.content || (loading && i === messages.length - 1 ? (
                    <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0,1,2].map(j => <span key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: `dotPulse 1.2s ${j*0.2}s infinite` }} />)}
                    </span>
                  ) : '')}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => send(q.replace(/^[^\s]+\s/, ''))} style={{
                  background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 50,
                  padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#1d4ed8',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Frag mich was du willst…"
              disabled={loading}
              style={{
                flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 50,
                padding: '9px 14px', fontSize: 13, outline: 'none',
                background: loading ? '#f8fafc' : '#fff', color: '#0f172a',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{
              width: 38, height: 38, borderRadius: '50%', border: 'none',
              background: input.trim() && !loading ? 'linear-gradient(135deg,#2563eb,#0ea5e9)' : '#e2e8f0',
              color: '#fff', fontSize: 16, cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s', flexShrink: 0,
            }}>↑</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
        @keyframes dotPulse {
          0%,80%,100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
