import { create } from 'zustand';
import toast from 'react-hot-toast';

export interface QuestObjective {
  id: string;
  description: string;
  isCompleted: boolean;
  type: 'talk' | 'inspect' | 'use_computer' | 'trigger';
  targetId?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  isCompleted: boolean;
}

export interface QuestState {
  activeQuests: Record<string, Quest>;
  completedQuests: Record<string, Quest>;
}

interface QuestStore extends QuestState {
  acceptQuest: (quest: Quest) => void;
  updateObjective: (questId: string, objectiveId: string, isCompleted: boolean) => void;
  completeQuest: (questId: string) => void;
  loadQuestState: (state: QuestState) => void;
  resetQuests: () => void;

  // Callback fired once when ALL active quests have been completed.
  // Register once from GameScreen to advance GamePhase.
  onAllQuestsComplete: (() => void) | null;
  setOnAllQuestsComplete: (cb: (() => void) | null) => void;
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  activeQuests: {},
  completedQuests: {},
  onAllQuestsComplete: null,

  setOnAllQuestsComplete: (cb) => set({ onAllQuestsComplete: cb }),

  acceptQuest: (quest) => {
    if (get().activeQuests[quest.id] || get().completedQuests[quest.id]) return;

    set((state) => ({
      activeQuests: {
        ...state.activeQuests,
        [quest.id]: { ...quest, isCompleted: false },
      },
    }));

    toast('New Quest: ' + quest.title, {
      icon: '📜',
      style: {
        background: 'rgba(15, 10, 30, 0.95)',
        color: '#00f0ff',
        border: '1px solid rgba(0, 240, 255, 0.4)',
        fontFamily: 'Outfit, Inter, sans-serif',
        fontSize: '15px',
        fontWeight: 'bold',
      },
    });
  },

  updateObjective: (questId, objectiveId, isCompleted) => {
    set((state) => {
      const quest = state.activeQuests[questId];
      if (!quest) return {};

      const updatedObjectives = quest.objectives.map((obj) => {
        if (obj.id === objectiveId) {
          if (obj.isCompleted !== isCompleted && isCompleted) {
            toast.success(`Objective Met: ${obj.description}`, {
              style: {
                background: 'rgba(15, 10, 30, 0.95)',
                color: '#39ff14',
                border: '1px solid rgba(57, 255, 20, 0.4)',
                fontFamily: 'Outfit, Inter, sans-serif',
              },
            });
          }
          return { ...obj, isCompleted };
        }
        return obj;
      });

      const allCompleted = updatedObjectives.every((obj) => obj.isCompleted);

      const updatedQuest = { ...quest, objectives: updatedObjectives };

      if (allCompleted) {
        setTimeout(() => {
          get().completeQuest(questId);
        }, 100);
      }

      return {
        activeQuests: {
          ...state.activeQuests,
          [questId]: updatedQuest,
        },
      };
    });
  },

  completeQuest: (questId) => {
    const quest = get().activeQuests[questId];
    if (!quest) return;

    set((state) => {
      const completed = { ...quest, isCompleted: true };
      const newActive = { ...state.activeQuests };
      delete newActive[questId];

      return {
        activeQuests: newActive,
        completedQuests: {
          ...state.completedQuests,
          [questId]: completed,
        },
      };
    });

    toast('Quest Complete: ' + quest.title, {
      icon: '🏆',
      style: {
        background: 'rgba(15, 10, 30, 0.95)',
        color: '#ff00ff',
        border: '1px solid rgba(255, 0, 255, 0.4)',
        fontFamily: 'Outfit, Inter, sans-serif',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    });

    // After a short delay, check if ALL quests are now complete and fire callback
    setTimeout(() => {
      const { activeQuests, onAllQuestsComplete } = get();
      const remaining = Object.keys(activeQuests).length;
      if (remaining === 0 && onAllQuestsComplete) {
        onAllQuestsComplete();
      }
    }, 600);
  },

  loadQuestState: (questState) =>
    set({
      activeQuests: questState.activeQuests || {},
      completedQuests: questState.completedQuests || {},
    }),

  resetQuests: () => set({ activeQuests: {}, completedQuests: {} }),
}));
