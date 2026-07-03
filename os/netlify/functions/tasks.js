/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — Tasks (Kanban) data API (Netlify serverless function)

   Backed by Supabase using the SERVICE ROLE key (server-side only,
   behind the Basic Auth edge gate).

     GET   → { tasks: [...] }
     POST  → body = task object                → inserts, returns task
     PATCH → body = { id, ...fields }           → updates fields, returns ok

   Column `descr` maps to client `desc`; `due_iso` maps to `dueISO`.
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

  const toClient = (r) => ({
    id: r.id, title: r.title, desc: r.descr, status: r.status, priority: r.priority,
    due: r.due, dueISO: r.due_iso, assignees: r.assignees, labels: r.labels,
    comments: r.comments, subtasks: r.subtasks,
  });
  const toDb = (t) => {
    const o = {};
    if ("id" in t) o.id = t.id;
    if ("title" in t) o.title = t.title;
    if ("desc" in t) o.descr = t.desc;
    if ("status" in t) o.status = t.status;
    if ("priority" in t) o.priority = t.priority;
    if ("due" in t) o.due = t.due;
    if ("dueISO" in t) o.due_iso = t.dueISO || null;
    if ("assignees" in t) o.assignees = t.assignees;
    if ("labels" in t) o.labels = t.labels;
    if ("comments" in t) o.comments = t.comments;
    if ("subtasks" in t) o.subtasks = t.subtasks;
    return o;
  };

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const rows = await rest("tasks?select=*&order=created_at.asc");
      return json(200, { tasks: rows.map(toClient) });
    }

    if (method === "POST") {
      const task = JSON.parse(event.body || "{}");
      const [inserted] = await rest("tasks", {
        method: "POST", headers: { Prefer: "return=representation" },
        body: JSON.stringify(toDb(task)),
      });
      return json(201, { task: toClient(inserted) });
    }

    if (method === "PATCH") {
      const body = JSON.parse(event.body || "{}");
      if (!body.id) return json(400, { error: "Missing id." });
      const { id, ...fields } = body;
      await rest(`tasks?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH", body: JSON.stringify(toDb(fields)),
      });
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
