import { useState, useEffect, useRef } from 'react';

/* ── Scroll-fade-in hook ───────────────────────────────────── */
function useFadeIn(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible, delay];
}

/* ── Animated product mockup ───────────────────────────────── */
const DEMO_TEXT = '7 Tage Bali · 2 Personen · 1.200€';
const DEMO_CARDS = [
  { emoji: '🏨', title: 'Alaya Resort Ubud', sub: 'ab 89€ · ⭐⭐⭐⭐' },
  { emoji: '🏛️', title: 'Tegallalang Reisfelder', sub: '09:00 · Eintritt 2€' },
  { emoji: '🍽️', title: 'Locavore Restaurant', sub: '13:00 · Balinesische Küche' },
  { emoji: '💎', title: 'Pura Tirta Empul', sub: 'Geheimtipp · 20 min entfernt' },
];

function AnimatedMockup() {
  const [phase, setPhase] = useState(0);   // 0=typing 1=loading 2=result
  const [typed, setTyped] = useState('');
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let t;
    if (phase === 0) {
      if (typed.length < DEMO_TEXT.length) {
        t = setTimeout(() => setTyped(DEMO_TEXT.slice(0, typed.length + 1)), 55);
      } else {
        t = setTimeout(() => setPhase(1), 700);
      }
    } else if (phase === 1) {
      t = setTimeout(() => { setPhase(2); setShown(0); }, 1800);
    } else if (phase === 2) {
      if (shown < DEMO_CARDS.length) {
        t = setTimeout(() => setShown(s => s + 1), 320);
      } else {
        t = setTimeout(() => { setPhase(0); setTyped(''); setShown(0); }, 4500);
      }
    }
    return () => clearTimeout(t);
  }, [phase, typed, shown]);

  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      boxShadow: '0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.08)',
      width: 300, overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Browser bar */}
      <div style={{ background: '#f1f5f9', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#22c55e' }} />
        <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 6, padding: '3px 10px', marginLeft: 6, fontSize: 10, color: '#94a3b8' }}>
          tripai-omega.vercel.app
        </div>
      </div>

      <div style={{ padding: '16px 16px 20px' }}>
        {/* Search bar */}
        <div style={{
          background: '#f8fafc', borderRadius: 12, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
          border: `1.5px solid ${phase === 0 ? '#2563eb' : '#e2e8f0'}`,
          transition: 'border-color 0.3s',
        }}>
          <span style={{ fontSize: 13 }}>✈️</span>
          <span style={{ fontSize: 12, color: '#0f172a', flex: 1, minHeight: 16 }}>
            {typed}
            {phase === 0 && typed.length < DEMO_TEXT.length && (
              <span style={{ animation: 'blink 1s steps(1) infinite' }}>|</span>
            )}
          </span>
          <div style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', borderRadius: 8, padding: '3px 9px', fontSize: 11, fontWeight: 700 }}>→</div>
        </div>

        {/* Loading */}
        {phase === 1 && (
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb', animation: `dotPulse 1.4s ease-in-out ${i * 0.16}s infinite` }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>KI plant deinen Trip…</div>
          </div>
        )}

        {/* Result cards */}
        {phase === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_CARDS.slice(0, shown).map((card, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#f8fafc', borderRadius: 10, padding: '9px 12px',
                animation: 'slideIn 0.3s ease forwards',
              }}>
                <span style={{ fontSize: 16 }}>{card.emoji}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{card.title}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{card.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Destination card ──────────────────────────────────────── */
function DestCard({ dest, onPlan, big = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onPlan(dest.name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        borderRadius: 18, overflow: 'hidden', display: 'block', width: '100%', textAlign: 'left',
        boxShadow: hovered ? '0 28px 60px rgba(0,0,0,0.22)' : '0 4px 20px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.35s',
      }}
    >
      <div style={{ position: 'relative', height: big ? 260 : 160, overflow: 'hidden' }}>
        <img
          src={dest.img}
          alt={dest.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.09)' : 'scale(1)',
            transition: 'transform 0.55s ease',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.58) 100%)',
          transition: 'background 0.35s',
        }} />
        <div style={{ position: 'absolute', bottom: big ? 18 : 12, left: big ? 18 : 12, right: big ? 18 : 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: big ? 24 : 18, marginBottom: 2 }}>{dest.emoji}</div>
            <div style={{ fontSize: big ? 20 : 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1 }}>{dest.name}</div>
            <div style={{ fontSize: big ? 12 : 10, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{dest.tag}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 10, fontWeight: 800,
            padding: '5px 11px', borderRadius: 50,
            border: '1px solid rgba(255,255,255,0.2)',
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.3s',
          }}>Plan →</div>
        </div>
      </div>
    </button>
  );
}

