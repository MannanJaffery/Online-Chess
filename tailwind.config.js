/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dark-grid': 'linear-gradient(to bottom right, #0f0f0f, #111112), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Crect width=\'60\' height=\'60\' fill=\'none\' stroke=\'%23943be9\' stroke-opacity=\'0.08\' stroke-width=\'1\'/%3E%3C/svg%3E")'
      },
      backgroundSize: {
        'grid-size': '60px 60px',
      },
      keyframes: {
        floatGlow: {
          '0%': {
            transform: 'translate(0, 0) rotate(-30deg)',
          },
          '100%': {
            transform: 'translate(-30px, 20px) rotate(-33deg)',
          },
        },
      },
      animation: {
        floatGlow: 'floatGlow 10s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}

