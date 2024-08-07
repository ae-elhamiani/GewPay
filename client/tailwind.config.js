module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this matches the path to all your components
  ],
  theme: {
    extend: {
      width: {
        'custom': '28rem', // Example custom width
        '72': '18rem',     // Another example
      },
      fontSize: {
        'xxl': '43px',// Custom xxlarge font size
      },
    },
  },
  plugins: [],
}
