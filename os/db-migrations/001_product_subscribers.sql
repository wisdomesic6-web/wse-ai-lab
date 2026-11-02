-- WSE Lab Consult OS — product subscriber/billing telemetry
--
-- Rollup of who has signed up on each WSE SaaS product and whether they've
-- paid — metadata only, never the product's own tenant content (no audit
-- data, uploaded financials, client lists, working papers, etc. ever lands
-- here; see the privacy constraint in the products module itself).
--
-- Each product's own backend pushes one row per signup/plan-change event via
-- the products webhook (POST /api/products). Upserted by
-- (product_slug, external_user_id) so re-sending the same event is safe.

create table if not exists public.product_subscribers (
  id               uuid primary key default gen_random_uuid(),
  product_slug     text not null,              -- matches the Products table slugs in company records, e.g. 'audit', 'smartsales'
  external_user_id text not null,               -- the product's own user/account id (its auth system, not ours)
  name             text,
  email            text,
  firm             text,                        -- company/firm name, when the product has one (e.g. an audit client)
  plan             text,                        -- e.g. 'free', 'pro', 'enterprise' — the product's own plan label
  paid             boolean not null default false,
  signup_at        timestamptz not null default now(),
  last_payment_at  timestamptz,
  updated_at       timestamptz not null default now(),
  unique (product_slug, external_user_id)
);

create index if not exists product_subscribers_product_idx on public.product_subscribers (product_slug);
create index if not exists product_subscribers_paid_idx on public.product_subscribers (product_slug, paid);

alter table public.product_subscribers enable row level security;
-- No client-side policies: this table is read/written exclusively by the OS
-- Netlify/Vercel functions using the Supabase SERVICE ROLE key (server-side
-- only), same pattern as every other OS table. RLS is enabled with zero
-- policies so the anon/authenticated roles get nothing even if a key ever
-- leaked client-side.
