import QRCode from "qrcode";

/**
 * Générateur de QR code avis Google (outil gratuit du site) : fabrique, côté
 * navigateur, le QR seul et une affiche prête à imprimer, en SVG vectoriel.
 * Aucune donnée n'est envoyée au serveur. Module sans dépendance Node : il est
 * importé par un composant client.
 */

const INK = "#0a0d16";
const BRAND = "#1b4dff";
const GOLD = "#fbbc04";
const MUTED = "#6b7382";
const FONT = "Helvetica, Arial, sans-serif";
const STAR =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";

/** Hôtes reconnus comme des liens Google (fiche, avis, Maps, liens courts). */
const GOOGLE_HOST = /(^|\.)(google\.[a-z.]+|goo\.gl|g\.page|g\.co)$/i;

export type LinkCheck =
  | { ok: true; url: string; google: boolean }
  | { ok: false; error: string };

/** Identifiant de fiche Google (Place ID), ex. « ChIJN1t_tDeuEmsRUsoyG83frY4 ». */
const PLACE_ID = /^ChIJ[\w-]{10,}$/;

/**
 * Normalise et vérifie le lien saisi (ajoute https:// si besoin). Un Place ID
 * seul est converti en lien direct de rédaction d'avis Google.
 */
export function checkLink(raw: string): LinkCheck {
  const v = raw.trim();
  if (!v) return { ok: false, error: "Collez le lien de votre page d'avis Google." };
  if (PLACE_ID.test(v)) {
    return {
      ok: true,
      url: `https://search.google.com/local/writereview?placeid=${v}`,
      google: true,
    };
  }
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  let u: URL;
  try {
    u = new URL(withScheme);
  } catch {
    return { ok: false, error: "Ce lien n'est pas valide. Vérifiez qu'il est complet." };
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    return { ok: false, error: "Le lien doit commencer par https://" };
  }
  if (!u.hostname.includes(".")) {
    return { ok: false, error: "Ce lien n'est pas valide. Vérifiez qu'il est complet." };
  }
  return { ok: true, url: u.toString(), google: GOOGLE_HOST.test(u.hostname) };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Chemin SVG des modules sombres du QR, dans un carré `size` placé en (x, y). */
function qrPath(url: string, x: number, y: number, size: number): string {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const s = size / n;
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.get(r, c)) {
        d += `M${(x + c * s).toFixed(2)} ${(y + r * s).toFixed(2)}h${s.toFixed(2)}v${s.toFixed(2)}h-${s.toFixed(2)}z`;
      }
    }
  }
  return d;
}

