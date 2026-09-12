/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0F3D2E',
          50: '#F0F7F4',
          100: '#E4F1E8',
          200: '#C2DEC9',
          300: '#94C5A1',
          400: '#5BA372',
          500: '#3FA66B',
          600: '#155C41',
          700: '#0F3D2E',
          800: '#0A2A20',
          900: '#051812',
          950: '#020C09',
        },
        leaf: '#3FA66B',
        amber: {
          DEFAULT: '#E8A33D',
          light: '#FBEFDB',
          dark: '#9C6716'
        },
        sky: {
          DEFAULT: '#2E7BB6',
          light: '#E4EEF7',
          dark: '#1C537D'
        },
        coal: {
          DEFAULT: '#B0472F',
          light: '#F7E7E2',
          dark: '#7A2C1A'
        },
        paper: {
          DEFAULT: '#F6F4EC',
          card: '#FBFAF6',
          dark: '#0B0F0D',
          surface: '#121815',
          cardDark: '#16221C'
        },
        ink: {
          DEFAULT: '#16201B',
          soft: '#57655C',
          muted: '#8B9890'
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 61, 46, 0.08)',
        'elevated': '0 12px 32px -4px rgba(15, 61, 46, 0.14)',
        'glow-green': '0 0 24px rgba(63, 166, 107, 0.35)',
        'glow-amber': '0 0 24px rgba(232, 163, 61, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'flow': 'flow 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
