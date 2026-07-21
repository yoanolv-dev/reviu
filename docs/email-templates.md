# Templates e-mail Supabase (FR)

À coller dans **Supabase → Authentication → Email Templates** (un **Subject** + le **HTML** par template).

- Couleur de marque : `#1b4dff`.
- Styles **en ligne** (compatibilité maximale des clients mail).
- ⚠️ **Ne pas retirer `{{ .ConfirmationURL }}`** : c'est l'URL qui passe par `src/app/auth/callback/route.ts`
  (`exchangeCodeForSession`) pour ouvrir la session.
- État : le **lien magique** et la **confirmation d'inscription** sont fonctionnels (une fois le SMTP configuré).
  Le **reset password** et le **changement d'e-mail** nécessitent encore l'UI correspondante dans l'app (cf. HANDOFF).

---

## 1. Magic Link — Subject : `Votre lien de connexion à reviu`

```html
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Votre lien de connexion sécurisé à reviu.</div>
<div style="background-color:#f5f6f8;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e6e8ec;">
    <tr><td style="padding:32px 32px 0;">
      <div style="font-size:20px;font-weight:700;color:#0a0d16;letter-spacing:-0.01em;">reviu</div>
    </td></tr>
    <tr><td style="padding:24px 32px 32px;">
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#0a0d16;font-weight:600;">Votre lien de connexion</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5160;">Cliquez sur le bouton ci-dessous pour vous connecter à votre espace reviu. Aucun mot de passe n'est nécessaire.</p>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="border-radius:9999px;background:#1b4dff;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">Se connecter</a>
        </td>
      </tr></table>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8a90a0;">Ce lien expire dans 1 heure. Si le bouton ne fonctionne pas, copiez-collez cette adresse dans votre navigateur :</p>
      <p style="margin:8px 0 0;font-size:13px;line-height:1.5;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#1b4dff;text-decoration:underline;">{{ .ConfirmationURL }}</a></p>
    </td></tr>
    <tr><td style="padding:20px 32px;border-top:1px solid #eef0f3;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#8a90a0;">Vous n'êtes pas à l'origine de cette demande ? Ignorez cet e-mail, aucune action ne sera effectuée.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#b0b5c0;">© reviu · Conçu en France</p>
    </td></tr>
  </table>
</div>
```

---

## 2. Confirm signup — Subject : `Confirmez votre inscription à reviu`

```html
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Confirmez votre adresse pour activer votre compte reviu.</div>
<div style="background-color:#f5f6f8;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e6e8ec;">
    <tr><td style="padding:32px 32px 0;">
      <div style="font-size:20px;font-weight:700;color:#0a0d16;letter-spacing:-0.01em;">reviu</div>
    </td></tr>
    <tr><td style="padding:24px 32px 32px;">
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#0a0d16;font-weight:600;">Bienvenue sur reviu 👋</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5160;">Il ne reste qu'une étape : confirmez votre adresse e-mail pour activer votre compte et accéder à votre tableau de bord.</p>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="border-radius:9999px;background:#1b4dff;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">Confirmer mon inscription</a>
        </td>
      </tr></table>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8a90a0;">Ce lien expire dans 24 heures. Si le bouton ne fonctionne pas, copiez-collez cette adresse dans votre navigateur :</p>
      <p style="margin:8px 0 0;font-size:13px;line-height:1.5;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#1b4dff;text-decoration:underline;">{{ .ConfirmationURL }}</a></p>
    </td></tr>
    <tr><td style="padding:20px 32px;border-top:1px solid #eef0f3;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#8a90a0;">Vous n'avez pas créé de compte reviu ? Ignorez simplement cet e-mail.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#b0b5c0;">© reviu · Conçu en France</p>
    </td></tr>
  </table>
</div>
```

---

## 3. Reset Password — Subject : `Réinitialisez votre mot de passe reviu`

```html
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Choisissez un nouveau mot de passe pour votre compte reviu.</div>
<div style="background-color:#f5f6f8;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e6e8ec;">
    <tr><td style="padding:32px 32px 0;">
      <div style="font-size:20px;font-weight:700;color:#0a0d16;letter-spacing:-0.01em;">reviu</div>
    </td></tr>
    <tr><td style="padding:24px 32px 32px;">
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#0a0d16;font-weight:600;">Réinitialisation du mot de passe</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5160;">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.</p>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="border-radius:9999px;background:#1b4dff;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">Réinitialiser mon mot de passe</a>
        </td>
      </tr></table>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8a90a0;">Ce lien expire dans 1 heure. Si le bouton ne fonctionne pas, copiez-collez cette adresse dans votre navigateur :</p>
      <p style="margin:8px 0 0;font-size:13px;line-height:1.5;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#1b4dff;text-decoration:underline;">{{ .ConfirmationURL }}</a></p>
    </td></tr>
    <tr><td style="padding:20px 32px;border-top:1px solid #eef0f3;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#8a90a0;">Vous n'avez pas demandé cette réinitialisation ? Ignorez cet e-mail, votre mot de passe reste inchangé.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#b0b5c0;">© reviu · Conçu en France</p>
    </td></tr>
  </table>
</div>
```

---

## 4. Change Email Address — Subject : `Confirmez votre nouvelle adresse e-mail`

```html
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Confirmez le changement d'adresse e-mail de votre compte reviu.</div>
<div style="background-color:#f5f6f8;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e6e8ec;">
    <tr><td style="padding:32px 32px 0;">
      <div style="font-size:20px;font-weight:700;color:#0a0d16;letter-spacing:-0.01em;">reviu</div>
    </td></tr>
    <tr><td style="padding:24px 32px 32px;">
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#0a0d16;font-weight:600;">Confirmez votre nouvelle adresse</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5160;">Vous avez demandé à remplacer l'adresse e-mail de votre compte reviu par <strong style="color:#0a0d16;">{{ .NewEmail }}</strong>. Confirmez ce changement en cliquant ci-dessous.</p>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="border-radius:9999px;background:#1b4dff;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">Confirmer mon adresse</a>
        </td>
      </tr></table>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8a90a0;">Si le bouton ne fonctionne pas, copiez-collez cette adresse dans votre navigateur :</p>
      <p style="margin:8px 0 0;font-size:13px;line-height:1.5;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:#1b4dff;text-decoration:underline;">{{ .ConfirmationURL }}</a></p>
    </td></tr>
    <tr><td style="padding:20px 32px;border-top:1px solid #eef0f3;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#8a90a0;">Vous n'êtes pas à l'origine de cette demande ? Ignorez cet e-mail et vérifiez la sécurité de votre compte.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#b0b5c0;">© reviu · Conçu en France</p>
    </td></tr>
  </table>
</div>
```
