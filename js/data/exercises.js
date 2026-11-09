// Exercise catalog. GIFs live in gifs/<id>.gif (or gifs/<gif>.gif when `gif` is set).
// Every GIF was checked by eye: it must show THIS exercise. gif: null = no correct GIF exists;
// the app shows a soft placeholder and the video link.
//
// Back rules (lumbar disc): no running or jumping, no crunches or sit-ups, no twists with weight,
// no weight resting on the spine, no overhead pressing, no deadlifts, no loaded forward bending.
// She trains at 6 AM, when discs are most hydrated: every day starts walking, never bending.
//
// kind: 'strength' = rounds of reps (load: true when she holds dumbbells; hold = seconds per rep)
//       'time'     = rounds held in seconds
//       'simple'   = one check (warm-up, cardio, stretch)

export const EXERCISES = {
  // ---- Warm-up
  walk_easy:      { name: 'Caminata suave', kind: 'simple', gif: null, tip: 'Cinta plana o con poca inclinación. Camina erguida y sin prisa: así preparas la espalda antes de agacharte.' },
  pelvic_breath:  { name: 'Respiración y suelo pélvico', kind: 'simple', gif: null, tip: 'Acostada boca arriba con las rodillas dobladas. Al soltar el aire, aprieta suave el suelo pélvico (como para aguantar el pipí) y el abdomen bajo. Al tomar aire, suéltalo del todo.' },
  march:          { name: 'Marcha en el lugar', kind: 'simple', gif: null, tip: 'Sube las rodillas hasta la cadera, sin saltar. Abdomen firme y espalda alta.' },
  cat_cow:        { name: 'Gato-vaca suave', kind: 'simple', gif: null, tip: 'En cuatro apoyos, mueve la espalda despacio y solo hasta la mitad del rango. Es para lubricar, no para estirar.' },
  hip_circles:    { name: 'Círculos de cadera', kind: 'simple', tip: 'Manos en la cintura, círculos lentos. Se mueve la cadera; la espalda baja se queda tranquila.' },
  arm_circles:    { name: 'Apertura de brazos', kind: 'simple', tip: 'Brazos a la altura de los hombros. Abre y cierra sin arquear la espalda baja.' },

  // ---- Legs and glutes
  goblet_squat:   { name: 'Sentadilla goblet', kind: 'strength', load: true, tip: 'Mancuerna pegada al pecho, pecho arriba. Baja solo hasta tocar el banco (en casa, una silla), sin redondear la espalda baja.' },
  bench_squat:    { name: 'Sentadilla al banco', kind: 'strength', load: true, tip: 'Una mancuerna en cada mano. Toca el banco (en casa, una silla) con los glúteos y sube. No te dejes caer ni redondees la espalda.' },
  split_squat:    { name: 'Zancada estática', kind: 'strength', load: true, tip: 'Tronco derecho, baja recto como un ascensor. El abdomen firme evita que la espalda se arquee.' },
  step_up:        { name: 'Subida al step', kind: 'strength', load: true, tip: 'Usa un escalón bajo (15 a 25 cm), no un banco alto como en el dibujo. Empuja con el talón de arriba, tronco erguido, y baja despacio.' },
  glute_bridge:   { name: 'Puente de glúteos', kind: 'strength', load: true, tip: 'Con o sin mancuerna sobre la cadera. Sube apretando glúteos hasta quedar en línea recta. No subas más arqueando la espalda.' },
  bench_bridge:   { name: 'Puente con pies en el banco', kind: 'strength', tip: 'Talones en el banco (en casa, el sofá). Sube con los glúteos y baja lento, con las costillas abajo.' },

  // ---- Posture (light, framed as carrying the baby)
  db_row:         { name: 'Remo con mancuerna', kind: 'strength', load: true, tip: 'Una mano en el banco (en casa, una silla) y los pies separados, espalda plana. Lleva el codo a la cadera sin girar el tronco.' },
  incline_pushup: { name: 'Flexiones inclinadas', kind: 'strength', tip: 'Manos en el banco o en una mesa firme, cuerpo recto como una tabla. El step del dibujo es más difícil: si la cadera se cae, sube más las manos.' },
  rear_delt_side: { name: 'Apertura lateral acostada', kind: 'strength', load: true, tip: 'Acostada de lado, mancuerna ligera. Abre el brazo hacia el techo apretando la espalda alta. La espalda baja no se mueve.' },
  farmer_carry:   { name: 'Paseo con mancuernas', kind: 'time', load: true, tip: 'Una mancuerna en cada mano. Camina erguida, como si cargaras al bebé. Hombros atrás, sin inclinarte a ningún lado.' },

  // ---- Core that protects the back (McGill Big 3 + dead bug)
  curl_up:        { name: 'Curl-up de McGill', kind: 'strength', tip: 'Manos bajo la espalda baja y una rodilla doblada. Despega solo la cabeza y los hombros unos centímetros. Si el centro del abdomen se abulta, sube menos.' },
  bird_dog:       { name: 'Bird-dog', kind: 'strength', gif: null, tip: 'En cuatro apoyos, estira brazo y pierna contrarios sin que la espalda se mueva.' },
  side_plank:     { name: 'Plancha lateral', kind: 'time', tip: 'Codo bajo el hombro. Empieza con las rodillas dobladas; cuando sea fácil, con las piernas estiradas como en el dibujo.' },
  dead_bug:       { name: 'Dead bug', kind: 'strength', tip: 'Mantén la curva natural de la espalda baja: que no se arquee al bajar la pierna. Baja brazo y pierna contrarios, lento.' },

  // ---- Cardio (low impact)
  incline_walk:   { name: 'Caminata en pendiente', kind: 'simple', tip: 'Inclinación y ritmo en que puedas hablar. Sin agarrarte de la barra: así la espalda trabaja derecha.' },
  stairmaster:    { name: 'Escaladora', kind: 'simple', tip: 'Pasos completos y tronco erguido. Manos solo apoyadas, sin colgarte de la barra.' },
  step_cardio:    { name: 'Step continuo', kind: 'simple', gif: null, tip: 'Sube y baja del step sin saltar, a buen ritmo y sin peso. Cambia la pierna que empieza cada minuto.' },

  // ---- Stretches (never bending the low back forward)
  hip_flexor_stretch:  { name: 'Estiramiento de cadera', kind: 'simple', tip: 'Rodilla de atrás en el suelo (o apoyada en la pelota). Aprieta el glúteo de atrás antes de ir adelante, para no arquear la espalda.' },
  glute_stretch_lying: { name: 'Estiramiento de glúteo acostada', kind: 'simple', gif: null, tip: 'Boca arriba, cruza un tobillo sobre la rodilla contraria y acerca la pierna. La espalda queda apoyada en el suelo.' },
  quad_stretch:   { name: 'Estiramiento de cuádriceps', kind: 'simple', tip: 'Acostada de lado, toma el tobillo con la mano y lleva el talón al glúteo, sin arquear la espalda baja.' },
  calf_stretch:   { name: 'Estiramiento de pantorrilla', kind: 'simple', tip: 'Manos en la pared, talón de atrás en el suelo. Espalda recta.' },
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
