/**
 * Cover illustrée générée par guide. Pas de photo externe : un visuel SVG
 * déterministe (dérivé du slug) donne à chaque article sa propre image, tout en
 * restant parfaitement dans la charte (dégradé cobalt teinté par catégorie,
 * étoiles d'avis dorées, monogramme reviu). Déterministe = même rendu côté
 * serveur et client (aucun décalage d'hydratation), et stable au fil du temps.
 */

// Dégradé par catégorie (famille cobalt/périwinkle, ADN de marque).
const PALETTES: Record<string, [string, string]> = {
  "Par métier": ["#1b4dff", "#4d6bff"],
  "Gérer sa réputation": ["#3340d8", "#6d5cff"],
  "Collecter des avis": ["#1b4dff", "#2f74ff"],
  "Le présentoir": ["#2647ef", "#5b7dff"],
  Comprendre: ["#1f57e6", "#3f8bff"],
};
const DEFAULT_PALETTE: [string, string] = ["#1b4dff", "#4d6bff"];
const GOLD = "#FBBC04";
const STAR =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";
// Monogramme « r » (tracé du logo, viewBox 48).
const R_PATH =
  "M18 35V16.5h5.4v3.1c1.2-2.2 3.3-3.4 6.1-3.4.6 0 1.1.05 1.6.15v5.1c-.7-.2-1.4-.3-2.2-.3-3.3 0-5.5 2-5.5 5.6V35H18Z";

function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** PRNG déterministe (mulberry32). */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function GuideCover({
  slug,
  category,
  className,
}: {
  slug: string;
  category: string;
  className?: string;
}) {
  const [c1, c2] = PALETTES[category] ?? DEFAULT_PALETTE;
  const next = rng(seedFrom(slug));
  const id = `gc-${slug}`;
  const W = 400;
  const H = 225;

  const bubbles = Array.from({ length: 6 }, () => ({
    cx: next() * W,
    cy: next() * H,
    r: 16 + next() * 62,
    o: 0.04 + next() * 0.09,
  }));
  const stars = Array.from({ length: 3 }, () => ({
    x: 26 + next() * (W - 96),
    y: 22 + next() * (H - 66),
    s: 0.5 + next() * 1.15,
    o: 0.5 + next() * 0.4,
    rot: next() * 44 - 22,
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Illustration du guide (${category})`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
      {/* Halo lumineux */}
      <circle cx={W * 0.78} cy={H * 0.18} r={140} fill="#ffffff" opacity="0.08" />
      {/* Bulles douces */}
      {bubbles.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#ffffff" opacity={b.o} />
      ))}
      {/* Étoiles d'avis (motif de marque) */}
      {stars.map((s, i) => (
        <g
          key={i}
          transform={`translate(${s.x} ${s.y}) scale(${s.s}) rotate(${s.rot})`}
          opacity={s.o}
        >
          <path d={STAR} fill={GOLD} />
        </g>
      ))}
      {/* Monogramme translucide, coin bas-droit */}
      <g transform={`translate(${W - 66} ${H - 74}) scale(1.5)`} opacity="0.16">
        <path d={R_PATH} fill="#ffffff" />
      </g>
    </svg>
  );
}
