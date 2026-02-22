/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    { pattern: /(bg|text|border)-(emerald|red|amber|black)-(50|100|200|600|900)/ },
    { pattern: /bg-opacity-(25|50|75|100)/ } 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}