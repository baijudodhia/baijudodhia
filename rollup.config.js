import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcssImport from "postcss-import";
import postcssUrl from "postcss-url";
import html from "rollup-plugin-html";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import url from "rollup-plugin-url";
import { visualizer } from "rollup-plugin-visualizer"; // Add bundle analyzer
import json from "@rollup/plugin-json"; // For optimizing JSON imports
import replace from "@rollup/plugin-replace"; // For environment variables

// Shared PostCSS plugins to avoid duplication
const sharedPostcssPlugins = [
  postcssImport(),
  postcssUrl({
    url: (asset) => (asset.url.startsWith("http") ? asset.url : asset.url),
    inline: true,
  }),
];

const plugins = [
  // Replace process.env with static values
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env.DEBUG": "false",
  }),

  // Optimize JSON imports
  json({
    compact: true,
    preferConst: true,
  }),

  // Component styles - injected into JS
  postcss({
    inject: true,
    extract: false,
    minimize: true,
    modules: {
      generateScopedName: "[hash:base64:5]", // Shorter CSS class names
    },
    sourceMap: false,
    include: ["**/components/**/*.css"],
    plugins: sharedPostcssPlugins,
  }),

  // Global styles - extracted to CSS file
  postcss({
    inject: false,
    extract: "index.min.css",
    minimize: true,
    modules: false,
    sourceMap: false,
    include: ["**/styles/**/*.css"],
    plugins: sharedPostcssPlugins,
  }),

  // Optimize asset handling
  url({
    include: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.gif", "**/*.woff", "**/*.woff2"],
    limit: 4096, // Reduced from 8192 to inline fewer assets
    emitFiles: true,
    fileName: "[name][extname]",
  }),

  // Optimize resolution
  resolve({
    browser: true,
    preferBuiltins: false,
    mainFields: ["browser", "module", "main"], // Prioritize modern formats
    extensions: [".mjs", ".js", ".json", ".node"], // Limit extensions
  }),

  // Optimize CommonJS conversion
  commonjs({
    transformMixedEsModules: true,
    ignore: [/^(@babel\/runtime)/], // Ignore certain dependencies
    exclude: "node_modules/**",
  }),

  // Optimize HTML
  html({
    include: "**/*.html",
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
    },
  }),

  // Enhanced Terser configuration
  terser({
    format: {
      comments: false,
      ecma: 2020,
    },
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      passes: 3,
      ecma: 2020,
      module: true,
    },
    mangle: {
      properties: {
        regex: /^_/, // Mangle private properties starting with underscore
      },
    },
  }),

  // Bundle analyzer (optional - comment out in production)
  visualizer({
    filename: "bundle-analysis.html",
    gzipSize: true,
    brotliSize: true,
  }),
];

export default {
  input: "./lib/index.js",
  output: {
    file: "lib/dist/index.min.js",
    format: "iife",
    name: "Components",
    sourcemap: false,
    compact: true,
    generatedCode: "es2015", // Modern output
    hoistTransitiveImports: true,
    freeze: false, // Optimize Object.freeze() calls
  },
  plugins,
  treeshake: {
    moduleSideEffects: false, // More aggressive tree shaking
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
    unknownGlobalSideEffects: false,
  },
  // Add performance optimizations
  perf: true,
  shimMissingExports: true,
  strictDeprecations: true,

  // Exclude certain dependencies from bundle
  external: [
    // Add any large dependencies that should be external
    /^lodash/,
    /^@babel\/runtime/,
  ],
};
