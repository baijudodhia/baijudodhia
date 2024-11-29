const fs = require("fs");
const path = require("path");

// Helper function to convert component names to valid JS identifiers
function toValidIdentifier(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/[^a-zA-Z0-9_$]/g, "");
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

      // Define HTML and CSS file paths
      const htmlFilePath = path.join(componentDir, `${componentName}.html`);
      const cssFilePath = path.join(componentDir, `${componentName}.css`);
      const outputFileName = toValidIdentifier(componentName.charAt(0).toUpperCase() + componentName.slice(1));

      // Ensure the directories exist for HTML and CSS files
      fs.mkdirSync(componentDir, { recursive: true });

      // Create empty HTML and CSS files
      fs.writeFileSync(htmlFilePath, "", "utf8");
      fs.writeFileSync(cssFilePath, "", "utf8");

      console.log(`Empty HTML file created: ${htmlFilePath}`);
      console.log(`Empty CSS file created: ${cssFilePath}`);
    }
  });

  return configs;
}

// Call the function with the target directory
getComponentConfigs("./lib/components/core/");
