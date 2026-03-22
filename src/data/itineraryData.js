export const destinationData = {
  // Italy
  "italien": {
    emoji: "🇮🇹",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800",
    tips: ["Trinkgeld ist kein Muss, aber 5-10% ist höflich", "Mittagspause 13-15 Uhr — viele Geschäfte geschlossen", "Wasser aus öffentlichen Brunnen ist kostenlos & trinkbar"],
    transport: "Fliegen oder Zug (Frecciarossa)", transportCost: 120,
    days: [
      { title: "Ankunft & Stadtbummel", activities: ["Check-in im Hotel", "Abendspaziergang durch die Altstadt", "Abendessen: Lokale Trattoria"], costs: { unterkunft: 0, essen: 25, aktivitaeten: 0 } },
      { title: "Hauptsehenswürdigkeiten", activities: ["Colosseum / Uffizien / Markusplatz (je nach Stadt)", "Mittagessen auf einem lokalen Markt", "Gelateria am Nachmittag"], costs: { unterkunft: 0, essen: 20, aktivitaeten: 22 } },
      { title: "Entspannter Tag", activities: ["Lokaler Markt am Morgen", "Weinprobe oder Kochkurs", "Abenddinner mit Wein"], costs: { unterkunft: 0, essen: 35, aktivitaeten: 30 } },
      { title: "Ausflug aufs Land", activities: ["Tagestrip zu einem kleinen Dorf", "Olivenöl-Verkostung", "Rückkehr & leichtes Abendessen"], costs: { unterkunft: 0, essen: 28, aktivitaeten: 15 } },
      { title: "Abreise", activities: ["Frühstück im Café", "Letzte Souvenirs kaufen", "Transfer zum Flughafen"], costs: { unterkunft: 0, essen: 15, aktivitaeten: 10 } },
    ]
  },
  "rom": {
    emoji: "🇮🇹", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
    tips: ["Museen dienstags oft gratis", "Metro Linie A für die meisten Sehenswürdigkeiten", "Trevi Brunnen früh morgens besuchen"],
    transport: "Flug nach ROM (FCO)", transportCost: 110,
    days: [
      { title: "Ankunft & Trastevere", activities: ["Check-in", "Spaziergang durch Trastevere", "Abendessen in einer kleinen Osteria"], costs: { unterkunft: 0, essen: 28, aktivitaeten: 0 } },
      { title: "Antikes Rom", activities: ["Colosseum & Forum Romanum (Ticket empfehlenswert)", "Kapitolsmuseum", "Abends: Piazza Navona"], costs: { unterkunft: 0, essen: 25, aktivitaeten: 18 } },
      { title: "Vatikan", activities: ["Vatikanische Museen & Sixtinische Kapelle", "Petersdom & Petersplatz", "Castel Sant'Angelo"], costs: { unterkunft: 0, essen: 20, aktivitaeten: 20 } },
      { title: "Fontänen & Märkte", activities: ["Trevi-Brunnen am frühen Morgen", "Campo de' Fiori Markt", "Abschlussessen in Prati"], costs: { unterkunft: 0, essen: 30, aktivitaeten: 5 } },
      { title: "Abreise", activities: ["Frühstück", "Piazza di Spagna", "Shuttle zum Flughafen"], costs: { unterkunft: 0, essen: 18, aktivitaeten: 8 } },
    ]
  },
  "barcelona": {
    emoji: "🇪🇸", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
    tips: ["Pickpocket-Hochburg — Wertsachen sichern", "Mittagessen günstig als Menú del Día (10-15€)", "Strandsaison: Mai–Oktober"],
    transport: "Flug nach BCN", transportCost: 95,
    days: [
      { title: "Las Ramblas & Gotisches Viertel", activities: ["Ankunft & Check-in", "Spaziergang Las Ramblas", "Barri Gòtic erkunden", "Abendessen: Tapas Bar"], costs: { unterkunft: 0, essen: 25, aktivitaeten: 0 } },
      { title: "Gaudí-Tag", activities: ["Sagrada Família (Tickets vorab!)", "Park Güell", "Casa Batlló von außen"], costs: { unterkunft: 0, essen: 22, aktivitaeten: 35 } },
      { title: "Strand & Barceloneta", activities: ["Morgen am Strand", "Mittagessen Seafood", "El Born Viertel am Nachmittag"], costs: { unterkunft: 0, essen: 30, aktivitaeten: 0 } },
      { title: "Montjuïc & Kultur", activities: ["Seilbahn auf den Montjuïc", "Nationales Kunstmuseum (MNAC)", "Poble Sec für Abendessen"], costs: { unterkunft: 0, essen: 28, aktivitaeten: 18 } },
      { title: "Abreise", activities: ["Frühstück in einem Café", "Mercat de la Boqueria", "Flughafen-Transfer"], costs: { unterkunft: 0, essen: 20, aktivitaeten: 5 } },
    ]
  },
  "paris": {
    emoji: "🇫🇷", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    tips: ["Eiffelturm abends beleuchtet — kostenlos von außen", "Fahrrad oder Metro — kein Auto in der Stadt", "Museumspässe sparen viel Zeit & Geld"],
    transport: "Flug nach CDG oder Zug (Thalys)", transportCost: 130,
    days: [
      { title: "Eiffelturm & Champ de Mars", activities: ["Ankunft", "Eiffelturm (Tickets vorab buchen)", "Abendessen im 7. Arrondissement"], costs: { unterkunft: 0, essen: 32, aktivitaeten: 25 } },
      { title: "Louvre & Marais", activities: ["Louvre-Museum (Morgen)", "Mittagessen im Marais", "Place des Vosges"], costs: { unterkunft: 0, essen: 28, aktivitaeten: 15 } },
      { title: "Montmartre", activities: ["Sacré-Cœur Basilika", "Ateliers der Künstler", "Romantisches Abendessen"], costs: { unterkunft: 0, essen: 35, aktivitaeten: 0 } },
      { title: "Versailles-Ausflug", activities: ["Schloss Versailles (Tagesticket)", "Gärten spazieren", "Rückkehr nach Paris"], costs: { unterkunft: 0, essen: 25, aktivitaeten: 20 } },
      { title: "Abreise", activities: ["Croissant & Café au Lait", "Champs-Élysées", "RER zum Flughafen"], costs: { unterkunft: 0, essen: 18, aktivitaeten: 0 } },
    ]
  },
  "new york": {
    emoji: "🇺🇸", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    tips: ["MTA Subway rund um die Uhr verfügbar", "Trinkgeld 15-20% obligatorisch", "Staten Island Ferry gratis — toller Manhattan-Ausblick"],
    transport: "Transatlantikflug nach JFK", transportCost: 450,
    days: [
      { title: "Manhattan & Times Square", activities: ["Ankunft & Jetlag überwinden", "Times Square abends", "Abendessen in einem Diner"], costs: { unterkunft: 0, essen: 35, aktivitaeten: 0 } },
      { title: "Central Park & 5th Avenue", activities: ["Central Park Morgenspaziergang", "Metropolitan Museum of Art", "5th Avenue Shopping-Bummel"], costs: { unterkunft: 0, essen: 30, aktivitaeten: 25 } },
      { title: "Brooklyn & DUMBO", activities: ["Brooklyn Bridge zu Fuß überqueren", "DUMBO Viertel & Fotos", "Williamsburg Street Food"], costs: { unterkunft: 0, essen: 28, aktivitaeten: 0 } },
      { title: "Freiheitsstatue & Downtown", activities: ["Fähre zur Freiheitsstatue", "9/11 Memorial", "Wall Street & Battery Park"], costs: { unterkunft: 0, essen: 32, aktivitaeten: 22 } },
      { title: "Abreise", activities: ["Frühstück in einem Bagel-Shop", "Letzte Souvenirs", "Taxi/Uber zum Flughafen"], costs: { unterkunft: 0, essen: 25, aktivitaeten: 0 } },
    ]
  },
  "thailand": {
    emoji: "🇹🇭", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
    tips: ["Tempel: Schultern & Knie bedecken", "Tuk-Tuks: Preis vorher verhandeln", "Trinkwasser nur aus Flaschen"],
    transport: "Langstreckenflug nach BKK", transportCost: 380,
    days: [
      { title: "Bangkok — Tempel", activities: ["Wat Phra Kaew (Smaragd-Buddha)", "Wat Pho (Liegender Buddha)", "Bootsfahrt auf dem Chao Phraya"], costs: { unterkunft: 0, essen: 15, aktivitaeten: 8 } },
      { title: "Märkte & Straßenessen", activities: ["Chatuchak Wochenendmarkt", "Street Food Tour", "Rooftop-Bar am Abend"], costs: { unterkunft: 0, essen: 18, aktivitaeten: 5 } },
      { title: "Insel-Hop nach Koh Samui", activities: ["Flug oder Fähre", "Strand & Entspannung", "Seafood-Restaurant"], costs: { unterkunft: 0, essen: 20, aktivitaeten: 30 } },
      { title: "Inselentdeckung", activities: ["Schnorcheln oder Tauchen", "Ang Thong Nationalpark", "Abendessen am Strand"], costs: { unterkunft: 0, essen: 22, aktivitaeten: 25 } },
      { title: "Entspannung & Abreise", activities: ["Morgen am Strand", "Thai-Massage (90 Min.)", "Rückflug"], costs: { unterkunft: 0, essen: 15, aktivitaeten: 12 } },
    ]
  },
};

