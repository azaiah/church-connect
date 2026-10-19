/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: { DEFAULT: '#101C2E', 2: '#182840' },
        linen: '#F6F2EA',
        paper: '#FFFFFF',
        gold: { DEFAULT: '#B8862B', light: '#D9A441', 50: '#FBF3E2' },
        royal: { DEFAULT: '#1F4E79', 50: '#E8EFF6' },
        slate: '#5B6472',
        line: '#E1DBD0',
        success: '#1E7A4C',
        warning: '#B7791F',
        danger: '#B42318',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,28,46,0.06), 0 4px 16px rgba(16,28,46,0.06)',
        lift: '0 8px 30px rgba(16,28,46,0.14)',
      },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        rays: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
      },
      animation: {
        pulseDot: 'pulseDot 1.2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        rays: 'rays 90s linear infinite',
      },
    },
  },
  plugins: [],
}
