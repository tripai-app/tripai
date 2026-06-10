import { useState, useEffect, useRef } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import { getUser, signOut, loadFavoritesFromCloud } from '../utils/auth';
import AuthModal from './AuthModal';

// ── Reiseziele Vergleich ──────────────────────────────────────────────────────
function CompareModal({ favs, onClose }) {
  const [sel1, setSel1] = useState(0);
  const [sel2, setSel2] = useState(Math.min(1, favs.length - 1));

  const p1 = favs[sel1];
  const p2 = favs[sel2];

  const COMPARE_FIELDS = [
    { key: 'days', label: '📅 Reisedauer', fmt: (v) => `${v} Tage` },
    { key: 'persons', label: '👥 Personen', fmt: (v) => `${v} Pers.` },
    { key: 'budget', label: '💰 Budget', fmt: (v) => `${(v||0).toLocaleString('de-DE')}€` },
  ];

  const getActualCost = (fav) => fav.fullPlan?.costs?.gesamt || null;
  const getFlightPrice = (fav) => fav.fullPlan?.flights?.reduce((min, f) => Math.min(min, f.priceFrom || 999), 999) || null;
  const getHotelPrice = (fav) => fav.fullPlan?.hotels?.reduce((min, h) => Math.min(min, h.pricePerNight || 999), 999) || null;
  const getActivitiesCount = (fav) => fav.fullPlan?.days?.reduce((s, d) => s + (d.slots?.filter(sl => sl.type !== 'restaurant').length || 0), 0) || 0;
  const getRestaurantCount = (fav) => fav.fullPlan?.days?.reduce((s, d) => s + (d.slots?.filter(sl => sl.type === 'restaurant').length || 0), 0) || 0;
  const getHiddenGemsCount = (fav) => (fav.fullPlan?.hiddenGems?.length || 0) + (fav.fullPlan?.days?.filter(d => d.hiddenGem).length || 0);

  const CompareRow = ({ label, val1, val2, better = 'lower', fmt = (v) => v }) => {
    const n1 = typeof val1 === 'number' ? val1 : null;
    const n2 = typeof val2 === 'number' ? val2 : null;
    const win1 = n1 !== null && n2 !== null && (better === 'lower' ? n1 < n2 : n1 > n2);
    const win2 = n1 !== null && n2 !== null && (better === 'lower' ? n2 < n1 : n2 > n1);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 6, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ textAlign: 'right', fontSize: 13, fontWeight: win1 ? 800 : 500, color: win1 ? '#16a34a' : '#374151', background: win1 ? '#f0fdf4' : 'transparent', borderRadius: 8, padding: '4px 8px' }}>
          {val1 != null ? fmt(val1) : '—'}{win1 && ' ✓'}
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ textAlign: 'left', fontSize: 13, fontWeight: win2 ? 800 : 500, color: win2 ? '#16a34a' : '#374151', background: win2 ? '#f0fdf4' : 'transparent', borderRadius: 8, padding: '4px 8px' }}>
          {win2 && '✓ '}{val2 != null ? fmt(val2) : '—'}
        </div>
      </div>
    );
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>⚖️ Reiseziele vergleichen</div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 50, width: 30, height: 30, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ padding: '16px 20px' }}>
          {/* Destination Pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[{ sel: sel1, setSel: setSel1, exclude: sel2, label: 'Reise 1' }, { sel: sel2, setSel: setSel2, exclude: sel1, label: 'Reise 2' }].map(({ sel, setSel, exclude, label }) => (
              <div key={label}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>{label}</div>
                <select value={sel} onChange={e => setSel(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#0f172a', background: '#f8fafc', cursor: 'pointer', outline: 'none' }}>
                  {favs.map((f, i) => (
                    <option key={i} value={i} disabled={i === exclude}>{f.emoji || '✈️'} {f.destination}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Destination Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
            {[p1, p2].map((p, i) => (
              <div key={i} style={{ background: i === 0 ? 'linear-gradient(135deg,#eff6ff,#dbeafe)' : 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 28 }}>{p?.emoji || '✈️'}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{p?.destination}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{p?.days} Tage · {p?.budget?.toLocaleString('de-DE')}€</div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div style={{ marginTop: 8 }}>
            <CompareRow label="📅 Reisedauer" val1={p1?.days} val2={p2?.days} better="higher" fmt={v => `${v} Tage`} />
            <CompareRow label="💰 Budget" val1={p1?.budget} val2={p2?.budget} better="lower" fmt={v => `${(v||0).toLocaleString('de-DE')}€`} />
            <CompareRow label="📊 Ges. Kosten" val1={getActualCost(p1)} val2={getActualCost(p2)} better="lower" fmt={v => `${v.toLocaleString('de-DE')}€`} />
            <CompareRow label="✈️ Günstigster Flug" val1={getFlightPrice(p1)} val2={getFlightPrice(p2)} better="lower" fmt={v => v < 999 ? `ab ${v}€` : '—'} />
            <CompareRow label="🏨 Günstigstes Hotel" val1={getHotelPrice(p1)} val2={getHotelPrice(p2)} better="lower" fmt={v => v < 999 ? `ab ${v}€/N.` : '—'} />
            <CompareRow label="🎯 Aktivitäten" val1={getActivitiesCount(p1)} val2={getActivitiesCount(p2)} better="higher" fmt={v => `${v} Stk.`} />
            <CompareRow label="🍽️ Restaurants" val1={getRestaurantCount(p1)} val2={getRestaurantCount(p2)} better="higher" fmt={v => `${v} Stk.`} />
            <CompareRow label="💎 Geheimtipps" val1={getHiddenGemsCount(p1)} val2={getHiddenGemsCount(p2)} better="higher" fmt={v => `${v} Stk.`} />
          </div>

          {/* Tips */}
          {(p1?.fullPlan?.savingTips || p2?.fullPlan?.savingTips) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
              {[p1, p2].map((p, i) => p?.fullPlan?.savingTips && (
                <div key={i} style={{ background: '#fffbeb', borderRadius: 12, padding: '10px 12px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>💡 SPARTIPP</div>
                  <div style={{ fontSize: 12, color: '#78350f' }}>{p.fullPlan.savingTips}</div>
                </div>
              ))}
            </div>
          )}

          <button onClick={onClose} style={{ width: '100%', marginTop: 16, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

// Auto-Tags für gespeicherte Reisen generieren
function getAutoTags(fav) {
  const dest = (fav.destination || '').toLowerCase();
  const tags = [];
  if (/bali|bangkok|chiang mai|hanoi|singapur|tokio|kyoto|seoul|vietnam|japan|indonesia/.test(dest)) tags.push('🌏 Asien');
  else if (/new york|miami|los angeles|kanada|mexiko|havanna|argentinien|chicago/.test(dest)) tags.push('🌎 Amerika');
  else if (/dubai|marrakesch|kairo|istanbul|athen|santorini|hurghada|antalya/.test(dest)) tags.push('🌍 Orient');
  else if (/kapstadt|nairobi|malediven|sydney|australien/.test(dest)) tags.push('🌍 Fernziel');
  else tags.push('🇪🇺 Europa');
  if ((fav.budget || 0) < 600) tags.push('💸 Budget');
  else if ((fav.budget || 0) > 2500) tags.push('👑 Luxus');
  if ((fav.days || 0) <= 3) tags.push('⚡ Kurztrip');
  else if ((fav.days || 0) >= 10) tags.push('🗺️ Lange Reise');
  return tags;
}

function FavoritesMenu({ onClose, onNavigate, onOpenPlan }) {
  const [favs, setFavs] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const ref = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem('tripai_favorites') || '[]'));
    } catch { setFavs([]); }

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('favoritesCountChanged', { detail: favs.length }));
  }, [favs]);

  const remove = (destination) => {
    const updated = favs.filter(f => f.destination !== destination);
    localStorage.setItem('tripai_favorites', JSON.stringify(updated));
    setFavs(updated);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const removeAll = () => {
    localStorage.setItem('tripai_favorites', '[]');
    setFavs([]);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const clearPlanCache = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('tripai_cache_'));
    keys.forEach(k => localStorage.removeItem(k));
    onClose();
    const orig = document.title;
    document.title = '✅ Cache geleert!';
    setTimeout(() => { document.title = orig; }, 2000);
  };

  // Alle einzigartigen Tags sammeln
  const allTags = [...new Set(favs.flatMap(f => getAutoTags(f)))];
  const filteredFavs = activeTag ? favs.filter(f => getAutoTags(f).includes(activeTag)) : favs;

  const menuContent = (
    <div ref={ref} style={{
      background: '#fff',
      borderRadius: isMobile ? '20px 20px 0 0' : 18,
      width: isMobile ? '100%' : 320,
      boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
      border: isMobile ? 'none' : '1px solid #f1f5f9',
      overflow: 'hidden',
      maxHeight: isMobile ? '85vh' : 520,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>❤️ Gespeicherte Reisen <span style={{ color: '#94a3b8', fontWeight: 500 }}>({favs.length})</span></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {favs.length > 0 && (
            <button onClick={removeAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#f87171', fontWeight: 600, padding: '2px 6px' }}>
              Alle löschen
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 50, width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          )}
        </div>
      </div>

      {/* Tag-Filter */}
      {allTags.length > 1 && (
        <div style={{ padding: '8px 14px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <button onClick={() => setActiveTag(null)} style={{ background: !activeTag ? '#eff6ff' : '#f8fafc', border: `1.5px solid ${!activeTag ? '#2563eb' : '#e2e8f0'}`, borderRadius: 50, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: !activeTag ? '#1d4ed8' : '#64748b', cursor: 'pointer' }}>
            Alle
          </button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} style={{ background: activeTag === tag ? '#eff6ff' : '#f8fafc', border: `1.5px solid ${activeTag === tag ? '#2563eb' : '#e2e8f0'}`, borderRadius: 50, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: activeTag === tag ? '#1d4ed8' : '#64748b', cursor: 'pointer' }}>
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Favoriten-Liste */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {filteredFavs.length === 0 ? (
          <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            {favs.length === 0 ? (
              <>Noch keine Reisen gespeichert.<br /><span style={{ fontSize: 11, marginTop: 4, display: 'block' }}>Drücke ❤️ nach dem Generieren.</span></>
            ) : 'Keine Reisen mit diesem Filter.'}
          </div>
        ) : (
          filteredFavs.map((f, i) => (
            <div key={i} style={{ padding: '12px 20px', borderBottom: i < filteredFavs.length - 1 ? '1px solid #f8fafc' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{f.emoji || '✈️'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.destination}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{f.days} Tage · {f.persons} Pers. · {f.budget?.toLocaleString('de-DE')}€</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {getAutoTags(f).map(tag => (
                      <span key={tag} style={{ background: '#f1f5f9', borderRadius: 50, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#64748b' }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => remove(f.destination)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', fontSize: 16, padding: 4, flexShrink: 0 }}>✕</button>
              </div>
              {f.fullPlan && (
                <button onClick={() => { onOpenPlan(f.fullPlan); onClose(); }} style={{
                  marginTop: 8, width: '100%', background: 'linear-gradient(135deg,#eff6ff,#e0f2fe)', border: '1px solid #bfdbfe',
                  borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 700,
                  color: '#1d4ed8', cursor: 'pointer', textAlign: 'center',
                }}>
                  ✈️ Plan öffnen →
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer-Buttons */}
      <div style={{ padding: '10px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, borderTop: '1px solid #f1f5f9' }}>
        <button onClick={() => { onNavigate('planner'); onClose(); }} style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          ✈️ Neue Reise planen
        </button>
        {favs.length >= 2 && (
          <button onClick={() => setShowCompare(true)} style={{ width: '100%', background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #93c5fd', borderRadius: 10, padding: '9px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#1d4ed8' }}>
            ⚖️ Reiseziele vergleichen
          </button>
        )}
        <button onClick={clearPlanCache} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#94a3b8', padding: '4px 0', textAlign: 'center' }}>
          🗑️ Plancache leeren
        </button>
      </div>

      {/* Compare Modal */}
      {showCompare && <CompareModal favs={favs} onClose={() => setShowCompare(false)} />}
    </div>
  );

  // Mobile: Fullscreen-Overlay mit Backdrop
  if (isMobile) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
        {menuContent}
      </div>
    );
  }

  // Desktop: Dropdown
  return (
    <div style={{ position: 'absolute', top: 62, right: 20, zIndex: 200 }}>
      {menuContent}
    </div>
  );
}

export default function Navbar({ page, onNavigate, darkMode, onToggleDark, onOpenPlan }) {
  const [showFavs, setShowFavs] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [user, setUser] = useState(() => getUser());
  const active = page === 'planner' || page === 'loading';

  useEffect(() => {
    const update = () => {
      try {
        setFavCount(JSON.parse(localStorage.getItem('tripai_favorites') || '[]').length);
      } catch { setFavCount(0); }
    };
    const handleCount = (e) => setFavCount(e.detail);
    update();
    window.addEventListener('storage', update);
    window.addEventListener('favoritesUpdated', update);
    window.addEventListener('favoritesCountChanged', handleCount);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('favoritesUpdated', update);
      window.removeEventListener('favoritesCountChanged', handleCount);
    };
  }, []);

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 20px',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => onNavigate('home')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7, padding: 0,
        }}>
          <span style={{ fontSize: 20 }}>✈️</span>
          <span style={{ fontSize: 19, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Trip<span style={{ color: '#2563eb' }}>AI</span>
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={onToggleDark} title={darkMode ? 'Light Mode' : 'Dark Mode'} aria-label={darkMode ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'} style={{
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 50, padding: '7px 12px', cursor: 'pointer',
            fontSize: 16, lineHeight: 1, transition: 'all 0.2s',
          }}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Login/User Button */}
          <button onClick={() => setShowAuth(true)} title={user ? user.email : 'Anmelden'} style={{
            background: user ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${user ? '#86efac' : '#e2e8f0'}`,
            borderRadius: 50, padding: '7px 12px',
            cursor: 'pointer', fontSize: 15, lineHeight: 1, transition: 'all 0.2s',
          }}>
            {user ? '🟢' : '👤'}
          </button>

          <button onClick={() => setShowFavs(v => !v)} aria-label="Gespeicherte Reisen" style={{
            background: showFavs ? '#fff1f2' : '#f8fafc',
            border: `1px solid ${showFavs ? '#fecaca' : '#e2e8f0'}`,
            borderRadius: 50, padding: '7px 14px',
            cursor: 'pointer', fontSize: 13, fontWeight: 700,
            color: showFavs ? '#dc2626' : '#64748b',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s',
          }}>
            ❤️ {favCount > 0 ? favCount : 'Gespeichert'}
          </button>

          <button onClick={() => onNavigate('planner')} style={{
            background: active ? 'linear-gradient(135deg,#2563eb,#0ea5e9)' : '#f1f5f9',
            color: active ? '#fff' : '#64748b',
            border: 'none', borderRadius: 50,
            padding: '8px 20px', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: active ? '0 4px 14px rgba(37,99,235,0.28)' : 'none',
          }}>
            {active ? '✈️ Planen…' : 'Reise planen'}
          </button>
        </div>

        {showFavs && <FavoritesMenu onClose={() => setShowFavs(false)} onNavigate={onNavigate} onOpenPlan={onOpenPlan} />}
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuthChange={async () => {
          setUser(getUser());
          // Nach Login: Cloud-Favoriten laden und mit lokalen mergen
          const cloudFavs = await loadFavoritesFromCloud();
          if (cloudFavs && cloudFavs.length > 0) {
            const local = JSON.parse(localStorage.getItem('tripai_favorites') || '[]');
            // Merge: Cloud-Daten bevorzugen, Duplikate entfernen
            const merged = [...cloudFavs, ...local.filter(l => !cloudFavs.some(c => c.destination === l.destination))].slice(0, 20);
            localStorage.setItem('tripai_favorites', JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent('favoritesCountChanged', { detail: merged.length }));
          }
        }} />}
      </div>
    </nav>
  );
}
