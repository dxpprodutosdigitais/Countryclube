import type { NextConfig } from "next";

// Prévia estática (Artifact): PREVIEW_EXPORT=1 gera `out/` (HTML estático + chunks).
const preview = process.env.PREVIEW_EXPORT === "1";
// Produção estática (hospedagem comum, Nginx/Apache/Caddy): STATIC_EXPORT=1 gera `out/` para servir na raiz do domínio.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
    // "/__BASE__" é um marcador trocado em tempo de execução por scripts/preview-export.mjs.
  ...(preview ? { output: "export" as const, trailingSlash: true, basePath: "/__BASE__", assetPrefix: "/__BASE__/n" } : {}),
  // Com NEXT_PUBLIC_BASE_PATH (ex.: "/Countryclube" no GitHub Pages) o site é servido sob esse prefixo.
  ...(staticExport ? { output: "export" as const, trailingSlash: true, ...(process.env.NEXT_PUBLIC_BASE_PATH ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH } : {}) } : {}),
  // Photos are referenced by URL (club's WordPress uploads + placeholders) and
  // rendered with plain <img>/background-image, so the image optimizer is off.
  images: { unoptimized: true },
};

export default nextConfig;
