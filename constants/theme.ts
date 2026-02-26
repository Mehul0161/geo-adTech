// ========================================
// GeoAdTech — Design Theme
// ========================================

export const Colors = {
  // Primary palette
  primary: '#38bdf8',        // Sky blue
  primaryDark: '#0284c7',
  primaryLight: '#7dd3fc',

  // Accent
  accent: '#8b5cf6',         // Violet
  accentLight: '#a78bfa',

  // Backgrounds
  background: '#0f172a',     // Deep navy
  surface: '#1e293b',        // Slate 800
  surfaceLight: '#334155',   // Slate 700
  card: '#1e293b',

  // Text
  text: '#f8fafc',           // Slate 50
  textSecondary: '#94a3b8',  // Slate 400
  textMuted: '#64748b',      // Slate 500

  // Status
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#38bdf8',

  // Category colors
  categories: {
    hospital: '#ef4444',
    bridge: '#f59e0b',
    college: '#8b5cf6',
    metro: '#06b6d4',
    road: '#22c55e',
    government: '#3b82f6',
    other: '#64748b',
  } as Record<string, string>,

  // Misc
  border: '#334155',
  overlay: 'rgba(0, 0, 0, 0.6)',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  hero: 42,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};

export const StatusColors: Record<string, string> = {
  planned: '#f59e0b',
  'in-progress': '#38bdf8',
  completed: '#22c55e',
};
