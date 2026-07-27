import { permanentRedirect } from "next/navigation";

/**
 * L'ancienne landing « Comment ça marche » est désormais intégrée à la page
 * d'accueil (section #fonctionnement de la boutique). Pour éviter la
 * duplication /↔/home et consolider les signaux SEO, /home redirige de façon
 * permanente (308) vers la racine.
 */
export default function HomeRedirect() {
  permanentRedirect("/");
}
