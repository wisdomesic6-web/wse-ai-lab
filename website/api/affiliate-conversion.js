/* Vercel serverless entrypoint → reuses the Netlify affiliate-conversion handler.
   Requires env vars SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AFFILIATE_WEBHOOK_SECRET on the Vercel project. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/affiliate-conversion.js");
module.exports = adapt(handler);
