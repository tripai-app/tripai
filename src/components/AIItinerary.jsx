import { useState, useEffect, useRef, Fragment } from 'react';
import AffiliateSection from './AffiliateSection';
import { getAmazonLink } from '../data/affiliateConfig';
import useIsMobile from '../hooks/useIsMobile';

// Zählt animiert von 0 auf Zielwert hoch
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    let startTime;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}

function generatePacklist(plan) {
  const dest = (plan.destination || '').toLowerCase();
  const slots = plan.days?.flatMap(d => d.slots || []) || [];
  const types = slots.map(s => s.type);
  const hasBeach = types.includes('strand') || /bali|thailand|malediven|ibiza|mallorca|karibik|miami|hawaii/.test(dest);
  const hasHike = types.includes('aktivitaet') || /berg|alpen|nepal|trekking|island|reykjavik/.test(dest);
  const hasCity = types.includes('sehenswuerdigkeit') || types.includes('museum');
  const hasCulture = types.includes('sehenswuerdigkeit') || /tokio|kyoto|rom|athen|istanbul|delhi|marrakech|marrakesch/.test(dest);
  const isAsia = /japan|tokio|kyoto|bangkok|thailand|bali|vietnam|hanoi|singapur|chiang mai/.test(dest);
  const isDubai = /dubai|abu dhabi/.test(dest);

  const items = {
    '📋 Dokumente': ['Reisepass / Personalausweis', 'Flugtickets (ausgedruckt + digital)', 'Krankenversicherungskarte', 'Hotel-Buchungsbestätigungen'],
    '👕 Kleidung': ['Bequeme Laufschuhe', 'Wechselkleidung für alle Tage', 'Leichte Jacke / Windbreaker'],
    '🔌 Elektronik': ['Ladekabel (Handy + sonstige)', 'Reisestecker-Adapter', 'Powerbank'],
    '🧴 Hygiene': ['Zahnbürste & Zahnpasta', 'Deodorant', 'Sonnencreme SPF 50'],
  };

  if (hasBeach) {
    items['🏖️ Strand & Sommer'] = ['Badeanzug / Badehose', 'Schnorchel-Set', 'Strandtuch', 'Mückenspray'];
  }
  if (hasHike) {
    items['🥾 Outdoor'] = ['Wanderschuhe', 'Rucksack (20–30L)', 'Wandersocken', 'Regenschutz'];
  }
  if (hasCity || hasCulture) {
    items['🏙️ Stadtbesuch'] = ['Stadtplan oder Offline-Karte', 'Beutel / Tagesrucksack', 'Kamera oder gutes Handy'];
  }
  if (isAsia) {
    items['🌏 Asien-Tipps'] = ['Bargeld (Lokale Währung)', 'Stäbchen-Etikette beachten', 'Leichte Kleidung zum Bedecken (Tempel)', 'Magenmittel'];
  }
  if (isDubai) {
    items['🕌 Dubai-Tipps'] = ['Bedeckende Kleidung für Moscheen', 'Sonnenschutz für extreme Hitze', 'Kopfbedeckung'];
  }

  return items;
}

