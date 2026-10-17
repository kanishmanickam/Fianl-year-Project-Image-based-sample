import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PhysicsWorld from '../physics/PhysicsWorld';
import Campus from '../world/Campus';
import Player from '../characters/Player';
import NPC from '../characters/NPC';
import NPCManager from '../characters/NPCManager';
import QuestTracker from '../ui/QuestTracker';
import DialogueBox from '../ui/DialogueBox';
import GlassContainer from '../components/ui/GlassContainer';
import Button from '../components/ui/Button';
import { useSave } from '../save/useSave';
import { useQuestStore } from '../quests/QuestManager';
import type { Quest } from '../quests/QuestManager';
import audioManager from '../audio/AudioManager';
import { useAvatarStore } from '../characters/AvatarStore';
import CharacterCustomizer from '../ui/CharacterCustomizer';
import InventoryOverlay from '../ui/InventoryOverlay';
import JournalOverlay from '../ui/JournalOverlay';
import WorldMapOverlay from '../ui/WorldMapOverlay';
import { CAMPUS_COORDS } from '../characters/NPCDatabase';
import { useGamePhaseStore } from '../store/GamePhaseStore';

import { useReflectionStore } from '../store/ReflectionStore';
import { useInventoryStore } from '../store/InventoryStore';
import { useDialogueStore } from '../dialogue/DialogueEngine';
import { useCyberAssessmentStore } from '../store/CyberAssessmentStore';
import ReflectionOverlay from '../ui/ReflectionOverlay';
import CyberAssessmentOverlay from '../ui/CyberAssessmentOverlay';
import DebugPanel from '../components/ui/DebugPanel';
import toast from 'react-hot-toast';

import {
  orionQuest1,
  orionQuest2Pending,
  orionQuest3Start,
  orionQuest3Pending,
  orionQuest4Start,
  orionQuest4Pending,
  orionCoffeeComplete,
  orionQuest5Start,
  orionQuest5Pending,
  emmaMeetDialogue,
  emmaSideStart,
  emmaSideProgress,
  emmaSideComplete,
  kaiMeetDialogue,
  kaiGenericDialogue,
  kaiQuest5Dialogue,
  sophiaMeetDialogue,
  sophiaSideStart,
  sophiaSideComplete,
  lucasMeetDialogue,
  lucasSideStart,
  lucasSideComplete,
  miaMeetDialogue,
  miaSideStart,
  miaSideComplete,
  receptionistGeneric,
  guardGeneric,
} from '../dialogue/StoryDialogues';

// ─── 5-QUEST SEQUENCE DEFINITIONS ──────────────────────────────────────────────
const quest1: Quest = {
  id: 'quest_1_orion',
  title: 'Meet Professor Orion',
  description: 'Talk to Professor Orion at the Student Plaza.',
  isCompleted: false,
  objectives: [
    { id: 'meet_orion', description: 'Talk to Professor Orion', isCompleted: false, type: 'talk' }
  ]
};

const quest2: Quest = {
  id: 'quest_2_explore',
  title: 'Explore the Campus',
  description: 'Visit the main campus buildings: Library, Innovation Lab, Cafe, and Botanical Garden.',
  isCompleted: false,
  objectives: [
    { id: 'visit_library', description: 'Visit the Library', isCompleted: false, type: 'trigger' },
    { id: 'visit_innovation', description: 'Visit the Innovation Lab', isCompleted: false, type: 'trigger' },
    { id: 'visit_cafe', description: 'Visit the Cafeteria', isCompleted: false, type: 'trigger' },
    { id: 'visit_garden', description: 'Visit the Botanical Garden', isCompleted: false, type: 'trigger' },
    { id: 'report_orion', description: 'Report back to Professor Orion', isCompleted: false, type: 'talk' }
  ]
};

const quest3: Quest = {
  id: 'quest_3_students',
  title: 'Meet New Students',
  description: 'Introduce yourself to Emma, Kai, Sophia, Lucas, and Mia around campus.',
  isCompleted: false,
  objectives: [
    { id: 'meet_emma', description: 'Meet Emma (Innovation Lab)', isCompleted: false, type: 'talk' },
    { id: 'meet_kai', description: 'Meet Kai (Cyber Lab)', isCompleted: false, type: 'talk' },
    { id: 'meet_sophia', description: 'Meet Sophia (Library)', isCompleted: false, type: 'talk' },
    { id: 'meet_lucas', description: 'Meet Lucas (Student Plaza)', isCompleted: false, type: 'talk' },
    { id: 'meet_mia', description: 'Meet Mia (Garden)', isCompleted: false, type: 'talk' },
    { id: 'report_orion_students', description: 'Report back to Professor Orion', isCompleted: false, type: 'talk' }
  ]
};

