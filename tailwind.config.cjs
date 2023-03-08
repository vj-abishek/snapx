/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-100': '#212529',
        'primary-200': '#343a40',
        'primary-300': '#495057',
        'primary-400': '#6c757d',
        'primary-500': '#adb5bd',
        'primary-600': '#ced4da',
        'primary-700': '#dee2e6',
        'primary-800': '#e9ecef',
        'primary-900': '#f8f9fa',
        'accent': '#0D6EAE',
        'dark-accent': '#363129'
      },
      fontFamily: {
        dmSans: ['var(--font-dm-sans)'],
        heading: ['var(--font-poppins)'],
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ],
};
