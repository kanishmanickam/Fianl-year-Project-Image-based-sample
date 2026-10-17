import { create } from 'zustand';

export interface NPCMapMarker {
  id: string;
  name: string;
  x: number;
  z: number;
  color: string;
}

interface NPCPositionStore {
  markers: NPCMapMarker[];
  updateMarker: (marker: NPCMapMarker) => void;
  clearMarkers: () => void;
}

export const useNPCPositionStore = create<NPCPositionStore>((set) => ({
  markers: [],

  updateMarker: (marker) =>
    set((state) => {
      const existing = state.markers.findIndex((m) => m.id === marker.id);
      if (existing >= 0) {
        const updated = [...state.markers];
        updated[existing] = marker;
        return { markers: updated };
      }
      return { markers: [...state.markers, marker] };
    }),

  clearMarkers: () => set({ markers: [] }),
}));
