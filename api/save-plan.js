// Vercel Edge Function — Plan in Supabase speichern
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase nicht konfiguriert' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }

  let plan;
  try {
    plan = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültige Anfrage' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/trip_plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ plan }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: 'Supabase-Fehler: ' + err }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await res.json();
  const id = data[0]?.id;

  return new Response(JSON.stringify({ id }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
