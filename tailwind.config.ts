import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        temple: {
          brown: '#2C1810',
          gold: '#D4AF37',
          'gold-light': '#F0D060',
          cream: '#FFF8E7',
        }
      },
      fontSize: {
        'base': ['18px', '1.6'],
        'lg': ['20px', '1.6'],
        'xl': ['22px', '1.6'],
        '2xl': ['26px', '1.4'],
        '3xl': ['30px', '1.3'],
      }
    },
  },
  plugins: [],
}

export default config
