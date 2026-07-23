import type { Metadata } from "next";
import { LegalPage, H2, P, Fill } from "@/components/site/legal";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Mentions légales — reviu",
  description: "Mentions légales du service reviu.",
  alternates: { canonical: `${SITE_URL}/mentions-legales` },
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="23 juillet 2026">
      <P>
        Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
        l&apos;économie numérique (LCEN), les informations suivantes sont portées
        à la connaissance des utilisateurs du site reviu.
      </P>

      <H2>Éditeur du site</H2>
      <P>
        Le site {SITE_URL} et le service reviu sont édités par{" "}
        <Fill>raison sociale — ex. Reviu SAS</Fill>, <Fill>forme juridique</Fill>{" "}
        au capital de <Fill>montant</Fill> €, immatriculée au RCS de{" "}
        <Fill>ville</Fill> sous le numéro <Fill>SIREN / SIRET</Fill>, dont le
        siège social est situé <Fill>adresse complète du siège</Fill>.
      </P>
      <P>
        Numéro de TVA intracommunautaire : <Fill>FR…</Fill>. Directeur de la
        publication : <Fill>nom du responsable</Fill>. Contact :{" "}
        <a className="text-brand hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </P>

      <H2>Hébergement</H2>
      <P>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave
        #4133, Walnut, CA 91789, États-Unis. Les données applicatives sont
        hébergées par <strong>Supabase Inc.</strong> au sein de l&apos;Union
        européenne (région Europe / Francfort, Allemagne).
      </P>

      <H2>Propriété intellectuelle</H2>
      <P>
        L&apos;ensemble des éléments du site (marque reviu, logo, textes,
        interfaces, code) est protégé par le droit de la propriété
        intellectuelle et demeure la propriété exclusive de l&apos;éditeur.
        Toute reproduction sans autorisation est interdite.
      </P>

      <H2>Responsabilité</H2>
      <P>
        L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des
        informations diffusées mais ne saurait être tenu responsable des
        omissions, inexactitudes ou indisponibilités du service.
      </P>
    </LegalPage>
  );
}
