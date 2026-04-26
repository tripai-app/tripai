// Supabase Auth Helper — public anon keys are safe in client code
const SUPABASE_URL = 'https://itccgeygakgogrqldwqn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ErnBp26SDqscL1EjEUsxWw_1m0mkkLq';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
};

export async function signUp(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error_description || 'Registrierung fehlgeschlagen');
  return data;
}

export async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'Anmeldung fehlgeschlagen');
  // Session speichern
  localStorage.setItem('tripai_session', JSON.stringify({
    access_token: data.access_token,
    user: data.user,
    expires_at: Date.now() + data.expires_in * 1000,
  }));
  return data;
}

export async function signOut() {
  const session = getSession();
  if (session) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: { ...headers, 'Authorization': `Bearer ${session.access_token}` },
    }).catch(() => {});
  }
  localStorage.removeItem('tripai_session');
}

export function getSession() {
  try {
    const raw = localStorage.getItem('tripai_session');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expires_at) {
      localStorage.removeItem('tripai_session');
      return null;
    }
    return session;
  } catch { return null; }
}

export function getUser() {
  return getSession()?.user || null;
}
