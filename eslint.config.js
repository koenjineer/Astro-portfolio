// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

// 既存コードの一括修正は別タスクとする運用のため、
// recommended ルールの error を warn に落として導入する。
function warnify(rules) {
  return Object.fromEntries(
    Object.entries(rules ?? {}).map(([name, value]) => {
      const entry = Array.isArray(value) ? value : [value];
      if (entry[0] === "error" || entry[0] === 2) {
        return [name, ["warn", ...entry.slice(1)]];
      }
      return [name, value];
    }),
  );
}

function warnifyConfigs(configs) {
  return configs.map((config) =>
    config.rules ? { ...config, rules: warnify(config.rules) } : config,
  );
}

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "public/**",
      "src/env.d.ts",
    ],
  },
  ...warnifyConfigs([js.configs.recommended]),
  ...warnifyConfigs(tseslint.configs.recommended),
  ...warnifyConfigs(astro.configs.recommended),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...warnify(react.configs.recommended.rules),
      ...warnify(reactHooks.configs.recommended.rules),
      ...warnify(jsxA11y.configs.recommended.rules),
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    files: ["**/*.astro/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    // astro/client のアンビエント型（ImageMetadata 等）は
    // ESLint の no-undef では解決できないため無効化する。
    files: ["**/*.astro"],
    rules: {
      "no-undef": "off",
    },
  },
);
