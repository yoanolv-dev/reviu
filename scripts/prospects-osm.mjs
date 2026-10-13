#!/usr/bin/env node
/**
 * Importe des commerces de proximité depuis OpenStreetMap (données ouvertes
 * ODbL) dans la table `outreach_prospects`. Seuls les commerces qui ont
 * eux-mêmes publié une adresse e-mail sur leur fiche sont retenus.
 *
 *   node scripts/prospects-osm.mjs "Nîmes" "Montpellier" [--dry]
 *
 * Variables : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * --dry affiche un CSV sans rien écrire. Ré-exécutable sans doublon :
 * un e-mail déjà présent (ou désinscrit) n'est jamais réimporté.
 */

const CATEGORIES = {
  restaurant: ['amenity~"^(restaurant|fast_food)$"'],
  cafe: ['amenity="cafe"'],
  bar: ['amenity~"^(bar|pub)$"'],
  boulangerie: ['shop~"^(bakery|pastry|confectionery)$"'],
  coiffeur: ['shop="hairdresser"'],
  beaute: ['shop~"^(beauty|cosmetics|massage)$"'],
  fleuriste: ['shop="florist"'],
  boucherie: ['shop~"^(butcher|deli|cheese|greengrocer|wine)$"'],
  garage: ['shop~"^(car_repair|tyres|bicycle)$"'],
  hotel: ['tourism~"^(hotel|guest_house)$"'],
  commerce: ['shop~"^(clothes|shoes|gift|optician|books|toys|jewelry|pet|furniture|interior_decoration)$"'],
};

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const cities = args.filter((a) => !a.startsWith("--"));
if (cities.length === 0) {
  console.error('Usage : node scripts/prospects-osm.mjs "Nîmes" ["Ville"...] [--dry]');
  process.exit(1);
}

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

function categoryOf(tags) {
  const t = (k) => tags[k] ?? "";
  if (/^(restaurant|fast_food)$/.test(t("amenity"))) return "restaurant";
  if (t("amenity") === "cafe") return "cafe";
  if (/^(bar|pub)$/.test(t("amenity"))) return "bar";
  if (/^(bakery|pastry|confectionery)$/.test(t("shop"))) return "boulangerie";
  if (t("shop") === "hairdresser") return "coiffeur";
  if (/^(beauty|cosmetics|massage)$/.test(t("shop"))) return "beaute";
  if (t("shop") === "florist") return "fleuriste";
  if (/^(butcher|deli|cheese|greengrocer|wine)$/.test(t("shop"))) return "boucherie";
  if (/^(car_repair|tyres|bicycle)$/.test(t("shop"))) return "garage";
  if (/^(hotel|guest_house)$/.test(t("tourism"))) return "hotel";
  return "commerce";
}

async function fetchCity(city) {
  const filters = Object.values(CATEGORIES).flat();
  const body = filters
    .flatMap((f) => [`nwr(area.a)[${f}]["email"];`, `nwr(area.a)[${f}]["contact:email"];`])
    .join("\n");
  const query = `[out:json][timeout:120];
area["name"="${city.replace(/"/g, "")}"]["boundary"="administrative"]["admin_level"="8"]->.a;
(${body});
out tags;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": "reviu-prospects/1.0" },
    body: "data=" + encodeURIComponent(query),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status} pour ${city}`);
  const json = await res.json();
  const rows = [];
  for (const el of json.elements ?? []) {
    const tags = el.tags ?? {};
    const raw = (tags.email ?? tags["contact:email"] ?? "").split(/[;,\s]+/)[0].trim().toLowerCase();
    if (!EMAIL_RE.test(raw)) continue;
    rows.push({
      email: raw,
      business_name: tags.name ?? null,
      category: categoryOf(tags),
      city: tags["addr:city"] ?? city,
      website: tags.website ?? tags["contact:website"] ?? null,
      source: `osm:${el.type}/${el.id}`,
    });
  }
  return rows;
}

const all = new Map();
for (const city of cities) {
  const rows = await fetchCity(city);
  for (const r of rows) if (!all.has(r.email)) all.set(r.email, r);
  console.error(`${city} : ${rows.length} commerces avec e-mail`);
  await new Promise((r) => setTimeout(r, 2000)); // politesse envers Overpass
}
const rows = [...all.values()];

if (dry) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  console.log("email,business_name,category,city,website,source");
  for (const r of rows) console.log(Object.values(r).map(esc).join(","));
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis (ou --dry).");
  process.exit(1);
}
const headers = { apikey: key, Authorization: `Bearer ${key}`, "content-type": "application/json" };

const optRes = await fetch(`${url}/rest/v1/outreach_optouts?select=email`, { headers });
const optouts = new Set((await optRes.json()).map((o) => o.email));
const toInsert = rows.filter((r) => !optouts.has(r.email));

let inserted = 0;
for (let i = 0; i < toInsert.length; i += 200) {
  const chunk = toInsert.slice(i, i + 200);
  const res = await fetch(`${url}/rest/v1/outreach_prospects?on_conflict=email`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify(chunk),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status} : ${await res.text()}`);
  inserted += (await res.json()).length;
}
console.error(`${inserted} nouveaux prospects importés (${rows.length - inserted} déjà connus ou désinscrits).`);
