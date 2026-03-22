// ============================================
// AFFILIATE KONFIGURATION
// ============================================
// Ersetze die Platzhalter mit deinen echten IDs
// sobald du dich bei den Partnern angemeldet hast.
//
// Booking.com Partner:  partners.booking.com
// GetYourGuide Partner: partner.getyourguide.com
// Skyscanner Partner:   partners.skyscanner.net
// Rentalcars Partner:   partners.rentalcars.com
// ============================================

export const AFFILIATE = {
  booking: {
    aid: 'DEINE_BOOKING_ID',       // Ersetzen nach Anmeldung
    active: false,
  },
  getyourguide: {
    partnerId: 'DEINE_GYG_ID',     // Ersetzen nach Anmeldung
    active: false,
  },
  skyscanner: {
    associateId: 'DEINE_SKY_ID',   // Ersetzen nach Anmeldung
    active: false,
  },
  rentalcars: {
    affiliateId: 'DEINE_RC_ID',    // Ersetzen nach Anmeldung
    active: false,
  },
};

// Generiert Affiliate-Links mit Ziel & Personen
export function getBookingLink(destination, persons, days) {
  const base = 'https://www.booking.com/searchresults.html';
  const params = new URLSearchParams({
    ss: destination,
    group_adults: persons,
    no_rooms: 1,
    ...(AFFILIATE.booking.active && { aid: AFFILIATE.booking.aid }),
  });
  return `${base}?${params.toString()}`;
}

export function getGetYourGuideLink(destination) {
  const base = 'https://www.getyourguide.com/s/';
  const params = new URLSearchParams({
    q: destination,
    ...(AFFILIATE.getyourguide.active && { partner_id: AFFILIATE.getyourguide.partnerId }),
  });
  return `${base}?${params.toString()}`;
}

export function getSkyscannerLink(persons) {
  const base = 'https://www.skyscanner.net/transport/flights/';
  const params = new URLSearchParams({
    adults: persons,
    ...(AFFILIATE.skyscanner.active && { associateid: AFFILIATE.skyscanner.associateId }),
  });
  return `${base}?${params.toString()}`;
}

export function getRentalcarsLink(destination) {
  const base = 'https://www.rentalcars.com/';
  const params = new URLSearchParams({
    dropoffLocation: destination,
    ...(AFFILIATE.rentalcars.active && { affiliateCode: AFFILIATE.rentalcars.affiliateId }),
  });
  return `${base}?${params.toString()}`;
}
