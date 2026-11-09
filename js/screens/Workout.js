// "Entrenar": today's routine, gym or home, with sets she can check off.
import { html, useState } from '../lib.js';
import { EXERCISES, videoSearchUrl } from '../data/exercises.js';
import { routineById, itemsOf } from '../data/routines.js';
import { loadLastWeights } from '../storage.js';
import { isItemDone, progressOf, prescription } from '../session.js';
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
    <button class="check" aria-label="Serie hecha" onClick=${() => onChange({ ...set, ok: !set.ok })}>
      <${Icon} name="check" size=${18} />
    </button>
  </div>`;
}

function ExerciseCard({ item, state, unit, lastWeight, onUpdate }) {
  const [open, setOpen] = useState(false);
  const ex = EXERCISES[item.exId];
  const done = isItemDone(item, state);

  const sets = Array.from({ length: item.sets || 0 }, (_, i) =>
    state?.sets?.[i] || { w: '', r: String(item.reps), ok: false });

  function updateSet(i, next) {
    // Checking a set with no weight typed means "same as last time".
    if (next.ok && ex.load && !next.w && lastWeight != null) next = { ...next, w: String(lastWeight) };
    const all = sets.map((s, j) => (j === i ? next : s));
    onUpdate({ ...state, sets: all }, ex.load && next.ok && next.w ? next.w : null);
  }

  return html`<div class=${'card exercise' + (done ? ' done' : '')}>
    <button class="exercise-head" onClick=${() => setOpen(!open)}>
      <${Gif} id=${item.exId} size=${64} />
      <span class="grow">
        <span class="ex-name">${ex.name}</span>
        <span class="muted small">${prescription(item)}</span>
      </span>
      ${done ? html`<span class="chip">Lista</span>` : html`<span class=${'chev' + (open ? ' open' : '')}><${Icon} name="chevron" size=${18} /></span>`}
    </button>

    ${open && html`<div class="exercise-body">
      <div class="gif-large"><${Gif} id=${item.exId} size=${200} /></div>
      <p class="tip">${ex.tip}</p>
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

export function Workout({ session, settings, onChange, onFinish }) {
  const [lastWeights, setLastWeights] = useState(loadLastWeights);
  const routine = routineById(session.routineId);
  const items = itemsOf(routine, session.place);
  const { done, total } = progressOf(session);
  const blocks = [...new Set(items.map(i => i.block))];

  function updateItem(key, exId, state, weight) {
    if (weight) setLastWeights({ ...lastWeights, [exId]: Number(weight) });
    onChange({ ...session, items: { ...session.items, [key]: state } }, weight ? { exId, weight: Number(weight) } : null);
  }

  return html`<div class="screen-body fade-in">
    <header>
      <div class="eyebrow">${done} de ${total} listos</div>
      <h1>${routine.name}</h1>
    </header>
    <${Segmented} options=${PLACES} value=${session.place} onChange=${place => onChange({ ...session, place })} />

    ${blocks.map(block => html`<section key=${block}>
      <h2>${block}</h2>
      ${items.filter(i => i.block === block).map(item => html`<${ExerciseCard} key=${item.key + item.exId}
        item=${item} state=${session.items[item.key]} unit=${settings.unit}
        lastWeight=${lastWeights[item.exId]}
        onUpdate=${(state, weight) => updateItem(item.key, item.exId, state, weight)} />`)}
    </section>`)}

    ${session.finishedAt
      ? html`<div class="card finish-card"><${Icon} name="heart" size=${28} fill=${true} />
          <div class="today-name">¡Lo lograste, ${settings.name || 'Catita'}!</div>
          <p class="muted">Un día más cuidándote. Toma agua y descansa.</p></div>`
      : html`<button class="btn" onClick=${onFinish}>Terminar entrenamiento</button>`}
  </div>`;
}
