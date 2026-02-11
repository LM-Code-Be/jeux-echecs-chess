/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        board: {
          light: 'var(--board-light)',
          dark: 'var(--board-dark)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
        },
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
      },
      animation: {
        'piece-move': 'pieceMove 0.2s ease-in-out',
        'piece-capture': 'pieceCapture 0.3s ease-in-out',
        'check-pulse': 'checkPulse 1s ease-in-out infinite',
      },
      keyframes: {
        pieceMove: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        pieceCapture: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3) rotate(10deg)', opacity: '0.5' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        checkPulse: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
        },
      },
    },
  },
  plugins: [],
}
