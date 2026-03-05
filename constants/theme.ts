// ========================================
// GeoAdTech — UI Theme (Stitch Inspired)
// ========================================

export const Colors = {
  // Primary palette - Sleek Deep Navy (Slate base)
  primary: '#0F172A',
  primaryDark: '#020617',
  primaryLight: '#F1F5F9',

  // Accent - Modern Rose/Coral
  accent: '#F43F5E',
  accentLight: '#FFE4E6',

  // Backgrounds - Clean & Airy
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  card: '#FFFFFF',

  // Text
  text: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Category colors - Vibrant & Professional
  categories: {
    hospital: '#F43F5E',     // Rose
    bridge: '#F59E0B',       // Amber
    college: '#8B5CF6',      // Violet
    metro: '#0EA5E9',        // Sky
    road: '#10B981',         // Emerald
    government: '#6366F1',   // Indigo
    other: '#64748B',        // Slate
  } as Record<string, string>,

  // Misc
  border: '#E2E8F0',
  overlay: 'rgba(0, 0, 0, 0.4)',
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
