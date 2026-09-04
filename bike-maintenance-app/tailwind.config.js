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
        // Canvas / page background — ivory, premium-paper feel
        canvas: {
          light: '#faf7f0',
          dark: '#06060f',
        },
        // Card surface
        card: {
          light: '#ffffff',
          dark: '#0d0d18',
        },
        // Elevated card (inner elements)
        elevated: {
          light: '#e8e9f0',
          dark: '#13131f',
        },
        // Border color
        border: {
          light: 'rgba(15,23,42,0.08)',
          dark: 'rgba(255,255,255,0.06)',
        },
        // Text colors — flat so dark: prefix works
        text: {
          primary:   '#0f172a',   // light canvas text
          secondary: '#4b5563',   // light secondary
          muted:     '#9ca3af',   // light muted
          'primary-dark':   '#e2e0ed',  // dark canvas text
          'secondary-dark': '#6b6b80',   // dark secondary
          'muted-dark':     '#8b8fa3',  // dark muted
        },
        // Brand accent (constant)
        brand: {
          dark: '#0f172a',
          card: '#1e293b',
          accent: '#38bdf8',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        premium: {
          violet: '#8b7cf6',
          'violet-dark': '#6d5ae6',
          amber: '#f59e0b',
          emerald: '#10b981',
          orange: '#f97316',
        },
        accent: {
          violet: '#8b7cf6',
          amber: '#f59e0b',
          emerald: '#10b981',
          orange: '#f97316',
        },
        danger: '#ef4444',
        warning: '#f59e0b',
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
