// App shell: holds settings and today's session, and switches between the 3 tabs.
import { html, useState, useEffect, createRoot } from './lib.js';
import { applyTheme, onSystemModeChange } from './themes.js';
import { loadSettings, saveSettings, loadSession, saveSession, saveLastWeight, dateKey } from './storage.js';
import { routineForDay } from './data/routines.js';
import { newSession } from './session.js';
import { Icon } from './ui.js';
import { Today } from './screens/Today.js';
import { Workout } from './screens/Workout.js';
import { Settings } from './screens/Settings.js';

const TABS = [
  { id: 'today', name: 'Hoy', icon: 'home' },
  { id: 'workout', name: 'Entrenar', icon: 'dumbbell' },
  { id: 'settings', name: 'Ajustes', icon: 'gear' },
];

function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [tab, setTab] = useState('today');
  const [day, setDay] = useState(() => dateKey());
  const [session, setSession] = useState(() => loadSession(dateKey()));
  const plannedId = routineForDay(new Date())?.id || null;

  useEffect(() => {
    applyTheme(settings.palette, settings.mode);
    return onSystemModeChange(() => applyTheme(settings.palette, settings.mode));
  }, [settings.palette, settings.mode]);

  // The PWA can stay open overnight: when it comes back, move to the new day.
  useEffect(() => {
    function refreshDay() {
      const now = dateKey();
      if (now !== day) { setDay(now); setSession(loadSession(now)); }
    }
    document.addEventListener('visibilitychange', refreshDay);
    return () => document.removeEventListener('visibilitychange', refreshDay);
  }, [day]);

  function updateSettings(next) {
    setSettings(next);
    saveSettings(next);
  }

  function updateSession(next, lastWeight) {
    setSession(next);
    saveSession(day, next);
    if (lastWeight) saveLastWeight(lastWeight.exId, lastWeight.weight);
  }

  function chooseRoutine(routineId) {
    updateSession(newSession(routineId, session?.place));
  }

  // Opening "Entrenar" with no session yet starts today's planned routine.
  const workoutSession = session || (plannedId && newSession(plannedId));

  return html`<div class="app">
    <main>
      ${tab === 'today' && html`<${Today} settings=${settings} session=${session} plannedId=${plannedId}
        onChooseRoutine=${id => { chooseRoutine(id); setTab('workout'); }} onGo=${() => setTab('workout')} />`}
      ${tab === 'workout' && (workoutSession
        ? html`<${Workout} session=${workoutSession} settings=${settings} onChange=${updateSession}
            onFinish=${() => updateSession({ ...workoutSession, finishedAt: new Date().toISOString() })} />`
        : html`<div class="screen-body fade-in"><header><h1>Hoy es descanso</h1></header>
            <p class="muted">Si quieres entrenar igual, elige una rutina en «Hoy».</p></div>`)}
      ${tab === 'settings' && html`<${Settings} settings=${settings} onChange=${updateSettings} />`}
    </main>
    <nav class="tabs">
      ${TABS.map(t => html`<button key=${t.id} class=${tab === t.id ? 'on' : ''} onClick=${() => setTab(t.id)}>
        <${Icon} name=${t.icon} /><span>${t.name}</span></button>`)}
    </nav>
  </div>`;
}

createRoot(document.getElementById('root')).render(html`<${App} />`);
