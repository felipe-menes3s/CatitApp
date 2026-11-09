// Small shared pieces: icons, progress ring, GIF box, segmented control.
import { html, useState } from './lib.js';
import { gifFor } from './data/exercises.js';

const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  dumbbell: 'M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  play: 'M8 5v14l11-7z',
  chevron: 'M9 6l6 6-6 6',
  video: 'M15 10l5-3v10l-5-3zM3 7h12v10H3z',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  chart: 'M4 19h16M6 15l4-4 3 3 5-6',
};

export function Icon({ name, size = 22, fill = false }) {
  return html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill=${fill ? 'currentColor' : 'none'}
    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d=${ICONS[name]} /></svg>`;
}

export function Ring({ done, total, size = 64 }) {
  const r = size / 2 - 5;
  const length = 2 * Math.PI * r;
  const progress = total ? done / total : 0;
  return html`<svg class="ring" width=${size} height=${size} viewBox=${`0 0 ${size} ${size}`}>
    <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke="var(--accentSoft)" stroke-width="7" />
    <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke="var(--accent)" stroke-width="7"
      stroke-linecap="round" stroke-dasharray=${length} stroke-dashoffset=${length * (1 - progress)}
      transform=${`rotate(-90 ${size / 2} ${size / 2})`} style=${{ transition: 'stroke-dashoffset .5s ease' }} />
    <text x="50%" y="50%" dy=".35em" text-anchor="middle" class="ring-text">${done}/${total}</text>
  </svg>`;
}

// Shows the exercise GIF. If the file is missing, shows a soft placeholder instead of a broken image.
export function Gif({ id, size }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };
  const src = gifFor(id);
  if (failed || !src) return html`<div class="gif gif-missing" style=${style}><${Icon} name="dumbbell" size=${size / 3} /></div>`;
  return html`<img class="gif" style=${style} src=${src} alt="" loading="lazy" onError=${() => setFailed(true)} />`;
}

export function Segmented({ options, value, onChange }) {
  return html`<div class="segmented">
    ${options.map(o => html`<button key=${o.id} class=${o.id === value ? 'on' : ''} onClick=${() => onChange(o.id)}>${o.name}</button>`)}
  </div>`;
}
