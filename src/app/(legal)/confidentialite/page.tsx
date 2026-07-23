import type { Metadata } from "next";
import { LegalPage, H2, P, UL } from "@/components/site/legal";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Politique de confidentialité — reviu",
  description:
    "Comment reviu collecte, utilise et protège vos données personnelles, conformément au RGPD et aux règles des API Google.",
  alternates: { canonical: `${SITE_URL}/confidentialite` },
};

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="23 juillet 2026">
      <P>
        La présente politique décrit comment reviu (« nous ») collecte, utilise
        et protège les données personnelles des commerçants utilisateurs et de
        leurs clients, conformément au Règlement général sur la protection des
        données (RGPD) et à la loi Informatique et Libertés.
      </P>

      <H2>Responsable du traitement</H2>
      <P>
        Le responsable du traitement est <strong>NEVIFY</strong> (entrepreneur
        individuel — Yoan Oliveira), 14 rue de la République, 30000 Nîmes. Pour
        toute question relative à vos données :{" "}
        <a className="text-brand hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </P>

      <H2>Données que nous collectons</H2>
      <UL>
        <li>
          <strong>Compte commerçant</strong> : adresse e-mail, nom de
          l&apos;établissement, lien de la fiche Google, préférences.
        </li>
        <li>
          <strong>Données d&apos;usage des présentoirs</strong> : nombre de
          scans, clics de redirection, canal (NFC / QR), horodatage. Aucune
          donnée identifiante du client final scannant n&apos;est collectée.
        </li>
        <li>
          <strong>Retours privés</strong> : note et message éventuellement
          laissés par un client via le canal privé.
        </li>
        <li>
          <strong>Paiement</strong> : les abonnements sont gérés par Stripe.
          Nous ne stockons jamais les numéros de carte ; nous conservons
          uniquement un identifiant d&apos;abonnement et son statut.
        </li>
        <li>
          <strong>Données Google Business Profile</strong> (fonctionnalité
          optionnelle, sur connexion de votre compte Google) : avis, réponses et
          statistiques de votre fiche, auxquels nous accédons en votre nom pour
          les afficher et les gérer dans reviu.
        </li>
      </UL>

      <H2>Utilisation des données des API Google</H2>
      <P>
        L&apos;utilisation et le transfert par reviu des informations reçues des
        API Google respectent la{" "}
        <a
          className="text-brand hover:underline"
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , y compris ses exigences d&apos;utilisation limitée (Limited Use). Les
        données de votre fiche Google sont utilisées uniquement pour vous fournir
        les fonctionnalités visibles dans reviu (consultation des avis, réponse,
        statistiques). Elles ne sont ni vendues, ni utilisées à des fins
        publicitaires, ni transférées à des tiers en dehors de ce qui est
        nécessaire à la fourniture du service ou exigé par la loi.
      </P>

      <H2>Finalités et bases légales</H2>
      <UL>
        <li>Fournir et administrer le service (exécution du contrat).</li>
        <li>
          Mesurer l&apos;audience des présentoirs et établir des statistiques
          (intérêt légitime).
        </li>
        <li>Gérer la facturation des abonnements (obligation légale, contrat).</li>
        <li>Envoyer des notifications liées au service (intérêt légitime).</li>
      </UL>

      <H2>Sous-traitants</H2>
      <P>Nous faisons appel à des prestataires qui traitent des données pour notre compte :</P>
      <UL>
        <li>
          <strong>Supabase</strong> — hébergement de la base de données et
          authentification (Union européenne).
        </li>
        <li>
          <strong>Vercel</strong> — hébergement de l&apos;application.
        </li>
        <li>
          <strong>Stripe</strong> — traitement des paiements.
        </li>
        <li>
          <strong>Resend</strong> — envoi des e-mails transactionnels.
        </li>
        <li>
          <strong>Google</strong> — API Business Profile (si vous activez cette
          fonctionnalité).
        </li>
      </UL>

      <H2>Durée de conservation</H2>
      <P>
        Les données de compte sont conservées tant que le compte est actif, puis
        supprimées ou anonymisées <strong>sous 30 jours</strong> après sa
        clôture. Les données de facturation sont conservées conformément aux
        obligations légales (jusqu&apos;à 10 ans). Les données d&apos;usage des
        présentoirs (scans, clics) sont conservées 24 mois à des fins
        statistiques.
      </P>

      <H2>Données Google : accès, conservation et suppression</H2>
      <P>
        L&apos;accès à Google Business Profile est <strong>facultatif</strong> et
        nécessite votre <strong>autorisation explicite</strong> via Google
        (OAuth). Nous accédons alors à vos avis, réponses, notes et statistiques
        de fiche, uniquement pour vous les afficher et vous permettre d&apos;y
        répondre depuis reviu. reviu ne publie ni ne modifie rien sans une action
        de votre part.
      </P>
      <UL>
        <li>
          <strong>Déconnexion</strong> : vous pouvez déconnecter votre compte
          Google à tout moment depuis vos réglages reviu, ou depuis les
          paramètres de votre compte Google.
        </li>
        <li>
          <strong>Jetons OAuth</strong> : ils sont <strong>supprimés
          immédiatement</strong> lors de la déconnexion ou de la révocation de
          l&apos;accès, et ne sont plus utilisables.
        </li>
        <li>
          <strong>Données synchronisées</strong> : les données issues de Google
          sont supprimées ou anonymisées <strong>sous 30 jours</strong> après la
          déconnexion.
        </li>
        <li>
          Ces données ne sont <strong>ni vendues, ni utilisées à des fins
          publicitaires</strong>, ni partagées en dehors de ce qui est
          strictement nécessaire au service.
        </li>
      </UL>

      <H2>Vos droits</H2>
      <P>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
        rectification, d&apos;effacement, de limitation, d&apos;opposition et de
        portabilité de vos données. Vous pouvez les exercer à l&apos;adresse{" "}
        <a className="text-brand hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        . Vous pouvez également révoquer à tout moment l&apos;accès de reviu à
        votre compte Google depuis les{" "}
        <a
          className="text-brand hover:underline"
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          paramètres de votre compte Google
        </a>
        . En cas de litige, vous pouvez saisir la CNIL (cnil.fr).
      </P>

      <H2>Sécurité</H2>
      <P>
        Nous mettons en œuvre des mesures techniques et organisationnelles
        appropriées : chiffrement des échanges, contrôle d&apos;accès, cloisonnement
        des données par établissement, et stockage des secrets hors du code.
      </P>
    </LegalPage>
  );
}
