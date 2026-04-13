import React, { useState, useEffect, Component } from 'react';
import './App.css';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlannerForm from './components/PlannerForm';
import AIItinerary from './components/AIItinerary';
import LoadingScreen from './components/LoadingScreen';
import CompareView from './components/CompareView';

/* ── ErrorBoundary: fängt alle React Crashes auf ── */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false }; }
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) {
      return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>✈️</div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 26, marginBottom: 10 }}>Kurzer Fehler</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Einfach die Seite neu laden!</p>
          <button onClick={() => { this.setState({ crashed: false }); window.location.reload(); }}
            style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            🔄 Neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SURPRISE_DESTINATIONS = [
  'Bali', 'Tokio', 'Bangkok', 'Kyoto', 'Singapur', 'New York', 'Miami',
  'Lissabon', 'Porto', 'Barcelona', 'Amsterdam', 'Prag', 'Budapest', 'Wien',
  'Santorini', 'Marrakesch', 'Kapstadt', 'Dubai', 'Malediven', 'Kopenhagen',
  'Stockholm', 'Edinburgh', 'Florenz', 'Luzern', 'Reykjavik', 'Chiang Mai',
  'Hanoi', 'Mexiko-Stadt', 'Buenos Aires', 'Havanna', 'Jordanien',
];

const BUDGET_DESTINATIONS = [
  'Prag', 'Budapest', 'Krakau', 'Porto', 'Lissabon', 'Bangkok',
  'Chiang Mai', 'Hanoi', 'Bali', 'Marrakesch', 'Belgrad', 'Tiflis',
];

