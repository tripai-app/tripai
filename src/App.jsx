import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlannerForm from './components/PlannerForm';
import AIItinerary from './components/AIItinerary';
import LoadingScreen from './components/LoadingScreen';

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

      const data = await response.json();

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
        <AIItinerary plan={plan} onBack={handleBack} onNewTrip={handleNewTrip} />
      )}
    </div>
  );
}
