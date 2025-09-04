const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      semi: ["error", "always"],
      quotes: ["error", "single"],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "no-console": "warn",
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
