export default function Navbar({ page, onNavigate }) {
  return (
    <nav style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button onClick={() => onNavigate('home')} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: 28 }}>✈️</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
            Trip<span style={{ color: '#2563eb' }}>AI</span>
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => onNavigate('planner')}
            style={{
              background: page === 'planner' ? '#2563eb' : 'transparent',
              color: page === 'planner' ? '#fff' : '#475569',
              border: page === 'planner' ? 'none' : '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Reise planen
          </button>
          <span style={{
            background: '#fef3c7',
            color: '#92400e',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 20,
            letterSpacing: '0.5px',
          }}>
            KOSTENLOS
          </span>
        </div>
      </div>
    </nav>
  );
}
