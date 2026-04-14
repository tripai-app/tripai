import { useState, useEffect } from 'react';

const DEST_FACTS = {
  'bali':         '🌺 Bali hat mehr Hindu-Tempel als Häuser — über 20.000 auf der ganzen Insel!',
  'tokio':        '🚇 Tokio hat das pünktlichste U-Bahn-Netz der Welt. Verspätungen unter 1 Minute gelten als Entschuldigung.',
  'bangkok':      '🛺 Bangkok heißt offiziell „Krung Thep" — ein Name mit 169 Buchstaben, der längste Stadtname der Welt.',
  'kyoto':        '⛩️ Kyoto hat über 1.600 buddhistische Tempel und 400 Shinto-Schreine.',
  'singapur':     '🌿 Singapur hat keinen einzigen natürlichen Wasserfluss — das ganze Trinkwasser wird aufbereitet.',
  'new york':     '🗽 Auf Manhattans Straßen gibt es mehr Hydranten als in manchen europäischen Großstädten Bäume.',
  'miami':        '🌴 Miami ist die einzige Stadt in den USA, die von zwei Nationalparks flankiert wird.',
  'lissabon':     '🌉 Lissabon ist die älteste Hauptstadt Westeuropas — gegründet von den Phöniziern um 1200 v. Chr.',
  'porto':        '🍷 Porto gibt dem Portwein seinen Namen — der berühmte Wein reift hier in speziellenCellars direkt am Douro.',
  'barcelona':    '🏗️ Barcelonas Sagrada Família wird seit 1882 gebaut — und soll erst 2026 fertig werden.',
  'amsterdam':    '🚲 Amsterdam hat mehr Fahrräder als Einwohner — über 880.000 Räder für 820.000 Menschen.',
  'prag':         '🍺 Tschechien trinkt mehr Bier pro Kopf als jedes andere Land der Welt.',
  'budapest':     '🌊 Budapest hat mehr Thermalquellen als jede andere Hauptstadt der Welt — über 120.',
  'wien':         '☕ Wien erfand das Kaffeehaus-Konzept im 17. Jahrhundert — mit Zeitungen und Billardtischen.',
  'santorini':    '🌋 Santorini ist der Krater eines riesigen Vulkans, der 1627 v. Chr. ausbrach.',
  'marrakesch':   '🌿 Die Medina von Marrakesch hat über 100 km Gassen — und kein einziges Straßenschild.',
  'kapstadt':     '🏔️ Der Tafelberg ist älter als die Alpen und der Himalaya — über 600 Millionen Jahre alt.',
  'dubai':        '🏙️ In Dubai ist es verboten, Kamele auf der Autobahn zu reiten. Wirklich.',
  'malediven':    '🐠 80% der Malediven sind weniger als 1 Meter über dem Meeresspiegel.',
  'kopenhagen':   '♻️ Kopenhagen will die erste CO₂-neutrale Hauptstadt der Welt werden.',
  'stockholm':    '🏝️ Stockholm liegt auf 14 Inseln — verbunden durch 57 Brücken.',
  'reykjavik':    '🌌 Reykjavik ist die nördlichste Hauptstadt der Welt und wird zu 100% mit erneuerbarer Energie versorgt.',
  'florenz':      '🎨 In Florenz gibt es mehr Kunstwerke pro Einwohner als irgendwo sonst auf der Welt.',
  'luzern':       '🦁 Das Löwendenkmal in Luzern nannte Mark Twain „das traurigste Stück Stein der Welt".',
  'chiang mai':   '🐘 Chiang Mai hat mehr Elefantensanktionarien als jede andere Stadt der Welt.',
  'hanoi':        '🍜 Hanoi ist bekannt als Heimat des Pho — die Suppe wird hier täglich von 40.000+ Straßenküchen serviert.',
  'dubai':        '🏗️ Burj Khalifa ist mit 828m so hoch, dass man vom 163. Stock aus doppelt in den Sonnenuntergang schauen kann.',
  'istanbul':     '🌉 Istanbul liegt auf zwei Kontinenten gleichzeitig — Europa und Asien.',
  'athen':        '🏛️ Die Akropolis ist 2.500 Jahre alt und war nie ohne menschliche Besiedlung.',
  'rom':          '🪙 In den Trevi-Brunnen werden jährlich über 1,5 Millionen Euro geworfen — alles geht an die Caritas.',
  'paris':        '🥐 Paris hat mehr Bäckereien als jede andere Stadt der Welt — über 1.200 Boulangeries.',
  'seoul':        '🎮 Seoul hat die schnellste durchschnittliche Internetverbindung der Welt.',
  'havanna':      '🚗 In Havanna sind noch über 60.000 Oldtimer aus den 1950ern täglich im Einsatz.',
};

const TRAVEL_FACTS = [
  'Wusstest du? Die längste Flugroute der Welt ist Singapore → New York mit 18.900 km.',
  'Tipp: Flüge dienstags oder mittwochs sind oft 20–30% günstiger.',
  'Der Eiffelturm ist im Sommer 15 cm höher — wegen der Wärmeausdehnung.',
  'Japan hat über 6.800 Inseln — aber nur 421 sind bewohnt.',
  'Der billigste Monat für Fernreisen ist meistens Oktober oder November.',
  'In den meisten Ländern Asiens isst man mit Stäbchen — außer in Thailand, wo man Löffel und Gabel benutzt.',
  'Der Nile ist der längste Fluss der Welt — und fließt durch 11 verschiedene Länder.',
  'In Island gibt es kein Wort für „Bitte" — Höflichkeit wird anders ausgedrückt.',
  'Reykjavik ist die nördlichste Hauptstadt der Welt.',
  'In Bhutan wird kein BIP gemessen — nur das „Brutto-National-Glück".',
];

