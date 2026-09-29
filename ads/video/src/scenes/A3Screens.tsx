import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_UI } from "../theme";
import { HomeScreen } from "../components/PhoneScreens";
import { TouchDot } from "../components/TouchDot";

/**
 * Ecrans generiques du "chemin" (A3) : recherche, saisie, resultats, fiche,
 * onglet des avis. Aucune marque, aucune couleur ni typographie de Google,
 * aucune etoile : des blocs neutres, a lire comme "un moteur de recherche".
 * Les ecrans changent sur les temps (frames `A3S`), en stop-motion (le
 * parent fige l'image toutes les 3 frames).
 */
export const A3S = {
  search: 15,
  typing: 30,
  results: 45,
  listing: 60,
  reviews: 75,
  lockAt: 93,
} as const;

const GREY = "#D3D7E0";
const GREY_SOFT = "#E6E9EF";

const Skel: React.FC<{ u: number; w: number; h?: number; color?: string; style?: React.CSSProperties }> = ({
  u,
  w,
  h = 2.8,
  color = GREY_SOFT,
  style,
}) => <div style={{ width: w * u, height: h * u, borderRadius: h * u, background: color, flexShrink: 0, ...style }} />;

const Magnifier: React.FC<{ u: number }> = ({ u }) => (
  <svg width={u * 5} height={u * 5} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx={10} cy={10} r={6.5} fill="none" stroke={C.ardoise} strokeWidth={2.6} />
    <path d="M15 15l5.5 5.5" stroke={C.ardoise} strokeWidth={2.8} strokeLinecap="round" />
  </svg>
);

const Clock: React.FC<{ u: number }> = ({ u }) => (
  <svg width={u * 4.6} height={u * 4.6} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx={12} cy={12} r={9} fill="none" stroke="#A9AFBB" strokeWidth={2.4} />
    <path d="M12 7v5.5l3.5 2" fill="none" stroke="#A9AFBB" strokeWidth={2.4} strokeLinecap="round" />
  </svg>
);

/** Champ de recherche generique (pilule neutre, loupe, texte saisi, curseur). */
const SearchField: React.FC<{ u: number; text: string; cursor: boolean }> = ({ u, text, cursor }) => (
  <div
    style={{
      position: "absolute",
      top: u * 15,
      left: u * 5,
      right: u * 5,
      height: u * 12,
      borderRadius: u * 6,
      background: C.perle,
      boxShadow: `inset 0 0 0 ${u * 0.35}px ${C.line}`,
      display: "flex",
      alignItems: "center",
      gap: u * 2.4,
      padding: `0 ${u * 3.6}px`,
      fontFamily: FONT_UI,
      fontWeight: 600,
      fontSize: u * 4.8,
      color: C.ink,
      whiteSpace: "nowrap",
    }}
  >
    <Magnifier u={u} />
    {text === "" && !cursor && <Skel u={u} w={30} color={GREY_SOFT} />}
    <span>{text}</span>
    {cursor && <span style={{ width: u * 0.55, height: u * 6, background: C.cobalt, marginLeft: -u * 1.8 }} />}
  </div>
);

