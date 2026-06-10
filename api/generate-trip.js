// Vercel Edge Function — Claude AI Trip Generator mit Streaming
export const config = { runtime: 'edge' };

// ── Statischer System-Prompt (identisch über alle Requests → Prompt-Caching spart ~80% Input-Kosten) ──
const SYSTEM_PROMPT = `Du bist ein professioneller Weltreise-Experte und erfahrener Reiseplaner. Antworte AUSSCHLIESSLICH mit validem JSON — kein erklärender Text, kein Markdown, keine Codeblöcke, keine Kommentare vor oder nach dem JSON.

═══════════════════════════════════════════════════════════════════
SCHEMA — VOLLSTÄNDIGER REISEPLAN
═══════════════════════════════════════════════════════════════════

{"destination":"Zielort","emoji":"🏝️","hotels":[{"name":"Hotel A","stars":4,"pricePerNight":95,"location":"Stadtzentrum","highlight":"Perfekte Lage & Service"},{"name":"Hotel B","stars":3,"pricePerNight":58,"location":"Altstadt","highlight":"Günstig & zentral gelegen"}],"flights":[{"airline":"Lufthansa","type":"Direktflug","duration":"3h 25min","priceFrom":195,"tip":"Frühbucher spart 30%"},{"airline":"Ryanair","type":"1 Stopp via Wien","duration":"5h 10min","priceFrom":89,"tip":"Günstigste Option"}],"days":[{"dayNumber":1,"title":"Ankunft & Erster Eindruck","theme":"✈️","slots":[{"time":"15:00","type":"sehenswuerdigkeit","name":"Altstadtspaziergang","description":"Erste Orientierung gewinnen","area":"Altstadt","cost":0,"tips":"Offline-Karte herunterladen"},{"time":"19:00","type":"restaurant","name":"Lokale Trattoria","description":"Typische Hausküche genießen","area":"Zentrum","cost":28,"cuisine":"Regional","mustTry":"Signature-Pasta"}],"photoSpots":[{"spot":"Stadtplatz Nordseite","bestTime":"18:30 goldene Stunde","tip":"Weitwinkel für Architektur + Lichtreflexe"}],"hiddenGem":"Versteckter Innenhof hinter Kathedrale","dailyCostEstimate":80},{"dayNumber":2,"title":"Kultur & Altstadt","theme":"🏛️","slots":[{"time":"09:00","type":"sehenswuerdigkeit","name":"Nationalmuseum","description":"Landesgeschichte & Kunst","area":"Museumsviertel","cost":15,"tips":"Audio-Guide lohnt sich"},{"time":"12:30","type":"restaurant","name":"Marktcafé","description":"Frische lokale Marktkost","area":"Zentralmarkt","cost":16,"cuisine":"Regional","mustTry":"Tagessuppe"},{"time":"14:30","type":"aktivitaet","name":"Historische Stadtführung","description":"Lokaler Guide & Geschichten","area":"Altstadt","cost":18,"tips":"Kleine Gruppen buchen"},{"time":"20:00","type":"restaurant","name":"Rooftop Abendessen","description":"Panoramablick & Küche","area":"Neustadt","cost":40,"cuisine":"Mediterran","mustTry":"Spezialität des Hauses"}],"photoSpots":[{"spot":"Burgberg Aussichtspunkt","bestTime":"07:00 Sonnenaufgang","tip":"Stativ + Weitwinkel, wenige Touristen"},{"spot":"Alte Brücke Westufer","bestTime":"20:30 blaue Stunde","tip":"Langzeitbelichtung 15–20s empfohlen"}],"hiddenGem":"Geheimer Dachgarten Bar","dailyCostEstimate":120}],"costs":{"transport":250,"hotel":480,"essen":360,"aktivitaeten":200,"gesamt":1290},"tips":["Frühbuchen spart viel Geld","Bargeld für Märkte mitführen","Öffentliche Verkehrsmittel nutzen"],"tiktokSpots":[{"name":"Aussichtsturm Stadtmitte","reason":"Spektakulärer 360°-Panoramablick","bestTime":"Goldstunde 07:00 Uhr"},{"name":"Bunter Wochenmarkt","reason":"Farbenfroh & voller Atmosphäre","bestTime":"Samstagmorgen 09:00 Uhr"}],"hiddenGems":[{"name":"Verborgene Gasse hinter Markt","description":"Nur Einheimische kennen sie","howToGet":"Hinter der alten Kirche rechts"},{"name":"Geheimbar ohne Schild","description":"Prohibition-Stil Cocktails","howToGet":"Klingeln beim schwarzen Schild"}],"budgetWithin":true,"savingTips":"Mittagsmenüs sind 40% günstiger als Abendessen"}

═══════════════════════════════════════════════════════════════════
SCHEMA — SPLIT-MODUS (nur Tage-Array, KEIN Wrapper-Objekt)
═══════════════════════════════════════════════════════════════════

[{"dayNumber":8,"title":"Strandtag","theme":"🌊","slots":[{"time":"09:00","type":"strand","name":"Hauptstrand","description":"Morgen schwimmen & relaxen","area":"Küste","cost":0,"tips":"Früh kommen für guten Platz"},{"time":"13:00","type":"restaurant","name":"Strandbar","description":"Frische Meeresfrüchte","area":"Strandpromenade","cost":22,"cuisine":"Seafood","mustTry":"Gegrillter Fisch"}],"photoSpots":[{"spot":"Felsenspitze Nordende","bestTime":"19:30 Sonnenuntergang","tip":"Silhouette gegen Orangehimmel"}],"hiddenGem":"Versteckter Felsenpool Südküste","dailyCostEstimate":90}]

═══════════════════════════════════════════════════════════════════
SLOT-TYPEN (erlaubte Werte für slot.type)
═══════════════════════════════════════════════════════════════════

• sehenswuerdigkeit — Museen, Denkmäler, Tempel, Burgen, Aussichtspunkte, historische Stätten, Galerien, Kirchen
• restaurant — Frühstück, Mittagessen, Abendessen, Cafés, Bars, Weinstuben, Streetfood, Märkte
• aktivitaet — Stadtführungen, Kochkurse, Bootstouren, Fahrradtouren, Klettern, Tauchen, Kurse, Workshops, Sport
• strand — Strandaufenthalte, Schnorcheln, Surfen, Kitesurfen, Strandbars, Bootsausflüge, Wasseraktivitäten
• shopping — Basare, Flohmärkte, Designerviertel, Souvenirläden, Winzer, Lebensmittelmärkte, Handwerksmärkte
• natur — Nationalparks, Wanderungen, Wasserfälle, Vulkane, Höhlen, Tierbeobachtung, Botanische Gärten, Landschaft
• wellness — Spa-Behandlungen, Massagen, Hammam, Yoga, Meditation, Thermalbäder, Retreats

═══════════════════════════════════════════════════════════════════
HOTEL-KATEGORIEN UND PREISBEREICHE
═══════════════════════════════════════════════════════════════════

• budget (Hostel / 2-Sterne): unter 50€/Nacht — Gemeinschaftsbäder, einfache Zimmer, Schlafsäle
• mittel (3-Sterne): 50–100€/Nacht — Komfortables Einzelzimmer, guter Standort, Basis-Ausstattung
• komfort (4-Sterne): 100–180€/Nacht — Gehobener Standard, Frühstück inklusive, Spa oder Pool
• luxus (5-Sterne): über 200€/Nacht — Premium-Service, Butler, exklusive Lage, Concierge

═══════════════════════════════════════════════════════════════════
FLUGPREISE — REALISMUS-GUIDE (von Deutschland)
═══════════════════════════════════════════════════════════════════

• Kurzstrecke Europa 1–3h (Prag, Wien, Amsterdam, Paris, Rom, Madrid): 40–150€ Economy
• Mittelstrecke 3–5h (Mallorca, Lissabon, Istanbul, Athen, Kairo, Marokko): 80–300€ Economy
• Langstrecke 6–10h (Dubai, Bangkok, New York, Singapur, Kapstadt, Reykjavik): 350–900€ Economy
• Ultralangstrecke 10h+ (Tokio, Sydney, Buenos Aires, Los Angeles, Honolulu): 600–1400€ Economy

WICHTIG: Niemals Fernstreckenflüge unter 200€ — keine unrealistischen Fantasiepreise!

═══════════════════════════════════════════════════════════════════
FOTO-SPOTS — QUALITÄTSKRITERIEN
═══════════════════════════════════════════════════════════════════

Gute photoSpots haben immer:
• Spezifischen Ort (nicht "Stadtplatz" sondern "Rialto-Brücke Nordseite" oder "Burgberg Ostterrasse")
• Konkrete Uhrzeit mit Begründung (goldene Stunde, Sonnenaufgang, blaue Stunde, Mittag, Nacht)
• Praktischen Foto-Tipp (Weitwinkel, Stativ empfohlen, Reflexion im Wasser, Perspektive, Belichtung)
• Bei Sommer-Trips: frühe Morgenstunden bevorzugen (keine Touristen-Massen)

═══════════════════════════════════════════════════════════════════
QUALITÄTSSTANDARDS
═══════════════════════════════════════════════════════════════════

• Echte Namen: Nur real existierende Orte, Hotels, Restaurants, Stadtteile
• Lokale Küche: Restaurantempfehlungen sollen authentische Gastronomie widerspiegeln
• Logistik: Aktivitäten geografisch sinnvoll anordnen — keine unnötigen langen Fahrwege
• Balance: Gute Mischung aus Kultur, Essen, Natur und Freizeit pro Tag
• Tagesrhythmus: Morgens energieintensiv, Mittag relaxter, Abend gesellig
• Saisonalität: Öffnungszeiten, Wetter und Touristenströme der Reisezeit berücksichtigen

═══════════════════════════════════════════════════════════════════
PFLICHT-REGELN
═══════════════════════════════════════════════════════════════════

1. Nur valides JSON ausgeben — absolut kein Text davor oder danach, kein Markdown
2. Textfelder: maximal 6 Wörter — kurz, prägnant, konkret und informativ
3. Tagesanzahl: EXAKT die angeforderte Anzahl — weder mehr noch weniger
4. Hotels: mindestens 2 Optionen in verschiedenen Preisklassen und Lagen
5. Flüge: mindestens 2 Optionen — Direktflug PLUS günstigere Stopp-Alternative
6. Ortsnamen: ausschließlich echte, existierende Orte und Stadtteile verwenden
7. city-Feld in days: NUR bei Rundreisen befüllen — bei Einzelzielen immer weglassen
8. photoSpots: 1–2 pro Tag mit konkreter Uhrzeit und spezifischem Foto-Tipp
9. Tag 1 = Anreisetag (leichteres Programm), letzter Tag = Abreisetag (sanfter Abschluss)
10. tiktokSpots auf Plan-Ebene: 2–3 viral-taugliche Spots für den Gesamtplan
11. hiddenGems auf Plan-Ebene: 2–3 verborgene touristisch unbekannte Orte
12. hiddenGem auf Tag-Ebene: optional, ein Geheimtipp pro Tag (kurzer String)
13. Budgettreue: Gesamtkosten möglichst ≤ vorgegebenem Budget halten
14. Preisrealismus: Flugpreise nach Region kalkulieren (siehe Guide oben)
15. Split-Modus: Ausgabe NUR als JSON-Array der Tage — kein vollständiges Plan-Objekt`;

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
    splitMode = false, splitStartDay = 1, totalDays = null,
    // Neue Felder
    reiseTyp = '', gruppenTyp = '', essenPrefs = [], essenStil = [],
    aktivitaetslevel = 'ausgewogen',
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
  // ── Reise-Typ / Gruppen / Essen Kontext ──
  const reiseTypMap = { staedtetrip:'Städtetrip (Fokus: Kultur, Sehenswürdigkeiten, Stadtleben)', strand:'Strandurlaub (Fokus: Meer, Relaxen, Wasseraktivitäten)', abenteuer:'Abenteuerreise (Fokus: Outdoor, Sport, Natur)', backpacker:'Backpacker-Reise (günstig, authentisch, off the beaten path)', wellness:'Wellness & Spa (Fokus: Entspannung, Massage, Retreats, ruhige Aktivitäten)', kulinarisch:'Kulinarische Reise (Fokus: Food-Touren, Kochkurse, Weinproben, Märkte)', fotografie:'Fotografie-Reise (Fokus: fotogene Orte, goldene Stunde, Aussichtspunkte)', festival:'Festival & Events (Fokus: lokale Feste, Konzerte, Veranstaltungen, Kultur-Events)' };
  const gruppenMap = { solo:'Einzelreise (Solo-Traveler, max. Flexibilität, kleinere Unterkünfte)', paerchen:'Pärchen-Reise (romantische Atmosphäre, intime Restaurants, Candle-Light)', freunde:'Freundesgruppe (gesellige Aktivitäten, Bars, gemeinsame Erlebnisse)', familie:'Familienreise (alle Altersgruppen, familienfreundliche Aktivitäten)', gruppe:'Große Gruppe 5+ Personen (gruppenfreundliche Locations, Gruppenrabatte)', studenten:'Studenten-Reise (Party, günstig, Hostels, Bars, Abenteuer, Budget)' };
  const reiseTypPart = reiseTyp && reiseTypMap[reiseTyp] ? `\nReise-Typ: ${reiseTypMap[reiseTyp]}.` : '';
  const gruppenPart = gruppenTyp && gruppenMap[gruppenTyp] ? `\nReisegruppe: ${gruppenMap[gruppenTyp]}.` : '';
  const essenDiaetPart = essenPrefs.length > 0 ? `\nDiät/Unverträglichkeit: ${essenPrefs.map(p => ({ vegetarisch:'Vegetarisch', vegan:'Vegan', halal:'Halal', glutenfrei:'Glutenfrei' }[p] || p)).join(', ')} — NUR passende Restaurants empfehlen.` : '';
  const essenStilPart = essenStil.length > 0 ? `\nEssen-Stil: ${essenStil.map(s => ({ streetfood:'Street Food & Märkte bevorzugen', finedining:'Fine Dining & gehobene Restaurants bevorzugen', lokal:'Nur lokale Einheimischen-Restaurants (keine Touristen-Fallen)', fusion:'Moderne Fusion- & Crossover-Küche bevorzugen' }[s] || s)).join(', ')}.` : '';
  const essenPart = essenDiaetPart + essenStilPart;

  // ── Aktivitätslevel ──
  const aktivitaetsMap = {
    entspannt: 'Entspanntes Tempo: maximal 3 Aktivitäten pro Tag, viel Freiraum, keine Hetze.',
    ausgewogen: 'Ausgewogenes Tempo: 4–5 Aktivitäten pro Tag, Mischung aus Aktivität & Erholung.',
    vollgas: 'Intensives Tempo: 6–7 Aktivitäten pro Tag, jede Stunde verplant, maximales Erlebnis.',
  };
  const aktivitaetsPart = aktivitaetsMap[aktivitaetslevel] ? `\nAktivitätslevel: ${aktivitaetsMap[aktivitaetslevel]}` : '';

  // ── Realistische Flugpreise ──
  // Richtwerte: Abflugstadt → Zielregion → Preisrange
  const flightPriceHint = (() => {
    const dest = (destination || '').toLowerCase();
    const dep = (departureCity || '').toLowerCase();
    // Fernreisen (Asien, Amerika, Australien, Afrika)
    const isFern = /japan|tokio|kyoto|bangkok|chiang mai|hanoi|singapur|bali|seoul|peking|shanghai|vietnam|new york|miami|los angeles|chicago|toronto|montreal|havanna|mexiko|buenos aires|sao paulo|kapstadt|nairobi|sydney|australien|dubai|doha/.test(dest);
    // Mittlere Distanz (Kanarische Inseln, Naher Osten, Nordafrika, Osteuropa)
    const isMittel = /malediven|hurghada|sharm|antalya|istanbul|athen|santorini|marrakesch|kairo|jordanien|lissabon|porto|barcelona|madrid|london|reykjavik|teneriffa|lanzarote|mallorca|gran canaria|dubrovnik/.test(dest);
    // Nahziele (Mitteleuropa)
    const isNah = /amsterdam|prag|budapest|wien|berlin|paris|rom|florenz|zürich|luzern|kopenhagen|stockholm|edinburgh|belgrad|krakau|tiflis/.test(dest);

    if (isFern) return `Flugpreise von deutschen Städten (z.B. Frankfurt, München, Berlin): Economy-Klasse ab ca. 400–800€ pro Person für Direktflüge, 300–600€ für 1-Stopp-Optionen. Langstrecken >10h: 500–1200€. KEINE Preise unter 200€ für Interkontinentalflüge!`;
    if (isMittel) return `Flugpreise von deutschen Städten: Mittelstrecke 3–5h Flugzeit, Economy ab ca. 80–200€ (Billigflieger), 150–350€ (Linienflug). Charterflüge zu Ferienzielen ab 100€ möglich.`;
    if (isNah) return `Flugpreise von deutschen Städten: Kurzstrecke 1–3h, Billigflieger ab 30–80€, Linienflüge 80–200€. Frühbucher können 50€+ erreichen.`;
    // Fallback basierend auf Abflugstadt
    return `Flugpreise realistisch kalkulieren: Europaziele 40–200€, Nordafrika/Türkei 80–300€, USA/Fernziele 400–1000€. NIEMALS unrealistisch niedrige Preise wie 20€ für Langstrecke.`;
  })();

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
    prompt = `SPLIT-MODUS: Nur Tage-Array ausgeben (kein Wrapper-Objekt).

Reise: ${destinationStr} | ${effectiveDays} Tage gesamt | ${persons} Personen | ${budget}€${travelDate ? ` | Datum: ${travelDate}` : ''}
Interessen: ${interestsList || 'Allgemein'}${childrenPromptPart}${routePromptPart}

Folgetage einer längeren Reise. Tage ${splitStartDay}–${effectiveDays - 1} = NORMALE Reisetage mit vollem Programm. Nur Tag ${effectiveDays} = Abreise.

→ NUR Tage ${splitStartDay}–${effectiveDays} als JSON-Array, exakt ${splitDays} Tage.`;
  } else {
    maxTokens = 4096;
    prompt = `Erstelle vollständigen Reiseplan:

Ziel: ${destinationStr} | ${effectiveDays} Tage | ${persons} Personen | Budget: ${budget}€ | ${hotelLabel}${departureCity ? `\nAbflugstadt: ${departureCity}` : ''}${travelDate ? `\nReisedatum: ${travelDate} (Saison & Wetter beachten)` : ''}${interestsList ? `\nInteressen: ${interestsList}` : ''}${wishes ? `\nWünsche: ${wishes}` : ''}${reiseTypPart}${gruppenPart}${essenPart}${aktivitaetsPart}${childrenPromptPart}${routePromptPart}
${flightPriceHint}${totalDays && totalDays > effectiveDays ? `\nHINWEIS: Teil 1 einer ${totalDays}-Tage-Reise — Tag ${effectiveDays} ist KEIN Abreisetag, normales Programm!` : ''}

→ Exakt ${effectiveDays} Tage | Min. 2 Hotels | Min. 2 Flüge | photoSpots pro Tag`;
  }

  // Anthropic mit stream:true aufrufen (Prompt Caching via anthropic-beta Header)
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      stream: true,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
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
