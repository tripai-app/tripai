import { getBookingLink, getGetYourGuideLink, getSkyscannerLink, getRentalcarsLink } from '../data/affiliateConfig';

const partners = (destination, persons, days) => [
  {
    id: 'booking',
    logo: '🏨',
    name: 'Booking.com',
    desc: `Hotels in ${destination} finden`,
    sub: 'Beste Preise • Kostenlose Stornierung',
    color: '#003580',
    bg: '#e8f0fb',
    cta: 'Hotel suchen',
    link: getBookingLink(destination, persons, days),
    badge: 'Empfohlen',
  },
  {
    id: 'getyourguide',
    logo: '🎭',
    name: 'GetYourGuide',
    desc: `Touren & Aktivitäten in ${destination}`,
    sub: 'Museen • Guides • Erlebnisse',
    color: '#ff5533',
    bg: '#fff0ed',
    cta: 'Aktivitäten entdecken',
    link: getGetYourGuideLink(destination),
    badge: 'Top bewertet',
  },
  {
    id: 'skyscanner',
    logo: '✈️',
    name: 'Skyscanner',
    desc: `Günstige Flüge nach ${destination}`,
    sub: 'Alle Airlines • Bestpreisgarantie',
    color: '#0770e3',
    bg: '#e8f1fd',
    cta: 'Flüge vergleichen',
    link: getSkyscannerLink(destination, persons),
    badge: null,
  },
  {
    id: 'rentalcars',
    logo: '🚗',
    name: 'Rentalcars',
    desc: `Mietwagen in ${destination}`,
    sub: 'Alle Anbieter • Kein Aufpreis',
    color: '#e4002b',
    bg: '#fdeaed',
    cta: 'Auto mieten',
    link: getRentalcarsLink(destination),
    badge: null,
  },
];

export default function AffiliateSection({ destination, persons, days }) {
  const cards = partners(destination, persons, days);

  return (
    <div style={{ marginTop: 32, marginBottom: 8 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        borderRadius: 20,
        padding: '28px 28px 24px',
        marginBottom: 16,
      }}>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.3px' }}>
          🛒 Jetzt direkt buchen
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
          Alles was du für deine Reise brauchst — direkt hier buchen
        </p>
      </div>

      {/* Partner Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 14,
      }}>
        {cards.map(card => (
          <a
            key={card.id}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#fff',
              borderRadius: 16,
              padding: 20,
              border: `2px solid ${card.bg}`,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = card.bg;
            }}
          >
            {/* Badge */}
            {card.badge && (
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: card.color,
                color: '#fff',
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 20,
                letterSpacing: '0.5px',
              }}>
                {card.badge}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 46,
                height: 46,
                background: card.bg,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}>
                {card.logo}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{card.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{card.sub}</div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#475569', marginBottom: 14, lineHeight: 1.4 }}>
              {card.desc}
            </p>

            <div style={{
              background: card.color,
              color: '#fff',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}>
              {card.cta} →
            </div>
          </a>
        ))}
      </div>

      {/* Info Text */}
      <p style={{
        fontSize: 11,
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 12,
      }}>
        * TripAI erhält eine kleine Provision wenn du über diese Links buchst — für dich entstehen keine Mehrkosten.
      </p>
    </div>
  );
}
