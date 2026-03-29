import { useState, useEffect, useRef } from 'react';

const interests = [
  { id: 'kultur', label: '🏛️ Kultur' },
  { id: 'natur', label: '🌿 Natur' },
  { id: 'strand', label: '🏖️ Strand' },
  { id: 'essen', label: '🍝 Essen' },
  { id: 'shopping', label: '🛍️ Shopping' },
  { id: 'abenteuer', label: '🧗 Abenteuer' },
  { id: 'entspannung', label: '🧘 Spa' },
  { id: 'nachtleben', label: '🎉 Nightlife' },
];

const hotelOptions = [
  { id: 'budget', label: 'Hostel', sub: 'ab 30€/Nacht', icon: '🏠' },
  { id: 'mittel', label: '3-Sterne', sub: 'ab 70€/Nacht', icon: '🏨' },
  { id: 'komfort', label: '4-Sterne', sub: 'ab 130€/Nacht', icon: '🏩' },
  { id: 'luxus', label: 'Luxus', sub: 'ab 250€/Nacht', icon: '👑' },
];

export default function PlannerForm({ defaultDestination, onGenerate, isLoading, error }) {
  const [form, setForm] = useState({
    destination: defaultDestination || '',
    days: 5,
    persons: 2,
    budget: 1500,
    hotelCategory: 'mittel',
    interests: ['kultur', 'essen'],
    includeTiktok: true,
    includeHiddenGems: true,
    wishes: '',
  });

  useEffect(() => {
    if (defaultDestination) setForm(f => ({ ...f, destination: defaultDestination }));
  }, [defaultDestination]);

  const toggle = (id) => setForm(f => ({
    ...f,
    interests: f.interests.includes(id) ? f.interests.filter(x => x !== id) : [...f.interests, id],
  }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.destination.trim() || isLoading) return;
    onGenerate({ ...form, destination: form.destination.trim() });
  };

  const budgetPerPerson = Math.round(form.budget / form.persons);
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const update = (e) => setForm(f => ({ ...f, budget: parseInt(e.target.value) }));
    slider.addEventListener('input', update);
    slider.addEventListener('change', update);
    return () => {
      slider.removeEventListener('input', update);
      slider.removeEventListener('change', update);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#eef2ff' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px 60px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 10, animation: 'float 3s ease-in-out infinite' }}>🌍</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 6 }}>
            Wohin soll es gehen?
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>
            KI plant deinen Traumurlaub — jeden Ort der Welt
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Destination — big & prominent */}
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '6px 8px 6px 20px',
            boxShadow: '0 2px 20px rgba(37,99,235,0.1)',
            display: 'flex', alignItems: 'center', gap: 12,
            border: '2px solid transparent',
            transition: 'border-color 0.2s',
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <span style={{ fontSize: 20 }}>✈️</span>
            <input
              type="text"
              value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
              placeholder="Stadt, Land oder Region eingeben…"
              required
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 17, fontWeight: 600, color: '#0f172a',
                background: 'transparent', padding: '14px 0',
              }}
            />
            <button type="submit" disabled={isLoading || !form.destination.trim()} style={{
              background: isLoading ? '#93c5fd' : 'linear-gradient(135deg,#2563eb,#0ea5e9)',
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '12px 22px', fontWeight: 800, fontSize: 15,
              cursor: isLoading ? 'wait' : 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              boxShadow: isLoading ? 'none' : '0 4px 14px rgba(37,99,235,0.35)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              {isLoading
                ? <><span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span> Planen…</>
                : <>Plan erstellen ✨</>}
            </button>
          </div>

          {isLoading && (
            <div style={{
              background: 'linear-gradient(135deg,#eff6ff,#e0f2fe)',
              borderRadius: 14, padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 22, animation: 'spin 2s linear infinite', display: 'inline-block' }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: 14 }}>KI analysiert {form.destination}…</div>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>Echte Hotels, Restaurants & Öffnungszeiten werden gesucht</div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 16px', color: '#991b1b', fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Days & Persons */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 10 }}>TAGE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button type="button" onClick={() => setForm(f => ({ ...f, days: Math.max(2, f.days - 1) }))} style={stepBtn}>−</button>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', minWidth: 28, textAlign: 'center' }}>{form.days}</span>
                  <button type="button" onClick={() => setForm(f => ({ ...f, days: Math.min(21, f.days + 1) }))} style={stepBtn}>+</button>
                </div>
              </div>
              <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 10 }}>PERSONEN</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button type="button" onClick={() => setForm(f => ({ ...f, persons: Math.max(1, f.persons - 1) }))} style={stepBtn}>−</button>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', minWidth: 28, textAlign: 'center' }}>{form.persons}</span>
                  <button type="button" onClick={() => setForm(f => ({ ...f, persons: Math.min(10, f.persons + 1) }))} style={stepBtn}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>BUDGET GESAMT</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>{form.budget.toLocaleString('de-DE')}€</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>≈ {budgetPerPerson}€/Person</span>
              </div>
            </div>
            <input ref={sliderRef} type="range" min="300" max="10000" step="100"
              value={form.budget}
              onChange={e => setForm(f => ({ ...f, budget: parseInt(e.target.value) }))}
              style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#cbd5e1' }}>300€</span>
              <span style={{ fontSize: 11, color: '#cbd5e1' }}>10.000€</span>
            </div>
          </div>

          {/* Hotel */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 14 }}>UNTERKUNFT</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {hotelOptions.map(opt => {
                const sel = form.hotelCategory === opt.id;
                return (
                  <button key={opt.id} type="button" onClick={() => setForm(f => ({ ...f, hotelCategory: opt.id }))} style={{
                    padding: '10px 6px', borderRadius: 12,
                    border: `2px solid ${sel ? '#2563eb' : '#f1f5f9'}`,
                    background: sel ? '#eff6ff' : '#fafafa',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{opt.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: sel ? '#1d4ed8' : '#374151' }}>{opt.label}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 14 }}>INTERESSEN</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {interests.map(i => {
                const sel = form.interests.includes(i.id);
                return (
                  <button key={i.id} type="button" onClick={() => toggle(i.id)} style={{
                    padding: '7px 14px', borderRadius: 50,
                    border: 'none',
                    background: sel ? '#2563eb' : '#f1f5f9',
                    color: sel ? '#fff' : '#64748b',
                    fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s',
                    boxShadow: sel ? '0 3px 10px rgba(37,99,235,0.25)' : 'none',
                  }}>
                    {i.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Eigene Wünsche */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 10 }}>EIGENE WÜNSCHE <span style={{ fontWeight: 400, color: '#cbd5e1' }}>(optional)</span></div>
            <textarea
              value={form.wishes}
              onChange={e => setForm(f => ({ ...f, wishes: e.target.value }))}
              placeholder="z.B. Ich möchte unbedingt ein Museum besuchen und lokale Märkte erkunden…"
              maxLength={300}
              rows={3}
              style={{
                width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 12,
                padding: '12px 14px', fontSize: 14, color: '#0f172a', resize: 'none',
                outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
                background: '#f8fafc', boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'right', marginTop: 4 }}>{form.wishes.length}/300</div>
          </div>

          {/* Extras */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 14 }}>EXTRAS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { key: 'includeTiktok', emoji: '📱', label: 'TikTok & Instagram Spots', desc: 'Fotogene Orte mit bester Uhrzeit' },
                { key: 'includeHiddenGems', emoji: '💎', label: 'Geheimtipps & Hidden Gems', desc: 'Orte abseits der Touristenpfade' },
              ].map(({ key, emoji, label, desc }) => {
                const active = form[key];
                return (
                  <button key={key} type="button" onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: active ? '#eff6ff' : '#f8fafc',
                    border: `2px solid ${active ? '#2563eb' : '#e2e8f0'}`,
                    borderRadius: 14, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ fontSize: 22 }}>{emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: active ? '#1d4ed8' : '#374151' }}>{label}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{desc}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: active ? '#2563eb' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                      {active && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </form>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}

const stepBtn = {
  width: 32, height: 32, borderRadius: '50%',
  background: '#f1f5f9', border: 'none',
  fontSize: 18, fontWeight: 700, color: '#374151',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.15s',
  lineHeight: 1,
};
