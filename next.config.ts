import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // pnpm run buildで有効化される実験的機能がわかる。今はいかが有効化されている
    // - Experiments (use with caution):
    // ✓ cacheComponents
    // ✓ enablePrerenderSourceMaps (enabled by `experimental.cacheComponents`)
    // ✓ ppr (enabled by `experimental.cacheComponents`)
    // ✓ rdcForNavigations (enabled by `experimental.ppr`)
    // ✓ reactCompiler
    reactCompiler: true,
    cacheComponents: true,
  },
  images: {
    remotePatterns: [
      // 外部の画像を許可
      {
        protocol: "https",
        hostname: "images.dog.ceo",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
