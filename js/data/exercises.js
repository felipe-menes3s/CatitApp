// Exercise catalog. GIFs live in gifs/<id>.gif (or gifs/<gif>.gif when `gif` is set).
// Every GIF was checked by eye: it must show THIS exercise, never a variant with weight on the back.
// Exercises with no matching GIF (gif: null) show a soft placeholder and the video link.
//
// Back rules (lumbar disc): no running or jumping, no crunches or sit-ups,
// no twists with weight, no weight resting on the back, no deadlifts or good mornings.
//
// kind: 'strength' = sets with reps (and weight when load: true) · 'time' = sets held in seconds
//       'simple'   = one check (warm-up, cardio, stretch)

export const EXERCISES = {
  // ---- Warm-up
  walk_easy:      { name: 'Caminata suave', kind: 'simple', gif: 'incline_walk', tip: 'Cinta sin inclinación o muy poca, ritmo cómodo para entrar en calor.' },
  march:          { name: 'Marcha en el lugar', kind: 'simple', gif: null, tip: 'Sube las rodillas a la altura de la cadera, sin saltar.' },
  cat_cow:        { name: 'Gato-vaca', kind: 'simple', tip: 'Movimiento suave y lento. Si molesta la espalda baja, achica el rango.' },
  hip_circles:    { name: 'Círculos de cadera', kind: 'simple', tip: 'Manos en la cintura, círculos amplios hacia ambos lados.' },
  arm_circles:    { name: 'Círculos de hombros', kind: 'simple', tip: 'Brazos estirados, círculos chicos que se agrandan. Hacia adelante y hacia atrás.' },

  // ---- Legs and glutes
  goblet_squat:   { name: 'Sentadilla goblet', kind: 'strength', load: true, tip: 'La mancuerna pegada al pecho. Pecho arriba, baja como a sentarte. El peso NO va en la espalda.' },
  bench_squat:    { name: 'Sentadilla al banco', kind: 'strength', load: true, tip: 'Una mancuerna en cada mano. Baja hasta rozar el banco (o una silla) y sube. Pecho arriba.' },
  split_squat:    { name: 'Zancada estática', kind: 'strength', load: true, tip: 'Un pie adelante y otro atrás. Baja recto, como un ascensor. Sin dar pasos ni saltos.' },
  bulgarian:      { name: 'Sentadilla búlgara', kind: 'strength', load: true, tip: 'Pie de atrás sobre el banco o el step. Tronco derecho. Empieza sin peso.' },
  step_up:        { name: 'Subida al step', kind: 'strength', load: true, tip: 'Empuja con el talón de la pierna que sube. Baja despacio, sin saltar.' },
  glute_bridge:   { name: 'Puente de glúteos', kind: 'strength', load: true, tip: 'Mancuerna sobre la cadera. Aprieta glúteos arriba, sin arquear la espalda baja.' },
  bench_bridge:   { name: 'Puente con pies en el banco', kind: 'strength', tip: 'Talones sobre el banco (o el sofá en casa). Sube la cadera apretando glúteos y baja lento.' },
  bridge_march:   { name: 'Puente con marcha', kind: 'strength', tip: 'Cadera arriba y quieta. Levanta un pie, luego el otro, sin que la cadera se caiga.' },
  calf_raise:     { name: 'Elevación de talones', kind: 'strength', load: true, tip: 'Puntas sobre el step. Sube en puntas y baja lento. Puedes apoyarte en la pared.' },

  // ---- Posture (upper body, light weight)
  db_row:         { name: 'Remo con mancuerna', kind: 'strength', load: true, tip: 'Una mano y una rodilla en el banco, espalda plana. Lleva el codo hacia la cadera.' },
  incline_pushup: { name: 'Flexiones inclinadas', kind: 'strength', tip: 'Manos en el banco o el step, cuerpo recto como una tabla. Si cuesta, hazlas contra la pared.' },
  seated_press:   { name: 'Press de hombros sentada', kind: 'strength', load: true, tip: 'Sentada con la espalda apoyada. Peso liviano. Sin arquear la espalda baja.' },
  lateral_raise:  { name: 'Elevaciones laterales', kind: 'strength', load: true, tip: 'Peso muy liviano. Sube hasta la altura de los hombros, lento.' },

  // ---- Core that protects the back
  bird_dog:       { name: 'Bird-dog', kind: 'strength', gif: null, tip: 'En cuatro apoyos, estira brazo y pierna contrarios. La espalda no se mueve. 3 segundos arriba.' },
  dead_bug:       { name: 'Dead bug', kind: 'strength', tip: 'Espalda baja pegada al suelo todo el tiempo. Baja brazo y pierna contrarios, lento.' },
  side_plank:     { name: 'Plancha lateral', kind: 'time', tip: 'Codo bajo el hombro. Con las rodillas dobladas es más fácil. Por cada lado.' },

  // ---- Cardio (low impact)
  incline_walk:   { name: 'Caminata en pendiente', kind: 'simple', tip: 'Cinta con inclinación, ritmo en que puedas hablar. Sin agarrarte de la barra.' },
  stairmaster:    { name: 'Escaladora', kind: 'simple', tip: 'Ritmo constante, espalda derecha. Sin apoyar el peso en los brazos.' },
  step_cardio:    { name: 'Step continuo', kind: 'simple', gif: 'step_up', tip: 'Sube y baja del step sin parar, a buen ritmo y sin peso. Cambia la pierna que empieza cada minuto.' },

  // ---- Stretches (no rounding the low back)
  hip_flexor_stretch: { name: 'Estiramiento de cadera', kind: 'simple', tip: 'Rodilla de atrás en el suelo y la pelota bajo la pierna de adelante. Empuja la cadera adelante. 30 s por lado.' },
  glute_stretch:  { name: 'Estiramiento de glúteo', kind: 'simple', tip: 'Sentada, cruza un tobillo sobre la rodilla contraria. Espalda derecha. 30 s por lado.' },
  quad_stretch:   { name: 'Estiramiento de cuádriceps', kind: 'simple', tip: 'Acostada de lado, lleva el talón de arriba al glúteo. 30 s por lado.' },
  calf_stretch:   { name: 'Estiramiento de pantorrilla', kind: 'simple', tip: 'Manos en la pared, pierna de atrás estirada y talón en el suelo. 30 s por lado.' },
};

export function gifFor(id) {
  const ex = EXERCISES[id];
  if (ex?.gif === null) return null;
  return `gifs/${ex?.gif || id}.gif`;
}

export function videoSearchUrl(id) {
  const query = `${EXERCISES[id].name} técnica`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
