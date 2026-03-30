import { useState, useEffect, Component } from 'react';
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
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tripai_dark') === '1');

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
  const handleNewTrip = () => { setDefaultDestination(''); setPlan(null); navigate('planner'); };
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
      interests, includeTiktok: true, includeHiddenGems: true, wishes: '' });
  };

  const handleLowBudgetTrip = () => {
    const dest = BUDGET_DESTINATIONS[Math.floor(Math.random() * BUDGET_DESTINATIONS.length)];
    handleGenerate({ destination: dest, days: 4, persons: 2, budget: 300,
      hotelCategory: 'budget', interests: ['essen', 'kultur', 'natur'],
      includeTiktok: true, includeHiddenGems: true, wishes: '' });
  };

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);
    setLastFormData(formData);
    setPlannedDestination(formData.destination);
    navigate('loading');
    window.scrollTo({ top: 0 });

    try {
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server-Fehler: ' + text.slice(0, 200));
      }

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Fehler beim Generieren');
      }

      setPlan({ ...data.plan, budget: formData.budget, persons: formData.persons });
      navigate('itinerary');
    } catch (err) {
      setError(err.message);
      navigate('planner');
    } finally {
      setLoading(false);
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
            defaultDestination={defaultDestination}
            onGenerate={handleGenerate}
            isLoading={loading}
            error={error}
          />
        )}

        {page === 'loading' && (
          <LoadingScreen destination={plannedDestination} />
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