const quest4: Quest = {
  id: 'quest_4_help',
  title: 'Help Around Campus',
  description: 'Help students with their daily tasks to build team trust.',
  isCompleted: false,
  objectives: [
    { id: 'help_emma', description: 'Deliver Emma\'s manuals to the Library', isCompleted: false, type: 'inspect' },
    { id: 'find_lucas_notebook', description: 'Find and return Lucas\'s notebook', isCompleted: false, type: 'inspect' },
    { id: 'bring_coffee_orion', description: 'Brew and bring coffee to Orion', isCompleted: false, type: 'inspect' },
    { id: 'water_flowers', description: 'Water the dry flower beds in the Garden', isCompleted: false, type: 'inspect' },
    { id: 'return_student_id', description: 'Find and return Sophia\'s lost ID badge', isCompleted: false, type: 'inspect' },
    { id: 'help_mia_surveys', description: 'Complete Mia\'s psychology surveys', isCompleted: false, type: 'talk' },
    { id: 'report_orion_help', description: 'Report back to Professor Orion', isCompleted: false, type: 'talk' }
  ]
};

const quest5: Quest = {
  id: 'quest_5_cyber',
  title: 'The Cyber Invitation',
  description: 'Enter the Cyber Lab using your Key Fob and talk to Kai.',
  isCompleted: false,
  objectives: [
    { id: 'enter_cyber', description: 'Enter the Cyber Lab building', isCompleted: false, type: 'trigger' },
    { id: 'report_kai', description: 'Talk to Kai inside the Cyber Lab', isCompleted: false, type: 'talk' }
  ]
};

