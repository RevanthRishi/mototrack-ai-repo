/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        brand: {
          dark: '#0f172a',
          card: '#1e293b',
          accent: '#38bdf8',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        premium: {
          violet: '#8b7cf6',
          'violet-dark': '#6d5ae6',
          amber: '#f59e0b',
          emerald: '#10b981',
          orange: '#f97316',
        },
        surface: {
          dark: '#0b0c15',
          card: '#13131f',
          elevated: '#1a1a2e',
          border: 'rgba(255,255,255,0.08)',
        }
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(139,124,246,0.15)',
        'glow-amber': '0 0 40px rgba(245,158,11,0.15)',
        'glow-emerald': '0 0 40px rgba(16,185,129,0.15)',
      },
    },
  },
  plugins: [],
};
