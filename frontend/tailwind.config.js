/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dorado: '#c8a96e',
        oscuro: '#0a0a0a',
        carta: '#141414',
        borde: '#2a2a2a',
        crema: '#f0e6d3',
        gris: '#888888',
        gris2: '#666666',
        negro2: '#0d0d0d',
      },
    },
  },
  plugins: [],
}
