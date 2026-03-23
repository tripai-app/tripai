export default function Navbar({ page, onNavigate }) {
  const active = page === 'planner' || page === 'loading';
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
    </nav>
  );
}
