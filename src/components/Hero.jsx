import AdBanner from './AdBanner';

const features = [
  { icon: '🤖', title: 'KI plant alles', desc: 'Echte Hotels, Restaurants & Öffnungszeiten in Sekunden' },
  { icon: '💰', title: 'Budget-Kontrolle', desc: 'Jeder Cent im Blick — keine bösen Überraschungen' },
  { icon: '💎', title: 'Hidden Gems', desc: 'Geheimtipps die kein Tourist kennt' },
  { icon: '📱', title: 'TikTok-Spots', desc: 'Die besten Foto-Orte mit optimaler Uhrzeit' },
];

const destinations = [
  { name: 'Rom', emoji: '🇮🇹', tag: 'Ewige Stadt', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&h=320&fit=crop&q=80', color: '#dc2626' },
  { name: 'Barcelona', emoji: '🇪🇸', tag: 'Gaudí & Strand', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=500&h=320&fit=crop&q=80', color: '#ea580c' },
  { name: 'Paris', emoji: '🇫🇷', tag: 'Stadt der Liebe', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=320&fit=crop&q=80', color: '#7c3aed' },
  { name: 'Thailand', emoji: '🇹🇭', tag: 'Exotik & Meer', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&h=320&fit=crop&q=80', color: '#059669' },
  { name: 'New York', emoji: '🇺🇸', tag: 'City that never sleeps', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=320&fit=crop&q=80', color: '#2563eb' },
  { name: 'Tokio', emoji: '🇯🇵', tag: 'Zukunft trifft Tradition', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=320&fit=crop&q=80', color: '#db2777' },
];

const stats = [
  { value: '150+', label: 'Städte weltweit' },
  { value: '100%', label: 'Kostenlos' },
  { value: '< 30s', label: 'Plan fertig' },
  { value: '4.9 ⭐', label: 'Bewertung' },
];

export default function Hero({ onStartPlanning, onPlanDestination }) {
  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* TOP AD */}
      <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', padding: '10px 24px', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="leaderboard" />
        </div>
      </div>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 75%, #0ea5e9 100%)',
        backgroundSize: '300% 300%',
        animation: 'gradientMove 10s ease infinite',
        padding: 'clamp(64px, 10vw, 120px) 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Live Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 50, padding: '8px 20px', marginBottom: 36,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'livePulse 2s infinite' }} />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600 }}>KI-gestützt · Kostenlos · Sofort einsatzbereit</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 7vw, 72px)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-2.5px',
            marginBottom: 24,
          }}>
            Dein perfekter Urlaub —<br />
            <span style={{
              background: 'linear-gradient(90deg, #fbbf24, #fb923c, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              geplant in Sekunden ✈️
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 580, margin: '0 auto 44px',
            lineHeight: 1.7,
          }}>
            Echte Hotels, Restaurants, Öffnungszeiten & versteckte Geheimtipps —
            unsere KI plant deinen Traumurlaub in unter 30 Sekunden.
          </p>

          <button
            onClick={onStartPlanning}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: '#fff', border: 'none', borderRadius: 50,
              padding: '18px 44px', fontSize: 18, fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 8px 30px rgba(245,158,11,0.45)',
              transition: 'all 0.3s', letterSpacing: '-0.3px',
              marginBottom: 52,
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 45px rgba(245,158,11,0.55)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,158,11,0.45)'; }}
          >
            🗺️ Reise jetzt planen
          </button>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 56px)', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(52px, 8vw, 88px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 12 }}>WARUM TRIPAAI?</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 14 }}>
              Reiseplanung neu gedacht
            </h2>
            <p style={{ color: '#64748b', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
              Schluss mit stundenlanger Recherche auf 10 verschiedenen Seiten.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, #f8faff, #eef2ff)',
                borderRadius: 20, padding: 28,
                border: '1px solid #e0e7ff',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(37,99,235,0.12)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 38, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AD */}
      <div style={{ background: '#f8fafc', padding: '20px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="horizontal" />
        </div>
      </div>

      {/* DESTINATIONS */}
      <section style={{ padding: 'clamp(52px, 8vw, 88px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 12 }}>REISEZIELE</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 14 }}>
              Wohin geht die Reise?
            </h2>
            <p style={{ color: '#64748b', fontSize: 17 }}>Klick auf ein Ziel — der KI-Plan startet sofort</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
            {destinations.map(dest => (
              <button
                key={dest.name}
                onClick={() => onPlanDestination(dest.name)}
                style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  borderRadius: 22, overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  textAlign: 'left',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)'; e.currentTarget.style.boxShadow = '0 24px 55px rgba(0,0,0,0.18)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
              >
                <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                  <img src={dest.img} alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={e => e.target.style.transform = 'scale(1.08)'}
                    onMouseOut={e => e.target.style.transform = 'none'}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: 30, marginBottom: 4 }}>{dest.emoji}</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>{dest.name}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{dest.tag}</div>
                    </div>
                    <div style={{
                      background: dest.color, color: '#fff',
                      fontSize: 11, fontWeight: 800,
                      padding: '7px 14px', borderRadius: 50,
                      letterSpacing: '0.5px', flexShrink: 0,
                    }}>KI PLAN →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: 'clamp(52px, 8vw, 88px) 24px', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#93c5fd', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 12 }}>SO FUNKTIONIERT'S</div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 52 }}>
            In 3 Schritten zum Traumurlaub
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { icon: '✍️', step: '01', title: 'Eingabe', desc: 'Ziel, Budget, Dauer & Interessen angeben' },
              { icon: '🤖', step: '02', title: 'KI plant', desc: 'Kompletter Plan mit echten Empfehlungen' },
              { icon: '✈️', step: '03', title: 'Losreisen', desc: 'Hotels & Flüge direkt buchen' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, margin: '0 auto 20px',
                }}>{s.icon}</div>
                <div style={{ color: '#60a5fa', fontSize: 12, fontWeight: 800, letterSpacing: '1px', marginBottom: 8 }}>{s.step}</div>
                <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{s.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={onStartPlanning} style={{
            marginTop: 52, background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: '#fff', border: 'none', borderRadius: 50,
            padding: '16px 42px', fontSize: 17, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(245,158,11,0.4)', transition: 'all 0.3s',
          }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            🗺️ Jetzt kostenlos starten
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a0f1e', color: '#334155', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="leaderboard" />
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>✈️</span>
            <strong style={{ color: '#fff', fontSize: 17, letterSpacing: '-0.3px' }}>Trip<span style={{ color: '#60a5fa' }}>AI</span></strong>
          </div>
          <p style={{ marginTop: 8, fontSize: 12 }}>© 2025 TripAI · Kostenlos · Kein Account erforderlich</p>
        </div>
      </footer>

      <style>{`
        @keyframes gradientMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.2)} }
      `}</style>
    </div>
  );
}
