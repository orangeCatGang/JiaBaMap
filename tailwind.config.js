/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'index_searchBG': "url('./src/assets/index_searchBG.jpg')",
      }
    },
  },
  plugins: [],
}