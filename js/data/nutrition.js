// Daily nutrition checklist: no calorie counting, just 5 habits that add up to ~1,900 kcal and ~100 g protein.
// Sources: NASEM/IOM lactation DRI (+330–500 kcal), Lovelady 2000, CDC maternal diet, KellyMom.

export const WATER_GOAL = 12; // glasses of 250 mL ≈ 3 L (lactation AI 3.8 L total water, dry Utah climate)

export const HABITS = [
  { id: 'protein', name: 'Proteína en cada comida', help: 'Una porción del tamaño de tu palma: huevo, pollo, carne, pescado, yogur griego o frijoles.',
    slots: ['Desayuno', 'Almuerzo', 'Cena'] },
  { id: 'veg', name: 'Medio plato de verduras', help: 'En el almuerzo y la cena, llena la mitad del plato con verduras o fruta.',
    slots: ['Almuerzo', 'Cena'] },
  { id: 'vitamin', name: 'Tu vitamina', help: 'Prenatal con yodo. Sigue tomándola mientras amamantas.', slots: ['La tomé'] },
  { id: 'steps', name: 'Pasos del día', help: 'Caminar con el bebé también cuenta. Míralo en la app Salud del iPhone.', slots: ['Llegué a la meta'] },
];

export const PLATE_GUIDE = [
  'Medio plato de verduras o fruta.',
  'Un cuarto de proteína (del tamaño de tu palma).',
  'Un cuarto de almidón (lo que cabe en tu mano ahuecada): arroz, papa, tortilla o pan.',
  'Un poco de grasa sana, como un pulgar: aceite de oliva, aguacate o frutos secos.',
  'Tres comidas y dos meriendas al día. No te saltes comidas: comer muy poco puede bajar la leche.',
];
