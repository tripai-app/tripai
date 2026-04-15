// Vercel Edge Function — Plan aus Supabase laden
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase nicht konfiguriert' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }

  // UUID-Format validieren
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return new Response(JSON.stringify({ error: 'Ungültige ID' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/trip_plans?id=eq.${id}&select=plan`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Supabase-Fehler' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await res.json();
  if (!data?.[0]?.plan) {
    return new Response(JSON.stringify({ error: 'Plan nicht gefunden' }), {
      status: 404, headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data[0].plan), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
