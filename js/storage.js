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

function write(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
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
export const DEFAULT_SETTINGS = { name: 'Catita', palette: 'arena', mode: 'auto', unit: 'lb' };

export function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...read('settings', {}) };
}

export function saveSettings(settings) {
  write('settings', settings);
}

// ---- Workout sessions, one per day
// { routineId, place: 'gym' | 'home', items: { [itemKey]: { sets: [{ w, r, ok }], ok } }, finishedAt }
export function loadSession(day) {
  return read(`session:${day}`, null);
}

export function saveSession(day, session) {
  write(`session:${day}`, session);
}

// ---- Last weight used per exercise, to suggest it next time
export function loadLastWeights() {
  return read('lastWeights', {});
}

export function saveLastWeight(exerciseId, weight) {
  const all = loadLastWeights();
  all[exerciseId] = weight;
  write('lastWeights', all);
}
