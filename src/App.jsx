import { useState, Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlannerForm from './components/PlannerForm';
import AIItinerary from './components/AIItinerary';
import LoadingScreen from './components/LoadingScreen';

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

export default function App() {
  const [page, setPage] = useState('home');
  const [defaultDestination, setDefaultDestination] = useState('');
  const [plannedDestination, setPlannedDestination] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0 }); };

  const handleStartPlanning = () => { setDefaultDestination(''); navigate('planner'); };
  const handlePlanDestination = (dest) => { setDefaultDestination(dest); navigate('planner'); };
  const handleBack = () => navigate('planner');
  const handleNewTrip = () => { setDefaultDestination(''); setPlan(null); navigate('planner'); };

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);
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
      <div>
        <Navbar page={page} onNavigate={navigate} />

        {page === 'home' && (
          <Hero onStartPlanning={handleStartPlanning} onPlanDestination={handlePlanDestination} />
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

        {page === 'itinerary' && plan && (
          <AIItinerary plan={plan} onBack={handleBack} onNewTrip={handleNewTrip} onHome={() => navigate('home')} />
        )}
      </div>
    </ErrorBoundary>
  );
}
