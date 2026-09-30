/** Redimensiona e comprime as fotos coletadas (public/images) para o repositório: máx. 1600px, JPEG q80. */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
const ROOT = "public/images";
const walk = async (d) => (await Promise.all((await fs.readdir(d, { withFileTypes: true })).map((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])))).flat();
let before = 0, after = 0, n = 0;
for (const f of await walk(ROOT)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f) || f.includes("/placeholder/")) continue;
  const stat = await fs.stat(f); before += stat.size;
  const img = sharp(f, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const isPhoto = meta.format !== "png" || (meta.width ?? 0) > 400;
  const target = isPhoto ? f.replace(/\.(png|webp|jpeg)$/i, ".jpg") : f;
  const buf = await img.resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })[isPhoto ? "jpeg" : "png"]({ quality: 80, mozjpeg: true }).toBuffer();
  if (buf.length < stat.size || target !== f) { await fs.writeFile(target, buf); if (target !== f) await fs.unlink(f); after += buf.length; } else after += stat.size;
  n++;
}
console.log(`compress-images: ${n} arquivos, ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
