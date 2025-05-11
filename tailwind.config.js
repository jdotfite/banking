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
          dark: '#212121', // Custom card background color
        },
        app: {
          customGray: '#1A1A1A', // Exact gray from example
          black: '#121212', // Pure black for background
          darkGray: '#151515', // For transaction container
          mediumGray: '#2D3748', // For inactive icons
          lightGray: '#718096', // For text
          green: '#48BB78', // For positive transactions
        },
        neutral: {
          150: '#efefef', // midpoint between #f5f5f5 (100) and #e5e5e5 (200)
          250: '#dfdfdf', // midpoint between #e5e5e5 (200) and #d4d4d4 (300)
          350: '#bebebe', // midpoint between #d4d4d4 (300) and #a3a3a3 (400)
          450: '#8b8b8b', // midpoint between #a3a3a3 (400) and #737373 (500)
          550: '#636363', // midpoint between #737373 (500) and #525252 (600)
          650: '#484848', // midpoint between #525252 (600) and #404040 (700)
          750: '#333333', // midpoint between #404040 (700) and #262626 (800)
          850: '#1c1c1c', // midpoint between #262626 (800) and #171717 (900)
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      addUtilities(newUtilities);
    }
  ],
};
