/* Vercel serverless entrypoint → reuses the Netlify affiliate-login handler.
   Requires env vars SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY on the Vercel project. */
const adapt = require("../lib/netlify-adapter.js");
const { handler } = require("../netlify/functions/affiliate-login.js");
module.exports = adapt(handler);
