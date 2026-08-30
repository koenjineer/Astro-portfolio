import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // 静的書き出し時はNext.js Image最適化が使えないため
  },
};

export default nextConfig;
