import AdBanner from './AdBanner';

const features = [
  { icon: '🤖', title: 'KI-Reiseplanung', desc: 'Gib Ziel & Budget ein — bekomme deinen kompletten Tagesplan in Sekunden' },
  { icon: '💰', title: 'Budget-Kontrolle', desc: 'Sieh genau, was Hotel, Transport, Essen & Aktivitäten kosten' },
  { icon: '📅', title: 'Tag-für-Tag-Plan', desc: 'Detaillierter Reiseplan mit Aktivitäten für jeden einzelnen Tag' },
  { icon: '🌍', title: 'Weltweite Ziele', desc: 'Europa, Asien, Amerika — wir kennen die besten Tipps für jedes Ziel' },
];

const destinations = [
  { name: 'Rom', emoji: '🇮🇹', desc: 'Ewige Stadt', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop' },
  { name: 'Barcelona', emoji: '🇪🇸', desc: 'Gaudí & Strand', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=250&fit=crop' },
  { name: 'Paris', emoji: '🇫🇷', desc: 'Stadt der Liebe', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop' },
  { name: 'Thailand', emoji: '🇹🇭', desc: 'Exotik & Strand', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=250&fit=crop' },
  { name: 'New York', emoji: '🇺🇸', desc: 'Die Stadt die niemals schläft', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop' },
  { name: 'Italien', emoji: '🇮🇹', desc: 'Kunst & Genuss', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=250&fit=crop' },
];

export default function Hero({ onStartPlanning, onPlanDestination }) {
  return (
    <div>
      {/* TOP AD */}
      <div style={{ background: '#f8fafc', padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="leaderboard" />
        </div>
      </div>

      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #0ea5e9 100%)',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✈️</div>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 60px)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: 20,
          }}>
            Dein perfekter Urlaub —<br />
            <span style={{ color: '#fbbf24' }}>geplant in Sekunden</span>
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 36,
            maxWidth: 580,
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}>
            Gib Ziel, Budget und Dauer ein — unsere KI erstellt dir einen vollständigen Reiseplan mit Budget-Aufschlüsselung. Kostenlos.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onStartPlanning}
              style={{
                background: '#f59e0b',
                color: '#1c1917',
                border: 'none',
                borderRadius: 50,
                padding: '16px 36px',
                fontSize: 17,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(245,158,11,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 30px rgba(245,158,11,0.5)'; }}
              onMouseOut={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 25px rgba(245,158,11,0.4)'; }}
            >
              🗺️ Reise jetzt planen
            </button>
          </div>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            {['100% kostenlos', 'KI-gestützt', 'Kein Account nötig'].map(badge => (
              <div key={badge} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 500,
              }}>
                <span style={{ color: '#86efac', fontSize: 16 }}>✓</span>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>
              Warum TripAI?
            </h2>
            <p style={{ color: '#64748b', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
              Schluss mit stundenlanger Recherche. Wir planen für dich.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#f8fafc',
                borderRadius: 16,
                padding: 28,
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AD BANNER MIDDLE */}
      <div style={{ background: '#f8fafc', padding: '24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="horizontal" />
        </div>
      </div>

      {/* POPULAR DESTINATIONS */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>
              Beliebte Reiseziele
            </h2>
            <p style={{ color: '#64748b', fontSize: 17 }}>Klick auf ein Ziel und wir starten sofort mit der Planung</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {destinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => onPlanDestination(dest.name)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  textAlign: 'left',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; }}
              >
                <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                  <img
                    src={dest.img}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 16, left: 16,
                    color: '#fff',
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{dest.emoji}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{dest.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.85 }}>{dest.desc}</div>
                  </div>
                </div>
                <div style={{
                  background: '#fff',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>Jetzt planen →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="leaderboard" className="footer-ad" />
          <div style={{ marginTop: 24, fontSize: 14 }}>
            <span style={{ fontSize: 20, marginRight: 8 }}>✈️</span>
            <strong style={{ color: '#fff' }}>TripAI</strong> — Dein KI-Reiseplaner
          </div>
          <p style={{ marginTop: 8, fontSize: 12, color: '#475569' }}>
            © 2025 TripAI · Kostenlos · Kein Account erforderlich
          </p>
        </div>
      </footer>
    </div>
  );
}
