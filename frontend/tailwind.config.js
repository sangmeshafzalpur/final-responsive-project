/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chilli-primary': '#2E7D32',
        'chilli-light': '#E8F5E9',
        'chilli-red': '#D32F2F',
        'chilli-dark': '#8E1B1B',
      }
    },
  },
  plugins: [],
}
