/* ═══════════════════════════════════════════════════════════
   WSE Labs OS — AI Engine (Netlify function)

   POST → body { prompt, system?, model?, max_tokens?, temperature?, template? }
          → calls Anthropic Messages API, logs usage to ai_usage,
          → returns { text, model, usage }
   GET  → usage stats for the AI Engine page:
          { calls_30d, cost_30d, daily: [{day,label,count} x7] }

   Env vars: ANTHROPIC_API_KEY (required for POST),
             SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (usage logging/stats)
   ═══════════════════════════════════════════════════════════ */

const MODELS = {
  "claude-sonnet-4-6": { input: 3, output: 15 },   // $ per 1M tokens
  "claude-haiku-4-5": { input: 1, output: 5 },
};
const DEFAULT_MODEL = "claude-sonnet-4-6";
const MAX_PROMPT_CHARS = 20000;
const MAX_OUTPUT_TOKENS = 4096;

exports.handler = async function (event) {
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const rest = async (path, init = {}) => {
    if (!supaUrl || !supaKey) return null;
    const res = await fetch(`${supaUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: supaKey, Authorization: `Bearer ${supaKey}`,
        "Content-Type": "application/json", Accept: "application/json",
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Supabase ${path} → ${res.status} ${text}`);
    return text ? JSON.parse(text) : null;
  };

  try {
    if (event.httpMethod === "GET") return json(200, await usageStats(rest));
    if (event.httpMethod === "POST") return await runPrompt(event, rest);
    return json(405, { error: "Method not allowed." });
  } catch (err) {
    return json(502, { error: String(err.message || err) });
  }
};

async function runPrompt(event, rest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(500, { error: "ANTHROPIC_API_KEY is not configured on this site. Add it in Netlify → Site configuration → Environment variables, then redeploy." });
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Invalid JSON body." }); }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) return json(400, { error: "Missing prompt." });
  if (prompt.length > MAX_PROMPT_CHARS) return json(400, { error: `Prompt too long (max ${MAX_PROMPT_CHARS} characters).` });

  const model = MODELS[body.model] ? body.model : DEFAULT_MODEL;
  const maxTokens = clamp(parseInt(body.max_tokens, 10) || 1000, 64, MAX_OUTPUT_TOKENS);
  const temperature = clamp(parseFloat(body.temperature), 0, 1);
  const system = typeof body.system === "string" && body.system.trim()
    ? body.system.trim().slice(0, MAX_PROMPT_CHARS)
    : "You are the AI engine inside WSE Labs OS, the internal business operating system of WSE AI Lab (Lagos, Nigeria). Be direct, practical, and concise. Format output so it is ready to use.";

  const payload = { model, max_tokens: maxTokens, system, messages: [{ role: "user", content: prompt }] };
  if (!Number.isNaN(temperature)) payload.temperature = temperature;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) return json(res.status, { error: (data.error && data.error.message) || "Anthropic API error" });

  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const usage = data.usage || {};

  // Best-effort usage logging — never fail the request over it.
  try {
    await rest("ai_usage", {
      method: "POST",
      body: JSON.stringify({
        model,
        input_tokens: usage.input_tokens || 0,
        output_tokens: usage.output_tokens || 0,
        template: typeof body.template === "string" ? body.template.slice(0, 120) : "",
      }),
    });
  } catch (e) { console.warn("[ai] usage log failed:", e.message); }

  return json(200, { text, model, usage: { input_tokens: usage.input_tokens || 0, output_tokens: usage.output_tokens || 0 } });
}

async function usageStats(rest) {
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  let rows = [];
  try {
    rows = (await rest(`ai_usage?select=model,input_tokens,output_tokens,created_at&created_at=gte.${since}&order=created_at.asc&limit=5000`)) || [];
  } catch (e) { console.warn("[ai] stats unavailable:", e.message); }

  let cost = 0;
  rows.forEach((r) => {
    const p = MODELS[r.model] || MODELS[DEFAULT_MODEL];
    cost += (r.input_tokens || 0) * p.input / 1e6 + (r.output_tokens || 0) * p.output / 1e6;
  });

  const DAY = 24 * 3600 * 1000;
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daily = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(new Date().setHours(0, 0, 0, 0) - i * DAY);
    const dayEnd = new Date(dayStart.getTime() + DAY);
    daily.push({
      day: dayStart.toISOString().slice(0, 10),
      label: labels[dayStart.getDay()],
      count: rows.filter((r) => { const t = new Date(r.created_at); return t >= dayStart && t < dayEnd; }).length,
    });
  }

  return { calls_30d: rows.length, cost_30d: Math.round(cost * 100) / 100, daily, anthropic_configured: !!process.env.ANTHROPIC_API_KEY };
}

function clamp(n, min, max) { return Number.isNaN(n) ? NaN : Math.min(max, Math.max(min, n)); }

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    body: JSON.stringify(body),
  };
}
