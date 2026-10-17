import { create } from 'zustand';

export interface BigFiveTraits {
  openness: number;         // 1 to 5
  conscientiousness: number; // 1 to 5
  extraversion: number;      // 1 to 5
  agreeableness: number;     // 1 to 5
  neuroticism: number;       // 1 to 5
}

export interface ActionLog {
  timestamp: number;
  actionId: string;
  description: string;
  adjustments: Partial<BigFiveTraits>;
}

interface BigFiveStore {
  traits: BigFiveTraits;
  history: ActionLog[];
  // Actions
  adjustTrait: (trait: keyof BigFiveTraits, amount: number) => void;
  recordAction: (actionId: string, description: string, adjustments: Partial<BigFiveTraits>) => void;
  resetTraits: () => void;
  loadTraits: (traits: BigFiveTraits, history: ActionLog[]) => void;
}

const DEFAULT_TRAITS: BigFiveTraits = {
  openness: 3.0,
  conscientiousness: 3.0,
  extraversion: 3.0,
  agreeableness: 3.0,
  neuroticism: 3.0,
};

export const useBigFiveStore = create<BigFiveStore>((set) => ({
  traits: { ...DEFAULT_TRAITS },
  history: [],

  adjustTrait: (trait, amount) =>
    set((state) => {
      const current = state.traits[trait];
      // Clamp between 1.0 and 5.0
      const newValue = Math.min(5.0, Math.max(1.0, current + amount));
      return {
        traits: {
          ...state.traits,
          [trait]: parseFloat(newValue.toFixed(2)),
        },
      };
    }),

  recordAction: (actionId, description, adjustments) =>
    set((state) => {
      const updatedTraits = { ...state.traits };
      
      // Apply adjustments with clamping
      Object.entries(adjustments).forEach(([key, value]) => {
        const traitKey = key as keyof BigFiveTraits;
        if (value !== undefined) {
          const newVal = Math.min(5.0, Math.max(1.0, updatedTraits[traitKey] + value));
          updatedTraits[traitKey] = parseFloat(newVal.toFixed(2));
        }
      });

      const logEntry: ActionLog = {
        timestamp: Date.now(),
        actionId,
        description,
        adjustments,
      };

      return {
        traits: updatedTraits,
        history: [...state.history, logEntry],
      };
    }),

  resetTraits: () => set({ traits: { ...DEFAULT_TRAITS }, history: [] }),

  loadTraits: (traits, history) => set({ traits, history }),
}));
