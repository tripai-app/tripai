import AdBanner from './AdBanner';
import AffiliateSection from './AffiliateSection';

function TimeSlot({ slot, index }) {
  const icons = {
    sehenswuerdigkeit: '🏛️',
    restaurant: '🍽️',
    hotel: '🏨',
    transport: '🚌',
    aktivitaet: '🎯',
    strand: '🏖️',
    shopping: '🛍️',
    nachtleben: '🎉',
  };
  const icon = icons[slot.type] || '📍';

  return (
    <div style={{
      display: 'flex', gap: 14, padding: '14px 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 6 }}>{slot.time}</div>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#eff6ff', border: '2px solid #bfdbfe',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>{icon}</div>
        {index < 99 && <div style={{ width: 2, flex: 1, background: '#e2e8f0', marginTop: 6, minHeight: 20 }} />}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{slot.name}</span>
              {slot.tiktokWorthy && (
                <span style={{ background: '#000', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
                  📱 TikTok
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 3, lineHeight: 1.5 }}>{slot.description}</div>

            {slot.openingHours && (
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>
                🕐 {slot.openingHours} · ⏱️ {slot.duration}
              </div>
            )}
            {slot.mustTry && (
              <div style={{ fontSize: 12, color: '#92400e', background: '#fef3c7', padding: '3px 8px', borderRadius: 6, marginTop: 5, display: 'inline-block' }}>
                ⭐ Unbedingt probieren: {slot.mustTry}
              </div>
            )}
            {slot.tips && (
              <div style={{ fontSize: 12, color: '#166534', background: '#f0fdf4', padding: '4px 10px', borderRadius: 6, marginTop: 6 }}>
                💡 {slot.tips}
              </div>
            )}
            {slot.guide && (
              <div style={{ fontSize: 12, color: '#1d4ed8', marginTop: 4 }}>
                👤 {slot.guide}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>~{slot.cost}€</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>p.P.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, persons }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 20, overflow: 'hidden',
    }}>
      {/* Day Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
        padding: '18px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>
            TAG {day.dayNumber}
          </div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{day.title}</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>{day.theme}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Tageskosten</div>
          <div style={{ color: '#fbbf24', fontSize: 20, fontWeight: 900 }}>~{day.dailyCostEstimate}€</div>
        </div>
      </div>

      {/* Time Slots */}
      <div style={{ padding: '4px 24px 8px' }}>
        {day.slots && day.slots.map((slot, i) => (
          <TimeSlot key={i} slot={slot} index={i} />
        ))}
      </div>

      {/* Hidden Gem */}
      {day.hiddenGem && (
        <div style={{
          margin: '0 16px 16px',
          background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)',
          border: '1px solid #e9d5ff',
          borderRadius: 12, padding: '12px 16px',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 18 }}>💎</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', marginBottom: 3 }}>GEHEIMTIPP DES TAGES</div>
            <div style={{ fontSize: 13, color: '#4c1d95' }}>{day.hiddenGem}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIItinerary({ plan, onBack, onNewTrip }) {
  if (!plan) return null;

  const overBudget = plan.costs?.gesamt > plan.budget;
  const savings = plan.budget - (plan.costs?.gesamt || 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* AD TOP */}
      <div style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="leaderboard" />
        </div>
      </div>

      {/* HERO */}
      <div style={{
        height: 300,
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #0ea5e9 100%)',
        display: 'flex', alignItems: 'flex-end', padding: '32px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', marginBottom: 16, backdropFilter: 'blur(4px)',
          }}>← Zurück</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 48 }}>{plan.emoji || '✈️'}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
                {plan.destination}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6, fontSize: 15 }}>
                {plan.days?.length} Tage · {plan.persons} {plan.persons === 1 ? 'Person' : 'Personen'} · KI-geplant ✨
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 28, alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            {/* Budget Status */}
            <div style={{
              background: overBudget ? '#fff1f2' : '#f0fdf4',
              border: `2px solid ${overBudget ? '#fecaca' : '#86efac'}`,
              borderRadius: 14, padding: '16px 20px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>{overBudget ? '⚠️' : '✅'}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: overBudget ? '#991b1b' : '#166534' }}>
                  {overBudget ? `Budget überschritten um ${Math.abs(savings).toLocaleString('de-DE')}€`
                    : `Du sparst ${savings.toLocaleString('de-DE')}€ — perfekt geplant!`}
                </div>
                <div style={{ fontSize: 13, color: overBudget ? '#dc2626' : '#16a34a', marginTop: 2 }}>
                  KI-Schätzung: <strong>{plan.costs?.gesamt?.toLocaleString('de-DE')}€</strong> von {parseInt(plan.budget).toLocaleString('de-DE')}€
                </div>
              </div>
            </div>

            {/* Flights */}
            {plan.flights && plan.flights.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>✈️ Flugoptionen</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.flights.map((flight, i) => (
                    <div key={i} style={{
                      background: '#f8fafc', borderRadius: 12, padding: '14px 16px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      border: '1px solid #e2e8f0',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{flight.airline}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{flight.type} · {flight.duration}</div>
                        {flight.tip && <div style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>💡 {flight.tip}</div>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>ab</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#2563eb' }}>{flight.priceFrom}€</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {plan.hotels && plan.hotels.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>🏨 Hotelempfehlungen</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.hotels.map((hotel, i) => (
                    <div key={i} style={{
                      background: '#f8fafc', borderRadius: 12, padding: '14px 16px',
                      border: i === 0 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      position: 'relative',
                    }}>
                      {i === 0 && (
                        <div style={{ position: 'absolute', top: -10, left: 16, background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                          EMPFOHLEN
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>
                            {hotel.name} {'⭐'.repeat(hotel.stars || 3)}
                          </div>
                          <div style={{ fontSize: 13, color: '#64748b' }}>📍 {hotel.location}</div>
                          <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{hotel.highlight}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>ab</div>
                          <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{hotel.pricePerNight}€</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>/ Nacht</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day by Day */}
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 20, letterSpacing: '-0.3px' }}>
              📅 Dein Tagesplan
            </h2>
            {plan.days && plan.days.map((day, i) => (
              <DayCard key={i} day={day} persons={plan.persons} />
            ))}

            {/* Affiliate */}
            <AffiliateSection destination={plan.destination} persons={plan.persons} days={plan.days?.length} />

            <div style={{ margin: '24px 0' }}><AdBanner size="horizontal" /></div>

            {/* TikTok Spots */}
            {plan.tiktokSpots && plan.tiktokSpots.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #000, #1a1a2e)',
                borderRadius: 18, padding: 24, marginBottom: 20,
              }}>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                  📱 TikTok & Instagram Spots
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.tiktokSpots.map((spot, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{spot.name}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{spot.reason}</div>
                      <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 4 }}>🕐 Beste Zeit: {spot.bestTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Gems */}
            {plan.hiddenGems && plan.hiddenGems.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #fdf4ff, #ede9fe)',
                borderRadius: 18, padding: 24, marginBottom: 20,
                border: '1px solid #ddd6fe',
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#5b21b6', marginBottom: 16 }}>
                  💎 Hidden Gems — Geheimtipps
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {plan.hiddenGems.map((gem, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 32, height: 32, background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#3b0764', fontSize: 14 }}>{gem.name}</div>
                        <div style={{ fontSize: 13, color: '#4c1d95', marginTop: 2 }}>{gem.description}</div>
                        <div style={{ fontSize: 12, color: '#7c3aed', marginTop: 3 }}>🗺️ {gem.howToGet}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {plan.tips && plan.tips.length > 0 && (
              <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderRadius: 16, padding: 24, border: '1px solid #fde68a' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#78350f', marginBottom: 16 }}>💡 Insider-Tipps</h3>
                {plan.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <span style={{ color: '#f59e0b', fontWeight: 800 }}>→</span>
                    <span style={{ fontSize: 14, color: '#451a03' }}>{tip}</span>
                  </div>
                ))}
                {plan.savingTips && (
                  <div style={{ background: '#fef9c3', borderRadius: 10, padding: '10px 14px', marginTop: 12, fontSize: 13, color: '#713f12' }}>
                    💰 <strong>Spartipp:</strong> {plan.savingTips}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ position: 'sticky', top: 88 }}>
            {/* Budget Card */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>💰 Budget-Übersicht</h3>
              <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: 14, padding: '20px', marginBottom: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.5px' }}>GESAMT GESCHÄTZT</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '8px 0' }}>
                  {plan.costs?.gesamt?.toLocaleString('de-DE')}€
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>von {parseInt(plan.budget).toLocaleString('de-DE')}€ Budget</div>
              </div>

              {[
                ['✈️ Flug', plan.costs?.transport, '#3b82f6'],
                ['🏨 Hotel', plan.costs?.hotel, '#8b5cf6'],
                ['🍽️ Essen', plan.costs?.essen, '#f59e0b'],
                ['🎯 Aktivitäten', plan.costs?.aktivitaeten, '#10b981'],
              ].map(([label, amount, color]) => amount > 0 && (
                <div key={label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{amount?.toLocaleString('de-DE')}€</span>
                  </div>
                  <div style={{ height: 7, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((amount / plan.costs?.gesamt) * 100, 100)}%`, background: color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>

            <AdBanner size="square" />

            <button onClick={onNewTrip} style={{
              background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              color: '#fff', border: 'none', borderRadius: 12, padding: '14px 20px',
              fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 16,
              boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
            }}>
              ✈️ Neue Reise planen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
