// Vercel Edge Function — Claude AI Trip Generator (30s limit on Hobby plan)
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API Key nicht konfiguriert' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültige Anfrage' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { destination, days, persons, budget, hotelCategory, interests } = body;

  const hotelLabel = {
    budget: 'Hostel oder günstiges Hotel (2-Sterne, unter 50€/Nacht)',
    mittel: '3-Sterne Hotel (50-100€/Nacht)',
    komfort: '4-Sterne Hotel (100-180€/Nacht)',
    luxus: '5-Sterne Luxushotel (über 200€/Nacht)',
  }[hotelCategory] || '3-Sterne Hotel';

  const interestMap = {
    kultur: 'Kultur & Geschichte',
    natur: 'Natur & Wandern',
    strand: 'Strand & Meer',
    essen: 'Essen & Lokale Küche',
    shopping: 'Shopping',
    abenteuer: 'Abenteuer & Sport',
    entspannung: 'Entspannung & Spa',
    nachtleben: 'Nachtleben & Bars',
  };
  const interestsList = (interests || []).map(i => interestMap[i] || i).join(', ');

  const prompt = `Du bist ein Weltreise-Experte. Antworte NUR mit einem validen JSON-Objekt, ohne Markdown-Blöcke, ohne Erklärungen.

REISEDATEN:
- Ziel: ${destination}
- Dauer: ${days} Tage
- Personen: ${persons}
- Gesamtbudget: ${budget}€
- Unterkunft: ${hotelLabel}
- Interessen: ${interestsList || 'Allgemein'}

REGELN:
1. Echte Namen für Sehenswürdigkeiten, Restaurants und Hotels.
2. Realistische Preise, Öffnungszeiten und Flugverbindungen.
3. Jeder Tag hat genau 4 Zeitslots (Morgen, Mittag, Nachmittag, Abend).
4. Antworte AUSSCHLIESSLICH mit dem JSON — kein Text davor oder danach.

JSON-Struktur:
{
  "destination": "${destination}",
  "emoji": "Länder-Emoji",
  "heroImage": "Kurze Ortsbeschreibung",
  "hotels": [
    { "name": "Hotelname", "stars": 3, "pricePerNight": 85, "location": "Lage", "highlight": "Besonderheit", "bookingSearch": "Suchbegriff" }
  ],
  "flights": [
    { "airline": "Airline", "type": "Direktflug", "duration": "2h 30min", "priceFrom": 89, "tip": "Buchtipp" }
  ],
  "days": [
    {
      "dayNumber": 1,
      "title": "Ankunft & Erkundung",
      "theme": "🌟 Thema",
      "slots": [
        { "time": "09:00", "type": "sehenswuerdigkeit", "name": "Name", "description": "Beschreibung", "duration": "2 Stunden", "cost": 15, "openingHours": "09:00-18:00", "tips": "Tipp", "tiktokWorthy": true },
        { "time": "12:30", "type": "restaurant", "name": "Restaurant", "description": "Essen", "duration": "1 Stunde", "cost": 20, "cuisine": "Küche", "mustTry": "Gericht", "tiktokWorthy": false },
        { "time": "15:00", "type": "sehenswuerdigkeit", "name": "Name", "description": "Beschreibung", "duration": "2 Stunden", "cost": 10, "openingHours": "10:00-17:00", "tips": "Tipp", "tiktokWorthy": false },
        { "time": "19:00", "type": "restaurant", "name": "Abendessen", "description": "Abendessen", "duration": "1.5 Stunden", "cost": 30, "cuisine": "Küche", "mustTry": "Gericht", "tiktokWorthy": false }
      ],
      "hiddenGem": "Geheimtipp",
      "dailyCostEstimate": 120
    }
  ],
  "costs": { "transport": 180, "hotel": 480, "essen": 350, "aktivitaeten": 190, "gesamt": 1200 },
  "tips": ["Tipp 1", "Tipp 2", "Tipp 3"],
  "tiktokSpots": [{ "name": "Spot", "reason": "Warum viral", "bestTime": "Uhrzeit" }],
  "hiddenGems": [{ "name": "Geheimtipp", "description": "Besonderheit", "howToGet": "Anfahrt" }],
  "budgetWithin": true,
  "savingTips": "Spartipps"
}

Erstelle ALLE ${days} Tage (dayNumber 1 bis ${days}), jeweils mit genau 4 Slots.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 6000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: 'KI-Fehler: ' + err }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.content[0].text.trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: 'Ungültige KI-Antwort' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    const plan = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify({ plan }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Serverfehler: ' + err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
