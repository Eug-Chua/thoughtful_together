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
        tealDark:   '#086c77',
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