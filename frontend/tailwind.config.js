module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'sans-serif'],
      },
      colors: {
        tealLight:  '#9cdee2',
        tealMid:    '#46a4ab',
        tealBase:   '#09747f',
        tealDark:   '#298389',
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
