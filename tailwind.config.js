const generateClasses = (prefix, count) => Array.from({ length: count }, (_, index) => `${prefix}-${index + 1}`);

const colStartClasses = generateClasses('col-start', 12);
const rowStartClasses = generateClasses('row-start', 12);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.tsx", "./**/*.ts"],
  theme: {
    extend: {},
  },
  options: {
    safelist: [
      ...colStartClasses,
      ...rowStartClasses,
    ],
  },
  plugins: [],
}

