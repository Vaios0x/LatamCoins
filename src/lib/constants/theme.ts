/**
 * Constantes de tema para LATAMCOINS
 * Paleta de colores cyberpunk/Matrix
 */

export const THEME_COLORS = {
  // Colores Matrix
  matrix: {
    green: '#00ff41',
    greenDark: '#008f11',
    greenGlow: '#00ff41',
  },
  
  // Colores cyberpunk
  cyber: {
    purple: '#a855f7',
    purpleBright: '#d946ef',
    cyan: '#06b6d4',
    cyanBright: '#00ffff',
  },
  
  // Colores oscuros
  dark: {
    primary: '#0a0e27',
    secondary: '#000000',
    glass: 'rgba(10, 14, 39, 0.7)',
    glassHover: 'rgba(10, 14, 39, 0.8)',
  },
  
  // Colores de estado
  status: {
    success: '#00ff41',
    error: '#ff0040',
    warning: '#ffaa00',
    info: '#00ffff',
  },
  
  // Colores de precio
  price: {
    up: '#00ff41',
    down: '#ff0040',
    neutral: '#ffffff',
  }
} as const;

export const GLASS_EFFECTS = {
  // Efectos de glassmorphism base
  card: {
    background: 'rgba(10, 14, 39, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 255, 65, 0.1)',
    boxShadowInset: 'inset 0 0 20px rgba(0, 255, 65, 0.05)',
  },
  
  // Efectos de hover
  cardHover: {
    background: 'rgba(10, 14, 39, 0.8)',
    border: '1px solid rgba(0, 255, 65, 0.4)',
    boxShadow: '0 12px 40px rgba(0, 255, 65, 0.15)',
    transform: 'translateY(-4px)',
  },
  
  // Efectos de botón
  button: {
    background: 'rgba(0, 255, 65, 0.1)',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    color: '#00ff41',
  },
  
  buttonHover: {
    background: 'rgba(0, 255, 65, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.6)',
    boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
    transform: 'translateY(-2px)',
  }
} as const;

export const ANIMATIONS = {
  // Duraciones de animación
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
    slower: '1s',
  },
  
  // Funciones de timing
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    cubicBezier: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Efectos de transición
  transitions: {
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  }
} as const;

export const TYPOGRAPHY = {
  // Familias de fuentes
  fontFamily: {
    sans: ['Inter', 'Poppins', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  
  // Tamaños de fuente
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  
  // Pesos de fuente
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  }
} as const;

export const BREAKPOINTS = {
  // Puntos de quiebre responsive
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  large: '1280px',
  xlarge: '1536px',
} as const;

export const SPACING = {
  // Espaciado consistente
  xs: '0.25rem',
  sm: '0.5rem',
  base: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
} as const;

export const BORDER_RADIUS = {
  // Radios de borde
  none: '0',
  sm: '0.25rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
} as const;

export const SHADOWS = {
  // Sombras personalizadas
  matrix: '0 0 20px #00ff41',
  glass: '0 8px 32px rgba(0, 255, 65, 0.1)',
  glassInset: 'inset 0 0 20px rgba(0, 255, 65, 0.05)',
  neon: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41',
  glow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
} as const;

export const Z_INDEX = {
  // Capas de z-index
  background: '-1',
  base: '0',
  dropdown: '10',
  sticky: '20',
  fixed: '30',
  modal: '40',
  popover: '50',
  tooltip: '60',
} as const;
