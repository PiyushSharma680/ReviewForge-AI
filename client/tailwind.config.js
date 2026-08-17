/** @type {import('tailwindcss').Config} */
const tokens = require('./src/styles/tailwind.tokens');
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      ...tokens,
    },
  },
  plugins: [],
};
