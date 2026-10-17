import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../audio/AudioManager';

interface JournalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JournalOverlay: React.FC<JournalOverlayProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'quests' | 'profiles' | 'lore'>('quests');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const handleTabClick = (cat: 'quests' | 'profiles' | 'lore') => {
    setActiveCategory(cat);
    setSelectedEntryId(cat === 'quests' ? 'quest_explore' : cat === 'profiles' ? 'char_vance' : 'lore_institute');
    audioManager.playSFX('hover');
  };

  const handleEntryClick = (id: string) => {
    setSelectedEntryId(id);
    audioManager.playSFX('menu_select');
  };

  const handleClose = () => {
    audioManager.playSFX('click');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl h-[75vh] bg-slate-900/90 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row font-sans"
          >
            {/* Left Category selection */}
            <div className="w-full md:w-1/4 bg-slate-950/45 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex md:flex-col gap-2">
              <div className="hidden md:block mb-6">
                <span className="text-[#00f0ff] font-bold text-xs tracking-widest block uppercase">ACADEMIC LOGBOOK</span>
                <h2 className="text-white text-2xl font-black mt-1">JOURNAL</h2>
              </div>
              
              {(['quests', 'profiles', 'lore'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleTabClick(cat)}
                  className={`px-4 py-2.5 rounded-lg text-left text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-purple-600/35 to-[#00f0ff]/10 border-l-4 border-purple-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {cat === 'quests' ? 'Active Quests' : cat === 'profiles' ? 'Major Profiles' : 'Campus Lore'}
                </button>
              ))}

              <button
                onClick={handleClose}
                className="mt-auto hidden md:block w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs transition-colors"
              >
                CLOSE [ESC/J]
              </button>
            </div>

            {/* Middle panel: List of Entries */}
            <div className="w-full md:w-1/3 bg-slate-900/35 p-6 border-b md:border-b-0 md:border-r border-slate-800 overflow-y-auto">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                {activeCategory === 'quests' ? 'Objectives' : activeCategory === 'profiles' ? 'Students & Faculty' : 'Database Folders'}
              </h3>
              
              <div className="space-y-2">
                {activeCategory === 'quests' && (
                  <>
                    <button
                      onClick={() => handleEntryClick('quest_explore')}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedEntryId === 'quest_explore' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-slate-800/20 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">Explore the Campus</div>
                      <span className="text-[9px] text-[#00f0ff] font-semibold uppercase">ACTIVE</span>
                    </button>
                    <button
                      onClick={() => handleEntryClick('quest_badge')}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedEntryId === 'quest_badge' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-slate-800/20 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">Academic Badge Audit</div>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">COMPLETED</span>
                    </button>
                  </>
                )}

                {activeCategory === 'profiles' && (
                  <>
                    <button
                      onClick={() => handleEntryClick('char_vance')}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedEntryId === 'char_vance' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-slate-800/20 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">Professor Vance</div>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">Faculty Dean</span>
                    </button>
                    <button
                      onClick={() => handleEntryClick('char_emma')}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedEntryId === 'char_emma' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-slate-800/20 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">Emma</div>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">Robotics Lead</span>
                    </button>
                  </>
                )}

                {activeCategory === 'lore' && (
                  <>
                    <button
                      onClick={() => handleEntryClick('lore_institute')}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedEntryId === 'lore_institute' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-slate-800/20 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">The Aether Mainframe</div>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">History</span>
                    </button>
                    <button
                      onClick={() => handleEntryClick('lore_psycho')}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedEntryId === 'lore_psycho' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-slate-800/20 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">Big Five Methodology</div>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">Psychology</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right panel: Details */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-950/40">
              {selectedEntryId === 'quest_explore' && (
                <div className="space-y-4">
                  <h4 className="text-white text-lg font-black">Explore the Campus</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Walk around the 3D environments to discover location landmarks and badges.
                  </p>
                  <div className="border-t border-slate-800 pt-3 space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">CURRENT OBJECTIVES</span>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <input type="checkbox" checked={false} readOnly className="accent-purple-500" />
                      <span>Accept quest parameters from Professor Vance in the Cyber Lab.</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <input type="checkbox" checked={false} readOnly className="accent-purple-500" />
                      <span>Find the Golden Medallion at the central Fountain.</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedEntryId === 'quest_badge' && (
                <div className="space-y-4">
                  <h4 className="text-white text-lg font-black">Academic Badge Audit</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Verification of student credentials across external quadrants.
                  </p>
                  <div className="border-t border-slate-800 pt-3 space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">OBJECTIVES COMPLETED</span>
                    <div className="flex items-center gap-2.5 text-xs text-slate-450 line-through">
                      <span>Explore the Botanical Garden Dome.</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedEntryId === 'char_vance' && (
                <div className="space-y-4">
                  <h4 className="text-white text-lg font-black">Professor Vance</h4>
                  <span className="text-xs bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 px-2 py-0.5 rounded font-bold">
                    DEAN OF CYBERSECURITY
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed pt-2">
                    Orchestrates the main server networks at Aether. Known for strict workstation protocols and zero-tolerance credential guidelines.
                  </p>
                </div>
              )}

              {selectedEntryId === 'char_emma' && (
                <div className="space-y-4">
                  <h4 className="text-white text-lg font-black">Emma</h4>
                  <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded font-bold">
                    ROBOTICS ENGINEERING LEAD
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed pt-2">
                    Spends most of her time inside the Innovation Lab designing drone subroutines. Believes physical logic represents authentic control.
                  </p>
                </div>
              )}

              {selectedEntryId === 'lore_institute' && (
                <div className="space-y-4">
                  <h4 className="text-white text-lg font-black">The Aether Mainframe</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Founded during the Aether Initiative to develop secure cryptographic processing hubs. The architecture uses distributed ledgers to log user metrics secretly.
                  </p>
                </div>
              )}

              {selectedEntryId === 'lore_psycho' && (
                <div className="space-y-4">
                  <h4 className="text-white text-lg font-black">Big Five Methodology</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Evaluates student profiles along five distinct traits: Extraversion, Agreeableness, Conscientiousness, Neuroticism, and Openness. Responses during quests shape the registry.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JournalOverlay;
