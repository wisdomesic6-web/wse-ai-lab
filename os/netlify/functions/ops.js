/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — Ops data API (bookings, inventory, AI templates)

   Backed by Supabase (service-role, server-side, behind Basic Auth).
     GET  → { bookings: [...], inventory: [...], templates: [...] }
     POST → body { entity: 'booking'|'inventory'|'template', row: {...} }

   AI-template columns descr/tag_color map to client desc/tagColor.
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

  const tplToClient = (r) => ({ id: r.id, name: r.name, desc: r.descr, tag: r.tag, tagColor: r.tag_color });
  const tplToDb = (r) => ({ id: r.id, name: r.name, descr: r.desc, tag: r.tag, tag_color: r.tagColor });

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const [bookings, inventory, templates] = await Promise.all([
        rest("bookings?select=*&order=created_at.asc"),
        rest("inventory?select=*&order=created_at.asc"),
        rest("ai_templates?select=*&order=created_at.asc"),
      ]);
      return json(200, { bookings, inventory, templates: templates.map(tplToClient) });
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { entity, row } = body;
      const table = { booking: "bookings", inventory: "inventory", template: "ai_templates" }[entity];
      if (!table) return json(400, { error: "Unknown entity." });
      const payload = entity === "template" ? tplToDb(row) : row;
      const [inserted] = await rest(table, {
        method: "POST", headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
      return json(201, { row: entity === "template" ? tplToClient(inserted) : inserted });
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
