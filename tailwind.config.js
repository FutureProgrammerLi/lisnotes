/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './docs/.vitepress/*.{{vue,js,ts,jsx,tsx}',
    './docs/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

