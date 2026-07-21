-- Reviu — Cover remaining foreign keys on the new admin tables (low traffic,
-- but keeps the linter clean and JOINs on audit/replacement cheap at scale).
create index if not exists stand_batches_created_by_idx on public.stand_batches(created_by);
create index if not exists stand_batches_exported_by_idx on public.stand_batches(exported_by);
create index if not exists stands_replaced_by_idx on public.stands(replaced_by);
