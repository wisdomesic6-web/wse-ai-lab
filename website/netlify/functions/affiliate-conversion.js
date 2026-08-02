/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate conversion webhook (Netlify function)

   POST { referralCode, externalRef, amount, status, billingPeriod }
   Header: x-webhook-secret: <AFFILIATE_WEBHOOK_SECRET>

   Called by a PRODUCT'S OWN backend when a referred visitor becomes (or
   stays) a paying subscriber, so the affiliate's commission gets tracked.
   Not wired to any real product yet — this is the receiving end only;
   wiring SmartSales (or any other product) to actually call it is
   separate follow-up work in that product's own codebase.

   Not public: requires the shared secret, compared in constant time
   (same reasoning as upload-photo.js's safeEqual) so a timing attack
   can't be used to guess it byte-by-byte.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AFFILIATE_WEBHOOK_SECRET
   ═══════════════════════════════════════════════════════════ */

const crypto = require("crypto");
const { rest, json } = require("../../lib/affiliate-auth");

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const configuredSecret = process.env.AFFILIATE_WEBHOOK_SECRET;
  if (!configuredSecret) return json(500, { error: "Webhook is not configured yet (missing AFFILIATE_WEBHOOK_SECRET)." });

  const provided = event.headers["x-webhook-secret"] || event.headers["X-Webhook-Secret"] || "";
  if (!provided || !safeEqual(provided, configuredSecret)) {
    return json(401, { error: "Invalid webhook secret." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return json(400, { error: "Invalid request body." });
  }

  const referralCode = String(body.referralCode || "").trim();
  const externalRef = body.externalRef ? String(body.externalRef).trim() : null;
  const amount = Number(body.amount);
  const status = ["paid", "refunded", "cancelled"].includes(body.status) ? body.status : "paid";
  const billingPeriod = String(body.billingPeriod || "").trim();

  if (!referralCode) return json(400, { error: "referralCode is required." });
  if (!Number.isFinite(amount) || amount < 0) return json(400, { error: "amount must be a non-negative number." });
  if (!billingPeriod) return json(400, { error: "billingPeriod is required (e.g. 2026-08-01)." });

  const links = await rest(`aff_links?referral_code=eq.${encodeURIComponent(referralCode)}&select=*`);
  const link = links && links[0];
  if (!link) return json(404, { error: "Unknown referral code." });

  const products = await rest(`aff_products?id=eq.${link.product_id}&select=commission_pct`);
  const product = products && products[0];
  if (!product) return json(404, { error: "Referral code's product no longer exists." });

  const commissionAmount = Math.round(amount * (Number(product.commission_pct) / 100) * 100) / 100;

  const [inserted] = await rest("aff_conversions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      aff_link_id: link.id,
      external_ref: externalRef,
      amount,
      commission_amount: commissionAmount,
      status,
      billing_period: billingPeriod,
    }),
  });

  return json(201, { conversion: inserted, commissionAmount });
};
