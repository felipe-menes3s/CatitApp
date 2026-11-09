// "Tu día": the low-effort nutrition checklist on the Today screen. One tap per habit, no calorie counting.
import { html, useState } from '../lib.js';
import { HABITS, WATER_GOAL, PLATE_GUIDE } from '../data/nutrition.js';
import { loadDayLog, saveDayLog, formatInt } from '../storage.js';
import { Icon } from '../ui.js';

function slotLabel(habit, slot, settings) {
  if (habit.id === 'steps') return `Llegué a ${formatInt(settings.stepsGoal)}`;
  return slot;
}

function isComplete(log) {
  const habitsDone = HABITS.every(h => h.slots.every((_, i) => log[h.id]?.[i]));
  return habitsDone && (log.water || 0) >= WATER_GOAL;
}

function Water({ count, onAdd, onUndo }) {
  return html`<div class="habit">
    <div class="habit-head">
      <span class="habit-name">Agua</span>
      <span class="habit-count">${count} / ${WATER_GOAL} vasos</span>
    </div>
    <p class="muted small">Un vaso cada vez que amamantas es una buena regla.</p>
    <div class="water-row">
      <div class="water-bar"><span style=${{ width: `${Math.min(100, (count / WATER_GOAL) * 100)}%` }}></span></div>
      <button class="round-btn soft" aria-label="Quitar un vaso" disabled=${count === 0} onClick=${onUndo}>−</button>
      <button class="round-btn" aria-label="Agregar un vaso" onClick=${onAdd}>+</button>
    </div>
  </div>`;
}

export function DayCard({ day, settings }) {
  const [log, setLog] = useState(() => loadDayLog(day));
  const [showPlate, setShowPlate] = useState(false);

  function update(next) {
    setLog(next);
    saveDayLog(day, next);
  }

  function toggle(habitId, i) {
    const current = [...(log[habitId] || [])];
    current[i] = !current[i];
    update({ ...log, [habitId]: current });
  }

  const water = log.water || 0;

  return html`<section>
    <h2>Tu día</h2>
    <div class="card day-card">
      ${HABITS.map(h => html`<div class="habit" key=${h.id}>
        <div class="habit-head"><span class="habit-name">${h.name}</span></div>
        <p class="muted small">${h.help}</p>
        <div class="habit-slots">
          ${h.slots.map((slot, i) => html`<button key=${slot} class=${'slot' + (log[h.id]?.[i] ? ' on' : '')} onClick=${() => toggle(h.id, i)}>
            ${log[h.id]?.[i] && html`<${Icon} name="check" size=${14} />`}${slotLabel(h, slot, settings)}</button>`)}
        </div>
      </div>`)}
      <${Water} count=${water} onAdd=${() => update({ ...log, water: water + 1 })}
        onUndo=${() => update({ ...log, water: Math.max(0, water - 1) })} />

      ${isComplete(log) && html`<p class="day-done">¡Lo lograste hoy! Tu cuerpo y tu bebé te lo agradecen.</p>`}

      <button class="link" onClick=${() => setShowPlate(!showPlate)}>${showPlate ? 'Ocultar' : 'Cómo armar tu plato'}</button>
      ${showPlate && html`<ul class="plate">${PLATE_GUIDE.map(line => html`<li key=${line}>${line}</li>`)}</ul>`}
    </div>
  </section>`;
}
