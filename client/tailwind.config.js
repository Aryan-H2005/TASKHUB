/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Manrope', 'system-ui', 'sans-serif'] },
      colors: {
        ink: '#17262b',
        brand: { DEFAULT: '#0e7c86', dark: '#0a5e66', soft: '#e3f2f3' },
        paper: '#f4f6f6',
      },
    },
  },
  plugins: [],
};
