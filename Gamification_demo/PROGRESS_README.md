# CyberRisk — Image-Based Questionnaire Overhaul

## What Was Done

The image-based assessment module has been completely overhauled and fully completed based on the implementation plan and the Excel question mapping (`Questionnaire_Draft (1).xlsx`).

### Questions Implemented (All 12 Items)

| ID | Trait | Type | Question / Scenario |
|---|---|---|---|
| **IMG_01** | Conscientiousness – Device Security | Scenario | Workplace stepping-away scenario (Lock screen active vs. Unattended desktop active) |
| **IMG_02** | Conscientiousness – Password Hygiene | Scenario | University portal registration scenario (Meets 8-char minimum vs. Strong passphrase) |
| **IMG_03** | Agreeableness – Online Information Disclosure | Scenario | Online service registration scenario (Minimal email-only form vs. Detailed personal profile) |
| **IMG_04** | Extraversion – Sociability | Trait item | *"Is outgoing, sociable."* (Group conversation vs. Quiet solo activity) |
| **IMG_05** | Openness – Aesthetic Interests | Trait item | *"Values artistic, aesthetic experiences."* (Art exhibition vs. Everyday leisure at home) |
| **IMG_06** | Neuroticism – Tension | Trait item | *"Can be tense."* (Calm under pressure vs. Noticeably tense in demanding moments) |
| **IMG_07** | Extraversion – Enthusiasm | Trait item | *"Generates a lot of enthusiasm."* (Visibly energetic in group vs. Quiet and reserved) |
| **IMG_08** | Neuroticism – Worry | Trait item | *"Worries a lot."* (Generally calm and untroubled vs. Often preoccupied with concerns) |
| **IMG_09** | Neuroticism – Moodiness | Trait item | *"Can be moody."* (Consistent, stable demeanour vs. Mood shifts noticeably) |
| **IMG_10** | Neuroticism – Nervousness | Trait item | *"Gets nervous easily."* (Confident in social situations vs. Nervous/hesitant in group) |
| **IMG_11** | Openness – Imagination / Deep Thinking | Trait item | *"Is ingenious, a deep thinker."* (Creative ideation whiteboard vs. Methodical structured process) |
| **IMG_12** | Openness – Active Imagination | Trait item | *"Has an active imagination."* (Drawn to imaginative concepts vs. Practical hands-on tasks) |

---

## Visual Assets (24 High-Quality Images)

All 24 image cards are high-resolution PNGs matching the CyberQuest visual aesthetic:
- **`q1a.png`, `q1b.png`**: Stepping away from workstation (locked vs. unlocked screen)
- **`q2a.png`, `q2b.png`**: Password hygiene (minimum vs. strong password entry)
- **`q3a.png`, `q3b.png`**: Online disclosure (minimal email vs. detailed personal form)
- **`q4a.png`, `q4b.png`**: Extraversion sociability (social group vs. quiet solo)
- **`q5a.png`, `q5b.png`**: Aesthetic experiences (art gallery vs. home leisure)
- **`q6a.png`, `q6b.png`**: Emotional composure vs. workplace tension
- **`q7a.png`, `q7b.png`**: Animated group enthusiasm vs. quiet observant presence
- **`q8a.png`, `q8b.png`**: Relaxed, untroubled posture vs. anxious preoccupation
- **`q9a.png`, `q9b.png`**: Steady reliable demeanor vs. moody contemplation
- **`q10a.png`, `q10b.png`**: Confident social entry vs. hesitant, self-conscious posture
- **`q11a.png`, `q11b.png`**: Creative ideation whiteboard vs. methodical structured workflow
- **`q12a.png`, `q12b.png`**: Imaginative concept art design vs. practical hardware assembly

Files are available at both:
- `Gamification_demo/public/images/questionnaire/` (for Vite React app)
- `images/` (for standalone Flask/HTML demo)

---

## Key Components & Architecture

```
Gamification_demo/
  public/images/questionnaire/   ← 24 PNG image assets (q1a.png – q12b.png)
  src/
    imageQuestionnaire/
      imageQuestions.ts          ← 12 question definitions with scenarios and constructs
      ImageQuestionnaireStore.ts ← Zustand store with async API submission support
      ImageQuestionCard.tsx      ← Accessible image card with cyber glow and check states
      ImageQuestionnairePage.tsx ← Dark cyberpunk UI matching CyberAssessmentOverlay style
    pages/
      MainMenu.tsx               ← Main menu with direct button to Image-Based Questionnaire
      ImageQuestionnairePage.tsx ← Route wrapper for /image-questionnaire
    App.tsx                      ← Routing for /image-questionnaire

Root Directory:
  app.py                         ← Flask API updated with VALID_IDS for IMG_01 through IMG_12
  index.html                     ← Standalone demo updated with all 12 questions & dynamic scoring
  submissions.db                 ← SQLite database capturing session answers
```

---

## Verification & Status

- [x] All 12 questions implemented from Excel question mapping
- [x] Scenario rewrites for Q1–Q3 with realistic context panels
- [x] Q4–Q5 items preserved
- [x] Q6–Q12 items implemented
- [x] All 24 image assets generated and verified
- [x] UI matches CyberAssessmentOverlay forced-choice aesthetic (dark theme, cyan/magenta accents)
- [x] Thank You screen shown on submission with Restart and Return to Main Menu options
- [x] Direct navigation button added to Main Menu
- [x] Backend API (`app.py`) updated to validate and record all 12 questions
- [x] Standalone prototype (`index.html`) updated with all 12 questions
- [x] `tsc --noEmit` passes with 0 errors
- [x] `npm run build` succeeds cleanly
