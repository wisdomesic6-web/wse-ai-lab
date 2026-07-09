/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult OS — Ops data API
   (bookings, inventory, AI templates, businesses, workflows)

   Backed by Supabase (service-role, server-side, behind Basic Auth).
     GET   → { bookings, inventory, templates, businesses, workflows }
     POST  → body { entity, row }  → insert
     PATCH → body { entity, id, patch } → update selected fields

   AI-template columns descr/tag_color/prompt_text map to client
   desc/tagColor/prompt. Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   ═══════════════════════════════════════════════════════════ */

const TABLES = {
  booking: "bookings",
  inventory: "inventory",
  template: "ai_templates",
  business: "businesses",
  workflow: "workflows",
};

/* Whitelist of PATCHable columns per entity */
const PATCHABLE = {
  workflow: ["name", "trigger_desc", "action_desc", "status", "runs"],
  template: ["name", "descr", "tag", "tag_color", "prompt_text"],
  business: ["name", "btype", "status", "url", "notes"],
  booking: ["status"],
  inventory: ["qty", "status"],
};

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

  const tplToClient = (r) => ({ id: r.id, name: r.name, desc: r.descr, tag: r.tag, tagColor: r.tag_color, prompt: r.prompt_text || "" });
  const tplToDb = (r) => ({ id: r.id, name: r.name, descr: r.desc, tag: r.tag, tag_color: r.tagColor, prompt_text: r.prompt || "" });

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const [bookings, inventory, templates, businesses, workflows] = await Promise.all([
        rest("bookings?select=*&order=created_at.asc"),
        rest("inventory?select=*&order=created_at.asc"),
        rest("ai_templates?select=*&order=created_at.asc"),
        rest("businesses?select=*&order=created_at.asc"),
        rest("workflows?select=*&order=created_at.asc"),
      ]);
      return json(200, { bookings, inventory, templates: templates.map(tplToClient), businesses, workflows });
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { entity, row } = body;
      const table = TABLES[entity];
      if (!table || !row) return json(400, { error: "Unknown entity." });
      const payload = entity === "template" ? tplToDb(row) : row;
      const [inserted] = await rest(table, {
        method: "POST", headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
      return json(201, { row: entity === "template" ? tplToClient(inserted) : inserted });
    }

    if (method === "PATCH") {
      const body = JSON.parse(event.body || "{}");
      const { entity, id, patch } = body;
      const table = TABLES[entity];
      const allowed = PATCHABLE[entity] || [];
      if (!table || !id || !patch) return json(400, { error: "Need entity, id and patch." });
      const clean = {};
      allowed.forEach((k) => { if (k in patch) clean[k] = patch[k]; });
      if (!Object.keys(clean).length) return json(400, { error: "No patchable fields supplied." });
      const [updated] = await rest(`${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH", headers: { Prefer: "return=representation" },
        body: JSON.stringify(clean),
      });
      return json(200, { row: entity === "template" ? tplToClient(updated) : updated });
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
