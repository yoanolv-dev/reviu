#!/usr/bin/env node
/**
 * Prépare une photo terrain (présentoir chez un client) pour le site :
 * redressement, recadrage vertical 4/5, amélioration (contraste, couleurs,
 * netteté, bruit), floutage des zones sensibles, export WebP léger.
 *
 *   node scripts/prepare-photo.mjs <source> <sortie.webp> [options]
 *
 * Options (fractions 0-1 de l'image, pour ne pas dépendre de sa taille) :
 *   --rotate=12             rotation en degrés (sens horaire), avant recadrage
 *   --crop=x,y,l,h          zone à garder, mesurée APRÈS rotation (le cadre 4/5
 *                           est ensuite pris au centre de cette zone)
 *   --blur=x,y,l,h          zone à flouter sur l'image FINALE (répétable) :
 *                           QR codes et codes imprimés, qui mènent à la fiche
 *                           d'un client réel
 *   --flat                  sans amélioration (recadrage et floutage seuls)
 *
 * sharp n'est pas une dépendance directe : on réutilise celui fourni avec Next.js.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));

const WIDTH = 1000;
const HEIGHT = 1250;

const [src, out, ...rest] = process.argv.slice(2);
if (!src || !out) {
  console.error("Usage : node scripts/prepare-photo.mjs <source> <sortie.webp> [--rotate=] [--crop=] [--blur=]… [--flat]");
  process.exit(1);
}

const opts = { rotate: 0, crop: null, blur: [], flat: false };
for (const arg of rest) {
  const [key, value] = arg.replace(/^--/, "").split("=");
  const box = () => {
    const n = value.split(",").map(Number);
    if (n.length !== 4 || n.some((v) => !(v >= 0 && v <= 1))) throw new Error(`Zone invalide : ${arg}`);
    return n;
  };
  if (key === "rotate") opts.rotate = Number(value);
  else if (key === "crop") opts.crop = box();
  else if (key === "blur") opts.blur.push(box());
  else if (key === "flat") opts.flat = true;
  else throw new Error(`Option inconnue : ${arg}`);
}

// 1. Orientation EXIF + rotation éventuelle (fond blanc, rogné ensuite).
let buf = await sharp(src)
  .rotate()
  .rotate(opts.rotate, { background: "#ffffff" })
  .toBuffer();

// 2. Zone utile, puis cadre 4/5 centré dans cette zone.
if (opts.crop) {
  const meta = await sharp(buf).metadata();
  const [x, y, w, h] = opts.crop;
  buf = await sharp(buf)
    .extract({
      left: Math.round(x * meta.width),
      top: Math.round(y * meta.height),
      width: Math.round(w * meta.width),
      height: Math.round(h * meta.height),
    })
    .toBuffer();
}

let img = sharp(buf).resize(WIDTH, HEIGHT, { fit: "cover", position: "centre", kernel: "lanczos3" });

// 3. Amélioration : léger débruitage (artefacts JPEG des photos de téléphone),
// contraste étiré sur les 1 %/99 %, couleurs un peu plus vives, netteté.
if (!opts.flat) {
  img = img
    .median(3)
    .normalise({ lower: 1, upper: 99 })
    .modulate({ brightness: 1.03, saturation: 1.12 })
    .sharpen({ sigma: 1.1, m1: 0.6, m2: 2.2 });
}
buf = await img.toBuffer();

// 4. Floutage des zones sensibles (sur l'image finale).
if (opts.blur.length) {
  const layers = [];
  for (const [x, y, w, h] of opts.blur) {
    const region = {
      left: Math.round(x * WIDTH),
      top: Math.round(y * HEIGHT),
      width: Math.max(1, Math.round(w * WIDTH)),
      height: Math.max(1, Math.round(h * HEIGHT)),
    };
    const input = await sharp(buf).extract(region).blur(14).toBuffer();
    layers.push({ input, left: region.left, top: region.top });
  }
  buf = await sharp(buf).composite(layers).toBuffer();
}

const info = await sharp(buf).webp({ quality: 80, effort: 6 }).toFile(out);
console.log(`${out} : ${info.width}×${info.height}, ${Math.round(info.size / 1024)} Ko`);
