// Rend toutes les compositions publicitaires en MP4 (H.264 + AAC) et une
// image d'aperçu par composition.
// Usage : node scripts/render-all.mjs [id1 id2 ...] [--stills-only]
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition, getCompositions } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(root, "out");
fs.mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2);
const stillsOnly = args.includes("--stills-only");
// Rendu en x2 (2160 x 3840) puis reduction Lanczos dans master.py : bords nets.
const scale = Number((args.find((a) => a.startsWith("--scale=")) || "--scale=2").split("=")[1]);
const wanted = args.filter((a) => !a.startsWith("--"));

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const browserExecutable = fs.existsSync(BROWSER) ? BROWSER : null;
const all = await getCompositions(serveUrl, { browserExecutable });
const ids = all
  .map((c) => c.id)
  .filter((id) => (wanted.length ? wanted.includes(id) : id.startsWith("Reviu")));

for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const poster = composition.defaultProps?.posterFrame ?? Math.round(composition.durationInFrames * 0.45);
  await renderStill({
    composition,
    serveUrl,
    browserExecutable,
    frame: poster,
    scale,
    output: path.join(outDir, `${id}.png`),
  });
  if (stillsOnly) continue;
  const t0 = Date.now();
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    browserExecutable,
    codec: "h264",
    scale,
    crf: 12,
    pixelFormat: "yuv420p",
    audioCodec: "aac",
    audioBitrate: "320k",
    imageFormat: "jpeg",
    jpegQuality: 95,
    concurrency: Math.max(2, (await import("node:os")).cpus().length - 1),
    outputLocation: path.join(outDir, `${id}.mp4`),
    colorSpace: "bt709",
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p !== last) {
        last = p;
        process.stdout.write(`${id} ${p * 10} %\n`);
      }
    },
  });
  console.log(`\n${id} : ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
