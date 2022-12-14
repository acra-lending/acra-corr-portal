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
      screens: {
        'sm': '340px'
      },
      backgroundImage: {
        'preScreen': "url('/pre-screen-instructions.jpg')",
        'index': "url('/bg.svg')"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
