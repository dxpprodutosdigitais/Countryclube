import type { MetadataRoute } from "next";
import { EVENTOS, MODALIDADES } from "@/data/content";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const PAGINAS = [
  "", "/historia", "/missao", "/diretoria", "/estatuto", "/infraestrutura", "/modalidades", "/agenda", "/galeria",
  "/funcionamento", "/convenios", "/faq", "/oportunidade", "/ouvidoria", "/contato", "/associado", "/associado/direitos", "/associado/deveres", "/secretaria",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    ...PAGINAS.map((p) => ({ url: `${SITE.url}${p}`, lastModified: agora, changeFrequency: (p === "" || p === "/agenda" ? "weekly" : "monthly") as "weekly" | "monthly", priority: p === "" ? 1 : 0.7 })),
    ...MODALIDADES.map((m) => ({ url: `${SITE.url}/modalidades/${m.id}`, lastModified: agora, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...EVENTOS.map((e) => ({ url: `${SITE.url}/agenda/${e.id}`, lastModified: agora, changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
