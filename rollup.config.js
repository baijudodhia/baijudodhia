import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcssImport from "postcss-import";
import postcssUrl from "postcss-url";
import html from "rollup-plugin-html";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import url from "rollup-plugin-url";

const plugins = [
  // First postcss instance for component styles - injected into JS
  postcss({
    inject: true, // Inject into JS
    extract: false, // Don't extract component styles
    minimize: true,
    modules: false,
    sourceMap: false,
    include: ["**/components/**/*.css"], // Only process component styles
    plugins: [
      postcssImport(),
      postcssUrl({
        url: (asset) => {
          if (asset.url.startsWith("http")) {
            return asset.url;
          }
          return asset.url;
        },
        inline: true,
      }),
    ],
  }),
  // Second postcss instance for global styles - extracted to CSS file
  postcss({
    inject: false, // Don't inject global styles
    extract: "index.min.css", // Extract to CSS file
    minimize: true,
    modules: false,
    sourceMap: false,
    include: ["**/styles/**/*.css"], // Only process global styles
    plugins: [
      postcssImport(),
      postcssUrl({
        url: (asset) => {
          if (asset.url.startsWith("http")) {
            return asset.url;
          }
          return asset.url;
        },
        inline: true,
      }),
    ],
  }),
  url({
    include: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.gif", "**/*.woff", "**/*.woff2"],
    limit: 8192,
    emitFiles: true,
  }),
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    transformMixedEsModules: true,
  }),
  html({
    include: "**/*.html",
    minify: true,
  }),
  terser({
    format: {
      comments: false,
    },
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  }),
];

export default {
  input: "./lib/index.js",
  output: {
    file: "lib/dist/index.min.js",
    format: "iife",
    name: "Components",
    sourcemap: false,
  },
  plugins,
  treeshake: {
    moduleSideEffects: true,
    propertyReadSideEffects: false,
  },
};
