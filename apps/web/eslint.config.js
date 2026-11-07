// Contrôle de correction seulement, comme apps/api : le style du code existant n'est pas imposé.
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "tests/**", "public/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
  {
    languageOptions: { globals: globals.browser },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-control-regex": "off",
      "prefer-const": "warn",
      "no-useless-escape": "warn",
      "vue/multi-word-component-names": "off",
      // TypeScript vérifie déjà les noms ; no-undef ignore les types du navigateur.
      "no-undef": "off"
    }
  }
);
