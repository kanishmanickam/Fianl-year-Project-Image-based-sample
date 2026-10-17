import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuestStore } from '../../quests/QuestManager';
import { useBigFiveStore } from '../../psychology/BigFiveEngine';
import { useCyberRiskStore } from '../../cyber/CyberRiskEngine';
import { useInventoryStore } from '../../store/InventoryStore';
import { useCyberAssessmentStore } from '../../store/CyberAssessmentStore';
import { useDialogueStore } from '../../dialogue/DialogueEngine';
import telemetryService from '../../analytics/TelemetryService';
import audioManager from '../../audio/AudioManager';
import GlassContainer from './GlassContainer';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prog' | 'big5' | 'cyber' | 'inv'>('prog');

  const { activeQuests, updateObjective } = useQuestStore();
  const { traits } = useBigFiveStore();
  const { profile } = useCyberRiskStore();
  const { addItem, resetInventory } = useInventoryStore();

  if (!isOpen) return null;

  const handleTeleport = (name: string, coords: [number, number, number]) => {
    console.log('Teleporting player to:', name);
    audioManager.playSFX('button_click');
    if ((window as any).teleportPlayer) {
      (window as any).teleportPlayer(...coords);
      telemetryService.resetSession(); // align timer
    }
  };

  const handleCompleteActiveObjectives = () => {
    audioManager.playSFX('quest_complete');
    Object.keys(activeQuests).forEach((qId) => {
      const q = activeQuests[qId];
      q.objectives.forEach((obj) => {
        if (!obj.isCompleted) {
          updateObjective(qId, obj.id, true);
        }
      });
    });
  };

  const handleAdjustTrait = (trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism', val: number) => {
    useBigFiveStore.setState({
      traits: {
        ...traits,
        [trait]: parseFloat(val.toFixed(2))
      }
    });
  };

  const handleAdjustRisk = (category: 'phishingSusceptibility' | 'passwordHygiene' | 'socialEngineeringRisk' | 'deviceSecurityRisk' | 'softwareSafetyRisk', val: number) => {
    useCyberRiskStore.setState({
      profile: {
        ...profile,
        [category]: parseFloat(val.toFixed(1))
      }
    });
  };

  const handleGiveAllItems = () => {
    audioManager.playSFX('quest_complete');
    resetInventory();
    addItem({
      id: 'item_emma_delivered',
      name: 'Library Book Receipt',
      category: 'quest',
      description: 'Receipt proving Emma\'s books were delivered.',
      icon: '📄',
      rarity: 'common',
    });
    addItem({
      id: 'item_lucas_notebook',
      name: 'Lucas\'s Blue Notebook',
      category: 'quest',
      description: 'A blue binder containing statistics research.',
      icon: '📘',
      rarity: 'common',
    });
    addItem({
      id: 'item_orion_coffee',
      name: 'Professor Orion\'s Latte',
      category: 'quest',
      description: 'A hot coffee freshly brewed from the Cafeteria.',
      icon: '☕',
      rarity: 'common',
    });
    addItem({
      id: 'item_lost_id',
      name: 'Sophia\'s Student ID',
      category: 'quest',
      description: 'A lost Aether Institute student badge.',
      icon: '🪪',
      rarity: 'common',
    });
    addItem({
      id: 'item_key_fob',
      name: 'Cyber Lab Key Fob',
      category: 'quest',
      description: 'Key Fob for entering the Cyber Lab.',
      icon: '🔑',
      rarity: 'rare',
    });
  };

  const handleInstantAssessment = () => {
    audioManager.playSFX('button_click');
    onClose();
    // Get the active quest or force Kai complete
    const q5 = activeQuests['quest_5_cyber'];
    if (q5) {
      updateObjective('quest_5_cyber', 'report_kai', true);
    }
    useCyberAssessmentStore.getState().startAssessment(() => {
      setTimeout(() => {
        useDialogueStore.getState().startDialogue(
          [
            {
              id: 'orion_ending_start',
              speaker: 'Professor Orion',
              lines: [
                "Today wasn't about passing a test.",
                "It was about understanding how our decisions shape the way we interact with technology.",
                "Thank you for taking part in this journey."
              ],
              nextNodeId: null
            }
          ],
          'orion_ending_start',
          () => {
            const el = document.querySelector('.game-canvas-container');
            if (el) el.dispatchEvent(new CustomEvent('endGameCredits'));
          }
        );
      }, 800);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm select-none font-sans p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <GlassContainer variant="cyan" className="p-6 bg-black/90 border-[#00f0ff]/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#00f0ff] animate-ping" />
              <h2 className="text-lg font-black tracking-widest text-[#00f0ff] uppercase">SYSTEM DEBUG CONSOLE</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs font-black uppercase border border-slate-800 px-2 py-1 rounded bg-slate-950/40 hover:bg-slate-900 cursor-pointer"
            >
              CLOSE [X]
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800/60 pb-2 mb-4 gap-2">
            {[
              { id: 'prog', label: 'Progression & Map' },
              { id: 'big5', label: 'Big Five Traits' },
              { id: 'cyber', label: 'Cyber Risk' },
              { id: 'inv', label: 'Inventory & Reset' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); audioManager.playSFX('click'); }}
                className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff]'
                    : 'text-slate-400 border border-transparent hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto pr-1 text-left">
            {activeTab === 'prog' && (
              <div className="space-y-4">
                {/* Skip Objectives */}
                <div className="bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Quest Progression</h3>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Active: {Object.keys(activeQuests).map(k => activeQuests[k].title).join(', ') || 'None'}
                    </span>
                    <button
                      onClick={handleCompleteActiveObjectives}
                      className="px-4 py-2 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/30 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Complete Active Objectives
                    </button>
                  </div>
                </div>

                {/* Teleportation Grid */}
                <div className="bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Teleport Player</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { name: 'Main Entrance', coords: [0, 1.5, 26] as [number, number, number] },
                      { name: 'Student Plaza', coords: [0, 1.5, 0] as [number, number, number] },
                      { name: 'Library', coords: [-28, 1.5, 3] as [number, number, number] },
                      { name: 'Innovation Lab', coords: [20, 1.5, 18] as [number, number, number] },
                      { name: 'Cafeteria', coords: [-20, 1.5, 20] as [number, number, number] },
                      { name: 'Botanical Garden', coords: [0, 1.5, 28] as [number, number, number] },
                      { name: 'Cyber Lab Entrance', coords: [0, 1.5, -28] as [number, number, number] },
                    ].map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => handleTeleport(loc.name, loc.coords)}
                        className="p-2 border border-slate-800/60 rounded-lg text-[10px] text-slate-300 hover:text-white font-medium bg-slate-900/40 hover:bg-slate-850 hover:border-slate-700 transition-all cursor-pointer text-center"
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'big5' && (
              <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Adjust Big Five Personality Metrics</h3>
                {[
                  { id: 'openness', label: 'Openness (O)' },
                  { id: 'conscientiousness', label: 'Conscientiousness (C)' },
                  { id: 'extraversion', label: 'Extraversion (E)' },
                  { id: 'agreeableness', label: 'Agreeableness (A)' },
                  { id: 'neuroticism', label: 'Neuroticism (N)' },
                ].map((item) => {
                  const key = item.id as keyof typeof traits;
                  const val = traits[key];
                  return (
                    <div key={item.id}>
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1">
                        <span>{item.label}</span>
                        <span className="text-[#00f0ff] font-mono">{val.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.05"
                        value={val}
                        onChange={(e) => handleAdjustTrait(key, parseFloat(e.target.value))}
                        className="w-full h-1 bg-[#1a113a] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'cyber' && (
              <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Adjust Cybersecurity Risk Indices</h3>
                {[
                  { id: 'phishingSusceptibility', label: 'Phishing Susceptibility' },
                  { id: 'passwordHygiene', label: 'Password Hygiene Risk' },
                  { id: 'socialEngineeringRisk', label: 'Social Engineering Risk' },
                  { id: 'deviceSecurityRisk', label: 'Device Security Risk' },
                  { id: 'softwareSafetyRisk', label: 'Software Safety Risk' },
                ].map((item) => {
                  const key = item.id as keyof typeof profile;
                  const val = profile[key];
                  return (
                    <div key={item.id}>
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1">
                        <span>{item.label}</span>
                        <span className="text-[#ff00ff] font-mono">{val.toFixed(1)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={val}
                        onChange={(e) => handleAdjustRisk(key, parseFloat(e.target.value))}
                        className="w-full h-1 bg-[#1a113a] rounded-lg appearance-none cursor-pointer accent-[#ff00ff]"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'inv' && (
              <div className="space-y-3">
                {/* Inventory Adjuster */}
                <div className="bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Inventory Helper</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGiveAllItems}
                      className="px-4 py-2 bg-purple-600/25 hover:bg-purple-600/35 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Give All Quest Items
                    </button>
                    <button
                      onClick={() => { resetInventory(); audioManager.playSFX('button_click'); }}
                      className="px-4 py-2 bg-slate-800/40 hover:bg-slate-700/40 border border-slate-700/40 text-slate-450 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Clear Inventory
                    </button>
                  </div>
                </div>

                {/* Instant Assessment */}
                <div className="bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Fast Assessment</h3>
                    <p className="text-[9.5px] text-slate-500 font-medium mt-0.5">Launches the 6-scenarios survey overlay instantly</p>
                  </div>
                  <button
                    onClick={handleInstantAssessment}
                    className="px-4 py-2 bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Force Start Assessment
                  </button>
                </div>
              </div>
            )}
          </div>
        </GlassContainer>
      </motion.div>
    </div>
  );
};

export default DebugPanel;
