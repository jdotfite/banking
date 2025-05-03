/**
 * Banking App Theme Configuration
 * 
 * This file contains the theme configuration for the banking app.
 * It provides a centralized place for defining colors, spacing, typography, and other design tokens.
 * Using this theme ensures consistency across the application and makes it easier to update the design.
 */

export const theme = {
  /**
   * Color palette
   * 
   * The color system is organized into:
   * - base colors: primary brand colors
   * - semantic colors: colors with specific meanings (success, error, etc.)
   * - neutral colors: grays used for text, backgrounds, etc.
   * - component colors: specific colors for components
   */
  colors: {
    // Base colors
    primary: {
      main: '#7b2528', // Red color used for cards
      light: '#a13236',
      dark: '#5e1d1f',
      contrast: '#ffffff'
    },
    secondary: {
      main: '#333333', // Dark gray used for cards
      light: '#4d4d4d',
      dark: '#262626',
      contrast: '#ffffff'
    },
    
    // Semantic colors
    success: {
      main: '#4ade80', // Green for positive amounts
      light: '#86efac',
      dark: '#22c55e',
      contrast: '#ffffff'
    },
    error: {
      main: '#f87171', // Red for negative amounts
      light: '#fca5a5',
      dark: '#ef4444',
      contrast: '#ffffff'
    },
    warning: {
      main: '#fbbf24', // Yellow for warnings
      light: '#fcd34d',
      dark: '#f59e0b',
      contrast: '#000000'
    },
    info: {
      main: '#60a5fa', // Blue for information
      light: '#93c5fd',
      dark: '#3b82f6',
      contrast: '#ffffff'
    },
    
    // Neutral colors (dark theme)
    background: {
      app: '#121212', // App background (app-black)
      card: '#212121', // Card background
      cardHover: '#333333', // Card hover state
      input: '#1a1a1a', // Input background
      elevated: '#2c2c2c' // Elevated surfaces
    },
    text: {
      primary: '#ffffff', // Primary text
      secondary: '#a0a0a0', // Secondary text
      tertiary: '#6b7280', // Tertiary text
      disabled: '#4b5563' // Disabled text
    },
    border: {
      light: 'rgba(255, 255, 255, 0.1)', // Light border
      medium: 'rgba(255, 255, 255, 0.2)', // Medium border
      dark: 'rgba(255, 255, 255, 0.3)' // Dark border
    },
    
    // Component-specific colors
    components: {
      card: {
        signature: '#7b2528', // Signature card color
        platinum: '#333333' // Platinum card color
      },
      chart: {
        shopping: '#8b5cf6', // Purple
        food: '#f87171', // Red
        entertainment: '#60a5fa', // Blue
        transport: '#fbbf24', // Yellow
        other: '#4ade80' // Green
      },
      iconBackground: '#3b3b3b' // Icon background color
    }
  },
  
  /**
   * Typography
   * 
   * Defines font families, sizes, weights, and line heights
   */
  typography: {
    fontFamily: {
      base: 'Inter, system-ui, sans-serif',
      mono: 'monospace'
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  /**
   * Spacing
   * 
   * Defines spacing values for margins, paddings, and gaps
   */
  spacing: {
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem' // 384px
  },
  
  /**
   * Border radius
   * 
   * Defines border radius values for rounded corners
   */
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    md: '0.25rem', // 4px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px'
  },
  
  /**
   * Shadows
   * 
   * Defines box shadow values
   */
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  
  /**
   * Z-index
   * 
   * Defines z-index values for layering
   */
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50, // Default
    60: 60,
    70: 70,
    80: 80,
    90: 90,
    100: 100, // Dropdowns
    110: 110,
    120: 120,
    130: 130,
    140: 140,
    150: 150, // Modals/dialogs
    160: 160,
    170: 170,
    180: 180,
    190: 190,
    200: 200, // Toasts/notifications
    auto: 'auto'
  },
  
  /**
   * Transitions
   * 
   * Defines transition properties
   */
  transitions: {
    duration: {
      fastest: '50ms',
      faster: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '400ms',
      slowest: '500ms'
    },
    timing: {
      ease: 'ease',
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  },
  
  /**
   * Breakpoints
   * 
   * Defines screen size breakpoints for responsive design
   */
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

/**
 * Helper function to get a value from the theme
 * 
 * @param path - The path to the value in the theme object
 * @returns The value at the specified path
 * 
 * @example
 * // Get the primary color
 * const primaryColor = getThemeValue('colors.primary.main');
 */
export const getThemeValue = (path: string): any => {
  return path.split('.').reduce((obj, key) => obj && obj[key], theme as any);
};

export default theme;
