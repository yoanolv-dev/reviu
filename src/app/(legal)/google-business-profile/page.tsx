import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/site/legal";
import { CONTACT_EMAIL, SITE_URL, GOOGLE_DISCLAIMER } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Connexion Google Business Profile — reviu",
  description:
    "Pourquoi et comment reviu se connecte à Google Business Profile : données consultées, actions possibles, caractère facultatif, déconnexion et suppression des données.",
  alternates: { canonical: `${SITE_URL}/google-business-profile` },
};

export default function GoogleBusinessProfile() {
  return (
    <LegalPage
      title="Connexion à Google Business Profile"
      updated="23 juillet 2026"
    >
      <P>
        reviu propose une connexion <strong>facultative</strong> à votre fiche
        Google Business Profile, afin de vous permettre de suivre et de gérer vos
        avis Google sans quitter la plateforme. Cette page décrit précisément ce
        à quoi reviu accède et ce que vous pouvez contrôler.
      </P>

      <H2>Pourquoi reviu demande cet accès</H2>
      <P>
        Pour centraliser la gestion de votre réputation : consulter vos avis
        Google, y répondre et suivre les statistiques de votre fiche, directement
        depuis reviu. Sans cette connexion, reviu fonctionne normalement — vous
        perdez simplement ces fonctionnalités liées à Google.
      </P>

      <H2>Quelles données sont consultées</H2>
      <UL>
        <li>Les avis reçus sur votre fiche (note, texte, date, réponses).</li>
        <li>Les informations publiques de votre établissement.</li>
        <li>
          Les statistiques de performance de la fiche (vues, recherches, appels,
          demandes d&apos;itinéraire).
        </li>
      </UL>

      <H2>Quelles actions vous pourrez effectuer</H2>
      <UL>
        <li>Lire l&apos;ensemble de vos avis au même endroit.</li>
        <li>Rédiger et publier des réponses à ces avis.</li>
        <li>Suivre l&apos;évolution des statistiques de votre fiche.</li>
      </UL>
      <P>
        <strong>
          reviu ne publie ni ne modifie jamais rien sans une action explicite de
          votre part.
        </strong>{" "}
        Aucune réponse n&apos;est envoyée automatiquement.
      </P>

      <H2>Un accès facultatif et explicite</H2>
      <P>
        La connexion est entièrement optionnelle. Elle nécessite votre{" "}
        <strong>autorisation explicite</strong> via l&apos;écran de consentement
        de Google (OAuth). Vous choisissez de l&apos;activer, et vous pouvez la
        retirer à tout moment.
      </P>

      <H2>Déconnexion et suppression des données</H2>
      <UL>
        <li>
          Vous pouvez <strong>déconnecter votre compte Google</strong> à tout
          moment depuis vos réglages reviu, ou depuis les{" "}
          <a
            className="text-brand hover:underline"
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
          >
            paramètres de votre compte Google
          </a>
          .
        </li>
        <li>
          À la déconnexion, les <strong>jetons OAuth sont supprimés
          immédiatement</strong> et ne sont plus utilisables.
        </li>
        <li>
          Les données synchronisées depuis Google sont{" "}
          <strong>supprimées ou anonymisées sous 30 jours</strong>.
        </li>
      </UL>

      <H2>Ce que reviu ne fait pas</H2>
      <P>
        Les données issues de Google ne sont <strong>ni vendues, ni utilisées à
        des fins publicitaires</strong>, ni partagées avec des tiers en dehors de
        ce qui est strictement nécessaire au service. Notre usage respecte la{" "}
        <a
          className="text-brand hover:underline"
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , y compris ses exigences d&apos;utilisation limitée (Limited Use). Voir
        aussi notre{" "}
        <a className="text-brand hover:underline" href="/confidentialite">
          politique de confidentialité
        </a>
        .
      </P>

      <H2>Indépendance</H2>
      <P>{GOOGLE_DISCLAIMER}</P>
      <P>
        Une question ?{" "}
        <a className="text-brand hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </P>
    </LegalPage>
  );
}
