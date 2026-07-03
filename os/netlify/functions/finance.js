/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — Finance data API (Netlify serverless function)

   Invoices, expenses, tax records — backed by Supabase using the
   SERVICE ROLE key (server-side only, behind the Basic Auth edge gate).

     GET  → { invoices: [...], expenses: [...], tax: [...] }
     POST → body { entity: 'invoice'|'expense'|'tax', row: {...} } → inserts

   Expense column `icon_bg` maps to client `iconBg`.
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

  const expToClient = (r) => ({ id: r.id, name: r.name, cat: r.cat, amount: r.amount, date: r.date, icon: r.icon, iconBg: r.icon_bg });
  const expToDb = (r) => ({ id: r.id, name: r.name, cat: r.cat, amount: r.amount, date: r.date, icon: r.icon, icon_bg: r.iconBg });

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const [invoices, expenses, tax] = await Promise.all([
        rest("invoices?select=*&order=created_at.desc"),
        rest("expenses?select=*&order=created_at.desc"),
        rest("tax_records?select=*&order=created_at.desc"),
      ]);
      return json(200, { invoices, expenses: expenses.map(expToClient), tax });
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { entity, row } = body;
      const table = { invoice: "invoices", expense: "expenses", tax: "tax_records" }[entity];
      if (!table) return json(400, { error: "Unknown entity." });
      const payload = entity === "expense" ? expToDb(row) : row;
      const [inserted] = await rest(table, {
        method: "POST", headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
      return json(201, { row: entity === "expense" ? expToClient(inserted) : inserted });
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
