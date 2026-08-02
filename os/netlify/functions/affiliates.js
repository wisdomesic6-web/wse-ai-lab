/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult OS — Affiliate portal admin API (Netlify function)

   Backed by Supabase using the SERVICE ROLE key (server-side only,
   behind the Basic Auth gate) — same tables the public website's
   affiliate-facing endpoints write to, so approvals/catalog edits made
   here are immediately live for affiliates.

     GET    → { affiliates, products, links, payouts }
     POST   → body { entity: 'product'|'payout', row: {...} } → inserts
     PATCH  → body { entity: 'affiliate'|'product'|'payout', id, patch }

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   ═══════════════════════════════════════════════════════════ */

exports.handler = async function (event) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json(500, { error: "Supabase env vars not configured." });

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

  // Allow-lists — mirror the customerToDb/memberToDb precedent so an
  // arbitrary POST/PATCH body can't set columns outside what the OS UI
  // actually edits.
  const productToDb = (r) => ({
    slug: r.slug, name: r.name, logo_url: r.logo_url || null, description: r.description,
    commission_pct: r.commission_pct, product_url: r.product_url, status: r.status,
  });
  const payoutToDb = (r) => ({
    affiliate_id: r.affiliate_id, amount: r.amount, period_covered: r.period_covered,
    status: r.status || "pending", note: r.note || null,
  });

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const [affiliates, products, links, payouts] = await Promise.all([
        rest("affiliates?select=*&order=applied_at.desc"),
        rest("aff_products?select=*&order=name.asc"),
        rest("aff_links?select=*,affiliates(full_name,email),aff_products(name,slug)&order=created_at.desc"),
        rest("aff_payouts?select=*,affiliates(full_name,email)&order=created_at.desc"),
      ]);
      return json(200, { affiliates, products, links, payouts });
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const entity = body.entity;
      const row = body.row || {};

      if (entity === "product") {
        if (!row.slug || !row.name) return json(400, { error: "Need slug and name." });
        const [inserted] = await rest("aff_products", {
          method: "POST", headers: { Prefer: "return=representation" },
          body: JSON.stringify(productToDb(row)),
        });
        return json(201, { product: inserted });
      }

      if (entity === "payout") {
        if (!row.affiliate_id || !row.amount) return json(400, { error: "Need affiliate_id and amount." });
        const toInsert = payoutToDb(row);
        if (toInsert.status === "paid") toInsert.paid_at = new Date().toISOString();
        const [inserted] = await rest("aff_payouts", {
          method: "POST", headers: { Prefer: "return=representation" },
          body: JSON.stringify(toInsert),
        });
        return json(201, { payout: inserted });
      }

      return json(400, { error: "Unknown entity." });
    }

    if (method === "PATCH") {
      const body = JSON.parse(event.body || "{}");
      const entity = body.entity;
      const id = body.id;
      const patch = body.patch || {};
      if (!id) return json(400, { error: "Missing id." });

      if (entity === "affiliate") {
        // Approve/reject only — bank/contact details are never editable
        // from this path.
        if (!["pending", "approved", "rejected"].includes(patch.status)) {
          return json(400, { error: "Invalid status." });
        }
        const toPatch = { status: patch.status };
        if (patch.status === "approved") toPatch.approved_at = new Date().toISOString();
        await rest(`affiliates?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(toPatch) });
        return json(200, { ok: true });
      }

      if (entity === "product") {
        await rest(`aff_products?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(productToDb(patch)) });
        return json(200, { ok: true });
      }

      if (entity === "payout") {
        const toPatch = { status: patch.status, note: patch.note || null };
        if (patch.status === "paid") toPatch.paid_at = new Date().toISOString();
        await rest(`aff_payouts?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(toPatch) });
        return json(200, { ok: true });
      }

      return json(400, { error: "Unknown entity." });
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
