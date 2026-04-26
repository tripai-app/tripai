import { useState } from 'react';
import { signIn, signUp, signOut, getUser } from '../utils/auth';

export default function AuthModal({ onClose, onAuthChange }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = getUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Bitte alle Felder ausfüllen.'); return; }
    if (password.length < 6) { setError('Passwort muss mindestens 6 Zeichen haben.'); return; }
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setSuccess('✅ Registrierung erfolgreich! Bitte E-Mail bestätigen, dann einloggen.');
        setMode('login');
      } else {
        await signIn(email, password);
        onAuthChange?.();
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onAuthChange?.();
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', maxWidth: 360, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>

        {user ? (
          /* Eingeloggt — Profil anzeigen */
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 12px' }}>👤</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Angemeldet</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{user.email}</div>
            </div>
            <button onClick={handleLogout} style={{ width: '100%', background: '#fff1f2', border: '1.5px solid #fecaca', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700, color: '#dc2626', cursor: 'pointer', marginBottom: 10 }}>
              🚪 Abmelden
            </button>
            <button onClick={onClose} style={{ width: '100%', background: '#f8fafc', border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
              Schließen
            </button>
          </>
        ) : (
          /* Login / Registrierung */
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✈️</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{mode === 'login' ? 'Anmelden' : 'Registrieren'}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                {mode === 'login' ? 'Deine gespeicherten Pläne überall abrufbar' : 'Kostenlosen Account erstellen'}
              </div>
            </div>

            {success && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#166534', marginBottom: 16 }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="E-Mail Adresse"
                style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Passwort (min. 6 Zeichen)"
                style={{ border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />

              {error && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecaca', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 800, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                {loading ? '⏳ Lädt…' : mode === 'login' ? '🔐 Anmelden' : '🚀 Registrieren'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
              {mode === 'login' ? (
                <>Noch kein Account? <button onClick={() => { setMode('signup'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}>Registrieren</button></>
              ) : (
                <>Schon registriert? <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}>Anmelden</button></>
              )}
            </div>

            <button onClick={onClose} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#94a3b8', marginTop: 12, padding: '4px 0' }}>
              Ohne Account weiter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
