/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult OS — Agents data API
   (agent registry, activity logs, monthly expenses)

   Backed by Supabase (service-role, server-side, behind Basic Auth).
     GET → { agents, logs, expenses }

   Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   ═══════════════════════════════════════════════════════════ */

// n8n runs locally (Docker, Wisdom's PC) and is exposed publicly via an existing
// Cloudflare Tunnel at this host — webhook paths must be absolute, since a relative
// path would resolve against the OS's own domain instead of n8n's.
const N8N_PUBLIC_URL = "https://n8n.wseailab.com";

const AGENTS = [
  { name: "WIZZY (GM)", workflowId: "v6joXhejH4wpp4NP", webhookPath: null, schedule: "Weekly Mon 7AM + on demand", role: "General Manager" },
  { name: "Sales Agent", workflowId: "pfHIJWw1QOD0gzf6", webhookPath: N8N_PUBLIC_URL + "/webhook/run-sales", schedule: "Tuesdays 8AM" },
  { name: "Onboarding Agent", workflowId: "fseLr3oMhwcsMLyw", webhookPath: N8N_PUBLIC_URL + "/webhook/onboarding", schedule: "On demand" },
  { name: "Finance — Expense Logger", workflowId: "DyNFDDMW0phEkX5L", webhookPath: N8N_PUBLIC_URL + "/webhook/expense", schedule: "On demand" },
  { name: "Finance — Monthly P&L", workflowId: "TsATLYzBcxGipcOT", webhookPath: N8N_PUBLIC_URL + "/webhook/monthly-pnl", schedule: "End of month" },
  { name: "Finance — Monthly Invoices", workflowId: "R8sqyMi7u7y8rZZo", webhookPath: N8N_PUBLIC_URL + "/webhook/monthly-invoices", schedule: "1st of month 9AM" },
  { name: "Finance — Payment Webhook", workflowId: "AQLSQrOgmWB2nU0C", webhookPath: N8N_PUBLIC_URL + "/webhook/paystack-webhook", schedule: "On payment" },
  { name: "Finance — Email Receipt Reader", workflowId: "FdxQSyCy3BOPUl0W", webhookPath: N8N_PUBLIC_URL + "/webhook/receipt-reader", schedule: "Daily 8AM" },
  { name: "Operations Agent", workflowId: "iLz3u6j5UJUFHh0t", webhookPath: N8N_PUBLIC_URL + "/webhook/briefing", schedule: "Mon 7AM / Daily midnight" },
  { name: "PostPilot (Content Engine)", workflowId: "u4aWSpDm2ogGf3j9", webhookPath: null, schedule: "Daily" },
  { name: "Product Sync Agent", workflowId: "Qkjuz4zzSPF3SrOX", webhookPath: N8N_PUBLIC_URL + "/webhook/product-sync", schedule: "Every 6 hours" },
  { name: "Telegram Bot", workflowId: "LoHIvLTlYZwD8NsC", webhookPath: null, schedule: "Every 30s (polling)" },
];

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
    if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed." });

    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const [logs, expenses] = await Promise.all([
      rest("agent_logs?select=*&order=run_at.desc&limit=30"),
      rest(`agent_expenses?select=*&expense_date=gte.${monthStart}&order=expense_date.desc`),
    ]);

    return json(200, { agents: AGENTS, logs, expenses });
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
