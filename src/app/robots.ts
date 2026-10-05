import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Prévias (GitHub Pages, canais temporários) não devem ser indexadas.
  const previa = /github\.io|web\.app|firebaseapp\.com/.test(SITE.url);
  return {
    rules: previa ? [{ userAgent: "*", disallow: "/" }] : [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
