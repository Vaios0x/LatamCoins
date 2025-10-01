/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta cyberpunk/Matrix
        matrix: {
          green: '#00ff41',
          'green-dark': '#008f11',
          'green-glow': '#00ff41',
        },
        cyber: {
          purple: '#a855f7',
          'purple-bright': '#d946ef',
          cyan: '#06b6d4',
          'cyan-bright': '#00ffff',
        },
        dark: {
          primary: '#0a0e27',
          secondary: '#000000',
          glass: 'rgba(10, 14, 39, 0.7)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      animation: {
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'glitch': 'glitch 0.3s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ticker-scroll': 'ticker-scroll 30s linear infinite',
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'neon-pulse': {
          '0%': { 
            textShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41',
            filter: 'brightness(1)',
          },
          '100%': { 
            textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
            filter: 'brightness(1.2)',
          },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%': { 
            boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41',
          },
          '100%': { 
            boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
          },
        },
        'ticker-scroll': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'matrix': '0 0 20px #00ff41',
        'glass': '0 8px 32px rgba(0, 255, 65, 0.1)',
        'glass-inset': 'inset 0 0 20px rgba(0, 255, 65, 0.05)',
        'neon': '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41',
      },
    },
  },
  plugins: [],
}
