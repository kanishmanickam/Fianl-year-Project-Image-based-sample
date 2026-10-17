import { useBigFiveStore } from '../psychology/BigFiveEngine';
import { useCyberRiskStore } from '../cyber/CyberRiskEngine';
import { useReflectionStore, BIG_FIVE_QUESTIONS } from '../store/ReflectionStore';
import { useCyberAssessmentStore } from '../store/CyberAssessmentStore';
import { exportTelemetryToExcel } from './ExportManager';
import type { TelemetryData } from './ExportManager';

class TelemetryService {
  private startTime: number;
  private playerName: string = 'Campus_Candidate_01';

  constructor() {
    this.startTime = Date.now();
  }

  public setPlayerName(name: string) {
    this.playerName = name;
  }

  public getPlayerName(): string {
    return this.playerName;
  }

  public resetSession() {
    this.startTime = Date.now();
    useBigFiveStore.getState().resetTraits();
    useCyberRiskStore.getState().resetProfile();
    useReflectionStore.getState().resetReflection();
    useCyberAssessmentStore.getState().resetAssessment();
  }

  public getSessionDuration(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  public getTelemetryData(): TelemetryData {
    const psychState = useBigFiveStore.getState();
    const cyberState = useCyberRiskStore.getState();
    const reflectionState = useReflectionStore.getState();
    const assessmentState = useCyberAssessmentStore.getState();

    const reflectionResponses = Object.entries(reflectionState.responses).map(([qId, rating]) => {
      const q = BIG_FIVE_QUESTIONS.find((item) => item.id === qId);
      return {
        questionId: qId,
        trait: q?.trait || 'unknown',
        statement: q?.text || 'unknown',
        rating,
      };
    });

    return {
      playerName: this.playerName,
      sessionDurationSeconds: this.getSessionDuration(),
      traits: psychState.traits,
      traitsHistory: psychState.history,
      cyberProfile: cyberState.profile,
      cyberHistory: cyberState.incidents,
      reflectionResponses,
      cyberAssessmentChoices: assessmentState.choicesSelected,
      cyberAssessmentLikerts: assessmentState.likertRatings,
    };
  }

  public triggerExcelDownload(): boolean {
    const data = this.getTelemetryData();
    return exportTelemetryToExcel(data);
  }
}

export const telemetryService = new TelemetryService();
export default telemetryService;
