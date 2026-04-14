import { useState, useEffect, useRef } from 'react';
import useIsMobile from '../hooks/useIsMobile';

function FavoritesMenu({ onClose, onNavigate, onOpenPlan }) {
  const [favs, setFavs] = useState([]);
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

  // Badge-Count sofort aktualisieren wenn sich favs ändern
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
    // kleines Feedback via title-flash
    const orig = document.title;
    document.title = '✅ Cache geleert!';
    setTimeout(() => { document.title = orig; }, 2000);
  };

  const menuContent = (
    <div ref={ref} style={{
      background: '#fff',
      borderRadius: isMobile ? '20px 20px 0 0' : 18,
      width: isMobile ? '100%' : 310,
      boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
      border: isMobile ? 'none' : '1px solid #f1f5f9',
      overflow: 'hidden',
      maxHeight: isMobile ? '85vh' : 'none',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>❤️ Gespeicherte Reisen</div>
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

      {/* Favoriten-Liste */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {favs.length === 0 ? (
          <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Noch keine Reisen gespeichert.<br />
            <span style={{ fontSize: 11, marginTop: 4, display: 'block' }}>Drücke ❤️ nach dem Generieren.</span>
          </div>
        ) : (
          favs.map((f, i) => (
            <div key={i} style={{ padding: '12px 20px', borderBottom: i < favs.length - 1 ? '1px solid #f8fafc' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{f.emoji || '✈️'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.destination}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{f.days} Tage · {f.persons} Pers. · {f.budget?.toLocaleString('de-DE')}€</div>
                  <div style={{ fontSize: 10, color: '#cbd5e1' }}>{f.date}</div>
                </div>
                <button onClick={() => remove(f.destination)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', fontSize: 16, padding: 4, flexShrink: 0 }}>✕</button>
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
          ))
        )}
      </div>

      {/* Footer-Buttons */}
      <div style={{ padding: '10px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, borderTop: '1px solid #f1f5f9' }}>
        <button onClick={() => { onNavigate('planner'); onClose(); }} style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          ✈️ Neue Reise planen
        </button>
        <button onClick={clearPlanCache} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#94a3b8', padding: '4px 0', textAlign: 'center' }}>
          🗑️ Plancache leeren
        </button>
      </div>
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
  const [favCount, setFavCount] = useState(0);
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
      </div>
    </nav>
  );
}
