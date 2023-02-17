/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#FBD38D',
        'secondary': '#FAF4C0',
        'tertiary': '#E3C9A9',
        'quaternary': '#E6B8A2',
        'black': '#1E1E1E',
      },
      fontFamily: {
        dmSans: ['var(--font-dm-sans)'],
        heading: ['var(--font-poppins)'],
      },
    },
  },
  variants: {},
  plugins: [],
};
