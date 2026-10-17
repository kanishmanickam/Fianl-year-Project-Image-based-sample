import React from 'react';
import { useQuestStore } from '../quests/QuestManager';
import { motion, AnimatePresence } from 'framer-motion';
import GlassContainer from '../components/ui/GlassContainer';

export const QuestTracker: React.FC = () => {
  const activeQuestsObj = useQuestStore((state) => state.activeQuests);
  const activeQuests = React.useMemo(() => Object.values(activeQuestsObj), [activeQuestsObj]);

  if (activeQuests.length === 0) return null;

  return (
    <div className="absolute top-6 left-6 z-20 w-80 max-w-sm pointer-events-none select-none">
      <AnimatePresence>
        {activeQuests.map((quest) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mb-4 pointer-events-auto"
          >
            <GlassContainer variant="cyan" className="p-4 bg-black/60 border-[#00f0ff]/30">
              {/* Quest Header */}
              <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-2 mb-2">
                <h3 className="font-display text-lg font-black uppercase text-[#00f0ff] tracking-wide glow-text-cyan">
                  {quest.title}
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                  Active
                </span>
              </div>

              {/* Quest Objectives */}
              <ul className="space-y-2">
                {quest.objectives.map((obj) => (
                  <motion.li
                    key={obj.id}
                    layout
                    className="flex items-start gap-2.5 text-sm"
                  >
                    {/* Checkbox indicator */}
                    <div className="mt-0.5 flex-shrink-0">
                      {obj.isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 rounded border border-[#39ff14] bg-[#39ff14]/20 flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-[#39ff14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      ) : (
                        <div className="w-4 h-4 rounded border border-[#00f0ff]/30 bg-black/40" />
                      )}
                    </div>

                    {/* Objective description */}
                    <span
                      className={`transition-all duration-300 leading-tight ${
                        obj.isCompleted
                          ? 'text-[#39ff14]/60 line-through font-medium italic'
                          : 'text-[#f8fafc]/90 font-medium'
                      }`}
                    >
                      {obj.description}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </GlassContainer>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default QuestTracker;
