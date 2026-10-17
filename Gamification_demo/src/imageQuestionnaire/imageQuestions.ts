// imageQuestions.ts — 12 approved image-based questions
// Source: Questionnaire_Draft.xlsx > Question mapping sheet
// Q1-3: Scenario-based rewrites (same construct preserved)
// Q4-5: Original items UNCHANGED
// Q6-12: New items from Excel image-based mapping

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
    question: string;          // original item wording (Excel)
    scenario?: string;         // scenario context shown above cards (Q1-3 only)
    options: [ImageOption, ImageOption];
}

export const IMAGE_QUESTIONS: ImageQuestion[] = [
    // ── Q1: Device Securement ────────────────────────────────────────────────
    {
        id: 'IMG_01',
        trait: 'Conscientiousness — Device Security',
        question: "My screen automatically locks if I don't use it for a prolonged period.",
        scenario: "You finish your lunch break and a colleague asks you to help them in another room for a few minutes. Looking at the two scenes below, which better matches what your workstation would look like after you step away?",
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

    // ── Q2: Password Strength ────────────────────────────────────────────────
    {
        id: 'IMG_02',
        trait: 'Conscientiousness — Password Hygiene',
        question: "If an account allows it, I use a password beyond the site's minimum requirements.",
        scenario: "You are creating a new account on a university portal. The site allows up to 30 characters and shows a password strength indicator. Which of the following best reflects the kind of password you would create?",
        options: [
            {
                id: 'A',
                label: 'Meets minimum requirements',
                imageUrl: '/images/questionnaire/q2a.png',
                construct: 'Conscientiousness: minimal password hygiene',
            },
            {
                id: 'B',
                label: 'Strong — exceeds minimum length',
                imageUrl: '/images/questionnaire/q2b.png',
                construct: 'Conscientiousness: strong password hygiene',
            },
        ],
    },

    // ── Q3: Online Information Disclosure ────────────────────────────────────
    {
        id: 'IMG_03',
        trait: 'Agreeableness — Online Information Disclosure',
        question: 'Entering personal information during website registration or when shopping online.',
        scenario: "You want to try a new online service offering free content. Before accessing it, you see a registration screen. Which of the following registration forms would you be more comfortable completing?",
        options: [
            {
                id: 'A',
                label: 'Minimal form — email and password only',
                imageUrl: '/images/questionnaire/q3a.png',
                construct: 'Conscientiousness/Agreeableness: cautious disclosure',
            },
            {
                id: 'B',
                label: 'Full form — name, phone, address, DOB',
                imageUrl: '/images/questionnaire/q3b.png',
                construct: 'Agreeableness: willing disclosure',
            },
        ],
    },

    // ── Q4: Extraversion — UNCHANGED ─────────────────────────────────────────
    {
        id: 'IMG_04',
        trait: 'Extraversion — Sociability',
        question: 'Is outgoing, sociable.',
        options: [
            {
                id: 'A',
                label: 'Comfortable in group conversation',
                imageUrl: '/images/questionnaire/q4a.png',
                construct: 'Extraversion: high sociability',
            },
            {
                id: 'B',
                label: 'Enjoying quiet independent activity',
                imageUrl: '/images/questionnaire/q4b.png',
                construct: 'Introversion: low sociability',
            },
        ],
    },

    // ── Q5: Openness — UNCHANGED ──────────────────────────────────────────────
    {
        id: 'IMG_05',
        trait: 'Openness — Aesthetic Interests',
        question: 'Values artistic, aesthetic experiences.',
        options: [
            {
                id: 'A',
                label: 'Engaging with art or an exhibition',
                imageUrl: '/images/questionnaire/q5a.png',
                construct: 'Openness: aesthetic engagement',
            },
            {
                id: 'B',
                label: 'Everyday leisure activity at home',
                imageUrl: '/images/questionnaire/q5b.png',
                construct: 'Openness: practical preference',
            },
        ],
    },

    // ── Q6: Tension (Psychology) ─────────────────────────────────────────────
    {
        id: 'IMG_06',
        trait: 'Neuroticism — Tension',
        question: 'Under demanding situations or tight deadlines, I tend to feel tense and stressed.',
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
        question: 'When interacting in a group or team, I bring a lot of energy and enthusiasm.',
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
        question: 'I often find myself worrying about things that could go wrong.',
        options: [
            {
                id: 'A',
                label: 'Generally calm and untroubled',
                imageUrl: '/images/questionnaire/q8a.png',
                construct: 'Low Neuroticism: low worry tendency',
            },
            {
                id: 'B',
                label: 'Often preoccupied with concerns and doubts',
                imageUrl: '/images/questionnaire/q8b.png',
                construct: 'Neuroticism: high worry tendency',
            },
        ],
    },

    // ── Q9: Moodiness (Psychology) ────────────────────────────────────────────
    {
        id: 'IMG_09',
        trait: 'Neuroticism — Moodiness',
        question: 'My mood and energy levels tend to change noticeably throughout the day.',
        options: [
            {
                id: 'A',
                label: 'Consistent, stable demeanour day to day',
                imageUrl: '/images/questionnaire/q9a.png',
                construct: 'Low Neuroticism: emotional stability',
            },
            {
                id: 'B',
                label: 'Mood shifts noticeably throughout the day',
                imageUrl: '/images/questionnaire/q9b.png',
                construct: 'Neuroticism: mood variability',
            },
        ],
    },

    // ── Q10: Nervousness (Psychology) ─────────────────────────────────────────
    {
        id: 'IMG_10',
        trait: 'Neuroticism — Nervousness',
        question: 'I easily feel nervous or hesitant when entering unfamiliar social situations.',
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
        question: 'How do you prefer to approach a complex technical or project challenge?',
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
