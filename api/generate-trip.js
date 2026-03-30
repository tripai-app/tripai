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

  const { destination, days, persons, budget, hotelCategory, interests, includeTiktok = true, includeHiddenGems = true, wishes = '', travelDate = '', departureCity = '' } = body;

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

  const tiktokSection = includeTiktok ? `,"tiktokSpots":[{"name":"Spot","reason":"Grund","bestTime":"Uhrzeit"}]` : '';
  const hiddenSection = includeHiddenGems ? `,"hiddenGems":[{"name":"Gem","description":"Besonders","howToGet":"Anfahrt"}]` : '';

  const prompt = `Weltreise-Experte. NUR valides JSON, kein Text drumherum.

Reise: ${destination}, ${days} Tage, ${persons} Personen, ${budget}€, ${hotelLabel}, Interessen: ${interestsList || 'Allgemein'}${departureCity ? `\nAbflugstadt: ${departureCity} (realistische Flugpreise und -dauer von dort berechnen)` : ''}${travelDate ? `\nReisedatum: ${travelDate} (Saison, Wetter, Öffnungszeiten und saisonale Aktivitäten berücksichtigen)` : ''}${wishes ? `\nBesondere Wünsche: ${wishes}` : ''}

Antworte mit genau diesem JSON (alle ${days} Tage, je 3 Slots, kurze Texte max 8 Wörter):
{"destination":"${destination}","emoji":"🏝️","heroImage":"Kurz","hotels":[{"name":"Hotel","stars":3,"pricePerNight":80,"location":"Zentrum","highlight":"Top-Lage","bookingSearch":"${destination} hotel"}],"flights":[{"airline":"Airline","type":"Direktflug","duration":"2h","priceFrom":99,"tip":"Früh buchen"}],"days":[{"dayNumber":1,"title":"Ankunft","theme":"✈️ Start","slots":[{"time":"10:00","type":"sehenswuerdigkeit","name":"Ort","description":"Kurz","duration":"2h","cost":10,"openingHours":"9-18","tips":"Tipp","tiktokWorthy":${includeTiktok}},{"time":"13:00","type":"restaurant","name":"Restaurant","description":"Lokal","duration":"1h","cost":20,"cuisine":"Küche","mustTry":"Gericht","tiktokWorthy":false},{"time":"19:00","type":"restaurant","name":"Abendessen","description":"Abend","duration":"1.5h","cost":25,"cuisine":"Lokal","mustTry":"Spezialität","tiktokWorthy":false}]${includeHiddenGems ? ',"hiddenGem":"Geheimtipp"' : ''},"dailyCostEstimate":100}],"costs":{"transport":150,"hotel":400,"essen":300,"aktivitaeten":150,"gesamt":${budget}},"tips":["Tipp1","Tipp2","Tipp3"]${tiktokSection}${hiddenSection},"budgetWithin":true,"savingTips":"Spartipp"}

WICHTIG: Alle ${days} Tage erstellen. Echte Namen verwenden.`;

  // Timeout vor Verlacels 25s-Limit — gibt freundlichen Fehler statt FUNCTION_INVOCATION_TIMEOUT
  const abort = new AbortController();
  const timeoutId = setTimeout(() => abort.abort(), 22000);

  // Mehr Tage = mehr Tokens nötig
  const maxTokens = Math.min(500 + days * 450, 4500);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: abort.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    clearTimeout(timeoutId);

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

    let plan;
    try {
      plan = JSON.parse(jsonMatch[0]);
    } catch {
      // JSON abgeschnitten — versuche bis zur letzten gültigen Stelle zu parsen
      let jsonStr = jsonMatch[0];
      while (jsonStr.length > 10) {
        try {
          plan = JSON.parse(jsonStr + ']}]}');
          break;
        } catch {
          jsonStr = jsonStr.slice(0, jsonStr.lastIndexOf(','));
        }
      }
      if (!plan) {
        return new Response(JSON.stringify({ error: 'KI-Antwort konnte nicht verarbeitet werden. Bitte nochmal versuchen.' }), {
          status: 500, headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    return new Response(JSON.stringify({ plan }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    return new Response(JSON.stringify({
      error: isTimeout
        ? `Plan dauert zu lange (${days} Tage ist viel). Versuche es mit weniger Tagen oder klicke nochmal auf Generieren.`
        : 'Serverfehler: ' + err.message,
    }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
