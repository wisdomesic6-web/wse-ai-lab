/* Vercel serverless entrypoint → reuses the Netlify affiliate-signup handler.
   Requires env vars SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY on the Vercel project. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/affiliate-signup.js");
module.exports = adapt(handler);
