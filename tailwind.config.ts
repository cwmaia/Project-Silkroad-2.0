import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'scanlines': 'repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0, 0, 0, 0.25) 1px, rgba(0, 0, 0, 0.25) 2px)',
      },
      colors: {
        'terminal-black': '#0d0d0d',
        'terminal-text': '#e0e0e0',
        'terminal-cyan': '#00ffe0',
        'terminal-magenta': '#ff0080',
        'terminal-error': '#ff0033',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(0, 255, 224, 0.7)' },
          '50%': { opacity: '0.9', boxShadow: '0 0 0 10px rgba(0, 255, 224, 0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'flicker': 'flicker 2s linear infinite',
        'glitch': 'glitch 0.5s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slideUp': 'slideUp 0.3s ease-out',
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
