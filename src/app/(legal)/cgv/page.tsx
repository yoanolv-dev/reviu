import type { Metadata } from "next";
import { LegalPage, H2, P, UL, Fill } from "@/components/site/legal";
import { CONTACT_EMAIL, SITE_URL, STAND_PRICE, SUBSCRIPTION } from "@/lib/brand";
import { formatEuros, getProduct } from "@/lib/shop";

const FORMATION_PRICE = formatEuros(getProduct("formation")!.priceCents);
const PACK10_PRICE = formatEuros(getProduct("pack10")!.priceCents);
const PACK20_PRICE = formatEuros(getProduct("pack20")!.priceCents);

export const metadata: Metadata = {
  title: "Conditions générales de vente — reviu",
  description:
    "Conditions générales de vente des présentoirs reviu et de l'abonnement de suivi : prix, livraison, rétractation, garanties, résiliation.",
  alternates: { canonical: `${SITE_URL}/cgv` },
};

export default function CGV() {
  return (
    <LegalPage
      title="Conditions générales de vente"
      updated="23 juillet 2026"
    >
      <P>
        Les présentes conditions régissent la vente des présentoirs reviu et de
        l&apos;abonnement de suivi, par NEVIFY (entrepreneur individuel — Yoan
        Oliveira), ci-après « le Vendeur ».
      </P>

      <H2>1. Produits et prix</H2>
      <UL>
        <li>
          <strong>Présentoir NFC + QR</strong> : {STAND_PRICE} l&apos;unité,
          achat unique (produit physique).
        </li>
        <li>
          <strong>Formation en ligne</strong> : {FORMATION_PRICE}, achat unique
          (contenu numérique, accès en ligne immédiat et à vie).
        </li>
        <li>
          <strong>Pack Revendeur 10</strong> : {PACK10_PRICE} (formation + 10
          présentoirs) · <strong>Pack Revendeur 20</strong> : {PACK20_PRICE}{" "}
          (formation + 20 présentoirs).
        </li>
        <li>
          <strong>Abonnement de suivi</strong> : {SUBSCRIPTION.priceLabel}/
          {SUBSCRIPTION.period} par présentoir, sans engagement.
        </li>
      </UL>
      <P>
        Prix en euros. TVA non applicable, article 293 B du CGI.
        L&apos;activation d&apos;un présentoir est gratuite et n&apos;entraîne
        aucun frais.
      </P>

      <H2>2. Commande et paiement</H2>
      <P>
        Les présentoirs sont commandés via notre boutique en ligne ; le paiement
        y est sécurisé. L&apos;abonnement est souscrit depuis l&apos;application
        et géré par Stripe. La commande est validée après confirmation du
        paiement.
      </P>

      <H2>3. Livraison</H2>
      <UL>
        <li>Zone : France métropolitaine.</li>
        <li>Délai indicatif : 3 à 5 jours ouvrés après confirmation.</li>
        <li>
          Frais de livraison indiqués avant la validation de la commande.
        </li>
      </UL>
      <P>
        En cas de retard anormal, contactez-nous à{" "}
        <a className="text-brand hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </P>

      <H2>4. Droit de rétractation</H2>
      <P>
        <strong>Produits physiques (présentoirs, packs).</strong> Conformément
        aux articles L221-18 et suivants du Code de la consommation, vous
        disposez d&apos;un délai de <strong>14 jours</strong> à compter de la
        réception pour vous rétracter, sans motif. Le présentoir doit être
        retourné dans son état d&apos;origine ; les frais de retour sont à votre
        charge. Le remboursement intervient sous 14 jours après réception du
        retour.
      </P>
      <P>
        <strong>Contenu numérique (formation).</strong> Conformément à
        l&apos;article L221-28, 13° du Code de la consommation, en demandant
        l&apos;accès immédiat à la formation, vous consentez expressément à son
        exécution avant la fin du délai de rétractation et reconnaissez{" "}
        <strong>renoncer à votre droit de rétractation</strong> une fois
        l&apos;accès ouvert. Pour un pack, cette renonciation ne concerne que la
        partie formation ; les présentoirs restent soumis au droit de
        rétractation ci-dessus.
      </P>

      <H2>5. Garanties</H2>
      <P>
        Les présentoirs bénéficient de la garantie légale de conformité (2 ans,
        art. L217-3 et s. du Code de la consommation) et de la garantie contre
        les vices cachés (art. 1641 et s. du Code civil).
      </P>

      <H2>6. Abonnement et résiliation</H2>
      <P>
        L&apos;abonnement est renouvelé automatiquement chaque mois. Vous pouvez
        le résilier à tout moment depuis votre espace ; il reste actif
        jusqu&apos;à la fin de la période en cours. Après résiliation, la
        redirection du présentoir continue de fonctionner ; seules les
        fonctionnalités de suivi (statistiques, modification des liens, retours
        privés) sont désactivées.
      </P>

      <H2>7. Réclamations et médiation</H2>
      <P>
        Pour toute réclamation :{" "}
        <a className="text-brand hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        . Conformément à l&apos;article L612-1 du Code de la consommation, vous
        pouvez recourir gratuitement à un médiateur de la consommation :{" "}
        <Fill>nom et coordonnées du médiateur</Fill>. Plateforme européenne de
        règlement des litiges :{" "}
        <a
          className="text-brand hover:underline"
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </P>

      <H2>8. Droit applicable</H2>
      <P>Les présentes conditions sont soumises au droit français.</P>
    </LegalPage>
  );
}
