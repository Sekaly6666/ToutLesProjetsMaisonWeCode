/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914', // Netflix red style or standard red
        dark: '#000000',
        light: '#FFFFFF'
      }
    },
  },
  plugins: [],
}
