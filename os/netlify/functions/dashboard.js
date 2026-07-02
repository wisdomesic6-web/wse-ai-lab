/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — Dashboard data API (Netlify serverless function)

   Reads the Dashboard tables from Supabase using the SERVICE ROLE key,
   which stays server-side and never reaches the browser. The whole OS
   (this function included) sits behind the Basic Auth edge gate.

   Env vars (set in Netlify → OS site → Environment variables):
     SUPABASE_URL               e.g. https://xxxx.supabase.co
     SUPABASE_SERVICE_ROLE_KEY  service_role key (Project Settings → API)
   ═══════════════════════════════════════════════════════════ */

exports.handler = async function () {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return json(500, {
      error: "Supabase env vars not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    });
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  };

  // PostgREST helper
  const rest = async (path) => {
    const res = await fetch(`${url}/rest/v1/${path}`, { headers });
    if (!res.ok) {
      throw new Error(`Supabase ${path} → ${res.status} ${await res.text()}`);
    }
    return res.json();
  };

  try {
    const [summaryRows, revenue, metrics, activity] = await Promise.all([
      rest("dashboard_summary?id=eq.1&select=*"),
      rest("revenue_monthly?select=*&order=sort_order.asc"),
      rest("dashboard_metrics?select=*&order=sort_order.asc"),
      rest("activity_log?select=*&order=occurred_at.desc&limit=10"),
    ]);

    return json(200, {
      summary: summaryRows[0] || null,
      revenue_monthly: revenue,
      metrics,
      activity,
    });
  } catch (err) {
    return json(502, { error: String(err.message || err) });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
  };
}
