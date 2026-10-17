import { create } from 'zustand';
import audioManager from '../audio/AudioManager';
import { useBigFiveStore } from '../psychology/BigFiveEngine';

export interface ReflectionQuestion {
  id: string;
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  text: string;
  isReversed?: boolean;
}

export const BIG_FIVE_QUESTIONS: ReflectionQuestion[] = [
  { id: 'O1', trait: 'openness', text: 'I am someone who is curious about many different things.' },
  { id: 'O2', trait: 'openness', text: 'I am someone who has an active imagination.' },
  { id: 'O3', trait: 'openness', text: 'I am someone who values artistic, creative experiences.' },
  { id: 'C1', trait: 'conscientiousness', text: 'I am someone who does a thorough job.' },
  { id: 'C2', trait: 'conscientiousness', text: 'I am someone who tends to be organized.' },
  { id: 'C3', trait: 'conscientiousness', text: 'I am someone who is reliable and handles duties well.' },
  { id: 'E1', trait: 'extraversion', text: 'I am someone who is talkative.' },
  { id: 'E2', trait: 'extraversion', text: 'I am someone who is outgoing and sociable.' },
  { id: 'E3', trait: 'extraversion', text: 'I am someone who is reserved.', isReversed: true },
  { id: 'A1', trait: 'agreeableness', text: 'I am someone who is helpful and unselfish with others.' },
  { id: 'A2', trait: 'agreeableness', text: 'I am someone who is considerate and kind to almost everyone.' },
  { id: 'A3', trait: 'agreeableness', text: 'I am someone who has a forgiving nature.' },
  { id: 'N1', trait: 'neuroticism', text: 'I am someone who gets nervous easily.' },
  { id: 'N2', trait: 'neuroticism', text: 'I am someone who remains calm in tense situations.', isReversed: true },
  { id: 'N3', trait: 'neuroticism', text: 'I am someone who worries a lot.' }
];

interface ReflectionStore {
  isOpen: boolean;
  currentIndex: number;
  responses: Record<string, number>; // id -> score (1-5)
  onCompleteCallback: (() => void) | null;
  
  // Actions
  triggerReflection: (onComplete?: () => void) => void;
  submitResponse: (rating: number) => void;
  resetReflection: () => void;
  loadReflectionState: (currentIndex: number, responses: Record<string, number>) => void;
}

export const useReflectionStore = create<ReflectionStore>((set, get) => ({
  isOpen: false,
  currentIndex: 0,
  responses: {},
  onCompleteCallback: null,

  triggerReflection: (onComplete) => {
    const { currentIndex } = get();
    // If we have shown all questions, just execute the callback
    if (currentIndex >= BIG_FIVE_QUESTIONS.length) {
      if (onComplete) onComplete();
      return;
    }

    set({
      isOpen: true,
      onCompleteCallback: onComplete || null
    });
    audioManager.playSFX('quest_complete');
  },

  submitResponse: (rating) => {
    const { currentIndex, responses, onCompleteCallback } = get();
    const currentQuestion = BIG_FIVE_QUESTIONS[currentIndex];
    
    if (!currentQuestion) return;

    const updatedResponses = {
      ...responses,
      [currentQuestion.id]: rating
    };

    // Calculate effect on the trait score
    // rating is 1 to 5.
    // Standard Big Five score calculation:
    // If reversed, value is 6 - rating.
    // We adjust the trait in BigFiveStore.
    // The trait value in BigFiveStore starts at 3.0 and can be adjusted.
    // To match the user's questionnaire, let's update the actual trait value!
    // Since we have multiple questions per trait, we can average them or adjust the trait score directly.
    // Let's do a delta calculation:
    // Middle response (3) is 0 change.
    // 4 is +0.25 (or +0.5 for active adjustments), 5 is +0.5.
    // 2 is -0.25, 1 is -0.5.
    const actualScore = currentQuestion.isReversed ? (6 - rating) : rating;
    const delta = (actualScore - 3) * 0.25; // maps to -0.5 to +0.5

    useBigFiveStore.getState().recordAction(
      `reflection_${currentQuestion.id}`,
      `Self-Reflection on statement: "${currentQuestion.text}" (Rating: ${rating})`,
      { [currentQuestion.trait]: delta }
    );

    set({
      responses: updatedResponses,
      currentIndex: currentIndex + 1,
      isOpen: false,
      onCompleteCallback: null
    });

    audioManager.playSFX('button_click');

    if (onCompleteCallback) {
      // Small timeout for visual transition
      setTimeout(() => {
        onCompleteCallback();
      }, 300);
    }
  },

  resetReflection: () => set({ isOpen: false, currentIndex: 0, responses: {}, onCompleteCallback: null }),
  loadReflectionState: (currentIndex, responses) => set({ currentIndex, responses })
}));
