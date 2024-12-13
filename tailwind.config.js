/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        //Photo by Ivan Torres on Unsplash
        'index_searchBG': "url('/src/assets/index/index_searchBG.jpg')", 
        //Photo by Delightin Dee on Unsplash
        'index_btns_f': "url('/src/assets/index/index_fineDining.jpg')", 
        //Photo by Brooke Lark on Unsplash
        'index_btns_b': "url('/src/assets/index/index_brunch.jpg')", 
        //Photo by Shengpengpeng Cai on Unsplash
        'index_btns_h': "url('/src/assets/index/index_hotPot.jpg')",
        //Photo by Farhad Ibrahimzade on Unsplash 
        'index_btns_j': "url('/src/assets/index/index_japan.jpg')", 
        //Photo by Philipp Kämmerer on Unsplash
        'index_btns_q': "url('/src/assets/index/index_bbq.jpg')", 
        //Photo by Jennie Brown on Unsplash
        'index_btns_d': "url('/src/assets/index/index_dessert.jpg')",
        //Photo by Luna Wang on Unsplash
        'index_btns_c': "url('/src/assets/index/index_chinese.jpg')",
        //Photo by Vicky Ng on Unsplash
        'index_btns_k': "url('/src/assets/index/index_korean.jpg')",
        //Photo by Kelly Sikkema on Unsplash
        'index_btns_a': "url('/src/assets/index/index_alchol.jpg')",
        //Photo by ibmoon Kim on Unsplash
        'index_btns_i': "url('/src/assets/index/index_izayaka.jpg')",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}