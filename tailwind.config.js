/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#ff3a3a',
          600: '#ff1e00', // Ferrari red
          700: '#cf1500',
          800: '#b31200',
          900: '#921500',
          950: '#520800',
        },
        secondary: {
          50: '#edfcfc',
          100: '#d1f7f7',
          200: '#a8eeef',
          300: '#71e2e4',
          400: '#33ccd0',
          500: '#17b0b4',
          600: '#00d2be', // Mercedes teal
          700: '#0c7a7f',
          800: '#106265',
          900: '#115255',
          950: '#043538',
        },
        accent: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1f1f1f',
          950: '#121212', // Dark background
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        racing: ['Titillium Web', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'inner-md': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-lg': 'inset 0 4px 6px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};