/** QR code seul, en SVG vectoriel (marge de silence de 4 modules incluse). */
export function qrOnlySvg(url: string): string {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const n = qr.modules.size + 8;
  const size = 1000;
  const unit = size / n;
  const d = qrPath(url, 4 * unit, 4 * unit, qr.modules.size * unit);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="${INK}"/></svg>`;
}

/** Taille de police adaptée à la longueur d'un texte (affiche). */
function fit(text: string, base: number, soft: number, hard: number): number {
  if (text.length > hard) return Math.round(base * 0.68);
  if (text.length > soft) return Math.round(base * 0.82);
  return base;
}

export type PosterFormat = "affiche" | "carre";

/** Couleurs proposées pour le bandeau de l'affiche (le QR reste toujours noir). */
export const POSTER_COLORS = [
  { id: "cobalt", label: "Bleu", value: "#1b4dff", soft: "#dbe3ff" },
  { id: "encre", label: "Noir", value: "#0a0d16", soft: "#d9dbe1" },
  { id: "vert", label: "Vert", value: "#0f7b5f", soft: "#d3ece4" },
  { id: "bordeaux", label: "Bordeaux", value: "#9f1d35", soft: "#f3d9de" },
] as const;

export type PosterInput = {
  url: string;
  title: string;
  name: string;
  color?: string;
  soft?: string;
  format?: PosterFormat;
};

export const POSTER = { width: 1000, height: 1414 } as const;

/** Affiche (A6 / A5) ou carré (autocollant, carte), selon `format`. */
export function posterSvg(input: PosterInput): string {
  return input.format === "carre" ? squareSvg(input) : portraitSvg(input);
}

/**
 * Affiche A6 / A5 (ratio A) : bandeau coloré avec étoiles et titre, QR code
 * centré, nom de l'établissement et consigne de scan.
 */
function portraitSvg({
  url,
  title,
  name,
  color = BRAND,
  soft = "#dbe3ff",
}: PosterInput): string {
  const { width: W, height: H } = POSTER;
  const t = (title.trim() || "Votre avis compte !").slice(0, 40);
  const nm = name.trim().slice(0, 40);
  const qrSize = 500;
  const qrX = (W - qrSize) / 2;
  const qrY = 520;
  const stars = [0, 1, 2, 3, 4]
    .map((i) => {
      const x = W / 2 - 2.5 * 84 + i * 84 + 6;
      return `<path d="${STAR}" transform="translate(${x} 120) scale(3)" fill="${GOLD}"/>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><clipPath id="reviu-poster-card"><rect width="${W}" height="${H}" rx="56"/></clipPath></defs>
<g clip-path="url(#reviu-poster-card)">
<rect width="${W}" height="${H}" fill="#ffffff"/>
<path d="M0 0H${W}V394C${W * 0.78} 472 ${W * 0.58} 338 ${W * 0.38} 390S${W * 0.1} 468 0 426Z" fill="${soft}"/>
<path d="M0 0H${W}V372C${W * 0.78} 450 ${W * 0.58} 316 ${W * 0.38} 368S${W * 0.1} 446 0 404Z" fill="${color}"/>
${stars}
<text x="${W / 2}" y="268" text-anchor="middle" font-family="${FONT}" font-size="${fit(t, 66, 20, 28)}" font-weight="700" fill="#ffffff">${esc(t)}</text>
<text x="${W / 2}" y="328" text-anchor="middle" font-family="${FONT}" font-size="34" fill="#ffffff" fill-opacity="0.88">Laissez-nous un avis sur Google</text>
<rect x="${qrX - 28}" y="${qrY - 28}" width="${qrSize + 56}" height="${qrSize + 56}" rx="36" fill="#ffffff" stroke="#e6e8ef" stroke-width="4"/>
<path d="${qrPath(url, qrX, qrY, qrSize)}" fill="${INK}" shape-rendering="crispEdges"/>
<text x="${W / 2}" y="1138" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="700" fill="${INK}">Scannez avec l'appareil photo</text>
<text x="${W / 2}" y="1186" text-anchor="middle" font-family="${FONT}" font-size="30" fill="${MUTED}">de votre téléphone</text>
${nm ? `<text x="${W / 2}" y="1274" text-anchor="middle" font-family="${FONT}" font-size="${fit(nm, 44, 24, 32)}" font-weight="700" fill="${color}">${esc(nm)}</text>` : ""}
<text x="${W / 2}" y="1360" text-anchor="middle" font-family="${FONT}" font-size="22" fill="${MUTED}">QR code créé gratuitement sur reviu.fr</text>
</g>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="54" fill="none" stroke="#e6e8ef" stroke-width="4"/>
</svg>`;
}

/** Format carré (autocollant, carte de table) : bandeau haut, QR, nom. */
function squareSvg({
  url,
  title,
  name,
  color = BRAND,
}: PosterInput): string {
  const S = 1000;
  const t = (title.trim() || "Votre avis compte !").slice(0, 40);
  const nm = name.trim().slice(0, 40);
  const qrSize = 470;
  const qrX = (S - qrSize) / 2;
  const qrY = 290;
  const stars = [0, 1, 2, 3, 4]
    .map((i) => {
      const x = S / 2 - 2.5 * 58 + i * 58 + 4;
      return `<path d="${STAR}" transform="translate(${x} 58) scale(2.1)" fill="${GOLD}"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
<defs><clipPath id="reviu-square-card"><rect width="${S}" height="${S}" rx="64"/></clipPath></defs>
<g clip-path="url(#reviu-square-card)">
<rect width="${S}" height="${S}" fill="#ffffff"/>
<rect width="${S}" height="236" fill="${color}"/>
${stars}
<text x="${S / 2}" y="180" text-anchor="middle" font-family="${FONT}" font-size="${fit(t, 58, 20, 28)}" font-weight="700" fill="#ffffff">${esc(t)}</text>
<path d="${qrPath(url, qrX, qrY, qrSize)}" fill="${INK}" shape-rendering="crispEdges"/>
<text x="${S / 2}" y="${nm ? 848 : 868}" text-anchor="middle" font-family="${FONT}" font-size="32" font-weight="700" fill="${INK}">Scannez pour laisser un avis Google</text>
${nm ? `<text x="${S / 2}" y="910" text-anchor="middle" font-family="${FONT}" font-size="${fit(nm, 38, 26, 34)}" font-weight="700" fill="${color}">${esc(nm)}</text>` : ""}
<text x="${S / 2}" y="962" text-anchor="middle" font-family="${FONT}" font-size="20" fill="${MUTED}">QR code créé gratuitement sur reviu.fr</text>
</g>
<rect x="2" y="2" width="${S - 4}" height="${S - 4}" rx="62" fill="none" stroke="#e6e8ef" stroke-width="4"/>
</svg>`;
}

/** Rasterise un SVG en PNG (Blob) à la largeur demandée, dans le navigateur. */
export function svgToPng(svg: string, width: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const match = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
    const ratio = match ? Number(match[2]) / Number(match[1]) : 1;
    const img = new Image();
    const src = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round(width * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(src);
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(src);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("png"))), "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("svg"));
    };
    img.src = src;
  });
}

/** Déclenche le téléchargement d'un Blob sous un nom de fichier donné. */
export function downloadBlob(blob: Blob, filename: string): void {
  const a = document.createElement("a");
  const href = URL.createObjectURL(blob);
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}
