import { useState, useEffect, useRef } from 'react';

/* ── Scroll-fade-in hook ───────────────────────────── */
function useFadeIn(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Live counter ──────────────────────────────────── */
function LiveCounter() {
  const [count, setCount] = useState(2841);
  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 3 + 1));
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, padding: '5px 16px' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fb923c', display: 'inline-block', animation: 'livePulse 2s infinite' }} />
      <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 500 }}>
        <strong style={{ color: '#fff' }}>{count.toLocaleString('de-DE')}</strong> Pläne heute erstellt
      </span>
    </div>
  );
}

/* ── Animated product mockup ───────────────────────── */
const DEMO_TEXT = '7 Tage Bali · 2 Personen · 1.200€';
const DEMO_CARDS = [
  { emoji: '🏨', title: 'Alaya Resort Ubud', sub: 'ab 89€ · ⭐⭐⭐⭐' },
  { emoji: '🏛️', title: 'Tegallalang Reisfelder', sub: '09:00 · Eintritt 2€' },
  { emoji: '🍽️', title: 'Locavore Restaurant', sub: '13:00 · Balinesische Küche' },
  { emoji: '💎', title: 'Pura Tirta Empul', sub: 'Geheimtipp · 20 min' },
];

function AnimatedMockup() {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState('');
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let t;
    if (phase === 0) {
      if (typed.length < DEMO_TEXT.length) {
        t = setTimeout(() => setTyped(DEMO_TEXT.slice(0, typed.length + 1)), 55);
      } else { t = setTimeout(() => setPhase(1), 700); }
    } else if (phase === 1) {
      t = setTimeout(() => { setPhase(2); setShown(0); }, 1800);
    } else if (phase === 2) {
      if (shown < DEMO_CARDS.length) {
        t = setTimeout(() => setShown(s => s + 1), 300);
      } else { t = setTimeout(() => { setPhase(0); setTyped(''); setShown(0); }, 4500); }
    }
    return () => clearTimeout(t);
  }, [phase, typed, shown]);

  return (
    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 32px 80px rgba(0,0,0,0.32)', width: 300, overflow: 'hidden', flexShrink: 0, animation: 'floatMockup 6s ease-in-out infinite' }}>
      <div style={{ background: '#f1f5f9', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#22c55e' }} />
        <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 6, padding: '3px 10px', marginLeft: 6, fontSize: 10, color: '#94a3b8' }}>tripai-omega.vercel.app</div>
      </div>
      <div style={{ padding: '16px 16px 20px' }}>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, border: `1.5px solid ${phase === 0 ? '#2563eb' : '#e2e8f0'}`, transition: 'border-color 0.3s' }}>
          <span style={{ fontSize: 13 }}>✈️</span>
          <span style={{ fontSize: 12, color: '#0f172a', flex: 1, minHeight: 16 }}>
            {typed}{phase === 0 && typed.length < DEMO_TEXT.length && <span style={{ animation: 'blink 1s steps(1) infinite' }}>|</span>}
          </span>
          <div style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', borderRadius: 8, padding: '3px 9px', fontSize: 11, fontWeight: 700 }}>→</div>
        </div>
        {phase === 1 && (
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb', animation: `dotPulse 1.4s ease-in-out ${i * 0.16}s infinite` }} />)}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Plan wird erstellt…</div>
          </div>
        )}
        {phase === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_CARDS.slice(0, shown).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', borderRadius: 10, padding: '9px 12px', animation: 'slideIn 0.3s ease forwards' }}>
                <span style={{ fontSize: 16 }}>{c.emoji}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Destination card ──────────────────────────────── */
function DestCard({ dest, onPlan, big = false, visible = true, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={() => onPlan(dest.name)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
      borderRadius: 18, overflow: 'hidden', display: 'block', width: '100%', textAlign: 'left',
      boxShadow: hovered ? '0 28px 60px rgba(0,0,0,0.22)' : '0 4px 20px rgba(0,0,0,0.07)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(22px)',
      transition: `box-shadow 0.35s, opacity 0.55s ${delay}ms ease, transform 0.55s ${delay}ms ease`,
    }}>
      <div style={{ position: 'relative', height: big ? 260 : 160, overflow: 'hidden' }}>
        <img src={dest.img} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.6s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: hovered ? 'linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0.72) 100%)' : 'linear-gradient(to bottom,rgba(0,0,0,0) 30%,rgba(0,0,0,0.58) 100%)', transition: 'background 0.35s' }} />
        <div style={{ position: 'absolute', bottom: big ? 18 : 12, left: big ? 18 : 12, right: big ? 18 : 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: big ? 24 : 18, marginBottom: 2 }}>{dest.emoji}</div>
            <div style={{ fontSize: big ? 20 : 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1 }}>{dest.name}</div>
            <div style={{ fontSize: big ? 12 : 10, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{dest.tag}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '5px 11px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.2)', opacity: hovered ? 1 : 0.6, transition: 'opacity 0.3s' }}>Plan →</div>
        </div>
      </div>
    </button>
  );
}

