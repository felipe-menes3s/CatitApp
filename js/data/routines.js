// Weekly plan: 5 days × ~40 min. Warm-up 5 · strength 20-25 · cardio 10 · stretch 3.
// `home` = exercise to use instead when she trains at home (dumbbells, ball, step, mat).

const WARMUP_LEGS = [
  { id: 'walk_easy', reps: '5 min', home: 'march' },
  { id: 'hip_circles', reps: '10 por lado' },
  { id: 'cat_cow', reps: '8 veces' },
];

const WARMUP_UPPER = [
  { id: 'walk_easy', reps: '5 min', home: 'march' },
  { id: 'arm_circles', reps: '30 segundos' },
  { id: 'cat_cow', reps: '8 veces' },
];

export const ROUTINES = [
  {
    id: 'legs_a', day: 1, name: 'Pierna y glúteo', focus: 'Sentadillas y step', minutes: 40,
    blocks: [
      { title: 'Calentamiento', items: WARMUP_LEGS },
      { title: 'Fuerza', items: [
        { id: 'goblet_squat', sets: 3, reps: 12 },
        { id: 'split_squat', sets: 3, reps: 10, perSide: true },
        { id: 'step_up', sets: 3, reps: 10, perSide: true },
        { id: 'glute_bridge', sets: 3, reps: 15 },
        { id: 'side_plank', sets: 3, reps: 20, perSide: true },
      ] },
      { title: 'Cardio', items: [{ id: 'incline_walk', reps: '10 min', home: 'step_cardio' }] },
      { title: 'Estirar', items: [
        { id: 'quad_stretch', reps: '30 s por lado' },
        { id: 'glute_stretch', reps: '30 s por lado' },
        { id: 'hip_flexor_stretch', reps: '30 s por lado' },
      ] },
    ],
  },
  {
    id: 'posture', day: 2, name: 'Postura y abdomen', focus: 'Espalda alta y centro', minutes: 40,
    blocks: [
      { title: 'Calentamiento', items: WARMUP_UPPER },
      { title: 'Fuerza', items: [
        { id: 'db_row', sets: 3, reps: 12, perSide: true },
        { id: 'incline_pushup', sets: 3, reps: 10 },
        { id: 'seated_press', sets: 3, reps: 10 },
        { id: 'lateral_raise', sets: 3, reps: 12 },
        { id: 'bird_dog', sets: 3, reps: 8, perSide: true },
        { id: 'dead_bug', sets: 3, reps: 8, perSide: true },
      ] },
      { title: 'Cardio', items: [{ id: 'stairmaster', reps: '10 min', home: 'step_cardio' }] },
      { title: 'Estirar', items: [
        { id: 'hip_flexor_stretch', reps: '30 s por lado' },
        { id: 'glute_stretch', reps: '30 s por lado' },
      ] },
    ],
  },
  {
    id: 'legs_b', day: 3, name: 'Glúteo', focus: 'Puentes y sentadilla', minutes: 40,
    blocks: [
      { title: 'Calentamiento', items: WARMUP_LEGS },
      { title: 'Fuerza', items: [
        { id: 'bench_bridge', sets: 4, reps: 12 },
        { id: 'bench_squat', sets: 3, reps: 12 },
        { id: 'bulgarian', sets: 3, reps: 8, perSide: true },
        { id: 'bridge_march', sets: 3, reps: 10, perSide: true },
        { id: 'calf_raise', sets: 3, reps: 15 },
        { id: 'dead_bug', sets: 3, reps: 8, perSide: true },
      ] },
      { title: 'Cardio', items: [{ id: 'incline_walk', reps: '10 min', home: 'step_cardio' }] },
      { title: 'Estirar', items: [
        { id: 'glute_stretch', reps: '30 s por lado' },
        { id: 'hip_flexor_stretch', reps: '30 s por lado' },
        { id: 'calf_stretch', reps: '30 s por lado' },
      ] },
    ],
  },
  {
    id: 'cardio_core', day: 4, name: 'Cardio y abdomen', focus: 'Caminata larga', minutes: 40,
    blocks: [
      { title: 'Calentamiento', items: [{ id: 'walk_easy', reps: '5 min', home: 'march' }, { id: 'cat_cow', reps: '8 veces' }] },
      { title: 'Cardio', items: [{ id: 'incline_walk', reps: '20 min', home: 'step_cardio' }] },
      { title: 'Abdomen', items: [
        { id: 'bird_dog', sets: 2, reps: 8, perSide: true },
        { id: 'dead_bug', sets: 2, reps: 8, perSide: true },
        { id: 'side_plank', sets: 2, reps: 20, perSide: true },
        { id: 'glute_bridge', sets: 2, reps: 15 },
      ] },
      { title: 'Estirar', items: [
        { id: 'hip_flexor_stretch', reps: '30 s por lado' },
        { id: 'glute_stretch', reps: '30 s por lado' },
      ] },
    ],
  },
  {
    id: 'full_body', day: 5, name: 'Cuerpo completo', focus: 'Un poco de todo', minutes: 40,
    blocks: [
      { title: 'Calentamiento', items: [{ id: 'walk_easy', reps: '5 min', home: 'march' }, { id: 'hip_circles', reps: '10 por lado' }, { id: 'arm_circles', reps: '30 segundos' }] },
      { title: 'Fuerza', items: [
        { id: 'goblet_squat', sets: 3, reps: 12 },
        { id: 'db_row', sets: 3, reps: 12, perSide: true },
        { id: 'step_up', sets: 3, reps: 10, perSide: true },
        { id: 'glute_bridge', sets: 3, reps: 15 },
        { id: 'incline_pushup', sets: 3, reps: 10 },
        { id: 'side_plank', sets: 3, reps: 20, perSide: true },
      ] },
      { title: 'Cardio', items: [{ id: 'stairmaster', reps: '10 min', home: 'step_cardio' }] },
      { title: 'Estirar', items: [
        { id: 'quad_stretch', reps: '30 s por lado' },
        { id: 'glute_stretch', reps: '30 s por lado' },
        { id: 'calf_stretch', reps: '30 s por lado' },
      ] },
    ],
  },
];

export const routineById = id => ROUTINES.find(r => r.id === id);
export const routineForDay = date => ROUTINES.find(r => r.day === date.getDay()) || null;

// Each item gets a stable key (block + position), so the same exercise twice in one day is tracked separately.
export function itemsOf(routine, place) {
  return routine.blocks.flatMap((block, b) => block.items.map((item, i) => ({
    ...item,
    key: `${b}-${i}`,
    block: block.title,
    exId: place === 'home' && item.home ? item.home : item.id,
  })));
}
