/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bluesky: {
          light: "#87CEEB",
          DEFAULT: "4682B4",
          Dark: "#1E3A8A",
        },
      },
      backdropBlur: {
        sm: '4px',
        md: '10px',
        lg: '20px',
      },
      boxShadow: {
        glass: "0 4px 10px rgba(0, 0, 0, 0.1)"
      },
      fontFamily: {
        Inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
}