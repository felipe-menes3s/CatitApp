// Rules for a day's workout: what counts as done, how far along she is, and the ramp-up.
import { EXERCISES } from './data/exercises.js';
import { routineById, itemsOf } from './data/routines.js';
import { loadAllSessions } from './storage.js';

// Her first 10 finished workouts (two real weeks) are the adaptation period.
// Counted by workouts done, not by calendar, so a late-week start or a sick week does not cut it short.
export const RAMP_UP_WORKOUTS = 10;

export function newSession(routineId, place = 'gym', rampUp = false) {
  return { routineId, place, rampUp, items: {}, finishedAt: null };
}

// A saved session is only usable if its routine still exists and its shape is right (ids can change in updates).
export function isValidSession(session) {
  const routine = session && routineById(session.routineId);
  return !!routine && !!session.items && typeof session.items === 'object'
    && itemsOf(routine, session.place, session.rampUp).every(i => EXERCISES[i.exId]);
}

// Same definition of "finished" as the week strip: tapped "Terminar" or checked everything.
export function countFinishedWorkouts() {
  return loadAllSessions().filter(s => isValidSession(s) && isFinished(s)).length;
}

export const isInRampUp = () => countFinishedWorkouts() < RAMP_UP_WORKOUTS;

export function isItemDone(item, state) {
  if (!state) return false;
  if (EXERCISES[item.exId].kind === 'simple') return !!state.ok;
  return (state.sets || []).filter(s => s.ok).length >= item.sets;
}

export function progressOf(session) {
  const routine = session && routineById(session.routineId);
  if (!routine) return { done: 0, total: 0 };
  const items = itemsOf(routine, session.place, session.rampUp);
  const done = items.filter(item => isItemDone(item, session.items[item.key])).length;
  return { done, total: items.length };
}

// Finished = she tapped "Terminar", or she checked everything.
export function isFinished(session) {
  if (!session) return false;
  if (session.finishedAt) return true;
  const { done, total } = progressOf(session);
  return total > 0 && done === total;
}

export function hasStarted(session) {
  return !!session && Object.values(session.items || {}).some(s => s.ok || (s.sets || []).some(x => x.ok));
}

// Target reps (or seconds) to pre-fill each round.
export function targetOf(item) {
  if (item.seconds) return item.seconds;
  return Array.isArray(item.reps) ? item.reps[0] : item.reps;
}

// True when every round reached the top of the rep range: next time, a little more weight.
export function reachedTopOfRange(item, sets) {
  if (!Array.isArray(item.reps)) return false;
  return sets.length === item.sets && sets.every(s => s.ok && Number(s.r) >= item.reps[1]);
}

// One-line summary, e.g. "10–12 repeticiones por lado", "15 s por lado", "18 min".
export function prescription(item) {
  if (EXERCISES[item.exId].kind === 'simple') return item.minutes ? `${item.minutes} min` : item.text;
  const side = item.perSide ? ' por lado' : '';
  if (item.seconds) return `${item.seconds} s${side}`;
  const reps = Array.isArray(item.reps) ? `${item.reps[0]}–${item.reps[1]}` : item.reps;
  if (item.hold) return `${reps} repeticiones${side}, aguanta ${item.hold} s cada una`;
  return `${reps} repeticiones${side}`;
}
