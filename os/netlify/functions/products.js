/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult OS — Products telemetry API (Netlify serverless function)

   Subscriber/billing rollup across WSE's own SaaS products (Audit System,
   SmartSales, etc.) — "who signed up, what plan, have they paid" ONLY.
   Never the product's own tenant content: no uploaded financials, client
   lists, audit findings, working papers, or anything from inside a
   product's own data. Each product's backend pushes events here; the OS
   never reaches into a product's database to read them.

     GET   → { products: [{slug,total,paid,unpaid,last_signup_at}], subscribers: [...] }
     POST  → one signup/plan-change event from a product's own backend.
             Body: { product_slug, external_user_id, name?, email?, firm?,
                      plan?, paid? }
             Upserts on (product_slug, external_user_id).
             Auth: header x-webhook-secret must match PRODUCTS_WEBHOOK_SECRET.
             This is IN ADDITION TO the existing Netlify edge Basic-Auth gate
             (netlify/edge-functions/auth.js, config.path:"/*") which still
             covers this route — a calling product's backend needs BOTH a
             valid Authorization: Basic header (OS_USER/OS_PASSWORD) AND this
             secret. That gate was not narrowed for this endpoint; narrowing
             it is a separate, deliberate change to make later if the double
             auth becomes a real friction point.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PRODUCTS_WEBHOOK_SECRET
   ═══════════════════════════════════════════════════════════ */

exports.handler = async function (event) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return json(500, { error: "Supabase env vars not configured." });
  }

  const base = { apikey: key, Authorization: `Bearer ${key}` };
  const rest = async (path, init = {}) => {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      ...init,
      headers: { ...base, "Content-Type": "application/json", Accept: "application/json", ...(init.headers || {}) },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Supabase ${path} → ${res.status} ${text}`);
    return text ? JSON.parse(text) : null;
  };

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const rows = await rest(
        "product_subscribers?select=product_slug,name,email,firm,plan,paid,signup_at,last_payment_at&order=signup_at.desc&limit=500"
      );
      const bySlug = new Map();
      for (const r of rows) {
        const s = bySlug.get(r.product_slug) || { slug: r.product_slug, total: 0, paid: 0, unpaid: 0, last_signup_at: r.signup_at };
        s.total += 1;
        if (r.paid) s.paid += 1; else s.unpaid += 1;
        if (r.signup_at > s.last_signup_at) s.last_signup_at = r.signup_at;
        bySlug.set(r.product_slug, s);
      }
      return json(200, { products: [...bySlug.values()], subscribers: rows });
    }

    if (method === "POST") {
      const secret = process.env.PRODUCTS_WEBHOOK_SECRET;
      const supplied = event.headers?.["x-webhook-secret"] || event.headers?.["X-Webhook-Secret"];
      if (!secret || supplied !== secret) {
        return json(401, { error: "Missing or invalid x-webhook-secret." });
      }

      const body = JSON.parse(event.body || "{}");
      if (!body.product_slug || !body.external_user_id) {
        return json(400, { error: "product_slug and external_user_id are required." });
      }

      // Allow-list — a compromised or buggy caller can only ever write
      // signup/billing metadata, never arbitrary columns.
      const row = {
        product_slug: String(body.product_slug),
        external_user_id: String(body.external_user_id),
        name: body.name != null ? String(body.name) : null,
        email: body.email != null ? String(body.email) : null,
        firm: body.firm != null ? String(body.firm) : null,
        plan: body.plan != null ? String(body.plan) : null,
        paid: !!body.paid,
        updated_at: new Date().toISOString(),
      };
      if (body.paid) row.last_payment_at = new Date().toISOString();

      const [inserted] = await rest("product_subscribers", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(row),
      });
      return json(201, { subscriber: inserted });
    }

    return json(405, { error: "Method not allowed." });
  } catch (err) {
    return json(502, { error: String(err.message || err) });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    body: JSON.stringify(body),
  };
}
