-- Reviu - Activation verifiee (etape 2/2 : verrouillage).
--
-- ⚠️ A appliquer AU MOMENT DE LA MISE EN PROD, juste apres le deploiement du
-- code qui utilise activate_stand_verified (sinon l'ancien parcours
-- d'activation de la prod cesse de fonctionner).
--
-- 1. Les anciennes fonctions d'activation ne sont plus appelables depuis le
--    navigateur. Avant : n'importe qui ayant le code + le secret (imprime sur
--    le presentoir, donc photographiable) pouvait activer un presentoir vierge
--    avec n'importe quelle adresse e-mail, sans la verifier. Desormais tout
--    passe par le serveur (activate_stand_verified), avec e-mail verifie.
revoke all on function public.activate_stand(text, text, text, text, text)
  from public, anon, authenticated;
revoke all on function public.claim_stand(text, uuid, text)
  from public, anon, authenticated;

-- 2. Ancienne simulation d'abonnement : appelable par n'importe qui avec le
--    seul code PUBLIC du presentoir (les presentoirs recents n'ont pas de
--    claim_pin_hash, donc aucun secret n'etait verifie). Plus utilisee par
--    l'application : le webhook Stripe est la seule source de verite.
revoke all on function public.self_set_subscription(text, text, text)
  from public, anon, authenticated;

-- 3. Liens de redirection : Google uniquement, quel que soit le chemin
--    d'ecriture (tableau de bord, API directe, admin). Un presentoir detourne
--    ne peut donc pas renvoyer vers une page de phishing. Seules les valeurs
--    MODIFIEES sont controlees : les liens existants restent intacts.
create or replace function public.guard_review_url()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  if tg_table_name = 'establishments' then
    if (tg_op = 'INSERT' or new.google_review_url is distinct from old.google_review_url)
       and not public.is_allowed_review_url(nullif(trim(new.google_review_url), '')) then
      raise exception 'invalid_review_url';
    end if;
  elsif tg_table_name = 'stands' then
    if (tg_op = 'INSERT' or new.target_url is distinct from old.target_url)
       and not public.is_allowed_review_url(nullif(trim(new.target_url), '')) then
      raise exception 'invalid_review_url';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.guard_review_url() from public, anon, authenticated;

drop trigger if exists establishments_review_url_guard on public.establishments;
create trigger establishments_review_url_guard
  before insert or update of google_review_url on public.establishments
  for each row execute function public.guard_review_url();

drop trigger if exists stands_target_url_guard on public.stands;
create trigger stands_target_url_guard
  before insert or update of target_url on public.stands
  for each row execute function public.guard_review_url();
