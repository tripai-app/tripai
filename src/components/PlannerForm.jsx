import { useState } from 'react';
import AdBanner from './AdBanner';

const interests = [
  { id: 'kultur', label: '🏛️ Kultur & Geschichte' },
  { id: 'natur', label: '🌿 Natur & Wandern' },
  { id: 'strand', label: '🏖️ Strand & Meer' },
  { id: 'essen', label: '🍝 Essen & Trinken' },
  { id: 'shopping', label: '🛍️ Shopping' },
  { id: 'abenteuer', label: '🧗 Abenteuer & Sport' },
  { id: 'entspannung', label: '🧘 Entspannung & Spa' },
  { id: 'nachtleben', label: '🎉 Nachtleben' },
];

const hotelOptions = [
  { id: 'budget', label: '🏠 Hostel / Budget', desc: 'ab 30€/Nacht' },
  { id: 'mittel', label: '🏨 3-Sterne Hotel', desc: 'ab 70€/Nacht' },
  { id: 'komfort', label: '🏩 4-Sterne Hotel', desc: 'ab 130€/Nacht' },
  { id: 'luxus', label: '👑 5-Sterne Luxus', desc: 'ab 250€/Nacht' },
];

export default function PlannerForm({ defaultDestination, onGenerate, isLoading, error }) {
  const [form, setForm] = useState({
    destination: defaultDestination || '',
    days: '5',
    persons: '2',
    budget: '1500',
    hotelCategory: 'mittel',
    interests: ['kultur', 'essen'],
  });
  const [loading, setLoading] = useState(false);
  const actualLoading = isLoading || loading;

  const toggleInterest = (id) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter(i => i !== id)
        : [...f.interests, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.destination.trim()) return;
    onGenerate({
      destination: form.destination.trim(),
      days: parseInt(form.days),
      persons: parseInt(form.persons),
      budget: parseInt(form.budget),
      hotelCategory: form.hotelCategory,
      interests: form.interests,
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '2px solid #e2e8f0',
    fontSize: 15,
    fontWeight: 500,
    color: '#1e293b',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* AD TOP */}
      <div style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="leaderboard" />
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 8 }}>
            Reise planen
          </h1>
          <p style={{ color: '#64748b', fontSize: 16 }}>
            Füll das Formular aus — dein KI-Plan ist in Sekunden fertig
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: 32,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}>

            {/* Destination */}
            <div>
              <label style={labelStyle}>🌍 Wohin möchtest du reisen?</label>
              <input
                type="text"
                value={form.destination}
                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                placeholder="z.B. Rom, Barcelona, Thailand, Paris..."
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Days + Persons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>📅 Wie viele Tage?</label>
                <input
                  type="number"
                  min="2" max="21"
                  value={form.days}
                  onChange={e => setForm(f => ({ ...f, days: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <label style={labelStyle}>👥 Wie viele Personen?</label>
                <input
                  type="number"
                  min="1" max="10"
                  value={form.persons}
                  onChange={e => setForm(f => ({ ...f, persons: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label style={labelStyle}>
                💶 Gesamtbudget für alle Personen
                <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>
                  ({form.persons} Pers. × {Math.round(parseInt(form.budget || 0) / parseInt(form.persons || 1))}€ pro Person)
                </span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="range"
                  min="300" max="10000" step="100"
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                  style={{ flex: 1, accentColor: '#2563eb', height: 6, cursor: 'pointer' }}
                />
                <div style={{
                  background: '#eff6ff',
                  border: '2px solid #bfdbfe',
                  borderRadius: 10,
                  padding: '8px 16px',
                  fontWeight: 800,
                  fontSize: 18,
                  color: '#1d4ed8',
                  minWidth: 100,
                  textAlign: 'center',
                }}>
                  {parseInt(form.budget).toLocaleString('de-DE')}€
                </div>
              </div>
            </div>

            {/* Hotel Category */}
            <div>
              <label style={labelStyle}>🏨 Unterkunft</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {hotelOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, hotelCategory: opt.id }))}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: `2px solid ${form.hotelCategory === opt.id ? '#2563eb' : '#e2e8f0'}`,
                      background: form.hotelCategory === opt.id ? '#eff6ff' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: form.hotelCategory === opt.id ? '#1d4ed8' : '#1e293b' }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label style={labelStyle}>❤️ Was interessiert dich? (mehrere möglich)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {interests.map(i => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => toggleInterest(i.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 50,
                      border: `2px solid ${form.interests.includes(i.id) ? '#2563eb' : '#e2e8f0'}`,
                      background: form.interests.includes(i.id) ? '#eff6ff' : '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      color: form.interests.includes(i.id) ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', color: '#991b1b', fontSize: 14 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={actualLoading || !form.destination.trim()}
              style={{
                background: actualLoading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '16px 32px',
                fontSize: 17,
                fontWeight: 800,
                cursor: actualLoading ? 'not-allowed' : 'pointer',
                width: '100%',
                boxShadow: actualLoading ? 'none' : '0 8px 25px rgba(37,99,235,0.35)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              {actualLoading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                  KI analysiert {form.destination || 'dein Ziel'}...
                </>
              ) : (
                <>✨ KI-Reiseplan generieren</>
              )}
            </button>

            {actualLoading && (
              <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 8 }}>
                🤖 Die KI recherchiert echte Hotels, Restaurants & Öffnungszeiten...
              </div>
            )}
          </div>
        </form>

        {/* AD BOTTOM */}
        <div style={{ marginTop: 32 }}>
          <AdBanner size="square" />
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
