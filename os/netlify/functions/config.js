/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — App settings + config status (Netlify function)

   GET  → { settings: {...}, status: { <envVar>: bool, ... } }
          settings = editable profile/workspace/notifications/appearance
          status   = which secret env vars are present (booleans only —
                     secret VALUES are never returned to the browser)
   POST → body = partial settings object → upserts the single row

   Secrets (Supabase/Anthropic/Paystack keys, OS password) are managed in
   Netlify env vars, not here. This endpoint only reports whether they exist.
   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   ═══════════════════════════════════════════════════════════ */

exports.handler = async function (event) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const status = {
    supabase_url: !!process.env.SUPABASE_URL,
    supabase_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    os_password: !!process.env.OS_PASSWORD,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    paystack: !!(process.env.PAYSTACK_SECRET || process.env.PAYSTACK_SECRET_KEY),
  };

  if (!url || !key) {
    // Still report status so the Settings page can show what's missing.
    return json(event.httpMethod === "GET" ? 200 : 500, {
      settings: null, status,
      error: event.httpMethod === "GET" ? undefined : "Supabase env vars not configured.",
    });
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

  const ALLOWED = ["first_name", "last_name", "email", "phone", "location",
    "company_name", "business_type", "country", "website", "notifications", "appearance", "ai_config"];

  try {
    if (event.httpMethod === "GET") {
      const rows = await rest("app_settings?id=eq.1&select=*");
      return json(200, { settings: rows[0] || null, status });
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const patch = { id: 1, updated_at: new Date().toISOString() };
      ALLOWED.forEach((k) => { if (k in body) patch[k] = body[k]; });
      const [row] = await rest("app_settings", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(patch),
      });
      return json(200, { settings: row, status });
    }

    return json(405, { error: "Method not allowed." });
  } catch (err) {
    return json(502, { error: String(err.message || err), status });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    body: JSON.stringify(body),
  };
}
