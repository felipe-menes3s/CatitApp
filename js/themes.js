// Color palettes. Each one has a light and a dark version.
// Screens never use hex colors directly: they read the CSS variables set by applyTheme().

export const PALETTES = [
  {
    id: 'arena', name: 'Arena y rosa',
    light: { bg: '#F7F2EC', card: '#FFFDFB', ink: '#4A3B36', muted: '#9A8A83', line: '#EDE4DC', accent: '#C99189', accentSoft: '#F4E3DF', accentInk: '#A8665D', onAccent: '#FFFFFF' },
    dark:  { bg: '#1E1917', card: '#2A2320', ink: '#F3E9E4', muted: '#A8978F', line: '#3A302C', accent: '#D9A39B', accentSoft: '#3D2C29', accentInk: '#E8B5AD', onAccent: '#1E1917' },
  },
  {
    id: 'ballet', name: 'Rosa ballet',
    light: { bg: '#FBF3F4', card: '#FFFFFF', ink: '#4B3439', muted: '#A08A8F', line: '#F1E2E5', accent: '#E0A0AF', accentSoft: '#FBE4EA', accentInk: '#B9667A', onAccent: '#FFFFFF' },
    dark:  { bg: '#1F171A', card: '#2B2024', ink: '#F6E7EB', muted: '#AE959C', line: '#3D2D33', accent: '#EBAFBD', accentSoft: '#42292F', accentInk: '#F2C1CC', onAccent: '#1F171A' },
  },
  {
    id: 'frambuesa', name: 'Frambuesa',
    light: { bg: '#FBF2F3', card: '#FFFFFF', ink: '#45272E', muted: '#A1858B', line: '#F0DFE2', accent: '#C9637A', accentSoft: '#F7DDE3', accentInk: '#A3485E', onAccent: '#FFFFFF' },
    dark:  { bg: '#1D1416', card: '#2A1D21', ink: '#F7E6EA', muted: '#AD9097', line: '#3F2A30', accent: '#E08A9C', accentSoft: '#47262E', accentInk: '#EFA9B7', onAccent: '#1D1416' },
  },
  {
    id: 'durazno', name: 'Durazno',
    light: { bg: '#FBF4EE', card: '#FFFDFA', ink: '#4D3A30', muted: '#A38F83', line: '#F1E4D9', accent: '#E3A281', accentSoft: '#FBE7DB', accentInk: '#B8704C', onAccent: '#FFFFFF' },
    dark:  { bg: '#1F1814', card: '#2B221D', ink: '#F7EADF', muted: '#AE9888', line: '#3E3129', accent: '#EDB393', accentSoft: '#45302A', accentInk: '#F3C3A7', onAccent: '#1F1814' },
  },
  {
    id: 'lavanda', name: 'Lavanda',
    light: { bg: '#F5F2F6', card: '#FFFEFF', ink: '#3F3546', muted: '#968C9C', line: '#E9E3EC', accent: '#A889B0', accentSoft: '#EEE5F1', accentInk: '#80628A', onAccent: '#FFFFFF' },
    dark:  { bg: '#1B1720', card: '#26202C', ink: '#EEE6F2', muted: '#A498AB', line: '#372F3E', accent: '#BFA2C7', accentSoft: '#3A2E40', accentInk: '#D3BBDA', onAccent: '#1B1720' },
  },
  {
    id: 'salvia', name: 'Salvia',
    light: { bg: '#F3F3EE', card: '#FDFDFA', ink: '#36403A', muted: '#8C958D', line: '#E4E6DE', accent: '#8BA388', accentSoft: '#E3EBE1', accentInk: '#5D7A5A', onAccent: '#FFFFFF' },
    dark:  { bg: '#161A17', card: '#212622', ink: '#E6ECE5', muted: '#949E94', line: '#2F3630', accent: '#A3BBA0', accentSoft: '#2C3A2B', accentInk: '#BCD1B9', onAccent: '#161A17' },
  },
  {
    id: 'champana', name: 'Champaña',
    light: { bg: '#FAF6EE', card: '#FFFEFA', ink: '#463B2A', muted: '#A09479', line: '#EEE6D6', accent: '#C8A96A', accentSoft: '#F3EAD6', accentInk: '#957438', onAccent: '#FFFFFF' },
    dark:  { bg: '#1B1812', card: '#27231A', ink: '#F3ECDD', muted: '#A89C83', line: '#3A3326', accent: '#D6BA80', accentSoft: '#3D3423', accentInk: '#E6CD98', onAccent: '#1B1812' },
  },
  {
    id: 'latte', name: 'Latte',
    light: { bg: '#F5EFE8', card: '#FFFCF8', ink: '#3F3129', muted: '#9C8B7F', line: '#E8DDD2', accent: '#B38B6D', accentSoft: '#EFE2D6', accentInk: '#8C6448', onAccent: '#FFFFFF' },
    dark:  { bg: '#1B1714', card: '#27211C', ink: '#F1E6DC', muted: '#A69584', line: '#3A3029', accent: '#C9A385', accentSoft: '#3D3028', accentInk: '#DDBB9F', onAccent: '#1B1714' },
  },
];

export const MODES = [
  { id: 'auto', name: 'Automático' },
  { id: 'light', name: 'Claro' },
  { id: 'dark', name: 'Oscuro' },
];

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function resolveColors(paletteId, mode) {
  const palette = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
  const isDark = mode === 'dark' || (mode === 'auto' && darkQuery.matches);
  return isDark ? palette.dark : palette.light;
}

export function applyTheme(paletteId, mode) {
  const colors = resolveColors(paletteId, mode);
  const root = document.documentElement.style;
  for (const [key, value] of Object.entries(colors)) root.setProperty(`--${key}`, value);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors.bg);
}

// Re-apply when the phone switches between light and dark (only matters in "auto").
export function onSystemModeChange(callback) {
  darkQuery.addEventListener('change', callback);
  return () => darkQuery.removeEventListener('change', callback);
}
