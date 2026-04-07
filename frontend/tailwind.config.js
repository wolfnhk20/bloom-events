/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        blush: {
          50:  '#fdf2f5',
          100: '#fbe6ed',
          200: '#f7ccd9',
          300: '#f0a3b9',
          400: '#e87098',
          500: '#dc4878',
          600: '#c92e5e',
          700: '#a8214d',
          800: '#8c1e43',
          900: '#771d3c',
        },
        rose: {
          50:  '#fff1f2',
          500: '#f43f5e',
          600: '#e11d48',
        },
        cream: {
          50:  '#fefdf8',
          100: '#fdf9ec',
          200: '#faf3d4',
        },
        midnight: {
          800: '#1a0a12',
          900: '#12060d',
          950: '#0a0308',
        }
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 20% 50%, rgba(220,72,120,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168,33,77,0.1) 0%, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220,72,120,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(220,72,120,0.6)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
