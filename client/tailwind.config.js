module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this matches the path to all your components
  ],
  theme: {
    extend: {
      height: {
        '3333': '98%',
      },
      width: {
        'custom': '28rem', // Example custom width
        '72': '18rem',     // Another example
      },
      fontSize: {
        'xxl': '43px',// Custom xxlarge font size
      },
      colors: {
        'mooove': 'rgba(66, 34, 221, 0.3)',
        'mooove2': 'rgba(66, 34, 221, 0.22)',

      },
      animation: {
        reflect: 'reflect 3s infinite',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        reflect: {
          '0%': { transform: 'translateX(-100%) skew(-12deg)' },
          '100%': { transform: 'translateX(400%) skew(-12deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
