// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      /* 🎨 Match MUI default palette so brand colour feels familiar */
      colors: {
        primary: {
          DEFAULT: '#1976d2',
          foreground: '#ffffff',
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
      },
      /* Subtle elevated shadows that read well on light & dark */
      boxShadow: {
        card: '0 2px 6px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,.12)',
      },
      /* Handy animations – shadcn/ui already pulls tailwindcss-animate */
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn .4s ease-out both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
