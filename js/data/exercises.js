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
  walk_easy:      { name: 'Caminata suave', kind: 'simple', gif: 'walk_easy.jpg', tip: 'Cinta plana o con poca inclinación. Camina erguida, sin prisa y sin agarrarte de la barra: así preparas la espalda.' },
  pelvic_breath:  { name: 'Respiración y suelo pélvico', kind: 'simple', gif: 'pelvic_breath.png', tip: 'Acostada boca arriba con las rodillas dobladas. Al soltar el aire, aprieta suave el suelo pélvico (como para aguantar el pipí) y el abdomen bajo. Al tomar aire, suéltalo del todo.' },
  march:          { name: 'Marcha rápida', kind: 'simple', tip: 'Manos apoyadas en la pared. Sube una rodilla y luego la otra hasta la cadera, sin saltar. Abdomen firme y espalda larga.' },
  hip_circles:    { name: 'Círculos de cadera', kind: 'simple', tip: 'Manos en la cintura, círculos lentos. Se mueve la cadera; la espalda baja se queda tranquila.' },
  arm_circles:    { name: 'Apertura de brazos', kind: 'simple', tip: 'Brazos a la altura de los hombros. Abre y cierra sin arquear la espalda baja.' },
  // ---- Legs and glutes
  goblet_squat:   { name: 'Sentadilla goblet', kind: 'strength', load: true, tip: 'Mancuerna pegada al pecho, pecho arriba. Baja solo hasta tocar el banco (en casa, una silla), sin redondear la espalda baja.' },
  bench_squat:    { name: 'Sentadilla al banco', kind: 'strength', load: true, tip: 'Una mancuerna en cada mano. Toca el banco (en casa, una silla) con los glúteos y sube. No te dejes caer ni redondees la espalda.' },
  split_squat:    { name: 'Zancada estática', kind: 'strength', load: true, tip: 'Tronco derecho, baja recto como un ascensor. El abdomen firme evita que la espalda se arquee.' },
  glute_bridge:   { name: 'Puente de glúteos', kind: 'strength', tip: 'Rodillas dobladas, pies apoyados. Sube apretando glúteos hasta quedar en línea recta y baja lento. No subas más arqueando la espalda.' },
  bench_bridge:   { name: 'Puente con pies en el banco', kind: 'strength', tip: 'Talones en el banco (en casa, el sofá). Sube con los glúteos y baja lento, con las costillas abajo.' },
  // ---- Posture (light, framed as carrying the baby)
  db_row:         { name: 'Remo con mancuerna', kind: 'strength', load: true, tip: 'Mano y rodilla del mismo lado sobre el banco (en casa, una silla firme), el otro pie en el suelo. Espalda plana; lleva el codo hacia la cadera sin girar el tronco.' },
  incline_pushup: { name: 'Flexiones inclinadas', kind: 'strength', tip: 'Manos en el banco o en una mesa firme, cuerpo recto como una tabla. Si la cadera se cae, hazlas apoyada en la pared.' },
  rear_delt_side: { name: 'Apertura lateral acostada', kind: 'strength', load: true, tip: 'Acostada de lado, mancuerna ligera. Abre el brazo hacia el techo apretando la espalda alta. La espalda baja no se mueve.' },
  farmer_carry:   { name: 'Paseo con mancuernas', kind: 'time', load: true, tip: 'Una mancuerna en cada mano. Camina erguida, como si cargaras al bebé. Hombros atrás, sin inclinarte a ningún lado.' },
  // ---- Core that protects the back (McGill Big 3 + dead bug)
  curl_up:        { name: 'Curl-up de McGill', kind: 'strength', tip: 'Manos bajo la espalda baja y una rodilla doblada. Despega solo la cabeza y los hombros unos centímetros. Si el centro del abdomen se abulta, sube menos.' },
  bird_dog:       { name: 'Bird-dog', kind: 'strength', gif: 'bird_dog.jpg', tip: 'En cuatro apoyos, estira brazo y pierna contrarios hasta la altura del tronco, no más arriba. La espalda no se mueve.' },
  side_plank:     { name: 'Plancha lateral', kind: 'time', tip: 'Antebrazo en el banco (en casa, el sofá), codo bajo el hombro, cuerpo recto de la cabeza a los pies. Cuando sea fácil, apoya el codo en el suelo.' },
  dead_bug:       { name: 'Dead bug', kind: 'strength', tip: 'Mantén la curva natural de la espalda baja: que no se arquee al bajar la pierna. Baja brazo y pierna contrarios, lento.' },
  // ---- Cardio (low impact)
  incline_walk:   { name: 'Caminata en pendiente', kind: 'simple', tip: 'Inclinación y ritmo en que puedas hablar. Sin agarrarte de la barra: así la espalda trabaja derecha.' },
  stairmaster:    { name: 'Escaladora', kind: 'simple', tip: 'Pasos completos y tronco erguido. Manos solo apoyadas, sin colgarte de la barra.' },
  // ---- Stretches (never bending the low back forward)
  hip_flexor_stretch:  { name: 'Estiramiento de cadera', kind: 'simple', tip: 'Rodilla de atrás en el suelo (o apoyada en la pelota). Aprieta el glúteo de atrás antes de ir adelante, para no arquear la espalda.' },
  quad_stretch:   { name: 'Estiramiento de cuádriceps', kind: 'simple', tip: 'Acostada de lado, toma el tobillo con la mano y lleva el talón al glúteo, sin arquear la espalda baja.' },
  calf_stretch:   { name: 'Estiramiento de pantorrilla', kind: 'simple', tip: 'Manos en la pared, talón de atrás en el suelo. Espalda recta.' },
};

// `gif` may be another exercise's id (reuses its GIF) or a file name with extension (photos: .jpg/.png).
export function gifFor(id) {
  const ex = EXERCISES[id];
  if (ex?.gif === null) return null;
  const name = ex?.gif || id;
  return name.includes('.') ? `gifs/${name}` : `gifs/${name}.gif`;
}

export function videoSearchUrl(id) {
  const query = `${EXERCISES[id].name} técnica`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
