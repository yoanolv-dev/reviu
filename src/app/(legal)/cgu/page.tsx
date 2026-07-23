import type { Metadata } from "next";
import { LegalPage, H2, P, UL, Fill } from "@/components/site/legal";
import { CONTACT_EMAIL, SITE_URL, SUBSCRIPTION } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — reviu",
  description: "Conditions générales d'utilisation et de vente du service reviu.",
  alternates: { canonical: `${SITE_URL}/cgu` },
};

export default function CGU() {
  return (
    <LegalPage
      title="Conditions générales d'utilisation"
      updated="23 juillet 2026"
    >
      <P>
        Les présentes conditions régissent l&apos;utilisation du service reviu,
        édité par <Fill>raison sociale</Fill>. En créant un compte, vous les
        acceptez sans réserve.
      </P>

      <H2>1. Objet du service</H2>
      <P>
        reviu fournit des présentoirs NFC et QR ainsi qu&apos;une plateforme
        permettant de rediriger les clients vers une page d&apos;avis, de suivre
        les statistiques et de gérer sa réputation en ligne.
      </P>

      <H2>2. Compte</H2>
      <P>
        Vous êtes responsable de l&apos;exactitude des informations fournies et
        de la confidentialité de vos identifiants. Toute activité réalisée depuis
        votre compte relève de votre responsabilité.
      </P>

      <H2>3. Abonnement et paiement</H2>
      <UL>
        <li>
          L&apos;abonnement de suivi est proposé au tarif de{" "}
          {SUBSCRIPTION.priceLabel}/{SUBSCRIPTION.period} par présentoir, sans
          engagement.
        </li>
        <li>
          Le paiement est traité par Stripe. L&apos;abonnement est renouvelé
          automatiquement à chaque échéance jusqu&apos;à résiliation.
        </li>
        <li>
          Vous pouvez résilier à tout moment depuis votre espace ; l&apos;accès
          aux fonctionnalités payantes reste actif jusqu&apos;à la fin de la
          période en cours.
        </li>
      </UL>

      <H2>4. Usage conforme</H2>
      <P>
        Vous vous engagez à utiliser le service dans le respect des règles des
        plateformes d&apos;avis (notamment Google), en particulier sans filtrage
        interdit des avis négatifs, et à ne fournir que des liens et contenus
        licites.
      </P>

      <H2>5. Disponibilité</H2>
      <P>
        Nous nous efforçons d&apos;assurer la continuité du service sans pouvoir
        la garantir. Des interruptions peuvent survenir pour maintenance ou pour
        des causes indépendantes de notre volonté.
      </P>

      <H2>6. Résiliation</H2>
      <P>
        Nous pouvons suspendre ou clôturer un compte en cas de manquement aux
        présentes conditions ou d&apos;usage frauduleux.
      </P>

      <H2>7. Droit applicable</H2>
      <P>
        Les présentes conditions sont soumises au droit français. Tout litige
        relève, à défaut de résolution amiable, des tribunaux compétents.
        Contact :{" "}
        <a className="text-brand hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </P>
    </LegalPage>
  );
}
