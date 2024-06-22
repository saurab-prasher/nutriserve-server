import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Include Node.js globals
      },
    },
  },
  {
    files: ["**/*.browser.js"],
    languageOptions: {
      globals: {
        ...globals.browser, // Include browser globals for specific files
      },
    },
  },
  pluginJs.configs.recommended,
];