export const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { save, load } = useSave();
  const acceptQuest = useQuestStore((s) => s.acceptQuest);
  const setOnAllQuestsComplete = useQuestStore((s) => s.setOnAllQuestsComplete);
  const setPhase = useGamePhaseStore((s) => s.setPhase);

  const [isPaused, setIsPaused] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isWorldMapOpen, setIsWorldMapOpen] = useState(false);
  const [endingPhase, setEndingPhase] = useState<'none' | 'credits'>('none');
  const isCustomized = useAvatarStore((s) => s.isCustomized);

  const [minimapState, setMinimapState] = useState({ x: 0, z: 8, rot: 0 });
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [aaEnabled, setAaEnabled] = useState(true);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const minimapClicksRef = React.useRef(0);

  // Toggle debug panel with Ctrl + Alt + D
  useEffect(() => {
    const handleDebugKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.code === 'KeyD') {
        setIsDebugOpen((d) => !d);
        audioManager.playSFX('quest_complete');
      }
    };
    window.addEventListener('keydown', handleDebugKey);
    return () => window.removeEventListener('keydown', handleDebugKey);
  }, []);

  // Custom endGameCredits event listener for DebugPanel
  useEffect(() => {
    const el = document.querySelector('.game-canvas-container');
    const handleEndGame = () => {
      setEndingPhase('credits');
      audioManager.fadeOut(2000);
      setTimeout(() => {
        useQuestStore.getState().completeQuest('quest_5_cyber');
      }, 5000);
    };
    el?.addEventListener('endGameCredits', handleEndGame);
    return () => el?.removeEventListener('endGameCredits', handleEndGame);
  }, []);

  // Minimap player tracking
  useEffect(() => {
    const id = setInterval(() => {
      const p = (window as any).playerMesh;
      if (p) setMinimapState({ x: p.position.x, z: p.position.z, rot: p.rotation.y });
    }, 80);
    return () => clearInterval(id);
  }, []);

  // ─── Dialogues & Inventory Selector ──────────────────────────────────────────
  const activeQuests = useQuestStore((s) => s.activeQuests);
  const completedQuests = useQuestStore((s) => s.completedQuests);
  const triggerReflection = useReflectionStore((s) => s.triggerReflection);
  const { hasItem } = useInventoryStore();

  // Init: audio + settings + end game callback
  useEffect(() => {
    audioManager.playMusic('campus_morning');

    const saved = localStorage.getItem('cyberquest_settings');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.graphicsQuality) setQuality(p.graphicsQuality);
      if (p.aaEnabled !== undefined) setAaEnabled(p.aaEnabled);
    }

    // When ALL quests complete → advance to results
    setOnAllQuestsComplete(() => {
      audioManager.playSFX('quest_complete');
      setPhase('results');
      setTimeout(() => navigate('/results'), 1800);
    });

    if (searchParams.get('continue') === 'true') load();

    return () => setOnAllQuestsComplete(null);
  }, [setOnAllQuestsComplete, setPhase, load, searchParams, navigate]);

  // Sequentially progress quests
  useEffect(() => {
    if (!isCustomized) return;

    const activeIds = Object.keys(activeQuests);
    const completedIds = Object.keys(completedQuests);

    // Initial state: No active and no completed
    if (activeIds.length === 0 && completedIds.length === 0) {
      acceptQuest(quest1);
      return;
    }

    // Transition from Quest 1 -> Quest 2
    if (completedIds.includes('quest_1_orion') && !activeIds.includes('quest_2_explore') && !completedIds.includes('quest_2_explore')) {
      acceptQuest(quest2);
      return;
    }

    // Transition from Quest 2 -> Quest 3
    if (completedIds.includes('quest_2_explore') && !activeIds.includes('quest_3_students') && !completedIds.includes('quest_3_students')) {
      acceptQuest(quest3);
      return;
    }

    // Transition from Quest 3 -> Quest 4
    if (completedIds.includes('quest_3_students') && !activeIds.includes('quest_4_help') && !completedIds.includes('quest_4_help')) {
      acceptQuest(quest4);
      return;
    }

    // Transition from Quest 4 -> Quest 5
    if (completedIds.includes('quest_4_help') && !activeIds.includes('quest_5_cyber') && !completedIds.includes('quest_5_cyber')) {
      acceptQuest(quest5);
      // Trigger Orion's message immediately as a special dialogue monologue!
      setTimeout(() => {
        useDialogueStore.getState().startDialogue([
          {
            id: 'orion_msg',
            speaker: 'Professor Orion (Message)',
            lines: [
              'Congratulations on completing your first day.',
              'Tomorrow, every student participates in the Cyber Awareness Program.',
              'You\'ll face situations that people encounter every day while using technology.',
              'There are no right or wrong answers.',
              'Simply respond as you normally would.'
            ],
            nextNodeId: null
          }
        ], 'orion_msg');
      }, 1000);
      return;
    }
  }, [activeQuests, completedQuests, acceptQuest, isCustomized]);

  // NPC dialogue selection logic
  // Orion
  let orionNodes = orionQuest1;
  let orionStartNode = 'orion_q1_start';
  if (activeQuests['quest_2_explore']) {
    const visitedAll = activeQuests['quest_2_explore'].objectives
      .filter((o) => o.id !== 'report_orion')
      .every((o) => o.isCompleted);
    if (visitedAll) {
      orionNodes = orionQuest3Start;
      orionStartNode = 'orion_q3_start';
    } else {
      orionNodes = orionQuest2Pending;
      orionStartNode = 'orion_q2_pending';
    }
  } else if (activeQuests['quest_3_students']) {
    const metAll = activeQuests['quest_3_students'].objectives
      .filter((o) => o.id !== 'report_orion_students')
      .every((o) => o.isCompleted);
    if (metAll) {
      orionNodes = orionQuest4Start;
      orionStartNode = 'orion_q4_start';
    } else {
      orionNodes = orionQuest3Pending;
      orionStartNode = 'orion_q3_pending';
    }
  } else if (activeQuests['quest_4_help']) {
    const choresAll = activeQuests['quest_4_help'].objectives
      .filter((o) => o.id !== 'report_orion_help')
      .every((o) => o.isCompleted);
    if (choresAll) {
      orionNodes = orionQuest5Start;
      orionStartNode = 'orion_q5_start';
    } else if (hasItem('item_orion_coffee')) {
      orionNodes = orionCoffeeComplete;
      orionStartNode = 'orion_coffee_start';
    } else {
      orionNodes = orionQuest4Pending;
      orionStartNode = 'orion_q4_pending';
    }
  } else if (activeQuests['quest_5_cyber'] || completedQuests['quest_5_cyber']) {
    orionNodes = orionQuest5Pending;
    orionStartNode = 'orion_q5_pending';
  }

  // Emma
  let emmaNodes = emmaMeetDialogue;
  let emmaStartNode = 'emma_meet';
  if (activeQuests['quest_4_help']) {
    const isChoreComplete = activeQuests['quest_4_help'].objectives.find(o => o.id === 'help_emma')?.isCompleted;
    if (isChoreComplete) {
      emmaNodes = emmaSideComplete;
      emmaStartNode = 'emma_side_complete';
    } else if (hasItem('item_emma_delivered')) {
      emmaNodes = emmaSideComplete;
      emmaStartNode = 'emma_side_complete';
    } else if (hasItem('item_emma_books')) {
      emmaNodes = emmaSideProgress;
      emmaStartNode = 'emma_side_progress';
    } else {
      emmaNodes = emmaSideStart;
      emmaStartNode = 'emma_side_start';
    }
  } else if (completedQuests['quest_4_help'] || completedQuests['quest_5_cyber']) {
    emmaNodes = emmaSideComplete;
    emmaStartNode = 'emma_side_complete';
  }

  // Kai
  let kaiNodes = kaiGenericDialogue;
  let kaiStartNode = 'kai_generic';
  if (activeQuests['quest_3_students']) {
    kaiNodes = kaiMeetDialogue;
    kaiStartNode = 'kai_meet';
  } else if (activeQuests['quest_5_cyber'] || completedQuests['quest_5_cyber']) {
    kaiNodes = kaiQuest5Dialogue;
    kaiStartNode = 'kai_q5_start';
  }

  // Sophia
  let sophiaNodes = sophiaMeetDialogue;
  let sophiaStartNode = 'sophia_meet';
  if (activeQuests['quest_4_help']) {
    const isChoreComplete = activeQuests['quest_4_help'].objectives.find(o => o.id === 'return_student_id')?.isCompleted;
    if (isChoreComplete) {
      sophiaNodes = sophiaSideComplete;
      sophiaStartNode = 'sophia_side_complete';
    } else if (hasItem('item_lost_id')) {
      sophiaNodes = sophiaSideComplete;
      sophiaStartNode = 'sophia_side_complete';
    } else {
      sophiaNodes = sophiaSideStart;
      sophiaStartNode = 'sophia_side_start';
    }
  } else if (completedQuests['quest_4_help'] || completedQuests['quest_5_cyber']) {
    sophiaNodes = sophiaSideComplete;
    sophiaStartNode = 'sophia_side_complete';
  }

  // Lucas
  let lucasNodes = lucasMeetDialogue;
  let lucasStartNode = 'lucas_meet';
  if (activeQuests['quest_4_help']) {
    const isChoreComplete = activeQuests['quest_4_help'].objectives.find(o => o.id === 'find_lucas_notebook')?.isCompleted;
    if (isChoreComplete) {
      lucasNodes = lucasSideComplete;
      lucasStartNode = 'lucas_side_complete';
    } else if (hasItem('item_lucas_notebook')) {
      lucasNodes = lucasSideComplete;
      lucasStartNode = 'lucas_side_complete';
    } else {
      lucasNodes = lucasSideStart;
      lucasStartNode = 'lucas_side_start';
    }
  } else if (completedQuests['quest_4_help'] || completedQuests['quest_5_cyber']) {
    lucasNodes = lucasSideComplete;
    lucasStartNode = 'lucas_side_complete';
  }

  // Mia
  let miaNodes = miaMeetDialogue;
  let miaStartNode = 'mia_meet';
  if (activeQuests['quest_4_help']) {
    const isChoreComplete = activeQuests['quest_4_help'].objectives.find(o => o.id === 'help_mia_surveys')?.isCompleted;
    if (isChoreComplete) {
      miaNodes = miaSideComplete;
      miaStartNode = 'mia_side_complete';
    } else {
      miaNodes = miaSideStart;
      miaStartNode = 'mia_side_start';
    }
  } else if (completedQuests['quest_4_help'] || completedQuests['quest_5_cyber']) {
    miaNodes = miaSideComplete;
    miaStartNode = 'mia_side_complete';
  }

  // Emotes calculators
  const getOrionEmote = (): any => {
    if (activeQuests['quest_1_orion']) return 'quest';
    if (activeQuests['quest_2_explore']) {
      const visitedAll = activeQuests['quest_2_explore'].objectives
        .filter((o) => o.id !== 'report_orion')
        .every((o) => o.isCompleted);
      return visitedAll ? 'quest' : 'dialogue';
    }
    if (activeQuests['quest_3_students']) {
      const metAll = activeQuests['quest_3_students'].objectives
        .filter((o) => o.id !== 'report_orion_students')
        .every((o) => o.isCompleted);
      return metAll ? 'quest' : 'dialogue';
    }
    if (activeQuests['quest_4_help']) {
      const choresAll = activeQuests['quest_4_help'].objectives
        .filter((o) => o.id !== 'report_orion_help')
        .every((o) => o.isCompleted);
      return choresAll ? 'quest' : 'dialogue';
    }
    if (activeQuests['quest_5_cyber']) return 'complete';
    return 'friendly';
  };

  const getEmmaEmote = (): any => {
    if (activeQuests['quest_3_students']) {
      const obj = activeQuests['quest_3_students'].objectives.find(o => o.id === 'meet_emma');
      if (obj && !obj.isCompleted) return 'quest';
    }
    if (activeQuests['quest_4_help']) {
      const obj = activeQuests['quest_4_help'].objectives.find(o => o.id === 'help_emma');
      if (obj && !obj.isCompleted) return 'quest';
      if (obj?.isCompleted) return 'complete';
    }
    return 'friendly';
  };

  const getKaiEmote = (): any => {
    if (activeQuests['quest_3_students']) {
      const obj = activeQuests['quest_3_students'].objectives.find(o => o.id === 'meet_kai');
      if (obj && !obj.isCompleted) return 'quest';
    }
    if (activeQuests['quest_5_cyber']) {
      const obj = activeQuests['quest_5_cyber'].objectives.find(o => o.id === 'report_kai');
      if (obj && !obj.isCompleted) return 'quest';
    }
    return 'friendly';
  };

  const getSophiaEmote = (): any => {
    if (activeQuests['quest_3_students']) {
      const obj = activeQuests['quest_3_students'].objectives.find(o => o.id === 'meet_sophia');
      if (obj && !obj.isCompleted) return 'quest';
    }
    if (activeQuests['quest_4_help']) {
      const obj = activeQuests['quest_4_help'].objectives.find(o => o.id === 'return_student_id');
      if (obj && !obj.isCompleted) return 'quest';
      if (obj?.isCompleted) return 'complete';
    }
    return 'friendly';
  };

  const getLucasEmote = (): any => {
    if (activeQuests['quest_3_students']) {
      const obj = activeQuests['quest_3_students'].objectives.find(o => o.id === 'meet_lucas');
      if (obj && !obj.isCompleted) return 'quest';
    }
    if (activeQuests['quest_4_help']) {
      const obj = activeQuests['quest_4_help'].objectives.find(o => o.id === 'find_lucas_notebook');
      if (obj && !obj.isCompleted) return 'quest';
      if (obj?.isCompleted) return 'complete';
    }
    return 'friendly';
  };

  const getMiaEmote = (): any => {
    if (activeQuests['quest_3_students']) {
      const obj = activeQuests['quest_3_students'].objectives.find(o => o.id === 'meet_mia');
      if (obj && !obj.isCompleted) return 'quest';
    }
    if (activeQuests['quest_4_help']) {
      const obj = activeQuests['quest_4_help'].objectives.find(o => o.id === 'help_mia_surveys');
      if (obj && !obj.isCompleted) return 'quest';
      if (obj?.isCompleted) return 'complete';
    }
    return 'friendly';
  };

  // NPC dialogue complete and quest updating logic
  const handleNPCCompletionLogic = (npcId: string) => {
    const activeQuestsState = useQuestStore.getState().activeQuests;
    const { hasItem: hasInvItem, removeItem, addItem } = useInventoryStore.getState();

    switch (npcId) {
      case 'npc_orion':
        if (activeQuestsState['quest_1_orion']) {
          useQuestStore.getState().updateObjective('quest_1_orion', 'meet_orion', true);
        } else if (activeQuestsState['quest_2_explore']) {
          const visitedAll = activeQuestsState['quest_2_explore'].objectives
            .filter((o) => o.id !== 'report_orion')
            .every((o) => o.isCompleted);
          if (visitedAll) {
            useQuestStore.getState().updateObjective('quest_2_explore', 'report_orion', true);
          }
        } else if (activeQuestsState['quest_3_students']) {
          const metAll = activeQuestsState['quest_3_students'].objectives
            .filter((o) => o.id !== 'report_orion_students')
            .every((o) => o.isCompleted);
          if (metAll) {
            useQuestStore.getState().updateObjective('quest_3_students', 'report_orion_students', true);
          }
        } else if (activeQuestsState['quest_4_help']) {
          const choresCompleted = activeQuestsState['quest_4_help'].objectives
            .filter((o) => o.id !== 'report_orion_help' && o.id !== 'bring_coffee_orion')
            .every((o) => o.isCompleted);

          const hasCoffee = hasInvItem('item_orion_coffee');

          if (choresCompleted && activeQuestsState['quest_4_help'].objectives.find(o => o.id === 'bring_coffee_orion')?.isCompleted) {
            addItem({
              id: 'item_key_fob',
              name: 'Cyber Lab Key Fob',
              category: 'quest',
              description: 'A blue encrypted key fob granting access to the Aether Security Cyber Lab.',
              icon: '🔑',
              rarity: 'rare',
            });
            useQuestStore.getState().updateObjective('quest_4_help', 'report_orion_help', true);
          } else if (hasCoffee) {
            removeItem('item_orion_coffee');
            useQuestStore.getState().updateObjective('quest_4_help', 'bring_coffee_orion', true);
            toast.success("Delivered Hot Latte to Professor Orion!");
          }
        }
        break;

      case 'npc_emma':
        if (activeQuestsState['quest_3_students']) {
          useQuestStore.getState().updateObjective('quest_3_students', 'meet_emma', true);
        } else if (activeQuestsState['quest_4_help']) {
          if (hasInvItem('item_emma_delivered')) {
            removeItem('item_emma_delivered');
            useQuestStore.getState().updateObjective('quest_4_help', 'help_emma', true);
          }
        }
        break;

      case 'npc_kai':
        if (activeQuestsState['quest_3_students']) {
          useQuestStore.getState().updateObjective('quest_3_students', 'meet_kai', true);
        } else if (activeQuestsState['quest_5_cyber']) {
          useQuestStore.getState().updateObjective('quest_5_cyber', 'report_kai', true);
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
                  setEndingPhase('credits');
                  audioManager.fadeOut(2000);
                  setTimeout(() => {
                    useQuestStore.getState().completeQuest('quest_5_cyber');
                  }, 5000);
                }
              );
            }, 800);
          });
        }
        break;

      case 'npc_sophia':
        if (activeQuestsState['quest_3_students']) {
          useQuestStore.getState().updateObjective('quest_3_students', 'meet_sophia', true);
        } else if (activeQuestsState['quest_4_help']) {
          if (hasInvItem('item_lost_id')) {
            removeItem('item_lost_id');
            useQuestStore.getState().updateObjective('quest_4_help', 'return_student_id', true);
          }
        }
        break;

      case 'npc_lucas':
        if (activeQuestsState['quest_3_students']) {
          useQuestStore.getState().updateObjective('quest_3_students', 'meet_lucas', true);
        } else if (activeQuestsState['quest_4_help']) {
          if (hasInvItem('item_lucas_notebook')) {
            removeItem('item_lucas_notebook');
            useQuestStore.getState().updateObjective('quest_4_help', 'find_lucas_notebook', true);
          }
        }
        break;

      case 'npc_mia':
        if (activeQuestsState['quest_3_students']) {
          useQuestStore.getState().updateObjective('quest_3_students', 'meet_mia', true);
        } else if (activeQuestsState['quest_4_help']) {
          useQuestStore.getState().updateObjective('quest_4_help', 'help_mia_surveys', true);
        }
        break;

      default:
        break;
    }
  };

  const handleDialogueCompleteWithReflection = (npcId: string) => {
    handleNPCCompletionLogic(npcId);
    setTimeout(() => {
      triggerReflection();
    }, 450);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!useAvatarStore.getState().isCustomized) return;

      if (e.code === 'Escape') {
        setIsInventoryOpen(false); setIsJournalOpen(false); setIsWorldMapOpen(false);
        setIsPaused((p) => !p);
        audioManager.playSFX('menu_click');
      }
      if (e.code === 'KeyI') { setIsInventoryOpen((v) => { if (!v) { setIsJournalOpen(false); setIsWorldMapOpen(false); setIsPaused(false); } audioManager.playSFX('click'); return !v; }); }
      if (e.code === 'KeyJ') { setIsJournalOpen((v) => { if (!v) { setIsInventoryOpen(false); setIsWorldMapOpen(false); setIsPaused(false); } audioManager.playSFX('click'); return !v; }); }
      if (e.code === 'KeyM') { setIsWorldMapOpen((v) => { if (!v) { setIsInventoryOpen(false); setIsJournalOpen(false); setIsPaused(false); } audioManager.playSFX('click'); return !v; }); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSaveGame = () => save({ x: 0, y: 1.5, z: 8 }, 0);

  const handleMinimapClick = () => {
    minimapClicksRef.current += 1;
    if (minimapClicksRef.current >= 3) {
      setIsDebugOpen((d) => !d);
      audioManager.playSFX('quest_complete');
      minimapClicksRef.current = 0;
    } else {
      audioManager.playSFX('button_click');
    }
  };
  const handleLoadGame = () => { load(); setIsPaused(false); };

  // Building dots for minimap
  const minimapBuildings = [
    { name: 'Plaza',     coords: CAMPUS_COORDS.Plaza,         color: '#00f0ff' },
    { name: 'Admin',     coords: CAMPUS_COORDS.Administration, color: '#6366f1' },
    { name: 'Cyber',     coords: CAMPUS_COORDS.CyberLab,       color: '#ef4444' },
    { name: 'Library',   coords: CAMPUS_COORDS.Library,        color: '#f59e0b' },
    { name: 'Innov',     coords: CAMPUS_COORDS.InnovationLab,  color: '#10b981' },
    { name: 'Cafe',      coords: CAMPUS_COORDS.Cafe,           color: '#8b5cf6' },
    { name: 'Garden',    coords: CAMPUS_COORDS.Garden,         color: '#22c55e' },
    { name: 'St.Plaza',  coords: CAMPUS_COORDS.StudentPlaza,   color: '#06b6d4' },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* ── 3D Canvas ──────────────────────────────────────────────────────── */}
      <div className="game-canvas-container">
        <Canvas
          shadows={quality !== 'low'}
          gl={{ antialias: aaEnabled }}
          camera={{ position: [0, 5, 10], fov: 50 }}
        >
          <Suspense fallback={null}>
            <PhysicsWorld debug={false}>
              <Campus />
              <Player initialPosition={[0, 1.5, 8]} />
              <NPCManager timeOfDay={9.0} />

              {/* ── 8 Canonical Story NPCs ─────────────────────────────── */}
              <NPC id="npc_orion"        name="Professor Orion" role="Faculty · Cybersecurity"       position={[0, 0, -6]}   color="#3b82f6" dialogueNodes={orionNodes}        startNodeId={orionStartNode}        emote={getOrionEmote()}        onDialogueComplete={() => handleDialogueCompleteWithReflection('npc_orion')} />
              <NPC id="npc_emma"         name="Emma"            role="Student · Robotics"            position={[20, 0, 18]}  color="#8b5cf6" dialogueNodes={emmaNodes}         startNodeId={emmaStartNode}         emote={getEmmaEmote()}         onDialogueComplete={() => handleDialogueCompleteWithReflection('npc_emma')} />
              <NPC id="npc_kai"          name="Kai"             role="Student · Cybersecurity"       position={[29, 0, 5]}   color="#f59e0b" dialogueNodes={kaiNodes}          startNodeId={kaiStartNode}          emote={getKaiEmote()}          onDialogueComplete={() => handleDialogueCompleteWithReflection('npc_kai')} />
              <NPC id="npc_sophia"       name="Sophia"          role="Student · Computer Science"    position={[-28, 0, 3]}  color="#ec4899" dialogueNodes={sophiaNodes}       startNodeId={sophiaStartNode}       emote={getSophiaEmote()}       onDialogueComplete={() => handleDialogueCompleteWithReflection('npc_sophia')} />
              <NPC id="npc_lucas"        name="Lucas"           role="Student · Data Science"        position={[20, 0, -19]} color="#14b8a6" dialogueNodes={lucasNodes}        startNodeId={lucasStartNode}        emote={getLucasEmote()}        onDialogueComplete={() => handleDialogueCompleteWithReflection('npc_lucas')} />
              <NPC id="npc_mia"          name="Mia"             role="Student · Digital Arts"        position={[0, 0, 28]}   color="#f43f5e" dialogueNodes={miaNodes}          startNodeId={miaStartNode}          emote={getMiaEmote()}          onDialogueComplete={() => handleDialogueCompleteWithReflection('npc_mia')} />
              <NPC id="npc_receptionist" name="Receptionist"    role="Staff · Administration"        position={[0, 0, -26]}  color="#64748b" dialogueNodes={receptionistGeneric} startNodeId="receptionist_start" emote="dialogue"            onDialogueComplete={() => handleDialogueCompleteWithReflection('npc_receptionist')} />
              <NPC id="npc_guard"        name="Security Guard"  role="Staff · Campus Security"       position={[0, 0, -10]}  color="#22c55e" dialogueNodes={guardGeneric}         startNodeId="guard_start"        emote="dialogue"            onDialogueComplete={() => handleDialogueCompleteWithReflection('npc_guard')} />
            </PhysicsWorld>
          </Suspense>
        </Canvas>
      </div>
 
      {/* ── HUD: Quest Tracker (top-left) ──────────────────────────────────── */}
      <QuestTracker />
 
      {/* ── HUD: Mini-Map (top-right) ──────────────────────────────────────── */}
      <div onClick={handleMinimapClick} className="absolute top-6 right-6 z-20 w-36 h-36 pointer-events-auto cursor-pointer">
        <GlassContainer variant="neutral" className="w-full h-full p-0.5 bg-black/85 rounded-full border-2 border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center relative overflow-hidden">
          <div
            style={{ transform: `rotate(${-minimapState.rot * (180 / Math.PI)}deg) translate(${-minimapState.x * 2.0}px, ${-minimapState.z * 2.0}px)`, transformOrigin: 'center' }}
            className="w-full h-full absolute transition-transform duration-75 ease-out flex items-center justify-center"
          >
            <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible">
              <circle cx="110" cy="110" r="16" fill="none" stroke="rgba(0,240,255,0.2)" strokeWidth="8" />
              <line x1="-100" y1="110" x2="320" y2="110" stroke="rgba(0,240,255,0.15)" strokeWidth="6" />
              <line x1="110" y1="-100" x2="110" y2="320" stroke="rgba(0,240,255,0.15)" strokeWidth="6" />
              {minimapBuildings.map((b) => (
                <g key={b.name}>
                  <circle cx={110 + b.coords[0] * 2.0} cy={110 + b.coords[2] * 2.0} r="4.5" fill={b.color} />
                  <text x={110 + b.coords[0] * 2.0} y={110 + b.coords[2] * 2.0 - 7} fill="#ffffff" fontSize="6px" fontWeight="bold" textAnchor="middle">{b.name}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="absolute w-3 h-3 z-30 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-[#00ffff] filter drop-shadow-[0_0_4px_#00ffff]" />
          </div>
          <span className="absolute top-1 text-[8.5px] font-black text-[#00f0ff]">N</span>
          <span className="absolute bottom-1 text-[8.5px] font-black text-slate-400">S</span>
          <span className="absolute left-1.5 text-[8.5px] font-black text-slate-400">W</span>
          <span className="absolute right-1.5 text-[8.5px] font-black text-slate-400">E</span>
        </GlassContainer>
      </div>
 
      {/* ── Controls hint (top-center) ─────────────────────────────────────── */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm border border-slate-800 text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full text-slate-400">
          WASD: Move · Shift: Sprint · Space: Jump · Mouse: Camera · E: Talk · ESC: Pause
        </div>
      </div>
 
      {/* ── Dialogue Box (bottom-center) ───────────────────────────────────── */}
      <DialogueBox />
 
      {/* ── Pause Menu ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isPaused && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-sm px-6">
              <GlassContainer variant="magenta" className="p-6 bg-black/85 border-[#ff00ff]/30 shadow-[0_0_30px_rgba(255,0,255,0.2)]">
                <h2 className="font-display font-black text-2xl text-[#ff00ff] uppercase tracking-wide glow-text-magenta border-b border-[#ff00ff]/20 pb-2 mb-6">Game Paused</h2>
                <div className="flex flex-col gap-4">
                  <Button variant="cyan" onClick={() => setIsPaused(false)}>Resume Exploration</Button>
                  <Button variant="neutral" onClick={handleSaveGame}>Save Game (Auto)</Button>
                  <Button variant="neutral" onClick={handleLoadGame}>Load Last Save</Button>
                  <Button variant="danger" onClick={() => { audioManager.playSFX('button_click'); navigate('/'); }}>Quit to Menu</Button>
                </div>
              </GlassContainer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* ── RPG Overlays ───────────────────────────────────────────────────── */}
      <InventoryOverlay isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />
      <JournalOverlay isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />
      <WorldMapOverlay isOpen={isWorldMapOpen} onClose={() => setIsWorldMapOpen(false)} />
      <ReflectionOverlay />
      <CyberAssessmentOverlay />
      <DebugPanel isOpen={isDebugOpen} onClose={() => setIsDebugOpen(false)} />
 
      {/* ── Character Customiser (first launch only) ───────────────────────── */}
      {!isCustomized && <CharacterCustomizer />}

      {/* ── Ending Credits Screen ─────────────────────────────────────────── */}
      <AnimatePresence>
        {endingPhase === 'credits' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center text-center p-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1.5 }}
              className="text-white font-display font-black text-3xl md:text-5xl uppercase tracking-widest mb-6"
            >
              Thank you for playing CyberQuest
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1.5 }}
              className="text-slate-500 font-medium text-xs md:text-sm uppercase tracking-widest"
            >
              Academic Capstone 2026 · Aether Institute
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameScreen;
