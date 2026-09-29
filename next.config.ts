import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Photos are referenced by URL (club's WordPress uploads + placeholders) and
  // rendered with plain <img>/background-image, so the image optimizer is off.
  images: { unoptimized: true },
};

export default nextConfig;
