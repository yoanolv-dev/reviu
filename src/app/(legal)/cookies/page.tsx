import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/site/legal";
import { SITE_URL } from "@/lib/brand";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_DAYS,
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  TRACKING_ENABLED,
} from "@/lib/tracking-config";

export const metadata: Metadata = {
  title: "Politique de cookies - reviu",
  description: "Utilisation des cookies et traceurs sur le service reviu.",
  alternates: { canonical: `${SITE_URL}/cookies` },
};

// Le contenu suit la configuration réelle (`src/lib/tracking-config.ts`) :
// une catégorie n'est décrite que si l'outil correspondant est actif.
export default function Cookies() {
  return (
    <LegalPage title="Politique de cookies" updated="28 septembre 2026">
      {TRACKING_ENABLED ? (
        <P>
          reviu utilise des cookies strictement nécessaires au fonctionnement
          du service et, <strong>uniquement avec votre accord</strong>, des
          cookies de mesure d&apos;audience et de publicité. Aucun cookie
          soumis à consentement n&apos;est déposé avant votre choix.
        </P>
      ) : (
        <P>
          reviu limite l&apos;usage des cookies au strict nécessaire au
          fonctionnement du service. Nous n&apos;utilisons pas de cookies
          publicitaires ni de pistage tiers à des fins marketing.
        </P>
      )}

      <H2>Cookies strictement nécessaires</H2>
      <UL>
        <li>
          <strong>Session / authentification</strong> : maintiennent votre
          connexion à l&apos;espace commerçant. Sans eux, la connexion est
          impossible.
        </li>
        <li>
          <strong>Sécurité</strong> : préviennent les usages frauduleux et
          protègent votre session.
        </li>
        {TRACKING_ENABLED && (
          <li>
            <strong>Mémorisation de vos choix</strong> : enregistre votre
            réponse au bandeau cookies (stockage local du navigateur, 6 mois).
          </li>
        )}
      </UL>
      <P>
        Ces cookies reposent sur notre intérêt légitime à fournir un service
        sûr ; ils ne nécessitent pas de consentement préalable.
      </P>

      {TRACKING_ENABLED && (
        <>
          <H2>Cookies soumis à votre consentement</H2>
          <UL>
            {GA_MEASUREMENT_ID && (
              <li>
                <strong>Mesure d&apos;audience (Google Analytics)</strong> :
                statistiques de fréquentation du site, pages consultées,
                provenance des visiteurs et étapes de commande. Cookies{" "}
                <code>_ga</code> et <code>_ga_*</code>, durée maximale 13 mois.
              </li>
            )}
            {GOOGLE_ADS_ID && (
              <li>
                <strong>Publicité (Google Ads)</strong> : mesure des commandes
                issues de nos annonces et affichage d&apos;annonces reviu sur
                d&apos;autres sites (reciblage). Cookies <code>_gcl_*</code>,
                durée maximale 90 jours.
              </li>
            )}
            <li>
              <strong>Provenance des commandes</strong> (
              <code>{ATTRIBUTION_COOKIE}</code>, {ATTRIBUTION_MAX_AGE_DAYS}{" "}
              jours) : campagne ou site qui vous a amené sur reviu.fr, et
              page d&apos;arrivée. Cette information est associée à votre
              commande dans notre outil de paiement pour savoir quelles
              campagnes fonctionnent. L&apos;identifiant de clic publicitaire
              n&apos;est conservé qu&apos;avec votre accord pour la publicité.
            </li>
          </UL>
          <P>
            Ces outils sont fournis par Google Ireland Limited ; des données
            peuvent être transférées à Google LLC aux États-Unis, dans le cadre
            du Data Privacy Framework (décision d&apos;adéquation de la
            Commission européenne).
          </P>

          <H2>Votre choix</H2>
          <P>
            À votre première visite, un bandeau vous permet de tout accepter,
            de tout refuser ou de choisir catégorie par catégorie. Refuser ne
            vous empêche ni de consulter le site ni de commander. Votre choix
            est conservé 6 mois ; vous pouvez le modifier à tout moment grâce
            au lien « Gérer les cookies » en bas de chaque page. Retirer votre
            accord supprime les cookies concernés.
          </P>
        </>
      )}

      <H2>Mesure d&apos;audience des présentoirs</H2>
      <P>
        Les statistiques de scan sont calculées côté serveur, sans déposer de
        cookie sur l&apos;appareil du client final qui scanne un présentoir.
      </P>

      <H2>Gestion</H2>
      <P>
        Vous pouvez aussi configurer votre navigateur pour bloquer ou supprimer
        les cookies ; le blocage des cookies strictement nécessaires empêchera
        toutefois l&apos;accès à votre espace.
      </P>
    </LegalPage>
  );
}
