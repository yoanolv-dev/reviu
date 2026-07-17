import { STAR } from "@/components/ui/logo";

export type ShopVariant = "cafe" | "resto" | "beaute";

const TINT: Record<ShopVariant, string> = {
  cafe: "#e9eeff",
  resto: "#fdf1e6",
  beaute: "#e7f7ef",
};

function MiniQR({ x, y }: { x: number; y: number }) {
  const cells: [number, number][] = [
    [0, 0], [2, 0], [4, 0], [0, 2], [4, 2], [2, 1], [1, 4], [3, 3], [4, 4],
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-5" y="-5" width="50" height="50" rx="7" fill="#fff" stroke="#e6e8ef" strokeWidth="1.5" />
      {([[0, 0], [28, 0], [0, 28]] as [number, number][]).map(([fx, fy], i) => (
        <g key={i} transform={`translate(${fx} ${fy})`}>
          <rect width="12" height="12" rx="3" fill="#0a0d16" />
          <rect x="3" y="3" width="6" height="6" rx="1.5" fill="#fff" />
          <rect x="4.5" y="4.5" width="3" height="3" rx="0.8" fill="#0a0d16" />
        </g>
      ))}
      {cells.map(([cx, cy], i) => (
        <rect key={i} x={16 + cx * 4} y={16 + cy * 4} width="3" height="3" rx="0.6" fill="#0a0d16" />
      ))}
    </g>
  );
}

function Presentoir() {
  return (
    <g>
      <ellipse cx="200" cy="214" rx="64" ry="9" fill="#0a0d16" opacity="0.07" />
      <rect x="184" y="200" width="32" height="12" rx="3" fill="#0a0d16" />
      <rect x="193" y="188" width="14" height="14" fill="#0a0d16" />
      <rect x="150" y="64" width="100" height="126" rx="12" fill="#fff" stroke="#e6e8ef" strokeWidth="1.5" />
      <rect x="188" y="78" width="24" height="24" rx="7" fill="var(--color-brand)" />
      <path transform="translate(194 79) scale(0.5)" d={STAR} fill="#fff" />
      <rect x="170" y="114" width="60" height="6" rx="3" fill="#0a0d16" opacity="0.82" />
      <rect x="178" y="126" width="44" height="5" rx="2.5" fill="#6b7382" opacity="0.5" />
      <MiniQR x={180} y={144} />
    </g>
  );
}

function CafeProp() {
  return (
    <g transform="translate(298 150)">
      <ellipse cx="22" cy="46" rx="30" ry="6" fill="#0a0d16" opacity="0.06" />
      <path d="M4 14h36v12a18 18 0 0 1-36 0z" fill="#fff" stroke="#e6e8ef" strokeWidth="1.5" />
      <path d="M40 17a9 9 0 0 1 0 14" fill="none" stroke="#e6e8ef" strokeWidth="3" />
      <ellipse cx="22" cy="15" rx="16" ry="3.5" fill="var(--color-brand)" opacity="0.18" />
      <path d="M16 6c4-3 0-6 0-6M28 6c4-3 0-6 0-6" fill="none" stroke="#6b7382" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </g>
  );
}

function RestoProp() {
  return (
    <g transform="translate(296 158)">
      <ellipse cx="26" cy="36" rx="30" ry="6" fill="#0a0d16" opacity="0.06" />
      <circle cx="26" cy="24" r="22" fill="#fff" stroke="#e6e8ef" strokeWidth="1.5" />
      <circle cx="26" cy="24" r="13" fill="none" stroke="#e6e8ef" strokeWidth="1.5" />
      <rect x="-6" y="4" width="3" height="40" rx="1.5" fill="#cfd4e0" />
      <rect x="55" y="4" width="3" height="40" rx="1.5" fill="#cfd4e0" />
    </g>
  );
}

function BeauteProp() {
  return (
    <g transform="translate(300 150)">
      <ellipse cx="20" cy="48" rx="26" ry="6" fill="#0a0d16" opacity="0.06" />
      <path d="M8 30h24l-3 16H11z" fill="#fff" stroke="#e6e8ef" strokeWidth="1.5" />
      <path d="M20 30C20 16 11 13 6 9c8 4 14 8 14 21Z" fill="#35a06a" opacity="0.7" />
      <path d="M20 30C20 14 29 11 34 7c-8 4-14 8-14 23Z" fill="#35a06a" opacity="0.45" />
      <path d="M20 30C20 18 20 12 20 4c2 8 2 16 0 26Z" fill="#2f8f5d" opacity="0.9" />
    </g>
  );
}

const PROP: Record<ShopVariant, () => React.ReactElement> = {
  cafe: CafeProp,
  resto: RestoProp,
  beaute: BeauteProp,
};

/**
 * Illustration « produit en situation » (placeholder soigné aux couleurs reviu).
 * À remplacer par de vraies photos de présentoirs installés en commerce.
 */
export function ShopScene({ variant }: { variant: ShopVariant }) {
  const Prop = PROP[variant];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Présentoir reviu installé en commerce">
      <rect width="400" height="300" fill={TINT[variant]} />
      <rect x="0" y="210" width="400" height="90" fill="#ffffff" />
      <rect x="0" y="209" width="400" height="1.5" fill="#e6e8ef" />
      <Prop />
      <Presentoir />
    </svg>
  );
}
