/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f0f0f2',
          100: '#dddde3',
          200: '#bbbbc8',
          300: '#9898ad',
          400: '#757592',
          500: '#535369',
          600: '#3f3f53',
          700: '#2c2c3d',
          800: '#1a1a28',
          900: '#0d0d18',
          950: '#07070f',
        },
        violet: {
          50:  '#f3f0ff',
          100: '#e5dcff',
          200: '#ccbbff',
          300: '#b299ff',
          400: '#9977ff',
          500: '#7c55f5',
          600: '#6640e8',
          700: '#5230c4',
          800: '#3e249a',
          900: '#2a186b',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
      },
      boxShadow: {
        'glow-violet': '0 0 24px 0 rgba(124,85,245,0.25)',
        'glow-sm':     '0 0 8px 0 rgba(124,85,245,0.18)',
      },
    },
  },
  plugins: [],
}
