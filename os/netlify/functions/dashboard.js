/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult OS — Dashboard data API (Netlify serverless function)

   The Dashboard is a LIVE ROLLUP: it aggregates real counts and sums
   from the other modules' tables (customers, leads, tasks, invoices,
   expenses, inventory) plus the activity_log / revenue_monthly tables.
   Reads use the SERVICE ROLE key (server-side only, behind Basic Auth).

     GET → { summary, revenue_monthly, metrics, activity }

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   ═══════════════════════════════════════════════════════════ */

exports.handler = async function () {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return json(500, { error: "Supabase env vars not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." });
  }

  const headers = { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" };
  const rest = async (path) => {
    const res = await fetch(`${url}/rest/v1/${path}`, { headers });
    if (!res.ok) throw new Error(`Supabase ${path} → ${res.status} ${await res.text()}`);
    return res.json();
  };

  // Parse a display amount like "₦4,200,000" → 4200000
  const amt = (v) => Number(String(v == null ? "" : v).replace(/[^\d.]/g, "")) || 0;

  try {
    const [customers, leads, tasks, invoices, expenses, inventory, revenue, activity] = await Promise.all([
      rest("customers?select=id"),
      rest("leads?select=id,stage"),
      rest("tasks?select=id,status"),
      rest("invoices?select=amount,status"),
      rest("expenses?select=amount"),
      rest("inventory?select=qty,reorder"),
      rest("revenue_monthly?select=*&order=sort_order.asc"),
      rest("activity_log?select=*&order=occurred_at.desc&limit=10"),
    ]);

    const income = invoices.reduce((s, i) => s + amt(i.amount), 0);
    const expenseTotal = expenses.reduce((s, e) => s + amt(e.amount), 0);
    const net = income - expenseTotal;

    const activeTasks = tasks.filter((t) => t.status !== "done").length;
    const activeClients = customers.length;
    const pendingInvoices = invoices.filter((i) => i.status !== "paid").length;
    const lowStock = inventory.filter((i) => Number(i.qty) <= Number(i.reorder)).length;

    const summary = {
      total_revenue: income,
      total_income: income,
      expenses: expenseTotal,
      net_profit: net,
      revenue_delta: 0, income_delta: 0, expenses_delta: 0, profit_delta: 0,
      ai_insight: (customers.length || leads.length || tasks.length || invoices.length)
        ? `Live: ${activeClients} clients · ${leads.length} leads · ${activeTasks} open tasks · ${pendingInvoices} pending invoices.`
        : "No data yet — insights will appear once you add real records.",
    };

    const metrics = [
      { sort_order: 1, label: "Active Tasks",     value: String(activeTasks),   delta_pct: 0, direction: "up", accent: "#4A6AFF", display_type: "spark", spark: [0, 0, 0, 0, 0, 0], prog_pct: null },
      { sort_order: 2, label: "Active Clients",   value: String(activeClients), delta_pct: 0, direction: "up", accent: "#1FCFA4", display_type: "prog", spark: null, prog_pct: Math.min(100, activeClients * 10) },
      { sort_order: 3, label: "Pending Invoices", value: String(pendingInvoices), delta_pct: 0, direction: "up", accent: "#F4A21B", display_type: "prog", spark: null, prog_pct: Math.min(100, pendingInvoices * 10) },
      { sort_order: 4, label: "Low Stock Items",  value: String(lowStock),      delta_pct: 0, direction: "up", accent: "#FF4F78", display_type: "prog", spark: null, prog_pct: Math.min(100, lowStock * 10) },
    ];

    return json(200, { summary, revenue_monthly: revenue, metrics, activity });
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
