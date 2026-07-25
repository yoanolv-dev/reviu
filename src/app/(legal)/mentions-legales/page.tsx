import type { Metadata } from "next";
import { LegalPage, H2, P } from "@/components/site/legal";
import { CONTACT_EMAIL, SITE_URL, GOOGLE_DISCLAIMER } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Mentions légales - reviu",
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
        <strong>NEVIFY</strong>, entreprise individuelle (entrepreneur
        individuel) représentée par Yoan Oliveira, immatriculée au Registre
        national des entreprises sous le numéro SIREN 992&nbsp;266&nbsp;197
        (SIRET 992&nbsp;266&nbsp;197&nbsp;00019), dont le siège est situé
        14&nbsp;rue de la République, 30000 Nîmes, France.
      </P>
      <P>
        TVA non applicable, article 293 B du Code général des impôts. Directeur
        de la publication : Yoan Oliveira. Contact :{" "}
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

      <H2>Indépendance vis-à-vis de Google</H2>
      <P>{GOOGLE_DISCLAIMER}</P>
    </LegalPage>
  );
}