/* ── Data ──────────────────────────────────────────────────── */
const destinations = [
  { name: 'Bali', emoji: '🇮🇩', tag: 'Tropisches Paradies', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop&q=85' },
  { name: 'Tokio', emoji: '🇯🇵', tag: 'Zukunft trifft Tradition', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop&q=85' },
  { name: 'New York', emoji: '🇺🇸', tag: 'Die Stadt die niemals schläft', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop&q=85' },
  { name: 'Barcelona', emoji: '🇪🇸', tag: 'Gaudí & Strand', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=500&fit=crop&q=85' },
  { name: 'Paris', emoji: '🇫🇷', tag: 'Stadt der Liebe', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop&q=85' },
  { name: 'Thailand', emoji: '🇹🇭', tag: 'Exotik & Meer', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=500&fit=crop&q=85' },
];

/* ── Hero ──────────────────────────────────────────────────── */
export default function Hero({ onStartPlanning, onPlanDestination }) {
  const [featRef, featVisible] = useFadeIn();
  const [destRef, destVisible] = useFadeIn();
  const [howRef, howVisible] = useFadeIn();

  const fadeStyle = (visible, delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(28px)',
    transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
  });

  return (
    <div style={{ background: '#fff' }}>

      {/* ── HERO SECTION ─────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        padding: 'clamp(60px, 10vw, 110px) 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: -80, right: '8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: '-2%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, justifyContent: 'space-between', flexWrap: 'wrap' }}>

          {/* Left text */}
          <div style={{ flex: '1 1 460px', maxWidth: 560 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 50, padding: '6px 18px', marginBottom: 28,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'livePulse 2s infinite' }} />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600 }}>Kostenlos · Sofort · Jeden Ort der Welt</span>
            </div>

            <h1 style={{ fontSize: 'clamp(34px, 5vw, 60px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 22 }}>
              Dein Traumurlaub —<br />
              <span style={{ background: 'linear-gradient(90deg, #fbbf24, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                geplant in Sekunden.
              </span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.72, marginBottom: 36, maxWidth: 460 }}>
              Einfach Ziel eingeben — die KI erstellt deinen kompletten Reiseplan mit echten Hotels, Restaurants und Geheimtipps.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <button onClick={onStartPlanning} style={{
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                color: '#fff', border: 'none', borderRadius: 50,
                padding: '16px 38px', fontSize: 17, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 8px 32px rgba(245,158,11,0.38)',
                transition: 'all 0.25s',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(245,158,11,0.52)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.38)'; }}
              >
                ✈️ Reise planen — kostenlos
              </button>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Kein Account nötig</span>
            </div>

            <div style={{ display: 'flex', gap: 32, marginTop: 44, flexWrap: 'wrap' }}>
              {[['Jeden Ort weltweit', '🌍'], ['Unter 30 Sekunden', '⚡'], ['100% kostenlos', '✅']].map(([label, icon]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: animated mockup */}
          <AnimatedMockup />
        </div>
      </section>

      {/* ── FEATURES — simple list, no boxes ────────────────── */}
      <section ref={featRef} style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', flexWrap: 'wrap', ...fadeStyle(featVisible) }}>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 16 }}>Warum TripAI?</div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 18 }}>
              Schluss mit stundenlanger Planung.
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.75, marginBottom: 32, maxWidth: 400 }}>
              Keine 10 Tabs mehr. TripAI bündelt Hotels, Restaurants, Sehenswürdigkeiten und Budget in einem einzigen perfekten Plan.
            </p>
            <button onClick={onStartPlanning} style={{
              background: '#0f172a', color: '#fff', border: 'none',
              borderRadius: 50, padding: '12px 28px', fontSize: 14,
              fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#1e3a8a'}
              onMouseOut={e => e.currentTarget.style.background = '#0f172a'}
            >
              Jetzt ausprobieren →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {[
              { icon: '🏨', title: 'Echte Hotels & Restaurants', desc: 'Nur real existierende Empfehlungen — mit Adresse, Öffnungszeiten und Preisen.' },
              { icon: '💰', title: 'Budget immer im Blick', desc: 'Kostenaufstellung für jeden Tag. Kein böses Erwachen beim Check-out.' },
              { icon: '💎', title: 'Geheimtipps & Foto-Spots', desc: 'Orte die kein normaler Reiseführer zeigt — für das perfekte Foto.' },
              { icon: '🌍', title: 'Jeden Ort der Welt', desc: 'Von New York bis zum kleinen Bergdorf — TripAI kennt jeden Winkel.' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ─────────────────────────────────────── */}
      <section ref={destRef} style={{ padding: 'clamp(60px, 8vw, 96px) 24px', background: '#f8fafc', ...fadeStyle(destVisible) }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 14 }}>Reiseziele</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', margin: 0 }}>
                Wohin geht die Reise?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Klick auf ein Ziel — oder gib deinen eigenen Ort ein.</p>
            </div>
          </div>

          {/* 2 big + 4 small — asymmetrisches Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {destinations.slice(0, 2).map(d => <DestCard key={d.name} dest={d} onPlan={onPlanDestination} big />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {destinations.slice(2).map(d => <DestCard key={d.name} dest={d} onPlan={onPlanDestination} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section ref={howRef} style={{ padding: 'clamp(60px, 8vw, 96px) 24px', background: '#0f172a', ...fadeStyle(howVisible) }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 56 }}>
            In 3 Schritten zum perfekten Plan.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 25, left: '18%', right: '18%', height: 1, background: 'rgba(255,255,255,0.08)' }} />
            {[
              { emoji: '✍️', num: '01', title: 'Eingabe', desc: 'Ziel, Budget & Dauer' },
              { emoji: '🤖', num: '02', title: 'KI plant', desc: 'Detailplan in Sekunden' },
              { emoji: '✈️', num: '03', title: 'Losreisen', desc: 'Buchen & genießen' },
            ].map(s => (
              <div key={s.num} style={{ textAlign: 'center', padding: '0 20px' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#1e3a8a', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 20px', position: 'relative', zIndex: 1 }}>
                  {s.emoji}
                </div>
                <div style={{ color: '#60a5fa', fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 8 }}>{s.num}</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <button onClick={onStartPlanning} style={{
            marginTop: 52,
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: '#fff', border: 'none', borderRadius: 50,
            padding: '16px 42px', fontSize: 17, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(245,158,11,0.32)', transition: 'all 0.25s',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(245,158,11,0.48)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,158,11,0.32)'; }}
          >
            ✈️ Jetzt kostenlos starten
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: '#080d1a', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>✈️</span>
          <strong style={{ color: '#fff', fontSize: 16, letterSpacing: '-0.3px' }}>Trip<span style={{ color: '#60a5fa' }}>AI</span></strong>
        </div>
        <p style={{ fontSize: 12, color: '#334155' }}>© 2025 TripAI · Kostenlos · Kein Account erforderlich</p>
      </footer>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.3)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes dotPulse { 0%,80%,100%{transform:scale(0.55);opacity:0.35} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}
