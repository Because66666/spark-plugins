/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'dark': {
          '50': '#f6f7f9',
          '100': '#eceef2',
          '200': '#d5dae3',
          '300': '#b0baca',
          '400': '#8694ab',
          '500': '#667590',
          '600': '#515d77',
          '700': '#434d62',
          '800': '#3a4254',
          '900': '#343947',
          '950': '#23262f',
        },
        'primary': {
          '50': '#fff7ed',
          '100': '#ffedd5',
          '200': '#fed7aa',
          '300': '#fdba74',
          '400': '#fb923c',
          '500': '#f97316',
          '600': '#ea580c',
          '700': '#c2410c',
          '800': '#9a3412',
          '900': '#7c2d12',
          '950': '#431407',
        },
      },
      container: {
        center: true,
        padding: '2rem',
      },
    },
  },
  plugins: [],
}
