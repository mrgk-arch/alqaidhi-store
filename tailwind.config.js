/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'Cairo', 'sans-serif'],
        serif: ['Amiri', 'serif'],
      },
      colors: {
        gold: {
          50: '#FBF8EE',
          100: '#F5EBD0',
          200: '#EAD49B',
          300: '#DDB86B',
          400: '#D4AF37',
          500: '#C49A2E',
          600: '#A87F22',
          700: '#85621A',
          800: '#6B4E19',
          900: '#4E3915',
        },
        emerald: {
          50: '#E8F5EE',
          100: '#C7E8D4',
          200: '#92D3AC',
          300: '#5BBD87',
          400: '#33A065',
          500: '#1B7E48',
          600: '#126437',
          700: '#0D4B29',
          800: '#093A20',
          900: '#062817',
        },
        ink: {
          50: '#F5F5F4',
          100: '#E7E5E4',
          200: '#D6D3D1',
          300: '#A8A29E',
          400: '#78716C',
          500: '#57534E',
          600: '#44403C',
          700: '#292524',
          800: '#1A1A1A',
          900: '#0F0F0F',
          950: '#080808',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212,175,55,0)' },
        },
      },
    },
  },
  plugins: [],
};
