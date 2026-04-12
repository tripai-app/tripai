// Vercel Edge Function — Claude AI Trip Generator mit Streaming
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

  const {
    destination, days, persons, budget, hotelCategory, interests,
    includeTiktok = true, includeHiddenGems = true, wishes = '',
    travelDate = '', departureCity = '',
    // Kinder-Feature
    withChildren = false, childrenAges = [],
    // Rundreise-Feature
    isRoundtrip = false, roundtripCities = [],
    // Split-Modus: nur bestimmte Tage generieren
    splitMode = false, splitStartDay = 1,
  } = body;

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

  // ── Kinder-Kontext ──
  const ageLabels = { baby: '0–2 Jahre', kleinkind: '3–6 Jahre', schulkind: '7–12 Jahre', teenager: '13–17 Jahre' };
  const childrenAgesLabel = childrenAges.map(a => ageLabels[a] || a).join(', ') || 'Kinder';
  const childrenPromptPart = withChildren
    ? `\nFamilienreise mit Kindern (${childrenAgesLabel}). Empfehle: kinderfreundliche Aktivitäten (Zoos, Wasserparks, Naturerlebnisse, interaktive Museen), Restaurants mit Kindermenü, familiengerechte Unterkunft. Vermeide: Nachtleben, sehr lange Wanderungen, ungeeignete Sehenswürdigkeiten.`
    : '';

  // ── Rundreise-Kontext ──
  let effectiveDays = days;
  let destinationStr = destination;
  let routePromptPart = '';
  let roundtripDaySchema = '';

  if (isRoundtrip && roundtripCities.length > 0) {
    let dayCounter = 1;
    const citySegments = roundtripCities.map(c => {
      const start = dayCounter;
      const end = dayCounter + c.nights - 1;
      dayCounter += c.nights;
      return `${c.city} (${c.nights} Nächte, Tage ${start}–${end})`;
    });
    effectiveDays = roundtripCities.reduce((s, c) => s + c.nights, 0);
    destinationStr = `Rundreise: ${citySegments.join(' → ')}`;
    routePromptPart = `\nRundreise: Füge "city":"Stadtname" zu JEDEM day-Objekt hinzu. Tag 1 = Anreise erste Stadt, letzter Tag = Abreise letzte Stadt.`;
    roundtripDaySchema = `,"city":"Stadtname"`;
  }

  // ── Split-Modus: nur zusätzliche Tage generieren (für Trips > 7 Tage) ──
  let prompt;
  let maxTokens;

  if (splitMode) {
    const splitDays = days - splitStartDay + 1;
    maxTokens = Math.min(600 + splitDays * 380, 3500);
    prompt = `Reise-Experte. NUR valides JSON, kein Text.

Fortsetzung: ${destinationStr}, ${effectiveDays} Tage gesamt, ${persons} Personen, ${budget}€, Interessen: ${interestsList || 'Allgemein'}${travelDate ? `, Reisedatum: ${travelDate}` : ''}${childrenPromptPart}

Generiere NUR die Tage ${splitStartDay} bis ${effectiveDays} als JSON-Array:
[{"dayNumber":${splitStartDay}${roundtripDaySchema},"title":"Titel","theme":"🗺️","slots":[{"time":"09:00","type":"sehenswuerdigkeit","name":"Name","description":"Kurz","area":"Viertel","cost":10,"tips":"Tipp"},{"time":"13:00","type":"restaurant","name":"Name","description":"Lokal","area":"Bezirk","cost":20,"cuisine":"Küche","mustTry":"Gericht"},{"time":"19:00","type":"restaurant","name":"Name","description":"Abend","area":"Stadtteil","cost":25,"cuisine":"Lokal","mustTry":"Gericht"}]${includeHiddenGems ? ',"hiddenGem":"Geheimtipp"' : ''},"dailyCostEstimate":100}]

Alle ${splitDays} Tage (${splitStartDay}–${effectiveDays}) ausgeben. Echte Ortsnamen.`;
  } else {
    maxTokens = isRoundtrip ? 4096 : Math.min(900 + effectiveDays * 380, 4000);
    prompt = `Weltreise-Experte. NUR valides JSON, kein Text drumherum.

Reise: ${destinationStr}, ${effectiveDays} Tage, ${persons} Personen, ${budget}€, ${hotelLabel}, Interessen: ${interestsList || 'Allgemein'}${departureCity ? `\nAbflugstadt: ${departureCity} (realistische Flugpreise und -dauer von dort berechnen)` : ''}${travelDate ? `\nReisedatum: ${travelDate} (Saison, Wetter, Öffnungszeiten und saisonale Aktivitäten berücksichtigen)` : ''}${wishes ? `\nBesondere Wünsche: ${wishes}` : ''}${childrenPromptPart}${routePromptPart}

JSON-Schema (ALLE ${effectiveDays} Tage, max 6 Wörter pro Textfeld, kurz halten):
{"destination":"${destinationStr}","emoji":"🏝️","hotels":[{"name":"Hotel","stars":3,"pricePerNight":80,"location":"Zentrum","highlight":"Top-Lage","bookingSearch":"${destination} hotel"}],"flights":[{"airline":"Air","type":"Direktflug","duration":"2h","priceFrom":99,"tip":"Tipp"}],"days":[{"dayNumber":1${roundtripDaySchema},"title":"Titel","theme":"✈️","slots":[{"time":"09:00","type":"sehenswuerdigkeit","name":"Name","description":"Kurz","area":"Viertel","cost":10,"tips":"Tipp"},{"time":"13:00","type":"restaurant","name":"Name","description":"Lokal","area":"Bezirk","cost":20,"cuisine":"Küche","mustTry":"Gericht"},{"time":"19:00","type":"restaurant","name":"Name","description":"Abend","area":"Stadtteil","cost":25,"cuisine":"Lokal","mustTry":"Gericht"}]${includeHiddenGems ? ',"hiddenGem":"Geheimtipp"' : ''},"dailyCostEstimate":100}],"costs":{"transport":150,"hotel":400,"essen":300,"aktivitaeten":150,"gesamt":${budget}},"tips":["Tipp1","Tipp2","Tipp3"]${tiktokSection}${hiddenSection},"budgetWithin":true,"savingTips":"Tipp"}

Alle ${effectiveDays} Tage ausgeben. Echte Ortsnamen.`;
  }

  // Anthropic mit stream:true aufrufen
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(JSON.stringify({ error: 'KI-Fehler: ' + err }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  // SSE-Stream an Client weiterleiten — Vercel-Timeout wird durch ersten Byte zurückgesetzt
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

      let fullText = '';
      const reader = anthropicRes.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === '[DONE]') continue;

            let event;
            try { event = JSON.parse(raw); } catch { continue; }

            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              fullText += event.delta.text;
              // Text-Delta streamen (ermöglicht Live-Vorschau im Client)
              send({ type: 'chunk', text: event.delta.text });
            } else if (event.type === 'message_stop') {
              if (splitMode) {
                // Split-Modus: Array von Tagen extrahieren
                const arrMatch = fullText.match(/\[[\s\S]*\]/);
                if (!arrMatch) { send({ type: 'error', message: 'Ungültige Antwort (Split)' }); break; }
                let days;
                try { days = JSON.parse(arrMatch[0]); } catch {
                  let s = arrMatch[0];
                  while (s.length > 5) {
                    try { days = JSON.parse(s + ']}'); break; }
                    catch { s = s.slice(0, s.lastIndexOf(',')); }
                  }
                }
                if (days) send({ type: 'done', days });
                else send({ type: 'error', message: 'Split-Antwort konnte nicht verarbeitet werden.' });
              } else {
                // Normaler Modus: volles Plan-Objekt extrahieren
                const jsonMatch = fullText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) { send({ type: 'error', message: 'Ungültige KI-Antwort' }); break; }
                let plan;
                try { plan = JSON.parse(jsonMatch[0]); } catch {
                  let jsonStr = jsonMatch[0];
                  while (jsonStr.length > 10) {
                    try { plan = JSON.parse(jsonStr + ']}]}'); break; }
                    catch { jsonStr = jsonStr.slice(0, jsonStr.lastIndexOf(',')); }
                  }
                }
                if (plan) send({ type: 'done', plan });
                else send({ type: 'error', message: 'Antwort konnte nicht verarbeitet werden. Bitte nochmal versuchen.' });
              }
            } else if (event.type === 'error') {
              send({ type: 'error', message: event.error?.message || 'KI-Fehler' });
            }
          }
        }
      } catch (err) {
        send({ type: 'error', message: 'Verbindungsfehler: ' + err.message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
