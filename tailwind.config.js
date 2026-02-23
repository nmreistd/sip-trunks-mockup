/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        td: {
          purple: '#5a3ea0',
          'purple-dark': '#3d2875',
          'purple-light': '#ede9f8',
          'purple-hover': '#f3f0fa',
          'purple-border': '#c4b5f4',
        },
      },
    },
  },
  plugins: [],
}

