import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        zyr: {
          black: '#0B0B0B',
          graphite: '#333533',
          paper: '#F2ECDD',
          gold: '#F5CB5C',
          amber: '#CD9C20',
        },
      },
      boxShadow: {
        panel: '0 28px 80px rgba(11, 11, 11, 0.22)',
        soft: '0 16px 36px rgba(11, 11, 11, 0.14)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      gridTemplateRows: {
        dashboard: 'minmax(0,1fr) 6.8rem 5rem 7.6rem',
      },
    },
  },
  plugins: [],
};

export default config;
