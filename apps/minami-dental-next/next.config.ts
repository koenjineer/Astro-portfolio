import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // URL設計がすべて末尾スラッシュ付き（/news/page/2/ など）のため。
  // 静的書き出しでは news/page/2/index.html の形で書き出され、リンク先と一致する
  trailingSlash: true,
  images: {
    unoptimized: true, // 静的書き出し時はNext.js Image最適化が使えないため
  },
};

export default nextConfig;
