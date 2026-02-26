/**
 * GeoAdTech — Theme Color Hook
 * Simplified: always uses dark theme
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  const colorFromProps = props.dark;
  if (colorFromProps) {
    return colorFromProps;
  }
  return (Colors as any)[colorName] ?? Colors.text;
}
