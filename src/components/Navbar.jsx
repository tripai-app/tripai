import { useState, useEffect, useRef } from 'react';

function FavoritesMenu({ onClose, onNavigate, onCompare, onOpenPlan }) {
  const [favs, setFavs] = useState([]);
  const ref = useRef(null);

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

  const remove = (destination) => {
    const updated = favs.filter(f => f.destination !== destination);
    localStorage.setItem('tripai_favorites', JSON.stringify(updated));
    setFavs(updated);
  };

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 62, right: 20,
      background: '#fff', borderRadius: 18, width: 300,
      boxShadow: '0 16px 48px rgba(0,0,0,0.15)', border: '1px solid #f1f5f9',
      zIndex: 200, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>❤️ Gespeicherte Reisen</div>
      </div>
      {favs.length === 0 ? (
        <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          Noch keine Reisen gespeichert.<br />
          <span style={{ fontSize: 11, marginTop: 4, display: 'block' }}>Drücke ❤️ nach dem Generieren.</span>
        </div>
      ) : (
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {favs.map((f, i) => (
            <div key={i} style={{ padding: '12px 20px', borderBottom: i < favs.length - 1 ? '1px solid #f8fafc' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{f.emoji || '✈️'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{f.destination}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{f.days} Tage · {f.persons} Pers. · {f.budget?.toLocaleString('de-DE')}€</div>
                  <div style={{ fontSize: 10, color: '#cbd5e1' }}>{f.date}</div>
                </div>
                <button onClick={() => remove(f.destination)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', fontSize: 16, padding: 4 }}>✕</button>
              </div>
              {f.fullPlan && (
                <button onClick={() => { onOpenPlan(f.fullPlan); onClose(); }} style={{
                  marginTop: 8, width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700,
                  color: '#2563eb', cursor: 'pointer', textAlign: 'center',
                }}>
                  Plan anzeigen →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div style={{ padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {favs.length >= 2 && (
          <button onClick={() => { onCompare(); onClose(); }} style={{ width: '100%', background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            📊 Reisen vergleichen
          </button>
        )}
        <button onClick={() => { onNavigate('planner'); onClose(); }} style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          ✈️ Neue Reise planen
        </button>
      </div>
    </div>
  );
}

export default function Navbar({ page, onNavigate, darkMode, onToggleDark, onOpenPlan }) {
  const [showFavs, setShowFavs] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const active = page === 'planner' || page === 'loading';

  useEffect(() => {
    const update = () => {
      try {
        setFavCount(JSON.parse(localStorage.getItem('tripai_favorites') || '[]').length);
      } catch { setFavCount(0); }
    };
    update();
    window.addEventListener('storage', update);
    window.addEventListener('favoritesUpdated', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('favoritesUpdated', update);
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
          <button onClick={onToggleDark} title={darkMode ? 'Light Mode' : 'Dark Mode'} style={{
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 50, padding: '7px 12px', cursor: 'pointer',
            fontSize: 16, lineHeight: 1, transition: 'all 0.2s',
          }}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button onClick={() => setShowFavs(v => !v)} style={{
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

        {showFavs && <FavoritesMenu onClose={() => setShowFavs(false)} onNavigate={onNavigate} onCompare={() => onNavigate('compare')} onOpenPlan={onOpenPlan} />}
      </div>
    </nav>
  );
}
