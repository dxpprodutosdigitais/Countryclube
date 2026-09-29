/**
 * Coleta textos e fotos do site atual (lagoanossa.com.br, WordPress) para as páginas
 * listadas em CONTENT.md e grava:
 *   - src/data/scraped.json            (h1, texto, URL da imagem destacada por slug)
 *   - public/images/modalidades/<slug>.jpg, public/images/infraestrutura/<slug>.jpg,
 *     public/images/historia/foto_historiaN.jpg
 *
 * Uso: node scripts/scrape-lagoanossa.mjs [--only=modalidades|infra|paginas|historia]
 * Requer acesso de rede a lagoanossa.com.br. Não sobrescreve imagens já baixadas.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const BASE = "https://lagoanossa.com.br";
const MODALIDADES = ["ballet-jazz", "basquete", "beach-tenis", "fisioterapia", "futebol", "futevolei", "futsal", "ginastica-funcional", "ginastica-localizada", "hidroginastica", "jiu-jitsu", "karate", "liberacao-miofascial-drenagem-e-ventosaterapia", "massagem-feminina", "musculacao", "natacao", "peteca", "pilates", "tenis", "volei", "yoga"];
const INFRA = ["area-familiar", "praia", "secretaria", "bares", "quiosques", "sinuca", "churrasqueira", "restaurante", "quadra-poliesportiva", "quadra-de-tenis", "escolas-de-artes-marciais", "campos-de-futebol", "estudio-de-pilates", "academia", "parquinho", "ginasio", "saunas", "piscinas"];
const PAGINAS = { historia: "/historia/", diretoria: "/diretoria/", direitos: "/direitos/", deveres: "/deveres/", funcionamento: "/funcionamento/", convenios: "/convenios/", contato: "/contato/", oportunidade: "/oportunidade/", ouvidoria: "/ouvidoria/", "piscina-termica": "/instalacoes/piscina-termica/", faq: "/categoria/perguntas-frequentes/", agenda: "/categoria/agenda-de-eventos/", noticias: "/categoria/noticias/", galeria: "/categoria/galeria-de-fotos/", horarios: "/o-clube/horarios-das-atividades-do-country-clube-de-formiga/", programacao: "/programacao-esportiva" };
const HISTORIA_FOTOS = [1, 2, 3, 4, 5, 6].map((i) => `${BASE}/wp-content/uploads/2021/03/foto_historia${i}.jpg`);

const only = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7);
const out = JSON.parse(await fs.readFile("src/data/scraped.json", "utf8").catch(() => "{}"));

const decode = (s) => s.replace(/&#8217;|&rsquo;/g, "’").replace(/&#8216;|&lsquo;/g, "‘").replace(/&#8220;|&ldquo;/g, "“").replace(/&#8221;|&rdquo;/g, "”").replace(/&#8211;|&ndash;/g, "–").replace(/&#8212;|&mdash;/g, "—").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const strip = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

async function fetchPage(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (site-migration; +countryclubedeformiga)" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return await res.text();
}
function extract(html) {
  const h1 = strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ""])[1]);
  const og = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) || [, ""])[1];
  const body = (html.match(/<(?:div|article)[^>]+class=["'][^"']*(?:entry-content|post-content|elementor-widget-theme-post-content)[^"']*["'][^>]*>([\s\S]*?)(?:<footer|<div[^>]+class=["'][^"']*(?:post-tags|entry-footer|comments)|<\/article>)/i) || [, ""])[1];
  const imgs = [...html.matchAll(/https?:\/\/(?:www\.)?lagoanossa\.com\.br\/wp-content\/uploads\/[^\s"'<>)]+?\.(?:jpe?g|png|webp)/gi)].map((m) => m[0].replace(/-\d+x\d+(?=\.\w+$)/, "")).filter((v, i, a) => a.indexOf(v) === i);
  return { h1, og: og.replace(/-\d+x\d+(?=\.\w+$)/, ""), texto: strip(body), imagens: imgs };
}
async function download(url, dest) {
  if (await fs.stat(dest).then(() => true, () => false)) return "kept";
  const res = await fetch(url); if (!res.ok) throw new Error(`${res.status} ${url}`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer())); return "ok";
}
async function group(name, slugs, prefix, imgDir) {
  if (only && only !== name) return;
  out[name] ??= {};
  for (const slug of slugs) {
    const url = `${BASE}${prefix}${slug}/`;
    try {
      const data = extract(await fetchPage(url));
      const img = data.og || data.imagens[0] || "";
      let local = "";
      if (img) { local = `/images/${imgDir}/${slug}${path.extname(new URL(img).pathname) || ".jpg"}`; await download(img, `public${local}`); }
      out[name][slug] = { url, ...data, imagemLocal: local };
      console.log("ok", name, slug, data.h1, img ? "(foto)" : "(sem foto)");
    } catch (e) { out[name][slug] = { url, erro: String(e.message) }; console.log("ERRO", name, slug, e.message); }
  }
}
await group("modalidades", MODALIDADES, "/modalidades/", "modalidades");
await group("infra", INFRA, "/infraestrutura/", "infraestrutura");
if (!only || only === "paginas") {
  out.paginas ??= {};
  for (const [key, p] of Object.entries(PAGINAS)) {
    try { out.paginas[key] = { url: BASE + p, ...extract(await fetchPage(BASE + p)) }; console.log("ok pagina", key); }
    catch (e) { out.paginas[key] = { url: BASE + p, erro: String(e.message) }; console.log("ERRO pagina", key, e.message); }
  }
}
if (!only || only === "historia") {
  for (const [i, u] of HISTORIA_FOTOS.entries()) {
    try { console.log("historia", i + 1, await download(u, `public/images/historia/foto_historia${i + 1}.jpg`)); } catch (e) { console.log("ERRO historia", i + 1, e.message); }
  }
}
await fs.writeFile("src/data/scraped.json", JSON.stringify(out, null, 2) + "\n");
console.log("gravado src/data/scraped.json");
