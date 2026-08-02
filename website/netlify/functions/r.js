/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Referral click redirect (Netlify function)

   GET /r/:code (routed via netlify.toml / vercel.json rewrites into
   ?code=:code) → looks up the referral code, best-effort increments its
   click count, and 302-redirects to the product's URL with ?ref=CODE
   appended so that product's own backend can capture attribution if it
   chooses to. Unknown/expired codes redirect to the homepage instead of
   erroring — this is a public, unauthenticated endpoint by design.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   ═══════════════════════════════════════════════════════════ */

const { rest } = require("../../lib/affiliate-auth");

const FALLBACK_URL = "https://wseailab.com/";

function redirect(location) {
  return { statusCode: 302, headers: { Location: location }, body: "" };
}

exports.handler = async function (event) {
  const code = String((event.queryStringParameters && event.queryStringParameters.code) || "").trim();
  if (!code) return redirect(FALLBACK_URL);

  let links;
  try {
    links = await rest(`aff_links?referral_code=eq.${encodeURIComponent(code)}&select=*`);
  } catch (err) {
    return redirect(FALLBACK_URL);
  }
  const link = links && links[0];
  if (!link) return redirect(FALLBACK_URL);

  let products;
  try {
    products = await rest(`aff_products?id=eq.${link.product_id}&select=*`);
  } catch (err) {
    return redirect(FALLBACK_URL);
  }
  const product = products && products[0];
  if (!product || !product.product_url) return redirect(FALLBACK_URL);

  // Best-effort click count, not atomic under concurrent hits — same
  // tolerance already documented for the rate-limit table. Conversions
  // (the number that actually drives payouts) live in aff_conversions
  // and aren't affected by this.
  rest(`aff_links?id=eq.${link.id}`, {
    method: "PATCH",
    body: JSON.stringify({ clicks: link.clicks + 1 }),
  }).catch(() => {});

  const separator = product.product_url.includes("?") ? "&" : "?";
  return redirect(`${product.product_url}${separator}ref=${encodeURIComponent(code)}`);
};
