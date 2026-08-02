/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate logout (Netlify function)
   POST → clears the session cookie. No Supabase call needed.
   ═══════════════════════════════════════════════════════════ */

const { clearSessionCookie, json } = require("../../lib/affiliate-auth");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  return json(200, { message: "Logged out." }, { "Set-Cookie": clearSessionCookie() });
};
