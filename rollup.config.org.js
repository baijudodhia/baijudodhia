import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import html from "rollup-plugin-html";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

// // CSS Configuration
// const cssConfig = {
//   input: "lib/styles/index.css",
//   output: {
//     file: "styles.min.css",
//     assetFileNames: "[name][extname]",
//   },
//   plugins: [
//     postcss({
//       extract: true,
//       minimize: true,
//       sourceMap: false,
//       use: ["sass"],
//       extract: "lib/dist/styles.min.css",
//       config: {
//         path: "./postcss.config.js",
//       },
//     }),
//   ],
// };

// JavaScript Configuration for Components
const componentsJS = {
  input: "lib/components/base/index.js",
  output: {
    file: "lib/dist/base.min.js",
    format: "iife",
    name: "Components",
    sourcemap: false,
  },
  plugins: [
    postcss({
      extract: false,
      minimize: true,
      sourceMap: false,
      use: ["sass"],
      config: {
        path: "./postcss.config.js",
      },
    }),
    resolve(),
    commonjs(),
    html({
      include: "**/*.html",
    }),
    terser(),
  ],
};

// // JavaScript Configuration for Utils
// const utilsJS = {
//   input: "lib/utils/index.js",
//   output: {
//     file: "lib/dist/utils.min.js",
//     format: "iife",
//     name: "Utils",
//     sourcemap: false,
//   },
//   plugins: [resolve(), commonjs(), terser()],
// };

// Export the configuration
export default [componentsJS];
