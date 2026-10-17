import { useCallback } from 'react';
import audioManager from './AudioManager';

export const useAudio = () => {
  const playSFX = useCallback((sfxName: string) => {
    audioManager.playSFX(sfxName);
  }, []);

  const playMusic = useCallback((musicName: string) => {
    audioManager.playMusic(musicName);
  }, []);

  const stopMusic = useCallback(() => {
    audioManager.stopAll();
  }, []);

  return {
    playSFX,
    playMusic,
    stopMusic,
    audioManager,
  };
};
export default useAudio;
