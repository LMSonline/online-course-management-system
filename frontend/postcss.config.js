// postcss.config.js (ở root, cùng cấp package.json)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // Tailwind v4 PostCSS plugin
    autoprefixer: {},
  },
};
