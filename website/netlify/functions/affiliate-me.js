/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate session check (Netlify function)

   GET → the current affiliate's profile + status, resolved from the
   session cookie (never a client-supplied id). Also stamps
   last_login_at, so the OS Affiliates module can show real "last seen"
   activity as affiliates use the dashboard.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
   ═══════════════════════════════════════════════════════════ */

const { rest, requireAffiliate, json } = require("../../lib/affiliate-auth");

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const affiliate = await requireAffiliate(event);
  if (!affiliate) return json(401, { error: "Not signed in." });

  rest(`affiliates?id=eq.${affiliate.id}`, {
    method: "PATCH",
    body: JSON.stringify({ last_login_at: new Date().toISOString() }),
  }).catch(() => {});

  return json(200, {
    fullName: affiliate.full_name,
    email: affiliate.email,
    status: affiliate.status,
    appliedAt: affiliate.applied_at,
  });
};
