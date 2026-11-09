// "Hoy": greeting, the week (Mon-Fri), and today's workout card.
import { html, useState } from '../lib.js';
import { ROUTINES, routineById } from '../data/routines.js';
import { loadSession, dateKey, mondayOf } from '../storage.js';
import { progressOf, hasStarted, isFinished } from '../session.js';
import { Ring, Icon } from '../ui.js';
import { DayCard } from './DayCard.js';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

function greeting(now) {
  const h = now.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

function WeekStrip({ today }) {
  // On Sunday, show the week that starts tomorrow.
  const monday = mondayOf(today);
  if (today.getDay() === 0) monday.setDate(monday.getDate() + 7);
  const todayKey = dateKey(today);
  return html`<div class="week">
    ${WEEKDAYS.map((label, i) => {
      const day = new Date(monday); day.setDate(monday.getDate() + i);
      const key = dateKey(day);
      const session = loadSession(key);
      const finished = isFinished(session);
      const cls = ['week-day', key === todayKey ? 'today' : '', finished ? 'done' : ''].join(' ');
      return html`<div key=${key} class=${cls}>
        <span class="week-label">${label}</span>
        <span class="week-num">${day.getDate()}</span>
        <span class="week-mark">${finished ? html`<${Icon} name="check" size=${14} />` : ''}</span>
      </div>`;
    })}
  </div>`;
}

function RoutinePicker({ currentId, onPick, onClose }) {
  return html`<div class="sheet-backdrop" onClick=${onClose}>
    <div class="sheet" onClick=${e => e.stopPropagation()}>
      <div class="sheet-title">Elige la rutina de hoy</div>
      ${ROUTINES.map(r => html`<button key=${r.id} class=${'pick' + (r.id === currentId ? ' on' : '')} onClick=${() => onPick(r.id)}>
        <span><b>${r.name}</b><small>${r.focus}</small></span>
        ${r.id === currentId ? html`<${Icon} name="check" size=${18} />` : ''}
      </button>`)}
    </div>
  </div>`;
}

export function Today({ day, settings, session, plannedId, rampUp, onChooseRoutine, onGo }) {
  const [picking, setPicking] = useState(false);
  const now = new Date();
  const routineId = session?.routineId || plannedId;
  const routine = routineId && routineById(routineId);
  const { done, total } = progressOf(session || (routine && { routineId, place: 'gym', rampUp, items: {} }));
  const finished = isFinished(session);
  const started = hasStarted(session);
  const dateText = now.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });

  function pick(id) {
    setPicking(false);
    onChooseRoutine(id);
  }

  return html`<div class="screen-body fade-in">
    <header>
      <div class="eyebrow">${dateText}</div>
      <h1>${greeting(now)},<br />${settings.name || 'Catita'}</h1>
    </header>

    <${WeekStrip} today=${now} />

    ${routine ? html`
      <div class="card today-card">
        <${Ring} done=${done} total=${total} />
        <div class="grow">
          <div class="eyebrow">${finished ? 'Terminaste hoy' : 'Rutina de hoy'}</div>
          <div class="today-name">${routine.name}</div>
          <div class="muted small">${routine.minutes} min · ${routine.focus}</div>
        </div>
      </div>
      <button class="btn" onClick=${onGo}>
        ${finished ? 'Ver lo que hiciste' : started ? 'Continuar' : 'Empezar'}
      </button>
      ${!started && html`<div class="today-links">
        <button class="link" onClick=${() => setPicking(true)}>Cambiar rutina</button>
        ${routineId !== 'easy' && html`<button class="link" onClick=${() => onChooseRoutine('easy')}>Dormí mal: día suave</button>`}
      </div>`}
    ` : html`
      <div class="card rest-card">
        <div class="today-name">Hoy es descanso</div>
        <p class="muted">El cuerpo también se fortalece descansando. Si te sientes con ganas, una caminata suave suma.</p>
        <button class="btn soft" onClick=${() => setPicking(true)}>Entrenar igual</button>
      </div>
    `}

    <${DayCard} key=${day} day=${day} settings=${settings} />

    ${picking && html`<${RoutinePicker} currentId=${routineId} onPick=${pick} onClose=${() => setPicking(false)} />`}
  </div>`;
}