/** Clavier generique (touches sans lettres). */
const Keyboard: React.FC<{ u: number; pressed: number }> = ({ u, pressed }) => {
  const rows = [10, 9, 7];
  let k = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: u * 66,
        background: "#D6DAE2",
        padding: `${u * 3}px ${u * 1.2}px 0`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: u * 2.6,
      }}
    >
      {rows.map((n, ri) => (
        <div key={ri} style={{ display: "flex", justifyContent: "center", gap: u * 1.3 }}>
          {ri === 2 && <div style={{ width: u * 11, height: u * 10.5, borderRadius: u * 1.4, background: "#B7BDC9" }} />}
          {Array.from({ length: n }, (_, i) => {
            const id = k++;
            return (
              <div
                key={i}
                style={{
                  width: u * 8.4,
                  height: u * 10.5,
                  borderRadius: u * 1.4,
                  background: id === pressed ? "#AEB5C2" : C.white,
                  boxShadow: `0 ${u * 0.3}px 0 rgba(10,13,22,0.18)`,
                }}
              />
            );
          })}
          {ri === 2 && <div style={{ width: u * 11, height: u * 10.5, borderRadius: u * 1.4, background: "#B7BDC9" }} />}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", gap: u * 1.3 }}>
        <div style={{ width: u * 20, height: u * 10.5, borderRadius: u * 1.4, background: "#B7BDC9" }} />
        <div style={{ width: u * 48, height: u * 10.5, borderRadius: u * 1.4, background: C.white, boxShadow: `0 ${u * 0.3}px 0 rgba(10,13,22,0.18)` }} />
        <div style={{ width: u * 20, height: u * 10.5, borderRadius: u * 1.4, background: "#B7BDC9" }} />
      </div>
    </div>
  );
};

/** Suggestions sous le champ (icone horloge + barre neutre). */
const Suggestions: React.FC<{ u: number; first?: string }> = ({ u, first }) => (
  <div style={{ position: "absolute", top: u * 34, left: u * 7, right: u * 7, display: "flex", flexDirection: "column", gap: u * 6.4 }}>
    {[44, 58, 36, 50].map((w, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: u * 3.4, height: u * 5 }}>
        {i === 0 && first ? <Magnifier u={u} /> : <Clock u={u} />}
        {i === 0 && first ? (
          <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: u * 4.6, color: C.ink, whiteSpace: "nowrap" }}>{first}</span>
        ) : (
          <Skel u={u} w={w} />
        )}
      </div>
    ))}
  </div>
);

const NAME = "Votre commerce";

/** Carte de resultat : vignette neutre, nom (ou barre), deux lignes. */
const ResultCard: React.FC<{ u: number; name?: string; tone: string; active?: boolean }> = ({ u, name, tone, active }) => (
  <div
    style={{
      display: "flex",
      gap: u * 4,
      alignItems: "center",
      padding: `${u * 3.4}px ${u * 4}px`,
      borderRadius: u * 4,
      background: active ? C.brume : C.white,
      boxShadow: `inset 0 0 0 ${u * 0.35}px ${C.line}`,
    }}
  >
    <div style={{ width: u * 16, height: u * 16, borderRadius: u * 3, background: tone, flexShrink: 0 }} />
    <div style={{ display: "flex", flexDirection: "column", gap: u * 2.2, minWidth: 0 }}>
      {name ? (
        <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: u * 4.8, color: C.ink, whiteSpace: "nowrap" }}>{name}</span>
      ) : (
        <Skel u={u} w={38} h={3.4} color={GREY} />
      )}
      <Skel u={u} w={50} />
      <Skel u={u} w={30} />
    </div>
  </div>
);

/** Onglet (pilule) ; le seul libelle lisible est "Avis". */
const Tab: React.FC<{ u: number; label?: string; w?: number; active?: boolean }> = ({ u, label, w = 16, active }) => (
  <div
    style={{
      height: u * 9,
      padding: label ? `0 ${u * 4.6}px` : 0,
      width: label ? undefined : w * u,
      borderRadius: u * 4.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      background: active ? C.ink : C.perle,
      boxShadow: active ? "none" : `inset 0 0 0 ${u * 0.35}px ${C.line}`,
      fontFamily: FONT_UI,
      fontWeight: 700,
      fontSize: u * 4.4,
      color: active ? C.white : C.ink,
    }}
  >
    {label ?? <Skel u={u} w={w - 7} h={2.4} color={GREY} />}
  </div>
);

