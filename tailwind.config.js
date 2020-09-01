module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: ["./index.html", "./src/index.tsx", "./src/App.tsx"],
  /*
  purge: {
    enabled: true,
    content: ["./index.html", "./src/index.tsx", "./src/App.tsx"],
  },
  */
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
