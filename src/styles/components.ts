/**
 * Reusable component style objects.
 * These can be spread into inline styles or used as a reference for creating styled components.
 */

import { theme } from './theme';
import { CSSProperties } from 'react';

/**
 * Button styles by variant
 */
export const buttonStyles = {
  base: {
    padding: '12px 24px',
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    cursor: 'pointer',
    transition: theme.transition.colors,
    fontFamily: theme.typography.fontFamily.base,
  } as CSSProperties,

  variants: {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.text.primary,
    } as CSSProperties,

    success: {
      backgroundColor: theme.colors.success,
      color: theme.colors.text.primary,
    } as CSSProperties,

    warning: {
      backgroundColor: theme.colors.warning,
      color: theme.colors.gray[900],
    } as CSSProperties,

    danger: {
      backgroundColor: theme.colors.danger,
      color: theme.colors.text.primary,
    } as CSSProperties,

    secondary: {
      backgroundColor: theme.colors.gray[700],
      color: theme.colors.text.primary,
    } as CSSProperties,

    info: {
      backgroundColor: theme.colors.info,
      color: theme.colors.text.primary,
    } as CSSProperties,
  },

  sizes: {
    sm: {
      padding: '8px 16px',
      fontSize: theme.typography.fontSize.base,
    } as CSSProperties,

    md: {
      padding: '12px 24px',
      fontSize: theme.typography.fontSize.lg,
    } as CSSProperties,

    lg: {
      padding: '16px 32px',
      fontSize: theme.typography.fontSize.xl,
    } as CSSProperties,
  },

  states: {
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    } as CSSProperties,

    hover: {
      opacity: 0.9,
    } as CSSProperties,
  },
};

/**
 * Card/Panel styles
 */
export const cardStyles = {
  base: {
    backgroundColor: theme.colors.card.background,
    border: `1px solid ${theme.colors.card.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  } as CSSProperties,

  compact: {
    backgroundColor: theme.colors.card.background,
    border: `1px solid ${theme.colors.card.border}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  } as CSSProperties,

  active: {
    border: `2px solid ${theme.colors.card.borderActive}`,
  } as CSSProperties,
};

/**
 * Input styles
 */
export const inputStyles = {
  base: {
    padding: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.gray[600]}`,
    backgroundColor: theme.colors.gray[800],
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.base,
  } as CSSProperties,

  focus: {
    outline: 'none',
    borderColor: theme.colors.primary,
  } as CSSProperties,

  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  } as CSSProperties,
};

/**
 * Text styles
 */
export const textStyles = {
  heading: {
    h1: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.warning,
      margin: 0,
    } as CSSProperties,

    h2: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      margin: 0,
    } as CSSProperties,

    h3: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
      margin: 0,
    } as CSSProperties,
  },

  body: {
    primary: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.normal,
    } as CSSProperties,

    secondary: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.normal,
    } as CSSProperties,

    tertiary: {
      color: theme.colors.text.tertiary,
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.normal,
    } as CSSProperties,
  },

  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  } as CSSProperties,
};

/**
 * Layout styles
 */
export const layoutStyles = {
  flex: {
    row: {
      display: 'flex',
      flexDirection: 'row' as const,
    } as CSSProperties,

    column: {
      display: 'flex',
      flexDirection: 'column' as const,
    } as CSSProperties,

    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as CSSProperties,

    spaceBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as CSSProperties,
  },

  grid: {
    base: {
      display: 'grid',
      gap: theme.spacing.md,
    } as CSSProperties,

    cols2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing.md,
    } as CSSProperties,

    cols3: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: theme.spacing.md,
    } as CSSProperties,
  },
};

/**
 * Container styles
 */
export const containerStyles = {
  page: {
    minHeight: '100vh',
    background: theme.colors.game.tableBackground,
    color: theme.colors.text.primary,
    padding: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily.base,
  } as CSSProperties,

  centered: {
    margin: '0 auto',
    maxWidth: '1200px',
    width: '100%',
  } as CSSProperties,

  section: {
    marginBottom: theme.spacing['2xl'],
  } as CSSProperties,
};
