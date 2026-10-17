# Image-Based Questionnaire — Assessment Module

## Overview

This module adds the image-based questionnaire to the `Gamification_demo` CyberQuest app (`/image-questionnaire`).
It implements all 12 questions derived from the research mapping sheet (`Questionnaire_Draft (1).xlsx`), adopting a forced-choice visual format based on Hilliard et al. (2022).

---

## Stack Used

Matches the existing `Gamification_demo` conventions:

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | TailwindCSS v4 + `glass-panel` cyber neon styling |
| State | Zustand (`ImageQuestionnaireStore.ts`) |
| Animation | Framer Motion |
| Routing | React Router v7 |
| Backend API | Flask (`app.py`) with SQLite (`submissions.db`) |

---

## Implemented Structure

```
Gamification_demo/
  src/
    imageQuestionnaire/
      imageQuestions.ts            ← 12 questions, scenarios, and psychometric construct definitions
      ImageQuestionnaireStore.ts   ← Zustand store with submission handling
      ImageQuestionCard.tsx        ← Accessible selectable card component
      ImageQuestionnairePage.tsx   ← Quiz & Thank You views styled like CyberAssessmentOverlay
    pages/
      MainMenu.tsx                 ← Menu including Image-Based Questionnaire entry button
      ImageQuestionnairePage.tsx   ← Route wrapper
  public/
    images/questionnaire/
      q1a.png – q12b.png           ← 24 high-resolution visual cards

Root Directory:
  app.py                           ← Backend serving API at /api/image-submissions for IMG_01..IMG_12
  index.html                       ← Standalone 12-question web demo
```

---

## How to Run

### React App (Recommended)
```bash
cd "Gamification_demo"
npm install
npm run dev
```
Open **http://localhost:5173/image-questionnaire** or click the **Image-Based Questionnaire** button on the Main Menu.

### Standalone Python App
```bash
python app.py
```
Open **http://127.0.0.1:5000**

---

## All 12 Questions Summary

1. **IMG_01** (Conscientiousness): Stepping away from workstation (Lock screen active vs. Unattended desktop)
2. **IMG_02** (Conscientiousness): Password creation (Minimum length vs. Strong extended passphrase)
3. **IMG_03** (Agreeableness): Online registration disclosure (Minimal fields vs. Full personal details)
4. **IMG_04** (Extraversion): Sociability (*"Is outgoing, sociable."*)
5. **IMG_05** (Openness): Aesthetic Interests (*"Values artistic, aesthetic experiences."*)
6. **IMG_06** (Neuroticism): Tension (*"Can be tense."*)
7. **IMG_07** (Extraversion): Enthusiasm (*"Generates a lot of enthusiasm."*)
8. **IMG_08** (Neuroticism): Worry (*"Worries a lot."*)
9. **IMG_09** (Neuroticism): Moodiness (*"Can be moody."*)
10. **IMG_10** (Neuroticism): Nervousness (*"Gets nervous easily."*)
11. **IMG_11** (Openness): Deep Thinking (*"Is ingenious, a deep thinker."*)
12. **IMG_12** (Openness): Active Imagination (*"Has an active imagination."*)

---

## Reference

Hilliard, A., Kazim, E., Bitsakis, T., and Leutner, F. (2022). "Measuring Personality through Images: Validating a Forced-Choice Image-Based Assessment of the Big Five Personality Traits." *Journal of Intelligence*, 10(1), 12.