/** Ligne d'avis neutre (avatar + barres), sans etoiles ni texte. */
const ReviewRow: React.FC<{ u: number; tone: string; w1: number; w2: number }> = ({ u, tone, w1, w2 }) => (
  <div style={{ display: "flex", gap: u * 3.4, alignItems: "flex-start" }}>
    <div style={{ width: u * 9, height: u * 9, borderRadius: "50%", background: tone, flexShrink: 0 }} />
    <div style={{ display: "flex", flexDirection: "column", gap: u * 2.2, paddingTop: u * 0.6 }}>
      <Skel u={u} w={26} h={3} color={GREY} />
      <Skel u={u} w={w1} />
      <Skel u={u} w={w2} />
    </div>
  </div>
);

/** Petite vitrine stylisee (en-tete de la fiche), aux couleurs neutres. */
const Storefront: React.FC<{ u: number }> = ({ u }) => (
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: u * 50, background: "#DCE4FF", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: u * 18, right: u * 18, top: u * 17, height: u * 7, display: "flex" }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ flex: 1, background: i % 2 ? C.white : "#9FB4FF", borderRadius: `0 0 ${u * 3}px ${u * 3}px` }} />
      ))}
    </div>
    <div style={{ position: "absolute", left: u * 20, right: u * 20, top: u * 24, bottom: 0, background: "#F5F6F8" }} />
    <div style={{ position: "absolute", left: u * 26, width: u * 20, top: u * 29, bottom: u * 4, background: "#CFD8F5", borderRadius: u * 1.5 }} />
    <div style={{ position: "absolute", left: u * 52, width: u * 14, top: u * 29, bottom: 0, background: "#BFCBF2", borderRadius: `${u * 1.5}px ${u * 1.5}px 0 0` }} />
  </div>
);

const tonesA = ["#FFE9B3", "#D6F2E3", "#FFD9D6", "#E6E0FF", "#D5EEFF"];

/**
 * Contenu de l'ecran selon la frame (a figer en stop-motion par le parent).
 * `width` : largeur de l'ecran (px).
 */
