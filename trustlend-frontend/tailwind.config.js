/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f766e',
          dark: '#0d5f58'
        }
      }
    },
  },
  plugins: [],
}
