/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — CRM data API (Netlify serverless function)

   Customers + leads, backed by Supabase using the SERVICE ROLE key
   (server-side only, behind the Basic Auth edge gate).

     GET   → { customers: [...], leads: [...] }
     POST  → body { entity: 'lead'|'customer', row: {...} }  → inserts, returns row
     PATCH → body { entity: 'lead', id, stage }              → updates lead stage

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
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

  // DB (snake) ↔ client (camel) mapping for leads
  const leadToClient = (r) => ({
    id: r.id, name: r.name, company: r.company, email: r.email, stage: r.stage,
    value: r.value, prob: r.prob, owner: r.owner, ownerColor: r.owner_color,
    color: r.color, initials: r.initials, converted: r.converted,
  });
  const leadToDb = (r) => ({
    id: r.id, name: r.name, company: r.company, email: r.email, stage: r.stage,
    value: r.value, prob: r.prob, owner: r.owner, owner_color: r.ownerColor,
    color: r.color, initials: r.initials,
  });

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const [customers, leads] = await Promise.all([
        rest("customers?select=*&order=created_at.asc"),
        rest("leads?select=*&order=created_at.asc"),
      ]);
      return json(200, { customers, leads: leads.map(leadToClient) });
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const entity = body.entity;
      const row = body.row || {};
      if (entity === "lead") {
        const [inserted] = await rest("leads", {
          method: "POST", headers: { Prefer: "return=representation" },
          body: JSON.stringify(leadToDb(row)),
        });
        return json(201, { lead: leadToClient(inserted) });
      }
      if (entity === "customer") {
        const [inserted] = await rest("customers", {
          method: "POST", headers: { Prefer: "return=representation" },
          body: JSON.stringify(row),
        });
        return json(201, { customer: inserted });
      }
      return json(400, { error: "Unknown entity." });
    }

    if (method === "PATCH") {
      const body = JSON.parse(event.body || "{}");
      if (body.entity === "lead" && body.id) {
        const patch = {};
        if ("stage" in body) patch.stage = body.stage;
        if ("converted" in body) patch.converted = body.converted;
        if (body.patch && typeof body.patch === "object") {
          const map = {
            name: "name", company: "company", email: "email", value: "value",
            prob: "prob", owner: "owner", ownerColor: "owner_color", stage: "stage",
            color: "color", initials: "initials", converted: "converted",
          };
          Object.keys(body.patch).forEach((k) => { if (map[k]) patch[map[k]] = body.patch[k]; });
        }
        if (!Object.keys(patch).length) return json(400, { error: "No lead fields to patch." });
        await rest(`leads?id=eq.${encodeURIComponent(body.id)}`, {
          method: "PATCH", body: JSON.stringify(patch),
        });
        return json(200, { ok: true });
      }
      if (body.entity === "customer" && body.id && body.patch) {
        const allowed = ["name", "email", "seg", "spent", "last", "tags", "color", "initials"];
        const clean = {};
        allowed.forEach((k) => { if (k in body.patch) clean[k] = body.patch[k]; });
        if (!Object.keys(clean).length) return json(400, { error: "No patchable fields supplied." });
        await rest(`customers?id=eq.${encodeURIComponent(body.id)}`, {
          method: "PATCH", body: JSON.stringify(clean),
        });
        return json(200, { ok: true });
      }
      return json(400, { error: "Unsupported patch." });
    }

    if (method === "DELETE") {
      const body = JSON.parse(event.body || "{}");
      const table = { lead: "leads", customer: "customers" }[body.entity];
      if (!table || !body.id) return json(400, { error: "Need entity and id." });
      await rest(`${table}?id=eq.${encodeURIComponent(body.id)}`, { method: "DELETE" });
      return json(200, { ok: true });
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
