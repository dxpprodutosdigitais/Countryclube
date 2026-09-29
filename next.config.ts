import type { NextConfig } from "next";

// Prévia estática (Artifact): PREVIEW_EXPORT=1 gera `out/` (HTML estático + chunks).
const preview = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `_next` não pode ser diretório raiz na hospedagem da prévia; assets ficam em /n/_next.
  ...(preview ? { output: "export" as const, trailingSlash: true, assetPrefix: "/n" } : {}),
  // Photos are referenced by URL (club's WordPress uploads + placeholders) and
  // rendered with plain <img>/background-image, so the image optimizer is off.
  images: { unoptimized: true },
};

export default nextConfig;
