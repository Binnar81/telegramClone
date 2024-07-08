module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This enables dark mode
  theme: {
    extend: {
      screens: {
        'md': '768px',
      },
    },
  },
  plugins: [],
}