export const hotelCosts = {
  budget: { label: "Hostel / Budget-Hotel", pricePerNight: 35 },
  mittel: { label: "3-Sterne Hotel", pricePerNight: 80 },
  komfort: { label: "4-Sterne Hotel", pricePerNight: 150 },
  luxus: { label: "5-Sterne Hotel", pricePerNight: 300 },
};

export function generateItinerary({ destination, budget, days, persons, interests, hotelCategory }) {
  const destKey = destination.toLowerCase().trim();
  let destData = destinationData[destKey];

  // Fallback für unbekannte Ziele
  if (!destData) {
    destData = {
      emoji: "✈️",
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800",
      tips: ["Reiseversicherung nicht vergessen", "Lokale SIM-Karte kaufen", "Wichtige Nummern offline speichern"],
      transport: "Flug oder Zug", transportCost: 150,
      days: Array.from({ length: Math.max(days, 5) }, (_, i) => ({
        title: i === 0 ? "Ankunft & Erkundung" : i === days - 1 ? "Abreise" : `Tag ${i + 1} — Entdeckungen`,
        activities: i === 0
          ? ["Check-in im Hotel", "Erste Erkundung der Umgebung", "Abendessen lokal"]
          : i === days - 1
          ? ["Frühstück", "Letzte Souvenirs", "Transfer zum Abflugort"]
          : ["Sehenswürdigkeit besuchen", "Mittagessen im Restaurant", "Nachmittagsspaziergang", "Abendessen"],
        costs: { unterkunft: 0, essen: 25, aktivitaeten: 15 }
      }))
    };
  }

  const hotel = hotelCosts[hotelCategory] || hotelCosts.mittel;
  const budgetPerPerson = budget / persons;
  const hotelTotal = hotel.pricePerNight * (days - 1) * persons;
  const transportTotal = destData.transportCost * persons;
  const remainingBudget = budget - hotelTotal - transportTotal;
  const dailyBudget = remainingBudget / days;

  // Tage anpassen
  const itinDays = destData.days.slice(0, days);
  while (itinDays.length < days) {
    itinDays.push({
      title: `Freier Erkundungstag`,
      activities: ["Auf eigene Faust erkunden", "Lokales Restaurant entdecken", "Souvenirs kaufen"],
      costs: { unterkunft: 0, essen: 25, aktivitaeten: 10 }
    });
  }

  const totalEssen = itinDays.reduce((s, d) => s + d.costs.essen, 0) * persons;
  const totalAktivitaeten = itinDays.reduce((s, d) => s + d.costs.aktivitaeten, 0) * persons;

  return {
    destination,
    emoji: destData.emoji,
    image: destData.image,
    tips: destData.tips,
    days: itinDays,
    costs: {
      transport: transportTotal,
      hotel: hotelTotal,
      essen: totalEssen,
      aktivitaeten: totalAktivitaeten,
      gesamt: transportTotal + hotelTotal + totalEssen + totalAktivitaeten,
    },
    hotel: hotel.label,
    pricePerNight: hotel.pricePerNight,
    budgetPerPerson,
    withinBudget: (transportTotal + hotelTotal + totalEssen + totalAktivitaeten) <= budget,
  };
}
