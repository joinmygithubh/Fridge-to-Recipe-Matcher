/** @type {import('tailwindcss').Config} */
export default {
  // Light theme only — a single warm light theme is the entire identity.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F2',
          100: '#E6EEE1',
          200: '#CFE0C5',
          300: '#A9C99A',
          400: '#7FAE6A',
          500: '#5C8F49',
          600: '#456B36',
          700: '#344F29',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FBF6EC',
          200: '#F5EBD6',
          300: '#EADCB8',
          400: '#DCC68C',
          500: '#C9A85F',
        },
        neutral: {
          50: '#FAFAF9',
          100: '#F0EFEC',
          200: '#E3E1DB',
          400: '#9C9A92',
          600: '#5C5A53',
          800: '#33322D',
          900: '#1F1E1A',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