const CURRENCY_MAP = {
  'thailand': { code: 'THB', symbol: '฿', name: 'Thail. Baht' },
  'bangkok': { code: 'THB', symbol: '฿', name: 'Thail. Baht' },
  'chiang mai': { code: 'THB', symbol: '฿', name: 'Thail. Baht' },
  'bali': { code: 'IDR', symbol: 'Rp', name: 'Indonesische Rupiah' },
  'tokio': { code: 'JPY', symbol: '¥', name: 'Japanischer Yen' },
  'kyoto': { code: 'JPY', symbol: '¥', name: 'Japanischer Yen' },
  'japan': { code: 'JPY', symbol: '¥', name: 'Japanischer Yen' },
  'singapur': { code: 'SGD', symbol: 'S$', name: 'Singapur-Dollar' },
  'hanoi': { code: 'VND', symbol: '₫', name: 'Vietn. Dong' },
  'vietnam': { code: 'VND', symbol: '₫', name: 'Vietn. Dong' },
  'new york': { code: 'USD', symbol: '$', name: 'US-Dollar' },
  'miami': { code: 'USD', symbol: '$', name: 'US-Dollar' },
  'los angeles': { code: 'USD', symbol: '$', name: 'US-Dollar' },
  'usa': { code: 'USD', symbol: '$', name: 'US-Dollar' },
  'mexiko': { code: 'MXN', symbol: 'MX$', name: 'Mexikan. Peso' },
  'havanna': { code: 'CUP', symbol: '$', name: 'Kuba-Peso' },
  'buenos aires': { code: 'ARS', symbol: '$', name: 'Argent. Peso' },
  'dubai': { code: 'AED', symbol: 'د.إ', name: 'Emiratischer Dirham' },
  'marrakesch': { code: 'MAD', symbol: 'MAD', name: 'Marokkan. Dirham' },
  'kapstadt': { code: 'ZAR', symbol: 'R', name: 'Südafr. Rand' },
  'malediven': { code: 'MVR', symbol: 'Rf', name: 'Malediv. Rufiyaa' },
  'london': { code: 'GBP', symbol: '£', name: 'Britisches Pfund' },
  'edinburgh': { code: 'GBP', symbol: '£', name: 'Britisches Pfund' },
  'jordanien': { code: 'JOD', symbol: 'JD', name: 'Jordan. Dinar' },
};

