// Rules for a day's workout: what counts as done and how far along she is.
import { EXERCISES } from './data/exercises.js';
import { routineById, itemsOf } from './data/routines.js';

export function newSession(routineId, place = 'gym') {
  return { routineId, place, items: {}, finishedAt: null };
}

export function isItemDone(item, state) {
  if (!state) return false;
  const kind = EXERCISES[item.exId].kind;
  if (kind === 'simple') return !!state.ok;
  return (state.sets || []).filter(s => s.ok).length >= item.sets;
}

export function progressOf(session) {
  const routine = session && routineById(session.routineId);
  if (!routine) return { done: 0, total: 0 };
  const items = itemsOf(routine, session.place);
  const done = items.filter(item => isItemDone(item, session.items[item.key])).length;
  return { done, total: items.length };
}

export function hasStarted(session) {
  return !!session && Object.values(session.items).some(s => s.ok || (s.sets || []).some(x => x.ok));
}

// Summary line, e.g. "3 series × 12" or "3 × 20 s por lado".
export function prescription(item) {
  const kind = EXERCISES[item.exId].kind;
  if (kind === 'simple') return item.reps;
  const unit = kind === 'time' ? ' s' : '';
  const side = item.perSide ? ' por lado' : '';
  return `${item.sets} series × ${item.reps}${unit}${side}`;
}
