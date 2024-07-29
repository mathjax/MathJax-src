import eslint from "@eslint/js";
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from "typescript-eslint";

// For documentation see
// https://typescript-eslint.io/packages/typescript-eslint#config

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    jsdoc.configs['flat/recommended'],
    ...tseslint.configs.recommended
  ],
  languageOptions: {
    parserOptions: {
      project: true,
    }
  },
  files: ['ts/**/*.ts'],
  ignores: ["**/*.d.ts", "**/*.js"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-inner-declarations": "off",
    "prefer-const": ["error", {"destructuring": "all"}],
    "jsdoc/tag-lines": ["warn", "always", {"count": 0, "startLines": 1}],
    "jsdoc/require-param-type": "off",
    "jsdoc/require-returns-type": "off"
  }
});

