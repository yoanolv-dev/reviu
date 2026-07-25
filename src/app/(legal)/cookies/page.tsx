import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/site/legal";
import { SITE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Politique de cookies - reviu",
  description: "Utilisation des cookies et traceurs sur le service reviu.",
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function Cookies() {
  return (
    <LegalPage title="Politique de cookies" updated="23 juillet 2026">
      <P>
        reviu limite l&apos;usage des cookies au strict nécessaire au
        fonctionnement du service. Nous n&apos;utilisons pas de cookies
        publicitaires ni de pistage tiers à des fins marketing.
      </P>

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
      </UL>
      <P>
        Ces cookies reposent sur notre intérêt légitime à fournir un service
        sûr ; ils ne nécessitent pas de consentement préalable.
      </P>

      <H2>Mesure d&apos;audience des présentoirs</H2>
      <P>
        Les statistiques de scan sont calculées côté serveur, sans déposer de
        cookie sur l&apos;appareil du client final qui scanne un présentoir.
      </P>

      <H2>Gestion</H2>
      <P>
        Vous pouvez configurer votre navigateur pour bloquer ou supprimer les
        cookies ; le blocage des cookies strictement nécessaires empêchera
        toutefois l&apos;accès à votre espace.
      </P>
    </LegalPage>
  );
}
