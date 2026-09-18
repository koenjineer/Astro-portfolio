// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

/**
 * 全ページに Tailwind のCSSを差し込む。
 * 以前使っていた @astrojs/tailwind は Astro 5 までしか動かないため、同じ動きをここで再現している
 * （Tailwind 本体は v3 のまま。v4 はクラスの効き方が変わるので上げていない）
 * @type {import("astro").AstroIntegration}
 */
const tailwindBaseStyles = {
  name: "tailwind-base-styles",
  hooks: {
    "astro:config:setup": ({ injectScript }) => {
      injectScript("page-ssr", 'import "/src/styles/tailwind.css";');
    },
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [tailwindBaseStyles, react()],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
      },
    },
  },
  output: "static",
  // Astro 7 の初期値 "jsx" はタグ間の空白や改行を消し、別タグの単語同士がくっつく。
  // Astro 5 までと同じ「見た目を変えない詰め方」に固定する
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  server: {
    host: true,
    port: 4321,
  },
});
