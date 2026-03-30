import { useState, useEffect } from 'react';
import AffiliateSection from './AffiliateSection';

function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
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

function Slot({ slot, isLast }) {
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
      </div>
    </div>
  );
}

function DayCard({ day }) {
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
          <Slot key={i} slot={slot} isLast={i === day.slots.length - 1} />
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

export default function AIItinerary({ plan, onBack, onNewTrip, onHome }) {
  const isMobile = useIsMobile();
  const [toast, setToast] = useState('');
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
    const text = `Ich habe meinen Reiseplan nach ${plan.destination} für ${plan.days?.length} Tage mit TripAI erstellt! ✈️ Kostenlos testen: https://tripai-omega.vercel.app`;
    navigator.clipboard?.writeText(text).then(() => showToast('📋 In Zwischenablage kopiert!'));
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
        favs.unshift({ destination: plan.destination, emoji: plan.emoji, days: plan.days?.length, persons: plan.persons, budget: plan.budget, date: new Date().toLocaleDateString('de-DE') });
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
        <img
          src={`https://source.unsplash.com/featured/1400x500?${encodeURIComponent(plan.destination + ' travel city')}`}
          alt={plan.destination}
          loading="lazy"
          onError={e => e.target.style.display = 'none'}
          style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
        />
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
                  {plan.days?.length} Tage · {plan.persons} {plan.persons === 1 ? 'Person' : 'Personen'} · ✨ KI-Reiseplan
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={handleFavorite} style={{ background: isFav ? '#fff1f2' : '#f8fafc', border: `1px solid ${isFav ? '#fecaca' : '#e2e8f0'}`, borderRadius: 50, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: isFav ? '#dc2626' : '#64748b', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                {isFav ? '❤️' : '🤍'} {isFav ? 'Gespeichert' : 'Speichern'}
              </button>
              <button onClick={handleShare} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 50, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                🔗 Teilen
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
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>✈️ Flugoptionen</h2>
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
            {plan.days?.map((day, i) => <DayCard key={i} day={day} />)}

            {/* Affiliate Links */}
            <AffiliateSection destination={plan.destination} persons={plan.persons} days={plan.days?.length} />

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
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 80, order: isMobile ? -1 : 0 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 18 }}>💰 Budget-Übersicht</h3>

              <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 700, letterSpacing: '0.8px', marginBottom: 6 }}>GESCHÄTZTE KOSTEN</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                  {plan.costs?.gesamt?.toLocaleString('de-DE')}€
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
                  von {parseInt(plan.budget).toLocaleString('de-DE')}€ Budget
                </div>
              </div>

              {[
                ['✈️ Flüge', plan.costs?.transport, '#3b82f6'],
                ['🏨 Hotel', plan.costs?.hotel, '#8b5cf6'],
                ['🍽️ Essen', plan.costs?.essen, '#f59e0b'],
                ['🎯 Aktivitäten', plan.costs?.aktivitaeten, '#10b981'],
              ].filter(([, amt]) => amt > 0).map(([label, amount, color]) => (
                <div key={label} style={{ marginBottom: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{amount?.toLocaleString('de-DE')}€</span>
                  </div>
                  <div style={{ height: 5, background: '#f1f5f9', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${Math.min((amount / (plan.costs?.gesamt || 1)) * 100, 100)}%`, background: color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onNewTrip} style={{
              width: '100%', background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
              color: '#fff', border: 'none', borderRadius: 16, padding: '14px 20px',
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
            }}>
              ✈️ Neue Reise planen
            </button>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}
