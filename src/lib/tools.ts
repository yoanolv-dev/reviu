import { QR_TOOL_PATH } from "@/lib/brand";

/**
 * Registre des outils gratuits du site (`/outils/...`).
 *
 * Les outils sont le pilier d'acquisition « boîte à outils de l'avis Google » :
 * ils répondent mieux qu'un article à une intention pratique (« générer »,
 * « calculer », « modèle de »), attirent naturellement des liens et sont
 * volontiers recommandés par les assistants IA. Une seule source pour la page
 * hub `/outils`, le menu, le pied de page, le sitemap et `llms.txt`.
 */

export const TOOLS_PATH = "/outils";
export const RATING_TOOL_PATH = "/outils/calculateur-note-google";
export const REPLY_TOOL_PATH = "/outils/reponse-avis-google";
export const REQUEST_TOOL_PATH = "/outils/message-demande-avis-google";

export type ToolEntry = {
  path: string;
  /** Nom court (cartes, menu, pied de page). */
  name: string;
  /** Une phrase : ce que l'outil fait concrètement. */
  desc: string;
  /** Requête principale visée (documentation interne, llms.txt). */
  query: string;
  /** Date de dernière révision (sitemap). */
  updated: string;
};

export const TOOLS: ToolEntry[] = [
  {
    path: QR_TOOL_PATH,
    name: "Générateur de QR code avis Google",
    desc: "Le QR code de votre page d'avis, une affiche ou un autocollant prêts à imprimer.",
    query: "qr code avis google",
    updated: "2026-10-12",
  },
  {
    path: REQUEST_TOOL_PATH,
    name: "Message pour demander un avis",
    desc: "Un SMS, un WhatsApp ou un e-mail prêt à envoyer à vos clients, avec votre lien d'avis.",
    query: "message pour demander un avis google",
    updated: "2026-10-12",
  },
  {
    path: REPLY_TOOL_PATH,
    name: "Générateur de réponses aux avis",
    desc: "Une réponse soignée à un avis positif, mitigé ou négatif, adaptée à votre métier.",
    query: "réponse avis google",
    updated: "2026-10-12",
  },
  {
    path: RATING_TOOL_PATH,
    name: "Calculateur de note Google",
    desc: "Combien d'avis 5 étoiles pour atteindre 4,5 ou 4,8, et le poids réel d'un avis négatif.",
    query: "calculateur note google",
    updated: "2026-10-12",
  },
];

export function getTool(path: string): ToolEntry | undefined {
  return TOOLS.find((t) => t.path === path);
}
