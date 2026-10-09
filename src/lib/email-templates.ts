/**
 * Modèles des e-mails transactionnels envoyés par l'application (via Resend,
 * `src/lib/email.ts`) : code de connexion, réinitialisation du mot de passe,
 * confirmation d'activation (commerçant) et notification interne (admin).
 *
 * Styles en ligne (compatibilité des clients mail), couleur de marque #1b4dff,
 * même gabarit que les modèles Supabase de `docs/email-templates.md`.
 * Toute valeur saisie par un utilisateur passe par `esc()`.
 */

const BRAND = "#1b4dff";

export function esc(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="border-radius:9999px;background:${BRAND};">
          <a href="${esc(href)}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">${esc(label)}</a>
        </td>
      </tr></table>`;
}

function layout(opts: {
  preheader: string;
  title: string;
  body: string;
  footer: string;
}): string {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
<div style="background-color:#f5f6f8;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e6e8ec;">
    <tr><td style="padding:32px 32px 0;">
      <div style="font-size:20px;font-weight:700;color:#0a0d16;letter-spacing:-0.01em;">reviu</div>
    </td></tr>
    <tr><td style="padding:24px 32px 32px;">
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#0a0d16;font-weight:600;">${esc(opts.title)}</h1>
      ${opts.body}
    </td></tr>
    <tr><td style="padding:20px 32px;border-top:1px solid #eef0f3;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#8a90a0;">${opts.footer}</p>
      <p style="margin:8px 0 0;font-size:12px;color:#b0b5c0;">© reviu · Conçu en France</p>
    </td></tr>
  </table>
</div>`;
}

const p = (html: string, extra = "") =>
  `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a5160;${extra}">${html}</p>`;

/** Code de connexion à 6 chiffres + lien direct (fonctionne sur tout appareil). */
export function authCodeEmail(opts: {
  code: string;
  link: string;
  purpose: "activation" | "login";
}): { subject: string; html: string } {
  const intro =
    opts.purpose === "activation"
      ? "Pour activer votre présentoir et ouvrir votre espace reviu, saisissez ce code sur la page d'activation :"
      : "Pour vous connecter à votre espace reviu, saisissez ce code :";
  const body = `${p(intro)}
      <div style="margin:0 0 20px;padding:16px;border-radius:12px;background:#f5f6f8;text-align:center;font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:0.3em;color:#0a0d16;">${esc(opts.code)}</div>
      ${p("Ou continuez directement avec ce bouton :")}
      ${button(opts.link, opts.purpose === "activation" ? "Continuer l'activation" : "Ouvrir mon espace")}
      <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#8a90a0;">Ce code expire rapidement. Si vous en redemandez un, seul le dernier fonctionne. Ne le communiquez à personne : reviu ne vous le demandera jamais par téléphone.</p>`;
  return {
    subject: `${opts.code} est votre code reviu`,
    html: layout({
      preheader: `Votre code : ${opts.code}`,
      title: opts.purpose === "activation" ? "Votre code d'activation" : "Votre code de connexion",
      body,
      footer:
        "Vous n'êtes pas à l'origine de cette demande ? Ignorez cet e-mail : sans ce code, personne ne peut accéder à votre espace.",
    }),
  };
}

/** Lien de réinitialisation du mot de passe. */
export function passwordResetEmail(link: string): { subject: string; html: string } {
  const body = `${p("Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.")}
      ${button(link, "Choisir un nouveau mot de passe")}
      <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#8a90a0;">Ce lien expire rapidement et ne sert qu'une fois.</p>`;
  return {
    subject: "Réinitialisez votre mot de passe reviu",
    html: layout({
      preheader: "Choisissez un nouveau mot de passe pour votre compte reviu.",
      title: "Réinitialisation du mot de passe",
      body,
      footer:
        "Vous n'avez pas demandé cette réinitialisation ? Ignorez cet e-mail, votre mot de passe reste inchangé.",
    }),
  };
}

/** Confirmation envoyée au commerçant après l'activation d'un présentoir. */
export function activationCustomerEmail(opts: {
  establishmentName: string;
  standAddress: string;
  googleUrl: string | null;
  loginUrl: string;
  contactLine: string;
}): { subject: string; html: string } {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;font-size:13px;color:#8a90a0;width:140px;vertical-align:top;">${label}</td><td style="padding:6px 0;font-size:14px;color:#0a0d16;word-break:break-all;">${value}</td></tr>`;
  const status = opts.googleUrl
    ? "Vos clients peuvent déjà l'utiliser."
    : "<strong style=\"color:#0a0d16;\">Dernière étape :</strong> ajoutez le lien d'avis de votre fiche Google depuis votre espace, pour que le présentoir redirige vos clients.";
  const body = `${p(`Votre présentoir est relié à <strong style="color:#0a0d16;">${esc(opts.establishmentName)}</strong>. ${status}`)}
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;border-top:1px solid #eef0f3;border-bottom:1px solid #eef0f3;">
        ${row("Présentoir", esc(opts.standAddress))}
        ${row("Lien d'avis", opts.googleUrl ? esc(opts.googleUrl) : "À ajouter depuis votre espace")}
      </table>
      ${p("Depuis votre espace, suivez vos scans et modifiez votre lien à tout moment.")}
      ${button(opts.loginUrl, "Accéder à mon espace")}
      <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#8a90a0;"><strong style="color:#4a5160;">Pour revenir plus tard :</strong> saisissez votre e-mail sur la page de connexion, vous recevrez un code. Pas de mot de passe à retenir.</p>
      <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#8a90a0;"><strong style="color:#4a5160;">Bon à savoir :</strong> le code secret imprimé ne permet plus de réactiver ce présentoir. Votre espace est protégé par votre adresse e-mail.</p>`;
  return {
    subject: "Votre Présentoir Reviu est activé",
    html: layout({
      preheader: `Votre présentoir est relié à ${opts.establishmentName}.`,
      title: "Présentoir activé !",
      body,
      footer: `Vous n'êtes pas à l'origine de cette activation ? ${esc(opts.contactLine)}`,
    }),
  };
}

