/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate product catalog (Netlify function)

   GET → the live products an approved-or-pending affiliate can browse in
   the "which product do you want to market?" picker. Requires a valid
   affiliate session (not public) — the catalog itself isn't sensitive,
   but there's no reason to expose it outside the dashboard.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
   ═══════════════════════════════════════════════════════════ */

const { rest, requireAffiliate, json } = require("../../lib/affiliate-auth");

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const affiliate = await requireAffiliate(event);
  if (!affiliate) return json(401, { error: "Not signed in." });

  const products = await rest("aff_products?status=eq.live&select=slug,name,logo_url,description,guide&order=name.asc");
  return json(200, { products });
};
