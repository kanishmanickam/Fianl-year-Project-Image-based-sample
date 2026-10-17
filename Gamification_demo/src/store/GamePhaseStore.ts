import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────────
// GamePhaseStore
//
// Tracks which high-level phase of the game loop the player is in.
//
// Flow:
//   'intro'       – Player has just started, must meet Professor Orion
//   'explore'     – Player is exploring campus and talking to NPCs
//   'challenges'  – (Future) Cyber-challenge mini-games
//   'results'     – Story complete, show results screen
// ─────────────────────────────────────────────────────────────────────────────

export type GamePhase = 'intro' | 'explore' | 'challenges' | 'results';

interface GamePhaseStore {
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;
  advancePhase: () => void;
  resetPhase: () => void;
}

const PHASE_ORDER: GamePhase[] = ['intro', 'explore', 'challenges', 'results'];

export const useGamePhaseStore = create<GamePhaseStore>((set, get) => ({
  phase: 'intro',

  setPhase: (phase) => set({ phase }),

  advancePhase: () => {
    const current = get().phase;
    const idx = PHASE_ORDER.indexOf(current);
    if (idx < PHASE_ORDER.length - 1) {
      set({ phase: PHASE_ORDER[idx + 1] });
    }
  },

  resetPhase: () => set({ phase: 'intro' }),
}));