function CurrencyConverter({ destination }) {
  const [rate, setRate] = useState(null);
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    const dest = destination.toLowerCase();
    const found = Object.entries(CURRENCY_MAP).find(([key]) => dest.includes(key));
    if (!found) return;
    const cur = found[1];
    setCurrency(cur);
    fetch(`https://api.frankfurter.app/latest?from=EUR&to=${cur.code}`)
      .then(r => r.json())
      .then(data => { if (data.rates?.[cur.code]) setRate(data.rates[cur.code]); })
      .catch(() => {});
  }, [destination]);

  if (!currency || !rate) return null;

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>💱 Währungsrechner</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <input
          type="number"
          value={amount}
          min={1}
          onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          style={{ width: 80, border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 10px', fontSize: 16, fontWeight: 700, color: '#0f172a', outline: 'none', background: '#f8fafc' }}
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>€ Euro =</span>
      </div>
      <div style={{ background: 'linear-gradient(135deg,#eff6ff,#e0f2fe)', borderRadius: 14, padding: '14px 18px' }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>
          {(amount * rate).toLocaleString('de-DE', { maximumFractionDigits: 0 })} {currency.symbol}
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{currency.name} · 1€ ≈ {rate.toLocaleString('de-DE', { maximumFractionDigits: 2 })} {currency.symbol}</div>
      </div>
    </div>
  );
}

function TravelChecklist({ destination }) {
  const [open, setOpen] = useState(false);
  const dest = destination.toLowerCase();

  const items = [];

  // Visum
  if (/usa|new york|miami|los angeles|las vegas|chicago|san francisco/.test(dest))
    items.push({ cat: '🛂 Einreise', text: 'ESTA benötigt (~21€) — mind. 72h vor Abflug online beantragen', urgent: true });
  else if (/kanada/.test(dest))
    items.push({ cat: '🛂 Einreise', text: 'eTA benötigt (~7 CAD) — online vor dem Flug', urgent: true });
  else if (/australien/.test(dest))
    items.push({ cat: '🛂 Einreise', text: 'ETA oder eVisitor Visum benötigt (kostenlos)', urgent: true });
  else if (/indien/.test(dest))
    items.push({ cat: '🛂 Einreise', text: 'e-Visum benötigt (~25€) — mind. 4 Tage vor Einreise', urgent: true });
  else if (/vietnam/.test(dest))
    items.push({ cat: '🛂 Einreise', text: 'Visum on Arrival möglich oder e-Visum (~25$)', urgent: true });
  else
    items.push({ cat: '🛂 Einreise', text: 'Kein Visum nötig (EU-Bürger, max. 90 Tage)', urgent: false });

  // Impfungen
  if (/thailand|bali|vietnam|kambodscha|indien|nepal|marrakesch|peru|brasilien|mexiko|havanna|kapstadt/.test(dest))
    items.push({ cat: '💉 Impfungen', text: 'Hepatitis A + Typhus empfohlen — Arzt 4–6 Wochen vor Reise aufsuchen', urgent: true });
  else
    items.push({ cat: '💉 Impfungen', text: 'Standardimpfungen ausreichend (Tetanus, Masern aktuell?)', urgent: false });

  // Stecker
  if (/usa|new york|miami|kanada|mexiko|japan|tokio|kyoto/.test(dest))
    items.push({ cat: '🔌 Stecker', text: 'Typ A/B (US-Flachstecker) — Reiseadapter mitbringen', urgent: false });
  else if (/london|edinburgh|uk|irland|singapur|hongkong|dubai|malediven/.test(dest))
    items.push({ cat: '🔌 Stecker', text: 'Typ G (3 eckige Pins, UK) — Adapter nötig', urgent: false });
  else if (/australien|neuseeland/.test(dest))
    items.push({ cat: '🔌 Stecker', text: 'Typ I (australischer Stecker) — Adapter nötig', urgent: false });
  else
    items.push({ cat: '🔌 Stecker', text: 'Kein Adapter nötig (Typ C/E/F wie in Deutschland)', urgent: false });

  // Krankenversicherung
  if (/usa|kanada|australien|japan/.test(dest))
    items.push({ cat: '🏥 Krankenversicherung', text: 'Private Auslandskrankenversicherung dringend empfohlen — Behandlung sehr teuer!', urgent: true });
  else if (/thailand|bali|vietnam|indien|marrakesch/.test(dest))
    items.push({ cat: '🏥 Krankenversicherung', text: 'Auslandskrankenversicherung empfohlen (~5–10€/Woche)', urgent: false });
  else
    items.push({ cat: '🏥 Krankenversicherung', text: 'EHIC-Karte (europ. Krankenversichertenkarte) gilt in EU-Ländern', urgent: false });

  // Währung
  const hasCash = /japan|tokio|marrakesch|vietnam|indien|bali/.test(dest);
  if (hasCash)
    items.push({ cat: '💵 Bargeld', text: 'Lokale Währung empfohlen — Kreditkarte nicht überall akzeptiert', urgent: false });

  return (
    <div style={{ background: '#fff', borderRadius: 20, marginTop: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'none', border: 'none', padding: '18px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>✅ Einreise-Checkliste für {destination}</span>
        <span style={{ fontSize: 20, color: '#94a3b8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              background: item.urgent ? '#fff7ed' : '#f8fafc',
              border: `1px solid ${item.urgent ? '#fed7aa' : '#e2e8f0'}`,
              borderRadius: 12, padding: '12px 14px',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.urgent ? '⚠️' : '✓'}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: item.urgent ? '#c2410c' : '#475569', marginBottom: 2 }}>{item.cat}</div>
                <div style={{ fontSize: 13, color: item.urgent ? '#7c2d12' : '#334155' }}>{item.text}</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            ℹ️ Angaben ohne Gewähr — bitte offizielle Quellen prüfen.
          </div>
        </div>
      )}
    </div>
  );
}

const WEATHER_ICONS = { 0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌧️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'❄️',73:'❄️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',85:'❄️',86:'❄️',95:'⛈️',96:'⛈️',99:'⛈️' };

