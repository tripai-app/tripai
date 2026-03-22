export default function AdBanner({ size = 'horizontal', className = '' }) {
  const styles = {
    horizontal: { width: '100%', height: '90px', label: 'Werbung — 728×90' },
    square: { width: '300px', height: '250px', label: 'Werbung — 300×250' },
    leaderboard: { width: '100%', height: '60px', label: 'Werbung — 970×60' },
  };

  const ad = styles[size] || styles.horizontal;

  return (
    <div className={`ad-banner ad-${size} ${className}`} style={{
      width: ad.width,
      height: ad.height,
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)',
      border: '2px dashed #93c5fd',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      margin: '0 auto',
    }}>
      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
        Anzeige
      </span>
      <span style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 500 }}>
        {ad.label} · Google AdSense
      </span>
    </div>
  );
}
