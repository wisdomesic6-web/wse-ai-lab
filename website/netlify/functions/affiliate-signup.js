/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate signup (Netlify function)

   POST { fullName, whatsapp, email, password, bankName, accountNumber, accountName }

   Creates a Supabase Auth user (admin API, email pre-confirmed — real
   gating happens via manual staff approval in the OS, not an email link)
   plus the matching `affiliates` row with status 'pending'. No card
   details are collected anywhere — bank transfer details only.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   ═══════════════════════════════════════════════════════════ */

const { authAdmin, rest, clientIp, checkRateLimit, json } = require("../../lib/affiliate-auth");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LEN = 8;
const MAX_SIGNUPS_PER_WINDOW = 6;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const limit = await checkRateLimit(`signup:${clientIp(event)}`, MAX_SIGNUPS_PER_WINDOW);
  if (limit.limited) {
    return json(429, { error: "Too many applications from this connection. Try again later." }, { "Retry-After": String(limit.retryAfterSec) });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return json(400, { error: "Invalid request body." });
  }

  const fullName = String(body.fullName || "").trim();
  const whatsapp = String(body.whatsapp || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const bankName = String(body.bankName || "").trim();
  const accountNumber = String(body.accountNumber || "").trim();
  const accountName = String(body.accountName || "").trim();

  if (!isNonEmptyString(fullName)) return json(400, { error: "Full name is required." });
  if (!isNonEmptyString(whatsapp)) return json(400, { error: "WhatsApp number is required." });
  if (!EMAIL_RE.test(email)) return json(400, { error: "A valid email is required." });
  if (password.length < MIN_PASSWORD_LEN) return json(400, { error: `Password must be at least ${MIN_PASSWORD_LEN} characters.` });
  if (!isNonEmptyString(bankName)) return json(400, { error: "Bank name is required." });
  if (!isNonEmptyString(accountNumber)) return json(400, { error: "Account number is required." });
  if (!isNonEmptyString(accountName)) return json(400, { error: "Account name is required." });

  let user;
  try {
    user = await authAdmin("admin/users", {
      method: "POST",
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
  } catch (err) {
    const msg = String((err && err.message) || err);
    if (/registered|exists/i.test(msg)) return json(409, { error: "An account with this email already exists." });
    return json(500, { error: "Could not create your affiliate account. Please try again." });
  }

  try {
    await rest("affiliates", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        id: user.id,
        full_name: fullName,
        whatsapp_phone: whatsapp,
        email,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        status: "pending",
      }),
    });
  } catch (err) {
    return json(500, { error: "Account created but the application record failed — contact us directly." });
  }

  return json(201, { message: "Application received. We will review it and email you once approved." });
};
