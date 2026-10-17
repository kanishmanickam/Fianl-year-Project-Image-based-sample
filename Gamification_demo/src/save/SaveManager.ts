import { useBigFiveStore } from '../psychology/BigFiveEngine';
import type { BigFiveTraits, ActionLog } from '../psychology/BigFiveEngine';
import { useCyberRiskStore } from '../cyber/CyberRiskEngine';
import type { CyberRiskProfile, CyberActionLog } from '../cyber/CyberRiskEngine';
import { useQuestStore } from '../quests/QuestManager';
import type { QuestState } from '../quests/QuestManager';

export interface SaveData {
  version: string;
  timestamp: number;
  playerName: string;
  playtimeSeconds: number;
  playerPosition: { x: number; y: number; z: number };
  playerRotation: number;
  quests: QuestState;
  psychology: {
    traits: BigFiveTraits;
    history: ActionLog[];
  };
  cybersecurity: {
    profile: CyberRiskProfile;
    incidents: CyberActionLog[];
  };
  settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    dialogueSpeed: number; // 1 = normal, 2 = fast, 0 = instant
  };
}

const SAVE_KEY = 'cyberquest_save_game';
const SETTINGS_KEY = 'cyberquest_settings';

export const SaveManager = {
  saveGame(playerPosition: { x: number; y: number; z: number }, playerRotation: number): boolean {
    try {
      const psych = useBigFiveStore.getState();
      const cyber = useCyberRiskStore.getState();
      const quests = useQuestStore.getState();

      const existingSettings = this.loadSettings();

      const saveData: SaveData = {
        version: '1.0.0',
        timestamp: Date.now(),
        playerName: 'Campus_Candidate_01',
        playtimeSeconds: 0, // In real implementation, tracked via timer
        playerPosition,
        playerRotation,
        quests: {
          activeQuests: quests.activeQuests,
          completedQuests: quests.completedQuests,
        },
        psychology: {
          traits: psych.traits,
          history: psych.history,
        },
        cybersecurity: {
          profile: cyber.profile,
          incidents: cyber.incidents,
        },
        settings: existingSettings || {
          masterVolume: 0.8,
          musicVolume: 0.6,
          sfxVolume: 0.8,
          dialogueSpeed: 1,
        },
      };

      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      console.log('Game saved successfully!', saveData);
      return true;
    } catch (err) {
      console.error('Failed to save game:', err);
      return false;
    }
  },

  loadGame(): SaveData | null {
    try {
      const savedStr = localStorage.getItem(SAVE_KEY);
      if (!savedStr) return null;

      const data = JSON.parse(savedStr) as SaveData;
      
      // Hydrate stores
      useBigFiveStore.getState().loadTraits(data.psychology.traits, data.psychology.history);
      useCyberRiskStore.getState().loadProfile(data.cybersecurity.profile, data.cybersecurity.incidents);
      useQuestStore.getState().loadQuestState(data.quests);

      console.log('Game loaded successfully!');
      return data;
    } catch (err) {
      console.error('Failed to load game:', err);
      return null;
    }
  },

  hasSaveGame(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  },

  clearSave(): void {
    localStorage.removeItem(SAVE_KEY);
  },

  saveSettings(settings: SaveData['settings']): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  },

  loadSettings(): SaveData['settings'] | null {
    try {
      const settingsStr = localStorage.getItem(SETTINGS_KEY);
      if (!settingsStr) return null;
      return JSON.parse(settingsStr) as SaveData['settings'];
    } catch {
      return null;
    }
  },
};
export default SaveManager;
