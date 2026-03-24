import { useState, useEffect } from 'react';

const STEPS = [
  'Echte Hotels werden gesucht…',
  'Restaurants & lokale Küche gefunden…',
  'Sehenswürdigkeiten & Timings geplant…',
  'Budget wird kalkuliert…',
  'Geheimtipps & TikTok-Spots ergänzt…',
];

export default function LoadingScreen({ destination }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => Math.min(s + 1, STEPS.length - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #080d1a 0%, #0f1f4a 60%, #1e3a8a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden',
    }}>

      {/* Background glow orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Floating plane */}
      <div style={{ fontSize: 52, marginBottom: 32, animation: 'floatPlane 2.8s ease-in-out infinite' }}>✈️</div>

      {/* Destination name */}
      <h2 style={{
        color: '#fff', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 900,
        letterSpacing: '-1px', marginBottom: 8, textAlign: 'center',
      }}>
        {destination}
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, marginBottom: 56, textAlign: 'center' }}>
        Dein persönlicher Reiseplan wird erstellt…
      </p>

      {/* Progress steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%', maxWidth: 370 }}>
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              opacity: i > activeStep ? 0.2 : 1,
              transform: active ? 'translateX(6px)' : 'none',
              transition: 'all 0.45s ease',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: done ? '#22c55e' : active ? '#2563eb' : 'rgba(255,255,255,0.06)',
                border: active ? '2px solid rgba(96,165,250,0.7)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: '#fff', fontWeight: 700,
                boxShadow: active ? '0 0 20px rgba(37,99,235,0.7)' : 'none',
                transition: 'all 0.45s ease',
              }}>
                {done
                  ? '✓'
                  : active
                  ? <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff', animation: 'activeDot 1s ease infinite' }} />
                  : null}
              </div>
              <span style={{
                fontSize: 14,
                color: done ? 'rgba(255,255,255,0.35)' : active ? '#fff' : 'rgba(255,255,255,0.25)',
                fontWeight: active ? 700 : 400,
                transition: 'color 0.45s ease',
              }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pulsing dots */}
      <div style={{ display: 'flex', gap: 7, marginTop: 56 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            animation: `dotPulse 1.5s ease-in-out ${i * 0.22}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes floatPlane {
          0%,100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
        }
        @keyframes activeDot {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }
        @keyframes dotPulse {
          0%,80%,100% { transform: scale(0.55); opacity: 0.25; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
