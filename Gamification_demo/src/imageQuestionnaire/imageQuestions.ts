// imageQuestions.ts — 12 approved image-based questions
// Formulated as neutral, balanced questions with scenario context where applicable.

export type OptionId = 'A' | 'B';

export interface ImageOption {
    id: OptionId;
    label: string;
    imageUrl: string;
    construct: string;
}

export interface ImageQuestion {
    id: string;
    trait: string;
    question: string;          // Neutral question wording
    scenario?: string;         // Optional scenario context shown above cards
    options: [ImageOption, ImageOption];
}

export const IMAGE_QUESTIONS: ImageQuestion[] = [
    // ── Q1: Device Security (Scenario) ───────────────────────────────────────
    {
        id: 'IMG_01',
        trait: 'Conscientiousness — Device Security',
        question: 'When you step away from your workstation for a few minutes, what does your screen look like?',
        scenario: 'You finish your lunch break and a colleague asks you to help them in another room for a few minutes. Which scene better matches what your workstation looks like after you step away?',
        options: [
            {
                id: 'A',
                label: 'Lock screen active — computer secured',
                imageUrl: '/images/questionnaire/q1a.png',
                construct: 'Conscientiousness: protective device behaviour',
            },
            {
                id: 'B',
                label: 'Screen still active — desktop accessible',
                imageUrl: '/images/questionnaire/q1b.png',
                construct: 'Conscientiousness: risky device behaviour',
            },
        ],
    },

    // ── Q2: Password Hygiene (Scenario) ──────────────────────────────────────
    {
        id: 'IMG_02',
        trait: 'Conscientiousness — Password Hygiene',
        question: 'What type of password do you typically create when signing up for a new account?',
        scenario: 'You are creating a new account on a university portal that allows up to 30 characters and shows a password strength meter. Which reflects the type of password you would create?',
        options: [
            {
                id: 'A',
                label: 'Meets minimum requirements (8 chars)',
                imageUrl: '/images/questionnaire/q2a.png',
                construct: 'Conscientiousness: minimal password hygiene',
            },
            {
                id: 'B',
                label: 'Strong — exceeds minimum requirements',
                imageUrl: '/images/questionnaire/q2b.png',
                construct: 'Conscientiousness: strong password hygiene',
            },
        ],
    },

    // ── Q3: Online Information Disclosure (Scenario) ─────────────────────────
    {
        id: 'IMG_03',
        trait: 'Agreeableness — Online Information Disclosure',
        question: 'When registering for a new online service, which type of form do you prefer to complete?',
        scenario: 'You want to try a new online service offering free content. Before accessing it, you see a registration screen. Which form would you be more comfortable completing?',
        options: [
            {
                id: 'A',
                label: 'Minimal form — email and password only',
                imageUrl: '/images/questionnaire/q3a.png',
                construct: 'Conscientiousness/Agreeableness: cautious disclosure',
            },
            {
                id: 'B',
                label: 'Full profile — name, phone, address, and DOB',
                imageUrl: '/images/questionnaire/q3b.png',
                construct: 'Agreeableness: willing disclosure',
            },
        ],
    },

    // ── Q4: Sociability (Psychology) ─────────────────────────────────────────
    {
        id: 'IMG_04',
        trait: 'Extraversion — Sociability',
        question: 'Which social setting best reflects how you prefer to spend your time?',
        options: [
            {
                id: 'A',
                label: 'Engaging in lively group conversation',
                imageUrl: '/images/questionnaire/q4a.png',
                construct: 'Extraversion: high sociability',
            },
            {
                id: 'B',
                label: 'Enjoying quiet, independent activity',
                imageUrl: '/images/questionnaire/q4b.png',
                construct: 'Introversion: low sociability',
            },
        ],
    },

    // ── Q5: Aesthetic Interests (Psychology) ──────────────────────────────────
    {
        id: 'IMG_05',
        trait: 'Openness — Aesthetic Interests',
        question: 'Which type of leisure activity appeals to you more?',
        options: [
            {
                id: 'A',
                label: 'Visiting an art museum or cultural exhibition',
                imageUrl: '/images/questionnaire/q5a.png',
                construct: 'Openness: aesthetic engagement',
            },
            {
                id: 'B',
                label: 'Relaxing with everyday leisure activities at home',
                imageUrl: '/images/questionnaire/q5b.png',
                construct: 'Openness: practical preference',
            },
        ],
    },

    // ── Q6: Tension (Psychology) ─────────────────────────────────────────────
    {
        id: 'IMG_06',
        trait: 'Neuroticism — Tension',
        question: 'How do you typically react when facing demanding deadlines or intense pressure?',
        options: [
            {
                id: 'A',
                label: 'Calm and relaxed under pressure',
                imageUrl: '/images/questionnaire/q6a.png',
                construct: 'Low Neuroticism: emotional composure',
            },
            {
                id: 'B',
                label: 'Noticeably tense and strained in demanding moments',
                imageUrl: '/images/questionnaire/q6b.png',
                construct: 'Neuroticism: tension response',
            },
        ],
    },

    // ── Q7: Enthusiasm (Psychology) ───────────────────────────────────────────
    {
        id: 'IMG_07',
        trait: 'Extraversion — Enthusiasm',
        question: 'How do you usually express yourself in team discussions or group settings?',
        options: [
            {
                id: 'A',
                label: 'Visibly energetic and animated with others',
                imageUrl: '/images/questionnaire/q7a.png',
                construct: 'Extraversion: high enthusiasm expression',
            },
            {
                id: 'B',
                label: 'Quiet and reserved in group settings',
                imageUrl: '/images/questionnaire/q7b.png',
                construct: 'Introversion: reserved engagement',
            },
        ],
    },

    // ── Q8: Worry (Psychology) ────────────────────────────────────────────────
    {
        id: 'IMG_08',
        trait: 'Neuroticism — Worry',
        question: 'How often do you find yourself dwelling on potential problems or uncertainties?',
        options: [
            {
                id: 'A',
                label: 'Rarely — generally calm and untroubled',
                imageUrl: '/images/questionnaire/q8a.png',
                construct: 'Low Neuroticism: low worry tendency',
            },
            {
                id: 'B',
                label: 'Frequently — often preoccupied with concerns and doubts',
                imageUrl: '/images/questionnaire/q8b.png',
                construct: 'Neuroticism: high worry tendency',
            },
        ],
    },

    // ── Q9: Moodiness (Psychology) ────────────────────────────────────────────
    {
        id: 'IMG_09',
        trait: 'Neuroticism — Moodiness',
        question: 'How would you describe your mood and energy throughout a typical day?',
        options: [
            {
                id: 'A',
                label: 'Consistent, stable demeanour day to day',
                imageUrl: '/images/questionnaire/q9a.png',
                construct: 'Low Neuroticism: emotional stability',
            },
            {
                id: 'B',
                label: 'Noticeable shifts in mood and energy throughout the day',
                imageUrl: '/images/questionnaire/q9b.png',
                construct: 'Neuroticism: mood variability',
            },
        ],
    },

    // ── Q10: Nervousness (Psychology) ─────────────────────────────────────────
    {
        id: 'IMG_10',
        trait: 'Neuroticism — Nervousness',
        question: 'How do you usually feel when entering unfamiliar social or networking environments?',
        options: [
            {
                id: 'A',
                label: 'Confident and composed in social situations',
                imageUrl: '/images/questionnaire/q10a.png',
                construct: 'Low Neuroticism: social confidence',
            },
            {
                id: 'B',
                label: 'Nervous or hesitant in unfamiliar social settings',
                imageUrl: '/images/questionnaire/q10b.png',
                construct: 'Neuroticism: social anxiety',
            },
        ],
    },

    // ── Q11: Technical Problem-Solving (Scenario) ─────────────────────────────
    {
        id: 'IMG_11',
        trait: 'Openness — Problem-Solving Approach',
        question: 'When tackling a complex technical challenge, what is your preferred approach?',
        scenario: 'You and your team are assigned a complex technical challenge with multiple possible solutions. Which working approach feels more natural to you?',
        options: [
            {
                id: 'A',
                label: 'Brainstorming creative, out-of-the-box ideas and novel designs',
                imageUrl: '/images/questionnaire/q11a.png',
                construct: 'Openness: creative ideation',
            },
            {
                id: 'B',
                label: 'Following a structured step-by-step methodology and verified workflow',
                imageUrl: '/images/questionnaire/q11b.png',
                construct: 'Conscientiousness: methodical approach',
            },
        ],
    },

    // ── Q12: Technical Project Style (Scenario) ───────────────────────────────
    {
        id: 'IMG_12',
        trait: 'Openness — Technical Work Style',
        question: 'Which type of technical or lab project would you prefer to spend time on?',
        scenario: 'You have dedicated lab or workshop time to collaborate on a new project. Which environment would you be more eager to dive into?',
        options: [
            {
                id: 'A',
                label: 'Working on imaginative digital design, concept art, and visual models',
                imageUrl: '/images/questionnaire/q12a.png',
                construct: 'Openness: imaginative engagement',
            },
            {
                id: 'B',
                label: 'Assembling and configuring physical hardware, cables, and lab equipment',
                imageUrl: '/images/questionnaire/q12b.png',
                construct: 'Conscientiousness/Low Openness: practical focus',
            },
        ],
    },
];
