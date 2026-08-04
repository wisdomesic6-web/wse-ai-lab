/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate portal: shared Supabase + session helper

   Mirrors the rest() pattern already used in os/netlify/functions/crm.js
   (plain fetch against the Supabase REST API with the service-role key —
   no SDK dependency), plus a thin wrapper around Supabase Auth (GoTrue)
   for affiliate accounts, and a small rate-limit helper backed by the
   `rate_limits` table (same reasoning as website/api/upload-photo.js's
   Blob-based limiter: not a distributed lock, just enough to stop a
   scripted guesser).

   Every affiliate identity comes from verifying the session cookie
   against Supabase Auth — callers never trust a client-supplied id.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
   ═══════════════════════════════════════════════════════════ */

const SESSION_COOKIE = "wse_aff_sess";
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} not configured`);
  return value;
}

async function rest(path, init = {}) {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

async function authAdmin(path, init = {}) {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(`${url}/auth/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new AuthError(data, res.status);
  return data;
}

async function authPublic(path, init = {}) {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_ANON_KEY");
  const res = await fetch(`${url}/auth/v1/${path}`, {
    ...init,
    headers: { apikey: key, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new AuthError(data, res.status);
  return data;
}

class AuthError extends Error {
  constructor(data, status) {
    super((data && (data.msg || data.error_description || data.error)) || `Auth request failed (${status})`);
    this.status = status;
  }
}

function parseCookies(header) {
  const out = {};
  String(header || "")
    .split(";")
    .forEach((part) => {
      const idx = part.indexOf("=");
      if (idx === -1) return;
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      if (k) {
        try {
          out[k] = decodeURIComponent(v);
        } catch (err) {
          out[k] = v;
        }
      }
    });
  return out;
}

function sessionCookie(accessToken, maxAgeSeconds) {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(accessToken)}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
  ].join("; ");
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

// Verifies the session cookie against Supabase Auth, then loads the
// matching affiliate row. Returns null on any failure — callers should
// treat that as "not logged in", never fall back to a client-supplied id.
async function requireAffiliate(event) {
  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  let user;
  try {
    user = await authPublic("user", { headers: { Authorization: `Bearer ${token}` } });
  } catch (err) {
    return null;
  }
  if (!user || !user.id) return null;

  const rows = await rest(`affiliates?id=eq.${user.id}&select=*`);
  if (!rows || !rows.length) return null;
  return rows[0];
}

function clientIp(event) {
  const fwd = (event.headers["x-forwarded-for"] || event.headers["X-Forwarded-For"] || "").split(",")[0].trim();
  return fwd || "unknown";
}

// Simple fixed-window rate limiter backed by the `rate_limits` table.
// Not atomic under heavy concurrency (same caveat as the upload-photo
// Blob limiter) — good enough to stop a scripted guesser, which is the
// actual threat model for signup/login on a small affiliate portal.
async function checkRateLimit(key, maxAttempts) {
  const rows = await rest(`rate_limits?key=eq.${encodeURIComponent(key)}&select=*`);
  const now = Date.now();
  const existing = rows && rows[0];

  if (!existing || now - new Date(existing.window_start).getTime() > RATE_LIMIT_WINDOW_MS) {
    await rest("rate_limits", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ key, count: 1, window_start: new Date(now).toISOString() }),
    });
    return { limited: false };
  }

  if (existing.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((new Date(existing.window_start).getTime() + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSec };
  }

  await rest(`rate_limits?key=eq.${encodeURIComponent(key)}`, {
    method: "PATCH",
    body: JSON.stringify({ count: existing.count + 1 }),
  });
  return { limited: false };
}

// Performance tiers: an affiliate's commission rate is based on their
// CURRENT count of active (status='paid', latest billing_period) distinct
// referred customers, combined across every product they promote — not a
// lifetime total, so the rate moves up or down as that count changes.
// "Distinct customer" = one (aff_link_id, external_ref) pair; this is why
// affiliate-conversion.js requires externalRef rather than treating it as
// optional metadata.
async function getAffiliateTierRate(affiliateId) {
  const rows = await rest(
    `aff_conversions?select=aff_link_id,external_ref,billing_period,status,aff_links!inner(affiliate_id)` +
      `&aff_links.affiliate_id=eq.${affiliateId}&order=billing_period.desc`
  );

  const latestStatusByCustomer = new Map();
  for (const row of rows || []) {
    const key = `${row.aff_link_id}|${row.external_ref}`;
    if (!latestStatusByCustomer.has(key)) latestStatusByCustomer.set(key, row.status);
  }
  const activeCount = [...latestStatusByCustomer.values()].filter((status) => status === "paid").length;

  const tiers = await rest("aff_tiers?select=*&order=min_conversions.asc");
  if (!tiers || !tiers.length) throw new Error("No commission tiers configured");

  const matched =
    tiers.find((t) => activeCount >= t.min_conversions && (t.max_conversions === null || activeCount <= t.max_conversions)) ||
    tiers[0];
  const nextTier = tiers[tiers.indexOf(matched) + 1] || null;

  return {
    activeCount,
    commissionPct: Number(matched.commission_pct),
    tierMin: matched.min_conversions,
    tierMax: matched.max_conversions,
    nextThreshold: nextTier ? nextTier.min_conversions : null,
    nextCommissionPct: nextTier ? Number(nextTier.commission_pct) : null,
  };
}

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  };
}

module.exports = {
  rest,
  authAdmin,
  authPublic,
  parseCookies,
  sessionCookie,
  clearSessionCookie,
  requireAffiliate,
  clientIp,
  checkRateLimit,
  getAffiliateTierRate,
  json,
  SESSION_COOKIE,
};
