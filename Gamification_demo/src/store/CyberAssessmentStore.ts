import { create } from 'zustand';
import audioManager from '../audio/AudioManager';
import { useCyberRiskStore } from '../cyber/CyberRiskEngine';
import { useBigFiveStore } from '../psychology/BigFiveEngine';

export interface CyberScenario {
  id: string;
  title: string;
  story: string;
  choices: string[];
  question: string;
  category: 'deviceSecurityRisk' | 'softwareSafetyRisk' | 'phishingSusceptibility' | 'passwordHygiene' | 'socialEngineeringRisk';
  // Base risk delta for choices [choice0, choice1, choice2]
  // Higher delta means higher risk.
  choiceRiskDeltas: number[];
  // Impact on Big Five traits
  choiceTraitAdjustments: Array<Record<string, number>>;
}

export const CYBER_SCENARIOS: CyberScenario[] = [
  {
    id: 'cyber_s1_cloud',
    title: 'Cloud Storage',
    story: 'Professor Orion asks you to store confidential student records.',
    choices: [
      'Upload to personal Google Drive',
      "Upload to the university's secure cloud",
      'Save only on a local encrypted device'
    ],
    question: 'How likely are you to store personal information or sensitive data in cloud storage?',
    category: 'deviceSecurityRisk',
    choiceRiskDeltas: [30, -20, -10],
    choiceTraitAdjustments: [
      { conscientiousness: -0.4, openness: 0.1 },
      { conscientiousness: 0.5 },
      { conscientiousness: 0.3 }
    ]
  },
  {
    id: 'cyber_s2_antivirus',
    title: 'Unknown Antivirus',
    story: 'A website offers a free antivirus program.',
    choices: [
      'Install immediately.',
      'Research first.',
      'Ignore it.'
    ],
    question: 'How likely are you to download free antivirus software from an unknown source?',
    category: 'softwareSafetyRisk',
    choiceRiskDeltas: [40, -15, -25],
    choiceTraitAdjustments: [
      { conscientiousness: -0.5, openness: 0.2 },
      { conscientiousness: 0.4 },
      { conscientiousness: 0.2 }
    ]
  },
  {
    id: 'cyber_s3_shopping',
    title: 'Online Shopping',
    story: 'The player wants to buy headphones. A website asks for personal information.',
    choices: [
      'Continue.',
      'Check website legitimacy first.',
      'Leave website.'
    ],
    question: 'How likely are you to enter personal information during website registration or online shopping?',
    category: 'phishingSusceptibility',
    choiceRiskDeltas: [25, -15, -20],
    choiceTraitAdjustments: [
      { conscientiousness: -0.3, openness: 0.2 },
      { conscientiousness: 0.4 },
      { conscientiousness: 0.1 }
    ]
  },
  {
    id: 'cyber_s4_password',
    title: 'Password Sharing',
    story: 'Emma forgets her password. She asks to use yours.',
    choices: [
      'Share it.',
      'Refuse politely.',
      'Help reset her password.'
    ],
    question: 'How likely are you to give your password to another person?',
    category: 'passwordHygiene',
    choiceRiskDeltas: [45, -15, -20],
    choiceTraitAdjustments: [
      { agreeableness: 0.3, conscientiousness: -0.5 },
      { conscientiousness: 0.4 },
      { agreeableness: 0.4, conscientiousness: 0.3 }
    ]
  },
  {
    id: 'cyber_s5_social',
    title: 'Social Media',
    story: 'Lucas asks you to post personal information in a university group.',
    choices: [
      'Share immediately.',
      'Share only limited information.',
      'Do not share.'
    ],
    question: 'How likely are you to share personal information through social networks or online forums?',
    category: 'socialEngineeringRisk',
    choiceRiskDeltas: [30, 10, -20],
    choiceTraitAdjustments: [
      { extraversion: 0.4, conscientiousness: -0.4 },
      { extraversion: 0.2, conscientiousness: 0.1 },
      { conscientiousness: 0.3 }
    ]
  },
  {
    id: 'cyber_s6_pirated',
    title: 'Pirated Movie',
    story: 'Sophia wants to watch a movie. She suggests downloading it from an unofficial website.',
    choices: [
      'Download.',
      'Find a legal source.',
      'Do not watch.'
    ],
    question: 'How likely are you to download digital media from unlicensed sources?',
    category: 'softwareSafetyRisk',
    choiceRiskDeltas: [35, -20, -15],
    choiceTraitAdjustments: [
      { openness: 0.3, conscientiousness: -0.4 },
      { conscientiousness: 0.4 },
      { conscientiousness: 0.2 }
    ]
  }
];

