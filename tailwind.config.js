/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        leaf: '#4ADE80',
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#92400E'
        },
        sky: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
          dark: '#1E40AF'
        },
        coal: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
          dark: '#991B1B'
        },
        paper: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          surface: '#F1F5F9',
          cardDark: '#F9FAFB'
        },
        ink: {
          DEFAULT: '#1E293B',
          soft: '#64748B',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(34, 197, 94, 0.08)',
        'elevated': '0 12px 32px -4px rgba(34, 197, 94, 0.12)',
        'glow-green': '0 0 24px rgba(74, 222, 128, 0.3)',
        'glow-amber': '0 0 24px rgba(245, 158, 11, 0.3)',
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
