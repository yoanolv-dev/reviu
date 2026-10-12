import { ImageResponse } from "next/og";

/**
 * Carte Open Graph générique (1200×630) à la charte reviu : marque en haut,
 * pastille + titre au centre, étoiles + domaine en pied. Utilisée par les
 * pages d'outils et le hub `/outils` pour avoir chacun sa vignette de partage
 * (et sa propre image dans les données structurées).
 *
 * Contraintes satori (moteur de next/og) : flexbox uniquement, tout <div> à
 * plusieurs enfants déclare `display: flex`, étoiles dessinées en SVG.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const BRAND = "#1b4dff";
const INK = "#0a0d16";
const GOLD = "#FBBC04";
const STAR =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";

export function ogCard({
  badge,
  title,
  pill,
}: {
  badge: string;
  title: string;
  pill: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: BRAND,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              color: "#fff",
              fontSize: 52,
              fontWeight: 700,
            }}
          >
            r
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 14,
                height: 14,
                borderRadius: 14,
                background: GOLD,
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: INK }}>
            reviu
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "#edf1ff",
              color: BRAND,
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            {badge}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: title.length > 55 ? 58 : 66,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#6b7382",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="30" height="30" viewBox="0 0 24 24">
                  <path d={STAR} fill={GOLD} />
                </svg>
              ))}
            </div>
            <div style={{ display: "flex" }}>reviu.fr</div>
          </div>
          <div
            style={{
              display: "flex",
              background: INK,
              color: "#fff",
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {pill}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
