// "Progreso": weekly weigh-in, 3-week trend chart, projected date, and the advice for this week.
import { html, useState } from '../lib.js';
import { loadWeights, saveWeighIn, deleteWeighIn, parseWeight, dateKey } from '../storage.js';
import { withTrend, projection, advice, suspiciousChange, PLAUSIBLE_KG } from '../weight.js';
import { mondayOf } from '../storage.js';
import { Segmented, Icon } from '../ui.js';

const YES_NO = [{ id: 'yes', name: 'Sí' }, { id: 'no', name: 'No' }];

const fmt = n => n.toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
// Body weight is never rounded to dumbbell steps: exact conversion, shown with one decimal.
const LB_PER_KG = 2.20462;
const shown = (kg, unit) => (unit === 'kg' ? kg : kg * LB_PER_KG);
const shortDate = key => new Date(key + 'T12:00').toLocaleDateString('es', { day: 'numeric', month: 'short' });

// Line chart: weigh-ins as dots, 3-week trend as the line, goal as a dashed reference. Tap a dot for its value.
function WeightChart({ points, goalKg, unit }) {
  const [picked, setPicked] = useState(null);
  const W = 320, H = 170, padL = 34, padR = 64, padT = 14, padB = 22;
  const times = points.map(p => new Date(p.date + 'T12:00').getTime());
  const t0 = times[0], t1 = Math.max(times[times.length - 1], t0 + 7 * 86400000);
  // Everything is drawn in the unit she reads (lb or kg), with round grid steps.
  const step = unit === 'kg' ? 2 : 5;
  const values = [...points.map(p => shown(p.kg, unit)), shown(goalKg, unit)];
  const lo = Math.floor(Math.min(...values) / step) * step, hi = Math.ceil(Math.max(...values) / step) * step;
  const gridStep = Math.max(step, Math.ceil((hi - lo) / 3 / step) * step);
  const grid = []; for (let v = lo; v <= hi; v += gridStep) grid.push(v);
  const x = t => padL + ((t - t0) / (t1 - t0)) * (W - padL - padR);
  const y = kg => padT + ((hi - shown(kg, unit)) / (hi - lo || 1)) * (H - padT - padB);
  const yRaw = v => padT + ((hi - v) / (hi - lo || 1)) * (H - padT - padB);
  const trendPath = points.map((p, i) => `${i ? 'L' : 'M'}${x(times[i]).toFixed(1)},${y(p.trend).toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const tip = picked !== null && points[picked];

  return html`<div class="chart">
    <svg viewBox=${`0 0 ${W} ${H}`} role="img" aria-label="Peso por semana y tendencia">
      ${grid.map(v => html`<g key=${v}>
        <line x1=${padL} x2=${W - padR} y1=${yRaw(v)} y2=${yRaw(v)} class="grid" />
        <text x=${padL - 6} y=${yRaw(v) + 4} class="axis" text-anchor="end">${v}</text>
      </g>`)}
      <line x1=${padL} x2=${W - padR} y1=${y(goalKg)} y2=${y(goalKg)} class="goal-line" />
      ${Math.abs(y(goalKg) - y(last.trend)) > 12 && html`<text x=${W - padR + 6} y=${y(goalKg) + 4} class="axis">Meta</text>`}
      ${points.length > 1 && html`<path d=${trendPath} class="trend-line" />`}
      <text x=${W - padR + 6} y=${y(last.trend) + 4} class="label">Tendencia</text>
      ${points.map((p, i) => html`<g key=${p.date} onClick=${() => setPicked(picked === i ? null : i)}>
        <circle cx=${x(times[i])} cy=${y(p.kg)} r="14" class="hit" />
        <circle cx=${x(times[i])} cy=${y(p.kg)} r="4.5" class=${'dot' + (picked === i ? ' on' : '')} />
      </g>`)}
    </svg>
    <p class="muted small chart-tip">${tip
      ? `${shortDate(tip.date)}: ${fmt(shown(tip.kg, unit))} ${unit} · tendencia ${fmt(shown(tip.trend, unit))} ${unit}`
      : 'Toca un punto para ver el peso de esa semana.'}</p>
  </div>`;
}

function WeighInForm({ unit, points, onSave }) {
  const [text, setText] = useState('');
  const [diapers, setDiapers] = useState(null);
  const [supply, setSupply] = useState(null);
  const [confirmJump, setConfirmJump] = useState(false);
  const value = parseWeight(text);
  const kg = value && (unit === 'kg' ? value : value / LB_PER_KG);
  const plausible = kg && kg >= PLAUSIBLE_KG.min && kg <= PLAUSIBLE_KG.max;
  const ready = plausible && diapers && supply;
  const jump = plausible ? suspiciousChange(points, kg) : null;
  const thisWeek = points.find(p => mondayOf(new Date(p.date + 'T12:00')).getTime() === mondayOf().getTime());

  function save() {
    if (!ready) return;
    // A big jump is usually a typo or the wrong unit: ask once more inside the app.
    if (jump !== null && !confirmJump) { setConfirmJump(true); return; }
    onSave({ date: dateKey(), kg: Math.round(kg * 100) / 100, diapersOk: diapers === 'yes', supplyDown: supply === 'yes' });
    setText(''); setDiapers(null); setSupply(null); setConfirmJump(false);
  }

  return html`<div class="card weigh-card">
    <p class="small">Pésate una vez por semana, ojalá el sábado: al despertar, después de amamantar y de ir al baño, antes de desayunar, con poca ropa y en la misma báscula.</p>
    <label class="field big-field">
      <input inputmode="decimal" placeholder="Tu peso" value=${text} onInput=${e => { setText(e.target.value); setConfirmJump(false); }} />
      <span>${unit}</span>
    </label>
    ${value && !plausible && html`<p class="small warn">Revisa el número: ¿está en ${unit}? Puedes cambiar la unidad en Ajustes.</p>`}
    ${confirmJump && jump !== null && html`<p class="small warn">Cambió ${fmt(shown(jump, unit))} ${unit} desde tu último pesaje. ¿Está bien escrito y en ${unit}? Toca Guardar de nuevo para confirmar.</p>`}
    ${thisWeek && html`<p class="muted small">Ya te pesaste esta semana (${fmt(shown(thisWeek.kg, unit))} ${unit}). Guardar lo reemplaza.</p>`}
    <div class="question"><span class="small">¿Tu bebé moja 5 o 6 pañales o más al día?</span>
      <${Segmented} options=${YES_NO} value=${diapers} onChange=${setDiapers} /></div>
    <div class="question"><span class="small">¿Sientes que tu leche bajó esta semana?</span>
      <${Segmented} options=${YES_NO} value=${supply} onChange=${setSupply} /></div>
    <button class=${'btn' + (ready ? '' : ' soft')} disabled=${!ready} onClick=${save}>Guardar peso de esta semana</button>
  </div>`;
}

export function Progress({ settings }) {
  const [entries, setEntries] = useState(loadWeights);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const unit = settings.unit;
  const points = withTrend(entries);
  const last = points[points.length - 1];
  const first = points[0];
  const goalKg = settings.goalKg, idealKg = settings.idealKg;
  const tip = advice(points);
  const toGoal = projection(points, goalKg);
  const toIdeal = projection(points, idealKg);
  const progress = last && first.kg > goalKg ? Math.min(1, Math.max(0, (first.kg - last.trend) / (first.kg - goalKg))) : 0;

  function save(entry) { saveWeighIn(entry); setEntries(loadWeights()); }
  // Two taps to delete, inside the app (no browser pop-ups).
  function remove(date) {
    if (confirmDelete !== date) { setConfirmDelete(date); return; }
    deleteWeighIn(date); setEntries(loadWeights()); setConfirmDelete(null);
  }

  return html`<div class="screen-body fade-in">
    <header><h1>Progreso</h1></header>

    ${last && html`<div class="card hero">
      <div class="eyebrow">Tu tendencia de 3 semanas</div>
      <div class="hero-number">${fmt(shown(last.trend, unit))} <small>${unit}</small></div>
      <div class="muted small">${points.length > 1
        ? `${fmt(Math.abs(shown(first.kg, unit) - shown(last.kg, unit)))} ${unit} ${last.kg <= first.kg ? 'menos' : 'más'} que al empezar`
        : 'Tu primer peso. ¡Empezamos!'}</div>
      <div class="goal-bar" aria-label="Avance hacia la meta"><span style=${{ width: `${progress * 100}%` }}></span></div>
      <div class="goal-labels small muted"><span>Inicio ${fmt(shown(first.kg, unit))}</span><span>Meta ${fmt(shown(goalKg, unit))}</span></div>
      ${toGoal && html`<p class="small">${toGoal.reached
        ? `¡Llegaste a tu meta de ${fmt(shown(goalKg, unit))} ${unit}!`
        : `Llegas a ${fmt(shown(goalKg, unit))} ${unit} ${toGoal.text}.`}
        ${toIdeal && !toIdeal.reached && ` Y a ${fmt(shown(idealKg, unit))} ${unit} ${toIdeal.text}.`}</p>`}
    </div>`}

    <div class=${'card advice ' + tip.tone}>
      <span class="advice-icon"><${Icon} name="heart" size=${18} fill=${tip.tone !== 'ok'} /></span>
      <p class="small">${tip.tone === 'alert' ? html`<b>Importante. </b>` : ''}${tip.text}</p>
    </div>

    ${points.length > 0 && html`<section><h2>Peso por semana</h2>
      <div class="card"><${WeightChart} points=${points} goalKg=${goalKg} unit=${unit} /></div></section>`}

    <section><h2>Pesaje de la semana</h2><${WeighInForm} unit=${unit} points=${points} onSave=${save} /></section>

    ${points.length > 0 && html`<section><h2>Historial</h2>
      <div class="card history">
        ${[...points].reverse().map(p => html`<div class="history-row" key=${p.date}>
          <span>${shortDate(p.date)}</span><b>${fmt(shown(p.kg, unit))} ${unit}</b>
          <button class="link small" onClick=${() => remove(p.date)}>${confirmDelete === p.date ? '¿Quitar? Toca de nuevo' : 'Quitar'}</button>
        </div>`)}
      </div></section>`}

    <p class="muted small">Amamantando, lo sano es bajar entre 0,3 y 0,5 kg por semana. Comer menos de lo indicado puede bajar tu leche.</p>
  </div>`;
}
