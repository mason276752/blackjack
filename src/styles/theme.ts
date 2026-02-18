/**
 * Theme constants for consistent styling across the application.
 * Consolidates colors, spacing, typography, and other design tokens.
 */

export const theme = {
  // Color Palette
  colors: {
    // Primary colors
    primary: '#3b82f6',      // Blue
    success: '#22c55e',      // Green
    warning: '#fbbf24',      // Yellow/Gold
    danger: '#ef4444',       // Red
    info: '#8b5cf6',         // Purple (for AI features)

    // Gray scale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Slate scale (for backgrounds)
    slate: {
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },

    // Semantic colors
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      tertiary: '#64748b',
    },

    // Component-specific colors
    card: {
      background: 'rgba(30, 41, 59, 0.95)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderActive: 'rgba(59, 130, 246, 0.5)',
    },

    // Game-specific colors
    game: {
      tableBackground: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      chipBackground: '#1f2937',
      dealerArea: 'rgba(0, 0, 0, 0.2)',
    },
  },

  // Spacing Scale (in pixels)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
  },

  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Typography
  typography: {
    fontFamily: {
      base: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '15px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '28px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.6',
    },
  },

  // Transitions
  transition: {
    fast: '0.1s',
    base: '0.2s',
    slow: '0.3s',
    all: 'all 0.2s ease',
    colors: 'background-color 0.2s ease, color 0.2s ease',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 10,
    modal: 100,
    tooltip: 1000,
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

// Type for theme colors
export type ThemeColor = keyof typeof theme.colors;

// Type for spacing values
export type ThemeSpacing = keyof typeof theme.spacing;
