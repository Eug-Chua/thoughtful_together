module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Vercel-inspired dark palette
        background: {
          DEFAULT: '#0a0a0a',
          100: '#0a0a0a',
          200: '#111111',
          300: '#1a1a1a',
        },
        surface: {
          DEFAULT: '#171717',
          hover: '#262626',
          active: '#333333',
        },
        border: {
          DEFAULT: '#262626',
          hover: '#404040',
        },
        text: {
          primary: '#ededed',
          secondary: '#a1a1a1',
          tertiary: '#737373',
        },
        accent: {
          DEFAULT: '#0070f3',
          hover: '#0060df',
          light: '#3291ff',
        },
        success: '#00c853',
        warning: '#f5a623',
        error: '#ee0000',
        // Keep some subtle color accents
        violet: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
        },
        teal: {
          DEFAULT: '#14b8a6',
          light: '#5eead4',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.6 },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(112, 0, 243, 0.15)',
        'glow-lg': '0 0 40px rgba(112, 0, 243, 0.2)',
      },
    },
  },
  plugins: [],
};
