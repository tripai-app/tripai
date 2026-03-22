import AdBanner from './AdBanner';

function BudgetBar({ label, amount, total, color }) {
  const pct = total > 0 ? Math.min((amount / total) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{amount.toLocaleString('de-DE')}€</span>
      </div>
      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 1s ease',
        }} />
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{pct.toFixed(0)}% des Budgets</div>
    </div>
  );
}

export default function Itinerary({ plan, onBack, onNewTrip }) {
  if (!plan) return null;

  const overBudget = plan.costs.gesamt > plan.budget;
  const savings = plan.budget - plan.costs.gesamt;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* AD TOP */}
      <div style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner size="leaderboard" />
        </div>
      </div>

      {/* HERO IMAGE */}
      <div style={{
        height: 280,
        background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${plan.image}) center/cover`,
        display: 'flex',
        alignItems: 'flex-end',
        padding: '32px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#fff',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 16,
              backdropFilter: 'blur(4px)',
            }}
          >
            ← Zurück
          </button>
          <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
            {plan.emoji} {plan.destination}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6, fontSize: 16 }}>
            {plan.days.length} Tage · {plan.persons} {plan.persons === 1 ? 'Person' : 'Personen'} · {plan.hotel}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 28, alignItems: 'start' }}>

          {/* LEFT: Itinerary */}
          <div>
            {/* Budget Status Banner */}
            <div style={{
              background: overBudget ? '#fff1f2' : '#f0fdf4',
              border: `2px solid ${overBudget ? '#fecaca' : '#86efac'}`,
              borderRadius: 14,
              padding: '16px 20px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>{overBudget ? '⚠️' : '✅'}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: overBudget ? '#991b1b' : '#166534' }}>
                  {overBudget
                    ? `Budget überschritten um ${Math.abs(savings).toLocaleString('de-DE')}€`
                    : `Du sparst ${savings.toLocaleString('de-DE')}€ — gut geplant!`}
                </div>
                <div style={{ fontSize: 13, color: overBudget ? '#dc2626' : '#16a34a', marginTop: 2 }}>
                  Geschätzte Gesamtkosten: <strong>{plan.costs.gesamt.toLocaleString('de-DE')}€</strong> von {parseInt(plan.budget).toLocaleString('de-DE')}€ Budget
                </div>
              </div>
            </div>

            {/* Day-by-Day Plan */}
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 20, letterSpacing: '-0.3px' }}>
              📅 Dein Tagesplan
            </h2>

            {plan.days.map((day, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: 16,
                padding: 24,
                marginBottom: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #2563eb',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 20,
                      display: 'inline-block',
                      marginBottom: 6,
                      letterSpacing: '0.5px',
                    }}>
                      TAG {i + 1}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>{day.title}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Tageskosten</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>
                      ~{((day.costs.essen + day.costs.aktivitaeten) * plan.persons).toLocaleString('de-DE')}€
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {day.activities.map((act, j) => (
                    <div key={j} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: 8,
                    }}>
                      <span style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                        {j + 1}
                      </span>
                      <span style={{ fontSize: 14, color: '#374151' }}>{act}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                  <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                    🍽️ Essen ~{(day.costs.essen * plan.persons)}€
                  </span>
                  <span style={{ background: '#f0fdf4', color: '#166534', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                    🎯 Aktivitäten ~{(day.costs.aktivitaeten * plan.persons)}€
                  </span>
                </div>
              </div>
            ))}

            {/* AD BETWEEN DAYS AND TIPS */}
            <div style={{ margin: '24px 0' }}>
              <AdBanner size="horizontal" />
            </div>

            {/* Tips */}
            <div style={{
              background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
              borderRadius: 16,
              padding: 24,
              border: '1px solid #fde68a',
              marginTop: 8,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#78350f', marginBottom: 16 }}>
                💡 Insider-Tipps für {plan.destination}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 14, color: '#451a03', lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Budget Sidebar */}
          <div style={{ position: 'sticky', top: 88 }}>
            {/* Budget Card */}
            <div style={{
              background: '#fff',
              borderRadius: 20,
              padding: 28,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              marginBottom: 20,
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>💰 Budget-Übersicht</h3>

              <div style={{
                background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                borderRadius: 14,
                padding: '20px',
                marginBottom: 24,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.5px' }}>GESAMTKOSTEN GESCHÄTZT</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '8px 0' }}>
                  {plan.costs.gesamt.toLocaleString('de-DE')}€
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>von {parseInt(plan.budget).toLocaleString('de-DE')}€ Budget</div>
              </div>

              <BudgetBar label="✈️ Transport/Flug" amount={plan.costs.transport} total={plan.costs.gesamt} color="#3b82f6" />
              <BudgetBar label={`🏨 ${plan.hotel}`} amount={plan.costs.hotel} total={plan.costs.gesamt} color="#8b5cf6" />
              <BudgetBar label="🍽️ Essen & Getränke" amount={plan.costs.essen} total={plan.costs.gesamt} color="#f59e0b" />
              <BudgetBar label="🎯 Aktivitäten" amount={plan.costs.aktivitaeten} total={plan.costs.gesamt} color="#10b981" />

              <div style={{
                borderTop: '1px solid #f1f5f9',
                paddingTop: 16,
                marginTop: 4,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                  <span>Pro Person (geschätzt)</span>
                  <strong style={{ color: '#0f172a' }}>{Math.round(plan.costs.gesamt / plan.persons).toLocaleString('de-DE')}€</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                  <span>Pro Tag (alle Pers.)</span>
                  <strong style={{ color: '#0f172a' }}>{Math.round(plan.costs.gesamt / plan.days.length).toLocaleString('de-DE')}€</strong>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 20,
              border: '1px solid #e2e8f0',
              marginBottom: 20,
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>📋 Reise-Details</h4>
              {[
                ['🌍 Ziel', plan.destination],
                ['📅 Dauer', `${plan.days.length} Tage`],
                ['👥 Personen', plan.persons],
                ['🏨 Unterkunft', plan.hotel],
                ['✈️ Transport', plan.transportInfo || 'Flug empfohlen'],
              ].map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8fafc', fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>{key}</span>
                  <strong style={{ color: '#1e293b' }}>{val}</strong>
                </div>
              ))}
            </div>

            {/* Ad Square */}
            <AdBanner size="square" />

            {/* New Trip Button */}
            <button
              onClick={onNewTrip}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                marginTop: 16,
                boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
              }}
            >
              ✈️ Neue Reise planen
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .itinerary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
