#!/usr/bin/env node
/**
 * Notifie IndexNow (Bing, Yandex, Seznam, Naver…) des pages nouvelles ou
 * modifiées. Bing alimente aussi Copilot et une partie des recherches de
 * ChatGPT : être indexé vite sur Bing compte pour la visibilité dans les IA.
 * Google n'utilise pas IndexNow (pour lui : sitemap + Search Console).
 *
 * À lancer APRÈS le déploiement en production (les URL doivent être en ligne) :
 *   node scripts/indexnow.mjs                    # toutes les URL du sitemap
 *   node scripts/indexnow.mjs --since 2026-10-12 # seulement celles modifiées depuis
 *   node scripts/indexnow.mjs --dry-run          # affiche sans envoyer
 *
 * La clé n'est pas un secret : elle est publiée dans public/<clé>.txt pour
 * prouver que l'on contrôle le domaine. Ne soumettre que des URL réellement
 * modifiées : des envois répétés d'URL inchangées dégradent la confiance.
 */

const HOST = "reviu.fr";
const KEY = "8a1bbe5d755ca4082b08939138ac96d9";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const sinceIdx = args.indexOf("--since");
const since = sinceIdx >= 0 ? args[sinceIdx + 1] : null;
if (since && !/^\d{4}-\d{2}-\d{2}$/.test(since)) {
  console.error("--since attend une date AAAA-MM-JJ");
  process.exit(1);
}

const res = await fetch(SITEMAP);
if (!res.ok) {
  console.error(`Sitemap inaccessible (${res.status}) : ${SITEMAP}`);
  process.exit(1);
}
const xml = await res.text();

const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1],
  lastmod: m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? "",
}));
const urls = entries
  .filter((e) => e.loc && (!since || e.lastmod.slice(0, 10) >= since))
  .map((e) => e.loc);

if (urls.length === 0) {
  console.log("Aucune URL à soumettre.");
  process.exit(0);
}

console.log(`${urls.length} URL à soumettre${since ? ` (modifiées depuis le ${since})` : ""}.`);
if (dryRun) {
  for (const u of urls) console.log(`  ${u}`);
  process.exit(0);
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls.slice(0, 10000),
};
const post = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
// 200 / 202 : accepté. 403 : clé invalide. 422 : URL hors domaine. 429 : trop d'envois.
console.log(`IndexNow : HTTP ${post.status}`);
if (post.status !== 200 && post.status !== 202) {
  console.error(await post.text());
  process.exit(1);
}
