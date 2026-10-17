import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import SaveManager from './SaveManager';
import type { SaveData } from './SaveManager';

export const useSave = () => {
  const [isLoading, setIsLoading] = useState(false);

  const save = useCallback((playerPosition: { x: number; y: number; z: number }, playerRotation: number) => {
    setIsLoading(true);
    const success = SaveManager.saveGame(playerPosition, playerRotation);
    setIsLoading(false);
    if (success) {
      toast.success('Game progress saved!', {
        style: {
          background: 'rgba(25, 18, 48, 0.9)',
          color: '#00f0ff',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          fontFamily: 'Inter, sans-serif',
        },
      });
    } else {
      toast.error('Failed to save progress.');
    }
    return success;
  }, []);

  const load = useCallback((): SaveData | null => {
    setIsLoading(true);
    const data = SaveManager.loadGame();
    setIsLoading(false);
    if (data) {
      toast.success('Progress restored!', {
        style: {
          background: 'rgba(25, 18, 48, 0.9)',
          color: '#ff00ff',
          border: '1px solid rgba(255, 0, 255, 0.3)',
          fontFamily: 'Inter, sans-serif',
        },
      });
    } else {
      toast.error('No save files found.');
    }
    return data;
  }, []);

  const hasSave = useCallback(() => {
    return SaveManager.hasSaveGame();
  }, []);

  const clear = useCallback(() => {
    SaveManager.clearSave();
    toast.success('Save data wiped.');
  }, []);

  return {
    save,
    load,
    hasSave,
    clear,
    isLoading,
  };
};
