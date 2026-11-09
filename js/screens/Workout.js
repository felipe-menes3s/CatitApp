// "Entrenar": today's routine, gym or home, with rounds she can check off.
import { html, useState, useEffect } from '../lib.js';
import { EXERCISES, videoSearchUrl } from '../data/exercises.js';
import { routineById, blocksOf } from '../data/routines.js';
import { loadLastWeights, parseWeight, convertWeight } from '../storage.js';
import { isItemDone, progressOf, prescription, targetOf, reachedTopOfRange } from '../session.js';
import { Gif, Icon, Segmented } from '../ui.js';

const PLACES = [{ id: 'gym', name: 'Gimnasio' }, { id: 'home', name: 'Casa' }];

function SetRow({ index, set, ex, unit, lastWeight, onChange }) {
  const timed = ex.kind === 'time';
  return html`<div class=${'set-row' + (set.ok ? ' ok' : '')}>
    <span class="set-n">${index + 1}</span>
    ${ex.load && html`<label class="field">
      <input inputmode="decimal" placeholder=${lastWeight ?? '–'} value=${set.w ?? ''}
        onChange=${e => onChange({ ...set, w: e.target.value })} />
      <span>${unit}</span>
    </label>`}
    <label class="field">
      <input inputmode="numeric" value=${set.r ?? ''} onChange=${e => onChange({ ...set, r: e.target.value })} />
      <span>${timed ? 'seg' : 'rep'}</span>
    </label>
    <button class="check" aria-label="Vuelta hecha" onClick=${() => onChange({ ...set, ok: !set.ok })}>
      <${Icon} name="check" size=${18} />
    </button>
  </div>`;
}

function ExerciseCard({ item, state, unit, lastWeight, readyToProgress, onUpdate }) {
  const [open, setOpen] = useState(false);
  const ex = EXERCISES[item.exId];
  const done = isItemDone(item, state);

  const sets = Array.from({ length: item.sets }, (_, i) =>
    state?.sets?.[i] || { w: '', r: String(targetOf(item)), ok: false });

  function updateSet(i, next) {
    // Checking a round (the tap itself) with no weight typed means "same as last time".
    const justChecked = next.ok && !sets[i].ok;
    if (justChecked && ex.load && !parseWeight(next.w) && lastWeight != null) next = { ...next, w: String(lastWeight) };
    const all = sets.map((s, j) => (j === i ? next : s));
    const weight = ex.load && next.ok ? parseWeight(next.w) : null;
    const complete = all.filter(s => s.ok).length >= item.sets;
    onUpdate({ ...state, sets: all }, weight, complete ? reachedTopOfRange(item, all) : undefined);
  }

  return html`<div class=${'card exercise' + (done ? ' done' : '')}>
    <button class="exercise-head" onClick=${() => setOpen(!open)}>
      <${Gif} id=${item.exId} size=${64} />
      <span class="grow">
        <span class="ex-name">${ex.name}</span>
        <span class="muted small">${prescription(item)}</span>
      </span>
      ${done ? html`<span class="chip">Listo</span>` : html`<span class=${'chev' + (open ? ' open' : '')}><${Icon} name="chevron" size=${18} /></span>`}
    </button>

    ${open && html`<div class="exercise-body">
      <div class="gif-large"><${Gif} id=${item.exId} size=${200} /></div>
      <p class="tip">${ex.tip}</p>
      ${readyToProgress && ex.load && html`<p class="chip progress-chip">La vez pasada completaste todo: hoy prueba con un poco más de peso.</p>`}
      ${item.note && html`<p class="tip muted">${item.note}</p>`}
      ${ex.kind === 'simple'
        ? html`<button class=${'btn' + (state?.ok ? ' soft' : '')} onClick=${() => onUpdate({ ...state, ok: !state?.ok })}>
            ${state?.ok ? 'Hecho' : 'Marcar como hecho'}</button>`
        : sets.map((s, i) => html`<${SetRow} key=${i} index=${i} set=${s} ex=${ex} unit=${unit}
            lastWeight=${lastWeight} onChange=${next => updateSet(i, next)} />`)}
      <a class="link" href=${videoSearchUrl(item.exId)} target="_blank" rel="noopener">
        <${Icon} name="video" size=${16} /> Ver un video</a>
    </div>`}
  </div>`;
}

function BlockHint({ block }) {
  if (!block.rounds || block.rounds < 2) return null;
  return html`<p class="muted small block-hint">
    Haz los ejercicios seguidos y repite ${block.rounds} vueltas. Descansa 15 s entre ejercicios y 45 s entre vueltas.
  </p>`;
}

// Last weight for this exercise, shown in the unit she uses now.
function lastWeightIn(lastWeights, exId, unit) {
  const saved = lastWeights[exId];
  if (!saved || !Number.isFinite(saved.value)) return null;
  return convertWeight(saved.value, saved.unit, unit);
}

export function Workout({ session, settings, ready, onChange, onFinish, onReopen }) {
  const [lastWeights, setLastWeights] = useState(loadLastWeights);
  const [confirming, setConfirming] = useState(false);

  // The "tap again to finish" question expires, so a stray tap later does not end the workout.
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(timer);
  }, [confirming]);
  const routine = routineById(session.routineId);
  const blocks = blocksOf(routine, session.place, session.rampUp);
  const { done, total } = progressOf(session);

  function updateItem(key, exId, state, weight, topOfRange) {
    if (weight) setLastWeights({ ...lastWeights, [exId]: { value: weight, unit: settings.unit } });
    onChange({ ...session, items: { ...session.items, [key]: state } }, { exId, weight, topOfRange });
  }

  // Finishing with exercises left asks once more, inside the app (no browser pop-ups).
  function finish() {
    if (done < total && !confirming) { setConfirming(true); return; }
    setConfirming(false);
    onFinish();
  }

  return html`<div class="screen-body fade-in">
    <header>
      <div class="eyebrow">${session.rampUp ? 'Adaptación · ' : ''}${done} de ${total} listos</div>
      <h1>${routine.name}</h1>
    </header>
    <${Segmented} options=${PLACES} value=${session.place} onChange=${place => onChange({ ...session, place })} />

    ${blocks.map(block => html`<section key=${block.title}>
      <h2>${block.title}${block.rounds > 1 ? ` · ${block.rounds} vueltas` : ''}</h2>
      <${BlockHint} block=${block} />
      ${block.items.map(item => html`<${ExerciseCard} key=${item.key + item.exId}
        item=${item} state=${session.items[item.key]} unit=${settings.unit}
        lastWeight=${lastWeightIn(lastWeights, item.exId, settings.unit)} readyToProgress=${!!ready[item.exId]}
        onUpdate=${(state, weight, top) => updateItem(item.key, item.exId, state, weight, top)} />`)}
    </section>`)}

    ${session.finishedAt
      ? html`<div class="card finish-card"><${Icon} name="heart" size=${28} fill=${true} />
          <div class="today-name">¡Lo lograste, ${settings.name || 'Catita'}!</div>
          <p class="muted">Un día más cuidándote. Toma agua y descansa.</p>
          <button class="link" onClick=${onReopen}>Reabrir</button></div>`
      : html`<button class="btn" onClick=${finish}>
          ${confirming ? `Te faltan ${total - done}. ¿Terminar igual? Toca de nuevo` : 'Terminar entrenamiento'}</button>`}
  </div>`;
}
