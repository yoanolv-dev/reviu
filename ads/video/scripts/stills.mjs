// Rend une serie d'images d'une composition et une planche contact.
// Usage : node scripts/stills.mjs <composition> <frames separees par des virgules> <sortie.jpg> [--cols=4]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const [id, framesArg, out] = process.argv.slice(2);
const cols = Number((process.argv.find((a) => a.startsWith("--cols=")) || "--cols=4").split("=")[1]);
const frames = framesArg.split(",").map(Number);
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable: BROWSER });
const tmp = fs.mkdtempSync(path.join(root, "out", "stills-"));
const files = [];
for (const f of frames) {
  const file = path.join(tmp, `f${String(f).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, browserExecutable: BROWSER, frame: f, output: file });
  files.push(file);
}
execFileSync("python3", [path.join(root, "scripts/contact_sheet.py"), out, String(cols), ...files], { stdio: "inherit" });
