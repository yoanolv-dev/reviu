import type { NextConfig } from "next";

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 * - Aucune page ne doit pouvoir être affichée dans le cadre d'un autre site
 *   (clickjacking sur l'espace, l'admin ou l'activation d'un présentoir).
 * - Pas de « devinette » du type de contenu (fichiers servis tels quels).
 * - Adresse d'origine réduite au domaine quand on quitte le site (les liens
 *   de connexion contiennent un jeton dans l'URL).
 * - Caméra, micro et géolocalisation jamais utilisés : refusés.
 * La CSP se limite volontairement aux directives sans risque de casse
 * (Stripe, Google Analytics et Google Ads chargent des scripts tiers).
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Sans includeSubDomains : un sous-domaine hors Vercel (e-mail, DNS
  // d'un prestataire) servi en HTTP ne doit pas devenir inaccessible.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
