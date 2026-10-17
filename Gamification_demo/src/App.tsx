import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainMenu from './pages/MainMenu';
import GameScreen from './pages/GameScreen';
import SettingsPage from './pages/SettingsPage';
import Dashboard from './pages/Dashboard';
import ResultsScreen from './pages/ResultsScreen';
import ImageQuestionnairePage from './pages/ImageQuestionnairePage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="w-screen h-screen overflow-hidden bg-[#0a0718]">
        <Routes>
          {/* Home route enters image-based questionnaire directly without game/menu options */}
          <Route path="/" element={<ImageQuestionnairePage />} />
          <Route path="/image-questionnaire" element={<ImageQuestionnairePage />} />
          <Route path="/menu" element={<MainMenu />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<ResultsScreen />} />
        </Routes>

        {/* Global Styled Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 10, 30, 0.9)',
              color: '#fff',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
