// "Ajustes": name, color palette, light/dark mode, weight unit, and the back rules.
import { html } from '../lib.js';
import { PALETTES, MODES } from '../themes.js';
import { Segmented, Icon } from '../ui.js';

const UNITS = [{ id: 'lb', name: 'Libras' }, { id: 'kg', name: 'Kilos' }];

const BACK_RULES = [
  'Si algo duele en la espalda baja, para ese ejercicio y sigue con el próximo.',
  'Suelta el aire al hacer fuerza. Nunca aguantes la respiración.',
  'Abdomen firme y espalda neutra, como si te fueran a tocar la panza.',
  'Nada de saltos, carreras, abdominales tipo crunch ni giros con peso.',
  'Amamanta antes de entrenar y lleva agua.',
  'Para y habla con tu doctora si sientes escapes de orina, sensación de peso o bulto en la vagina, vuelve el sangrado, o el dolor de la espalda baja se corre hacia la pierna.',
  'Para y habla con tu doctora el mismo día si sientes mareo, dolor en el pecho, o dolor o hinchazón en la pantorrilla.',
  'Ve a urgencias si se te duerme la zona entre las piernas, sientes debilidad en una pierna, o de pronto no puedes orinar o controlar el intestino.',
];

function PaletteOption({ palette, selected, onPick }) {
  const c = palette.light;
  return html`<button class=${'palette' + (selected ? ' on' : '')} onClick=${onPick}>
    <span class="palette-swatches">
      ${[c.bg, c.accent, c.accentInk].map(color => html`<span key=${color} style=${{ background: color }}></span>`)}
    </span>
    <span class="palette-name">${palette.name}</span>
    ${selected && html`<span class="palette-check"><${Icon} name="check" size=${14} /></span>`}
  </button>`;
}

export function Settings({ settings, onChange }) {
  const set = patch => onChange({ ...settings, ...patch });

  return html`<div class="screen-body fade-in">
    <header><h1>Ajustes</h1></header>

    <section>
      <h2>Tu nombre</h2>
      <input class="text-input" value=${settings.name} onChange=${e => set({ name: e.target.value })} />
    </section>

    <section>
      <h2>Color</h2>
      <div class="palette-grid">
        ${PALETTES.map(p => html`<${PaletteOption} key=${p.id} palette=${p} selected=${p.id === settings.palette}
          onPick=${() => set({ palette: p.id })} />`)}
      </div>
    </section>

    <section>
      <h2>Modo</h2>
      <${Segmented} options=${MODES} value=${settings.mode} onChange=${mode => set({ mode })} />
      <p class="muted small">Automático sigue al iPhone: claro de día, oscuro de noche.</p>
    </section>

    <section>
      <h2>Pesas</h2>
      <${Segmented} options=${UNITS} value=${settings.unit} onChange=${unit => set({ unit })} />
    </section>

    <section>
      <h2>Cuida tu espalda</h2>
      <div class="card">
        <ol class="rules">${BACK_RULES.map(r => html`<li key=${r}>${r}</li>`)}</ol>
      </div>
    </section>
  </div>`;
}
