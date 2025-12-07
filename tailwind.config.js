// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      colors:{
        black: 'var(--black)',
        greyWhite: 'var(--GreyWhite)',
        pureWhite: 'var(--PureWhite)',
        textColor: 'var(--text)',
      }
    },
  },
  plugins: [],
}
