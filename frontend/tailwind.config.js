module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'sans-serif'],
      },
      colors: {
        tealLight:  '#88d8dd',
        tealMid:    '#46a4ab',
        tealBase:   '#07565f',
        tealBlue:   '#4282a3',
      },
      animation: {
        'fade-in': 'fadeIn 0.9s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};