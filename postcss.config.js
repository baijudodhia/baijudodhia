module.exports = {
  plugins: [
    require("postcss-import"), // Handle @import
    require("autoprefixer"),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
