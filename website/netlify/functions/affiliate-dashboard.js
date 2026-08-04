/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Affiliate dashboard data (Netlify function)

   GET → the signed-in affiliate's chosen products (with referral link,
   code, clicks, conversions, commission earned), running commission
   totals, and payout history. "Pending" commission is a running balance
   (total earned on paid conversions minus what's already been paid out),
   matching the SmartSale affiliate terms' "rolls over until paid" model
   — v1 has no per-payout conversion linking, just a running balance.

   Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
   ═══════════════════════════════════════════════════════════ */

const { rest, requireAffiliate, getAffiliateTierRate, json } = require("../../lib/affiliate-auth");

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  const affiliate = await requireAffiliate(event);
  if (!affiliate) return json(401, { error: "Not signed in." });

  const links = await rest(
    `aff_links?affiliate_id=eq.${affiliate.id}&select=id,referral_code,clicks,created_at,aff_products(slug,name,logo_url,description,guide)`
  );

  let conversions = [];
  if (links.length) {
    const linkIds = links.map((l) => l.id).join(",");
    conversions = await rest(`aff_conversions?aff_link_id=in.(${linkIds})&select=*`);
  }

  const payouts = await rest(`aff_payouts?affiliate_id=eq.${affiliate.id}&select=*&order=created_at.desc`);
  const tier = await getAffiliateTierRate(affiliate.id);

  const products = links.map((l) => {
    const paidConversions = conversions.filter((c) => c.aff_link_id === l.id && c.status === "paid");
    return {
      slug: l.aff_products.slug,
      name: l.aff_products.name,
      logoUrl: l.aff_products.logo_url,
      description: l.aff_products.description,
      guide: l.aff_products.guide,
      referralCode: l.referral_code,
      referralLink: `https://wseailab.com/r/${l.referral_code}`,
      clicks: l.clicks,
      conversions: paidConversions.length,
      commissionEarned: paidConversions.reduce((sum, c) => sum + Number(c.commission_amount), 0),
    };
  });

  const totalEarned = conversions.filter((c) => c.status === "paid").reduce((sum, c) => sum + Number(c.commission_amount), 0);
  const totalPaidOut = payouts.filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingCommission = Math.max(0, totalEarned - totalPaidOut);

  return json(200, {
    products,
    totals: { totalEarned, totalPaidOut, pendingCommission },
    payouts: payouts.map((p) => ({ amount: p.amount, periodCovered: p.period_covered, status: p.status, paidAt: p.paid_at })),
    tier: {
      activeCustomers: tier.activeCount,
      commissionPct: tier.commissionPct,
      nextThreshold: tier.nextThreshold,
      nextCommissionPct: tier.nextCommissionPct,
    },
  });
};
