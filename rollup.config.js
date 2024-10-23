import { terser } from "rollup-plugin-terser"; // Minification
import postcss from "rollup-plugin-postcss"; // CSS processing
import resolve from '@rollup/plugin-node-resolve'; // Resolving node_modules
import commonjs from '@rollup/plugin-commonjs'; // CommonJS module support

export default {
  input: "./components/index.js", // Main JS entry file
  output: {
    file: "dist/bundle.js", // Output bundled JavaScript file
    format: "iife", // Format for the browser
    name: "component", // Global variable name for the IIFE
  },
  plugins: [
    resolve(), // Helps Rollup find the node_modules
    commonjs(), // Converts CommonJS modules to ES6
    postcss({
      extract: "dist/bundle.css", // Output CSS file
      minimize: true, // Optional: Minify the CSS
      sourceMap: true, // Optional: Generate source maps
    }),
    terser(), // Minify JavaScript
  ],
};
