// ============================================
// AFFILIATE KONFIGURATION — 8 Partner
// ============================================
// Ersetze die Platzhalter mit deinen echten IDs
// sobald du dich bei den Partnern angemeldet hast.
//
// Booking.com:   partners.booking.com
// GetYourGuide:  partner.getyourguide.com
// Skyscanner:    partners.skyscanner.net
// Rentalcars:    partners.rentalcars.com
// Amazon:        partnernet.amazon.de
// Airbnb:        airbnb.de/affiliates  (via impact.com)
// Viator:        partner.viator.com
// Lufthansa:     deutschebahn.awin.com (via Awin-Netzwerk)
// ============================================

export const AFFILIATE = {
  booking: {
    aid: 'DEINE_BOOKING_ID',
    active: false,
  },
  getyourguide: {
    partnerId: 'DEINE_GYG_ID',
    active: false,
  },
  skyscanner: {
    associateId: 'DEINE_SKY_ID',
    active: false,
  },
  rentalcars: {
    affiliateId: 'DEINE_RC_ID',
    active: false,
  },
  amazon: {
    tag: 'DEINE_AMAZON_TAG',          // Format: name-21
    active: false,
  },
  airbnb: {
    // Airbnb Affiliate via impact.com — nach Anmeldung erhältst du einen Tracking-Link
    // Den kompletten Link in airbnbBaseUrl eintragen (ersetzt die URL unten)
    airbnbBaseUrl: '',                 // z.B. 'https://airbnb.de/c/DEINCODE'
    active: false,
  },
  viator: {
    partnerId: 'DEINE_VIATOR_ID',     // Format: P12345
    active: false,
  },
  lufthansa: {
    // Lufthansa Affiliate über Awin-Netzwerk (awin.com → Lufthansa suchen)
    // Nach Genehmigung: Awin Deep-Link Generator nutzen
    awinId: 'DEINE_AWIN_ID',          // Deine Awin Publisher-ID
    active: false,
  },
};

// ── Link-Generatoren ──────────────────────────────────────

export function getBookingLink(destination, persons, days) {
  const params = new URLSearchParams({
    ss: destination,
    group_adults: persons,
    no_rooms: 1,
    ...(AFFILIATE.booking.active && { aid: AFFILIATE.booking.aid }),
  });
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

export function getGetYourGuideLink(destination) {
  const params = new URLSearchParams({
    q: destination,
    ...(AFFILIATE.getyourguide.active && { partner_id: AFFILIATE.getyourguide.partnerId }),
  });
  return `https://www.getyourguide.com/s/?${params.toString()}`;
}

export function getSkyscannerLink(destination, persons, departureCity = '') {
  const params = new URLSearchParams({
    adults: persons || 1,
    whereToQuery: destination || '',
    ...(departureCity && { whereFromQuery: departureCity }),
    ...(AFFILIATE.skyscanner.active && { associateid: AFFILIATE.skyscanner.associateId }),
  });
  // .net/transport/flights/ ist stabiler als .de/transport/fluge/ (kein Umlaut-Problem)
  return `https://www.skyscanner.net/transport/flights/?${params.toString()}`;
}

export function getRentalcarsLink(destination) {
  const params = new URLSearchParams({
    dropoffLocation: destination,
    ...(AFFILIATE.rentalcars.active && { affiliateCode: AFFILIATE.rentalcars.affiliateId }),
  });
  return `https://www.rentalcars.com/?${params.toString()}`;
}

export function getAmazonLink(searchTerm) {
  const params = new URLSearchParams({ k: searchTerm });
  if (AFFILIATE.amazon.active) params.set('tag', AFFILIATE.amazon.tag);
  return `https://www.amazon.de/s?${params.toString()}`;
}

export function getAirbnbLink(destination, persons) {
  if (AFFILIATE.airbnb.active && AFFILIATE.airbnb.airbnbBaseUrl) {
    // Eigener Tracking-Link von impact.com mit Destination als Referenz
    return `${AFFILIATE.airbnb.airbnbBaseUrl}`;
  }
  // Direktlink: Suche nach Unterkünften am Zielort
  const params = new URLSearchParams({
    adults: persons || 1,
  });
  return `https://www.airbnb.de/s/${encodeURIComponent(destination)}/homes?${params.toString()}`;
}

export function getViatorLink(destination) {
  if (AFFILIATE.viator.active) {
    // Viator Affiliate-Link Format
    const params = new URLSearchParams({
      text: destination,
      pid: AFFILIATE.viator.partnerId,
      mcid: '42383',
      medium: 'link',
    });
    return `https://www.viator.com/de-DE/search?${params.toString()}`;
  }
  return `https://www.viator.com/de-DE/search?text=${encodeURIComponent(destination)}`;
}

export function getLufthansaLink(destination, departureCity = '') {
  if (AFFILIATE.lufthansa.active) {
    // Awin Deep-Link für Lufthansa
    const target = encodeURIComponent(`https://www.lufthansa.com/de/de/fluge-suchen?destination=${encodeURIComponent(destination)}`);
    return `https://www.awin1.com/cread.php?awinmid=1190&awinaffid=${AFFILIATE.lufthansa.awinId}&clickref=tripai&p=${target}`;
  }
  // Direktlink zur Lufthansa-Suche
  return `https://www.lufthansa.com/de/de/fluge-suchen`;
}
