#!/usr/bin/env node
/**
 * Génère les 5 posts réseaux sociaux de reviu (série « boîte à outils de
 * l'avis Google ») en PNG, dans deux formats :
 *   - feed   1080 × 1350 (4:5) : Instagram, Facebook, LinkedIn
 *   - tiktok 1080 × 1920 (9:16) : TikTok (mode photo), Reels et stories
 *
 * Le format 9:16 garde le contenu dans la zone sûre de TikTok : rien
 * d'important en haut (onglets), à droite (boutons) ni en bas (légende).
 *
 * Lancement depuis la racine du dépôt (Inter doit être installée sur la
 * machine, Playwright et Chromium disponibles) :
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
  line: "#E6E8EF",
  cobaltText: "#DCE4FF",
};

const FORMATS = {
  feed: { w: 1080, h: 1350, pad: "72px 80px 72px 80px" },
  tiktok: { w: 1080, h: 1920, pad: "150px 120px 400px 80px" },
};

const LOGO = {
  couleur: asset("brand/logo/svg/reviu-logo-horizontal-couleur.svg"),
  encre: asset("brand/logo/svg/reviu-logo-horizontal-blanc-sur-encre.svg"),
  cobalt: asset("brand/logo/svg/reviu-logo-horizontal-blanc-sur-cobalt.svg"),
};

const STAR_PATH =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";
const star = (size, fill = C.gold) =>
  `<svg width="${size}" height="${size}" viewBox="2.5 2 19 18"><path d="${STAR_PATH}" fill="${fill}"/></svg>`;
const stars = (n, size, off = "#D5D9E2") =>
  `<span class="stars">${[0, 1, 2, 3, 4].map((i) => star(size, i < n ? C.gold : off)).join("")}</span>`;
const check = (size, bg = C.gold, fg = C.ink) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="flex:none"><circle cx="12" cy="12" r="12" fill="${bg}"/><path d="M7 12.4l3.2 3.1L17 8.8" fill="none" stroke="${fg}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cross = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="flex:none"><circle cx="12" cy="12" r="12" fill="#262B38"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="#FF8A80" stroke-width="2.2" stroke-linecap="round"/></svg>`;

/** Valeur selon le format : f(feed, tiktok). */
const pick = (fmt) => (a, b) => (fmt === "tiktok" ? b : a);

function header(logo, color) {
  return `<div class="hd"><img src="${LOGO[logo]}" style="height:58px"><span style="color:${color}">reviu.fr</span></div>`;
}

function cta(text, { bg, fg, icon = "" }) {
  return `<div class="cta" style="background:${bg};color:${fg}">${icon}${text}</div>`;
}

