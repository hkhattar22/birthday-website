/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf3e7',
        beige: '#f0e6d2',
        'muted-blue': '#6b8ca6',
        'forest-green': '#3d5a4a',
        'dark-navy': '#1a1f2e',
        'darker-navy': '#12161f',
        amber: {
          300: '#f0c75e',
          400: '#e8a93c',
          500: '#d99824',
        },
        coral: '#e07856',
        sky: '#7fb3d5',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
