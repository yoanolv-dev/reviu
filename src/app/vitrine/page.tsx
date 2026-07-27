import { permanentRedirect } from "next/navigation";

// L'ancienne vitrine est remplacée par la page d'accueil (boutique). Redirection
// permanente vers la racine, source unique.
export default function Vitrine() {
  permanentRedirect("/");
}
