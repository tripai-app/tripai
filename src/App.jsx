import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlannerForm from './components/PlannerForm';
import Itinerary from './components/Itinerary';
import { generateItinerary } from './data/itineraryData';

export default function App() {
  const [page, setPage] = useState('home');
  const [defaultDestination, setDefaultDestination] = useState('');
  const [plan, setPlan] = useState(null);

  const handleStartPlanning = () => {
    setDefaultDestination('');
    setPage('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanDestination = (dest) => {
    setDefaultDestination(dest);
    setPage('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = (formData) => {
    const generatedPlan = generateItinerary(formData);
    setPlan({ ...generatedPlan, budget: formData.budget, persons: formData.persons });
    setPage('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setPage('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewTrip = () => {
    setDefaultDestination('');
    setPlan(null);
    setPage('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar page={page} onNavigate={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />

      {page === 'home' && (
        <Hero
          onStartPlanning={handleStartPlanning}
          onPlanDestination={handlePlanDestination}
        />
      )}

      {page === 'planner' && (
        <PlannerForm
          defaultDestination={defaultDestination}
          onGenerate={handleGenerate}
        />
      )}

      {page === 'itinerary' && plan && (
        <Itinerary
          plan={plan}
          onBack={handleBack}
          onNewTrip={handleNewTrip}
        />
      )}
    </div>
  );
}
