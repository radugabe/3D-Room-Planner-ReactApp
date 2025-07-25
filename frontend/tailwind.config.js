/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '2xl': '2000px',
      },
      colors: {
        primary: '#96836f',
        primaryDark: '#A68C72',
        accent: '#8B6B4F',
        light: '#ede6de',
        dark: '#4D3E33',
        white: '#ffffff',
        beigeLight: '#f5f0e6',
        beige: '#e7dbc9',
        sand: '#d6c3ae',
        taupe: '#c2ad97'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 10px 20px rgba(0, 0, 0, 0.1)',
        hover: '0 15px 30px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};
