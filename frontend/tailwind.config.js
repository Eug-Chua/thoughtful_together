module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // DM Sans is a close match to Claude's Styrene font
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Darker background inspired by Claude
        background: {
          DEFAULT: '#0a0a0f',
          100: '#0a0a0f',
          200: '#0f0f18',
          300: '#151520',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          hover: 'rgba(255, 255, 255, 0.08)',
          active: 'rgba(255, 255, 255, 0.12)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.15)',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
          tertiary: 'rgba(255, 255, 255, 0.5)',
        },
        accent: {
          DEFAULT: '#0088fd',
          hover: '#0070e0',
          light: '#3ba0ff',
        },
        // Vibrant blue-purple gradient colors
        blue: {
          bright: '#0088fd',
          royal: '#003bff',
          deep: '#001faa',
        },
        purple: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          vibrant: '#8b5cf6',
        },
        pink: {
          DEFAULT: '#ec4899',
          light: '#f472b6',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
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
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 136, 253, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 136, 253, 0.4)',
        'glow-purple': '0 0 30px rgba(124, 58, 237, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0088fd 0%, #003bff 50%, #7c3aed 100%)',
      },
    },
  },
  plugins: [],
};
