/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EFF4FB', 100: '#D8E6F3', 200: '#B4CBE8', 300: '#85A9D4',
          400: '#5683BA', 500: '#3461A0', 600: '#254D87', 700: '#1E3D6E',
          800: '#1A365D', 900: '#122444', 950: '#0A1628',
        },
        brand: {
          orange: '#EA580C',
          'orange-light': '#FB923C',
          'orange-dark': '#C2410C',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(26,54,93,0.2)',
        'glow-orange': '0 4px 20px rgba(234,88,12,0.35)',
        'card': '0 4px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 12px 40px rgba(26,54,93,0.15)',
      },
      backgroundImage: {
        'grid-navy': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.5s ease both',
        'slide-right': 'slideRight 0.4s ease both',
        'scale-in': 'scaleIn 0.3s ease both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideRight: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
