// Tailwind v3 を PostCSS 経由で読む。@astrojs/tailwind（Astro 5 まで）が内部でしていたのと同じ組み合わせ
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
