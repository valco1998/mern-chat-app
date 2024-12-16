module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // סורק את כל הקבצים עם הסיומות האלה בתיקיית src
    './public/index.html',             // סורק את הקובץ index.html בתיקיית public
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
