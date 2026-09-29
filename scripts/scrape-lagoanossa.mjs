/**
 * Coleta textos e fotos do site atual (lagoanossa.com.br, tema WordPress próprio) e grava:
 *   - src/data/scraped.json   (por slug: título, subtítulo, texto, foto de capa, galeria)
 *   - public/images/{modalidades,infraestrutura,historia,galeria,agenda,noticias}/...
 *
 * Estrutura do tema: título do item em <h1 class="title-page">, foto de capa como
 * background-image (wp-content/uploads), corpo entre o título e o rodapé (.container-fluid),
 * galeria como <img class="wp-image-N">.
 *
 * Uso: npm run scrape            (tudo)   |  node scripts/scrape-lagoanossa.mjs --only=galeria
 * Não sobrescreve imagens já baixadas.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const BASE = "https://lagoanossa.com.br";
const MODALIDADES = ["ballet-jazz", "basquete", "beach-tenis", "fisioterapia", "futebol", "futevolei", "futsal", "ginastica-funcional", "ginastica-localizada", "hidroginastica", "jiu-jitsu", "karate", "liberacao-miofascial-drenagem-e-ventosaterapia", "massagem-feminina", "musculacao", "natacao", "peteca", "pilates", "tenis", "volei", "yoga"];
const INFRA = ["area-familiar", "praia", "secretaria", "bares", "quiosques", "sinuca", "churrasqueira", "restaurante", "quadra-poliesportiva", "quadra-de-tenis", "escolas-de-artes-marciais", "campos-de-futebol", "estudio-de-pilates", "academia", "parquinho", "ginasio", "saunas", "piscinas"];
const PAGINAS = { historia: "/historia/", diretoria: "/diretoria/", direitos: "/direitos/", deveres: "/deveres/", funcionamento: "/funcionamento/", convenios: "/convenios/", contato: "/contato/", oportunidade: "/oportunidade/", ouvidoria: "/ouvidoria/", "piscina-termica": "/instalacoes/piscina-termica/", horarios: "/o-clube/horarios-das-atividades-do-country-clube-de-formiga/", programacao: "/programacao-esportiva" };
const CATEGORIAS = { faq: "/categoria/perguntas-frequentes/", agenda: "/categoria/agenda-de-eventos/", noticias: "/categoria/noticias/", galeria: "/categoria/galeria-de-fotos/" };
const HISTORIA_FOTOS = [1, 2, 3, 4, 5, 6].map((i) => `${BASE}/wp-content/uploads/2021/03/foto_historia${i}.jpg`);
const MAX_GALERIA = 12;

const only = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7);
const run = (name) => !only || only === name;
const out = JSON.parse(await fs.readFile("src/data/scraped.json", "utf8").catch(() => "{}"));

const decode = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&(r|l)squo;/g, (_, d) => (d === "r" ? "’" : "‘")).replace(/&(r|l)dquo;/g, (_, d) => (d === "r" ? "”" : "“")).replace(/&ndash;/g, "–").replace(/&mdash;/g, "—");
const strip = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/t[dh]>/gi, " | ").replace(/<\/(p|div|li|h[1-6]|tr|figure|figcaption)>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
const fullSize = (u) => u.replace(/-\d+x\d+(?=\.\w+$)/, "");
const isLogo = (u) => /LOGO-COUNTRY|logo-Country-Clube|logo_celula|themes\//i.test(u);

async function fetchPage(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (site-migration; +countryclubedeformiga)" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return await res.text();
}
function extract(html) {
  const titulo = strip((html.match(/<h1[^>]+class="[^"]*title-page[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) || [, ""])[1]);
  const capa = [...html.matchAll(/background(?:-image)?\s*:\s*url\(['"]?([^'")]+)/gi)].map((m) => m[1]).find((u) => /wp-content\/uploads/.test(u) && !isLogo(u)) || "";
  const start = html.search(/<h1[^>]+class="[^"]*title-page/i);
  let region = start >= 0 ? html.slice(start) : html;
  const end = region.search(/<div[^>]+class="container-fluid/i);
  if (end > 0) region = region.slice(0, end);
  region = region.replace(/<h1[\s\S]*?<\/h1>/i, "");
  const subtitulo = strip((region.match(/<h2(?![^>]*class)[^>]*>([\s\S]*?)<\/h2>/i) || [, ""])[1]);
  const galeria = [...region.matchAll(/<img[^>]+class="[^"]*wp-image-\d+[^"]*"[^>]+src="([^"]+)"/gi), ...region.matchAll(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*wp-image-\d+[^"]*"/gi)].map((m) => fullSize(m[1])).filter((u, i, a) => !isLogo(u) && a.indexOf(u) === i);
  const texto = strip(region.replace(/<img[^>]*>/gi, "")).replace(/\n*\s*Ver todas? (as|os) [^\n]*$/i, "").replace(new RegExp("^" + subtitulo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*"), "").trim();
  return { titulo, subtitulo, capa: capa ? fullSize(capa) : "", texto, galeria };
}
async function download(url, dest) {
  if (await fs.stat(dest).then(() => true, () => false)) return "kept";
  const res = await fetch(url); if (!res.ok) throw new Error(`${res.status} ${url}`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer())); return "ok";
}
const extOf = (u) => (path.extname(new URL(u).pathname) || ".jpg").toLowerCase().replace(".jpeg", ".jpg");
async function coverFor(item, dir, slug) {
  const src = item.capa || item.galeria[0] || "";
  if (!src) return "";
  const local = `/images/${dir}/${slug}${extOf(src)}`;
  await download(src, `public${local}`);
  return local;
}
async function group(name, slugs, prefix, dir) {
  if (!run(name)) return;
  out[name] = {};
  for (const slug of slugs) {
    const url = `${BASE}${prefix}${slug}/`;
    try {
      const data = extract(await fetchPage(url));
      const imagemLocal = await coverFor(data, dir, slug);
      const galeriaLocal = [];
      for (const [i, g] of data.galeria.slice(0, MAX_GALERIA).entries()) {
        if (g === data.capa) continue;
        const local = `/images/${dir}/${slug}-${i + 1}${extOf(g)}`;
        try { await download(g, `public${local}`); galeriaLocal.push(local); } catch (e) { console.log("  (galeria falhou)", g, e.message); }
      }
      out[name][slug] = { url, ...data, imagemLocal, galeriaLocal };
      console.log("ok", name, slug, "|", data.titulo, "|", imagemLocal ? "capa" : "SEM CAPA", "| galeria", galeriaLocal.length, "| texto", data.texto.length);
    } catch (e) { out[name][slug] = { url, erro: String(e.message) }; console.log("ERRO", name, slug, e.message); }
  }
}
function postLinks(html) {
  return [...html.matchAll(/href="(https?:\/\/(?:www\.)?lagoanossa\.com\.br\/[^"#?]+\/)"/gi)].map((m) => m[1].replace("://www.", "://"))
    .filter((u) => !/\/(categoria|category|tag|page|wp-|feed|author)\//.test(u) && u !== BASE + "/" && !Object.values(PAGINAS).some((p) => u === BASE + p) && !/\/(modalidades|infraestrutura|instalacoes|o-clube)\//.test(u))
    .filter((u, i, a) => a.indexOf(u) === i);
}
async function categoria(name, pathname, dir) {
  if (!run(name)) return;
  out[name] = { url: BASE + pathname, itens: {} };
  let html = "";
  const links = [];
  for (let page = 1; page <= 6; page++) {
    try { html = await fetchPage(page === 1 ? BASE + pathname : `${BASE}${pathname}page/${page}/`); } catch { break; }
    const found = postLinks(html).filter((u) => !links.includes(u));
    if (!found.length) break;
    links.push(...found);
  }
  console.log(name, "links:", links.length);
  for (const url of links) {
    const slug = url.replace(/\/$/, "").split("/").pop();
    try {
      const data = extract(await fetchPage(url));
      const imagemLocal = dir ? await coverFor(data, dir, slug) : "";
      const galeriaLocal = [];
      if (dir === "galeria") for (const [i, g] of data.galeria.slice(0, MAX_GALERIA).entries()) {
        const local = `/images/galeria/${slug}-${i + 1}${extOf(g)}`;
        try { await download(g, `public${local}`); galeriaLocal.push(local); } catch (e) { console.log("  (galeria falhou)", g, e.message); }
      }
      out[name].itens[slug] = { url, ...data, imagemLocal, galeriaLocal };
      console.log("ok", name, slug, "|", data.titulo, "| texto", data.texto.length, "| galeria", galeriaLocal.length);
    } catch (e) { out[name].itens[slug] = { url, erro: String(e.message) }; console.log("ERRO", name, slug, e.message); }
  }
}

await group("modalidades", MODALIDADES, "/modalidades/", "modalidades");
await group("infra", INFRA, "/infraestrutura/", "infraestrutura");
if (run("paginas")) {
  out.paginas = {};
  for (const [key, p] of Object.entries(PAGINAS)) {
    try { const data = extract(await fetchPage(BASE + p)); out.paginas[key] = { url: BASE + p, ...data }; console.log("ok pagina", key, "|", data.titulo, "| texto", data.texto.length); }
    catch (e) { out.paginas[key] = { url: BASE + p, erro: String(e.message) }; console.log("ERRO pagina", key, e.message); }
  }
}
if (run("faq")) {
  const html = await fetchPage(BASE + CATEGORIAS.faq);
  const cards = [...html.matchAll(/<button[^>]+btn-perguntas-respostas[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div[^>]+card-body[^>]*>([\s\S]*?)<\/div>/gi)];
  out.faq = { url: BASE + CATEGORIAS.faq, itens: cards.map((m) => ({ pergunta: strip(m[1]), resposta: strip(m[2]) })) };
  console.log("faq perguntas:", out.faq.itens.length);
}
await categoria("agenda", CATEGORIAS.agenda, "agenda");
await categoria("noticias", CATEGORIAS.noticias, "noticias");
await categoria("galeria", CATEGORIAS.galeria, "galeria");
if (run("historia")) for (const [i, u] of HISTORIA_FOTOS.entries()) {
  try { console.log("historia", i + 1, await download(u, `public/images/historia/foto_historia${i + 1}.jpg`)); } catch (e) { console.log("ERRO historia", i + 1, e.message); }
}
await fs.writeFile("src/data/scraped.json", JSON.stringify(out, null, 2) + "\n");
console.log("gravado src/data/scraped.json");
