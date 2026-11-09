// Water tracker, ported from DontSkip: animated glass, quick-add bottle sizes, custom amount, undo of the last add.
// Colors come from the theme (water tinted with the palette's accent), so it matches every palette and dark mode.
import { html, useState } from '../lib.js';
import { parseWeight as parseNumber, formatInt } from '../storage.js';

export const WATER_GOAL_ML = 3000; // lactation AI 3.8 L total water (~3.1 L from drinks); dry Utah climate
const ML_PER_OZ = 29.5735;
const toOz = ml => Math.round(ml / ML_PER_OZ);

// Bottle sizes in oz, converted exactly (the same math as a typed amount).
const QUICK = [8, 12, 24, 40].map(oz => ({ ml: Math.round(oz * ML_PER_OZ), label: `${oz} oz` }));

const BUBBLES = [
  { cx: 25, r: 2.5, dur: '3s', delay: '0s' },
  { cx: 40, r: 3, dur: '3.5s', delay: '0.8s' },
  { cx: 55, r: 2, dur: '2.8s', delay: '1.5s' },
  { cx: 33, r: 1.5, dur: '4s', delay: '2.2s' },
  { cx: 48, r: 2.5, dur: '3.2s', delay: '0.4s' },
];

const GLASS = 'M8 6 L18 110 C18 114 27 117 40 117 C53 117 62 114 62 110 L72 6 Z';

function Glass({ ml, done }) {
  const pct = Math.min(ml / WATER_GOAL_ML, 1);
  const top = 120 - pct * 112; // water surface (y)
  const move = { transition: 'transform 600ms ease' };
  return html`<svg class="glass" width="80" height="120" viewBox="0 0 80 120" aria-hidden="true">
    <defs><clipPath id="glassClip"><path d=${GLASS} /></clipPath></defs>
    <path d=${GLASS} class="glass-body" />
    ${ml > 0 && html`<g clip-path="url(#glassClip)">
      <rect x="0" y=${top + 6} width="80" height=${120 - top} class="water-base" style=${{ transition: 'y 600ms ease, height 600ms ease' }} />
      <g style=${{ ...move, transform: `translateY(${top}px)` }}>
        <path class="water-wave w1" d="M-40,8 C-25,0 -10,16 10,8 C30,0 50,16 70,8 C90,0 110,16 130,8 C150,0 170,16 200,8 V130 H-40 Z" />
      </g>
      <g style=${{ ...move, transform: `translateY(${top + 3}px)` }}>
        <path class="water-wave w2" d="M-40,8 C-20,0 0,16 20,8 C40,0 60,16 80,8 C100,0 120,16 140,8 C160,0 180,16 200,8 V130 H-40 Z" />
      </g>
      <g style=${{ ...move, transform: `translateY(${top + 5}px)` }}>
        <path class="water-wave w3" d="M-40,8 C-15,0 5,16 30,8 C55,0 75,16 100,8 C125,0 145,16 170,8 C195,0 215,16 240,8 V130 H-40 Z" />
      </g>
      ${BUBBLES.map((b, i) => html`<circle key=${i} cx=${b.cx} cy="115" r=${b.r} class="bubble"
        style=${{ animation: `bubbleRise ${b.dur} ease-in infinite ${b.delay}` }} />`)}
    </g>`}
    <path d="M8 6 L72 6" class="glass-rim" />
    <text x="40" y="60" text-anchor="middle" class=${'glass-ml' + (done ? ' done' : '')} font-size=${ml >= 1000 ? 18 : 22}>${formatInt(ml)}</text>
    <text x="40" y="76" text-anchor="middle" class="glass-unit">ml</text>
  </svg>`;
}

export function Water({ ml, lastAdd, onAdd, onUndo }) {
  const [custom, setCustom] = useState(false);
  const [text, setText] = useState('');
  const [unit, setUnit] = useState('oz');
  const pct = Math.min(ml / WATER_GOAL_ML, 1);
  const done = ml >= WATER_GOAL_ML;

  function addCustom() {
    const n = parseNumber(text);
    if (!n) return;
    const amount = Math.round(unit === 'ml' ? n : n * ML_PER_OZ);
    if (amount < 1 || amount > 2000) return; // 0 or a typo, not a drink
    onAdd(amount);
    setText(''); setCustom(false);
  }

  return html`<div class="habit water">
    <div class="habit-head">
      <span class="habit-name">Agua</span>
      <span class="habit-count">${Math.round(pct * 100)} %</span>
    </div>
    <div class="water-main">
      <${Glass} ml=${ml} done=${done} />
      <div class="water-stats">
        <div class="water-bar"><span style=${{ width: `${pct * 100}%` }}></span></div>
        <div class="water-oz small muted"><span>${toOz(ml)} oz</span><span>${toOz(WATER_GOAL_ML)} oz</span></div>
        <p class="small muted">Meta: ${formatInt(WATER_GOAL_ML)} ml · ${toOz(WATER_GOAL_ML)} oz. Un vaso cada vez que amamantas es una buena regla.</p>
        ${done && html`<p class="small water-done">Meta cumplida</p>`}
      </div>
    </div>

    <div class="quick-row">
      ${QUICK.map(q => html`<button key=${q.ml} class="quick" onClick=${() => onAdd(q.ml)}>
        <b>${q.label}</b><small>${formatInt(q.ml)} ml</small></button>`)}
    </div>

    ${custom
      ? html`<div class="custom-row">
          <input class="text-input" inputmode="decimal" placeholder=${unit === 'oz' ? '16' : '500'} value=${text}
            onInput=${e => setText(e.target.value)} />
          <button class="unit-btn" onClick=${() => setUnit(unit === 'oz' ? 'ml' : 'oz')}>${unit}</button>
          <button class="round-btn" aria-label="Agregar" onClick=${addCustom}>+</button>
        </div>`
      : html`<div class="custom-row">
          <button class="btn soft grow-btn" onClick=${() => setCustom(true)}>Otra cantidad</button>
          ${lastAdd && html`<button class="btn soft undo-btn" onClick=${onUndo} aria-label="Deshacer">↶ ${formatInt(lastAdd)} ml</button>`}
        </div>`}
  </div>`;
}
