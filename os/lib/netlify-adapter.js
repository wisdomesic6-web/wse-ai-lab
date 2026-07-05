/* ═══════════════════════════════════════════════════════════
   Netlify → Vercel function adapter

   Wraps a Netlify-style handler ( exports.handler = async (event) =>
   ({ statusCode, headers, body }) ) so it runs unchanged as a Vercel
   Node serverless function ( module.exports = (req, res) => ... ).

   This lets the same function source deploy to BOTH Netlify and Vercel.
   ═══════════════════════════════════════════════════════════ */

module.exports = function adapt(handler) {
  return async function (req, res) {
    const event = {
      httpMethod: req.method,
      headers: req.headers || {},
      queryStringParameters: req.query || {},
      // Vercel pre-parses JSON bodies to an object; Netlify handlers expect a string.
      body: req.body == null ? "" : (typeof req.body === "string" ? req.body : JSON.stringify(req.body)),
    };

    let result;
    try {
      result = await handler(event);
    } catch (err) {
      res.status(500).json({ error: String((err && err.message) || err) });
      return;
    }

    const headers = (result && result.headers) || {};
    for (const k of Object.keys(headers)) res.setHeader(k, headers[k]);
    res.status((result && result.statusCode) || 200).send(result ? result.body : "");
  };
};
