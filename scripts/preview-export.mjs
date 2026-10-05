/**
 * Pós-processa a exportação estática (`out/`) para a prévia hospedada como Artifact do claude.ai,
 * onde o site fica sob um prefixo de caminho desconhecido e nomes iniciados por "_" são reservados.
 *
 * - move `_next` para `n/_next`;
 * - troca o marcador de basePath "/__BASE__" por caminhos relativos (HTML/RSC) e por
 *   `self.__ccBasePath` (JS), descoberto em tempo de execução;
 * - injeta em cada página um <base> relativo à raiz e um script que deriva o prefixo do roteador;
 * - escapa U+FFFD no polyfill (a hospedagem rejeita o caractere literal).
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const walk = async (dir) => (await Promise.all((await fs.readdir(dir, { withFileTypes: true })).map((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)])))).flat();

if (await fs.stat(path.join(OUT, "_next")).then(() => true, () => false)) {
  await fs.mkdir(path.join(OUT, "n"), { recursive: true });
  await fs.rename(path.join(OUT, "_next"), path.join(OUT, "n", "_next"));
}

const bootstrap = (depth) => `<base href="${depth ? "../".repeat(depth) : "./"}"><script>(function(){var r=document.baseURI;self.__ccRoot=r;try{self.__ccBasePath=new URL(r).pathname.replace(/\\/$/,"")}catch(e){self.__ccBasePath=""}})()</script>`;

let stats = { js: 0, html: 0, txt: 0, css: 0 };
for (const file of await walk(OUT)) {
  const ext = path.extname(file);
  if (![".js", ".html", ".txt", ".css"].includes(ext)) continue;
  let s = await fs.readFile(file, "utf8");
  const before = s;
  if (ext === ".js") {
    s = s.replaceAll('"/__BASE__/n/_next/"', 'self.__ccBasePath+"/n/_next/"')
         .replaceAll('"/__BASE__/n"', '(self.__ccBasePath+"/n")')
         .replaceAll('"/__BASE__"', 'self.__ccBasePath')
         .replaceAll("'/__BASE__'", 'self.__ccBasePath')
         .replaceAll("/__BASE__/", "./")
         .replaceAll('"�"', '"\\uFFFD"');
  } else if (ext === ".css") {
    // URLs em CSS resolvem em relação ao próprio arquivo (n/_next/static/css/…).
    s = s.replaceAll("/__BASE__/n/_next/static/", "../").replaceAll("/__BASE__/", "../../../../");
  } else {
    s = s.replaceAll("/__BASE__/", "./").replaceAll("/__BASE__", ".");
    if (ext === ".html") {
      const depth = path.relative(OUT, path.dirname(file)).split(path.sep).filter(Boolean).length;
      s = s.includes("<head>") ? s.replace("<head>", "<head>" + bootstrap(depth)) : bootstrap(depth) + s;
    }
  }
  if (s !== before) stats[ext.slice(1)]++;
  await fs.writeFile(file, s, "utf8");
}
const leftovers = [];
for (const file of await walk(OUT)) {
  if (![".js", ".html", ".txt", ".css"].includes(path.extname(file))) continue;
  const s = await fs.readFile(file, "utf8");
  if (s.includes("__BASE__") || s.includes("�")) leftovers.push(path.relative(OUT, file));
}
console.log("preview-export:", stats, leftovers.length ? `LEFTOVERS: ${leftovers.join(", ")}` : "ok");
if (leftovers.length) process.exit(1);
