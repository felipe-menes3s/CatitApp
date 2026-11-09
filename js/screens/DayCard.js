// "Tu día": the low-effort nutrition checklist on the Today screen. One tap per habit, no calorie counting.
import { html, useState } from '../lib.js';
import { HABITS, PLATE_GUIDE } from '../data/nutrition.js';
import { loadDayLog, saveDayLog, formatInt } from '../storage.js';
import { Icon } from '../ui.js';
import { Water, WATER_GOAL_ML } from './Water.js';

function slotLabel(habit, slot, settings) {
  if (habit.id === 'steps') return `Llegué a ${formatInt(settings.stepsGoal)}`;
  return slot;
}

// Water is stored in ml with a log of each add (for undo). Older days stored glasses of 250 ml.
function waterOf(log) {
  if (Array.isArray(log.waterLog)) return log.waterLog;
  return Array(log.water || 0).fill(250);
}

function isComplete(log) {
  const habitsDone = HABITS.every(h => h.slots.every((_, i) => log[h.id]?.[i]));
  return habitsDone && waterOf(log).reduce((a, b) => a + b, 0) >= WATER_GOAL_ML;
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

  const waterLog = waterOf(log);
  const waterMl = waterLog.reduce((a, b) => a + b, 0);
  const setWater = next => { const { water, ...rest } = log; update({ ...rest, waterLog: next }); };

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
      <${Water} ml=${waterMl} lastAdd=${waterLog[waterLog.length - 1]}
        onAdd=${ml => setWater([...waterLog, ml])} onUndo=${() => setWater(waterLog.slice(0, -1))} />

      ${isComplete(log) && html`<p class="day-done">¡Lo lograste hoy! Tu cuerpo y tu bebé te lo agradecen.</p>`}

      <button class="link" onClick=${() => setShowPlate(!showPlate)}>${showPlate ? 'Ocultar' : 'Cómo armar tu plato'}</button>
      ${showPlate && html`<ul class="plate">${PLATE_GUIDE.map(line => html`<li key=${line}>${line}</li>`)}</ul>`}
    </div>
  </section>`;
}
