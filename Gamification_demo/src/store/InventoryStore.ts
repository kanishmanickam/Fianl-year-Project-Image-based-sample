import { create } from 'zustand';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'quest' | 'docs' | 'notes' | 'usbs' | 'badges' | 'keys';
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
}

interface InventoryStore {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  resetInventory: () => void;
  loadInventory: (items: InventoryItem[]) => void;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: [
    { id: 'item_notes', name: 'Big Five Personality Memo', category: 'notes', description: 'Psychology notes explaining Openness vs Neuroticism traits.', icon: '📓', rarity: 'common' }
  ],

  addItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) return {};
      return { items: [...state.items, item] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  hasItem: (id) => get().items.some((i) => i.id === id),

  resetInventory: () =>
    set({
      items: [
        { id: 'item_notes', name: 'Big Five Personality Memo', category: 'notes', description: 'Psychology notes explaining Openness vs Neuroticism traits.', icon: '📓', rarity: 'common' }
      ],
    }),

  loadInventory: (items) => set({ items }),
}));
