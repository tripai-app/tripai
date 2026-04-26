// Vercel Edge Function — KI-Chatbot für Reisepläne
export const config = { runtime: 'edge' };

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

  const system = `Du bist ein freundlicher Reise-Experte und Assistent für TripAI.
Aktueller Reiseplan: ${planSummary}

Beantworte Fragen zu diesem Plan auf Deutsch. Sei kurz (max. 3-4 Sätze), freundlich und hilfreich.
Wenn du konkrete Tipps gibst, nutze Emojis. Keine langen Listen — nur die wichtigsten Infos.`;

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      stream: true,
      system,
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
