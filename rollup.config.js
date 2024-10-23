import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

// CSS Configuration
const cssConfig = {
  input: "lib/styles/index.css", // Your main CSS entry point
  output: {
    file: "styles.min.css",
    assetFileNames: "[name][extname]",
  },
  plugins: [
    postcss({
      extract: true,
      minimize: true,
      sourceMap: true,
      use: ["sass"], // If you're using Sass
      extract: "lib/dist/styles.min.css",
      config: {
        path: "./postcss.config.js",
        ctx: {
          env: "production",
        },
      },
    }),
  ],
};

// JavaScript Configuration for Components
const componentsJS = {
  input: "lib/components/index.js",
  output: {
    file: "lib/dist/components.min.js",
    format: "iife",
    name: "Components",
    sourcemap: true,
  },
  plugins: [resolve(), commonjs(), terser()],
};

// JavaScript Configuration for Utils
const utilsJS = {
  input: "lib/utils/index.js",
  output: {
    file: "lib/dist/utils.min.js",
    format: "iife",
    name: "Utils",
    sourcemap: true,
  },
  plugins: [resolve(), commonjs(), terser()],
};

// Export the configuration
export default [utilsJS, cssConfig, componentsJS];
