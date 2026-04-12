import { useState, useEffect, useRef } from 'react';
import useIsMobile from '../hooks/useIsMobile';

const TOP_CITIES = [
  'Bali','Tokio','Bangkok','Kyoto','Singapur','New York','Miami','Lissabon',
  'Porto','Barcelona','Amsterdam','Prag','Budapest','Wien','Santorini',
  'Marrakesch','Kapstadt','Dubai','Malediven','Kopenhagen','Stockholm',
  'Edinburgh','Florenz','Luzern','Reykjavik','Chiang Mai','Hanoi',
  'Mexiko-Stadt','Buenos Aires','Havanna','Kairo','Athen','Istanbul',
  'Rom','Paris','London','Berlin','Seoul','Ho-Chi-Minh-Stadt','Krakau',
  'Belgrad','Tiflis','Mallorca','Teneriffa','Gran Canaria','Dubrovnik',
  'Lanzarote','Hurghada','Sharm el-Sheikh','Antalya','Peking','Shanghai',
];

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

const AGE_GROUPS = [
  { id: 'baby',      label: '👶 0–2', desc: 'Kleinstkind' },
  { id: 'kleinkind', label: '🧒 3–6', desc: 'Kleinkind' },
  { id: 'schulkind', label: '🎒 7–12', desc: 'Schulkind' },
  { id: 'teenager',  label: '🧑 13–17', desc: 'Teenager' },
];

const hotelOptions = [
  { id: 'budget', label: 'Hostel', sub: 'ab 30€/Nacht', icon: '🏠' },
  { id: 'mittel', label: '3-Sterne', sub: 'ab 70€/Nacht', icon: '🏨' },
  { id: 'komfort', label: '4-Sterne', sub: 'ab 130€/Nacht', icon: '🏩' },
  { id: 'luxus', label: 'Luxus', sub: 'ab 250€/Nacht', icon: '👑' },
];