/** Notification interne : un présentoir vient d'être activé. */
export function activationAdminEmail(opts: {
  code: string;
  establishmentName: string;
  googleUrl: string | null;
  email: string;
  via: string;
  newEstablishment: boolean;
  standsOnAccount: number;
  adminUrl: string;
  date: string;
}): { subject: string; html: string } {
  const li = (label: string, value: string) =>
    `<li style="margin:0 0 6px;"><strong>${label} :</strong> ${value}</li>`;
  const body = `<ul style="margin:0 0 20px;padding-left:18px;font-size:14px;line-height:1.6;color:#0a0d16;">
        ${li("Présentoir", `<code>${esc(opts.code)}</code>`)}
        ${li("Commerce", `${esc(opts.establishmentName)}${opts.newEstablishment ? " (nouveau)" : " (déjà existant)"}`)}
        ${li("Lien d'avis", opts.googleUrl ? esc(opts.googleUrl) : "(aucun pour l'instant)")}
        ${li("E-mail (vérifié)", esc(opts.email))}
        ${li("Présentoirs actifs sur ce compte", String(opts.standsOnAccount))}
        ${li(
          "Activé depuis",
          opts.via === "dashboard"
            ? "l'espace client"
            : opts.via === "tiers"
              ? "le téléphone d'un tiers (revendeur ou démo), code donné par le commerçant"
              : "le scan du présentoir",
        )}
        ${li("Date", esc(opts.date))}
      </ul>
      ${button(opts.adminUrl, "Ouvrir l'admin")}`;
  return {
    subject: `Nouveau présentoir activé - ${opts.establishmentName} (${opts.code})`,
    html: layout({
      preheader: `${opts.establishmentName} vient d'activer le présentoir ${opts.code}.`,
      title: "Nouveau présentoir activé",
      body,
      footer:
        "Activation inattendue (commerce inconnu, lien étrange) ? Faites d'abord créer son espace au vrai commerçant (connexion par code), puis réinitialisez le présentoir et attribuez-le aussitôt à son établissement depuis l'admin : un présentoir laissé vierge se réactive avec le code secret imprimé.",
    }),
  };
}

/** Support : nouveau message d'un commerçant (vers l'admin). */
export function supportToAdminEmail(opts: {
  subject: string;
  body: string;
  email: string;
  isNew: boolean;
  link: string;
}): { subject: string; html: string } {
  const body = `${p(`${opts.isNew ? "Nouvelle demande" : "Nouveau message"} de <strong style="color:#0a0d16;">${esc(opts.email)}</strong> :`)}
      <div style="margin:0 0 20px;padding:14px 16px;border-radius:12px;background:#f5f6f8;font-size:15px;line-height:1.6;color:#0a0d16;white-space:pre-wrap;">${esc(opts.body)}</div>
      ${button(opts.link, "Répondre dans l'admin")}
      ${p(`<span style="font-size:13px;color:#6b7280;">Répondre depuis l'admin garde l'historique et met à jour la demande. Une réponse directe par e-mail n'apparaît pas dans la demande.</span>`)}`;
  return {
    subject: `${opts.isNew ? "Support" : "Support (réponse)"} - ${opts.subject}`,
    html: layout({
      preheader: opts.body.slice(0, 120),
      title: opts.subject,
      body,
      footer: "Répondez depuis l'admin : le commerçant reçoit votre réponse par e-mail.",
    }),
  };
}

/** Support : réponse de l'équipe (vers le commerçant). */
export function supportToClientEmail(opts: {
  subject: string;
  body: string;
  link: string;
}): { subject: string; html: string } {
  const body = `${p("Nous avons répondu à votre demande :")}
      <div style="margin:0 0 20px;padding:14px 16px;border-radius:12px;background:#f5f6f8;font-size:15px;line-height:1.6;color:#0a0d16;white-space:pre-wrap;">${esc(opts.body)}</div>
      ${button(opts.link, "Voir la conversation")}`;
  return {
    subject: `Réponse à votre demande - ${opts.subject}`,
    html: layout({
      preheader: opts.body.slice(0, 120),
      title: opts.subject,
      body,
      footer: "Pour répondre, utilisez le bouton ci-dessus (rubrique Aide de votre espace).",
    }),
  };
}
