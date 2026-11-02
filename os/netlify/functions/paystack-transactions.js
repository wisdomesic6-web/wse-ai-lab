/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult OS — Paystack account-wide transactions (Netlify function)

   "See every transaction, every payment that comes in on our Paystack
   account" — reads directly from Paystack's own API using the company's
   live secret key, so it shows everything that settles through the
   account regardless of which WSE product initiated the charge (the
   per-product push in products.js only knows what each product's own
   backend chose to report; this is the account's own record, independent
   of that).

     GET → { transactions: [{reference, amount, currency, status, channel,
              customerEmail, paidAt, metadata}], totalAmount, count }
           ?status=success|failed|abandoned (default: success)
           ?perPage=<n> (default 50, max 100 — Paystack's own cap)

   Env vars: PAYSTACK_SECRET_KEY (the company's live secret key — set this
   in the Netlify dashboard directly; never commit it, never pass it from
   the client).
   ═══════════════════════════════════════════════════════════ */

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed." });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return json(500, { error: "PAYSTACK_SECRET_KEY not configured on the OS." });
  }

  const qs = event.queryStringParameters || {};
  const status = qs.status || "success";
  const perPage = Math.min(parseInt(qs.perPage, 10) || 50, 100);

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction?status=${encodeURIComponent(status)}&perPage=${perPage}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    );
    const body = await res.json();
    if (!res.ok || !body.status) {
      return json(502, { error: body.message || `Paystack responded ${res.status}` });
    }

    const transactions = (body.data || []).map((t) => ({
      reference: t.reference,
      amount: t.amount / 100, // kobo → naira
      currency: t.currency,
      status: t.status,
      channel: t.channel,
      customerEmail: t.customer?.email || null,
      paidAt: t.paid_at,
      metadata: t.metadata || null,
    }));
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    return json(200, { transactions, totalAmount, count: transactions.length });
  } catch (err) {
    return json(502, { error: String(err.message || err) });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    body: JSON.stringify(body),
  };
}
