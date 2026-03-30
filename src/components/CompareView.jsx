import { useState } from 'react';

export default function CompareView({ favorites, onBack }) {
  const [selected, setSelected] = useState([]);
  const comparing = selected.length === 2 ? selected.map(i => favorites[i]) : null;

  if (!favorites || favorites.length < 2) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 24 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>📊</div>
        <h2 style={{ color: '#0f172a', fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Zu wenig gespeicherte Reisen</h2>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>Du brauchst mindestens 2 gespeicherte Favoriten zum Vergleichen.</p>
        <button onClick={onBack} style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', border: 'none', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Zurück</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 60 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>← Zurück</button>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>📊 Reisen vergleichen</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px' }}>
        {!comparing ? (
          <>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Wähle 2 Reisen aus, die du vergleichen möchtest:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {favorites.map((f, i) => {
                const isSel = selected.includes(i);
                return (
                  <button key={i} onClick={() => setSelected(s => isSel ? s.filter(x => x !== i) : s.length < 2 ? [...s, i] : s)}
                    style={{ background: isSel ? '#eff6ff' : '#fff', border: `2px solid ${isSel ? '#2563eb' : '#e2e8f0'}`, borderRadius: 16, padding: 20, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{f.emoji || '✈️'}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{f.destination}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{f.days} Tage · {f.persons} Pers. · {f.budget?.toLocaleString('de-DE')}€</div>
                    {isSel && <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 700, marginTop: 6 }}>✓ Ausgewählt</div>}
                  </button>
                );
              })}
            </div>
            {selected.length === 2 && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button onClick={() => setSelected([...selected])} style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 36px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                  Jetzt vergleichen →
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={() => setSelected([])} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 20, padding: 0 }}>← Andere Reisen wählen</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {comparing.map((f, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{f.emoji || '✈️'}</div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{f.destination}</h2>
                  <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>Gespeichert am {f.date}</p>
                  {[
                    ['📅 Reisetage', f.days + ' Tage'],
                    ['👥 Personen', f.persons + (f.persons === 1 ? ' Person' : ' Personen')],
                    ['💰 Budget', f.budget?.toLocaleString('de-DE') + '€'],
                    ['💸 Pro Nacht', f.budget && f.days ? Math.round(f.budget / f.days) + '€ / Nacht (ca.)' : '–'],
                    ['👤 Pro Person', f.budget && f.persons ? Math.round(f.budget / f.persons) + '€ / Person' : '–'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, marginTop: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>💡 Günstigere Option</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>
                {comparing[0].budget <= comparing[1].budget
                  ? `${comparing[0].emoji || '✈️'} ${comparing[0].destination}`
                  : `${comparing[1].emoji || '✈️'} ${comparing[1].destination}`}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                {Math.abs((comparing[0].budget || 0) - (comparing[1].budget || 0)).toLocaleString('de-DE')}€ günstiger
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
