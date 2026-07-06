/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — Team Members data API (Netlify serverless function)

   The real team roster that feeds task/lead assignee pickers.
   Backed by Supabase using the SERVICE ROLE key (server-side only,
   behind the Basic Auth gate).

     GET    → { members: [...] }
     POST   → body { row: {...} }        → inserts a member, returns it
     DELETE → body { id }                → removes a member

   NOTE: this OS is single-tenant behind one shared password — a "member"
   is a roster entry (name/email/role), not a separate login account.
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

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const members = await rest("team_members?select=*&order=created_at.asc");
      return json(200, { members });
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const row = body.row || {};
      if (!row.id || !row.name) return json(400, { error: "Need id and name." });
      const [inserted] = await rest("team_members", {
        method: "POST", headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      });
      return json(201, { member: inserted });
    }

    if (method === "DELETE") {
      const body = JSON.parse(event.body || "{}");
      if (!body.id) return json(400, { error: "Missing id." });
      await rest(`team_members?id=eq.${encodeURIComponent(body.id)}`, { method: "DELETE" });
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
