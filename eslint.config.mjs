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
  ignores: ["**/*.d.ts", "**/*.js", "**/cjs/*"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["error",
                                          { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_",
                                            "caughtErrorsIgnorePattern": "^_" }
                                         ],
    "@typescript-eslint/no-empty-object-type": ["error", {"allowInterfaces": "with-single-extends"}],
    "@typescript-eslint/no-unused-expressions": ["error", { "allowTernary": true }],
    "prefer-const": ["error", {"destructuring": "all"}],
    "jsdoc/tag-lines": ["warn", "always", {"count": 0, "startLines": 1}]
  }
});

