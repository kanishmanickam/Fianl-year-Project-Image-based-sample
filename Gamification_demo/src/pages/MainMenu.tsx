import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import SaveManager from '../save/SaveManager';
import audioManager from '../audio/AudioManager';

export const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const hasSave = SaveManager.hasSaveGame();

  React.useEffect(() => {
    audioManager.playMusic('menu_theme');
    return () => {
      // Fade out menu theme
    };
  }, []);

  const handleNewGame = () => {
    // Reset any existing metrics
    localStorage.removeItem('cyberquest_save_game');
    navigate('/game');
  };

  const handleContinue = () => {
    if (hasSave) {
      navigate('/game?continue=true');
    }
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-[#0a0718] overflow-hidden select-none">
      {/* 1. Neon Grid Backdrop Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1a3a_1px,transparent_1px),linear-gradient(to_bottom,#1f1a3a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
      
      {/* Glowing neon shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Main Menu Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="z-10 flex flex-col items-center max-w-lg w-full text-center px-6"
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="mb-14"
        >
          <span className="font-display text-sm tracking-[0.4em] text-[#00f0ff] uppercase font-black glow-text-cyan">
            A Cybersecurity Assessment RPG
          </span>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight leading-none mt-2 select-none uppercase">
            Cyber<span className="text-[#ff00ff] glow-text-magenta">Quest</span>
          </h1>
          <h2 className="font-display font-extrabold text-xl md:text-2xl text-slate-400 tracking-[0.15em] uppercase mt-1">
            Campus Security Assessment
          </h2>
        </motion.div>

        {/* Buttons Grid */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button variant="cyan" onClick={handleNewGame} id="new-game-btn">
            New Game
          </Button>

          <Button
            variant="magenta"
            onClick={handleContinue}
            disabled={!hasSave}
            id="continue-btn"
            className={!hasSave ? 'pointer-events-none' : ''}
          >
            Continue
          </Button>

          <Button variant="neutral" onClick={() => navigate('/settings')} id="settings-btn">
            Settings
          </Button>

          <Button
            variant="neutral"
            onClick={() => navigate('/dashboard')}
            id="dashboard-btn"
            className="border-slate-500/20 text-slate-400 hover:border-slate-400 hover:text-white"
          >
            Results Dashboard
          </Button>

          <Button
            variant="cyan"
            onClick={() => navigate('/image-questionnaire')}
            id="image-questionnaire-btn"
            className="border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/10"
          >
            Image-Based Questionnaire
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-20 text-[10px] uppercase font-bold tracking-widest text-slate-600">
          © 2026 Academic Capstone Project
        </div>
      </motion.div>
    </div>
  );
};

export default MainMenu;
