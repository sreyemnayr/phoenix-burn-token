/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'flame-orange': '#F05F22',
        'flame-orange-2': '#F37D21',
        'flame-yellow': '#FEC833',
        'flame-pink': '#EB4C4D',
        'flame-deep-red': '#891212',
        'gabe-black': '#221910'
      },
    },
  },
  plugins: [],
}