function getDestFact(destination) {
  if (!destination) return null;
  const key = destination.toLowerCase();
  // exact match
  if (DEST_FACTS[key]) return DEST_FACTS[key];
  // partial match
  const match = Object.entries(DEST_FACTS).find(([k]) => key.includes(k) || k.includes(key));
  return match ? match[1] : null;
}

function getSteps(destination) {
  const d = destination || 'deinem Ziel';
  return [
    { icon: '🏨', text: `Beste Hotels in ${d} werden gesucht…` },
    { icon: '🍽️', text: `Geheime Restaurants in ${d} werden ausgegraben…` },
    { icon: '🗺️', text: `Perfekten Tagesplan für ${d} wird erstellt…` },
    { icon: '💰', text: `Budget für ${d} wird optimiert…` },
    { icon: '💎', text: `Letzte Geheimtipps für ${d} werden ergänzt…` },
  ];
}

export default function LoadingScreen({ destination, statusMsg, streamingTitles = [] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [fact] = useState(() => {
    const destFact = getDestFact(destination);
    return destFact || TRAVEL_FACTS[Math.floor(Math.random() * TRAVEL_FACTS.length)];
  });
  const STEPS = getSteps(destination);
  const progress = Math.round(((activeStep + 1) / STEPS.length) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => Math.min(s + 1, STEPS.length - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #060c1a 0%, #0d1d45 55%, #1a3580 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden',
    }}>

      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Floating plane */}
      <div style={{ fontSize: 56, marginBottom: 28, animation: 'floatPlane 2.8s ease-in-out infinite' }}>✈️</div>

      {/* Destination */}
      <h2 style={{
        color: '#fff', fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 900,
        letterSpacing: '-1.5px', marginBottom: 6, textAlign: 'center',
      }}>
        {destination}
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: statusMsg ? 16 : 40, textAlign: 'center' }}>
        Dein persönlicher KI-Reiseplan wird erstellt…
      </p>
      {statusMsg && (
        <div style={{ background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.35)', borderRadius: 50, padding: '8px 20px', marginBottom: 24, fontSize: 13, fontWeight: 700, color: '#93c5fd', textAlign: 'center' }}>
          ⏳ {statusMsg}
        </div>
      )}

      {/* Live-Vorschau: erscheint sobald Tages-Titel gestreamt werden */}
      {streamingTitles.length > 0 && (
        <div style={{ width: '100%', maxWidth: 380, marginBottom: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '14px 18px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', letterSpacing: '0.5px', marginBottom: 10 }}>📋 WIRD GERADE GEPLANT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {streamingTitles.map((title, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, animation: i === streamingTitles.length - 1 ? 'fadeIn 0.3s ease' : 'none' }}>
                <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Tag {i + 1}: {title}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.45, marginTop: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#60a5fa', animation: 'activeDot 1s ease infinite', flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Weitere Tage werden geplant…</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 380, marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Fortschritt</span>
          <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 800 }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #2563eb, #0ea5e9)',
            boxShadow: '0 0 12px rgba(37,99,235,0.7)',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 380 }}>
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              opacity: i > activeStep ? 0.18 : 1,
              transform: active ? 'translateX(8px)' : 'none',
              transition: 'all 0.45s ease',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: done ? 'rgba(34,197,94,0.2)' : active ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.05)',
                border: done ? '2px solid #22c55e' : active ? '2px solid rgba(96,165,250,0.8)' : '2px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: done ? 14 : 18,
                boxShadow: active ? '0 0 22px rgba(37,99,235,0.6)' : 'none',
                transition: 'all 0.45s ease',
              }}>
                {done ? '✓' : active ? (
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#60a5fa', animation: 'activeDot 1s ease infinite' }} />
                ) : step.icon}
              </div>
              <span style={{
                fontSize: 14,
                color: done ? 'rgba(255,255,255,0.3)' : active ? '#fff' : 'rgba(255,255,255,0.2)',
                fontWeight: active ? 700 : 400,
                transition: 'color 0.45s ease',
              }}>
                {step.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Fun fact */}
      <div style={{
        marginTop: 48, maxWidth: 380, width: '100%',
        background: 'rgba(255,255,255,0.05)', borderRadius: 16,
        padding: '14px 18px', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', marginBottom: 5, letterSpacing: '0.5px' }}>💡 REISE-WISSEN</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{fact}</div>
      </div>

      {/* Pulsing dots */}
      <div style={{ display: 'flex', gap: 7, marginTop: 36 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            animation: `dotPulse 1.5s ease-in-out ${i * 0.22}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes floatPlane {
          0%,100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(-22px) rotate(8deg); }
        }
        @keyframes activeDot {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.5; }
        }
        @keyframes dotPulse {
          0%,80%,100% { transform: scale(0.5); opacity: 0.2; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
