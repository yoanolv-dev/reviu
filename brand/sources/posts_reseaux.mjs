#!/usr/bin/env node
/**
 * Génère les 5 posts réseaux sociaux de reviu en PNG, dans deux formats :
 *   - feed   1080 × 1350 (4:5) : Instagram, Facebook, LinkedIn
 *   - tiktok 1080 × 1920 (9:16) : TikTok (mode photo), Reels et stories
 *
 * Parti pris : une idée par post, un élément fort (chiffre, citation, photo),
 * pas de bouton ni de texte d'accompagnement. Grille : marges de 88 px.
 * En 9:16, tout le texte tient dans la zone sûre de TikTok (x ≤ 960,
 * 140 ≤ y ≤ 1520) : le haut, la droite et le bas sont recouverts par
 * l'interface. Le script échoue si un texte en sort.
 *
 * Lancement depuis la racine du dépôt (accès réseau pour Google Fonts,
 * Playwright et Chromium disponibles) :
 *   node brand/sources/posts_reseaux.mjs
 * Sortie : brand/reseaux/post-N-<sujet>-{feed,tiktok}.png
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Playwright est souvent installé globalement (NODE_PATH) : require le trouve,
// un import ESM non.
const { chromium } = createRequire(import.meta.url)("playwright");

const ROOT = resolve(import.meta.dirname, "../..");
const OUT = join(ROOT, "brand/reseaux");
const asset = (p) => pathToFileURL(join(ROOT, p)).href;

const C = {
  cobalt: "#1B4DFF",
  ink: "#0A0D16",
  gold: "#FBBC04",
  brume: "#EDF1FF",
  perle: "#F5F6F8",
  ardoise: "#6B7382",
  inkSoft: "#333A49",
  line: "#E1E4EC",
};

const SIZE = { feed: { w: 1080, h: 1350 }, tiktok: { w: 1080, h: 1920 } };
/** Zone sûre TikTok : ni onglets en haut, ni boutons à droite, ni légende en bas. */
const SAFE = { top: 140, right: 960, bottom: 1520 };

const LOGO = {
  couleur: asset("brand/logo/svg/reviu-logo-horizontal-couleur.svg"),
  blanc: asset("brand/logo/svg/reviu-logo-horizontal-blanc.svg"),
};
const logo = (v, h = 46) => `<img class="logo" src="${LOGO[v]}" style="height:${h}px">`;

const STAR =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";
const star = (size, fill) =>
  `<svg width="${size}" height="${size}" viewBox="2.5 2 19 18" style="display:block"><path d="${STAR}" fill="${fill}"/></svg>`;
