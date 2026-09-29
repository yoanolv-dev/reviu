import React from "react";
import { Img, staticFile } from "remotion";

/** Proportions de la face detouree (852 x 904 px). */
export const FACE_RATIO = 904 / 852;

/**
 * Variante de face pour toute la composition : "standard" (photo exacte, QR
 * neutralise) ou "logoFlou" (variante de secours, logo Google floute).
 */
export const FaceVariant = React.createContext<"standard" | "logoFlou">("standard");

type Props = {
  /** Largeur affichee de la face, en px. */
  width: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  /** Position du reflet qui balaie la face : 0 = hors champ a gauche, 1 = hors champ a droite. */
  glare?: number;
  /** Intensite du reflet (0 a 1). */
  glareStrength?: number;
  /** Epaisseur de la plaque, en px a l'ecran. */
  thickness?: number;
  /** Opacite de l'ombre de contact au sol (0 a 1). */
  shadow?: number;
  /** Photo agrandie x2 pour les gros plans. */
  hd?: boolean;
  style?: React.CSSProperties;
  /** Elements poses sur la face (coordonnees en % de la face), qui suivent la 3D. */
  children?: React.ReactNode;
  /**
   * Profondeur de champ : flou (px) du haut de la face, mise au point sur la
   * zone "COLLEZ VOTRE TELEPHONE" (le logo imprime n'est pas le sujet).
   */
  focusBlur?: number;
};

/**
 * Presentoir Reviu en pseudo-3D a partir de la photo produit exacte :
 * la face detouree, une epaisseur faite de tranches empilees en Z,
 * un reflet lumineux qui suit la forme et une ombre de contact.
 */
export const Presentoir3D: React.FC<Props> = ({
  width,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  glare = -1,
  glareStrength = 0.55,
  thickness = 22,
  shadow = 0.5,
  hd = false,
  style,
  children,
  focusBlur = 0,
}) => {
  const height = width * FACE_RATIO;
  const layers = Math.max(4, Math.round(thickness / 2));
  const step = thickness / layers;
  const g = glare * 1.6 - 0.3; // centre du reflet, en fraction de largeur
  const variant = React.useContext(FaceVariant);
  const suffix = variant === "logoFlou" ? "-gflou" : "";
  const face = staticFile(`img/presentoir-face${suffix}${hd ? "-2x" : ""}.png`);
  const mask = `url(${staticFile("img/presentoir-mask.png")})`;
  // Le reflet ne passe jamais sur le logo imprime (on ne le "lave" pas).
  const logoHole = "radial-gradient(ellipse 13% 12.5% at 50.2% 17.8%, transparent 96%, #000 100%)";

  return (
    <div style={{ position: "relative", width, height, ...style }}>
      {/* Ombre de contact : une ellipse nette au pied, pas de halo diffus. */}
      <div
        style={{
          position: "absolute",
          left: width * 0.08,
          right: width * 0.08,
          bottom: -height * 0.05,
          height: height * 0.07,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(10,13,22,0.45), rgba(10,13,22,0))",
          opacity: shadow,
          transform: `translateX(${rotateY * 1.2}px) scaleX(${1 - Math.abs(rotateY) / 140})`,
          filter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {Array.from({ length: layers }, (_, i) => (
          <Img
            key={i}
            src={staticFile("img/presentoir-edge.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              transform: `translateZ(${-(i + 1) * step}px)`,
              backfaceVisibility: "visible",
            }}
          />
        ))}
        <Img
          src={face}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: "translateZ(0.5px)",
          }}
        />
        {focusBlur > 0 && (
          <Img
            src={face}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              transform: "translateZ(0.8px)",
              filter: `blur(${focusBlur}px)`,
              WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 42%, transparent 58%)",
              maskImage: "linear-gradient(to bottom, #000 0%, #000 42%, transparent 58%)",
            }}
          />
        )}
        {children && <div style={{ position: "absolute", inset: 0, transform: "translateZ(2px)" }}>{children}</div>}
        {glare > -1 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "translateZ(1px)",
              WebkitMaskImage: `${mask}, ${logoHole}`,
              maskImage: `${mask}, ${logoHole}`,
              WebkitMaskSize: "100% 100%, 100% 100%",
              maskSize: "100% 100%, 100% 100%",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
              background: `linear-gradient(105deg, rgba(255,255,255,0) ${(g - 0.22) * 100}%, rgba(255,255,255,${glareStrength}) ${g * 100}%, rgba(255,255,255,0) ${(g + 0.14) * 100}%)`,
              mixBlendMode: "screen",
            }}
          />
        )}
      </div>
    </div>
  );
};
