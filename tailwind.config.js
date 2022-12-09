/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/*.js',
    './pages/**/*.js',
    './components/*.js',
    './components/MultiStepForm/*.js'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'preScreen': "url('/pre-screen-instructions.jpg')",
        'index': "url('/bg.svg')"
      },
      screens: {
        'xs': '340px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