const xMark = (size, color) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="flex:none"><path d="M6 6l12 12M18 6L6 18" stroke="${color}" stroke-width="3" stroke-linecap="round"/></svg>`;
const vMark = (size, color) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="flex:none"><path d="M4.5 12.5l5 5L19.5 7" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Le point de Plus Jakarta Sans est large (0,38 em) : on le rapproche du mot.
const g = (s) =>
  `<span style="color:${C.gold}${s === "." ? ";margin-left:-0.07em" : ""}">${s}</span>`;
const c = (s) => `<span style="color:${C.cobalt}">${s}</span>`;

/* ------------------------------------------------------------------ */
/* 1. Un avis à 1 étoile = 19 avis à 5 étoiles (à 4,8 de moyenne).      */
/* k = (note - 1) / (5 - note), cf. compensation() dans src/lib/rating. */
/* ------------------------------------------------------------------ */
function post1(fmt) {
  const t = fmt === "tiktok";
  const s = t ? 108 : 100;
  const grid = Array.from({ length: 20 }, (_, i) =>
    star(s, i === 0 ? "#2A3142" : C.gold),
  ).join("");
  return {
    bg: C.ink,
    html: `
      ${t ? `<div style="position:absolute;left:88px;top:150px">${logo("blanc")}</div>` : ""}
      <div style="position:absolute;left:88px;right:${t ? 120 : 88}px;top:${t ? 300 : 96}px">
        <h1 style="font-size:${t ? 100 : 96}px;color:#fff">1 avis à 1 étoile<br>= ${g("19")} avis<br>à 5 étoiles${g(".")}</h1>
        <div class="p1-grid" style="margin-top:${t ? 84 : 64}px;gap:${t ? 34 : 30}px;grid-template-columns:repeat(5,${s}px)">${grid}</div>
        <p style="margin-top:${t ? 84 : 60}px;font-size:${t ? 40 : 38}px;font-weight:700;color:#fff;line-height:1.3">Pour garder une note de 4,8.</p>
        <p style="margin-top:6px;font-size:${t ? 36 : 34}px;font-weight:500;color:#8C95A8;line-height:1.35">À 4,6, il en faut 9. À 4,2, il en faut 4.</p>
      </div>
      ${t ? "" : `<div style="position:absolute;left:88px;bottom:88px">${logo("blanc")}</div>`}`,
    css: `.p1-grid{display:grid}`,
  };
}

/* ------------------------------------------------------------------ */
/* 2. Ce que Google interdit (règlement des contenus publiés dans Maps) */
/* ------------------------------------------------------------------ */
function post2(fmt) {
  const t = fmt === "tiktok";
  const items = [
    "Offrir un café contre un avis",
    "Ne solliciter que les clients contents",
    "Faire noter vos salariés",
    "Afficher « Laissez-nous 5 étoiles »",
    "Fixer un quota d’avis à l’équipe",
  ];
  const band = t ? 1150 : 972;
  return {
    bg: "#fff",
    html: `
      ${t ? `<div style="position:absolute;left:88px;top:150px">${logo("couleur")}</div>` : ""}
      <div style="position:absolute;left:88px;right:${t ? 120 : 88}px;top:${t ? 290 : 96}px">
        <h1 style="font-size:${t ? 100 : 96}px">Ce que Google ${c("interdit")}${g(".")}</h1>
        <div style="margin-top:${t ? 56 : 44}px">
          ${items.map((s) => `<div class="p2-row"><span style="display:flex;transform:translateY(3px)">${xMark(t ? 34 : 32, C.cobalt)}</span><span>${s}</span></div>`).join("")}
        </div>
      </div>
      <div class="p2-band" style="top:${band}px">
        <div style="position:absolute;left:88px;right:${t ? 120 : 88}px;top:${t ? 92 : 64}px">
          <p style="font-size:${t ? 56 : 52}px;font-weight:800;line-height:1.08;letter-spacing:-0.025em;color:#fff;text-wrap:balance">Autorisé : demander un avis à tous vos clients${g(".")}</p>
          ${t ? "" : `<div style="margin-top:48px">${logo("blanc")}</div>`}
        </div>
      </div>`,
    css: `
      .p2-row{display:flex;align-items:center;gap:28px;padding:${t ? 32 : 26}px 0;border-bottom:2px solid ${C.line};font-size:${t ? 44 : 42}px;font-weight:600;letter-spacing:-0.015em;color:${C.ink}}
      .p2-row:last-child{border-bottom:0}
      .p2-band{position:absolute;left:0;right:0;bottom:0;background:${C.cobalt}}`,
  };
}

/* ------------------------------------------------------------------ */
/* 3. Avis négatif : la réponse à éviter et la bonne                    */
/* Méthode du guide /guides/repondre-avis-negatif.                      */
/* ------------------------------------------------------------------ */
function post3(fmt) {
  const t = fmt === "tiktok";
  const fs = t ? 37 : 36;
  return {
    bg: C.perle,
    html: `
      ${t ? `<div style="position:absolute;left:88px;top:150px">${logo("couleur")}</div>` : ""}
      <div style="position:absolute;left:88px;right:${t ? 120 : 88}px;top:${t ? 290 : 96}px">
        <h1 style="font-size:${t ? 96 : 92}px">Avis négatif :<br>la bonne ${c("réponse")}${g(".")}</h1>
        <div class="p3-review" style="margin-top:${t ? 64 : 60}px">
          <div class="p3-head">
            <div class="p3-av">S</div>
            <div>
              <div class="p3-name">Sophie</div>
              <div style="display:flex;gap:3px;margin-top:6px">${[0, 1, 2, 3, 4].map((i) => star(24, i ? "#D5D9E2" : C.gold)).join("")}</div>
            </div>
          </div>
          <p style="font-size:${fs}px">Une heure d’attente malgré le rendez-vous. Plus jamais.</p>
        </div>
        <div class="p3-reply bad" style="margin-top:${t ? 28 : 26}px">
          <div class="p3-tag">${xMark(24, C.ardoise)}À éviter</div>
          <p style="font-size:${fs}px">Le samedi, c’est complet. Il fallait prévoir.</p>
        </div>
        <div class="p3-reply good" style="margin-top:${t ? 20 : 20}px">
          <div class="p3-tag" style="color:${C.cobalt}">${vMark(26, C.cobalt)}La bonne réponse</div>
          <p style="font-size:${fs}px">Merci pour votre retour, et désolés pour cette attente : ce n’est pas notre façon de travailler. Appelez-nous au salon, nous voulons comprendre. Julie</p>
        </div>
      </div>
      ${t ? "" : `<div style="position:absolute;left:88px;bottom:88px">${logo("couleur")}</div>`}`,
    css: `
      .p3-review,.p3-reply{border-radius:30px;padding:${t ? 34 : 34}px ${t ? 36 : 36}px}
      .p3-review{background:#fff}
      .p3-review p{margin-top:20px;font-weight:500;line-height:1.38;color:${C.ink}}
      .p3-head{display:flex;align-items:center;gap:18px}
      .p3-av{width:56px;height:56px;border-radius:50%;background:#E8DCCB;color:#6B4E2E;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700}
      .p3-name{font-size:${t ? 30 : 27}px;font-weight:700;color:${C.ink};line-height:1}
      .p3-reply{margin-left:${t ? 56 : 64}px}
      .p3-reply p{margin-top:12px;font-weight:500;line-height:1.38}
      .p3-reply.bad{border:2px dashed #C9CED9}
      .p3-reply.bad p{color:${C.ardoise}}
      .p3-reply.good{background:#fff;box-shadow:inset 0 0 0 3px ${C.cobalt}}
      .p3-reply.good p{color:${C.ink}}
      .p3-tag{display:flex;align-items:center;gap:10px;font-size:${t ? 26 : 24}px;font-weight:700;color:${C.ardoise};letter-spacing:0.01em}`,
  };
}

/* ------------------------------------------------------------------ */
/* 4. La phrase à dire en caisse (même demande pour tous les clients)   */
/* ------------------------------------------------------------------ */
function post4(fmt) {
  const t = fmt === "tiktok";
  return {
    bg: C.cobalt,
    html: `
      ${t ? `<div style="position:absolute;left:88px;top:150px">${logo("blanc")}</div>` : ""}
      <div style="position:absolute;left:88px;right:${t ? 120 : 88}px;top:${t ? 330 : 190}px">
        <div class="p4-mark">“</div>
        <h1 style="font-size:${t ? 124 : 134}px;color:#fff;line-height:1">Votre avis nous aide, qu’il soit bon ou moins bon${g(".")}</h1>
      </div>
      <div style="position:absolute;left:88px;right:${t ? 120 : 88}px;${t ? "top:1290px" : "bottom:88px"}">
        <div style="height:2px;background:rgba(255,255,255,0.28)"></div>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-top:36px">
          <p style="font-size:${t ? 36 : 34}px;font-weight:600;line-height:1.3;color:#fff">La phrase à dire à chaque<br>client, au moment de payer.</p>
          ${t ? "" : logo("blanc")}
        </div>
      </div>`,
    css: `.p4-mark{font-size:${t ? 260 : 240}px;font-weight:800;color:${C.gold};line-height:0.8;height:${t ? 150 : 140}px;letter-spacing:0}`,
  };
}

/* ------------------------------------------------------------------ */
/* 5. Le produit en situation                                           */
/* ------------------------------------------------------------------ */
function post5(fmt) {
  const t = fmt === "tiktok";
  const photo = asset("brand/photos/etape-3.jpg");
  const text = `
    <h1 style="font-size:${t ? 100 : 96}px;color:#fff">Un geste,<br>un avis Google${g(".")}</h1>
    <p style="margin-top:${t ? 32 : 28}px;font-size:${t ? 36 : 34}px;font-weight:600;color:rgba(255,255,255,0.86)">Sans application<span class="sep">/</span>Sans abonnement<span class="sep">/</span>29,90&nbsp;€</p>`;
  if (t) {
    return {
      bg: C.ink,
      html: `
        <div style="position:absolute;left:0;top:0;width:1080px;height:1240px;background:url(${photo}) 38% 50%/cover"></div>
        <div style="position:absolute;left:0;top:900px;width:1080px;height:340px;background:linear-gradient(to bottom,rgba(10,13,22,0),${C.ink})"></div>
        <div style="position:absolute;left:88px;right:120px;top:1090px">${text}
          <div style="margin-top:48px">${logo("blanc")}</div>
        </div>`,
      css: `.sep{color:${C.gold};margin:0 18px}`,
    };
  }
  return {
    bg: C.ink,
    html: `
      <div style="position:absolute;inset:0;background:url(${photo}) 85% 30%/cover"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,13,22,0.94) 0%,rgba(10,13,22,0.8) 26%,rgba(10,13,22,0) 52%)"></div>
      <div style="position:absolute;left:88px;right:88px;bottom:88px">${text}
        <div style="margin-top:52px">${logo("blanc")}</div>
      </div>`,
    css: `.sep{color:${C.gold};margin:0 18px}`,
  };
}

const POSTS = [
  { id: "post-1-calculateur-note", build: post1 },
  { id: "post-2-pratiques-interdites", build: post2 },
  { id: "post-3-reponse-avis-negatif", build: post3 },
  { id: "post-4-demander-un-avis", build: post4 },
  { id: "post-5-ou-placer-le-presentoir", build: post5 },
];

/** Typographie française : espace fine insécable avant : ; ? ! et dans « ». */
const fr = (html) =>
  html
    .replace(/ ([:;?!»])/g, " $1")
    .replace(/« /g, "« ");

function page(fmt, { bg, html, css }) {
  const { w, h } = SIZE[fmt];
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=block">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}
    .post{position:relative;width:${w}px;height:${h}px;background:${bg};overflow:hidden}
    h1{font-weight:800;line-height:1.02;letter-spacing:-0.03em;word-spacing:0.03em;color:${C.ink};text-wrap:balance}
    p{text-wrap:pretty}
    .logo{display:block}
    ${css}
  </style></head><body><div class="post">${fr(html)}</div></body></html>`;
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage();
const tmp = join(tmpdir(), "reviu-posts");
mkdirSync(tmp, { recursive: true });
let errors = 0;

for (const { id, build } of POSTS) {
  for (const fmt of Object.keys(SIZE)) {
    const file = join(tmp, `${id}-${fmt}.html`);
    writeFileSync(file, page(fmt, build(fmt)));
    await tab.setViewportSize({ width: SIZE[fmt].w, height: SIZE[fmt].h });
    await tab.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
    await tab.evaluate(() => document.fonts.ready);
    // Garde-fou : textes dans le cadre (et dans la zone sûre en 9:16).
    const bad = await tab.evaluate(
      ({ fmt, SAFE, H }) => {
        const out = [];
        for (const el of document.querySelectorAll("h1,p,.logo,.p2-row,.p3-review,.p3-reply")) {
          const r = el.getBoundingClientRect();
          const lim =
            fmt === "tiktok"
              ? { top: SAFE.top, right: SAFE.right, bottom: SAFE.bottom }
              : { top: 60, right: 1020, bottom: H - 60 };
          if (r.top < lim.top || r.right > lim.right || r.bottom > lim.bottom)
            out.push(`${el.tagName.toLowerCase()} « ${el.textContent.trim().slice(0, 30)} » ${Math.round(r.top)}-${Math.round(r.bottom)} / x≤${Math.round(r.right)}`);
        }
        return out;
      },
      { fmt, SAFE, H: SIZE[fmt].h },
    );
    for (const b of bad) console.warn(`⚠ ${id} (${fmt}) : ${b}`);
    errors += bad.length;
    await tab.locator(".post").screenshot({ path: join(OUT, `${id}-${fmt}.png`) });
    console.log(`${id}-${fmt}.png`);
  }
}
await browser.close();
process.exit(errors ? 1 : 0);
