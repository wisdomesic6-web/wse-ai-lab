/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate picks a product (Netlify function)

   POST { slug } → for an APPROVED affiliate, creates (or returns the
   existing) unique referral code + link for that affiliate × product
   pair. Only approved affiliates can generate links — pending/rejected
   affiliates are blocked here even with a valid session.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
   ═══════════════════════════════════════════════════════════ */

const crypto = require("crypto");
const { rest, requireAffiliate, json } = require("../../lib/affiliate-auth");

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O, 1/I
const CODE_LEN = 6;
const MAX_RETRIES = 4;
const REDIRECT_BASE = "https://wseailab.com/r";

function generateCode() {
  const bytes = crypto.randomBytes(CODE_LEN);
  let out = "";
  for (let i = 0; i < CODE_LEN; i++) out += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  return out;
}

function formatLink(link, product) {
  return {
    slug: product.slug,
    name: product.name,
    referralCode: link.referral_code,
    referralLink: `${REDIRECT_BASE}/${link.referral_code}`,
    clicks: link.clicks,
  };
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const affiliate = await requireAffiliate(event);
  if (!affiliate) return json(401, { error: "Not signed in." });
  if (affiliate.status !== "approved") return json(403, { error: "Your application is not yet approved." });

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return json(400, { error: "Invalid request body." });
  }
  const slug = String(body.slug || "").trim();
  if (!slug) return json(400, { error: "Product slug is required." });

  const products = await rest(`aff_products?slug=eq.${encodeURIComponent(slug)}&status=eq.live&select=*`);
  const product = products && products[0];
  if (!product) return json(404, { error: "Unknown or unavailable product." });

  const existingLinks = await rest(`aff_links?affiliate_id=eq.${affiliate.id}&product_id=eq.${product.id}&select=*`);
  if (existingLinks && existingLinks.length) {
    return json(200, formatLink(existingLinks[0], product));
  }

  let inserted = null;
  for (let attempt = 0; attempt < MAX_RETRIES && !inserted; attempt++) {
    const code = `${product.slug.toUpperCase()}-${generateCode()}`;
    try {
      const rows = await rest("aff_links", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ affiliate_id: affiliate.id, product_id: product.id, referral_code: code }),
      });
      inserted = rows[0];
    } catch (err) {
      if (!/duplicate key|already exists|23505/i.test(String((err && err.message) || err))) throw err;
    }
  }
  if (!inserted) return json(500, { error: "Could not generate a unique referral code — please try again." });

  return json(201, formatLink(inserted, product));
};