function WeatherAndMap({ destination, travelDate }) {
  const [geo, setGeo] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLabel, setWeatherLabel] = useState('');
  const abortRef = useRef(null);

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    async function load() {
      try {
        const gRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=de`,
          { signal }
        );
        const gData = await gRes.json();
        const loc = gData.results?.[0];
        if (!loc) return;
        setGeo(loc);

        const baseUrl = `latitude=${loc.latitude}&longitude=${loc.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
        let wData;

        if (travelDate) {
          const today = new Date();
          const travel = new Date(travelDate + 'T12:00:00');
          const daysUntil = Math.round((travel - today) / 86400000);

          if (daysUntil > 0 && daysUntil <= 14) {
            const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?${baseUrl}&forecast_days=16`, { signal });
            const raw = await wRes.json();
            const idx = raw.daily.time?.indexOf(travelDate) ?? daysUntil;
            const start = Math.max(0, idx - 1);
            const slice = (arr) => arr?.slice(start, start + 5) ?? [];
            wData = { time: slice(raw.daily.time), temperature_2m_max: slice(raw.daily.temperature_2m_max), temperature_2m_min: slice(raw.daily.temperature_2m_min), weathercode: slice(raw.daily.weathercode) };
            setWeatherLabel('Vorhersage für deine Reise');
          } else if (daysUntil > 14) {
            const lastYear = new Date(travel);
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            const fmt = (d) => d.toISOString().split('T')[0];
            const wRes = await fetch(
              `https://archive-api.open-meteo.com/v1/archive?${baseUrl}&start_date=${fmt(lastYear)}&end_date=${fmt(new Date(lastYear.getTime() + 4 * 86400000))}`,
              { signal }
            );
            wData = (await wRes.json()).daily;
            setWeatherLabel(`Typisches Klima im ${travel.toLocaleDateString('de-DE', { month: 'long' })}`);
          }
        }

        if (!wData) {
          const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?${baseUrl}&forecast_days=5`, { signal });
          wData = (await wRes.json()).daily;
          setWeatherLabel('Wetter diese Woche');
        }

        setWeather(wData);
      } catch (e) {
        if (e.name !== 'AbortError') console.warn('Weather fetch failed', e);
      }
    }
    load();
    return () => abortRef.current?.abort();
  }, [destination, travelDate]);

  if (!geo) return null;

  const days = ['So','Mo','Di','Mi','Do','Fr','Sa'];

  return (
    <div style={{ marginTop: 14 }}>
      {/* Wetter */}
      {weather && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>🌤️ Wetter in {destination}</div>
            {weatherLabel && <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{weatherLabel}</div>}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
            {weather.time?.slice(0, 5).map((date, i) => {
              const d = new Date(date);
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>{days[d.getDay()]}</div>
                  <div style={{ fontSize: 20 }}>{WEATHER_ICONS[weather.weathercode?.[i]] || '🌤️'}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{Math.round(weather.temperature_2m_max?.[i])}°</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{Math.round(weather.temperature_2m_min?.[i])}°</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Karte */}
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
        <iframe
          title={`Karte ${destination}`}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${geo.longitude - 0.15},${geo.latitude - 0.15},${geo.longitude + 0.15},${geo.latitude + 0.15}&layer=mapnik&marker=${geo.latitude},${geo.longitude}`}
          style={{ width: '100%', height: 200, border: 'none', display: 'block' }}
          loading="lazy"
        />
        <div style={{ padding: '10px 16px' }}>
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(destination)}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            In Google Maps öffnen →
          </a>
        </div>
      </div>
    </div>
  );
}

function PackingList({ plan }) {
  const [open, setOpen] = useState(false);
  const items = generatePacklist(plan);
  return (
    <div style={{ background: '#fff', borderRadius: 20, marginTop: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'none', border: 'none', padding: '18px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>🎒 Packliste für {plan.destination}</span>
        <span style={{ fontSize: 20, color: '#94a3b8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {Object.entries(items).map(([cat, list]) => (
            <div key={cat}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>{cat}</div>
              {list.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid #cbd5e1', flexShrink: 0, display: 'inline-block' }} />
                  <a href={getAmazonLink(item)} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: '#334155', textDecoration: 'none', flex: 1 }}
                    title="Bei Amazon suchen">
                    {item}
                    <span style={{ fontSize: 10, color: '#f97316', marginLeft: 6, fontWeight: 700 }}>Amazon →</span>
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


const TYPE_ICONS = {
  sehenswuerdigkeit: '🏛️',
  restaurant: '🍽️',
  hotel: '🏨',
  transport: '🚌',
  aktivitaet: '🎯',
  strand: '🏖️',
  shopping: '🛍️',
  nachtleben: '🎉',
};

function Slot({ slot, isLast, destination }) {
  const icon = TYPE_ICONS[slot.type] || '📍';
  return (
    <div style={{ display: 'flex', gap: 16, paddingBottom: isLast ? 0 : 22 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 44, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 5, whiteSpace: 'nowrap' }}>{slot.time}</div>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0,
        }}>{icon}</div>
        {!isLast && <div style={{ width: 1, flex: 1, background: '#e2e8f0', marginTop: 6 }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{slot.name}</span>
            {slot.tiktokWorthy && (
              <span style={{ background: '#000', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20, letterSpacing: '0.3px' }}>TikTok</span>
            )}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>~{slot.cost}€</span>
        </div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55, marginBottom: 6 }}>{slot.description}</div>
        {slot.area && (
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
            📍 {slot.area}
          </div>
        )}
        {slot.openingHours && (
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5 }}>
            🕐 {slot.openingHours}{slot.duration && ` · ⏱ ${slot.duration}`}
          </div>
        )}
        {slot.mustTry && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#92400e', display: 'inline-block', marginBottom: 5 }}>
            ⭐ {slot.mustTry}
          </div>
        )}
        {slot.tips && (
          <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '5px 10px', fontSize: 12, color: '#166534' }}>
            💡 {slot.tips}
          </div>
        )}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((slot.name || '') + (destination ? ' ' + destination : ''))}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: '#2563eb', marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 600 }}
        >
          🗺️ In Maps öffnen
        </a>
      </div>
    </div>
  );
}