export const A3PathScreen: React.FC<{ width: number }> = ({ width }) => {
  const f = useCurrentFrame();
  const u = width / 100;

  if (f >= A3S.lockAt) {
    return <div style={{ position: "absolute", inset: 0, background: "#07090E" }} />;
  }

  if (f < A3S.search) {
    // Ecran d'accueil : le doigt ouvre une application (generique).
    return (
      <>
        <HomeScreen width={width} />
        <TouchDot x={u * 38.75} y={u * 30.25} size={u * 14} downAt={3} upAt={8} />
      </>
    );
  }

  if (f < A3S.results) {
    // Recherche puis saisie du nom, clavier ouvert.
    const typing = f >= A3S.typing;
    const n = typing ? Math.min(NAME.length, 3 + Math.floor((f - A3S.typing) / 3) * 3) : 0;
    const text = NAME.slice(0, n);
    const blink = Math.floor(f / 6) % 2 === 0;
    const pressed = typing ? (Math.floor(f / 3) * 7) % 26 : -1;
    return (
      <div style={{ position: "absolute", inset: 0, background: C.white }}>
        <SearchField u={u} text={text} cursor={typing || blink} />
        <Suggestions u={u} first={n >= 9 ? NAME : undefined} />
        <Keyboard u={u} pressed={pressed} />
      </div>
    );
  }

  if (f < A3S.listing) {
    // Resultats : la liste defile par a-coups, on touche "Votre commerce".
    const scroll = [0, 12, 24, 24, 24][Math.min(4, Math.floor((f - A3S.results) / 3))];
    const active = f >= 55;
    return (
      <div style={{ position: "absolute", inset: 0, background: C.white }}>
        <div
          style={{
            position: "absolute",
            top: u * 32,
            left: u * 5,
            right: u * 5,
            display: "flex",
            flexDirection: "column",
            gap: u * 3.4,
            transform: `translateY(${-scroll * u}px)`,
          }}
        >
          <ResultCard u={u} tone={tonesA[0]} />
          <ResultCard u={u} tone={tonesA[1]} />
          <ResultCard u={u} tone={tonesA[2]} name={NAME} active={active} />
          <ResultCard u={u} tone={tonesA[3]} />
          <ResultCard u={u} tone={tonesA[4]} />
          <ResultCard u={u} tone={tonesA[0]} />
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: u * 30, background: C.white }} />
        <SearchField u={u} text={NAME} cursor={false} />
        <TouchDot x={u * 40} y={u * (32 + 2 * 26.2 + 12 - 24)} size={u * 14} downAt={54} upAt={58} />
      </div>
    );
  }

  if (f < A3S.reviews) {
    // Fiche : on fait defiler les onglets pour trouver "Avis".
    const shift = [0, 14, 28, 28, 28][Math.min(4, Math.floor((f - A3S.listing) / 3))];
    const on = f >= 70;
    return (
      <div style={{ position: "absolute", inset: 0, background: C.white }}>
        <Storefront u={u} />
        <div style={{ position: "absolute", top: u * 56, left: u * 6, right: u * 6, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: u * 7, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap" }}>
          {NAME}
        </div>
        <div style={{ position: "absolute", top: u * 68, left: u * 6, display: "flex", flexDirection: "column", gap: u * 2.4 }}>
          <Skel u={u} w={44} />
          <Skel u={u} w={30} />
        </div>
        <div style={{ position: "absolute", top: u * 82, left: 0, right: 0, height: u * 11, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: u * 6, top: u * 1, display: "flex", gap: u * 2.4, transform: `translateX(${-shift * u}px)` }}>
            <Tab u={u} w={20} active={false} />
            <Tab u={u} w={18} />
            <Tab u={u} w={24} />
            <Tab u={u} w={16} />
            <Tab u={u} label="Avis" active={on} />
            <Tab u={u} w={18} />
          </div>
        </div>
        <div style={{ position: "absolute", top: u * 100, left: u * 6, right: u * 6, display: "flex", flexDirection: "column", gap: u * 5 }}>
          {[72, 60, 80, 54, 66].map((w, i) => (
            <Skel key={i} u={u} w={w} />
          ))}
        </div>
        <TouchDot x={u * 72} y={u * 87.5} size={u * 13} downAt={69} upAt={73} />
      </div>
    );
  }

  // Onglet des avis : court defilement, puis on touche le bouton (pilule
  // neutre sous l'en-tete) : "encore une etape", sans pretendre qu'il est cache.
  const tick = Math.floor((f - A3S.reviews) / 3);
  const scroll = Math.min(2, tick) * 10;
  const dragY = 150 - Math.min(6, Math.max(0, f - A3S.reviews)) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, background: C.white }}>
      <div style={{ position: "absolute", top: u * 50, left: u * 6, right: u * 6, display: "flex", flexDirection: "column", gap: u * 8, transform: `translateY(${-scroll * u}px)` }}>
        {Array.from({ length: 9 }, (_, i) => (
          <ReviewRow key={i} u={u} tone={tonesA[i % tonesA.length]} w1={[62, 70, 54, 66, 58][i % 5]} w2={[40, 30, 46, 36, 28][i % 5]} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: u * 44, background: C.white, boxShadow: `0 ${u * 0.4}px 0 ${C.line}` }}>
        <div style={{ position: "absolute", top: u * 13, left: u * 6, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: u * 5.6, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap" }}>
          {NAME}
        </div>
        <div style={{ position: "absolute", top: u * 20.5, left: u * 6, display: "flex", gap: u * 2.4, transform: `scale(0.8)`, transformOrigin: "left top" }}>
          <Tab u={u} w={16} />
          <Tab u={u} label="Avis" active />
          <Tab u={u} w={18} />
        </div>
        <Skel u={u} w={34} h={8} color={GREY} style={{ position: "absolute", top: u * 32, left: u * 6 }} />
      </div>
      <TouchDot x={u * 62} y={u * dragY} size={u * 13} downAt={A3S.reviews + 1} upAt={A3S.reviews + 5} />
      <TouchDot x={u * 23} y={u * 36} size={u * 13} downAt={87} upAt={91} />
    </div>
  );
};