interface CyberAssessmentState {
  isActive: boolean;
  currentStep: 'story_choice' | 'likert_question' | 'completed';
  currentIndex: number;
  // Arrays of length 6
  choicesSelected: number[]; // index of choice selected (0, 1, 2)
  likertRatings: number[];   // 1 to 5 rating
  onCompleteCallback: (() => void) | null;

  // Actions
  startAssessment: (onComplete?: () => void) => void;
  selectChoice: (choiceIdx: number) => void;
  submitLikert: (rating: number) => void;
  resetAssessment: () => void;
}

export const useCyberAssessmentStore = create<CyberAssessmentState>((set, get) => ({
  isActive: false,
  currentStep: 'story_choice',
  currentIndex: 0,
  choicesSelected: [],
  likertRatings: [],
  onCompleteCallback: null,

  startAssessment: (onComplete) => {
    set({
      isActive: true,
      currentStep: 'story_choice',
      currentIndex: 0,
      choicesSelected: [],
      likertRatings: [],
      onCompleteCallback: onComplete || null
    });
    audioManager.playSFX('quest_complete');
  },

  selectChoice: (choiceIdx) => {
    const { currentIndex, choicesSelected } = get();
    const scenario = CYBER_SCENARIOS[currentIndex];
    if (!scenario) return;

    // Record the risk delta in CyberRiskStore
    const riskDelta = scenario.choiceRiskDeltas[choiceIdx];
    const choiceText = scenario.choices[choiceIdx];
    useCyberRiskStore.getState().recordIncident(
      `scenario_${currentIndex}_choice`,
      scenario.category,
      `Scenario Choice: "${choiceText}"`,
      riskDelta
    );

    // Record trait adjustments
    const adjustments = scenario.choiceTraitAdjustments[choiceIdx];
    if (adjustments) {
      useBigFiveStore.getState().recordAction(
        `scenario_${currentIndex}_choice`,
        `Scenario Choice: "${choiceText}"`,
        adjustments
      );
    }

    set({
      choicesSelected: [...choicesSelected, choiceIdx],
      currentStep: 'likert_question'
    });
    audioManager.playSFX('button_click');
  },

  submitLikert: (rating) => {
    const { currentIndex, likertRatings, onCompleteCallback } = get();
    const scenario = CYBER_SCENARIOS[currentIndex];
    if (!scenario) return;

    const nextIndex = currentIndex + 1;
    const isFinished = nextIndex >= CYBER_SCENARIOS.length;

    // Likert rating acts as additional risk signal (higher rating = higher risk likelihood)
    // 3 is neutral (no change). 4 is +10 risk, 5 is +20 risk. 2 is -10 risk, 1 is -20 risk.
    const ratingDelta = (rating - 3) * 10;
    useCyberRiskStore.getState().recordIncident(
      `scenario_${currentIndex}_likert`,
      scenario.category,
      `Likert Likelihood: Rating ${rating} to question: "${scenario.question}"`,
      ratingDelta
    );

    if (isFinished) {
      set({
        likertRatings: [...likertRatings, rating],
        currentStep: 'completed',
        isActive: false
      });
      audioManager.playSFX('quest_complete');
      if (onCompleteCallback) {
        onCompleteCallback();
      }
    } else {
      set({
        likertRatings: [...likertRatings, rating],
        currentIndex: nextIndex,
        currentStep: 'story_choice'
      });
      audioManager.playSFX('button_click');
    }
  },

  resetAssessment: () => {
    set({
      isActive: false,
      currentStep: 'story_choice',
      currentIndex: 0,
      choicesSelected: [],
      likertRatings: [],
      onCompleteCallback: null
    });
  }
}));
