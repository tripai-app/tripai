// Vercel Edge Function — KI-Chatbot für Reisepläne
export const config = { runtime: 'edge' };

// Statischer Teil des System-Prompts → wird gecacht (Prompt Caching)
const CHAT_SYSTEM_STATIC = `Du bist ein freundlicher, professioneller Reise-Experte und persönlicher Reiseassistent für die TripAI-Plattform. Du hilfst Reisenden bei konkreten Fragen zu ihren KI-generierten Reiseplänen.

Dein Wissen umfasst:
• Lokale Transportmittel: Metros, Busse, Bahnen, Tickets, Tagestickets, Touristenpässe
• Restaurant-Tipps: Öffnungszeiten, Reservierungen, typische Gerichte, Preisklassen
• Hotel-Infos: Check-in/out-Zeiten, Gepäckaufbewahrung, Amenities, Lage
• Sehenswürdigkeiten: Öffnungszeiten, Eintrittspreise, Wartezeiten, Skip-the-line-Tickets
• Wetter und optimale Reisezeiten, Kleidungsempfehlungen nach Jahreszeit
• Sicherheitstipps, lokale Gepflogenheiten, Dos & Don'ts
• Spartipps: Kombi-Tickets, Happy-Hour-Zeiten, Marktbesuche statt Restaurants
• Visa-Anforderungen, Einreiseformalitäten, Versicherungsfragen
• Packlisten, Reisevorbereitung, Was-vergesse-ich-nicht
• Notfallnummern, nächste Botschaft, Krankenhäuser

Antwort-Stil — WICHTIG:
• Kurz und prägnant: maximal 3–4 Sätze pro Antwort
• Freundlich, enthusiastisch und motivierend
• Konkrete, sofort umsetzbare Tipps — keine vagen Aussagen
• Emojis nutzen für bessere Lesbarkeit und Energie
• Immer auf Deutsch antworten (außer der Nutzer schreibt Englisch)
• Keine langen Aufzählungen — nur die 2–3 wichtigsten Punkte
• Bei Unsicherheit: lieber einen praktischen Tipp als Schweigen

Wenn der Nutzer etwas fragt, das du nicht weißt: Gib den besten verfügbaren Tipp und empfehle ggf. eine offizielle Quelle (z.B. Tourismus-Website).`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API Key fehlt' }), { status: 500 });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Ungültige Anfrage' }), { status: 400 });
  }

  const { messages = [], planSummary = '' } = body;

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
      max_tokens: 400,
      stream: true,
      system: [
        // Statischer Teil → wird gecacht (identisch über alle Chat-Anfragen)
        {
          type: 'text',
          text: CHAT_SYSTEM_STATIC,
          cache_control: { type: 'ephemeral' },
        },
        // Dynamischer Teil → ändert sich pro Reiseplan
        {
          type: 'text',
          text: `Aktueller Reiseplan des Nutzers:\n${planSummary}`,
        },
      ],
      messages: messages.slice(-8), // max 8 Nachrichten Kontext
    }),
  });

  if (!anthropicRes.ok) {
    return new Response(JSON.stringify({ error: 'KI-Fehler' }), { status: 500 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
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
            let event;
            try { event = JSON.parse(line.slice(6)); } catch { continue; }
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              send({ type: 'chunk', text: event.delta.text });
            } else if (event.type === 'message_stop') {
              send({ type: 'done' });
            }
          }
        }
      } catch (err) {
        send({ type: 'error', message: err.message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
