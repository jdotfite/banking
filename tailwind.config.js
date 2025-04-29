/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      outfit: ['var(--font-outfit)'],
    },
    extend: {
      colors: {
        card: {
          red: '#E53E3E', // Slightly adjusted red
          redLight: '#F56565', // For gradient
          redDark: '#C53030', // For gradient
        },
        app: {
        customGray: '#1A1A1A', // Exact gray from example
          black: '#121212', // Pure black for background
          darkGray: '#151515', // For transaction container
          mediumGray: '#2D3748', // For inactive icons
          lightGray: '#718096', // For text
          green: '#48BB78', // For positive transactions
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};