function DayCard({ day, destination }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: 14, overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '1px', marginBottom: 2 }}>TAG {day.dayNumber}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{day.title}</div>
          {day.theme && <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{day.theme}</div>}
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '8px 14px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 1 }}>Kosten</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>~{day.dailyCostEstimate}€</div>
        </div>
      </div>
      <div style={{ padding: '20px 24px' }}>
        {day.slots?.map((slot, i) => (
          <Slot key={i} slot={slot} isLast={i === day.slots.length - 1} destination={destination} />
        ))}
      </div>
      {day.hiddenGem && (
        <div style={{ margin: '0 20px 20px', background: 'linear-gradient(135deg,#fdf4ff,#fae8ff)', borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 18 }}>💎</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', marginBottom: 2, letterSpacing: '0.5px' }}>GEHEIMTIPP</div>
            <div style={{ fontSize: 13, color: '#4c1d95' }}>{day.hiddenGem}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIItinerary({ plan, onBack, onNewTrip, onHome, onRegenerate, onRegenerateWithBudget }) {
  const isMobile = useIsMobile();
  const [toast, setToast] = useState('');

  // Animierte Budget-Zahlen
  const animTotal = useCountUp(plan?.costs?.gesamt || 0);
  const animTransport = useCountUp(plan?.costs?.transport || 0);
  const animHotel = useCountUp(plan?.costs?.hotel || 0);
  const animEssen = useCountUp(plan?.costs?.essen || 0);
  const animAktiv = useCountUp(plan?.costs?.aktivitaeten || 0);
  const [sidebarBudget, setSidebarBudget] = useState(plan?.budget || 1000);
  const [rating, setRating] = useState(() => {
    try {
      const ratings = JSON.parse(localStorage.getItem('tripai_ratings') || '{}');
      return ratings[plan?.destination] || 0;
    } catch { return 0; }
  });
  const [isFav, setIsFav] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('tripai_favorites') || '[]');
      return favs.some(f => f.destination === plan?.destination);
    } catch { return false; }
  });

  if (!plan) return null;

  const overBudget = plan.costs?.gesamt > plan.budget;
  const diff = Math.abs(plan.budget - (plan.costs?.gesamt || 0));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleShare = () => {
    const params = new URLSearchParams({ dest: plan.destination });
    const url = `https://tripai-omega.vercel.app/?${params.toString()}`;
    navigator.clipboard?.writeText(url).then(() => showToast('🔗 Link kopiert!'));
  };

  const handlePrint = () => window.print();

  const handleRating = (stars) => {
    setRating(stars);
    try {
      const ratings = JSON.parse(localStorage.getItem('tripai_ratings') || '{}');
      ratings[plan.destination] = stars;
      localStorage.setItem('tripai_ratings', JSON.stringify(ratings));
    } catch {}
    showToast(`${'⭐'.repeat(stars)} Danke für deine Bewertung!`);
  };

  const handleFavorite = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('tripai_favorites') || '[]');
      if (isFav) {
        const updated = favs.filter(f => f.destination !== plan.destination);
        localStorage.setItem('tripai_favorites', JSON.stringify(updated));
        setIsFav(false);
        showToast('💔 Aus Favoriten entfernt');
      } else {
        favs.unshift({ destination: plan.destination, emoji: plan.emoji, days: plan.days?.length, persons: plan.persons, budget: plan.budget, date: new Date().toLocaleDateString('de-DE'), fullPlan: plan });
        localStorage.setItem('tripai_favorites', JSON.stringify(favs.slice(0, 20)));
        setIsFav(true);
        showToast('❤️ Zu Favoriten hinzugefügt!');
      }
    } catch { showToast('Fehler beim Speichern'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* HEADER */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ width: '100%', height: 220, background: 'linear-gradient(135deg,#1e3a5f 0%,#1a3580 40%,#2563eb 75%,#0ea5e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(14,165,233,0.15)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', pointerEvents: 'none' }} />
          <span style={{ fontSize: 90, filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.35))', position: 'relative', zIndex: 1 }}>{plan.emoji || '✈️'}</span>
        </div>
        <div style={{ padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <button onClick={onBack} style={{
              background: 'none', border: 'none', color: '#94a3b8', fontSize: 13,
              fontWeight: 600, cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              ← Zur Startseite
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 44, lineHeight: 1 }}>{plan.emoji || '✈️'}</span>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>{plan.destination}</h1>
                <p style={{ color: '#94a3b8', marginTop: 4, fontSize: 14 }}>
                  {plan.days?.length} Tage · {plan.persons} {plan.persons === 1 ? 'Person' : 'Personen'}
                  {plan.departureCity && <> · 🛫 ab {plan.departureCity}</>}
                  {plan.travelDate && <> · 📅 {new Date(plan.travelDate + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</>}
                  {' '}· ✨ KI-Reiseplan
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {plan.withChildren && (
                    <span style={{ background: '#fef9c3', color: '#854d0e', borderRadius: 50, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                      👨‍👩‍👧 Familienreise{plan.childrenAges?.length > 0 ? ` · ${plan.childrenAges.map(a => ({ baby:'0–2', kleinkind:'3–6', schulkind:'7–12', teenager:'13–17' })[a] || a).join(', ')} Jahre` : ''}
                    </span>
                  )}
                  {plan.isRoundtrip && plan.roundtripCities?.length > 0 && (
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: 50, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                      🗺️ {plan.roundtripCities.map(c => c.city).filter(Boolean).join(' → ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={handleFavorite} style={{ background: isFav ? '#fff1f2' : '#f8fafc', border: `1px solid ${isFav ? '#fecaca' : '#e2e8f0'}`, borderRadius: 50, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: isFav ? '#dc2626' : '#64748b', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                {isFav ? '❤️' : '🤍'} {isFav ? 'Gespeichert' : 'Speichern'}
              </button>
              <button onClick={handleShare} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 50, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                🔗 Teilen
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Schau dir meinen ${plan.days?.length}-Tage Reiseplan für ${plan.destination} an! 🌍✈️\nhttps://tripai-omega.vercel.app/?dest=${encodeURIComponent(plan.destination)}`)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 50, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', transition: 'all 0.2s' }}>
                💬 WhatsApp
              </a>
              <button onClick={handlePrint} className="no-print" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 50, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                📄 PDF
              </button>
              <div style={{ background: overBudget ? '#fff1f2' : '#f0fdf4', border: `1px solid ${overBudget ? '#fecaca' : '#86efac'}`, borderRadius: 50, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>{overBudget ? '⚠️' : '✅'}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: overBudget ? '#dc2626' : '#16a34a' }}>
                  {overBudget ? `${diff.toLocaleString('de-DE')}€ über Budget` : `${diff.toLocaleString('de-DE')}€ gespart`}
                </span>
              </div>
            </div>

            {/* Toast */}
            {toast && (
              <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '12px 24px', borderRadius: 50, fontSize: 14, fontWeight: 700, zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', animation: 'slideIn 0.3s ease' }}>
                {toast}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 300px', gap: 24, alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div>

            {/* Flights */}
            {plan.flights?.length > 0 && (
              <section style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
                  ✈️ Flugoptionen
                  {plan.departureCity && (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginLeft: 10 }}>
                      {plan.departureCity} → {plan.destination}
                    </span>
                  )}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.flights.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: 14, padding: '14px 18px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{f.airline}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{f.type} · {f.duration}</div>
                        {f.tip && <div style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>💡 {f.tip}</div>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>ab</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#2563eb' }}>{f.priceFrom}€</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hotels */}
            {plan.hotels?.length > 0 && (
              <section style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>🏨 Hotelempfehlungen</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.hotels.map((h, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      background: i === 0 ? '#eff6ff' : '#f8fafc',
                      borderRadius: 14, padding: '14px 18px',
                      border: i === 0 ? '1.5px solid #bfdbfe' : 'none',
                      position: 'relative',
                    }}>
                      {i === 0 && (
                        <div style={{ position: 'absolute', top: -9, left: 14, background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10, letterSpacing: '0.5px' }}>
                          TOP EMPFEHLUNG
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{h.name} {'⭐'.repeat(Math.min(h.stars || 3, 5))}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>📍 {h.location}</div>
                        {h.highlight && <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>{h.highlight}</div>}
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' Hotel ' + plan.destination)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#2563eb', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none', fontWeight: 600 }}>🗺️ In Maps öffnen</a>
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: 12, flexShrink: 0 }}>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>ab</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{h.pricePerNight}€</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>/Nacht</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Day by Day */}
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.3px' }}>
              📅 Tagesplan
            </h2>
            {plan.days?.map((day, i) => {
              const prevCity = i > 0 ? plan.days[i - 1].city : null;
              const cityChanged = day.city && prevCity && day.city !== prevCity;
              return (
                <Fragment key={i}>
                  {cityChanged && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', margin: '4px 0' }}>
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #e2e8f0, transparent)' }} />
                      <div style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)', color: '#fff', borderRadius: 50, padding: '6px 18px', fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                        ✈️ Weiterreise nach {day.city}
                      </div>
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, #e2e8f0, transparent)' }} />
                    </div>
                  )}
                  <DayCard day={day} destination={plan.isRoundtrip && day.city ? day.city : plan.destination} />
                </Fragment>
              );
            })}

            {/* Affiliate Links */}
            <AffiliateSection destination={plan.destination} persons={plan.persons} days={plan.days?.length} departureCity={plan.departureCity} />

            {/* TikTok Spots */}
            {plan.tiktokSpots?.length > 0 && (
              <section style={{ background: 'linear-gradient(135deg,#0f0f1a,#1e1b4b)', borderRadius: 20, padding: 24, marginTop: 16 }}>
                <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginBottom: 14 }}>📱 TikTok & Instagram Spots</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.tiktokSpots.map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>{s.reason}</div>
                      <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 4 }}>🕐 Beste Zeit: {s.bestTime}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hidden Gems */}
            {plan.hiddenGems?.length > 0 && (
              <section style={{ background: 'linear-gradient(135deg,#fdf4ff,#ede9fe)', borderRadius: 20, padding: 24, marginTop: 16, border: '1px solid #e9d5ff' }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#5b21b6', marginBottom: 14 }}>💎 Hidden Gems</h2>
                {plan.hiddenGems.map((g, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < plan.hiddenGems.length - 1 ? 16 : 0 }}>
                    <div style={{ width: 28, height: 28, background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#3b0764', fontSize: 14 }}>{g.name}</div>
                      <div style={{ fontSize: 13, color: '#4c1d95', marginTop: 2 }}>{g.description}</div>
                      <div style={{ fontSize: 12, color: '#7c3aed', marginTop: 3 }}>🗺️ {g.howToGet}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Tips */}
            {plan.tips?.length > 0 && (
              <section style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', borderRadius: 20, padding: 24, marginTop: 16, border: '1px solid #fde68a' }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#78350f', marginBottom: 14 }}>💡 Insider-Tipps</h2>
                {plan.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < plan.tips.length - 1 ? 10 : 0 }}>
                    <span style={{ color: '#f59e0b', fontWeight: 800, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 14, color: '#451a03' }}>{tip}</span>
                  </div>
                ))}
                {plan.savingTips && (
                  <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: '10px 14px', marginTop: 14, fontSize: 13, color: '#713f12' }}>
                    💰 <strong>Spartipp:</strong> {plan.savingTips}
                  </div>
                )}
              </section>
            )}
            {/* Packliste */}
            <PackingList plan={plan} />
            {/* Einreise-Checkliste */}
            <TravelChecklist destination={plan.destination} />

            {/* Sterne-Bewertung */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, marginTop: 16, textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>War dieser Plan hilfreich?</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => handleRating(star)} style={{
                    background: 'none', border: 'none', fontSize: 32, cursor: 'pointer',
                    opacity: rating >= star ? 1 : 0.25,
                    transform: rating >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s',
                    padding: '2px 4px',
                  }}>⭐</button>
                ))}
              </div>
              {rating > 0 && <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 10 }}>Danke! Du hast {rating} von 5 Sternen gegeben.</p>}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 80, order: isMobile ? -1 : 0 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 18 }}>💰 Budget-Übersicht</h3>

              <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 700, letterSpacing: '0.8px', marginBottom: 6 }}>GESCHÄTZTE KOSTEN</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                  {animTotal.toLocaleString('de-DE')}€
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
                  von {parseInt(plan.budget).toLocaleString('de-DE')}€ Budget
                </div>
              </div>

              {[
                ['✈️ Flüge', animTransport, plan.costs?.transport, '#3b82f6'],
                ['🏨 Hotel', animHotel, plan.costs?.hotel, '#8b5cf6'],
                ['🍽️ Essen', animEssen, plan.costs?.essen, '#f59e0b'],
                ['🎯 Aktivitäten', animAktiv, plan.costs?.aktivitaeten, '#10b981'],
              ].filter(([, , raw]) => raw > 0).map(([label, anim, raw, color]) => {
                const pct = Math.round((raw / (plan.costs?.gesamt || 1)) * 100);
                return (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: '#475569' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>
                        {anim.toLocaleString('de-DE')}€
                        <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 5 }}>{pct}%</span>
                      </span>
                    </div>
                    <div style={{ height: 10, background: '#f1f5f9', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <WeatherAndMap destination={plan.destination} travelDate={plan.travelDate} />
            <CurrencyConverter destination={plan.destination} />

            {/* Budget ändern & neu generieren */}
            {onRegenerateWithBudget && (
              <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>💰 Budget anpassen</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                  <span>300€</span>
                  <span style={{ fontWeight: 700, color: '#2563eb', fontSize: 14 }}>{sidebarBudget.toLocaleString('de-DE')}€</span>
                  <span>50.000€</span>
                </div>
                <input type="range" min={300} max={50000} step={500} value={sidebarBudget}
                  onChange={e => setSidebarBudget(parseInt(e.target.value))}
                  style={{ width: '100%', marginBottom: 12, accentColor: '#2563eb' }}
                />
                <button onClick={() => onRegenerateWithBudget(sidebarBudget)} style={{
                  width: '100%', background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd',
                  borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                  🔄 Mit {sidebarBudget.toLocaleString('de-DE')}€ neu generieren
                </button>
              </div>
            )}

            <button onClick={onNewTrip} style={{
              width: '100%', background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
              color: '#fff', border: 'none', borderRadius: 16, padding: '14px 20px',
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37,99,235,0.3)', marginBottom: 10,
            }}>
              ✈️ Neue Reise planen
            </button>
            {onRegenerate && (
              <button onClick={onRegenerate} style={{
                width: '100%', background: '#f8fafc', color: '#475569',
                border: '1px solid #e2e8f0', borderRadius: 16, padding: '12px 20px',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>
                🎲 Gleiche Reise neu generieren
              </button>
            )}
          </div>

        </div>
      </div>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @media print {
          nav, .no-print { display: none !important; }
          body { background: #fff !important; }
          * { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
