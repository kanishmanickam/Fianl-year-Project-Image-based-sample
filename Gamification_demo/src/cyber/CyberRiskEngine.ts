import { create } from 'zustand';

export interface CyberRiskProfile {
  phishingSusceptibility: number;   // 0 (low risk/secure) to 100 (high risk)
  passwordHygiene: number;          // 0 to 100
  socialEngineeringRisk: number;    // 0 to 100
  deviceSecurityRisk: number;       // 0 to 100
  softwareSafetyRisk: number;       // 0 to 100
}

export interface CyberActionLog {
  timestamp: number;
  incidentId: string;
  category: keyof CyberRiskProfile;
  description: string;
  riskDelta: number; // Positive increases risk, negative decreases risk
}

interface CyberRiskStore {
  profile: CyberRiskProfile;
  incidents: CyberActionLog[];
  // Actions
  recordIncident: (
    incidentId: string,
    category: keyof CyberRiskProfile,
    description: string,
    riskDelta: number
  ) => void;
  resetProfile: () => void;
  loadProfile: (profile: CyberRiskProfile, incidents: CyberActionLog[]) => void;
}

const DEFAULT_PROFILE: CyberRiskProfile = {
  phishingSusceptibility: 50.0,
  passwordHygiene: 50.0,
  socialEngineeringRisk: 50.0,
  deviceSecurityRisk: 50.0,
  softwareSafetyRisk: 50.0,
};

export const useCyberRiskStore = create<CyberRiskStore>((set) => ({
  profile: { ...DEFAULT_PROFILE },
  incidents: [],

  recordIncident: (incidentId, category, description, riskDelta) =>
    set((state) => {
      const currentVal = state.profile[category];
      const newVal = Math.min(100.0, Math.max(0.0, currentVal + riskDelta));
      
      const updatedProfile = {
        ...state.profile,
        [category]: parseFloat(newVal.toFixed(2)),
      };

      const logEntry: CyberActionLog = {
        timestamp: Date.now(),
        incidentId,
        category,
        description,
        riskDelta,
      };

      return {
        profile: updatedProfile,
        incidents: [...state.incidents, logEntry],
      };
    }),

  resetProfile: () => set({ profile: { ...DEFAULT_PROFILE }, incidents: [] }),

  loadProfile: (profile, incidents) => set({ profile, incidents }),
}));
