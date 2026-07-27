import { ImageResponse } from "next/og";

/**
 * Image Open Graph de marque, générée à la volée (next/og). Sert d’image de
 * partage par défaut à TOUTES les pages du site (convention de fichier à la
 * racine `app/`) : réseaux sociaux, aperçus dans les messageries, et vignettes
 * des moteurs. Une seule source, cohérente partout.
 *
 * Contraintes satori (moteur de next/og) : flexbox uniquement (pas de grid),
 * tout <div> à plusieurs enfants doit déclarer `display: flex`, et on évite les
 * glyphes hors police par défaut (pas d’emoji/★ : dessinés en SVG à la place).
 */
export const alt =
  "reviu - Présentoir NFC et QR code pour plus d’avis Google, 29,90 € sans abonnement";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1b4dff";
const INK = "#0a0d16";
const GOLD = "#FBBC04";
const STAR =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";

export default function OpengraphImage() {
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
        {/* Marque */}
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

        {/* Accroche */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="34" height="34" viewBox="0 0 24 24">
                <path d={STAR} fill={GOLD} />
              </svg>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
            }}
          >
            <div
              style={{
                fontSize: 68,
                fontWeight: 700,
                color: INK,
                lineHeight: 1.05,
                letterSpacing: -1.5,
              }}
            >
              Plus d’avis Google,
            </div>
            <div
              style={{
                fontSize: 68,
                fontWeight: 700,
                color: BRAND,
                lineHeight: 1.05,
                letterSpacing: -1.5,
              }}
            >
              depuis votre comptoir.
            </div>
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#333a49", maxWidth: 900 }}>
            Le présentoir NFC + QR code pour accéder à votre page d’avis Google.
          </div>
        </div>

        {/* Pied */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#6b7382",
          }}
        >
          <div style={{ display: "flex" }}>reviu.fr</div>
          <div
            style={{
              display: "flex",
              background: "#edf1ff",
              color: BRAND,
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            29,90 € · sans abonnement obligatoire
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
