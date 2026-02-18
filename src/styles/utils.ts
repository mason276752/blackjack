/**
 * Style utility functions for dynamic styling based on game state.
 */

import { theme } from './theme';
import { HandResult } from '../types/game.types';

/**
 * Get status color based on hand result and active state.
 * Used for player hand borders and status displays.
 *
 * @param result - Hand result (win, lose, push, blackjack, bust)
 * @param isActive - Whether the hand is currently active
 * @returns CSS color string
 *
 * @example
 * getStatusColor('win') // Returns '#22c55e' (green)
 * getStatusColor('lose') // Returns '#ef4444' (red)
 * getStatusColor(undefined, true) // Returns '#3b82f6' (blue, active hand)
 */
export function getStatusColor(result?: HandResult, isActive?: boolean): string {
  // Win states
  if (result === 'win' || result === 'blackjack') {
    return theme.colors.success;
  }

  // Lose states
  if (result === 'lose' || result === 'bust') {
    return theme.colors.danger;
  }

  // Push state
  if (result === 'push') {
    return theme.colors.warning;
  }

  // Active hand (no result yet)
  if (isActive) {
    return theme.colors.primary;
  }

  // Inactive/neutral state
  return theme.colors.gray[400];
}

/**
 * Get chip color based on chip value.
 * Used for betting chip displays.
 *
 * @param value - Chip value in dollars
 * @returns CSS color string
 *
 * @example
 * getChipColor(10) // Returns red chip color
 * getChipColor(100) // Returns black chip color
 */
export function getChipColor(value: number): string {
  if (value >= 500) return '#8b5cf6'; // Purple (high value)
  if (value >= 100) return '#1f2937'; // Black
  if (value >= 25) return '#22c55e';  // Green
  if (value >= 10) return '#3b82f6';  // Blue
  if (value >= 5) return '#ef4444';   // Red
  return '#ffffff';                    // White (default)
}

/**
 * Get count color based on true count value.
 * Used for card counting displays.
 *
 * @param trueCount - True count value
 * @returns CSS color string with semantic meaning
 *
 * @example
 * getCountColor(3) // Returns green (favorable)
 * getCountColor(-2) // Returns red (unfavorable)
 * getCountColor(0) // Returns gray (neutral)
 */
export function getCountColor(trueCount: number): string {
  if (trueCount >= 2) {
    return theme.colors.success;  // Favorable count
  }
  if (trueCount <= -1) {
    return theme.colors.danger;   // Unfavorable count
  }
  return theme.colors.text.secondary; // Neutral count
}

/**
 * Get action color based on strategy action code.
 * Used for strategy hint displays.
 *
 * @param action - Strategy action code (H, S, D, DH, DS, SP, SU)
 * @returns CSS color string
 *
 * @example
 * getActionColor('H') // Returns blue (hit)
 * getActionColor('S') // Returns red (stand)
 * getActionColor('D') // Returns green (double)
 */
export function getActionColor(action: string): string {
  switch (action) {
    case 'H':   // Hit
      return theme.colors.primary;
    case 'S':   // Stand
      return theme.colors.danger;
    case 'D':   // Double
    case 'DH':  // Double or Hit
    case 'DS':  // Double or Stand
      return theme.colors.success;
    case 'SP':  // Split
      return theme.colors.warning;
    case 'SU':  // Surrender
      return theme.colors.gray[500];
    default:
      return theme.colors.text.secondary;
  }
}

/**
 * Get background color for strategy table cells.
 * Slightly darker than action color for better text contrast.
 *
 * @param action - Strategy action code
 * @returns CSS color string with transparency
 */
export function getActionBackgroundColor(action: string): string {
  const baseColor = getActionColor(action);
  // Add transparency to base color
  return baseColor + '20'; // Append 20% opacity in hex
}

/**
 * Merge multiple style objects together.
 * Useful for combining base styles with conditional styles.
 *
 * @param styles - Array of style objects to merge
 * @returns Merged style object
 *
 * @example
 * mergeStyles(
 *   buttonStyles.base,
 *   buttonStyles.variants.primary,
 *   isDisabled && buttonStyles.states.disabled
 * )
 */
export function mergeStyles(...styles: (React.CSSProperties | false | undefined)[]): React.CSSProperties {
  return styles.reduce<React.CSSProperties>((acc, style) => {
    if (style) {
      return { ...acc, ...style };
    }
    return acc;
  }, {});
}

/**
 * Create responsive font size based on viewport.
 * Uses CSS clamp for fluid typography.
 *
 * @param minSize - Minimum font size in px
 * @param preferredSize - Preferred size in vw
 * @param maxSize - Maximum font size in px
 * @returns CSS clamp string
 *
 * @example
 * responsiveFontSize(14, 1, 18) // 'clamp(14px, 1vw, 18px)'
 */
export function responsiveFontSize(minSize: number, preferredSize: number, maxSize: number): string {
  return `clamp(${minSize}px, ${preferredSize}vw, ${maxSize}px)`;
}

/**
 * Convert pixel value to rem units.
 *
 * @param pixels - Pixel value
 * @param baseSize - Base font size (default 16)
 * @returns rem value as string
 *
 * @example
 * pxToRem(24) // '1.5rem'
 */
export function pxToRem(pixels: number, baseSize: number = 16): string {
  return `${pixels / baseSize}rem`;
}

/**
 * Get opacity value based on disabled state.
 *
 * @param disabled - Whether element is disabled
 * @returns Opacity value (0.5 if disabled, 1 if enabled)
 */
export function getOpacity(disabled: boolean): number {
  return disabled ? 0.5 : 1;
}

/**
 * Get cursor style based on disabled state.
 *
 * @param disabled - Whether element is disabled
 * @returns Cursor style string
 */
export function getCursor(disabled: boolean): string {
  return disabled ? 'not-allowed' : 'pointer';
}
