// Vercel Serverless Function — Claude AI Trip Generator
export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key nicht konfiguriert' });
  }

  const { destination, days, persons, budget, hotelCategory, interests } = req.body;

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

  const prompt = `Du bist ein Weltreise-Experte mit Kenntnissen über JEDEN Ort der Erde. Antworte NUR mit einem validen JSON-Objekt, ohne Markdown-Blöcke, ohne Erklärungen.

REISEDATEN:
- Ziel: ${destination}
- Dauer: ${days} Tage
- Personen: ${persons}
- Gesamtbudget: ${budget}€
- Unterkunft: ${hotelLabel}
- Interessen: ${interestsList || 'Allgemein'}

WICHTIGE REGELN:
1. JEDER Ort weltweit funktioniert — ob Weltstadt, kleines Dorf, Insel, Wüste oder Bergregion.
2. Verwende echte, bekannte Namen für Sehenswürdigkeiten, Restaurants und Hotels des jeweiligen Ortes.
3. Falls es sich um einen kleinen/unbekannten Ort handelt: Beschreibe die Region authentisch, nenne typische lokale Gerichte, landschaftliche Highlights und nahe gelegene Attraktionen.
4. Bei Flügen: Nenne realistische Flugverbindungen (ggf. über nächstgelegenen Flughafen). Für sehr abgelegene Orte: Zeige die beste Anreiseroute (Flug + Bus/Bahn/Auto).
5. Öffnungszeiten, Preise und Details so genau wie möglich — bei Unsicherheit realistische Schätzungen.
6. Restaurants: Typische Landesküche, echte Gerichte, Preisklasse, Besonderheit.
7. Jeder Tag soll 4-6 abwechslungsreiche Zeitslots haben — kein Tag soll sich wiederholen.

Gib folgendes JSON zurück:
{
  "destination": "${destination}",
  "emoji": "Länder-Emoji",
  "heroImage": "Beschreibung des Ortes für Alt-Text",
  "hotels": [
    {
      "name": "Echter Hotelname",
      "stars": 3,
      "pricePerNight": 85,
      "location": "Stadtviertel/Lage",
      "highlight": "Besonderheit des Hotels",
      "bookingSearch": "Suchbegriff für Booking.com"
    }
  ],
  "flights": [
    {
      "airline": "Airline Name",
      "type": "Direktflug oder 1 Zwischenstopp",
      "duration": "ca. 2h 30min",
      "priceFrom": 89,
      "tip": "Günstigster Buchtipp"
    }
  ],
  "days": [
    {
      "dayNumber": 1,
      "title": "Ankunft & erste Erkundung",
      "theme": "emoji + kurzes Thema",
      "slots": [
        {
          "time": "09:00",
          "type": "sehenswuerdigkeit",
          "name": "Echter Name",
          "description": "Was man hier erlebt",
          "duration": "2 Stunden",
          "cost": 15,
          "openingHours": "Mo-So 09:00-18:00",
          "tips": "Insider-Tipp z.B. früh kommen wegen Schlangen",
          "guide": "Optionaler Guide-Tipp",
          "tiktokWorthy": true
        },
        {
          "time": "12:30",
          "type": "restaurant",
          "name": "Echter Restaurantname",
          "description": "Was man essen sollte",
          "duration": "1 Stunde",
          "cost": 25,
          "cuisine": "Küche",
          "mustTry": "Gericht das man probieren muss",
          "tiktokWorthy": false
        }
      ],
      "hiddenGem": "Ein geheimer Tipp für diesen Tag",
      "dailyCostEstimate": 120
    }
  ],
  "costs": {
    "transport": 180,
    "hotel": 480,
    "essen": 350,
    "aktivitaeten": 190,
    "gesamt": 1200
  },
  "tips": [
    "Insider-Tipp 1",
    "Insider-Tipp 2",
    "Insider-Tipp 3"
  ],
  "tiktokSpots": [
    {
      "name": "Spot Name",
      "reason": "Warum es viral geht",
      "bestTime": "Beste Uhrzeit für Fotos"
    }
  ],
  "hiddenGems": [
    {
      "name": "Geheimtipp Name",
      "description": "Was es besonders macht",
      "howToGet": "Wie man hinkommt"
    }
  ],
  "budgetWithin": true,
  "savingTips": "Tipps wie man noch mehr sparen kann"
}

WICHTIG:
- Nutze ${days} Tage (dayNumber 1 bis ${days})
- Jeder Tag soll 4-6 Zeitslots haben (Morgen, Mittag, Nachmittag, Abend)
- ECHTE Namen verwenden, keine Platzhalter
- Öffnungszeiten so genau wie möglich
- tiktokWorthy: true bei besonders fotogenen Orten
- hiddenGem pro Tag: ein lokaler Geheimtipp, der nicht in jedem Reiseführer steht
- Antworte AUSSCHLIESSLICH mit dem JSON-Objekt — kein Text davor oder danach`;

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
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'KI-Fehler: ' + err });
    }

    const data = await response.json();
    const text = data.content[0].text.trim();

    // JSON aus Antwort extrahieren
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Ungültige KI-Antwort' });
    }

    const plan = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ plan });

  } catch (err) {
    return res.status(500).json({ error: 'Serverfehler: ' + err.message });
  }
}
