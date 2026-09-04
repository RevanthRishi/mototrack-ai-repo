// Centralised theme tokens — single source of truth for all colours and styles.
// Imported by both tailwind.config.js (via require) and inline style={} objects in TSX.

export const COLORS = {
  // Canvas / page background
  canvas: {
    light: '#faf7f0',
    dark: '#06060f',
  },
  // Card / surface
  card: {
    light: '#ffffff',
    dark: '#0d0d18',
  },
  // Elevated inner elements
  elevated: {
    light: '#e8e9f0',
    dark: '#13131f',
  },
  // Borders
  border: {
    light: 'rgba(15,23,42,0.08)',
    dark: 'rgba(255,255,255,0.06)',
  },
  // Text
  text: {
    primary:   '#0f172a',
    secondary: '#4b5563',
    muted:     '#9ca3af',
    'primary-dark':   '#e2e0ed',
    'secondary-dark': '#6b6b80',
    'muted-dark':     '#8b8fa3',
  },
  // Accents (constant — same both themes)
  accent: {
    violet: '#8b7cf6',
    'violet-dark': '#6d5ae6',
    amber: '#f59e0b',
    emerald: '#10b981',
    orange: '#f97316',
  },
  // Brand tokens
  brand: {
    dark: '#0f172a',
    card: '#1e293b',
    accent: '#38bdf8',
  },
  // Status
  danger: '#ef4444',
  warning: '#f59e0b',

  // ---- Gradient stops ----
  // Each entry has light + dark arrays. Used by useThemedGradient and themeStore.
  gradients: {
    hero: {
      light: ['#ebe8d8', '#ddd5c2', '#faf7f0'] as const,
      dark:  ['#1a1330', '#0c0a18', '#06060f'] as const,
    },
    heroFeatured: {
      light: ['#f3efe3', '#e8dccb', '#faf7f0'] as const,
      dark:  ['#1f1638', '#110b22', '#0a0814'] as const,
    },
    aiCard: {
      light: ['#f3efe3', '#e8dccb'] as const,
      dark:  ['#1a1030', '#0f0c18'] as const,
    },
    profileCard: {
      light: ['#f3efe3', '#e8dccb'] as const,
      dark:  ['#1a1330', '#0c0a18'] as const,
    },
    upgrade: {
      light: ['#F5EFE8', '#EAE0D0'] as const,
      dark:  ['#1a0f08', '#0c0804'] as const,
    },
    loginBg: {
      light: ['#f8f9fc', '#e8e9f0', '#d0d2e0'] as const,
      dark:  ['#06060f', '#0f0e18', '#140f2d'] as const,
    },
    gold: {
      light: ['#8b7cf6', '#6d5ae6'] as const,
      dark:  ['#8b7cf6', '#6d5ae6'] as const,
    },
    sheenViolet: {
      light: ['rgba(139,124,246,0.06)', 'transparent 60%'] as const,
      dark:  ['rgba(139,124,246,0.10)', 'transparent 60%'] as const,
    },
    sheenGreen: {
      light: ['rgba(16,185,129,0.06)', 'transparent 60%'] as const,
      dark:  ['rgba(16,185,129,0.10)', 'transparent 60%'] as const,
    },
    chromeRibbon: {
      light: ['rgba(0,0,0,0.06)', 'rgba(0,0,0,0.02)'] as const,
      dark:  ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)'] as const,
    },
  },
} as const;

export type ColorScheme = 'light' | 'dark';

export function getColors(isDark: boolean) {
  const c = COLORS;
  return {
    canvas:           isDark ? c.canvas.dark : c.canvas.light,
    card:             isDark ? c.card.dark : c.card.light,
    elevated:         isDark ? c.elevated.dark : c.elevated.light,
    border:           isDark ? c.border.dark : c.border.light,
    textPrimary:      isDark ? c.text['primary-dark'] : c.text.primary,
    textSecondary:    isDark ? c.text['secondary-dark'] : c.text.secondary,
    textMuted:        isDark ? c.text['muted-dark'] : c.text.muted,
    accentViolet:     c.accent.violet,
    accentVioletDark: c.accent['violet-dark'],
    accentAmber:      c.accent.amber,
    accentEmerald:    c.accent.emerald,
    accentOrange:     c.accent.orange,
    danger:           c.danger,
  };
}
