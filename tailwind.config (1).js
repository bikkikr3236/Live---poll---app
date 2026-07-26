/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#7765DA',
        light: '#F2F2F2',
        darkish: '#5767D0',
        dark: '#373737',
        accent: '#4F0DCE',
        grayish: '#6E6E6E',
      },
    },
  },
  plugins: [],
};
