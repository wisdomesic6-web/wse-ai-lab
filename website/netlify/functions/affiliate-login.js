/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate login (Netlify function)

   POST { email, password } → verifies against Supabase Auth, sets the
   session as an httpOnly cookie (never exposed to client JS), and
   returns the affiliate's own profile (including approval status) so
   the dashboard can immediately show a pending/rejected state without
   a second round trip.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
   ═══════════════════════════════════════════════════════════ */

const { authPublic, rest, sessionCookie, clientIp, checkRateLimit, json } = require("../../lib/affiliate-auth");

const MAX_LOGIN_ATTEMPTS = 8;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return json(400, { error: "Invalid request body." });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !password) return json(400, { error: "Email and password are required." });

  const limit = await checkRateLimit(`login:${clientIp(event)}:${email}`, MAX_LOGIN_ATTEMPTS);
  if (limit.limited) {
    return json(429, { error: "Too many login attempts. Try again later." }, { "Retry-After": String(limit.retryAfterSec) });
  }

  let session;
  try {
    session = await authPublic("token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    return json(401, { error: "Incorrect email or password." });
  }

  const rows = await rest(`affiliates?id=eq.${session.user.id}&select=*`);
  const affiliate = rows && rows[0];
  if (!affiliate) return json(404, { error: "No affiliate profile found for this account." });

  // last_login_at is updated by affiliate-me.js, which the dashboard calls
  // immediately after login on every page load — one place for that write.
  const cookie = sessionCookie(session.access_token, session.expires_in || 3600);
  return json(
    200,
    {
      status: affiliate.status,
      fullName: affiliate.full_name,
      email: affiliate.email,
    },
    { "Set-Cookie": cookie }
  );
};
