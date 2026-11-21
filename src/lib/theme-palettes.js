/** Colours for the 3D neural background, per theme. Keep in sync with the CSS tokens in site.css. */
export const NEURAL_PALETTES = {
  dark: {
    bg: '#030407',
    core: '#3a78ff',
    coreHot: '#d4ff24',
    node: '#6c84b8',
    edge: '#2c3f6b',
    hot: '#d4ff24',
    pulse: '#e8ff8a',
    additive: true,
    alpha: 1,
    glow: 0.45,
  },
  light: {
    bg: '#f4f6fa',
    core: '#155bc9',
    coreHot: '#7fae00',
    node: '#8f9bb5',
    edge: '#b4bfd4',
    hot: '#155bc9',
    pulse: '#155bc9',
    additive: false,
    alpha: 0.9,
    glow: 0.22,
  },
};
