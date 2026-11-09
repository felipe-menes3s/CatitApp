// Weekly plan: Mon–Fri, 40 min. Warm-up ~6.5 · strength circuit 12–15 · cardio 16–22 · stretch 2–3.
// At 6 AM discs are most hydrated: every day starts WALKING (4 min) before any floor work or bending.
// Circuit pace: ~3 s per rep, 15 s between exercises, 45 s between rounds.
// Ramp-up (first 10 workouts): circuits do 2 rounds and the freed time goes to cardio (+4 min).
//
// Item fields: reps (number or [min, max]) · seconds (held) · hold (seconds per rep) · perSide
//              minutes (cardio) · text (warm-up/stretch amount) · home (swap at home)

const WALK_FIRST = { id: 'walk_easy', minutes: 4, home: 'march' };
const PELVIC_FLOOR = { id: 'pelvic_breath', text: '6 respiraciones' };

const WARMUP_LEGS = { title: 'Calentamiento', items: [
  WALK_FIRST, PELVIC_FLOOR,
  { id: 'cat_cow', text: '6 veces' },
  { id: 'hip_circles', text: '8 por lado' },
] };

export const ROUTINES = [
  {
    id: 'legs_a', day: 1, name: 'Pierna y glúteo', focus: 'Sentadilla y step', minutes: 40,
    blocks: [
      WARMUP_LEGS,
      { title: 'Circuito', rounds: 3, items: [
        { id: 'goblet_squat', reps: [10, 12] },
        { id: 'step_up', reps: [8, 10], perSide: true },
        { id: 'glute_bridge', reps: [12, 15] },
        { id: 'side_plank', seconds: 15, perSide: true },
      ] },
      { title: 'Cardio', items: [{ id: 'incline_walk', minutes: 16, home: 'step_cardio' }] },
      { title: 'Estirar', items: [
        { id: 'quad_stretch', text: '30 s por lado' },
        { id: 'glute_stretch_lying', text: '30 s por lado' },
        { id: 'hip_flexor_stretch', text: '30 s por lado' },
      ] },
    ],
  },
  {
    id: 'posture_core', day: 2, name: 'Postura y centro', focus: 'Espalda alta y abdomen', minutes: 40,
    blocks: [
      { title: 'Calentamiento', items: [
        WALK_FIRST, PELVIC_FLOOR,
        { id: 'arm_circles', text: '30 segundos' },
        { id: 'cat_cow', text: '6 veces' },
      ] },
      { title: 'Circuito', rounds: 2, items: [
        { id: 'db_row', reps: [10, 12], perSide: true },
        { id: 'incline_pushup', reps: [8, 12] },
        { id: 'rear_delt_side', reps: [10, 12], perSide: true },
        { id: 'curl_up', reps: 5, hold: 8 },
        { id: 'bird_dog', reps: 4, hold: 8, perSide: true },
        { id: 'side_plank', seconds: 15, perSide: true },
      ] },
      { title: 'Cardio', items: [{ id: 'stairmaster', minutes: 16, home: 'step_cardio' }] },
      { title: 'Estirar', items: [
        { id: 'hip_flexor_stretch', text: '30 s por lado' },
        { id: 'glute_stretch_lying', text: '30 s por lado' },
      ] },
    ],
  },
  {
    id: 'legs_b', day: 3, name: 'Glúteo', focus: 'Puentes y zancadas', minutes: 40,
    blocks: [
      WARMUP_LEGS,
      { title: 'Circuito', rounds: 3, items: [
        { id: 'bench_squat', reps: [10, 12] },
        { id: 'split_squat', reps: [8, 10], perSide: true },
        { id: 'bench_bridge', reps: [10, 12] },
        { id: 'dead_bug', reps: 6, perSide: true },
      ] },
      { title: 'Cardio', items: [{ id: 'incline_walk', minutes: 16, home: 'step_cardio', note: 'Opcional: 2 min con +2 % de inclinación y 2 min normal.' }] },
      { title: 'Estirar', items: [
        { id: 'glute_stretch_lying', text: '30 s por lado' },
        { id: 'hip_flexor_stretch', text: '30 s por lado' },
        { id: 'calf_stretch', text: '30 s por lado' },
      ] },
    ],
  },
  {
    id: 'cardio_core', day: 4, name: 'Cardio y centro', focus: 'Caminata larga y McGill', minutes: 40,
    blocks: [
      { title: 'Calentamiento', items: [WALK_FIRST, PELVIC_FLOOR] },
      { title: 'Cardio', items: [{ id: 'incline_walk', minutes: 22, home: 'step_cardio' }] },
      { title: 'Centro', rounds: 2, items: [
        { id: 'curl_up', reps: 5, hold: 8 },
        { id: 'bird_dog', reps: 4, hold: 8, perSide: true },
        { id: 'side_plank', seconds: 15, perSide: true },
        { id: 'glute_bridge', reps: 15 },
      ] },
      { title: 'Estirar', items: [
        { id: 'hip_flexor_stretch', text: '30 s por lado' },
        { id: 'glute_stretch_lying', text: '30 s por lado' },
      ] },
    ],
  },
  {
    id: 'full_body', day: 5, name: 'Cuerpo completo', focus: 'Un poco de todo', minutes: 40,
    blocks: [
      { title: 'Calentamiento', items: [
        WALK_FIRST, PELVIC_FLOOR,
        { id: 'hip_circles', text: '8 por lado' },
        { id: 'arm_circles', text: '30 segundos' },
      ] },
      { title: 'Circuito', rounds: 3, items: [
        { id: 'goblet_squat', reps: [10, 12] },
        { id: 'db_row', reps: [10, 12], perSide: true },
        { id: 'farmer_carry', seconds: 40 },
        { id: 'incline_pushup', reps: [8, 12] },
      ] },
      { title: 'Cardio', items: [{ id: 'stairmaster', minutes: 16, home: 'step_cardio' }] },
      { title: 'Estirar', items: [
        { id: 'quad_stretch', text: '30 s por lado' },
        { id: 'glute_stretch_lying', text: '30 s por lado' },
        { id: 'calf_stretch', text: '30 s por lado' },
      ] },
    ],
  },
  {
    // For a bad night with the baby. Not a failure: it does not break progress.
    id: 'easy', day: null, name: 'Día suave', focus: 'Para cuando dormiste mal', minutes: 25,
    blocks: [
      { title: 'Caminar', items: [{ id: 'walk_easy', minutes: 18, home: 'march' }, PELVIC_FLOOR] },
      { title: 'Centro', rounds: 1, items: [
        { id: 'curl_up', reps: 5, hold: 8 },
        { id: 'bird_dog', reps: 4, hold: 8, perSide: true },
        { id: 'side_plank', seconds: 15, perSide: true },
      ] },
      { title: 'Estirar', items: [
        { id: 'hip_flexor_stretch', text: '30 s por lado' },
        { id: 'glute_stretch_lying', text: '30 s por lado' },
      ] },
    ],
  },
];

export const routineById = id => ROUTINES.find(r => r.id === id);
export const routineForDay = date => ROUTINES.find(r => r.day === date.getDay()) || null;

// rampUp = her first workouts: fewer rounds, a bit more walking.
export function blocksOf(routine, place, rampUp = false) {
  const extraCardio = rampUp && routine.blocks.some(b => b.rounds === 3);
  return routine.blocks.map((block, b) => {
    const rounds = block.rounds && rampUp ? Math.min(2, block.rounds) : block.rounds;
    const items = block.items.map((item, i) => ({
      ...item,
      key: `${b}-${i}`,
      sets: rounds || 0,
      minutes: item.minutes && extraCardio && block.title === 'Cardio' ? item.minutes + 4 : item.minutes,
      exId: place === 'home' && item.home ? item.home : item.id,
    }));
    return { title: block.title, rounds, items };
  });
}

export const itemsOf = (routine, place, rampUp) => blocksOf(routine, place, rampUp).flatMap(b => b.items);
