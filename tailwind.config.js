/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    { pattern: /(bg|text|border)-(emerald|red|amber)-(50|100|200|600|900)/ }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}