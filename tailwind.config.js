/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFEDD5',
          soft: '#FFDDC1',
          deep: '#FDBA74',
        },
        charcoal: {
          DEFAULT: '#221F1D',
          soft: '#3A352F',
        },
        gold: {
          DEFAULT: '#E3A73B',
          light: '#F0C878',
          deep: '#C88A22',
        },
        sky: {
          DEFAULT: '#E7F1F4',
          deep: '#CFE4EA',
          line: '#B9D8E1',
        },
        clay: '#EA580C',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        utility: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      borderRadius: {
        soft: '1.75rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 30px 60px -25px rgba(34, 31, 29, 0.25)',
        soft: '0 10px 30px -12px rgba(34, 31, 29, 0.18)',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
