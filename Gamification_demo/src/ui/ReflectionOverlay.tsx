import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReflectionStore, BIG_FIVE_QUESTIONS } from '../store/ReflectionStore';
import GlassContainer from '../components/ui/GlassContainer';
import audioManager from '../audio/AudioManager';

export const ReflectionOverlay: React.FC = () => {
  const { isOpen, currentIndex, submitResponse } = useReflectionStore();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const ratingLabels = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' },
  ];

  const question = BIG_FIVE_QUESTIONS[currentIndex];

  // Keyboard navigation: press 1-5 to select
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !question) return;

      const matchNum = e.code.match(/^(Digit|Numpad)([1-5])$/);
      if (matchNum) {
        const num = parseInt(matchNum[2], 10);
        e.preventDefault();
        submitResponse(num);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, question, submitResponse]);

  if (!isOpen) return null;
  if (!question) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0718]/85 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="w-full max-w-lg"
        >
          <GlassContainer
            variant="cyan"
            className="p-6 md:p-8 bg-black/90 border-[#00f0ff]/40 shadow-[0_0_40px_rgba(0,240,255,0.25)] text-center relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#ff00ff]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-4">
              <span className="text-[10px] md:text-xs font-black text-[#00f0ff] uppercase tracking-widest bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20">
                Self-Reflection Portal
              </span>
            </div>

            <h3 className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-wider mb-6">
              How much does this statement describe you?
            </h3>

            <div className="min-h-[80px] flex items-center justify-center mb-8 px-4">
              <p className="text-white font-display font-bold text-lg md:text-xl leading-relaxed tracking-wide glow-text-cyan">
                "{question.text}"
              </p>
            </div>

            {/* 1-5 Rating Selection */}
            <div className="flex justify-between items-center gap-2 md:gap-3 mb-8">
              {ratingLabels.map((r) => (
                <button
                  key={r.value}
                  onMouseEnter={() => {
                    setHoveredRating(r.value);
                    audioManager.playSFX('button_hover');
                  }}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => submitResponse(r.value)}
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

            {/* Hover description indicator */}
            <div className="h-6 mb-4">
              <AnimatePresence mode="wait">
                {hoveredRating !== null ? (
                  <motion.p
                    key={hoveredRating}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    {ratingLabels.find((r) => r.value === hoveredRating)?.label}
                  </motion.p>
                ) : (
                  <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">
                    Select a rating from 1 (Strongly Disagree) to 5 (Strongly Agree)
                  </p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center border-t border-[#00f0ff]/10 pt-4">
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                Reflections remaining: {BIG_FIVE_QUESTIONS.length - currentIndex} / {BIG_FIVE_QUESTIONS.length}
              </span>
            </div>
          </GlassContainer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReflectionOverlay;
