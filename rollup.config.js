import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import fs from "fs";
import path from "path";
import postcssImport from "postcss-import";
import postcssUrl from "postcss-url";
import html from "rollup-plugin-html";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import url from "rollup-plugin-url";

// Helper function to convert component names to valid JS identifiers
function toValidIdentifier(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/[^a-zA-Z0-9_$]/g, "");
}

// Recursive function to get component configurations
function getStyleConfigs(dir) {
  const configs = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach((item) => {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      configs.push(...getComponentConfigs(fullPath));
    } else if (item.isFile() && item.name.endsWith(".css")) {
      const componentName = path.basename(item.name, ".css");
      const componentDir = path.dirname(fullPath).replace(/\\/g, "/");

      const outputFilePath = `lib/dist/${componentDir.replace("^(lib/)$", "")}/${componentName}.min.css`.replace("/lib/", "/");
      const outputFileName = toValidIdentifier(componentName.charAt(0).toUpperCase() + componentName.slice(1));

      configs.push({
        input: fullPath,
        output: {
          file: outputFilePath,
          assetFileNames: "[name].min.[extname]",
          sourcemap: false,
        },
        plugins: [
          postcss({
            extract: false,
            minimize: true,
            sourceMap: false,
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
            config: {
              path: "./postcss.config.js",
            },
          }),
          url({
            include: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.gif", "**/*.woff", "**/*.woff2"],
            limit: 8192,
            emitFiles: true,
          }),
          resolve(),
          commonjs(),
          html({
            include: "**/*.html",
          }),
          terser(),
        ],
      });
    }
  });

  return configs;
}

// Recursive function to get component configurations
function getComponentConfigs(dir) {
  const configs = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach((item) => {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      configs.push(...getComponentConfigs(fullPath));
    } else if (item.isFile() && item.name.endsWith(".js")) {
      const componentName = path.basename(item.name, ".js");
      const componentDir = path.dirname(fullPath).replace(/\\/g, "/");

      const outputFilePath = `lib/dist/${componentDir.replace("^(lib/)$", "")}/${componentName}.min.js`.replace("/lib/", "/");
      const outputFileName = toValidIdentifier(componentName.charAt(0).toUpperCase() + componentName.slice(1));

      configs.push({
        input: fullPath,
        output: {
          file: outputFilePath,
          format: "iife",
          name: outputFileName,
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
          resolve(),
          commonjs(),
          html({
            include: "**/*.html",
          }),
          terser(),
        ],
      });
    }
  });

  return configs;
}

// Export all configurations
export default [...getStyleConfigs("./lib/styles/"), ...getComponentConfigs("./lib/")];
