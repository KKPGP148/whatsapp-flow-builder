/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'SF Pro Display',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      colors: {
        whatsapp: {
          light: '#25D366',
          deep: '#075e54',
          surfie: '#128c7e'
        }
      }
    },
  },
  plugins: [],
};