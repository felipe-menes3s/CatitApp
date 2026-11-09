# CatitApp

Workout app for Felipe's wife (Catita). Separate from DontSkip. UI in Spanish, code in English.

## Who it is for
- About 3 months postpartum (natural birth, cleared by her doctor), breastfeeding on demand.
- Lumbar disc problem: NO running, jumping, crunches, sit-ups, twists with weight, weight on the back, deadlifts or good mornings.
- Goal: lose weight slowly (max ~0.5 kg/week, to protect milk supply). Her numbers are NOT in the code (the repo may be public); they belong in the app, on her phone.
- Trains Mon-Fri 6:00 AM, 40 min. Building gym (dumbbells, mat, ball, cardio machines) or home (dumbbells, ball, step, mat).
- Loves legs, stair climber, incline walking. Avoids "arms": upper body is framed as "postura".
- No AI assistant (Jarvis did not work in DontSkip).

## Stack
- React 18 + htm from esm.sh, no build step. ES modules in `js/`.
- Data only in localStorage (`catita:` prefix). Dev server: `python3 -m http.server 8086` (DontSkip uses 8085).
- Themes: `js/themes.js` palettes (light + dark each). Screens only use CSS variables, never hex colors.

## Files
- `js/data/exercises.js` — catalog with tips. `js/data/routines.js` — 5-day plan, `home` swaps.
- `js/session.js` — what counts as done. `js/storage.js` — localStorage.
- `js/screens/` — Today, Workout, Settings. `js/ui.js` — icons, ring, GIF, segmented control.
- `sw.js` — offline support. When you add or rename a file or GIF, add it to APP_SHELL (a missing file makes install fail).

## Program rules (evidence-based, 2026-11-08)
- Every day starts with 4 min walking, then pelvic-floor breathing. No floor bending right out of bed (6 AM, discs most hydrated).
- Strength = circuits with rep ranges [min, max]. When every round reaches the top, the app suggests more weight next time.
- Adaptation: her first 10 finished workouts use 2 rounds and +4 min cardio (`rampUp`, counted by workouts, not calendar).
- "Dormí mal: día suave" routine never breaks progress.
- Nutrition (Part B, built 2026-11-08: 'Tu día' card in Hoy + Progreso tab): ~1,900 kcal, never under 1,800; ~100 g protein; 12 glasses water; low-effort checklist; weekly weigh-in, 3-week trend.

## GIFs
- From ExerciseDB (same style as DontSkip). Every GIF was checked by eye.
- Several DontSkip GIFs have wrong names (squat = barbell back squat, plank = plate on back,
  doorway_chest_stretch = arm circles, wall_angels = something else). Never copy one without looking at it.
- Every exercise has a checked image (2026-11-08). Photos where no illustration exists: walk_easy.jpg, bird_dog.jpg (credits in CREDITS.md); pelvic_breath.png is a still (breathing is not visible).
- Dropped because no correct image exists: cat-cow, step-up on a low step, lying glute stretch, step cardio. Do not add an exercise back without a verified image.
- `gif` in exercises.js: another id (reuses its GIF) or a file name with extension.