export default function App() {
  const [page, setPage] = useState('home');
  const [defaultDestination, setDefaultDestination] = useState('');
  const [plannedDestination, setPlannedDestination] = useState('');
  const [plan, setPlan] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState(null);
  const [streamingTitles, setStreamingTitles] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tripai_dark') === '1');
  const [formResetKey, setFormResetKey] = useState(0);

  const toggleDark = () => setDarkMode(d => {
    const next = !d;
    localStorage.setItem('tripai_dark', next ? '1' : '0');
    return next;
  });

  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0 }); };

  // URL-Params beim Start lesen (geteilter Link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get('dest');
    if (dest) {
      setDefaultDestination(decodeURIComponent(dest));
      navigate('planner');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleStartPlanning = () => { setDefaultDestination(''); navigate('planner'); };
  const handlePlanDestination = (dest) => { setDefaultDestination(dest); navigate('planner'); };
  const handleBack = () => navigate('home');
  const handleNewTrip = () => { setDefaultDestination(''); setPlan(null); setFormResetKey(k => k + 1); navigate('planner'); };
  const handleOpenPlan = (savedPlan) => { setPlan(savedPlan); navigate('itinerary'); };

  const handleSurpriseTrip = () => {
    const dest = SURPRISE_DESTINATIONS[Math.floor(Math.random() * SURPRISE_DESTINATIONS.length)];
    const days = Math.floor(Math.random() * 5) + 3;
    const persons = Math.random() > 0.5 ? 1 : 2;
    const budget = [600, 800, 1000, 1200, 1500][Math.floor(Math.random() * 5)];
    const hotels = ['budget', 'mittel', 'komfort'];
    const allInterests = ['kultur', 'natur', 'strand', 'essen', 'shopping', 'abenteuer', 'entspannung', 'nachtleben'];
    const interests = [...allInterests].sort(() => Math.random() - 0.5).slice(0, 3);
    handleGenerate({ destination: dest, days, persons, budget,
      hotelCategory: hotels[Math.floor(Math.random() * 3)],
      interests, includeTiktok: true, includeHiddenGems: true, wishes: '',
      withChildren: false, childrenAges: [], isRoundtrip: false, roundtripCities: [],
      reiseTyp: '', gruppenTyp: '', essenPrefs: [] });
  };

  const handleLowBudgetTrip = () => {
    const dest = BUDGET_DESTINATIONS[Math.floor(Math.random() * BUDGET_DESTINATIONS.length)];
    handleGenerate({ destination: dest, days: 4, persons: 2, budget: 300,
      hotelCategory: 'budget', interests: ['essen', 'kultur', 'natur'],
      includeTiktok: true, includeHiddenGems: true, wishes: '',
      withChildren: false, childrenAges: [], isRoundtrip: false, roundtripCities: [],
      reiseTyp: '', gruppenTyp: '', essenPrefs: [] });
  };

  // ── Response-Cache: gleiche Anfrage innerhalb 24h aus localStorage ──
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Stunden

  const getCacheKey = (fd) => {
    const interests = [...(fd.interests || [])].sort().join(',');
    const childrenKey = fd.withChildren ? `_kids${[...(fd.childrenAges || [])].sort().join('')}` : '';
    const roundtripKey = fd.isRoundtrip ? `_rt${(fd.roundtripCities || []).map(c => `${c.city}${c.nights}`).join('')}` : '';
    const typeKey = fd.reiseTyp ? `_${fd.reiseTyp}` : '';
    const gruppeKey = fd.gruppenTyp ? `_${fd.gruppenTyp}` : '';
    const essenKey = fd.essenPrefs?.length ? `_e${[...fd.essenPrefs].sort().join('')}` : '';
    return `tripai_cache_${fd.destination}_${fd.days}_${fd.persons}_${fd.budget}_${fd.hotelCategory}_${interests}${childrenKey}${roundtripKey}${typeKey}${gruppeKey}${essenKey}`;
  };

  const readCache = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { plan, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null; }
      return plan;
    } catch { return null; }
  };

  const writeCache = (key, plan) => {
    try { localStorage.setItem(key, JSON.stringify({ plan, ts: Date.now() })); } catch {}
  };

  const lastGenerateRef = React.useRef(0);

  const handleGenerate = async (formData) => {
    // Client-seitiges Rate-Limiting: max 1 Anfrage alle 8 Sekunden
    const now = Date.now();
    if (now - lastGenerateRef.current < 8000) {
      setError('Bitte warte einen Moment bevor du erneut generierst.');
      navigate('planner');
      return;
    }
    lastGenerateRef.current = now;

    setLoading(true);
    setError(null);
    setStreamingTitles([]);
    setLastFormData(formData);
    setPlannedDestination(formData.destination);
    navigate('loading');
    window.scrollTo({ top: 0 });

    const cacheKey = getCacheKey(formData);
    const cached = readCache(cacheKey);

    if (cached) {
      setPlan({ ...cached, budget: formData.budget, persons: formData.persons, travelDate: formData.travelDate || '', departureCity: formData.departureCity || '' });
      setLoading(false);
      navigate('itinerary');
      return;
    }

    // ── Hilfsfunktion: eine API-Anfrage stellen und SSE live streamen ──
    const callApiOnce = async (body, onChunk) => {
      const res = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const ev = JSON.parse(line.slice(6));
            if (ev.type === 'chunk' && ev.text) onChunk?.(ev.text);
            if (ev.type === 'done') return ev;
            if (ev.type === 'error') throw new Error(ev.message);
          } catch (e) {
            if (e.message && !['JSON', 'token', 'Unexpected'].some(w => e.message.includes(w))) throw e;
          }
        }
      }
      throw new Error('Keine gültige Antwort vom Server. Bitte nochmal versuchen.');
    };

    // Auto-Retry: bei Fehler einmal nach 2s nochmal versuchen
    const callApi = async (body, onChunk) => {
      try {
        return await callApiOnce(body, onChunk);
      } catch (firstErr) {
        setLoadingMsg('🔄 Kurzer Fehler — automatischer Neuversuch…');
        await new Promise(r => setTimeout(r, 2000));
        setLoadingMsg('');
        return await callApiOnce(body, onChunk);
      }
    };

    try {
      let finalPlan;

      // Gemeinsamer chunk-Handler: extrahiert Tages-Titel live aus dem Stream
      let accumulated = '';
      const onChunk = (text) => {
        accumulated += text;
        const matches = [...accumulated.matchAll(/"title"\s*:\s*"([^"]{3,40})"/g)];
        if (matches.length > 0) setStreamingTitles(matches.map(m => m[1]));
      };

      if (!formData.isRoundtrip && formData.days > 7) {
        // ── Split: erst Tage 1-7 (mit vollem Plan), dann 8-N ──
        setLoadingMsg('Tage 1–7 werden geplant…');
        const first = await callApi({ ...formData, days: 7 }, onChunk);
        if (!first.plan) throw new Error('Erster Planabschnitt fehlgeschlagen.');

        accumulated = '';
        setLoadingMsg(`Tage 8–${formData.days} werden geplant…`);
        const second = await callApi({
          ...formData,
          splitMode: true,
          splitStartDay: 8,
        }, onChunk);
        if (!second.days) throw new Error('Zweiter Planabschnitt fehlgeschlagen.');

        finalPlan = { ...first.plan, days: [...first.plan.days, ...second.days] };
      } else {
        const result = await callApi(formData, onChunk);
        if (!result.plan) throw new Error('Kein Plan erhalten.');
        finalPlan = result.plan;
      }

      writeCache(cacheKey, finalPlan);
      setPlan({
        ...finalPlan,
        budget: formData.budget,
        persons: formData.persons,
        travelDate: formData.travelDate || '',
        departureCity: formData.departureCity || '',
        withChildren: formData.withChildren || false,
        childrenAges: formData.childrenAges || [],
        isRoundtrip: formData.isRoundtrip || false,
        roundtripCities: formData.roundtripCities || [],
      });
      navigate('itinerary');

    } catch (err) {
      setError(err.message);
      navigate('planner');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ filter: darkMode ? 'invert(92%) hue-rotate(180deg)' : 'none', minHeight: '100vh' }}
           className={darkMode ? 'dark-mode' : ''}>
        <Navbar page={page} onNavigate={navigate} darkMode={darkMode} onToggleDark={toggleDark} onOpenPlan={handleOpenPlan} />

        {page === 'home' && (
          <Hero
            onStartPlanning={handleStartPlanning}
            onPlanDestination={handlePlanDestination}
            onSurpriseTrip={handleSurpriseTrip}
            onLowBudgetTrip={handleLowBudgetTrip}
          />
        )}

        {page === 'planner' && (
          <PlannerForm
            key={formResetKey}
            defaultDestination={defaultDestination}
            onGenerate={handleGenerate}
            isLoading={loading}
            error={error}
            onBack={() => navigate('home')}
          />
        )}

        {page === 'loading' && (
          <LoadingScreen destination={plannedDestination} statusMsg={loadingMsg} streamingTitles={streamingTitles} />
        )}

        {page === 'compare' && (
          <CompareView
            favorites={(() => { try { return JSON.parse(localStorage.getItem('tripai_favorites') || '[]'); } catch { return []; } })()}
            onBack={() => navigate('home')}
          />
        )}

        {page === 'itinerary' && plan && (
          <AIItinerary
            plan={plan}
            onBack={handleBack}
            onNewTrip={handleNewTrip}
            onHome={() => navigate('home')}
            onRegenerate={() => lastFormData && handleGenerate(lastFormData)}
            onRegenerateWithBudget={(budget) => lastFormData && handleGenerate({ ...lastFormData, budget })}
          />
        )}
      </div>
      <Analytics />
    </ErrorBoundary>
  );
}