const ARROW = (color) =>
  `<svg width="30" height="30" viewBox="0 0 24 24" style="flex:none"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ------------------------------------------------------------------ */
/* Post 1 : un avis à 1 étoile se compense avec combien de 5 étoiles ? */
/* Calcul : k >= (note - 1) / (5 - note), indépendant du nombre d'avis */
/* (src/lib/rating.ts, fonction compensation).                         */
/* ------------------------------------------------------------------ */
function post1(fmt) {
  const f = pick(fmt);
  const rows = [
    { note: "4,2", k: 4 },
    { note: "4,6", k: 9 },
    { note: "4,8", k: 19 },
  ];
  const maxBar = f(430, 400);
  const row = ({ note, k }) => `
    <div class="p1-row">
      <div class="p1-note">${note}${star(f(40, 42))}</div>
      <div class="p1-bar-wrap">
        <div class="p1-bar" style="width:${Math.round((k / 19) * maxBar)}px"></div>
        <div class="p1-k">${k}</div>
      </div>
    </div>`;
  return {
    bg: C.brume,
    body: `
      ${header("couleur", C.ardoise)}
      <h1 class="h" style="font-size:${f(100, 96)}px;margin-top:${f(56, 64)}px">1 étoile = combien de <span class="c">5 étoiles</span>&nbsp;<span class="g">?</span></h1>
      <p class="sub" style="margin-top:${f(26, 32)}px">Après un avis à 1 étoile, le nombre d'avis 5 étoiles qu'il faut pour revenir à votre note de départ :</p>
      <div class="card p1-card" style="margin-top:${f(32, 40)}px">
        <div class="p1-head"><span>Votre note</span><span>Avis 5 étoiles nécessaires</span></div>
        ${rows.map(row).join("")}
      </div>
      <p class="p1-insight" style="margin-top:${f(32, 44)}px">Plus votre note est haute, plus un avis négatif pèse. La parade : demander un avis à tous vos clients, régulièrement<span class="g">.</span></p>
      <div class="grow"></div>
      <div class="foot">
        ${cta(`Calculez la vôtre sur reviu.fr/outils${ARROW("#fff")}`, { bg: C.cobalt, fg: "#fff" })}
        <p class="note" style="margin-top:20px">Estimation sur une moyenne simple, quel que soit votre nombre d'avis.</p>
      </div>`,
    css: `
      .p1-card{padding:${f(40, 44)}px ${f(48, 44)}px ${f(20, 24)}px}
      .p1-head{display:flex;justify-content:space-between;font-size:24px;font-weight:600;color:${C.ardoise};padding-bottom:18px;border-bottom:2px solid ${C.line}}
      .p1-row{display:flex;align-items:center;justify-content:space-between;padding:${f(20, 28)}px 0;border-bottom:2px solid ${C.line}}
      .p1-row:last-child{border-bottom:0}
      .p1-note{display:flex;align-items:center;gap:12px;font-size:${f(62, 66)}px;font-weight:800;letter-spacing:-0.03em;color:${C.ink}}
      .p1-bar-wrap{display:flex;align-items:center;gap:20px}
      .p1-bar{height:${f(40, 46)}px;border-radius:999px;background:${C.cobalt}}
      .p1-k{min-width:${f(80, 84)}px;text-align:right;font-size:${f(62, 66)}px;font-weight:800;letter-spacing:-0.03em;color:${C.cobalt}}
      .p1-insight{font-size:${f(31, 34)}px;font-weight:700;line-height:1.3;letter-spacing:-0.01em;color:${C.ink}}`,
  };
}

/* ------------------------------------------------------------------ */
/* Post 2 : 5 pratiques interdites par Google (règlement Maps)          */
/* ------------------------------------------------------------------ */
function post2(fmt) {
  const f = pick(fmt);
  const items = [
    "Offrir une remise, un cadeau ou un tirage au sort contre un avis",
    "Ne demander un avis qu'aux clients satisfaits",
    "Faire noter par vos salariés, vos proches ou vos fournisseurs",
    "Demander « 5 étoiles » plutôt qu'un avis sincère",
    "Imposer à votre équipe un quota d'avis",
  ];
  return {
    bg: C.ink,
    body: `
      ${header("encre", "#9AA3B5")}
      <h1 class="h" style="color:#fff;font-size:${f(92, 88)}px;margin-top:${f(56, 64)}px">Avis Google : ce qui est interdit<span class="g">.</span></h1>
      <div class="p2-list" style="margin-top:${f(40, 52)}px">
        ${items.map((t) => `<div class="p2-item">${cross(f(46, 50))}<span>${t}</span></div>`).join("")}
      </div>
      <div class="p2-ok" style="margin-top:${f(22, 30)}px">${check(f(46, 50))}<span>Autorisé : demander un avis à tous vos clients, sans contrepartie<span class="g">.</span></span></div>
      <div class="grow"></div>
      <div class="foot">
        ${cta(`Le guide complet sur reviu.fr/guides${ARROW(C.cobalt)}`, { bg: "#fff", fg: C.cobalt })}
        <p class="note" style="margin-top:20px;color:#9AA3B5">D'après le règlement Google sur les contenus publiés dans Maps.</p>
      </div>`,
    css: `
      .p2-list{display:flex;flex-direction:column;gap:${f(14, 18)}px}
      .p2-item,.p2-ok{display:flex;align-items:center;gap:26px;border-radius:28px;padding:${f(21, 26)}px 30px;font-size:${f(30, 31)}px;font-weight:600;line-height:1.28;color:#fff}
      .p2-item{background:#161A26}
      .p2-ok{background:${C.cobalt};font-weight:700}`,
  };
}

/* ------------------------------------------------------------------ */
/* Post 3 : répondre à un avis négatif en 5 étapes                      */
/* Méthode du guide /guides/repondre-avis-negatif.                      */
/* ------------------------------------------------------------------ */
function post3(fmt) {
  const f = pick(fmt);
  const n = (i) => `<span class="p3-n">${i}</span>`;
  // Pastille + premier mot insécables : la pastille ne reste jamais seule en fin de ligne.
  const nw = (i, word) => `<span class="nw">${n(i)}${word}</span>`;
  const steps = [
    "Remercier",
    "Montrer de l'empathie",
    "Répondre au point précis",
    "Proposer d'en parler en privé",
    "Signer d'un prénom",
  ];
  return {
    bg: "#fff",
    body: `
      ${header("couleur", C.ardoise)}
      <h1 class="h" style="font-size:${f(84, 74)}px;margin-top:${f(48, 64)}px">Avis négatif : répondez en <span class="c">5 étapes</span><span class="g">.</span></h1>
      <div class="p3-card" style="margin-top:${f(36, 52)}px">
        <div class="p3-tag">Exemple</div>
        <div class="p3-author">
          <div class="p3-avatar">M</div>
          <div><div class="p3-name">Mathieu</div><div class="p3-meta">${stars(2, 26)}<span>il y a 2 jours</span></div></div>
        </div>
        <p class="p3-review">« 45 minutes d'attente alors que nous avions réservé. Dommage, les plats étaient bons. »</p>
        <div class="p3-reply">
          <div class="p3-label">Réponse du propriétaire</div>
          <p>${nw(1, "Bonjour")} Mathieu, merci d'avoir pris le temps de nous écrire. ${nw(2, "Nous")} sommes sincèrement désolés pour cette attente. ${nw(3, "Ce")} n'est pas l'accueil que nous voulons offrir : nous revoyons l'organisation des réservations. ${nw(4, "Appelez-nous")} au restaurant, nous aimerions en parler avec vous. ${nw(5, "Julie,")} gérante</p>
        </div>
      </div>
      <div class="p3-steps" style="margin-top:${f(30, 44)}px">
        ${steps.map((s, i) => `<div class="p3-step">${n(i + 1)}<span>${s}</span></div>`).join("")}
      </div>
      <div class="grow"></div>
      <div class="foot">
        ${cta(`Générateur de réponses gratuit : reviu.fr/outils${ARROW("#fff")}`, { bg: C.cobalt, fg: "#fff" })}
      </div>`,
    css: `
      .p3-card{position:relative;background:${C.perle};border-radius:36px;padding:${f(34, 40)}px ${f(38, 40)}px}
      .p3-tag{position:absolute;top:30px;right:32px;background:#fff;color:${C.ardoise};font-size:20px;font-weight:700;padding:8px 18px;border-radius:999px}
      .p3-author{display:flex;align-items:center;gap:18px}
      .p3-avatar{width:60px;height:60px;border-radius:50%;background:${C.brume};color:${C.cobalt};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800}
      .p3-name{font-size:26px;font-weight:700;color:${C.ink}}
      .p3-meta{display:flex;align-items:center;gap:12px;margin-top:4px;font-size:20px;color:${C.ardoise}}
      .p3-review{margin-top:18px;font-size:${f(27, 29)}px;line-height:1.4;font-weight:500;color:${C.inkSoft}}
      .p3-reply{margin-top:22px;background:#fff;border-radius:24px;border-left:6px solid ${C.cobalt};padding:${f(24, 30)}px ${f(28, 30)}px}
      .p3-label{font-size:20px;font-weight:700;color:${C.ardoise};margin-bottom:10px}
      .p3-reply p{font-size:${f(25, 28)}px;line-height:1.55;font-weight:500;color:${C.ink}}
      .p3-n{display:inline-flex;align-items:center;justify-content:center;width:1.25em;height:1.25em;border-radius:50%;background:${C.cobalt};color:#fff;font-size:0.72em;font-weight:800;vertical-align:0.12em;margin-right:0.35em}
      .nw{white-space:nowrap}
      .p3-steps{display:grid;grid-template-columns:1fr 1fr;gap:${f(14, 18)}px 24px}
      .p3-step{display:flex;align-items:center;gap:6px;font-size:${f(27, 29)}px;font-weight:700;color:${C.ink}}`,
  };
}

/* ------------------------------------------------------------------ */
/* Post 4 : 3 phrases pour demander un avis sans gêne                   */
/* Phrases issues de src/lib/review-requests.ts (SPOKEN_PHRASES).       */
/* ------------------------------------------------------------------ */
function post4(fmt) {
  const f = pick(fmt);
  const phrases = [
    "Votre avis nous intéresse, qu'il soit bon ou qu'on ait des choses à améliorer.",
    "On est un petit commerce, chaque avis compte. Ça prend dix secondes, c'est juste là.",
    "Vous pouvez scanner le QR code pendant que je prépare votre ticket.",
  ];
  return {
    bg: C.perle,
    body: `
      ${header("couleur", C.ardoise)}
      <h1 class="h" style="font-size:${f(92, 88)}px;margin-top:${f(56, 64)}px">Demander un avis, sans être <span class="c">gênant</span><span class="g">.</span></h1>
      <p class="sub" style="margin-top:${f(26, 36)}px">Trois phrases à dire au moment de payer :</p>
      <div class="p4-list" style="margin-top:${f(34, 48)}px">
        ${phrases
          .map(
            (p, i) =>
              `<div class="p4-bubble ${i % 2 ? "r" : ""}"><span class="p4-q">“</span>${p}</div>`,
          )
          .join("")}
      </div>
      <div class="p4-rule" style="margin-top:${f(34, 48)}px">${check(f(42, 46), C.cobalt, "#fff")}<span>La même demande pour tous vos clients, sans contrepartie : c'est la règle de Google.</span></div>
      <div class="grow"></div>
      <div class="foot">
        ${cta(`Messages prêts à copier : reviu.fr/outils${ARROW("#fff")}`, { bg: C.cobalt, fg: "#fff" })}
      </div>`,
    css: `
      .p4-list{display:flex;flex-direction:column;gap:${f(20, 26)}px}
      .p4-bubble{position:relative;max-width:${f(820, 790)}px;background:#fff;border-radius:36px 36px 36px 10px;padding:${f(26, 30)}px ${f(34, 36)}px;font-size:${f(30, 32)}px;font-weight:600;line-height:1.35;color:${C.ink};box-shadow:0 2px 0 ${C.line}}
      .p4-bubble.r{align-self:flex-end;border-radius:36px 36px 10px 36px;background:${C.cobalt};color:#fff;box-shadow:none}
      .p4-q{display:block;font-size:64px;line-height:0.6;height:30px;color:${C.gold};font-weight:800}
      .p4-rule{display:flex;align-items:center;gap:22px;font-size:${f(28, 30)}px;font-weight:600;line-height:1.35;color:${C.inkSoft}}`,
  };
}

/* ------------------------------------------------------------------ */
/* Post 5 : où placer le Présentoir Reviu                               */
/* ------------------------------------------------------------------ */
function post5(fmt) {
  const f = pick(fmt);
  const tiles = [
    { img: "public/installations/presentoir-comptoir-accueil.webp", label: "À l'accueil", pos: "50% 62%" },
    { img: "public/installations/presentoir-table.webp", label: "Sur les tables", pos: "50% 55%" },
    { img: "public/installations/presentoir-debout-etagere.webp", label: "En vitrine", pos: "50% 60%" },
  ];
  const facts = ["29,90 € une seule fois", "Sans abonnement", "Livraison offerte"];
  return {
    bg: C.cobalt,
    body: `
      ${header("cobalt", C.cobaltText)}
      <h1 class="h" style="color:#fff;font-size:${f(92, 88)}px;margin-top:${f(56, 64)}px">Placez-le là où vos clients attendent<span class="g">.</span></h1>
      <div class="p5-tiles" style="margin-top:${f(44, 56)}px">
        ${tiles
          .map(
            (t) =>
              `<div class="p5-tile"><div class="p5-img" style="background-image:url(${asset(t.img)});background-position:${t.pos}"></div><div class="p5-label">${t.label}</div></div>`,
          )
          .join("")}
      </div>
      <p class="p5-text" style="margin-top:${f(36, 50)}px">Le client approche son téléphone ou scanne le QR code : votre page d'avis Google s'ouvre, sans application.</p>
      <div class="p5-facts" style="margin-top:${f(30, 40)}px">
        ${facts.map((t) => `<div class="p5-fact">${check(f(34, 36))}<span>${t}</span></div>`).join("")}
      </div>
      <div class="grow"></div>
      <div class="foot">
        ${cta(`Commander sur reviu.fr${ARROW(C.cobalt)}`, { bg: "#fff", fg: C.cobalt })}
      </div>`,
    css: `
      .p5-tiles{display:flex;gap:${f(22, 20)}px}
      .p5-tile{flex:1;display:flex;flex-direction:column;gap:16px}
      .p5-img{width:100%;aspect-ratio:${f("4/5", "3/4.4")};border-radius:28px;background-size:cover;border:4px solid rgba(255,255,255,0.18)}
      .p5-label{font-size:${f(28, 30)}px;font-weight:700;color:#fff;text-align:center}
      .p5-text{font-size:${f(31, 33)}px;font-weight:500;line-height:1.4;color:${C.cobaltText}}
      .p5-facts{display:flex;flex-wrap:wrap;gap:14px}
      .p5-fact{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.12);border-radius:999px;padding:14px 26px 14px 16px;font-size:${f(26, 28)}px;font-weight:600;color:#fff}`,
  };
}

const POSTS = [
  { id: "post-1-calculateur-note", build: post1 },
  { id: "post-2-pratiques-interdites", build: post2 },
  { id: "post-3-reponse-avis-negatif", build: post3 },
  { id: "post-4-demander-un-avis", build: post4 },
  { id: "post-5-ou-placer-le-presentoir", build: post5 },
];

function page(fmt, { bg, body, css }) {
  const { w, h, pad } = FORMATS[fmt];
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#fff;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;font-feature-settings:"cv11","ss01"}
    .post{width:${w}px;height:${h}px;padding:${pad};background:${bg};display:flex;flex-direction:column;overflow:hidden}
    .hd{display:flex;align-items:center;justify-content:space-between;font-size:26px;font-weight:600}
    .h{font-weight:800;line-height:1.04;letter-spacing:-0.03em;color:${C.ink}}
    .c{color:${C.cobalt}} .g{color:${C.gold}}
    .sub{font-size:${fmt === "tiktok" ? 34 : 31}px;font-weight:500;line-height:1.4;color:${C.inkSoft}}
    .card{background:#fff;border-radius:40px}
    .grow{flex:1;min-height:24px}
    .cta{display:inline-flex;align-items:center;gap:16px;border-radius:999px;padding:22px 36px;font-size:${fmt === "tiktok" ? 31 : 30}px;font-weight:700;letter-spacing:-0.01em}
    .note{font-size:21px;font-weight:500;color:${C.ardoise}}
    .stars{display:inline-flex;gap:2px}
    ${css}
  </style></head><body><div class="post">${body}</div></body></html>`;
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const tab = await ctx.newPage();
const tmp = join(tmpdir(), "reviu-posts");
mkdirSync(tmp, { recursive: true });
let overflow = 0;

for (const { id, build } of POSTS) {
  for (const fmt of Object.keys(FORMATS)) {
    const file = join(tmp, `${id}-${fmt}.html`);
    writeFileSync(file, page(fmt, build(fmt)));
    await tab.setViewportSize({ width: FORMATS[fmt].w, height: FORMATS[fmt].h });
    await tab.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
    await tab.evaluate(() => document.fonts.ready);
    // Garde-fou : le contenu ne doit jamais déborder du cadre.
    const over = await tab.evaluate(() => {
      const post = document.querySelector(".post");
      const grow = document.querySelector(".grow");
      return post.scrollHeight > post.clientHeight || (grow && grow.getBoundingClientRect().height < 24);
    });
    if (over) {
      overflow++;
      console.warn(`⚠ ${id} (${fmt}) : contenu trop haut pour le cadre`);
    }
    await tab.locator(".post").screenshot({ path: join(OUT, `${id}-${fmt}.png`) });
    console.log(`${id}-${fmt}.png`);
  }
}
await browser.close();
process.exit(overflow ? 1 : 0);
