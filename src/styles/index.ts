/**
 * Central export for all theme-related modules.
 * Import from this file to access theme constants, component styles, and utilities.
 *
 * @example
 * import { theme, buttonStyles, getStatusColor } from '@/styles';
 */

export { theme } from './theme';
export type { ThemeColor, ThemeSpacing } from './theme';

export {
  buttonStyles,
  cardStyles,
  inputStyles,
  textStyles,
  layoutStyles,
  containerStyles,
} from './components';

export {
  getStatusColor,
  getChipColor,
  getCountColor,
  getActionColor,
  getActionBackgroundColor,
  mergeStyles,
  responsiveFontSize,
  pxToRem,
  getOpacity,
  getCursor,
} from './utils';
