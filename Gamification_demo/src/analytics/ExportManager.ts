import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { BigFiveTraits, ActionLog } from '../psychology/BigFiveEngine';
import type { CyberRiskProfile, CyberActionLog } from '../cyber/CyberRiskEngine';
import { CYBER_SCENARIOS } from '../store/CyberAssessmentStore';

export interface ReflectionResponseLog {
  questionId: string;
  trait: string;
  statement: string;
  rating: number;
}

export interface TelemetryData {
  playerName: string;
  sessionDurationSeconds: number;
  traits: BigFiveTraits;
  traitsHistory: ActionLog[];
  cyberProfile: CyberRiskProfile;
  cyberHistory: CyberActionLog[];
  reflectionResponses: ReflectionResponseLog[];
  cyberAssessmentChoices: number[];
  cyberAssessmentLikerts: number[];
}

export const exportTelemetryToExcel = (data: TelemetryData) => {
  try {
    // Create new workbook
    const wb = XLSX.utils.book_new();

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 1: Big Five Questionnaire
    // Columns: Question, Likert Score, Story Choice, Behaviour Score, Trait
    // ─────────────────────────────────────────────────────────────────────────
    const bigFiveRows = data.reflectionResponses.map((item) => {
      // Find story choice(s) related to this trait
      const relatedChoices = data.traitsHistory
        .filter((log) => log.adjustments[item.trait as keyof BigFiveTraits] !== undefined)
        .map((log) => log.description);
      
      const storyChoiceText = relatedChoices.length > 0 
        ? relatedChoices.slice(0, 2).join('; ') 
        : 'No story choice recorded';

      const behaviourScore = data.traits[item.trait as keyof BigFiveTraits] ?? 3.0;

      return {
        'Question': item.statement,
        'Likert Score': item.rating,
        'Story Choice': storyChoiceText,
        'Behaviour Score': Number(behaviourScore.toFixed(2)),
        'Trait': item.trait.charAt(0).toUpperCase() + item.trait.slice(1)
      };
    });
    const wsBigFive = XLSX.utils.json_to_sheet(bigFiveRows);
    XLSX.utils.book_append_sheet(wb, wsBigFive, 'Big Five Questionnaire');

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 2: Cyber Risk
    // Columns: Scenario, Choice, Likert Score, Behaviour Score
    // ─────────────────────────────────────────────────────────────────────────
    const cyberRiskRows = CYBER_SCENARIOS.map((sc, idx) => {
      const choiceIdx = data.cyberAssessmentChoices[idx] ?? 0;
      const likertScore = data.cyberAssessmentLikerts[idx] ?? 3;
      const choiceText = sc.choices[choiceIdx] || 'No choice selected';
      const categoryScore = data.cyberProfile[sc.category] ?? 50.0;

      return {
        'Scenario': sc.title + ' - ' + sc.story,
        'Choice': choiceText,
        'Likert Score': likertScore,
        'Behaviour Score': `${categoryScore.toFixed(1)}%`
      };
    });
    const wsCyber = XLSX.utils.json_to_sheet(cyberRiskRows);
    XLSX.utils.book_append_sheet(wb, wsCyber, 'Cyber Risk');

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 3: Trait Summary
    // Columns: Trait, Score
    // ─────────────────────────────────────────────────────────────────────────
    const overallRisk = (
      (data.cyberProfile.phishingSusceptibility +
       data.cyberProfile.passwordHygiene +
       data.cyberProfile.socialEngineeringRisk +
       data.cyberProfile.deviceSecurityRisk +
       data.cyberProfile.softwareSafetyRisk) / 5
    );

    const summaryRows = [
      { 'Trait': 'Openness', 'Score': Number(data.traits.openness.toFixed(2)) },
      { 'Trait': 'Conscientiousness', 'Score': Number(data.traits.conscientiousness.toFixed(2)) },
      { 'Trait': 'Extraversion', 'Score': Number(data.traits.extraversion.toFixed(2)) },
      { 'Trait': 'Agreeableness', 'Score': Number(data.traits.agreeableness.toFixed(2)) },
      { 'Trait': 'Neuroticism', 'Score': Number(data.traits.neuroticism.toFixed(2)) },
      { 'Trait': 'Average Cyber Risk', 'Score': `${overallRisk.toFixed(1)}%` }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Trait Summary');

    // ─────────────────────────────────────────────────────────────────────────
    // SHEET 4: Session Information
    // Key-value pairs of metadata
    // ─────────────────────────────────────────────────────────────────────────
    const now = new Date();
    const durationMin = Math.floor(data.sessionDurationSeconds / 60);
    const durationSec = data.sessionDurationSeconds % 60;
    
    const sessionRows = [
      { 'Parameter': 'Player Name', 'Value': data.playerName },
      { 'Parameter': 'Date', 'Value': now.toISOString().split('T')[0] },
      { 'Parameter': 'Time', 'Value': now.toTimeString().split(' ')[0] },
      { 'Parameter': 'Duration', 'Value': `${durationMin}m ${durationSec}s` },
      { 'Parameter': 'Game Version', 'Value': 'v1.2.0' }
    ];
    const wsSession = XLSX.utils.json_to_sheet(sessionRows);
    XLSX.utils.book_append_sheet(wb, wsSession, 'Session Information');

    // Write Excel buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    // Save File
    const filename = `CyberQuest_Telemetry_${data.playerName}_${Date.now()}.xlsx`;
    saveAs(fileData, filename);
    return true;
  } catch (error) {
    console.error('Failed to export telemetry data to Excel:', error);
    return false;
  }
};
