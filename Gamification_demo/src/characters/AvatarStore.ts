import { create } from 'zustand';

export interface AvatarState {
  gender: 'male' | 'female';
  skinColor: string;
  hairStyle: 'spiky' | 'long' | 'bun' | 'bald';
  hairColor: string;
  eyeColor: string;
  clothingColor: string;
  backpack: 'none' | 'classic' | 'cyberpack';
  isCustomized: boolean;
  setAvatar: (settings: Partial<Omit<AvatarState, 'setAvatar' | 'completeCustomization'>>) => void;
  completeCustomization: () => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  gender: 'male',
  skinColor: '#fbcfe8', // Default rosy skin tone
  hairStyle: 'spiky',
  hairColor: '#1e293b', // Slate dark hair
  eyeColor: '#3b82f6',  // Blue eyes
  clothingColor: '#6366f1', // Indigo hoodie
  backpack: 'classic',
  isCustomized: false,

  setAvatar: (settings) => set((state) => ({ ...state, ...settings })),
  completeCustomization: () => set({ isCustomized: true }),
}));

export default useAvatarStore;
