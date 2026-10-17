// ImageQuestionnaireStore.ts
import { create } from 'zustand';
import { IMAGE_QUESTIONS, type OptionId } from './imageQuestions';

export type QuizPhase = 'quiz' | 'thankyou';

interface ImageQuestionnaireState {
    phase: QuizPhase;
    currentIndex: number;
    answers: Record<string, OptionId>;

    selectOption: (questionId: string, option: OptionId) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    submit: () => void;
    restart: () => void;
    currentAnswer: () => OptionId | null;
    allAnswered: () => boolean;
}

export const useImageQuestionnaireStore = create<ImageQuestionnaireState>((set, get) => ({
    phase: 'quiz',
    currentIndex: 0,
    answers: {},

    selectOption: (questionId, option) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: option } })),

    nextQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex < IMAGE_QUESTIONS.length - 1)
            set({ currentIndex: currentIndex + 1 });
    },

    prevQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) set({ currentIndex: currentIndex - 1 });
    },

    submit: async () => {
        const { answers } = get();
        try {
            await fetch('http://127.0.0.1:5000/api/image-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
                    answers: Object.entries(answers).map(([qid, opt]) => ({
                        question_id: qid,
                        selected_option: opt
                    }))
                })
            });
        } catch {
            // Local fallback if backend is not active
        }
        set({ phase: 'thankyou' });
    },

    restart: () => set({ phase: 'quiz', currentIndex: 0, answers: {} }),

    currentAnswer: () => {
        const { answers, currentIndex } = get();
        const q = IMAGE_QUESTIONS[currentIndex];
        return q ? (answers[q.id] ?? null) : null;
    },

    allAnswered: () => {
        const { answers } = get();
        return IMAGE_QUESTIONS.every((q) => answers[q.id] !== undefined);
    },
}));
