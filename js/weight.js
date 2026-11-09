// Body-weight logic: weekly weigh-ins, 3-week trend, pace, projected date and safety advice.
// Targets come from the lactation research (Lovelady 2000, KellyMom): ~0.5 kg/week is safe;
// faster than 0.7 kg/week for 2+ weeks risks milk supply; never eat under ~1,800 kcal.

const DAY_MS = 86400000;
const PLANNED_RATE = { slow: 0.3, fast: 0.5 }; // kg per week, before there is real data

const toDate = key => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); };
// Calendar-day difference in UTC, so the March/November clock change never makes 14 days look like 13.96.
const utcDay = key => { const [y, m, d] = key.split('-').map(Number); return Date.UTC(y, m - 1, d) / DAY_MS; };
const weeksBetween = (a, b) => (utcDay(b) - utcDay(a)) / 7;

// Entries sorted by date, each with `trend` = average of the last (up to) 3 weigh-ins.
export function withTrend(entries) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.map((e, i) => {
    const window = sorted.slice(Math.max(0, i - 2), i + 1);
    return { ...e, trend: window.reduce((sum, x) => sum + x.kg, 0) / window.length };
  });
}

// Weekly loss (kg/week, positive = losing): least-squares slope of the RAW weigh-ins of the last 4 weeks.
// (Comparing smoothed trends under-measures fast loss in the first weeks, exactly when it matters most.)
export function weeklyRate(points) {
  if (points.length < 3) return null;
  const last = points[points.length - 1];
  const recent = points.filter(p => weeksBetween(p.date, last.date) <= 4);
  if (recent.length < 3 || weeksBetween(recent[0].date, last.date) < 2) return null;
  const xs = recent.map(p => weeksBetween(recent[0].date, p.date));
  const ys = recent.map(p => p.kg);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  const num = xs.reduce((sum, x, i) => sum + (x - mx) * (ys[i] - my), 0);
  const den = xs.reduce((sum, x) => sum + (x - mx) ** 2, 0);
  return den ? -num / den : null;
}

// Raw loss (kg/week) over roughly the last `weeks` weeks, from the two weigh-ins that span it.
// Used for SAFETY alerts, so a recent fast drop is never averaged away by older, flat weeks.
function recentRate(points, weeks) {
  if (points.length < 2) return null;
  const last = points[points.length - 1];
  const earlier = [...points].reverse().find(p => weeksBetween(p.date, last.date) >= weeks - 0.43); // ~3 days of slack
  if (!earlier || earlier === last) return null;
  const span = weeksBetween(earlier.date, last.date);
  // Rounded to 0.01 so 0.7000000000000028 is not "over 0.7".
  return span > 0 ? Math.round(((earlier.kg - last.kg) / span) * 100) / 100 : null;
}

// A weigh-in that is probably a typo (wrong unit, extra digit). Returns a question to ask, or null.
export const PLAUSIBLE_KG = { min: 35, max: 200 };
export function suspiciousChange(points, kg) {
  const last = points[points.length - 1];
  if (!last || Math.abs(kg - last.kg) <= 3) return null;
  return Math.abs(kg - last.kg);
}

// Weeks of data since the first weigh-in.
export const weeksTracked = points => (points.length ? weeksBetween(points[0].date, points[points.length - 1].date) : 0);

function addWeeks(date, weeks) {
  return new Date(date.getTime() + weeks * 7 * DAY_MS);
}

const monthYear = date => date.toLocaleDateString('es', { month: 'long', year: 'numeric' });

// "Cerca de abril de 2027" (or a range while there is not enough data yet).
export function projection(points, goalKg, today = new Date()) {
  if (!points.length) return null;
  const current = points[points.length - 1].trend;
  const toLose = current - goalKg;
  if (toLose <= 0) return { reached: true };
  const rate = weeklyRate(points);
  if (rate !== null && rate >= 0.2) {
    // Never project faster than the healthy pace, so the date does not reward losing too fast.
    const pace = Math.min(rate, PLANNED_RATE.fast);
    return { reached: false, text: `cerca de ${monthYear(addWeeks(today, toLose / pace))}` };
  }
  const early = monthYear(addWeeks(today, toLose / PLANNED_RATE.fast));
  const late = monthYear(addWeeks(today, toLose / PLANNED_RATE.slow));
  return { reached: false, text: early === late ? `cerca de ${early}` : `entre ${early} y ${late}` };
}

// The one most important message for this week. tone: 'ok' | 'care' | 'alert'.
export function advice(points) {
  const latest = points[points.length - 1];
  if (!latest) return { tone: 'ok', text: 'Pésate este fin de semana para empezar a ver tu camino.' };

  // Milk and baby come first, before any weight-loss advice.
  if (latest.diapersOk === false) {
    return { tone: 'alert', text: 'Si tu bebé moja menos de 5–6 pañales al día, llama hoy a su pediatra. Esta semana come según tu hambre, sin restringir.' };
  }
  if (latest.supplyDown === true) {
    return { tone: 'alert', text: 'Si sientes que tu leche bajó: esta semana come según tu hambre, sin restringir, toma agua y habla con una consultora de lactancia en estos días.' };
  }

  // Safety first, on the most recent weeks (not the 4-week average).
  const lastWeek = recentRate(points, 1);
  const lastTwoWeeks = recentRate(points, 2);
  if ((lastWeek !== null && lastWeek > 1) || (lastTwoWeeks !== null && lastTwoWeeks > 1)) {
    return { tone: 'alert', text: 'Estás bajando más de 1 kg por semana. Agrega comida (una merienda con proteína) y avísale a tu doctora. Al principio puede ser agua, pero es mejor cuidar tu leche.' };
  }
  if (lastTwoWeeks !== null && lastTwoWeeks > 0.7) {
    return { tone: 'care', text: 'Estás bajando rápido. Agrega una merienda al día, por ejemplo yogur griego con fruta, para cuidar tu leche.' };
  }

  const rate = weeklyRate(points);
  if (rate === null) return { tone: 'ok', text: 'Necesitamos 3 semanas de peso para ver tu tendencia. Las primeras semanas a veces baja más rápido por agua; es normal.' };
  if (rate > 0.5) return { tone: 'ok', text: 'Vas bien, un poco rápido. No te saltes comidas ni meriendas, para cuidar tu leche.' };
  if (rate >= 0.2) return { tone: 'ok', text: 'Vas a un ritmo sano. Sigue así: constancia, no perfección.' };
  if (rate <= -0.2) return { tone: 'care', text: 'Tu peso subió un poco estas semanas. Pasa a veces (agua, ciclo, sueño). Revisa la proteína y las verduras, sin comer de menos.' };
  if (weeksTracked(points) >= 4) {
    return { tone: 'care', text: 'Vas lento, y está bien mientras amamantas. Revisa tus pasos y las porciones, pero no comas menos de lo indicado.' };
  }
  return { tone: 'ok', text: 'Tu peso está estable por ahora. Dale unas semanas más.' };
}
