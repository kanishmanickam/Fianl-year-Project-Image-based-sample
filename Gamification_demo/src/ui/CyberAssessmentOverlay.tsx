import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberAssessmentStore, CYBER_SCENARIOS } from '../store/CyberAssessmentStore';
import GlassContainer from '../components/ui/GlassContainer';
import audioManager from '../audio/AudioManager';

export const CyberAssessmentOverlay: React.FC = () => {
  const {
    isActive,
    currentStep,
    currentIndex,
    selectChoice,
    submitLikert
  } = useCyberAssessmentStore();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const ratingLabels = [
    { value: 1, label: 'Extremely Unlikely' },
    { value: 2, label: 'Unlikely' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Likely' },
    { value: 5, label: 'Extremely Likely' },
  ];

  const scenario = CYBER_SCENARIOS[currentIndex];

  // Keyboard navigation for Cyber Assessment Options
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || !scenario) return;

      if (currentStep === 'story_choice') {
        // Digit or Numpad keys 1-9
        const matchNum = e.code.match(/^(Digit|Numpad)([1-9])$/);
        if (matchNum) {
          const num = parseInt(matchNum[2], 10);
          const choiceIndex = num - 1;
          if (scenario.choices && choiceIndex >= 0 && choiceIndex < scenario.choices.length) {
            e.preventDefault();
            selectChoice(choiceIndex);
          }
          return;
        }

        // Support letter keys A-D
        const matchLetter = e.code.match(/^Key([A-D])$/);
        if (matchLetter) {
          const letter = matchLetter[1];
          const choiceIndex = letter.charCodeAt(0) - 65; // A = 0, B = 1, etc.
          if (scenario.choices && choiceIndex >= 0 && choiceIndex < scenario.choices.length) {
            e.preventDefault();
            selectChoice(choiceIndex);
          }
          return;
        }
      } else {
        // Likert scale rating selection 1-5
        const matchNum = e.code.match(/^(Digit|Numpad)([1-5])$/);
        if (matchNum) {
          const num = parseInt(matchNum[2], 10);
          e.preventDefault();
          submitLikert(num);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStep, scenario, selectChoice, submitLikert]);

  if (!isActive) return null;
  if (!scenario) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05030f]/90 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="w-full max-w-2xl"
        >
          <GlassContainer
            variant="cyan"
            className="p-6 md:p-8 bg-black/95 border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.3)] text-center relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#ff00ff]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Indicator */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] md:text-xs font-black text-[#00f0ff] uppercase tracking-widest bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20">
                Cybersecurity Assessment
              </span>
              <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
                Scenario {currentIndex + 1} of {CYBER_SCENARIOS.length}
              </span>
            </div>

            <h2 className="text-[#00f0ff] font-display font-black text-xl md:text-2xl tracking-wide mb-6 uppercase glow-text-cyan">
              {scenario.title}
            </h2>

            {currentStep === 'story_choice' ? (
              <div className="space-y-6">
                {/* Story Panel */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 md:p-6 text-left">
                  <p className="text-slate-300 font-medium text-sm md:text-base leading-relaxed">
                    {scenario.story}
                  </p>
                </div>

                <p className="text-xs uppercase tracking-widest font-black text-slate-500">
                  Choose your action:
                </p>

                {/* Choices list */}
                <div className="flex flex-col gap-3">
                  {scenario.choices.map((choiceText, idx) => (
                    <button
                      key={idx}
                      onMouseEnter={() => {
                        setHoveredIndex(idx);
                        audioManager.playSFX('button_hover');
                      }}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => selectChoice(idx)}
                      className={`w-full text-left px-5 py-4 rounded-xl font-bold text-sm md:text-base cursor-pointer transition-all duration-300 border ${
                        hoveredIndex === idx
                          ? 'bg-gradient-to-r from-[#00f0ff]/15 to-[#ff00ff]/15 border-[#ff00ff]/70 text-[#ff00ff] translate-x-1 shadow-[0_0_15px_rgba(255,0,255,0.2)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-[#00f0ff]/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black uppercase ${
                          hoveredIndex === idx
                            ? 'bg-[#ff00ff] text-black shadow-[0_0_8px_#ff00ff]'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <span>{choiceText}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 py-4">
                {/* Question */}
                <div className="min-h-[100px] flex items-center justify-center px-4">
                  <p className="text-white font-display font-bold text-lg md:text-xl leading-relaxed tracking-wide glow-text-cyan">
                    "{scenario.question}"
                  </p>
                </div>

                {/* 1-5 Likert scale buttons */}
                <div className="flex justify-between items-center gap-2 md:gap-3 max-w-md mx-auto">
                  {ratingLabels.map((r) => (
                    <button
                      key={r.value}
                      onMouseEnter={() => {
                        setHoveredRating(r.value);
                        audioManager.playSFX('button_hover');
                      }}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => submitLikert(r.value)}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl font-display font-black text-base md:text-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border ${
                        hoveredRating === r.value
                          ? 'bg-gradient-to-br from-[#00f0ff]/20 to-[#ff00ff]/20 border-[#ff00ff] text-[#ff00ff] scale-110 shadow-[0_0_15px_rgba(255,0,255,0.4)]'
                          : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-[#00f0ff] hover:text-[#00f0ff]'
                      }`}
                    >
                      {r.value}
                    </button>
                  ))}
                </div>

                {/* Rating description */}
                <div className="min-h-[24px]">
                  <AnimatePresence mode="wait">
                    {hoveredRating !== null ? (
                      <motion.p
                        key={hoveredRating}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs md:text-sm font-black uppercase tracking-widest text-[#ff00ff] glow-text-magenta"
                      >
                        {ratingLabels.find(r => r.value === hoveredRating)?.label}
                      </motion.p>
                    ) : (
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                        Select a response from 1 to 5
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </GlassContainer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CyberAssessmentOverlay;
