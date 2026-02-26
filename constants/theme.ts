// ========================================
// GeoAdTech — UI Theme (Stitch Inspired)
// ========================================

export const Colors = {
  // Primary palette - Deep Navy (Stitch)
  primary: '#1A237E',
  primaryDark: '#0D47A1',
  primaryLight: '#E8EAF6',

  // Accent - Orange/Yellow (Stitch)
  accent: '#FF9800',
  accentLight: '#FFC107',

  // Backgrounds - Light & Clean (Stitch)
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceLight: '#F0F4F7',
  card: '#FFFFFF',

  // Text
  text: '#212121',
  textSecondary: '#757575',
  textMuted: '#9E9E9E',

  // Status
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1',

  // Category colors - Stitch Inspired
  categories: {
    hospital: '#EF5350',     // Light Red
    bridge: '#FFA726',       // Light Orange
    college: '#AB47BC',
    metro: '#26C6DA',
    road: '#66BB6A',         // Light Green
    government: '#5C6BC0',
    other: '#78909C',
  } as Record<string, string>,

  // Misc
  border: '#E0E0E0',
  overlay: 'rgba(0, 0, 0, 0.5)',
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
  xl: 20,
  xxl: 26,
  hero: 36,
};

export const BorderRadius = {
  sm: 8,
  md: 15,
  lg: 20,
  xl: 30,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  premium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  }),
};

export const StatusColors: Record<string, string> = {
  planned: '#757575',
  'in-progress': '#FFC107',
  completed: '#2E7D32',
};