/* ── Marquee ticker ────────────────────────────────── */
const MARQUEE_ITEMS = [
  '🇮🇩 Bali', '🇯🇵 Tokio', '🇺🇸 New York', '🇫🇷 Paris', '🇮🇹 Rom', '🇪🇸 Barcelona',
  '🇹🇭 Thailand', '🇬🇷 Santorini', '🇳🇴 Bergen', '🇲🇦 Marrakesch', '🇵🇪 Machu Picchu',
  '🇦🇺 Sydney', '🇿🇦 Kapstadt', '🇨🇿 Prag', '🇦🇷 Buenos Aires', '🇮🇸 Reykjavík',
];

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ overflow: 'hidden', background: '#fff', padding: '18px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', gap: 48, animation: 'marquee 28s linear infinite', width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.2px' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Example trip (floating, tilted) ──────────────── */
function ExampleTrip({ onStart }) {
  const [ref, visible] = useFadeIn();
  const [cardHovered, setCardHovered] = useState(false);
  const slots = [
    { time: '09:00', icon: '🏛️', name: 'Kolosseum', detail: '09:00–19:00 · ca. 2–3 Std.', cost: '18€' },
    { time: '12:30', icon: '🍽️', name: 'Da Enzo al 29', detail: 'Trastevere · Cacio e Pepe', cost: '22€' },
    { time: '15:00', icon: '🏛️', name: 'Forum Romanum', detail: 'Kombiticket inklusive', cost: '–' },
    { time: '19:30', icon: '🎉', name: 'Campo de\' Fiori', detail: 'Abendessen & Aperitivo', cost: '28€' },
  ];

  return (
    <section ref={ref} style={{ padding: 'clamp(60px, 8vw, 96px) 24px', background: '#f8fafc', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 72, alignItems: 'center' }}>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 14 }}>Echte Ergebnisse</div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 18 }}>
            Das bekommst du —<br />
            <span style={{ color: '#2563eb' }}>in unter 30 Sekunden.</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
            Kein generischer Reiseführer. Echter Plan mit echten Hotel-Namen, Öffnungszeiten, Preisen und Geheimtipps — für jeden Ort der Welt.
          </p>
          <button onClick={onStart} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#1e3a8a'}
            onMouseOut={e => e.currentTarget.style.background = '#0f172a'}
          >
            Meinen Plan erstellen →
          </button>
        </div>

        {/* Floating tilted card — no explicit box frame */}
        <div
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          style={{
            borderRadius: 24, overflow: 'hidden',
            boxShadow: cardHovered ? '0 40px 100px rgba(0,0,0,0.18)' : '0 20px 60px rgba(0,0,0,0.12)',
            transform: cardHovered ? 'rotate(0deg) translateY(-4px)' : 'rotate(-1.5deg)',
            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 30 }}>🇮🇹</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>Rom</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>4 Tage · 2 Personen · Budget: 900€</div>
              </div>
              <div style={{ background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 50 }}>✅ Im Budget</div>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '18px 24px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '1px', marginBottom: 14 }}>TAG 1 — Ankunft & Antikes Rom</div>
            {slots.map((slot, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < slots.length - 1 ? 12 : 0 }}>
                <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 700, width: 36, flexShrink: 0 }}>{slot.time}</span>
                <span style={{ fontSize: 16 }}>{slot.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{slot.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{slot.detail}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', flexShrink: 0 }}>{slot.cost}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {[['✈️', 'Flüge', '200€'], ['🏨', 'Hotel', '360€'], ['🍽️', 'Essen', '180€'], ['🎯', 'Aktiv.', '120€']].map(([icon, label, val]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, marginBottom: 2 }}>{icon}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{label}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Data ──────────────────────────────────────────── */
const destinations = [
  { name: 'Bali', emoji: '🇮🇩', tag: 'Tropisches Paradies', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop&q=85' },
  { name: 'Tokio', emoji: '🇯🇵', tag: 'Zukunft trifft Tradition', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop&q=85' },
  { name: 'New York', emoji: '🇺🇸', tag: 'Die Stadt die niemals schläft', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop&q=85' },
  { name: 'Barcelona', emoji: '🇪🇸', tag: 'Gaudí & Strand', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=500&fit=crop&q=85' },
  { name: 'Paris', emoji: '🇫🇷', tag: 'Stadt der Liebe', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop&q=85' },
  { name: 'Thailand', emoji: '🇹🇭', tag: 'Exotik & Meer', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=500&fit=crop&q=85' },
];

/* ── Hero ──────────────────────────────────────────── */
export default function Hero({ onStartPlanning, onPlanDestination }) {
  const [featRef, featVisible] = useFadeIn();
  const [destRef, destVisible] = useFadeIn();
  const [howRef, howVisible] = useFadeIn();

  return (
    <div style={{ background: '#fff' }}>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(150deg, #080d1a 0%, #0f1f4a 55%, #1e3a8a 100%)', padding: 'clamp(60px, 10vw, 110px) 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: '6%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: '-4%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 56, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 440px', maxWidth: 540 }}>

            {/* Two badges side by side */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, padding: '6px 18px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'livePulse 2s infinite' }} />
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600 }}>Kostenlos · Jeden Ort weltweit</span>
              </div>
              <LiveCounter />
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 22 }}>
              Wohin willst du?<br />
              <span style={{ background: 'linear-gradient(90deg, #fbbf24, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                TripAI plant den Rest.
              </span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 38, maxWidth: 440 }}>
              Einfach Ziel eingeben. TripAI erstellt deinen kompletten Reiseplan — mit echten Hotels, Restaurants und Geheimtipps.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <button onClick={onStartPlanning} style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff', border: 'none', borderRadius: 50, padding: '16px 38px', fontSize: 17, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 32px rgba(245,158,11,0.38)', transition: 'all 0.25s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(245,158,11,0.52)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.38)'; }}
              >
                ✈️ Reise planen — kostenlos
              </button>
              <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13 }}>Kein Account nötig</span>
            </div>
          </div>

          <AnimatedMockup />
        </div>
      </section>

      {/* ── MARQUEE TICKER ──────────────────────── */}
      <Marquee />

      {/* ── FEATURES — no boxes ─────────────────── */}
      <section ref={featRef} style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: '#fff', opacity: featVisible ? 1 : 0, transform: featVisible ? 'none' : 'translateY(28px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 16 }}>Warum TripAI?</div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 18 }}>
              Schluss mit stundenlanger Planung.
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              Keine 10 Tabs mehr. TripAI bündelt alles — Hotels, Restaurants, Budget und Geheimtipps — in einem einzigen Plan.
            </p>
            <button onClick={onStartPlanning} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#1e3a8a'}
              onMouseOut={e => e.currentTarget.style.background = '#0f172a'}
            >
              Jetzt ausprobieren →
            </button>
          </div>

          {/* Feature list — minimal, no boxes */}
          <div>
            {[
              { emoji: '🏨', title: 'Echte Hotels & Restaurants', desc: 'Nur real existierende Empfehlungen — mit Adresse, Zeiten und Preisen.' },
              { emoji: '💰', title: 'Budget immer im Blick', desc: 'Kostenaufstellung für jeden Tag. Kein böses Erwachen beim Check-out.' },
              { emoji: '💎', title: 'Geheimtipps & Foto-Spots', desc: 'Orte die kein normaler Reiseführer zeigt — zur richtigen Uhrzeit.' },
              { emoji: '🌍', title: 'Jeden Ort der Welt', desc: 'Von New York bis zum kleinen Bergdorf — TripAI kennt jeden Winkel.' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                paddingBottom: i < 3 ? 24 : 0,
                marginBottom: i < 3 ? 24 : 0,
                borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
                paddingLeft: featVisible ? [0, 12, 6, 18][i] : 0,
                transition: `padding-left 0.6s ${i * 80}ms ease`,
              }}>
                <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{f.emoji}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMPLE TRIP ─────────────────────────── */}
      <ExampleTrip onStart={onStartPlanning} />

      {/* ── DESTINATIONS ─────────────────────────── */}
      <section ref={destRef} style={{ padding: 'clamp(60px, 8vw, 96px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 14 }}>Reiseziele</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', margin: 0 }}>Die Welt wartet auf dich.</h2>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Klick auf ein Ziel — oder gib deinen eigenen Ort ein.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {destinations.slice(0, 2).map((d, i) => <DestCard key={d.name} dest={d} onPlan={onPlanDestination} big visible={destVisible} delay={i * 100} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {destinations.slice(2).map((d, i) => <DestCard key={d.name} dest={d} onPlan={onPlanDestination} visible={destVisible} delay={(i + 2) * 100} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section ref={howRef} style={{ padding: 'clamp(60px, 8vw, 96px) 24px', background: '#0f172a', opacity: howVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 56 }}>
            In 3 Schritten zum perfekten Plan.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 25, left: '18%', right: '18%', height: 1, background: 'rgba(255,255,255,0.07)' }} />
            {[
              { emoji: '✍️', num: '01', title: 'Eingabe', desc: 'Ziel, Budget & Dauer' },
              { emoji: '🤖', num: '02', title: 'TripAI plant', desc: 'Kompletter Plan in Sekunden' },
              { emoji: '✈️', num: '03', title: 'Losreisen', desc: 'Buchen & genießen' },
            ].map((s, i) => (
              <div key={s.num} style={{ textAlign: 'center', padding: '0 20px', opacity: howVisible ? 1 : 0, transform: howVisible ? 'none' : 'translateY(16px)', transition: `opacity 0.6s ${i * 150}ms ease, transform 0.6s ${i * 150}ms ease` }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#1e3a8a', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 20px', position: 'relative', zIndex: 1 }}>{s.emoji}</div>
                <div style={{ color: '#60a5fa', fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 8 }}>{s.num}</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={onStartPlanning} style={{ marginTop: 52, background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff', border: 'none', borderRadius: 50, padding: '16px 42px', fontSize: 17, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 30px rgba(245,158,11,0.32)', transition: 'all 0.25s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(245,158,11,0.48)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,158,11,0.32)'; }}
          >
            ✈️ Jetzt kostenlos starten
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer style={{ background: '#080d1a', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>✈️</span>
          <strong style={{ color: '#fff', fontSize: 16, letterSpacing: '-0.3px' }}>Trip<span style={{ color: '#60a5fa' }}>AI</span></strong>
        </div>
        <p style={{ fontSize: 12, color: '#334155' }}>© 2025 TripAI · Kostenlos · Kein Account erforderlich</p>
      </footer>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.3)} }
        @keyframes floatMockup { 0%,100%{transform:translateY(0px) rotate(-0.5deg)} 50%{transform:translateY(-16px) rotate(0.5deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes dotPulse { 0%,80%,100%{transform:scale(0.55);opacity:0.35} 40%{transform:scale(1);opacity:1} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </div>
  );
}
