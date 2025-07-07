import type { Config } from 'tailwindcss';

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'petal-magenta': '#ff00ff',
        'petal-gold': '#ffd700',
        'petal-blue': '#00ffff'
      },
      animation: {
        'rotate-monocleTick': 'spin 3s linear infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
