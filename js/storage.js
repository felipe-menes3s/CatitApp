// Everything is saved only on the phone (localStorage). Nothing goes to a server.
const PREFIX = 'catita:';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Never let a full or blocked storage break a tap: the app keeps working in memory.
function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('CatitApp: could not save', key, err);
  }
}

// Ask the browser not to delete our data when the phone needs space.
export function askPersistentStorage() {
  navigator.storage?.persist?.().catch(() => {});
}

// ---- Dates (local time, not UTC, so a 6 AM workout is never saved on the wrong day)
export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function mondayOf(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - offset);
  return d;
}

// ---- Settings
// goalKg / idealKg: her targets (56 and 54 kg). stepsGoal starts low and grows (trainer: +1,000 a week up to 8,000).
export const DEFAULT_SETTINGS = { name: 'Catita', palette: 'arena', mode: 'auto', unit: 'lb', goalKg: 56, idealKg: 54, stepsGoal: 6000 };

export function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...read('settings', {}) };
}

export function saveSettings(settings) {
  write('settings', settings);
}

// ---- Workout sessions, one per day
// { routineId, place: 'gym' | 'home', rampUp, items: { [itemKey]: { sets: [{ w, r, ok }], ok } }, finishedAt }
export function loadSession(day) {
  return read(`session:${day}`, null);
}

export function saveSession(day, session) {
  write(`session:${day}`, session);
}

// Every saved workout day (used to count finished workouts for the ramp-up).
export function loadAllSessions() {
  const sessions = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX + 'session:')) sessions.push(read(key.slice(PREFIX.length), null));
  }
  return sessions.filter(Boolean);
}

// "6.000": Spanish thousands separator (toLocaleString('es') skips it for 4-digit numbers).
export const formatInt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---- Weights. Accepts "12,5" (Spanish keyboards) and "12.5". Returns null when not a number.
export function parseWeight(text) {
  const clean = String(text ?? '').trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(clean)) return null; // rejects "68abc" and "1.2.3"
  const value = parseFloat(clean);
  return value > 0 ? value : null;
}

const LB_PER_KG = 2.20462;

export function convertWeight(value, from, to) {
  if (from === to) return value;
  const converted = from === 'kg' ? value * LB_PER_KG : value / LB_PER_KG;
  return Math.round(converted * 2) / 2; // nearest 0.5
}

// Last weight per exercise, with its unit: { [exerciseId]: { value, unit } }
export function loadLastWeights() {
  return read('lastWeights', {});
}

export function saveLastWeight(exerciseId, value, unit) {
  const all = loadLastWeights();
  all[exerciseId] = { value, unit };
  write('lastWeights', all);
}

// Exercises where she reached the top of the rep range in every round last time.
export function loadReadyToProgress() {
  return read('readyToProgress', {});
}

export function saveReadyToProgress(exerciseId, ready) {
  const all = loadReadyToProgress();
  if (ready) all[exerciseId] = true; else delete all[exerciseId];
  write('readyToProgress', all);
}

// ---- Daily habits: { protein: [bool×3], veg: [bool×2], vitamin: [bool], steps: [bool], water: number }
export function loadDayLog(day) {
  return read(`day:${day}`, {});
}

export function saveDayLog(day, log) {
  write(`day:${day}`, log);
}

// ---- Weekly weigh-ins: [{ date, kg, diapersOk, supplyDown }], one per week (a new one in the same week replaces it).
export function loadWeights() {
  return read('weights', []);
}

export function saveWeighIn(entry) {
  const sameWeek = e => mondayOf(new Date(e.date + 'T12:00')).getTime() === mondayOf(new Date(entry.date + 'T12:00')).getTime();
  const others = loadWeights().filter(e => !sameWeek(e));
  write('weights', [...others, entry].sort((a, b) => a.date.localeCompare(b.date)));
}

export function deleteWeighIn(date) {
  write('weights', loadWeights().filter(e => e.date !== date));
}
