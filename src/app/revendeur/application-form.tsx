"use client";

import { useActionState } from "react";
import { submitResellerApplication } from "@/lib/reseller-application-actions";
import { buttonClass } from "@/components/ui/button";

const field =
  "w-full rounded-xl border border-line bg-canvas px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_4px_var(--color-brand-soft)]";

/** Profils proposés (repris tels quels dans l'e-mail de candidature). */
const PROFILES = [
  "Commercial terrain / agent indépendant",
  "Agence web ou marketing",
  "Prestataire des commerçants",
  "Réseau ou association de commerçants",
  "Autre",
];
const label = "text-sm font-medium text-ink";

/** Formulaire de candidature revendeur : poste vers l'action serveur qui
 *  envoie la candidature par e-mail au propriétaire. */
export function ApplicationForm() {
  const [state, action, pending] = useActionState(
    submitResellerApplication,
    null,
  );

  if (state?.ok) {
    return (
      <div className="rounded-3xl border border-brand/40 bg-brand-soft p-8 text-center">
        <span className="grid mx-auto h-12 w-12 place-items-center rounded-full bg-brand text-2xl text-white">
          ✓
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">
          Candidature envoyée
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Merci ! Nous étudions chaque candidature au cas par cas et revenons
          vers vous rapidement.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* Piège anti-spam, masqué aux humains. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={label}>
            Nom complet
          </label>
          <input id="name" name="name" required className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={label}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={field}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={label}>
            Téléphone <span className="text-muted">(facultatif)</span>
          </label>
          <input id="phone" name="phone" type="tel" className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className={label}>
            Ville ou secteur
          </label>
          <input id="city" name="city" required className={field} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile" className={label}>
          Votre profil
        </label>
        <select id="profile" name="profile" defaultValue="" className={field}>
          <option value="" disabled>
            Choisissez votre profil
          </option>
          {PROFILES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={label}>
          Votre projet <span className="text-muted">(facultatif)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Votre activité, les commerces que vous rencontrez, votre zone…"
          className={field + " resize-y"}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={buttonClass("gradient", "lg", "w-full sm:w-auto")}
      >
        {pending ? "Envoi…" : "Envoyer ma candidature"}
      </button>
      <p className="text-xs text-muted">
        En envoyant ce formulaire, vous acceptez d&apos;être recontacté au sujet
        du programme revendeur. Aucune donnée n&apos;est utilisée à d&apos;autres
        fins.
      </p>
    </form>
  );
}