export default function PlannerForm({ defaultDestination, onGenerate, isLoading, error, onBack }) {
  const isMobile = useIsMobile();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const destRef = useRef(null);
  const [form, setForm] = useState({
    destination: defaultDestination || '',
    departureCity: '',
    days: 5,
    persons: 2,
    travelDate: '',
    budget: 1500,
    hotelCategory: 'mittel',
    interests: ['kultur', 'essen'],
    includeTiktok: true,
    includeHiddenGems: true,
    wishes: '',
    withChildren: false,
    childrenAges: [],
    isRoundtrip: false,
    roundtripCities: [{ city: '', nights: 2 }],
  });
  const [roundtripSuggestions, setRoundtripSuggestions] = useState({});

  useEffect(() => {
    if (defaultDestination) setForm(f => ({ ...f, destination: defaultDestination }));
  }, [defaultDestination]);

  const toggle = (id) => setForm(f => ({
    ...f,
    interests: f.interests.includes(id) ? f.interests.filter(x => x !== id) : [...f.interests, id],
  }));

  const suggestions = form.destination.length >= 2
    ? TOP_CITIES.filter(c => c.toLowerCase().startsWith(form.destination.toLowerCase())).slice(0, 5)
    : [];

  const submit = (e) => {
    e.preventDefault();
    if (!form.destination.trim() || isLoading) return;
    setShowSuggestions(false);
    onGenerate({ ...form, destination: form.destination.trim(), days: effectiveDays });
  };

  const totalRoundtripDays = form.roundtripCities.reduce((sum, c) => sum + (c.nights || 0), 0);
  const effectiveDays = form.isRoundtrip ? totalRoundtripDays : form.days;
  const budgetPerPerson = Math.round(form.budget / form.persons);

  return (
    <div style={{ minHeight: '100vh', background: '#eef2ff' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <button type="button" onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', fontSize: 13, fontWeight: 600,
            padding: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            ← Zurück zur Startseite
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 10, animation: 'float 3s ease-in-out infinite' }}>🌍</div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 6 }}>
              Wohin soll es gehen?
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15 }}>
              KI plant deinen Traumurlaub — jeden Ort der Welt
            </p>
          </div>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Destination — big & prominent */}
          <div ref={destRef} style={{ position: 'relative' }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '6px 8px 6px 20px',
            boxShadow: '0 2px 20px rgba(37,99,235,0.1)',
            display: 'flex', alignItems: 'center', gap: 12,
            border: `2px solid ${showSuggestions && suggestions.length ? '#2563eb' : 'transparent'}`,
            transition: 'border-color 0.2s',
          }}>
            <span style={{ fontSize: 20 }}>✈️</span>
            <input
              type="text"
              value={form.destination}
              onChange={e => { setForm(f => ({ ...f, destination: e.target.value })); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
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

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#fff', borderRadius: 16, marginTop: 6,
              boxShadow: '0 8px 32px rgba(37,99,235,0.15)',
              border: '1.5px solid #e0eaff',
              zIndex: 200, overflow: 'hidden',
            }}>
              {suggestions.map(city => (
                <button
                  key={city}
                  type="button"
                  onMouseDown={() => {
                    setForm(f => ({ ...f, destination: city }));
                    setShowSuggestions(false);
                  }}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none',
                    border: 'none', padding: '12px 20px', cursor: 'pointer',
                    fontSize: 15, fontWeight: 600, color: '#0f172a',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'background 0.1s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ fontSize: 18 }}>📍</span> {city}
                </button>
              ))}
            </div>
          )}
          </div>

          {/* Departure City */}
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '6px 8px 6px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', gap: 12,
            border: '2px solid transparent', transition: 'border-color 0.2s',
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = '#2563eb'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <span style={{ fontSize: 20 }}>🛫</span>
            <input
              type="text"
              value={form.departureCity}
              onChange={e => setForm(f => ({ ...f, departureCity: e.target.value }))}
              placeholder="Abflugstadt (optional) — z.B. München, Berlin…"
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 15, fontWeight: 500, color: '#0f172a',
                background: 'transparent', padding: '14px 0',
              }}
            />
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
                {form.isRoundtrip ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#2563eb', minWidth: 28, textAlign: 'center' }}>{totalRoundtripDays}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>aus<br/>Rundreise</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button type="button" onClick={() => setForm(f => ({ ...f, days: Math.max(2, f.days - 1) }))} style={stepBtn}>−</button>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', minWidth: 28, textAlign: 'center' }}>{form.days}</span>
                    <button type="button" onClick={() => setForm(f => ({ ...f, days: Math.min(21, f.days + 1) }))} style={stepBtn}>+</button>
                  </div>
                )}
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

          {/* Travel Date */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 14 }}>
              REISEDATUM <span style={{ fontWeight: 400, color: '#cbd5e1' }}>(optional)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>📅</span>
              <input
                type="date"
                value={form.travelDate}
                onChange={e => setForm(f => ({ ...f, travelDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 12,
                  padding: '10px 14px', fontSize: 15, color: form.travelDate ? '#0f172a' : '#94a3b8',
                  outline: 'none', background: '#f8fafc', fontFamily: 'inherit',
                  cursor: 'pointer', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              {form.travelDate && (
                <button type="button" onClick={() => setForm(f => ({ ...f, travelDate: '' }))} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', fontSize: 18, padding: 4,
                }}>✕</button>
              )}
            </div>
            {form.travelDate && (
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 8, marginLeft: 32 }}>
                📍 KI berücksichtigt Saison, Wetter & Öffnungszeiten für dieses Datum
              </div>
            )}
          </div>

          {/* Rundreise */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <button type="button" onClick={() => setForm(f => ({ ...f, isRoundtrip: !f.isRoundtrip }))} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              background: form.isRoundtrip ? '#eff6ff' : '#f8fafc',
              border: `2px solid ${form.isRoundtrip ? '#2563eb' : '#e2e8f0'}`,
              borderRadius: 14, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 22 }}>🗺️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: form.isRoundtrip ? '#1d4ed8' : '#374151' }}>Rundreise / Mehrere Städte</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Plane eine Route durch mehrere Städte</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: form.isRoundtrip ? '#2563eb' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                {form.isRoundtrip && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
              </div>
            </button>

            {form.isRoundtrip && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                  ✈️ Startort: <strong style={{ color: '#0f172a' }}>{form.destination || '—'}</strong> (oben eingeben)
                </div>
                {form.roundtripCities.map((cityEntry, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <input
                          type="text"
                          value={cityEntry.city}
                          onChange={e => {
                            const updated = [...form.roundtripCities];
                            updated[idx] = { ...updated[idx], city: e.target.value };
                            setForm(f => ({ ...f, roundtripCities: updated }));
                            setRoundtripSuggestions(s => ({ ...s, [idx]: true }));
                          }}
                          onBlur={() => setTimeout(() => setRoundtripSuggestions(s => ({ ...s, [idx]: false })), 150)}
                          placeholder={`Stadt ${idx + 1}…`}
                          style={{
                            width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 12,
                            padding: '10px 14px', fontSize: 14, outline: 'none',
                            background: '#f8fafc', fontFamily: 'inherit', boxSizing: 'border-box',
                          }}
                          onFocus={e => { e.target.style.borderColor = '#2563eb'; setRoundtripSuggestions(s => ({ ...s, [idx]: true })); }}
                        />
                        {roundtripSuggestions[idx] && cityEntry.city.length >= 2 && (() => {
                          const sugg = TOP_CITIES.filter(c => c.toLowerCase().startsWith(cityEntry.city.toLowerCase())).slice(0, 4);
                          return sugg.length > 0 ? (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 12, marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid #e0eaff', zIndex: 200, overflow: 'hidden' }}>
                              {sugg.map(city => (
                                <button key={city} type="button" onMouseDown={() => {
                                  const updated = [...form.roundtripCities];
                                  updated[idx] = { ...updated[idx], city };
                                  setForm(f => ({ ...f, roundtripCities: updated }));
                                  setRoundtripSuggestions(s => ({ ...s, [idx]: false }));
                                }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 14px', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#0f172a' }}
                                  onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
                                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                                >
                                  📍 {city}
                                </button>
                              ))}
                            </div>
                          ) : null;
                        })()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <button type="button" onClick={() => { const u = [...form.roundtripCities]; u[idx] = { ...u[idx], nights: Math.max(1, u[idx].nights - 1) }; setForm(f => ({ ...f, roundtripCities: u })); }} style={stepBtn}>−</button>
                        <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 800, fontSize: 15 }}>{cityEntry.nights}</span>
                        <button type="button" onClick={() => { const u = [...form.roundtripCities]; u[idx] = { ...u[idx], nights: Math.min(14, u[idx].nights + 1) }; setForm(f => ({ ...f, roundtripCities: u })); }} style={stepBtn}>+</button>
                        <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 2 }}>Nächte</span>
                      </div>
                      {form.roundtripCities.length > 1 && (
                        <button type="button" onClick={() => setForm(f => ({ ...f, roundtripCities: f.roundtripCities.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: 16, padding: 4, flexShrink: 0 }}>🗑</button>
                      )}
                    </div>
                  </div>
                ))}
                {form.roundtripCities.length < 4 && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, roundtripCities: [...f.roundtripCities, { city: '', nights: 2 }] }))} style={{ background: 'none', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '10px', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', transition: 'border-color 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#2563eb'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  >
                    + Weitere Stadt hinzufügen
                  </button>
                )}
                {totalRoundtripDays > 0 && (
                  <div style={{ background: '#eff6ff', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#1d4ed8', fontWeight: 700, textAlign: 'center' }}>
                    📅 {totalRoundtripDays} Nächte gesamt · {form.roundtripCities.filter(c => c.city).map(c => c.city).join(' → ')}
                  </div>
                )}
              </div>
            )}
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
            <input type="range" min="300" max="50000" step="500"
              value={form.budget}
              onChange={e => setForm(f => ({ ...f, budget: parseInt(e.target.value) }))}
              onInput={e => setForm(f => ({ ...f, budget: parseInt(e.target.value) }))}
              style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#cbd5e1' }}>300€</span>
              <span style={{ fontSize: 11, color: '#cbd5e1' }}>50.000€</span>
            </div>
          </div>

          {/* Hotel */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 14 }}>UNTERKUNFT</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 8 }}>
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

          {/* Mit Kindern */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <button type="button" onClick={() => setForm(f => ({ ...f, withChildren: !f.withChildren, childrenAges: [] }))} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              background: form.withChildren ? '#fefce8' : '#f8fafc',
              border: `2px solid ${form.withChildren ? '#ca8a04' : '#e2e8f0'}`,
              borderRadius: 14, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 22 }}>👨‍👩‍👧</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: form.withChildren ? '#854d0e' : '#374151' }}>Mit Kindern reisen</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>KI empfiehlt kindergerechte Aktivitäten & Restaurants</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: form.withChildren ? '#ca8a04' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                {form.withChildren && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
              </div>
            </button>

            {form.withChildren && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 10 }}>ALTERSGRUPPEN (mehrere wählbar)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AGE_GROUPS.map(ag => {
                    const sel = form.childrenAges.includes(ag.id);
                    return (
                      <button key={ag.id} type="button" onClick={() => setForm(f => ({
                        ...f,
                        childrenAges: f.childrenAges.includes(ag.id)
                          ? f.childrenAges.filter(x => x !== ag.id)
                          : [...f.childrenAges, ag.id],
                      }))} style={{
                        padding: '8px 16px', borderRadius: 50, border: 'none',
                        background: sel ? '#ca8a04' : '#f1f5f9',
                        color: sel ? '#fff' : '#64748b',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: sel ? '0 3px 10px rgba(202,138,4,0.3)' : 'none',
                      }}>
                        {ag.label}
                        <span style={{ fontSize: 11, opacity: 0.75, marginLeft: 4 }}>{ag.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {form.childrenAges.length === 0 && (
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>Keine Auswahl = KI wählt allgemein familienfreundlich</div>
                )}
              </div>
            )}
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

          {/* Bottom submit */}
          <button type="submit" disabled={isLoading || !form.destination.trim()} style={{
            background: isLoading ? '#93c5fd' : 'linear-gradient(135deg,#2563eb,#0ea5e9)',
            color: '#fff', border: 'none', borderRadius: 16,
            padding: '18px', fontWeight: 800, fontSize: 17,
            cursor: isLoading ? 'wait' : 'pointer',
            boxShadow: isLoading ? 'none' : '0 6px 20px rgba(37,99,235,0.4)',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10,
          }}>
            {isLoading
              ? <><span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span> Plan wird erstellt…</>
              : <>✨ Reiseplan erstellen →</>}
          </button>

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
