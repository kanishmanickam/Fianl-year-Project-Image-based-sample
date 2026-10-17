import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDialogueStore } from '../dialogue/DialogueEngine';
import { motion, AnimatePresence } from 'framer-motion';
import GlassContainer from '../components/ui/GlassContainer';
import audioManager from '../audio/AudioManager';

interface HistoryItem {
  speaker: string;
  text: string;
}

export const DialogueBox: React.FC = () => {
  const {
    isOpen,
    currentNodeId,
    currentLineIndex,
    getCurrentNode,
    getCurrentLine,
    advanceDialogue,
    selectChoice,
    closeDialogue,
  } = useDialogueStore();

  const node = getCurrentNode();
  const rawLineText = getCurrentLine();

  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<any>(null);

  // Auto Advance & History logs states
  const [isAutoAdvance, setIsAutoAdvance] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Typewriter Speed (milliseconds per character)
  const getTypingSpeed = (): number => {
    try {
      const saved = localStorage.getItem('cyberquest_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const speed = parsed.dialogueSpeed;
        if (speed === 2) return 8; // Fast
        if (speed === 0) return 0; // Instant
      }
    } catch {}
    return 18; // Default Normal
  };
  const TYPING_SPEED = getTypingSpeed();

  // 1. Accumulate History
  useEffect(() => {
    if (isOpen && rawLineText && node) {
      setHistory((prev) => {
        // Prevent duplicate appending
        if (prev.length > 0 && prev[prev.length - 1].text === rawLineText) return prev;
        return [...prev, { speaker: node.speaker, text: rawLineText }];
      });
    }
  }, [isOpen, rawLineText, node]);

  // Clear history on close
  useEffect(() => {
    if (!isOpen) {
      setHistory([]);
      setShowHistory(false);
      setIsAutoAdvance(false);
    }
  }, [isOpen]);

  // 2. Typewriter Effect
  useEffect(() => {
    if (!isOpen || !rawLineText) {
      setDisplayedText('');
      setIsTypingComplete(false);
      return;
    }

    setDisplayedText('');
    setIsTypingComplete(false);

    if (TYPING_SPEED === 0) {
      setDisplayedText(rawLineText);
      setIsTypingComplete(true);
      return;
    }

    let charIndex = 0;
    
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      setDisplayedText((prev) => prev + rawLineText[charIndex]);
      
      // Play typewriter tick
      audioManager.playSFX('typing');

      charIndex++;

      if (charIndex >= rawLineText.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTypingComplete(true);
      }
    }, TYPING_SPEED);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [isOpen, rawLineText, currentNodeId, currentLineIndex, TYPING_SPEED]);

  const handleNext = useCallback(() => {
    if (!isTypingComplete) {
      // Instant complete typing
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(rawLineText || '');
      setIsTypingComplete(true);
      audioManager.playSFX('button_click');
    } else {
      advanceDialogue();
    }
  }, [isTypingComplete, rawLineText, advanceDialogue]);

  // 3. Auto Advance effect
  useEffect(() => {
    if (isAutoAdvance && isTypingComplete) {
      const showChoices = node?.choices && node.choices.length > 0;
      if (!showChoices) {
        const timer = setTimeout(() => {
          handleNext();
        }, 2200);
        return () => clearTimeout(timer);
      }
    }
  }, [isAutoAdvance, isTypingComplete, node, handleNext]);

  // 4. Keyboard Space/Enter keys to Advance / Number keys for choices
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const showChoices = isTypingComplete && node?.choices && node.choices.length > 0;

      if (showChoices) {
        // Digit or Numpad keys 1-9
        const matchNum = e.code.match(/^(Digit|Numpad)([1-9])$/);
        if (matchNum) {
          const num = parseInt(matchNum[2], 10);
          const choiceIndex = num - 1;
          if (node.choices && choiceIndex >= 0 && choiceIndex < node.choices.length) {
            e.preventDefault();
            selectChoice(node.choices[choiceIndex]);
          }
          return;
        }
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        
        // If choices are present and typing is complete, force selection
        if (showChoices) {
          return;
        }

        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isTypingComplete, node, handleNext, selectChoice]);

  const handleSkip = () => {
    audioManager.playSFX('button_click');
    closeDialogue();
  };

  if (!isOpen || !node) return null;

  const showChoices = isTypingComplete && node.choices && node.choices.length > 0;

  // Determine emotional expression based on text contents
  const getEmotion = (): 'happy' | 'concerned' | 'serious' => {
    if (!rawLineText) return 'serious';
    const text = rawLineText.toLowerCase();
    if (text.includes('?') || text.includes('untrusted') || text.includes('warnings') || text.includes('audit')) {
      return 'concerned';
    }
    if (text.includes('perfect') || text.includes('awesome') || text.includes('thanks') || text.includes('welcome') || text.includes('glad')) {
      return 'happy';
    }
    return 'serious';
  };

  const emotion = getEmotion();
  const portraitColor = emotion === 'happy' ? '#10b981' : emotion === 'concerned' ? '#f59e0b' : '#00f0ff';

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[90vw] max-w-4xl select-text font-sans">
      {/* Dialogue History Overlay Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-36 left-0 right-0 max-h-60 bg-slate-950/90 border border-slate-800 rounded-2xl overflow-y-auto p-4 shadow-2xl backdrop-blur-md z-30"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
              <span className="text-[10.5px] font-bold text-[#00f0ff] uppercase tracking-wider">LOG TRANSMISSION HISTORY</span>
              <button
                onClick={() => {
                  setShowHistory(false);
                  audioManager.playSFX('click');
                }}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                CLOSE [X]
              </button>
            </div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="text-xs">
                  <span className="font-extrabold text-[#00f0ff] mr-1.5">{h.speaker}:</span>
                  <span className="text-slate-300 font-medium">{h.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branching Choices Grid */}
      <AnimatePresence>
        {showChoices && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-2.5 mb-4 max-w-2xl mx-auto"
          >
            {node.choices!.map((choice, idx) => (
              <motion.button
                key={`choice-${idx}`}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => selectChoice(choice)}
                onMouseEnter={() => audioManager.playSFX('button_hover')}
                className="w-full text-left font-semibold text-sm px-6 py-3 rounded-xl border bg-slate-900/90 border-[#ff00ff]/25 text-white hover:text-[#ff00ff] hover:border-[#ff00ff]/60 hover:bg-[#ff00ff]/10 transition-all cursor-pointer flex items-center gap-3 shadow-md"
              >
                <span className="w-5 h-5 rounded-full border border-[#ff00ff] bg-black/60 text-[#ff00ff] text-xs font-black flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                {choice.text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dialogue Box */}
      <GlassContainer variant="cyan" className="p-5 bg-black/85 border-[#00f0ff]/35 shadow-[0_0_25px_rgba(0,240,255,0.15)] flex gap-5 items-start">
        {/* Procedural Vector Character Portrait */}
        <div className="hidden md:flex flex-shrink-0 w-24 h-24 rounded-2xl border-2 border-[#00f0ff]/40 bg-gradient-to-br from-[#1e1b4b] to-[#0f0a20] overflow-hidden items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.1)] relative">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
            {/* Cyber Grid */}
            <rect width="100%" height="100%" fill="#0a0518" />
            <path d="M 0,25 L 100,25 M 0,50 L 100,50 M 0,75 L 100,75" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />
            <path d="M 25,0 L 25,100 M 50,0 L 50,100 M 75,0 L 75,100" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />

            {/* Glowing Face Frame */}
            <rect x="25" y="25" width="50" height="50" rx="10" fill="none" stroke={portraitColor} strokeWidth="2.5" />

            {/* Visor glasses */}
            <rect x="32" y="38" width="36" height="12" rx="2" fill="#090616" stroke={portraitColor} strokeWidth="1.5" />
            <line x1="35" y1="44" x2="65" y2="44" stroke={portraitColor} strokeWidth="2" />

            {/* Mouth Curve depending on emotion */}
            {emotion === 'happy' && (
              <path d="M 43,60 Q 50,67 57,60" fill="none" stroke={portraitColor} strokeWidth="2.5" strokeLinecap="round" />
            )}
            {emotion === 'concerned' && (
              <path d="M 43,62 Q 50,60 57,62" fill="none" stroke={portraitColor} strokeWidth="2.5" strokeLinecap="round" />
            )}
            {emotion === 'serious' && (
              <path d="M 43,64 Q 50,57 57,64" fill="none" stroke={portraitColor} strokeWidth="2.5" strokeLinecap="round" />
            )}
          </svg>

          {/* Indicator light */}
          <span
            style={{ backgroundColor: portraitColor }}
            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-ping"
          />
        </div>

        {/* Text Area */}
        <div className="flex-grow flex flex-col min-h-[96px] justify-between">
          <div>
            {/* Speaker Name Tag */}
            <h4 className="text-[#00f0ff] font-extrabold text-base uppercase tracking-wider mb-1.5 flex items-center gap-2 select-none">
              <span className="inline-block w-2 h-2 bg-[#00f0ff] rounded-sm animate-pulse" />
              {node.speaker}
            </h4>

            {/* Typewriter Dialogue Text */}
            <p className="font-medium text-xs md:text-sm leading-relaxed text-[#f8fafc]/95 dialogue-text min-h-[40px]">
              {displayedText}
            </p>
          </div>

          {/* Prompt controls */}
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#00f0ff]/10 select-none">
            {/* Auto & History Toggles */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowHistory((prev) => !prev);
                  audioManager.playSFX('click');
                }}
                className="text-[9px] uppercase font-black tracking-widest text-[#00f0ff] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded hover:bg-slate-800/80 cursor-pointer"
              >
                Log History
              </button>

              <label className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest text-slate-450 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoAdvance}
                  onChange={(e) => {
                    setIsAutoAdvance(e.target.checked);
                    audioManager.playSFX('click');
                  }}
                  className="accent-[#00f0ff] cursor-pointer"
                />
                <span>Auto Advance</span>
              </label>

              <button
                onClick={handleSkip}
                className="text-[9.5px] uppercase font-black tracking-widest text-rose-500/80 hover:text-rose-450 cursor-pointer ml-2"
              >
                Skip [ESC]
              </button>
            </div>

            {/* Next Indicator */}
            {!showChoices && (
              <button
                onClick={handleNext}
                className="pointer-events-auto flex items-center gap-1 font-display text-[10px] font-black uppercase text-[#00f0ff] animate-pulse hover:scale-[1.02] cursor-pointer"
              >
                {isTypingComplete ? 'Space to Continue' : 'Skip Text'}
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default DialogueBox;
